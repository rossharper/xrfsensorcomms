'use strict';

const BatteryDataRepository = require('./FileSystemBatteryDataRepository').BatteryDataRepository;
const BatteryLowDataRepository = require('./FileSystemBatteryLowDataRepository').BatteryLowDataRepository;
const TemperatureDataRepository = require('./FileSystemTemperatureDataRepository').TemperatureDataRepository;
const HumidityDataRepository = require('./FileSystemHumidityDataRepository').HumidityDataRepository;

module.exports = {
  createBatteryDataRepository: function (sensorDataPath) {
    return new BatteryDataRepository(sensorDataPath);
  },
  createTemperatureDataRepository: function (sensorDataPath) {
    return new TemperatureDataRepository(sensorDataPath);
  },
  createHumidityDataRepository: function (sensorDataPath) {
    return new HumidityDataRepository(sensorDataPath);
  },
  createBatteryLowDataRepository: function (sensorDataPath) {
    return new BatteryLowDataRepository(sensorDataPath);
  }
};
