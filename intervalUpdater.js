'use strict';

function IntervalUpdater(messageSender, intervalSeconds) {
  this.sendIntervalUpdate = function (device) {
    messageSender.sendMessage(createIntervalMessage(device, intervalSeconds));
  };
}

function createIntervalMessage(device, intervalSeconds) {
  const intervalSecondsStr = `${intervalSeconds}`;
  const pad = '000';
  const paddedInterval = pad.substring(0, pad.length - intervalSecondsStr.length) + intervalSecondsStr;
  return `a${device}INTVL${paddedInterval}S`;
}

module.exports = {
  IntervalUpdater: IntervalUpdater
};
