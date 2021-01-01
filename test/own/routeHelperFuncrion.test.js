const requestUtils= require('../../utils/requestUtils');
const chai = require('chai');
const expect = chai.expect;
const { createResponse, createRequest } = require('node-mocks-http');
const {routeToAllUsers, routeToUserOperations, routeToUserRegister } = require('../../controllers/users');
const {routeToProductPage} = require('../../controllers/products');

const User = require('../../models/user');

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));
const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };

// helper function for authorization headers
const encodeCredentials = (username, password) =>
  Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

const adminCredentials = encodeCredentials(adminUser.email, adminUser.password);
const customerCredentials = encodeCredentials(customerUser.email, customerUser.password);



describe('route helper', () => {
  let currentUser;
  let customer;
  let response;

  const getAdminHeaders = () => {
    return {
      authorization: `Basic ${adminCredentials}`,
      accept:
        'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'content-type': 'application/json'
    };
  };
  const getCustomerHeaders = () => {
    return {
      authorization: `Basic ${customerCredentials}`,
      accept:
        'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'content-type': 'application/json'
    };
  };


  beforeEach(async () => {
    // reset database
    await User.deleteMany({});
    await User.create(users);

    // set variables
    currentUser = await User.findOne({ email: adminUser.email }).exec();
    customer = await User.findOne({ email: customerUser.email }).exec();
    response = createResponse();
    
  });
  
  describe('routeToUserOperations()', () => {
    
    it('should respond with basicAuthChallenge () if Authorization header is missing', async () => {
      const filePath = "/api/users/5fad44f4b874e26b6888e688";
      const headers = getAdminHeaders();
      delete headers.authorization;
      await routeToUserOperations(createRequest({ headers }), response, currentUser, filePath, "GET");
      expect(response.statusCode).to.equal(401);
      
     
    });
    it('should respond with forbidden () if user role is customer', async () => {
      const filePath = "/api/users/5fad44f4b874e26b6888e688";
      const headers = getCustomerHeaders();
      await routeToUserOperations(createRequest({ headers }), response, customer, filePath, "GET");
      expect(response.statusCode).to.equal(403);
     
    });
    it('should delete the user', async () => {
      const filePath = `/api/users/${customer.id}`;
      const headers = getAdminHeaders();
      await routeToUserOperations(createRequest({ headers }), response, currentUser, filePath, "DELETE");
      const foundUser = await User.findById(customer.id).exec();
      expect(response.statusCode).to.equal(200);
      expect(foundUser).to.be.null;
    });

    it('should view the user', async () => {
      const filePath = `/api/users/${customer.id}`;
      const headers = getAdminHeaders();
      await routeToUserOperations(createRequest({ headers }), response, currentUser, filePath, "GET");
      const userData = JSON.parse(JSON.stringify(customer));
      expect(response.statusCode).to.equal(200);
      expect(response._getJSONData()).to.be.deep.equal(userData);
    });
  });

  describe('routeToUserRegister()', () => {
    it('should respond with badRequest () if not a JSON request', async () => {
      const filePath = "/api/users/5fad44f4b874e26b6888e688";
      const headers = getAdminHeaders();
      headers["content-type"] = "";
      await routeToUserRegister(createRequest({ headers }), response);
      expect(response.statusCode).to.equal(400);

    });
  });
  
  
  describe('routeToAllUsers()', () => {
    it('should return all users if the user has a role of "admin"', async () => {
     
      await routeToAllUsers( response, currentUser);
      const usersData = JSON.parse(JSON.stringify(users));
      expect(response.statusCode).to.equal(200);
      expect(response._getJSONData().length).to.equal(10);
     
    });
    it('If the user has a role of customer, return response with status code "403 Forbidden"', async () => {
      await routeToAllUsers( response, customer);
      expect(response.statusCode).to.equal(403);
     
    });
  });
  
  
  describe('routeToProductPage()', () => {
    it('should  respond "401 Unauthorized" when Authorization header is missing', async () => {
      const filePath = "/api/products";
      const headers = getCustomerHeaders();
      delete headers.authorization;

      await routeToProductPage(createRequest({ headers }), response, customer);
      expect(response.statusCode).to.equal(401);
     
    });
    it('should return all products if customer credentials are received', async () => {
      const filePath = "/api/products";
      const headers = getCustomerHeaders();
      await routeToProductPage(createRequest({ headers }), response, customer);
      expect(response.statusCode).to.equal(200);
     
    });
    it('should return all products if admin credentials are received', async () => {
      const filePath = "/api/products";
      const headers = getAdminHeaders();
      await routeToProductPage(createRequest({ headers }), response, currentUser);
      expect(response.statusCode).to.equal(200);
    });
  });

});
