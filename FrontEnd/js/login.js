const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", function(event) {
    event.preventDefault();
    postLogin();
});

async function postLogin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Creating the request body in JSON format
    const requestBody = JSON.stringify({
        email: email,
        password: password
    });

    try {
        const response = await fetch ("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: requestBody
        });

        // Processing the server response
        handleServerResponse(response);
    } catch (error) {
        console.error("Une erreur s'est produite lors de la connexion :", error);
        // Handling request errors
        alert("Erreur de connexion");
    }
}

function handleServerResponse(response) {
    if (response.ok) {
        handleSuccessfulResponse(response);
    } else {
        handleErrorResponse(response);
    }
} 

async function handleSuccessfulResponse(response) {
    const responseData = await response.json(); // If the response is successful, retrieve the JSON data from the response
    // If the response contains an authentication token and a user ID
    if (responseData.token && responseData.userId) {
        // Store the authentication token and user ID in local storage (localStorage)
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("userId", responseData.userId);
        window.location.href = "index.html";
    } else {
        // Handle the case where the server response is invalid
        console.error("Réponse invalide du serveur");
        alert("Réponse invalide du serveur");
    }
}

async function handleErrorResponse(response) {
    // Handle other cases of server response errors
    console.error("Erreur de connexion :", response.status);
    if (response.status === 404) {
        alert("Erreur dans l’identifiant ou le mot de passe");
    } 
}
    
