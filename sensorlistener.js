var MessageSender = require('./messageSender').MessageSender,
    IntervalUpdater = require('./intervalUpdater').IntervalUpdater,
    messageParserFactory = require('./messageParserFactory')

var messageLength = 12;

function SensorListener(serialPort, messageInterval, sensorDataPath) {
    var buffer = "";
    var messageParsers = messageParserFactory.createMessageParsers(
        new IntervalUpdater(new MessageSender(serialPort), messageInterval),
        sensorDataPath);

    var parseMessage = function(message) {
        if(message[0] != 'a') return;

        for (var i = 0; i < messageParsers.length; i++) {
            parsed = messageParsers[i].parseMessage(message);
            if(parsed) break;
        };
    }

    var processBuffer = function() {
        while(buffer.length >= messageLength) {
            var message = buffer.substr(0, messageLength);
            //console.log('PROCESS message: ' + message);
            buffer = buffer.substr(messageLength);
            //console.log('POST-PROCESS buffer: ' + buffer);
            parseMessage(message);
        }
    }

    this.listen = function() {
        serialPort.open(function (error) {
            if ( error ) {
                console.log('failed to open: '+error);
            } else {
                console.log('open');
                serialPort.on('data', function(data) {

                    console.log('data received: ' + data);

                    buffer += data;
                    //console.log('buffer after data receive: ' + buffer);

                    processBuffer();
                });
            }
        });
    }
}

module.exports = {
    SensorListener : SensorListener
}
