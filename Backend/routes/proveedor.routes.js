const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const proveedorController = require("../controllers/proveedorController.js");

//router.use(verificacionToken)

router.post("/",proveedorController.crearProveedor);
router.get("/",proveedorController.mostrarProveedores);
router.patch("/:id",proveedorController.actualizarProveedor);
router.delete("/:id",proveedorController.eliminarProveedor);

module.exports = router;