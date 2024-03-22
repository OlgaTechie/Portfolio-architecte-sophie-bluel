async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    // console.log(data); // [{id:..., title:"...3"...}]

    const gallery = document.querySelector(".gallery");
    
    data.forEach((workItem) => {
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
        console.log(categories);

        const allFilter = document.createElement("button");
        allFilter.textContent = "Tous";
        menu.appendChild(allFilter);

        categories.forEach((category) => {
            console.log(category);
            const filter = document.createElement("button");
            filter.textContent = category.name;
            filter.dataset.categoryId = category.id; // the attribute data-category-id to store the category ID
            menu.appendChild(filter);
        });

        // Event listener for clicks on categories
        menu.addEventListener("click", async (event) => {
            let categoryId = null;
            if (event.target.textContent !== "Tous") {
                //Retrieve the category ID from the data attribute
                categoryId = event.target.dataset.categoryId;
            }
            await filterOfCategory(categoryId);
        });
    } catch (error) {
        console.error("An error occurred in getCategories:", error);
    }
}

async function filterOfCategory(categoryId) {
    try {
        const url = categoryId ? `http://localhost:5678/api/categories/${categoryId}/works` : "http://localhost:5678/api/works";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error while retrieving filtered works");
        }
        const filteredWorks = await response.json();
        // console.log(filteredWorks);
    
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
    
        filteredWorks.forEach((workItem) => {
            const figure = document.createElement("figure");
            figure.innerHTML = `
                <img src="${workItem.imageUrl}" alt="${workItem.title}">
                <figcaption>${workItem.title}</figcaption>
            `;
            gallery.appendChild(figure);
        });
    } catch (error) {
        console.error("An error occurred in filterOfCategory:", error);
    }
}

getWorks();
getCategories();