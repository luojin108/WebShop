/**
 * DONE: JR: 8.3 List all users (use <template id="user-template"> in users.html)
 */

const templateEl =  document.getElementById("user-template");

//Each cloned template fragment should be appended to <div id="users-container">
const userContainerEl = document.getElementById("users-container");

/**
 * JR: contentChanger changes the textContent of the element.  
 * 
 * @param {Element} element the html element whose text content is to be changed
 * @param {string} newText the new text that will replace the text in the input element
 */
const contentChanger = (element, newText) => {
  element.textContent = newText;
};

/**
 * JR: Attribute changer changes the attribute specified by the programmer. 
 * 
 * @param {Element} element the html element whose attribute is to be changed
 * @param {string} attribute the name of the attribute to be changed
 * @param {string} newAttribute the value of the attribute 
 */
const attributeChanger = (element, attribute, newAttribute) => {
  element.setAttribute(attribute, newAttribute);
};
/**
 * JR: Handles the user data and passes it into users.html container-element. 
* @param {object} user the object of the user whose info will be passed into the container-element
*/
const userToContainerHandler = user => {
  //Clone the content of the template
  const content = templateEl.content;
  const clonedEl = content.querySelector(".item-row").cloneNode(true);
  
  //create a new, shallow-copied Array instance from the children of clonedEl, which is an Array-like object. 
  const children = Array.from(clonedEl.children);

  //Change attribute of the parent element of the clone. 
  attributeChanger(clonedEl, "id", `user-${user._id}`);

  //This may seem a bit complex. Basically, it goes through each of the cloned elements children aslong as they are not buttons, and changes their content and attribute based on the class identifiers (name, email, role)
  children.forEach(child => {
    const classIdentifier = child.className.split("-")[1];
    if(!classIdentifier.startsWith("button")) {
      contentChanger(child, user[`${classIdentifier}`]);
      attributeChanger(child, "id", `${classIdentifier}-${user._id}`);
    }
  });

  userContainerEl.appendChild(clonedEl);
};

/**
 * JR: Gets the users-json data that is stored in the backend.
*/

const getUsers = async () => {
  //JR: Gets the fetched data. 
  const usersArray = await getJSON("/api/users");

  //console.log(json)

  // userToContainerHandler(usersArray[0]);

  //This can now be used together with the template. 
  usersArray.forEach(user => {
    userToContainerHandler(user);
  });
  
};




/**      - Each user should be put inside a clone of the template fragment
 *       - Each individual user HTML should look like this
 *         (notice the id attributes and values, replace "{userId}" with the actual user id)
 *
 *         <div class="item-row" id="user-{userId}">
 *           <h3 class="user-name" id="name-{userId}">Admin</h3>
 *           <p class="user-email" id="email-{userId}">admin@email.com</p>
 *           <p class="user-role" id="role-{userId}">admin</p>
 *           <button class="modify-button" id="modify-{userId}">Modify</button>
 *           <button class="delete-button" id="delete-{userId}">Delete</button>
 *         </div>
 *
 *       - 
 *       - Use getJSON() function from utils.js to fetch user data from server
 */




/* TODO: 8.5 Updating/modifying and deleting existing users
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 *       - Use deleteResource() function from utils.js to delete users from server
 *       - Clicking "Delete" button of a user will delete the user and update the listing accordingly
 *       - Clicking "Modify" button of a user will use <template id="form-template"> to
 *         show an editing form populated with the values of the selected user
 *       - The edit form should appear inside <div id="modify-user">
 *       - Afted successful edit of user the form should be removed and the listing updated accordingly
 *       - You can use removeElement() from utils.js to remove the form.
 *       - Remove edit form from the DOM after successful edit or replace it with a new form when another
 *         user's "Modify" button is clicked. There should never be more than one form visible at any time.
 *         (Notice that the edit form has an id "edit-user-form" which should be unique in the DOM at all times.)
 *       - Also remove the edit form when a user is deleted regardless of which user is deleted.
 *       - Modifying a user successfully should show a notification message "Updated user {User Name}"
 *       - Deleting a user successfully should show a notification message "Deleted user {User Name}"
 *       - Use createNotification() function from utils.js to create notifications
 */

 //JL: The form template will be appended to the form container when modify button is clicked
const formTemplate =  document.getElementById("form-template");
const formContainer = document.getElementById("modify-user");

/**
 * JL: Initialize the user manager
 */
