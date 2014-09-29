function EventHandler(data){
	this.data = data;
	
	this.eventCallbacks = this.createEventCallbacks();
	
	this.futureActions = [];
}

EventHandler.prototype.createEventCallbacks = function(){
	return [];
};

EventHandler.prototype.handleEvents = function(game){ // gameTicks needs to be included with "allData" but we'll get to that with state management
	/**
	Has a bunch of checks and a bunch of actions as helper functions
	*/
	
	/* FIRST CHECK SCENE */
	
	for(var i = 0; i < this.eventCallbacks.length; i++){
		var evaluateEvent = this.eventCallbacks[i];
		evaluateEvent(game);

	}
	
	/* THEN CHECK FUTURE ACTIONS LIST */
	for(var i = 0; i < this.futureActions.length; i++){
		var actionMatureTick = this.futureActions[i].ticks;
		var action = this.futureActions[i].actionCallback;
		if(game.stateMachine.curState.localTicks == actionMatureTick){
			action();
			this.futureActions.splice(i,1);
		} else if(game.stateMachine.curState.localTicks > actionMatureTick){
			console.log(action);
			throw("Error: action skipped: " + game.stateMachine.curState.localTicks + " : " + actionMatureTick);
		}
	}
};

function FutureActionStruct(ticks, actionCallback){
	this.ticks = ticks;
	this.actionCallback = actionCallback;	
}