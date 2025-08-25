// productRoutes.js
const express = require("express");
const router = express.Router();

// Middleware de autenticación
const authMiddleware = require("../middleware/authMiddleware"); // Verifica token JWT

// Controlador que contiene la lógica de los productos
const productController = require("../controllers/productController");

// Middleware de validación de entradas
const {
  validateFields, // Ejecuta las reglas de validación definidas
  productCreateValidation, // Reglas de validación para crear productos
  idParamValidation, // Reglas de validación para parámetros de ruta (id)
} = require("../middleware/inputValidator");

/**
 * 🔹 Ruta POST /
 * Crear un nuevo producto.
 * Requiere:
 *  - authMiddleware: el usuario debe estar autenticado.
 *  - validateFields(productCreateValidation): campos correctos (name, price, stock, category, description)
 */
router.post(
  "/",
  authMiddleware,
  validateFields(productCreateValidation),
  productController.create
);

/**
 * 🔹 Ruta GET /
 * Obtener todos los productos del usuario autenticado.
 * Requiere autenticación.
 */
router.get("/", authMiddleware, productController.getAll);

/**
 * 🔹 Ruta GET /search
 * Búsqueda avanzada de productos según filtros (name, description, category, minPrice, maxPrice)
 * Requiere autenticación.
 */
router.get("/search/", authMiddleware, productController.search);

/**
 * 🔹 Ruta GET /:id/
 * Obtener un producto por su ID.
 * Requiere:
 *  - authMiddleware: usuario autenticado.
 *  - validateFields(idParamValidation): valida que el id sea un número válido.
 */
router.get(
  "/:id/",
  authMiddleware,
  validateFields(idParamValidation),
  productController.getById
);

/**
 * 🔹 Ruta PUT /:id/
 * Actualizar un producto existente.
 * Requiere:
 *  - authMiddleware: usuario autenticado.
 *  - validateFields(idParamValidation): valida el id del producto.
 * Opcionalmente se pueden validar campos de actualización si lo deseas.
 */
router.put(
  "/:id/",
  authMiddleware,
  validateFields(idParamValidation),
  productController.update
);

/**
 * 🔹 Ruta DELETE /:id/
 * Eliminar un producto por su ID.
 * Requiere:
 *  - authMiddleware: usuario autenticado.
 *  - validateFields(idParamValidation): valida que el id sea un número válido.
 */
router.delete(
  "/:id/",
  authMiddleware,
  validateFields(idParamValidation),
  productController.delete
);

// Exportamos el router para usarlo en server.js
module.exports = router;
