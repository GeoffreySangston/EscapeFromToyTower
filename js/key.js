function Key(x,y){

	this.spriteSheetRef = "img/key.png";

	
	this.type = GAMEITEM;
	
	this.subType = KEY;
	
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

Key.prototype = Object.create(Entity.prototype);

Key.prototype.updateCollision = function(oe){
	switch(oe.type){
		case PLAYER:
			this.collected = true;
			break;
	}
};

Key.prototype.shouldDestroy = function(){
	return this.collected;
};