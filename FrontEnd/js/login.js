const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", async function(event) {
    event.preventDefault();
    await postLogin();
});

async function postLogin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const requestBody = JSON.stringify({
        email: email,
        password: password
    });

    const response = await fetch ("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody
    });
}

