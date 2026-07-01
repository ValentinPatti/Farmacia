const express = require("express")
const indexRouter = express.Router();
const rutaMedicamento = require('./medicamento.routes.js')
const rutaProveedor = require("./proveedor.routes.js");
const rutaCliente = require("./clientes.routes.js");
const rutaEmpleado = require("./empleado.routes.js");
const rutaVenta = require("./venta.routes.js");
const rutaCompra = require("./compras.routes.js");
const rutaInicioSesion = require('./inicioSesion.routes.js')

indexRouter.use('/medicamentos', rutaMedicamento)
indexRouter.use("/proveedores", rutaProveedor);
indexRouter.use("/clientes", rutaCliente);
indexRouter.use("/empleados", rutaEmpleado);
indexRouter.use("/ventas", rutaVenta);
indexRouter.use("/compras", rutaCompra);
indexRouter.use("/ingreso", rutaInicioSesion);

module.exports = indexRouter