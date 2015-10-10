var SerialPort = require('serialport').SerialPort;
    SensorListener = require('./sensorlistener').SensorListener;

var messageInterval = 30;
var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var sensorListener = new SensorListener(
    serialPort,
    messageInterval 
    );

sensorListener.listen();
