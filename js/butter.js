function createButter(x, y, z, rot, s, array){

	if(s==0) s= Math.random()*2+2;
	butter = new THREE.Object3D();
	if (rot == 0) {xbox = s*1; zbox = s*2;}
	if (rot == 90) {xbox = s*2; zbox = s*1;}
	butter.userData = {max: new THREE.Vector3(x+xbox,y+0.5,z+zbox), min: new THREE.Vector3(x-xbox,y-s*0.5,z-zbox) };
	
	geometry = new THREE.BoxGeometry(s*2, s*1, s*4); 
	
	mesh = new THREE.Mesh(geometry, matButter);
	butter.add(mesh);
	butter.position.set(x,s/2,z);
	butter.rotation.y = rot*radian;
	array.push(butter); 
	scene.add(butter);

	
}