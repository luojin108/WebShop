const chai = require('chai');
const expect = chai.expect;

const Product = require('../../../models/product');

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
  let str = '';

  do {
    str += Math.random().toString(36).substr(2, 9).trim();
  } while (str.length < len);

  return str.substr(0, len);
};


// get randomized test data
const getTestData = () => {
  return {
    name: generateRandomString(),
    price: Math.random(),
    image: generateRandomString(10),
    description: generateRandomString(50)
  };
};

describe('Product Model', () => {
  describe('Schema validation', () => {
    it('must define "name"', () => {
      const data = getTestData();
      delete data.name;

      const product = new Product(data);
      const error = product.validateSync();
      expect(error).to.exist;
    });
    it('must define "price"', () => {
      const data = getTestData();
      delete data.price;

      const product = new Product(data);
      const error = product.validateSync();
      expect(error).to.exist;
    });
    it('must not allow product price to be less than 0', () => {
      const data = getTestData();
      data.price = -1;

      const product = new Product(data);
      const error = product.validateSync();
      expect(error).to.exist;
    });
  });
});