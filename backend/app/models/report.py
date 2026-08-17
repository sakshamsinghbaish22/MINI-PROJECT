from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

class ReportReason(str, Enum):
    FAKE = "Fake listing"
    SCAM = "Scam"
    WRONG_INFO = "Wrong information"
    SPAM = "Spam"
    INAPPROPRIATE = "Inappropriate content"
    OTHER = "Other"

class ReportStatus(str, Enum):
    PENDING = "PENDING"
    RESOLVED = "RESOLVED"
    DISMISSED = "DISMISSED"

class ReportCreate(BaseModel):
    reported_book_id: Optional[str] = None
    reported_user_id: Optional[str] = None
    reason: ReportReason
    description: str = Field(..., min_length=5, max_length=1000)

class ReportUpdateStatus(BaseModel):
    status: ReportStatus
    admin_notes: Optional[str] = None

class ReportResponse(BaseModel):
    id: str
    reporter_id: str
    reporter_name: Optional[str] = None
    reporter_email: Optional[str] = None
    reported_user_id: Optional[str] = None
    reported_user_name: Optional[str] = None
    reported_book_id: Optional[str] = None
    reported_book_title: Optional[str] = None
    reason: ReportReason
    description: str
    status: ReportStatus
    admin_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
