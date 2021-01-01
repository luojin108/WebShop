// console.log("User downloads this file for the first time. ")

const cartItemsTemplate = document.getElementById("cart-item-template");
const cartContainer = document.getElementById("cart-container");
const placeOrderButton = document.getElementById("place-order-button");

const method = "POST";
const url = "/api/orders";

/**
 * JL:Get the information of the items added to the cart and populate
 * the elements in cart.html with corresponding cart items.
 */
const getCartItems = async () => {
    Object.keys(sessionStorage).forEach(key =>{
        //JL: get the product that has been added to the cart from session storage.
        // The product is converted from the string stored as the value in session
        // storage to a JSON object.
        const productObject = JSON.parse(sessionStorage.getItem(key));
        populateClonedElements(productObject);
    });
    //JL: add the place order button to click listener.
    placeOrderButton.addEventListener("click", registerOrderClickHandler);

};

/**
 * JR: Click handler for when placing the order. Creates a data object that gets passed on to
 * utils.postOrPutJSON-function that makes the actual fetch request. Because fetch returns
 * a promise, this handler is asynchronous.  
 * 
 * @param {Event} event Triggers when user clicks the button to place the order. 
 */

const registerOrderClickHandler = async event => {
    console.log("Getting the order data...");

    const orderData = {
        items : [],
        customerId : "",
    };
    Object.keys(sessionStorage).forEach(key => {
        const productObject = JSON.parse(sessionStorage.getItem(key));
        orderData.items.push(
        {
            product: {
                _id: productObject._id,
                name: productObject.name,
                price: productObject.price,
                description: productObject.description,
            },
            quantity: parseInt(productObject.amount, 10)
        });
    });
    

    // console.log("Sending a response request using postOrPutJSON-function of public\js\ utils.js");
    // console.log("Looking at the response next")
    //if(!response.error) {
        //JL: Create a notification when the place order button is clicked.
        cartContainer.innerHTML="";
        createNotification("Successfully created an order!", "notifications-container");
        // JL: Clear the items from the session storage and UI after the order has been placed.
        sessionStorage.clear();
        await postOrPutJSON(url, method, orderData);

    //}
   // else {
        //createNotification(response.error, notificationContainer, false);
    //}
}

/**
 * JR: Makes a deep clone out of the template for product detail placement. 
 * @param {*} product the object of the item that has been added to the cart.
 */
const populateClonedElements = (product) => {
    //JL: get product information from the product object.
    const name = product["name"];
    const price = product["price"];
    const id = product["_id"];
    const amount = product["amount"];
    //JR: 5.12.20: Adding image
    const image = product["image"];
    
    //JL: get the clone of the template
    const templateClone = cartItemsTemplate.content.querySelector(".item-row").cloneNode(true);
    //JL: get the clone of each element 
    const productNameClone = templateClone.querySelector(".product-name");
    const productPriceClone = templateClone.querySelector(".product-price");
    const productAmountClone = templateClone.querySelector(".product-amount");
    const buttonsClones = templateClone.querySelectorAll(".cart-minus-plus-button");

    //new child to template: image
    const imageEl = document.createElement("img");
    templateClone.insertBefore(imageEl, templateClone.firstElementChild.nextSibling);

    imageEl.src = image;
    imageEl.alt = "The image of the product."; 
    imageEl.setAttribute("id", `image-${id}`);
    imageEl.setAttribute("class", "product-image");
    //JL:set attributes and content for each element
    productNameClone.textContent = name;
    productNameClone.setAttribute("id", `name-${id}`);
    productPriceClone.textContent = price;
    productPriceClone.setAttribute("id", `price-${id}`);
    productAmountClone.textContent = amount;
    productAmountClone.setAttribute("id", `amount-${id}`);
    buttonsClones[0].setAttribute("id", `plus-${id}`);
    buttonsClones[1].setAttribute("id", `minus-${id}`);
    cartContainer.appendChild(templateClone);

    //JL: this function add the plus button and minus button to click listener.
    initButton(buttonsClones[0], buttonsClones[1], id);
};

/**
 * JL: add the plus button and minus button to click listener.
 * @param {*} plusButton the button element for adding the item
 * @param {*} minusButton the button element for removing the item
 * @param {*} id the id of the product that is clicked
 */
const initButton = (plusButton, minusButton, id) => {

    plusButton.addEventListener("click", event => {
        increaseProductCount(id);
     });

     minusButton.addEventListener("click", event => {
        decreaseProductCount(id);
     });

};

getCartItems();