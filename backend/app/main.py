import bcrypt
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status, Depends
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
from datetime import date


from app.model.users_connection import UsersConnection
from app.model.posts_connection import PostsConnection
from app.model.products_connection import ProductsConnection
from app.model.auth import create_token
from app.model.auth import verify_token
from app.model.orders_customers_connection import OrdersCustomersConnections
from app.schema.users_schema import CreateUsersSchema
from app.schema.posts_schema import PostSchema
from app.schema.posts_schema import PostsResponseSchema
from app.schema.users_schema import LoginSchema
from app.schema.users_schema import LoginResponseSchema
from app.schema.token_schema import TokenSchema
from app.schema.products_schema import InsertProductsSchema
from app.schema.orders_schema import CreateOrderProductsSchema
from app.schema.orders_schema import CreateCustomers
from app.schema.orders_schema import CreateOrdersSchema
from app.schema.products_schema import ProductsSchema
from app.schema.orders_schema import CustomerResponse


app = FastAPI()
conn = UsersConnection()
connp = PostsConnection()
connproducts = ProductsConnection()
connorders = OrdersCustomersConnections()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tucasaorganizada-9ba7d5ba9e54.herokuapp.com"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


@app.get("/posts")
def show_posts():
    posts = connp.show_posts()
    return posts

@app.post("/insert/posts")
async def insert_posts(
    posts_title: str = Form(...),
    posts_author: str = Form(...),
    posts_date: date = Form(...),
    posts_content: str = Form(...),
    posts_image_url: Optional[str] = Form(...),
    posts_users_id: int = Form(...)
):
    data = {
        "posts_title": posts_title,
        "posts_author": posts_author,
        "posts_date": posts_date,
        "posts_content": posts_content,
        "posts_image_url": posts_image_url,
        "posts_users_id": posts_users_id
    }
    try:
        await connp.insert_posts(data)
        return {"message": "Post guardado con éxito"}
    except Exception as e:
        await connp.rollback() 
        raise HTTPException(status_code=500, detail=f"Error al insertar post: {str(e)}")
    
@app.put("/update/posts")
async def update_posts(
    posts_id : int = Form(...),
    posts_title: str = Form(...),
    posts_author: str = Form(...),
    posts_date: date = Form(...),
    posts_content: str = Form(...),
    posts_image_url: str = Form(...),
    posts_users_id: int = Form(...)
):
    data = {
        "posts_title": posts_title,
        "posts_author": posts_author,
        "posts_date": posts_date,
        "posts_content": posts_content,
        "posts_image_url": posts_image_url,
        "posts_users_id": posts_users_id
    }
    try:
        await connp.update_posts(posts_id, data)
        return {"Update Post": "Post actualizado con éxito"}
    except Exception as e:
         await connp.rollback()
         raise HTTPException(status_code=500, detail=f"Error al actualizar post: {str(e)}")

@app.delete("/delete/posts/{posts_id}")
async def delete_post(posts_id: int):
    try:
        await connp.delete_posts(posts_id)
        return {"Delete Post": "Post eliminado correctamente"}
    except Exception as e:
        await connp.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar post: {str(e)}")
    

@app.get("/products")
def get_products():
    products= connproducts.get_products()
    return products

