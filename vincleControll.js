var vincleCtrl = {};

vincleCtrl.led = new VincluLed(100,100);
vincleCtrl.isOn = false;

vincleCtrl.init = function(){
};
vincleCtrl.stop = function(){
	vincleCtrl.led.blinkOff(true);
};

vincleCtrl.blink = function(interval, duration){
//	vincleCtrl.led = null;
//	vincleCtrl.led = new VincluLed(100,100);

	var pattern = new VincluLed.patterns.triangle();
	vincleCtrl.led.blinkOn(interval,pattern);
//	setTimeout('vincleCtrl.stop()', duration);
};

vincleCtrl.blinkChaos = function(interval, duration){
//	vincleCtrl.led = null;
//	vincleCtrl.led = 

	var pattern = new VincluLed.patterns.burstChaos();
	vincleCtrl.led.blinkOn(interval,pattern);
//	setTimeout('vincleCtrl.stop()', duration);
};