const responseUtils = require('../utils/responseUtils');
// const products = require('../utils/products');
const products = require('../models/product');
const requestUtils= require('../utils/requestUtils');

/**
 * JR: Get products from the database and return it as JSON with the 
 * HTTP response. 
 *
 * @param {http.ServerResponse} response reponse to be sent to the user
 */
const getAllProducts = async response => {
  await responseUtils.sendJson(response, await products.find({}));
};
/**
 * Get info of a specific product
 * @param {http.ServerResponse} response response to be sent to hte user
 * @param {string} productId the id of the product that will be present
 */
const getSpecificProduct = async (response, productId) => {
  const chosenProduct = await products.findById(productId);
  if(!chosenProduct) await responseUtils.notFound(response);
  // console.log(chosenProduct);
  else await responseUtils.sendJson(response, chosenProduct);
};
/**
 * Update the info of a specific product
 * @param {http.ServerResponse} response response to be sent to hte user
 * @param {string} productId The id of the product that will be updated
 * @param {object} productData The updated info of product 
 */
const updateProduct = async (response, productId, productData) => {
  const chosenProduct = await products.findById(productId).exec();
  if(!chosenProduct) return responseUtils.notFound(response);
  const {name, price, image, description} = productData;
  if(typeof name !== "undefined"){
    if(name === ""){
      return responseUtils.badRequest(response, productData);
    }
    chosenProduct.name = name;
  }
  if(typeof price !== "undefined"){
    if(price <= 0 || isNaN(price)){
      return responseUtils.badRequest(response, productData);
    }
    chosenProduct.price = price;
  }
  if(typeof image !== "undefined" ){
    chosenProduct.image = image;
  }
  if(typeof description !== "undefined"){
    chosenProduct.description = description;
  }
  await chosenProduct.save();
  const updatedProduct = await products.findById(productId).exec();
  const productToBeSent = updatedProduct.toObject();
  delete productToBeSent["__v"];
  return await responseUtils.sendJson(response, productToBeSent);
};
/**
 * Delete a specific product from the database
 * @param {http.ServerResponse} response response to be sent to hte user
 * @param {ObjectId} productId the id of the product that will be deleted
 */
const deleteProduct = async (response, productId) => {
  const foundProduct = await products.findById(productId);
  if(!foundProduct) return responseUtils.notFound(response);
  else {
    await products.deleteOne({_id: productId});
    // delete foundUser["__v"];
    return responseUtils.sendJson(response, foundProduct);
  }
};
/**
 * Delete a specific product from the database
 * @param {http.ServerResponse} response response to be sent to hte user
 * @param {object} productData the info of the product that will be created
 */
const createNewProduct = async (response, productData) => {
  if(!(productData.name) || !(productData.price)){
    return responseUtils.badRequest(response, "Bad Request");
  }
  const newProduct = new products(productData);
  await newProduct.save();
  const foundNewProduct = await products.findById(newProduct._id);
  const productToBeSent = foundNewProduct;
  delete productToBeSent["__v"];
  //Then, respond with 201 when adding is succesfull
  return responseUtils.createdResource(response, productToBeSent);
};
/**
 * JR: Receives signal from router.js to handle product-page request. If authorized
 * and user role is either customer or admin, proceed to retrieve products using
 * another helper function. 
 * 
 * @param {http.request} request request from the user
 * @param {http.ServerResponse} response response to be sent to the user
 * @param {object} currentUser the object of the current user
 */
const routeToProductPage =async (request, response, currentUser, method) => {
  //JL: Handling if the authorization header is missing
  if(!('authorization' in request.headers) ){
      responseUtils.basicAuthChallenge(response);
  }
  if(method === "GET" && (currentUser.role === 'customer' || currentUser.role === 'admin')){
    //JL: Handling if customer/admin credentials are received.
    getAllProducts(response);
  }
  if(method === "POST"){
    if(currentUser.role === 'customer'){
      await responseUtils.forbidden(response);
    }
    else if (!requestUtils.isJson(request)) {
      await responseUtils.badRequest(response, 'Invalid Content-Type. Expected application/json');
    }
    else {
      const productData = await requestUtils.parseBodyJson(request);
      await createNewProduct(response, productData);
    }
  }
      
};

/**
 * Operation towards a specific product, such as view, modification and deletion
 * @param {http.request} request request from the user
 * @param {http.ServerResponse} response response to be sent to the user
 * @param {object} currentUser the object of the current user
 * @param {string} filePath the url to pointing to the specific user
 * @param {string} method the method the current user wants to implement 
 */
const routeToSpecificProduct = async (request, response, currentUser, filePath, method) => {
  if(!('authorization' in request.headers) || !currentUser){
    return responseUtils.basicAuthChallenge(response);
  }
  const productId = filePath.split("/").pop();
  if (!requestUtils.acceptsJson(request)) {
      return responseUtils.contentTypeNotAcceptable(response);
  }
  if(method === "GET" &&(currentUser.role === 'customer' || currentUser.role === 'admin')){
    return getSpecificProduct(response, productId);
  }
  //Put and Delete require admin priviledges 
  if(currentUser.role === 'admin'){
    if(method === "PUT") {
      const productData = await requestUtils.parseBodyJson(request);
      return updateProduct(response, productId, productData);
    }
    else if (method === "DELETE") return deleteProduct(response, productId);
  }
  else responseUtils.forbidden(response);
};

module.exports = { getAllProducts, getSpecificProduct, deleteProduct, updateProduct, createNewProduct, routeToProductPage, routeToSpecificProduct };
