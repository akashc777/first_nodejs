/*
*
* Server-related tasks
*
*/

//dependancies

const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');

// Instantiate the server module object
let server = {};

// @// TODO: Get rid of this
helpers.sendTwilioSms('8123293449', 'Hola amigo', (err) => {
  console.log('This was the error', err);
});

// the server should reapond to all th reqyest with a string
// Instantiating the HTTP server
server.httpServer = http.createServer((req,res) => {

  server.unifiedserver(req, res);

});





// Instantiating the HTTP server
server.httpsServerOptions = {
  key: fs .readFileSync(path.join(__dirname, '/../https/key.pem')),
  cert: fs .readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

server.httpsServer = https.createServer(server.httpsServerOptions,(req,res) => {

  server.unifiedserver(req, res);

});


// All the server logic for both http ansd https servers
server.unifiedserver = (req, res) => {

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
    let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined'? server. router[trimmedPath] : handlers.notfound;

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

server.router = {
  'ping': handlers.ping,
  'users': handlers.users,
  'sample': handlers.sample,
  'tokens': handlers.tokens,
  'checks': handlers.checks
};

// Init script
server.init = () => {
  // Start the HTTP server
  // Start the server
  server.httpServer.listen(1080,'172.31.85.108 ' ,() => {
    console.log("the server is listing on the port "+config.httpport+" in "+config.envName+" mode");
  });

  // Start the HTTPS server
  // Start the server
  server.httpsServer.listen(1443,'172.31.85.108' ,() => {
    console.log("the server is listing on the port "+config.httpsport+" in "+config.envName+" mode");
  });

};



// Export the module
module.exports = server;


// Start the server, and have it listen on port 3000
