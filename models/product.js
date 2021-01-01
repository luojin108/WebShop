const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  //JR: Define schematypes for paths: name, price, image and description. 
  name: {
    type: String, 
    required: true, 
  }, 
  price: {
    type: Number, 
    required: true,
    validate: [AllowUnsignedValue, "Price must be a positive value!"],
  },
  image: {
    type: String, 
    required: false, 
  },
  description: {
    type: String,
    required: false,
  }
});
/**
 * Checks that path price is positive. 
 * 
 * @param {number} val the value of 
 * @returns {boolean} true if it's positive.  
 */
function AllowUnsignedValue(val) {
  return val >= 0;
}

// Omit the version key when serialized to JSON
productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;