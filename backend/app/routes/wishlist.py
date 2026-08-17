from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_collection, parse_object_id, format_doc
from app.models.wishlist import WishlistCreate, WishlistResponse
from app.models.book import BookResponse
from app.routes.books import populate_owner_info
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])

@router.get("", response_model=List[WishlistResponse])
async def get_my_wishlist(current_user: dict = Depends(get_current_user)):
    wishlist_col = get_collection("wishlist")
    books_col = get_collection("books")
    
    cursor = wishlist_col.find({"user_id": current_user["id"]}).sort("created_at", -1)
    items = []
    
    async for item in cursor:
        item_formatted = format_doc(item)
        book_obj_id = parse_object_id(item_formatted.get("book_id"))
        book_dict = None
        if book_obj_id:
            book_doc = await books_col.find_one({"_id": book_obj_id})
            if book_doc:
                book_dict = format_doc(book_doc)
                book_dict = await populate_owner_info(book_dict)
                item_formatted["book"] = BookResponse(**book_dict)
                items.append(WishlistResponse(**item_formatted))
                
    return items

@router.post("", response_model=WishlistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    item_in: WishlistCreate,
    current_user: dict = Depends(get_current_user)
):
    wishlist_col = get_collection("wishlist")
    books_col = get_collection("books")
    
    book_obj_id = parse_object_id(item_in.book_id)
    if not book_obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    book_doc = await books_col.find_one({"_id": book_obj_id})
    if not book_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    existing = await wishlist_col.find_one({"user_id": current_user["id"], "book_id": item_in.book_id})
    if existing:
        formatted = format_doc(existing)
        book_dict = format_doc(book_doc)
        book_dict = await populate_owner_info(book_dict)
        formatted["book"] = BookResponse(**book_dict)
        return WishlistResponse(**formatted)
        
    now = datetime.now(timezone.utc)
    new_item = {
        "user_id": current_user["id"],
        "book_id": item_in.book_id,
        "created_at": now
    }
    res = await wishlist_col.insert_one(new_item)
    created_item = await wishlist_col.find_one({"_id": res.inserted_id})
    formatted = format_doc(created_item)
    book_dict = format_doc(book_doc)
    book_dict = await populate_owner_info(book_dict)
    formatted["book"] = BookResponse(**book_dict)
    return WishlistResponse(**formatted)

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(
    book_id: str,
    current_user: dict = Depends(get_current_user)
):
    wishlist_col = get_collection("wishlist")
    await wishlist_col.delete_many({"user_id": current_user["id"], "book_id": book_id})
    return None

@router.get("/check/{book_id}")
async def check_in_wishlist(
    book_id: str,
    current_user: dict = Depends(get_current_user)
):
    wishlist_col = get_collection("wishlist")
    item = await wishlist_col.find_one({"user_id": current_user["id"], "book_id": book_id})
    return {"in_wishlist": item is not None}
