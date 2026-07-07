verificarAutenticacion();

verificarRol("Administrador");

const tablaProveedores = document.getElementById("tablaProveedores");
const rol = (localStorage.getItem("rol") || "").toLowerCase();

function esAdministrador() {
  return rol === "administrador";
}

//============================
// OBTENER PROVEEDORES
//============================

async function cargarProveedores() {
  try {
    const response = await API.get("/proveedores");

    mostrarProveedores(response.data);
  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar los proveedores.");
  }
}

//============================
// DIBUJAR TABLA
//============================

function mostrarProveedores(proveedores) {
  tablaProveedores.innerHTML = "";

  if (proveedores.length === 0) {
    tablaProveedores.innerHTML = `
            <tr>
                <td colspan="5">
                    No existen proveedores registrados.
                </td>
            </tr>
        `;

    return;
  }

  proveedores.forEach((proveedor) => {
    let acciones = "";

    if (esAdministrador()) {
      acciones = `
                <button
                    class="btn btn-warning btn-sm me-2"
                    onclick="editarProveedor(${proveedor.id_proveedor})">
                    Editar
                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="abrirModalEliminar(${proveedor.id_proveedor})">
                    Eliminar
                </button>
            `;
    }

    tablaProveedores.innerHTML += `
            <tr>
                <td>${proveedor.id_proveedor}</td>
                <td>${proveedor.nombre}</td>
                <td>${proveedor.direccion}</td>
                <td>${proveedor.telefono}</td>
                <td>${proveedor.email}</td>

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

const modalProveedor = new bootstrap.Modal(
  document.getElementById("modalProveedor"),
);

const formProveedor = document.getElementById("formProveedor");
const btnGuardar = document.getElementById("btnGuardarProveedor");
const tituloModal = document.getElementById("tituloModal");

let idEditar = null;

//============================
// NUEVO PROVEEDORES
//============================

document.getElementById("btnNuevoProveedor").addEventListener("click", () => {
  idEditar = null;

  tituloModal.innerText = "Nuevo proveedor";

  formProveedor.reset();
});

//============================
// GUARDAR (CREAR / EDITAR)
//============================

btnGuardar.addEventListener("click", guardarProveedor);

async function guardarProveedor() {
  const proveedor = {
    nombre: document.getElementById("nombre").value.trim(),

    direccion: document.getElementById("direccion").value.trim(),

    telefono: document.getElementById("telefono").value.trim(),

    email: document.getElementById("email").value.trim(),
  };

  if (
    !proveedor.nombre ||
    !proveedor.direccion ||
    !proveedor.telefono ||
    !proveedor.email
  ) {
    alert("Debe completar todos los campos.");
    return;
  }

  try {
    if (idEditar === null) {
      await API.post("/proveedores", proveedor);

      alert("Proveedor creado correctamente.");
    } else {
      await API.patch(`/proveedores/${idEditar}`, proveedor);

      alert("Proveedor actualizado correctamente.");
    }

    modalProveedor.hide();

    cargarProveedores();
  } catch (error) {
    console.error(error);

    alert("Ocurrió un error.");
  }
}

//============================
// EDITAR
//============================

async function editarProveedor(id) {
  if (!esAdministrador()) return;

  try {
    const response = await API.get("/proveedores");

    const proveedor = response.data.find((p) => p.id_proveedor === id);
    if (!proveedor) {
      alert("Empleado no encontrado.");
      return;
    }

    idEditar = id;
    tituloModal.innerText = "Editar proveedor";

    document.getElementById("nombre").value = proveedor.nombre;
    document.getElementById("direccion").value = proveedor.direccion;
    document.getElementById("telefono").value = proveedor.telefono;
    document.getElementById("email").value = proveedor.email;

    modalProveedor.show();
  } catch (error) {
    console.error(error);
  }
}

//============================
// ELIMINAR
//============================

const modalEliminar = new bootstrap.Modal(
  document.getElementById("modalEliminarProveedor"),
);

const btnEliminar = document.getElementById("btnEliminarProveedor");

let idEliminar = null;

function abrirModalEliminar(id) {
  if (!esAdministrador()) return;

  idEliminar = id;
  modalEliminar.show();
}

btnEliminar.addEventListener("click", eliminarProveedor);

async function eliminarProveedor() {
    try {
        await API.delete(`/proveedores/${idEliminar}`);

        modalEliminar.hide();
        idEliminar = null;

        cargarProveedores();

        alert("Proveedor eliminado correctamente.");

    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar el proveedor.");
    }
}
//============================
// INIT
//============================

document.addEventListener("DOMContentLoaded", () => {
  cargarProveedores();

  const btnNuevo = document.getElementById("btnNuevoProveedor");

  if (!esAdministrador()) {
    btnNuevo.style.display = "none";
  }
});