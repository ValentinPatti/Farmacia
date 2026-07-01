const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const compraController = require("../controllers/comprasController.js");

 verificarRol("Administrador"), router.use(verificacionToken)

router.post("/", verificarRol("Administrador"), compraController.crearCompra);
router.get("/", verificarRol("Administrador"), compraController.mostrarCompras);
router.patch("/:id", verificarRol("Administrador"), compraController.actualizarCompra);
router.delete("/:id", verificarRol("Administrador"), compraController.eliminarCompra);

module.exports = router;