/**
Abstract class 
*/

function Entity(x,y){
	this.spriteSheetRef;

	this.type;
	this.x = x;
	this.y = y;
	this.viewWidth;
	this.viewHeight;
	this.pw; // rotate point
	this.ph;
	
	/*
	Collision info.
	
	Trying to go a new route and make this game using only circles and axis-aligned rectangles.
	*/
	this.collidable = true;
	this.collisionType;
	this.collisionRadius;
	//this.collisionX; //this is the center of the collision circle
	//this.collisionY;
	this.collisionWidth;
	this.collisionHeight;
	
	this.containedEntities;
	
	this.localTicks = 0;
	
	this.zHeight = 0; // zHeight ranks rendering priority
}


Entity.prototype.collides = function(oe){
	if(this.collidable && oe.collidable){
		return this.circleCircleCollides(oe);
	}
};

Entity.prototype.circleCircleCollides = function(oe){
	var thisRad = this.collisionRadius;
	var oeRad = oe.collisionRadius;
	
	var thisCXY = this.calcCollisionXY();
	var oeCXY = oe.calcCollisionXY();
	
	var thisCX = thisCXY.x;
	var thisCY = thisCXY.y;
	var oeCX = oeCXY.x;
	var oeCY = oeCXY.y;
	
	var dist = Math.sqrt(Math.pow(thisCX - oeCX,2) + Math.pow(thisCY - oeCY,2));
	return thisRad + oeRad > dist;
};

Entity.prototype.__calcCenterTheta = function(){ // angle between top left corner and center
	return Math.atan2(this.viewHeight, this.viewWidth);
};
Entity.prototype.__calcCornerDist = function(){
	return Math.sqrt(Math.pow(this.viewWidth/2,2) + Math.pow(this.viewHeight/2,2));
};
Entity.prototype.calcCenterXY = function(){
	var cornerDist = this.__calcCornerDist();
	var centerTheta = this.__calcCenterTheta();
	return {x : this.x + cornerDist*Math.cos(centerTheta), y : this.y + cornerDist*Math.cos(centerTheta)};
};

Entity.prototype.calcCollisionXY = function(){
	return this.calcCenterXY();
};

Entity.prototype.setCenter = function(cx,cy){
	/*
	Sets the center of the object to cx,cy by updating the x,y 
	accordingly (remember x,y is always the top left of the object
	regardless of rotation)
	*/
	this.x = cx - this.viewWidth/2;
	this.y = cy - this.viewHeight/2;	
	
};


Entity.prototype.update = function(game){
	this.localTicks++;
};

Entity.prototype.shouldDestroy = function(){
	return false;
};

Entity.prototype.shouldRender = function(){
	return true;
	//return (this.x + this.viewWidth > 0 && this.x < GAMEWIDTH) && (this.y + this.viewHeight > 0 && this.y < GAMEHEIGHT);
};

/**
Should only update "next" variables - variables which are updated and then later in the same frame applied
or variables who other entities don't depend from
*/
Entity.prototype.updateCollision = function(oe){

};

/*
FLOCKING

Could optimize by keeping track of specific flock
arrays instead of iterating through the entire entity
array

The entityIdTypes parameter is an array of the types of
entities that this entity should try to flock with
*/
Entity.prototype.computeAlignment = function(entityIdTypes){
	
};
Entity.prototype.computeCohesion = function(entityIdTypes){

};
Entity.prototype.computeSeparation = function(entityIdTypes){
	
};
