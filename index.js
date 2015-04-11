var mongoose = require('mongoose'),
    SerialPort = require('serialport').SerialPort;

mongoose.connect('mongodb://localhost/homecontrol');

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var buffer = "";
var messageLength = 12;

function parseMessage(messageStr) {
    var messageComponents = messageStr.match(/a([A-Z]{2})([A-Z0-9\.\-]{9})/);
    console.log(messageComponents);
}

function processBuffer() {
    if(buffer.length == messageLength) {
        var messageStr = buffer;
        buffer = "";
        var message = parseMessage(messageStr);
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
