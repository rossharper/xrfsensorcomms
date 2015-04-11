var mongoose = require('mongoose'),
    SerialPort = require('serialport').SerialPort;

mongoose.connect('mongodb://localhost/homecontrol');

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var buffer = "";
var messageLength = 12;


function processTemperatureMessage(temperature) {

}

function processBatteryMessage(batteryVoltage) {
    serialPort.write('aTAINTVL001M', function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
    });
}

function processMessage(message) {
    console.log("process: " + message);
    if(message[0] != 'a') return;
    var device = message.substr(1, 2);
    console.log("device: " + device);
    var payload = message.match(/(TMPA|BATT)(-?[0-9\.]{4,5})/);
    console.log(payload);
    if(payload) {
        if(payload[1] === 'TMPA') {
            processTemperatureMessage(payload[2]);
        }
        else if(payload[2] === 'BATT') {
            processBatteryMessage(payload[2]);
        }
    }
}

function processBuffer() {
    console.log("buffer: " + buffer);
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
            buffer += data;
            processBuffer();
            console.log('data received: ' + data);
        });
    }
});
