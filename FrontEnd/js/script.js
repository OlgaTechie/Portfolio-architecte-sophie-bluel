async function getWorks(categoryId = null) {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    // console.log(data); // [{id:..., title:"...3"...}]

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    
    data
        .filter((work) => {
            if (!categoryId) {
                return true;
            }
            if (work.categoryId == categoryId) {
                return true;
            }
            return false;
        })
    
    .forEach((workItem) => {
        console.log(workItem.title);
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <img src="${workItem.imageUrl}" alt="${workItem.title}">
            <figcaption>${workItem.title}</figcaption>
        `;
        gallery.appendChild(figure);
    });
}

async function getCategories() {
    const menu = document.querySelector(".categories-menu");
    menu.innerHTML = "";

    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error("Error while retrieving categories");
        }
        const categories = await response.json();

        const allFilter = document.createElement("button");
        allFilter.textContent = "Tous"; // set the text content of allFilter button to "Tous"
        menu.appendChild(allFilter);

        categories.forEach((category) => {
            console.log(category);
            const filter = document.createElement("button");
            filter.textContent = category.name; //  set the text content of the filter button to the name of the category
            filter.dataset.categoryId = category.id; // the attribute data-category-id to store the category ID
            menu.appendChild(filter);
        });

        handleClickCategoryButton();
    } catch (error) {
        console.error("An error occurred in getCategories:", error);
    }
}

function handleClickCategoryButton() {
    const buttons = document.querySelectorAll(".categories-menu button");
    buttons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const categoryId = event.target.dataset.categoryId;

            buttons.forEach((btn) => btn.classList.remove("active")); //Remove the 'active' class name from all buttons
            
            event.target.classList.add("active"); //Add className active on button
            getWorks(categoryId);
        });
    });
}

getWorks();
getCategories();

document.addEventListener("DOMContentLoaded", function() {
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const editModeBanner = document.querySelector(".edit-mode-banner");
    const categoriesMenu = document.querySelector(".categories-menu");
    const projectOptions = document.querySelector(".project-options");

    updateLinks();

    // Gestionnaire d'événements pour le clic sur le bouton "logout"
    logoutLink.addEventListener("click", function() {
        localStorage.removeItem("token"); // Supprimez le token du localStorage
        window.location.href = "index.html"; // Redirigez l'utilisateur vers la page d'accueil
    });

   function updateLinks() {
        // Mettez à jour l'état de connexion lors du chargement de la page
        if (isLoggedIn()) {
            console.log("user is logged in");
            logoutLink.classList.remove("hidden");
            loginLink.classList.add("hidden");
            editModeBanner.classList.remove("hidden");
            categoriesMenu.classList.add("active");
            projectOptions.classList.remove("hidden");
        } else {
            logoutLink.classList.add("hidden");
            loginLink.classList.remove("hidden");
            editModeBanner.classList.add("hidden");
            categoriesMenu.classList.remove("active");
            projectOptions.classList.add("hidden");
        }
   }

     // Fonction pour vérifier si l'utilisateur est connecté
     function isLoggedIn() {
        return localStorage.getItem("token") !== null;
    }
});