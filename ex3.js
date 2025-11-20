import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { floorPowerOfTwo } from 'three/src/math/MathUtils.js';
import { gsap } from 'gsap';

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
    camera.position.set(70, 5, 0);

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
    light.decay = 0

    scene.add(light);

    const light1 = new THREE.AmbientLight(0x404040, 1);
    scene.add(light1);
    scene.background = new THREE.Color(0x333333);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 100;
    controls.target.set(0, 1, 0);
    controls.update();

    const formatThreeDigits = (num) => {
        return String(num).padStart(3, '0');
    }
    const roomArray = []
    const red = 0
    const green = 160

    // Load GLTFLoader from CDN
    const loader = new GLTFLoader();
    loader.load(
        './public/BuildingSceneV4.glb',
        function (gltf) {
            scene.add(gltf.scene);
            // Change color for all rooms
            for (let indicatorIndex = 1; indicatorIndex <= 80; indicatorIndex++) {
                const mesh = scene.getObjectByName(`Indicator${formatThreeDigits(indicatorIndex)}`);
                mesh.material.color.setHSL(green/360,1,0.5)
            }
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
