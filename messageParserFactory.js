var MessageSender = require('./messageSender').MessageSender,
    IntervalUpdater = require('./intervalUpdater').IntervalUpdater,
    AwakeMessageHandler = require('./awakeMessageHandler').AwakeMessageHandler,
    xrfParser = require('./xrfParser'),
    AwakeMessageParser = require('./awakeMessageParser').AwakeMessageParser,
    BatteryMessageParser = require('./batteryMessageParser').BatteryMessageParser,
    TemperatureMessageParser = require('./temperatureMessageParser').TemperatureMessageParser,
    dataRepositoryFactory = require('./dataRepositoryFactory');

var messageInterval = 30;

function createMessageParsers() {
    var tempDataRepository = dataRepositoryFactory.createTemperatureDataRepository();
    var battDataRepository = dataRepositoryFactory.createBatteryDataRepository();

    var awakeMessageHandler = new AwakeMessageHandler( 
        new IntervalUpdater(new MessageSender(serialPort)), 
        messageInterval);

    var awakeMessageParser = new AwakeMessageParser(
        xrfParser, 
        function(device) {
            awakeMessageHandler.handleMessage(device);
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
