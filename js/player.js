/**
Player defines the base of the turret. It also has a contained entity called PlayerGun.
*/
function Player(x,y, theta){
	this.spriteSheetRef = "img/wall.png";
	
	this.type = PLAYER;
	this.x = x;
	this.y = y;
	this.theta = theta;
	this.collidable = true;
	this.collisionType = CIRCLE;
	this.collisionRadius = 10;
	this.collisionX = this.x;
	this.collisionY = this.y;
	
	this.viewWidth = 16;
	this.viewHeight = 16;
	

	this.maxHealth = 50;
	this.curHealth = this.maxHealth;
	
	this.zHeight = 0;
	this.speed = 3;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.moveLeft = function(){
	this.x -= this.speed;
};
Player.prototype.moveRight = function(){
	this.x += this.speed;
};
Player.prototype.moveUp = function(){
	this.y -= this.speed;
};
Player.prototype.moveDown = function(){
	this.y += this.speed;
};


/**
Should only update "next" variables - variables which are updated and then later in the same frame applied
or variables who other entities don't depend from
*/
Player.prototype.updateCollision = function(oe){
	switch(oe.type){

		default:
	}
};
