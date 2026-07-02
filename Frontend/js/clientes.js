verificarAutenticacion();

verificarRol("Administrador", "Empleado");

const tablaClientes = document.getElementById("tablaClientes");

const rol = (localStorage.getItem("rol") || "").toLowerCase();

function esAdministrador() {
    return rol === "administrador";
}

//============================
// OBTENER CLIENTES
//============================

async function cargarClientes() {

    try {

        const response = await API.get("/clientes");

        mostrarClientes(response.data);

    } catch (error) {

        console.error(error);

        alert("No se pudieron cargar los clientes.");

    }

}

//============================
// DIBUJAR TABLA
//============================

function mostrarClientes(clientes) {

    tablaClientes.innerHTML = "";

    if (clientes.length === 0) {

        tablaClientes.innerHTML = `
            <tr>
                <td colspan="7">
                    No existen clientes registrados.
                </td>
            </tr>
        `;

        return;
    }

    clientes.forEach(cliente => {

        let botones = "";

        if (esAdministrador()) {

            botones = `
                <button
                    class="btn btn-warning btn-sm me-2"
                    onclick="editarCliente(${cliente.id_cliente})">
                    Editar
                </button>
                <button
                    class="btn btn-danger btn-sm"
                    onclick="abrirModalEliminar(${cliente.id_cliente})">
                    Eliminar
                </button>
            `;

        }

        tablaClientes.innerHTML += `
            <tr>
                <td>${cliente.id_cliente}</td>
                <td>${cliente.dni}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.telefono}</td>
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

const modalCliente = new bootstrap.Modal(
    document.getElementById("modalCliente")
);

const formCliente = document.getElementById("formCliente");
const btnGuardar = document.getElementById("btnGuardarCliente");
const tituloModal = document.getElementById("tituloModal");

// id del cliente que se está editando

let idEditar = null;

//============================
// NUEVO CLIENTE
//============================

document.getElementById("btnNuevoCliente").addEventListener("click", () => {
    idEditar = null;
    tituloModal.innerText = "Nuevo Cliente";
    formCliente.reset();

});

//============================
// BOTÓN GUARDAR
//============================

btnGuardar.addEventListener("click", guardarCliente);

async function guardarCliente() {

    const cliente = {
        dni: document.getElementById("dni").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        apellido: document.getElementById("apellido").value.trim(),
        telefono: document.getElementById("telefono").value.trim()
    };

    //============================
    // VALIDACIONES
    //============================

    if (
        !cliente.dni ||
        !cliente.nombre ||
        !cliente.apellido ||
        !cliente.telefono 
    ) {
        alert("Debe completar todos los campos.");
        return;
    }

    try {
        if (idEditar === null) {

            //----------------------------
            // CREAR
            //----------------------------

            await API.post("/clientes", cliente);

            alert("Cliente creado correctamente.");

        } else {

            //----------------------------
            // EDITAR
            //----------------------------

            await API.patch(`/clientes/${idEditar}`, cliente);
            alert("Cliente actualizado correctamente.");
        }
        modalCliente.hide();
        cargarClientes();
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error.");
    }
}

//============================
// EDITAR CLIENTE
//============================

async function editarCliente(id) {

    try {
        const response = await API.get("/clientes");
        const cliente = response.data.find(c => c.id_cliente === id);

        if (!cliente) {
            alert("Cliente no encontrado.");
            return;
        }

        idEditar = id;

        tituloModal.innerText = "Editar Cliente";

        document.getElementById("dni").value = cliente.dni;
        document.getElementById("nombre").value = cliente.nombre;
        document.getElementById("apellido").value = cliente.apellido;
        document.getElementById("telefono").value = cliente.telefono;

        modalCliente.show();

    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al cargar el cliente.");
    }

}

//============================
// MODAL ELIMINAR
//============================

const modalEliminar = new bootstrap.Modal(
    document.getElementById("modalEliminarCliente")
);
const btnEliminar = document.getElementById("btnEliminarCliente");
let idEliminar = null;

//============================
// ABRIR MODAL ELIMINAR
//============================

function abrirModalEliminar(id) {
    idEliminar = id;
    modalEliminar.show();
}

//============================
// CONFIRMAR ELIMINAR
//============================

btnEliminar.addEventListener("click", eliminarCliente);
async function eliminarCliente() {
    try {
        await API.delete(`/clientes/${idEliminar}`);
        modalEliminar.hide();
        idEliminar = null;
        cargarClientes();
        alert("Cliente eliminado correctamente.");
    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar el cliente.");
    }
}

//============================
// LIMPIAR MODAL
//============================

document
    .getElementById("modalCliente")
    .addEventListener("hidden.bs.modal", () => {
        formCliente.reset();
        idEditar = null;
    });

//============================
// INICIO
//============================

document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();
    const btnNuevo = document.getElementById("btnNuevoCliente");
    if (!esAdministrador()) {
        btnNuevo.style.display = "none"
    }
});