var mongoose = require('mongoose'),
    SerialPort = require('serialport').SerialPort;
    SensorListener = require('sensorlistener').SensorListener,
    TemperatureMessageHandler = require('mongooseTempMessageHandler').TemperatureMessageHandler;

mongoose.connect('mongodb://localhost/homecontrol');

var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var sensorlistener = new SensorListener(serialPort);

var buffer = "";
var messageLength = 12;
/*
var temperatureSchema = mongoose.Schema({
    device: String,
    temperature: Number,
    date: { type: Date, default: Date.now }
});
var Temperature = mongoose.model('temperatures', temperatureSchema);
*/
var batterySchema = mongoose.Schema({
    device: String,
    batteryVoltage: Number,
    date: { type: Date, default: Date.now }
});
var Battery = mongoose.model('batteryLevels', batterySchema);
/*
function processTemperatureMessage(device, temperature) {
    console.log("logging " + device + " temperature: " + temperature);
    var temp = new Temperature();
    temp.device = device;
    temp.temperature = temperature;
    temp.save(function (err) {
        if(err) {
            console.error("Error writing temp to db: " + err);
        }
    });
}
*/
var tempMessageHandler = new TemperatureMessageHandler(mongoose);
function processTemperatureMessage(device, temperature) {
    tempMessageHandler.handleMessage(device, temperature);
}

function processBatteryMessage(device, batteryVoltage) {
    console.log("logging " + device + " battery health: " + batteryVoltage);
    var battery = new Battery();
    battery.device = device;
    battery.batteryVoltage = batteryVoltage;
    battery.save(function (err) {
        if(err) {
            console.error("Error writing batt to db: " + err); // validator error
        }
    });
}

function processMessage(message) {
    if(message[0] != 'a') return;
    var device = message.substr(1, 2);
    var payload = message.match(/(TMPA|BATT)(-?[0-9\.]{4,5})/);
    if(payload) {
        if(payload[1] === 'TMPA') {
            processTemperatureMessage(device, payload[2]);
        }
        else if(payload[1] === 'BATT') {
            processBatteryMessage(device, payload[2]);
        }
    }
}

function sendIntervalUpdate() {
    serialPort.write('aTAINTVL002M', function(err, results) {
        if(err) {
            console.log('write err ' + err);
        }
        serialPort.drain();
    });
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

            if(data.toString().indexOf("BATT") >= 0) {
                sendIntervalUpdate();
            }

            buffer += data;
            processBuffer();
        });
    }
});
