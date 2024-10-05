from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date
from decimal import Decimal

class CreateOrdersSchema(BaseModel):
    orders_date: 'date'
    orders_total: Decimal
    orders_number:str
    orders_customers_id: int

class CreateOrderProductsSchema(BaseModel):
    orderproducts_name: str
    orderproducts_quantity: int
    orderproducts_price: Decimal
    orderproducts_subtotal: Decimal
    orderproducts_orders_id: int 
    orderproducts_products_id: int

class CreateCustomers(BaseModel):
    customers_name: str
    customers_surname: str 
    customers_address_one: str
    customers_address_two: Optional[str]
   #customers_cp: pendiente
   #customers_city: pendiente
   #customers_province: pendiente
    customers_email: EmailStr
    customers_phone: str
	