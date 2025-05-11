import * as THREE from 'https://cdn.skypack.dev/three@0.156.1';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.156.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.156.1/examples/jsm/loaders/GLTFLoader.js'; 


// Preparar escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 4;
//scene.background = new THREE.Color(0xf0f0f0); // Blanco
const loaderFondo = new THREE.TextureLoader();
loaderFondo.load('images/fondo.jpg', function(texture) {
    scene.background = texture;
});


// Luz
const light = new THREE.AmbientLight(0xffffff, 1); // Luz blanca
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras suaves


// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Animación más suave
controls.dampingFactor = 0.05;

// Cargar modelo
const loader = new GLTFLoader();
loader.load( 'models/MarianitaWeb.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);

    // Recorre los objetos para activar sombras
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    scene.add(model);

}, undefined, function ( error ) {

    console.error( error );

} );
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.ShadowMaterial({ opacity: 0.3 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.15; // Ajusta según tu modelo
floor.receiveShadow = true;
scene.add(floor);
// Animacion
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );

