var Engine = { // static class
	game : null,
	lastRenderFrameTime : null,
	maxFPS : 60,
	millisPerFrame : 1000/60,
	lastTimeSinceRender : null
}

Engine.init = function(game){
	this.game = game;
};

Engine.destroy = function(){

};

/**
Should return exit success/failure
*/
var TIMESSUM = 0;
var NUMSAMPLES = 0;
Engine.run = function(){
	
	this.game.update();
	

	
	//var now = Date.now();
	//var timeSinceRender = now - this.lastRenderFrameTime;
	//var curFPS = 1000/timeSinceRender;
	//console.log(curFPS);
	//if(!this.lastTimeSinceRender || Math.random() < (curFPS/60)){
	//	this.lastTimeSinceRender = timeSinceRender;
	//	this.lastRenderFrameTime = now;
	
	//	this.game.render();
		
		//console.log("RENDERING : " + curFPS);
	//} else {
		// skipped frame
	//	console.log("Skipped frame :" + this.game.ticks);
	//}
	/*var start = Date.now();
	this.game.render();
	TIMESSUM += (Date.now() - start);
	NUMSAMPLES++;
	if(NUMSAMPLES%1000 == 0){
		console.log("TIMESSUMAVG: " + TIMESSUM/NUMSAMPLES + " FPS: " + NUMSAMPLES/TIMESSUM);
	}*/
	
	this.game.render();
		
	window.requestAnimationFrame(this.run.bind(this));
};