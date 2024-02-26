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

function toggleMenu() {
    var menu = document.getElementById("user-menu");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}