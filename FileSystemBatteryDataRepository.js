function FileSystemBatteryDataRepository() {
    this.storeBatteryValue = function (device, voltage) {
        // TODO: store battery value to file system
    }
}

module.exports = {
    BatteryDataRepository : FileSystemBatteryDataRepository
}
