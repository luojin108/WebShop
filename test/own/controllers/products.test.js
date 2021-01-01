const chai = require('chai');
const { ObjectId } = require('mongodb');
const expect = chai.expect;
const { createResponse } = require('node-mocks-http');
const { product } = require('puppeteer');
const { getAllProducts,getSpecificProduct, updateProduct, deleteProduct, createNewProduct } = require('../../../controllers/products');
const Product = require('../../../models/product');

const testProduct = () => {
  return {
    "name": "TestName",
    "price": 666.0,
    "image": "http://placeimg.com/640/480/test",
    "description": "Test description"
  }
}

// Get products (create copies for test isolation)
const originalProducts = require('../../../setup/products.json').map(product => ({ ...product }));

describe('Products Controller', () => {
  let products;
  let foundProducts;
  let response;

  beforeEach(async () => {
    // reset database
    await Product.deleteMany({});
    await Product.create(originalProducts);
    foundProducts = await Product.find({});
    products = foundProducts.map(product => JSON.parse(JSON.stringify(product)));
    response = createResponse();
  });
  describe('getAllProducts()', () => {
    it('should respond with JSON', async () => {
      await getAllProducts(response);

      expect(response.statusCode).to.equal(200);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
      expect(response._isEndCalled()).to.be.true;
      expect(response._getJSONData()).to.be.an('array');
      expect(response._getJSONData()).to.be.deep.equal(products);
    });
  });

  describe('getSpecificProduct()', () => {
    it('should respond with "404 not found" when product by that id does not exist', async () => {
      //When creating a fake ID, we need to cast it into an objectId. strings that have 12 characters can be cast as ObjectId.
      const productId = ObjectId("000000000000");
      await getSpecificProduct(response, productId);
      expect(response.statusCode).to.equal(404);
      expect(response._isEndCalled()).to.be.true;
    });
    it('should respond with JSON', async () => {
      const productId = foundProducts[0]._id;
      await getSpecificProduct(response, productId);

      expect(response.statusCode).to.equal(200);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
    });
  });

  describe('updateProduct()', () => {
    it('should respond with "404 not found" when product does not exist', async () => {
      const productId = ObjectId("000000000000");
      const productData = testProduct();

      await updateProduct(response, productId, productData);

      expect(response.statusCode).to.equal(404);
    });
    it('should respond with "400 Bad request" when name is empty', async () => {
      
      const productId = foundProducts[0]._id;
      const productData = testProduct();
      productData.name ="";
      
      await updateProduct(response, productId, productData);

      expect(response.statusCode).to.equal(400);
    });
    it('should respond with "400 Bad request" when price is less than zero', async () => {
      
      const productId = foundProducts[0]._id;
      const productData = testProduct();
      productData.price = -1;
      
      await updateProduct(response, productId, productData);

      expect(response.statusCode).to.equal(400);
    });
    it('should respond with "200 OK success" and JSON', async () => {
      const productId = foundProducts[0]._id;
      const productData = testProduct();

      await updateProduct(response, productId, productData);

      expect(response.statusCode).to.equal(200);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
      expect(response._isEndCalled()).to.be.true;
    });
  });
  describe('deleteProduct()', () => {
    it('should respond with "404 Not found"', async () => {
      const productId = ObjectId("000000000000");
      await deleteProduct(response, productId);
      expect(response.statusCode).to.equal(404);
    });
    it('should respond with "200 OK success" and JSON', async () => {
      const productId = foundProducts[0]._id;
      await deleteProduct(response, productId);

      expect(response.statusCode).to.equal(200);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
      expect(response._isEndCalled()).to.be.true;
    });
  });
  describe('createNewProduct()', () => {
    it('should respond with "400 Bad request" if either name or price is missing', async () => {
      const productData = testProduct();
      const number = Math.round(Math.random());
      if(number == 0) {
        delete productData.name;
      }
      else {
        delete productData.price;
      }

      await createNewProduct(response, productData);

      expect(response.statusCode).to.equal(400);
    });
    it('should respond with "201 created" and JSON', async () => {
      const productData = testProduct();
      await createNewProduct(response, productData);

      expect(response.statusCode).to.equal(201);
      expect(response.getHeader('content-type')).to.equal('application/json');
      expect(response._isJSON()).to.be.true;
      expect(response._isEndCalled()).to.be.true;
    });
  });
});
