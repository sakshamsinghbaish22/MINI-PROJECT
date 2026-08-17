from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class ReviewCreate(BaseModel):
    reviewed_user_id: str
    book_id: str
    transaction_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=2, max_length=1000)

class ReviewResponse(BaseModel):
    id: str
    reviewer_id: str
    reviewer_name: Optional[str] = "Student"
    reviewer_avatar: Optional[str] = None
    reviewer_college: Optional[str] = None
    reviewed_user_id: str
    book_id: str
    book_title: Optional[str] = None
    transaction_id: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
