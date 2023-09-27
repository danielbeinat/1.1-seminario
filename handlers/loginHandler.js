const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const { dbConfig } = require("../db/database");
const { generateSessionKey } = require("../helpers/sessionHelpers");

async function loginHandler(req, res) {
  const { userId, password } = req.body;
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Verifica las credenciales del usuario
    const [rows] = await connection.execute(
      "CALL `usp-authenticate-user-by-id`(?)",
      [userId]
    );

    console.log("Resultado de la llamada al procedimiento almacenado:", rows);

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      console.error("Usuario no encontrado o credenciales incorrectas");
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const storedPasswordHash = rows[0][0].password;

    if (!storedPasswordHash) {
      console.error("Contraseña almacenada en la base de datos incorrecta");
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Comparar contraseñas de forma segura utilizando bcrypt
    const passwordMatch = await bcrypt.compare(password, storedPasswordHash);

    if (passwordMatch) {
      // Contraseña válida, puedes generar una clave de sesión y realizar otras acciones de inicio de sesión aquí
      const sessionKey = await generateSessionKey();
      await connection.execute("CALL `usp-create-user-session`(?, ?)", [
        userId, // Usar userId, no storedUserId
        sessionKey,
      ]);

      // Obtén el grupo del usuario desde la base de datos
      const [groupRows] = await connection.execute(
        "SELECT group_id FROM groups_members WHERE user_id = ?",
        [userId]
      );

      if (groupRows.length > 0) {
        const groupId = groupRows[0].group_id;
        res.json({ sessionKey, groupId });
      } else {
        res.json({ sessionKey });
      }
    } else {
      console.error("Contraseña incorrecta");
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error de inicio de sesión:", error);
    res.status(500).json({ error: "Error de inicio de sesión" });
  } finally {
    connection.end();
  }
}

module.exports = loginHandler;
