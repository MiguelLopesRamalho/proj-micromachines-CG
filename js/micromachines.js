/*global THREE*/

const radian = 0.0174533; //1 grau em radianos
var camera, scene, sceneHUD, renderer;
const tablesize = 100;
const zoomout = tablesize/2+5;
const MAX_LIVES = 5;
var camera1, camera2, camera3, cameraHUD;
var keys =  [false, false, false, false];
var start = Date.now();
var then  = Date.now();
var now, delta, delta_aux;
var pause = false;
var pauseorg = 1;
var shading = 1;
var wire = false;
var over = false;
var cheer = true;
var NUM_LIVES = MAX_LIVES;

function render() {
	var W = window.innerWidth;
	var H = window.innerHeight;

	renderer.setScissorTest(true);
	renderer.setViewport(0, 0, W,  H);
	renderer.setScissor(0, 0, W, H);
	renderer.clear();
	renderer.render(scene, camera);
	renderer.render(sceneHUD, cameraHUD);

	renderer.setScissorTest(false);
}

function createScene(){ 
	scene = new THREE.Scene();

	oranges  = [];
	butters  = [];
	cheerios = [];
	orangetimers = [];
	candles = [];
	lights = [];


	createTable(0, 0, 0);
	createTrack(cheerios);
	createButter(  4, 0,-33, 0, 5, butters);
	createButter(-31, 0,  5, 0, 3, butters);
	createButter( 23, 0, 46,90, 2, butters);
	createButter( 37, 0, 29,90, 2, butters);
	createButter(-15, 0,-16, 90, 4, butters);
	createCar(42,0.1,0, Math.PI,1,0.6,2,1);
	scene.add(car);

	createCamera();
	camera = camera3;

	for(var n=0;n<3;n++){
		var angle = Math.floor((Math.random() * 4) + 1)*Math.PI/2;
		createOrange(0, 0, 0, (Math.random() * 3) + 2, 0, oranges);
		resetOrange(oranges[n]);
		orangetimers[n]=0;
	}

	createAmbLight();
	directLight = createDirLight(-50, 18, 50);
	createPointLight( 34.5, 8,  0, candles, lights);
	createPointLight(-31, 8, 31, candles, lights);
	createPointLight( 31, 8, 31, candles, lights);
	createPointLight( 31, 8,-31, candles, lights);
	createPointLight(-31, 8,-31, candles, lights);
	createPointLight(-20, 8,-10, candles, lights);
	
}

function createCamera(){
	'use strict';
	var aspect = window.innerWidth/window.innerHeight;
	var num1, num2;
	if (aspect<1) {num1 = zoomout; num2 = (1/aspect)*zoomout}
	else {num1 = aspect*zoomout; num2 = zoomout}

	//Camara Ortogonal
	camera1 = new THREE.OrthographicCamera(-num1, num1, num2, -num2, 1, 100); 
	camera1.position.x = 0;
	camera1.position.y = 25;
	camera1.position.z = 0;
	camera1.lookAt((scene.position));
	
	//Camara Perspectiva Estatica
	camera2 = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 300);
	camera2.position.x = 80;
    camera2.position.y = 50;
	camera2.position.z = 80;
	camera2.lookAt(new THREE.Vector3( 20, 0, 20));

	//Camara Perspectiva Movel
	camera3 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
	camera3.position.x = car.position.x-7*Math.sin(car.rotation.y);
    camera3.position.y = 4;
	camera3.position.z = car.position.z-7*Math.cos(car.rotation.y);
	camera3.lookAt(new THREE.Vector3(car.position.x+5*Math.sin(car.rotation.y),
	car.position.y, car.position.z+5*Math.cos(car.rotation.y)));

	cameraHUD = new THREE.OrthographicCamera(-num1/5, num1/5, num2/5, -num2/5, 1, 100); 
	cameraHUD.position.x = 0;
	cameraHUD.position.y = 5;
	cameraHUD.position.z = 0;          
}

