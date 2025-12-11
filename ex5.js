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

const rows = 8
const cols = 10

const normalize = (value, max) => {
    return value / max * 9.99
}

const parabolicValues = (total, samples) => {
    const average = total / samples
    const values = new Array(samples)

    // Create parabolic distribution centered at average
    // Using a parabola that peaks at the center
    const maxDeviation = average * 0.5

    for (let i = 0; i < samples; i++) {
        // Normalize position from -1 to 1
        const t = (i / (samples - 1)) * 2 - 1

        // Parabolic function: 1 - t²
        // This gives higher values near center, lower at edges
        const parabola = 1 - (t * t)

        // Scale deviation and add to average
        const deviation = parabola * maxDeviation
        values[i] = average + deviation - (maxDeviation / 2)
    }

    // Adjust to match exact total
    const currentSum = values.reduce((a, b) => a + b, 0)
    const adjustment = (total - currentSum) / samples

    return values.map(v => v + adjustment)
}

// Init heat values
let zeroValues = Array(rows * cols).fill(0)


// Base average
const baseConsumption = 50 * 33 * 80
const calcTotal = (degrees) => {
    return (20 - (degrees)) * baseConsumption
}

const calcDistribution = (degrees) => {
    let total = calcTotal(degrees)
    let distributedValues = parabolicValues(total, 80)
    let calcSum = 0
    distributedValues.map(x => calcSum += x)
    distributedValues = distributedValues.map(x => Math.floor(normalize(x, 67620) * 1000) / 1000)
    return distributedValues
}

const formatThreeDigits = (num) => {
    return String(num).padStart(3, '0');
}

const tempColors = [
        "#04213f",
        "#0000d9",
        "#0000f0",
        "#005dff",
        "#008cff",
        "#fad320",
        "#ffc228",
        "#ff8b3b",
        "#ff4100",
        "#f00000"
]

document.getElementById("totalConsumption").innerText = calcTotal(10)


document.getElementById("trange").value = 20

document.getElementById("trange").addEventListener("input",
    (inputEvent) => {
        let rangeValue = inputEvent.target.value
        document.getElementById("outsideTemp").textContent = rangeValue
        let distributedValues = calcDistribution(rangeValue)
        for (let i = distributedValues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [distributedValues[i], distributedValues[j]] = [distributedValues[j], distributedValues[i]];
        }
        for(let i=0;i<distributedValues.length;i++) {
            const mesh = scene.getObjectByName(`Indicator${formatThreeDigits(i+1)}`);
            const newColorIndex = Math.floor(distributedValues[i])
            if (mesh) {
                mesh.material.color.set(tempColors[newColorIndex])
            }
        }
        let total = calcTotal(rangeValue)
        let totalText = `${total}`
        totalText = totalText.padStart(11,"0")
        let avg = Math.floor(total/80)
        let avgText = `${avg}`
        avgText = avgText.padStart(11,0)
        document.getElementById("totalConsumption").textContent = totalText
        document.getElementById("avgConsumption").textContent = avgText
    }
)

// Initialize scene
loadThreeJSScene();
