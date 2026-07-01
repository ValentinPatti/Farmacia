const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const empleadoController = require("../controllers/empleadoController.js");

router.use(verificacionToken)

router.post("/", verificarRol("administrador"),empleadoController.crearEmpleado);
router.get("/", verificarRol("administrador"),empleadoController.mostrarEmpleados);
router.get("/:dni", verificarRol("administrador"),empleadoController.mostrarEmpleadoPorDni);
router.patch("/:id", verificarRol("administrador"),empleadoController.actualizarEmpleado);
router.delete("/:id", verificarRol("administrador"),empleadoController.eliminarEmpleado);

module.exports = router;