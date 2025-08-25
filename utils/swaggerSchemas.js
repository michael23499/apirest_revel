/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registrar un usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso, retorna JWT
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * @swagger
 * /users/admin:
 *   post:
 *     summary: Crear administrador (solo otro admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nuevo Admin
 *               email:
 *                 type: string
 *                 example: admin2@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Administrador creado correctamente
 *       400:
 *         description: Usuario ya existe o error de validación
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Usuario no autorizado
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       403:
 *         description: No autorizado o no puedes eliminarte a ti mismo
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               price:
 *                 type: number
 *                 example: 1200.5
 *               stock:
 *                 type: integer
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Laptop gamer
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *       401:
 *         description: Token no proporcionado
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Búsqueda avanzada de productos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *     responses:
 *       200:
 *         description: Productos encontrados
 *       404:
 *         description: No se encontraron productos
 *       401:
 *         description: Token no proporcionado
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener producto por id
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Token no proporcionado
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token no proporcionado
 *       404:
 *         description: Producto no encontrado
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Producto no encontrado
 *       401:
 *         description: Token no proporcionado
 */
