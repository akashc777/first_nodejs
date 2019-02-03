/*
*
* Worker-related tasks
*
*
*/

// Dependencies
const path = require('path');
const fs = require('fs');
const _data = require('./data');
const https = require('https');
const http = require('http');
const helpers = require('./helpers');
const url = require('url');

// Instantiate the worker object
let workers = {};


// Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = () => {
  // Get all the checks
  _data.list('checks', (err, checks) => {
    if(!err && checks && checks.length > 0){
      checks.forEach((check) => {

        // Read in the check data by passing the check name
        _data.read('checks', check,(err, originalCheckData) => {

          if (!err && originalCheckData) {
            // Pass the data to the check validator, and let that function continue or log error as needed
            workers.validateCheckData(originalCheckData);

          }else {
            console.log("Error reading one of the checks data");
          }


        });

      });

    } else {
      console.log("Error: Could not find any checks to process");
    }
  });
};



// Sanity-check the check-data
workers.validateCheckData = (originalCheckData) => {



  originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
  originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
  originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
  originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
  originalCheckData.url = typeof(originalCheckData.url) == 'string' &&  originalCheckData.url.trim().length > 0  ? originalCheckData.url : false;
  originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['get', 'push', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
  originalCheckData.sucessCodes = typeof(originalCheckData.sucessCodes) == 'object' && originalCheckData.sucessCodes instanceof Array && originalCheckData.sucessCodes.length > 0 ? originalCheckData.sucessCodes : false;
  originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds: false;

  // Set the key that may not be set (if the workers have never seen this check before
  originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
  originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked: false;

  // If all the check pass, pass the data anlong to the next step in the process


  if (originalCheckData.id &&
  originalCheckData.userPhone &&
  originalCheckData.protocol  &&
  originalCheckData.url &&
  originalCheckData.method &&
  originalCheckData.sucessCodes &&
  originalCheckData.timeoutSeconds
  ) {
    workers.performChecks(originalCheckData);

  } else {
    console.log('Error: One of the checks is not properly formated. skipping it.');
  }

};


// performe the check, send the originalCheckData and the outcome of the check process, to the next step in the process
workers.performChecks = (originalCheckData) => {
  // Prepare the intial check outcome
  let checkOutcome = {
    error: false,
    responseCode: false,
  };

  // Mark that the outcome has not been sent yet
  let outcomeSent = false;

  // Parse the hostname and the path out of the original check data
  let parsedUrl = url.parse(originalCheckData.protocol + '://' + originalCheckData.url, true);
  let hostName = parsedUrl.hostname;
  let path = parsedUrl.path; // Using path and not 'Pathname' because we want the query srting

  // Constructing a request
  let requestDetails = {
    protocol: originalCheckData.protocol + ':',
    hostname: hostName,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000
  };



  // Instantiate the request object using eithr the http or https module
  let _moduleToUse = originalCheckData.protocol == 'http' ? http : https;
  let req = _moduleToUse.request(requestDetails, (res) => {

    // Grab the status of the sent request
    let status = res.statusCode;


    res.on('data', (d) => {
      console.log('\n return is :',d,'\n');
    process.stdout.write(d);
    });


    // Update the check outcome ans pass the data along
    checkOutcome.responseCode = status ;
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }

  });




  // Bind to the error event so it dosent get thrown
  req.on('error', (e) => {

    // Update the check outcome ans pass the data along
    checkOutcome.error = {
      error: true,
      value: e,

    };
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;

    }

  });

  // bind to the time out event
  req.on('timeout', (e) => {

    // Update the check outcome ans pass the data along
    checkOutcome.error = {
      error: true,
      value: 'timeout',

    };
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;

    }

  });

  // End the req
  req.end();


};

// Process the check outcome , update the check data as needed, trigger an alert if needed
// Special logic for accomodating a check that has never been tested before (don't alert on that one )
workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
  // Decide if the check is considered up or down
  let state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.sucessCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up': 'down';

  console.log(checkOutcome.responseCode);
  // Decide if an alert is warranted
  let alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

  // Log the outcome
  let timeOfCheck = Date.now();
  workers.log(originalCheckData,checkOutcome, state, alertWarranted,timeOfCheck);

  // update the check data
  let newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = timeOfCheck;



  // Save the updates
  _data.update('checks', newCheckData.id, newCheckData, (err) => {

    if (!err) {

      // Send the check data to the next phase in the process if needed
      if (alertWarranted) {

        workers.alertUserToStatusChange(newCheckData);

      }else {
        console.log('check outcome has not changed no alert needed ');
      }

    }else {
      console.log('Error trying to save updates to one of the checks ');
    }

  });

};

// Alert to user as to a change in their check status

workers.alertUserToStatusChange = (newCheckData) => {
  let message  = 'Alert: your check for '+ newCheckData.method.toUpperCase()+' '+ newCheckData.protocol+'://'+newCheckData.url+' is currently '+newCheckData.state ;
  helpers.sendTwilioSms(newCheckData.userPhone, message, (err) => {
    if (!err) {
      console.log('success User was alerted to status change in their check, via sms', message);
    }else {
      console.log('Error: Could not send sms to the user who had a state change in their check');
    }
  });
};



workers.log = (originalCheckData,checkOutcome, state, alertWarranted,timeOfCheck) => {
  // Form the log data
  let logData = {
    check: originalCheckData,
    outcome: checkOutcome,
    state,
    alert: alertWarranted,
    time: timeOfCheck

  };

  // Convert data to a string
  let logString = JSON.stringify(logData);

  // Determine the name of the log file
};




// Timer to execute the worker-process once per minute
workers.loop = () => {

    setInterval(() => {
      workers.gatherAllChecks();

    }, 1000 * 5);
};





// Init script
workers.init = () => {
  // Execute all the checks immediately
  workers.gatherAllChecks();

  // Call the loop so the checks will execute later on
  workers.loop();

};


// Export the module
module.exports = workers;
