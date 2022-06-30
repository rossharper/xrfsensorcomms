'use strict';

function BatteryMessageParser(xrfParser, onBattCallback) {
  this.parseMessage = function (message) {
    const payload = message.match(/a[A-Z0-9][A-Z0-9]BATT(-?[0-9\.]{4,5})/);
    if (payload) {
      onBattCallback(
        xrfParser.getDeviceNameFromMessage(message),
        payload[1]);
      return true;
    }
    return false;
  };
}

module.exports = {
  BatteryMessageParser: BatteryMessageParser
};
