function ToyStateFactory(){

}

ToyStateFactory.prototype = Object.create(StateFactory.prototype);

ToyStateFactory.prototype.getState = function(stateId){
	console.log("GETTING STATE: " + stateId);
	switch(stateId){
		case INITSTATE: return new InitState();
		case MENUSTATE: return new MenuState();
		case GAMESTATE: return new GameState();
		default:
	
	}
};