'use strict';

const SensorDataFile = require('./SensorDataFile');

function FileSystemTemperatureDataRepository(sensorDataPath) {

  this.storeTemperatureValue = function (device, temperature) {
    SensorDataFile.writeSensorDataFile(sensorDataPath, 'value', device, temperature);
  };
}

module.exports = {
  TemperatureDataRepository: FileSystemTemperatureDataRepository
};
