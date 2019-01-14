/*
*
*These are the request handlers
*
*/

// Dependiencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./../config');

//define a handlers
const handlers = {};

//sample handlers
handlers.sample = function(data,callback){
  // Callback a http status code, and a payloa(object)
  callback(406, {'name': 'sample handler'},data);
};

// users habdler

handlers.users = function(data,callback){

  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data, callback);
  }
  else{
    callback(405);
  }
};

//containers for the users submethod
handlers._users = {};

// Users - posts
// Required firsst-name, Last-name, phone, password, tosaggrement
// optional data : none
handlers._users.post = (data, callback) => {

  console.log(data);

  // Check that all required fields are filled out
  let firstname = typeof(data.payload.firstname) == 'string' && data.payload.firstname.length > 0 ? data.payload.firstname.trim() : false;


  let lastname = typeof(data.payload.lastname) == 'string' && data.payload.lastname.length > 0 ? data.payload.lastname.trim() : false;


  let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;


  let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  let tosAggrement = typeof(data.payload.tosAggrement) == 'boolean' && data.payload.tosAggrement == true ? true : false;

  console.log(firstname,lastname,phone,password,tosAggrement);

  if(firstname && lastname && phone && password && tosAggrement){
    // Make sure that sure dosent already exist
    _data.read('users', phone, (err, data) => {
        if(err){

          // Hash the password
          let hashedPassword = helpers.hash(password);

          if(hashedPassword){
            // Create user object
            const userObject = {
              firstname,
              lastname,
              phone,
              hashedPassword,
              tosAggrement
            };

            // Store the user

            _data.create('users', phone, userObject, (err) => {
              if(!err){
                callback(200);
              }
              else {
                console.log(err);
                callback(500,{'Error': 'could not create new user'})
              }
            });
          }else {
            callback(500, {'Error': 'Could not hash the user\'s password'});
          }



        }else{
          // User phone number already exist
          callback(400,{'Error': 'User phone number already exists'});

        }


    });
  }
  else{
    callback(400, {'Error' : 'Missing required fields'});
  }


};


// Users - get
// Required data: phone
// Optional Data: none
handlers._users.get = (data, callback) => {

  // Check the phone numberin valid
  let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if(phone){
    // Get the token from the headers
    let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the goven token from headers is valid for the phone number
    console.log(token, 'HOLA ');
    handlers._tokens.verifyToken(token, phone, (tokenisvalid) => {
      console.log(tokenisvalid);
      if (tokenisvalid) {

        // Lookup a user

        _data.read('users', phone, (err, data) => {
          if(!err && data){
            // Remove the hashed password before returining it to requester
            delete data.hashedPassword;
            callback(200, data);

          }else{
            callback(404);
          }

        });

      }else {
        callback(403, {'Error': 'Missing required token in header, or token is invalid '});
      }
    });


  }else{
    callback(400,{'Error': 'Missing required field'});
  }


};


// Users - put
// Required data: phone
// Optional data: firstname, lastname, password (at least one should be specified)

handlers._users.put = (data, callback) => {

  //Check for the required fields
  console.log(data.payload);
  let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  // Check for the optional fields
  let firstname = typeof(data.payload.firstname) == 'string' && data.payload.firstname.length > 0 ? data.payload.firstname.trim() : false;


  let lastname = typeof(data.payload.lastname) == 'string' && data.payload.lastname.length > 0 ? data.payload.lastname.trim() : false;


  let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // Get the token from the headers
  let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;


  // Error if the phone is invalid
  if (phone) {



    handlers._tokens.verifyToken(token, phone, (tokenisvalid) => {
      if (tokenisvalid) {

        // Error if nothing is sent to Update
        if (firstname || lastname || password) {
          //Lookup users
          _data.read('users', phone, (err, data) => {
            if(!err && data){
              // Update the fields that are necessary
              if(firstname){
                data.firstname = firstname;
              }
              if(lastname){
                data.lastname = lastname;
              }
              if(password){
                data.hashedPassword = helpers.hash(password);
              }

              // Store the new Update
              _data.update('users', phone, data, (err) => {
                if (!err) {
                  callback(200);

                }else {
                  console.log(err);
                  callback(500, {'Error': 'Could not update the user'});
                }

              });
            }else{
              callback(400, {'Error': 'The specified user doe not exist'});
            }
          });

        }else{
          callback(400, {'Error': 'Missing fields to update'});
        }

      }else {
        callback(403, {'Error': 'Missing required token in header, or token is invalid '});
      }
    });










  }else{
    callback(400, {'Error': 'Missing required field'});
  }

};

