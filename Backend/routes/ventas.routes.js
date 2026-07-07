const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const ventasController = require("../controllers/ventasController.js");

router.use(verificacionToken)

router.post("/", verificarRol("administrador", "empleado"),ventasController.crearVenta);
router.get("/", verificarRol("administrador", "empleado"),ventasController.mostrarVentas);
router.patch("/:id", verificarRol("administrador"),ventasController.actualizarVenta);
router.delete("/:id", verificarRol("administrador"),ventasController.eliminarVenta);

module.exports = router;