/**
 * TODO: 8.3 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */

//JR: The id of the notification container
const notificationContainer = "notifications-container";

const formEl = document.getElementById("register-form");

const method = formEl.method;
const url = "/api/register";


/**
 * JR: Handler for when user submits a new event. Prevents registration when password and 
 * passwordConfirmation do not match. Uses reateNotification() function from utils.js to show 
 * user messages of error conditions and successful registration. Reset the form back to empty 
 * after successful registration Use postOrPutJSON() function from utils.js to send your data 
 * back to server
 * 
 * @param {Event} event the submit button click event triggering the operations
 */
const submitNewUserHandler = async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirmation = document.getElementById("passwordConfirmation").value;
  
  if(password === passwordConfirmation) {
    const userData = {
      name,
      email,
      password
    };

    const response = await postOrPutJSON(url, method, userData);
    if(!response.error) {
      createNotification("User added.", notificationContainer, true);
      console.log(response);
      formEl.reset();
    }
    else {
      createNotification(response.error, notificationContainer, false);
    }
  }
  else {
    createNotification("Mismatching passwords", notificationContainer, false);
  }
}

formEl.addEventListener("submit", submitNewUserHandler);