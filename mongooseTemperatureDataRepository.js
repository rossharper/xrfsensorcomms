function MongooseTemperatureDataRepository(mongoose) {
    var temperatureSchema = mongoose.Schema({
        device: String,
        temperature: Number,
        date: { type: Date, default: Date.now }
    });
    var Temperature = mongoose.model('temperatures', temperatureSchema);

    this.storeTemperatureValue = function(device, temperature) {
        var temp = new Temperature();
        temp.device = device;
        temp.temperature = temperature;
        temp.save(function (err) {
            if(err) {
                console.error("Error writing temp to db: " + err);
            }
        });
    }
}

module.exports = {
    TemperatureDataRepository : MongooseTemperatureDataRepository
}
