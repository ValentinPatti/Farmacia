const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const clienteController = require("../controllers/clientesController.js");

router.use(verificacionToken)

router.post("/", verificarRol("Administrador", "Empleado"), clienteController.crearCliente);
router.get("/", verificarRol("Administrador", "Empleado"), clienteController.mostrarClientes);
router.patch("/:id", verificarRol("Administrador", "Empleado"), clienteController.actualizarCliente);
router.delete("/:id", verificarRol("Administrador"), clienteController.eliminarCliente);

module.exports = router;