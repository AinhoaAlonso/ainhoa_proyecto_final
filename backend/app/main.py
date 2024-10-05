from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status, Depends
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
from datetime import date


#Importo la uvicacion donde tengo la conexion a la bbdd postgres
from model.users_connection import UsersConnection
from model.posts_connection import PostsConnection
from model.products_connection import ProductsConnection
from model.auth import create_token
from model.auth import verify_token
from model.orders_customers_connection import OrdersCustomersConnections
from schema.users_schema import CreateUsersSchema
from schema.posts_schema import PostSchema
from schema.posts_schema import PostsResponseSchema
from schema.users_schema import LoginSchema
from schema.users_schema import LoginResponseSchema
from schema.token_schema import TokenSchema
from schema.products_schema import InsertProductsSchema
from schema.orders_schema import CreateOrderProductsSchema
from schema.orders_schema import CreateCustomers
from schema.orders_schema import CreateOrdersSchema

#Creo instancias
app = FastAPI()
conn = UsersConnection()
connp = PostsConnection()
connproducts = ProductsConnection()
connorders = OrdersCustomersConnections()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:3000/login"],  # Permitir todas las solicitudes de cualquier origen
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)
# ponemos decoradores que lo que hace es registrar la función, tenemos que decidir que funcion se va a ejecutar cuando llamemos a esta ruta(justo la que está debajo)

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
         raise HTTPException(status_code=500, detail=f"Error al actualizar post: {str(e)}")

@app.delete("/delete/posts/{posts_id}")
async def delete_post(posts_id: int):
    try:
        await connp.delete_posts(posts_id)
        return {"Delete Post": "Post eliminado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar post: {str(e)}")
    

@app.get("/products")
def get_products():
    products= connproducts.get_products()
    return products

@app.post("/insert/products")
async def insert_products(
    products_name: str = Form(...),
    products_description: str = Form(...),
    products_price: float = Form(...),
    products_stock: int = Form(...),
    products_category: str = Form(...),
    products_image_url: str = File(...)
    ):
    
    data = {
        "products_name": products_name,
        "products_description": products_description,
        "products_price": products_price,
        "products_stock": products_stock,
        "products_category": products_category,
        "products_image_url": products_image_url,
    }
    
    try:
        await connproducts.insert_products(data)
        return {"message": "Producto guardado con éxito"}
    except Exception as e:
        #return {"error": str(e)}
        raise HTTPException(status_code=500, detail=f"Error al insertar producto: {str(e)}")

@app.put("/update/products")
async def update_product(
    products_id: int = Form(...),
    products_name: str = Form(...),
    products_description: str = Form(...),
    products_price: float = Form(...),
    products_stock: int = Form(...),
    products_category: str = Form(...),
    products_image_url: str = File(...)
    ):
    
    data = {
        "products_name": products_name,
        "products_description": products_description,
        "products_price": products_price,
        "products_stock": products_stock,
        "products_category": products_category,
        "products_image_url": products_image_url,
    }
    try:
        await connproducts.update_products(products_id, data)
        return {"Update Product": "Producto actualizado con éxito"}
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Error al actualizar el producto: {str(e)}") 
    
@app.delete("/delete/products/{products_id}")
async def delete_product(products_id: int):
    try:
        await connproducts.delete_products(products_id)
        return {"Delete Product": "Producto eliminado correctamente"}
    except Exception as e:
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
            access_token=access_token
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/insert/customers")
def customers_insert(customers_data: CreateCustomers):
    data = customers_data.model_dump()
    try:
        customers_id = connorders.insert_customers(data)
        return{
            "customers_id": customers_id,
            **data #Lo combinamos con los datos originales
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
    #data = orders_data.model_dump()
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
            **data #Lo combinamos con los datos originales
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al insertar pedido: {str(e)}")

@app.get("/users")
def show_users():
    users = conn.show_users()
    return users


@app.post("/user/insert")
def users_insert(users_data:CreateUsersSchema):
    #para que se nos muestre como un diccionario clave/valor más visual
    data = users_data.model_dump()
    # Ahora ya no lo vamos a imprimir, vamos a llamar a la funcion write para que lo escriba. Esta función está dentro de user_connection.py
    #print(data)
    conn.write(data)

