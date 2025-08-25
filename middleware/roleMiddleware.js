// 🔹 Importamos los mensajes de error personalizados
const ERRORS = require("../utils/errorMessages");

/**
 * Middleware para validar el rol de un usuario
 * @param {string} requiredRole - El rol que se requiere para acceder a la ruta
 */
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    // 🔹 Obtenemos el rol del usuario del request (se agregó en authMiddleware)
    const userRole = req.user?.role;

    // 🔹 Si no hay usuario en el request, se deniega el acceso
    if (!userRole) {
      return res.status(403).json({ error: ERRORS.AUTH.LOGIN_INVALID });
    }

    // 🔹 Si el rol del usuario no coincide con el requerido, se deniega el acceso
    if (userRole !== requiredRole) {
      return res.status(403).json({ error: ERRORS.AUTH.LOGIN_INVALID });
    }

    // 🔹 Todo ok, continuar con la siguiente función del flujo
    next();
  };
};

// 🔹 Exportamos el middleware para usar en rutas
module.exports = roleMiddleware;
