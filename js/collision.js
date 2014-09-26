function Collision(a,b){
	if(a == b){
		throw("BOTH COLLIDERS CANNOT BE EQUAL");
	}
	this.colliderA = a;
	this.colliderB = b;
}

Collision.prototype = Object.create(Object.prototype);

Collision.prototype.equals = function(oc){
	return 	(this.colliderA == oc.colliderA && this.colliderB == oc.colliderB) ||
			(this.colliderA == oc.colliderB && this.colliderB == oc.colliderA);
}

Collision.prototype.containsEntity = function(collider){
	return this.colliderA == collider || this.colliderB == collider;
};

Collision.prototype.containsEntity = function(collider){
	return this.colliderA == collider || this.colliderB == collider;
};