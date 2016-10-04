'use strict';

const xrfParser = require('./xrfParser');
const AwakeMessageParser = require('./awakeMessageParser').AwakeMessageParser;
const BatteryMessageParser = require('./batteryMessageParser').BatteryMessageParser;
const BatteryLowMessageParser = require('./batteryLowMessageParser').BatteryLowMessageParser;
const TemperatureMessageParser = require('./temperatureMessageParser').TemperatureMessageParser;
const dataRepositoryFactory = require('./dataRepositoryFactory');

function createMessageParsers(intervalUpdater, sensorDataPath) {
  const tempDataRepository = dataRepositoryFactory.createTemperatureDataRepository(sensorDataPath);
  const battDataRepository = dataRepositoryFactory.createBatteryDataRepository(sensorDataPath);
  const battLowDataRepository = dataRepositoryFactory.createBatteryLowDataRepository(sensorDataPath);

  const awakeMessageParser = new AwakeMessageParser(
    xrfParser,
    (device) => {
      intervalUpdater.sendIntervalUpdate(device);
    });

  const tempMessageParser = new TemperatureMessageParser(
    xrfParser,
    (device, temperature) => {
      console.log(`logging ${device} temperature: ${temperature}`);
      tempDataRepository.storeTemperatureValue(device, temperature);
    });

  const battMessageParser = new BatteryMessageParser(
    xrfParser,
    (device, voltage) => {
      console.log(`logging ${device} battery health: ${voltage}`);
      battDataRepository.storeBatteryValue(device, voltage);
    });

  const battLowMessageParser = new BatteryLowMessageParser(
    xrfParser,
    (device) => {
      console.log(`logging BATTERY LOW for device ${device}`);
      battLowDataRepository.storeBatteryLowFlag(device);
    }
  );

  return [
    awakeMessageParser,
    tempMessageParser,
    battMessageParser,
    battLowMessageParser
  ];
}

module.exports = {
  createMessageParsers: createMessageParsers
};
