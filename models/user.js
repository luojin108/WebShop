const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const salt = bcrypt.genSaltSync();

/**
 * JR: Setter function that encrypts the given string (password) using bcryptjs. 
 * 
 * @param {string} password the password to be encrypted
 * @returns {string} hash that is the encrypted version of the given string. 
 */
const encrypt = (password) => {
  
  if(password.length < 10) return false;
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const userSchema = new Schema({
  //DONE: 9.4 Implemented
  //JR: Define schematypes for paths: name, email, password, etc. 
  name: {
    type: String, 
    required: true, 
    trim: " ", //Trim spaces from "name"
    minlength: 1, //No empty names
    maxlength: 50}, //No names longer than 50
  password: {
    type: String, 
    required: true,
    minlength: 10,
    set: encrypt //encrypt the password before db
  },
  email: {
    type: String, 
    required: true, 
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  role: {
    type: String, 
    trim: " ",
    lowercase: true,
    enum: ["customer", "admin"], //Has to be one of these
    default: "customer" //If no role gets passed, it's a customer
  }
});



/**
 * JR: Compare supplied password (after being hashed) with user's own (pre-hashed) password
 *
 * @param {string} password the password that will be compared to valilate the user
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function (password) {
  //Gets the old hash of the password
  const oldHash = await this.password;
  //JL: the check is done by the bcrypt compare function
  const result=bcrypt.compareSync(password, oldHash);
  return result;
};

// Omit the version key when serialized to JSON
userSchema.set('toJSON', { virtuals: false, versionKey: false });

const User = new mongoose.model('User', userSchema);
module.exports = User;