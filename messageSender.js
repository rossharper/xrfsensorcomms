'use strict';

function MessageSender(serialPort) {
  this.sendMessage = function (message) {
    console.log(`${new Date().toISOString()} sending message: ${message}`);
    serialPort.write(message, (err) => {
      if (err) {
        console.log(`${new Date().toISOString()} message sender serial port write err ${err}`);
      }
      serialPort.drain();
    });
  };
}

module.exports = {
  MessageSender: MessageSender
};
