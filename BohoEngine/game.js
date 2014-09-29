function Game(){
	this.stateFactory;
	this.stateMachine;
	this.ticks;
	
	this.nextStateId;
}

/**
	will always return true, the return is for c code compliance if I ever want to translate it
	in that case it would return false if a memory error occurred
*/
Game.prototype.__setState = function(stateId){
	console.log("SETTING STATE: " + stateId);
	var newState = this.stateFactory.getState(stateId);
	return this.stateMachine.setState(newState,this);
};
/**
States can't call setState directly. They call setNextState to prevent data from being destroyed until the start of the next frame
*/
Game.prototype.setNextState = function(stateId){
	
	// until figure out what I want to do with this:
	//this.__setState(stateId);
	console.log("next state: " + stateId);
	this.nextStateId = stateId;
};

Game.prototype.update = function(){
	if(!isNaN(this.nextStateId)){
		this.__setState(this.nextStateId);
		this.nextStateId = undefined;
	}
	this.stateMachine.curState.update(this);
	this.ticks++;
};

Game.prototype.render = function(){

	this.stateMachine.curState.render(this);
	
};
