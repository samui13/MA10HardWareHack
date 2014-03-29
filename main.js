jQuery.fn.ajaxXss = function(url){
    var obj = {
	data:{},
	url:url,
    };
    $.ajax({
	url: obj.url,
	type:'GET',
	datatype:'jsonp',
	success:function(json){
	    var jsonStr = (json.responseText.match(/<p>(.+)<\/p>/));
	    var hoge = JSON.parse(jsonStr[1]);
	    obj.data = hoge;
	    obj.deferred.resolve();
	}
    });
    obj.deferred = new $.Deferred;
    
    obj.promise = function(){
	return obj.deferred.promise();
    }
    return obj;
};
Sensor = function(r,g,b){
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    var sum = r+g+b;
    if(sum > 1600){
	return "White";
    }else if(sum < 50){
	return "Black";
    }else if(b/sum > r/sum && b/sum > g/sum){
	return "Blue";
    }else if(g/sum - r/sum > 0.2){// && g > 200){//g > 300){
	return "Green";
    }else if(r/sum- g/sum>0.6 && r/sum > b/sum && sum < 500){
	return "Red";
    }
    return "Nashi";
};

var netstatus = {};

netstatus.preStatus = "";
VincluLed.netstatus = netstatus;
netstatus.getStatus = function(timer){
    var t = new $.fn.ajaxXss("http://elpisapi.net/color/api/web");
    t.promise().then(function(){
	
	var status =  Sensor(t.data.red, t.data.green,t.data.blue);
	netstatus.status = status;
	
	if(netstatus.preStatus != "Red" && status == "Red"){
	    vincleCtrl.blink(1000,10000);
	}else if(netstatus.preStatus != "Green" && status == "Green"){
		vincleCtrl.blinkChaos(100,10000);
	}else if(netstatus.preStatus!="Blue" && status == "Blue"){
	}else if(netstatus.preStatus!="Nashi" && status == "Nashi"){
		vincleCtrl.stop();
	}

	netstatus.preStatus = status;
	
	
    });
};

netstatus.stop = function(){
  vincleCtrl.stop();
}


$(window).load(function() {
    $("#btnUpdate").on('click',function () {
      netstatus.getStatus(100);
    });
    $("#btnStop").on('click',function () {
    	netstatus.stop();
    });
    $("#btnStartAutoUpdate").on('click',function () {
    	netstatus.timer = setInterval("netstatus.getStatus()",1000*1); 	
    });
    $("#btnStopAutoUpdate").on('click',function () {
    	clearInterval(netstatus.timer);
    });

 });


/*
Green(g>400)
221 474 135 830
227 482 142 851
210 454 127 791
227 487 142 856
225 480 146 851

Orange(b < 2*g && r > 5*g)
447 148 60 655 
462 166 68 696 
440 146 56 642 
454 163 66 683 
453 161 60 674 

Black(それいがい)
9 13 18 40
9 12 18 39
9 12 19 40
8 11 17 36
10 13 21 44

New Black(sum<50)
9 13 18 40
10 14 20 44
5 7 9 21
9 14 20 43
8 12 17 37
7 11 15 33


White(sum > 1600)
419 650 1006 2075 
330 524 878 1732 
437 681 1041 2159 
631 975 1562 3168 
462 717 1125 2304 

  
Blue  (b>400)
30 81 483 594 
43 117 637 797 
23 66 412 501 
35 97 545 677 
32 87 507 626 


Red(r/sum > g/sum && r/sum > b/sum && sum<500 )
259 25 33 317 
251 21 25 297 
360 43 56 459 
244 21 25 290 
249 21 26 296 

Nashi
31 26 11 68

*/
