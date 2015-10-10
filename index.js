var mongoose = require('mongoose'),
    SerialPort = require('serialport').SerialPort;
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
    TemperatureDataRepository = require('./mongooseTemperatureDataRepository').TemperatureDataRepository;

mongoose.connect('mongodb://localhost/homecontrol');

var messageInterval = 30;

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var tempMessageHandler = new TemperatureMessageHandler(new TemperatureDataRepository(mongoose));
var battMessageHandler = new BatteryMessageHandler(new BatteryDataRepository(mongoose));

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
        tempMessageHandler.handleMessage(device, temperature);
    });

var battMessageParser = new BatteryMessageParser(
    xrfParser,
    function(device, voltage) {
        battMessageHandler.handleMessage(device, voltage);
    });

var messageParsers = [
    awakeMessageParser,
    tempMessageParser,
    battMessageParser
];

var sensorListener = new SensorListener(serialPort, messageParsers);

sensorListener.listen();
