# CALOCA GYM

Sistema basico de ecommerce para productos de gimnasio, desarrollado con backend en Express.js, base de datos MySQL y frontend en Next.js. Permite gestionar productos mediante una API RESTful y, al crear un producto, obtiene automaticamente una imagen desde una API externa para guardarla en `image_url`.

## Tecnologias

- Backend: Node.js, Express.js, MySQL, Joi, Morgan, CORS
- Frontend: Next.js, React, CSS
- Base de datos local: MySQL con XAMPP
- Base de datos produccion: MySQL en Aiven
- Hosting sugerido: Render

## Estructura

```txt
backend/      API REST con Express
frontend/     Interfaz web con Next.js
database/     Scripts SQL para crear y poblar la base de datos
```

## Base de datos

Tabla requerida:

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Para crearla localmente con XAMPP:

1. Iniciar Apache y MySQL desde XAMPP.
2. Abrir DBeaver y crear una conexion MySQL:
   - Host: `localhost`
   - Port: `3306`
   - User: `root`
   - Password: vacio, si XAMPP no tiene clave
3. Ejecutar el archivo `database/schema.sql`.
4. Opcionalmente ejecutar `database/seed.sql`.

## Instalacion local

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run dev
```

Servicios locales:

- Frontend local: `http://localhost:3000`
- Backend local: `http://localhost:4000`
- API productos local: `http://localhost:4000/api/products`

## Variables de entorno del backend

Para XAMPP:

```env
PORT=4000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_db
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=false
FRONTEND_URL=http://localhost:3000
```

Para Aiven en Render:

```env
PORT=4000
NODE_ENV=production
DB_HOST=tu-host-aiven
DB_PORT=tu-puerto-aiven
DB_USER=avnadmin
DB_PASSWORD=tu-password
DB_NAME=ecommerce_db
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
FRONTEND_URL=https://tu-frontend.onrender.com
```

## Variables de entorno del frontend

Local:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Render:

```env
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api
```

## Endpoints REST

### Listar productos

```bash
curl http://localhost:4000/api/products
```

### Mostrar producto por ID

```bash
curl http://localhost:4000/api/products/1
```

### Crear producto con imagen automatica

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Proteina Whey 2 lb\",\"description\":\"Proteina para recuperacion muscular despues del entrenamiento\",\"price\":139.90,\"stock\":20}"
```

El backend consulta FakeStoreAPI y, si falla, genera una URL con Lorem Picsum. La URL se guarda en `image_url`.

### Actualizar producto

```bash
curl -X PUT http://localhost:4000/api/products/1 \
  -H "Content-Type: application/json" \
  -d "{\"price\":64.90,\"stock\":15}"
```

### Eliminar producto

```bash
curl -X DELETE http://localhost:4000/api/products/1
```

## Despliegue en Render

### Backend

1. Subir el codigo a GitHub.
2. Crear un Web Service en Render.
3. Configurar:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Agregar las variables de entorno del backend con los datos de Aiven.
5. Crear la tabla `products` en Aiven usando `database/schema.sql` desde DBeaver.

### Frontend

1. Crear un Static Site en Render.
2. Configurar:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `out`
3. Agregar `NEXT_PUBLIC_API_URL` con la URL del backend.

## URL del proyecto en linea

- Frontend Render: pendiente
- Backend Render: pendiente

Reemplazar estas URLs cuando el proyecto quede publicado.
