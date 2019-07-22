/*
*
* These are the request handlers
*
*/


// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');


// Define a handler
const handlers = {};

/*
*
* HTML handlers
*
*/
// Index handlers
handlers.index = function (data, callback) {
  // Reject any request that isn't GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Uptime monitoring - Made simple',
      'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we\'ll send you a text to let you know ',
      'body.class': 'index'
    };
    // Read in a index template as a string
    helpers.getTemplate('index', templateData,function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as html
            callback(200, str, 'html');
          }else {
            callback(500, undefined, 'html');
          }
        });

      }else {
        callback(500, undefined, 'html');
      }
    });

  }else {
    callback(405, undefined, 'html');
  }
}



// Create account
handlers.accountCreate = function (data, callback) {

  // Reject any request that isn't GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Create an Account',
      'head.description': 'Signup is easy and only takes a few seconds',
      'body.class': 'accountCreate'
    };
    // Read in a index template as a string
    helpers.getTemplate('accountCreate', templateData,function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as html
            callback(200, str, 'html');
          }else {
            callback(500, undefined, 'html');
          }
        });

      }else {
        callback(500, undefined, 'html');
      }
    });

  }else {
    callback(405, undefined, 'html');
  }

};




// Create session
handlers.sessionCreate = function (data, callback) {

  // Reject any request that isn't GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Login to your account',
      'head.description': 'Please enter your phone number and password to access your account ',
      'body.class': 'sessionCreate'
    };
    // Read in a index template as a string
    helpers.getTemplate('sessionCreate', templateData,function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as html
            callback(200, str, 'html');
          }else {
            callback(500, undefined, 'html');
          }
        });

      }else {
        callback(500, undefined, 'html');
      }
    });

  }else {
    callback(405, undefined, 'html');
  }

};





// delete session
handlers.sessionDeleted= function (data, callback) {

  // Reject any request that isn't GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Logged Out',
      'head.description': 'You have been sucessfully logged out from your account',
      'body.class': 'sessionDeleted'
    };
    // Read in a index template as a string
    helpers.getTemplate('sessionDeleted', templateData,function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as html
            callback(200, str, 'html');
          }else {
            callback(500, undefined, 'html');
          }
        });

      }else {
        callback(500, undefined, 'html');
      }
    });

  }else {
    callback(405, undefined, 'html');
  }

};



// Edit your account
handlers.accountEdit = function (data, callback) {

  // Reject any request that isn't GET
  if (data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Account Settings',
      'body.class': 'accountEdit'
    };
    // Read in a index template as a string
    helpers.getTemplate('accountEdit', templateData,function (err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function (err, str) {
          if (!err && str) {
            // Return that page as html
            callback(200, str, 'html');
          }else {
            callback(500, undefined, 'html');
          }
        });

      }else {
        callback(500, undefined, 'html');
      }
    });

  }else {
    callback(405, undefined, 'html');
  }

};






// Favicon
handlers.favicon = function (data, callback) {

  // Reject any request thaat isn't a GET
  if (data.method == 'get') {
    // Read in the favicon data
    helpers.getStaticAssest('favicon.ico', function (err, data) {
      if (!err && data) {
        // Callback the data
        callback(200,data, 'favicon');

      }else {
        callback(500)
      }
    });
  }else {
    callback(405)
  }
};

// Public assests
handlers.public = function (data, callback) {

  // Reject any request thaat isn't a GET
  if (data.method == 'get') {
    // Get the file name being requested
    const trimmedAssestName = data.trimmedPath.replace('public/', '').trim();
    if (trimmedAssestName.length > 0) {
      // Read the assest's data
      helpers.getStaticAssest(trimmedAssestName, function (err, data) {
        if (!err && data) {
          // Determine the contentType (default to plain text)
          let contentType = 'plain';

          if (trimmedAssestName.indexOf('.css') > -1) {

              contentType = 'css';

          }
          if (trimmedAssestName.indexOf('.png') > -1) {

              contentType = 'png';
          }
          if (trimmedAssestName.indexOf('.jpg') > -1) {

              contentType = 'jpg';
          }
          if (trimmedAssestName.indexOf('.ico') > -1) {

              contentType = 'favicon';
          }
          if (trimmedAssestName.indexOf('.js') > -1) {

              contentType = 'js';

          }

          // Callback the data
          callback(200, data, contentType);


        }else {
          callback(404)
        }
      });
    }else {
      callback(404)
    }
  }else {
    callback(405);
  }

};



