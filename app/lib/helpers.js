/*
* Helper for various task
*
*/

// Dependiencies
const crypto = require('crypto');
const config = require('../config');

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

    console.log(typeof(str));
    let obj = JSON.parse(str);
    console.log(typeof(obj));
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
}










// Export the module

module.exports = helpers;
