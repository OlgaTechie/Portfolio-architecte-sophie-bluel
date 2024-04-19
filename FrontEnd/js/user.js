// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}

const loginLink = document.getElementById("login-link");
const logoutLink = document.getElementById("logout-link");

const editModeBanner = document.querySelector(".edit-mode-banner");

const categoriesMenu = document.querySelector(".categories-menu");

const projectOptions = document.querySelector(".project-options");

updateLinks();  

function updateLinks() {
    // Mettre à jour l'état de connexion lors du chargement de la page
    if (isLoggedIn()) {
        logoutLink.classList.remove("hidden");
        loginLink.classList.add("hidden");
        editModeBanner.classList.remove("hidden");
        categoriesMenu.style.display = "none";
        projectOptions.classList.remove("hidden");
    } else {
        logoutLink.classList.add("hidden");
        loginLink.classList.remove("hidden");
        editModeBanner.classList.add("hidden");
        categoriesMenu.classList.remove("active");
        projectOptions.style.display = "none";
    }
}

// Gestionnaire d'événements pour le clic sur le bouton "logout"
logoutLink.addEventListener("click", function() {
    localStorage.removeItem("token"); // Supprimer le token du localStorage
    window.location.href = "index.html"; 
});