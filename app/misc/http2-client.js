/*
*
* Example HTTP2 Client
*
*/

// Dependencies
const http2 = require('http2');


// Create client
const client = http2.connect('http://localhost:6000');

// Create a request
const req = client.request({
  ':path' : '/',

});

// When the message is recived add the pieces of it togrther until u reach the end
let str  = '';
req.on('data', function (chunk) {
  str+=chunk;
});

// when the message ends, log it out
req.on('end', function () {
  console.log(str);
});

// End the request
req.end();