function onResize(){
	'use strict';
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setViewport( 100, 0, window.innerWidth, window.innerHeight)
	if (window.innerHeight > 0 && window.innerWidth > 0 ) {
		var aspect = window.innerWidth/window.innerHeight;
		var num1, num2;
		if (aspect<1) {num1 = zoomout; num2 = (1/aspect)*zoomout}
		else {num1 = aspect*zoomout; num2 = zoomout}

		camera1.left =  -num1;
		camera1.right =  num1;
		camera1.top =    num2;
		camera1.bottom =-num2;
		
		cameraHUD.left =  -num1/5;
		cameraHUD.right =  num1/5;
		cameraHUD.top =    num2/5;
		cameraHUD.bottom =-num2/5;
		
		camera2.aspect = aspect;
		camera3.aspect = aspect;
		
		camera.updateProjectionMatrix();
		cameraHUD.updateProjectionMatrix();
	}
}

function onKeyDown(e){
	'use strict';
    var keycode = e.keyCode;
	switch (keycode){
    case 38 : //Up
    if (car.userData.blockfwd == false)
    	keys[0]= true;
    break;
    case 37 : //Left
    keys[1]= true;
    break;
    case 40 : //Down
    if (car.userData.blockbck == false)
    	keys[2]= true;
    break;
    case 39 : //Right
    keys[3]= true;
    break;
	}
	window.addEventListener('keyup',onKeyUp, false);
}

function onKeyUp(e){
	'use strict';
    var keycode = e.keyCode;
    switch(keycode){
    case 38 : //Up
    keys[0] = false;
	break;
	case 37 : //Left
	keys[1]= false;
	break;
	case 40 : //Down
	keys[2]= false;
	break;
	case 39 : //Right
	keys[3]= false;
	break;
	}
	window.removeEventListener('keydown',onKeyDown, false);
}

function onKeyPress(e){
	'use strict';
	var keycode = e.keyCode;
	switch(keycode){
	case 65: //a
		if (wire) wire = false;
		else wire = true;
		scene.traverse(function (child){
			if (child instanceof THREE.Mesh) {
				if (wire) { 
					child.material.wireframe = true;}
				else {
					child.material.wireframe = false;}
			}
		});
	break;
	case 49 : //1
		camera = camera1;
		onResize();
	break;
	case 50 : //2
		camera = camera2;
		onResize();
	break;
	case 51 : //3
		camera = camera3;
		onResize();
	break;
	case 67: //C - Turn off candles
		switchCandles(lights);
	break;
	case 70: //F - Toggle update cheerios;
		if (cheer == true) cheer = false;
		else cheer = true;
	break;
	case 71: //G - Change shading type
		if (shading == 1) {
			shading = 2;
			setPhong();
		}
		else if (shading == 2){
			shading = 1;
			setGoraud();
		}
	break;
	case 72: //H - Turn off headlights
		switchLight(headLight1);
		switchLight(headLight2);
		
	break;
	case 76: //L - Remove shading
		if (shading > 0) {
			setNoShading(); 
			shading = shading * -1;
		}
		else {
			shading = shading * -1;
			if (shading == 1) setGoraud();
			else setPhong();
		}
	break;
	case 78: //N - switch Day/Night
		switchDay(directLight);
	break;
	case 82: //R - restart game
		if (over == true) reset();
	break;
	case 83: //S - Pause game
	if(over == false){
		if (pause == true){ 
			pause = false;
			displayMsg();
			delta = delta_aux;
		}
		else {
			pause = true;
			displayMsg();
			delta_aux = delta;
		}
	}
	break;
	case 32: //SPACE - Pause oranges
	if (pauseorg == 0){ pauseorg = 1;}
	else pauseorg = 0;
	break;
	}
}

