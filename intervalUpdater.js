function IntervalUpdater(messageSender, device, intervalSeconds) {
    var intervalMessage = createIntervalMessage(device, intervalSeconds);

    this.sendIntervalUpdate = function() {
        messageSender.sendMessage(intervalMessage);
    }
}

function createIntervalMessage(device, intervalSeconds) {
    var intervalSecondsStr = "" + intervalSeconds;
    var pad = '000';
    var paddedInterval = pad.substring(0, pad.length - intervalSecondsStr.length) + intervalSecondsStr;
    return 'a' + device + 'INTVL' + paddedInterval + 'S';  
}

module.exports = {
    IntervalUpdater : IntervalUpdater
}
