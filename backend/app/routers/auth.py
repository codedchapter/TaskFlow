from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserResponse, UserCreate, UserLogin, Token
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User
from sqlalchemy import select
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Check if user exists
    check_user = await db.execute(select(User).where(User.email == user.email))
    existing_user = check_user.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exist Try LogIn")

    db_user = User(
        email=user.email,
        hashed_password=get_password_hash(user.password)
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@router.post("/login", response_model=Token)
async def login_for_access_token(user_login: UserLogin, db: AsyncSession = Depends(get_db)):

    check_user = await db.execute(select(User).where(User.email == user_login.email))
    db_user = check_user.scalar_one_or_none()

    if not db_user or not verify_password(user_login.password, db_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
