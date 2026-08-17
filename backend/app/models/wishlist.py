from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.book import BookResponse

class WishlistCreate(BaseModel):
    book_id: str

class WishlistResponse(BaseModel):
    id: str
    user_id: str
    book_id: str
    book: Optional[BookResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True
