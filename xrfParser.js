function XrfParser() {
    this.getDeviceNameFromMessage = function(message) {
        return message.substr(1, 2);
    }
}

module.exports = {
    XrfParser : XrfParser
}