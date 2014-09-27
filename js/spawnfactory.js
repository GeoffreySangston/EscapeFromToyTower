function SpawnFactory(){

}

SpawnFactory.prototype.getSpawn = function(spawnId,x,y,theta){
	switch(spawnId){
		/*case LITTLESUSIE: return new Zombie(x,y,theta);
		case ZOMBIEDOG: return new ZombieDog(x,y,theta);
		case BLOAT: return new Bloat(x,y,theta);*/
		case LITTLESUSIE: return new Toy(x,y,LITTLESUSIE);
		case BIGBEAR: return new Toy(x,y,BIGBEAR);
		default:
			throw("No such spawn: " + spawnId);
	}
};