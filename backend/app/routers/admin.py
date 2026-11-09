from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import require_role
from app.models.user import User
from app.models.task import Task

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/tasks/all")
async def get_all_tasks_system_wide(

    current_user: User = Depends(require_role(["admin"])),
    db: AsyncSession = Depends(get_db)
):
   
    result = await db.execute(select(Task))
    tasks = result.scalars().all()

    return {
        "message": f"Welcome, Admin {current_user.email}. Here is all system data.",
        "total_tasks": len(tasks),
        "tasks": tasks
    }
