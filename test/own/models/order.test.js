const chai = require('chai');
const expect = chai.expect;

const Order = require('../../../models/order');

// helper function for creating randomized test data
const generateRandomString = (len = 9) => {
  let str = '';

  do {
    str += Math.random().toString(36).substr(2, 9).trim();
  } while (str.length < len);

  return str.substr(0, len);
};

// get randomized test data
const getItemTestData = () => {
  return {
    product: {
      _id: generateRandomString(),
      name: generateRandomString(),
      price: Math.random(),
      description: generateRandomString(),
    },
    quantity: Math.random(),
  };
};


// get randomized test data
const getTestData = () => {
  return {
    items: [getItemTestData()],
    customerId: generateRandomString(),
  };
};

describe('Order Model', () => {
  describe('Schema validation', () => {
    it('must define "productId"', () => {
      const orderData = getTestData();
      delete orderData.items[0].product["_id"];

      const item = new Order(orderData)
      const error = item.validateSync();
      expect(error).to.exist;
    });
    it('must define "name"', () => {
      const orderData = getTestData();
      delete orderData.items[0].product["name"];

      const item = new Order(orderData)
      const error = item.validateSync();
      expect(error).to.exist;
    });
    it('must define "price"', () => {
      const orderData = getTestData();
      delete orderData.items[0].product["price"];

      const item = new Order(orderData)
      const error = item.validateSync();
      expect(error).to.exist;
    });
    it('must define "description"', () => {
      const orderData = getTestData();
      delete orderData.items[0].product["description"];

      const order = new Order(orderData);
      const error = order.validateSync();
      expect(error).to.exist;
    });
    it('must define "quantity"', () => {
      const orderData = getTestData();
      delete orderData.items[0].quantity;

      const order = new Order(orderData);
      const error = order.validateSync();
      expect(error).to.exist;
    });
    it('must define "customerId"', () => {
      const orderData = getTestData();
      delete orderData.customerId;

      const order = new Order(orderData);
      const error = order.validateSync();
      expect(error).to.exist;
    });
    it('Items "quantity" must be convertible to number', () => {
      const orderData = getTestData();
      orderData.items[0].quantity = "String";

      const item = new Order(orderData)
      const error = item.validateSync();
      expect(error).to.exist;
    });
    it('Items "price" must be convertible to number', () => {
      const orderData = getTestData();
      orderData.items[0].product["price"] = "String";

      const item = new Order(orderData)
      const error = item.validateSync();
      expect(error).to.exist;
    });
    it('must not allow product quantity to be less than 1', () => {
      const orderData = getTestData();
      orderData.items[0].quantity = 0;

      const order = new Order(orderData);
      const error = order.validateSync();
      expect(error).to.exist;
    });
    it('must not allow product price to be less than 0', () => {
      const orderData = getTestData();
      orderData.items[0].product.price = -1;

      const order = new Order(orderData);
      const error = order.validateSync();
      expect(error).to.exist;
    });
    it('must not allow items-array lenght to be 0', () => {
      const orderData = getTestData();
      orderData.items = [];

      const order = new Order(orderData);
      const error = order.validateSync();
      expect(error).to.exist;
    });
  });
});