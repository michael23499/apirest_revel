// utils/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

// 📌 Definición principal de la documentación Swagger
const swaggerDefinition = {
  openapi: "3.0.0", // Versión del estándar OpenAPI
  info: {
    title: "API REST - RevelTest", // Título de la API
    version: "1.0.0", // Versión de la API
    description:
      "API de prueba técnica con gestión de usuarios y productos. Requiere autenticación JWT para operaciones protegidas.",
  },
  servers: [
    {
      url: "https://localhost:3000/api", // Dirección base del servidor
      description: "Servidor local HTTPS",
    },
  ],
  components: {
    // 🔹 Definición del esquema de seguridad (JWT)
    securitySchemes: {
      bearerAuth: {
        type: "http", // Tipo de seguridad HTTP
        scheme: "bearer", // Tipo Bearer Token
        bearerFormat: "JWT", // Formato del token
        description:
          "Agrega tu token JWT aquí para autenticación. Ej: `Bearer <token>`",
      },
    },
  },
  // 🔹 Seguridad global: todas las rutas requieren JWT a menos que se especifique lo contrario
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// 📌 Configuración para generar la documentación a partir de comentarios JSDoc en las rutas
const options = {
  swaggerDefinition, // Definición que configuramos arriba
  apis: ["./routes/*.js", "./utils/swaggerSchemas.js"],
  // Incluimos las rutas y esquemas donde se escriben las descripciones con JSDoc
};

// 📌 Generamos el objeto Swagger final a partir de las opciones
const swaggerSpec = swaggerJsdoc(options);

// Exportamos la configuración para usarla en el server.js con swagger-ui-express
module.exports = swaggerSpec;
