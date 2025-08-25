# 📖 Diccionario de Datos

Este documento describe las tablas, atributos y restricciones principales del sistema.

---

## 🧑 Tabla: Users

| Campo      | Tipo de dato                 | Restricciones / Descripción                    |
| ---------- | ---------------------------- | ---------------------------------------------- |
| id         | INTEGER (PK, autoinc)        | Identificador único de usuario                 |
| name       | VARCHAR(255)                 | Requerido                                      |
| email      | VARCHAR(255)                 | Requerido, único                               |
| password   | VARCHAR(255)                 | Requerido, almacenado en formato hash (bcrypt) |
| role       | ENUM('user','administrator') | Por defecto `user`                             |
| created_at | TIMESTAMP                    | Generado automáticamente                       |
| updated_at | TIMESTAMP                    | Generado automáticamente                       |

---

## 📦 Tabla: Products

| Campo       | Tipo de dato            | Restricciones / Descripción      |
| ----------- | ----------------------- | -------------------------------- |
| id          | INTEGER (PK, autoinc)   | Identificador único del producto |
| name        | VARCHAR(255)            | Requerido                        |
| description | TEXT                    | Opcional                         |
| price       | DECIMAL(10,2)           | Requerido, debe ser >= 0         |
| category    | VARCHAR(50)             | Por defecto `'General'`          |
| stock       | INTEGER                 | Por defecto 0, debe ser >= 0     |
| is_active   | BOOLEAN                 | Por defecto `true`               |
| user_id     | INTEGER (FK → Users.id) | Usuario dueño del producto       |
| created_at  | TIMESTAMP               | Generado automáticamente         |
| updated_at  | TIMESTAMP               | Generado automáticamente         |
