function ToyGame(){
	this.htmlActuator = new HTMLActuator();
	this.renderer = new Renderer(this.htmlActuator.canvas, GAMEWIDTH, GAMEHEIGHT);
	this.inputHandler = new ToyInputHandler(this.htmlActuator.canvas);
	this.imageHandler = new ImageHandler();
	this.audioHandler = new AudioHandler();
	this.audioPlayer = new AudioPlayer(this.audioHandler);

	this.stateFactory = new ToyStateFactory();
	this.stateMachine = new StateMachine();
	
	this.ticks = 0;
	
	this.nextStateId;
	
	this.roundManager;
	this.player;
	
	
}

ToyGame.prototype = Object.create(Game.prototype);


ToyGame.prototype.serialize = function(){
	return {
		stateMachine : this.stateMachine,
		ticks : this.ticks,
		nextStateId : this.nextStateId,
		roundManager : this.roundManager,
		playerInfo : this.playerInfo
	}
};