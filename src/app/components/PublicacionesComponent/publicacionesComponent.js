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

async function buscarpersonas(){
    const nombre = document.getElementById('busqueda').value;
    try{
        const response = await fetch(`https://redsocial-server.onrender.com/api/filtro?name=${encodeURIComponent(nombre)}`);
        if (response.ok) {
            const data = await response.json();
            listarusuarios(data);
        } else {
            throw new Error('No se pudo obtener la lista de usuarios');
        }
    }catch (error) {
        Swal.fire({
            title: error,
            icon: "error"
        });
    }
}
let modalAbierto = null;

async function mostrarModal(usuario) {
    // Cerrar el modal abierto antes de abrir uno nuevo
    if (modalAbierto) {
        modalAbierto.remove();
        modalAbierto = null;
    }

    const modal = document.createElement('div');
    modal.id = 'mensaje';
    modal.classList.add('bodymessage');
    modal.innerHTML = `
        <div class="row mt-4">
            <div class="col lg-6">
                <div class="chat-container">
                    <div class="chat-header">
                        <h2>${usuario.nombre}</h2>
                    </div>
                    <div id="chat" class="chat-content">
                        <!-- Chat messages will be inserted here -->
                    </div>
                    <div class="chat-input">
                        <input id="mensaje" type="text" placeholder="Type a message...">
                        <button id="enviarMensajeButton">Send</button>
                    </div>
                </div>
            </div>
            <div class="col lg-6">
            </div>
        </div>
    `;

    // Agregar el modal al cuerpo del documento
    const modalchat = document.getElementById('modal-mensajes');
    modalchat.appendChild(modal);
    const chatContent = document.querySelector('.chat-content');

    try {
        const mensajes = await ObtenerMensajes(userData.usuarioid, usuario.usuarioid);
        mensajes.forEach(mensaje => {
            const mensajeElemento = document.createElement('div');
            mensajeElemento.classList.add('mensaje');
            const fechaMensaje = new Date(mensaje.fechaenvio);
            const fechaActual = new Date();
            const esHoy = fechaMensaje.toDateString() === fechaActual.toDateString();
            const horaEnvio = esHoy ? fechaMensaje.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : fechaMensaje.toLocaleString();
            const contenidoElemento = document.createElement('span');
            contenidoElemento.textContent = mensaje.contenido;
            const horaElemento = document.createElement('span');
            horaElemento.textContent = horaEnvio;

            if (userData.usuarioid === mensaje.receptorid) {
                mensajeElemento.classList.add('mensaje-derecha');
                horaElemento.classList.add('hora-derecha');
            } else {
                mensajeElemento.classList.add('mensaje-izquierda');
                horaElemento.classList.add('hora-izquierda');
            }

            mensajeElemento.appendChild(contenidoElemento);
            if (userData.usuarioid !== mensaje.receptorid) {
                mensajeElemento.appendChild(horaElemento);
            }

            chatContent.appendChild(mensajeElemento);
        });

        const enviarMensajeButton = modal.querySelector('#enviarMensajeButton');
        enviarMensajeButton.addEventListener('click', () => {
            const mensajeText = modal.querySelector('#mensaje');
            const mensajeenviar = mensajeText.value;
            enviarMensaje(userData.usuarioid, usuario.usuarioid, mensajeenviar);
            mensajeText.value = '';
        });
    } catch (error) {
        console.error(error);
    }

    // Establecer el modal actual como modal abierto
    modalAbierto = modal;
}

async function listarusuarios(usuariosFiltrados) {
    const publicacionesContainer = document.getElementById('publicaciones');
    const listausuarios = document.getElementById('listausuarios');
    publicacionesContainer.style.display = 'none';
    listausuarios.innerHTML = '';
    listausuarios.style.display = 'block';

    // Recorrer la lista de usuarios filtrados y mostrar el nombre de cada usuario
    for (const usuario of usuariosFiltrados) {
        const conexion = await Obtenerconexion(usuario.usuarioid, userData.usuarioid);
        const usuarioDiv = document.createElement('li');
        usuarioDiv.textContent = `${usuario.nombre}`;
        usuarioDiv.classList.add('contenedor');
        const botonUsuario = document.createElement('button');
        botonUsuario.textContent = 'agregar amigo';
        botonUsuario.classList.add('boton-agregar');
        botonUsuario.addEventListener('click', () => {
            agregaramigo(userData.usuarioid, usuario.usuarioid);
        });
        const texto = document.createElement('p');

        if (usuario.usuarioid !== userData.usuarioid) {
            const botonEnviar = document.createElement('button');
            botonEnviar.textContent = 'enviar mensaje';
            botonEnviar.classList.add('boton-mensaje');
            botonEnviar.addEventListener('click', async () => {
                mostrarModal(usuario);
            });

            usuarioDiv.appendChild(botonEnviar);

            if (conexion.estado === '' || (conexion.estado !== 'Activa' && conexion.estado !== 'Pendiente')) {
                usuarioDiv.appendChild(botonUsuario);
            } else if (conexion.estado === 'Activa') {
                texto.textContent = 'Amigo';
                usuarioDiv.appendChild(texto);
            } else if (conexion.estado === 'Pendiente') {
                texto.textContent = 'Solicitud Pendiente';
                usuarioDiv.appendChild(texto);
            }
        } else {
            texto.textContent = 'Tu';
            usuarioDiv.appendChild(texto);
        }

        listausuarios.appendChild(usuarioDiv);
    }
}


