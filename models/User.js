const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const bcrypt = require("bcryptjs");

// Definición del modelo User
const User = sequelize.define(
  "User",
  {
    // Nombre del usuario, obligatorio
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Email del usuario, obligatorio y único
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Contraseña, obligatoria. Se almacenará como hash
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Rol del usuario, por defecto "user", puede ser "administrator"
    role: {
      type: DataTypes.ENUM("user", "administrator"),
      defaultValue: "user",
      allowNull: false,
    },
  },
  {
    tableName: "users", // Nombre de la tabla en la base de datos
    underscored: true, // Campos como created_at en lugar de createdAt
    hooks: {
      // Antes de crear un usuario
      beforeCreate: async (user) => {
        // Normalizar email a minúsculas
        user.email = user.email.toLowerCase();

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      // Antes de actualizar un usuario
      beforeUpdate: async (user) => {
        // Si se cambia el email, normalizar a minúsculas
        if (user.changed("email")) {
          user.email = user.email.toLowerCase();
        }
        // Si se cambia la contraseña, volver a hashear
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;
