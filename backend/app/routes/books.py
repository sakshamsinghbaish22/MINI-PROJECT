from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.database import get_collection, parse_object_id, format_doc
from app.models.book import BookCreate, BookUpdate, BookResponse, BookMode, BookStatus, BookCondition
from app.utils.auth import get_current_user, get_optional_current_user

router = APIRouter(prefix="/api/books", tags=["Books"])

async def populate_owner_info(book_dict: dict) -> dict:
    if not book_dict:
        return None
    users_col = get_collection("users")
    owner_id_obj = parse_object_id(book_dict.get("owner_id"))
    if owner_id_obj:
        owner = await users_col.find_one({"_id": owner_id_obj})
        if owner:
            book_dict["owner_name"] = owner.get("name", "Student")
            book_dict["owner_college"] = owner.get("college", "Campus")
            book_dict["owner_rating"] = float(owner.get("rating", 5.0))
            book_dict["owner_review_count"] = int(owner.get("review_count", 0))
    return book_dict

@router.get("/stats/summary")
async def get_public_stats_summary():
    users_col = get_collection("users")
    books_col = get_collection("books")
    transactions_col = get_collection("transactions")

    total_books = await books_col.count_documents({})
    available_books = await books_col.count_documents({"status": "AVAILABLE"})
    total_users = await users_col.count_documents({})
    completed_transactions = await transactions_col.count_documents({"status": "COMPLETED"})

    user_colleges = await users_col.distinct("college")
    book_locations = await books_col.distinct("location")
    unique_colleges = set([str(c).strip() for c in (user_colleges + book_locations) if c and str(c).strip()])
    
    return {
        "total_books": total_books,
        "available_books": available_books,
        "total_students": total_users,
        "completed_trades": completed_transactions,
        "total_colleges": max(len(unique_colleges), 1),
    }

