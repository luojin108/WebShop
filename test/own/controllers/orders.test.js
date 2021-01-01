const chai = require('chai');
const { ObjectId } = require('mongodb');
const expect = chai.expect;
const { createResponse } = require('node-mocks-http');
const { getAllOrders, getSpecificOrder, createNewOrder } = require('../../../controllers/orders');
const Order = require('../../../models/order');

const testOrder = () => {
  return{
    "items" : 
    [
      {
      "product" : {
        "_id" : "5fc18ba7e90e9e19c87cc882",
        "name" : "Fantastic Cotton Chair",
        "price" : 102,
        "description" : "The Football Is Good For Training And Recreational Purposes"
       },
      "quantity" : 4
      }
    ],
  "customerId" : "5fc18bdb01e1bd4970f23482"
  }
}

// Get orders (create copies for test isolation)
const originalOrders = require('../../../setup/orders.json').map(order => ({ ...order }));

describe('Orders Controller', () => {
  let orders;
  let foundOrders;
  let response;

  beforeEach(async () => {
    // reset database
    await Order.deleteMany({});
    await Order.create(originalOrders);
    foundOrders = await Order.find({});
    orders = foundOrders.map(order => JSON.parse(JSON.stringify(order)));
    response = createResponse();
  });
  describe('getAllOrders()', () => {
    it('should respond with array of JSON when current users role is admin', async () => {
      const currentUser = {};
      currentUser.role = "admin";
      await getAllOrders(response, currentUser);

      expect(response.statusCode).to.equal(200);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
      expect(response._isEndCalled()).to.be.true;
      expect(response._getJSONData()).to.be.an('array');
      expect(response._getJSONData()).to.be.deep.equal(orders);
    });
    it('should respond with JSON when current users role is customer', async () => {
      const currentUser = {};
      currentUser.role = "customer";
      currentUser._id = foundOrders[0].customerId;
      await getAllOrders(response, currentUser);

      expect(response.statusCode).to.equal(200);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
      expect(response._isEndCalled()).to.be.true;
    });
  });

  describe('getSpecificOrder()', () => {
    it('should respond with "404 not found" when order by that id does not exist', async () => {
      //When creating a fake ID, we need to cast it into an objectId. strings that have 12 characters can be cast as ObjectId.
      const orderId = ObjectId("000000000000");
      await getSpecificOrder(response, orderId);
      expect(response.statusCode).to.equal(404);
      expect(response._isEndCalled()).to.be.true;
    });
    it('should respond with "404 not found" when Id is valid but not the users and they are customer', async () => {
      const orderId = foundOrders[0]._id;
      const currentUser = {"role": "customer"};
      await getSpecificOrder(response, orderId, currentUser);

      expect(response.statusCode).to.equal(404);
      expect(response._isEndCalled()).to.be.true;
    });
    it('should respond with "200 OK success" and JSON when order Id valid and admin role', async () => {
      const orderId = foundOrders[0]._id;
      const currentUser = {"role": "admin"};
      await getSpecificOrder(response, orderId, currentUser);

      expect(response.statusCode).to.equal(200);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
    });
    it('should respond with "200 OK success" and JSON when order Id valid matches user when customer', async () => {
      const orderId = foundOrders[0]._id;
      const currentUser = {};
      currentUser.role = "customer";
      currentUser._id = foundOrders[0].customerId;
      await getSpecificOrder(response, orderId, currentUser);

      expect(response.statusCode).to.equal(200);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
    });
  });

  describe('createNewOrder()', () => {
    it('should respond with "400 Bad Request" if items product _id is missing', async () => {
      const orderData = testOrder();
      
      delete orderData.items[0].product._id;
      await createNewOrder(response, orderData);

      expect(response.statusCode).to.equal(400);
    });
    it('should respond with "400 Bad Request" if items product name is missing', async () => {
      const orderData = testOrder();
      
      delete orderData.items[0].product.name;
      await createNewOrder(response, orderData);

      expect(response.statusCode).to.equal(400);
    });
    it('should respond with "400 Bad Request" if items product price is missing', async () => {
      const orderData = testOrder();
      
      delete orderData.items[0].product.price;
      await createNewOrder(response, orderData);

      expect(response.statusCode).to.equal(400);
    });
    it('should respond with "400 Bad Request" if items product description is missing', async () => {
      const orderData = testOrder();
      
      delete orderData.items[0].product.description;
      await createNewOrder(response, orderData);

      expect(response.statusCode).to.equal(400);
    });
    it('should respond with "400 Bad Request" if items quantity is missing', async () => {
      const orderData = testOrder();
      
      delete orderData.items[0].quantity;
      await createNewOrder(response, orderData);

      expect(response.statusCode).to.equal(400);
    });
    it('should respond with "400 Bad Request" if customerId is missing', async () => {
      const orderData = testOrder();
      
      delete orderData.customerId;
      await createNewOrder(response, orderData);

      expect(response.statusCode).to.equal(400);
    });
    it('should respond with "201 created" and JSON when creating a new order is succesfull', async () => {
      const orderData = testOrder();
      await createNewOrder(response, orderData);

      expect(response.statusCode).to.equal(201);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
      expect(response._isEndCalled()).to.be.true;
    });
  });
});
