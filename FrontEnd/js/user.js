// Function to check if the user is logged in
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
    // Update the login state upon page load
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

// Event handler for the click on the "logout" button
logoutLink.addEventListener("click", function() {
    localStorage.removeItem("token"); // Remove the token from localStorage
    window.location.href = "index.html"; 
});