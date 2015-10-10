function MongooseBatteryDataRepository(mongoose) {
    var batterySchema = mongoose.Schema({
        device: String,
        batteryVoltage: Number,
        date: { type: Date, default: Date.now }
    });
    var Battery = mongoose.model('batteryLevels', batterySchema);

    this.storeBatteryValue = function (device, voltage) {
        var battery = new Battery();
        battery.device = device;
        battery.batteryVoltage = voltage;
        battery.save(function (err) {
            if(err) {
                console.error("Error writing batt to db: " + err); // validator error
            }
        });
    }
}

module.exports = {
    BatteryDataRepository : MongooseBatteryDataRepository
}