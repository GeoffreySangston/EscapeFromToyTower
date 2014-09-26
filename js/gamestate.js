/**
Could also be called round state
*/

function GameState(){
	this.eventHandler = new GameEventHandler();
	this.localTicks;
	this.curRound;
	
	this.entities;	
	this.collisions;
	
	this.curDialogue;
	
	this.playMode = true; // currently only two modes, play mode and dialogue mode so 
						  // if this is false => dialogue mode
}

GameState.prototype = Object.create(State.prototype);

GameState.prototype.serialize = function(){
	return JSON.stringify(this);
};

GameState.prototype.init = function(game){ // init from here because may have to read from localstorage
	this.localTicks = 0;
	
	this.entities = [];
	this.collisions = [];
	

	this.curRound = game.roundManager.getCurRound();
	
	this.initMazeWalls();
	this.entities.push(game.player);
	
	//game.audioHandler.cache["audio/DopestRiff3.mp3"].play();
};

GameState.prototype.initMazeWalls = function(){
	var maze = this.curRound.maze;
	for(var i = 0; i < maze.numTileRows; i++){
		for(var j = 0; j < maze.numTileColumns; j++){
			var curTileVal = maze.mazeTiles[i*maze.numTileColumns + j];
			var curNumBlocksWide = 0;
			var wall = new Wall(-1,-1);
			var wallStartX = wall.blockWidth*j;
			var wallStartY = wall.blockHeight*i;
			
			while(curTileVal == 1 && j < maze.numTileColumns){				
				curTileVal = maze.mazeTiles[i*maze.numTileColumns + (j+1)];
				if(curTileVal == 1){
					j++;
				}
				curNumBlocksWide++;
			}
			
			if(curNumBlocksWide > 0){
				wall.viewWidth = curNumBlocksWide * wall.blockWidth;
				wall.collisionWidth = wall.viewWidth;
				wall.x = wallStartX;
				wall.y = wallStartY;
				this.entities.push(wall);
			}
		}
	}
	
	console.log(this.entities);
};

GameState.prototype.destroy = function(game){
	game.inputHandler.clearEvents();
	
	//game.audioHandler.cache["audio/DopestRiff3.mp3"].pause(); // this is why need audioplayer class

	game.renderer.cameraX = 0;
	game.renderer.cameraY = 0;
};

GameState.prototype.update = function(game){
	this.handleEvents(game);
	if(this.playMode){
		this.handlePlayInputs(game);
	} else {
		this.handleDialogueInputs(game);
		this.handleDialogue(game);
	}
	this.updateEntities(game);
	this.checkCollisions();
	this.actCollisions();
	this.cleanup(game);
	this.centerCamera(game);
	this.localTicks++;
	
};

GameState.prototype.centerCamera = function(game){
	game.renderer.cameraX = -game.player.x + GAMEWIDTH/2;
	game.renderer.cameraY = -game.player.y + GAMEHEIGHT/2;
};

GameState.prototype.handleEvents = function(game){
	this.eventHandler.handleEvents(game);
};

GameState.prototype.handlePlayInputs = function(game){	
	var player = game.player;
	
	player.lastX = player.x;
	player.lastY = player.y;
	
	if(game.inputHandler.keyStates[A] == KEYDOWN || game.inputHandler.keyStates[LEFT] == KEYDOWN){
		player.moveLeft();
	} else if(game.inputHandler.keyStates[D] == KEYDOWN || game.inputHandler.keyStates[RIGHT] == KEYDOWN){
		player.moveRight();
	}
	
	if(game.inputHandler.keyStates[W] == KEYDOWN || game.inputHandler.keyStates[UP] == KEYDOWN){
		player.moveUp();
	} else if(game.inputHandler.keyStates[S] == KEYDOWN || game.inputHandler.keyStates[DOWN] == KEYDOWN){
		player.moveDown();
	}

	
	// mouse
	/*var mouseX = game.inputHandler.mouseX;
	var mouseY = game.inputHandler.mouseY;
	var playerCenter = game.playerInfo.playerTurret.calcCenterXY();
	game.playerInfo.playerTurret.getCurGun().theta = Math.atan2(mouseY - playerCenter.y, mouseX - playerCenter.x);
	
	if(game.inputHandler.mouseState == KEYDOWN){
		this.shootGun(game);
	}*/
	
};


GameState.prototype.handleDialogueInputs = function(game){
	
	if(game.inputHandler.keyStates[Z] == KEYUP){
		if(this.curDialogue && this.curDialogue.skippable && !this.curDialogue.isOver() && this.curDialogue.canAdvance()){
			this.curDialogue.advance(game);
		}
		game.inputHandler.keyStates[Z] = KEYSTATIC;
	}
};

GameState.prototype.handleDialogue = function(game){
	if(this.curDialogue && !this.curDialogue.isOver() && this.curDialogue.canAdvance() && this.curDialogue.hasAutoAdvance()){
		if(this.curDialogue.timeToAdvance(game)){
			this.curDialogue.advance(game);
		}
	}
};

GameState.prototype.setDialogue = function(dialogue, game){
	this.curDialogue = dialogue;
	this.curDialogue.init(game);
};



GameState.prototype.shootGun = function(game){
	var playerGun = game.playerInfo.playerTurret.getCurGun();
	

	if(playerGun.canFire(this.localTicks)){
		var bullet = playerGun.createBullet();
		this.entities.push(bullet);
		playerGun.lastFireTick = this.localTicks;
	}
};

