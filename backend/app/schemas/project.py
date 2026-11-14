from pydantic import BaseModel, Field
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    color: str = Field(default="#6366f1", max_length=7)

class ProjectUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    color: str | None = Field(None, max_length=7)

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None
    color: str
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
