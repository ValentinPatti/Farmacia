const express = require("express")
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const medicamentosController = require("../controllers/medicamentosController.js")

router.use(verificacionToken)

router.post('/', verificarRol("Administrador"), medicamentosController.crearMedicamento)
router.get('/', verificarRol("Administrador", "Empleado"), medicamentosController.mostrarMedicamentos)
router.patch('/:id', verificarRol("Administrador"), medicamentosController.actualizarMedicamento)
router.delete('/:id', verificarRol("Administrador"), medicamentosController.eliminarMedicamento)


module.exports = router