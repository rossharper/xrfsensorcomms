'use strict';

function BatteryLowMessageParser(xrfParser, onBattLowCallback) {
  this.parseMessage = function (message) {
    const payload = message.match(/a[A-Z0-9][A-Z0-9]BATTLOW--/);
    if (payload) {
      onBattLowCallback(xrfParser.getDeviceNameFromMessage(message));
      return true;
    }
    return false;
  };
}

module.exports = {
  BatteryLowMessageParser: BatteryLowMessageParser
};
