function InitState(){
	this.type = INITSTATE;
	this.localTicks = 0;
	
}
InitState.prototype = Object.create(State.prototype);

InitState.prototype.init = function(game){
	// can initialize the game here
	
		game.roundManager = new RoundManager(0);
		game.player = new Player(0,0,0);
		game.player.setCenter(96, 96);
		console.log("CENTEREERD: " + game.player.x + " : " + game.player.y);
		game.imageHandler.queueDownload("img/wall.png");
		
		//game.audioHandler.queueDownload("audio/alive.m4a");
		this.downloadAndLaunch(game);
		
		
};

InitState.prototype.downloadAndLaunch = function(game){
	game.imageHandler.downloadAll(this.__imageDownloadCallback,game);
}

InitState.prototype.__imageDownloadCallback = function(game){
	game.audioHandler.downloadAll(
		game.__setState.bind(game), 
		//MENUSTATE
		GAMESTATE
	);
}

InitState.prototype.destroy = function(game){
	game.inputHandler.clearEvents();
};

InitState.prototype.update = function(game){
	this.localTicks++;
};

InitState.prototype.render = function(game){
	// just a logic state, no rendering
	// could add rendering if this takes some visible amount of time
};