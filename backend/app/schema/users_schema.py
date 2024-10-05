
# Para validacion y manipulación de datos
from pydantic import BaseModel, EmailStr
# esta nos permite que lo que pongamos dentro de nuestro atributo sea opcional
from typing import List, Optional

# Vamos a poner en marcha la validacion de datos con PYDANTIC
# Pero 1º creamos un class que defina nuestros users, he creado dos clases, una para crear el usuario sin el ID y cuando lo necesitemos traer que si nos lo devuelva.

class CreateUsersSchema(BaseModel):
    users_name: str
    users_lastname_one: str
    users_lastname_two: str
    users_email: EmailStr
    users_password: str
    users_role: str = "buyer"

class ResponseUsersSchema(BaseModel):
    users_id: int
    users_email: EmailStr
    #users_password: str
    users_role: str

class ResponseListUserSchema(BaseModel):
    users : List[ResponseUsersSchema]

class LoginSchema(BaseModel):
    users_email:EmailStr
    users_password: str

class LoginResponseSchema(BaseModel):
    users_id: int
    users_email: EmailStr
    users_role: str
    access_token: str
