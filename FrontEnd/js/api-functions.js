// Utilisation de JavaScript pour récupérer dynamiquement les travaux
export async function getWorks(gallerySelector, categoryId = null) {
    // Appel à l'API avec fetch pour récupérer les données des travaux
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();

    // Sélection de la galerie où les travaux seront affichés
    const gallery = document.querySelector(gallerySelector);
    // Nettoyage de tout contenu HTML préexistant dans la galerie
    gallery.innerHTML = "";
    
    // Filtrage des travaux en fonction de la catégorie spécifiée, le cas échéant
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
        
        // Ajout dynamique des travaux récupérés à la galerie
        .forEach((workItem) => {
            // Création dynamique des éléments HTML pour afficher les travaux
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = workItem.imageUrl;
            img.alt = workItem.title;
            figure.appendChild(img);

            if (gallerySelector === ".modal-gallery") {
                // Ajout d'une icône de suppression pour les travaux dans la galerie modale
                const deleteIcon = document.createElement("i");
                deleteIcon.className = "fa-solid fa-trash-can";
                deleteIcon.setAttribute("data-work-id", workItem.id);
                deleteIcon.addEventListener("click", async () => {
                    await deleteWork(workItem.id);
                    figure.remove();
                }); 
                figure.appendChild(deleteIcon);
            }   
                 
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = workItem.title;
            figure.appendChild(figcaption);

            // Ajout des éléments à la galerie
            gallery.appendChild(figure);
        });
}

export async function deleteWork(workId) {
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
        },
    });
    getWorks(".homepage-gallery");
}

export async function postWorks(formData) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token d'authentification non trouvé")
        }

        const title = formData.get("title");
        const category = formData.get("category");

        if (!title || !category) {
            throw new Error("Veuillez remplir tous les champs du formulaire avant de valider");
        }

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || "Une erreur s'est produite lors de la validation du formulaire");
        }

        getWorks(".homepage-gallery");
    } catch (error) {
        const errorMessage = document.getElementById("error-message-photo");
        errorMessage.textContent = error.message;
    }
}