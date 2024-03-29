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
		red: 4,
		yellow: 17,
		greenA: 22,
		greenB: 23,
		greenC: 24,
		greenD: 27
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
/* var led = new Led(params.ledsGpioPins.red);
setInterval(function(){
	led.breathe(params.poll.interval);
}, params.poll.interval);
return; */

/**
 * Initialize App
 */
console.log('Initialize App');
var App = {
	_params: {
		pollInterval: null,
		ledsGpioPins: {
			red: null,
			yellow: null,
			greenA: null,
			greenB: null,
			greenC: null,
			greenD: null,
		},
		leds: {
			red: null,
			yellow: null,
			greenA: null,
			greenB: null,
			greenC: null,
			greenD: null,
		},
		
	},
	init: function(params){
		console.log('App.init', params);
		App._params = Object.assign(App._params, params);
		App.initLeds();
		PiHoleAPI.poll.init(App.handleAPIPoll);
	},
	initLeds: function(){
		console.log('App.initLeds');
		App._params.leds.red = new Led(App._params.ledsGpioPins.red);
		App._params.leds.yellow = new Led(App._params.ledsGpioPins.yellow);
		App._params.leds.greenA = new Led(App._params.ledsGpioPins.greenA);
		App._params.leds.greenB = new Led(App._params.ledsGpioPins.greenB);
		App._params.leds.greenC = new Led(App._params.ledsGpioPins.greenC);
		App._params.leds.greenD = new Led(App._params.ledsGpioPins.greenD);
		console.log();
	},
	handleAPIPoll: function(adsBlocked){
		// console.log('App.handlePoll', adsBlocked);
		App.threshold.set(adsBlocked);
		if(adsBlocked >= App.threshold.threshold){
			console.log(adsBlocked + ' ads blocked');
			App._params.leds.red.breathe(App._params.pollInterval);
			App._params.leds.yellow.off();
			App._params.leds.greenA.off();
			App._params.leds.greenB.off();
			App._params.leds.greenC.off();
			App._params.leds.greenD.off();
		}else if(adsBlocked > 0){
			console.log(adsBlocked + ' ads blocked');
			App._params.leds.red.off();
			App._params.leds.yellow.breathe(App._params.pollInterval);
			App._params.leds.greenA.off();
			App._params.leds.greenB.off();
			App._params.leds.greenC.off();
			App._params.leds.greenD.off();
		}else{
			console.log('No ads blocked');
			App._params.leds.red.off();
			App._params.leds.yellow.off();
			App._params.leds.greenA.breathe(App._params.pollInterval);
			App._params.leds.greenB.breathe(App._params.pollInterval);
			App._params.leds.greenC.breathe(App._params.pollInterval);
			App._params.leds.greenD.breathe(App._params.pollInterval);
		}
	},
	// set a revolving threshold for high amount of ads blocked
	threshold: {
		threshold: 0,
		thresholds: [],
		maxThresholds: 10,
		set: function(adsBlocked){
			// console.log('threshold', this.threshold);
			if(adsBlocked > 0)
				this.thresholds.push(adsBlocked);
			if(this.thresholds.length > this.maxThresholds)
				this.thresholds.shift();
			this.threshold = Math.round((this.thresholds.reduce((a,b) => a + b, 0) / this.maxThresholds) / 2);
		}
	}
};
App.init({
	pollInterval: params.poll.interval,
	ledsGpioPins: params.ledsGpioPins
});