/*
*
* Crate and export configuration variables
*
*/

// Container for all the environments
const environments = {};

// Staging {default} environments
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'stagging',
  'hashingSecret': 'thisIsASecret',
  maxChecks: 5,
  'twilio' : {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  },
  'templateGlobals': {
    'appName': 'UptimeChecker',
    'companyName': 'NotARealCompany, Inc',
    'yearCreated': '2019',
    'baseUrl': 'http://localhost:3000/'
  }

};


// Testing environments
environments.testing = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: 'testing',
  'hashingSecret': 'thisIsASecret',
  maxChecks: 5,
  'twilio' : {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  },
  'templateGlobals': {
    'appName': 'UptimeChecker',
    'companyName': 'NotARealCompany, Inc',
    'yearCreated': '2019',
    'baseUrl': 'http://localhost:3000/'
  }

};

// Production environments
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  'hashingSecret': 'thisIsASecret',
  maxChecks: 5,
  'twilio' : {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  },
  'templateGlobals': {
    'appName': 'UptimeChecker',
    'companyName': 'NotARealCompany, Inc',
    'yearCreated': '2019',
    'baseUrl': 'http://localhost:5000/'
  }

};

// Determine which environment was passed as a command-line argument
const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase(): '';

// check that current env is valid if not default to Staging
const environmentToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv]:environments["staging"]

// Export the module
module.exports = environmentToExport
