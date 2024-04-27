import { getWorks, postWorks, deleteWork } from "./api-functions.js";

// Utilisation de JavaScript pour récupérer dynamiquement les catégories disponibles depuis l'API
async function getCategories() {
    const menu = document.querySelector(".categories-menu");
    menu.innerHTML = "";

    // Envoi d'une requête à l'API pour récupérer les catégories
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

     // Création d'un bouton "Tous" pour afficher tous les travaux
    const allFilter = document.createElement("button");
    allFilter.textContent = "Tous"; // set the text content of allFilter button to "Tous"
    menu.appendChild(allFilter);

    // Création d'un bouton pour chaque catégorie récupérée depuis l'API
    categories.forEach((category) => {
        const filter = document.createElement("button");
        filter.textContent = category.name; // Nom de la catégorie
        filter.dataset.categoryId = category.id; // ID de la catégorie
        menu.appendChild(filter);
    });

    // Ajout d'un gestionnaire d'événements pour chaque bouton de catégorie
    handleClickCategoryButton();
}

// Gestion de clic sur les boutons de catégorie
function handleClickCategoryButton() {
    const buttons = document.querySelectorAll(".categories-menu button");
    buttons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const categoryId = event.target.dataset.categoryId;

            buttons.forEach((btn) => btn.classList.remove("active")); // Suppression de la classe "active" de tous les boutons
            event.target.classList.add("active"); // Ajout de la classe "active" sur le bouton cliqué
            
            getWorks(".homepage-gallery", categoryId); // Filtrage des travaux en fonction de la catégorie sélectionnée
        });
    });
}

// Appel initial pour récupérer les travaux et les catégories lors du chargement de la page
getWorks(".homepage-gallery");
getCategories();

// Sélection de la fenêtre modale, des boutons pour l'ouverture et la fermeture de la modale, et du contenu de la modale
const modal = document.getElementById("myModal");
const openModalButton = document.getElementById("openModal");
const closeModalButton = document.querySelector(".modal-close");
const modalContent = document.querySelector(".modal-content");

// Gestionnaire d'événements pour l'ouverture de la fenêtre modale
openModalButton.addEventListener("click", function(event) {
    // Affichage de la fenêtre modale et récupération des travaux
    modal.style.display = "flex";
    getWorks(".modal-gallery");
    event.preventDefault();
    displayModalWithImages();
});

// Gestionnaire d'événements pour la fermeture de la fenêtre modale en cliquant en dehors de celle-ci
window.addEventListener("click", function(event) {
    if(event.target == modal) {
        closeModalWithAnimation();
    }
});

// Gestionnaire d'événements pour la fermeture de la fenêtre modale en cliquant sur le bouton de fermeture
closeModalButton.addEventListener("click", function() {
    closeModalWithAnimation();
});

// Gestionnaire d'événements pour la fermeture de la fenêtre modale en cliquant sur le contenu de la modale
modalContent.addEventListener("click", function(event) {
    if (event.target.classList.contains("modal-close")) {
        closeModalWithAnimation();
    }
});

// Fonction pour fermer la fenêtre modale avec une animation de fondu
function closeModalWithAnimation() {
    modal.classList.add("fade-out"); // Ajout de la classe "fade-out" pour animer la fenêtre modale
    // Définir un délai pour supprimer la classe "fade-out" et masquer la fenêtre modale
    setTimeout(function() {
        modal.style.display = "none";
        modal.classList.remove("fade-out");
    }, 300);
}

