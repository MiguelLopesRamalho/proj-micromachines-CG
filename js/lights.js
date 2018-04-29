function createAmbLight(){
	var ambiColor = 0x2E2E2E;
	ambientLight = new THREE.AmbientLight(ambiColor);
	ambientLight.intensity = 1.0;
	scene.add(ambientLight);
}

function createDirLight(x,y,z){
	var dirColor = 0xffffff;
    directionalLight = new THREE.DirectionalLight(dirColor);
	directionalLight.position.set(x, y, z);
	directionalLight.intensity = 1.0;

	scene.add(directionalLight);
	return directionalLight;
}

function switchDay(directionalLight){
	if (directionalLight.intensity > 0) {
		directionalLight.intensity = 0;
		renderer.setClearColor (0x0000000, 1.0); //(0x01162B
		ambientLight.intensity = 0.0;
	}
	else{
		directionalLight.intensity = 1.0;
		renderer.setClearColor(0x7EA5CC, 1.0);
		ambientLight.intensity = 1;
	}
}

function createPointLight(x,y,z,array1,array2){
	var candle = new THREE.Object3D();
	var geometry = new THREE.CylinderGeometry( 1, 1, y-1, 8 );
	var cylinder = new THREE.Mesh(geometry, matCandle);
	cylinder.position.set(x, (y-1)/2, z);
	candle.add(cylinder);
	scene.add(candle);

	light = new THREE.PointLight( 0xFFE2B0, 0.5, 60, 1 );
	light.position.set(x, y, z);
	array2.push(light);
	array1.push(candle);
	scene.add(light);
}

function switchCandles(array){
	for(i=0;i<array.length;i++)
		switchLight(array[i]);
}

function createHeadLight(x,y,z){
	spotLight = new THREE.SpotLight(0xFFE2B0);
	spotLight.position.set(x, y, z);
	spotLight.angle = Math.PI/3;
	spotLight.intensity = 1;
	spotLight.distance = 40;
	//spotLight.penumbra = 0.1;
	//spotLight.decay = 1.0;
	scene.add(spotLight);
	scene.add(spotLight.target);
	return spotLight;
}

function switchLight(light){
	if (light.intensity > 0) light.intensity = 0;
	else light.intensity = 1;
}
