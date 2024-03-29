'use strict';

const MessageSender = require('./messageSender').MessageSender;
const messageParserFactory = require('./messageParserFactory');

const messageLength = 12;

function SensorListener(serialPort, messageIntervalSeconds, sensorDataPath) {
  let buffer = '';
  const messageParsers = messageParserFactory.createMessageParsers(sensorDataPath);

  function parseMessage(message) {
    for (let i = 0; i < messageParsers.length; i++) {
      const parsed = messageParsers[i].parseMessage(message);
      if (parsed) break;
    }
  }

  function processBuffer() {
    while (buffer.length >= messageLength) {
      const messageStart = buffer.indexOf('a');
      if (messageStart > 0) {
        buffer = buffer.substring(messageStart);
        continue;
      } else if (messageStart < 0) {
        buffer = '';
        return;
      }

      const message = buffer.substr(0, messageLength);
      //console.log(`PROCESS message: ${message}`);
      buffer = buffer.substr(messageLength);
      //console.log(`POST-PROCESS buffer: ${buffer}`);
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

  this.stop = function () {
    console.log(`${new Date().toISOString()} Stopping...`);
    serialPort.drain(() => {
      console.log(`${new Date().toISOString()} Closing port...`);
      serialPort.close(() => {
        console.log(`${new Date().toISOString()} kthxbye`);
      });
    })
  }
}

module.exports = {
  SensorListener: SensorListener
};
