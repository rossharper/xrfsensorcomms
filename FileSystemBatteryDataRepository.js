var SensorDataFile = require('./SensorDataFile');

function FileSystemBatteryDataRepository(sensorDataPath) {
    this.storeBatteryValue = function (device, voltage) {
        SensorDataFile.writeSensorDataFile(sensorDataPath, "batt", device, voltage);
    }
}

module.exports = {
    BatteryDataRepository : FileSystemBatteryDataRepository
}
