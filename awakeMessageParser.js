function AwakeMessageParser(xrfParser, onAwakeCallback) {
    this.parseMessage = function(message) {
        if(message.indexOf("AWAKE") >= 0) {
            onAwakeCallback(xrfParser.getDeviceNameFromMessage(message));
        } 
    }
}

module.exports = {
    AwakeMessageParser : AwakeMessageParser
}