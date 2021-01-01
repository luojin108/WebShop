/**
 * Week 08 utility file for user related operations
 *
 * NOTE: This file will be abandoned during week 09 when a database will be used
 * to store all data.
 */

/**
 * Use this object to store users
 *
 * An object is used so that users can be reset to known values in tests
 * a plain const could not be redefined after initialization but object
 * properties do not have that restriction.
 */
const data = {
  // make copies of users (prevents changing from outside this module/file)
  users: require('../users.json').map(user => ({ ...user })),
  roles: ['customer', 'admin']
};

/**
 * Reset users back to their initial values (helper function for tests)
 *
 * NOTE: DO NOT EDIT OR USE THIS FUNCTION THIS IS ONLY MEANT TO BE USED BY TESTS
 * Later when database is used this will not be necessary anymore as tests can reset
 * database to a known state directly.
 */
const resetUsers = () => {
  // make copies of users (prevents changing from outside this module/file)
  data.users = require('../users.json').map(user => ({ ...user }));
};

/**
 * Generate a random string for use as user ID
 * @returns {string} a random string for use as user ID
 */
const generateId = () => {
  //let id;

  // do {
  //   // Generate unique random id that is not already in use
  //   // Shamelessly borrowed from a Gist. See:
  //   // https://gist.github.com/gordonbrander/2230317

  //   id = Math.random().toString(36).substr(2, 9);
  // } while (data.users.some(u => u._id === id));

  //JL: replace while loop with recursive function
  const id = Math.random().toString(36).substr(2, 9);
  if(data.users.some(u => u._id === id)){
    generateId();
  }
  return id;
};

/**
 * Check if email is already in use by another user
 *
 * @param {string} email the input email address for the checking
 * @returns {boolean} boolean judging whether the input email is already in use by another user
 */
const emailInUse = email => {
  // TODO: 8.3 Check if there already exists a user with a given email
  //27.10: Done. - JR. 
  let returnValue = false;

  data.users.forEach(user => {
    if(user.email === email) {
      returnValue = true;
    }
    
  });
  return returnValue;
};

/**
 * Return user object with the matching email and password or undefined if not found
 *
 * Returns a copy of the found user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} email enter the email and the corresponding passwaord for getting the user 
 * @param {string} password enter the email and the corresponding passwaord for getting the user 
 * @returns {bbject|undefined} the object of the user
 */
const getUser = (email, password) => {
  // TODO: 8.3 Get user whose email and password match the provided values
  // 27.10: Done - JR
  let foundUser;
  data.users.forEach(user => {
    if(user.email === email) {
      if(user.password === password) {
        foundUser = {...user};
      }
    }
  });
  return foundUser;
};

/**
 * Return user object with the matching ID or undefined if not found.
 *
 * Returns a copy of the user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} userId the input id of the user for getting the object of it
 * @returns {object|undefined} the object of the user according the input id
 */
const getUserById = userId => {
  // TODO: 8.3 Find user by user id
  let foundUser;
  data.users.forEach(user => {
    if(user._id === userId) {
      foundUser = {...user};
    }
  });
  return foundUser;
  // throw new Error('Not Implemented');
};

/**
 * Delete user by its ID and return the deleted user
 *
 * @param {string} userId the id of the user that is being deleted
 * @returns {object|undefined} deleted user or undefined if user does not exist
 */
const deleteUserById = userId => {
  // TODO: 8.3 Delete user with a given id
  let deletedUser;
  
  data.users.forEach((user, index) => {
    if(user._id === userId) {
      //Splice returns the removed item in an array
      //We need to get it out of the array to get an object
      deletedUser = data.users.splice(index, 1)[0];
    }
  });

  return deletedUser;

  // throw new Error('Not Implemented');
};

/**
 * Return all users
 *
 * Returns copies of the users and not the originals
 * to prevent modifying them outside of this module.
 *
 * @returns {Array<object>} all users
 */
const getAllUsers = () => {
  
  // TODO: 8.3 Retrieve all users
  //27.10 Done - JR 
  
  const copiedUsers = [];
  data.users.forEach((user, index) => {
    //Each one of the users needs to be copied separately
    copiedUsers.push({...user});
  });
  return copiedUsers;
  // throw new Error('Not Implemented');
};

/**
 * Save new user
 *
 * Saves user only in memory until node process exits (no data persistence)
 * Save a copy and return a (different) copy of the created user
 * to prevent modifying the user outside this module.
 *
 * DO NOT MODIFY OR OVERWRITE users.json
 *
 * @param {object} user the user object to be saved
 * @returns {object} copy of the created user
 */
const saveNewUser = user => {
  // TODO: 8.3 Save new user
  // 27.10. Done - JR

  // Use generateId() to assign a unique id to the newly created user. Add "_id" to the saved user
  user._id = generateId();
  //Should set role to customer (Automatically right now, because that is apparently what it's supposed to do?)
  // user.role = user.role? user.role : "customer";
  user.role = "customer";
  //Should save copy of the user and not the original
  data.users.push({...user});
  //Should return copy of the user created. 
  return {...user};

};

/**
 * Update user's role
 *
 * Updates user's role or throws an error if role is unknown (not "customer" or "admin")
 *
 * Returns a copy of the user and not the original
 * to prevent modifying the user outside of this module.
 *
 * @param {string} userId the id of the user to be updated
 * @param {string} role "customer" or "admin"
 * @returns {object|undefined} copy of the updated user or undefined if user does not exist
 * @throws {Error} error object with message "Unknown role"
 */
const updateUserRole = (userId, role) => {
  let userCopy;
  if(role === "customer" || role=== "admin") {
    data.users.forEach(user => {
      if(user._id === userId) {
        user.role = role;
        userCopy = {...user};
      }
    });
  }
  else {
    throw new Error('Unknown role');
  }
  return userCopy;
  // throw new Error('Not Implemented');
};

/**
 * Validate user object (Very simple and minimal validation)
 *
 * This function can be used to validate that user has all required
 * fields before saving it.
 *
 * @param {object} user user object to be validated
 * @returns {Array<string>} Array of error messages or empty array if user is valid
 */
const validateUser = user => {
  //Done: 29.10 JR
  const arrayOfErrors = [];
  //return missing email when email is missing
  if(!user.email){
    arrayOfErrors.push("Missing email");
  }
  //Return missing password when password is missing
  if(!user.password) {
    arrayOfErrors.push("Missing password");
  }
  //return Missing name when name is missing 
  if(!user.name) {
    arrayOfErrors.push("Missing name");
  }
  //allow user with missing role, with role admin and customer. 
  if(user.role && !(user.role === "admin" || user.role === "customer")) {
    arrayOfErrors.push("Unknown role");
  }

  return arrayOfErrors;
  
  // throw new Error('Not Implemented');
};

module.exports = {
  deleteUserById,
  emailInUse,
  getAllUsers,
  getUser,
  getUserById,
  resetUsers,
  saveNewUser,
  updateUserRole,
  validateUser
};
