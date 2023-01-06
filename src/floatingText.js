import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import GUI from "lil-gui";

const gui = new GUI();

// canvas
const canvas = document.querySelector(".canvas");

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a2647);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

// camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  10,
  10000
);
scene.add(camera);
camera.position.z = 250;

// orbit controllers
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load("/matcap-3.png");

// text
const fontLoader = new FontLoader();
fontLoader.load("fonts/helvetiker_regular.typeface.json", function (font) {
  const geometry = new TextGeometry("Sanjeev", {
    font: font,
    size: 60,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 4,
    bevelSize: 3,
    bevelOffset: 0,
    bevelSegments: 8,
  });

  geometry.computeBoundingBox();
  geometry.center();

  const material = new THREE.MeshStandardMaterial();
  // material.wireframe = true;

  const text = new THREE.Mesh(geometry, material);
  scene.add(text);

  gui.add(text.scale, "z", 1, 10);

  text.rotation.y = 0.2;

  function scale() {
    requestAnimationFrame(scale);
    clock.getElapsedTime();
    text.scale.z += 0.5 * Math.sin(clock.elapsedTime);
  }

  // scale();
});

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

const matCapMaterial = new THREE.MeshMatcapMaterial({ map: matCapTexture });
const torusGeometry = new THREE.TorusGeometry(10, 6, 50, 20);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshStandardMaterial()
);
scene.add(plane);
plane.rotation.x = -(Math.PI / 2);
plane.position.y = -60;

const clock = new THREE.Clock();

for (let i = 0; i < 400; i++) {
  const donut = new THREE.Mesh(torusGeometry, matCapMaterial);
  scene.add(donut);

  donut.position.x = (Math.random() - 0.5) * 1000;
  donut.position.y = (Math.random() - 0.5) * 500;
  donut.position.z = (Math.random() - 0.5) * 500;

  // gui.add(donut.position, "x");

  const scale = Math.random() * 2;
  donut.scale.set(scale, scale, scale);

  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  const float = () => {
    requestAnimationFrame(float);
    clock.getElapsedTime();
    donut.position.y += Math.sin(clock.elapsedTime * 10) / 2;
  };

  float();
}

gui.hide();

const directionalLight = new THREE.DirectionalLight(0xff6491, 1);
scene.add(directionalLight);
directionalLight.position.y = 100;
directionalLight.position.z = 100;

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x00abff, 0.5);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0x538620, 10, 100, 1);
scene.add(pointLight);
pointLight.position.z = -50;
pointLight.position.y = 30;
pointLight.position.x = -120;

const tick = () => {
  requestAnimationFrame(tick);

  // clock.getElapsedTime();
  // camera.position.x += Math.sin(clock.elapsedTime - 10);
  // camera.position.z += 4 * Math.sin(clock.elapsedTime - 10);

  renderer.render(scene, camera);
};

tick();
