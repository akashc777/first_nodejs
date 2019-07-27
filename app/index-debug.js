/*
*
* Primary file for the API
*
*/

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

// Declare the app
const app = {};

// Init function
app.init = function () {

  // Start the server
  debugger;
  server.init();
  debugger;

  // Start the workers
  debugger;
  workers.init();
  debugger;

  // Start the CLI, but make sure it starts last
  debugger;
  setTimeout(function () {
    cli.init();
  }, 50);
  debugger;


  // Set foo at 1
  debugger;
  let foo = 1;
  debugger;

  // increment foo
  foo++;
  debugger;


  // Square foo
  foo *= foo;
  debugger;


  // Convert foo to a string
  foo = foo.toString();
  debugger;



  // Call the init script that will throw
  exampleDebuggingProblem.init();
  debugger;


};

// Execute
app.init();


//Export the app
module.exports = app;
