from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email : EmailStr


class UserCreate(UserBase):
    password : str = Field(min_length=8)
    role: str = "user"


class UserResponse(UserBase):
    id : int
    role: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
