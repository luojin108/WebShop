// const fileName = "orders.js";
let functionName = "";

const responseUtils = require('../utils/responseUtils');
const requestUtils= require('../utils/requestUtils');
// const products = require('../utils/products');
const Order = require('../models/order');
const { acceptsJson } = require('../utils/requestUtils');
/**
 * Send all orders as JSON
 *
 * @param {http.ServerResponse} response response to be sent to the order containing all order info
 */
const getAllOrders = async (response, currentUser) => {
  //For admins, return a collection of all orders in the system
  if(currentUser.role === "admin") {
    return responseUtils.sendJson(response, await Order.find({}));
  }
  //For customers, return ONLY their orders. 
  else {
    return responseUtils.sendJson(response, await Order.find({"customerId": currentUser._id}));
  }
};


/**
 * Register new order and send created order back as JSON
 *
 * @param {http.ServerResponse} response response to the order
 * @param {object} orderData JSON data 
 */
const createNewOrder = async (response, orderData) => {
  functionName = "createNewOrder";

  // console.log(`(${fileName}) ${functionName}: Create a new document using the order schema`);
  const newOrder = new Order(orderData);
  const error = newOrder.validateSync();
  if(error) {
    await responseUtils.badRequest(response, "Bad Request");
  }
  else {
    // console.log(`(${fileName}) ${functionName}: Saving the new document to its collection in the mongoDB database`);
    await newOrder.save();
    
    // console.log(`(${fileName}) ${functionName}: Next ensure it's saved to the database:`); 
    const foundNewOrder = await Order.findById(newOrder._id);

    // console.log(`(${fileName}) ${functionName}: Then, respond with 201 when registration is succesfull`); 
    return responseUtils.createdResource(response, foundNewOrder);
  }
};
/**
 * Get information about a single order. For admins return the order in the system. For a customer return the order if it is their OWN order.
 * 
 * @param {http.ServerResponse} response the response to be sent to the order
 * @param {string} OrderId the id of the order that the current order is targetting at
 */
const getSpecificOrder = async (response, orderId, currentUser) => {
  const chosenOrder = await Order.findById(orderId);
  //If no order by that Id was found: 
  if(!chosenOrder) await responseUtils.notFound(response);
  //If found, but the customer wasn't the same as in the order: 
  else if (JSON.stringify(currentUser._id) !== JSON.stringify(chosenOrder.customerId) && currentUser.role !== "admin") {
    await responseUtils.notFound(response);
  }
  //Otherwise correct order found, responding: 
  else {
    return await responseUtils.sendJson(response, chosenOrder);
  }
}; 

/**
 * Controls POST traffic of /api/orders. 
 * 
 * @param {http.request} request request from the order
 * @param {http.ServerResponse} response response to be sent to the order
 * @param {object} currentUser the object of the current order
 */
const routeToPostOrder = async (request, response, currentUser) => {
  functionName = "routeControlToPostOrder";

  // console.log(`(${fileName}) ${functionName}: Fail if not a JSON request.`);
  if (!requestUtils.isJson(request)) {
    await responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
  }
  //403 forbidden when admin credentials are received
  else if(currentUser.role === "admin") {
    await responseUtils.forbidden(response);
  }
  else {
    const orderData = await requestUtils.parseBodyJson(request);
    orderData.customerId = currentUser._id;
    await createNewOrder(response, orderData);
  }
};

/**
 * Currently Controls GET traffic to orders. If valid order request and role admin or customer, 
 * gets redirected to getSpeficOrder or getAllOrders depending on whether orders Id is given.  
 * 
 * @param {http} request request from the order
 * @param {http} response response to be sent to the order
 * @param {object} currentUser the object of the current order
 * @param {string} filePath the url pointing to the order
 * @param {string} method the operation the order is implementing
 */
const routeToGetOrders = async (request, response, currentUser, filePath, method) => {
  if(!('authorization' in request.headers) || !currentUser){
    await responseUtils.basicAuthChallenge(response);
  }
  // JR: If there is no accept or client does not accept JSON, return 406. 
  else if (!acceptsJson(request)) {
    await responseUtils.contentTypeNotAcceptable(response);
  }
  else {
    if(method ==="GET" && (currentUser.role === 'customer' || currentUser.role === 'admin')) {
      //Get the last part of filepath (seperated by "/")
      const orderId = filePath.split("/").pop();
      if(orderId !== "orders") {
        await getSpecificOrder(response, orderId, currentUser);
      }
      else {
        await getAllOrders(response, currentUser);
      }
    }

  }
};


module.exports = { createNewOrder, getAllOrders, getSpecificOrder, routeToPostOrder, routeToGetOrders };