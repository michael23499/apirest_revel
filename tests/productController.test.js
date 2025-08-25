// Importamos el controlador que vamos a testear
const productController = require("../controllers/productController");
// Importamos el servicio de productos, que vamos a mockear
const ProductService = require("../service/productService");
// Importamos el modelo Product, también lo mockearemos
const Product = require("../models/Product");
// Sequelize Op, para búsqueda avanzada
const { Op } = require("sequelize");
// Mensajes de error centralizados
const ERRORS = require("../utils/errorMessages");

// Mockeamos los módulos para que no interactúen con la DB real
jest.mock("../service/productService");
jest.mock("../models/Product");

describe("Product Controller", () => {
  let req, res, next;

  // Se ejecuta antes de cada test
  beforeEach(() => {
    // Simulamos el objeto req de Express
    req = { body: {}, params: {}, query: {}, user: {} };
    // Simulamos el objeto res de Express
    res = {
      status: jest.fn().mockReturnThis(), // permite encadenar res.status().json()
      json: jest.fn(),
    };
    // Simulamos la función next de Express
    next = jest.fn();
    // Limpiamos todos los mocks para evitar interferencias entre tests
    jest.clearAllMocks();
  });

  ////////////////////////////////
  // 🔹 CREATE PRODUCT
  ////////////////////////////////
  describe("create", () => {
    it("should return 400 if name or price missing", async () => {
      // No enviamos name ni price en el body
      await productController.create(req, res, next);

      // Se espera error 400 con mensaje de campos requeridos
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.PRODUCT.NAME_PRICE_REQUIRED,
      });
    });

    it("should create a product successfully", async () => {
      // Simulamos usuario autenticado
      req.user = { id: 1 };
      // Body mínimo válido
      req.body = { name: "Test", price: 100 };
      // Mockeamos Product.create para simular DB
      Product.create.mockResolvedValue({ id: 1, name: "Test", price: 100 });

      await productController.create(req, res, next);

      // Se espera status 201 y JSON con producto creado
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: "Test" })
      );
    });
  });

  ////////////////////////////////
  // 🔹 GET ALL PRODUCTS
  ////////////////////////////////
  describe("getAll", () => {
    it("admin should get all products", async () => {
      req.user = { role: "administrator" };
      ProductService.getAllProducts.mockResolvedValue([{ id: 1 }]);

      await productController.getAll(req, res, next);

      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it("normal user should get only their products", async () => {
      req.user = { id: 2, role: "user" };
      ProductService.getProductsByUserId.mockResolvedValue([{ id: 2 }]);

      await productController.getAll(req, res, next);

      expect(res.json).toHaveBeenCalledWith([{ id: 2 }]);
    });
  });

  ////////////////////////////////
  // 🔹 GET BY ID
  ////////////////////////////////
  describe("getById", () => {
    it("should return 404 if product not found", async () => {
      req.params.id = "1";
      ProductService.getProductById.mockResolvedValue(null);

      await productController.getById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.PRODUCT.NOT_FOUND,
      });
    });

    it("should return 403 if user has no permission", async () => {
      req.user = { id: 1, role: "user" };
      req.params.id = "2";
      ProductService.getProductById.mockResolvedValue({ id: 2, userId: 3 });

      await productController.getById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.PRODUCT.NO_PERMISSION,
      });
    });

    it("should return product successfully", async () => {
      req.user = { id: 1, role: "user" };
      req.params.id = "1";
      ProductService.getProductById.mockResolvedValue({ id: 1, userId: 1 });

      await productController.getById(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ id: 1, userId: 1 });
    });
  });

  ////////////////////////////////
  // 🔹 UPDATE PRODUCT
  ////////////////////////////////
  describe("update", () => {
    it("should return 404 if product not found", async () => {
      req.params.id = "1";
      ProductService.getProductById.mockResolvedValue(null);

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.PRODUCT.NOT_FOUND,
      });
    });

    it("should return 403 if user has no permission", async () => {
      req.user = { id: 1, role: "user" };
      req.params.id = "2";
      ProductService.getProductById.mockResolvedValue({ id: 2, userId: 3 });

      await productController.update(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.PRODUCT.NO_PERMISSION,
      });
    });

    it("should update product successfully", async () => {
      req.user = { id: 1, role: "user" };
      req.params.id = "1";
      req.body = { name: "Updated" };
      ProductService.getProductById.mockResolvedValue({ id: 1, userId: 1 });
      ProductService.updateProduct.mockResolvedValue({
        id: 1,
        name: "Updated",
      });

      await productController.update(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Updated" });
    });
  });

  ////////////////////////////////
  // 🔹 DELETE PRODUCT
  ////////////////////////////////
  describe("delete", () => {
    it("should return 404 if product not found", async () => {
      req.params.id = "1";
      ProductService.getProductById.mockResolvedValue(null);

      await productController.delete(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.PRODUCT.NOT_FOUND,
      });
    });

    it("should return 403 if user has no permission", async () => {
      req.user = { id: 1, role: "user" };
      req.params.id = "2";
      ProductService.getProductById.mockResolvedValue({ id: 2, userId: 3 });

      await productController.delete(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.PRODUCT.NO_PERMISSION,
      });
    });

    it("should delete product successfully", async () => {
      req.user = { id: 1, role: "user" };
      req.params.id = "1";
      ProductService.getProductById.mockResolvedValue({ id: 1, userId: 1 });
      ProductService.deleteProduct.mockResolvedValue(true);

      await productController.delete(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: ERRORS.PRODUCT.DELETE_SUCCESS,
      });
    });
  });

  ////////////////////////////////
  // 🔹 SEARCH PRODUCTS
  ////////////////////////////////
  describe("search", () => {
    it("should return 400 if minPrice invalid", async () => {
      req.user = { id: 1, role: "user" };
      req.query = { minPrice: "abc" };

      await productController.search(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.PRODUCT.INVALID_PRICE,
      });
    });

    it("should return 404 if no products found", async () => {
      req.user = { id: 1, role: "user" };
      req.query = {};
      Product.findAll.mockResolvedValue([]);

      await productController.search(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.PRODUCT.NOT_FOUND,
      });
    });

    it("should return products successfully", async () => {
      req.user = { id: 1, role: "user" };
      req.query = {};
      Product.findAll.mockResolvedValue([{ id: 1, name: "Prod1", userId: 1 }]);

      await productController.search(req, res, next);

      expect(res.json).toHaveBeenCalledWith([
        { id: 1, name: "Prod1", userId: 1 },
      ]);
    });
  });
});
