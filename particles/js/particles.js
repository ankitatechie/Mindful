var container, scene, camera, renderer, elem, cube;
var clock = new THREE.Clock();

function play(param) {
  if (document.getElementById("ThreeJS")) {
    document.getElementById("ThreeJS").remove();
  }
  elem = document.createElement("div");
  elem.setAttribute("id", "ThreeJS");
  elem.style.cssText = "position: fixed; left:0px; top:0px; z-index: 1";
  document.body.appendChild(elem);
  init(param);
  animate();
}

// FUNCTIONS
function init(param) {
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 2,
    FAR = 5000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 200, 400);
  camera.lookAt(scene.position);
  // RENDERER
  if (Detector.webgl)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  else renderer = new THREE.CanvasRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById("ThreeJS");
  container.appendChild(renderer.domElement);
  // EVENTS
  THREEx.WindowResize(renderer, camera);

  ////////////
  // CUSTOM //
  ////////////

  this.engine = new ParticleEngine();
  engine.setValues(Examples[param]);
  engine.initialize(scene);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

function restartEngine(parameters) {
  resetCamera();

  engine.destroy(scene);
  engine = new ParticleEngine();
  engine.setValues(parameters);
  engine.initialize(scene);
}

function resetCamera() {
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 20000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  //camera.up = new THREE.Vector3( 0, 0, 1 );
  camera.position.set(0, 200, 400);
  camera.lookAt(scene.position);
  scene.add(camera);

  THREEx.WindowResize(renderer, camera);
}

function update() {
  var dt = clock.getDelta();
  engine.update(dt * 0.5);
}

function render() {
  renderer.render(scene, camera);
}
