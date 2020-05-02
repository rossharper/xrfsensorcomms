'use strict';

const SerialPort = require('serialport');
const SensorListener = require('./sensorlistener').SensorListener;
const onDeath = require('death');

const MESSAGE_INTERVAL = 120;
const DEFAULT_SENSOR_DATA_PATH = '/var/lib/homecontrol/sensordata/temperatureSensors';
const serialPort = new SerialPort('/dev/ttyAMA0', {
  baudRate: 9600,
  autoOpen: false
});

function usage() {
  console.log('Usage: ');
  console.log('  node index.js [-sensorpath <SENSOR_DATA_PATH>]');
  console.log('');
  console.log('-sensorpath    path at which temperature sensor data will be written');
  process.exit();
}

function parseArgs() {
  const args = {
    sensorDataPath: DEFAULT_SENSOR_DATA_PATH
  };

  let argi = 2;

  function hasArg(arg) {
    return process.argv[argi] === arg;
  }

  function readArgValue() {
    return process.argv[++argi] || usage();
  }

  for (; argi < process.argv.length; argi++) {
    if (hasArg('-sensorpath')) {
      args.sensorDataPath = readArgValue();
    } else {
      usage();
    }
  }

  return args;
}

function start(args) {
  const sensorListener = new SensorListener(
    serialPort,
    MESSAGE_INTERVAL,
    args.sensorDataPath
  );

  onDeath(() => {
    sensorListener.stop();
  });

  sensorListener.listen();
}
start(parseArgs());
