from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from app.models.book import BookResponse

class TransactionType(str, Enum):
    BUY = "BUY"
    SELL = "SELL"
    DONATE = "DONATE"
    EXCHANGE = "EXCHANGE"


class TransactionStatus(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class TransactionCreate(BaseModel):
    book_id: str
    type: TransactionType
    message: Optional[str] = Field(None, max_length=1000)

class TransactionUpdateStatus(BaseModel):
    status: TransactionStatus

class TransactionResponse(BaseModel):
    id: str
    book_id: str
    buyer_id: str
    buyer_name: Optional[str] = None
    buyer_college: Optional[str] = None
    buyer_avatar: Optional[str] = None
    seller_id: str
    seller_name: Optional[str] = None
    seller_college: Optional[str] = None
    seller_avatar: Optional[str] = None
    type: TransactionType
    status: TransactionStatus
    message: Optional[str] = None
    book: Optional[BookResponse] = None
    has_reviewed: Optional[bool] = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
