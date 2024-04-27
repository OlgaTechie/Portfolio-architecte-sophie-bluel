// Sélectionner le bouton de connexion dans le document HTML
const loginButton = document.getElementById("login-button");
// Écouter l'événement de clic sur le bouton de connexion
loginButton.addEventListener("click", function(event) {
    event.preventDefault();
    postLogin();
});

// Envoyer les informations de connexion au serveur
async function postLogin() {
    // Récupérer les valeurs saisies dans les champs d'e-mail et de mot de passe
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Créer le corps de la requête au format JSON
    const requestBody = JSON.stringify({
        email: email,
        password: password
    });

    // Envoyer une requête POST à l'URL de l'API de connexion
    const response = await fetch ("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: requestBody
        });

    // Traiter la réponse du serveur
    await handleResponse(response);
}

// Fonction pour traiter la réponse du serveur
async function handleResponse(response) {
    // Si la réponse est OK (statut 200)
    if (response.ok) {
        await handleSuccessfulResponse(response);
    } else {
        await handleErrorResponse(response);
    }
} 

// Fonction pour traiter la réponse réussie du serveur
async function handleSuccessfulResponse(response) {
    // Extrait les données JSON de la réponse
    const responseData = await response.json(); 
    // Stocker le jeton d'authentification et l'ID utilisateur dans le stockage local
    localStorage.setItem("token", responseData.token);
    localStorage.setItem("userId", responseData.userId);
    window.location.href = "index.html"; // Rediriger l'utilisateur vers la page d'accueil de l'espace administrateur
}

// Fonction pour traiter la réponse d'erreur du serveur
async function handleErrorResponse() {
    // Message d'erreur à afficher
    const errorMessage = "Erreur dans l’identifiant ou le mot de passe";
    showAlert(errorMessage); // Affiche le message d'erreur dans l'interface utilisateur
}

// Fonction pour afficher un message d'erreur dans l'interface utilisateur
function showAlert(message) {
    // Créer un nouvel élément paragraphe pour le message d'erreur
    const errorParagraph = document.createElement("p");
    // Ajouter la classe "error" au paragraphe pour le style
    errorParagraph.classList.add("error");
    // Définir le texte du paragraphe avec le message d'erreur
    errorParagraph.textContent = message;

    // Sélectionner le conteneur d'erreur dans le document HTML
    const errorContainer = document.getElementById("error-container");
    errorContainer.innerHTML = "";
    errorContainer.appendChild(errorParagraph);
}
