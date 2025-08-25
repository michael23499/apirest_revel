// service/productService.js
const { Op } = require("sequelize");
const Product = require("../models/Product");

// Servicio que encapsula la lógica de acceso a datos para productos
const ProductService = {
  // Crear un nuevo producto
  async createProduct(data) {
    return Product.create(data);
  },

  // Obtener todos los productos de la tabla
  async getAllProducts() {
    return Product.findAll();
  },

  // Obtener un producto por su ID
  async getProductById(id) {
    return Product.findByPk(id);
  },

  // Actualizar un producto existente por su ID
  async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null; // Retorna null si no existe
    return product.update(data);
  },

  // Eliminar un producto por su ID
  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) return null; // Retorna null si no existe
    await product.destroy(); // Borrar el producto
    return true;
  },

  // ✅ Obtener todos los productos de un usuario específico
  async getProductsByUserId(userId) {
    return Product.findAll({ where: { userId } });
  },

  // ✅ Búsqueda avanzada con filtros opcionales
  async searchProducts(filters) {
    const where = {};

    // Filtrar por nombre insensible a mayúsculas
    if (filters.name) {
      where.name = { [Op.iLike]: `%${filters.name}%` };
    }

    // Filtrar por descripción
    if (filters.description) {
      where.description = { [Op.iLike]: `%${filters.description}%` };
    }

    // Filtrar por categoría
    if (filters.category) {
      where.category = { [Op.iLike]: `%${filters.category}%` };
    }

    // Filtrar por rango de precio mínimo
    if (filters.minPrice) {
      where.price = { ...where.price, [Op.gte]: filters.minPrice };
    }

    // Filtrar por rango de precio máximo
    if (filters.maxPrice) {
      where.price = { ...where.price, [Op.lte]: filters.maxPrice };
    }

    return Product.findAll({ where });
  },
};

module.exports = ProductService;
