/*
*
*   Primary file for the api
*
*
*/

//dependancies

const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// the server should reapond to all th reqyest with a string
// Instantiating the HTTP server
let httpServer = http.createServer((req,res) => {

  unifiedserver(req, res);

});

// Start the server
httpServer.listen(config.httpport, () => {
  console.log("the server is listing on the port "+config.httpport+" in "+config.envName+" mode");
});



// Instantiating the HTTP server
const httpsServerOptions = {
  key: fs .readFileSync('./https/key.pem'),
  cert: fs .readFileSync('./https/cert.pem'),
};

let httpsServer = https.createServer(httpsServerOptions,(req,res) => {

  unifiedserver(req, res);

});



// Start the server
httpsServer.listen(config.httspport, () => {
  console.log("the server is listing on the port "+config.httpsport+" in "+config.envName+" mode");
});




// All the server logic for both http ansd https servers
const unifiedserver = (req, res) => {

  // Get the url and parse interval
  let parsedurl = url.parse(req.url,true);

  // Get path
  let path = parsedurl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an obj

  let queryStringObject = parsedurl.query;


  // Get the http method
  let method = req.method.toLowerCase( );

  // Get the hearders as an oblect
  let headers = req.headers;

  // Get the payload if any
  let decoder = new stringDecoder('utf-8');
  let buffer  = '';

  req.on('data', function(data){
    buffer += decoder.write(data);
  });

  req.on('end', function(){
    buffer += decoder.end();

    console.log(buffer);

    // Choose the randle this req should go to if one not found use not notfound
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined'? router[trimmedPath] : handlers.notfound;

    // Construct the data object to send to an handlers
    let data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : helpers.parseJsonToObject(buffer),
      };
      console.log(headers);

      console.log(data.payload, data.method);

    //route the req to the handler specified in the router
    chosenHandler(data, (statusCode = 200, payLoad = {}) => {

      // convert payload to a string
      let payloadString = JSON.stringify(payLoad);

      // Return the redponse
      res.setHeader('Content-Type', 'application/json' )
      res.writeHead(statusCode);
      res.end(payloadString);

      //log the request
      console.log('Returning this response: ', statusCode, payloadString);


    });




  });





};




// Defining a request router

const router = {
  'ping': handlers.ping,
  'users': handlers.users,
  'sample': handlers.sample,
  'tokens': handlers.tokens,
  'checks': handlers.checks
};

// Start the server, and have it listen on port 3000
