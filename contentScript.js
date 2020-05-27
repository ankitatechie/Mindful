chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "runSnow") {
    runSnow();
  }
  if (request.message === "changeBackground") {
    changeBackground();
  }
});

function loadJS(src) {
  // DOM: Create the script element
  var jsElm = document.createElement("script");
  // set the type attribute
  jsElm.type = "application/javascript";
  // make the script element load file
  jsElm.src = src;
  console.log(jsElm, "jsElm");
  // finally insert the element to the body element in order to load the script
  document.body.appendChild(jsElm);
}

function start() {
  var container, scene, camera, renderer;
  var clock = new THREE.Clock();
  // custom global variables
  var cube;

  init();
  animate();

  // FUNCTIONS
  function init() {
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
    engine.setValues(Examples.snow);
    engine.initialize();
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
    update();
  }

  function restartEngine(parameters) {
    resetCamera();

    engine.destroy();
    engine = new ParticleEngine();
    engine.setValues(parameters);
    engine.initialize();
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
}

function runSnow() {
  var elem = document.createElement("div");
  elem.setAttribute("id", "ThreeJS");
  elem.style.cssText = "position: absolute; left:0px; top:0px";
  document.body.appendChild(elem);
  start();
}

function changeBackground() {
  var elem = document.createElement("div");
  elem.style.cssText =
    "position:absolute;width:100%;height:100%;opacity:1;z-index:100;background:red";
  document.body.appendChild(elem);
}
