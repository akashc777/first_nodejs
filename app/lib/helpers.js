/*
* Helper for various task
*
*/

// Dependiencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');

// container for all the helpers

const helpers ={};

// Create a SHA256 hsah
helpers.hash = (str) => {

  if(typeof(str) == 'string' && str.length > 0){
    let hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;

  }else{
    return false;
  }

};

// Parse a JSON to a object in all cases, without knowing

helpers.parseJsonToObject = function(str){
  try{
    str = JSON.parse(JSON.stringify(str.trim()));


    let obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {e};
  }
};

// Create a string of random aplhanumeric characters, of a given length
helpers.createReandomString = (strLength) => {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength: false;
  if (strLength) {
    // DEfine all the possible char that chould go into a string

      let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

      // Start the final string
      let str = '';

      for(i = 1; i<= strLength; i++){
        // Get teh random character in the possible characters string
        let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));


        // Append this character to the final string
        str += randomCharacter;
      }

      // Return the final string

      return str;
  }else {
    return false;
  }
};


// Send an sms message via Twilio
helpers.sendTwilioSms = (phone, msg, callback) => {
  // Validate the parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim(): false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim():false;
  if (phone && msg) {
    // Config the request payload
    var payload = {
     'From' : config.twilio.fromPhone,
     'To' : '+91'+phone,
     'Body' : msg
   };

    // stringify the payload
    let stringPayload = querystring.stringify(payload);


    // Configure the request details
    let requestDetails = {
      'protocol': 'https:',
      'hostname': 'api.twilio.com',
      'method': 'POST',
      'path': '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth': config.twilio.accountSid+':'+config.twilio.authToken,
      'headers' : {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object
    let req = https.request(requestDetails, (res) => {

      // Grab the status of the sent request
      let status = res.statusCode;
      // Callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      }else {
        callback('Status code returned was '+status);
      }

    });

    //Bind to the error event so it dosent get thrown
    req.on('error', (e) => {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

  }else {
    callback('Given parameters were missing or invalid');
  }
};











// Export the module

module.exports = helpers;
