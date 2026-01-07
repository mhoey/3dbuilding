import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Import GLTFLoader from CDN
var scene = new THREE.Scene();

function loadThreeJSScene() {
    // Create scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(70,5, 0);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add light
    const light = new THREE.SpotLight(0xffffff, 10);
    light.position.set(170, 180, 0);
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512;
    light.castShadow = true; // default false
    light.decay=0
    
    scene.add(light);

    const light1 = new THREE.AmbientLight( 0x404040,1 );
    scene.add( light1 );

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 100;
    controls.target.set(0, 1, 0);
    controls.update();

    // Load GLTFLoader from CDN
    const loader = new GLTFLoader();
    loader.load(
        './BuildingSceneV2.glb',
        function (gltf) {
            scene.add(gltf.scene);
        },
        undefined,
        function (error) {
            console.error('An error happened while loading the model:', error);
        }
    );

    let indicatorIndex = 0;

    const formatThreeDigits = (num) => {
        return String(num).padStart(3, '0');
    }

    const intervalId = setInterval(() => {
      const mesh = scene.getObjectByName(`Indicator${formatThreeDigits(indicatorIndex)}`);
      if (mesh) {
        mesh.material.color.set(0xff0000); // Change color to red
      }
      indicatorIndex++
      if (indicatorIndex>80) {
        clearInterval(intervalId);
      }
    }, 500);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    }
    animate();
}

// Initialize scene
loadThreeJSScene();