// Users - delete
// REquired field: phone
// @// TODO: Cleanup(delete) any other data files associated with the user
handlers._users.delete = (data, callback) => {

  // Check that phone number is valid

  let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if(phone){

    // Get the token from the headers
    let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the goven token from headers is valid for the phone number
    handlers._tokens.verifyToken(token, phone, (tokenisvalid) => {
      if (tokenisvalid) {

        _data.read('users', phone, (err, data) => {
          if(!err && data){
            _data.delete('users', phone, (err) => {
              if(!err){
                callback(200);
              }else{
                callback(500, {'Error': 'Could not delete the specified user'});
              }
            });

          }else{
            callback(400, {'Error': 'Could not find the specified user'});
          }

        });


      }else {
        callback(403, {'Error': 'Missing required token in header, or token is invalid '});
      }
    });

    // Lookup a user


  }else{
    callback(400,{'Error': 'Missing required field'});
  }
};


//Not found handlers
handlers.notfound = function(data,callback){

  callback(404);
};

// Tokens
handlers.tokens = function(data,callback){

  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._tokens[data.method](data, callback);
  }
  else{
    callback(405);
  }
};

// Container for all the tokens method
handlers._tokens = {};

// Tokens - post
// Rquired data : phone , Password
// optional Data: none
handlers._tokens.post = (data, callback) => {

    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;


    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if(phone && password){
      // Lookup the user with that phone number
      _data.read('users',phone, (err, userdata) => {
        if(!err && userdata){
          // HAsh the sent password and compare with password stored in user obj
          let hashedPassword = helpers.hash(password);
          if (hashedPassword == userdata.hashedPassword) {
            // If valid create a new token with a random name. Set expiration date 1 hour in the future
            let tokenId = helpers.createReandomString(20);
            let expires = Date.now() + 1000 * 3600;
            let tokenObject = {
              phone,
              tokenId,
              expires
            };
            // Store the token
            _data.create('tokens', tokenId, tokenObject, (err) => {
              if(!err){
                callback(200, tokenObject);

              }else{
                callback(500, {'Error': 'Could not create the new token'});
              }
            });

          }else{
            callback(400, {'Error': 'Password did not match the specified user\'s stored password'});
          }
        }else{
          callback(400, {'Error': 'Could not find the specified user'});
        }
      });
    }else{
      callback(400, {'Error': 'Missing required fields'});
    }
};

// Tokens - get
// Required data: ID
// Optional data: None
handlers._tokens.get = (data, callback) => {
  // Check the ID is valid
  let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup a tokens

    _data.read('tokens', id, (err, tokendata) => {
      if(!err && tokendata){

        callback(200, tokendata);

      }else{
        callback(404);
      }

    });

  }else{
    callback(400,{'Error': 'Missing required field'});
  }

};


// Tokens - put
// Required data : id, Extend
// Optional data: none
handlers._tokens.put = (data, callback) => {

  let id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  let extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

  if (id && extend) {
    // Look up the token
    _data.read('tokens', id, (err, data) => {
      if(!err && data){
        // Check to make sure the token isn't already expired
        if(data.expires > Date.now()){
          // Set the expiration 1 hour from now
          data.expires = Date.now() + 1000 * 3600;

          //Store the new Update
          _data.update('tokens', id, data, (err) => {
            if (!err) {
              callback(200);
            }else {
              callback(500, {'Error': 'Could not update the token expiration'});
            }
          });
        }else {
          callback(400, {'Error': 'The token has already expired and cannot be extened'});
        }
      }else{
        callback(400, {'Error': 'Specified tooken does not exist'});
      }
    });
  }else {
    callback(400, {'Error': 'Missing required field(s) or the field(s) are invalid'});
  }

};

