function MessageSender(serialPort) {
    this.sendMessage = function(message) {
        serialPort.write(message, function(err, results) {
            if(err) {
                console.log('message sender serial port write err ' + err);
            }
            serialPort.drain();
        });
    };
}

module.exports = {
    MessageSender : MessageSender
}
