'use strict';

const MessageSender = require('./messageSender').MessageSender;
const IntervalUpdater = require('./intervalUpdater').IntervalUpdater;
const messageParserFactory = require('./messageParserFactory');

const messageLength = 12;

function SensorListener(serialPort, messageIntervalSeconds, sensorDataPath) {
  let buffer = '';
  const messageParsers = messageParserFactory.createMessageParsers(
    new IntervalUpdater(new MessageSender(serialPort), messageIntervalSeconds),
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
        console.log(`${new Date().toISOString()} failed to open: ${error}`);
      } else {
        console.log(`${new Date().toISOString()} open`);
        serialPort.on('data', (data) => {

          console.log(`${new Date().toISOString()} recv: ${data}`);

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
