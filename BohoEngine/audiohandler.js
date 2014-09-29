/**
Handles the loading and caching of the sound assets
*/

function AudioHandler(){
	this.successCount = 0;
	this.errorCount = 0;
	this.cache = {};
	this.downloadQueue = [];
}

AudioHandler.prototype.queueDownload = function(path){
	this.downloadQueue.push(path);
};

AudioHandler.prototype.downloadAll = function(downloadCallback,callbackParam) {
  	if (this.downloadQueue.length === 0) {
    	downloadCallback(callbackParam);
  	}
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var path = this.downloadQueue[i];
        var audio = new Audio();
        var self = this;
        audio.addEventListener("loadedmetadata", function() {
            self.successCount += 1;
            if (self.isDone()) {
        		downloadCallback(callbackParam);
    		}
        }, false);
        audio.addEventListener("error", function() {
        	
        	self.errorCount += 1;
        	if (self.isDone()) {
        		downloadCallback(callbackParam);
    		}
    	}, false);
        audio.src = path;
        this.cache[path] = audio;
    }
    
}

AudioHandler.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
}