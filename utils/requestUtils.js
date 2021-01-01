/**
 * Decode, parse and return user credentials (username and password)
 * from the Authorization header.
 *
 * @param {http.incomingMessage} request requet from the user
 * @returns {Array|null} [username, password] or null if header is missing
 */
const getCredentials = request => {
  // Done: Parse user credentials from the "Authorization" request header
  // NOTE: The header is base64 encoded as required by the http standard.
  //       You need to first decode the header back to its original form ("email:password").
  //  See: https://attacomsian.com/blog/nodejs-base64-encode-decode
  //       https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/

  if("authorization" in request.headers){
    //Get the value of the "Authorization" request header
    const authContent = request.headers.authorization;
    //Get the type of the "Authorization"
    const authType = authContent.split(" ")[0];
    if (authType === 'Basic'){
      //Get the encoded "email:password"
      const userCredentials = authContent.split(" ")[1];
      //Decode the encoded "email:password"
      const buff = Buffer.from(userCredentials, 'base64');
      const str = buff.toString('utf-8');
      const decodedUserCredentials = str.split(":");
      return decodedUserCredentials;
    }else{
      return null;
    }
  }else{
    return null;
  }
};

/**
 * Does the client accept JSON responses?
 *
 * @param {http.incomingMessage} request requet from the user
 * @returns {boolean} boolean judging whether the client accept JSON responses
 */
const acceptsJson = request => {
  // DONE: JR: Check if the client accepts JSON as a response based on "Accept" request header
  // NOTE: "Accept" header format allows several comma separated values simultaneously
  // as in "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,*/*;q=0.8"
  // Do not rely on the header value containing only single content type!

  //JR: First, get the list of content that is accepted from headers
  const accept = request.headers.accept; 

  //JR: If no list of accepted content exists (ie accept undefined), then we return false here. 
  if(!accept) return false;

  //JR: Now, we'll separate accept to an array by a comma here
  const arrayOfAccepted = accept.split(",");

  let accepts = false; 

  //JR: Go through the array to see if application/json or */* is there.
  if(arrayOfAccepted.some(element => element === "application/json" || element.startsWith("*/*")
  )){
    accepts = true;
  }
  return accepts;
};

/**
 * Is the client request content type JSON?
 *
 * @param {http.incomingMessage} request request from the user
 * @returns {boolean} boolean judging whether the client request content type is JSON
 */
const isJson = request => {
  // DONE: JR: 8.3 Check whether request "Content-Type" is JSON or not

  //JR: First, get the content-types of the request. 
  const requestedContentType = request.headers["content-type"];
  
  //JR: returns true ONLY when content-type is application/json, otherwise false
  return requestedContentType === "application/json" ? true : false;
};

/**
 * Asynchronously parse request body to JSON
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await parseBodyJson(request);
 *
 *   -- OR --
 *
 *   parseBodyJson(request).then(json => {
 *     // Do something with the json
 *   })
 *
 * @param {http.IncomingMessage} request requet from the user
 * @returns {Promise<*>} Promise resolves to JSON content of the body
 */
const parseBodyJson = request => {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('error', err => reject(err));

    request.on('data', chunk => {
      body += chunk.toString();
    });

    request.on('end', () => {
      resolve(JSON.parse(body));
    });
  });
};

module.exports = { acceptsJson, getCredentials, isJson, parseBodyJson };
