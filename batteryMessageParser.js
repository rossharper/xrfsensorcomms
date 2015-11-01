function BatteryMessageParser(xrfParser, onBattCallback) {
    this.parseMessage = function(message) {
        var payload = message.match(/a[A-Z][A-Z]BATT(-?[0-9\.]{4,5})/);
        if(payload) {
            onBattCallback(
                xrfParser.getDeviceNameFromMessage(message),
                payload[1]);
            return true;
        }
        return false;
    }
}

module.exports = {
    BatteryMessageParser : BatteryMessageParser
}
