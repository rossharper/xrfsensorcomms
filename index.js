var mongoose = require('mongoose'),
    SerialPort = require('serialport').SerialPort;

mongoose.connect('mongodb://localhost/homecontrol');

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var buffer = "";
var messageLength = 12;

function processMessage(message) {
    console.log("process: " + message);
    if(message[0] != 'a') return;
    var device = message.substr(1, 2);
    console.log("device: " + device);
    var payload = message.match(/(TMPA|BATT)(-?[0-9\.]{4,5})/);
    console.log(payload);
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
