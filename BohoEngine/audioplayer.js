function AudioPlayer(audioHandler){
	this.audioHandler = audioHandler;
	this.volume = 1;
	this.curAudio;
}

/*
All params are in millis

audioStart is where to start playing from
loopStart is where to start looping from
loopLength is the length of the loop, use this to calculate the loopEnd ms 
*/
AudioPlayer.prototype.loopAudio = function(audioRef, audioStart, loopStart, loopLength){
	var audio = this.audioHandler.cache[audioRef];
	this.curAudio = audio;

	if(!audio){
		throw("No such audio: " + audioRef);
	}
	
	audio.currentTime = audioStart;
	audio.volume = this.volume;
	
	if(typeof audio.loop == 'boolean'){
		audio.loop = true;
	} else {
		audio.addEventListener('ended', function() {
   		 	this.currentTime = loopStart;
	   	 	this.play();
		}, false);
	}
	//audio.play();

	var playPromise = audio.play();
    if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Automatic playback started!
      // Show playing UI.
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
    });	
    }

};

AudioPlayer.prototype.setVolume = function(volume){
	this.volume = volume;
	this.curAudio.volume = this.volume;

};
