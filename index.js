var SerialPort = require('serialport').SerialPort;
    SensorListener = require('./sensorlistener').SensorListener;

var MESSAGE_INTERVAL = 120;
var serialPort = new SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
});

var DEFAULT_SENSOR_DATA_PATH = "/var/lib/homecontrol/sensordata/temperatureSensors"

function usage() {
    console.log("Usage: ");
    console.log("  node index.js [-sensorpath <SENSOR_DATA_PATH>]");
    console.log("");
    console.log("-sensorpath    path at which temperature sensor data will be written");
    process.exit();
}

function parseArgs() {
    var args = {
        sensorDataPath : DEFAULT_SENSOR_DATA_PATH
    };

    function hasArg(arg) {
        return process.argv[argi] === arg;
    }

    function readArgValue() {
        return process.argv[++argi] || usage();
    }

    for(var argi = 2; argi < process.argv.length; argi++) {
        if(hasArg('-sensorpath')) {
            args.sensorDataPath = readArgValue();
        }
        else {
            usage();
        }
    }

    return args;
}

function start(args){
    var sensorListener = new SensorListener(
        serialPort,
        MESSAGE_INTERVAL,
        args.sensorDataPath
    );

    sensorListener.listen();
}
start(parseArgs());
