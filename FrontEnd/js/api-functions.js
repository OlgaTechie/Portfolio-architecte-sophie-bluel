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

// Fonction pour supprimer un travail de la galerie
export async function deleteWork(workId) {
    // Récupération du jeton d'authentification depuis le stockage local
    const token = localStorage.getItem("token");
    
    // Vérification de l'existence du jeton d'authentification
    if (!token) {
        // Si le jeton n'est pas trouvé, une erreur est levée
        throw new Error("Token d'authentification non trouvé");
    }

    // Envoi d'une requête DELETE au serveur pour supprimer le travail spécifié
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Ajout du jeton d'authentification dans les en-têtes
            'Accept': 'application/json',
        },
    });

    // Actualisation de la galerie après la suppression du travail
    getWorks(".homepage-gallery");
}

// Envoyer les données du nouveau travail au serveur pour ajout
export async function postWorks(formData) {
    try {
        // Vérifier si le token d'authentification est présent dans le stockage local
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token d'authentification non trouvé")
        }

        // Récupérer le titre et la catégorie du formulaire de données
        const title = formData.get("title");
        const category = formData.get("category");

        // Vérifier si le titre et la catégorie sont fournis
        if (!title || !category) {
            throw new Error("Veuillez remplir tous les champs du formulaire avant de valider");
        }

        // Envoyer les données du formulaire au serveur via une requête POST
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST", // Méthode de la requête
            body: formData, // Corps de la requête contenant les données du formulaire
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}` // Ajout du jeton d'authentification dans les en-têtes
            },
        });

        // Analyser la réponse JSON renvoyée par le serveur
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || "Une erreur s'est produite lors de la validation du formulaire");
        }

        // Mettre à jour la galerie pour afficher le nouveau travail ajouté
        getWorks(".homepage-gallery");
    } catch (error) {
        // En cas d'erreur, afficher le message d'erreur dans l'élément avec l'ID "error-message-photo"
        const errorMessage = document.getElementById("error-message-photo");
        errorMessage.textContent = error.message;
    }
}