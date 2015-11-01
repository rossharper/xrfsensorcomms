function TemperatureMessageParser(xrfParser, onTempCallback) {
    this.parseMessage = function(message) {
        var payload = message.match(/a[A-Z][A-Z]TMPA(-?[0-9\.]{4,5})/);
        if(payload) {
            onTempCallback(
                xrfParser.getDeviceNameFromMessage(message),
                payload[1]);
            return true;
        }
        return false;
    }
}

module.exports = {
    TemperatureMessageParser : TemperatureMessageParser
}
