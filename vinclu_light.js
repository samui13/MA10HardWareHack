var VincluLed;
(function(){
    'use strict';
    // forked from Takayuki.Hagiwara's " vinclu_library_light_custum" http://jsdo.it/Takayuki.Hagiwara/9KFh
    // forked from vinclu's "vinclu_library_light" http://jsdo.it/vinclu/vinclu_library_led
    // forked from t_furu's "VincluLed ライブラリ" http://jsdo.it/t_furu/pSYz
    VincluLed = function( frequencyL , frequencyR ){
        
        //AudioContextを作成
        this.isOn = false;
        this.audio_context = null;
        this.audio_node = null;

        this.frequencyL = frequencyL;
        this.frequencyR = frequencyR;

        this.gain_node = null;
        this.isBlink = false;
        
        this.volumeRatio = 1;
        this.volume = 1;
        this.minVolume = -1;
        this.pattern = null;

        this.init = function(){
            var aCon = window.AudioContext || window.webkitAudioContext; 
            this.audio_context = new aCon();
        //44100 は変更しない事
            this.audio_context.samplingRate = 44100;
        };

        //再生する音のバッファーを作成する
        this.createAudioDataBuffer = function(context,frequencyL,frequencyR){
            var s = context.samplingRate * 2;
            var buffer = context.createBuffer(2, s, context.samplingRate);
            var audioDataL = buffer.getChannelData(0);
            var audioDataR = buffer.getChannelData(1);
            for(var i = 0; i < audioDataL.length; i++){
                var l = Math.sin(2 * Math.PI * frequencyL * i / context.samplingRate);
                var r = Math.sin(2 * Math.PI * frequencyR * i / context.samplingRate);
                audioDataL[i] = l;
                audioDataR[i] = r*-1;
            }
            return buffer;
        };

        //明るさ調整
        this.setBrightness = function(volume){
            if(this.gain_node == null){
                if(this.audio_context.createGainNode){
                
                    this.gain_node = this.audio_context.createGainNode();
                }
                else
                {
                    this.gain_node = this.audio_context.createGain();
                
                }
                this.audio_node.connect(this.gain_node);
                this.gain_node.connect(this.audio_context.destination);
            }
            if(typeof volume === 'undefined'){
                volume = this.volume;
                
            }
            else{
                this.volume = volume;
                
            }
            
            
            volume = (volume - this.minVolume) * this.volumeRatio + this.minVolume;     
                
            
            this.gain_node.gain.value = volume;
        },

        //LEDの電源をON
        this.on = function(){
            console.log('on');
            this.isOn = true;   
            if(this.audio_node != null) return;
            
            //バッファーを設定
            this.audio_node = this.audio_context.createBufferSource();
            this.audio_node.buffer = this.createAudioDataBuffer(this.audio_context,this.frequencyL,this.frequencyR);
            this.audio_node.loop = true;
            this.audio_node.connect(this.audio_context.destination);

            this.audio_node.start(0);
        };

        //LEDの電源をOFF
        this.off = function( ){
            if( this.isOn ){
                console.log('off');
                this.isOn = false;
                this.audio_node.stop(0);
                this.audio_node = null;
                this.gain_node = null;
            }
            if(this.pattern){
                this.pattern.stop();
            }
        };

        //ブリンク起動
        this.blinkOn = function( interval,pattern){
            
            if( this.isOn === false){
                this.on();
            }
            
            var my = this;
            var callback = function(voluemRatio) {
                my.volumeRatio = voluemRatio;
                my.setBrightness();
            }
            if(this.pattern){
                this.blinkOff();
            }
            pattern.start(interval,callback);
            this.pattern = pattern;
            
        };

        this.blinkOff = function(autoOff){
            this.pattern.stop();
            this.volumeRatio = 1;
            this.setBrightness();
            delete this.pattern;
            if(autoOff === true){           
                this.off();
            }
        };

        //初期化
        this.init();    
        
    };

    //--------------------------------------------------------------------------
    //点滅パターン

    var patterns = {};
    VincluLed.patterns = patterns;

    //基底クラス

    var basic = patterns.basic = function(){};
    
    basic.prototype.timeRatio = 10;//時間分解能
    basic.prototype.start = function(interval,callback){
                    
          if(this.timer){

                this.stop();
                        
          }
          var my = this;
          var cb = function(){
                var volumeRatio = my._step();
                callback(volumeRatio);
                        
          }
          this.interval = interval;
          this.setInterval(interval);
          this.timer = setInterval(cb,this.timeRatio);
          this._onStart();
          
    };
    basic.prototype.stop = function(){
        if(!this.timer){
          
          return;
                   
        }
                    
        clearInterval(this.timer);
        delete this.timer;
        this._onStop();
          
    }; 
    //パラメーター設定
    basic.prototype.setInterval = function(){};
    //パターン生成
    basic.prototype._step = function(){};
         
                 
    //フック関数
    basic.prototype._onStart = function(){};
    basic.prototype._onStop  = function(){};
                
    


    //　三角波
    var triangle = patterns.triangle = function(){
               this.max = 1;
               this.min = 0;          
    };
    triangle.prototype = new patterns.basic();
    triangle.prototype.intervalRatio = 2;//ノコギリ波と共通化のため
    
    triangle.prototype.setInterval = function(interval){
            this.stepValue = (this.max - this.min) / ((interval / this.intervalRatio) / this.timeRatio);
    };
    triangle.prototype._onStart = function(){
           this.volumeRatio = this.min;
           this.vecter = 1;
    };
    triangle.prototype._step = function(){
           
           this.volumeRatio = this.vecter * this.stepValue + this.volumeRatio;
           if(this.volumeRatio <= this.min){
               this.vecter = 1;
           }
           if(this.volumeRatio >= this.max){
               this.vecter = -1;
           }
           return this.volumeRatio;
     };
     // 1/f揺らぎ
     
     var burstChaos = patterns.burstChaos = function(){};
     burstChaos.prototype = new patterns.basic();
     burstChaos.prototype.setInterval = function(interval){
         this.interval = Math.ceil(interval / this.timeRatio);
         
     };
     burstChaos.prototype._onStart = function(){
         this.count = 0;
         this.volume = Math.random();
     };
     burstChaos.prototype._step = function(){
         this.count = (this.count + 1) % this.interval;
         if(this.count === 0){
             if(this.volume < 0.5){
                 this.volume += 2 * Math.pow(this.volume,2);
                 
             }
             else
            {
                 this.volume -= 2 * Math.pow(1 - this.volume,2); 
            }
         }
         return this.volume;
     };
    
    //////////////////////
    //　波
    var wave = patterns.wave = function(){
               this.max = 1;
               this.min = 0;
               this.deg = 0;
    };
    wave.prototype = new patterns.basic();
    wave.prototype.intervalRatio = 2;//ノコギリ波と共通化のため
    
    wave.prototype.setInterval = function(interval){
            this.stepValue = (this.max - this.min) / ((interval / this.intervalRatio) / this.timeRatio);
    };
    wave.prototype._onStart = function(){
           this.volumeRatio = this.min;
           this.vecter = 1;
    };
    wave.prototype._step = function(){
           var rad = this.deg * (Math.PI / 180);
           var amount = (Math.sin(rad));
           this.volumeRatio = amount * this.stepValue;// + this.volumeRatio;

           this.deg++;
           console.log(this.volumeRatio + ", " + amount)
           return this.volumeRatio;
     };
})();