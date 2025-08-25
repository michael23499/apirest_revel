// 🔑 Middleware de autenticación basado en JWT
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ERRORS = require("../utils/errorMessages");

// Función principal del middleware
const authMiddleware = async (req, res, next) => {
  try {
    // 🔹 Obtener el header de autorización
    const authHeader = req.headers.authorization;

    // ⚠️ Validación: si no existe o no empieza con "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: ERRORS.AUTH.MISSING_TOKEN });
    }

    // 🔹 Extraer token del header
    const token = authHeader.split(" ")[1];

    // 🔹 Verificar token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Buscar usuario en base de datos por ID incluido en el token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: ERRORS.AUTH.INVALID_USER });
    }

    // 🔹 Adjuntar datos del usuario al request para que otros middlewares/controllers puedan usarlo
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // 🔹 Continuar al siguiente middleware o controlador
    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);

    // 🔹 Caso de token expirado
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "El token de sesión ha expirado" });
    }

    // 🔹 Caso de token inválido (firma incorrecta, manipulado, etc.)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: ERRORS.AUTH.TOKEN_INVALID });
    }

    // 🔹 Otros errores inesperados
    res.status(500).json({ error: ERRORS.GENERAL.SERVER_ERROR });
  }
};

// 🔹 Exportar el middleware para usarlo en rutas protegidas
module.exports = authMiddleware;