/*
*
* JSON api handlers
*
*/

// users
handlers.users = function (data, callback) {

  const acceptableMethods = ['post', 'put', 'get', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data, callback);
  }else {
    callback(405); // status cosde for method not allowed
  }

};

// COntainer for the users sub method
handlers._users = {};

// Users - post
// Required data: firstname, lastname, phone, password, tosAgreement
handlers._users.post = function (data, callback) {
  // Check that all required fields are filled out
  const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim():false;
  const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim():false;
  const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim():false;
  const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim():false;
  const tosAgreement = typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true ? data.payload.tosAgreement:false;

  console.log(firstName, lastName, phone, password, data.payload.tosAgreement);

  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure that user dosent already exist
    _data.read('users', phone, function (err, data) {
      if(err){
        // Hash the password
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {

          // Create the user object
          const userObject = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement: true
          };

          // Store the users
          _data.create('users', phone, userObject, function(err) {
            if (!err) {
              callback(200);
            }else {
              console.log(err);
              callback(500, {Error: 'Could not create the new user'});
            }
          });

        }else {
          callback(500, {Error: 'Could not hash the user\'s password'});
        }


      }else {
        // User alresdy exist
        callback(400, {'Error':'A user with the phone umber already exist'})
      }
    });

  }else {
    callback(400, {'Error': 'Missing required fields'})
  }

};

// Users - put
// Required data is phone
// Optional data: firstName, lastName, password (at leat one should be specified)
// TODO: Only let an authanticated user update their own obj not anyone else
handlers._users.put = function (data, callback) {

  // CHeck for the required field
  const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim():false;

  // Check for the optional parameters
  const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim():false;
  const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim():false;
  const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim():false;

  // Error id phone is invalid
  if (phone) {

    // Error if nothing is sent to Update
    if (firstName||lastName||password) {
      const id = typeof(data.headers.id) === 'string' && data.headers.id.trim().length === 20 ? data.headers.id.trim():false;
      // Verify that the given token is valid for the phone number
      handlers._tokens.verifyToken(id, phone, function(tokenIsValid) {
        if (tokenIsValid) {

          // Lookup users
          _data.read('users', phone, function (err, userData) {

            if (!err && userData) {
              //Update the fields necessary
              if(firstName){
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.hashedPassword = helpers.hash(password);
              }
              // Store the new updates
              _data.update('users', phone, userData, function (err) {
                if (!err) {
                  callback(200);

                }else {
                  console.log(err);
                  callback(500, {Error: 'could not update the user'});
                }

              })

            }else {
              callback(400,{Error: 'The specified user does not exist'});
            }

          });

        }else {
          callback(403, {Error:'missing required token in header or token is invalid'});

        }
      });


    }else {
      callback(400, {Error: 'Missing fields to update'});
    }

  }else {
    callback(400, {Error: 'Missing required field'});
  }


};


// Users - get
// Required data: phone
// Optional data: none
// TODO: only let an authanticated user let access their object. Dont let them access anyone elses
handlers._users.get = function (data, callback) {

  // Check that the phone number is valid
  const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim():false;
  if (phone) {

    // get the token from the header
    const id = typeof(data.headers.id) === 'string' && data.headers.id.trim().length === 20 ? data.headers.id.trim():false;

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(id, phone, function(tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the user
        _data.read('users', phone, function (err, data) {
          if (!err && data) {
            // Remove the hashed password before returning it to the requester
            delete data.hashedPassword;
            callback(200, data);
          }else {
            callback(404);
          }
        });

      }else {
        callback(403, {Error:'missing required token in header or token is invalid'});
      }
    });




  } else {
    callback(400, {Error:'Missing required field'});
  }

};

