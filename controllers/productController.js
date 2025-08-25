// productController.js
const Product = require("../models/Product");
const ProductService = require("../service/productService");
const { Op } = require("sequelize");
const ERRORS = require("../utils/errorMessages");

const productController = {
  /**
   * 🔹 Crear un nuevo producto
   * Requiere autenticación (req.user) y body con datos mínimos.
   * Normaliza y valida los campos antes de crear.
   */
  async create(req, res, next) {
    try {
      const { name, description, price, category, stock, isActive } = req.body;

      // Validaciones básicas
      if (!name || price === undefined || price === null) {
        return res
          .status(400)
          .json({ error: ERRORS.PRODUCT.NAME_PRICE_REQUIRED });
      }

      const normalizedName = String(name).trim();
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ error: ERRORS.PRODUCT.INVALID_PRICE });
      }

      const normalizedCategory = category?.trim() || "General";
      const normalizedStock = stock ?? 0;
      if (!Number.isInteger(Number(normalizedStock)) || normalizedStock < 0) {
        return res.status(400).json({ error: ERRORS.PRODUCT.INVALID_STOCK });
      }

      const normalizedIsActive =
        typeof isActive === "boolean" ? isActive : true;

      // Crear producto asociado al usuario autenticado
      const product = await Product.create({
        name: normalizedName,
        description,
        price: numericPrice,
        category: normalizedCategory,
        stock: Number(normalizedStock),
        isActive: normalizedIsActive,
        userId: req.user.id,
      });

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  /**
   * 🔹 Obtener todos los productos
   * Los administradores ven todos los productos.
   * Los usuarios normales ven solo los suyos.
   */
  async getAll(req, res, next) {
    try {
      const products =
        req.user.role === "administrator"
          ? await ProductService.getAllProducts()
          : await ProductService.getProductsByUserId(req.user.id);

      res.json(products);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  /**
   * 🔹 Obtener un producto por su ID
   * Valida que el usuario tenga permisos para ver el producto
   */
  async getById(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product)
        return res.status(404).json({ error: ERRORS.PRODUCT.NOT_FOUND });

      const ownerId = product.userId ?? product.user_id;
      if (ownerId !== req.user.id && req.user.role !== "administrator") {
        return res.status(403).json({ error: ERRORS.PRODUCT.NO_PERMISSION });
      }

      res.json(product);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  /**
   * 🔹 Actualizar un producto
   * Solo el propietario o administrador puede actualizar
   * Solo actualiza campos enviados en el body
   */
  async update(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product)
        return res.status(404).json({ error: ERRORS.PRODUCT.NOT_FOUND });

      if (product.userId !== req.user.id && req.user.role !== "administrator") {
        return res.status(403).json({ error: ERRORS.PRODUCT.NO_PERMISSION });
      }

      const { name, description, price, category, stock, isActive } = req.body;
      const updates = {};

      if (name !== undefined) updates.name = name.trim() || undefined;
      if (description !== undefined) updates.description = description;
      if (price !== undefined) updates.price = Number(price);
      if (category !== undefined)
        updates.category = category.trim() || undefined;
      if (stock !== undefined) updates.stock = Number(stock);
      if (isActive !== undefined) updates.isActive = isActive;

      const updated = await ProductService.updateProduct(
        req.params.id,
        updates
      );
      res.json(updated);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  /**
   * 🔹 Eliminar un producto
   * Solo el propietario o administrador puede eliminar
   */
  async delete(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);

      if (!product) {
        return res.status(404).json({ error: ERRORS.PRODUCT.NOT_FOUND });
      }

      // 🔹 Verificar permisos
      if (product.userId !== req.user.id && req.user.role !== "administrator") {
        return res.status(403).json({ error: ERRORS.PRODUCT.NO_PERMISSION });
      }

      // 🔹 Eliminar (dependiendo si hace destroy directo o find+destroy)
      await ProductService.deleteProduct(req.params.id);

      // 🔹 Devolver también el producto eliminado
      res.json({
        message: ERRORS.PRODUCT.DELETE_SUCCESS,
        product, // Objeto de producto
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
  /**
   * 🔹 Búsqueda avanzada de productos
   * Filtra por nombre, descripción, categoría, precio mínimo/máximo
   * Los administradores ven todos, usuarios normales solo sus productos
   * Maneja correctamente precios con comas
   */
  async search(req, res, next) {
    try {
      const { name, description, category, minPrice, maxPrice } = req.query;
      const where =
        req.user.role === "administrator" ? {} : { userId: req.user.id };

      if (name) where.name = { [Op.iLike]: `%${name}%` };
      if (description) where.description = { [Op.iLike]: `%${description}%` };
      if (category) where.category = { [Op.iLike]: `%${category}%` };

      // Sanear precios
      if (minPrice !== undefined) {
        const min = Number(String(minPrice).replace(",", "."));
        if (isNaN(min))
          return res.status(400).json({ error: ERRORS.PRODUCT.INVALID_PRICE });
        where.price = { ...where.price, [Op.gte]: min };
      }

      if (maxPrice !== undefined) {
        const max = Number(String(maxPrice).replace(",", "."));
        if (isNaN(max))
          return res.status(400).json({ error: ERRORS.PRODUCT.INVALID_PRICE });
        where.price = { ...where.price, [Op.lte]: max };
      }

      const products = await Product.findAll({ where });

      if (!products.length)
        return res.status(404).json({ error: ERRORS.PRODUCT.NOT_FOUND });

      res.json(products);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};

module.exports = productController;
