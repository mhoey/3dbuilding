import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Import GLTFLoader from CDN

function loadThreeJSScene() {
    // Create scene
    const scene = new THREE.Scene();

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
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(170, 180, 0);
    scene.add(light);

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
        './public/BuildingSceneV2.glb',
        function (gltf) {
            scene.add(gltf.scene);
        },
        undefined,
        function (error) {
            console.error('An error happened while loading the model:', error);
        }
    );

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