// Users - delete
// Required data: phone
handlers._users.delete = function (data, callback) {

  // Check that the phone number is valid
  const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim():false;
  if (phone) {

    const id = typeof(data.headers.id) === 'string' && data.headers.id.trim().length === 20 ? data.headers.id.trim():false;
    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(id, phone, function(tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the user
        _data.read('users', phone, function (err, userData) {
          if (!err && userData) {

            // Remove the hashed password before returning it to the requester
            _data.delete('users', phone, function (err) {
              if (!err) {
                // Deleted each of the check associated with the user
                const userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];

                const checksToDelete = userChecks.length ;

                if (checksToDelete >0) {
                  const checksDeleted = 0;
                  let deletingErrors = false;

                  // loop through the checks
                  userChecks.forEach(function (checkId) {
                    // Delete the check
                    _data.delete('checks', checkId, function (err) {
                      if (err) {
                        deletingErrors = true;
                      }
                      checksDeleted++;
                      if (checksDeleted === checksToDelete) {
                        if(!deletingErrors){
                          callback(200);
                        }else {
                          callback(500, {'Error':'Errors encountered while attempting to delete all of the users checks all checks may not have be deleted sucessfully'});
                        }
                      }
                    });
                  });

                }else {
                  callback(200)
                }


              }else {
                callback(500, {Error: 'Could not delete this user'});
              }

            });

          }else {
            callback(400, {Error: 'Could not find the specified user'});
          }
        });


      }else {
        callback(403, {Error:'missing required token in header or token is invalid'});

      }
    });


  } else {
    callback(400, {Error:'Missing required field'});
  }



};


// Tokens
handlers.tokens = function (data, callback) {

  const acceptableMethods = ['post', 'put', 'get', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._tokens[data.method](data, callback);
  }else {
    callback(405); // status cosde for method not allowed
  }

};


// COntainer  for all the Tokens
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = function (data, callback) {

  const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim():false;
  const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim():false;
  if (phone && password) {
    // Lookup the user who matches that phone no
    _data.read('users', phone, function (err, userData) {
      if (!err && userData) {
        // Hash the send password ans compare it with user obj
        const hashedPassword = helpers.hash(password);
        if (hashedPassword === userData.hashedPassword) {
          //If valid create new token with random name . set epiration date 1h
          const tokenId = helpers.createRandomString(20);


          const expires = Date.now() + 1000*60*60;
          const tokenObject = {
            phone,
            id: tokenId,
            expires
          };

          // Store the token
          _data.create('tokens', tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            }else {
              callback(500, {Error: 'Could not create the token'});
            }
          });

        }else {
          callback(400, {Error: 'password didnot match the specified user stored password'})
        }

      }else {
        callback(400, {'Error': 'Could not find the specified user'});
      }
    });

  }else {
    callback(400, {Error: 'Missing required fields'});
  }

};



// Tokens - put
// Required data: id, extend
// Optional Data: none
handlers._tokens.put = function (data, callback) {

  const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim():false;
  const extend = typeof(data.payload.extend) === 'boolean' && data.payload.extend === true ? data.payload.id.trim():false;
  if (id && extend) {
    // Lookup the token
    _data.read('tokens', id, function (err, tokenData) {
      if (!err && tokenData) {
        // check to make sure isn't already exppired
        if (tokenData.expires > Date.now()) {

          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000*60*60;

          // Store the new updates
          _data.update('tokens', id, tokenData, function (err) {
            if (!err) {
              callback(200);
            }else {
              callback(500, {Error: 'Could not update the token expiration'});

            }
          })

        }else {
          callback(400, {Error: 'the token has already expired and cannot be extended'});
        }
      }else {
        callback(400,{Error: 'Token does not exist'});
      }
    });
  }else {
    callback(400, {Error:'Missing required feilds or its invalid'});
  }


};



// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = function (data, callback) {

  // Check that the phone number is valid
  const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim():false;
  if (id) {
    // Lookup the user
    _data.read('tokens', id, function (err, tokenData) {
      if (!err && tokenData) {

        callback(200, tokenData);
      }else {
        callback(404);
      }
    });

  } else {
    callback(400, {Error:'Missing required field'});
  }


};


// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = function (data, callback) {

  // Check that the phone number is valid
  const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim():false;
  if (id) {
    // Lookup the user
    _data.read('tokens', id, function (err, data) {
      if (!err && data) {
        // Remove the hashed password before returning it to the requester
        _data.delete('tokens', id, function (err) {
          if (!err) {
            callback(200);
          }else {
            callback(500, {Error: 'Could not delete this token'});
          }

        });

      }else {
        callback(400, {Error: 'Could not find the specified token'});
      }
    });

  } else {
    callback(400, {Error:'Missing required field'});
  }




};


