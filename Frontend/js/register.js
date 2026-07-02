const formulario = document.getElementById("formRegister")
const inputNombre = document.getElementById("nombre")
const inputApellido = document.getElementById("apellido")
const inputDni = document.getElementById("dni")
const inputUsuario = document.getElementById("usuario")
const inputContrasena = document.getElementById("contrasena")
const inputRol = document.getElementById("rol")
const inputTel = document.getElementById("telefono")

formulario.addEventListener("submit", registrarse)

async function registrarse(e) {
    e.preventDefault();

    const nombre = inputNombre.value.trim()
    const apellido = inputApellido.value.trim()
    const dni = inputDni.value.trim()
    const usuario = inputUsuario.value.trim()
    const contrasena = inputContrasena.value.trim()
    const rol = inputRol.value
    const telefono = inputTel.value.trim()

    try {
        //envio la peticion al backend
        const response = await API.post("/ingreso/register", {
            nombre, apellido, dni, usuario, contrasena, rol, telefono
        });

        //guardo el token
        localStorage.setItem("token", response.data.token)

        //guardo el rol si responde el back
        if (response.data.rol) {
            localStorage.setItem("rol", response.data.rol)
        }

        localStorage.setItem("nombre", response.data.nombre)

        alert(response.data.message)

        window.location.href = "../pages/dashboard.html"

    } catch (error) {
        console.error(error)

        if (error.response) {
        console.log(error.response.data);
        }
    }
}