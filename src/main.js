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
    try {
        const response = await fetch('https://redsocial-server.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ CorreoElectronico: email, Contraseña: password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('userID', data.UsuarioID);

            localStorage.setItem('userData', JSON.stringify(data));
            Swal.fire({
                title: "Inicio de sesión exitoso",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
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