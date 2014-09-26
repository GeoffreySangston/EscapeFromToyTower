function Wall(x,y){
	this.spriteSheetRef = "img/wall.png";
	this.type = WALL;


	this.theta = 0;
	this.viewWidth = 64;
	this.viewHeight = 64;
	this.blockWidth = 64; // the width/height of each section of the wall
	this.blockHeight = 64;
	
	this.x = x;
	this.y = y;
	this.collisionX = this.x;
	this.collisionY = this.y;
	
	this.collidable = true;
	this.collisionType = RECTANGLE;
	
	this.collisionWidth = this.viewWidth;
	this.collisionHeight = this.viewHeight;
	
	this.localTicks = 0;

	this.zHeight = 1;
};

Wall.prototype = Object.create(Entity.prototype);