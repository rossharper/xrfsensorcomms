var xrfParser = require('./xrfParser'),
    AwakeMessageParser = require('./awakeMessageParser').AwakeMessageParser,
    BatteryMessageParser = require('./batteryMessageParser').BatteryMessageParser,
    BatteryLowMessageParser = require('./batteryLowMessageParser').BatteryLowMessageParser,
    TemperatureMessageParser = require('./temperatureMessageParser').TemperatureMessageParser,
    dataRepositoryFactory = require('./dataRepositoryFactory');

function createMessageParsers(intervalUpdater, sensorDataPath) {
    var tempDataRepository = dataRepositoryFactory.createTemperatureDataRepository(sensorDataPath);
    var battDataRepository = dataRepositoryFactory.createBatteryDataRepository(sensorDataPath);
    var battLowDataRepository = dataRepositoryFactory.createBatteryLowDataRepository(sensorDataPath);

    var awakeMessageParser = new AwakeMessageParser(
        xrfParser,
        function(device) {
            intervalUpdater.sendIntervalUpdate(device);
    });

    var tempMessageParser = new TemperatureMessageParser(
        xrfParser,
        function(device, temperature) {
            console.log("logging " + device + " temperature: " + temperature);
            tempDataRepository.storeTemperatureValue(device, temperature);
    });

    var battMessageParser = new BatteryMessageParser(
        xrfParser,
        function(device, voltage) {
            console.log("logging " + device + " battery health: " + voltage);
            battDataRepository.storeBatteryValue(device, voltage);
    });

    var battLowMessageParser = new BatteryLowMessageParser(
        xrfParser,
        function(device) {
            console.log("logging BATTERY LOW for device " + device);
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
    createMessageParsers : createMessageParsers
}
