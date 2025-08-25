// userController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ERRORS = require("../utils/errorMessages");
const {
  createUser,
  findUserByEmail,
  verifyPassword,
} = require("../service/userService");
const jwt = require("jsonwebtoken");

////////////////////////////////////////////////////////////////////////////////
// 🔹 Registrar usuario
// Valida si el email ya existe, crea un nuevo usuario y devuelve su ID
////////////////////////////////////////////////////////////////////////////////
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: ERRORS.USER.REGISTERED_ALREADY });
    }

    // Crear el usuario
    const user = await createUser(name, email, password);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt, // si usas timestamps en Sequelize
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ERRORS.GENERAL.SERVER_ERROR });
  }
};

////////////////////////////////////////////////////////////////////////////////
// 🔹 Login
// Valida credenciales y retorna token JWT con expiración
////////////////////////////////////////////////////////////////////////////////
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Normalizar email a minúsculas
    const normalizedEmail = email.toLowerCase();

    // Buscar usuario por email
    const user = await findUserByEmail(normalizedEmail);
    if (!user)
      return res.status(401).json({ error: ERRORS.USER.INVALID_CREDENTIALS });

    // Verificar contraseña
    const isValid = await verifyPassword(password, user.password);
    if (!isValid)
      return res.status(401).json({ error: ERRORS.USER.PASSWORD_COMPARE });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1800s" } // 30 minutos
    );

    // Respuesta personalizada
    res.json({
      message: `El usuario ${user.name} ha iniciado sesión con éxito.`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      access_token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ERRORS.GENERAL.SERVER_ERROR });
  }
};

////////////////////////////////////////////////////////////////////////////////
// 🔹 Crear administrador
// Solo accesible por otro admin autenticado
////////////////////////////////////////////////////////////////////////////////
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: ERRORS.USER.ALL_FIELDS_REQUIRED });
    }

    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return res.status(400).json({ error: ERRORS.USER.REGISTERED_ALREADY });
    }

    // Crear administrador (el hook beforeCreate hará el hash automáticamente)
    const newAdmin = await User.create({
      name,
      email, // el hook también lo convertirá a minúsculas
      password,
      role: "administrator",
    });

    res.status(201).json({
      message: ERRORS.USER.ADMIN_CREATED_SUCCESS,
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: ERRORS.USER.REGISTERED_ALREADY });
    }
    res.status(500).json({ error: ERRORS.GENERAL.SERVER_ERROR });
  }
};

////////////////////////////////////////////////////////////////////////////////
// 🔹 Eliminar usuario
// Solo accesible por administradores
// No permite eliminarse a sí mismo ni a otros administradores
////////////////////////////////////////////////////////////////////////////////
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // No se puede eliminar a sí mismo
    if (userId === req.user.id)
      return res.status(403).json({ error: ERRORS.USER.CANNOT_DELETE_SELF });

    const userToDelete = await User.findByPk(userId);
    if (!userToDelete)
      return res.status(404).json({ error: ERRORS.USER.NOT_FOUND });

    // No se puede eliminar otro administrador
    if (userToDelete.role === "administrator") {
      return res.status(403).json({ error: ERRORS.USER.CANNOT_DELETE_ADMIN });
    }

    // Guardar datos antes de eliminar
    const deletedUserInfo = {
      id: userToDelete.id,
      name: userToDelete.name,
      email: userToDelete.email,
    };

    await userToDelete.destroy();

    res.json({
      error: ERRORS.USER.DELETED_SUCCESS,
      user: deletedUserInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ERRORS.GENERAL.SERVER_ERROR });
  }
};

module.exports = { register, login, createAdmin, deleteUser };
