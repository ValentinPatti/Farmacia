const pool = require("../database/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    //tomar los datos del body de la request
    //datos de usuario nuevo = nombre, apellido, dni, usuario, contraseña, rol, telefono

    const { nombre, apellido, dni, usuario, contrasena, rol, telefono } = req.body;

    //valido esos datos

    if (!nombre || !apellido || !dni || !contrasena || !rol || !telefono ) {
      return res.status(400).json({ message: "Faltan rellenar los campos" });
    }

    //buscar el dni en la db

    const buscarDni = `SELECT * FROM empleados WHERE dni=?`;
    const [rows] = await pool.query(buscarDni, [dni]);

    //si existe le envio un error diciendo que ya existe el usuario

    if (rows.length > 0) {
      return res.status(400).json({ message: "DNI inválido" });
    }

    //encriptar la contraseña

    const hashedContrasenia = await bcrypt.hash(contrasena, 12);

    //insertar el nuevo usuario

    const insertoNuevoUsuario = `INSERT INTO empleados (nombre, apellido, dni, usuario, contrasena, rol, telefono) VALUES (?,?,?,?,?,?,?)`;

    const [user] = await pool.query(insertoNuevoUsuario, [
      nombre,
      apellido,
      dni,
      usuario,
      hashedContrasenia,
      rol,
      telefono      
    ]);

    //generar un token

    const token = jwt.sign({ id: user.insertId }, process.env.SECRET_KEY, {
      expiresIn: "10h",
    });

    //usuario creado correctamente + token

    res.status(201).json({ message: "Usuario creado correctamente" }, token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    //recibo los datos por el cuerpo de la request (dni, contraseña)

    const { usuario, contrasena } = req.body;

    //valido los datos

    if (!usuario || !contrasena) {
      return res.status(400).json({ message: "Campos incompletos" });
    }

    //busco ese dni en la db

    const buscarUsuario = `SELECT * FROM empleados WHERE usuario=?`;

    const [rows] = await pool.query(buscarUsuario, [usuario]);

    //si no existe mando mensaje de error

    if (rows.length === 0) {
      return res.status(400).json({ message: "No existe el usuario" });
    }

    //creo un usuario desde rows

    const empleado = rows[0];
    //comparo la contraseña ingresada con la hasheada
    
    const comparoContrasena = await bcrypt.compare(
      contrasena,
      empleado.contrasena,
    );

    if (!comparoContrasena) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    //generar token

    const token = jwt.sign({ id: empleado.id, rol: empleado.rol }, process.env.SECRET_KEY, {
      expiresIn: "10h",
    });
    //respondo con usuario logueado + token
    console.log("Datos del usuario en el backend:", usuario)
    res.status(200).json({ message: "Usuario logueado correctamente" , token, rol: empleado.rol, nombre: empleado.nombre});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
