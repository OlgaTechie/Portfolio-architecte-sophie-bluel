async function getWorks(gallerySelector, categoryId = null) {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    // console.log(data); // [{id:..., title:"...3"...}]

    const gallery = document.querySelector(gallerySelector);
    gallery.innerHTML = "";

    const galleryErrorMessage = document.getElementById("gallery-error-message");
    galleryErrorMessage.textContent = "";
    
    try {
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
                            galleryErrorMessage.textContent = "Une erreur est survenue lors de la suppression de l'image";
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
    } catch (error) {
        galleryErrorMessage.textContent = "Une erreur est survenue lors du chargement de la galerie d'images";
    }
}

async function deleteWork(workId) {
    const token = localStorage.getItem("token");
    
    if (!token) {
        throw new Error("Token d'authentification non trouvé");
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

    const categoriesErrorMessage = document.getElementById("categories-error-message");
    categoriesErrorMessage.textContent = "";

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
        categoriesErrorMessage.textContent = "Une erreur est survenue lors du chargement des catégories";
    }
}

function handleClickCategoryButton() {
    const buttons = document.querySelectorAll(".categories-menu button");
    buttons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const categoryId = event.target.dataset.categoryId;

            buttons.forEach((btn) => btn.classList.remove("active")); //Remove the 'active' class name from all buttons
            event.target.classList.add("active"); //Add className active on button
            
            getWorks(".homepage-gallery", categoryId);
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

        // Gestionnaire d'événements pour le changement d'état du champ de fichier
        const fileInput = document.getElementById("upload-photo");
        const fileInputLabel = document.querySelector(".file-input-label");
        const imagePreview = document.getElementById("image-preview");
        const fileInputWrapper = document.querySelector(".file-input-wrapper");

        fileInput.addEventListener("change", function(event) {
            const selectedImage = event.target.files[0]; // Récupérer l'image sélectionnée par l'utilisateur
            
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.src = event.target.result;
                imagePreview.style.display = "block";
            };
            reader.readAsDataURL(selectedImage);

            fileInputWrapper.appendChild(imagePreview);
        });
    }

    function addDeleteImageEventListeners() {
        const deleteIcons = document.querySelectorAll(".modal-gallery i.fa-trash-can");
        const deleteImageErrorMessage = document.getElementById("delete-image-error-message");
        deleteImageErrorMessage.textContent = "";

        deleteIcons.forEach(deleteIcon => {
            deleteIcon.addEventListener("click", async (event) => {
                const confirmed = confirm("Voulez-vous vraiment supprimer cette image ?");
                if (confirmed) {
                    try {
                        const workId = event.target.getAttribute("data-work-id");
                        await deleteWork(workId);
                        event.target.parentElement.remove(); //figure
                    } catch (error) {
                        deleteImageErrorMessage.textContent = "Une erreur est survenue lors de la suppression de l'image ";
                    }
                }
            });
        });
    }

    const uploadForm = document.getElementById("upload-form");
    if (uploadForm) {
        uploadForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            console.log("Formulaire soumis!");
        });
    } else {
        const uploadFormErrorMessage = document.getElementById("upload-form-error-message");
        uploadFormErrorMessage.textContent = "Formulaire non-trouvé";
    }
});

document.querySelector(".modal-addition-button").addEventListener("click", function(event) {
    event.preventDefault();
    // console.log("Le bouton 'Ajouter une photo' a été cliqué !");

    document.querySelector(".modal-photo-gallery").classList.add("hidden");
    document.querySelector(".modal-add-photo").classList.remove("hidden");
});

const arrowLeftLink = document.querySelector(".modal-add-photo-container a");

arrowLeftLink.addEventListener("click", function(event) {
    event.preventDefault();

    // Sélection de la vue actuelle et de la vue précédente
    const addPhotoView = document.querySelector(".modal-add-photo");
    const photoGalleryView = document.querySelector(".modal-photo-gallery");

    addPhotoView.classList.add("hidden");
    photoGalleryView.classList.remove("hidden");
})

async function postWorks(formData) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token d'authentification non trouvé")
        }

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to add new photo");
        }

        console.log("La photo a été téléchargée avec succès");
        getWorks(".homepage-gallery");
    } catch (error) {
        const errorMessage = document.getElementById("error-message-photo");
        errorMessage.textContent = error.message;
    }
}

document.getElementById("upload-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    console.log("Formulaire soumis !");

    const formData = new FormData()
    const fileInput = document.getElementById("upload-photo");
    const titleInput = document.getElementById("photo-title");
    const categoryInput = document.getElementById("photo-category");

    formData.append("image", fileInput.files[0]); // Ajouter le fichier sélectionné à FormData
    formData.append("title", titleInput.value); // Ajouter le titre à FormData
    formData.append("category", categoryInput.value);
    
    await postWorks(formData);
});

