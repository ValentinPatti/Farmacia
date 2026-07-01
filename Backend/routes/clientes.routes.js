const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const clienteController = require("../controllers/clientesController.js");

//router.use(verificacionToken)

router.post("/",clienteController.crearCliente);
router.get("/",clienteController.mostrarClientes);
router.patch("/:id",clienteController.actualizarCliente);
router.delete("/:id",clienteController.eliminarCliente);

module.exports = router;