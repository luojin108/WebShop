const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * itemSchema for the subDocument of orders.
 */
const itemSchema = new Schema ({
  product: {
    _id: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true, validate: [allowUnsignedValue, "Price must be a positive value!"]},
    description: {type: String, required: true},
  },
  quantity: {type: Number, required: true, validate: [allowMinimumOne, "Quantity must be a positive value!"]},
});

/**
 * Orderschema for orders. 
 */
const orderSchema = new Schema ({
  items: {
    type: [itemSchema],
    required: true,
    validate: [allowMinimumOneLength, "Not enough items!"]
  },
  customerId: {
    type: String, 
    required: true, 
  },
});

/**
 * Checks required size of items path. 
 * 
 * @param {Array} val items array
 * @returns {boolean} true if val.length is 1 or more.  
 */
function allowMinimumOneLength(val) {
  return val.length >= 1;
}

/**
 * Checks required size of quantity path. 
 * 
 * @param {number} val quantity
 * @returns {boolean} true if val is 1 or more.  
 */
function allowMinimumOne(val) {
  return val >= 1;
}

/**
 * Checks required size of price path. 
 * 
 * @param {number} val price
 * @returns {boolean} true if val is not less than 0
 */
function allowUnsignedValue(val) {
  return val >= 0;
}

// Omit the version key when serialized to JSON
orderSchema.set('toJSON', { virtuals: false, versionKey: false });

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;