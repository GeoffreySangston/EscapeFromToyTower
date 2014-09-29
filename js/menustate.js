function MenuState(){
	this.localTicks = 0;
	this.type = MENUSTATE;
	
	this.menuItems = [new MenuItem("Play"), new MenuItem("Music Room"), new MenuItem("Options"), new MenuItem("Quit")];
	this.curMenuItemIndex = 0;
	
	this.eventHandler = new MenuEventHandler();
	
}
MenuState.prototype = Object.create(State.prototype);

MenuState.prototype.init = function(game){
	for(var i = 0; i < this.menuItems.length; i++){
		this.menuItems[i].x = 50;
		this.menuItems[i].y = i*30 + 100 + i*20;
	}
	
	game.audioPlayer.loopAudio("audio/CreepyGameRough1.mp3",0,1);
};

MenuState.prototype.destroy = function(game){
	game.inputHandler.clearEvents();
};

MenuState.prototype.update = function(game){
	this.eventHandler.handleEvents(game);
	console.log("UPDATE MENU");
};

MenuState.prototype.render = function(game){
	game.renderer.cls();
	this.renderMenuItems(game);
	this.renderItemSelection(game);
	//game.renderer.renderFromBuffer();
};

MenuState.prototype.renderMenuItems = function(game){
	for(var i = 0; i < this.menuItems.length; i++){
		var x = this.menuItems[i].x;
		var y = this.menuItems[i].y;
		
		game.renderer.drawRect(x,y,96,32,0);
	}
};

MenuState.prototype.renderItemSelection = function(game){
	/*
	The thing that designates the item as being selected
	*/
	var x = this.menuItems[this.curMenuItemIndex].x;
	var y = this.menuItems[this.curMenuItemIndex].y;
	var width = this.menuItems[this.curMenuItemIndex].width;
	var height = this.menuItems[this.curMenuItemIndex].height;
};	