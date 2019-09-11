/**
Player defines the base of the turret. It also has a contained entity called PlayerGun.
*/
function Player(x,y, theta){
	this.spriteSheetRef = "img/you.png";
	
	this.type = PLAYER;
	this.x = x;
	this.y = y;
	
	this.lastX = this.x;
	this.lastY = this.x;
	
	this.viewWidth = 16;
	this.viewHeight = 16;
	
	this.theta = theta;
	this.collidable = true;
	this.collisionType = RECTANGLE;
	
	this.collisionWidth = this.viewWidth;
	this.collisionHeight = this.viewHeight;
	this.collisionX = this.x;
	this.collisionY = this.y;
	
	this.alive = true;
	this.zHeight = 1;
	this.speed = 5;
	
	this.gun = new Gun();
	
	this.toysCollected = 0;
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
		case WALL:
			this.actWallCollision(oe);
			break;
		case SPAWNABLE:
			if(!oe.friendly){
				this.alive = false;
			} else {
				this.toysCollected++;
			}
			break;
		case GAMEITEM:
			if(oe.subType == AMMO){
				this.gun.ammo += 5;
			}
		default:
	}
};
