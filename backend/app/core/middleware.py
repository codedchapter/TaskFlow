import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import HTTPException
from jose import JWTError, jwt
from app.core.config import settings

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):

        start_time = time.time()
        method = request.method
        url = request.url.path
        print(f"→ {method} {url} started")

        response = await call_next(request)
        # After the request
        process_time = time.time() - start_time
        status_code = response.status_code

        print(f"← {method} {url} {status_code} ({process_time:.3f}s)")

        return response



class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)  # IP , list of timestamps

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        now = datetime.now()

        self.requests[client_ip] = [
            ts for ts in self.requests[client_ip]
            if now - ts < timedelta(seconds=self.window_seconds)
        ]

        if len(self.requests[client_ip]) >= self.max_requests:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later."
            )

        self.requests[client_ip].append(now)

        return await call_next(request)



class AuthLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Try to extract user from token
        auth_header = request.headers.get("Authorization")
        user_email = "anonymous"

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                user_email = payload.get("sub", "unknown")
            except JWTError:
                user_email = "invalid_token"

        request.state.user_email = user_email
        response = await call_next(request)
        print(f"[{user_email}] {request.method} {request.url.path}")

        return response
