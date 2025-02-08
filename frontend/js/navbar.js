document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");

    if (token) {
        // Authenticated user
        document.getElementById("login-nav").classList.add("d-none");
        document.getElementById("logout-nav").classList.remove("d-none");
    } else {
        // Unauthenticated user
        document.getElementById("login-nav").classList.remove("d-none");
        document.getElementById("logout-nav").classList.add("d-none");
    }

    // Handle logout
    document.getElementById("logout-button").addEventListener("click", function() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "login.html";
    });
});
