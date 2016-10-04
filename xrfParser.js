'use strict';

function getDeviceNameFromMessage(message) {
  return message.substr(1, 2);
}

module.exports = {
  getDeviceNameFromMessage: getDeviceNameFromMessage
};
