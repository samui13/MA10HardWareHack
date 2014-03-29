var vincleCtrl = {};

vincleCtrlLed = new VincluLed(100,100);
vincleCtrl.isOn = false;

vincleCtrl.init = function(){
};
vincleCtrl.stop = function(){
	vincleCtrlLed.blinkOff(true);
};

vincleCtrl.blink = function(interval, duration){
//	vincleCtrl.led = null;
//	vincleCtrl.led = new VincluLed(100,100);

	var pattern = new VincluLed.patterns.triangle();
	vincleCtrlLed.blinkOn(interval,pattern);
//	setTimeout('vincleCtrl.stop()', duration);
};

vincleCtrl.blinkChaos = function(interval, duration){
//	vincleCtrl.led = null;
//	vincleCtrl.led = 

	var pattern = new VincluLed.patterns.burstChaos();
	vincleCtrlLed.blinkOn(interval,pattern);
//	setTimeout('vincleCtrl.stop()', duration);
};