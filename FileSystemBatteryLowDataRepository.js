'use strict';

const SensorDataFile = require('./SensorDataFile');

function FileSystemBatteryLowDataRepository(sensorDataPath) {
  this.storeBatteryLowFlag = function (device) {
    SensorDataFile.writeSensorDataFile(sensorDataPath, 'battlow', device, '1');
  };
}

module.exports = {
  BatteryLowDataRepository: FileSystemBatteryLowDataRepository
};
