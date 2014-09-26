function RoundManager(curRoundIndex){
	this.curRoundIndex = curRoundIndex;
	
	this.rounds = this.createRounds();
	
}

RoundManager.prototype.getCurRound = function(){
	return this.rounds[this.curRoundIndex];
};

RoundManager.prototype.createRounds = function(){
	var rounds = [];

	rounds.push(new Round(5));
	
	return rounds;
};

function Round(mazeSideLength){
	/**

	*/
	//this.roundEventHandler = roundEventHandler;
	//this.spawnDistribution;
	
	this.maze = new Maze(mazeSideLength,mazeSideLength);
}

