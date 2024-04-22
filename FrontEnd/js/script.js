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
        closeModalWithAnimation();
    }
});

closeModalButton.addEventListener("click", function() {
    closeModalWithAnimation();
});

modalContent.addEventListener("click", function(event) {
    if (event.target.classList.contains("modal-close")) {
        closeModalWithAnimation();
    }
});

function closeModalWithAnimation() {
    modal.classList.add("fade-out");
    setTimeout(function() {
        modal.style.display = "none";
        modal.classList.remove("fade-out");
    }, 300);
}
    
// Function to display the modal with images
function displayModalWithImages() {
    const modal = document.getElementById("myModal");
    modal.style.display = "flex";
    getWorks(".modal-gallery");
    addDeleteImageEventListeners();

    // Event handler for file input change event
    const fileInput = document.getElementById("upload-photo");
    const imagePreview = document.getElementById("image-preview");
    const fileInputWrapper = document.querySelector(".file-input-wrapper");

    fileInput.addEventListener("change", function(event) {
        const selectedImage = event.target.files[0]; 
        
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
    
    deleteIcons.forEach(deleteIcon => {
        deleteIcon.addEventListener("click", async (event) => {
            const workId = event.target.getAttribute("data-work-id");
            await deleteWork(workId);
            event.target.parentElement.remove(); //figure
        });
    });
}

// Selecting the form and the submit button
const uploadForm = document.getElementById("upload-form");
const addButton = document.getElementById("add-photo-button");

// Adding an event handler for changes in the form fields
uploadForm.addEventListener("input", function() {
    const titleInput = document.getElementById("photo-title").value.trim();
    const categoryInput = document.getElementById("photo-category").value.trim();
    
    if (titleInput && categoryInput) {
        addButton.classList.add("valid-button");
    } else {
        addButton.classList.remove("valid-button");
    }
});

// Event handler for the click of the "Submit" button
addButton.addEventListener("click", async function(event) {
    event.preventDefault();
    const fileInput = document.getElementById("upload-photo");
    const titleInput = document.getElementById("photo-title");
    const categoryInput = document.getElementById("photo-category");

    try {
        if (fileInput.files.length > 0 && titleInput.value.trim() !== "" && categoryInput.value.trim() !== "") {
            const formData = new FormData()
            formData.append("image", fileInput.files[0]); // Add the selected file to FormData
            formData.append("title", titleInput.value.trim()); // Add the title to FormData
            formData.append("category", categoryInput.value.trim());
            
            await postWorks(formData);
        } else {
            throw new Error("Veuillez remplir tous les champs du formulaire avant de valider");
        }
    } catch (error) {
        const errorMessageElement = document.getElementById("error-message-photo");
        errorMessageElement.textContent = error.message;
    }
})

if (uploadForm) {
    uploadForm.addEventListener("submit", async function(event) {
        event.preventDefault();
    });
} 

document.querySelector(".modal-addition-button").addEventListener("click", function(event) {
    event.preventDefault();

    addButton.classList.remove("valid-button") // Reset the state of the "Submit" button by removing the class valid-button

    document.querySelector(".modal-photo-gallery").classList.add("hidden");
    document.querySelector(".modal-add-photo").classList.remove("hidden");
});

const arrowLeftLink = document.querySelector(".modal-add-photo-container a");

arrowLeftLink.addEventListener("click", function(event) {
    event.preventDefault();

    // Selecting the current view and the previous view
    const addPhotoView = document.querySelector(".modal-add-photo");
    const photoGalleryView = document.querySelector(".modal-photo-gallery");

    addPhotoView.classList.add("hidden");
    photoGalleryView.classList.remove("hidden");
})