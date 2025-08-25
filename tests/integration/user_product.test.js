const request = require("supertest"); // Librería para hacer peticiones HTTP a la API
const app = require("../../server"); // Importa la app de Express
const sequelize = require("../../config/config"); // Configuración de la base de datos
const User = require("../../models/User");
const Product = require("../../models/Product");

// Descripción del conjunto de tests
describe("Flujo completo: usuarios y productos", () => {
  // Antes de correr los tests, sincroniza la DB y limpia todo (force: true)
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Después de los tests, cierra la conexión a la DB
  afterAll(async () => {
    await sequelize.close();
  });

  // Test principal: registra usuarios, hace login y crea productos
  it("Crea 3 usuarios, loguea y genera 3 productos para cada uno", async () => {
    // Datos de prueba: 3 usuarios
    const usersData = [
      { name: "User1", email: "user1@test.com", password: "123456" },
      { name: "User2", email: "user2@test.com", password: "123456" },
      { name: "User3", email: "user3@test.com", password: "123456" },
    ];

    let tokens = []; // Guardará los tokens de autenticación de cada usuario

    // 1️⃣ Registrar y loguear usuarios
    for (const user of usersData) {
      // Registro
      await request(app).post("/api/users/register").send(user).expect(201);

      // Login
      const loginRes = await request(app)
        .post("/api/users/login")
        .send({ email: user.email, password: user.password })
        .expect(200);

      // Verifica que el token se haya generado correctamente
      expect(loginRes.body.access_token).toBeDefined();
      tokens.push(loginRes.body.access_token);
    }

    // 2️⃣ Crear 3 productos para cada usuario
    for (let i = 0; i < tokens.length; i++) {
      for (let j = 1; j <= 3; j++) {
        const productRes = await request(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${tokens[i]}`) // Pasa el token
          .send({
            name: `Producto${j}-User${i + 1}`,
            description: `Descripción producto ${j} del usuario ${i + 1}`,
            price: 10 * j,
          })
          .expect(201); // Verifica que se haya creado correctamente

        // Verifica que el nombre del producto contenga "ProductoX"
        expect(productRes.body.name).toContain(`Producto${j}`);
      }
    }

    // 3️⃣ Verificar que cada usuario tiene 3 productos
    for (let i = 0; i < tokens.length; i++) {
      const productsRes = await request(app)
        .get("/api/products")
        .set("Authorization", `Bearer ${tokens[i]}`) // Pasa el token
        .expect(200);

      // Cada usuario debe tener exactamente 3 productos
      expect(productsRes.body.length).toBe(3);
    }
  });
});
