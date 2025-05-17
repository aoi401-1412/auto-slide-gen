from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class UserSettings(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    logo_url: Optional[str] = None
    primary_color: str = "#3498db"
    secondary_color: str = "#2ecc71"
    font_family: str = "Arial"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
