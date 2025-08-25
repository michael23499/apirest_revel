// 🔹 Importamos herramientas de validación de express-validator
const { body, validationResult, param, query } = require("express-validator");
const ERRORS = require("../utils/errorMessages");

/**
 * Middleware genérico que ejecuta las validaciones definidas y devuelve errores
 * @param {Array} validations - Array de reglas de validación
 */
const validateFields = (validations) => {
  return async (req, res, next) => {
    // Ejecuta todas las validaciones en paralelo
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Recoge los errores generados
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors
          .array()
          .map((e) => e.msg) // Convierte cada error en mensaje
          .join(", "), // Une todos los mensajes en un solo string
      });
    }
    next(); // Si no hay errores, continuar con la siguiente función
  };
};

// 🔹 Validaciones para registro de usuario
const userRegisterValidation = [
  body("name").trim().notEmpty().withMessage(ERRORS.USER.ALL_FIELDS_REQUIRED), // Nombre obligatorio
  body("email")
    .trim()
    .isEmail()
    .withMessage(ERRORS.USER.INVALID_EMAIL) // Debe ser email válido
    .normalizeEmail(), // Normaliza el email (minúsculas, quitar espacios)
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage(ERRORS.USER.PASSWORD_TOO_SHORT), // Contraseña >= 6 caracteres
];

// 🔹 Validaciones para login
const userLoginValidation = [
  body("email").trim().isEmail().withMessage(ERRORS.USER.INVALID_EMAIL), // Email válido
  body("password")
    .trim()
    .notEmpty()
    .withMessage(ERRORS.USER.ALL_FIELDS_REQUIRED), // Password obligatorio
];

// 🔹 Validación de parámetros de ruta (ID)
const idParamValidation = [
  param("id").isInt({ min: 1 }).withMessage("ID inválido"), // Debe ser entero positivo
];

// 🔹 Validaciones para creación de productos
const productCreateValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(ERRORS.PRODUCT.NAME_PRICE_REQUIRED), // Nombre obligatorio
  body("price").isFloat({ min: 0 }).withMessage(ERRORS.PRODUCT.INVALID_PRICE), // Precio >= 0
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage(ERRORS.PRODUCT.INVALID_STOCK), // Stock >= 0
  body("category").trim().escape(), // Sanitiza category
  body("description").optional().trim().escape(), // Sanitiza description
];

// 🔹 Exportamos todas las validaciones y middleware
module.exports = {
  validateFields,
  userRegisterValidation,
  userLoginValidation,
  idParamValidation,
  productCreateValidation,
};
