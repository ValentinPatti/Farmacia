const pool = require("../database/db.js");

const crearCliente = async (req, res) => {
    try {
        const { dni, nombre, apellido, telefono} = req.body;

        if (!dni || !nombre || !apellido || !telefono) {
            return res.status(400).json({ mensaje: "Faltan campos" });
        }

        const sql = `
        INSERT INTO clientes (dni, nombre, apellido, telefono)
        VALUES (?, ?, ?, ?)`

        await pool.query(sql, [
        dni,
        nombre,
        apellido,
        telefono
        ]);

        res.status(201).json({
            mensaje: "Cliente creado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear cliente"
        });
    }
};


const mostrarClientes = async (req, res) => {
    try {
        const sql = `SELECT * FROM clientes`;
        const [clientes] = await pool.query(sql)

        res.status(200).json(clientes);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener clientes"
        });
    }
};


const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        const [rows] = await pool.query(`SELECT * FROM clientes WHERE id_cliente=?`, [id])

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }

        const cliente = rows[0]

        const sql = `
        UPDATE clientes
        SET dni = ?,
            nombre = ?,
            apellido = ?,
            telefono = ?
        WHERE id_cliente = ?
    `;

        await pool.query(sql, [
            datos.dni ?? cliente.dni,
            datos.nombre ?? cliente.nombre,
            datos.apellido ?? cliente.apellido,
            datos.telefono ?? cliente.telefono,
            id
        ])
        res.status(200).json({
            mensaje: "Cliente actualizado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar cliente"
        });
    }
};

const eliminarCliente = async (req, res) => {
    try {
        const { id }  = req.params;
        const sql = `DELETE FROM clientes WHERE id_cliente = ?`;

        const [resultado] = await pool.query(sql, [id])

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Cliente no encontrado"
            });
        }
        res.status(200).json({
            mensaje: "Cliente eliminado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar cliente"
        });
    }
};

module.exports = {
    crearCliente,
    mostrarClientes,
    actualizarCliente,
    eliminarCliente
};