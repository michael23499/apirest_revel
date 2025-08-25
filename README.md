# 🚀 API REST - PRUEBA TÉCNICA PARA EL PUESTO DE SENIOR BACKEND DEVELOPER Revel (Node.js + PostgreSQL)

Este proyecto es una API RESTful construida con **Node.js, Express, Sequelize y PostgreSQL**.  
Incluye autenticación con **JWT**, soporte **HTTPS con certificados auto-firmados**, y documentación generada con **Swagger**.

---

## 📂 Estructura del proyecto

├── config/ # Configuración de Sequelize y DB
├── controllers/ # Lógica de controladores (User, Product, etc.)
├── middleware/ # Middlewares (error, handler, auth, etc.)
├── models/ # Modelos Sequelize
├── routes/ # Definición de rutas API
├── services/ # Lógica de negocio (userService, productService.)
├── utils/ # Utilidades (JWT, Swagger, mensajes de error, etc.)
├── certs/ # Certificados HTTPS (se generan en runtime si no existen)
├── tests.js # Pruebas unitarias/integración
├── server.js # Punto de entrada principal
└── .env # Variables de entorno

---

npm install --save-dev jest

## 📦 Dependencias principales

| Dependencia      | Descripción                                                                 | Instalación                |
| ---------------- | --------------------------------------------------------------------------- | -------------------------- |
| **express**      | Framework para construir la API REST.                                       | `npm install express`      |
| **sequelize**    | ORM para interactuar con PostgreSQL de manera sencilla.                     | `npm install sequelize`    |
| **pg**           | Cliente de PostgreSQL para Node.js.                                         | `npm install pg`           |
| **pg-hstore**    | Utilidad para serializar datos JSON en PostgreSQL, requerida por Sequelize. | `npm install pg-hstore`    |
| **bcryptjs**     | Cifrado de contraseñas y comparación segura de hashes.                      | `npm install bcryptjs`     |
| **jsonwebtoken** | Manejo de autenticación mediante tokens JWT.                                | `npm install jsonwebtoken` |
| **dotenv**       | Carga de variables de entorno desde `.env`.                                 | `npm install dotenv`       |
| **cors**         | Configuración de CORS para permitir peticiones desde el frontend.           | `npm install cors`         |

### 🧪 Dependencias de desarrollo

| Dependencia           | Descripción                                      | Instalación                                |
| --------------------- | ------------------------------------------------ | ------------------------------------------ |
| **jest**              | Framework de testing.                            | `npm install --save-dev jest`              |
| **supertest**         | Simulación de peticiones HTTP para tests.        | `npm install --save-dev supertest`         |
| **faker**             | Generación de datos falsos para pruebas.         | `npm install --save-dev faker`             |
| **express-validator** | Validación y saneamiento de entradas de usuario. | `npm install --save-dev express-validator` |

### 🔑 Dependencias adicionales

| Dependencia            | Descripción                                                               | Instalación                      |
| ---------------------- | ------------------------------------------------------------------------- | -------------------------------- |
| **selfsigned**         | Generación de certificados SSL auto-firmados para HTTPS.                  | `npm install selfsigned`         |
| **swagger-jsdoc**      | Generación de documentación Swagger a partir de comentarios en el código. | `npm install swagger-jsdoc`      |
| **swagger-ui-express** | Servir la documentación Swagger en la ruta `/api/docs`.                   | `npm install swagger-ui-express` |

### 💻 Instalación completa

```bash
npm install
npm install express sequelize pg pg-hstore bcryptjs jsonwebtoken dotenv cors
npm install --save-dev jest supertest faker express-validator
npm install selfsigned swagger-jsdoc swagger-ui-express
```

⚙️ Configuración

1. Clona el repositorio:

