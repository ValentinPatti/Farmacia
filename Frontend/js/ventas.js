verificarAutenticacion();

verificarRol("Administrador", "Empleado");

const tablaVentas = document.getElementById("tablaVentas");
const rol = (localStorage.getItem("rol") || "").toLowerCase();

function esAdministrador() {
  return rol === "administrador";
}

//============================
// OBTENER VENTAS
//============================

async function cargarVentas() {
  try {
    const response = await API.get("/ventas");

    mostrarVentas(response.data);
  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar las ventas.");
  }
}

//============================
// DIBUJAR TABLA
//============================

function mostrarVentas(ventas) {
  tablaVentas.innerHTML = "";

  if (ventas.length === 0) {
    tablaVentas.innerHTML = `
      <tr>
        <td colspan="4">
          No existen ventas registradas.
        </td>
      </tr>
    `;
    return;
  }

  ventas.forEach((venta) => {
    let botones = "";

    if (esAdministrador()) {
      botones = `
        <button
          class="btn btn-warning btn-sm me-2"
          onclick="editarVenta(${venta.id_venta})">
          Editar
        </button>

        <button
          class="btn btn-danger btn-sm"
          onclick="abrirModalEliminar(${venta.id_venta})">
          Eliminar
        </button>
      `;
    }

    tablaVentas.innerHTML += `
      <tr>

        <td>${new Date(venta.fecha).toLocaleDateString("es-AR")}</td>

        <td>${venta.metodo_pago}</td>

        <td>$${venta.total}</td>

        <td ${!esAdministrador() ? 'style="display:none;"' : ""}>
          ${botones}
        </td>

      </tr>
    `;
  });
}

//============================
// MODAL
//============================

const modalVenta = new bootstrap.Modal(document.getElementById("modalVenta"));

const formVenta = document.getElementById("formVenta");

const btnGuardar = document.getElementById("btnGuardarVenta");

const tituloModal = document.getElementById("tituloModal");

let idEditar = null;

//============================
// NUEVA VENTA
//============================

document.getElementById("btnNuevaVenta").addEventListener("click", () => {
  if (!esAdministrador()) return;

  idEditar = null;

  tituloModal.innerText = "Nueva venta";

  formVenta.reset();
});

//============================
// GUARDAR
//============================

btnGuardar.addEventListener("click", guardarVenta);

async function guardarVenta() {
  if (!esAdministrador()) return;

  const venta = {
    fecha: document.getElementById("fecha").value,

    metodo_pago: document.getElementById("metodoPago").value,

    total: Number(document.getElementById("total").value),
  };

  if (!venta.fecha || !venta.metodo_pago || !venta.total) {
    alert("Debe completar todos los campos.");
    return;
  }

  try {
    if (idEditar === null) {
      await API.post("/ventas", venta);

      alert("Venta creada correctamente.");
    } else {
      await API.patch(`/ventas/${idEditar}`, venta);

      alert("Venta actualizada correctamente.");
    }

    modalVenta.hide();

    cargarVentas();
  } catch (error) {
    console.error(error);

    alert("Ocurrió un error.");
  }
}

//============================
// EDITAR
//============================

async function editarVenta(id) {
  if (!esAdministrador()) return;

  try {
    const response = await API.get("/ventas");

    const venta = response.data.find((v) => v.id_venta === id);

    if (!venta) {
      alert("Venta no encontrada.");
      return;
    }

    idEditar = id;

    tituloModal.innerText = "Editar venta";

    document.getElementById("fecha").value = venta.fecha;

    document.getElementById("metodoPago").value = venta.metodo_pago;

    document.getElementById("total").value = venta.total;

    modalVenta.show();
  } catch (error) {
    console.error(error);
  }
}

//============================
// MODAL ELIMINAR
//============================

const modalEliminar = new bootstrap.Modal(
  document.getElementById("modalEliminarVenta"),
);

const btnEliminar = document.getElementById("btnEliminarVenta");

let idEliminar = null;

//============================
// ABRIR MODAL
//============================

function abrirModalEliminar(id) {
  if (!esAdministrador()) return;

  idEliminar = id;

  modalEliminar.show();
}

//============================
// ELIMINAR
//============================

btnEliminar.addEventListener("click", eliminarVenta);

async function eliminarVenta() {
  if (!esAdministrador()) return;

  try {
    await API.delete(`/ventas/${idEliminar}`);

    modalEliminar.hide();

    idEliminar = null;

    cargarVentas();

    alert("Venta eliminada correctamente.");
  } catch (error) {
    console.error(error);

    alert("No se pudo eliminar la venta.");
  }
}

//============================
// LIMPIAR MODAL
//============================

document
  .getElementById("modalVenta")
  .addEventListener("hidden.bs.modal", () => {
    formVenta.reset();

    idEditar = null;
  });

//============================
// INIT
//============================

document.addEventListener("DOMContentLoaded", () => {
  cargarVentas();

  const btnNuevo = document.getElementById("btnNuevaVenta");

  if (!esAdministrador()) {
    btnNuevo.style.display = "none";
  }
});