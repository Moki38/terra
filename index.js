// init prerequisites
var Driver = require('i2c-sensor-am2315');

// create device
var sensor = new Driver;

// read the sensor
sensor.read(function(err, data) {
	if (err) {
		console.error(err);
	} else {
		console.log('Original in K');
		console.log(data);
		console.log('Convert K to °C');
		console.log(sensor.convertKelvinToCelsius(data));
	}
});

