function BatteryMessageHandler(mongoose) {
    var batterySchema = mongoose.Schema({
        device: String,
        batteryVoltage: Number,
        date: { type: Date, default: Date.now }
    });
    this.Battery = mongoose.model('batteryLevels', batterySchema);
}

BatteryMessageHandler.prototype.handleMessage = function(device, batteryVoltage) {
    console.log("logging " + device + " battery health: " + batteryVoltage);
    var battery = new Battery();
    battery.device = device;
    battery.batteryVoltage = batteryVoltage;
    battery.save(function (err) {
        if(err) {
            console.error("Error writing batt to db: " + err); // validator error
        }
    });
}

module.exports = {
    BatteryMessageHandler : BatteryMessageHandler
}