'use strict';

const fs = require('fs');
const path = require('path');

const chai = require('chai');
const expect = chai.expect;

describe('temporary end-to-end refactoring tests', () => {

  const SENSOR_PATH = '/var/lib/homecontrol/sensordata/temperatureSensors';

  const SensorListener = require('../sensorlistener').SensorListener;

  let onDataCb;

  let serialPortStub = {
    open: function (cb) {
      cb();
    },
    drain: function (cb) {
      cb();
    },
    close: function () {},
    on: function (event, cb) {
      if (event === 'data') {
        onDataCb = cb;
      }
    }
  };
  let sensorListener;

  function readTemperatureValue(sensorId) {
    return readSensorValue(sensorId, 'value');
  }

  function readBatteryValue(sensorId) {
    return readSensorValue(sensorId, 'batt');
  }

  function readSensorValue(sensorId, value) {
    return fs.readFileSync(path.join(SENSOR_PATH, sensorId, value), {
      encoding: 'utf8'
    });
  }

  beforeEach(() => {
    sensorListener = new SensorListener(serialPortStub, 120, '/var/lib/homecontrol/sensordata/temperatureSensors');
    sensorListener.listen();
  });

  afterEach(() => {
    sensorListener.stop();
  });

  it('should save a temperature when message received', () => {
    onDataCb('aAATMPA20.18');

    setImmediate(() => {
      const temperatureValue = readTemperatureValue('AA');
      expect(temperatureValue).to.equal('20.18');
    });
  });

  it('should save a battery level when message received', () => {
    onDataCb('aZZBATT2.78-');

    setImmediate(() => {
      const temperatureValue = readBatteryValue('ZZ');
      expect(temperatureValue).to.equal('2.78');
    });
  });
});
