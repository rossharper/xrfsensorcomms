var xrfParser = require('./xrfParser'),
    AwakeMessageParser = require('./awakeMessageParser').AwakeMessageParser,
    BatteryMessageParser = require('./batteryMessageParser').BatteryMessageParser,
    TemperatureMessageParser = require('./temperatureMessageParser').TemperatureMessageParser,
    dataRepositoryFactory = require('./dataRepositoryFactory');

function createMessageParsers(intervalUpdater) {
    var tempDataRepository = dataRepositoryFactory.createTemperatureDataRepository();
    var battDataRepository = dataRepositoryFactory.createBatteryDataRepository();

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

    return [
        awakeMessageParser,
        tempMessageParser,
        battMessageParser
    ];
}

module.exports = {
    createMessageParsers : createMessageParsers
}