async function mostrarContactos() {
    const listaContactos = await ObtenerContactos(userData.usuarioid); // Asegúrate de definir 'usuarioid1' antes de llamar a esta función

    const contenedor = document.getElementById('contactos'); // Suponiendo que tengas un contenedor con el id 'contenedorContactos'

    listaContactos.forEach(contacto => {
        if(userData.usuarioid !== contacto.usuarioid){
        const div = document.createElement('div');
        div.classList.add('flex', 'space-x-2', 'items-center', 'hover:bg-gray-200', 'py-2', 'px-2', 'rounded-lg');

        const divImagen = document.createElement('div');
        const img = document.createElement('img');
        img.src = 'https://picsum.photos/200'; // Puedes usar la URL real de la imagen si está disponible en los datos del contacto
        img.classList.add('object-cover', 'w-8', 'h-8', 'rounded-full', 'outline', 'outline-offset-2', 'outline-1', 'outline-blue-500');
        img.alt = '';
        divImagen.appendChild(img);

        const divNombre = document.createElement('div');
        divNombre.textContent = contacto.nombre; // Asegúrate de que 'nombre' sea la propiedad correcta en los datos del contacto
        divNombre.classList.add('text-sm');

        div.appendChild(divImagen);
        div.appendChild(divNombre);
        contenedor.appendChild(div);
        div.addEventListener('click', () => {
            mostrarModal(contacto);
        });
        }   
    });
}

// Llama a la función para mostrar los contactos cuando sea necesario
mostrarContactos();


async function agregaramigo(usuarioid1,usuarioid2){
    try {
        const conexion = await Obtenerconexion(usuarioid1,usuarioid2);
        console.log(conexion);
        if(conexion.estado === ''){
            const response = await fetch('https://redsocial-server.onrender.com/api/solicitud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Usuarioid1 : usuarioid1, Usuarioid2: usuarioid2})
            });
            const data = await response.json();
            if (response.ok) {
                crearnotificacion(usuarioid2, 'Solicitud de Amistad', usuarioid1);
                buscarpersonas();
                Swal.fire({
                    title: "Solicitud de amistad enviada",
                    icon: "success"
                });
            } else {
                // Manejar el error de registro
                Swal.fire({
                    title: "Error al agregar amigo",
                    text: data.error,
                    icon: "error"
                });
            }
        }else {
            cambiarestado(usuarioid1,usuarioid2,'Pendiente');
            buscarpersonas();
            Swal.fire({
                title: "Solicitud de amistad enviada",
                icon: "success"
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error de red:" + error,
            icon: "error"
        });
    }
}

async function crearnotificacion(usuarioid,contenido,usuarioid2){
    try {
        const response = await fetch('https://redsocial-server.onrender.com/api/notificacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Usuarioid : usuarioid, Contenido: contenido, Usuarioid2: usuarioid2})
        });
    } catch (error) {
        Swal.fire({
            title: "Error de red:" + error,
            icon: "error"
        });
    }
}

