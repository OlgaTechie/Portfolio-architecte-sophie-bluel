console.log("ça marche");

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    // console.log(data); // [{id:..., title:"...3"...}]

    const gallery = document.querySelector(".gallery");
    
    data.forEach((workItem) => {
        console.log(workItem.id);
    });
}

getWorks();