// setupAdmin.js
const express = require("express");
const User = require("../models/User");
const ERRORS = require("../utils/errorMessages");

const router = express.Router();

/**
 * 🔹 Ruta POST /setup-admin/
 * Configuración inicial de administrador.
 * Esta ruta solo se puede usar una vez para crear el primer administrador.
 * Requiere un "secret" especial definido en las variables de entorno.
 */
router.post("/setup-admin/", async (req, res) => {
  try {
    const { name, email, password, secret } = req.body;

    // ✅ Verifica que el secret proporcionado coincida con el definido en el .env
    if (secret !== process.env.SETUP_SECRET) {
      return res.status(403).json({ error: ERRORS.AUTH.ACCESS_DENIED });
    }

    // ✅ Comprueba si ya existe un administrador
    const existingAdmin = await User.findOne({
      where: { role: "administrator" },
    });
    if (existingAdmin) {
      return res.status(400).json({ error: ERRORS.USER.ADMIN_ALREADY_EXISTS });
    }

    // ✅ Crear el administrador
    const admin = await User.create({
      name,
      email,
      password,
      role: "administrator",
    });

    // ✅ Respuesta con datos del nuevo administrador
    res.status(201).json({
      message: ERRORS.USER.ADMIN_CREATED_SUCCESS,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error creando administrador:", error);
    res.status(500).json({ error: ERRORS.GENERAL.SERVER_ERROR });
  }
});

// Exportamos el router para usarlo en server.js
module.exports = router;
