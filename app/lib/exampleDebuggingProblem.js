/*
*
* Library the demonstrates something throwing when its init() is called
*
*/



// Container for the module
const example = {};


// Init Function
example.init = function () {
  // This is an errpr created intentionally  (bar is not defined)
  const foo = bar;
};




// Export the module
module.exports = example;
