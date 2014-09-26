function RoundManager(curRoundIndex){
	this.curRoundIndex = curRoundIndex;
	
	this.rounds = this.createRounds();
	
}

RoundManager.prototype.getCurRound = function(){
	return this.rounds[this.curRoundIndex];
};

RoundManager.prototype.createRounds = function(){
	var rounds = [];
	
	/*var spawnDistribution_1 = [
		{type : ZOMBIE, rate : .015},
		{type : ZOMBIEDOG, rate : .005}
		
	];*/
	
	//rounds.push(new Round(undefined,spawnDistribution_1,100));
	
	rounds.push(new Round(11));
	
	return rounds;
};

function Round(mazeSideLength){
	/**

	*/
	//this.roundEventHandler = roundEventHandler;
	//this.spawnDistribution;
	
	this.maze = new Maze(mazeSideLength,mazeSideLength);
}

