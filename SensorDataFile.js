'use strict';

const fs = require('fs');

function writeSensorDataFile(sensorDataPath, dataFile, device, value) {
  // TODO: use path.join!
  const devicePath = sensorDataPath + '/' + device;
  ensureDeviceDirectoryExists(devicePath, (err) => {
    if (err) {
      console.log(`${new Date().toISOString()} Failed to create device directory: ${devicePath} with err: ${err}`);
    } else {
      writeDeviceDataValue(devicePath + '/' + dataFile, value);
    }
  });
}

function writeDeviceDataValue(filePath, value) {
  fs.writeFile(filePath, value, (err) => {
    if (err) {
      return console.log(`${new Date().toISOString()} failed to write data value: ${err}`);
    }
  });
}

function ensureDeviceDirectoryExists(path, callback) {
  fs.mkdir(path, (err) => {
    if (err) {
      if (err.code === 'EEXIST') callback(null); // ignore the error if the folder already exists
      else callback(err); // something else went wrong
    } else callback(null); // successfully created folder
  });
}

module.exports = {
  writeSensorDataFile: writeSensorDataFile
};
