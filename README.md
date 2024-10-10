# Blog de Organización y Limpieza

Este proyecto es un blog dedicado a la organización y limpieza del hogar, que incluye una tienda en línea para la compra de productos de organización. Además, cuenta con un acceso para administradores donde los usuarios pueden iniciar sesión mediante una interfaz segura.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)

## Características

- **Blog de Organización**: Publicaciones y artículos sobre consejos y trucos para mantener un hogar organizado y limpio.
- **Tienda en Línea**: Opción para comprar productos de organización directamente desde el blog.
- **Acceso para Administradores**: Interfaz de inicio de sesión para administradores, autenticación a través de una base de datos.
- **Gestión de Usuarios**: Los administradores pueden gestionar usuarios, productos y los posts del blog

## Tecnologías Utilizadas

- **Base de Datos**: PostgreSQL
- **Backend**: FastAPI con `psycopg2` para la conexión a la base de datos.
- **Frontend**: React utilizando Redux para el manejo del estado y otros componentes para una experiencia de usuario interactiva.

## Instalación

Instrucciones paso a paso sobre cómo instalar y ejecutar el proyecto:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/nombre_del_proyecto.git
   ```

2. Navega al directorio del proyecto:

  ```bash
  cd nombre_del_proyecto
   ```

3. Backend: Accede al directorio del backend e instala las dependencias:

  ```bash
  Copiar código
  cd backend
  pip install -r requirements.txt

4.Configura la base de datos PostgreSQL:

  Crea la base de datos necesaria y ajusta la configuración de conexión en el archivo de configuración.

5.Frontend: Accede al directorio del frontend e instala las dependencias:

  ```bash
  Copiar código
  cd ../frontend
  npm install

6.Ejecuta el backend y el frontend:

    Para el backend:
    bash
    Copiar código
    uvicorn main:app --reload

    Para el frontend:
    bash
    Copiar código
    npm start
## Uso
Abre tu navegador y visita http://localhost:3000 para acceder al blog.
Los usuarios pueden explorar las publicaciones y la tienda.
Los administradores pueden iniciar sesión utilizando sus credenciales, que se validan contra la base de datos.