function animate() {
	'use strict';
	window.addEventListener("keydown", onKeyDown);

	now   = Date.now();
	delta = (now-then)/20;
	then  = now;
	
	if (pause == false){
		updateCar();
		camera3.position.x = car.position.x-7*car.userData.dir.x;
		camera3.position.z = car.position.z-7*car.userData.dir.z;
		camera3.lookAt(new THREE.Vector3(
			car.position.x+5*car.userData.dir.x, 
			0, 
			car.position.z+5*car.userData.dir.z));

		for(i=0;i<cars.length;i++){
			cars[i].rotation.y = cars[i].rotation.y + delta*radian/4;
		}

		updateOranges();
		if (cheer == true) updateCheerios();
	}
	render();
	requestAnimationFrame(animate);
}

function init(){
	'use strict';

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setViewport( 100, 0, window.innerWidth, window.innerHeight);
	
	document.body.appendChild(renderer.domElement);
	renderer.setClearColor(0x7EA5CC, 1.0);
	renderer.autoClear = false;
	createScene();
	createOverlay();
	setGoraud();
	render();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown, false);
	window.addEventListener("keydown", onKeyPress, false);
}

function createOverlay(){
	var i;
	cars = [];
	sceneHUD = new THREE.Scene();

	rect = new THREE.Object3D();
	geometry = new THREE.BoxGeometry(20, 1, 2); 
	mesh = new THREE.Mesh(geometry, matButter);
	rect.add(mesh);
	rect.position.set(0,0,0);
	rect.visible = false;
	for(i=0;i<NUM_LIVES;i++){
		cars[i] = addCar(-MAX_LIVES*1.125+(i*3), 0.1,-10, Math.PI*2,1,0.6,2,1);
	}
 
	sceneHUD.add(rect);
	cameraHUD.lookAt(sceneHUD.position);
	sceneHUD.add(cameraHUD);
}

function displayMsg(){
	
	if (over == true){
		rect.visible = true;
		rect.traverse(function (child) {
        	if (child instanceof THREE.Mesh)
				child.material = matGameOver;
    	});
		rect.material = matGameOver;
	}
	else if (pause == true){
		rect.visible = true;
		rect.traverse(function (child) {
        	if (child instanceof THREE.Mesh)
				child.material = matPause;
    	});
	}
	else
		rect.visible = false;
}

function loseLife(){
	NUM_LIVES--;
	cars[NUM_LIVES].visible = false;
	if(NUM_LIVES == 0){
		over = true;
		pause = true;
		displayMsg();
		return 1;
	}
	car.userData.speed = 0;
	car.rotation.y = Math.PI;
	start = Date.now();
	return 0;
}

function reset(){
	NUM_LIVES = MAX_LIVES;
	car.userData.speed = 0;
	car.rotation.y = Math.PI;
	car.position.set(car.userData.origin.x,car.userData.origin.y,car.userData.origin.z);

	for(i=0;i<cars.length;i++){
		cars[i].visible = true;
	}

	for(i=0;i<oranges.length;i++){
		resetOrange(oranges[i]);
		orangetimers[i]= 0;
	}

	for(i=0;i<cheerios.length;i++){
		if (cheerios[i].visible == false) cheerios[i].visible = true;
		cheerios[i].position.set(cheerios[i].userData.spawn.x,cheerios[i].userData.spawn.y,cheerios[i].userData.spawn.z);
		cheerios[i].userData.speed = 0;
		cheerios[i].userData.max = new THREE.Vector3(cheerios[i].userData.spawn.x+0.5,cheerios[i].userData.spawn.y+0.2,cheerios[i].userData.spawn.z+0.5); 
		cheerios[i].userData.min = new THREE.Vector3(cheerios[i].userData.spawn.x-0.5,cheerios[i].userData.spawn.y-0.2,cheerios[i].userData.spawn.z-0.5);
	}
	
	over = false;
	pause = false;
	rect.visible = false;
	start = Date.now();
}