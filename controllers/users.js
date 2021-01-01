const responseUtils = require("../utils/responseUtils");
const requestUtils= require('../utils/requestUtils');
const User = require("../models/user");
const { acceptsJson } = require('../utils/requestUtils');


/**
 * Send all users as JSON
 *
 * @param {http.ServerResponse} response response to be sent to the user containing all user info
 */
const getAllUsers = async response => {
  // DONE: 10.1 Implement this
  return responseUtils.sendJson(response, await User.find({}));
};

/**
 * Delete user and send deleted user as JSON
 *
 * @param {http.ServerResponse} response response to the user
 * @param {string} userId the id of the user that is being deleted.
 * @param {object} currentUser (mongoose document object)
 */
const deleteUser = async (response, userId, currentUser) => {
  //JR: If we are trying to deleted the current user, it fails:
  if(currentUser._id.toString() === userId ) return responseUtils.badRequest(response, 'Deleting own data is not allowed');
  const foundUser = await User.findById(userId);
  if(!foundUser) return responseUtils.notFound(response);
  await User.deleteOne({email: foundUser.email});
  return responseUtils.sendJson(response, foundUser);
};

/**
 * Update user and send updated user as JSON
 *
 * @param {http.ServerResponse} response response to be sent to the user
 * @param {string} userId the id of the user that is being updated
 * @param {object} currentUser (mongoose document object)
 * @param {object} userData JSON data from request body
 */
const updateUser = async (response, userId, currentUser, userData) => {
  //JR: Get the user that is to be updated from the database:
  const chosenUser = await User.findById(userId).exec();

  //JR: If it doesnt exist, it fails:
  if(!chosenUser) return responseUtils.notFound(response);

  //JR: If it's the same as the current user, it fails:
  if(currentUser._id.toString() === userId ) return responseUtils.badRequest(response, 'Updating own data is not allowed');

  const {role} = userData;
  if(!role || (role !== 'customer' && role !== 'admin')){
    return responseUtils.badRequest(response);
  }
  else{
    chosenUser.role = role;
    await chosenUser.save();

    const updatedUser = await User.findById(userId).exec();
    const userToBeSent = updatedUser.toObject();
    delete userToBeSent["__v"];
    return responseUtils.sendJson(response, userToBeSent);
  }
};

/**
 * Send user data as JSON
 *
 * @param {http.ServerResponse} response response to b sent to the user
 * @param {string} userId the id of the user that is being viewed
 * @param {object} currentUser (mongoose document object)
 */
const viewUser = async (response, userId, currentUser) => {
  //JR: Get the user that is to be viewed from the database:
  const chosenUser = await User.findById(userId).exec();

  //JR: If no such user exists:
  if(!chosenUser) return responseUtils.notFound(response);
  
  //JR: If the user that is modifying is admin: 
  if(currentUser.role === 'admin') {
    return responseUtils.sendJson(response, chosenUser);
  }
};

/**
 * Register new user and send created user back as JSON
 *
 * @param {http.ServerResponse} response response to b sent to the user
 * @param {object} userData JSON data from request body
 */
const registerUser = async (response, userData) => {
  const emailExists = await User.findOne({email: `${userData.email}`});
  //JR: If this email already existed
  if(emailExists) await responseUtils.badRequest(response, "Bad Request");
  else {
    const newUser = new User(userData);
    newUser.role="customer"; //This should be the default value
    const error = newUser.validateSync();
    //JR: If there were errros, then the data that was passed did not meet the User-models expectations. respond with 400.
    if(error) await responseUtils.badRequest(response, "Bad Request");
    else {
      // console.log(`(${fileName}) ${functionName}: Saving the new document to its collection in the mongoDB database`);
      await newUser.save();
      
      // console.log(`(${fileName}) ${functionName}: Next ensure it's saved to the database:`); 
      const foundNewUser = await User.findById(newUser._id);

      // console.log(`(${fileName}) ${functionName}: Then, respond with 201 when registration is succesfull`); 
      return responseUtils.createdResource(response, foundNewUser);
    }
  }

};

/**
 * Different actions if the current user targets at certain user
 * @param {*} request request from the user 
 * @param {*} response response to be sent to the user
 * @param {*} currentUser the object of the current user who is doing the operation
 * @param {*} filePath the url poiting to the user the current user is interested in
 * @param {*} method the method from the request (DELETE, PUT, or GET)
 */
// eslint-disable-next-line complexity
const routeToUserOperations = async (request, response, currentUser, filePath, method) => {
  //JR: Next parts need authorization in headers. 
  //JL: Handling if the authorization header is missing
  //JL/JR: Get the userId whose data current user will work on.
  if(!('authorization' in request.headers) || !currentUser){
    return responseUtils.basicAuthChallenge(response);
  }
  // JR: If there is no accept or client does not accept JSON, return 406. 
  if (!acceptsJson(request)) {
    return responseUtils.contentTypeNotAcceptable(response);
  }
  const userId = filePath.split("/").pop();
  // console.log(`UserId: ${ userId}`);
  //JL: Handling if customer credentials are received.
  // if(currentUser.role === 'customer'){
  //   return 
  // }
  //JL: Handling if the user exist and the current user is admin.
  if(currentUser.role === 'admin'){
    if(method === 'DELETE') await deleteUser(response, userId, currentUser);
    else if (method === 'GET') await viewUser(response, userId, currentUser);
    
    //JL: Handling if the admin is modifying a user.
    if(method === 'PUT'){ 
      //Using parseBodyJson(request) from utils/requestUtils.js to parse request body   
      const userData = await requestUtils.parseBodyJson(request);
      if ( userData.role !== "admin" && userData.role !== "customer"){
        await responseUtils.badRequest(response, userData);
      }
      else await updateUser(response, userId, currentUser, userData);
    }
  }
  else await responseUtils.forbidden(response);

};

/**
 * Different actions if the user target at registration
 * @param {*} request request from the current user
 * @param {*} response response to be sent to the current user
 */
const routeToUserRegister = async (request, response) => {
  // Fail if not a JSON request
  if (!requestUtils.isJson(request)) {
    return responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
  }
  // Using parseBodyJson(request) from utils/requestUtils.js to parse request body
  const userData = await requestUtils.parseBodyJson(request);
  return registerUser(response, userData);
};

/**
 * Different actions if the user want to go to the page containing all the users
 * @param {*} response request from the current user
 * @param {*} currentUser response to be sent to the current user
 */
const routeToAllUsers = ( response, currentUser) => {
     // JL: Return all users if the user has a role of "admin".
     if(currentUser.role === 'admin'){
      return getAllUsers(response);
    }

    // If the user has a role of customer, return response with status code "403 Forbidden"
    else{ 
      return responseUtils.forbidden(response);
    }

};

module.exports = { getAllUsers, registerUser, deleteUser, viewUser, updateUser, routeToAllUsers, routeToUserOperations, routeToUserRegister };
