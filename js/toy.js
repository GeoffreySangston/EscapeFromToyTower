function Toy(x,y,toyId){
	this.spriteSheetRef;
	switch(toyId){
		default:
		this.spriteSheetRef = "img/mrbear.png";
	}
	
	this.type = SPAWNABLE;
	
	this.viewWidth = 24;
	this.viewHeight = 24;

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
	
	this.maxHealth = 4;
	this.curHealth = this.maxHealth;
	
	this.zHeight = 1;
	this.speed = 4;	
	
	this.hasEncounteredPlayer = false;
	this.encounterTick;
	this.friendly = true;
	this.collected = false;
	this.ticksFriendlyFor = 20*10;
	this.ticksAngryFor = 40*10;
	this.unfriendlyTick;
	
	this.friendlyBarMaxWidth = this.viewWidth;
	this.friendlyBarHeight = 4;
	
	this.curPath;
	
	
}

Toy.prototype = Object.create(Entity.prototype);

Toy.prototype.updateCollision = function(oe){
	switch(oe.type){
		case PLAYER:
			this.actPlayerCollision();
			break;
		case WALL:
			this.actWallCollision(oe);
			break;
		case BULLET:
			this.curHealth -= oe.damage;
			break;
	}
};

Toy.prototype.actPlayerCollision = function(){
	if(this.friendly){
		this.collected = true;
	}
};

Toy.prototype.shouldDestroy = function(){
	return this.collected || this.curHealth <= 0;
};

Toy.prototype.destroyEvent = function(game){
	var entities = game.stateMachine.curState.entities;
	var ammo = new Ammo(0, 0);
	var thisCenter = this.calcCenterXY();
		
	ammo.setCenter(thisCenter.x, thisCenter.y);
	entities.push(ammo);
};

Toy.prototype.update = function(game){
	var gameState = game.stateMachine.curState;

	if(!this.hasEncounteredPlayer){
		this.hasEncounteredPlayer = this.isEncounteringPlayer(game);
		if(this.hasEncounteredPlayer){
			this.encounterTick = gameState.localTicks;
		}
	} else {
		if(this.friendly){
			this.friendly = this.stillFriendly(gameState.localTicks);
		} else {
			if(!this.unfriendlyTick){

				game.stateMachine.curState.curRound.numFriendlyToysLeft--;
				var center = this.calcCenterXY();
				game.stateMachine.curState.curRound.lastFriendlyCX = center.x;
				game.stateMachine.curState.curRound.lastFriendlyCY = center.y;
				this.unfriendlyTick = gameState.localTicks;
			}

			this.chaseAndKillPlayer(game);
			
			/*if(gameState.localTicks - this.unfriendlyTick > this.ticksAngryFor){
				if(!this.isEncounteringPlayer(game)){
					this.hasEncounteredPlayer = false;
					this.friendly = true;
					this.encounterTick = undefined;
					this.unfriendlyTick = undefined;
				}
			}*/
		}
	}
	
}

Toy.prototype.isEncounteringPlayer = function(game){
	var onScreen = game.renderer.isOnScreen(this.x, this.y, this.viewWidth, this.viewHeight);
	
	return onScreen;
};

Toy.prototype.stillFriendly = function(gameStateTicks){
	return gameStateTicks - this.encounterTick <= this.ticksFriendlyFor;
};

Toy.prototype.calcCurFriendlyBarWidth = function(gameStateTicks){
	var width = this.friendlyBarMaxWidth * (this.ticksFriendlyFor - (gameStateTicks - this.encounterTick))/this.ticksFriendlyFor;
	
	return width;
};

Toy.prototype.chaseAndKillPlayer = function(game){
	if(this.closeEnoughToPlayer(game)){
		this.curPath = null;
		this.moveTowardsPlayer(game);
	} else {
		if(this.pathEndReached(game)){
			this.curPath = this.calcPathToPlayer(game);
		}
		this.followCurPath(game);
	}
};

Toy.prototype.moveTowardsPlayer = function(game){
	var playerCenter = game.player.calcCenterXY();
	var thisCenter = this.calcCenterXY();
	
	var theta = Math.atan2(playerCenter.y - thisCenter.y, playerCenter.x - thisCenter.x);
	this.x += this.speed * Math.cos(theta);
	this.y += this.speed * Math.sin(theta);
};

Toy.prototype.closeEnoughToPlayer = function(game){
	var maze = game.stateMachine.curState.curRound.maze;
	var player = game.player;
	var playerSquareIndex = player.calcCurMazeSquareIndex(game);
	var thisSquareIndex = this.calcCurMazeSquareIndex(game);
	
	var playerSpaceRow = maze.calcRow(playerSquareIndex);
	var playerSpaceCol = maze.calcColumn(playerSquareIndex);
	var thisSpaceRow = maze.calcRow(thisSquareIndex);
	var thisSpaceCol = maze.calcColumn(thisSquareIndex);
	
	if(Math.abs(playerSpaceRow - thisSpaceRow) + Math.abs(playerSpaceCol - thisSpaceCol) <= 1){
		return true;
	}
};

