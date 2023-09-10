const productContainer = document.getElementById("product-container");

const productData = [];
let isSearching = false;
let selectedCategory = "";

async function fetchData(searchText="") {
    try {
        const apiUrl = searchText ? `https://dummyjson.com/products/search?q=${searchText}` : "https://dummyjson.com/products?limit=15";
        const response = await fetch(apiUrl);
        const data = await response.json();
        productData.length=0;
        productData.push(...data.products);
        console.log(productData)
        displayProducts(productData);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// this is step 3 categories
async function fetchCategories() {
    try {
        const response = await fetch("https://dummyjson.com/products/categories");
        const data = await response.json();
        console.log(data);
        displayCategories(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
async function fetchProductsByCategory(category) {
    try {
        const apiUrl = `https://dummyjson.com/products/category/${category}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        productData.length = 0; // Clear existing data
        productData.push(...data.products); // Store product data
        displayProducts(productData);
    } catch (error) {
        console.error("Error fetching data by category:", error);
    }
}
function displayCategories(categories) {
    // Clear existing categories
    const categoriesDiv = document.getElementById("categories");
    categoriesDiv.innerHTML = "";

    // Create radio buttons for categories
    categories.forEach(category => {
        const categoryRadio = document.createElement("input");
        categoryRadio.type = "radio";
        categoryRadio.name = "category";
        categoryRadio.value = category;
        categoryRadio.id = `category-${category}`;
        categoryRadio.addEventListener("change", () => {
            selectedCategory = categoryRadio.value;
            fetchProductsByCategory(selectedCategory);
        });

        const categoryLabel = document.createElement("label");
        categoryLabel.textContent = category;
        categoryLabel.htmlFor = `category-${category}`;

        categoriesDiv.appendChild(categoryRadio);
        categoriesDiv.appendChild(categoryLabel);
    });
}

function clearCategories() {
    selectedCategory = "";
    fetchCategories();
    fetchData();
}

// Create clear categories button
const clearCategoriesButton = document.createElement("button");
clearCategoriesButton.setAttribute('class', 'clearCatBtn');
clearCategoriesButton.textContent = "CLEAR CATEGORIES";
clearCategoriesButton.addEventListener("click", clearCategories);

// Add clear categories button to the page
const categoriesDiv = document.createElement("div");
categoriesDiv.id = "categories";
document.body.insertBefore(categoriesDiv, document.body.firstChild);
document.body.insertBefore(clearCategoriesButton, categoriesDiv.nextSibling);


function displayProducts(data) {
    productContainer.innerHTML='';
    data.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const mainImageDiv = document.createElement('div');
        mainImageDiv.setAttribute('class', 'mainImageDiv');

        const mainImage = document.createElement("img");
        mainImage.src = product.thumbnail;
        mainImageDiv.appendChild(mainImage);
        productCard.appendChild(mainImageDiv);

        const otherDiv= document.createElement('div');
        otherDiv.setAttribute('class', 'otherDiv');

        const imgDiv = document.createElement('div');
        imgDiv.setAttribute('class', 'imgDiv');

        const img1 = document.createElement("img");
        img1.src = product.images[0];
        const img2 = document.createElement("img");
        img2.src = product.images[1];
        const img3 = document.createElement("img");
        img3.src = product.images[2];
        const img4 = document.createElement("img");
        img4.src = product.images[3];
        const img5 = document.createElement("img");
        img5.src = product.images[4];
        imgDiv.append(img1, img2, img3, img4, img5);

        otherDiv.appendChild(imgDiv);

        const detailDiv = document.createElement("div");
        detailDiv.classList.add("detailDiv");

        const title = document.createElement('h2');
        title.textContent = product.title;

        const price = document.createElement("h4");
        price.textContent = 'Price: $'+ product.price;

        const rating = document.createElement("p");
        rating.textContent = 'Rating: ' +product.rating;

        detailDiv.append(title,price,rating);

        otherDiv.appendChild(detailDiv);

        productCard.appendChild(otherDiv);

        const showDescriptionButton = document.createElement("button");
        showDescriptionButton.classList.add("show-description-button");
        showDescriptionButton.textContent = "Show Description";
        showDescriptionButton.addEventListener("click", () => {
            toggleDescription(productCard, product.description);
        });
        productCard.appendChild(showDescriptionButton);

        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("product-description");
        descriptionDiv.style.display = 'none';
        productCard.appendChild(descriptionDiv);

        const lessDescriptionButton = document.createElement("button");
        lessDescriptionButton.classList.add("hide-description-button");
        lessDescriptionButton.textContent = "Less Description";
        lessDescriptionButton.addEventListener("click", () => {
            toggleDescription(productCard, product.description);
        });

        descriptionDiv.appendChild(lessDescriptionButton);

        productContainer.appendChild(productCard);
    });
}

function toggleDescription(productCard, description) {
    const descriptionDiv = productCard.querySelector(".product-description");
    if(descriptionDiv.style.display==='none'){
        descriptionDiv.textContent = description;
        const lessBtn = document.createElement('button');
        lessBtn.textContent='Less Description';
        lessBtn.addEventListener("click", ()=>{
            descriptionDiv.style.display='none';
            lessBtn.remove();
        });
            descriptionDiv.appendChild(lessBtn);
            descriptionDiv.style.display = descriptionDiv.style.display === "none" ? "block" : "none";
    }
    else{
        descriptionDiv.style.display = 'none';
        descriptionDiv.textContent = ''; 
    }
        

}




// search functionality ----
function clearSearchResults() {
    isSearching = false;
    document.getElementById("search-input").value = "";
    fetchData(); // 
}
function searchProducts() {
    const searchText = document.getElementById("search-input").value.trim();
    if (searchText) {
        isSearching = true;
        fetchData(searchText); 
    } else {
        clearSearchResults();
    }
}

// Create search input and search button
const searchInput = document.createElement("input");
searchInput.id = "search-input";
searchInput.placeholder = "Search products...";
searchInput.addEventListener("input", () => {
    searchProducts();
});

const searchButton = document.createElement("button");
searchButton.textContent = "Search";
searchButton.addEventListener("click", searchProducts);

// Create clear search results button
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.addEventListener("click", clearSearchResults);

const searchDiv = document.createElement("div");
searchDiv.setAttribute('class', 'searchDiv');
searchDiv.appendChild(searchInput);
searchDiv.appendChild(searchButton);
searchDiv.appendChild(clearButton);
document.body.insertBefore(searchDiv, document.body.firstChild);

// Sorting functions
function sortByPriceLowToHigh() {
    productData.sort((a, b) => a.price - b.price);
    displayProducts(productData);
}

function sortByPriceHighToLow() {
    productData.sort((a, b) => b.price - a.price);
    displayProducts(productData);
}

function sortByRatingHighToLow() {
    productData.sort((a, b) => b.rating - a.rating);
    displayProducts(productData);
}


// Buttons for sorting
const sortByPriceLowButton = document.createElement("button");
sortByPriceLowButton.textContent = "Sort By Price Low To High";
sortByPriceLowButton.addEventListener("click", sortByPriceLowToHigh);

const sortByPriceHighButton = document.createElement("button");
sortByPriceHighButton.textContent = "Sort By Price High to Low";
sortByPriceHighButton.addEventListener("click", sortByPriceHighToLow);

const sortByRatingButton = document.createElement("button");
sortByRatingButton.textContent = "Sort By Rating(High to Low)";
sortByRatingButton.addEventListener("click", sortByRatingHighToLow);

// Add sorting buttons to the page
const sortingButtonsDiv = document.createElement("div");
sortingButtonsDiv.setAttribute('class', 'sortingBtnDiv');
sortingButtonsDiv.appendChild(sortByPriceLowButton);
sortingButtonsDiv.appendChild(sortByPriceHighButton);
sortingButtonsDiv.appendChild(sortByRatingButton);
document.body.insertBefore(sortingButtonsDiv, productContainer);


fetchData();
fetchCategories();
