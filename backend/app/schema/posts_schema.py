
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class PostSchema(BaseModel):
    posts_id: int
    posts_title: str
    posts_content: str
    posts_author: str
    posts_date: 'date'
    posts_users_id: int
    posts_image_url: Optional[str]

# Define el schema para la lista de posts
class PostsResponseSchema(BaseModel):
    posts: List[PostSchema]