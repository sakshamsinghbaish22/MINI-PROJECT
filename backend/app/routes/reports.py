from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_collection, parse_object_id, format_doc
from app.models.report import ReportCreate, ReportResponse, ReportStatus
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_in: ReportCreate,
    current_user: dict = Depends(get_current_user)
):
    reports_col = get_collection("reports")
    users_col = get_collection("users")
    books_col = get_collection("books")

    reported_user_name = None
    reported_book_title = None

    if report_in.reported_user_id:
        u_obj = parse_object_id(report_in.reported_user_id)
        if u_obj:
            r_user = await users_col.find_one({"_id": u_obj})
            if r_user:
                reported_user_name = r_user.get("name")

    if report_in.reported_book_id:
        b_obj = parse_object_id(report_in.reported_book_id)
        if b_obj:
            r_book = await books_col.find_one({"_id": b_obj})
            if r_book:
                reported_book_title = r_book.get("title")

    now = datetime.now(timezone.utc)
    new_rep = {
        "reporter_id": current_user["id"],
        "reported_user_id": report_in.reported_user_id,
        "reported_book_id": report_in.reported_book_id,
        "reason": report_in.reason.value if hasattr(report_in.reason, 'value') else str(report_in.reason),
        "description": report_in.description.strip(),
        "status": ReportStatus.PENDING.value,
        "admin_notes": None,
        "created_at": now
    }

    res = await reports_col.insert_one(new_rep)
    created_rep = await reports_col.find_one({"_id": res.inserted_id})
    formatted = format_doc(created_rep)
    formatted["reporter_name"] = current_user["name"]
    formatted["reporter_email"] = current_user["email"]
    formatted["reported_user_name"] = reported_user_name
    formatted["reported_book_title"] = reported_book_title

    return ReportResponse(**formatted)

@router.get("/my", response_model=List[ReportResponse])
async def get_my_reports(current_user: dict = Depends(get_current_user)):
    reports_col = get_collection("reports")
    cursor = reports_col.find({"reporter_id": current_user["id"]}).sort("created_at", -1)
    
    results = []
    async for doc in cursor:
        results.append(ReportResponse(**format_doc(doc)))
    return results
