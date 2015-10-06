// -global ------------------------------------------------------------------------------------------------------------------------

var screenCanvas;
var run = true;
var fps = 1000 / 30;
var mouse = new Point();
var ctx;
var counter;
var creatF = false;
var prepF = false;
var fireF = false;
var ck;




// -const -------------------------------------------------------------------------------------------------------------------------

var BALL_MAX_COUNT = 1024;
var PLAYER_COLOR  �@�@= "rgba(  0, 255,   0, 0.85)";//��
var BALL_COLOR_01 �@�@= "rgba(  0,   0, 255, 0.60)";//��
var BALL_COLOR_02�@�@ = "rgba(255,   0,   0, 0.60)";//��
var WALL_COLOR    �@�@= "rgba( 85,  85,  85, 0.75)";//�O���[
var DOTTED_LINE_COLOR = "rgba(255, 140,   0, 0.80)";//�I�����W




// -main --------------------------------------------------------------------------------------------------------------------------

//�y�[�W�ǂݍ��ݎ��ɋN������funciton
window.onload = function(){

	//���[�J���ϐ��̒�`
	var i, j;
	var p = new Point();
	var v = new Point();


	//�X�N���[���̏�����
	screenCanvas = document.getElementById("screen");
	screenCanvas.width = 256;
	screenCanvas.height = 256;


	//2d�R���e�L�X�g
	ctx = screenCanvas.getContext("2d");


	//�C�x���g�̓o�^
	screenCanvas.addEventListener("mousemove", mouseMove, true);
	screenCanvas.addEventListener("mousedown", mouseDown, true);
	window.addEventListener("mouseup", mouseUp, true);
	window.addEventListener("keydown", keyDown, true);


	//��������
	var ball= new Array(BALL_MAX_COUNT);
	for(i = 0; i < BALL_MAX_COUNT; i++){
		ball[i] = new Character;
	}


	//���@������
	p.x = screenCanvas.width / 2;
	p.y = screenCanvas.height / 2 -15;
	v.x = 0;
	v.y = 0;
	ball[0].set(p, 10, v);

	//�����_�����O�������Ăяo��-----------------------------------------------------------------------------------------------

	(function(){
		//�Jc�E���^�[�̒l�𑝂₷
		counter ++;





		//���͂ɂ��ύX---------------------------------------------------------------------------------------------------

		if(ck){
			console.log("���͂��ꂽ�L�[�R�[�h�� " + ck)

			if(ck === 67) creatF = true;

		//�L�[�R�[�h������
		ck = null;
		}





		//�t���O�Ǘ�-------------------------------------------------------------------------------------------------------

		//���@����
		if(creatF){
			for(i = 0; i < BALL_MAX_COUNT; i++){
				if(!ball[i].alive){
					p.x = mouse.x;
					p.y = mouse.y;
					v.x = 0;
					v.y = 0;
					var s = Math.floor(Math.random() * 4) + 6;
					var c = Math.floor(Math.random() * 2) + 1;
					ball[i].set(p, s, v, c);
					creatF = false;
					break;
				}
			}
		}



		//������
		if(fireF){
			prepF = false;
			fireF = false;
		}



		//���̂̓����𐧌�-------------------------------------------------------------------------------------------------

		//���R����
		for(i = 0; i < BALL_MAX_COUNT; i++){
			if(ball[i].alive && !ball[i].absorption){
				ball[i].fall();
			}
		}

		//���x���ʒu���ɕϊ�
		for(i = 0; i < BALL_MAX_COUNT; i++){
			if(ball[i].alive && !ball[i].absorption){
				ball[i].move();
			}
		}

		//�n�ʂƂ̏Փ�
		for(i = 0; i < BALL_MAX_COUNT; i++){
			if(ball[i].alive && !ball[i].absorption){
				if(ball[i].position.y >= 243 - ball[i].size){
					//�����W���̐ݒ�Ƃ߂荞�񂾒l���v�Z
					var e = 0.6;
					var excess = ball[i].position.y - (243 - ball[i].size);

					ball[i].velocity.y += Math.sqrt(2 * 0.3 * e * excess) + 0.52 ;
					ball[i].position.y = 243 - ball[i].size;
					ball[i].velocity.y *= -e;
				}
			}
		}

		//�ǂƂ̏Փ�
		for(i = 0; i < BALL_MAX_COUNT; i++){
			if(ball[i].alive && !ball[i].absorption){
				if(ball[i].position.x <= ball[i].size){
					ball[i].position.x = ball[i].size;
					ball[i].velocity.x *= -0.9;
				}
				else if(ball[i].position.x >= 256 - ball[i].size){
					ball[i].position.x = 256 - ball[i].size;
					ball[i].velocity.x *= -0.9;
				}
			}
		}

		//�{�[�����m�̏Փ�
		for(i = 0; i < BALL_MAX_COUNT; i++){
			for(j = i + 1; j < BALL_MAX_COUNT; j++){
				if(ball[i].alive && !ball[i].absorption && ball[j].alive && !ball[j].absorption){
					p = ball[j].position.distance(ball[i].position);
					if( (p.length() < ball[j].size + ball[i].size) && (ball[i].color + ball[j].color === 3 || !i && ball[0].size < ball[j].size + 1) ){
						//�{�[���̂߂荞�񂾈ʒu�֌W�����ɖ߂�
						ball[j].positionCorrect(ball[i]);
						//���x�x�N�g�����d�S�����Ɛ����ȕ����ɕ������A�Փˌ�̑��x�����߂�
						ball[j].collisionCalculate(ball[i]);
					}
					else if( p.length() < ball[j].size + ball[i].size - 2 && ball[i].color + ball[j].color !== 3){
						if(!i && ball[0].size < ball[j].size + 1){
							break;
						}
						//�{�[�����m����������
						ball[j].absorptionCalculate(ball[i]);
						
					}
				}
			}
		}





		//��ʂ̕`����s��-------------------------------------------------------------------------------------------------


		//�X�N���[���N���A
		ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

		//�w�i�̕`��-------------------------------------------------

		//�n�ʂ̕`��
		ctx.beginPath();
		ctx.fillStyle = WALL_COLOR;
		ctx.fillRect(0, 243, screenCanvas.width, 10);

		//���̂̕`��-------------------------------------------------

		//���@�̕`��
		ctx.beginPath();
		ctx.arc(ball[0].position.x, ball[0].position.y, ball[0].size, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = PLAYER_COLOR;
		ctx.fill();

		//���@�̕`��

		//�ۂ̕`��
		ctx.beginPath();
		for(i = 1; i < BALL_MAX_COUNT; i++){
			if(ball[i].alive && !ball[i].absorption && ball[i].color ===1){
				ctx.arc(ball[i].position.x, ball[i].position.y, ball[i].size, 0, Math.PI * 2, true);
				ctx.closePath();
			}
		}
		ctx.fillStyle = BALL_COLOR_01;
		ctx.fill();

		//�Ԋۂ̕`��
		ctx.beginPath();
		for(i = 1; i < BALL_MAX_COUNT; i++){
			if(ball[i].alive && !ball[i].absorption && ball[i].color === 2){
				ctx.arc(ball[i].position.x, ball[i].position.y, ball[i].size, 0, Math.PI * 2, true);
				ctx.closePath();
			}
		}
		ctx.fillStyle = BALL_COLOR_02;
		ctx.fill();

		//�_���̕`��
		if(prepF){
			ball[0].strokeDottedLine(mouse)
			
		}




		//�t���O�ɂ��ċN�Ăяo��-----------------------------------------------------------------------------------------
		if(run){setTimeout(arguments.callee, fps);}
	})();
};




// -event--------------------------------------------------------------------------------------------------------------------------

var mouseMove = function(event){
	//�}�E�X�J�[�\���̍��W�̍X�V
	mouse.x = event.clientX - screenCanvas.offsetLeft;
	mouse.y = event.clientY - screenCanvas.offsetTop;
}

var keyDown = function(event){
	//�L�[�R�[�h���擾
	ck = event.keyCode;

	//Esc�L�[��������Ă�����t���O���~�낷
	if(ck === 27)run = false;
}

var mouseDown = function(event){
	prepF = true;
}

var mouseUp = function(event){
	fireF = true;
}
