const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const ventasController = require("../controllers/ventasController.js");

router.use(verificacionToken)

router.post("/", verificarRol("Administrador", "Empleado"),ventasController.crearVenta);
router.get("/", verificarRol("Administrador", "Empleado"),ventasController.mostrarVentas);
router.patch("/:id", verificarRol("Administrador"),ventasController.actualizarVenta);
router.delete("/:id", verificarRol("Administrador"),ventasController.eliminarVenta);

module.exports = router;