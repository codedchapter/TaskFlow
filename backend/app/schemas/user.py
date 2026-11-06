from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email : EmailStr


class UserCreate(UserBase):
    password : str = Field(min_length=8)


class UserResponse(UserBase):
    id : int


class Token(BaseModel):
    access_token: str
    token_type: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
