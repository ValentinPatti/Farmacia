const express = require("express");
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const empleadoController = require("../controllers/empleadoController.js");

//router.use(verificacionToken)

router.post("/",empleadoController.crearEmpleado);
router.get("/",empleadoController.mostrarEmpleados);
router.patch("/:id",empleadoController.actualizarEmpleado);
router.delete("/:id",empleadoController.eliminarEmpleado);

module.exports = router;