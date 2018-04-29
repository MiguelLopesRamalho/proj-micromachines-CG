function addWheel(obj,x,y,z,s,index,material, nsides){

	var wheel = new THREE.Object3D();
	var geometry = new THREE.Geometry();

	geometry.vertices.push(	new THREE.Vector3(x+s*0.4, y, z)); //Centro exterior

	for(i=0;i<nsides+1;i++){
		geometry.vertices.push(new THREE.Vector3(x+s*0.4, y+s*Math.sin(i*Math.PI*2/nsides), z+s*Math.cos(i*Math.PI*2/nsides) ) );
	}

	for(i=0;i<nsides+1;i++){
		geometry.vertices.push(new THREE.Vector3(x-s*0.4, y+s*Math.sin(i*Math.PI*2/nsides), z+s*Math.cos(i*Math.PI*2/nsides) ) );
	}

	geometry.vertices.push(	new THREE.Vector3(x-s*0.4, y, z)); //Centro interior

	for(i=0;i<nsides;i++){
		geometry.faces.push(new THREE.Face3(0, i+2, i+1)); //Outer radius
	}
	for(i=1;i<nsides+1;i++){
		geometry.faces.push(new THREE.Face3(nsides*2+3, i+nsides+1, i+nsides+2)); //Inner Radius
	}
	for(i=0;i<nsides+1;i++){	
		geometry.faces.push(new THREE.Face3(i+nsides+1, i+1, i+nsides+2)); 
		geometry.faces.push(new THREE.Face3(i+nsides+2, i+1, i+2));
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	wheel.add(mesh);
	obj[index]= wheel;
	
}

function createCar(x,y,z,angle,w,h,l,scale){
	car = new THREE.Object3D();
	var o = new THREE.Vector3(x,y,z);
	car.userData = {speed: 0, dirc: (0,0,1), radius: scale*l/2, blockfwd: false, blockbck: false, origin: o };

	car.userData.dirc = new THREE.Vector3(Math.sin(angle),0,Math.cos(angle));

	var width=w*scale;
	var height=h*scale;
	var length=l*scale;

	wheels = [];
	addWheel(wheels, width/4+scale*0.05, y*scale, length/6, scale*0.3, 0, matCarWheelP, 5);
	addWheel(wheels,-width/4-scale*0.05, y*scale, length/6, scale*0.3, 1, matCarWheelP, 5);
	addWheel(wheels, width/4+scale*0.05, y*scale,-length/6, scale*0.3, 2, matCarWheelP, 5);
	addWheel(wheels,-width/4-scale*0.05, y*scale,-length/6, scale*0.3, 3, matCarWheelP, 5);
	scene.add(wheels[1]);
	scene.add(wheels[2]);
	scene.add(wheels[3]);
	scene.add(wheels[0]);
	
	var geometry = new THREE.Geometry();

	geometry.vertices.push(	
		new THREE.Vector3( 0, 0, 0),					
		new THREE.Vector3( width/2, 0.05, 	length/2),	//Carrocaria
		new THREE.Vector3(-width/2, 0.05,  length/2),
		new THREE.Vector3( width/2, 0.05, -length/2),
		new THREE.Vector3(-width/2, 0.05, -length/2),
		new THREE.Vector3( width/2, height*0.7,  length/2),
		new THREE.Vector3(-width/2, height*0.7,  length/2),
		new THREE.Vector3( width/2, height*0.7, -length/2),
		new THREE.Vector3(-width/2, height*0.7, -length/2),

		new THREE.Vector3( width/3, height*1.3, length*0.2), //Tejadilho
		new THREE.Vector3(-width/3, height*1.3, length*0.2), 
		new THREE.Vector3( width/3, height*1.3, -length*0.4), 
		new THREE.Vector3(-width/3, height*1.3, -length*0.4), 

		new THREE.Vector3( width/2, height*0.7,  length*0.4), //Frente
		new THREE.Vector3(-width/2, height*0.7,  length*0.4), 

		new THREE.Vector3( width/2, height*0.7, -length*0.45), //Tras
		new THREE.Vector3(-width/2, height*0.7, -length*0.45),
		);

	geometry.faces.push(
	new THREE.Face3(1, 2, 3), //Bottom
	new THREE.Face3(2, 4, 3),
	
	new THREE.Face3(1, 5, 2), //Front
	new THREE.Face3(2, 5, 6),

	new THREE.Face3(3, 8, 7), //Back
	new THREE.Face3(3, 4, 8),

	new THREE.Face3(5, 7, 8), //Top
	new THREE.Face3(8, 6, 5),

	new THREE.Face3(2, 8, 4), //Right
	new THREE.Face3(6, 8, 2),

	new THREE.Face3(1, 7, 5), //Left
	new THREE.Face3(3, 7, 1),

	new THREE.Face3(9, 11, 10), //Roof
	new THREE.Face3(10, 11, 12),

	new THREE.Face3(9,  10, 13), //Front
	new THREE.Face3(10, 14, 13),

	new THREE.Face3(11, 15, 12), //Back
	new THREE.Face3(12, 15, 16),

	new THREE.Face3(10, 12, 14), //Left
	new THREE.Face3(12, 16, 14),

	new THREE.Face3(9, 13, 11), //Right
	new THREE.Face3(11, 13, 15));

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	mesh = new THREE.Mesh(geometry, matCarMetal);

	car.add(mesh);

	
	car.position.set(x,y,z);
	car.rotation.y = angle;
	

	headLight1 = createHeadLight(x+0.5,y,z+1);
	headLight2 = createHeadLight(x-0.5,y,z+1);
}

function updateCar(){
	'use strict';
	const radian2 = 1*0.0174533; //Velocidade de rotacao do carro
	var drift = 0;
	const acc = 1.05; //Aceleracao
	const vmax = 0.5; //Velocidade maxima

	if(keys[0] && car.userData.blockfwd == false){ //UP
		if (car.userData.speed < -0.05)     // Ainda em marcha atras
			car.userData.speed = car.userData.speed/acc;

		else if (car.userData.speed < 0.05) //Arrancar
			car.userData.speed = 0.05;

		else if (car.userData.speed < vmax)  //Velocidade maxima
			car.userData.speed = car.userData.speed*acc;

		if(keys[1]){ // UP + LEFT
			car.rotation.y += delta*4*radian2;
			drift = radian2;
		}

		if(keys[3]){ //UP + RIGHT
			car.rotation.y -= delta*4*radian2;
			drift = -radian2;
        }
    }
	
    else if(keys[2] && car.userData.blockbck == false){ //DOWN
        if(car.userData.speed > 0.01) 
        	car.userData.speed = car.userData.speed/acc;

        else if(car.userData.speed >= 0) 
        	car.userData.speed = -0.05;

        else if(car.userData.speed > -vmax/2) 
        	car.userData.speed = car.userData.speed*acc;

        if(keys[3]){ //DOWN + LEFT
			car.rotation.y += delta*3*radian2;
			drift = radian2;
		}

		if(keys[1]){ //DOWN + RIGHT
			car.rotation.y -= delta*3*radian2;
			drift = -radian2;
		}
    }

    else{ //NEITHER UP NOR DOWN
    	if (car.userData.speed <  0.05 && car.userData.speed > 0 || 
    		car.userData.speed > -0.05 && car.userData.speed < 0) {
    		car.userData.speed = 0;}
        if (car.userData.speed >= 0.05 || car.userData.speed <= -0.05) {
        car.userData.speed = car.userData.speed / 1.005;
        }

	    if(keys[1]){ //LEFT
	        if(car.userData.speed>=0.05 || car.userData.speed <= -0.05)
	        car.rotation.y += delta*car.userData.speed/Math.abs(car.userData.speed)*2*radian2;
	   		drift = radian2;
	    } 

	    if(keys[3]){ //RIGHT
	        if(car.userData.speed>=0.05 || car.userData.speed <= -0.05)
	        car.rotation.y -= delta*car.userData.speed/Math.abs(car.userData.speed)*2*radian2;
	    	drift = -radian2;
	    }
	}

	car.userData.dir = new THREE.Vector3(Math.sin(car.rotation.y),0,Math.cos(car.rotation.y));
	
	var checkpos = new THREE.Vector3(car.position.x + delta*car.userData.speed*car.userData.dir.x,
   				  					 car.position.y + delta*car.userData.speed*car.userData.dir.y,
       			  					 car.position.z + delta*car.userData.speed*car.userData.dir.z)

	var newpos = manageCollisions(checkpos);

    car.position.set(newpos.x, newpos.y, newpos.z);
	
	wheels[0].rotation.y = car.rotation.y + 3*drift;
	wheels[1].rotation.y = car.rotation.y + 3*drift;
	wheels[2].rotation.y = car.rotation.y;
	wheels[3].rotation.y = car.rotation.y;
	
	for(var i=0; i<4; i++){
    	wheels[i].position.set(car.position.x, car.position.y, car.position.z);
    }

   headLight1.position.set(
	   car.position.x+Math.sin(car.rotation.y+Math.PI/6), 
	   newpos.y, 
	   car.position.z+Math.cos(car.rotation.y+Math.PI/6));

   headLight2.position.set(
	   car.position.x+Math.sin(car.rotation.y-Math.PI/6), 
	   newpos.y, 
	   car.position.z+Math.cos(car.rotation.y-Math.PI/6));

   headLight1.target.position.set(newpos.x+5*car.userData.dir.x, newpos.y, newpos.z+5*car.userData.dir.z);
   headLight2.target.position.set(newpos.x+5*car.userData.dir.x, newpos.y, newpos.z+5*car.userData.dir.z);

   //headLight1.target.updateMatrixWorld();
   //headLight2.target.updateMatrixWorld();
}

/*Verifica colisoes do carro com todas as classes*/
function manageCollisions(pos){
	var i;

	/*Colisao com Extremidade da Mesa:*/
	if(checkColWorld(pos)){
		if (loseLife()== 0){
			return car.userData.origin;
		}
		else
			return pos;
	}

	/*Colisao com Laranjas:*/
	for(i=0; i<oranges.length; i++){
		if (pos.equals(car.userData.origin)==false && checkColSphere(car, oranges[i]) ) {
			
			if (loseLife()== 0){
				return car.userData.origin;
			}
			else
				return pos;

		}		
	}

	/*Colisao com Manteigas:*/
	for(i=0; i<butters.length; i++){
		if (checkColMix(pos, car.userData.radius, butters[i])){
			if (car.userData.speed > 0.05) {
				car.userData.blockfwd = true; }
			
			else if (car.userData.speed < -0.05){
				car.userData.blockbck = true;}
				
			car.userData.speed = 0;
			newpos = new THREE.Vector3(pos.x-0.5*delta*car.userData.speed*car.userData.dir.x, 
									   pos.y, 
									   pos.z-0.5*delta*car.userData.speed*car.userData.dir.z);
			return newpos;
		}
	}

	/*Desbloqueia carro caso nao tenha colidido com manteigas*/
	car.userData.blockfwd = false;
	car.userData.blockbck = false;
	
	/*Colisao com Cheerios:*/
	
	for(i=0; i<cheerios.length; i++){
		if (checkColMix(pos, car.userData.radius, cheerios[i]) ) {

			cheerios[i].userData.speed = car.userData.speed*1.1;
			cheerios[i].userData.direction = car.rotation.y;
			//car.userData.speed = car.userData.speed/1.1;			
		}
	}
	
	/*Caso nao haja colisoes proxima posicao e' aceite*/
	return pos;
}

function addCar(x,y,z,angle,w,h,l,scale){
	var car2 = new THREE.Object3D();
	var o = new THREE.Vector3(x,y,z);
	car2.userData = {speed: 0, dirc: (0,0,1), radius: scale*l/2, blockfwd: false, blockbck: false, origin: o };

	car2.userData.dirc = new THREE.Vector3(Math.sin(angle),0,Math.cos(angle));

	var width=w*scale;
	var height=h*scale;
	var length=l*scale;
	
	addRoda(car2,  width/4+scale*0.05, y*scale, length/6, scale*0.3, matCarWheel, 8);
	addRoda(car2, -width/4-scale*0.05, y*scale, length/6, scale*0.3, matCarWheel, 8);
	addRoda(car2,  width/4+scale*0.05, y*scale,-length/6, scale*0.3, matCarWheel, 8);
	addRoda(car2, -width/4-scale*0.05, y*scale,-length/6, scale*0.3, matCarWheel, 8);
    
	var geometry = new THREE.Geometry();
	
	geometry.vertices.push(	
		new THREE.Vector3( 0, 0, 0),					
		new THREE.Vector3( width/2, 0.05, 	length/2),	//Carrocaria
		new THREE.Vector3(-width/2, 0.05,  length/2),
		new THREE.Vector3( width/2, 0.05, -length/2),
		new THREE.Vector3(-width/2, 0.05, -length/2),
		new THREE.Vector3( width/2, height*0.7,  length/2),
		new THREE.Vector3(-width/2, height*0.7,  length/2),
		new THREE.Vector3( width/2, height*0.7, -length/2),
		new THREE.Vector3(-width/2, height*0.7, -length/2),

		new THREE.Vector3( width/3, height*1.3, length*0.2), //Tejadilho
		new THREE.Vector3(-width/3, height*1.3, length*0.2), 
		new THREE.Vector3( width/3, height*1.3, -length*0.4), 
		new THREE.Vector3(-width/3, height*1.3, -length*0.4), 

		new THREE.Vector3( width/2, height*0.7,  length*0.4), //Frente
		new THREE.Vector3(-width/2, height*0.7,  length*0.4), 

		new THREE.Vector3( width/2, height*0.7, -length*0.45), //Tras
		new THREE.Vector3(-width/2, height*0.7, -length*0.45),
		);

	geometry.faces.push(
	new THREE.Face3(1, 2, 3), //Bottom
	new THREE.Face3(2, 4, 3),
	
	new THREE.Face3(1, 5, 2), //Front
	new THREE.Face3(2, 5, 6),

	new THREE.Face3(3, 8, 7), //Back
	new THREE.Face3(3, 4, 8),

	new THREE.Face3(5, 7, 8), //Top
	new THREE.Face3(8, 6, 5),

	new THREE.Face3(2, 8, 4), //Right
	new THREE.Face3(6, 8, 2),

	new THREE.Face3(1, 7, 5), //Left
	new THREE.Face3(3, 7, 1),

	new THREE.Face3(9, 11, 10), //Roof
	new THREE.Face3(10, 11, 12),

	new THREE.Face3(9,  10, 13), //Front
	new THREE.Face3(10, 14, 13),

	new THREE.Face3(11, 15, 12), //Back
	new THREE.Face3(12, 15, 16),

	new THREE.Face3(10, 12, 14), //Left
	new THREE.Face3(12, 16, 14),

	new THREE.Face3(9, 13, 11), //Right
	new THREE.Face3(11, 13, 15));

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	mesh = new THREE.Mesh(geometry, matCarMetal);

	car2.add(mesh);
	
	car2.position.set(x,y,z);
	car2.rotation.x = -Math.PI/2;
	car2.rotation.y = angle;
	car2.rotation.z = 0;

	sceneHUD.add(car2);
	return car2;
}

function addRoda(obj,x,y,z,s,material, nsides){

	var geometry = new THREE.Geometry();

	geometry.vertices.push(	new THREE.Vector3(x+s*0.4, y, z)); //Centro exterior

	for(i=0;i<nsides+1;i++){
		geometry.vertices.push(new THREE.Vector3(x+s*0.4, y+s*Math.sin(i*Math.PI*2/nsides), z+s*Math.cos(i*Math.PI*2/nsides) ) );
	}

	for(i=0;i<nsides+1;i++){
		geometry.vertices.push(new THREE.Vector3(x-s*0.4, y+s*Math.sin(i*Math.PI*2/nsides), z+s*Math.cos(i*Math.PI*2/nsides) ) );
	}

	geometry.vertices.push(	new THREE.Vector3(x-s*0.4, y, z)); //Centro interior

	for(i=0;i<nsides;i++){
		geometry.faces.push(new THREE.Face3(0, i+2, i+1)); //Outer radius
	}
	for(i=1;i<nsides+1;i++){
		geometry.faces.push(new THREE.Face3(nsides*2+3, i+nsides+1, i+nsides+2)); //Inner Radius
	}
	for(i=0;i<nsides+1;i++){	
		geometry.faces.push(new THREE.Face3(i+nsides+1, i+1, i+nsides+2)); 
		geometry.faces.push(new THREE.Face3(i+nsides+2, i+1, i+2));
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);

	obj.add(mesh);	
}