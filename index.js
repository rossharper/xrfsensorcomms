var SerialPort = require('serialport').SerialPort;
    SensorListener = require('./sensorlistener').SensorListener,
    messageParserFactory = require('./messageParserFactory');

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var sensorListener = new SensorListener(
    serialPort, 
    messageParserFactory.createMessageParsers());

sensorListener.listen();
