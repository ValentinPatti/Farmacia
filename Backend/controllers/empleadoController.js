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
            INSERT INTO empleado
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
        const empleados = await empleadoModel.obtenerTodos();

        res.status(200).json(empleados);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener empleados"
        });
    }
};
const mostrarEmpleadoPorDni = async (req, res) => {
    try {
        const dni = req.params.dni;

        const empleado = await empleadoModel.obtenerEmpleadoPorDni(dni);

        res.status(200).json(empleado);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al buscar empleado"
        });
    }
};
const actualizarEmpleado = async (req, res) => {
    try {
        const id = req.params.id;
        const datos = req.body;

        await empleadoModel.actualizarEmpleado(id, datos);

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
        const id = req.params.id;

        await empleadoModel.eliminarEmpleado(id);

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
    mostrarEmpleadoPorDni,
    actualizarEmpleado,
    eliminarEmpleado
};