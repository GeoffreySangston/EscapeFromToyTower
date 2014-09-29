function StateMachine(){
	this.curState;
}

StateMachine.prototype.setState = function(state, game){
	if(!this.removeCurState(game)){
		return false;
	}
	
	this.curState = state;
	
	if(!state){
		return true; // null states exit
	}
	
	this.curState.init(game);
	
	return true;
};

// the real removeCurState function could return false apparently
StateMachine.prototype.removeCurState = function(game){
	if(!this.curState){
		return true;
	}
	
	this.curState.destroy(game);
	this.curState = null;
	
	return true;
};