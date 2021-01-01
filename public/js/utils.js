console.log("User downloads this file for the first time. ")


/**
 * Asynchronously fetch JSON from the given url. (GET)
 *
 * Uses fetch to get JSON from the backend and returns the parsed
 * JSON back.
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await getJSON("/api/users");
 *
 *   -- OR --
 *
 *   getJSON("/api/users").then(json => {
 *     // Do something with the json
 *   })
 *
 * @param {string} url resource url on the server
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const getJSON = async url => /* DONE: 8.3 Implement this*/ {
  const response = await fetch(url);
  const JSON = response.json();
  return JSON;
};

/**
 * Asynchronously update existing content or create new content on the server (PUT or POST)
 *
 * Uses fetch to send data as JSON to the server and returns the response as JSON.
 * Again remember that async function always returns a Promise.
 *
 * @param {string} url resource url on the server
 * @param {string} method "PUT" or "POST"
 * @param {object|Array} data payload data be sent to the server as JSON
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const postOrPutJSON = async (url, method, data = {}) => {
  method = method.toUpperCase();
  if (method !== 'POST' && method !== 'PUT') {
    throw 'Invalid method! Valid methods are POST and PUT!';
  }

  if(method === "POST") {
    console.log("POST method called.")
    try {
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
      console.log(error);
    }
  }
  // JL:added the implementation for the method "PUT"
  if(method === "PUT") {
    console.log("PUT method called.");
    try {
      const response = await fetch(url, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
      console.log(error);
    }
  }
  throw new Error('Not Implemented');
};

/**
 * Asynchronously remove a resource from the server (DELETE)
 *
 * Uses fetch to send the request to the server and returns the response as JSON.
 * Again remember that async function always returns a Promise.
 *
 * @param {string} url resource url on the server
 * @returns {Promise<*>} promise that resolves to the parsed JSON
 */
const deleteResourse = async url => {
  //JL: Implementation of the request for deleting a certain user.
  try {
    const response = await fetch(url, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    console.log(error);
  }
  throw new Error('Not Implemented');
};

/**
 * Generate random unique id to use as id value on notifications
 * or other HTML elements (remember that IDs must be unique within
 * a document).
 *
 * @returns {string} the generated id 
 */
const generateId = () => {
  // Shamelessly borrowed from a Gist. See:
  // https://gist.github.com/gordonbrander/2230317
  // eslint-disable-next-line prefer-template
  return ('_' + Math.random().toString(36).substr(2, 9));
};

/**
 * Create a notification message that disappears after five seconds.
 *
 * Appends a new paragraph inside the container element and gives it
 * class based on the status of the message (success or failure).
 *
 * @param {string} message the message to be present
 * @param {string} containerId id attribute of the container element
 * @param {boolean} isSuccess whether the message describes a success or a failure
 */
const createNotification = (message, containerId, isSuccess = true) => {
  const container = document.getElementById(containerId);

  // Create new p element to hold text
  const newParagraph = document.createElement('p');

  // Create unique id for the notification so that it can easily be removed after timeout
  const notificationId = generateId();
  newParagraph.id = notificationId;

  // Set CSS class for the paragraph based on the isSuccess variable
  newParagraph.classList.add(isSuccess ? 'background-lightgreen' : 'background-red');

  // Add message test inside the paragraph and append the paragraph to the container
  newParagraph.append(document.createTextNode(message));
  container.append(newParagraph);

  // After five seconds remove the notification
  setTimeout(() => {
    removeElement(containerId, notificationId);
  }, 5000);
};

/**
 * Remove an element (and its descendants) from the DOM.
 *
 * @param {string} containerId containing element's id
 * @param {string} elementId id of the element to be removed
 */
const removeElement = (containerId, elementId) => {
  const container = document.getElementById(containerId);
  container.querySelectorAll(`#${elementId}`).forEach(element => element.remove());
};


/**
 * JL: add the product to the shopping cart
 * @param {*} product the product object that is being added to the cart.
 */
const addProductToCart = (product) => {
  //JL: if the product does not exist in the session storage, add it to the storage
  // and add a new property "amount" with value "1x". It means that one the product is added 
  // to the cart. If the product already exists, increase to amount by one.
  product["amount"] = "1x";
   
  if (!(sessionStorage.getItem(product["_id"]))){
    sessionStorage.setItem(product["_id"], JSON.stringify(product));
  } else {
    const productObject = JSON.parse(sessionStorage.getItem(product["_id"]));
    const currentAmount = parseInt(productObject["amount"].split("x")[0]);
    const newAmount = currentAmount + 1;
    updateAmountInSessionStorage(product["_id"], newAmount);
  }
};

/**
 * JL: increase the amount of the product by one in both UI and session storage.
 * The amount in session storage is updated by another function updateAmountInSessionStorage ()
 * @param {*} productId the id of the product whose amount is increased.
 */
const increaseProductCount = (productId) => {
  const amountElement = document.getElementById(`amount-${productId}`);
  const currentAmount = parseInt(amountElement.textContent.split("x")[0]);
  const newAmount = currentAmount + 1;
  amountElement.textContent = `${newAmount}x`;
  updateAmountInSessionStorage(productId, newAmount);
  
};


/**
 * JL: decrease the amount of the product by one in both UI and session storage.
 * The amount in session storage is updated by another function updateAmountInSessionStorage ()
 * @param {*} productId the id of the product whose amount is decreased.
 */
const decreaseProductCount = (productId) => {
  const amountElement = document.getElementById(`amount-${productId}`);
  const currentAmount = parseInt(amountElement.textContent.split("x")[0]);
  const newAmount = currentAmount - 1;
  if (newAmount === 0){
    amountElement.parentElement.remove();
    sessionStorage.removeItem(productId);
  } else {
    amountElement.textContent = `${newAmount}x`;
    updateAmountInSessionStorage(productId, newAmount);
  }
};

/**
 * JL: update the amount the product in the session storage.
 * @param {*} productId the id of the product whose amount is changed 
 * @param {*} newAmount the updated amount of the product in the cart.
 */
const updateAmountInSessionStorage = (productId, newAmount) => {
  const productObject = JSON.parse(sessionStorage.getItem(productId));
  productObject["amount"] = `${newAmount}x`;
  sessionStorage.setItem(productId, JSON.stringify(productObject));
};






