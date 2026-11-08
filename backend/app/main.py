from fastapi import FastAPI
from app.routers import root
from app.routers import tasks
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware
from app.core.middleware import RequestLoggingMiddleware, RateLimitMiddleware, AuthLoggingMiddleware

app = FastAPI()

#order matters
app.add_middleware(AuthLoggingMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware, max_requests=100, window_seconds=60)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(root.router)
app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["tasks"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
