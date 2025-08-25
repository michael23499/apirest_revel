// 🔹 Importamos los tipos de datos de Sequelize
const { DataTypes } = require("sequelize");

// 🔹 Importamos la instancia de Sequelize configurada en db.js
const sequelize = require("../config/config");

// 🔹 Importamos el modelo User para establecer la relación
const User = require("./User");

/**
 * 🔹 Definición del modelo Product
 */
const Product = sequelize.define(
  "Product", // Nombre del modelo
  {
    name: {
      type: DataTypes.STRING, // Tipo de dato: texto
      allowNull: false, // Campo obligatorio
    },
    description: {
      type: DataTypes.TEXT, // Descripción del producto (opcional)
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Número decimal con 2 decimales
      allowNull: false, // Campo obligatorio
      validate: { min: 0 }, // Precio mínimo 0
    },
    category: {
      type: DataTypes.STRING(50), // Categoría del producto
      allowNull: false,
      defaultValue: "General", // Valor por defecto
    },
    stock: {
      type: DataTypes.INTEGER, // Cantidad en inventario
      allowNull: false,
      defaultValue: 0, // Valor por defecto
      validate: { min: 0 }, // Stock mínimo 0
    },
    isActive: {
      type: DataTypes.BOOLEAN, // Si el producto está activo
      allowNull: false,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.INTEGER, // FK que relaciona con Users
      allowNull: false,
      references: { model: User, key: "id" }, // Relación
      onDelete: "CASCADE", // Si el usuario se elimina, borrar productos
    },
  },
  {
    tableName: "products", // Nombre de la tabla en la base de datos
    underscored: true, // Convierte camelCase a snake_case en la DB
  }
);

// 🔹 Relaciones: un producto pertenece a un usuario
Product.belongsTo(User, { foreignKey: "userId" });

// 🔹 Exportamos el modelo para usarlo en servicios o controladores
module.exports = Product;
