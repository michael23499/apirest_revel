// utils/jwtUtils.js
const jwt = require("jsonwebtoken");

// 🔹 Genera un token JWT para un usuario
// Recibe el objeto usuario y guarda en el payload su id y rol
// - process.env.JWT_SECRET: clave secreta para firmar el token
// - expiresIn: tiempo de vida del token (30 minutos en este caso)
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role }, // Payload del token (información que irá dentro del JWT)
    process.env.JWT_SECRET, // Clave secreta de firma, debe estar en variables de entorno
    { expiresIn: "30m" } // Expira en 30 minutos
  );
};

// 🔹 Verifica si un token es válido
// - Recibe el token JWT y lo valida con la misma clave secreta
// - Si es válido, devuelve el payload (id y rol del usuario)
// - Si es inválido o expirado, lanza un error que se captura en el middleware de autenticación
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Exportamos funciones para poder usarlas en controladores, middlewares, etc.
module.exports = {
  generateToken,
  verifyToken,
};
