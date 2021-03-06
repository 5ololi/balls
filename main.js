﻿// -global ------------------------------------------------------------------------------------------------------------------------

var screenCanvas;
var run = true;
var fps = 1000 / 60;
var mouse = new Point();
var ctx;
var counter;
var creatF = false;
var prepLF = false;
var prepRF = false;
var fireLF = false;
var fireRF = false;
var lineLF = false;
var lineRF = false;
var kc;
var vector;
var length;
var lenAlt;
var radian;
var keyCode = new Array();
var e = 0.6;
var lastSpace = false;
var pauseF = false;
var lCounter = 0;

// -const -------------------------------------------------------------------------------------------------------------------------

var BALL_MAX_COUNT = 32;
var OBJECT_MAX_COUNT = 15;
var GREEN  　　= "rgba(  0, 255,   0, 0.85)";//緑
var BLUE 　　= "rgba(  0,   0, 255, 0.60)";//青
var RED　　 = "rgba(255,   0,   0, 0.60)";//赤
var GRAY    　　= "rgba( 85,  85,  85, 0.75)";//グレー
var ORANGE = "rgba(255, 140,   0, 0.80)";//オレンジ
var DARK_RED    = "rgba(200,   0, 100, 0.80)";//暗赤



// -main --------------------------------------------------------------------------------------------------------------------------

