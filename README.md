# xrfsensorcomms

Reads temperatures and battery health from remote XRF sensors. (Currently works with XRF temperature sensors).

Sensor data will be written to the sensor path in the following files:

    {sensorpath}\{sensorname}\value
    {sensorpath}\{sensorname}\batt

The `value` file contains the current temperature value.
The `batt` file contains the current sensor battery health.

Upon receiving an `AWAKE` message from the sensor, the sensor's wake reading interval will be updated via an `INTVL` message, with the current interval value (currently hardcoded to 120 seconds).

# Usage

    node index.js [-sensorpath <SENSOR_DATA_PATH>]

      -sensorpath    path at which temperature sensor data will be written
                     (default: /var/lib/homecontrol/sensordata/temperatureSensors)

# Run standalone

The start script will start xrfsensorcomms in the background using forever

    ./start.sh

# Install as startup daemon

    sudo ./installDaemon.sh

This script will set up the app to run at startup using forever-service. The service will run as the user 'pi'.

Note: the daemon defaults are used in this case.

# Dependencies

[forever](https://github.com/foreverjs/forever)

[forever-service](https://github.com/zapty/forever-service)

# License

Copyright 2016 Ross Harper

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
