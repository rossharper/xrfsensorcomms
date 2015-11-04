var SensorDataFile = require('./SensorDataFile');

function FileSystemBatteryDataRepository(sensorDataPath) {
    this.storeBatteryValue = function (device, voltage) {
        SensorDataFile.writeSensorDataFile(sensorDataPath, device, voltage);
    }
}

module.exports = {
    BatteryDataRepository : FileSystemBatteryDataRepository
}
