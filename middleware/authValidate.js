// 🔹 Validaciones de registro y login de usuarios
const ERRORS = require("../utils/errorMessages");

// Middleware para validar los datos al registrar un usuario
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  // ⚠️ Verificar que todos los campos obligatorios estén presentes
  if (!name || !email || !password) {
    return res.status(400).json({ error: ERRORS.USER.ALL_FIELDS_REQUIRED });
  }

  // 🔹 Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: ERRORS.USER.INVALID_EMAIL });
  }

  // 🔹 Validar longitud mínima de la contraseña
  if (password.length < 6) {
    return res.status(400).json({ error: ERRORS.USER.PASSWORD_TOO_SHORT });
  }

  // 🔹 Si todo está correcto, pasar al siguiente middleware/controlador
  next();
};

// Middleware para validar los datos al hacer login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // ⚠️ Verificar que los campos obligatorios estén presentes
  if (!email || !password) {
    return res.status(400).json({ error: ERRORS.AUTH.EMAIL_PASSWORD_REQUIRED });
  }

  // 🔹 Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: ERRORS.USER.INVALID_EMAIL });
  }

  // 🔹 Todo correcto, pasar al siguiente middleware/controlador
  next();
};

// 🔹 Exportar funciones para usarlas en las rutas de registro y login
module.exports = { validateRegister, validateLogin };
