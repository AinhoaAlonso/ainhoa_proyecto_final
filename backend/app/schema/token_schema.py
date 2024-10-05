from pydantic import BaseModel

class TokenSchema(BaseModel):
    username: str
    payload: dict