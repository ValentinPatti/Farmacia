const pool = require('../database/db.js')

const crearMedicamento = async (req, res) => {
  try {
    const { id_proveedor, nombre, precio, stock, fecha_vencimiento } = req.body;
    
    if (!id_proveedor || !nombre || !precio || !stock || !fecha_vencimiento) {
      return res.status(400).json({ mensaje: "Faltan campos" });
    }
    const sql = `
        INSERT INTO medicamentos
        (id_proveedor,nombre,precio,stock,fecha_vencimiento)
        VALUES(?,?,?,?,?)
    `;

    await pool.query(sql, [
        id_proveedor,
        nombre,
        precio,
        stock,
        fecha_vencimiento
    ])

    res.status(201).json({ mensaje: "El medicamento fue creado correctamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar crear el medicamento" });
  }
};

const mostrarMedicamentos = async (req, res) => {
  try {
    const sql = `SELECT * FROM medicamentos`
    const [medicamentos] = await pool.query(sql)

    res.status(200).json(medicamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Ocurrio un error al intentar buscar los medicamentos",
    });
  }
};

const actualizarMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const [rows] = await pool.query(`SELECT * FROM medicamentos WHERE id_medicamento=?`, [id])

    if (rows.length === 0) {
        return res.status(404).json({
            mensaje: "Medicamento no encontrado"
        });
    }

    const medicamento = rows[0]

    const sql = `
        UPDATE medicamentos 
        SET id_proveedor=?,
            nombre=?, 
            precio=?, 
            stock=?, 
            fecha_vencimiento=?             
        WHERE id_medicamento=?
        `;

    await pool.query(sql, [
        datos.id_proveedor ?? medicamento.id_proveedor,
        datos.nombre ?? medicamento.nombre,
        datos.precio ?? medicamento.precio,
        datos.stock ?? medicamento.stock,
        datos.fecha_vencimiento ?? medicamento.fecha_vencimiento,
        id
    ])
    res.status(200).json({ mensaje: "Medicamento actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Ocurrio un error al intentar actualizar el medicamento",
    });
  }
};

const eliminarMedicamento = async (req, res) => {
  try {
    const { id }= req.params;
    const sql = `DELETE FROM medicamentos WHERE id_medicamento=?` 

    const [resultado] = await pool.query(sql, [id])

    if (resultado.affectedRows === 0) {
        return res.status(404).json({
            mensaje: "Proveedor no encontrado"
        });
    }

    res.status(200).json({ mensaje: "Medicamento eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Ocurrio un error al intentar eliminar el medicamento",
    });
  }
};


module.exports = {
  crearMedicamento,
  mostrarMedicamentos,
  actualizarMedicamento,
  eliminarMedicamento,
};
