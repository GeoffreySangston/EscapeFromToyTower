function GameLoseState(){

}

GameLoseState.prototype =  Object.create(State.prototype);

GameLoseState.prototype.init = function(game){

};

GameLoseState.prototype.destroy = function(game){
	game.inputHandler.clearEvents();
};

GameLoseState.prototype.update = function(game){

};

GameLoseState.prototype.render = function(game){
	game.renderer.cls();

};