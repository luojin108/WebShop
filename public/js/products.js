const productTemplate = document.getElementById("product-template");
const productsContainer = document.getElementById("products-container");


const getProducts = async () => {
    //JL: send a request, and get the product information in JSON from the backend
    const productsArray =await getJSON("/api/products");
    
    productsArray.forEach(product => {
        populateClonedElements(product);
    });

};

/**
 * JR: Makes a deep clone out of the template for product detail placement. 
 * 
 * @param {*} product the product object in JSON
 */
const populateClonedElements = (product) => {
    //JL: get product information from the product object
    const name = product["name"];
    const description = product["description"];
    const price = product["price"];
    const id = product["_id"];
    //JR: 5.12.20: Adding image
    const image = product["image"];
    //new child to template: image
    const imageEl = document.createElement("img");
    
    //Creating new imageEl attirubtes and alt text.
    imageEl.src = image;
    imageEl.alt = "The image of the product."; 
    imageEl.setAttribute("id", `image-${id}`);
    imageEl.setAttribute("class", "product-image");
    
    //JL: get the clone of the template
    const templateClone = productTemplate.content.querySelector(".item-row").cloneNode(true);
    //JL: get the clone of each element 
    const productNameClone = templateClone.querySelector(".product-name");
    const productDescriptionClone = templateClone.querySelector(".product-description");
    const productPriceClone = templateClone.querySelector(".product-price");
    const buttonClone = templateClone.querySelector("button");
    
    //Add imageEl to the template
    templateClone.insertBefore(imageEl, templateClone.firstElementChild.nextSibling);
    //JL:set attributes and content to the corresponding HTML elements.
    productNameClone.textContent = name;
    productNameClone.setAttribute("id", `name-${id}`);
    productDescriptionClone.textContent = description;
    productDescriptionClone.setAttribute("id", `description-${id}`);
    productPriceClone.textContent = price;
    productPriceClone.setAttribute("id", `price-${id}`);
    buttonClone.setAttribute("id", `add-to-cart-${id}`);
    initButton(buttonClone, product);
    productsContainer.appendChild(templateClone);
};

/**
 * JL: Set the add to cart button to click listener. Once clicked, the product is added
 * to the cart.
 * @param {*} button the add to cart button
 * @param {*} product the product object to be added to the cart
 */
const initButton = (button, product) => {

    button.addEventListener("click", event => {
        addProductToCart(product);
        createNotification(`Added ${product["name"]} to cart!`, "notifications-container");
     });

};
getProducts();