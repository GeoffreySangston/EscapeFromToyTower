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
		
		game.lost = false;
	
		game.showedFirstDialogue = false;

		game.imageHandler.queueDownload("img/wall.png");
		game.imageHandler.queueDownload("img/friendlybar.png");
		game.imageHandler.queueDownload("img/friendlybarback.png");
		game.imageHandler.queueDownload("img/key.png");
		game.imageHandler.queueDownload("img/floor.png");
		game.imageHandler.queueDownload("img/dialoguebox.png");
		game.imageHandler.queueDownload("img/stairs.png");
		game.imageHandler.queueDownload("img/mrbear.png");
		game.imageHandler.queueDownload("img/you.png");
		game.imageHandler.queueDownload("img/ammo.png");
		
		game.audioHandler.queueDownload("audio/CreepyGameRough1.mp3");
		this.downloadAndLaunch(game);
		
		
};

InitState.prototype.downloadAndLaunch = function(game){
	game.imageHandler.downloadAll(this.__imageDownloadCallback,game);
}

InitState.prototype.__imageDownloadCallback = function(game){
	game.audioHandler.downloadAll(
		game.__setState.bind(game), 
		MENUSTATE
		//GAMESTATE
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