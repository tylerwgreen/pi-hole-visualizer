'use strict';

var Gpio = require('pigpio').Gpio;

class Led{
	constructor(gpioPin){
		
		var self = this;
		this.led = new Gpio(gpioPin, {mode: Gpio.OUTPUT});
		this.runningInterval = null;
		
		this.destruct = function(){
			this.off();
		}
		
		this.on = function(){
			this.led.digitalWrite(1);
		}
		
		this.off = function(){
			this.led.digitalWrite(0);
		}
		
		this.blink = function(interval){
			interval = Math.round(interval / 2);
			this.on();
			var on = true;
			clearInterval(this.runningInterval);
			this.runningInterval = setInterval(function(){
				if(on){
					self.off();
					clearInterval(this.runningInterval);
				}else{
					self.on();
					on = true;
				}
			}, interval);
		}
		
		this.breathe = function(interval){
			var dutyCycleMax = 255;
			var dutyCycleMin = 0;
			// set the resolution of the interval/pwm step and interval trim necessary to ensure all steps are taken
			if(interval >= 2000){
				var dutyCycleStepResolution = 64;
				var intervalTrim = .75;
			}else if(interval > 1000){
				var dutyCycleStepResolution = 32;
				var intervalTrim = .9;
			}else{
				var dutyCycleStepResolution = 24;
				var intervalTrim = 1;
			}
			// ensure dutyCycleMax is wholy divisible by dutyCycleStep
			var dutyCycleStepSize = Math.floor(dutyCycleMax / dutyCycleStepResolution);
			// determine duty cycle interval step size (the amount of time needed to step through all duty cycles during given interval param)
			var dutyCycleSteps = Math.floor(((dutyCycleMax + 1) * 2) / dutyCycleStepSize);
			interval = ((interval / dutyCycleSteps)) - intervalTrim;
// console.log('dutyCycleStepSize', dutyCycleStepSize);
// console.log('dutyCycleSteps', dutyCycleSteps);
// console.log('interval', interval);
			this.off();
			// var dutyCycle = dutyCycleStepSize;
			var dutyCycle = 0;
			var fadedIn = false;
// var stepCount = 0;
			clearInterval(this.runningInterval);
			// run the interval and step the pwm
			this.runningInterval = setInterval(function(){
// console.log('stepCount:dutyCycle', stepCount + ':' + dutyCycle);
// stepCount += 1;
				self.led.pwmWrite(dutyCycle);
				if(
						dutyCycle >= dutyCycleMax
					&&	false === fadedIn
				){
					fadedIn = true;
					dutyCycle = dutyCycleMax;
				}else if(
						dutyCycle <= dutyCycleMin
					&&	true === fadedIn
				){
					self.off();
					dutyCycle = dutyCycleMin;
					clearInterval(this.runningInterval);
				}else{
					if(false === fadedIn){
						dutyCycle += dutyCycleStepSize;
						// close to dutyCycleMax?
						if(dutyCycle + dutyCycleStepSize > dutyCycleMax)
							dutyCycle = dutyCycleMax;
					}else{
						dutyCycle -= dutyCycleStepSize;
						// close to dutyCycleMin?
						if(dutyCycle - dutyCycleStepSize < dutyCycleMin)
							dutyCycle = dutyCycleMin;
					}
				}
			}, interval);
		}

	}
}
module.exports = Led;