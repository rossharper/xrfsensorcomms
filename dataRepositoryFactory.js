var BatteryDataRepository = require('./mongooseBatteryDataRepository').BatteryDataRepository,
    TemperatureDataRepository = require('./mongooseTemperatureDataRepository').TemperatureDataRepository,
    mongoose = require('mongoose');

var mongodbLocation = 'mongodb://localhost/homecontrol';
mongoose.connect(mongodbLocation);

module.exports = {
    createBatteryDataRepository : function() {
        return new BatteryDataRepository(mongoose);
    },
    createTemperatureDataRepository : function() {
        return new TemperatureDataRepository(mongoose);
    }
}
