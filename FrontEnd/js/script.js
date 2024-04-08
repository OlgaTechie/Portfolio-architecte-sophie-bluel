async function getWorks(gallerySelector, categoryId = null) {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    // console.log(data); // [{id:..., title:"...3"...}]

    const gallery = document.querySelector(gallerySelector);
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
        // console.log("Adding work to gallery");
        // console.log(workItem.title);

        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = workItem.imageUrl;
        img.alt = workItem.title;
        figure.appendChild(img);

        if (gallerySelector === ".modal-gallery") {
            const deleteIcon = document.createElement("i");
            deleteIcon.className = "fa-solid fa-trash-can";
            deleteIcon.setAttribute("data-work-id", workItem.id);
            deleteIcon.addEventListener("click", async () => {
                const confirmed = confirm("Voulez-vous vraiment supprimer cette image ?");
                if(confirmed) {
                    try {
                        await deleteWork(workItem.id);
                        figure.remove();
                    } catch (error) {
                        console.error("Une erreur est survenue lors de la suppression de l'image ");
                    }
                }
            });
            figure.appendChild(deleteIcon);
        }

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = workItem.title;
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });
}

async function deleteWork(workId) {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("Token d'authentification non trouvé.");
    }

    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'image");
    } 
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

getWorks(".homepage-gallery");
getCategories();

document.addEventListener("DOMContentLoaded", function() {
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");

    const editModeBanner = document.querySelector(".edit-mode-banner");

    const categoriesMenu = document.querySelector(".categories-menu");

    const projectOptions = document.querySelector(".project-options");
    const modal = document.getElementById("myModal");
    const openModalButton = document.getElementById("openModal");
    const closeModalButton = document.querySelector(".modal-close");

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

    openModalButton.addEventListener("click", function(event) {
        modal.style.display = "flex";
        getWorks(".modal-gallery");
        event.preventDefault();
        displayModalWithImages();
    });

    window.addEventListener("click", function(event) {
        if(event.target == modal) {
            modal.style.display = "none";
        }
    })

    closeModalButton.addEventListener("click", function() {
        modal.classList.add("hidden");
        modal.style.display = "none";
    })

    // Fonction pour vérifier si l'utilisateur est connecté
    function isLoggedIn() {
        return localStorage.getItem("token") !== null;
    }

    function displayModalWithImages() {
        const modal = document.getElementById("myModal");
        modal.style.display = "flex";
        getWorks(".modal-gallery");
        addDeleteImageEventListeners();
    }

    function addDeleteImageEventListeners() {
        const deleteIcons = document.querySelectorAll(".modal-gallery i.fa-trash-can");
        deleteIcons.forEach(deleteIcon => {
            deleteIcon.addEventListener("click", async (event) => {
                const confirmed = confirm("Voulez-vous vraiment supprimer cette image ?");
                if (confirmed) {
                    try {
                        const workId = event.target.getAttribute("data-work-id");
                        await deleteWork(workId);
                        event.target.parentElemement.remove(); //figure
                    } catch (error) {
                        console.error("Une erreur est survenue lors de la suppression de l'image ");
                    }
                }
            });
        });
    }
});



