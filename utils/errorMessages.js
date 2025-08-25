// utils/errorMessages.js

// Objeto que centraliza todos los mensajes de error de la aplicación.
// Sirve para mantener consistencia y evitar mensajes hardcodeados en múltiples archivos.
const ERRORS = {
  GENERAL: {
    SERVER_ERROR: "Error en el servidor", // Error genérico del backend
    DB_CONNECTION_FAILED: "No se ha podido conectar a la base de datos", // Error de conexión a la DB
  },

  AUTH: {
    ACCESS_DENIED: "Acceso denegado: token secreto inválido", // Token secreto de setup-admin incorrecto
    TOKEN_INVALID: "Token inválido o expirado", // JWT inválido o expirado
    LOGIN_INVALID: "Credenciales inválidas", // Cuando un usuario no tiene permisos o rol incorrecto
    MISSING_TOKEN: "Token no proporcionado", // No se envió header Authorization
  },

  USER: {
    ALL_FIELDS_REQUIRED: "Todos los campos son obligatorios", // Registro incompleto
    INVALID_EMAIL: "Correo electrónico inválido", // Email invalido
    PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 6 caracteres", // Password corto
    ADMIN_CREATED_SUCCESS: "Administrador creado exitosamente", // Admin creado correctamente
    ADMIN_ALREADY_EXISTS:
      "Ya existe un administrador, este endpoint está bloqueado.", // Evita duplicados de admin
    CANNOT_DELETE_SELF: "No puedes eliminarte a ti mismo", // Protege al usuario de eliminar su propio registro
    CANNOT_DELETE_ADMIN: "No puedes eliminar a otro administrador", // Protege roles de admin
    NOT_FOUND: "Usuario no encontrado", // Usuario buscado no existe
    INVALID_CREDENTIALS: "Credenciales inválidas", // Login fallido
    REGISTERED_ALREADY: "Este correo electrónico ya se encuentra registrado", // Email duplicado
    DELETED_SUCCESS: "Usuario eliminado correctamente", // Confirmación de borrado
    PASSWORD_COMPARE: "Error al comparar las contraseñas", // Error al verificar password
  },

  PRODUCT: {
    CREATE_SUCCESS: "Producto creado con éxito",
    NAME_PRICE_REQUIRED: "Nombre y precio son obligatorios", // Campos requeridos al crear producto
    INVALID_PRICE: "Precio inválido", // Price malformado o negativo
    INVALID_STOCK: "Stock debe ser un entero ≥ 0", // Stock inválido
    INVALID_NAME: "Nombre inválido", // Name inválido
    INVALID_CATEGORY: "Categoría inválida", // Category inválida
    INVALID_IS_ACTIVE: "isActive debe ser booleano", // isActive inválido
    CREATE_ERROR: "Error al crear producto", // Error al insertar
    UPDATE_ERROR: "Error al actualizar producto", // Error al actualizar
    DELETE_SUCCESS: "Producto eliminado con éxito", // Confirmación de borrado
    SEARCH_ERROR: "Error en búsqueda de productos", // Fallo en queries
    NOT_FOUND: "Producto no encontrado", // Producto no existe
    NO_PERMISSION: "No tienes permisos para realizar esta acción", // Protege propiedad
    DELETE_PRODUCT: "Producto eliminado correctamente", // Mensaje genérico de borrado
    CANT_DELETE: "No puedes eliminar un producto que no te pertenece", // Protección de dueño
  },
};

// Exporta los errores para poder ser utilizados en controladores, middlewares o servicios
module.exports = ERRORS;
