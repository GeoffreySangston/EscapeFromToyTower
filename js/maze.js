function Maze(r,c){
	this.UP = 3;
	this.RIGHT = 2;
	this.DOWN = 7;
	this.LEFT = 5;

	this.numSpecifierRows = r;
	this.numSpecifierColumns = c;
	this.numBlockRows = (2*this.numSpecifierRows - 1);
	this.numBlockColumns = (2*this.numSpecifierColumns - 1);
		
	this.numTileRowsPerBlock = 1;
	this.numTileColumnsPerBlock = 1;
	
	
	
	this.numInnerTileRows = this.numBlockRows * this.numTileRowsPerBlock;
	this.numInnerTileColumns = this.numBlockColumns * this.numTileColumnsPerBlock;
	
	this.numTileRows = this.numInnerTileRows + 2;
	this.numTileColumns = this.numInnerTileColumns + 2;
	
	this.wallTilesWide = 1;
	this.wallTilesHigh = 1;
	
	/*
	mazeTileSpecifiers is a series of products of combinations of
	the 4 prime numbers 2,3,5,7. These numbers correspond to
	the directions as described in the following compass:
	  3
	5   2
	  7
	  
	So an index of the array containing 10 would mean at that tile
	there is an opening to the left and to the right.
	*/
	var mazeTileSpecifiers = this.__createMazeTileSpecifiers(r,c);

	/*
	mazeTiles uses the mazeTileSpecifiers to make an array of 1's 
	and 0's which specify the walls and empty spaces in a maze.
	
	
	*/
	
	var innerMazeTiles = this.__createInnerMazeTiles(mazeTileSpecifiers);
	this.mazeTiles = this.__createMazeTiles(innerMazeTiles);
	
}

/**
Creates specifiers for a maze which has r rows and c columns
*/
Maze.prototype.__createMazeTileSpecifiers = function(r,c){
	var mazeTileSpecifiers = this.__initMazeTileSpecifiers(r,c);
	
	var curNode = mazeTileSpecifiers[0];
	curNode.prevNode = new MazeNode(-1,-1,-1);
	
	var inc = 0;
	do {
		var candidateNeighbors = curNode.calcNonvisitedNeighbors(this, mazeTileSpecifiers);
		var nextNode;
		
		if(candidateNeighbors.length > 0){
			var candNeighborChoiceIndex = Math.floor(candidateNeighbors.length*Math.random());
			nextNode = candidateNeighbors[candNeighborChoiceIndex];
			nextNode.prevNode = curNode;
			
			if(nextNode.column < curNode.column && nextNode.row == curNode.row){
				curNode.value *= this.LEFT;
				nextNode.value *= this.RIGHT;
			} else if(nextNode.column > curNode.column && nextNode.row == curNode.row){
				curNode.value *= this.RIGHT;
				nextNode.value *= this.LEFT;
			} else if(nextNode.column == curNode.column && nextNode.row < curNode.row){
				curNode.value *= this.DOWN;
				nextNode.value *= this.UP;
			} else if(nextNode.column == curNode.column && nextNode.row > curNode.row){
				curNode.value *= this.UP;
				nextNode.value *= this.DOWN;
			}
		} else {
			nextNode = curNode.prevNode; // no more decisions to be made, go back up the tree and look for different paths
		}
		
		curNode = nextNode;
		
	
	} while(!(curNode.row == 0 && curNode.column == 0)); // traverses through and then at the end cycles back to start

	return mazeTileSpecifiers;
};

Maze.prototype.__initMazeTileSpecifiers = function(r,c){
	var mazeTileSpecifiers = [];
	
	for(var i = 0; i < r; i++){
		for(var j = 0; j < c; j++){
			mazeTileSpecifiers.push(new MazeNode(1,i,j));
		}
	}
	
	return mazeTileSpecifiers;
};

