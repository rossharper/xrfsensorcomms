function AwakeMessageParser(xrfParser, onAwakeCallback) {
    this.parseMessage = function(message) {
        if(message.indexOf("AWAKE") >= 0) {
            onAwakeCallback(xrfParser.getDeviceNameFromMessage(message));
            return true;
        } 
        return false;
    }
}

module.exports = {
    AwakeMessageParser : AwakeMessageParser
}