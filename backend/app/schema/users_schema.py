from pydantic import BaseModel, EmailStr
from typing import List, Optional

class CreateUsersSchema(BaseModel):
    users_name: str
    users_lastname_one: str
    users_lastname_two: str
    users_email: EmailStr
    users_password: str
    users_role: str = "admin"
    users_is_active: bool

class ResponseUsersSchema(BaseModel):
    users_id: int
    users_name: str
    users_lastname_one: str
    users_lastname_two: str
    users_email: EmailStr
    users_role: str
    users_is_active: bool

class ResponseListUserSchema(BaseModel):
    users : List[ResponseUsersSchema]

class LoginSchema(BaseModel):
    users_email:EmailStr
    users_password: str

class LoginResponseSchema(BaseModel):
    users_id: int
    users_email: EmailStr
    users_role: str
    users_is_active:bool
    access_token: str
