function createOrange(x,y,z,s,rot,array){
  if(s==0) s= Math.random()*3+3;
  orange = new THREE.Object3D();
  orange.userData = {radius: s, rot: rot, speed:Math.random()+1}

  geometry = new THREE.SphereGeometry(s,10,10);
  mesh = new THREE.Mesh(geometry, matOrange);

  orange.add(mesh);

  geometry = new THREE.CubeGeometry(s*0.1,s*0.05,s*0.1);
  mesh = new THREE.Mesh(geometry, matOrange);
  mesh.position.y = s+s*0.025;

  orange.add(mesh);
  orange.position.set(x,s,z);

  array.push(orange);
  scene.add(orange);
}

function updateOranges(){
  var i, newx, newz, current;
  var speed = pauseorg*Math.sqrt((now-start)/100000);
  for (i=0;i<oranges.length;i++){
    if(oranges[i].visible){

      /*Calcula possivel posicao*/
      var newpos = new THREE.Vector3(
      oranges[i].position.x + delta*oranges[i].userData.speed *speed * Math.sin(oranges[i].userData.rot),
      oranges[i].position.y,
      oranges[i].position.z + delta*oranges[i].userData.speed *speed * Math.cos(oranges[i].userData.rot));

      /*Lida com colisoes com manteigas*/
      /*
      if (checkColArray(oranges[i], butters)) { 
        oranges[i].userData.rot = oranges[i].userData.rot+Math.PI;
      }*/

      /*Lida com colisoes com extremidades da mesa*/
      if(checkColWorld(newpos) || checkColArray(oranges[i], butters)){
        oranges[i].visible = false;
        current = Date.now();
        orangetimers[i] = current + Math.random()*3000; //esperar numero aleatorio de segundos
      }

      /*Calcula nova posicao*/
      else{
        oranges[i].position.x = oranges[i].position.x + delta*oranges[i].userData.speed *speed * Math.sin(oranges[i].userData.rot);
        oranges[i].position.z = oranges[i].position.z + delta*oranges[i].userData.speed *speed * Math.cos(oranges[i].userData.rot);
        oranges[i].rotation.x = oranges[i].rotation.x + oranges[i].userData.speed *speed*50* 1/oranges[i].userData.radius*radian*Math.cos(oranges[i].userData.rot);
        oranges[i].rotation.z = oranges[i].rotation.z - oranges[i].userData.speed *speed*50* 1/oranges[i].userData.radius*radian*Math.sin(oranges[i].userData.rot);
      }
    }

    /*Caso nao esteja visivel, reaparece se ja passou o intervalo aleatorio*/
    else{
      current = Date.now();
      if (current >= orangetimers[i]){
        orangetimers[i] = 0;
        resetOrange(oranges[i]);
      }
    }
  }
}

function resetOrange(orng){
  orng.visible = true;
  orng.rotation.x = 0;
  orng.rotation.z = 0;
  //do{ /*Calcula nova posicao que nao intersecta com manteiga*/
    orng.position.x= Math.random()*90-50; 
    orng.position.z= Math.random()*90-50;
    orng.userData.rot=Math.floor((Math.random() * 4)+1)*Math.PI/2;
  //}while(checkColArray(orng, butters)==true)
}