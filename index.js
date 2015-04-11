var mongoose = require('mongoose'),
    SerialPort = require('serialport').SerialPort;

mongoose.connect('mongodb://localhost/homecontrol');

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var buffer = "";
var messageLength = 12;

function processMessage(message) {
    if(message[0] != 'a') return;
    var device = message.substring(1, 2);
    var payload = message.match(/(TMPA|BATT)(-?[0-9\.]{4,5})/);
    console.log(payload);
}

function processBuffer() {
    while(buffer >= messageLength) {
        var message = buffer.substring(0, messageLength);
        buffer = buffer.substring(messageLength);
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
