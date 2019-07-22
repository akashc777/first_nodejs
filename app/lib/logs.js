/*
*
* This is Library for storing and rotating logs
*
*/

// Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');


// Container for the module
const lib = {};


// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.logs/');

// Append a string to a file ..... create a file if it does not exist.
lib.append = function (file, str, callback) {
  // open the file for appending
  fs.open(lib.baseDir+file+'.log', 'a', function (err, fileDescriptor) {
    if (!err && fileDescriptor) {
      // Append to the file and close it
      fs.appendFile(fileDescriptor, str + '\n', function (err) {
        if (!err) {
          fs.close(fileDescriptor, function (err) {
            if (!err) {
              callback(false);
            }else {
              callback('Error closing file that was being appended')
            }
          });

        }else {
          callback('Error appending to file')
        }
      });

    }else {
      callback('Could not open file for appending')
    }

  });
};

// List all the logs, and optionally include the compressred logs
lib.list = function (includeCompressedLogs, callback) {
  fs.readdir(lib.baseDir, function (err, data) {
    if (!err && data && data.length > 0) {
      const trimmedFileNames = []
      data.forEach(function (fileName) {
        // add the .logs file
        if (fileName.indexOf('.log') > -1) {
          trimmedFileNames.push(fileName.replace('.log', ''));
        }

        // Add on the .gz  file to the array
        if (fileName.indexOf('.gz.b64') > -1  && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace('.gz.b64', ''));
        };
      });
      callback(false, trimmedFileNames);
    }else {
      callback(err, data);
    }
  });
};


// Compress the contents of one .log file into a .gz.b64 file within the same directory
lib.compress = function (logId, newFileId, callback) {
  const sourceFile = logId+'.log';
  const destinationFile = newFileId+'.gz.b64';

  // Read the source file
  fs.readFile(lib.baseDir + sourceFile, 'utf8', function (err, inputString) {
    if (!err && inputString) {
      // compress the data using gzip
      zlib.gzip(inputString, function (err, buffer) {
        if (!err && buffer) {
          // Send the data to the deatination file
          fs.open(lib.baseDir+destinationFile,'wx', function (err, fileDescriptor) {
            if (!err && fileDescriptor) {
              // write do the destination file
              fs.writeFile(fileDescriptor, buffer.toString('base64'), function (err) {
                if (!err) {
                  // Close the destination file
                  fs.close(fileDescriptor, function (err) {
                    if (!err) {
                      callback(false);
                    }else {
                      callback(err);
                    }
                  });
                }else {
                  callback(err);
                }
              });
            }else {
              callback(err);
            }
          });
        }else {
          callback(err)
        }
      });
    }else {
      callback(err);
    }

  });
};


// Decompress the contents of the .gz.b64 to a string var
lib.decompress = function (fileId, callback) {
  const fileName = fileId+'.gz.b64';
  fs.readFile(lib.baseDir+fileName, 'utf8', function (err, str) {
    if (!err && str) {
      // Decompress the data
      const inputBuffer = Buffer.from(str, 'base64');
      zlib.unzip(inputBuffer, function (err, outputBuffer) {
        if (!err && outputBuffer) {
          // Callback
          const str = outputBiffer.toString();
          callback(false, str);
        }else {
          callback(err);
        }
      });
    }else {
      callback(err);
    }
  });
};


// Truncate a log file
lib.truncate = function (logId, callback) {
  fs.truncate(lib.baseDir+logId+'.log', 0, function (err) {
    if (!err) {
      callback(false);
    }else {
      callback(err);
    }
  });
};









// Export the module
module.exports = lib;
