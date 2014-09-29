function Dialogue(statements, skippable){
	this.statements = statements;
	this.curStatementIndex;
	this.curStatementStartTicks;
	this.advanceOnTicks;
	this.skippable = skippable;
	
	console.log(statements);
}

Dialogue.prototype.init = function(game){
	this.curStatementIndex = 0;
	this.curStatementStartTicks = game.stateMachine.curState.localTicks;
	this.advanceOnTicks = this.curStatementStartTicks + this.statements[this.curStatementIndex].advanceTicks;

};

Dialogue.prototype.advance = function(game){
	this.curStatementIndex++;
	this.curStatementStartTicks = game.stateMachine.curState.localTicks;
	if(this.statements[this.curStatementIndex]){
		this.advanceOnTicks = this.curStatementStartTicks + this.statements[this.curStatementIndex].advanceTicks;
	}
};

Dialogue.prototype.canAdvance = function(){
	return this.statements[this.curStatementIndex].canAdvance;
};

Dialogue.prototype.makeAdvanceable = function(){
	this.statements[this.curStatementIndex].canAdvance = true;
};

Dialogue.prototype.hasAutoAdvance = function(){
	return !isNaN(this.statements[this.curStatementIndex].advanceTicks);
};

Dialogue.prototype.timeToAdvance = function(game){
	var gameState = game.stateMachine.curState;
	return gameState.localTicks >= this.advanceOnTicks;
};

Dialogue.prototype.isOver = function(){
	return this.curStatementIndex >= this.statements.length;
};

Dialogue.prototype.getCurStatement = function(){
	return this.statements[this.curStatementIndex];
};

function DialogueStatement(sheetNum, speakerName, text, isOnLeft, canAdvance, advanceTicks){
	this.tileSheetRef = "img/portraits.png";
	this.sheetNum = sheetNum;
	this.speakerName = speakerName;
	this.text = text;
	this.isOnLeft = isOnLeft; // false means put picture on right
	this.canAdvance = canAdvance; // can advance to the next statement, useful for if an event is occurring while someone is talking
	this.advanceTicks = advanceTicks; // should advance automatically after this number of ticks, if undefined advanced by player
}