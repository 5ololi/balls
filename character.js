//���̂��`����֐�---------------------------------------------------------------------------------------------------------------


var Character = function(){
	//���X�̐ݒ�
	this.position = new Point();
	this.velocity = new Point();
	this.alive = false;
	this.color = 0;
	this.size = 0;
	this.weight = 0;
	this.absorption = false;
}

Character.prototype.set = function(p, s, v, c){
	//���W�A���x�A�T�C�Y���Z�b�g
	this.position.x = p.x;
	this.position.y = p.y;

	this.velocity.x = v.x;
	this.velocity.y = v.y;

	this.color = c;
	this.size = s;
	this.weight = s * s * s;
	//�����t���O�𗧂Ă�
	this.alive = true;
};



//�N���b�N���ɓ��삷��֐�
Character.prototype.strokeDottedLine = function(p){
	var d = this.position.distance(p).length();
	var rad = Math.atan2( (p.y - this.position.y), (p.x - this.position.x) )
	var space = 10;
	var dotted = Math.round( (d - this.size) / space / 2 );
	
	var p1x, p1y, p2x, p2y;

	ctx.beginPath();
console.log(dotted)
	for(var i = 0; i < dotted - 0 ; i++){

		p1x = this.position.x + (this.size + space * 2 * i) * Math.cos(rad);
		p1y = this.position.y + (this.size + space * 2 * i) * Math.sin(rad);
		p2x = this.position.x + (this.size + space * (2 * i + 1)) * Math.cos(rad);
		p2y = this.position.y + (this.size + space * (2 * i + 1)) * Math.sin(rad);

		ctx.moveTo(p1x, p1y);
		ctx.lineTo(p2x, p2y);
		ctx.closePath();
	}


	ctx.lineWidth = 3;
	ctx.lineCap = "round";
	ctx.strokeStyle = DOTTED_LINE_COLOR;
	ctx.stroke();
};


//���̂̓����𐧌䂷��֐�---------------------------------------------------------------------------------------------------------


//���R����
Character.prototype.fall = function(){
	this.velocity.y -= 0.3;
};


//���x���ʒu���ɕϊ�
Character.prototype.move = function(){
	//���x�̏����ݒ�
	if(this.velocity.x >=  10) this.velocity.x =  10
	if(this.velocity.x <= -10) this.velocity.x = -10

	//���x���ʒu���ɕϊ�
	this.position.x += this.velocity.x;
	this.position.y -= this.velocity.y;

	//�ʒu���̏����ݒ�
	if(this.position.y >= 243 - this.size) this.position.y = 243 - this.size;
	if(this.position.x <= this.size ) this.position.x = this.size;
	if(this.position.x >= 256 - this.size) this.position.x = 256 - this.size;
};


//���̊Ԃ̏Փ˂ɂ����Ă߂荞�񂾕��̕␳���s��
Character.prototype.positionCorrect = function(p){
	//���̓�_�Ԃ̍���\���x�N�g���A�����A�߂荞�񂾒����������߂�
	var vx = p.position.x - this.position.x;
	var vy = p.position.y - this.position.y;
	var len = Math.sqrt(vx * vx + vy * vy);
	var excess = (this.size + p.size) - len;

	//�x�N�g���̐��K�����s���A������0�ȉ��̏ꍇ�̓G���[��ł��o���ăQ�[�����~�߂�
	if(len > 0){
		len = 1 / len;
		vx *= len;
		vy *= len;
	}
	else console.log("Character.positionCorrection ERROR");

	//�߂荞�񂾕��������o���悤�ɕ␳����
	excess /= this.size + p.size;
	p.position.x += vx * excess * this.size;
	p.position.y += vy * excess * this.size;
	this.position.x -= vx * excess * p.size;
	this.position.y -= vy * excess * p.size;
};


//���̊Ԃ̏Փˌ�̑��x�����ꂼ�ꋁ�߂�
Character.prototype.collisionCalculate = function(p){
	//���ꂼ��̑��x���d�S����(mx,my)�Ɛڐ����(rx,ry)�ɕ�������
	var t;
	var vx =  (p.position.x - this.position.x);
	var vy = -(p.position.y - this.position.y);

	t = - ( vx * this.velocity.x + vy * this.velocity.y) / (vx * vx + vy * vy);
	var arx = this.velocity.x + vx * t;
	var ary = this.velocity.y + vy * t;

	t = - (-vy * this.velocity.x + vx * this.velocity.y) / (vx * vx + vy * vy);
	var amx = this.velocity.x - vy * t;
	var amy = this.velocity.y + vx * t;

	t = - ( vx * p.velocity.x + vy * p.velocity.y) / (vx * vx + vy * vy);
	var brx = p.velocity.x + vx * t;
	var bry = p.velocity.y + vy * t;

	t = - (-vy * p.velocity.x + vx * p.velocity.y) / (vx * vx + vy * vy);
	var bmx = p.velocity.x - vy * t;
	var bmy = p.velocity.y + vx * t;

	//�����W���̐ݒ�Əd���̌���A�Փˌ�̏d�S�����̒l�����߂�
	var e = 0.9;
	var adx = (this.weight * amx + p.weight * bmx + bmx * e * p.weight - amx * e * p.weight) / (this.weight + p.weight);
	var bdx = -e * (bmx - amx) + adx;
	var ady = (this.weight * amx + p.weight * bmy + bmy * e * p.weight - amy * e * p.weight) / (this.weight + p.weight);
	var bdy = -e * (bmy - amy) + ady;

	//�ڐ�������x�Əd�S�������x�𑫂��ďՓˌ�̑��x�����߂�
	this.velocity.x = adx + arx;
	this.velocity.y = ady + ary;
	p.velocity.x = bdx + brx;
	p.velocity.y = bdy + bry;
};

//��̂̕��̂���������
Character.prototype.absorptionCalculate = function(p){
	//��̊Ԃ̏d�S�����߂�
	var cp = new Point();
	cp.x = (this.weight * this.position.x + p.weight * p.position.x) / (this.weight + p.weight);
	cp.y = (this.weight * this.position.y + p.weight * p.position.y) / (this.weight + p.weight);

	//�z����̑��x�����߂�
	var cv = new Point();
	cv.x = (this.weight * this.velocity.x + p.weight * p.velocity.x) / (this.weight + p.weight);
	cv.y = (this.weight * this.velocity.y + p.weight * p.velocity.y) / (this.weight + p.weight);

	//�Â��ق��̃{�[����absorption�t���O��^�ɂ��A�ʒu���Ƒ��x�A�T�C�Y�A���ʂ��X�V����
	this.absorption = true;
	p.position.x = cp.x;
	p.position.y = cp.y;
	p.velocity.x = cv.x;
	p.velocity.y = cv.y;
	p.size = Math.cbrt(p.weight + this.weight);
	p.weight = p.size * p.size * p.size;

}