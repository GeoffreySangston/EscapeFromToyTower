function RoundManager(curRoundIndex, game){
	this.curRoundIndex = curRoundIndex;
	this.spawnFactory = new SpawnFactory();
		
	this.rounds = this.createRounds();

	
}

RoundManager.prototype.getCurRound = function(){
	return this.rounds[this.curRoundIndex];
};

RoundManager.prototype.createRounds = function(){
	var rounds = [];

	var round1EntityIds = [];
	for(var i = 0; i < 1; i++){
		round1EntityIds.push(LITTLESUSIE);
	}
	rounds.push(new Round(2,3,round1EntityIds, this.spawnFactory));
	
	var round2EntityIds = [];
	for(var i = 0; i < 2; i++){
		round2EntityIds.push(LITTLESUSIE);
	}
	rounds.push(new Round(3,4,round2EntityIds, this.spawnFactory));
	
	var round3EntityIds = [LITTLESUSIE];
	rounds.push(new Round(4,5,round3EntityIds, this.spawnFactory));
	
	var round4EntityIds = [LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE];
	rounds.push(new Round(4,5,round4EntityIds, this.spawnFactory));
	var round5EntityIds = [LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE];
	rounds.push(new Round(5,5,round5EntityIds, this.spawnFactory));
	var round6EntityIds = [LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE];
	rounds.push(new Round(5,6,round6EntityIds, this.spawnFactory));
	var round7EntityIds = [LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE];
	rounds.push(new Round(6,7,round7EntityIds, this.spawnFactory));
	var round8EntityIds = [LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE];
	rounds.push(new Round(7,8,round8EntityIds, this.spawnFactory));
	var round9EntityIds = [LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE];
	rounds.push(new Round(8,9,round9EntityIds, this.spawnFactory));
	var round10EntityIds = [LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE, LITTLESUSIE];
	rounds.push(new Round(10,10,round10EntityIds, this.spawnFactory));

	
	return rounds;
};

function Round(mazeWidth, mazeHeight, roundEntityIds, spawnFactory){
	/**

	*/
	//this.roundEventHandler = roundEventHandler;
	//this.spawnDistribution;
	
	this.spawnFactory = spawnFactory;
	this.maze = new Maze(mazeWidth,mazeHeight);
	
	this.mazeWalls;
	this.mazeSpaces;
	
	this.roundEntityIds = [];
	var mazeArea = mazeWidth*mazeHeight;
	var numToys = Math.pow(Math.floor(mazeArea/6),1.05);
	
	for(var i = 0; i < numToys; i++){
		console.log("HAHA");
		this.roundEntityIds.push(LITTLESUSIE);
	}
	this.roundEntities;
	
	this.numToysLeft = this.roundEntityIds.length;
	this.numFriendlyToysLeft = this.numToysLeft;
	this.lastFriendlyCX;
	this.lastFriendlyCY;
	
	this.stairs;
	this.key;
}



Round.prototype.initMazeWallsAndSpaces = function(){
	var maze = this.maze;
	var mazeWalls = [];
	var mazeSpaces = [];
	
	for(var i = 0; i < maze.numTileRows; i++){
		for(var j = 0; j < maze.numTileColumns; j++){
			var curTileVal = maze.mazeTiles[i*maze.numTileColumns + j];
			var curNumBlocksWide = 0;
			var wall = new Wall(-1,-1);
			var wallStartX = wall.blockWidth*j;
			var wallStartY = wall.blockHeight*i;

			if(curTileVal == 0){
				var space = new Space(0,0,0);
				space.x = space.viewWidth*j;
				space.y = space.viewHeight*i;
				
				mazeSpaces.push(space);
			}

			while(curTileVal == 1 && j < maze.numTileColumns){				
				curTileVal = maze.mazeTiles[i*maze.numTileColumns + (j+1)];
				if(curTileVal == 1){
					j++;
				}
				curNumBlocksWide++;
			}
			

			
			if(curNumBlocksWide > 0){
				wall.viewWidth = curNumBlocksWide * wall.blockWidth;
				wall.collisionWidth = wall.viewWidth;
				wall.x = wallStartX;
				wall.y = wallStartY;
				mazeWalls.push(wall);
			}
		}
	}
	
	this.mazeWalls = mazeWalls;
	this.mazeSpaces = mazeSpaces;
};

Round.prototype.initRoundEntities = function(game){
	this.roundEntities = this.calcRoundEntities(game);
};

Round.prototype.calcRoundEntities = function(game){
	var roundEntities;
	
	do{
		roundEntities = [];
		

		this.moveEntityToRandSpace(game.player);
		roundEntities.push(game.player);
		
		var stairs = new Stairs(0,0);
		this.moveEntityToRandSpace(stairs);
		roundEntities.push(stairs);
		this.stairs = stairs;
		
		for(var i = 0; i < this.roundEntityIds.length; i++){

			var entity = this.spawnFactory.getSpawn(this.roundEntityIds[i],0,0);
			this.moveEntityToRandSpace(entity);
			
			roundEntities.push(entity);
		}
	} while(!this.goodEntityPlacements(roundEntities));
		
	return roundEntities;
};

Round.prototype.moveEntityToRandSpace = function(entity){
	var randSpaceIndex = Math.floor((Math.random() * this.mazeSpaces.length));
	var randSpace = this.mazeSpaces[randSpaceIndex];
	var x = randSpace.x + randSpace.viewWidth/2;
	var y =	randSpace.y + randSpace.viewHeight/2;
	entity.setCenter(x,y);
};

Round.prototype.goodEntityPlacements = function(roundEntities){
	for(var i = 0; i < roundEntities.length-1; i++){
		for(var j = i+1; j< roundEntities.length; j++){
			var entityOne = roundEntities[i];
			var entityTwo = roundEntities[j];
			
			var manX = Math.abs((entityOne.x - entityTwo.x))/this.mazeSpaces[0].viewWidth;
			var manY = Math.abs((entityOne.y - entityTwo.y))/this.mazeSpaces[0].viewHeight;
			var manDist = manX + manY;
			if(manDist < 3){
				return false;
				
			}
			
		}
	}
	return true;
};

Round.prototype.initRound = function(game){
	this.initMazeWallsAndSpaces();
	this.initRoundEntities(game);
};