@router.get("", response_model=List[BookResponse])
async def get_books(
    search: Optional[str] = Query(None, description="Search by title, author, or subject"),
    category: Optional[str] = Query(None, description="Filter by category"),
    course: Optional[str] = Query(None, description="Filter by course"),
    condition: Optional[str] = Query(None, description="Filter by condition"),
    location: Optional[str] = Query(None, description="Filter by campus location"),
    mode: Optional[BookMode] = Query(None, description="Filter by mode: SELL, DONATE, EXCHANGE"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    status: Optional[str] = Query(None, description="Filter by status, e.g. AVAILABLE"),
    sort_by: Optional[str] = Query("newest", description="Sort: newest, price_asc, price_desc"),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    books_col = get_collection("books")
    query = {}

    # Status filter - default to AVAILABLE if not specified, or allow all
    if status:
        if status.upper() != "ALL":
            query["status"] = status.upper()
    else:
        query["status"] = "AVAILABLE"

    # Search filter (Regex matching on title, author, subject, course, description)
    if search and search.strip():
        term = search.strip()
        query["$or"] = [
            {"title": {"$regex": term, "$options": "i"}},
            {"author": {"$regex": term, "$options": "i"}},
            {"subject": {"$regex": term, "$options": "i"}},
            {"course": {"$regex": term, "$options": "i"}},
            {"description": {"$regex": term, "$options": "i"}},
            {"category": {"$regex": term, "$options": "i"}}
        ]

    if category and category.strip() and category.lower() != "all":
        query["category"] = {"$regex": f"^{category.strip()}$", "$options": "i"}

    if course and course.strip():
        query["course"] = {"$regex": course.strip(), "$options": "i"}

    if condition and condition.strip() and condition.lower() != "all":
        query["condition"] = condition.strip()

    if location and location.strip():
        query["location"] = {"$regex": location.strip(), "$options": "i"}

    if mode:
        query["mode"] = mode.value

    # Price range filter
    price_query = {}
    if min_price is not None:
        price_query["$gte"] = min_price
    if max_price is not None:
        price_query["$lte"] = max_price
    if price_query:
        query["price"] = price_query

    # Sorting
    sort_spec = [("created_at", -1)]
    if sort_by == "price_asc":
        sort_spec = [("price", 1)]
    elif sort_by == "price_desc":
        sort_spec = [("price", -1)]
    elif sort_by == "newest":
        sort_spec = [("created_at", -1)]

    cursor = books_col.find(query).sort(sort_spec).skip(skip).limit(limit)
    books_list = []
    async for doc in cursor:
        formatted = format_doc(doc)
        populated = await populate_owner_info(formatted)
        books_list.append(BookResponse(**populated))

    return books_list

@router.get("/featured/recent", response_model=List[BookResponse])
async def get_recent_books(limit: int = 8):
    books_col = get_collection("books")
    cursor = books_col.find({"status": "AVAILABLE"}).sort("created_at", -1).limit(limit)
    books = []
    async for doc in cursor:
        formatted = format_doc(doc)
        populated = await populate_owner_info(formatted)
        books.append(BookResponse(**populated))
    return books

@router.get("/featured/donate", response_model=List[BookResponse])
async def get_donation_books(limit: int = 8):
    books_col = get_collection("books")
    cursor = books_col.find({"mode": "DONATE", "status": "AVAILABLE"}).sort("created_at", -1).limit(limit)
    books = []
    async for doc in cursor:
        formatted = format_doc(doc)
        populated = await populate_owner_info(formatted)
        books.append(BookResponse(**populated))
    return books

@router.get("/featured/exchange", response_model=List[BookResponse])
async def get_exchange_books(limit: int = 8):
    books_col = get_collection("books")
    cursor = books_col.find({"mode": "EXCHANGE", "status": "AVAILABLE"}).sort("created_at", -1).limit(limit)
    books = []
    async for doc in cursor:
        formatted = format_doc(doc)
        populated = await populate_owner_info(formatted)
        books.append(BookResponse(**populated))
    return books

@router.get("/my", response_model=List[BookResponse])
async def get_my_books(current_user: dict = Depends(get_current_user)):
    books_col = get_collection("books")
    cursor = books_col.find({"owner_id": current_user["id"]}).sort("created_at", -1)
    books = []
    async for doc in cursor:
        formatted = format_doc(doc)
        populated = await populate_owner_info(formatted)
        books.append(BookResponse(**populated))
    return books

@router.get("/{book_id}", response_model=BookResponse)
async def get_book_by_id(book_id: str):
    books_col = get_collection("books")
    obj_id = parse_object_id(book_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    doc = await books_col.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    formatted = format_doc(doc)
    populated = await populate_owner_info(formatted)
    return BookResponse(**populated)

@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(
    book_in: BookCreate,
    current_user: dict = Depends(get_current_user)
):
    books_col = get_collection("books")
    now = datetime.now(timezone.utc)
    
    # If mode is DONATE, price is forced 0.0
    price = 0.0 if book_in.mode in (BookMode.DONATE, BookMode.EXCHANGE) else book_in.price
    
    # Fallback image if none provided
    images = book_in.images if book_in.images and len(book_in.images) > 0 else [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    ]
    
    book_doc = {
        "title": book_in.title.strip(),
        "author": book_in.author.strip(),
        "description": book_in.description.strip(),
        "subject": book_in.subject.strip(),
        "course": book_in.course.strip(),
        "category": book_in.category.strip(),
        "edition": book_in.edition or "1st Edition",
        "condition": book_in.condition.value if hasattr(book_in.condition, 'value') else str(book_in.condition),
        "price": float(price),
        "mode": book_in.mode.value,
        "exchange_preference": book_in.exchange_preference.strip() if book_in.exchange_preference else None,
        "images": images,
        "owner_id": current_user["id"],
        "location": book_in.location.strip() or current_user.get("location", "Campus"),
        "status": BookStatus.AVAILABLE.value,
        "created_at": now,
        "updated_at": now
    }
    
    res = await books_col.insert_one(book_doc)
    created_doc = await books_col.find_one({"_id": res.inserted_id})
    formatted = format_doc(created_doc)
    populated = await populate_owner_info(formatted)
    return BookResponse(**populated)

@router.put("/{book_id}", response_model=BookResponse)
async def update_book(
    book_id: str,
    book_update: BookUpdate,
    current_user: dict = Depends(get_current_user)
):
    books_col = get_collection("books")
    obj_id = parse_object_id(book_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    existing = await books_col.find_one({"_id": obj_id})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    # Check ownership or admin
    if existing.get("owner_id") != current_user["id"] and current_user.get("role") != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to edit this book listing")
        
    update_data = {k: v for k, v in book_update.model_dump(exclude_unset=True).items() if v is not None}
    
    if "mode" in update_data and hasattr(update_data["mode"], 'value'):
        update_data["mode"] = update_data["mode"].value
    if "condition" in update_data and hasattr(update_data["condition"], 'value'):
        update_data["condition"] = update_data["condition"].value
    if "status" in update_data and hasattr(update_data["status"], 'value'):
        update_data["status"] = update_data["status"].value
        
    # If mode updated to DONATE/EXCHANGE, zero price
    if update_data.get("mode") in (BookMode.DONATE.value, BookMode.EXCHANGE.value):
        update_data["price"] = 0.0

    update_data["updated_at"] = datetime.now(timezone.utc)
    
    await books_col.update_one({"_id": obj_id}, {"$set": update_data})
    updated_doc = await books_col.find_one({"_id": obj_id})
    formatted = format_doc(updated_doc)
    populated = await populate_owner_info(formatted)
    return BookResponse(**populated)

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(
    book_id: str,
    current_user: dict = Depends(get_current_user)
):
    books_col = get_collection("books")
    obj_id = parse_object_id(book_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    existing = await books_col.find_one({"_id": obj_id})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
        
    if existing.get("owner_id") != current_user["id"] and current_user.get("role") != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete this book listing")
        
    await books_col.delete_one({"_id": obj_id})
    
    # Also clean up wishlist items pointing to this book
    wishlist_col = get_collection("wishlist")
    await wishlist_col.delete_many({"book_id": book_id})
    return None
