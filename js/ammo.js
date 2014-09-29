function Ammo(x,y){

	this.spriteSheetRef = "img/ammo.png";

	
	this.type = GAMEITEM;
	this.subType = AMMO;
	
	this.viewWidth = 16;
	this.viewHeight = 16;

	this.theta = 0;
	this.x = x;
	this.y = y;
	this.lastX = this.x;
	this.lastY = this.y;

	
	this.collidable = true;
	this.collisionType = RECTANGLE;

	this.collisionWidth = this.viewWidth;
	this.collisionHeight = this.viewHeight;
	this.collisionX = this.x;
	this.collisionY = this.y;
	 this.maxHealth;
	
	this.zHeight = 0;
	this.speed = 1;	
	

	this.collected = false;

}

Ammo.prototype = Object.create(Entity.prototype);

Ammo.prototype.updateCollision = function(oe){
	switch(oe.type){
		case PLAYER:
			this.collected = true;
			break;
	}
};

Ammo.prototype.shouldDestroy = function(){
	return this.collected;
};