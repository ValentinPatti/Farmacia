function verificarAutenticacion(){
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../index.html";
    }
}

function verificarRol(...rolesPermitidos){
    const rol = localStorage.getItem("rol");

    if (!rolesPermitidos.includes(rol)) {
        window.location.href = "./dashboard.html";
    }
}

function cerrarSesion(){
    localStorage.removeItem("token")
    localStorage.removeItem("rol")
    localStorage.removeItem("nombre")

    window.location.href = "../index.html"
}