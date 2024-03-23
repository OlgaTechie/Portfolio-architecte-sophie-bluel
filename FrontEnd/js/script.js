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
            //retirer active className sur tous les boutons
            //className active sur button
            getWorks(categoryId);
        });
    });
}

getWorks();
getCategories();