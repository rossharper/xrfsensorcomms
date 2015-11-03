var fs = require('fs');

function FileSystemTemperatureDataRepository(sensorDataPath) {
    this.storeTemperatureValue = function(device, temperature) {
        var devicePath = sensorDataPath + '/' + device;
        ensureDeviceDirectoryExists(devicePath, function(err) {
            if (err) {
                console.log("Failed to create device directory: " + devicePath + " with err: " + err);
            }
            else {
                writeDeviceTemperatureValue(devicePath, temperature)
            }
        });
    }

    function writeDeviceTemperatureValue(devicePath, temperature) {
        var valueFilePath = devicePath + '/value';
        fs.writeFile(valueFilePath, temperature, function(err) {
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
}

module.exports = {
    TemperatureDataRepository : FileSystemTemperatureDataRepository
}