@app.get("/products/{products_id}")
def get_product(products_id:int):
    product = connproducts.get_product_id(products_id)

    if product is None:  
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@app.post("/insert/products")
async def insert_products(
    products_name: str = Form(...),
    products_description: str = Form(...),
    products_price: float = Form(...),
    products_stock: int = Form(...),
    products_category: str = Form(...),
    products_image_url: str = File(...),
    products_is_active: bool = File(...)
    ):
    
    data = {
        "products_name": products_name,
        "products_description": products_description,
        "products_price": products_price,
        "products_stock": products_stock,
        "products_category": products_category,
        "products_image_url": products_image_url,
        "products_is_active": products_is_active,
    }
    
    try:
        await connproducts.insert_products(data)
        return {"message": "Producto guardado con éxito"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al insertar producto: {str(e)}")

@app.put("/update/products")
async def update_product(
    products_id: int = Form(...),
    products_name: str = Form(...),
    products_description: str = Form(...),
    products_price: float = Form(...),
    products_stock: int = Form(...),
    products_category: str = Form(...),
    products_image_url: str = File(...),
    products_is_active: bool = File(...)
    ):
    
    data = {
        "products_name": products_name,
        "products_description": products_description,
        "products_price": products_price,
        "products_stock": products_stock,
        "products_category": products_category,
        "products_image_url": products_image_url,
        "products_is_active": products_is_active,
    }
    try:
        await connproducts.update_products(products_id, data)
        return {"Update Product": "Producto actualizado con éxito"}
    except Exception as e:
         await connproducts.rollback()
         raise HTTPException(status_code=500, detail=f"Error al actualizar el producto: {str(e)}") 

@app.put("/update/products/{products_id}")
async def update_stock(products_id:int, products_stock:int):
    try:
        await connproducts.update_products_stock(products_id, products_stock)
        return {"Stock actualizado"}
    except Exception as e:
        await connproducts.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar el stock: {str(e)}")
    
@app.delete("/delete/products/{products_id}")
async def delete_product(products_id: int):
    try:
        await connproducts.delete_products(products_id)
        return {"Producto eliminado correctamente"}
    except Exception as e:
        await connproducts.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar producto: {str(e)}")
    
#Ruta para verificar el token
@app.get("/verify_token", response_model= TokenSchema)
def verify_token_endpoint(payload: dict = Depends(verify_token)):
    return {"username": payload.get("sub"), "payload": payload}

@app.post("/login")
def login(request: LoginSchema):
    user = conn.login_users(email=request.users_email, password=request.users_password)

    if user:
        access_token = create_token(data={"sub": user.users_email, "role": user.users_role})
        return LoginResponseSchema(
            users_id=user.users_id,
            users_email=user.users_email,
            users_role=user.users_role,
            users_is_active=user.users_is_active,
            access_token=access_token,
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
@app.get("/provinces")
def show_provinces():
    provinces = connorders.get_provinces()
    return provinces

@app.get("/customers/{customers_email}", response_model=CustomerResponse)
def show_customer(customers_email:str):
    customer = connorders.get_customers(customers_email)
    return customer

@app.post("/insert/customers")
def customers_insert(customers_data: CreateCustomers):
    data = customers_data.model_dump()
    try:
        customers_id = connorders.insert_customers(data)
        return{
            "customers_id": customers_id,
            **data 
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al insertar cliente: {str(e)}")

@app.post("/insert/orderproducts")
def orderproducts_insert(orderproducts_data: CreateOrderProductsSchema):
    data = orderproducts_data.model_dump()
    try:
        connorders.insert_orderproducts(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al insertar producto del pedido: {str(e)}")

@app.post("/insert/orders")
def orders_insert(orders_data: CreateOrdersSchema):
    data = {
        "orders_date": str(orders_data.orders_date),  
        "orders_total": float(orders_data.orders_total), 
        "orders_number": orders_data.orders_number,
        "orders_customers_id": orders_data.orders_customers_id
    }
    try:
        orders_id=connorders.insert_orders(data)
        return{
            "orders_id": orders_id,
            **data 
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al insertar pedido: {str(e)}")

@app.get("/users")
def show_users():
    users = conn.show_users()
    return users


@app.post("/insert/user")
async def insert_users(
    users_name: str = Form(...),
    users_lastname_one: str = Form(...),
    users_lastname_two: str = Form(...),
    users_email: str = Form(...),
    users_password: str = Form(...),
    users_role: str = File(...),
    users_is_active: bool = File(...)
    ):
    data = {
        "users_name": users_name,
        "users_lastname_one": users_lastname_one,
        "users_lastname_two": users_lastname_two,
        "users_email": users_email,
        "users_password": users_password,
        "users_role": users_role,
        "users_is_active": users_is_active,
    }
    
    try:
        await conn.insert_user(data)
        return {"message": "Producto guardado con éxito"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al insertar producto: {str(e)}")
    
@app.put("/update/users")
async def update_user(
    users_id: int = Form(...),
    users_name: str = Form(...),
    users_lastname_one: str = Form(...),
    users_lastname_two: str = Form(...),
    users_email: str = Form(...),
    users_password: Optional[str] = Form(None),
    users_role: str = Form(...),
    users_is_active: bool = Form(...)
    ):
 
    user = conn.show_userId(users_id= users_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if users_password:
         # Hashear la contraseña
            hashed_password = bcrypt.hashpw(users_password.encode('utf-8'), bcrypt.gensalt())
            # Almacena el hash como cadena
            hashed_password_str= hashed_password.decode('utf-8')
    else:
        hashed_password_str = user["users_password"]  # Mantén la contraseña actual

    data = {
        "users_id": users_id,
        "users_name": users_name,
        "users_lastname_one": users_lastname_one,
        "users_lastname_two": users_lastname_two,
        "users_email": users_email,
        "users_password": hashed_password_str,
        "users_role": users_role,
        "users_is_active": users_is_active,
    }
    try:
        print("Datos que se van a actualizar:", data)
        await conn.update_users(users_id, data)
        return {"Users actualizado": "Usuario actualizado con éxito"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar el usuario: {str(e)}") 

