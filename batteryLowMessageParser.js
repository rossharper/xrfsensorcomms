'use strict';

function BatteryLowMessageParser(xrfParser, onBattLowCallback) {
  this.parseMessage = function (message) {
    const payload = message.match(/a[A-Z][A-Z]BATTLOW--/);
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
