var SerialPort = require('serialport').SerialPort;
    SensorListener = require('./sensorlistener').SensorListener,
    TemperatureMessageHandler = require('./mongooseTempMessageHandler').TemperatureMessageHandler,
    BatteryMessageHandler = require('./mongooseBattMessageHandler').BatteryMessageHandler,
    MessageSender = require('./messageSender').MessageSender,
    IntervalUpdater = require('./intervalUpdater').IntervalUpdater,
    AwakeMessageHandler = require('./awakeMessageHandler').AwakeMessageHandler,
    xrfParser = require('./xrfParser'),
    AwakeMessageParser = require('./awakeMessageParser').AwakeMessageParser,
    BatteryMessageParser = require('./batteryMessageParser').BatteryMessageParser,
    TemperatureMessageParser = require('./temperatureMessageParser').TemperatureMessageParser,
    BatteryDataRepository = require('./mongooseBatteryDataRepository').BatteryDataRepository,
    TemperatureDataRepository = require('./mongooseTemperatureDataRepository').TemperatureDataRepository,
    mongoose = require('mongoose');

var messageInterval = 30;

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

mongoose.connect('mongodb://localhost/homecontrol');

function createMessageParsers() {
    var tempDataRepository = new TemperatureDataRepository(mongoose);
    var battDataRepository = new BatteryDataRepository(mongoose);

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
            console.log("logging " + device + " battery health: " + batteryVoltage);
            battDataRepository.storeBatteryValue(device, batteryVoltage);
        });

    return [
        awakeMessageParser,
        tempMessageParser,
        battMessageParser
    ];
}

var sensorListener = new SensorListener(serialPort, createMessageParsers());

sensorListener.listen();
