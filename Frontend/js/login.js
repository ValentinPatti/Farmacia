const formulario = document.getElementById("formLogin")
const inputUsuario = document.getElementById("usuario")
const inputContrasena = document.getElementById("contrasena")
const mensaje = document.getElementById("mensaje")

formulario.addEventListener("submit", iniciarSesion)

async function iniciarSesion(e) {
    e.preventDefault();

    mensaje.innerText = "";

    const usuario = inputUsuario.value.trim();
    const contrasena = inputContrasena.value.trim();

    if (!usuario || !contrasena) {
        mensaje.textContent = "Debe completar todos los campos";
        return;
    }

    try {
        //envia la peticion al backend
        const response = await API.post("/ingreso/login", {
            usuario, contrasena
        });

        //guardo el token
        localStorage.setItem("token", response.data.token);

        //guardo el rol si el backend lo devuelve
        if (response.data.rol) {
            localStorage.setItem("rol", response.data.rol)
        }

        localStorage.setItem("nombre", response.data.nombre)

        //mensaje
        alert(response.data.message);

        //redirecciona al dashboard
        window.location.href = "../pages/dashboard.html"

    } catch (error) {
        console.error(error)

        if (error.response) {
        console.log(error.response.data);
        }
    }
}