// Tokens - delete
// REquired data: ID
// Optional data: None
handlers._tokens.delete = (data, callback) => {

  let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){
    // Lookup a user

    _data.read('tokens', id, (err, data) => {
      if(!err && data){
        _data.delete('tokens', id, (err) => {
          if(!err){
            callback(200);
          }else{
            callback(500, {'Error': 'Could not delete the specified token'});
          }
        });

      }else{
        callback(400, {'Error': 'Could not find the specified token'});
      }

    });

  }else{
    callback(400,{'Error': 'Missing required field'});
  }

};


// verify if a given id is a current;y valois for a given users
handlers._tokens.verifyToken = (id, phone, callback) => {
  // Look up the token
  _data.read('tokens', id, (err, tokenData) => {
    if(!err && tokenData){
      console.log(tokenData);
      // Check that the token is for the given user and has not expires
      if (tokenData.phone == phone && tokenData.expires > Date.now()) {
        callback(true);
      }else {
        console.log('token data error');
        callback(false);
      }
    }else {
      console.log('read file error');
      callback(false);
    }
  });

};


// Checks
handlers.checks = function(data,callback){

  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._checks[data.method](data, callback);
  }
  else{
    callback(405);
  }
};

// Container for all the checks method
handlers._checks = {};

// Checks - Post
// Required data : protocol , url, method, successCodes, timeoutSeconds
// OPtional data: none
handlers._checks.post = (data, callback) => {
  // Validate inputs
  let protocol = typeof(data.payload.protocol) == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  let url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url : false;
  let method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  let sucessCodes = typeof(data.payload.sucessCodes) == 'object' && data.payload.sucessCodes instanceof Array && data.payload.sucessCodes.length > 0 ? data.payload.sucessCodes : false;
  let timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >=1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  console.log(protocol, url, method, sucessCodes, timeoutSeconds);

  if(protocol && url && method && sucessCodes && timeoutSeconds){
    // Get token from the header
    let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    // Look up user by reading the token
    _data.read('tokens', token, (err, tokendata) => {
      if (!err && tokendata) {
        let userPhone = tokendata.phone;

        //Look up thr user data
        _data.read('users', userPhone, (err, userdata) => {
          if (!err && userdata) {
            let userChecks = typeof(userdata.checks) == 'object' && userdata.checks instanceof Array ? userdata.checks : [];

            // Verify that the user has less than the mac checck per user
            if (userChecks.length < config.maxChecks) {
              // Create a random id for the check
              let checkId = helpers.createReandomString(20);

              // Create thr check obj and include the user phone
              let checkObject = {
                'id': checkId,
                 userPhone,
                 protocol,
                 method,
                 sucessCodes,
                 timeoutSeconds
              };

              // Save the object
              _data.create('checks', checkId, checkObject, (err) => {
                if (!err) {
                  // add the check ID to user obj
                  userdata.checks = userChecks;
                  userdata.checks.push(checkId);

                  // save the new user data
                  _data.update('users', userPhone, userdata, (err) => {
                    if(!err){
                      // Return the data about the new check
                      callback(200, checkObject);

                    }else {
                      callback(500, {'Error': 'Could not update the user with new check'});
                    }
                  });

                }else {
                  callback(500, {'Error': 'Could not create the new check'})
                }
              });
            }else {
              callback(400, {'Error': 'The user already has the maximum number of checks {' + config.maxChecks + '}'});
            }

          }else {
            callback(403);
          }
        });
      }else {
        callback(403);
      }
    });
  } else {
    callback(400, {'Error': 'Missing required inputs or inputs are invalid'});
  }

};


// CHecks - get
// Required data : id
// Optional data: none
handlers._checks.get = (data, callback) => {

  // Check the phone ud is valid
  let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id){



    // Look up a check
    _data.read('checks', id, (err, checkdata) => {
      if(!err && checkdata){

        // Get the token from the headers
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the goven token from headers is valid for the phone number who created the check
        console.log(token, 'HOLA ');
        handlers._tokens.verifyToken(token, checkdata.userPhone, (tokenisvalid) => {
          console.log(tokenisvalid);
          if (tokenisvalid) {

            // Return the check data
            callback(200, checkdata)

          }else {
            callback(403);
          }
        });


      }else {
        callback(404)
      }
    });



  }else{
    callback(400,{'Error': 'Missing required field'});
  }


};


//Ping handler

handlers.ping = function(data,callback){

  callback(200);
};


// Export the module
module.exports = handlers;
