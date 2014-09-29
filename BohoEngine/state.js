function State(){
	this.localTicks = 0;
	this.type;
}

State.prototype.init = function(game){

};

State.prototype.destroy = function(game){

};

State.prototype.update = function(game){
	this.localTicks++;
};

State.prototype.render = function(game){

};