/*
*
*  These are server releated tasks
*
*/

//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const string_decoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');


// Intantiate the server module object
const server = {};





// All the server logic for both http and https
server.unifiedServer = function(req, res) {

  // get the url and parse it
  const parsedUrl = url.parse(req.url, true); //true to get the query string object


  // get the path from the url
  const path = parsedUrl.pathname; // untrimmed path contains slashes before and after
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // get the quesry string as an object
  const queryStringObject = parsedUrl.query;


  // get the http method
  const method = req.method.toLowerCase(); // Default id capital

  // Get the header as an object
  const headers = req.headers

  // get the pay load if any
  const decoder = new string_decoder('utf-8');

  let buffer = '';

  // When data event emits
  req.on('data', function (data) {
    buffer += decoder.write(data);
  });

  // End event always get called
  req.on('end', function () {

    buffer = decoder.end(buffer); // need to know

    //Choose the handler if not found goto not found handler
    let choosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers['notFound'];

    // If the request is within public derictory, use the public handler instead

    choosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : choosenHandler;

    //construct a data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer)
    };

    // Route the req to the handler specifed in the router
    choosenHandler(data, function (statusCode, payload, contentType) {

      // Determine the type of response (fallback to JSON)
      contentType = typeof(contentType) == 'string' ? contentType: 'json';

      // use the status code clledback or 200
      statusCode = typeof(statusCode) == 'number' ? statusCode:200;




      //Return the response parts that are content specific
      let payloadString = '';
      if (contentType == 'json') {
        res.setHeader('Content-Type', 'application/json');
        //use callback payload or {}
        payload = typeof(payload) == 'object' ? payload:{};
        payloadString = JSON.stringify(payload);

      }

      if (contentType == 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof(payload) != 'undefined' ? payload:'';

      }

      if (contentType == 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        payloadString = typeof(payload) != 'undefined' ? payload:'';

      }
      if (contentType == 'css') {
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof(payload) != 'undefined' ? payload:'';

      }
      if (contentType == 'png') {
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof(payload) != 'undefined' ? payload:'';

      }

      if (contentType == 'jpg') {
        res.setHeader('Content-Type', 'image/jpeg');
        payloadString = typeof(payload) != 'undefined' ? payload:'';

      }

      if (contentType == 'plain') {
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof(payload) == 'string' ? payload:'';

      }

      if (contentType == 'js') {
        res.setHeader('Content-Type', 'application/javascript');
        payloadString = typeof(payload) != 'undefined' ? payload:'';


      }


      // Returns the response-parts that are comman to all content-types
      res.writeHead(statusCode);
      res.end(payloadString);



      // If the response is 200 print green else print red
      if (statusCode === 200) {
        debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
      }else {
        debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);

      }

    });

  });
};

// Instantiationg the http server
server.httpServer = http.createServer(server.unifiedServer);





server.httpsServerOptions = {
  'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
  'cert' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}

// Instantiationg the https server
server.httpsServer = https.createServer(server.httpsServerOptions, server.unifiedServer);









// Define a req router
server.router = {
  '': handlers.index,
  'account/create': handlers.accountCreate,
  'account/edit': handlers.accountEdit,
  'account/deleted': handlers.accountDeleted,
  'session/create': handlers.sessionCreate,
  'session/deleted' : handlers.sessionDeleted,
  'checks/all': handlers.checklist,
  'checks/create': handlers.checkCreate,
  'checks/edit': handlers.checkEdit,
  'ping' : handlers.ping,
  'api/users' : handlers.users,
  'api/tokens': handlers.tokens,
  'api/checks': handlers.checks,
  'favicon.ico': handlers.favicon,
  'public': handlers.public
};


// Init script
server.init = function () {
  // Start the HTTP server
  // Start the http server
  server.httpServer.listen(config.httpPort, function(){
    console.log('\x1b[36m%s\x1b[0m', 'THe server is listening on port '+ config.httpPort+ ' in ' + config.envName + ' mode');

  });

  // Start the http sserver
  server.httpsServer.listen(config.httpsPort, function(){
    console.log('\x1b[35m%s\x1b[0m','THe server is listening on port '+ config.httpsPort+ ' in ' + config.envName + ' mode');
  });
}


// Export the module
module.exports = server;
