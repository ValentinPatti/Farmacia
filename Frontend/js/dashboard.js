verificarAutenticacion()

const botonLogout = document.getElementById("btnLogout")
botonLogout.addEventListener("click", cerrarSesion)

const rol = localStorage.getItem("rol")
const nombre = localStorage.getItem("nombre")
const tituloSaludo = document.getElementById("saludoUsuario")

if (rol === "Empleado") {
    document.getElementById("empleados").style.display = "none"
    document.getElementById("compras").style.display = "none"
    document.getElementById("proveedores").style.display = "none"
}

if (nombre) {
    tituloSaludo.textContent = `Hola, ${nombre}`
}

