console.log("ça marche");

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

getWorks();

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    // console.log(categories);

    const menu = document.querySelector(".categories-menu");

    categories.forEach((category) => {
        console.log(category);
        const filter = document.createElement("li");
        filter.textContent = category.name;
        filter.addEventListener("click", () => {
            filterOfCategory(category.id);
        });
        menu.appendChild(filter);
    });
}

async function filterOfCategory(categoryId) {
    const response = await fetch("http://localhost:5678/api/works?category=${categoryId}");
    const filterdWorks = await response.json();
    // console.log(filterdWorks);

}

getCategories();