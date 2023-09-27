const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const mysql = require("mysql2/promise");
// const authorizeAdmin = require("./middlewares/authorizeAdmin");

const { connectToDatabase, dbConfig } = require("./db/database");
const authenticateSession = require("./middlewares/authMiddleware");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const registerHandler = require("./handlers/registerHandler");
app.post("/register", registerHandler);
const loginHandler = require("./handlers/loginHandler");
app.post("/login", loginHandler);

const logoutHandler = require("./handlers/logoutHandler");
app.post("/logout", authenticateSession, logoutHandler);

// app.get("/admin-dashboard", authenticateSession, authorizeAdmin, (req, res) => {
//   // Renderiza la página HTML del dashboard y envíala como respuesta
//   res.sendFile(__dirname + "./public/admin-dashboard.html");
// });

// Middleware de autorización
// function authorize(groups) {
//   return function (req, res, next) {
//     const { userId } = req.locals;

//     if (!groups.includes(userId)) {
//       return res.status(403).json({ error: "Acceso no autorizado" });
//     }

//     next();
//   };
// }

// Ejemplo de ruta autorizada
// app.get(
//   "/secure-resource",
//   authenticateSession,
//   authorize([1, 2]),
//   (req, res) => {
//     // Acción autorizada para usuarios con IDs 1 y 2
//     res.json({ message: "Recurso seguro accesible" });
//   }
// );

//administrador

// function authorizeAdmin(req, res, next) {
//   const { userId } = req.locals;

//   // Supongamos que el ID de rol del Administrador es 1
//   if (userId === 1) {
//     next(); // Permite el acceso al usuario Administrador
//   } else {
//     return res.status(403).json({ error: "Acceso no autorizado" });
//   }
// }

async function startServer() {
  const dbConnection = await connectToDatabase();

  // Resto de tu código ...

  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}

startServer();