const userManager = async () => {
  //JL: Get the data of all users.
  await getUsers();
  //JL: Get all the modify buttons and delete buttons
  const deleteButtons = document.getElementsByClassName("delete-button");
  const modifyButtons = document.getElementsByClassName("modify-button");

  //JL: Set each of the delete button to click listener.
  // for(let i=0; i<deleteButtons.length; i++){
  //   //JL: Set the id of the delete button according to the the user id.
  //   deleteButtons[i].setAttribute("id",`delete-${deleteButtons[i].parentNode.id.split("-")[1]}`);

  //   //JL: Set the button to click listener.
  //   deleteButtons[i].addEventListener("click",event =>{
  //     //JL: Delete the corresponding user when clicking the delete button.
  //     deleteUser(event);
  //  });
  // }
  //JL: replace for loop with forEach
  
  Array.from(deleteButtons).forEach(button =>{
       //JL: Set the id of the delete button according to the the user id.
       button.setAttribute("id",`delete-${button.parentNode.id.split("-")[1]}`);

       //JL: Set the button to click listener.
       button.addEventListener("click",event =>{
         //JL: Delete the corresponding user when clicking the delete button.
         deleteUser(event);
        });
      }
  );

  //JL: Set each of the modify button to click listener.
//   for(let i=0; i<modifyButtons.length; i++){
//     //JL: Set the id of the modify button according to the the user id.
//     modifyButtons[i].setAttribute("id",`modify-${modifyButtons[i].parentNode.id.split("-")[1]}`);

//     //JL: Set the button to click listener.
//     modifyButtons[i].addEventListener("click",event =>{
      
//       //JL: Initialize the form when clicking the modify button
//       initForm(event);
//    });
//   }
// };
  Array.from(modifyButtons).forEach(button =>{
       //JL: Set the id of the modify button according to the the user id.
       button.setAttribute("id",`modify-${button.parentNode.id.split("-")[1]}`);

       //JL: Set the button to click listener.
       button.addEventListener("click",event =>{
         //JL: Initialize the form when clicking the modify button
         initForm(event);
      });
  });
};
/**
 * Implementation of deleting the user.
 * @param {*} filePath The path for the user that will be deleted.
 * @param {*} event The click event for deleting the user.
 */
const deleteUser = async (event)=>{
  //JL: Get the name of the user that will be deleted. The name is needed for creating notification.
  const containerId = event.target.parentNode.id;
  const deletedUserId = containerId.split("-")[1];
  const deletedUserName = document.getElementById("name-"+deletedUserId).textContent;
  
  //JL: If the modify form is present, it will disappear when the delete button is clicked.
  if(formContainer.childNodes.length !== 0){
    formContainer.removeChild(formContainer.childNodes[0]);
  }

  //JL: Delete the user based on the file path.
  const filePath = "/api/users/"+deletedUserId;
  const deletedUser = await deleteResourse(filePath);

  //JL: Create a notification for the deletion, and remove the user from the user interface.
  createNotification(`Deleted user ${deletedUserName}`,"notifications-container");
  const itemTobeRemoved = document.getElementById("user-"+deletedUser._id);
  userContainerEl.removeChild(itemTobeRemoved);
};

/**
 * Initialize the modify form.
 * @param {*} filePath The path for the user that will be modified.
 * @param {*} event The click event for modifying the user.
 */
const initForm = async (event)=>{
  //JL: Get the information of the user that will be modified, from the click event.
  const clickedUserId = event.target.parentNode.id.split("-")[1];
  const clickedUserName = event.target.parentNode.getElementsByClassName("user-name")[0].textContent;
  const clickedUserEmail = event.target.parentNode.getElementsByClassName("user-email")[0].textContent;

  //JL: Get the clone of the form template and populate it with the user's information.
  const clonedFormTemplate = formTemplate.content.querySelector("#edit-user-form").cloneNode(true);
  populateElements(clonedFormTemplate,clickedUserId,clickedUserName,clickedUserEmail);

  //JL: If the form is already present, then removing. Because there can be only one form present at any time.
  if(formContainer.childNodes.length !== 0){
    formContainer.removeChild(formContainer.childNodes[0]);
  }

  //JL: Append the clone to the form container.
  formContainer.appendChild(clonedFormTemplate);

  //JL: Get the update button in the form and set it to click listener.
  const updateButton = formContainer.children[0][4];
  updateButton.addEventListener("click", e=>{
    e.preventDefault();

    //JL: If the update button is clicked, the role selected will be sent the the backend.
    const role = document.getElementById("role-input").value;
    const user = {role};
    const filePath = "/api/users/"+clickedUserId;
    postOrPutJSON(filePath,"PUT",user);

    //JL: Once the selected role is sent, the form will be removed and a notification will be created.
    removeElement("modify-user","edit-user-form");
    document.getElementById(`role-${clickedUserId}`).textContent=role;
    createNotification(`Updated user ${clickedUserName}`,"notifications-container");
  });
};

/**
 * Populate the elements in the form template with the user's information.
 * @param {*} clonedFormTemplate The template of the form used for user modification.
 * @param {*} clickedUserId The id of the user that will be modified.
 * @param {*} clickedUserName The name of the user that will be modified.
 * @param {*} clickedUserEmail The email of the user that will be modified.
 */
const populateElements = (clonedFormTemplate,clickedUserId,clickedUserName,clickedUserEmail)=>{
  clonedFormTemplate.querySelector("#id-input").setAttribute("value",clickedUserId); 
  clonedFormTemplate.querySelector("#name-input").setAttribute("value",clickedUserName);
  clonedFormTemplate.querySelector("#email-input").setAttribute("value",clickedUserEmail);
  clonedFormTemplate.querySelector(".text-align-center").textContent=`Modify user ${clickedUserName}`;
};

userManager();
