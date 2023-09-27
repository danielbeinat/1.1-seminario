// function authorizeAdmin(req, res, next) {
//   const { userId } = req.locals;

//   // Supongamos que el ID de rol del Administrador es 1 o 2
//   if (userId === 1 || userId === 2) {
//     next(); // Permite el acceso al usuario Administrador
//   } else {
//     return res.status(403).json({ error: "Acceso no autorizado" });
//   }
// }

// module.exports = authorizeAdmin;
