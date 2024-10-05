import os
from fastapi import UploadFile, File, HTTPException
import psycopg2
from typing import List
#from fastapi import HTTPException
from schema.products_schema import ProductsSchema

class ProductsConnection():
    connection:True

    def __init__(self):
        try:
            self.connection = psycopg2.connect("dbname=blog_db user=postgres password=Ainhoa88 host=localhost port=5432")
            print("Conexión establecida correctamente")
        except psycopg2.OperationalError as error:
            print(f"Error en la conexion: {error}")
            self.connection.close()
    
    def get_products(self) -> List[ProductsSchema]:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT products_id, products_name, products_description, products_price,products_image_url, products_stock, products_category FROM "products"
                """)
                results = cur.fetchall()
                
                products=[
                    ProductsSchema(
                    products_id= row[0], 
                    products_name=row[1], 
                    products_description= row[2], 
                    products_price=row[3],
                    products_image_url= row[4],
                    products_stock=row[5], 
                    products_category=row[6]
                    )for row in results
                ] 
                return products
            
        except Exception as e:
            print(f"Error para mostrar los productos: {e}")
    
    async def save_file(self, products_image_url:UploadFile)-> str:
        print("Guardando archivo...")  # Añadir este print al inicio
        directory = "images_uploads/products"

        if not os.path.exists(directory):
            os.makedirs(directory)

        file_location = f"images_uploads/products/{products_image_url.filename}"
      
        with open(file_location, "wb") as f:
            f.write(await products_image_url.read())
        return file_location
    
    async def insert_products(self, data:dict)-> None:

        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try: 
            print(f"Datos a insertar: {data}")
            
            with self.connection.cursor() as cur:
                cur.execute("""
                    INSERT INTO "products"(products_name, products_description, products_price, products_image_url, products_stock, products_category) VALUES (%(products_name)s, %(products_description)s, %(products_price)s, %(products_image_url)s, %(products_stock)s, %(products_category)s);
                """, data)
                #hacemos un commit con los cambios, sin esto no los lleva a la base de datos
                self.connection.commit()

                # Imprimir un mensaje de éxito
                print("Producto guardado correctamente.")
        except Exception as e:
            print(f"Error al insertar el producto: {e}")

    async def update_products(self, products_id:int, data:dict)->None:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            print(f"Datos a actualizar: {data}")
            with self.connection.cursor() as cur:
                cur.execute("""
                    UPDATE "products" SET products_name=%(products_name)s, products_description=%(products_description)s, products_price=%(products_price)s, products_image_url=%(products_image_url)s, products_stock=%(products_stock)s, products_category=%(products_category)s WHERE products_id = %(products_id)s;
                """, {**data, "products_id": products_id})

                self.connection.commit()

                print("Producto actualizado correctamente.")
        except Exception as e:
            (f"Error al actualizar el producto: {e}")
            raise HTTPException(status_code=500, detail="Error al actualizar el producto.")
        
    async def delete_products(self, products_id:int)-> None:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            print(f"Producto a eliminar: {products_id}")
            with self.connection.cursor() as cur:
                
                cur.execute("""
                    DELETE FROM "products" WHERE products_id=%s;
                """, (products_id,))

                if cur.rowcount == 0:
                    raise Exception(f"No se encontró el producto con id {products_id}")

                self.connection.commit()

                print("Producto eliminado correctamente.")
        except Exception as e:
            (f"Error al eliminar el producto: {e}")
            raise HTTPException(status_code=500, detail="Error al eliminar el producto.")

    #Vamos a crear un destructor para que siempre que se haga algo en la base de datos se cierre esa conexion
    def __del__(self):
        if self.connection:
            self.connection.close()