'use strict';

function TemperatureMessageParser(xrfParser, onTempCallback) {
  this.parseMessage = function (message) {
    const payload = message.match(/a[A-Z0-9][A-Z0-9]TMPA(-?[0-9\.]{4,5})/);
    if (payload) {
      onTempCallback(
        xrfParser.getDeviceNameFromMessage(message),
        payload[1]);
      return true;
    }
    return false;
  };
}

module.exports = {
  TemperatureMessageParser: TemperatureMessageParser
};
