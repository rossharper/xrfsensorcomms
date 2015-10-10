function TemperatureMessageHandler(mongoose) {
    var temperatureSchema = mongoose.Schema({
        device: String,
        temperature: Number,
        date: { type: Date, default: Date.now }
    });
    this.Temperature = mongoose.model('temperatures', temperatureSchema);
}

TemperatureMessageHandler.prototype.handleMessage = function(device, temperature) {
    console.log("logging " + device + " temperature: " + temperature);
    var temp = new this.Temperature();
    temp.device = device;
    temp.temperature = temperature;
    temp.save(function (err) {
        if(err) {
            console.error("Error writing temp to db: " + err);
        }
    });
}

module.exports = {
    TemperatureMessageHandler : TemperatureMessageHandler
}