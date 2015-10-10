function TemperatureMessageHandler(temperatureDataRepository) {
    this.handleMessage = function(device, temperature) {
        console.log("logging " + device + " temperature: " + temperature);
        temperatureDataRepository.storeTemperatureValue(device, temperature);
    }
}

module.exports = {
    TemperatureMessageHandler : TemperatureMessageHandler
}