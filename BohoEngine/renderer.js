function Renderer(canvas,width,height){
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	
	this.canvas.width = width;
	this.canvas.height = height;
	
	this.cameraX = 0;
	this.cameraY = 0;
	
}

Renderer.prototype.cls = function(x,y,w,h){
	if(!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h)){
		this.context.clearRect(x,y,w,h);
	} else {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
		this.canvas.width = this.canvas.width;
	}
};

Renderer.prototype.drawPoint = function(x,y,r,color){
	if(color){
		this.context.fillStyle = color;
	}
	this.context.fillRect(x-r/2 + this.cameraX,y-r/2 + this.cameraY,r,r);
	this.context.fillStyle = "#000000";
};

Renderer.prototype.drawLine = function(x1,y1,x2,y2){
	//this.context.strokeLine(x1,y1,x2,y2);
	this.context.moveTo(x1 + this.cameraX,y1 + this.cameraY);
	this.context.lineTo(x2 + this.cameraY,y2 + this.cameraY);
	this.context.stroke();
};

Renderer.prototype.drawRect = function(x,y,w,h,theta,pw,ph){
	
	this.context.save();
	if(theta){ // http://www.williammalone.com/briefs/how-to-rotate-html5-canvas-around-center/
		if(!isNaN(pw)){
			this.context.translate(x+pw + this.cameraX,y+ph + this.cameraY);
			this.context.rotate(theta);
			this.context.translate(-x-pw - this.cameraX,-y-ph - this.cameraY);

		} else {
			this.context.translate(x+w/2 + this.cameraX,y+h/2 + this.cameraY);
			this.context.rotate(theta);
			this.context.translate(-x-w/2 - this.cameraX,-y-h/2 - this.cameraY);
		}
		
	}
	this.context.rect(x + this.cameraX,y + this.cameraY,w,h);
	this.context.stroke();
	this.context.restore();
	
};

Renderer.prototype.drawImage = function(img,x,y,w,h,theta,pw,ph){
	if(!this.isOnScreen(x,y,w,h)){
		return;
	} 
	
	this.context.save();
	if(theta){ // http://www.williammalone.com/briefs/how-to-rotate-html5-canvas-around-center/
		if(!isNaN(pw)){
			this.context.translate(x+pw + this.cameraX,y+ph + this.cameraY);
			this.context.rotate(theta);
			this.context.translate(-x-pw - this.cameraX,-y-ph - this.cameraY);

		} else {
			this.context.translate(x+w/2 + this.cameraX,y+h/2 + this.cameraY);
			this.context.rotate(theta);
			this.context.translate(-x-w/2 - this.cameraX,-y-h/2 - this.cameraY);
		}
		
	}
	this.context.drawImage(img,x + this.cameraX,y + this.cameraY,w,h);
	this.context.restore();
	
};


Renderer.prototype.isOnScreen = function(x,y,w,h){
	var onScreen = (
			(x + this.cameraX >= -w) && 
			(x + this.cameraX <= GAMEWIDTH) && 
			(y + this.cameraY >= -h) && 
			(y + this.cameraY <= GAMEHEIGHT));
	
	return onScreen;
};

Renderer.prototype.drawRectByCenter= function(cx,cy,w,h,theta,pw,ph){
	this.context.save();
	if(theta){ // http://www.williammalone.com/briefs/how-to-rotate-html5-canvas-around-center/
		if(!isNaN(pw)){
			this.context.translate(pw + this.cameraX,ph + this.cameraY);
			this.context.rotate(theta);
			this.context.translate(-pw - this.cameraX,-ph - this.cameraY);
		} else {
			this.context.translate(cx + this.cameraX,cy + this.cameraY);
			this.context.rotate(theta);
			this.context.translate(-cx - this.cameraX,-cy - this.cameraY);
		}
		
	}
	this.context.rect(cx-w/2 + this.cameraX,cy-h/2 + this.cameraY,w,h);
	this.context.stroke();
	this.context.restore();
};

Renderer.prototype.drawText = function(x,y,text,size,color){
	this.context.fillStyle = color;
	this.context.font = size + "px Verdana";
	this.context.fillText(text,x + this.cameraX,y + this.cameraY);
};

Renderer.prototype.drawFixedText = function(x,y,text,size,color){
	this.context.fillStyle = color;
	this.context.font = size + "px Verdana";
	this.context.fillText(text,x,y);
};