async function Obtenerconexion(usuarioid1,usuarioid2){
    try{
        const response = await fetch(`https://redsocial-server.onrender.com/api/conexion?usuarioid1=${encodeURIComponent(usuarioid1)}&usuarioid2=${encodeURIComponent(usuarioid2)}`);
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

async function cambiarestado(usuarioid1, usuarioid2, estado) {
    try {
        const response = await fetch('https://redsocial-server.onrender.com/api/estado', {
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

async function enviarMensaje(usuarioid,usuarioid2,contenido){
    try {
        const response = await fetch('https://redsocial-server.onrender.com/api/mensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emisor : usuarioid, receptor : usuarioid2,  contenido: contenido})
        });
    } catch (error) {
        Swal.fire({
            title: "Error de red:" + error,
            icon: "error"
        });
    }
}

async function ObtenerMensajes(usuarioid1,usuarioid2){
    try{
        const response = await fetch(`https://redsocial-server.onrender.com/api/mensajes?emisor=${encodeURIComponent(usuarioid1)}&receptor=${encodeURIComponent(usuarioid2)}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('No se pudo obtener la lista de mensajes');
        }
    }catch (error) {
        Swal.fire({
            title: error,
            icon: "error"
        });
    }
}

async function ObtenerContactos(usuarioid1){
    try{
        const response = await fetch(`https://redsocial-server.onrender.com/api/amigos?usuarioID=${encodeURIComponent(usuarioid1)}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('No se pudo obtener la lista de contactos');
        }
    }catch (error) {
        Swal.fire({
            title: error,
            icon: "error"
        });
    }
}

function toggleNotifications() {
    var menu = document.getElementById("notifications-menu");
    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
        document.addEventListener("click", closeNotificationsOutside);
    } else {
        menu.classList.add("hidden");
        document.removeEventListener("click", closeNotificationsOutside);
    }
}

function closeNotificationsOutside(event) {
    var menu = document.getElementById("notifications-menu");
    if (!menu.contains(event.target)) {
        menu.classList.add("hidden");
        document.removeEventListener("click", closeNotificationsOutside);
    }
}

function toggleMenu() {
    var menu = document.getElementById("user-menu");
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}


function openModal() {
    document.getElementById('modal').style.display = 'block';
    // Obtener el ID del usuario del almacenamiento local
    const usuarioID = localStorage.getItem('userID');

    // Mostrar el ID del usuario en la consola
    console.log("ID del usuario:", usuarioID);

}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

async function publicar() {
    const contenido = document.getElementById('contenido').value;
    const usuarioID = parseInt(localStorage.getItem('userID'), 10); // Obtener el ID del usuario del almacenamiento local
    const fechaPublicacion = new Date().toISOString(); // Obtener la fecha actual en formato ISO

    try {
        const response = await fetch('https://redsocial-server.onrender.com/api/publicar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ UsuarioID: usuarioID, Contenido: contenido, FechaPublicacion: fechaPublicacion })
        });

        if (response.ok) {
            alert('Publicación exitosa');
            closeModal(); // Cerrar modal después de publicar
        } else {
            const data = await response.json();
            alert('Error al publicar: ' + data.error);
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red: ' + error.message);
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    try {
        const response = await fetch('https://redsocial-server.onrender.com/api/publicaciones');
        const publicaciones = await response.json();

        // Ordenar las publicaciones por su ID de manera descendente
        publicaciones.sort((a, b) => b.PublicacionID - a.PublicacionID);
        console.log("publicaciones", publicaciones);
        const publicacionesContainer = document.getElementById('publicaciones-container');

        publicaciones.forEach(async publicacion => {
            const { PublicacionID, UsuarioID, contenido, fechapublicacion } = publicacion;
            const usuario = await obtenerNombreUsuario(UsuarioID); // Espera a que se resuelva la promesa para obtener el nombre del usuario
            const fecha = new Date(fechapublicacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

            // Construir el HTML de la publicación con el diseño personalizado
            const publicacionHTML = `
                <div id="publicacion-${PublicacionID}" class="bg-white rounded-md p-4 shadow-md mb-4">
                    <div class="flex space-x-2">
                        <img src="https://picsum.photos/200" alt="" class="rounded-full w-10 h-10">
                        <div class="flex flex-col">
                            <h3 class="text-gray-500 font-semibold text-sm">${usuario}</h3>
                            <div class="flex space-x-2 px-2 justify-center items-center">
                                <div class="text-gray-500 text-sm">${fecha}</div>
                            </div>
                        </div>
                    </div>
                    <div class="cont-p flex mt-2 text-3xl text-center text-white p-5 font-bold items-center justify-center bg-gradient-to-br from-blue-500 to-purple-400"
                        style="width: 450px; height: 300px;">
                            <p>${contenido}</p>
                    </div>
                  
                    
                    <hr class="mt-2">
                    
                </div>
            `;

            publicacionesContainer.insertAdjacentHTML('beforeend', publicacionHTML);
        });
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
    }
});


async function obtenerNombreUsuario(usuarioID) {
    try {
        const response = await fetch('https://redsocial-server.onrender.com/api/usuarios');
        const usuarios = await response.json();
        const usuario = usuarios.find(usuario => usuario.UsuarioID === usuarioID);
        if (usuario) {
            return usuario.nombre; // Asumiendo que el nombre del usuario está en el campo 'nombre'
        } else {
            throw new Error('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
        console.log("nombre:", usuario.nombre);
        return usuario.nombre;
    }
}


