const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const compraController = require("../controllers/comprasController.js");

router.use(verificacionToken)

router.post("/", verificarRol("administrador"), compraController.crearCompra);
router.get("/", verificarRol("administrador"), compraController.mostrarCompras);
router.patch("/:id", verificarRol("administrador"), compraController.actualizarCompra);
router.delete("/:id", verificarRol("administrador"), compraController.eliminarCompra);

module.exports = router;