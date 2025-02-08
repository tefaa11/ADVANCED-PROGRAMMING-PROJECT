// Manejar el registro de usuario
document.getElementById("formulario-registro").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("registro-usuario").value;
    const password = document.getElementById("registro-contrasena").value;

    const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        document.getElementById("formulario-registro").reset();
    } else {
        alert("Error en el registro. Intenta con otro usuario.");
    }
});

// Manejar el inicio de sesión
document.getElementById("formulario-login").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("login-usuario").value;
    const password = document.getElementById("login-contrasena").value;

    const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        alert("Inicio de sesión exitoso");

        // Guardar token en localStorage
        localStorage.setItem("token", data.token);  
        localStorage.setItem("username", username);

        // Mostrar la opción de cerrar sesión y ocultar la de iniciar sesión
        document.getElementById("login-nav").classList.add("d-none");
        document.getElementById("logout-nav").classList.remove("d-none");

        // Redirigir a la página principal
        window.location.href = "index.html";
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});
