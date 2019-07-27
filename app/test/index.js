/*
*
* Test runner
*
*/

// Override the NODE_ENV varable
process.env.NODE_ENV = 'testing';




// Application logic for the test runner
_app = {};


// Container for the test
_app.tests = {};


// Add on the unit test
_app.tests.unit = require('./unit');
_app.tests.api = require('./api');






// COunt all the tests
_app.countTests = function () {
  let counter = 0;
  for (var key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      let subTests = _app.tests[key];
      for (var testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          counter ++;

        }
      }
    }
  }
  return counter;
};




// Run all the tests, collecting the errors and succeses
_app.runTests = function () {
  const errors = [];
  let sucesses = 0;
  const limit = _app.countTests();

  let counter = 0;
  for (var key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      let subTests = _app.tests[key];
      for (var testName in subTests ){
        if (subTests.hasOwnProperty(testName)) {
          (function() {
            let tempTestName = testName;
            let testValue = subTests[testName];
            // Call the test
            try {
              testValue(function () {
                // if it calls back without throwing, then it succeded, so log it in green
                console.log('\x1b[32m%s\x1b[0m',tempTestName);
                counter++;
                sucesses++;
                if (counter == limit) {
                  _app.produceTestReport(limit, sucesses, errors);
                }

              });
            } catch (e) {
              // If it throws then it failed, so capture the error thrown and log it in red
              errors.push({
                'name': testName,
                'error': e
              });

              console.log('\x1b[31m%s\x1b[0m',tempTestName);
              counter++;
              if (counter == limit) {
                _app.produceTestReport(limit, sucesses, errors);
              }
            }
          })();
        }
      }
    }
  }

};


// Produce a test outcome report
_app.produceTestReport = function (limit, successes, errors) {
  console.log('');
  console.log('--------------BEGIN TEST REPORT------------');
  console.log('');
  console.log('😃 Total Tests: ', limit);
  console.log('😎 Pass: ',successes);
  console.log('😱 Fails: ', errors.length);
  console.log('');

  // If there are errors, print them in detail
  if (errors.length > 0) {
    console.log('--------------BEGIN ERROR DETAILS------------');
    console.log('');

    errors.forEach(function (testError) {
      console.log('\x1b[31m%s\x1b[0m',testError.name);
      console.log(testError.error);
      console.log('');
    });

    console.log('');
    console.log('--------------END ERROR DETAILS------------');


  }


  console.log('');
  console.log('--------------END TEST REPORT------------');
  process.exit(0);
};



// Run the tests
_app.runTests();
