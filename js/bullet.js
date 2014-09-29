function Bullet(x,y,theta){
	this.spriteSheetRef = "img/wall.png";
	this.type = BULLET;

	
	this.x = x;
	this.y = y;
	this.collisionX = x;
	this.collisionY = y;
	this.theta = theta;
	this.viewWidth = 4;
	this.viewHeight = 4;
	
	
	this.collidable = true;
	this.collisionType = RECTANGLE;
	this.collisionWidth = this.viewWidth;
	this.collisionHeight = this.viewHeight;
	
	this.speed = 8;
	this.damage; // damage is given by the gun shooting the bullet
	
	this.localTicks = 0;
	
	this.hitSomething = false;
	this.playerBullet = true;
	
	this.zHeight = 1;
}

Bullet.prototype = Object.create(Entity.prototype);

Bullet.prototype.update = function(game){
	this.x += this.speed*Math.cos(this.theta);
	this.y += this.speed*Math.sin(this.theta);
	this.collisionX = this.x;
	this.collisionY = this.y;
	this.localTicks++;
};

Bullet.prototype.shouldDestroy = function(){
	return this.localTicks > 100 || this.hitSomething;
};

/**
Should only update "next" variables - variables which are updated and then later in the same frame applied
or variables who other entities don't depend from
*/
Bullet.prototype.updateCollision = function(oe){
	switch(oe.type){
		case SPAWNABLE:
			this.hitSomething = true;
		break;
		case WALL:
			this.hitSomething = true;
		break;
		default:

	}
};