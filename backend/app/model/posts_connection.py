import psycopg2
import os
from dotenv import load_dotenv
from typing import List
from fastapi import HTTPException
from app.schema.posts_schema import PostSchema

load_dotenv()
class PostsConnection():
    connection = None

    def __init__(self):
        try:
            self.connection = psycopg2.connect(os.getenv("DATABASE_URL"))
        except psycopg2.OperationalError as error:
            print(error)
            self.connection.close()
    
    # Vamos a crear una funcion que nos traiga nuestros posts
    def show_posts(self) -> List[PostSchema]:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT posts_id, posts_title, posts_content, posts_author, posts_date, posts_users_id, posts_image_url FROM "posts"
                """)
                 # No utilizamos data cuando queremos traer todos los posts de la base de datos, no necesita argumentos
                #Traemos los posts
                results = cur.fetchall()

                posts = [
                    PostSchema(posts_id = row[0], posts_title = row[1], posts_content= row[2], posts_author= row [3], posts_date= row [4], posts_users_id =row[5], posts_image_url= row[6])
                    for row in results
                ]
                return posts
        except Exception as e:
            print(f"Error para mostrar los posts: {e}")
    
    async def insert_posts(self, data:dict)->None:
        print("Llamamos a insertar pedidos")

        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            print(f"Datos a insertar: {data}")
            with self.connection.cursor() as cur:
                cur.execute("""
                    INSERT INTO "posts" (posts_title, posts_users_id, posts_date, posts_content, posts_author, posts_image_url) VALUES (%(posts_title)s, %(posts_users_id)s, %(posts_date)s, %(posts_content)s, %(posts_author)s, %(posts_image_url)s);
                """, data)

                self.connection.commit()

                print("Post guardado correctamente.")
        except Exception as e:
            (f"Error al insertar el producto: {e}")
            raise HTTPException(status_code=500, detail="Error al insertar el post.")
    
    async def update_posts(self, posts_id:int, data:dict)->None:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            print(f"Datos a actualizar: {data}")
            with self.connection.cursor() as cur:
                cur.execute("""
                    UPDATE "posts" SET posts_title=%(posts_title)s, posts_users_id=%(posts_users_id)s, posts_date=%(posts_date)s, posts_content=%(posts_content)s, posts_author=%(posts_author)s, posts_image_url=%(posts_image_url)s WHERE posts_id=%(posts_id)s;
                """, {**data, "posts_id": posts_id})

                self.connection.commit()

                print("Post actualizado correctamente.")
        except Exception as e:
            (f"Error al actualizar el post: {e}")
            raise HTTPException(status_code=500, detail="Error al actualizar el post.")

    async def delete_posts(self, posts_id:int)-> None:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            print(f"Post a eliminar: {posts_id}")
            with self.connection.cursor() as cur:
                
                cur.execute("""
                    DELETE FROM "posts" WHERE posts_id=%s;
                """, (posts_id,))

                if cur.rowcount == 0:
                    raise Exception(f"No se encontró el post con posts_id {posts_id}")

                self.connection.commit()

                print("Post eliminado correctamente.")
        except Exception as e:
            (f"Error al eliminar el post: {e}")
            raise HTTPException(status_code=500, detail="Error al eliminar el post.")
        
    #Vamos a crear un destructor para que siempre que se haga algo en la base de datos se cierre esa conexion
    def __del__(self):
        if self.connection:
            self.connection.close()