/**
Returns an array of tile indices the toy should follow to get 
to the player from the current tile
*/
Toy.prototype.calcPathToPlayer = function(game){
	var maze = game.stateMachine.curState.curRound.maze;
	var player = game.player;
	var playerSquareIndex = player.calcCurMazeSquareIndex(game);
	var thisSquareIndex = this.calcCurMazeSquareIndex(game);
	
	var path = [thisSquareIndex];
	var curPathIndex = 0;
	var steps = 0;
	var alreadyExploredSpaces = [];
	while(path.length > 0 && path[curPathIndex] != playerSquareIndex){
		var adjSpaceIndices = this.__calcAdjacentSpaceIndices(path[curPathIndex], maze.mazeTiles, maze.numTileColumns);

		for(var i = adjSpaceIndices.length-1; i >= 0; i--){ // we want to remove the adjacentSpaces that might lead us backwards in our path
			if(path.indexOf(adjSpaceIndices[i]) > -1){
				adjSpaceIndices.splice(i,1); // ignore the adjacent spaces
			}
			if(alreadyExploredSpaces.indexOf(adjSpaceIndices[i]) > -1){
				adjSpaceIndices.splice(i,1);
			}
		}
		/*console.log(adjSpaceIndices);
		console.log(thisSquareIndex + " : " + playerSquareIndex);
		console.log(path);
		console.log("&&&");*/

		if(adjSpaceIndices.length > 0){
			var nextAdjIndex = 0;
			
			if(curPathIndex < path.length - 1){ // means we reached B or C before
				var lastTraveledToSpaceIndex = path[curPathIndex+1];
				nextAdjIndex = adjSpaceIndices.indexOf(lastTraveledToSpaceIndex) + 1;
				alreadyExploredSpaces.push(path.pop());
			}
			
			if(nextAdjIndex >= adjSpaceIndices.length){
				// then have to move up again because this does not exist
				curPathIndex--;
			} else {
				
				path.push(adjSpaceIndices[nextAdjIndex]);
				curPathIndex++;
			}
			
		} else {
			if(curPathIndex < path.length - 1){
				alreadyExploredSpaces.push(path.pop());
			}
			curPathIndex--; // B
		}
		steps++;
	}
	
	return path;
};

Toy.prototype.__calcAdjacentSpaceIndices = function(index, mazeTiles, numColumns){
	
	var upIndex = index - numColumns;
	var downIndex = index + numColumns;
	var leftIndex = index - 1;
	var rightIndex = index + 1;

	var adjacentSpaces = [];
	if(upIndex >= 0){
		if(mazeTiles[upIndex] == 0){
			adjacentSpaces.push(upIndex);
		}
	}
	if(rightIndex % numColumns != 0){
		if(mazeTiles[rightIndex] == 0){
			adjacentSpaces.push(rightIndex);
		}
	}
	if(downIndex < mazeTiles.length){
		if(mazeTiles[downIndex] == 0){
			adjacentSpaces.push(downIndex);
		}
	}
	if(leftIndex + 1 % numColumns != 0){
		if(mazeTiles[leftIndex] == 0){
			adjacentSpaces.push(leftIndex);
		}
	}
	
	return adjacentSpaces;
};

Toy.prototype.pathEndReached = function(game){
	return !this.curPath || (this.calcCurMazeSquareIndex(game) == this.curPath[this.curPath.length - 1]);
};

Toy.prototype.followCurPath = function(game){
	var curSpaceIndex = this.calcCurMazeSquareIndex(game);
	var nextPathIndex = this.curPath.indexOf(curSpaceIndex) + 1;
	if(nextPathIndex < this.curPath.length){
		var nextSpaceIndex = this.curPath[nextPathIndex];
		this.moveTowardSpace(curSpaceIndex,nextSpaceIndex,game);	
	} else {
	
	}
};
Toy.prototype.moveTowardSpace = function(curSpaceIndex,nextSpaceIndex, game){
	var curRound = game.stateMachine.curState.curRound;
	var maze = curRound.maze;
	
	var nextSpaceRow = maze.calcRow(nextSpaceIndex);
	var nextSpaceCol = maze.calcColumn(nextSpaceIndex);
	var thisSpaceRow = maze.calcRow(curSpaceIndex);
	var thisSpaceCol = maze.calcColumn(curSpaceIndex);

	
	this.lastX = this.x;
	this.lastY = this.y;
	
	
	var spaceWidth = curRound.mazeSpaces[0].viewWidth;
	var spaceHeight = curRound.mazeSpaces[0].viewHeight;
	
	var nextSpaceCY = nextSpaceRow*spaceWidth + spaceWidth/2;
	var nextSpaceCX = nextSpaceCol*spaceHeight + spaceHeight/2;

	var thisC = this.calcCenterXY();
	var theta = Math.atan2(nextSpaceCY - thisC.y, nextSpaceCX - thisC.x);
	this.x += this.speed*Math.cos(theta);
	this.y += this.speed*Math.sin(theta);
	
};

