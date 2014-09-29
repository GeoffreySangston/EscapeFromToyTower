/**
Could also be called round state
*/

function GameState(){
	this.eventHandler = new GameEventHandler();
	this.localTicks;
	this.curRound;
	
	this.entities;	
	this.spaces;
	this.collisions;
	
	this.shoutOutText;
	
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
	this.spaces = [];
	this.collisions = [];
	
	this.shoutOutText = [];
	
	this.initRound(game);

	
	//game.audioHandler.cache["audio/DopestRiff3.mp3"].play();
};

GameState.prototype.initRound = function(game){
	this.curRound = game.roundManager.getCurRound();
	this.curRound.initRound(game);
	this.addMazeWalls();
	this.addMazeEntities();
	
	if(game.roundManager.curRoundIndex == 0){ // extremely cut for time, I don't want them skipping the event
		this.curRound.roundEntities[2].ticksFriendlyFor = 4294967295;
	}
	
}

GameState.prototype.addMazeWalls = function(){
	var mazeWalls = this.curRound.mazeWalls;
	
	for(var i = 0; i < mazeWalls.length; i++){
		this.entities.push(mazeWalls[i]);
	}
};

GameState.prototype.addMazeEntities = function(){
	var roundEntities = this.curRound.roundEntities;
	for(var i = 0; i < roundEntities.length; i++){
		this.entities.push(roundEntities[i]);
	}
};

GameState.prototype.destroy = function(game){
	game.inputHandler.clearEvents();
	
	//game.audioHandler.cache["audio/DopestRiff3.mp3"].pause(); // this is why need audioplayer class

	game.renderer.cameraX = 0;
	game.renderer.cameraY = 0;
	
	game.player.gun.lastFireTick = 0;
};

GameState.prototype.update = function(game){
	this.handleEvents(game);
	if(!this.curDialogue){
		this.handlePlayInputs(game);
	} else {
		this.handleDialogueInputs(game);
		this.handleDialogue(game);
	}
	this.checkCollisions();
	this.actCollisions();
	this.updateEntities(game);
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
		player.gun.theta = Math.PI;
	} else if(game.inputHandler.keyStates[D] == KEYDOWN || game.inputHandler.keyStates[RIGHT] == KEYDOWN){
		player.moveRight();
		player.gun.theta = 0;
	}
	
	if(game.inputHandler.keyStates[W] == KEYDOWN || game.inputHandler.keyStates[UP] == KEYDOWN){
		player.moveUp();
		player.gun.theta = 3*Math.PI/2;
	} else if(game.inputHandler.keyStates[S] == KEYDOWN || game.inputHandler.keyStates[DOWN] == KEYDOWN){
		player.moveDown();
		player.gun.theta = Math.PI/2;
	}
	
	if(game.inputHandler.keyStates[SPACE] == KEYUP){
		this.shootGun(game);
		game.inputHandler.keyStates[SPACE] = KEYSTATIC;
	}
	
	if(game.inputHandler.keyStates[M] == KEYUP){
		if(game.audioPlayer.volume > 0){
			game.audioPlayer.setVolume(0);
		} else {
			game.audioPlayer.setVolume(1);
		}

		game.inputHandler.keyStates[M] = KEYSTATIC;
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
	
	if(game.inputHandler.keyStates[SPACE] == KEYUP){
		if(this.curDialogue && this.curDialogue.skippable && !this.curDialogue.isOver()){
			this.curDialogue.advance(game);
		}
		game.inputHandler.keyStates[SPACE] = KEYSTATIC;
	}
};

GameState.prototype.handleDialogue = function(game){
	if(this.curDialogue && !this.curDialogue.isOver() && this.curDialogue.canAdvance() && this.curDialogue.hasAutoAdvance()){
		if(this.curDialogue.timeToAdvance(game)){
			this.curDialogue.advance(game);
		}
	} else if(this.curDialogue.isOver()){
		this.curDialogue = undefined;
	}
};

GameState.prototype.setDialogue = function(dialogue, game){
	this.curDialogue = dialogue;
	this.curDialogue.init(game);
};



