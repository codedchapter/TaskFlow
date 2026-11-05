from fastapi import FastAPI
from app.routers import root
from app.routers import tasks

app = FastAPI()

app.include_router(root.router)
app.include_router(tasks.router, prefix="/api/v1", tags=["tasks"])
