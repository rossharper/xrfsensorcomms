'use strict';

const xrfParser = require('./xrfParser');
const BatteryMessageParser = require('./batteryMessageParser').BatteryMessageParser;
const BatteryLowMessageParser = require('./batteryLowMessageParser').BatteryLowMessageParser;
const TemperatureMessageParser = require('./temperatureMessageParser').TemperatureMessageParser;
const dataRepositoryFactory = require('./dataRepositoryFactory');

function createMessageParsers(sensorDataPath) {
  const tempDataRepository = dataRepositoryFactory.createTemperatureDataRepository(sensorDataPath);
  const battDataRepository = dataRepositoryFactory.createBatteryDataRepository(sensorDataPath);
  const battLowDataRepository = dataRepositoryFactory.createBatteryLowDataRepository(sensorDataPath);

  const tempMessageParser = new TemperatureMessageParser(
    xrfParser,
    (device, temperature) => {
      console.log(`${new Date().toISOString()} logging ${device} temperature: ${temperature}`);
      tempDataRepository.storeTemperatureValue(device, temperature);
    });

  const battMessageParser = new BatteryMessageParser(
    xrfParser,
    (device, voltage) => {
      console.log(`${new Date().toISOString()} logging ${device} battery health: ${voltage}`);
      battDataRepository.storeBatteryValue(device, voltage);
    });

  const battLowMessageParser = new BatteryLowMessageParser(
    xrfParser,
    (device) => {
      console.log(`${new Date().toISOString()} logging BATTERY LOW for device ${device}`);
      battLowDataRepository.storeBatteryLowFlag(device);
    }
  );

  return [
    tempMessageParser,
    battMessageParser,
    battLowMessageParser
  ];
}

module.exports = {
  createMessageParsers: createMessageParsers
};
