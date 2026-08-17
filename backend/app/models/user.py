from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    college: str = Field(..., min_length=2, max_length=150)
    location: str = Field(..., min_length=2, max_length=150)
    profile_image: Optional[str] = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    role: str = Field(default="USER")

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    college: str = Field(..., min_length=2, max_length=150)
    location: str = Field(..., min_length=2, max_length=150)
    profile_image: Optional[str] = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    college: Optional[str] = Field(None, min_length=2, max_length=150)
    location: Optional[str] = Field(None, min_length=2, max_length=150)
    profile_image: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    college: str
    location: str
    profile_image: Optional[str] = None
    role: str = "USER"
    rating: float = 0.0
    review_count: int = 0
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

class SellerPublicResponse(BaseModel):
    id: str
    name: str
    college: str
    location: str
    profile_image: Optional[str] = None
    rating: float = 5.0
    review_count: int = 0
    created_at: datetime
    books_listed_count: int = 0
    books_sold_count: int = 0

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

