var BatteryDataRepository = require('./FileSystemBatteryDataRepository').BatteryDataRepository,
    BatteryLowDataRepository = require('./FileSystemBatteryLowDataRepository').BatteryLowDataRepository,
    TemperatureDataRepository = require('./FileSystemTemperatureDataRepository').TemperatureDataRepository;

module.exports = {
    createBatteryDataRepository : function(sensorDataPath) {
        return new BatteryDataRepository(sensorDataPath);
    },
    createTemperatureDataRepository : function(sensorDataPath) {
        return new TemperatureDataRepository(sensorDataPath);
    },
    createBatteryLowDataRepository : function(sensorDataPath) {
        return new BatteryLowDataRepository(sensorDataPath);
    }
}
