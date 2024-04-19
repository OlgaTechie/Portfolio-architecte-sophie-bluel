export async function getWorks(gallerySelector, categoryId = null) {
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
                    await deleteWork(workItem.id);
                    figure.remove();
                }); 
                figure.appendChild(deleteIcon);
            }   
                 
            const figcaption = document.createElement("figcaption");
            figcaption.textContent = workItem.title;
            figure.appendChild(figcaption);

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
        }
    });
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
            }
        });

        if (!response.ok) {
            throw new Error("Veuillez remplir tous les champs du formulaire avant de valider");
        }

        getWorks(".homepage-gallery");
    } catch (error) {
        const errorMessage = document.getElementById("error-message-photo");
        errorMessage.textContent = error.message;
    }
}