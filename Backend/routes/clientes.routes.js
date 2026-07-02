const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const clienteController = require("../controllers/clientesController.js");

router.use(verificacionToken)

router.post("/", verificarRol("administrador", "empleado"), clienteController.crearCliente);
router.get("/", verificarRol("administrador", "empleado"), clienteController.mostrarClientes);
router.patch("/:id", verificarRol("administrador", "empleado"), clienteController.actualizarCliente);
router.delete("/:id", verificarRol("administrador"), clienteController.eliminarCliente);

module.exports = router;