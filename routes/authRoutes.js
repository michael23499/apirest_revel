// authRoutes.js
const express = require("express");
const { register, login } = require("../controllers/userController");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/authValidate");

const router = express.Router();

/**
 * 🔹 Ruta POST /register
 * Permite registrar un nuevo usuario.
 * Middleware `validateRegister` valida que los campos requeridos estén presentes
 * y cumplan las reglas (ej: email válido, contraseña mínima 6 caracteres).
 * Controlador `register` crea el usuario en la base de datos.
 */
router.post("/register", validateRegister, register);

/**
 * 🔹 Ruta POST /login
 * Permite que un usuario existente se autentique.
 * Middleware `validateLogin` valida que se envíen email y contraseña.
 * Controlador `login` verifica credenciales y retorna un token JWT si son correctas.
 */
router.post("/login", validateLogin, login);

// Exportamos el router para usarlo en server.js
module.exports = router;
