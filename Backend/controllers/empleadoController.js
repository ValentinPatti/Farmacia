const bcrypt = require("bcrypt")
const pool = require("../database/db.js");

const crearEmpleado = async (req, res) => {
    try {
        const { nombre, apellido, dni, usuario, contrasena, rol, telefono } = req.body;

        if (!nombre || !apellido || !dni || !usuario|| !contrasena || !rol || !telefono) {
            return res.status(400).json({ mensaje: "Faltan campos" });
        }

        const hash = await bcrypt.hash(contrasena, 12);

        const sql = `
            INSERT INTO empleados
            (nombre, apellido, dni, usuario, contrasena, rol, telefono)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            await pool.query(sql, [
            nombre,
            apellido,
            dni,
            usuario,
            hash,
            rol,
            telefono
            ]);

        res.status(201).json({
            mensaje: "Empleado creado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al crear el empleado"
        });
    }
};
const mostrarEmpleados = async (req, res) => {
    try {
        const sql = `SELECT * FROM empleados`;
        const [empleados] = await pool.query(sql);

        res.status(200).json(empleados);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener empleados"
        });
    }
};

const actualizarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;

        const datos = req.body;
        const [rows] = await pool.query(`SELECT * FROM empleados WHERE id_empleado=?`, [id])

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: "Empleado no encontrado"
            });
        }

        const empleado = rows[0]

        let contrasena = empleado.contrasena

        if (datos.contrasena) {
            contrasena = await bcrypt.hash(datos.contrasena, 12)
        }

        const sql = `
        UPDATE empleados
        SET nombre = ?,
            apellido = ?,
            dni = ?,
            usuario = ?,
            contrasena = ?,
            rol = ?,
            telefono = ?
        WHERE id_empleado = ?
    `;

        await pool.query(sql, [
        datos.nombre ?? empleado.nombre,
        datos.apellido ?? empleado.apellido,
        datos.dni ?? empleado.dni,
        datos.usuario ?? empleado.usuario,
        contrasena,
        datos.rol ?? empleado.rol,
        datos.telefono ?? empleado.telefono,
        id
    ]);

        res.status(200).json({
            mensaje: "Empleado actualizado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al actualizar empleado"
        });
    }
};
const eliminarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM empleados WHERE id_empleado = ?`;
        await pool.query(sql, [id]);

        res.status(200).json({
            mensaje: "Empleado eliminado correctamente"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar empleado"
        });
    }
};

module.exports = {
    crearEmpleado,
    mostrarEmpleados,
    actualizarEmpleado,
    eliminarEmpleado
};