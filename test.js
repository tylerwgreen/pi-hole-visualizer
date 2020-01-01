/**
 * Include dependencies
 */
console.log('Include dependencies');
var path = require('path');

/**
 * Define App variables
 */
console.log('Define App variables');
var params = {
	poll: {
		// 5 seconds per breath is slow, 3 seconds per breath is fast, 3.75 is average
		interval: 4000
	},
	ledsGpioPins: {
		red: [
			4,
		],
		yellow: [
			17,
		],
		green: [
			22,
			23,
			24,
			27,
		],
	},
	paths: {
		app:	path.join(__dirname, '/app/'),
		models:	path.join(__dirname, '/app/models/'),
		// logs:	path.join(__dirname, '/logs/'),
		// bin:	path.join(__dirname, 'bin'),
	}
};

/**
 * Load and initialize models
 */
console.log('Load models');
var PiHoleAPI = require(path.join(params.paths.models, 'PiHoleAPI'));
var Led = require(path.join(params.paths.models, 'Led'));

console.log('Initialize models');
PiHoleAPI.init({
	pollInterval: params.poll.interval
});

/**
 * Led Test
 */
Object.keys(params.ledsGpioPins).forEach(function(key) {
	var ledsGpioPins = params.ledsGpioPins[key];
	for(i = 0; i < ledsGpioPins.length; i++){
		var ledsGpioPin = ledsGpioPins[i];
		console.log("Turning on led GPIO pin " + key + ": " + ledsGpioPin);
		var led = new Led(ledsGpioPin);
		// led.on();
		led.breathe(params.poll.interval);
	}
});
return;
// turn off all GPIO pins
for(i = 0; i < 33; i++){
	console.log("Turning off led GPIO pin: " + i);
	var led = new Led(i);
	led.off();
}
return;
setInterval(function(){
	led.blink(params.poll.interval);
}, params.poll.interval);