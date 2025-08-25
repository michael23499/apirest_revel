// 🔹 Importamos Sequelize
const { Sequelize } = require("sequelize");

// 🔹 Cargamos las variables de entorno desde .env
require("dotenv").config();

// 🔹 Importamos mensajes de error personalizados
const ERRORS = require("../utils/errorMessages");

/**
 * 🔹 Creamos la conexión a la base de datos
 * Sequelize es un ORM que permite interactuar con PostgreSQL de manera más sencilla
 */
const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario de la base de datos
  process.env.DB_PASSWORD, // Contraseña
  {
    host: process.env.DB_HOST, // Host de la base de datos
    dialect: "postgres", // Tipo de base de datos
    logging: false, // Desactiva logs SQL en consola (opcional)
  }
);

/**
 * 🔹 Función para probar la conexión a la base de datos
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate(); // Intenta conectar
    console.log("✅ Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error(`${ERRORS.GENERAL.SERVER_ERROR}:`, error);
  }
};

// 🔹 Ejecutamos la prueba de conexión al cargar este archivo
testConnection();

// 🔹 Exportamos la instancia de Sequelize para usarla en los modelos
module.exports = sequelize;
