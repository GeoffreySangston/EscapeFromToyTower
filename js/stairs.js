function Stairs(x,y){

	this.spriteSheetRef = "img/wall.png";

	
	this.type = GAMEITEM;
	
	this.viewWidth = 16;
	this.viewHeight = 16;

	this.theta = 0;
	this.x = x;
	this.y = y;
	
	
	
	this.collisionType = RECTANGLE;

	this.collisionWidth = this.viewWidth;
	this.collisionHeight = this.viewHeight;
	this.collisionX = this.x;
	this.collisionY = this.y;
	

	this.zHeight = 0;	
	
	this.revealed = false;
	this.collidable = true;
	this.playerSteppedInto = false;
}

Stairs.prototype = Object.create(Entity.prototype);

/**
Should only update "next" variables - variables which are updated and then later in the same frame applied
or variables who other entities don't depend from
*/
Stairs.prototype.updateCollision = function(oe){
	switch(oe.type){
		case PLAYER:
			this.playerSteppedInto = true;
			break;
		default:
			console.log(oe.type);
	}
};