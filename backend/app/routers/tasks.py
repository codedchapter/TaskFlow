from fastapi import APIRouter, Depends
from app.schemas.task import TaskCreate, TaskResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.task import Task
from sqlalchemy import select


router = APIRouter()

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, db: AsyncSession = Depends(get_db)):

    db_task = Task(
        title=task.title,
        description=task.description,
        is_completed=task.is_completed
    )

    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task


@router.get("/", response_model=list[TaskResponse])
async def get_all_tasks(db : AsyncSession = Depends(get_db)):

    result = await db.execute(select(Task))
    tasks = result.scalars().all()

    return tasks
