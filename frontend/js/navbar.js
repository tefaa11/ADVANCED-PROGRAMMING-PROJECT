document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    const loginNav = document.getElementById("login-nav");
    const logoutButton = document.getElementById("logout-button");
    const cerrarSesion = document.getElementById("cerrar-sesion"); // Corregido: seleccionar el <a>

    if (loginNav && logoutButton) {
        if (token) {
            loginNav.classList.add("d-none");
            logoutButton.classList.remove("d-none");
        } else {
            loginNav.classList.remove("d-none");
            logoutButton.classList.add("d-none");
        }

        // Agregar evento al <a> dentro del li
        if (cerrarSesion) {
            cerrarSesion.addEventListener("click", function (event) {
                event.preventDefault(); // Evitar que el enlace recargue la página
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.href = "login.html";
            });
        } else {
            console.error("El enlace de cerrar sesión no se encontró.");
        }
    } else {
        console.error("Uno o más elementos de la barra de navegación no se encontraron en el DOM.");
    }
});
