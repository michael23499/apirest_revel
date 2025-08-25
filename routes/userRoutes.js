// userRoutes.js
const express = require("express");
const router = express.Router();

// Middlewares de autenticación y autorización
const authMiddleware = require("../middleware/authMiddleware"); // Verifica token JWT
const roleMiddleware = require("../middleware/roleMiddleware"); // Control de roles de usuario

// Controladores que contienen la lógica de cada endpoint
const {
  register, // Registrar un usuario normal
  login, // Iniciar sesión y generar token
  createAdmin, // Crear un administrador (solo para admin)
  deleteUser, // Eliminar un usuario (solo para admin)
} = require("../controllers/userController");

// Middleware de validación de entradas
const {
  validateFields, // Función que ejecuta las reglas de validación
  userRegisterValidation, // Reglas de validación para registro de usuario/admin
  userLoginValidation, // Reglas de validación para login
} = require("../middleware/inputValidator");

/**
 * 🔹 Ruta POST /register
 * Permite registrar un usuario normal.
 * Se aplica validación de campos (name, email, password)
 * antes de pasar al controlador.
 */
router.post("/register", validateFields(userRegisterValidation), register);

/**
 * 🔹 Ruta POST /login
 * Permite que un usuario inicie sesión.
 * Se aplica validación de campos (email, password)
 * antes de pasar al controlador que genera el token JWT.
 */
router.post("/login", validateFields(userLoginValidation), login);

/**
 * 🔹 Ruta POST /admin
 * Permite crear un nuevo administrador.
 * Solo accesible para usuarios con rol "administrator".
 * Se aplican middlewares:
 *  - authMiddleware: verifica que haya un token válido.
 *  - roleMiddleware: verifica que el usuario sea administrador.
 *  - validateFields: valida los campos de entrada (name, email, password)
 */
router.post(
  "/admin",
  authMiddleware,
  roleMiddleware("administrator"),
  validateFields(userRegisterValidation),
  createAdmin
);

/**
 * 🔹 Ruta DELETE /:id
 * Permite eliminar un usuario por su ID.
 * Solo accesible para administradores.
 * Se aplican middlewares:
 *  - authMiddleware: verifica token válido.
 *  - roleMiddleware: verifica rol de administrador.
 * Luego se ejecuta el controlador deleteUser.
 */
router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware("administrator"),
  deleteUser
);

// Exportamos el router para usarlo en server.js
module.exports = router;
