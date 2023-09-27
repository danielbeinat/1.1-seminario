const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
const { dbConfig } = require("../db/database");

async function registerHandler(req, res) {
  const { name, password } = req.body;
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Verifica si el nombre de usuario ya está en uso
    const [existingUser] = await connection.execute(
      "SELECT id FROM users WHERE name = ?",
      [name]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "El nombre de usuario ya está en uso" });
    }

    // Hashea la contraseña antes de almacenarla en la base de datos
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Llama al procedimiento almacenado para registrar al nuevo usuario
    await connection.execute("CALL `usp-create-user`(?, ?)", [
      name,
      hashedPassword,
    ]);

    // Verifica si el nombre de usuario ya está en uso
    // Realiza el registro y otras operaciones necesarias
    // ...

    res.json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error de registro:", error);
    res.status(500).json({ error: "Error de registro" });
  } finally {
    connection.end();
  }
}

module.exports = registerHandler;
