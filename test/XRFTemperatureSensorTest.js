'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

describe('temporary end-to-end refactoring tests', () => {

  // these tests have dodgy waits in,
  // because the serial port call with data is synchronous, but
  // the file writing is async fire and forget
  // making file writing may make the serial processing too slow (for the awake interval message to fire in time)
  // setImmediate doesn't make the test wait long enough for the test to pass
  // so for now, to enable safe refactoring, there are dodgy waits
  // once appropriate test seams are in place, these waits can be removed.

  const SENSOR_PATH = './testsensordata';

  const SensorListener = require('../sensorlistener').SensorListener;

  let onDataCb;

  let serialPortStub = {
    open: function (cb) {
      if (cb) cb();
    },
    drain: function (cb) {
      if (cb) cb();
    },
    close: function (cb) {
      if (cb) cb();
    },
    on: function (event, cb) {
      if (event === 'data') {
        onDataCb = cb;
      }
    },
    write: function (message, cb) {
      if (cb) cb();
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

    setTimeout(() => {
      const temperatureValue = readTemperatureValue('XA');
      expect(temperatureValue).to.equal('20.18');
      done();
    }, 500);
  });

  it('should save a battery level when message received', (done) => {
    onDataCb('aXBBATT2.78-');

    setTimeout(() => {
      const temperatureValue = readBatteryValue('XB');
      expect(temperatureValue).to.equal('2.78');
      done();
    }, 500);
  });

  it('should save a battery low flag when message received', (done) => {
    onDataCb('aXCBATTLOW--');

    setTimeout(() => {
      const battLowValue = readBatteryLowValue('XC');
      expect(battLowValue).to.equal('1');
      done();
    }, 500);
  });

  it('should save value when message split across serial port callbacks', (done) => {
    onDataCb('aXDTMPA2');
    onDataCb('1.12');

    setTimeout(() => {
      const temperatureValue = readTemperatureValue('XD');
      expect(temperatureValue).to.equal('21.12');
      done();
    }, 500);
  });

  it('should save both values when two in a row', (done) => {
    onDataCb('aXETMPA1');
    onDataCb('8.73aXEB');
    onDataCb('ATT3.01-');

    setTimeout(() => {
      const temperatureValue = readTemperatureValue('XE');
      const batteryValue = readBatteryValue('XE');
      expect(temperatureValue).to.equal('18.73');
      expect(batteryValue).to.equal('3.01');
      done();
    }, 500)
  });

  it('should save value when junk preceeds message', (done) => {
    onDataCb('JUNKaXFT');
    onDataCb('MPA19.63');

    setTimeout(() => {
      const temperatureValue = readTemperatureValue('XF');
      expect(temperatureValue).to.equal('19.63');
      done();
    }, 500);
  });

  it('should throw away junk messages that preceed message', (done) => {
    onDataCb('JUNKJUNK');
    onDataCb('JUNK');
    onDataCb('aXGTMPA1');
    onDataCb('8.11');

    setTimeout(() => {
      const temperatureValue = readTemperatureValue('XG');
      expect(temperatureValue).to.equal('18.11');
      done();
    }, 500);
  });

  it('should send the new interval when AWAKE message received', (done) => {
    let serialPortWriteSpy = chai.spy.on(serialPortStub, 'write');

    onDataCb('aXHAWAKE');
    onDataCb('----aXHB');
    onDataCb('ATT2.99-');

    expect(serialPortWriteSpy).to.have.been.called.with(`aXHINTVL120S`);
    done();
    ''
  });

  it('should send the new interval with padding when AWAKE message received', (done) => {
    sensorListener = new SensorListener(serialPortStub, 5, SENSOR_PATH);
    sensorListener.listen();
    let serialPortWriteSpy = chai.spy.on(serialPortStub, 'write');

    onDataCb('aXHAWAKE');
    onDataCb('----aXHB');
    onDataCb('ATT2.99-');

    expect(serialPortWriteSpy).to.have.been.called.with(`aXHINTVL005S`);
    done();
    ''
  });
});
