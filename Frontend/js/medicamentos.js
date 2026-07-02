verificarAutenticacion();

verificarRol("Administrador", "Empleado");
const tablaMedicamentos = document.getElementById("tablaMedicamentos");
const rol = (localStorage.getItem("rol") || "").toLowerCase();

function esAdministrador() {
  return rol === "administrador";
}

//============================
// OBTENER MEDICAMENTOS
//============================

async function cargarMedicamentos() {
  try {
    const response = await API.get("/medicamentos");

    mostrarMedicamentos(response.data);
  } catch (error) {
    console.error(error);

    alert("No se pudieron cargar los medicamentos.");
  }
}

//============================
// DIBUJAR TABLA
//============================

function mostrarMedicamentos(medicamentos) {
    tablaMedicamentos.innerHTML = "";
  if (medicamentos.length === 0) {
    tablaMedicamentos.innerHTML = `

        <tr>

            <td colspan="7">

                No existen medicamentos registrados.

            </td>

        </tr>

    `;

    return;
  }

  medicamentos.forEach((medicamento) => {
    let botones = "";

    if (esAdministrador()) {
      botones = `

                <button
                    class="btn btn-warning btn-sm me-2"
                    onclick="editarMedicamento(${medicamento.id_medicamento})">

                    Editar

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="abrirModalEliminar(${medicamento.id_medicamento})">

                    Eliminar

                </button>

            `;
    }

    tablaMedicamentos.innerHTML += `

        <tr>

            <td>${medicamento.id_medicamento}</td>
            <td>${medicamento.id_proveedor}</td>
            <td>${medicamento.nombre}</td>
            <td>$${medicamento.precio}</td>
            <td>${medicamento.stock}</td>
            <td>${new Date(medicamento.fecha_vencimiento).toLocaleDateString("es-AR")}</td>
            <td ${!esAdministrador() ? 'style="display:none;"' : ""}>
                ${botones}
            </td>

        </tr>

        `;
  });
}

const modalMedicamento = new bootstrap.Modal(
  document.getElementById("modalMedicamento"),
);

const formMedicamento = document.getElementById("formMedicamento");
const btnGuardar = document.getElementById("btnGuardarMedicamento");
const tituloModal = document.getElementById("tituloModal");

// id del medicamento que se está editando
let idEditar = null;

//============================
// NUEVO MEDICAMENTO
//============================

document.getElementById("btnNuevoMedicamento").addEventListener("click", () => {
  idEditar = null;

  tituloModal.innerText = "Nuevo medicamento";

  formMedicamento.reset();
});

//============================
// BOTON GUARDAR
//============================

btnGuardar.addEventListener("click", guardarMedicamento);

async function guardarMedicamento() {
  const medicamento = {
    id_proveedor: Number(document.getElementById("idProveedor").value),
    nombre: document.getElementById("nombre").value.trim(),
    precio: Number(document.getElementById("precio").value),
    stock: Number(document.getElementById("stock").value),
    fecha_vencimiento: document.getElementById("fechaVencimiento").value,
  };

  // Validaciones

  if (
    !medicamento.id_proveedor ||
    !medicamento.nombre ||
    !medicamento.precio ||
    !medicamento.stock ||
    !medicamento.fecha_vencimiento
  ) {
    alert("Debe completar todos los campos.");

    return;
  }

  try {
    if (idEditar === null) {
      //--------------------------------
      // CREAR
      //--------------------------------

      await API.post("/medicamentos", medicamento);

      alert("Medicamento creado correctamente.");
    } else {
      //--------------------------------
      // EDITAR
      //--------------------------------

      await API.patch(`/medicamentos/${idEditar}`, medicamento);

      alert("Medicamento actualizado correctamente.");
    }

    modalMedicamento.hide();

    cargarMedicamentos();
  } catch (error) {
    console.error(error);

    alert("Ocurrió un error.");
  }
}

//============================
// EDITAR
//============================

async function editarMedicamento(id) {
  try {
    const response = await API.get("/medicamentos");

    const medicamento = response.data.find((m) => m.id_medicamento === id);

    if (!medicamento) {
      alert("Medicamento no encontrado.");

      return;
    }

    idEditar = id;

    tituloModal.innerText = "Editar medicamento";

    document.getElementById("idProveedor").value = medicamento.id_proveedor;

    document.getElementById("nombre").value = medicamento.nombre;

    document.getElementById("precio").value = medicamento.precio;

    document.getElementById("stock").value = medicamento.stock;

    document.getElementById("fechaVencimiento").value =
      medicamento.fecha_vencimiento;

    modalMedicamento.show();
  } catch (error) {
    console.error(error);
  }
}

async function cargarProveedores() {
  try {
    const response = await API.get("/proveedores");

    const select = document.getElementById("idProveedor");

    select.innerHTML = "";

    response.data.forEach((proveedor) => {
      select.innerHTML += `

                <option
                value="${proveedor.id_proveedor}">

                ${proveedor.nombre}

                </option>

            `;
    });
  } catch (error) {
    console.error(error);
  }
}

//============================
// MODAL ELIMINAR
//============================

const modalEliminar = new bootstrap.Modal(
  document.getElementById("modalEliminarMedicamento"),
);

const btnEliminar = document.getElementById("btnEliminarMedicamento");

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

btnEliminar.addEventListener("click", eliminarMedicamento);

async function eliminarMedicamento() {
  try {
    await API.delete(`/medicamentos/${idEliminar}`);

    modalEliminar.hide();

    idEliminar = null;

    cargarMedicamentos();

    alert("Medicamento eliminado correctamente.");
  } catch (error) {
    console.error(error);

    alert("No se pudo eliminar el medicamento.");
  }
}

document
  .getElementById("modalMedicamento")
  .addEventListener("hidden.bs.modal", () => {
    formMedicamento.reset();

    idEditar = null;
  });

document.addEventListener("DOMContentLoaded", () => {
  cargarMedicamentos();
  cargarProveedores();

  const btnNuevo = document.getElementById("btnNuevoMedicamento");

  if (!esAdministrador()) {
    btnNuevo.style.display = "none";
  }
});