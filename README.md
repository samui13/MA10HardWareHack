# Document(JSグループ)
***
## センサーの色判定(Sensor関数)
センサーからRGB取得する。RGBの値から、どの色がセンサーの上に有るのかを判定する。
判定の順番は、白、黒、青、緑、赤、何ものっていない(5色)。

* 白色(R+G+B > 1600)
* 黒色(R+G+B < 50)
* 青色(B > R && B > G)
* 緑色(R/(R+G+B)-G/(R+G+B) > 0.2)
* 赤色(R/(R+G+B)-G/(R+G+B)> 0.6 && R/B && R+G+B < 500)


## vincluの使いかた
公式の[Document][01]からvinclu_light.jsファイルをDownloadする。これだけだと、点滅パターンしか実行できない。

パターンを使うのには[こちら][2]


- [公式][0]
- [公式サンプル][1]
- [Hagiwaraさんのサンプル][2]
[0]: http://www.vinclu.me/
[01]: http://www.vinclu.me/document.html
[1]: http://jsdo.it/vinclu
[2]: http://jsdo.it/Takayuki.Hagiwara/xGgu

### patternを使わない
単純にライトをちかちかする。パターンはすくない。


```test.js
// frequencyL,frequencyRは左からでる波すう。
// 一致したところで激しく光ので、同じ数値を引数にすれば常にひかる。
led = new VincluLed(100, 1);
led.on(); //vinclu を光らせる
led.off(); //消灯
```

* 点滅(VincluLed(10,10))
* 激しく点滅
 - VincluLed(20,20)
 - VincluLed(100,70)
* ひかるだけ
 - VincluLed(30,30)
 - VincluLed(100,50)
* ふんわり点滅(VincluLed(100,1))

### patternをつかう

