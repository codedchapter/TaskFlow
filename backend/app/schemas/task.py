from pydantic import BaseModel, Field
from datetime import datetime

class TaskStatus(str):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"

class TaskCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str | None = Field(None, max_length=255)
    status: str = Field(default=TaskStatus.TODO)

class TaskUpdate(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=255)
    description: str | None = Field(None, max_length=255)
    status: str | None = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    user_id: int
    is_deleted: bool
    # created_at: datetime

    class Config:
        from_attributes = True
