'use strict';

function HumidtyeMessageParser(xrfParser, onHumidityCallback) {
  this.parseMessage = function (message) {
    const payload = message.match(/a[A-Z0-9][A-Z0-9]HUM(-?[0-9\.]{4,5})/);
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
  HumidityMessageParser: HumidityMessageParser
};
