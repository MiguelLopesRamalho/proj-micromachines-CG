var texTable = new THREE.TextureLoader().load("textures/table.png");
var texPause = new THREE.TextureLoader().load("textures/pause.png");
var texGameOver = new THREE.TextureLoader().load("textures/gameover.png");
var matGameOver = new THREE.MeshBasicMaterial({map: texGameOver, transparent: true});//, opacity: 0.5,});
var matPause = new THREE.MeshBasicMaterial({map: texPause, transparent: true});

//No Shading
var matCheerio 		= new THREE.MeshBasicMaterial({color: 0xF5C96A, wireframe: false});
var matOrange 		= new THREE.MeshBasicMaterial({color: 0xFF801F, wireframe: false});
var matButter		= new THREE.MeshBasicMaterial({color: 0xF5F254, wireframe: false});
var matCarWheel		= new THREE.MeshBasicMaterial({color: 0x050505, wireframe: false});
var matCarMetal		= new THREE.MeshBasicMaterial({color: 0x3180BD, wireframe: false});
var matTable		= new THREE.MeshBasicMaterial({color: 0xE8F0B2, wireframe: false, map: texTable});
var matCandle	    = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: false});

//Goraud
var matCheerioG 	= new THREE.MeshLambertMaterial({color: 0xF5C96A, wireframe: false});
var matOrangeG 		= new THREE.MeshLambertMaterial({color: 0xFF801F, wireframe: false});
var matButterG		= new THREE.MeshLambertMaterial({color: 0xF5F254, wireframe: false});
var matCarWheelG	= new THREE.MeshLambertMaterial({color: 0x050505, wireframe: false});
var matCarMetalG	= new THREE.MeshLambertMaterial({color: 0x3180BD, wireframe: false});
var matTableG		= new THREE.MeshLambertMaterial({color: 0xE8F0B2, wireframe: false, map: texTable});
var matCandleG	    = new THREE.MeshLambertMaterial({color: 0xFFFFFF, wireframe: false});

//Phong
var matCheerioP 	= new THREE.MeshPhongMaterial({color: 0xF5C96A, wireframe: false});
matCheerioP.specular = new THREE.Color(0x8C8C8C);
matCheerioP.shininess = 5;

var matOrangeP 		= new THREE.MeshPhongMaterial({color: 0xFF801F, wireframe: false});
matOrangeP.specular = new THREE.Color(0xB20A0A);
matOrangeP.shininess = 5;

var matButterP		= new THREE.MeshPhongMaterial({color: 0xF5F254, wireframe: false});
matButterP.specular = new THREE.Color(0xF5F254);
matButter.shininess = 40;

var matCarWheelP	= new THREE.MeshPhongMaterial({color: 0x050505, wireframe: false});
matCarWheelP.specular = new THREE.Color(0x666666);
matCarWheelP.shininess = 20;

var matCarMetalP	= new THREE.MeshPhongMaterial({color: 0x3180BD, wireframe: false});
matCarMetalP.specular = new THREE.Color(0xC6C6C6);
matCarMetalP.shininess = 80;

var matTableP		= new THREE.MeshPhongMaterial({color: 0xE8F0B2, wireframe: false, map: texTable}); //color: 0xE8F0B2,
matTableP.specular = new THREE.Color(0x8C8C8C);
matTableP.shininess = 5;

var matCandleP	    = new THREE.MeshPhongMaterial({color: 0xFFFFFF, wireframe: false});
matCandleP.specular = new THREE.Color(0x8C8C8C);
matCandleP.shininess = 5;

function setNoShading() {
	
	for(i=0;i<cheerios.length;i++){
    	cheerios[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh){
				child.material = matCheerio;}
    	});
	}
    for(i=0;i<butters.length;i++){
    	butters[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh){
				child.material = matButter;}
    	});
	}
    for(i=0;i<oranges.length;i++){
    	oranges[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh){
				child.material = matOrange;}
    	});
	}

	for(i=0;i<candles.length;i++){
    	candles[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh)
				child.material = matCandle;
    	});
	}

	table.traverse(function (child){
		if (child instanceof THREE.Mesh)
		child.material = matTable;
	});

	car.traverse(function (child){
		if (child instanceof THREE.Mesh)
		child.material = matCarMetal;
	});

	for(i=0;i<wheels.length;i++){
		wheels[i].traverse(function (child){
			if (child instanceof THREE.Mesh)
				child.material = matCarWheel;
		});
	}
	renderer.setClearColor(0x7EA5CC, 1.0)
}

function setGoraud() {
	
	for(i=0;i<cheerios.length;i++){
    	cheerios[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh){
				child.material = matCheerioG;}
    	});
	}
    for(i=0;i<butters.length;i++){
    	butters[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh){
				child.material = matButterG;}
    	});
	}
    for(i=0;i<oranges.length;i++){
    	oranges[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh){
				child.material = matOrangeG;}
    	});
	}

	for(i=0;i<candles.length;i++){
    	candles[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh)
				child.material = matCandleG;
    	});
	}

	table.traverse(function (child){
		if (child instanceof THREE.Mesh)
			child.material = matTableG;
	});

	car.traverse(function (child){
		if (child instanceof THREE.Mesh)
			child.material = matCarMetalG;
	});

	for(i=0;i<wheels.length;i++){
		wheels[i].traverse(function (child){
			if (child instanceof THREE.Mesh)
				child.material = matCarWheelG;
		});
	}
}

function setPhong() {
	
	for(i=0;i<cheerios.length;i++){
    	cheerios[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh){
			child.material = matCheerioP;}
    	});
	}

    for(i=0;i<butters.length;i++){
    	butters[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh){
				child.material = matButterP;}
    	});
	}

    for(i=0;i<oranges.length;i++){
    	oranges[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh){
				child.material = matOrangeP;}
    	});
	}

	for(i=0;i<candles.length;i++){
    	candles[i].traverse(function (child) {
        	if (child instanceof THREE.Mesh)
				child.material = matCandleP;
    	});
	}

	table.traverse(function (child){
		if (child instanceof THREE.Mesh)
			child.material = matTableP;});

	car.traverse(function (child){
		if (child instanceof THREE.Mesh)
			child.material = matCarMetalP;});

	for(i=0;i<wheels.length;i++){
		wheels[i].traverse(function (child){
			if (child instanceof THREE.Mesh)
				child.material = matCarWheelP;
		});
	}
}


