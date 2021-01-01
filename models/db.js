// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');

//JR: Default URL
const defaultDBURL= 'mongodb://localhost:27017/WebShopDb';

//JR: Read variables from environment using dotenv-library
const path = require('path');
const dotEnvPath = path.resolve(__dirname, '../.env');
require('dotenv').config({ path: dotEnvPath });

// console.log(process.env.DBURL);

const mongoose = require('mongoose');

/**
 * Get database connect URL.
 *
 * Reads URL from DBURL environment variable or
 * returns default URL if variable is not defined
 *
 * @returns {string} connection URL
 */
const getDbUrl = () => {
  // TODO: 9.3 Implement this
  //JR: Read DBURL from environment variable (.env)
  return process.env.DBURL ? process.env.DBURL: defaultDBURL;
  
  //throw new Error('Implement this');
};

function connectDB () {
  // Do nothing if already connected
  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    mongoose
      .connect(getDbUrl(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true
      })
      .then(() => {
        mongoose.connection.on('error', err => {
          console.error(err);
        });

        mongoose.connection.on('reconnectFailed', handleCriticalError);
      })
      .catch(handleCriticalError);
  }
}

function handleCriticalError (err) {
  console.error(err);
  throw err;
}

function disconnectDB () {
  mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB, getDbUrl };
