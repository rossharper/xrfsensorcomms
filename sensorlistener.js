var MessageSender = require('./messageSender').MessageSender,
    IntervalUpdater = require('./intervalUpdater').IntervalUpdater,
    messageParserFactory = require('./messageParserFactory')

var messageLength = 12;

function SensorListener(serialPort, messageInterval) {
    var buffer = "";
    var messageParsers = messageParserFactory.createMessageParsers(
        new IntervalUpdater(
            new MessageSender(serialPort),
            messageInterval));

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
            buffer = buffer.substr(messageLength);
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
                    
                    processBuffer();
                });
            }
        });
    }
}

module.exports = {
    SensorListener : SensorListener
}
