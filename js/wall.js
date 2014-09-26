function Wall(x,y){
	this.spriteSheetRef = "img/wall.png";
	this.type = WALL;

	this.collidable = true;
	this.collisionType = CIRCLE;
	this.collisionRadius = 2;
	


	this.theta = 0;
	this.viewWidth = 64;
	this.viewHeight = 64;
	this.x = x;
	this.y = y;
	this.collisionX = this.x;
	this.collisionY = this.y;
	
	this.localTicks = 0;

	this.zHeight = 1;
};

Wall.prototype = Object.create(Entity.prototype);