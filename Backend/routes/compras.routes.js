const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const compraController = require("../controllers/comprasController.js");

//router.use(verificacionToken)

router.post("/",compraController.crearCompra);
router.get("/",compraController.mostrarCompras);
router.patch("/:id",compraController.actualizarCompra);
router.delete("/:id",compraController.eliminarCompra);

module.exports = router;