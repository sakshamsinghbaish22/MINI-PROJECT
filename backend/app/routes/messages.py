from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.database import get_collection, parse_object_id, format_doc
from app.models.message import MessageCreate, MessageResponse, ConversationSummary
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/messages", tags=["Messages"])

@router.get("/conversations", response_model=List[ConversationSummary])
async def get_conversations(current_user: dict = Depends(get_current_user)):
    messages_col = get_collection("messages")
    users_col = get_collection("users")
    books_col = get_collection("books")
    current_id = current_user["id"]

    # Find all messages involving the current user
    cursor = messages_col.find({
        "$or": [{"sender_id": current_id}, {"receiver_id": current_id}]
    }).sort("created_at", -1)

    conversations_map = {}
    
    async for msg in cursor:
        other_id = msg["receiver_id"] if msg["sender_id"] == current_id else msg["sender_id"]
        key = other_id

        if key not in conversations_map:
            conversations_map[key] = {
                "other_user_id": other_id,
                "last_message": msg.get("message", ""),
                "last_message_time": msg.get("created_at", datetime.now(timezone.utc)),
                "unread_count": 0,
                "book_id": msg.get("book_id"),
            }

        # Count unread messages received by current user
        if msg["receiver_id"] == current_id and not msg.get("read", False):
            conversations_map[key]["unread_count"] += 1

    result = []
    for other_id, conv in conversations_map.items():
        # Populate other user details
        other_user_obj = parse_object_id(other_id)
        if other_user_obj:
            other_user = await users_col.find_one({"_id": other_user_obj})
            if other_user:
                conv["other_user_name"] = other_user.get("name", "Student")
                conv["other_user_avatar"] = other_user.get("profile_image")
                conv["other_user_college"] = other_user.get("college", "Campus")
            else:
                conv["other_user_name"] = "Student"
                conv["other_user_avatar"] = None
                conv["other_user_college"] = "Campus"
        else:
            conv["other_user_name"] = "Student"

        # Populate book details if linked
        if conv.get("book_id"):
            book_obj = parse_object_id(conv["book_id"])
            if book_obj:
                book = await books_col.find_one({"_id": book_obj})
                if book:
                    conv["book_title"] = book.get("title")
                    images = book.get("images", [])
                    conv["book_image"] = images[0] if images else None

        result.append(ConversationSummary(**conv))

    result.sort(key=lambda x: x.last_message_time, reverse=True)
    return result

@router.get("/thread/{other_user_id}", response_model=List[MessageResponse])
async def get_message_thread(
    other_user_id: str,
    book_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    messages_col = get_collection("messages")
    users_col = get_collection("users")
    books_col = get_collection("books")
    current_id = current_user["id"]

    query = {
        "$or": [
            {"sender_id": current_id, "receiver_id": other_user_id},
            {"sender_id": other_user_id, "receiver_id": current_id}
        ]
    }
    if book_id:
        query["book_id"] = book_id

    # Mark all incoming messages from this user as read
    await messages_col.update_many(
        {"sender_id": other_user_id, "receiver_id": current_id, "read": False},
        {"$set": {"read": True}}
    )

    cursor = messages_col.find(query).sort("created_at", 1)
    
    # Pre-fetch other user
    other_user_obj = parse_object_id(other_user_id)
    other_user = await users_col.find_one({"_id": other_user_obj}) if other_user_obj else None

    # Pre-fetch book if known
    book_doc = None
    if book_id:
        book_obj = parse_object_id(book_id)
        if book_obj:
            book_doc = await books_col.find_one({"_id": book_obj})

    thread = []
    async for msg in cursor:
        msg_dict = format_doc(msg)
        is_sender_me = msg_dict["sender_id"] == current_id
        
        msg_dict["sender_name"] = current_user["name"] if is_sender_me else (other_user.get("name", "Student") if other_user else "Student")
        msg_dict["sender_avatar"] = current_user.get("profile_image") if is_sender_me else (other_user.get("profile_image") if other_user else None)
        msg_dict["receiver_name"] = (other_user.get("name", "Student") if other_user else "Student") if is_sender_me else current_user["name"]
        msg_dict["receiver_avatar"] = (other_user.get("profile_image") if other_user else None) if is_sender_me else current_user.get("profile_image")

        if msg_dict.get("book_id"):
            if book_doc and str(book_doc.get("_id")) == msg_dict["book_id"]:
                msg_dict["book_title"] = book_doc.get("title")
            else:
                b_obj = parse_object_id(msg_dict["book_id"])
                if b_obj:
                    b_item = await books_col.find_one({"_id": b_obj})
                    if b_item:
                        msg_dict["book_title"] = b_item.get("title")

        thread.append(MessageResponse(**msg_dict))

    return thread

@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    msg_in: MessageCreate,
    current_user: dict = Depends(get_current_user)
):
    messages_col = get_collection("messages")
    users_col = get_collection("users")
    books_col = get_collection("books")

    receiver_obj = parse_object_id(msg_in.receiver_id)
    if not receiver_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receiver user not found")
        
    receiver = await users_col.find_one({"_id": receiver_obj})
    if not receiver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receiver user not found")

    book_title = None
    if msg_in.book_id:
        b_obj = parse_object_id(msg_in.book_id)
        if b_obj:
            b_item = await books_col.find_one({"_id": b_obj})
            if b_item:
                book_title = b_item.get("title")

    now = datetime.now(timezone.utc)
    new_msg = {
        "sender_id": current_user["id"],
        "receiver_id": msg_in.receiver_id,
        "book_id": msg_in.book_id,
        "message": msg_in.message.strip(),
        "read": False,
        "created_at": now
    }
    res = await messages_col.insert_one(new_msg)
    created_msg = await messages_col.find_one({"_id": res.inserted_id})
    
    msg_dict = format_doc(created_msg)
    msg_dict["sender_name"] = current_user["name"]
    msg_dict["sender_avatar"] = current_user.get("profile_image")
    msg_dict["receiver_name"] = receiver.get("name", "Student")
    msg_dict["receiver_avatar"] = receiver.get("profile_image")
    msg_dict["book_title"] = book_title

    return MessageResponse(**msg_dict)

@router.get("/unread-count")
async def get_unread_count(current_user: dict = Depends(get_current_user)):
    messages_col = get_collection("messages")
    count = await messages_col.count_documents({"receiver_id": current_user["id"], "read": False})
    return {"unread_count": count}
