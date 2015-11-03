function FileSystemTemperatureDataRepository() {
    this.storeTemperatureValue = function(device, temperature) {
        // TODO: save temperature value to file
    }
}

module.exports = {
    TemperatureDataRepository : FileSystemTemperatureDataRepository
}
