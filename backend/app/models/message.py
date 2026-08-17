from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class MessageCreate(BaseModel):
    receiver_id: str
    book_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=2000)

class MessageResponse(BaseModel):
    id: str
    sender_id: str
    sender_name: Optional[str] = "User"
    sender_avatar: Optional[str] = None
    receiver_id: str
    receiver_name: Optional[str] = "User"
    receiver_avatar: Optional[str] = None
    book_id: Optional[str] = None
    book_title: Optional[str] = None
    message: str
    read: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationSummary(BaseModel):
    other_user_id: str
    other_user_name: str
    other_user_avatar: Optional[str] = None
    other_user_college: Optional[str] = None
    last_message: str
    last_message_time: datetime
    unread_count: int = 0
    book_id: Optional[str] = None
    book_title: Optional[str] = None
    book_image: Optional[str] = None
