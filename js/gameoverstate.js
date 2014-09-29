function GameOverState(){
	this.localTicks = 0;
	this.type;
}

GameOverState.prototype.init = function(game){

};

GameOverState.prototype.destroy = function(game){

};

GameOverState.prototype.update = function(game){

	if(game.inputHandler.keyStates[SPACE] == KEYUP){
		game.roundManager = new RoundManager(0);
		game.player = new Player(0,0,0);
		game.player.setCenter(96, 96);
	
		game.lost = false;
	
		game.showedFirstDialogue = false;
	
		game.setNextState(GAMESTATE);
		game.inputHandler.keyStates[SPACE] = KEYSTATIC;
	}
	this.localTicks++;
};

GameOverState.prototype.render = function(game){
	game.renderer.cls(100 - game.renderer.cameraX, 100 - game.renderer.cameraY,  GAMEWIDTH - 200, GAMEHEIGHT - 200);
	var background = game.imageHandler.cache["img/dialoguebox.png"];
	game.renderer.drawImage(background, 100 - game.renderer.cameraX, 100 - game.renderer.cameraY, GAMEWIDTH - 200, GAMEHEIGHT - 200);

	if(game.lost){
	 	game.renderer.drawFixedText(GAMEWIDTH/2 - 135, GAMEHEIGHT/2 - 100, "OH THE HUMANITY!!!",24,"#000000");
	} else {
		game.renderer.drawFixedText(GAMEWIDTH/2 - 80, GAMEHEIGHT/2 - 100, "YOU ESCAPED",24,"#000000");
		game.renderer.drawFixedText(GAMEWIDTH/2 - 80, GAMEHEIGHT/2 - 100, "ALL THOSE TOYS :(",24,"#000000");
	}
	game.renderer.drawFixedText(GAMEWIDTH/2 - 105, GAMEHEIGHT/2 - 100 + 100, "Space To Restart",24,"#000000");
	
};