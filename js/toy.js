function Toy(x,y,toyId){
	this.spriteSheetRef;
	switch(toyId){
		default:
		this.spriteSheetRef = "img/wall.png";
	}
	
	this.type = SPAWNABLE;
	
	this.viewWidth = 24;
	this.viewHeight = 24;

	this.theta = 0;
	this.x = x;
	this.y = y;
	
	
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

Toy.prototype = Object.create(Entity.prototype);