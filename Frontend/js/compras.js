verificarAutenticacion();

verificarRol("Administrador");

const tablaCompras = document.getElementById("tablaCompras");
const rol = (localStorage.getItem("rol") || "").toLowerCase();

function esAdministrador() {
  return rol === "administrador";
}

//============================
// OBTENER EMPLEADOS
//============================

async function cargarCompras() {
  try {
    const response = await API.get("/compras");

    mostrarCompras(response.data);
  } catch (error) {
    console.error(error);

    alert("No se pudieron cargar las compras.");
  }
}

//============================
// DIBUJAR TABLA
//============================

function mostrarCompras(compras) {
  tablaCompras.innerHTML = "";

  if (compras.length === 0) {
    tablaCompras.innerHTML = `
            <tr>
                <td colspan="3">
                    No existen compras registradas.
                </td>
            </tr>
        `;

    return;
  }

  compras.forEach((compra) => {
    let acciones = "";

    if (esAdministrador()) {
      acciones = `
                <button
                    class="btn btn-warning btn-sm me-2"
                    onclick="editarCompra(${compra.id_compra})">

                    Editar

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="abrirModalEliminar(${compra.id_compra})">

                    Eliminar

                </button>
            `;
    }

    tablaCompras.innerHTML += `
            <tr>

                <td>${new Date(compra.fecha).toLocaleDateString("es-AR")}</td>

                <td>$${compra.total}</td>

                <td ${!esAdministrador() ? 'style="display:none;"' : ""}>
                    ${acciones}
                </td>

            </tr>
        `;
  });
}

//============================
// MODAL
//============================

const modalCompra = new bootstrap.Modal(document.getElementById("modalCompra"));

const formCompra = document.getElementById("formCompra");

const btnGuardar = document.getElementById("btnGuardarCompra");

const tituloModal = document.getElementById("tituloModal");

let idEditar = null;

//============================
// NUEVO EMPLEADO
//============================
document.getElementById("btnNuevaCompra").addEventListener("click", () => {
  idEditar = null;

  tituloModal.innerText = "Nueva compra";

  formCompra.reset();
});

//============================
// GUARDAR (CREAR / EDITAR)
//============================

btnGuardar.addEventListener("click", guardarCompra);

async function guardarCompra() {
  const compra = {
    fecha: document.getElementById("fecha").value,

    total: Number(document.getElementById("total").value),
  };

  if (!compra.fecha || !compra.total) {
    alert("Debe completar todos los campos.");

    return;
  }

  try {
    if (idEditar === null) {
      await API.post("/compras", compra);

      alert("Compra creada correctamente.");
    } else {
      await API.patch(`/compras/${idEditar}`, compra);

      alert("Compra actualizada correctamente.");
    }

    modalCompra.hide();

    cargarCompras();
  } catch (error) {
    console.error(error);

    alert("Ocurrió un error.");
  }
}

//============================
// EDITAR
//============================

async function editarCompra(id) {
  try {
    const response = await API.get("/compras");

    const compra = response.data.find((c) => c.id_compra === id);

    if (!compra) {
      alert("Compra no encontrada.");

      return;
    }

    idEditar = id;

    tituloModal.innerText = "Editar compra";

    document.getElementById("fecha").value = compra.fecha;

    document.getElementById("total").value = compra.total;

    modalCompra.show();
  } catch (error) {
    console.error(error);
  }
}

//============================
// ELIMINAR
//============================

const modalEliminar = new bootstrap.Modal(
  document.getElementById("modalEliminarCompra"),
);

const btnEliminar = document.getElementById("btnEliminarCompra");

let idEliminar = null;

function abrirModalEliminar(id) {
  idEliminar = id;

  modalEliminar.show();
}

btnEliminar.addEventListener("click", eliminarCompra);

async function eliminarCompra() {
  try {
    await API.delete(`/compras/${idEliminar}`);

    modalEliminar.hide();

    idEliminar = null;

    cargarCompras();

    alert("Compra eliminada correctamente.");
  } catch (error) {
    console.error(error);

    alert("No se pudo eliminar la compra.");
  }
}
//============================
// INIT
//============================

document.addEventListener("DOMContentLoaded", () => {
  cargarCompras();

  const btnNuevo = document.getElementById("btnNuevaCompra");

  if (!esAdministrador()) {
    btnNuevo.style.display = "none";
  }
});