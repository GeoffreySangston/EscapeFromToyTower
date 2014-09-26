function GameEventHandler(){
	this.eventCallbacks = this.createEventCallbacks();
	
	this.futureActions = [];
}

GameEventHandler.prototype = Object.create(EventHandler.prototype);

GameEventHandler.prototype.createEventCallbacks = function(){
	var callbacks = [];
	
	callbacks.push(this.playerDeath.bind(this));
	callbacks.push(this.roundOver.bind(this));
	
	return callbacks;
};

GameEventHandler.prototype.playerDeath = function(game){
	
};

GameEventHandler.prototype.roundOver = function(game){

};