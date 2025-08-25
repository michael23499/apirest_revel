// service/userService.js
const ERRORS = require("../utils/errorMessages");
const User = require("../models/User");

// Crear un nuevo usuario en la base de datos
// Nota: el hash de la contraseña se hace en el modelo User antes de guardar
const createUser = async (name, email, password) => {
  return await User.create({ name, email, password });
};

// Buscar un usuario por su email
const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email: email } });
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    throw error; // Propaga el error para que el controlador lo maneje
  }
};

// Comparar la contraseña ingresada con la almacenada (hashed)
const verifyPassword = async (inputPassword, storedPassword) => {
  try {
    return await require("bcrypt").compare(inputPassword, storedPassword);
  } catch (error) {
    console.error(error);
    // Nota: aquí el "res" no existe en el servicio, se debe manejar el error desde el controlador
    return false; // Retorna falso si ocurre un error
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  verifyPassword,
};
