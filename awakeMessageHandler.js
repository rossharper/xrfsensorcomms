function AwakeMessageHandler(xrfParser, intervalUpdater, messageInterval) {
    this.handleMessage = function(message) {
        if(message.indexOf("AWAKE") >= 0) {
            onAwake(
                intervalUpdater, 
                xrfParser.getDeviceNameFromMessage(message),
                messageInterval);
        } 
    }
}

function onAwake(intervalUpdater, device, messageInterval) {
    intervalUpdater.sendIntervalUpdate(device, messageInterval);
}

module.exports = {
    AwakeMessageHandler : AwakeMessageHandler
}