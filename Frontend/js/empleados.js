verificarAutenticacion();

verificarRol("Administrador");


const tablaEmpleados = document.getElementById("tablaEmpleados");
const rol = (localStorage.getItem("rol") || "").toLowerCase();

function esAdministrador() {
  return rol === "administrador";
}

//============================
// OBTENER EMPLEADOS
//============================

async function cargarEmpleados() {
  try {
    const response = await API.get("/empleados");
    mostrarEmpleados(response.data);
  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar los empleados.");
  }
}

//============================
// DIBUJAR TABLA
//============================

function mostrarEmpleados(empleados) {
  tablaEmpleados.innerHTML = "";

  if (empleados.length === 0) {
    tablaEmpleados.innerHTML = `
      <tr>
        <td colspan="6">No existen empleados registrados.</td>
      </tr>
    `;
    return;
  }

  empleados.forEach((empleado) => {
    let acciones = "";

    // SOLO ADMIN PUEDE VER BOTONES
    if (esAdministrador()) {
      acciones = `
        <button
          class="btn btn-warning btn-sm me-2"
          onclick="editarEmpleado(${empleado.id_empleado})">
          Editar
        </button>

        <button
          class="btn btn-danger btn-sm"
          onclick="abrirModalEliminar(${empleado.id_empleado})">
          Eliminar
        </button>
      `;
    }

    tablaEmpleados.innerHTML += `
      <tr>
        <td>${empleado.id_empleado}</td>
        <td>${empleado.nombre}</td>
        <td>${empleado.apellido}</td>
        <td>${empleado.dni}</td>
        <td>${empleado.usuario}</td>
        <td>${empleado.rol}</td>
        <td>${empleado.telefono}</td>

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

const modalEmpleado = new bootstrap.Modal(
  document.getElementById("modalEmpleado")
);

const formEmpleado = document.getElementById("formEmpleado");
const btnGuardar = document.getElementById("btnGuardarEmpleado");
const tituloModal = document.getElementById("tituloModal");

let idEditar = null;

//============================
// NUEVO EMPLEADO
//============================

document.getElementById("btnNuevoEmpleado").addEventListener("click", () => {
  if (!esAdministrador()) return;

  idEditar = null;
  tituloModal.innerText = "Nuevo empleado";
  formEmpleado.reset();
});

//============================
// GUARDAR (CREAR / EDITAR)
//============================

btnGuardar.addEventListener("click", guardarEmpleado);

async function guardarEmpleado() {
  if (!esAdministrador()) return;

  const empleado = {
    nombre: document.getElementById("nombre").value.trim(),
    apellido: document.getElementById("apellido").value.trim(),
    dni: document.getElementById("dni").value.trim(),
    usuario: document.getElementById("usuario").value.trim(),
    rol: document.getElementById("rolEmpleado").value,
    telefono: document.getElementById("telefono").value.trim(),
    contrasena: document.getElementById("contrasena").value.trim()
  };

  if (
    !empleado.nombre ||
    !empleado.apellido ||
    !empleado.dni ||
    !empleado.usuario ||
    !empleado.rol ||
    !empleado.telefono ||
    !empleado.contrasena
  ) {
    alert("Debe completar todos los campos.");
    return;
  }

  try {
    if (idEditar === null) {
      await API.post("/empleados", empleado);
      alert("Empleado creado correctamente.");
    } else {
      await API.patch(`/empleados/${idEditar}`, empleado);
      alert("Empleado actualizado correctamente.");
    }

    modalEmpleado.hide();
    cargarEmpleados();
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error.");
  }
}

//============================
// EDITAR
//============================

async function editarEmpleado(id) {
  if (!esAdministrador()) return;

  try {
    const response = await API.get("/empleados");

    const empleado = response.data.find((e) => e.id_empleado === id);

    if (!empleado) {
      alert("Empleado no encontrado.");
      return;
    }

    idEditar = id;
    tituloModal.innerText = "Editar empleado";

    document.getElementById("nombre").value = empleado.nombre;
    document.getElementById("apellido").value = empleado.apellido;
    document.getElementById("dni").value = empleado.dni;
    document.getElementById("usuario").value = empleado.usuario;
    document.getElementById("rolEmpleado").value = empleado.rol;
    document.getElementById("telefono").value = empleado.telefono;

    modalEmpleado.show();
  } catch (error) {
    console.error(error);
  }
}

//============================
// ELIMINAR
//============================

const modalEliminar = new bootstrap.Modal(
  document.getElementById("modalEliminarEmpleado")
);

const btnEliminar = document.getElementById("btnEliminarEmpleado");

let idEliminar = null;

function abrirModalEliminar(id) {
  if (!esAdministrador()) return;

  idEliminar = id;
  modalEliminar.show();
}

btnEliminar.addEventListener("click", eliminarEmpleado);

async function eliminarEmpleado() {
  if (!esAdministrador()) return;

  try {
    await API.delete(`/empleados/${idEliminar}`);

    modalEliminar.hide();
    idEliminar = null;

    cargarEmpleados();
    alert("Empleado eliminado correctamente.");
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el empleado.");
  }
}

//============================
// INIT
//============================

document.addEventListener("DOMContentLoaded", () => {
  cargarEmpleados();

  const btnNuevo = document.getElementById("btnNuevoEmpleado");

  if (!esAdministrador()) {
    btnNuevo.style.display = "none";
  }
});