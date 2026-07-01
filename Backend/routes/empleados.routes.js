const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const empleadoController = require("../controllers/empleadoController.js");

router.use(verificacionToken)

router.post("/", verificarRol("Administrador"),empleadoController.crearEmpleado);
router.get("/", verificarRol("Administrador"),empleadoController.mostrarEmpleados);
router.patch("/:id", verificarRol("Administrador"),empleadoController.actualizarEmpleado);
router.delete("/:id", verificarRol("Administrador"),empleadoController.eliminarEmpleado);

module.exports = router;