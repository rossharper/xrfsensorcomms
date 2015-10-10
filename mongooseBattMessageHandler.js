function BatteryMessageHandler(batteryDataRepository) {
    this.handleMessage = function(device, batteryVoltage) {
        console.log("logging " + device + " battery health: " + batteryVoltage);
        batteryDataRepository.storeBatteryValue(device, batteryVoltage);
    }
}

module.exports = {
    BatteryMessageHandler : BatteryMessageHandler
}