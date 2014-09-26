/**
Player defines the base of the turret. It also has a contained entity called PlayerGun.
*/
function Player(x,y, theta){
	this.spriteSheetRef = "img/wall.png";
	
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
		case WALL:
			var x = this.x;
			var y = this.y;
			
			this.x = this.lastX;
			if(!this.collides(oe)){ // this is to allow sliding along
				break;				// the wall even though it's colliding
			}						// along one direction
			
			this.x = x;
			this.y = this.lastY;    // same as above
			if(!this.collides(oe)){
				break;
			}
			
			this.x = this.lastX;
			this.y = this.lastY;
			break;
		default:
	}
};
