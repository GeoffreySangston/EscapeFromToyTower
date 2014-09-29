function Gun(){

	this.rotSpeed = .1;
	this.fireRate = 3; // less is faster
	
	this.lastFireTick = -this.fireRate; // start so can can always fire in the beginning 
	
	this.theta = 0;
	
	this.damage = 1;
	
	this.ammo = 0;

}

Gun.prototype = Object.create(Entity.prototype);




Gun.prototype.canFire = function(gameStateTicks){
	return (gameStateTicks - this.lastFireTick > this.fireRate) && this.ammo > 0;
};

Gun.prototype.createBullet = function(game){
	var x = game.player.x + game.player.viewWidth/2;
	var y = game.player.y + game.player.viewWidth/2; // didn't put too much time into thinking this over
	var theta = this.theta;
	

	var bullet = new Bullet(-1,-1,theta);
	
	bullet.setCenter(x,y);
	bullet.x += (5 + bullet.viewWidth/3)*Math.cos(theta); // the /3 is pretty arbitrarily chosen
	bullet.y += (5 + bullet.viewWidth/3)*Math.sin(theta); // to make sure the bullet appears outside the gun but not too far
	
	bullet.damage = this.damage;
	
	return bullet;
};