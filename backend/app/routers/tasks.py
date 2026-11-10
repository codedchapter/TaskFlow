from fastapi import APIRouter, Depends, Query, HTTPException
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.task import Task
from sqlalchemy import select
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    db_task = Task(
        user_id=current_user.id,
        title=task.title,
        description=task.description,
        status=task.status,
        is_deleted=False
    )

    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.get("/", response_model=list[TaskResponse])
async def get_all_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, gt=0, le=100),
    status: str | None = None,
    search: str | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Task).where(
        Task.user_id == current_user.id,
        Task.is_deleted == False
    )

    if status:
        query = query.where(Task.status == status)

    if search:
        query = query.where(Task.title.ilike(f"%{search}%"))

    result = await db.execute(query.offset(skip).limit(limit))
    tasks = result.scalars().all()
    return tasks

@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.id,
            Task.is_deleted == False
        )
    )

    db_task = result.scalar_one_or_none()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)

    await db.commit()
    await db.refresh(db_task)
    return db_task

@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == current_user.id,
            Task.is_deleted == False
        )
    )
    db_task = result.scalar_one_or_none()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.is_deleted = True
    await db.commit()

    return None
