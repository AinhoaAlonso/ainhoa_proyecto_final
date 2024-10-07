from pydantic import BaseModel
from decimal import Decimal
from typing import List, Optional

class ProductsSchema(BaseModel):
    products_id: int
    products_name: str 
    products_description: str
    products_price: Decimal
    products_image_url: Optional[str]
    products_stock: int
    products_category: str
    products_is_active: bool

class InsertProductsSchema(BaseModel):
    products_name: str 
    products_description: str
    products_price: Decimal
    #products_image_url: str
    products_stock: int
    products_category: str
