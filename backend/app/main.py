from fastapi import FastAPI
from app.routers import root
from app.routers import tasks
from app.routers import auth

app = FastAPI()

app.include_router(root.router)
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
