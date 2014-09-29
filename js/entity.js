/**
Abstract class 
*/

function Entity(x,y){
	this.spriteSheetRef;

	this.type;
	this.x = x;
	this.y = y;
	this.lastX = this.x;
	this.lastY = this.y;

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
		return this.rectRectCollides(oe);
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

Entity.prototype.rectRectCollides = function(oe){
	//return !(x_1 > x_2+width_2 || x_1+width_1 < x_2 || y_1 > y_2+height_2 || y_1+height_1 < y_2);
	var thisColWidth = this.collisionWidth;
	var thisColHeight = this.collisionHeight;
	var oeColWidth = oe.collisionWidth;
	var oeColHeight = oe.collisionHeight;
	
	return !(this.x > oe.x + oeColWidth || this.x + thisColWidth < oe.x || this.y > oe.y + oeColHeight || this.y + thisColHeight < oe.y);
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

Entity.prototype.calcAngleToOECenter = function(oe){
	var oeCenter = oe.calcCenterXY();
	var thisCenter = this.calcCenterXY();			
			
	var theta = Math.atan2(thisCenter.y - oeCenter.y, thisCenter.x - oeCenter.x);
	theta = (theta + 2*Math.PI) % (2*Math.PI);
	return theta;		
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

Entity.prototype.destroyEvent = function(game){
	
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

Entity.prototype.actWallCollision = function(oe){
	var x = this.x;
	var y = this.y;
			
	this.x = this.lastX;
	if(!this.collides(oe)){ // this is to allow sliding along
		return;				// the wall even though it's colliding
	}						// along one direction
		
	this.x = x;
	this.y = this.lastY;    // same as above
	if(!this.collides(oe)){
		return;
	}
				
	this.x = this.lastX;
	this.y = this.lastY;
};

Entity.prototype.calcCurMazeSquareIndex = function(game){
	var maze = game.stateMachine.curState.curRound.maze;
	var spaces = game.stateMachine.curState.curRound.mazeSpaces;
	
	var centerXY = this.calcCenterXY();
	var column = Math.floor(centerXY.x/spaces[0].viewWidth);
	var row = Math.floor(centerXY.y/spaces[0].viewHeight);
	
	return maze.numTileColumns * row + column;
};