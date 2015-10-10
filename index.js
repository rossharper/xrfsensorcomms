var mongoose = require('mongoose'),
    SerialPort = require('serialport').SerialPort;
    SensorListener = require('./sensorlistener').SensorListener,
    TemperatureMessageHandler = require('./mongooseTempMessageHandler').TemperatureMessageHandler,
    BatteryMessageHandler = require('./mongooseBattMessageHandler').BatteryMessageHandler;

mongoose.connect('mongodb://localhost/homecontrol');

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var sensorlistener = new SensorListener(serialPort);

var buffer = "";
var messageLength = 12;

var tempMessageHandler = new TemperatureMessageHandler(mongoose);
var battMessageHandler = new BatteryMessageHandler(mongoose);

function processMessage(message) {
    if(message[0] != 'a') return;
    
    var device = message.substr(1, 2);
    
    if(message.indexOf("AWAKE") >= 0) {
        sendIntervalUpdate();
    }
    else {
        var payload = message.match(/(TMPA|BATT)(-?[0-9\.]{4,5})/);
        if(payload) {
            if(payload[1] === 'TMPA') {
                tempMessageHandler.handleMessage(device, payload[2]);
            }
            else if(payload[1] === 'BATT') {
                battMessageHandler.handleMessage(device, payload[2]);
            }
        }
    } 
}

function MessageSender(serialPort) {
    this.serialPort = serialPort;
}

MessageSender.prototype.sendMessage(message) {
        serialPort.write(message, function(err, results) {
        if(err) {
            console.log('message sender serial port write err ' + err);
        }
        serialPort.drain();
    });
}

var intervalMinutes = "" + 2;
var pad = '000';
var paddedInterval = pad.substring(0, pad.length - intervalMinutes.length) + intervalMinutes;
var intervalMessage = 'aTAINTVL' + paddedInterval + 'M';

var messageSender = new MessageSender(serialPort);

function sendIntervalUpdate() {
    messageSender.sendMessage('aTAINTVL015S');
}

function processBuffer() {
    while(buffer.length >= messageLength) {
        var message = buffer.substr(0, messageLength);
        buffer = buffer.substr(messageLength);
        processMessage(message);
    }
}

serialPort.open(function (error) {
    if ( error ) {
        console.log('failed to open: '+error);
    } else {
        console.log('open');
        serialPort.on('data', function(data) {
            console.log('data received: ' + data);

            // if(data.toString().indexOf("BATT") >= 0) {
            //     sendIntervalUpdate();
            // }

            buffer += data;
            processBuffer();
        });
    }
});
