'use strict';

const SensorDataFile = require('./SensorDataFile');

function FileSystemHumidityDataRepository(sensorDataPath) {
  this.storeHumidityValue = function (device, humidity) {
    SensorDataFile.writeSensorDataFile(sensorDataPath, 'hum', device, humidity);
  };
}

module.exports = {
  HumidityyDataRepository: FileSystemHumidityDataRepository
};
