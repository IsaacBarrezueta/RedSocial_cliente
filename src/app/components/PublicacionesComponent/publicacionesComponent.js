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
console.log(userData.usuarioid);

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


async function listarusuarios(usuariosFiltrados){
    const publicacionesContainer = document.getElementById('publicaciones');
    const listausuarios = document.getElementById('listausuarios');
    publicacionesContainer.style.display = 'none';
    listausuarios.innerHTML = '';
    listausuarios.style.display = 'block';


    // Recorrer la lista de usuarios filtrados y mostrar el nombre de cada usuario
    for (const usuario of usuariosFiltrados) {

        const conexion = await Obtenerconexion(usuario.usuarioid,userData.usuarioid);
        //console.log(usuario.usuarioid,userData.usuarioid);
        //console.log(conexion);
        const usuarioDiv = document.createElement('li');
        usuarioDiv.textContent = `${usuario.nombre}`;
        usuarioDiv.classList.add('contenedor');
        const botonUsuario = document.createElement('button');
        botonUsuario.textContent = 'agregar amigo'; // Texto del botón
        botonUsuario.classList.add('boton-agregar'); // Agregar clase para estilizar con CSS
        botonUsuario.addEventListener('click', () => {
            // Aquí puedes agregar la lógica para mostrar el perfil del usuario
            // Por ejemplo, podrías redirigir a otra página con más detalles del usuario
            console.log(userData.usuarioid,usuario.usuarioid);
            agregaramigo(userData.usuarioid,usuario.usuarioid);
            console.log('Mostrar perfil de: ', usuario.nombre);
        });
        const texto = document.createElement('p');
        // Agregar el botón al contenedor de usuario
        console.log(conexion.estado);
        if(usuario.usuarioid !== userData.usuarioid){
            if (conexion.estado === '' || (conexion.estado !== 'Activa' && conexion.estado !== 'Pendiente')) {
                usuarioDiv.appendChild(botonUsuario);
            }else if(conexion.estado === 'Activa'){
                texto.textContent = 'Amigo';
                usuarioDiv.appendChild(texto);
            }else if(conexion.estado === 'Pendiente'){
                texto.textContent = 'Solicitud Pendiente';
                usuarioDiv.appendChild(texto);
            }
        }else{
            texto.textContent = 'Tu';
            usuarioDiv.appendChild(texto);
        }      
        listausuarios.appendChild(usuarioDiv);
    };
}


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


