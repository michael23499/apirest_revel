// 🔹 Importamos mensajes de error predefinidos
const ERRORS = require("../utils/errorMessages");

/**
 * Middleware global de manejo de errores
 * Captura cualquier error que ocurra en la aplicación y devuelve un JSON adecuado
 */
function errorHandler(err, req, res, next) {
  console.error("Error detectado:", err); // 🔹 Logueo en consola para debugging

  // 🔹 Errores de validación de Sequelize (por ejemplo, violación de constraints)
  if (err.name === "SequelizeValidationError") {
    // Concatenamos todos los mensajes de validación
    const message = err.errors.map((e) => e.message).join(", ");
    return res.status(400).json({ error: message });
  }

  // 🔹 Errores de autenticación con JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: ERRORS.AUTH.TOKEN_INVALID });
  }

  // 🔹 Token expirado
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: ERRORS.AUTH.TOKEN_INVALID });
  }

  // 🔹 Errores personalizados (si definiste err.status y err.message)
  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }

  // 🔹 Error genérico para cualquier otro caso no contemplado
  res.status(500).json({ error: ERRORS.GENERAL.SERVER_ERROR });
}

// 🔹 Exportamos middleware para usarlo en server.js
module.exports = errorHandler;
