const mysql = require("mysql2/promise")
const dotenv = require("dotenv")
require("dotenv").config();


const pool = mysql.createPool ({
    host: process.env.DB_HOST,
    user: process.env.DB_USUARIO,
    database: process.env.DB_NOMBREDB,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const probarConexion = async ()=>{
    try {
        const connection = await pool.getConnection()
        console.log('Conexion a la db exitosa')
        connection.release()
    } catch (error) {
        console.error('Error al conectar con la db')
    }
}

probarConexion()

module.exports = pool;
