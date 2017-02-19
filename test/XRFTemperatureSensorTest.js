'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const chai = require('chai');
const expect = chai.expect;

describe.skip('temporary end-to-end refactoring tests', () => {

  // these tests fail, because the serial port call with data is synchronous, but
  // the file writing is async fire and forget
  // making file writing may make the serial processing too slow (for the awake interval message to fire in time)
  // setImmediate doesn't make the test wait long enough for the test to pass

  const SENSOR_PATH = './testsensordata';

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

  function readBatteryLowValue(sensorId) {
    return readSensorValue(sensorId, 'battlow');
  }

  function readSensorValue(sensorId, value) {
    return fs.readFileSync(path.join(SENSOR_PATH, sensorId, value), {
      encoding: 'utf8'
    });
  }

  function clearTestData(cb) {
    rimraf.sync(SENSOR_PATH);
  }

  beforeEach(() => {
    clearTestData();
    fs.mkdirSync(SENSOR_PATH);
    sensorListener = new SensorListener(serialPortStub, 120, SENSOR_PATH);
    sensorListener.listen();
  });

  afterEach(() => {
    sensorListener.stop();
    clearTestData();
  });

  it('should save a temperature when message received', (done) => {
    onDataCb('aXATMPA20.18');

    setImmediate(() => {
      const temperatureValue = readTemperatureValue('XA');
      expect(temperatureValue).to.equal('20.18');
      done();
    });
  });

  it('should save a battery level when message received', (done) => {
    onDataCb('aXBBATT2.78-');

    setImmediate(() => {
      const temperatureValue = readBatteryValue('XB');
      expect(temperatureValue).to.equal('2.78');
      done();
    });
  });

  it('should save a battery low flag when message received', (done) => {
    onDataCb('aXCBATTLOW--');

    setImmediate(() => {
      const battLowValue = readBatteryLowValue('XC');
      expect(battLowValue).to.equal('1');
      done();
    });
  });

  it('should save value when message split across serial port callbacks', (done) => {
    onDataCb('aXDTMPA2');
    onDataCb('1.12');

    setImmediate(() => {
      const temperatureValue = readTemperatureValue('XD');
      expect(temperatureValue).to.equal('21.12');
      done();
    });
  });
});
