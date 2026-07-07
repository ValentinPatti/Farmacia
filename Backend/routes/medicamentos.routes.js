const express = require("express")
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const medicamentosController = require("../controllers/medicamentosController.js")

router.use(verificacionToken)

router.post('/', verificarRol("administrador"), medicamentosController.crearMedicamento)
router.get('/', verificarRol("administrador", "empleado"), medicamentosController.mostrarMedicamentos)
router.patch('/:id', verificarRol("administrador"), medicamentosController.actualizarMedicamento)
router.delete('/:id', verificarRol("administrador"), medicamentosController.eliminarMedicamento)


module.exports = router