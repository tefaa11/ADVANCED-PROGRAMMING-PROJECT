// Handle user registration
document.getElementById("registration-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert("Registration successful. You can now log in.");
        document.getElementById("registration-form").reset();
    } else {
        alert("Registration error. Try a different username.");
    }
});

// Handle user login
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        alert("Login successful");

        // Save token in localStorage
        localStorage.setItem("token", data.token);  
        localStorage.setItem("username", username);

        // Show logout option and hide login option
        document.getElementById("login-nav").classList.add("d-none");
        document.getElementById("logout-nav").classList.remove("d-none");

        // Redirect to the homepage
        window.location.href = "index.html";
    } else {
        alert("Incorrect username or password.");
    }
});
