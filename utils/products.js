
//JL: get the product data from the json file (added for excersise 9)
const data = {
    products: require('../products.json').map(product => ({ ...product }))
  };


  
/**
 * JL: Return all products (added for excersise 9)
 *
 * Returns copies of the product data.
 *
 * @returns {Array<object>} all products
 */
const getAllProducts = () => {
  
    const copiedproducts = [];
    data.products.forEach((product, index) => {
      //Each one of the users needs to be copied separately
      copiedproducts.push({...product});
    });
    return copiedproducts;
    // throw new Error('Not Implemented');
  };


  module.exports ={
    getAllProducts
  };