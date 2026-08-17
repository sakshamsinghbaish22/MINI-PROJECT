from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_collection, parse_object_id, format_doc
from app.models.transaction import (
    TransactionCreate,
    TransactionUpdateStatus,
    TransactionResponse,
    TransactionType,
    TransactionStatus
)
from app.models.book import BookResponse, BookStatus, BookMode
from app.routes.books import populate_owner_info
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

async def populate_transaction_details(tx_dict: dict, current_user_id: str = None) -> dict:
    if not tx_dict:
        return None
    users_col = get_collection("users")
    books_col = get_collection("books")
    reviews_col = get_collection("reviews")

    # Populate Buyer
    buyer_obj = parse_object_id(tx_dict.get("buyer_id"))
    if buyer_obj:
        buyer = await users_col.find_one({"_id": buyer_obj})
        if buyer:
            tx_dict["buyer_name"] = buyer.get("name", "Student")
            tx_dict["buyer_college"] = buyer.get("college", "Campus")
            tx_dict["buyer_avatar"] = buyer.get("profile_image")

    # Populate Seller
    seller_obj = parse_object_id(tx_dict.get("seller_id"))
    if seller_obj:
        seller = await users_col.find_one({"_id": seller_obj})
        if seller:
            tx_dict["seller_name"] = seller.get("name", "Student")
            tx_dict["seller_college"] = seller.get("college", "Campus")
            tx_dict["seller_avatar"] = seller.get("profile_image")

    # Populate Book
    book_obj = parse_object_id(tx_dict.get("book_id"))
    if book_obj:
        book_doc = await books_col.find_one({"_id": book_obj})
        if book_doc:
            b_dict = format_doc(book_doc)
            b_dict = await populate_owner_info(b_dict)
            tx_dict["book"] = BookResponse(**b_dict)

    # Check if review has been written for this transaction by current user
    if current_user_id:
        rev = await reviews_col.find_one({"transaction_id": tx_dict["id"], "reviewer_id": current_user_id})
        tx_dict["has_reviewed"] = rev is not None
    else:
        tx_dict["has_reviewed"] = False

    return tx_dict

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    tx_in: TransactionCreate,
    current_user: dict = Depends(get_current_user)
):
    books_col = get_collection("books")
    transactions_col = get_collection("transactions")

    book_obj = parse_object_id(tx_in.book_id)
    if not book_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book listing not found")

    book = await books_col.find_one({"_id": book_obj})
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book listing not found")

    if book.get("owner_id") == current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot make a transaction request for your own book listing"
        )

    if book.get("status") not in (BookStatus.AVAILABLE.value, BookStatus.AVAILABLE):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This book is currently {book.get('status')} and not accepting new requests"
        )

    # Check if user already has an active pending request for this book
    existing = await transactions_col.find_one({
        "book_id": tx_in.book_id,
        "buyer_id": current_user["id"],
        "status": TransactionStatus.PENDING.value
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending request for this book"
        )

    now = datetime.now(timezone.utc)
    new_tx = {
        "book_id": tx_in.book_id,
        "buyer_id": current_user["id"],
        "seller_id": book.get("owner_id"),
        "type": tx_in.type.value,
        "status": TransactionStatus.PENDING.value,
        "message": tx_in.message.strip() if tx_in.message else None,
        "created_at": now,
        "updated_at": now
    }

    res = await transactions_col.insert_one(new_tx)
    created_tx = await transactions_col.find_one({"_id": res.inserted_id})
    formatted = format_doc(created_tx)
    populated = await populate_transaction_details(formatted, current_user["id"])
    return TransactionResponse(**populated)

@router.get("/incoming", response_model=List[TransactionResponse])
async def get_incoming_transactions(current_user: dict = Depends(get_current_user)):
    transactions_col = get_collection("transactions")
    cursor = transactions_col.find({"seller_id": current_user["id"]}).sort("created_at", -1)
    
    results = []
    async for doc in cursor:
        formatted = format_doc(doc)
        populated = await populate_transaction_details(formatted, current_user["id"])
        results.append(TransactionResponse(**populated))
    return results

@router.get("/outgoing", response_model=List[TransactionResponse])
async def get_outgoing_transactions(current_user: dict = Depends(get_current_user)):
    transactions_col = get_collection("transactions")
    cursor = transactions_col.find({"buyer_id": current_user["id"]}).sort("created_at", -1)
    
    results = []
    async for doc in cursor:
        formatted = format_doc(doc)
        populated = await populate_transaction_details(formatted, current_user["id"])
        results.append(TransactionResponse(**populated))
    return results

@router.get("", response_model=List[TransactionResponse])
async def get_all_my_transactions(current_user: dict = Depends(get_current_user)):
    transactions_col = get_collection("transactions")
    cursor = transactions_col.find({
        "$or": [{"buyer_id": current_user["id"]}, {"seller_id": current_user["id"]}]
    }).sort("created_at", -1)
    
    results = []
    async for doc in cursor:
        formatted = format_doc(doc)
        populated = await populate_transaction_details(formatted, current_user["id"])
        results.append(TransactionResponse(**populated))
    return results

@router.get("/{tx_id}", response_model=TransactionResponse)
async def get_transaction_by_id(
    tx_id: str,
    current_user: dict = Depends(get_current_user)
):
    transactions_col = get_collection("transactions")
    obj_id = parse_object_id(tx_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    doc = await transactions_col.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    if doc.get("buyer_id") != current_user["id"] and doc.get("seller_id") != current_user["id"] and current_user.get("role") != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access forbidden")

    formatted = format_doc(doc)
    populated = await populate_transaction_details(formatted, current_user["id"])
    return TransactionResponse(**populated)

@router.put("/{tx_id}/status", response_model=TransactionResponse)
async def update_transaction_status(
    tx_id: str,
    status_update: TransactionUpdateStatus,
    current_user: dict = Depends(get_current_user)
):
    transactions_col = get_collection("transactions")
    books_col = get_collection("books")

    obj_id = parse_object_id(tx_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    tx = await transactions_col.find_one({"_id": obj_id})
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    is_buyer = tx.get("buyer_id") == current_user["id"]
    is_seller = tx.get("seller_id") == current_user["id"]
    is_admin = current_user.get("role") == "ADMIN"

    if not (is_buyer or is_seller or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    target_status = status_update.status
    book_id_obj = parse_object_id(tx.get("book_id"))
    book = await books_col.find_one({"_id": book_id_obj}) if book_id_obj else None

    # State transition permissions
    if target_status in (TransactionStatus.ACCEPTED, TransactionStatus.REJECTED):
        if not (is_seller or is_admin):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the book owner can accept or reject requests")
    elif target_status == TransactionStatus.CANCELLED:
        if not (is_buyer or is_admin):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the buyer can cancel their request")

    now = datetime.now(timezone.utc)
    await transactions_col.update_one(
        {"_id": obj_id},
        {"$set": {"status": target_status.value, "updated_at": now}}
    )

    # Sync Book Status
    if book and book_id_obj:
        if target_status == TransactionStatus.ACCEPTED:
            await books_col.update_one({"_id": book_id_obj}, {"$set": {"status": BookStatus.RESERVED.value, "updated_at": now}})
        elif target_status == TransactionStatus.COMPLETED:
            tx_type = tx.get("type", TransactionType.BUY.value)
            if tx_type == TransactionType.DONATE.value:
                final_book_status = BookStatus.DONATED.value
            elif tx_type == TransactionType.EXCHANGE.value:
                final_book_status = BookStatus.EXCHANGED.value
            else:
                final_book_status = BookStatus.SOLD.value
            await books_col.update_one({"_id": book_id_obj}, {"$set": {"status": final_book_status, "updated_at": now}})
        elif target_status in (TransactionStatus.REJECTED, TransactionStatus.CANCELLED):
            # If the book was reserved, release it back to AVAILABLE
            if book.get("status") == BookStatus.RESERVED.value:
                await books_col.update_one({"_id": book_id_obj}, {"$set": {"status": BookStatus.AVAILABLE.value, "updated_at": now}})

    updated_tx = await transactions_col.find_one({"_id": obj_id})
    formatted = format_doc(updated_tx)
    populated = await populate_transaction_details(formatted, current_user["id"])
    return TransactionResponse(**populated)
