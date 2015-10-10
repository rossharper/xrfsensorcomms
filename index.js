var mongoose = require('mongoose'),
    SerialPort = require('serialport').SerialPort;
    SensorListener = require('./sensorlistener').SensorListener,
    TemperatureMessageHandler = require('./mongooseTempMessageHandler').TemperatureMessageHandler,
    BatteryMessageHandler = require('./mongooseBattMessageHandler').BatteryMessageHandler,
    MessageSender = require('./messageSender').MessageSender,
    IntervalUpdater = require('./intervalUpdater').IntervalUpdater;

mongoose.connect('mongodb://localhost/homecontrol');

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var sensorlistener = new SensorListener(serialPort);

var buffer = "";
var messageLength = 12;

var tempMessageHandler = new TemperatureMessageHandler(mongoose);
var battMessageHandler = new BatteryMessageHandler(mongoose);

var messageSender = new MessageSender(serialPort);
var intervalUpdater = new IntervalUpdater(messageSender, 'TA', 30);

function onAwake(device) {
    new Intervalupdater(messageSender, device, 15).sendIntervalUpdate();
}

function parseMessage(message) {
    if(message[0] != 'a') return;
    
    var device = message.substr(1, 2);
    
    if(message.indexOf("AWAKE") >= 0) {
        onAwake();
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
