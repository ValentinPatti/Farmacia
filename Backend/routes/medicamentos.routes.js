const express = require("express")
const router = express.Router();
const verificacionToken = require('../middlewares/auth.middlewares.js')
const verificarRol = require('../middlewares/rol.middleware.js')
const medicamentosController = require("../controllers/medicamentosController.js")

//router.use(verificacionToken)

router.post('/', medicamentosController.crearMedicamento)
router.get('/', medicamentosController.mostrarMedicamentos)
router.patch('/:id', medicamentosController.actualizarMedicamento)
router.delete('/:id', medicamentosController.eliminarMedicamento)


module.exports = router