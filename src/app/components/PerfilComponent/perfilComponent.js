function redireccionLogin() {
    location.href = '../../../index.html';
}

function redireccionPublicaciones() {
    location.href = '../PublicacionesComponent/publicacionesComponent.html';
}

function redireccionMensajes() {
    location.href = '../MensajesComponent/MensajesComponent.html';
}

function redireccionNoti() {
    location.href = '../NotificacionesComponent/NotificacionesComponent.html';
}

function redireccionProf() {
    location.href = '../PerfilComponent/perfilComponent.html';
}

//------------------------------------------------------------------------------------------------ Nombre de Usuario
document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const nombreUsuario = userData.nombre;
    const nombreElemento = document.getElementById('nombre');
    nombreElemento.textContent = nombreUsuario;
});



function toggleMenu() {
    var menu = document.getElementById("user-menu");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

function editarPerfil() {
    var editarBtn = document.getElementById("editarPerfilBtn");
    var guardarBtn = document.getElementById("guardarPerfilBtn");
    var spans = document.querySelectorAll("#contenido span");
    var mensajeEdicion = document.getElementById("mensajeEdicion");

    spans.forEach(function(span) {
        span.contentEditable = true;
        span.classList.add("editable");
    });

    editarBtn.style.display = "none";
    guardarBtn.style.display = "block";
    mensajeEdicion.style.display = "block"; // Mostrar mensaje de edición
}

function guardarPerfil() {
    var editarBtn = document.getElementById("editarPerfilBtn");
    var guardarBtn = document.getElementById("guardarPerfilBtn");
    var spans = document.querySelectorAll("#contenido span");
    var mensajeEdicion = document.getElementById("mensajeEdicion");

    spans.forEach(function(span) {
        span.contentEditable = false;
        span.classList.remove("editable");
    });

    editarBtn.style.display = "block";
    guardarBtn.style.display = "none";
    mensajeEdicion.style.display = "none"; // Ocultar mensaje de edición
}
