'use strict';

const MessageSender = require('./messageSender').MessageSender;
const IntervalUpdater = require('./intervalUpdater').IntervalUpdater;
const messageParserFactory = require('./messageParserFactory');

const messageLength = 12;

function SensorListener(serialPort, messageInterval, sensorDataPath) {
  let buffer = '';
  const messageParsers = messageParserFactory.createMessageParsers(
    new IntervalUpdater(new MessageSender(serialPort), messageInterval),
    sensorDataPath);

  function parseMessage(message) {
    if (message[0] !== 'a') return;

    for (let i = 0; i < messageParsers.length; i++) {
      const parsed = messageParsers[i].parseMessage(message);
      if (parsed) break;
    }
  }

  function processBuffer() {
    while (buffer.length >= messageLength) {
      const message = buffer.substr(0, messageLength);
      //console.log('PROCESS message: ' + message);
      buffer = buffer.substr(messageLength);
      //console.log('POST-PROCESS buffer: ' + buffer);
      parseMessage(message);
    }
  }

  this.listen = function () {
    serialPort.open((error) => {
      if (error) {
        console.log('failed to open: ' + error);
      } else {
        console.log('open');
        serialPort.on('data', (data) => {

          console.log('data received: ' + data);

          buffer += data;
          //console.log('buffer after data receive: ' + buffer);

          processBuffer();
        });
      }
    });
  };
}

module.exports = {
  SensorListener: SensorListener
};