// Verify if a given id is currently valid for a given user
handlers._tokens.verifyToken = function (id, phone, callback) {
  // lookup the token
  _data.read('tokens', id, function (err, tokenData) {
    if (!err && tokenData) {
      // check that token is for given user and has not expired
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      }else {
        callback(false);
      }
    }else{
      callback(false);
    }

  });
};


// Checks
handlers.checks = function (data, callback) {

  const acceptableMethods = ['post', 'put', 'get', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._checks[data.method](data, callback);
  }else {
    callback(405); // status cosde for method not allowed
  }

};


// COntainer  for all the checks method
handlers._checks = {};


// Checks -post
// Required data : protocol, url, method, sucessCodes, timeOutSeconds
// Optional data: none
handlers._checks.post= function functionName(data, callback) {
  // Validate the inputs
  const protocol = typeof(data.payload.protocol) === 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol:false;
  const url = typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim():false;
  const method = typeof(data.payload.method) === 'string' && ['post', 'put', 'get', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method:false;
  const sucessCodes = typeof(data.payload.sucessCodes) === 'object' && data.payload.sucessCodes instanceof Array && data.payload.sucessCodes.length > 0 ? data.payload.sucessCodes:false;
  const timeOutSeconds = typeof(data.payload.timeOutSeconds) === 'number' && data.payload.timeOutSeconds % 1 === 0 && data.payload.timeOutSeconds >= 1 && data.payload.timeOutSeconds <=5? data.payload.timeOutSeconds:false;

  console.log(protocol, url, method, data.payload.sucessCodes, timeOutSeconds);

  if (protocol && url && method && sucessCodes && timeOutSeconds) {
    // get the token from the headers
    const id = typeof(data.headers.id) === 'string' && data.headers.id.trim().length === 20 ? data.headers.id:false;

    // Lookup the user by reading the token
    console.log(id);
    _data.read('tokens', id, function (err, tokenData) {
      if (!err && tokenData) {
        const phone = tokenData.phone;

        // Lookup the user data
        _data.read('users', phone, function (err, userData) {
          if (!err && userData) {
            const userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];

            // verify that user has less than the number of maxChecks per user
            if (userChecks.length < config.maxChecks) {
              // Create a random id for the checks
              const checkId = helpers.createRandomString(20);

              // Create the check object and include the user's phone
              const checkObject = {
                id: checkId,
                userPhone: phone,
                protocol,
                url,
                method,
                sucessCodes,
                timeOutSeconds
              };

              // Save the object
              _data.create('checks', checkId, checkObject, function (err) {
                if (!err) {
                  // Add the check id to user object
                  userData.checks = userChecks
                  userData.checks.push(checkId);

                  // save the new user Data
                  _data.update('users', phone, userData, function (err) {
                    if (!err) {
                      // Return the data about new check
                      callback(200, checkObject);

                    }else {
                      callback(500, {Error: 'could not update the user with the new check'});
                    }
                  });
                }else {
                  callback(500, {Error: 'could not create the new check'});
                }
              });

            }else {
              callback(400, {Error: 'User has maximum number of checks '+ config.maxChecks})
            }
          }else {
            callback(403, {Error: 'users'});
          }
        });
      }else {
        callback(403, {Error: 'token'})
      }
    });

  }else {
    callback(400, {Error: 'Missing required inputs or inputs are invalid'});
  }


};


// checks -get
// Required data: id,
// Optional data  : none
handlers._checks.get = function (data, callback) {

  // Check that the phone number is valid
  const checkid= typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim():false;
  if (checkid) {

    // Lookup the check
    _data.read('checks', checkid, function (err, checkData) {
      if (!err && checkData) {

        // get the token from the header
        const token = typeof(data.headers.token) === 'string' && data.headers.token.trim().length === 20 ? data.headers.token.trim():false;



        // Verify that the given token is valid and belongd to the user who created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
          if (tokenIsValid) {
            // return the check data
            callback(200, checkData)

          }else {
            callback(403);
          }
        });

      }else {
        callback(404);
      }
    });




  } else {
    callback(400, {Error:'Missing required field'});
  }

};


