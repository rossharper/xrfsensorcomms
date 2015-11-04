var fs = require('fs');

function writeSensorDataFile(sensorDataPath, device, value) {
    var devicePath = sensorDataPath + '/' + device;
    ensureDeviceDirectoryExists(devicePath, function(err) {
        if (err) {
            console.log("Failed to create device directory: " + devicePath + " with err: " + err);
        }
        else {
            writeDeviceDataValue(devicePath, value)
        }
    });
}

function writeDeviceDataValue(filePath, value) {
    fs.writeFile(filePath, value, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

function ensureDeviceDirectoryExists(path, callback) {
    fs.mkdir(path, function(err) {
        if (err) {
            if (err.code == 'EEXIST') callback(null); // ignore the error if the folder already exists
            else callback(err); // something else went wrong
        } else callback(null); // successfully created folder
    });
}

module.exports = {
    writeSensorDataFile : writeSensorDataFile
}