GameState.prototype.shootGun = function(game){
	var playerGun = game.player.gun;
	

	if(playerGun.canFire(this.localTicks)){
		var bullet = playerGun.createBullet(game);
		console.log(bullet);
		this.entities.push(bullet);
		playerGun.ammo--;
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
		if(this.entities[i].shouldDestroy()){
			this.entities[i].destroyEvent(game);
			if(this.entities[i].type == SPAWNABLE){
				this.curRound.numToysLeft--;
				this.curRound.numFriendlyToysLeft--;
				var center = this.entities[i].calcCenterXY();
				this.curRound.lastFriendlyCX = center.x;
				this.curRound.lastFriendlyCY = center.y;
			}

			var roundEntitiesIndex = this.curRound.roundEntities.indexOf(this.entities[i]);
			if(roundEntitiesIndex > -1){
				this.curRound.roundEntities.splice(roundEntitiesIndex,1);
			}
			this.entities.splice(i,1);

		}

	}
};

GameState.prototype.render = function(game){
	game.renderer.cls();
	var dialogueMode = !this.playMode && this.curDialogue;
	
	this.renderFloor(game);
	
	this.renderEntities(game);
	this.renderFriendlyBars(game);
	this.renderHUD(game);
	
	this.renderDialogue(game);

	
};

GameState.prototype.renderFloor = function(game){
	var background = game.imageHandler.cache["img/wall.png"];
	game.renderer.drawImage(background, 0 - game.renderer.cameraX, 0 - game.renderer.cameraY, GAMEWIDTH, GAMEHEIGHT);

	var spaces = this.curRound.mazeSpaces;
	var floor = game.imageHandler.cache["img/floor.png"];
	
	for(var i = 0; i < spaces.length; i++){
		game.renderer.drawImage(floor, spaces[i].x, spaces[i].y, spaces[i].viewWidth, spaces[i].viewHeight);
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

GameState.prototype.renderDialogue = function(game){
	if(this.curDialogue && !this.curDialogue.isOver()){ 
									
									
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

		game.renderer.drawText(x+50,y+20,dialogueStatement.speakerName,14,"#000000");
	
		if(dialogueStatement.text.length < 62){
			game.renderer.drawText(x+20,y+80,dialogueStatement.text,14,"#000000");
		} else {
			var textOne = dialogueStatement.text.substring(0,62);
			var textTwo = dialogueStatement.text.substring(62, dialogueStatement.text.length);
			game.renderer.drawText(x+20,y+80,textOne,14,"#000000");
			game.renderer.drawText(x+20,y+100,textTwo,14,"#000000");
		}
		
	
	}
};

GameState.prototype.renderFriendlyBars = function(game){
	var roundEntities = this.curRound.roundEntities;
	
	for(var i = 0; i < roundEntities.length; i++){
		var entity = roundEntities[i];
		if(entity.type == SPAWNABLE){
			if(entity.hasEncounteredPlayer && entity.stillFriendly(this.localTicks)){
				var maxBarWidth = roundEntities[i].friendlyBarMaxWidth;
				
				var barWidth = roundEntities[i].calcCurFriendlyBarWidth(this.localTicks);
			
				var entityX = roundEntities[i].x;
				var entityY = roundEntities[i].y;
				
				var entityWidth = roundEntities[i].viewWidth;
				var barX = entityX + (entityWidth - maxBarWidth)/2;
				//var barX = entityX;
				var barY = entityY - 10;
				
				game.renderer.drawImage(game.imageHandler.cache["img/friendlybarback.png"],barX,barY,maxBarWidth,4);
				game.renderer.drawImage(game.imageHandler.cache["img/friendlybar.png"],barX,barY,barWidth,4);
			}
		}
	}
};

GameState.prototype.renderHUD = function(game){
	
	game.renderer.drawFixedText(GAMEWIDTH/2 - 20 - 15,36,"FLOOR " + (game.roundManager.rounds.length - game.roundManager.curRoundIndex), 16,"#666666");
	game.renderer.drawFixedText(50 - 15,42,"TOYS LEFT: " + this.curRound.numToysLeft,14,"#FF0000");
	game.renderer.drawFixedText(50 - 15,58,"AMMO: " + game.player.gun.ammo,14,"#FF0000");

	var key = game.stateMachine.curState.curRound.key;
	if(!key || !key.collected){
		game.renderer.drawFixedText(GAMEWIDTH - 50 - 15, 50, "KEY", 16, "#666666");
	} else {
		game.renderer.drawFixedText(GAMEWIDTH - 50 - 15, 50, "KEY", 16, "#FFFC54");
	}
};

GameState.prototype.renderShoutOutText = function(){
	
};