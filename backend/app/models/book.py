from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class BookMode(str, Enum):
    SELL = "SELL"
    DONATE = "DONATE"
    EXCHANGE = "EXCHANGE"

class BookStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"
    SOLD = "SOLD"
    DONATED = "DONATED"
    EXCHANGED = "EXCHANGED"

class BookCondition(str, Enum):
    NEW = "Brand New"
    LIKE_NEW = "Like New"
    GOOD = "Good"
    FAIR = "Fair"

class BookCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    author: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=5, max_length=2000)
    subject: str = Field(..., min_length=2, max_length=100)
    course: str = Field(..., min_length=2, max_length=100)
    category: str = Field(..., min_length=2, max_length=100)
    edition: Optional[str] = "1st Edition"
    condition: BookCondition = BookCondition.GOOD
    price: float = Field(default=0.0, ge=0.0)
    mode: BookMode = BookMode.SELL
    exchange_preference: Optional[str] = None
    images: List[str] = Field(default_factory=list)
    location: str = Field(..., min_length=2, max_length=150)

class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    author: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, min_length=5, max_length=2000)
    subject: Optional[str] = None
    course: Optional[str] = None
    category: Optional[str] = None
    edition: Optional[str] = None
    condition: Optional[BookCondition] = None
    price: Optional[float] = Field(None, ge=0.0)
    mode: Optional[BookMode] = None
    exchange_preference: Optional[str] = None
    images: Optional[List[str]] = None
    location: Optional[str] = None
    status: Optional[BookStatus] = None

class BookResponse(BaseModel):
    id: str
    title: str
    author: str
    description: str
    subject: str
    course: str
    category: str
    edition: str
    condition: str
    price: float
    mode: BookMode
    exchange_preference: Optional[str] = None
    images: List[str]
    owner_id: str
    owner_name: Optional[str] = "Student"
    owner_college: Optional[str] = "Campus"
    owner_rating: Optional[float] = 0.0
    owner_review_count: Optional[int] = 0
    location: str
    status: BookStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
