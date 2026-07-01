const pool = require("../database/db.js");

const crearVenta = async (req, res) => {
    try {
        const { id_empleado, id_medicamento, cantidad, precio_unitario, metodo_pago, precio_total, fecha} = req.body;

        if (!id_empleado || !id_medicamento || !cantidad || !precio_unitario || !metodo_pago || !precio_total || !fecha) {
            return res.status(400).json({ mensaje: "Faltan campos" });
        }

        const sql = `
        INSERT INTO ventas(id_empleado, id_medicamento, cantidad, precio_unitario, metodo_pago, precio_total, fecha)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.query(sql, [
        id_empleado,
        id_medicamento,
        cantidad,
        precio_unitario,
        metodo_pago,
        precio_total,
        fecha
        ]);

        res.status(201).json({
            mensaje: "Venta realizada correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al realizar la venta"
        });
    }
};

const mostrarVentas = async (req, res) => {
    try {
        const sql = `SELECT * FROM ventas`;
        const [ventas] = await pool.query(sql)

        res.status(200).json(ventas);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener ventas"
        });
    }
};

const actualizarVenta = async (req, res) => {
    try {
        const { id }= req.params;
        const datos = req.body;

        const [rows] = await pool.query(`SELECT * FROM ventas WHERE id_venta=?`, [id])

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: "Proveedor no encontrado"
            });
        }
        const venta = rows[0];

        const sql = `
        UPDATE ventas
        SET id_empleado = ?,
            id_medicamento = ?,
            cantidad = ?,
            precio_unitario = ?,
            metodo_pago = ?,
            precio_total = ?,
            fecha = ?
        WHERE id_venta = ?
        `;

        await pool.query(sql, [
        datos.id_empleado ?? venta.id_empleado,
        datos.id_medicamento ?? venta.id_medicamento,
        datos.cantidad ?? venta.cantidad,
        datos.precio_unitario ?? venta.precio_unitario,
        datos.metodo_pago ?? venta.metodo_pago,
        datos.precio_total ?? venta.precio_total,
        datos.fecha ?? venta.fecha,
        id
        ]);

        res.status(200).json({
            mensaje: "Venta actualizada correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar la venta"
        });
    }
};

const eliminarVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM ventas WHERE id_venta = ?`;

        const [resultado] = await pool.query(sql, [id])

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Venta no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Venta eliminada correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar la venta"
        });
    }
};

module.exports = {
    crearVenta,
    mostrarVentas,
    actualizarVenta,
    eliminarVenta
};