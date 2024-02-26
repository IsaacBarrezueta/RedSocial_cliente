
function redireccionLogin() {
    location.href = '../../../index.html';
}

async function registrarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //const imagen = document.getElementById('imagenUsuario').files;
    const nombres = nombre + " " +  apellido;
    try {
        const response = await fetch('https://redsocial-server.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Nombre: nombres, CorreoElectronico: email, Contraseña: password })
        });
        const data = await response.json();
        if (response.ok) {
            Swal.fire({
                title: "Registro exitoso",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    window.location.href = '../../../index.html';
                }
            });
        } else {
            // Manejar el error de registro
            Swal.fire({
                title: "Error al registrar usuario",
                text: data.error,
                icon: "error"
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error de red:" + error,
            icon: "error"
        });
    }
}