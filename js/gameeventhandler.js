function GameEventHandler(){
	this.eventCallbacks = this.createEventCallbacks();
	
	this.futureActions = [];
}

GameEventHandler.prototype = Object.create(EventHandler.prototype);

GameEventHandler.prototype.createEventCallbacks = function(){
	var callbacks = [];
	
	callbacks.push(this.playerDeath.bind(this));
	callbacks.push(this.roundOver.bind(this));
	callbacks.push(this.keyCollected.bind(this));
	callbacks.push(this.noFriendliesLeft.bind(this));
	callbacks.push(this.playerDead.bind(this));
	callbacks.push(this.firstToyFound.bind(this));
	return callbacks;
};

GameEventHandler.prototype.playerDeath = function(game){
	
};

GameEventHandler.prototype.roundOver = function(game){
	var stairs = game.stateMachine.curState.curRound.stairs;
	
	if(stairs.playerSteppedInto){
		game.roundManager.curRoundIndex++;
		if(game.roundManager.rounds.length > game.roundManager.curRoundIndex){
			game.setNextState(GAMESTATE);
		} else {
			game.setNextState(GAMEOVERSTATE);
		}
	}
};

GameEventHandler.prototype.keyCollected = function(game){
	var curRound = game.stateMachine.curState.curRound;
	if(curRound.key && curRound.key.collected){
		curRound.stairs.collidable = true;
	}
};

GameEventHandler.prototype.noFriendliesLeft = function(game){
	var curRound = game.stateMachine.curState.curRound;
	var entities = game.stateMachine.curState.entities;

	if(!curRound.key){
	if(curRound.numFriendlyToysLeft <= 0){
		var key = new Key(0, 0);
		console.log(curRound.lastFriendlyCX, curRound.lastFriendlyCY);
		key.setCenter(curRound.lastFriendlyCX, curRound.lastFriendlyCY);
		entities.push(key);
		curRound.key = key;
	}
	}
};

GameEventHandler.prototype.playerDead = function(game){
	if(!game.player.alive){
		// game over
		game.lost = true;
		game.setNextState(GAMEOVERSTATE);
	}
};

GameEventHandler.prototype.firstToyFound = function(game){
	if(game.player.toysCollected == 1 && !game.showedFirstDialogue){
		var gameState = game.stateMachine.curState;
		
		var statements = [];
		
		var statement = "Daddy left me this SAWED OFF SHOTGUN :') Now I can really play with my toys <Hit Space>";
		statements.push(new DialogueStatement(0,"You", statement,false,false,200));
		
		var statement = "You never play with your toys and now they're rebelling. Play with them or die!";
		statements.push(new DialogueStatement(0,"", statement, false,false,200));
		
		var statement = "Find the key on each level to reveal the staircase. Play with your toys by running through them or shooting them.";
		statements.push(new DialogueStatement(0,"", statement, false,false,200));
		
		var statement = "Escape the tower!";
		statements.push(new DialogueStatement(0,"", statement, false,false,200));
		
		gameState.curDialogue = new Dialogue(statements,true);
		gameState.curDialogue.init(game);
		
		game.showedFirstDialogue = true;
		
		game.player.gun.ammo += 10;
		
	}
};