const pool = require("../database/db.js");

const crearCompra = async (req, res) => {
    try {
        const { id_proveedor, id_medicamento, cantidad, precio_unitario, total, fecha } = req.body;

        if (!id_proveedor || !id_medicamento || !cantidad || !precio_unitario || !total || !fecha) {
            return res.status(400).json({mensaje: "Faltan campos"})
        }
        const sql = `
            INSERT INTO compras (id_proveedor, id_medicamento, cantidad, precio_unitario, total, fecha)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await pool.query(sql, [
            id_proveedor,
            id_medicamento,
            cantidad,
            precio_unitario,
            total,
            fecha
    ]);

        res.status(201).json({
            mensaje: "Compra registrada correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al crear compra"
        });
    }
};

const mostrarCompras = async (req, res) => {
    try {
        const sql = `SELECT * FROM compras`;
        const [compras] = await pool.query(sql);
        
        res.status(200).json(compras);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener compras"
        });
    }
};

const actualizarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        const [rows] = await pool.query(`SELECT * FROM compras WHERE id_compra=?`, [id])
        
        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: "Compra no encontrada"
            });
        }

        const compra = rows[0]

        const sql = `
        UPDATE compras
        SET id_proveedor = ?,
            id_medicamento = ?,
            cantidad = ?,
            precio_unitario = ?,
            total = ?,
            fecha = ?
        WHERE id_compra = ?
    `;

        await pool.query(sql, [
            datos.id_proveedor ?? compra.id_proveedor,
            datos.id_medicamento ?? compra.id_medicamento,
            datos.cantidad ?? compra.cantidad,
            datos.precio_unitario ?? compra.precio_unitario,
            datos.total ?? compra.total,
            datos.fecha ?? compra.fecha,
            id
        ])

        res.status(200).json({
            mensaje: "Compra actualizada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar compra"
        });
    }
};

const eliminarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM compras WHERE id_compra = ?`;
        const [resultado] = await pool.query(sql, [id])

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Compra no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Compra eliminada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar compra"
        });
    }
};

module.exports = {
    crearCompra,
    mostrarCompras,
    actualizarCompra,
    eliminarCompra
};