function Main(){
	var game = new ToyGame();
	game.setNextState(INITSTATE);

	Engine.init(game);
	
	var engineReturn = Engine.run();
	
	Engine.destroy();
	return engineReturn;
}