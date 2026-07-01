const express = require("express")
const indexRouter = express.Router();
const rutaInicioSesion = require('./ingreso.routes.js')
const rutaEmpleado = require("./empleados.routes.js");
const rutaProveedor = require("./proveedor.routes.js");
const rutaCliente = require("./clientes.routes.js");
//const rutaMedicamento = require('./medicamento.routes.js')
// const rutaVenta = require("./venta.routes.js");
// const rutaCompra = require("./compras.routes.js");

indexRouter.use("/ingreso", rutaInicioSesion);
indexRouter.use("/empleados", rutaEmpleado);
indexRouter.use("/proveedores", rutaProveedor);
indexRouter.use("/clientes", rutaCliente);
// indexRouter.use('/medicamentos', rutaMedicamento)
// indexRouter.use("/ventas", rutaVenta);
// indexRouter.use("/compras", rutaCompra);

module.exports = indexRouter