from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_collection, parse_object_id, format_doc
from app.models.review import ReviewCreate, ReviewResponse
from app.models.transaction import TransactionStatus
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

async def recalculate_user_rating(user_id: str):
    users_col = get_collection("users")
    reviews_col = get_collection("reviews")

    cursor = reviews_col.find({"reviewed_user_id": user_id})
    ratings = []
    async for rev in cursor:
        ratings.append(rev.get("rating", 5))

    user_obj = parse_object_id(user_id)
    if not user_obj:
        return

    if ratings:
        avg_rating = round(sum(ratings) / len(ratings), 1)
        count = len(ratings)
        await users_col.update_one(
            {"_id": user_obj},
            {"$set": {"rating": avg_rating, "review_count": count}}
        )
    else:
        await users_col.update_one(
            {"_id": user_obj},
            {"$set": {"rating": 5.0, "review_count": 0}}
        )

@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    rev_in: ReviewCreate,
    current_user: dict = Depends(get_current_user)
):
    transactions_col = get_collection("transactions")
    reviews_col = get_collection("reviews")
    users_col = get_collection("users")
    books_col = get_collection("books")

    # Validate Transaction
    tx_obj = parse_object_id(rev_in.transaction_id)
    if not tx_obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    tx = await transactions_col.find_one({"_id": tx_obj})
    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    if tx.get("status") != TransactionStatus.COMPLETED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reviews can only be submitted for COMPLETED transactions"
        )

    # Must be either buyer or seller
    if tx.get("buyer_id") != current_user["id"] and tx.get("seller_id") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You were not a participant in this transaction"
        )

    # Check if this user already reviewed this transaction
    existing = await reviews_col.find_one({
        "transaction_id": rev_in.transaction_id,
        "reviewer_id": current_user["id"]
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted a review for this transaction"
        )

    # Determine who is being reviewed
    target_user_id = tx.get("seller_id") if current_user["id"] == tx.get("buyer_id") else tx.get("buyer_id")
    
    # Book title for display
    book_title = "Book"
    book_obj = parse_object_id(rev_in.book_id)
    if book_obj:
        book_doc = await books_col.find_one({"_id": book_obj})
        if book_doc:
            book_title = book_doc.get("title", "Book")

    now = datetime.now(timezone.utc)
    new_rev = {
        "reviewer_id": current_user["id"],
        "reviewed_user_id": target_user_id,
        "book_id": rev_in.book_id,
        "transaction_id": rev_in.transaction_id,
        "rating": rev_in.rating,
        "comment": rev_in.comment.strip(),
        "created_at": now
    }

    res = await reviews_col.insert_one(new_rev)
    
    # Recalculate target user's rating and review count
    await recalculate_user_rating(target_user_id)

    created_rev = await reviews_col.find_one({"_id": res.inserted_id})
    formatted = format_doc(created_rev)
    formatted["reviewer_name"] = current_user["name"]
    formatted["reviewer_avatar"] = current_user.get("profile_image")
    formatted["reviewer_college"] = current_user.get("college")
    formatted["book_title"] = book_title

    return ReviewResponse(**formatted)

@router.get("/user/{user_id}", response_model=List[ReviewResponse])
async def get_user_reviews(user_id: str):
    reviews_col = get_collection("reviews")
    users_col = get_collection("users")
    books_col = get_collection("books")

    cursor = reviews_col.find({"reviewed_user_id": user_id}).sort("created_at", -1)
    results = []

    async for doc in cursor:
        formatted = format_doc(doc)
        
        # Populate Reviewer
        rev_user_obj = parse_object_id(formatted.get("reviewer_id"))
        if rev_user_obj:
            r_user = await users_col.find_one({"_id": rev_user_obj})
            if r_user:
                formatted["reviewer_name"] = r_user.get("name", "Student")
                formatted["reviewer_avatar"] = r_user.get("profile_image")
                formatted["reviewer_college"] = r_user.get("college", "Campus")

        # Populate Book Title
        book_obj = parse_object_id(formatted.get("book_id"))
        if book_obj:
            b_doc = await books_col.find_one({"_id": book_obj})
            if b_doc:
                formatted["book_title"] = b_doc.get("title")

        results.append(ReviewResponse(**formatted))

    return results
