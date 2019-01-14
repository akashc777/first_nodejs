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
};

//Production environment

environments.production = {
  httpport: 5000,
  httpsport: 5001,
  envName: 'Production',
  'hashingSecret': 'thisIsaSecret',
  'maxChecks': 5,
};

// Determine which environment was passed as a CLI arg

const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that current environment is one of the env above, if not , default Staging
const envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

// Export the module
module.exports = envToExport;
