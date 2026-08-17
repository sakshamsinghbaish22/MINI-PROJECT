from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.database import get_collection, parse_object_id, format_doc
from app.models.user import UserResponse
from app.models.book import BookResponse
from app.models.report import ReportResponse, ReportUpdateStatus
from app.models.transaction import TransactionResponse
from app.routes.books import populate_owner_info
from app.routes.transactions import populate_transaction_details
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin Panel"])

@router.get("/stats")
async def get_admin_stats(admin_user: dict = Depends(get_current_admin_user)):
    users_col = get_collection("users")
    books_col = get_collection("books")
    transactions_col = get_collection("transactions")
    reports_col = get_collection("reports")

    total_users = await users_col.count_documents({})
    total_books = await books_col.count_documents({})
    available_books = await books_col.count_documents({"status": "AVAILABLE"})
    total_transactions = await transactions_col.count_documents({})
    completed_transactions = await transactions_col.count_documents({"status": "COMPLETED"})
    pending_reports = await reports_col.count_documents({"status": "PENDING"})

    return {
        "total_users": total_users,
        "total_books": total_books,
        "available_books": available_books,
        "total_transactions": total_transactions,
        "completed_transactions": completed_transactions,
        "pending_reports": pending_reports
    }

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    search: Optional[str] = Query(None),
    admin_user: dict = Depends(get_current_admin_user)
):
    users_col = get_collection("users")
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"college": {"$regex": search, "$options": "i"}}
        ]
    cursor = users_col.find(query).sort("created_at", -1)
    users = []
    async for doc in cursor:
        users.append(UserResponse(**format_doc(doc)))
    return users

@router.put("/users/{user_id}/status", response_model=UserResponse)
async def toggle_user_status(
    user_id: str,
    is_active: bool = Query(...),
    admin_user: dict = Depends(get_current_admin_user)
):
    users_col = get_collection("users")
    obj_id = parse_object_id(user_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    target = await users_col.find_one({"_id": obj_id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if target.get("role") == "ADMIN" and not is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot suspend an administrator account")

    await users_col.update_one({"_id": obj_id}, {"$set": {"is_active": is_active}})
    updated = await users_col.find_one({"_id": obj_id})
    return UserResponse(**format_doc(updated))

@router.get("/books", response_model=List[BookResponse])
async def get_all_books_admin(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    admin_user: dict = Depends(get_current_admin_user)
):
    books_col = get_collection("books")
    query = {}
    if status and status.upper() != "ALL":
        query["status"] = status.upper()
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"author": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    cursor = books_col.find(query).sort("created_at", -1)
    books = []
    async for doc in cursor:
        formatted = format_doc(doc)
        populated = await populate_owner_info(formatted)
        books.append(BookResponse(**populated))
    return books

@router.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book_admin(
    book_id: str,
    admin_user: dict = Depends(get_current_admin_user)
):
    books_col = get_collection("books")
    wishlist_col = get_collection("wishlist")
    obj_id = parse_object_id(book_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    await books_col.delete_one({"_id": obj_id})
    await wishlist_col.delete_many({"book_id": book_id})
    return None

@router.get("/reports", response_model=List[ReportResponse])
async def get_all_reports(
    status: Optional[str] = Query(None),
    admin_user: dict = Depends(get_current_admin_user)
):
    reports_col = get_collection("reports")
    users_col = get_collection("users")
    books_col = get_collection("books")

    query = {}
    if status and status.upper() != "ALL":
        query["status"] = status.upper()

    cursor = reports_col.find(query).sort("created_at", -1)
    reports = []

    async for doc in cursor:
        formatted = format_doc(doc)
        
        # Populate Reporter
        r_obj = parse_object_id(formatted.get("reporter_id"))
        if r_obj:
            r_user = await users_col.find_one({"_id": r_obj})
            if r_user:
                formatted["reporter_name"] = r_user.get("name")
                formatted["reporter_email"] = r_user.get("email")

        # Populate Reported User
        ru_obj = parse_object_id(formatted.get("reported_user_id"))
        if ru_obj:
            ru_user = await users_col.find_one({"_id": ru_obj})
            if ru_user:
                formatted["reported_user_name"] = ru_user.get("name")

        # Populate Reported Book
        rb_obj = parse_object_id(formatted.get("reported_book_id"))
        if rb_obj:
            rb_book = await books_col.find_one({"_id": rb_obj})
            if rb_book:
                formatted["reported_book_title"] = rb_book.get("title")

        reports.append(ReportResponse(**formatted))

    return reports

@router.put("/reports/{report_id}/status", response_model=ReportResponse)
async def update_report_status(
    report_id: str,
    update_in: ReportUpdateStatus,
    admin_user: dict = Depends(get_current_admin_user)
):
    reports_col = get_collection("reports")
    obj_id = parse_object_id(report_id)
    if not obj_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    update_doc = {"status": update_in.status.value}
    if update_in.admin_notes is not None:
        update_doc["admin_notes"] = update_in.admin_notes.strip()

    await reports_col.update_one({"_id": obj_id}, {"$set": update_doc})
    updated = await reports_col.find_one({"_id": obj_id})
    return ReportResponse(**format_doc(updated))
