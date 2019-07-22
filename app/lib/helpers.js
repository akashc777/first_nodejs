/*
*
* Helpers for various task
*
*/

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');


// COntainer for all the Helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = function (str) {
  if (typeof(str) === 'string' && str.length >0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Parse a JSON string to a object in all cases without throwing
helpers.parseJsonToObject = function (str) {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }

}

// Create a string of random char of a given length

helpers.createRandomString = function (strLength) {
  console.log(strLength);
  strLength = typeof(strLength) === 'number' && strLength >0 ?strLength:false;

  if (strLength) {

    // Define all the possible char that coud go into string
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    let str = '';

    for (let i = 1; i <= strLength; i++) {

      // Get random char from possible characters string
      let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));


      // Append the char to final string
      str+=randomCharacter;
    }

    return str;
  }else {
    return false;
  }
};

// Send an sms via twillio
helpers.sendTwilioSms = function (phone, msg, callback) {
  // Validate the parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10? phone.trim(): false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ?msg.trim() : false;
  if (phone && msg) {
    // Config the req payload
    const payload = {
      'From' : config.twilio.fromPhone,
      'To': '+91'+phone,
      'Body': msg
    };

    // stringify the payload and configue the req details
    const stringPayload = querystring.stringify(payload);

    const requestDetails = {
      'Protocol': 'https',
      hostname: 'api.twilio.com',
      method: 'POST',
      path: '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth': config.twilio.accountSid+':'+config.twilio.authToken,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiaate the req obj
    const req = https.request(requestDetails, function (res) {
      // Grab status of the send request
      const status = res.statusCode;

      // Callback sucessfully if the req went trough
      if (status == 200 || status == 201) {
        callback(false);
      }else {
        callback('status code returned was '+status);
      }
    });

    // Bind to the error event so it dosent get thrown
    req.on('error', function (e) {
      callback(e)
    });

    // Add the payload to the req
    req.write(stringPayload);

    // End the request
    req.end()

  }else {
    callback('GIven param were missing or invalid');
  }
};


// Get the string content of a template
helpers.getTemplate = function (templateName, data, callback) {
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName:false;
  data = typeof(data) == 'object' && data != null ? data : {};

  if (templateName) {
    const templatesDir = path.join(__dirname, '/../templates/');
    fs.readFile(templatesDir+templateName+'.html', 'utf-8', function (err, str) {
      if (!err && str && str.length > 0) {

        // Do interpolation on the string
        const finalString = helpers.interpolate(str, data)
        callback(false, finalString);

      }else {
        callback('No template coulb be found');
      }

    });
  }else {
    callback('A valid template name was not specified');
  }
};

// Add the universal header and footer to a string and pass the provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = function (str, data, callback) {
  str = typeof(str) == 'string' && str.length > 0 ? str:'';
  data = typeof(data) == 'object' && data != null ? data : {};

  // Get the header
  helpers.getTemplate('_header', data, function (err, headerString) {
    if (!err && headerString) {
      // Get the footer
      helpers.getTemplate('_footer', data, function (err, footerString) {
        if (!err && footerString) {
          // Add these all together
          const fullString = headerString+str+footerString;
          callback(false, fullString);
        }else {
          callback('Cloud not find the footer template');
        }

      })
    }else {
      callback('Could not find the header template')
    }
  });
};


// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = function (str, data) {
  str = typeof(str) == 'string' && str.length > 0 ? str:'';
  data = typeof(data) == 'object' && data != null ? data : {};

  // Add the templateGlobals to the data object, prepending their key name with global
  for (var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data['global.'+keyName] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object, insert its value into the string at the corresponding place holder
  for (var key in data) {
    if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
      let replace = data[key];
      let find = '{'+key+'}'
      str = str.replace(find, replace);
    }
  }
  return str;
};


// Get the contents (public) assets
helpers.getStaticAssest = function (fileName, callback) {
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
  if (fileName) {
    const publicDir = path.join(__dirname, '/../public/');
    fs.readFile(publicDir+fileName, function (err, data) {
      if (!err && data) {
        callback(false, data);
      }else {
        callback('No file could be found ');
      }
    });
  }else {
    callback('A vallid file name was not specified ');
  }

};




// Export the module
module.exports = helpers;
