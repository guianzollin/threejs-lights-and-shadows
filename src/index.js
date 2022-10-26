import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    500
);
camera.position.set(50, 10, 0);
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();

// DirectionalLight
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(0, 10, 5);
directionalLight.castShadow = true; // default false
scene.add( directionalLight )

//Set up shadow properties for the light
directionalLight.shadow.mapSize.width = 512; // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default

//Create a helper for the shadow camera (optional)
const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
scene.add( helper );

// SpotLight
const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set(0, 10, -5);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 50;
spotLight.shadow.camera.fov = 20;

scene.add( spotLight );

//Create a helper for the shadow camera (optional)
const helperSpotLight = new THREE.CameraHelper( spotLight.shadow.camera );
scene.add( helperSpotLight );

//Create a box that cast shadows (but does not receive them)
const boxGeometry = new THREE.BoxGeometry( 5, 5, 5 );
const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0x049ef4,
    emissive: 0x000000,
    roughness: 0,
    metalness: 0.5
});
const box = new THREE.Mesh( boxGeometry, boxMaterial );
box.castShadow = true; //default is false
box.receiveShadow = false; //default
scene.add( box );

//Create a ground that receives shadows (but does not cast them)
const groundGeometry = new THREE.BoxGeometry( 30, 0.15, 50 );
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x049ef4,
    emissive: 0x000000, 
    roughness: 0,
    metalness: 0.5
});
const ground = new THREE.Mesh( groundGeometry, groundMaterial );
ground.position.y = -10;
ground.castShadow = false; //default is false
ground.receiveShadow = true; //default
scene.add( ground );

// OrbitControls
const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

    box.rotation.x += 0.01;
    box.rotation.y += 0.02;
    box.rotation.z += 0.03;

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );

}

animate();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize );