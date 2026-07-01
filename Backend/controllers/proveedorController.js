const pool = require("../database/db.js");

const crearProveedor = async (req, res) => {
    try {
        const { nombre, direccion, telefono, email } = req.body;

        if (!nombre || !direccion || !telefono || !email) {
            return res.status(400).json({ mensaje: "Faltan campos" });
        }
        const sql = `
            INSERT INTO proveedores (nombre, direccion, telefono, email)
            VALUES (?, ?, ?, ?)
        `;

        await pool.query(sql, [
            nombre,
            direccion,
            telefono,
            email
        ]);
        
        res.status(201).json({
            mensaje: "Proveedor creado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Ocurrió un error al crear el proveedor"
        });
    }
};

const mostrarProveedores = async (req, res) => {
    try {
        const sql = `SELECT * FROM proveedores`;
        const [proveedores] = await pool.query(sql)

        res.status(200).json(proveedores);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Ocurrió un error al obtener los proveedores"
        });
    }
};

const actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        const [rows] = await pool.query(`SELECT * FROM proveedores WHERE id_proveedor=?`, [id])

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: "Proveedor no encontrado"
            });
        }
        
         const proveedor = rows[0];

        const sql = `
            UPDATE proveedores
            SET nombre = ?,
                direccion = ?,
                telefono = ?,
                email = ?
            WHERE id_proveedor = ?
        `;

        await pool.query(sql, [
            datos.nombre ?? proveedor.nombre,
            datos.direccion ?? proveedor.direccion,
            datos.telefono ?? proveedor.telefono,
            datos.email ?? proveedor.email,
            id
        ]);

        res.status(200).json({
            mensaje: "Proveedor actualizado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Ocurrió un error al actualizar el proveedor"
        });
    }
};

const eliminarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM proveedores WHERE id_proveedor = ?`;

        const [resultado] = await pool.query(sql, [id])

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Proveedor no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Proveedor eliminado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Ocurrió un error al eliminar el proveedor"
        });
    }
};

module.exports = {
    crearProveedor,
    mostrarProveedores,
    actualizarProveedor,
    eliminarProveedor
};