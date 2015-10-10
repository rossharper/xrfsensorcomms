function AwakeMessageHandler(intervalUpdater, messageInterval) {
    this.handleMessage = function(device) {
        intervalUpdater.sendIntervalUpdate(device, messageInterval);
    } 
}

module.exports = {
    AwakeMessageHandler : AwakeMessageHandler
}