const toggleModal = () => {
    overlay.classList.toggle("hidden");
    overlay.classList.toggle("flex");
};

window.onclick = function(event) {
    if (event.target == toggleModal) {
        overlay.classList.toggle("hidden");
    }
};


function redireccionRegistro(){
    location.href = './app/components/RegistroComponent/registroComponent.html';
}

async function iniciarSesion() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let idusuario = 0;
    try {
        const response = await fetch('https://redsocial-server.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ CorreoElectronico: email, Contraseña: password })
        });

        const data = await response.json();
        idusuario = Math.floor(data.UsuarioID);

        console.log("ID del usuario:aaaaaaaaa", idusuario);
        if (response.ok) {
            // Guardar el ID del usuario en el almacenamiento local del navegador
            console.log("ID del usuario:", data.UsuarioID);
            localStorage.setItem('userID', data.UsuarioID);

            Swal.fire({
                title: "Inicio de sesión exitoso",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    // Redirigir a la página de publicaciones después del inicio de sesión exitoso
                    window.location.href = './app/components/PublicacionesComponent/publicacionesComponent.html';
                }
            });
        } else {
            Swal.fire({
                title: "Inicio de sesión fallido",
                text: data.error,
                icon: "error"
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error de red",
            text: error.message,
            icon: "error"
        });
    }
}