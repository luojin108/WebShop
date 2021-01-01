const path = require('path');
const dotEnvPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: dotEnvPath });

const { connectDB, disconnectDB } = require('../models/db');
const User = require('../models/user');

const users = require('./users.json').map(user => ({ ...user }));
const products = require('./products.json').map(product => ({ ...product }));

(async () => {
  connectDB();

  try {
    const Order = require('../models/order');
    await Order.deleteMany({});
    console.log('Cleared orders');
  } catch (error) {
    //Insert error statement here
    console.log(error);
  }

  try {
    const Product = require('../models/product');
    await Product.deleteMany({});
    await Product.create(products);
    console.log('Created products');
  } catch (error) {
    //Insert error statement here
    console.log(error);
  }

  try {
    await User.deleteMany({});
    await User.create(users);
    console.log('Created users');
  } catch (error) {
    console.log(error);
  }

  

  disconnectDB();
})();
