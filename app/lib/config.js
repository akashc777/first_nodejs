/*

Create and rxport configuration variables

 */

 // Container for all the environment

const  environments = {};

// Staging {default} environments

environments.staging = {
  httpport: 3000,
  httpsport: 3001,
  envName: 'Staging',
  'hashingSecret': 'thisIsaSecret',
  'maxChecks': 5,
  'twilio': {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  }
};

//Production environment

environments.production = {
  httpport: 5000,
  httpsport: 5001,
  envName: 'Production',
  'hashingSecret': 'thisIsaSecret',
  'maxChecks': 5,
  'twilio': {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  }
};

// Determine which environment was passed as a CLI arg

const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that current environment is one of the env above, if not , default Staging
const envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

// Export the module
module.exports = envToExport;