Maze.prototype.__createInnerMazeTiles = function(mazeTileSpecifiers){
	var mazeTiles = this.__initInnerMazeTiles(mazeTileSpecifiers);
	
	this.__fillBlock(0, 0, 0, mazeTiles);
	
	for(var i = 0; i < this.numSpecifierRows; i++){
		for(var j = 0; j < this.numSpecifierColumns; j++){
			var blockRow = 2 * i;
			var blockColumn = 2 * j;
			
			this.__fillBlock(0, blockRow, blockColumn, mazeTiles);
			
			var specifierIndex = i * this.numSpecifierColumns + j;
			if(mazeTileSpecifiers[specifierIndex].value % this.RIGHT == 0){
				this.__fillBlock(0, blockRow, blockColumn + 1, mazeTiles);
			}
			if(mazeTileSpecifiers[specifierIndex].value % this.UP == 0){
				this.__fillBlock(0, blockRow + 1, blockColumn, mazeTiles);
			}
		}
	}

	return mazeTiles;
};

Maze.prototype.__initInnerMazeTiles = function(){
	var mazeTiles = [];
	
	for(var i = 0; i < this.numInnerTileRows * this.numInnerTileColumns; i++){
		mazeTiles.push(1);
	}
	
	return mazeTiles;
};

Maze.prototype.__createMazeTiles = function(innerMazeTiles){
	var mazeTiles = this.__initMazeTiles();

	for(var i = 0; i < this.numInnerTileRows; i++){
		for(var j = 0; j < this.numInnerTileColumns; j++){
			var newIndex = (i+1) * this.numTileColumns + (j+1);
			var oldIndex = (i) * this.numInnerTileColumns + (j);
			mazeTiles[newIndex] = innerMazeTiles[oldIndex];
		} 
	}

	
	return mazeTiles;
};

Maze.prototype.__initMazeTiles = function(){
	var mazeTiles = [];
	
	for(var i = 0; i < this.numTileRows * this.numTileColumns; i++){
		mazeTiles.push(1);
	}
	
	return mazeTiles;
};

/*
fills the tiles at the block at "row" and "col" with "val"

val is 0 or 1, 1 representing walls

since the tiles are initialized to 1, only have to call with val
0, but perhaps in the future this could be useful to be more generalized
*/
Maze.prototype.__fillBlock = function(val, row, col, mazeTiles){
	if(row >= this.numBlockRows || col >+ this.numBlockColumns){
		throw("Row/Col out of bounds: " + row + " : " + col);
	}

	for(var i = 0; i < this.numTileRowsPerBlock; i++){
		for(var j = 0; j < this.numTileColumnsPerBlock; j++){
			var tileRow = row * this.numTileRowsPerBlock + i;
			var tileColumn = col * this.numTileColumnsPerBlock + j;
			var tileIndex = tileRow * this.numBlockColumns * this.numTileColumnsPerBlock + tileColumn;
			
			mazeTiles[tileIndex] = val;
		}
	}
};

function MazeNode(val,r,c){
	this.value = val;
	this.row = r;
	this.column = c;
	
	this.prevNode;
};

MazeNode.prototype.toString = function(){
	return "(" + this.value + ", " + this.row + ", " + this.column + ")";
};

MazeNode.prototype.calcNonvisitedNeighbors = function(maze, mazeTileSpecifiers){
	var nonVisited = [];
	if(this.row + 1 < maze.numSpecifierRows){
		var downNode = mazeTileSpecifiers[maze.numSpecifierColumns * (this.row + 1) + this.column];
		if(downNode.value == 1){
			nonVisited.push(downNode);
		}
	}
	
	if(this.column + 1 < maze.numSpecifierColumns){
		var rightNode = mazeTileSpecifiers[maze.numSpecifierColumns * this.row + (this.column + 1)];
		if(rightNode.value == 1){
			nonVisited.push(rightNode);
		} 
	}

	if(this.row - 1 >= 0){
		var upNode = mazeTileSpecifiers[maze.numSpecifierColumns * (this.row - 1) + this.column];
		if(upNode.value == 1){
			nonVisited.push(upNode);
		} 
	}

	if(this.column - 1 >= 0){
		var leftNode = mazeTileSpecifiers[maze.numSpecifierColumns * this.row + (this.column - 1)];
		if(leftNode.value == 1){
			nonVisited.push(leftNode);
		} 
	}
	
	return nonVisited;
};