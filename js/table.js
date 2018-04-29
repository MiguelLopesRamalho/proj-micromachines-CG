function addTableLeg(obj, x, y, z){
	geometry = new THREE.CubeGeometry(2, 40, 2);
	mesh = new THREE.Mesh(geometry, matTable);
	mesh.position.set(x, y-20, z);
	obj.add(mesh);
}

function addTableTop(obj, x, y, z){
	
	for(i=-45;i<55;i+=10){
		for(j=-45;j<55;j+=10){
			var geometry = new THREE.CubeGeometry(10, 2, 10);
			var mesh = new THREE.Mesh(geometry, matTable);
			mesh.position.set(i,y,j);
			obj.add(mesh);
		}
	}
	/*
	var geometry = new THREE.CubeGeometry(100, 2, 100);
	var mesh = new THREE.Mesh(geometry, matTable);
	mesh.position.set(x,y,z);
	*/
	obj.add(mesh);
}

function createTable(x, y, z){
	
	table = new THREE.Object3D();
	addTableTop(table, 0, -1, 0);
	/*
	addTableLeg(table, -48, -2, -48);
	addTableLeg(table, -48, -2, 48);
	addTableLeg(table, 48, -2, 48);
	addTableLeg(table, 48, -2, -48);
	*/
	scene.add(table);

	table.position.x = x;
	table.position.y = y;
	table.position.z = z;
}