// checks - put
// Required data: id
// optional data: protocol, url , methods, sucessCodes, timeOutSeconds (one must be sent)

handlers._checks.put = function (data, callback) {

  // CHeck for the required field
  const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim():false;

  // Check for the optional parameters
  const protocol = typeof(data.payload.protocol) === 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol:false;
  const url = typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim():false;
  const method = typeof(data.payload.method) === 'string' && ['post', 'put', 'get', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method:false;
  const sucessCodes = typeof(data.payload.sucessCodes) === 'object' && data.payload.sucessCodes instanceof Array && data.payload.sucessCodes.length > 0 ? data.payload.sucessCodes:false;
  const timeOutSeconds = typeof(data.payload.timeOutSeconds) === 'number' && data.payload.timeOutSeconds % 1 === 0 && data.payload.timeOutSeconds >= 1 && data.payload.timeOutSeconds <=5? data.payload.timeOutSeconds:false;

  // check to make sure id is valid
  if (id) {
    // check for optional fields
    if (protocol || url || method || sucessCodes || timeOutSeconds) {
      // Lookup the check \
      _data.read('checks', id, function (err, checkData) {
        if (!err && checkData) {
          const token = typeof(data.headers.token) === 'string' && data.headers.token.trim().length === 20 ? data.headers.token.trim():false;


            console.log(token);


          // Verify that the given token is valid and belongd to the user who created the check
          handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
            if (tokenIsValid){
              // Update the check where necessary
              if (protocol) {
                checkData.protocol = protocol;
              }
              if (url) {
                checkData.url = url;
              }
              if (method) {
                checkData.method = method;
              }
              if (sucessCodes) {
                checkData.sucessCodes = sucessCodes;
              }
              if (timeOutSeconds) {
                checkData.timeOutSeconds = timeOutSeconds;
              }

              // Store the update
              _data.update('checks', id, checkData, function (err) {
                if (!err) {
                  callback(200);
                }else {
                  callback(500, {Error: 'could not update the check'});
                }
              });


            }else {
              callback(403)
            }
          });
        }else {
          callback(400, {Error: 'check id does not exist'});
        }
      });

    }else {
      callback(400, {Error: 'Missing fields to update'});
    }

  }else {
    callback(400, {Error: 'Missing required field'});
  }
};

//Checks - delete
// Required data: id
// optional data: name

handlers._checks.delete = function (data, callback) {

  // Check that the phone number is valid
  const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.length === 20 ? data.queryStringObject.id:false;
  if (id) {

    // look uo the check to be deleted
    _data.read('checks', id, function (err, checkData) {
      if (!err && checkData) {

        const token = typeof(data.headers.token) === 'string' && data.headers.token.trim().length === 20 ? data.headers.token.trim():false;
        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
          if (tokenIsValid) {

            // Delete the check data
            _data.delete('checks', id, function (err) {
              if (!err) {

                // Lookup the user
                _data.read('users', checkData.userPhone, function (err, userData) {
                  if (!err && userData) {

                    const userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];

                    // Remove the deleted check from the list of checks
                    const checkPosition = userChecks.indexOf(id);

                    if (checkPosition > -1) {

                      userChecks.splice(checkPosition, 1);
                      // resave the users data


                      _data.update('users', checkData.userPhone, userData, function (err) {
                        if (!err) {
                          callback(200);
                        }else {
                          callback(500, {Error: 'Could not update the user'});
                        }

                      });

                    }else {
                      callback(500, {Error: 'could not find the check in users object so could not remove it'});
                    }



                  }else {
                    callback(400, {Error: 'Could not find the specified user who created the check so could not remove the check from the list of user of object'});
                  }
                });



              }else {
                callback(500, {Error: 'could not delete the check data'});
              }
            });

          }else {
            callback(403, {Error:'missing required token in header or token is invalid'});

          }
        });


      }else {
        callback(400, {Error: 'specified check id dooes not exixt'});
      }

    });



  } else {
    callback(400, {Error:'Missing required field'});
  }



};




// Ping handler
handlers.ping = function(data, callback) {
  // Callback http status code, and a payload obj
  callback(200);

};

// Not found handlers
handlers.notFound = function(data, callback) {
  callback(404);

};


// Export handlers module
module.exports = handlers;
