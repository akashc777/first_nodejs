/*
*
*
* Library for storing and editing data
*
*
*/

// Dependencies

const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container for the module (to be exported)
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join( __dirname , '/../.data/')

// Write data to a file
lib.create = (dir, file, data, callback) => {
  // Open the file for writting
  fs.open(lib.baseDir + dir + '/' + file + '.json','wx', (err, fileDescriptor) => {
    if(!err && fileDescriptor){
      // Convert data to stringif
      const stringData = JSON.stringify(data);

      // Write to file and close interval
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if(!err){
          fs.close(fileDescriptor, (err) => {
            if(!err){
              callback(false);
            }else{
              callback('Error closing to new file');
            }
          });

        }else{
          callback('Error writting to new file');
        }
      });

    }
    else{
      callback('Could not create new file, it may already exist');
    }
  });
};

// REad data from the file

lib.read = function(dir, file, callback){
  fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data){
    if(!err && data){
      let parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    }else{
        callback(err, data);
    }

  });
};

// Update data inside a file
lib.update = (dir, file, data, callback) => {
  // open the file for writting
  fs.open(lib.baseDir + dir + '/' + file + '.json','r+', function(err, fileDescriptor){
    if(!err && fileDescriptor){
      // Convert data to stringif
      const stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fileDescriptor, (err) => {
        if (!err) {
          // Write to the file and close interval
          fs.writeFile(fileDescriptor, stringData, () => {
            if(!err){
              fs.close(fileDescriptor,function(err){
                if(!err){
                  callback(false);
                }else{
                  callback('error closing the exixtingfile')
                }
              });
            }else{
              callback('writing to a existing file');
            }

          });

        }
        else{
          callback('Error truncating file');
        }
      });

    }else{
      callback('Could not open the file for update, it may not exist')
    }
  })
};


// Delete a file
lib.delete = function(dir, file, callback){
  // Unlink the file
  fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
    if(!err){
      callback(false);
    }
    else{
      callback('Error deleting file');
    }

  });
};





// Export the module
module.exports = lib;