import os
from fastapi import UploadFile, File, HTTPException
import psycopg2
from psycopg2 import sql
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
            #self.connection.close()
    
    def get_products(self) -> List[ProductsSchema]:
        try:
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT products_id, products_name, products_description, products_price,products_image_url, products_stock, products_category, products_is_active FROM "products"
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
                    products_category=row[6],
                    products_is_active=row[7]
                    )for row in results
                ] 
                return products
            
        except Exception as e:
            print(f"Error al mostrar los productos: {e}")
            raise HTTPException(status_code=500, detail=f"Error al mostrar los productos: {e}")
    
    def get_product_id(self, products_id: int) -> None:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        
        try:
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT products_id, products_name, products_description, 
                           products_price, products_image_url, products_stock, 
                           products_category, products_is_active
                    FROM "products"
                    WHERE products_id = %s
                """, (products_id,))
                result = cur.fetchone() 

                if result:  
                    return ProductsSchema(
                        products_id=result[0], 
                        products_name=result[1], 
                        products_description=result[2], 
                        products_price=result[3],
                        products_image_url=result[4],
                        products_stock=result[5], 
                        products_category=result[6],
                        products_is_active=result[7]
                    )
                else:
                    return None  
            
        except Exception as e:
            print(f"Error para mostrar el producto: {e}")
            raise
    
    async def save_file(self, products_image_url: UploadFile)-> str:
        print("Guardando archivo...") 
        directory = "images_uploads/products"

        if not os.path.exists(directory):
            os.makedirs(directory)

        file_location = f"images_uploads/products/{products_image_url.filename}"
      
        with open(file_location, "wb") as f:
            f.write(await products_image_url.read())
        return file_location
    
    async def insert_products(self, data:dict)-> None:
        try: 
            print(f"Datos a insertar: {data}")
            
            with self.connection.cursor() as cur:
                cur.execute(sql.SQL("""
                    INSERT INTO "products"(products_name, products_description, products_price, products_image_url, products_stock, products_category, products_is_active) VALUES (%(products_name)s, %(products_description)s, %(products_price)s, %(products_image_url)s, %(products_stock)s, %(products_category)s, %(products_is_active)s);
                """), data)
                
                self.connection.commit()
                print("Producto guardado correctamente.")
        except Exception as e:
            self.connection.rollback()
            print(f"Error al insertar el producto: {e}")
            raise HTTPException(status_code=500, detail="Error al insertar el producto.")

    async def update_products(self, products_id:int, data:dict)->None:
        try:
            print(f"Datos a actualizar: {data}")
            with self.connection.cursor() as cur:
                cur.execute(sql.SQL("""
                    UPDATE "products" SET products_name=%(products_name)s, products_description=%(products_description)s, products_price=%(products_price)s, products_image_url=%(products_image_url)s, products_stock=%(products_stock)s, products_category=%(products_category)s, products_is_active=%(products_is_active)s WHERE products_id = %(products_id)s;
                """), {**data, "products_id": products_id})

                if cur.rowcount == 0:
                    raise HTTPException(status_code=404, detail="Producto no encontrado.")

                self.connection.commit()
                print("Producto actualizado correctamente.")
        except Exception as e:
            self.connection.rollback()
            print(f"Error al actualizar el producto: {e}")
            raise HTTPException(status_code=500, detail="Error al actualizar el producto.")
    
    async def update_products_stock(self, products_id:int, products_stock:int) -> None:
        try:
            print(f"Actualizando el stock del producto {products_id} a {products_stock}.")
            with self.connection.cursor() as cur:
                cur.execute(sql.SQL("""
                    UPDATE "products" SET products_stock=%(products_stock)s WHERE products_id = %(products_id)s;
                """), {"products_stock": products_stock, "products_id": products_id})

                if cur.rowcount == 0:
                    raise HTTPException(status_code=404, detail="Producto no encontrado.")

                self.connection.commit()
                print("Stock actualizado correctamente.")
        except Exception as e:
            self.connection.rollback()
            print(f"Error al actualizar el stock: {e}")
            raise HTTPException(status_code=500, detail="Error al actualizar el stock.")
        
    async def delete_products(self, products_id:int)-> None:
        try:
            print(f"Producto a marcar como inactivo: {products_id}")
            with self.connection.cursor() as cur:
                
                cur.execute(sql.SQL("""
                    UPDATE products SET products_is_active = FALSE WHERE products_id = %s;
                """), (products_id,))

                if cur.rowcount == 0:
                    raise HTTPException(status_code=404, detail="Producto no encontrado.")

                self.connection.commit()
                print("Producto marcado inactivo correctamente.")
        except Exception as e:
            self.connection.rollback() 
            print(f"Error al marcar inactivo el producto: {e}")
            raise HTTPException(status_code=500, detail="Error al marcar inactivo el producto.")

    def __del__(self):
        if self.connection:
            self.connection.close()