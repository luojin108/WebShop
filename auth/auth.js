const {getCredentials} = require('../utils/requestUtils');

// JL:require the user model
const User = require("../models/user");
/**
 * Get current user based on the request headers
 *
 * @param {http.IncomingMessage} request incomming request from the user.
 * @returns {object|null} current authenticated user or null if not yet authenticated
 */
const getCurrentUser = async request => {
  // DONE: 8.4 Implement getting current user based on the "Authorization" request header

  // NOTE: You can use getCredentials(request) function from utils/requestUtils.js
  // and getUser(email, password) function from utils/users.js to get the currently
  // logged in user

  //JL:Get the userCredentials, namely, email and password
  const userCredentials = getCredentials(request);
  // JL: the following operation is changed such that the data is obtained from database (exercise 9.5)
  if(userCredentials !== null){
    const currentUser = await User.findOne({email: userCredentials[0]}).exec();
    const password = userCredentials[1];
    
    if(currentUser && await currentUser.checkPassword(password)){
      //return emailUser.toObject() <- Wasn't accepted by the Auth-test. (npm test)
      return currentUser;
    }else{
      return null;
    }    
  }else{
    return null;
  } 
 


};

module.exports = { getCurrentUser };
