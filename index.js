var mongoose = require('mongoose'),
    SerialPort = require('serialport').SerialPort;
    SensorListener = require('./sensorlistener').SensorListener,
    TemperatureMessageHandler = require('./mongooseTempMessageHandler').TemperatureMessageHandler,
    BatteryMessageHandler = require('./mongooseBattMessageHandler').BatteryMessageHandler,
    MessageSender = require('./messageSender').MessageSender,
    IntervalUpdater = require('./intervalUpdater').IntervalUpdater,
    AwakeMessageHandler = require('./awakeMessageHandler').AwakeMessageHandler,
    xrfParser = require('./xrfParser'),
    AwakeMessageParser = require('./awakeMessageParser').AwakeMessageParser;

mongoose.connect('mongodb://localhost/homecontrol');

var messageInterval = 30;

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var sensorlistener = new SensorListener(serialPort);

var buffer = "";
var messageLength = 12;

var tempMessageHandler = new TemperatureMessageHandler(mongoose);
var battMessageHandler = new BatteryMessageHandler(mongoose);

var awakeMessageHandler = new AwakeMessageHandler( 
    new IntervalUpdater(new MessageSender(serialPort)), 
    messageInterval);

var awakeMessageParser = new AwakeMessageParser(
    xrfParser, 
    function(device) {
        awakeMessageHandler.handleMessage(device);
    });

function TemperatureMessageParser(xrfParser, onTempCallback) {
    this.parseMessage = function(message) {
        var payload = message.match(/TMPA(-?[0-9\.]{4,5})/);
        if(payload) {
            onTempCallback(
                xrfParser.getDeviceNameFromMessage(message),
                payload[1]);
            return true;
        }
        return false;
    }
}

var tempMessageParser = new TemperatureMessageParser(
    xrfParser,
    function(device, temperature) {
        tempMessageHandler.handleMessage(device, temperature);
    });

function BatteryMessageParser(xrfParser, onBattCallback) {
    this.parseMessage = function(message) {
        var payload = message.match(/BATT(-?[0-9\.]{4,5})/);
        if(payload) {
            onBattCallback(
                xrfParser.getDeviceNameFromMessage(message),
                payload[1]);
            return true;
        }
        return false;
    }
}

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

function parseMessage(message) {
    if(message[0] != 'a') return;

    for (var i = 0; i < messageParsers.length; i++) {
        parsed = messageParsers[i].parseMessage(message);
        if(parsed) break;
    };
}

function processBuffer() {
    while(buffer.length >= messageLength) {
        var message = buffer.substr(0, messageLength);
        buffer = buffer.substr(messageLength);
        parseMessage(message);
    }
}

serialPort.open(function (error) {
    if ( error ) {
        console.log('failed to open: '+error);
    } else {
        console.log('open');
        serialPort.on('data', function(data) {
            console.log('data received: ' + data);

            buffer += data;
            processBuffer();
        });
    }
});
