function GameWinState(){

}

GameWinState.prototype =  Object.create(State.prototype);

GameWinState.prototype.init = function(game){

};

GameWinState.prototype.destroy = function(game){
	game.inputHandler.clearEvents();
};

GameWinState.prototype.update = function(game){

};

GameWinState.prototype.render = function(game){
	game.renderer.cls();

};