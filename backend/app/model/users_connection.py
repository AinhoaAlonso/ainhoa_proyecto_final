import psycopg2
import bcrypt
from fastapi import HTTPException

from typing import List
from schema.users_schema import ResponseUsersSchema

class UsersConnection():
    connection = None
    # Funcion constructora, se va a llamar siempre que se cre una instancia de esta clase.
    # De momento que intente pasar, excepto si da un error en la operacion de conectarse
    def __init__(self):
        try:
            self.connection = psycopg2.connect("dbname=blog_db user=postgres password=Ainhoa88 host=localhost port=5432")
        except psycopg2.OperationalError as error:
            print(error)
            self.connection.close()
    
    def show_users(self) -> List[ResponseUsersSchema]:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT users_id, users_email, users_role FROM "users"
                """)
                results = cur.fetchall()

                users = [
                    ResponseUsersSchema(users_id = row[0], users_email= row[1], users_role= row[2])
                    for row in results
                ]
                return users
        except Exception as e:
            print(f"Error para mostrar los posts: {e}")

    #Funcion para escribir los datos del usuario
    def write(self,data):
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            # Hashear la contraseña
            hashed_password = bcrypt.hashpw(data['users_password'].encode('utf-8'), bcrypt.gensalt())
            # Almacena el hash como cadena
            data['users_password'] = hashed_password.decode('utf-8')

            #Con esto empezamos a interactuar con nuestra db
            with self.connection.cursor() as cur:
                cur.execute("""
                    INSERT INTO  "users" (users_name, users_lastname_one, users_lastname_two, users_email, users_password, users_role) VALUES (%(users_name)s, %(users_lastname_one)s, %(users_lastname_two)s, %(users_email)s, %(users_password)s, %(users_role)s)
                """, data)
                #hacemos un commit con los cambios, sin esto no los lleva a la base de datos
                self.connection.commit()
        except Exception as e:
            print(f"Error al insertar el usuario: {e}")


    def login_users(self, email:str, password:str) -> ResponseUsersSchema:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT users_id, users_email, users_password, users_role FROM "users"
                    WHERE users_email = %s
                """, (email,))
                results = cur.fetchone()
                
                if results is None:
                    raise HTTPException(status_code=400, detail="Usuario no encontrado")

                users_id, users_email, users_password, users_role = results
                if not bcrypt.checkpw(password.encode('utf-8'), users_password.encode('utf-8')):
                    raise HTTPException(status_code=400, detail="Contraseña incorrecta")

                return ResponseUsersSchema(
                    users_id=users_id, 
                    users_email=users_email, 
                    users_role=users_role
                    )
                
        except Exception as e:
            print(f"Error para mostrar los usuarios: {e}")
            raise HTTPException(status_code=500, detail="Error interno del servidor")

    #Vamos a crear un destructor para que siempre que se haga algo en la base de datos se cierre esa conexion
    def __del__(self):
        if self.connection:
            self.connection.close()
