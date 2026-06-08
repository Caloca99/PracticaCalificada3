# CALOCA GYM

Ecommerce completo de productos fitness con **dashboard de usuario** y **dashboard de administrador**, autenticacion por sesiones, carrito persistente, checkout simulado y validacion de datos en backend y frontend.

## Tecnologias

- Backend: Node.js, Express.js, MySQL, Joi, bcrypt, express-session, express-mysql-session
- Frontend: Next.js 15 (App Router, export estatico), React 19, CSS puro
- Base de datos local: MySQL con XAMPP
- Base de datos produccion: MySQL en Aiven
- Hosting sugerido: Render

## Estructura

```txt
backend/      API REST con Express (auth, carrito, ordenes, productos)
frontend/     Interfaz web con Next.js (rutas publicas, usuario y admin)
database/     Scripts SQL para crear y poblar la base de datos
```

## Base de datos

Tablas requeridas:

```sql
-- productos
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

-- usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- carrito
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_product (user_id, product_id)
);

-- ordenes
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- detalle de orden
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
```

Ademas, `express-mysql-session` crea automaticamente la tabla `sessions` al iniciar el backend.

### Creacion local con XAMPP

1. Iniciar Apache y MySQL desde XAMPP.
2. Abrir DBeaver y crear una conexion MySQL:
   - Host: `localhost`
   - Port: `3306`
   - User: `root`
   - Password: vacio si XAMPP no tiene clave
3. Ejecutar el archivo `database/schema.sql`.
4. Opcionalmente ejecutar `database/seed.sql` para cargar productos de ejemplo.

## Instalacion local

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Crear el administrador inicial

Tras aplicar el esquema y tener `backend/.env` configurado:

```bash
npm run seed:admin --workspace backend
```

Esto crea `admin@calocagym.com` con la contrasena `Admin1234` (puedes sobreescribirla con variables `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).

### Levantar el proyecto

```bash
npm run dev
```

Servicios locales:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

## Variables de entorno del backend

Local (XAMPP):

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
SESSION_SECRET=cambia-esto-en-produccion
```

Produccion (Aiven en Render):

```env
PORT=4000
NODE_ENV=production
DB_HOST=tu-host-aiven
DB_PORT=tu-puerto-aiven
DB_USER=avnadmin
DB_PASSWORD=tu-password
DB_NAME=defaultdb
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
FRONTEND_URL=https://tu-frontend.onrender.com
SESSION_SECRET=una-cadena-aleatoria-larga
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

## Rutas del frontend

| Ruta | Acceso | Descripcion |
|------|--------|-------------|
| `/` | publico | Redirige a `/login` o `/tienda` segun sesion |
| `/login` | publico | Iniciar sesion |
| `/registro` | publico | Crear cuenta de usuario |
| `/tienda` | usuario | Catalogo fitness y boton "Agregar al carrito" |
| `/carrito` | usuario | Ver, modificar y vaciar el carrito |
| `/checkout` | usuario | Confirmar compra con direccion y telefono |
| `/admin` | admin | Dashboard con metricas y alertas |
| `/admin/productos` | admin | CRUD de productos |
| `/admin/ordenes` | admin | Listado de ordenes |
| `/admin/usuarios` | admin | Listado de usuarios |

## Endpoints REST

### Autenticacion (`/api/auth`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | publico |
| POST | `/api/auth/login` | Iniciar sesion | publico |
| POST | `/api/auth/logout` | Cerrar sesion | usuario |
| GET | `/api/auth/me` | Usuario actual | usuario |

### Productos (`/api/products`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| GET | `/api/products` | Listar productos | publico |
| GET | `/api/products/:id` | Ver producto | publico |
| POST | `/api/products` | Crear producto | admin |
| PUT | `/api/products/:id` | Actualizar producto | admin |
| DELETE | `/api/products/:id` | Eliminar producto | admin |

### Carrito (`/api/cart`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| GET | `/api/cart` | Ver carrito del usuario | usuario |
| POST | `/api/cart/items` | Agregar item | usuario |
| PUT | `/api/cart/items/:id` | Cambiar cantidad | usuario |
| DELETE | `/api/cart/items/:id` | Quitar item | usuario |
| DELETE | `/api/cart` | Vaciar carrito | usuario |

### Ordenes (`/api/orders`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| POST | `/api/orders/checkout` | Confirmar compra | usuario |
| GET | `/api/orders/mine` | Mis ordenes | usuario |
| GET | `/api/orders` | Todas las ordenes | admin |

### Usuarios (`/api/users`)

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| GET | `/api/users` | Listar usuarios | admin |

## Validacion de datos

| Capa | Herramienta | Que cubre |
|------|-------------|-----------|
| Backend body | Joi (auth, cart, order, product) | tipos, rangos, formatos, longitudes |
| Backend params | Joi (`idParamSchema`, `itemIdParamSchema`) | IDs validos y positivos |
| Backend authz | `requireAuth`, `requireAdmin` | proteccion de rutas |
| Backend hashing | bcrypt con 10 salt rounds | contrasenas |
| Backend DB | UNIQUE en `users.email`, FK con CASCADE | integridad relacional |
| Frontend HTML5 | `required`, `minLength`, `pattern`, `type` | feedback inmediato |
| Frontend JS | Validacion extra antes de `fetch` (regex, confirmacion) | evitar requests invalidos |
| Frontend UX | Errores del backend (`details: [...]`) | claridad al usuario |

## Despliegue en Render

El repositorio incluye `render.yaml`, por lo que puedes desplegarlo como Blueprint.

### Aiven MySQL

1. Crear un servicio MySQL en Aiven.
2. Copiar Host, Port, User, Password y Database.
3. Conectar desde DBeaver con SSL.
4. Ejecutar `database/aiven-init.sql` (incluye todas las tablas + seeds).

### Blueprint en Render

1. `New +` > `Blueprint`.
2. Conectar el repositorio.
3. Render detectara `render.yaml` y creara `caloca-gym-api` y `caloca-gym-frontend`.
4. Completar las variables secretas:

```env
# Backend
DB_HOST=...
DB_PORT=...
DB_USER=avnadmin
DB_PASSWORD=...
DB_NAME=defaultdb
FRONTEND_URL=https://caloca-gym-frontend.onrender.com
SESSION_SECRET=una-cadena-aleatoria-larga
```

```env
# Frontend
NEXT_PUBLIC_API_URL=https://caloca-gym-api.onrender.com/api
```

5. Una vez levantado el backend, crear el admin:

```bash
ADMIN_EMAIL=admin@calocagym.com ADMIN_PASSWORD=Admin1234 npm run seed:admin --workspace backend
```

## Credenciales iniciales

- Admin: `admin@calocagym.com` / `Admin1234`
- Usuarios: se registran desde `/registro`

## URL del proyecto en linea

- Frontend Render: pendiente
- Backend Render: pendiente
