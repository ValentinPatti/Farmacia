const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const ventasController = require("../controllers/ventasController.js");
//router.use(verificacionToken)

router.post("/",ventasController.crearVenta);
router.get("/",ventasController.mostrarVentas);
router.patch("/:id",ventasController.actualizarVenta);
router.delete("/:id",ventasController.eliminarVenta);

module.exports = router;