GameState.prototype.checkCollisions = function(){
	this.collisions.length = 0;
	for(var i = 0; i < this.entities.length-1; i++){
		for(var j = i+1; j < this.entities.length; j++){
			if(this.entities[i].collides(this.entities[j])){
				this.collisions.push(new Collision(this.entities[i], this.entities[j]));
			}
		}
	}
};

GameState.prototype.actCollisions = function(){
	for(var i = 0; i < this.collisions.length; i++){
		var a = this.collisions[i].colliderA;
		var b = this.collisions[i].colliderB;

		a.updateCollision(b);
		b.updateCollision(a);
	}
};

GameState.prototype.updateEntities = function(game){
	for(var i = 0; i < this.entities.length; i++){
		this.entities[i].update(game);
		if(this.entities[i].containedEntities){
			for(var j = 0; j < this.entities[i].containedEntities.length; j++){
				this.entities[i].containedEntities[j].update(game);
			}
		}
	}
};
GameState.prototype.cleanup = function(game){
	for(var i = this.entities.length-1; i >= 0; i--){
		if(this.entities[i].containedEntities){
			for(var j = this.entities[i].containedEntities.length-1; j >= 0; j--){
				if(this.entities[i].containedEntities[j].shouldDestroy()){
					this.entities[i].containedEntities.splice(j,1);
				}
			}
		}
		
		if(this.entities[i].shouldDestroy()){
			if(this.entities[i].type == SPAWNABLE || (this.entities[i].type == BULLET && this.entities[i].bulletType == PROJECTILEZOMBIE)){
				this.curRound.numZombies--;
				
				if(this.entities[i].deathType == SHOT){
					game.playerInfo.resources += this.entities[i].value;
				}
			}
			this.entities.splice(i,1);

		}

	}
};

GameState.prototype.render = function(game){
	game.renderer.cls();
	var dialogueMode = !this.playMode && this.curDialogue;
	
	this.renderEntities(game);
	
	
	if(dialogueMode){
		this.renderDialogue(game);
	} else {
		//this.renderHealthBars(game);
	}
	
};

GameState.prototype.renderEntities = function(game){

	this.sortByZHeightNaive(this.entities);

	for(var i = 0; i < this.entities.length; i++){
		if(this.entities[i].shouldRender()){
			var x = this.entities[i].x;
			var y = this.entities[i].y;
			var w = this.entities[i].viewWidth;
			var h = this.entities[i].viewHeight;
			var theta = this.entities[i].theta;
			var px = this.entities[i].px;
			var py = this.entities[i].py;
			
			var spriteSheetRef = this.entities[i].spriteSheetRef;
			if(spriteSheetRef){
				var sheet = game.imageHandler.cache[spriteSheetRef];
				game.renderer.drawImage(sheet,x,y,w,h,theta,px,py);
			} else {
				game.renderer.drawRect(x,y,w,h,theta,px,py);
			}
			
			
			/*var cxy = this.entities[i].calcCollisionXY();
			var rad = this.entities[i].collisionRadius;
			if(cxy){
				game.renderer.drawPoint(cxy.x,cxy.y,4);
				game.renderer.context.beginPath();
      			game.renderer.context.arc(cxy.x, cxy.y, rad, 0, 2 * Math.PI, false);

      			game.renderer.context.stroke();
			}*/
			
			//game.renderer.drawPoint(this.entities[i].x, this.entities[i].y,5);
		}
		
	}
};

GameState.prototype.sortByZHeightNaive = function(entities){
	for(var i = 1; i < entities.length; i++){
		var curEnt = entities[i];
		var j = i - 1;
		
		while(j >= 0 && entities[j].zHeight > curEnt.zHeight){
			entities[j+1] = entities[j];
			j--;
		}
		entities[j+1] = curEnt;
	}	
};

GameState.prototype.sortByZHeight = function(entities,l,r){
	// quicksort, did this for educational purposes could easily (probably more efficiently 
	// use the javascript sort function with my own comparator

	var length = r - l + 1;
	var starting = isNaN(length);
	var startingIndex = l;
	var left = startingIndex;
	var right = r;
	
	if(starting){
		length = entities.length;
		startingIndex = 0;
		left = startingIndex;
		right = length - 1;
	}
	
	if(length < 2){
		return
	}
	
	var pivot = entities[left + Math.floor(length/2)].zHeight;
	
	while(left <= right){
		while(entities[left].zHeight < pivot){
			left++;
		}
		while(entities[right].zHeight > pivot){
			right--;
		}
		if(left <= right){
			var temp = entities[left];
			entities[left] = entities[right];
			entities[right] = temp;
			
			left++;
			right--;
		}
	}
	
	this.sortByZHeight(entities, startingIndex, right);
	this.sortByZHeight(entities, left, startingIndex + length - 1);
};


GameState.prototype.renderDialogue = function(game){
	if(!this.curDialogue.isOver()){ // kind of sloppy because playMode being true 
									// should be equivalent to this check
									// although I suppose this could be useful
									// if I want the dialogue box to close and then
									// some action to happen on the screen
									
		var cameraX = game.renderer.cameraX;
		var cameraY = game.renderer.cameraY;
		var dialogueHeight = 150;
	
		var img = game.imageHandler.cache['img/dialoguebox.png'];
		var x = 0 - cameraX;
		var y = GAMEHEIGHT - dialogueHeight - 20 - cameraY;
		var width = GAMEWIDTH;
		var height = dialogueHeight;
		game.renderer.drawImage(img,x,y,width,height);
	
		var dialogueStatement = this.curDialogue.getCurStatement();
		game.renderer.drawText(x+50,y+20,dialogueStatement.speakerName,14);
	
		game.renderer.drawText(x+20,y+80,dialogueStatement.text,14);
	
	}
};
