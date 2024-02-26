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

const userData = JSON.parse(localStorage.getItem('userData'));
obtenernotificacionusuario(userData.usuarioid);

async function obtenernotificacionusuario(usuarioID){
    try{
        const response = await fetch(`http://localhost:3000/api/notificaciones?usuarioID=${encodeURIComponent(usuarioID)}`);
        if (response.ok) {
            const data = await response.json();
            listarnotificaciones(data);
        } else {
            throw new Error('No se pudo obtener la lista de notificaciones');
        }
    }catch (error) {
        Swal.fire({
            title: error,
            icon: "error"
        });
    }
}

async function obtenerusuario(usuarioid){
    try{
        const response = await fetch(`http://localhost:3000/api/usuario?usuarioid=${encodeURIComponent(usuarioid)}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('No se pudo obtener la lista de notificaciones');
        }
    }catch (error) {
        Swal.fire({
            title: error,
            icon: "error"
        });
    }
}

async function listarnotificaciones(notificaciones){
    const notificacionesContainer = document.getElementById('notifications');

    // Recorrer la lista de notificaciones y crear elementos HTML para cada una
    for (const notificacion of notificaciones) {
        const notificacionDiv = document.createElement('div');
        notificacionDiv.classList.add('notification');
        try {
            const usuario = await obtenerusuario(notificacion.usuarioid2);
            const titulo = document.createElement('h4');
            titulo.textContent = usuario.nombre; // Suponiendo que el objeto usuario tenga una propiedad 'nombre'
            const conexion = await Obtenerconexion(usuario.usuarioid,notificacion.usuarioid);
            const texto = document.createElement('p');
            if(conexion.estado === 'Activa'){
                texto.textContent = notificacion.contenido + ' Aceptada';
            }else if(conexion.estado === 'Rechazada'){
                texto.textContent = notificacion.contenido + ' Rechazada';
            }else{
                texto.textContent = notificacion.contenido;
            }
            
            
            const fechaCreacion = new Date(notificacion.fechanotificacion);
            const fechaActual = new Date();
    
            const diffTiempo = fechaActual - fechaCreacion;
    
            const diffSegundos = Math.floor(diffTiempo / 1000);
            const diffMinutos = Math.floor(diffTiempo / (1000 * 60));
            const diffHoras = Math.floor(diffTiempo / (1000 * 60 * 60));
            const diffDias = Math.floor(diffTiempo / (1000 * 60 * 60 * 24));
            const diffMeses = Math.floor(diffTiempo / (1000 * 60 * 60 * 24 * 30)); // Aproximado, 30 días por mes
            const diffAnios = Math.floor(diffTiempo / (1000 * 60 * 60 * 24 * 365)); // Aproximado, 365 días por año
    
            let diffTexto = '';
            if (diffAnios > 0) {
                diffTexto = `Hace ${diffAnios} ${diffAnios === 1 ? 'año' : 'años'}`;
            } else if (diffMeses > 0) {
                diffTexto = `Hace ${diffMeses} ${diffMeses === 1 ? 'mes' : 'meses'}`;
            } else if (diffDias > 0) {
                diffTexto = `Hace ${diffDias} ${diffDias === 1 ? 'día' : 'días'}`;
            } else if (diffHoras > 0) {
                diffTexto = `Hace ${diffHoras} ${diffHoras === 1 ? 'hora' : 'horas'}`;
            } else if (diffMinutos > 0) {
                diffTexto = `Hace ${diffMinutos} ${diffMinutos === 1 ? 'minuto' : 'minutos'}`;
            } else {
                diffTexto = `Hace ${diffSegundos} ${diffSegundos === 1 ? 'segundo' : 'segundos'}`;
            }
            const fecha = document.createElement('span');
            fecha.textContent = diffTexto;
            fecha.style.float = 'right';
            fecha.style.fontSize = '0.8em';
            fecha.style.color = '#777';
            // Botón Aceptar
            const botonAceptar = document.createElement('button');
            botonAceptar.textContent = 'Aceptar';
            botonAceptar.classList.add('boton-aceptar');
            botonAceptar.addEventListener('click', () => {
                cambiarestado(usuario.usuarioid,notificacion.usuarioid,'Activa');
                obtenernotificacionusuario(userData.usuarioid);
                Swal.fire({
                    title: "Solicitud de amistad aceptada",
                    icon: "success"
                });
            });
    
            // Botón Rechazar
            const botonRechazar = document.createElement('button');
            botonRechazar.textContent = 'Rechazar';
            botonRechazar.classList.add('boton-rechazar');
            botonRechazar.addEventListener('click', () => {
                cambiarestado(usuario.usuarioid,notificacion.usuarioid,'Rechazada');
                obtenernotificacionusuario(userData.usuarioid);
                Swal.fire({
                    title: "Solicitud de amistad rechazada",
                    icon: "success"
                });
            });
            texto.appendChild(fecha);
            if(notificacion.contenido === 'Solicitud de Amistad' && conexion.estado === 'Pendiente'){
                texto.appendChild(botonAceptar);
                texto.appendChild(botonRechazar);
            }           
            notificacionDiv.appendChild(titulo);
            notificacionDiv.appendChild(texto);
            notificacionesContainer.appendChild(notificacionDiv);
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    }
}

async function cambiarestado(usuarioid1, usuarioid2, estado) {
    try {
        const response = await fetch('http://localhost:3000/api/estado', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Usuarioid1: usuarioid1, Usuarioid2: usuarioid2, nuevoEstado: estado })
        });
        if (!response.ok) {
            throw new Error('Error al intentar cambiar el estado de la conexión');
        }
        // Si la respuesta es exitosa, podrías hacer algo aquí, como mostrar un mensaje de éxito
    } catch (error) {
        Swal.fire({
            title: "Error de red:" + error.message,
            icon: "error"
        });
    }
}

async function Obtenerconexion(usuarioid1,usuarioid2){
    try{
        const response = await fetch(`http://localhost:3000/api/conexion?usuarioid1=${encodeURIComponent(usuarioid1)}&usuarioid2=${encodeURIComponent(usuarioid2)}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('No se pudo obtener la lista de notificaciones');
        }
    }catch (error) {
        Swal.fire({
            title: error,
            icon: "error"
        });
    }
}