// Fonction pour revenir à la vue précédente dans la fenêtre modale
function goBackModal() {
    // Sélection de la vue actuelle et de la vue précédente
    const addPhotoView = document.querySelector(".modal-add-photo");
    const photoGalleryView = document.querySelector(".modal-photo-gallery");

    addPhotoView.classList.add("hidden");
    photoGalleryView.classList.remove("hidden");
}

    
// Fonction pour afficher la fenêtre modale avec les images
function displayModalWithImages() {
    const modal = document.getElementById("myModal");
    modal.style.display = "flex"; // Affichage de la fenêtre modale
    getWorks(".modal-gallery"); // Récupération des travaux pour affichage dans la galerie modale
    addDeleteImageEventListeners(); // Ajout des gestionnaires d'événements pour la suppression d'images

    // Gestionnaire d'événements pour l'événement de changement du champ de téléchargement de fichier (input[type="file"])
    const fileInput = document.getElementById("upload-photo");
    const imagePreview = document.getElementById("image-preview");
    const fileInputWrapper = document.querySelector(".file-input-wrapper");

    fileInput.addEventListener("change", function(event) {
        // Lorsque l'utilisateur sélectionne un fichier pour téléchargement, cet événement est déclenché
        const selectedImage = event.target.files[0]; 
        
        const reader = new FileReader();
        reader.onload = function(event) {
            // Prévisualiser l'image sélectionnée en la chargeant dans un élément d'image
            imagePreview.src = event.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(selectedImage);

        // Afficher l'image prévisualisée dans la fenêtre modale pour que l'utilisateur puisse voir quelle image il est sur le point d'ajouter
        fileInputWrapper.appendChild(imagePreview);
    });
}

// Ajout des gestionnaires d'événements pour la suppression d'images
function addDeleteImageEventListeners() {
    const deleteIcons = document.querySelectorAll(".modal-gallery i.fa-trash-can");
    
    // Parcours de chaque icône de suppression
    deleteIcons.forEach(deleteIcon => {
         // Ajout d'un écouteur d'événements pour le clic sur l'icône de suppression
        deleteIcon.addEventListener("click", async (event) => {
            const workId = event.target.getAttribute("data-work-id");
            await deleteWork(workId);
            event.target.parentElement.remove(); // Suppression de l'élément parent de l'icône (figure)
        });
    });
}

// Sélection du formulaire et du bouton de soumission
const uploadForm = document.getElementById("upload-form");
const addButton = document.getElementById("add-photo-button");

// Ajout d'un gestionnaire d'événements pour les modifications dans les champs du formulaire
uploadForm.addEventListener("input", function() {
    const titleInput = document.getElementById("photo-title").value.trim();
    const categoryInput = document.getElementById("photo-category").value.trim();
    
    // Vérification des champs du formulaire et ajout/suppression de la classe valid-button
    if (titleInput && categoryInput) {
        addButton.classList.add("valid-button");
    } else {
        addButton.classList.remove("valid-button");
    }
});

// Gestionnaire d'événements pour le clic sur le bouton "Submit"
addButton.addEventListener("click", async function(event) {
    event.preventDefault();
    const fileInput = document.getElementById("upload-photo");
    const titleInput = document.getElementById("photo-title");
    const categoryInput = document.getElementById("photo-category");

    try {
        if (fileInput.files.length > 0 && titleInput.value.trim() !== "" && categoryInput.value.trim() !== "") {
            // Création de l'objet FormData et ajout des données du formulaire
            const formData = new FormData()
            formData.append("image", fileInput.files[0]); // Ajout du fichier sélectionné à FormData
            formData.append("title", titleInput.value.trim()); // Ajout du titre à FormData
            formData.append("category", categoryInput.value.trim());
            
            // Envoi des données du formulaire au serveur
            await postWorks(formData);
            closeModalWithAnimation();
            goBackModal();
        } else {
            throw new Error("Veuillez remplir tous les champs du formulaire avant de valider");
        }
    } catch (error) {
        // Affichage du message d'erreur en cas d'erreur
        const errorMessageElement = document.getElementById("error-message-photo");
        errorMessageElement.textContent = error.message;
    }
})

// Empêcher l'envoi automatique du formulaire lors du clic sur le bouton "Submit"
if (uploadForm) {
    uploadForm.addEventListener("submit", async function(event) {
        event.preventDefault();
    });
} 

// Gestionnaire d'événements pour le clic sur le bouton "Ajouter" dans la fenêtre modale
document.querySelector(".modal-addition-button").addEventListener("click", function(event) {
    event.preventDefault();

    addButton.classList.remove("valid-button"); // Réinitialisation de l'état du bouton "Submit" en supprimant la classe valid-button

    // Masquage de la galerie photo et affichage du formulaire d'ajout de photo
    document.querySelector(".modal-photo-gallery").classList.add("hidden");
    document.querySelector(".modal-add-photo").classList.remove("hidden");
});

// Gestionnaire d'événements pour le clic sur le lien de retour dans la fenêtre modale
const arrowLeftLink = document.querySelector(".modal-add-photo-container a");

arrowLeftLink.addEventListener("click", function(event) {
    event.preventDefault();

    // Retour à la fenêtre précédente de la modale
    goBackModal();
});