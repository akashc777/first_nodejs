/*
*
*   Primary file for the api
*
*
*/

// Dependiencies
const server = require('./lib/server');
const workers = require('./lib/workers');


// Declare the application
let app = {};

// Init function
app.init = () => {
  // Start the servers
  server.init();

  // Start the workers
  workers.init();
};

// Execute
app.init();

// Export the app
module.export = app;
