import psycopg2
from fastapi import HTTPException
from typing import List
from schema.orders_schema import CreateProvinces

class OrdersCustomersConnections():
    connection = None
    # Funcion constructora, se va a llamar siempre que se cre una instancia de esta clase.
    # De momento que intente pasar, excepto si da un error en la operacion de conectarse
    def __init__(self):
        try:
            self.connection = psycopg2.connect("dbname=blog_db user=postgres password=Ainhoa88 host=localhost port=5432")
        except psycopg2.OperationalError as error:
            print(error)
            self.connection.close()

    def get_provinces(self) -> List[CreateProvinces]:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:

            with self.connection.cursor() as cur:
                cur.execute(""" SELECT provinces_id, provinces_name, provinces_cod FROM "provinces";
                """, )
                results = cur.fetchall()
                
                provinces = [
                    CreateProvinces(
                        provinces_id=row[0],
                        provinces_name=row[1],
                        provinces_cod=row[2],
                    ) for row in results
                ]
                return provinces
        except Exception as e:
            print(f"Error al mostrar las provincias: {e}")
            raise HTTPException(status_code=500, detail=f"Error al mostrar las provincias: {e}")
            
    def get_customers(self, customers_email:str)-> None:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:

            with self.connection.cursor() as cur:
                cur.execute(""" 
                    SELECT customers_id, customers_email 
                    FROM "customers"
                    WHERE customers_email= %(customers_email)s;
                """, {"customers_email": customers_email} )
                result = cur.fetchone()

                return {"customers_id": result[0], "customers_email": result[1]}
                
        except Exception as e:
            print(f"Error al traer el cliente: {e}")
            raise HTTPException(status_code=500, detail=f"Error al traer el cliente: {e}")
            

    def insert_customers(self, data:dict)->None:
        print("Insertar cliente.") 

        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            print(f"Datos a insertar: {data}")

            with self.connection.cursor() as cur:
                cur.execute("""
                    INSERT INTO "customers"(customers_name, customers_surname, customers_address_one, customers_address_two, customers_email, customers_phone, customers_provinces_cod, customers_cp) VALUES (%(customers_name)s, %(customers_surname)s, %(customers_address_one)s, %(customers_address_two)s, %(customers_email)s, %(customers_phone)s , %(customers_provinces_cod)s, %(customers_cp)s) RETURNING customers_id ;
                    
                """, data)

                #Obtenemos el id que se crea porque lo necesitamos en el frontend
                customers_id = cur.fetchone()[0]

                #hacemos un commit con los cambios, sin esto no los lleva a la base de datos
                self.connection.commit()

                return customers_id

                # Imprimir un mensaje de éxito
                print("Cliente guardado exitosamente.")
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="Error al insertar el cliente.")
    
    def insert_orders(self, data:dict)->None:
        print("Insertar pedidos llamado.") 

        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            print(f"Datos a insertar: {data}")
            with self.connection.cursor() as cur:
                cur.execute("""
                    INSERT INTO "orders"(orders_date, orders_total, orders_customers_id, orders_number)VALUES (%(orders_date)s, %(orders_total)s, %(orders_customers_id)s, %(orders_number)s) RETURNING orders_id;
                """, data)

                orders_id = cur.fetchone()[0]

                #hacemos un commit con los cambios, sin esto no los lleva a la base de datos
                self.connection.commit()

                return orders_id

                # Imprimir un mensaje de éxito
                print("Pedido guardado exitosamente.")
        
        except Exception as e:
            (f"Error al insertar el producto: {e}")
            raise HTTPException(status_code=500, detail="Error al insertar el pedido.")

    def insert_orderproducts(self, data:dict)->None:
        print("Insertar producto en pedido llamado.") 

        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            print(f"Datos a insertar: {data}")
            with self.connection.cursor() as cur:
                cur.execute("""
                    INSERT INTO "orderproducts"(orderproducts_name, orderproducts_quantity, orderproducts_price, orderproducts_subtotal, orderproducts_orders_id, orderproducts_products_id) VALUES (%(orderproducts_name)s, %(orderproducts_quantity)s, %(orderproducts_price)s, %(orderproducts_subtotal)s, %(orderproducts_orders_id)s, %(orderproducts_products_id)s);
                    
                """, data)
                #hacemos un commit con los cambios, sin esto no los lleva a la base de datos
                self.connection.commit()

                # Imprimir un mensaje de éxito
                print("Producto del pedido guardado exitosamente.")
        
        except Exception as e:
            #print(f"Error al insertar el producto: {e}")
            raise HTTPException(status_code=500, detail="Error al insertar el producto.")
    
    #Vamos a crear un destructor para que siempre que se haga algo en la base de datos se cierre esa conexion
    def __del__(self):
        if self.connection:
            self.connection.close()