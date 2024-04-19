import { getWorks, postWorks, deleteWork } from "./api-functions.js";

async function getCategories() {
    const menu = document.querySelector(".categories-menu");
    menu.innerHTML = "";

    const response = await fetch("http://localhost:5678/api/categories");
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

const modal = document.getElementById("myModal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.querySelector(".modal-close");
const modalContent = document.querySelector(".modal-content");

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
});

closeModalButton.addEventListener("click", function() {
    modal.classList.add("hidden");
    modal.style.display = "none";
});

modalContent.addEventListener("click", function(event) {
    if (event.target.classList.contains("modal-close")) {
        modal.style.display = "none";
    }
});
    
// Fonction pour afficher la modal avec les images
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
const addButton = document.getElementById("add-photo-button");

uploadForm.addEventListener("input", function() {
    const titleInput = document.getElementById("photo-title").value.trim();
    const categoryInput = document.getElementById("photo-category").value.trim();
    
    if(titleInput && categoryInput) {
        addButton.classList.add("valid-button");
    } else {
        addButton.classList.remove("valid-button");
    }
});

addButton.addEventListener("click", async function(event) {
    event.preventDefault();
    if (addButton.classList.contains("valid-button")) {
        const formData = new FormData()
        const fileInput = document.getElementById("upload-photo");
        const titleInput = document.getElementById("photo-title");
        const categoryInput = document.getElementById("photo-category");
    
        formData.append("image", fileInput.files[0]); // Ajouter le fichier sélectionné à FormData
        formData.append("title", titleInput.value.trim()); // Ajouter le titre à FormData
        formData.append("category", categoryInput.value.trim());
        
        await postWorks(formData);
    } else {
        throw new Error("Veuillez remplir tous les champs du formulaire avant de valider");
    }
})

if (uploadForm) {
    uploadForm.addEventListener("submit", async function(event) {
        event.preventDefault();
    });
} else {
    const uploadFormErrorMessage = document.getElementById("upload-form-error-message");
    uploadFormErrorMessage.textContent = "Formulaire non-trouvé";
}

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