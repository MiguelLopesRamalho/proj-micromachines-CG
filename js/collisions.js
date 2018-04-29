/*Verifica colisoes entre esfera e AABB*/
function checkColMix(pos, radius, obj2){
	if (obj2.userData.max.x >= pos.x - radius && 
		obj2.userData.min.x <= pos.x + radius && 
		obj2.userData.max.z >= pos.z - radius && 
		obj2.userData.min.z <= pos.z + radius ){
		return true;
	}
	return false;
}

/*Verifica colisoes entre esfera e AABB's do array dado*/
function checkColArray(obj, array){
	var pos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
	for(i=0;i<array.length;i++){
		if (checkColMix(pos, obj.userData.radius, array[i]))
			return true;
	}
	return false;
}

/* Verifica colisoes entre AABB's*/
function checkColBox(obj, obj2){
	if (obj2.userData.max.x >= obj.userData.max.x && 
		obj2.userData.min.x <= obj.userData.max.x && 
		obj2.userData.max.z >= obj.userData.max.z && 
		obj2.userData.min.z <= obj.userData.max.z ||
		obj2.userData.max.x >= obj.userData.min.x && 
		obj2.userData.min.x <= obj.userData.min.x && 
		obj2.userData.max.z >= obj.userData.min.z && 
		obj2.userData.min.z <= obj.userData.min.z ) {
		return true;
	}
	return false;
}

/*Verifica colisoes entre esferas*/
function checkColSphere(obj, obj2){
	if (Math.sqrt(
		Math.pow(obj2.position.x - obj.position.x, 2) +   
		Math.pow(obj2.position.z - obj.position.z, 2) +
		Math.pow(obj2.position.y - obj.position.y, 2)) < 
		obj2.userData.radius + obj.userData.radius) {
	return true;
	}
	return false;
}

function checkColWorld(pos){
	if(pos.x > tablesize/2 || pos.x <-tablesize/2 || pos.z >tablesize/2 || pos.z <-tablesize/2){
		return true;
	}
	return false;
}