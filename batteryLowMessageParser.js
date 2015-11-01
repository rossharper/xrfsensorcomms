function BatteryLowMessageParser(xrfParser, onBattLowCallback) {
    this.parseMessage = function(message) {
        var payload = message.match(/a[A-Z][A-Z]BATTLOW--/);
        if(payload) {
            onBattCallback(xrfParser.getDeviceNameFromMessage(message));
            return true;
        }
        return false;
    }
}

module.exports = {
    BatteryLowMessageParser : BatteryLowMessageParser
}