git clone [<url-del-repo>](https://github.com/michael23499/apirest_revel.git)
cd apirest_reveltest

2. Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

Explicar mas

# ===============================

# 🔑 Configuración de seguridad

# ===============================

JWT_SECRET=IA0wFYh0DahqKoFnX3dvwJYItn0u26h5zAD/dy1cIvJ4ZFmsNMKBLRlb2MG3Y4I9

<!-- El setup_secret servira para crear el primer administrator de la api, es de un solo uso -->

SETUP_SECRET=clave-super-secreta

# ===============================

# 🗄️ Configuración de la base de datos

# ===============================

DB_NAME=apirest_revel
DB_USER=admin
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5432

# ===============================

# 🌐 Configuración del servidor

# ===============================

PORT=3000

# ===============================

# 🔒 Certificados SSL (para HTTPS)

# ===============================

SSL_KEY_PATH=./certs/key.pem
SSL_CERT_PATH=./certs/cert.pem

3. Crear base de datos y usuario en PostgreSQL

## Crear usuario

CREATE USER admin WITH PASSWORD 'admin';

## Crear base de datos

CREATE DATABASE apirest_revel OWNER admin;

## Otorgar permisos completos al usuario

GRANT ALL PRIVILEGES ON DATABASE apirest_revel TO admin;

🗄️ Base de Datos – Detalles Técnicos

Para la gestión de datos se ha utilizado PostgreSQL como base de datos relacional y Sequelize como ORM.
● ORM: Sequelize
● Base de datos: PostgreSQL
● Modelos implementados:
● User: Usuarios de la aplicación, con roles (user o administrator) y campos name, email, password, role.
● Product: Productos registrados por los usuarios, con campos name, description, price, category, stock y isActive.

Relaciones:

● Un User puede tener muchos Product.
● Un Product pertenece a un User.
● Sincronización automática: Sequelize crea o actualiza las tablas al iniciar la aplicación.

4. (Opcional) Si necesitas reiniciar el esquema:

Si quieres limpiar la base de datos y reiniciar el esquema, ejecuta los siguientes comandos SQL en PostgreSQL:

`DROP TABLE IF EXISTS users, products CASCADE`;
`DROP TYPE IF EXISTS user_role`;
⚠️ Advertencia: Esto eliminará todas las tablas y datos existentes.

5. Ejecutar la aplicación

`npm start`

El servidor se iniciara y estara disponible en: http://localhost:3000

    📖 Documentación Swagger **Extra**

      Una vez corriendo el servidor, accede a la documentación interactiva en: https://localhost:3000/api/docs

La API corre bajo HTTPS usando certificados auto-firmados generados automáticamente.

1. Pruebas unitarias y de integración poblando con datos de prueba
   Este proyecto incluye pruebas unitarias para los **controladores de usuarios y productos**, utilizando **Jest** como framework de testing.
   Nota: Jest ya debe estar incluido en devDependencies de tu package.json.

   Estructura de las pruebas
   tests/userController.test.js → Pruebas unitarias del UserController.
   tests/productController.test.js → Pruebas unitarias del ProductController.
   Se utilizan mocks de los servicios y modelos para no interactuar con la base de datos real.
   Se simula req, res y next de Express para probar los controladores de forma aislada.

   Para las pruebas de integración también se ejecutara un archivo tests/user_product_test.test.js.
   Limpiara la bdd y crea usuarios y productos de prueba.
   Verifica que todos los endpoints y validaciones funcionan correctamente.
   Los datos generados sirven como semilla para probar la API.
   `npm test`

📌 Endpoints principales:

🔐 Autenticación

Registro de **usuario**:
Método: POST.
URL: https://localhost:3000/api/users/register
Autenticación: No requerida (registro público)

Descripción:
Permite registrar un nuevo usuario en la aplicación.
Todos los campos (name, email, password) son obligatorios.
El correo electrónico debe ser único en la base de datos.
La contraseña se almacena cifrada automáticamente mediante bcrypt.

Body JSON:

```JSON
{
    "message": "Usuario registrado correctamente",
    "user": {
        "id": 1,
        "name": "Michael",
        "email": "michael2@gmail.com",
        "createdAt": "2025-08-25T00:08:54.529Z"
    }
}
```

Respuestas JSON: ✅ 200 OK – Registro exitoso

```JSON
{
    "message": "Usuario registrado correctamente",
    "userId": 1
}
⚠️ 400 Bad Request – Error de validación

Correo ya registrado:

{
"error": "Este correo electrónico ya se encuentra registrado"
},
{
"error": "Todos los campos son obligatorios"
}
⚠️ 500 Internal Server Error – Error del servidor
{
"error": "Error en el servidor"
}
```

Login de **usuario/administrator**:
Método: POST.
URL: https://localhost:3000/api/users/login
Autenticación: No requerida

Descripción:
Permite a un usuario o administrador autenticarse en la aplicación.
Se requiere correo electrónico y contraseña.
Retorna un token JWT válido por 30 minutos para acceder a los endpoints protegidos.
El token incluye información de id y role del usuario.

Body JSON:

```JSON
{
  "email": "michael@gmail.com",
  "password": "123456"
}
```

Respuestas JSON: ✅ 200 OK – Login exitoso

```JSON
{
{
    "message": "El usuario Michael ha iniciado sesión con éxito.",
    "user": {
        "id": 7,
        "name": "Michael",
        "email": "michael22@gmail.com"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6InVzZXIiLCJpYXQiOjE3NTYwODE1OTIsImV4cCI6MTc1NjA4MzM5Mn0.NXolsOlkpMI-MvJm5OkUtCx0sb4z3cNzYUtORTEiAVQ"
}
}
⚠️ 401 Unauthorized – Credenciales inválidas

Usuario no encontrado:

{
  "error": "Credenciales inválidas"
},
Contraseña incorrecta:
{
  "error": "Error al comparar las contraseñas"
}
⚠️ 500 Internal Server Error – Error del servidor
{
  "error": "Error en el servidor"
}
```

🔑 Notas importantes

El token devuelto debe incluirse en los headers Authorization para acceder a endpoints protegidos:
Authorization: Bearer <access_token>
Usuarios normales solo podrán acceder a sus propios recursos.
Administradores (role: "administrator") pueden acceder y modificar todos los recursos según permisos.
La expiración del token es 30 minutos (expires_in: 1800).

**👤Crear Super Administrator (Primer Administrator)**:
Método: POST.
URL: https://localhost:3000/api/setup-admin/
Autenticación: No requerida (pero se necesita el SETUP_SECRET)

Descripción:

Permite crear el primer administrador de la aplicación.
Solo se puede usar una vez mientras no exista ningún administrador.
Requiere el secret definido en el .env (SETUP_SECRET) para mayor seguridad.
Devuelve los datos del administrador creado.

Body JSON:

```JSON
{
  "name": "Super Admin",
  "email": "admin@example.com",
  "password": "123456",
  "secret": "clave-super-secreta"
}
⚠️ Nota: Si se cambia SETUP_SECRET en el .env, se debe actualizar aquí también.
```

Respuestas JSON: ✅ 201 Created – Administrador creado exitosamente

```JSON
{
    "message": "Administrador creado exitosamente",
    "user": {
        "id": 4,
        "name": "Super Admin",
        "email": "admin@example.com",
        "role": "administrator"
    }
}
⚠️ 403 Forbidden – Secret inválido
{
  "error": "Acceso denegado: token secreto inválido"
}
⚠️ 400 Bad Request – Administrador ya existe
{
  "error": "Ya existe un administrador, este endpoint está bloqueado."
}
⚠️ 500 Internal Server Error – Error del servidor
{
  "error": "Error en el servidor"
}
```

🔑 Notas importantes

Este endpoint solo se usa para el primer administrador.
El password será almacenado hasheado automáticamente.
Una vez creado el primer administrador, este endpoint quedará bloqueado hasta que no haya administradores en la base de datos.

**👤Crear un Administrator**:
Método: POST.
URL: https://localhost:3000/api/users/admin/
Autenticación: JWT obligatorio de un administrador existente.
Body JSON:

```JSON
{
  "name": "Nuevo Admin",
  "email": "administrator@example.com",
  "password": "123456"
}
```

Respuestas JSON:
✅ 201 Created – Administrador creado correctamente

```JSON
{
    "message": "Administrador creado exitosamente",
    "user": {
        "id": 2,
        "name": "Nuevo Admin",
        "email": "administrator@example.com",
        "role": "administrator"
    }
}
⚠️ 400 Bad Request – Error de validación

Campos obligatorios faltantes:

{
"error": "Todos los campos son obligatorios"
}
📨 Correo ya registrado:

{
"error": "Este correo electrónico ya se encuentra registrado"
}
⚠️ 403 Forbidden – Usuario no autorizado
{
"error": "Acceso denegado: solo administradores pueden crear otro admin"
}
⚠️ 500 Internal Server Error – Error del servidor
{
"error": "Error en el servidor"
}
```

🔑 Notas importantes:

JWT válido de un administrador existente es obligatorio.
No se permite crear múltiples administradores con el mismo correo.
La contraseña se guarda hashada por seguridad.
Usar este endpoint con precaución, ya que otorga permisos administrativos completos.

**❌ Eliminar un Usuario**:
Método: DELETE.
URL: https://localhost:3000/api/users/delete/:id/
Autenticación: Requiere JWT de un usuario con rol administrator

Descripción:

Permite que un administrador elimine usuarios con rol user.
No se puede eliminar a otros administradores.
No se puede eliminar a sí mismo.
Devuelve un mensaje de confirmación al eliminar correctamente al usuario.

Parámetros URL:

| Parámetro | Tipo | Descripción               |
| --------- | ---- | ------------------------- |
| id        | int  | ID del usuario a eliminar |

Respuesta JSON:
✅ 200 OK – Usuario eliminado correctamente

```JSON
{
  "message": "Usuario eliminado correctamente",
    "user": {
        "name": "Michael",
        "email": "michael@gmail.com"
    }
}
⚠️ 403 Forbidden – Intento de acción no permitida

Si intenta eliminarse a sí mismo:

{
  "error": "No puedes eliminarte a ti mismo"
},
Si intenta eliminar otro administrador:

{
  "error": "No puedes eliminar a otro administrador"
}
⚠️ 404 Not Found – Usuario no encontrado
{
  "error": "Usuario no encontrado"
}
⚠️ 500 Internal Server Error – Error del servidor
{
  "error": "Error en el servidor"
}
```

🔑 Notas importantes

Solo los administradores pueden usar este endpoint.
El usuario a eliminar debe tener rol user.
Devuelve error si se intenta eliminar un administrador o al propio admin que hace la petición.

📦 API de Productos

1. Esta API permite a los usuarios crear, leer, actualizar, eliminar y buscar productos.
2. Los usuarios normales solo pueden ver y modificar sus propios productos.
3. Los administradores pueden ver y modificar todos los productos.
4. Todas las rutas requieren JWT Bearer Token en el header:
   **Authorization: Bearer <tu_jwt_token>**

⚙️ Endpoints

| #   | Método & Endpoint         | Rol         | Body / Headers | Respuesta            | Notas                        |
| --- | ------------------------- | ----------- | -------------- | -------------------- | ---------------------------- |
| 1   | POST /api/products        | user/admin  | JSON + JWT     | Producto creado      | Nombre y precio obligatorios |
| 2   | GET /api/products         | user/admin  | JWT            | Array de productos   | Admin ve todos               |
| 3   | GET /api/products/\:id    | dueño/admin | JWT            | Producto             | Solo dueño o admin           |
| 4   | PUT /api/products/\:id    | dueño/admin | JSON + JWT     | Producto actualizado | Solo dueño o admin           |
| 5   | DELETE /api/products/\:id | dueño/admin | JWT            | Mensaje confirmación | Solo dueño o admin           |
| 6   | GET /api/products/search  | user/admin  | JWT + query    | Array de productos   | Búsqueda avanzada            |

✅ Crear un Producto:
Método: POST
URL: https://localhost:3000/api/products/
Autenticación: Requiere JWT (usuario o administrador)

Descripción:
Permite a un usuario o administrador crear un nuevo producto.
El campo name y price son obligatorios.

Body JSON:

```JSON
{
  "name": "Producto 1",
  "description": "Descripción del producto",
  "price": 199.99,
  "category": "Electrónica",
  "stock": 10,
  "isActive": true
}
Respuestas JSON:
✅ 201 Created – Producto creado correctamente
{
  "id": 1,
  "name": "Producto 1",
  "description": "Descripción del producto",
  "price": "199.99",
  "category": "Electrónica",
  "stock": 10,
  "isActive": true,
  "userId": 2,
  "createdAt": "2025-08-23T10:00:00.000Z",
  "updatedAt": "2025-08-23T10:00:00.000Z"
}
⚠️ 400 Bad Request – Datos incompletos o inválidos

{
  "error": "Nombre y precio son obligatorios"
}


⚠️ 500 Internal Server Error – Error del servidor

{
  "error": "Error al crear producto"
}
```

🔑 Notas importantes:

Todos los endpoints requieren JWT válido.
Solo los campos name y price son obligatorios.
El producto se asocia automáticamente al usuario que crea el recurso.

✅ Listar Productos:
Método: GET
URL: https://localhost:3000/api/products/
Autenticación: Requiere JWT (usuario o administrador)

Descripción:
Permite obtener los productos registrados en la aplicación.
Usuarios normales: obtienen únicamente los productos que ellos mismos crearon.
Administradores: obtienen todos los productos registrados en la plataforma.

Body JSON:
No aplica.

Respuesta JSON:

```JSON
✅ 200 OK – Lista de productos

[
  {
    "id": 1,
    "name": "Producto 1",
    "description": "Descripción del producto",
    "price": "199.99",
    "category": "Electrónica",
    "stock": 10,
    "isActive": true,
    "userId": 2,
    "createdAt": "2025-08-23T10:00:00.000Z",
    "updatedAt": "2025-08-23T10:00:00.000Z"
  }
]
⚠️ 500 Internal Server Error – Error del servidor

{
  "error": "Error al obtener productos"
}
```

🔑 Notas importantes:

Todos los endpoints requieren JWT válido (Authorization: Bearer <token>).
Usuarios normales solo reciben sus propios productos.
Administradores reciben todos los productos.

✅ Obtener Producto por ID
Método: GET
URL: https://localhost:3000/api/products/:id/
Autenticación: Requiere JWT (dueño del producto o administrador)

Descripción:
Permite obtener un producto específico por su ID.
Solo el creador del producto o un administrador pueden acceder al detalle del producto.

Parámetros URL:

Parámetros URL:

| Parámetro | Tipo | Descripción               |
| --------- | ---- | ------------------------- |
| id        | int  | ID del producto a obtener |

Body JSON:
No aplica.

Respuestas JSON:

```JSON
✅ 200 OK – Producto encontrado

{
  "id": 1,
  "name": "Producto 1",
  "description": "Descripción del producto",
  "price": "199.99",
  "category": "Electrónica",
  "stock": 10,
  "isActive": true,
  "userId": 2,
  "createdAt": "2025-08-23T10:00:00.000Z",
  "updatedAt": "2025-08-23T10:00:00.000Z"
}
⚠️ 403 Forbidden – Usuario no autorizado

{
  "error": "No tienes permisos para ver este producto"
}


⚠️ 404 Not Found – Producto no encontrado

{
  "error": "Producto no encontrado"
}
⚠️ 500 Internal Server Error – Error del servidor

{
  "error": "Error en el servidor"
}
```

🔑 Notas importantes:

Solo el creador del producto o un administrador puede acceder al detalle.
Se requiere JWT válido (Authorization: Bearer <token>).

✅ Actualizar Producto
Método: PUT
URL: https://localhost:3000/api/products/:id/
Autenticación: Requiere JWT (dueño del producto o administrador)

Descripción:
Permite actualizar los datos de un producto existente.
Solo el creador del producto o un administrador pueden actualizarlo.
Se pueden actualizar uno o varios campos del producto.

Parámetros URL:

| Parámetro | Tipo | Descripción                  |
| --------- | ---- | ---------------------------- |
| id        | int  | ID del producto a actualizar |

Body JSON (ejemplo):

```JSON
{
  "name": "Producto actualizado",
  "description": "Nueva descripción",
  "price": 250.50,
  "category": "Electrónica",
  "stock": 5,
  "isActive": false
}
Respuestas JSON:

✅ 200 OK – Producto actualizado

{
  "id": 1,
  "name": "Producto actualizado",
  "description": "Nueva descripción",
  "price": "250.50",
  "category": "Electrónica",
  "stock": 5,
  "isActive": false,
  "userId": 2,
  "createdAt": "2025-08-23T10:00:00.000Z",
  "updatedAt": "2025-08-23T10:30:00.000Z"
}
⚠️ 403 Forbidden – Usuario no autorizado

{
  "error": "No tienes permisos para actualizar este producto"
}


⚠️ 404 Not Found – Producto no encontrado

{
  "error": "Producto no encontrado"
}


⚠️ 500 Internal Server Error – Error del servidor

{
  "error": "Error en el servidor"
}
```

🔑 Notas importantes:

Solo el creador del producto o un administrador puede actualizarlo.
Se requiere JWT válido (Authorization: Bearer <token>).
Campos no enviados en el body permanecen sin cambios.

❌ Eliminar Producto
Método: DELETE
URL: https://localhost:3000/api/products/:id/
Autenticación: Requiere JWT (dueño del producto o administrador)

Descripción:

Permite eliminar un producto existente.
Solo el creador del producto o un administrador pueden eliminarlo.
Devuelve un mensaje de confirmación al eliminar correctamente el producto.

| Parámetro | Tipo | Descripción                |
| --------- | ---- | -------------------------- |
| id        | int  | ID del producto a eliminar |

Body JSON:

No se requiere body para esta petición.

Respuestas JSON:

```JSON
✅ 200 OK – Producto eliminado correctamente

{
    "message": "Producto eliminado con éxito",
    "product": {
        "id": 5,
        "name": "Producto2-User2",
        "description": "Descripción producto 2 del usuario 2",
        "price": "20.00",
        "category": "General",
        "stock": 0,
        "isActive": true,
        "userId": 2,
        "createdAt": "2025-08-24T23:46:36.192Z",
        "updatedAt": "2025-08-24T23:46:36.192Z"
    }
}


⚠️ 403 Forbidden – Usuario no autorizado

{
  "error": "No tienes permisos para eliminar este producto"
}


⚠️ 404 Not Found – Producto no encontrado

{
  "error": "Producto no encontrado"
}


⚠️ 500 Internal Server Error – Error del servidor

{
  "error": "Error en el servidor"
}
```

🔑 Notas importantes:

Solo el creador del producto o un administrador puede eliminarlo.
Se requiere JWT válido (Authorization: Bearer <token>).
Si el producto no existe o el usuario no tiene permisos, se devuelve el error correspondiente.

🔍 Búsqueda Avanzada de Productos
Método: GET
URL: https://localhost:3000/api/products/search/
Autenticación: Requiere JWT (usuario o administrador)

Descripción:

Permite buscar productos con filtros avanzados.
Los usuarios normales solo verán sus propios productos.
Los administradores pueden buscar en todos los productos.
Se pueden aplicar filtros por nombre, descripción, categoría y rango de precios.

| Parámetro   | Tipo   | Descripción                                        |
| ----------- | ------ | -------------------------------------------------- |
| name        | string | Filtrar por coincidencia parcial en el nombre      |
| description | string | Filtrar por coincidencia parcial en la descripción |
| category    | string | Filtrar por categoría                              |
| minPrice    | number | Precio mínimo                                      |
| maxPrice    | number | Precio máximo                                      |

Body JSON:

No se requiere body para esta petición.

GET /api/products/search?name=iphone&category=Electrónica&minPrice=500

Respuestas JSON:

```JSON
✅ 200 OK – Productos encontrados

[
  {
    "id": 3,
    "name": "iPhone 12",
    "description": "Teléfono móvil",
    "price": "999.99",
    "category": "Electrónica",
    "stock": 5,
    "isActive": true,
    "userId": 2,
    "createdAt": "2025-08-23T10:15:00.000Z",
    "updatedAt": "2025-08-23T10:15:00.000Z"
  }
]
⚠️ 404 Not Found – No se encontraron productos

{
  "message": "No se han encontrado productos"
}
⚠️ 500 Internal Server Error – Error del servidor

{
  "error": "Error en el servidor"
}
```

🔑 Notas importantes:

Todos los endpoints requieren JWT válido (Authorization: Bearer <token>).
Los usuarios normales solo pueden ver sus propios productos.
Los administradores pueden aplicar filtros y ver todos los productos.
Si no hay coincidencias, se devuelve un mensaje indicando que no se encontraron productos.
