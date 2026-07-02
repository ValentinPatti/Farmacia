const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const proveedorController = require("../controllers/proveedorController.js");

router.use(verificacionToken)

router.post("/", verificarRol("administrador"), proveedorController.crearProveedor);
router.get("/", verificarRol("administrador"), proveedorController.mostrarProveedores);
router.patch("/:id", verificarRol("administrador"), proveedorController.actualizarProveedor);
router.delete("/:id", verificarRol("administrador"), proveedorController.eliminarProveedor);

module.exports = router;