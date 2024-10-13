import os
from dotenv import load_dotenv
import psycopg2
import bcrypt
from fastapi import HTTPException

from typing import List, Optional
from app.schema.users_schema import ResponseUsersSchema

load_dotenv()

class UsersConnection():
    connection = None
    def __init__(self):
        try:
            self.connection = psycopg2.connect(os.getenv("DATABASE_URL"))
        except psycopg2.OperationalError as error:
            print(error)
            self.connection.close()
    
    def show_users(self) -> List[ResponseUsersSchema]:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT users_id, users_name, users_lastname_one, users_lastname_two, users_email, users_role, users_is_active FROM "users"
                """)
                results = cur.fetchall()

                users = [
                    ResponseUsersSchema(
                        users_id = row[0],
                        users_name = row[1],
                        users_lastname_one = row[2],
                        users_lastname_two = row[3],
                        users_email= row[4], 
                        users_role= row[5],
                        users_is_active = row[6]
                        )for row in results
                ]
                return users
        except Exception as e:
            print(f"Error para mostrar los posts: {e}")
    
    def show_userId(self, users_id: int) -> Optional[dict]:
        """Obtiene un único usuario de la base de datos por su ID."""
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT users_id, users_name, users_lastname_one, users_lastname_two, users_email, users_password, users_role, users_is_active
                    FROM "users" WHERE users_id = %s
                """, (users_id,))
                result = cur.fetchone()
                if result:
                    # Devuelve un diccionario con los datos del usuario
                    return {
                        "users_id": result[0],
                        "users_name": result[1],
                        "users_lastname_one": result[2],
                        "users_lastname_two": result[3],
                        "users_email": result[4],
                        "users_password": result[5],  # Incluye la contraseña para uso interno
                        "users_role": result[6],
                        "users_is_active": result[7]
                    }
                return None  # Devuelve None si el usuario no se encuentra
        except Exception as e:
            print(f"Error al obtener el usuario por ID: {e}")
            return None

    async def insert_user(self,data:dict) -> None:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            # Hashear la contraseña
            hashed_password = bcrypt.hashpw(data['users_password'].encode('utf-8'), bcrypt.gensalt())
            # Almacena el hash como cadena
            data['users_password'] = hashed_password.decode('utf-8')

            with self.connection.cursor() as cur:
                cur.execute("""
                    INSERT INTO  "users" (users_name, users_lastname_one, users_lastname_two, users_email, users_password, users_role, users_is_active) VALUES (%(users_name)s, %(users_lastname_one)s, %(users_lastname_two)s, %(users_email)s, %(users_password)s, %(users_role)s, %(users_is_active)s)
                """, data)
                self.connection.commit()
        except Exception as e:
            print(f"Error al insertar el usuario: {e}")

    async def update_users(self, users_id:int, data:dict)->None:
        try:
            print(f"Usuario a actualizar: {data}")

            print(f"""UPDATE "users" SET users_name='{data['users_name']}', 
                      users_lastname_one='{data['users_lastname_one']}', 
                      users_lastname_two='{data['users_lastname_two']}', 
                      users_email='{data['users_email']}', 
                      users_password='{data['users_password']}', 
                      users_role='{data['users_role']}', 
                      users_is_active={data['users_is_active']} 
                      WHERE users_id = {users_id};""")
            

            with self.connection.cursor() as cur:
                cur.execute("""
                    UPDATE "users" SET users_name=%(users_name)s, users_lastname_one=%(users_lastname_one)s, users_lastname_two=%(users_lastname_two)s, users_email=%(users_email)s, users_password=%(users_password)s, users_role=%(users_role)s, users_is_active=%(users_is_active)s WHERE users_id = %(users_id)s;
                """, {**data, "users_id": users_id})

                print("Rowcount después de actualizar:", cur.rowcount)
                
                if cur.rowcount == 0:
                    raise HTTPException(status_code=404, detail="Usuario no encontrado.")

                self.connection.commit()
                print("Usuario actualizado correctamente.")
        except Exception as e:
            self.connection.rollback()
            print(f"Error al actualizar el usuario: {e}")
            raise HTTPException(status_code=500, detail="Error al actualizar el usuario.")


    def login_users(self, email:str, password:str) -> ResponseUsersSchema:
        if self.connection is None:
            raise Exception("Conexión a la base de datos no establecida")
        try:
            with self.connection.cursor() as cur:
                cur.execute("""
                    SELECT users_id, users_name, users_lastname_one, users_lastname_two, users_email, users_password, users_role, users_is_active 
                    FROM "users"
                    WHERE users_email = %s
                """, (email,))
                results = cur.fetchone()
                
                if results is None:
                    raise HTTPException(status_code=400, detail="Usuario no encontrado")

                users_id, users_name, users_lastname_one, users_lastname_two, users_email, users_password, users_role, users_is_active = results

                if not bcrypt.checkpw(password.encode('utf-8'), users_password.encode('utf-8')):
                    raise HTTPException(status_code=400, detail="Contraseña incorrecta")

                if not users_is_active:
                    raise HTTPException(status_code=403, detail="Usuario inactivo")

                return ResponseUsersSchema(
                    users_id=users_id,
                    users_name=users_name,
                    users_lastname_one=users_lastname_one,
                    users_lastname_two=users_lastname_two,
                    users_email=users_email,
                    users_role=users_role,
                    users_is_active=users_is_active,
                    )
                
        except Exception as e:
            print(f"Error para mostrar los usuarios: {e}")
            raise HTTPException(status_code=500, detail="Error interno del servidor")

    def __del__(self):
        if self.connection:
            self.connection.close()
