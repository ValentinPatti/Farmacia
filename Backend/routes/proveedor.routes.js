const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const proveedorController = require("../controllers/proveedorController.js");

router.use(verificacionToken)

router.post("/", verificarRol("Administrador"), proveedorController.crearProveedor);
router.get("/", verificarRol("Administrador"), proveedorController.mostrarProveedores);
router.patch("/:id", verificarRol("Administrador"), proveedorController.actualizarProveedor);
router.delete("/:id", verificarRol("Administrador"), proveedorController.eliminarProveedor);

module.exports = router;