from pydantic import BaseModel, Field
from datetime import datetime

class TaskStatus(str):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"


class TaskPriority(str):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str | None = Field(None, max_length=255)
    status: str = Field(default=TaskStatus.TODO)
    priority: str = Field(default=TaskPriority.MEDIUM)
    due_date: datetime | None = None
    project_id: int | None = None


class TaskUpdate(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=255)
    description: str | None = Field(None, max_length=255)
    status: str | None = None
    priority: str | None = None
    due_date: datetime | None = None
    project_id: int | None = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    status: str
    priority: str
    due_date: datetime | None = None
    project_id: int | None = None
    user_id: int
    is_deleted: bool

    class Config:
        from_attributes = True