//ページ読み込み時に起動するfunciton
window.onload = function(){

	//ローカル変数の定義
	var i, j, k;
	var p = new Point();
	var v = new Point();
	vector = new Point();


	//スクリーンの初期化
	screenCanvas = document.getElementById("screen");
	screenCanvas.width = 512;
	screenCanvas.height = 512;


	//2dコンテキスト
	ctx = screenCanvas.getContext("2d");


	//右クリックの禁止
	screenCanvas.addEventListener("contextmenu", function(e){
		e.preventDefault();
	 }, false);

	//イベントの登録
	screenCanvas.addEventListener("mousemove", mouseMove, true);
	screenCanvas.addEventListener("mousedown", mouseDown, true);
	screenCanvas.addEventListener("mouseup", mouseUp, true);
	window.addEventListener("keydown", keyDown, true);
	window.addEventListener("keyup", keyUp, true);


	//エレメント登録
	info = document.getElementById("info");


	//球初期化
	var ball = new Array(BALL_MAX_COUNT);
	for(i = 0; i <= BALL_MAX_COUNT; i++){
		ball[i] = new Character;
	};

	//壁初期化
	var object =new Array(OBJECT_MAX_COUNT);
	for(i = 0; i <= OBJECT_MAX_COUNT; i++){
		object[i] = new Object;
	};


	//自機初期化
	p.x = screenCanvas.width / 2;
	p.y = screenCanvas.height / 2 -15;
	v.x = 0;
	v.y = 0;
	ball[0].set(p, 15, v, 0);
	

	//レンダリング処理を呼び出す-----------------------------------------------------------------------------------------------

	(function(){
		if(keyCode[32] && !lastSpace) pauseF = !pauseF;
		if(!pauseF){
			//カcウンターの値を増やす
			counter ++;





			//入力による変更-------------------------------------------------------------------------------------------

			if(kc){
				//console.log("入力されたキーコードは " + kc)

				if(keyCode[67]) creatF = true;
				if(keyCode[65]) ball[0].velocity.x = -2;
				if(keyCode[87]) ball[0].velocity.y =  2;
				if(keyCode[68]) ball[0].velocity.x =  2;
				if(keyCode[83]) ball[0].velocity.x =  0;

				if(keyCode[39]) ball[0].position.x += 0.3;
				if(keyCode[37]) ball[0].position.x -= 0.3;

				if(keyCode[73]) fps = 1000 / 2 ;
				if(keyCode[79]) fps = 1000 / 20;
				if(keyCode[80]) fps = 1000 / 60;
				if(keyCode[76]) lCounter++

			}


			if(!keyCode[65] && !keyCode[68]) ball[0].velocity.x *= 0.85;



			//フラグ管理-----------------------------------------------------------------------------------------------

			//他機生成
			if(creatF){
				for(i = 0; i < BALL_MAX_COUNT; i++){
					if(!ball[i].alive){
						p.x = mouse.x;
						p.y = mouse.y;
						v.x = 0;
						v.y = 0;
						var s = 10//Math.floor(Math.random() * 4) + 6;
						var c = 1//Math.floor(Math.random() * 2) + 1;
						ball[i].set(p, s, v, c);
						creatF = false;
						break;
					}
				}
			}
			
			ball[0].collisionC = 0;

//test
object[0].set(   0, 497, 512, 316, 0, 0, 3);
object[1].set(-300,-300, 300, 797, 0, 0, 3);
object[2].set( 512,-300, 300, 797, 0, 0, 3);
object[3].set(  60, 458, 100,  10, Math.PI / 15, 0, 0);
object[4].set( 100, 228,  80,  80, Math.PI / 8,  0, 1);
object[5].set( 280, 330, 170,  75, 0.0,     -1.4, 2);
object[6].set( 360,  40,  30, 250, 0.1,          0, 3);
/*object[3].set(   0, 130,  74,  75, 0,  0,  2);
object[5].set( 272, 130, 170,  75, 0.0,            0, 3);
object[4].set(  74, 130, 170,  75, 0.0,            0, 3);
object[6].set( 442, 130,  30,  367,  0,  0,  3);*/


			//点線フラグd
			if(prepLF) lineLF = true;
			if(prepRF) lineRF = true;

			//青球発射
			if(fireLF){
				for(i = 1; i < BALL_MAX_COUNT; i++){
					if(!ball[i].alive && ball[0].weight > 225){
						ball[i].color = 1;
						ball[i].shoot(ball[0]);
						break;
					}
				}
				prepLF = false;
				fireLF = false;
				lineLF = false;
			}

			//赤球発射
			if(fireRF){
				for(i = 1; i < BALL_MAX_COUNT; i++){
					if(!ball[i].alive && ball[0].weight > 225){
						ball[i].color = 2;
						ball[i].shoot(ball[0]);
						break;
					}
				}
				prepRF = false;
				fireRF = false;
				lineRF = false;
			}

			//物体の動きを制御-----------------------------------------------------------------------------------------

			for(i = 0; i < BALL_MAX_COUNT; i++){
				if(ball[i].alive){
					//重力を反映
					if(!ball[i].distortionF) ball[i].fall();
					//もし変形しているのであれば摩擦で減速する
					if(ball[i].distortionF){
						ball[i].velocity.x *= 0.85;
						ball[i].velocity.y *= 0.85;
					}
					//速度を位置情報に変換
					ball[i].move();
					//衝突カウンターと接点、歪フラグを初期化
					ball[i].collisionC = 0;
					for(j=0; j<=7; j++){
						ball[i].contact[j].x = 0;
						ball[i].contact[j].y = 0;
						ball[i].distortionF = false;
					}
					//周りの点の情報を更新
					for(j=0; j<ball[i].dot.length; j++){
						ball[i].dot[j].x = ball[i].position.x+ ball[i].size* Math.cos(j* 2* Math.PI/ ball[i].dot.length);
						ball[i].dot[j].y = ball[i].position.y+ ball[i].size* Math.sin(j* 2* Math.PI/ ball[i].dot.length);
					}
					//現在の位置情報を仮の値で保存しておく
					ball[i].lastPosition.x = ball[i].position.x;
					ball[i].lastPosition.y = ball[i].position.y;
				}
			}

			//ボール同士の衝突、結合
			for(i = 0; i < BALL_MAX_COUNT; i++){
				for(j = i + 1; j < BALL_MAX_COUNT; j++){
					if(ball[i].alive && ball[i].touchF && ball[j].alive && ball[j].touchF){
						p = ball[j].position.distance(ball[i].position);
						if( (p.length() < ball[j].size + ball[i].size) && (ball[i].color + ball[j].color == 3|| !i && ball[0].size < ball[j].size + 1) ){
							//ボールのめり込んだ位置関係を元に戻す
							ball[j].positionCorrect(ball[i]);
							//ボールの衝突後の速度を求める
							ball[j].collisionCalculate(ball[i]);
						}
						else if( p.length() < ball[j].size + ball[i].size - 2 && ball[i].color + ball[j].color != 3){
							if(!i && ball[0].size < ball[j].size + 1){
								break;
							}
							//ボール同士を結合する
							ball[j].absorptionCalculate(ball[i]);
						}
					}
				}
			}

			//壁との衝突
			for(i = 0; i < BALL_MAX_COUNT; i++){
				if(ball[i].alive && ball[i].touchF){
					for(j = 0; j < OBJECT_MAX_COUNT; j++){
						if(object[j].alive && ball[i].color != object[j].color){
							object[j].collision01(ball[i]);
						}
					}
				}
			};


			//自機とマウス位置の相対ベクトル(vector)、距離(length)、角度(radian)をそれぞれ計算する
			vector.x =   mouse.x - ball[0].position.x;
			vector.y = -(mouse.y - ball[0].position.y);
			length = ball[0].position.distance(mouse).length() - ball[0].size;
			radian = Math.atan2(vector.y, vector.x);

			if(keyCode[16]){
				var n = Math.round(Math.atan2(vector.y, vector.x) * 4 / Math.PI);
				radian = n / 4 * Math.PI;
				switch(n % 4){
					case 0:
						length = Math.abs(mouse.x - ball[0].position.x);
						break;

					case 1:
						length = Math.abs(Math.sqrt(1 / 2) * (vector.x + vector.y))
						break;

					case 2:
						length = Math.abs(mouse.y - ball[0].position.y);
						break;

					default:
						length = Math.abs(Math.sqrt(1 / 2) * (vector.x - vector.y))
						break;
				}
			}

			if(length >= 280) length = 280;
		};

		lastSpace = keyCode[32];



		//画面の描画を行う-------------------------------------------------------------------------------------------------


		//スクリーンクリア
		ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

		//背景の描画-------------------------------------------------

		//壁の描画
		for(i = 0;i <= OBJECT_MAX_COUNT; i++){
			if(object[i].alive){
				switch (object[i].color){
				case 0:
					ctx.fillStyle = GREEN;
					break;
				case 1:
					ctx.fillStyle = BLUE;
					break;
				case 2:
					ctx.fillStyle = RED;
					break;
				default:
					ctx.fillStyle = GRAY;
				}
				object[i].draw();
			}
		};

		//動体の描画-------------------------------------------------
		
		//ボールのひずみを計算する
		//2点以上で物体に接している場合
		for(i=0; i<=BALL_MAX_COUNT; i++){
			if(ball[i].alive && ball[i].collisionC >= 2){
				ball[i].position.x = ball[i].lastPosition.x
				ball[i].position.y = ball[i].lastPosition.y
				var excessC = 0;
				//各接点において、ボールの中心座標からの角度とめり込みぐらいを計算する。あと接線の角度を計算する
				for(j=0; j<=ball[i].collisionC-1; j++){
					ball[i].contact[j].rad = Math.atan2(ball[i].contact[j].y - ball[i].position.y, ball[i].contact[j].x - ball[i].position.x);
					ball[i].contact[j].excess = ball[i].size - ball[i].position.distance(ball[i].contact[j]).length();
					if(ball[i].contact[j].tangent == "NaN") ball[i].contact[j].tangent = ball[i].contact[j].rad + Math.PI/2;
					if(ball[i].contact[j].excess >= ball[i].size* 0.25) excessC++;
				}
				//もし各接点でボールが基準値よりめり込んでいたら破裂する
				if(excessC >= ball[i].collisionC){
					ball[i].alive = false;
					var amount = Math.floor((Math.random()*3) + 7);
					for(j=BALL_MAX_COUNT; j >= BALL_MAX_COUNT - amount; j--){
						ball[j].size = Math.random()*3+Math.sqrt(ball[i].weight/amount)-2;
						ball[j].velocity.x = Math.random()*12 - 6;
						ball[j].velocity.y = Math.random()*12;
						ball[j].set(ball[i].position, ball[j].size, ball[j].velocity, Math.ceil(Math.random()*2));
						ball[j].touchF = false
					}
				break;
				}
				//各接点を中心からの角度が小さい順に並び返す
				for(j=0; j<=ball[i].collisionC-1; j++){
					for(k=ball[i].collisionC-1; k>j; k--){
						if(ball[i].contact[k-1].rad > ball[i].contact[k].rad){
							ball[i].contact[ball[i].contact.length-1] = ball[i].contact[k];
							ball[i].contact[k] = ball[i].contact[k-1];
							ball[i].contact[k-1] = ball[i].contact[ball[i].contact.length-1];
						}
					}
				}
				//それぞれの接点間の角度を計算する。あと曲線の変わり目がどこにあるのか計算する
				for(j=0; j<=ball[i].collisionC-1; j++){
					ball[i].rad_gap[j] = (ball[i].contact[(j+1)%ball[i].collisionC].rad - ball[i].contact[j].rad + 2*Math.PI) % (2*Math.PI);
					ball[i].gap_number[j] = (Math.round(ball[i].contact[j].rad* 12/ Math.PI) + 24) % 24;
				}
				
				//各接点におけるめり込みぐらいから、中心座標が受けるべき力の大きさ、方向を計算する
				var power = new Point();
				for(j=0; j<=ball[i].collisionC-1; j++){
					if(ball[i].contact[j].excess<0) continue;
					power.x += ball[i].contact[j].excess* ball[i].contact[j].excess* -Math.cos(ball[i].contact[j].rad);
					power.y += ball[i].contact[j].excess* ball[i].contact[j].excess* -Math.sin(ball[i].contact[j].rad);
				}
				ball[i].position.x += 2*power.x/ ball[i].size;
				ball[i].position.y += 2*power.y/ ball[i].size;
				//ベジエ曲線で歪みを表現していく。ついでに曲線状の各点の座標を計算していく
				ctx.beginPath();
				ctx.moveTo(ball[i].contact[0].x, ball[i].contact[0].y);
				var ax = new Array();
				var ay = new Array();
				for(j=0; j<ball[i].collisionC; j++){
					var arc1 = 4/3* ball[i].size* ball[i].size/ (ball[i].size- ball[i].contact[j].excess)* Math.tan(ball[i].rad_gap[j]/4);
					var arc2 = 4/3* ball[i].size* ball[i].size/ (ball[i].size- ball[i].contact[(j+1)%ball[i].collisionC].excess)* Math.tan(ball[i].rad_gap[j]/4);
					//各接点間の中点を求める
					var midPoint = new Point();
					midPoint.x = 1/8* ball[i].contact[j].x+ 3/8* (ball[i].contact[j].x + arc1* Math.cos(ball[i].contact[j].tangent))+ 3/8* (ball[i].contact[(j+1)%ball[i].collisionC].x- arc2* Math.cos(ball[i].contact[(j+1)%ball[i].collisionC].tangent)) + 1/8* ball[i].contact[(j+1)%ball[i].collisionC].x
					midPoint.y = 1/8* ball[i].contact[j].y+ 3/8* (ball[i].contact[j].y + arc1* Math.sin(ball[i].contact[j].tangent))+ 3/8* (ball[i].contact[(j+1)%ball[i].collisionC].y- arc2* Math.sin(ball[i].contact[(j+1)%ball[i].collisionC].tangent)) + 1/8* ball[i].contact[(j+1)%ball[i].collisionC].y
					var midPoint_tangent = ball[i].contact[j].rad + ball[i].rad_gap[j]/2 + Math.PI/2;
					var midPoint_excess = ball[i].size - ball[i].position.distance(midPoint).length();
					arc1 =    4/3* ball[i].size* ball[i].size/ (ball[i].size- ball[i].contact[j].excess)* Math.tan(ball[i].rad_gap[j]/8);
					arc_mid = 4/3* ball[i].size* ball[i].size/ (ball[i].size- midPoint_excess)* Math.tan(ball[i].rad_gap[j]/8);
					arc2 =    4/3* ball[i].size* ball[i].size/ (ball[i].size- ball[i].contact[(j+1)%ball[i].collisionC].excess)* Math.tan(ball[i].rad_gap[j]/8);
					ctx.bezierCurveTo(ball[i].contact[j].x+ arc1* Math.cos(ball[i].contact[j].tangent), ball[i].contact[j].y+ arc1* Math.sin(ball[i].contact[j].tangent),
					                  midPoint.x- arc_mid* Math.cos(midPoint_tangent), midPoint.y- arc_mid* Math.sin(midPoint_tangent),
					                  midPoint.x, midPoint.y);
					
					ctx.bezierCurveTo(midPoint.x+ arc_mid* Math.cos(midPoint_tangent), midPoint.y+ arc_mid* Math.sin(midPoint_tangent),
					                  ball[i].contact[(j+1)%ball[i].collisionC].x- arc2* Math.cos(ball[i].contact[(j+1)%ball[i].collisionC].tangent), ball[i].contact[(j+1)%ball[i].collisionC].y- arc2* Math.sin(ball[i].contact[(j+1)%ball[i].collisionC].tangent),
					                  ball[i].contact[(j+1)%ball[i].collisionC].x, ball[i].contact[(j+1)%ball[i].collisionC].y);
									  
					/*ctx.bezierCurveTo(ball[i].contact[j].x+ arc1* Math.cos(ball[i].contact[j].tangent), ball[i].contact[j].y+ arc1* Math.sin(ball[i].contact[j].tangent),
					                  ball[i].contact[(j+1)%ball[i].collisionC].x- arc2* Math.cos(ball[i].contact[(j+1)%ball[i].collisionC].tangent), ball[i].contact[(j+1)%ball[i].collisionC].y- arc2* Math.sin(ball[i].contact[(j+1)%ball[i].collisionC].tangent),
					                  ball[i].contact[(j+1)%ball[i].collisionC].x, ball[i].contact[(j+1)%ball[i].collisionC].y);*/
									  ax[j] = midPoint.x;
									  ay[j] = midPoint.y;
					//ここから曲線状の各点の座標計算
					var gap = (ball[i].gap_number[(j+1)%ball[i].collisionC] - ball[i].gap_number[j] + 24) % 24
					for(k=0; k<gap/2; k++){
						var t = 2*k/gap;
						ball[i].dot[(ball[i].gap_number[j]+k)%24].x = (1-t)*(1-t)*(1-t)*ball[i].contact[j].x + 3*(1-t)*(1-t)*t*(ball[i].contact[j].x+ arc1* Math.cos(ball[i].contact[j].tangent)) +
					                              3*(1-t)*t*t*(midPoint.x- arc_mid* Math.cos(midPoint_tangent)) + t*t*t*midPoint.x
						ball[i].dot[(ball[i].gap_number[j]+k)%24].y = (1-t)*(1-t)*(1-t)*ball[i].contact[j].y + 3*(1-t)*(1-t)*t*(ball[i].contact[j].y+ arc1* Math.sin(ball[i].contact[j].tangent)) +
					                              3*(1-t)*t*t*(midPoint.y- arc_mid* Math.sin(midPoint_tangent)) + t*t*t*midPoint.y
					}
					for(k=gap-1; k>=gap/2; k--){
						var t = (k-gap/2)*2/(gap);
						ball[i].dot[(ball[i].gap_number[j]+k)%24].x = (1-t)*(1-t)*(1-t)*midPoint.x + 3*(1-t)*(1-t)*t*(midPoint.x+ arc_mid* Math.cos(midPoint_tangent)) +
					                              3*(1-t)*t*t*( ball[i].contact[(j+1)%ball[i].collisionC].x- arc2* Math.cos(ball[i].contact[(j+1)%ball[i].collisionC].tangent)) + t*t*t*ball[i].contact[(j+1)%ball[i].collisionC].x
						ball[i].dot[(ball[i].gap_number[j]+k)%24].y = (1-t)*(1-t)*(1-t)*midPoint.y + 3*(1-t)*(1-t)*t*(midPoint.y+ arc_mid* Math.sin(midPoint_tangent)) +
					                              3*(1-t)*t*t*( ball[i].contact[(j+1)%ball[i].collisionC].y- arc2* Math.sin(ball[i].contact[(j+1)%ball[i].collisionC].tangent)) + t*t*t*ball[i].contact[(j+1)%ball[i].collisionC].y
					}
				}
				ctx.closePath();
				switch(ball[i].color){
					case 0:
					ctx.fillStyle = GREEN;
					break;
					
					case 1:
					ctx.fillStyle = BLUE;
					break;
					
					case 2:
					ctx.fillStyle = RED;
					break;
					
					default:
					ctx.fillStyle = GRAY;
				}
				ctx.fill();
				ball[i].distortionF = true;
				for(j=0; j<ax.length; j++){
				ctx.beginPath();
				ctx.arc(ax[j], ay[j], 2, 0, 2*Math.PI, true);
				ctx.fillStyle = GRAY;
				ctx.fill()
				}
			}
		}

		//2点で接している場合
		/*for(i=0; i<=BALL_MAX_COUNT; i++){
			if(ball[i].alive && ball[i].collisionC ==2){
				//ball[i].position.x = (ball[i].contact[0].x+ ball[i].contact[1].x)/ 2;
				ball[i].position.y = (ball[i].contact[0].y+ ball[i].contact[1].y)/ 2;
				for(j=0; j<ball[i].dot.length; j++){
					for(k=0; k<ball[i].contact.length; k++){
						if(ball[i].contact[k].x != 0){
							if(Math.cos(ball[i].contact[k].rad)* (ball[i].dot[j].y- ball[i].contact[k].y) -Math.sin(ball[i].contact[k].rad)* (ball[i].dot[j].x- ball[i].contact[k].x) > 0){
								var l = Math.cos(ball[i].contact[k].rad)* (ball[i].dot[j].x- ball[i].contact[k].x)+ Math.sin(ball[i].contact[k].rad)* (ball[i].dot[j].y- ball[i].contact[k].y);
								ball[i].dot[j].x = ball[i].contact[k].x+ l* Math.cos(ball[i].contact[k].rad);
								ball[i].dot[j].y = ball[i].contact[k].y+ l* Math.sin(ball[i].contact[k].rad);
								console.log(j, k)
							 }
						}
						else break;
					}
				}
			}
		}*/

		
		//3点で接している場合
		/*for(i=0; i<=BALL_MAX_COUNT; i++){
			if(ball[i].alive && ball[i].collisionC == 3){
				var contact = new Array(3);
				x1=ball[i].contact[0].x;
				y1=ball[i].contact[0].y;
				x2=ball[i].contact[1].x;
				y2=ball[i].contact[1].y;
				x3=ball[i].contact[2].x;
				y3=ball[i].contact[2].y;

				var circumx=((y1-y3)*(y1*y1-y2*y2+x1*x1-x2*x2)-(y1-y2)*(y1*y1-y3*y3+x1*x1-x3*x3))/(2*(y1-y3)*(x1-x2)-2*(y1-y2)*(x1-x3));
				var circumy=((x1-x3)*(x1*x1-x2*x2+y1*y1-y2*y2)-(x1-x2)*(x1*x1-x3*x3+y1*y1-y3*y3))/(2*(x1-x3)*(y1-y2)-2*(x1-x2)*(y1-y3));
				ball[i].contact[0].rad = Math.atan2(y1-circumy, x1-circumx);
				ball[i].contact[1].rad = Math.atan2(y2-circumy, x2-circumx);
				ball[i].contact[2].rad = Math.atan2(y3-circumy, x3-circumx);
				for(j=0; j<=2; j++){
					for(k=2; k>j; k--){
						if(ball[i].contact[k-1].rad > ball[i].contact[k].rad){
							ball[i].contact[7]= ball[i].contact[k];
							ball[i].contact[k] = ball[i].contact[k-1];
							ball[i].contact[k-1] = ball[i].contact[7];
							}
						}
					}
				var rad1_2 = (ball[i].contact[1].rad-ball[i].contact[0].rad+2*Math.PI) % (2*Math.PI);
				var rad2_3 = (ball[i].contact[2].rad-ball[i].contact[1].rad+2*Math.PI) % (2*Math.PI);
				var rad3_1 = (ball[i].contact[0].rad-ball[i].contact[2].rad+2*Math.PI) % (2*Math.PI);
				var r = Math.sqrt((x1-circumx)*(x1-circumx)+(y1-circumy)*(y1-circumy));
				var arc1 = 4*Math.tan(rad1_2/4)/3*ball[i].size*ball[i].size/r;
				var arc2 = 4*Math.tan(rad2_3/4)/3*ball[i].size*ball[i].size/r;
				var arc3 = 4*Math.tan(rad3_1/4)/3*ball[i].size*ball[i].size/r;
				if(r/ball[i].size > 0.85){
					ctx.beginPath()
					ctx.moveTo(ball[i].contact[0].x, ball[i].contact[0].y);
					ctx.bezierCurveTo(ball[i].contact[0].x-arc1*Math.sin(ball[i].contact[0].rad), ball[i].contact[0].y+arc1*Math.cos(ball[i].contact[0].rad), ball[i].contact[1].x+arc1*Math.sin(ball[i].contact[1].rad), ball[i].contact[1].y-arc1*Math.cos(ball[i].contact[1].rad), ball[i].contact[1].x, ball[i].contact[1].y);
					ctx.bezierCurveTo(ball[i].contact[1].x-arc2*Math.sin(ball[i].contact[1].rad), ball[i].contact[1].y+arc2*Math.cos(ball[i].contact[1].rad), ball[i].contact[2].x+arc2*Math.sin(ball[i].contact[2].rad), ball[i].contact[2].y-arc2*Math.cos(ball[i].contact[2].rad), ball[i].contact[2].x, ball[i].contact[2].y);
					ctx.bezierCurveTo(ball[i].contact[2].x-arc3*Math.sin(ball[i].contact[2].rad), ball[i].contact[2].y+arc3*Math.cos(ball[i].contact[2].rad), ball[i].contact[0].x+arc3*Math.sin(ball[i].contact[0].rad), ball[i].contact[0].y-arc3*Math.cos(ball[i].contact[0].rad), ball[i].contact[0].x, ball[i].contact[0].y);
					ctx.fillStyle = GREEN;
					ctx.fill();
					ball[i].distortionF = true;
					ball[i].position.x = circumx;
					ball[i].position.y = circumy;
				}
				else{
					ball[i].alive = false;
					var amount = Math.floor((Math.random()*3) + 7);
					for(j=BALL_MAX_COUNT; j >= BALL_MAX_COUNT - amount; j--){
						ball[j].size = Math.random()*3+Math.sqrt(ball[i].weight/amount)-2
						ball[j].velocity.x = Math.random()*12 - 6;
						ball[j].velocity.y = Math.random()*12;
						ball[j].set(ball[i].position, ball[j].size, ball[j].velocity, Math.ceil(Math.random()*2));
						ball[j].touchF = false
					}
				}
			}
		}*/

		//球の描写
		for(i=0; i<BALL_MAX_COUNT; i++){
			if(ball[i].alive　&& !ball[i].distortionF){
				switch(ball[i].color){
					case 0:
					ctx.fillStyle = GREEN;
					break;
			
					case 1:
					ctx.fillStyle = BLUE;
					break;
			
					case 2:
					ctx.fillStyle = RED;
					break;
					
					default:
					ctx.fillStyle = GRAY;
				}
				ball[i].draw();
			}
		}
		for(i=0; i<BALL_MAX_COUNT; i++){
			if(ball[i].alive){
				ctx.beginPath()
				ctx.arc(ball[i].position.x, ball[i].position.y, 2, 0, 2* Math.PI, true);
				ctx.fillStyle = GRAY;
				ctx.fill();
			}
		}
		//自球の各点の描写
		if(lCounter){
			ctx.beginPath();
			var px = ball[0].dot[lCounter%24].x
			var py = ball[0].dot[lCounter%24].y
			ctx.arc(px, py, 4, 0, Math.PI* 2, true)
			ctx.fillStyle = GRAY;
			ctx.fill();
		}

		//マウスの現在地の描画
		var mx = ball[0].position.x + vector.x;
		var my = ball[0].position.y - vector.y;

		ctx.beginPath();
		ctx.moveTo(mx, my - 15);
		ctx.lineTo(mx + 15, my);
		ctx.lineTo(mx, my + 15);
		ctx.lineTo(mx - 15, my);
		ctx.closePath();
		ctx.arc(mx, my, 10, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.arc(mx, my, 4, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = GREEN;
		ctx.fill();
 
		//点線の描画
		if(lineLF && (ball[0].size + 19 < length)){
 		DOTTED_LINE_COLOR = BLUE;
			ball[0].strokeDottedLine();
		}

		if(lineRF && (ball[0].size + 19 < length)){
 		DOTTED_LINE_COLOR = RED;
			ball[0].strokeDottedLine();
		}

		if(pauseF){
			ctx.beginPath();
			ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2, true);
			ctx.fillStyle = "rgba(  0,   0, 000, 0.5)";
			ctx.fill();
			}

		if(pauseF){
			ctx.fillStyle = DARK_RED;
			ctx.font = "60px 'MSゴシック'"
			ctx.fillText("PAUSE", screenCanvas.width / 2 - 94, screenCanvas.height / 3);
		}



//sconsole.log(ball[0])




		//その他の設定----------------------------------------------------------------------------------------------------
		//キーコード初期化
		//kc = null;

		//HTMLを更新
		info.innerHTML = "PLAYER WEIGHT: " + ball[0].weight +
				 "<br>PLAYER SIZE &nbsp;&nbsp;&nbsp;&nbsp;:" + ball[0].size




		//フラグにより再起呼び出し-----------------------------------------------------------------------------------------
		if(run){setTimeout(arguments.callee, fps);}
	})();
};




// -event--------------------------------------------------------------------------------------------------------------------------

var mouseMove = function(e){
	//マウスカーソルの座標の更新
	mouse.x = e.clientX - screenCanvas.offsetLeft;
	mouse.y = e.clientY - screenCanvas.offsetTop;
};

var keyDown = function(e){
	kc = e.keyCode;
	keyCode[kc] = true;
	if(keyCode[27]) run = false;
};

var keyUp = function(e){
	keyCode[e.keyCode] = false;
};

var mouseDown = function(e){
	if(e.button == 0) prepLF = true;
	if(e.button == 2) prepRF = true;
};

var mouseUp = function(e){
	if(e.button == 0) fireLF = true;
	if(e.button == 2) fireRF = true;
};
window.onblur = function (){

	// 配列をクリアする
	keyCode.length = 0;
};