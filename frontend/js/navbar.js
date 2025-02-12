document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    const loginNav = document.getElementById("login-nav");
    const logoutNav = document.getElementById("logout-nav");
    const logoutButton = document.getElementById("logout-button");

    if (loginNav && logoutNav && logoutButton) {
        if (token) {
            loginNav.classList.add("d-none");
            logoutNav.classList.remove("d-none");
        } else {
            loginNav.classList.remove("d-none");
            logoutNav.classList.add("d-none");
        }

        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.href = "login.html";
        });
    } else {
        console.error("Uno o más elementos de la barra de navegación no se encontraron en el DOM.");
    }
});
