// server.js
// Archivo principal del servidor: monta la API, conecta la BD y configura seguridad

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const path = require("path");
const sequelize = require("./config/config");
const errorHandler = require("./middleware/errorHandler");
const selfsigned = require("selfsigned");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");

// 📌 Importamos rutas
const setupAdminRoutes = require("./routes/setupAdmin");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

// 📌 Cargamos variables de entorno (.env)
dotenv.config();

// 📌 Inicializamos express
const app = express();
app.use(express.json()); // Permite recibir JSON en las peticiones

// 🌐 Configuración CORS segura con whitelist de orígenes permitidos
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "https://localhost:3000"]; // incluimos https para Swagger

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    // ✅ Permitimos el origen si está en la lista
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    // 🔄 Preflight request (cuando el navegador verifica CORS antes de la petición real)
    if (req.method === "OPTIONS") {
      console.log(`⚡ Preflight request from ${origin}`);
      return res.sendStatus(204);
    }

    next();
  } else {
    // 🚫 Bloqueamos si no está permitido
    console.warn(`❌ CORS blocked for origin: ${origin}`);
    return res.status(403).json({ error: "Acceso denegado por CORS" });
  }
});

// 🚀 Rutas de la API
app.use("/api/", setupAdminRoutes); // Inicializar admin
app.use("/api/users", userRoutes); // Rutas de usuarios
app.use("/api/products", productRoutes); // Rutas de productos

// ⚡ Middleware global de errores
app.use(errorHandler);

// 🔹 Inicialización del servidor (solo si no estamos en modo test)
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      // 🔗 Conexión a la base de datos
      await sequelize.authenticate();
      console.log("✅ Conexión a la base de datos establecida.");

      // 📂 Sincroniza modelos con la BD (crea/actualiza tablas) si queremos ver los logs debemos paralo a true.
      await sequelize.sync({ alter: true, logging: false });
      console.log("✅ Tablas sincronizadas correctamente.");

      const PORT = process.env.PORT || 3000;

      // 🔑 Certificados HTTPS
      const certsDir = path.join(__dirname, "certs");
      if (!fs.existsSync(certsDir)) fs.mkdirSync(certsDir);

      const keyPath = path.join(certsDir, "key.pem");
      const certPath = path.join(certsDir, "cert.pem");

      // 📌 Si no existen certificados, los generamos auto-firmados
      if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        console.log(
          "🔐 Certificados no encontrados, generando auto-firmados..."
        );
        const attrs = [{ name: "commonName", value: "localhost" }];
        const pems = selfsigned.generate(attrs, { days: 365 });
        fs.writeFileSync(keyPath, pems.private);
        fs.writeFileSync(certPath, pems.cert);
        console.log("✅ Certificados auto-firmados generados.");
      }

      // 🔹 Opciones de HTTPS (clave y certificado)
      const options = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };

      // 🚀 Levantamos el servidor HTTPS
      https.createServer(options, app).listen(PORT, () => {
        console.log(`🚀 Servidor HTTPS corriendo en https://localhost:${PORT}`);
      });
    } catch (err) {
      console.error(
        "❌ No se pudo conectar a la base de datos o iniciar servidor:",
        err
      );
    }
  })();
}

// 📖 Documentación Swagger (disponible en /api/docs)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 📌 Exportamos app para testing
module.exports = app;
