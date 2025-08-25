// tests/userController.test.js

// Importamos el controlador que vamos a testear
const userController = require("../controllers/userController");
// Importamos el servicio de usuarios que vamos a mockear
const userService = require("../service/userService");
// Importamos el modelo User (para pruebas directas de DB simuladas)
const User = require("../models/User");
// JWT para simular tokens
const jwt = require("jsonwebtoken");
// Mensajes de error centralizados
const ERRORS = require("../utils/errorMessages");

// Mockeamos módulos para no interactuar con DB real ni generar JWT reales
jest.mock("../service/userService");
jest.mock("../models/User");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  let req, res;

  // Se ejecuta antes de cada test
  beforeEach(() => {
    // Simulamos req de Express
    req = { body: {}, params: {}, user: {} };
    // Simulamos res de Express
    res = {
      status: jest.fn().mockReturnThis(), // permite encadenar res.status().json()
      json: jest.fn(), // mock de json
    };
    // Limpiamos todos los mocks para que no afecten a otros tests
    jest.clearAllMocks();
  });

  ////////////////////////////////
  // 🔹 REGISTER
  ////////////////////////////////
  describe("register", () => {
    it("should return 400 if user already exists", async () => {
      // Simulamos body de registro
      req.body = { name: "Test", email: "test@test.com", password: "1234" };
      // Mockeamos servicio para simular que el usuario ya existe
      userService.findUserByEmail.mockResolvedValue({ id: 1 });

      await userController.register(req, res);

      // Verificamos que devuelva 400 y mensaje de usuario ya registrado
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.USER.REGISTERED_ALREADY,
      });
    });

    it("should create a new user and return 201", async () => {
      req.body = { name: "Test", email: "test@test.com", password: "1234" };
      // Usuario no existe
      userService.findUserByEmail.mockResolvedValue(null);
      // Mockeamos creación de usuario
      userService.createUser.mockResolvedValue({
        id: 1,
        name: "Test",
        email: "test@test.com",
        createdAt: "2025-08-25",
      });

      await userController.register(req, res);

      // Verificamos que devuelva 201 y JSON con usuario
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Usuario registrado correctamente",
          user: expect.objectContaining({
            id: 1,
            name: "Test",
            email: "test@test.com",
          }),
        })
      );
    });
  });

  ////////////////////////////////
  // 🔹 LOGIN
  ////////////////////////////////
  describe("login", () => {
    it("should return 401 if user not found", async () => {
      req.body = { email: "notfound@test.com", password: "1234" };
      userService.findUserByEmail.mockResolvedValue(null);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.USER.INVALID_CREDENTIALS,
      });
    });

    it("should return 401 if password invalid", async () => {
      req.body = { email: "test@test.com", password: "wrong" };
      userService.findUserByEmail.mockResolvedValue({ password: "hashed" });
      userService.verifyPassword.mockResolvedValue(false);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.USER.PASSWORD_COMPARE,
      });
    });

    it("should login successfully and return token", async () => {
      req.body = { email: "test@test.com", password: "1234" };
      const mockUser = {
        id: 1,
        name: "Test",
        email: "test@test.com",
        role: "user",
        password: "hashed",
      };
      userService.findUserByEmail.mockResolvedValue(mockUser);
      userService.verifyPassword.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fakeToken");

      await userController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: `El usuario ${mockUser.name} ha iniciado sesión con éxito.`,
        user: { id: mockUser.id, name: mockUser.name, email: mockUser.email },
        access_token: "fakeToken",
      });
    });
  });

  ////////////////////////////////
  // 🔹 CREATE ADMIN
  ////////////////////////////////
  describe("createAdmin", () => {
    it("should return 400 if fields are missing", async () => {
      req.body = { name: "Admin" }; // falta email y password
      await userController.createAdmin(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.USER.ALL_FIELDS_REQUIRED,
      });
    });

    it("should return 400 if admin already exists", async () => {
      req.body = { name: "Admin", email: "admin@test.com", password: "1234" };
      User.findOne.mockResolvedValue(true);

      await userController.createAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.USER.REGISTERED_ALREADY,
      });
    });

    it("should create admin successfully", async () => {
      req.body = { name: "Admin", email: "admin@test.com", password: "1234" };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: 1,
        name: "Admin",
        email: "admin@test.com",
        role: "administrator",
      });

      await userController.createAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: ERRORS.USER.ADMIN_CREATED_SUCCESS,
          user: expect.objectContaining({ id: 1, role: "administrator" }),
        })
      );
    });
  });

  ////////////////////////////////
  // 🔹 DELETE USER
  ////////////////////////////////
  describe("deleteUser", () => {
    it("should return 403 if user tries to delete self", async () => {
      req.user = { id: 1 };
      req.params.id = "1";

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.USER.CANNOT_DELETE_SELF,
      });
    });

    it("should return 404 if user not found", async () => {
      req.user = { id: 1 };
      req.params.id = "2";
      User.findByPk.mockResolvedValue(null);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: ERRORS.USER.NOT_FOUND });
    });

    it("should return 403 if trying to delete another admin", async () => {
      req.user = { id: 1 };
      req.params.id = "2";
      User.findByPk.mockResolvedValue({ id: 2, role: "administrator" });

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: ERRORS.USER.CANNOT_DELETE_ADMIN,
      });
    });

    it("should delete user successfully", async () => {
      req.user = { id: 1 };
      req.params.id = "2";
      const mockUser = {
        id: 2,
        name: "User2",
        email: "user2@test.com",
        role: "user",
        destroy: jest.fn(),
      };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.deleteUser(req, res);

      // Verificamos que se haya llamado destroy y devuelto el JSON correcto
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: ERRORS.USER.DELETED_SUCCESS,
          user: expect.objectContaining({ id: 2 }),
        })
      );
    });
  });
});
