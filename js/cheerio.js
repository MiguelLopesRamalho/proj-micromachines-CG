function addCheerio(x, y, z, arr){
	'use strict';
	var ring = new THREE.Object3D();
	ring.userData = {max: new THREE.Vector3(x+0.5,y+0.2,z+0.5), 
					 min: new THREE.Vector3(x-0.5,y-0.2,z-0.5),
					 spawn: new THREE.Vector3(x,y,z), 
					 speed: 0, 
					 direction:0};
					 
	var geometry = new THREE.TorusGeometry(0.5, 0.25, 5, 5);
	var mesh = new THREE.Mesh(geometry, matCheerio);
	ring.add(mesh);
	ring.position.set(x, y, z);
	ring.rotation.x = (Math.PI)/2;
	arr.push(ring);
	scene.add(ring)
}

function updateCheerios(){
	for (a=0; a<cheerios.length;a++){
		if (cheerios[a].userData.speed != 0){

			/*Calcula nova posicao*/
			var newx = cheerios[a].position.x + delta*Math.sin(cheerios[a].userData.direction)*cheerios[a].userData.speed;
			var newz = cheerios[a].position.z + delta*Math.cos(cheerios[a].userData.direction)*cheerios[a].userData.speed;
			var pos = new THREE.Vector3(newx, cheerios[a].position.y, newz);

			/*Lida com colisao com extremidades da mesa*/
			if (checkColWorld(pos)) 
				{cheerios[a].visible = false;}


			/*Lida com colisoes com manteigas*/
			for (i=0; i<butters.length; i++){
				if (checkColBox(cheerios[a], butters[i])){
					newx = newx - 0.5 * Math.sin(cheerios[a].userData.direction)*cheerios[a].userData.speed*delta;
					newz = newz - 0.5 * Math.sin(cheerios[a].userData.direction)*cheerios[a].userData.speed*delta;
					cheerios[a].userData.speed = 0;
				}
			}

			/*Lida com colisoes com outros cheerios*/
			for (i=0; i<cheerios.length; i++){
				if (a != i && checkColBox(cheerios[a], cheerios[i])){
						cheerios[i].userData.speed = Math.max(cheerios[i].userData.speed,cheerios[a].userData.speed);
						cheerios[a].userData.speed = 0;//cheerios[a].userData.speed/2;
						cheerios[i].userData.direction = cheerios[a].userData.direction;
				}
			}
			
			/*Actualiza BoundingBox*/
			cheerios[a].userData.min = new THREE.Vector3(newx-0.5,0.1-0.2,newz-0.5);
			cheerios[a].userData.max = new THREE.Vector3(newx+0.5,0.1+0.2,newz+0.5);

			/*Actualiza posicao e velocidade*/
			cheerios[a].position.x = newx;
			cheerios[a].position.z = newz;
			cheerios[a].userData.speed = cheerios[a].userData.speed / 5;

			/*Cheerio para quando velocidade se aproxima de zero*/
			if (cheerios[a].userData.speed <  0.1 && cheerios[a].userData.speed > 0 || 
	    		cheerios[a].userData.speed > -0.1 && cheerios[a].userData.speed < 0 ) {
				cheerios[a].userData.speed = 0;
			}
		}
	}
}

function createCurve(r1,r2,x,z,s,c,array){
	'use strict';
	var n;
	for (n = 0; n <45; n+=(50/r2)) {
		addCheerio( x+r2*s*Math.sin(n*2*radian), 0.1, z+r2*c*Math.cos(n*2*radian),array);}
	
	for (n = 0; n <45; n+=(50/r1)){
		addCheerio( x+r1*s*Math.sin(n*2*radian), 0.1, z+r1*c*Math.cos(n*2*radian),array);}
}

function createTrack(array){
	'use strict';
	var hgt = 0.1;
	var n;
	for (n = 0; n < 62; n+=2) {
		addCheerio(n-30, hgt, 48, array);  //add Bottom
		addCheerio(n-30, hgt, 36, array);

		addCheerio(n-30, hgt, -48, array);  //add Top
		addCheerio(n-30, hgt, -36, array);

		addCheerio(48, hgt, n-30, array); 	//add Right
		addCheerio(36, hgt, n-30, array);   
	}

	for (n = 0; n < 26; n+=2) {
		addCheerio(-48, hgt, n+6, array); 
		addCheerio(-36, hgt, n+6, array);

		addCheerio(21, hgt, n-8, array); 
		addCheerio(33, hgt, n-8, array);

		addCheerio(n-7, hgt, 20, array); 
		addCheerio(n-7, hgt, 32, array);
	}

	for (n = 0; n < 46; n+=2) {
		addCheerio(n-30, hgt, -14, array); 
		addCheerio(n-30, hgt, -26, array);
	}

	for (n = 0; n < 10; n+=2) {
		addCheerio(-14, hgt, n+6, array); 
		addCheerio(-26, hgt, n+6, array);
	}

	createCurve(5,17, 31, 31, 1, 1, array); //botright
	createCurve(5,17,-31, 31,-1, 1, array); //topright
	createCurve(5,17, 31,-31, 1,-1, array); //botleft
	createCurve(5,17,-31,-31,-1,-1, array); //topleftSW
	createCurve(5,17,-31,-31,-1, 1, array); //topleftSE

	createCurve(5,17,-31, 5,-1,-1, array); //
	createCurve(5,17,-31, 5, 1,-1, array); //

	createCurve(5,17, -9, 15,-1, 1, array); //
	createCurve(5,17, 16, 15, 1, 1, array); //

	createCurve(5,17, 16, -9, 1,-1, array);
}

