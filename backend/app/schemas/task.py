from pydantic import BaseModel, Field

class TaskBase(BaseModel):
    title : str = Field(min_length=3)
    description :str | None = None
    is_completed : bool = False


class TaskCreate(TaskBase):
    pass


class TaskResponse(TaskBase):
    id : int
    user_id: int
