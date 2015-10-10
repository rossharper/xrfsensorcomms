var mongoose = require('mongoose');

function MongooseBatteryDataRepository() {
    var batterySchema = mongoose.Schema({
        device: String,
        batteryVoltage: Number,
        date: { type: Date, default: Date.now }
    });
    var Battery = mongoose.model('batteryLevels', batterySchema);

    this.storeBatteryValue = function (device, voltage) {
        mongoose.connect('mongodb://localhost/homecontrol');

        var battery = new Battery();
        battery.device = device;
        battery.batteryVoltage = voltage;
        battery.save(function (err) {
            if(err) {
                console.error("Error writing batt to db: " + err); // validator error
            }
        });

        mongoose.disconnect();
    }
}

module.exports = {
    BatteryDataRepository : MongooseBatteryDataRepository
}