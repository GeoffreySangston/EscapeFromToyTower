function MenuEventHandler(){

	this.eventCallbacks = this.createEventCallbacks();
	
	this.futureActions = [];
}

MenuEventHandler.prototype = Object.create(EventHandler.prototype);

MenuEventHandler.prototype.createEventCallbacks = function(){
	var callbacks = [];
	
	/*callbacks.push(this.appleEaten.bind(this));
	callbacks.push(this.timeToSpawnMoreChawsers.bind(this));
	callbacks.push(this.timeToReproduceChawsers.bind(this));*/
	
	callbacks.push(this.playGameSelected.bind(this));
	callbacks.push(this.musicRoomSelected.bind(this));
	callbacks.push(this.optionsSelected.bind(this));
	
	return callbacks;
};

MenuEventHandler.prototype.playGameSelected = function(game){
	// if play game selected then
	console.log("SWITCHING");
	game.setNextState(GAMESTATE);
};

MenuEventHandler.prototype.musicRoomSelected = function(game){

};

MenuEventHandler.prototype.optionsSelected = function(game){

};

