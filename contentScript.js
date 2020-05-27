chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "runSnow") {
    runSnow();
  }
  if (request.message === "runRain") {
    runRain();
  }
});

function runSnow() {
  var elem = document.createElement("div");
  elem.setAttribute("id", "ThreeJS");
  elem.style.cssText = "position: absolute; left:0px; top:0px";
  document.body.appendChild(elem);

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

function runRain() {
  var elem = document.createElement("canvas");
  elem.setAttribute("id", "canvas");
  elem.style.cssText = "position : absolute; top : 0px; left : 0px;z-index:-1";
  document.body.appendChild(elem);
  // This is where the magic happens
  function generateTrigTable(resolution, method) {
    var table = [];
    var increment = 360.0 / resolution;

    for (i = 0; i <= 360.0; i += increment) {
      var index = Math.round(i / increment);
      table[index] = method(i * (Math.PI / 180.0));
    }

    return table;
  }

  requestAnimFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var width = 0;
  var height = 0;

  window.onresize = function onresize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  window.onresize();

  var mouse = {
    X: 0,
    Y: 0
  };

  // window.onmousemove = function onmousemove(event) {
  //   mouse.X = event.clientX;
  //   mouse.Y = event.clientY;
  // };

  var particules = [];
  var gouttes = [];
  var nombrebase = 5;
  var nombreb = 2;
  var updateCounter = 0;

  var controls = {
    intensity: 10, //intensity
    alpha: 1,
    color: 200,
    opacity: 1,
    saturation: 100,
    lightness: 50
  };

  var sineLUT = generateTrigTable(360, Math.sin);

  function Rain(X, Y, nombre) {
    if (!nombre) {
      nombre = nombreb;
    }
    while (nombre--) {
      particules.push({
        vitesseX: Math.random() * 0.33,
        vitesseY: Math.random() * Math.random() * 9 + 1,
        X: X,
        Y: Y,
        alpha: 1,
        color:
          "hsla(" +
          controls.color +
          "," +
          controls.saturation +
          "%, " +
          controls.lightness +
          "%," +
          controls.opacity +
          ")"
      });
    }
  }

  function explosion(X, Y, color, nombre, velocity) {
    if (!nombre) {
      nombre = nombrebase;
    }
    while (nombre--) {
      gouttes.push({
        vitesseX: Math.random() * 4 - 2,
        vitesseY: (velocity / 9) * Math.random() * -4,
        X: X,
        Y: Y,
        radius: 0.65 + Math.floor(Math.random() * 1.6),
        alpha: velocity / 9,
        color: color
      });
    }
  }

  function render(ctx) {
    if (controls.multi == true) {
      controls.color = Math.random() * 360;
    }

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, width, height);

    var particuleslocales = particules;
    var goutteslocales = gouttes;
    var tau = Math.PI * 2;

    for (
      var i = 0, particulesactives;
      (particulesactives = particuleslocales[i]);
      i++
    ) {
      var dx = particulesactives.X - mouse.X;
      var dy = particulesactives.Y - mouse.Y;
      ctx.globalAlpha = particulesactives.alpha - (1 - dy / 50);
      ctx.fillStyle = particulesactives.color;
      ctx.fillRect(
        particulesactives.X,
        particulesactives.Y,
        particulesactives.vitesseY / 4,
        particulesactives.vitesseY
      );
    }

    for (var i = 0, gouttesactives; (gouttesactives = goutteslocales[i]); i++) {
      ctx.globalAlpha = gouttesactives.alpha;
      ctx.fillStyle = gouttesactives.color;

      ctx.beginPath();
      ctx.arc(
        gouttesactives.X,
        gouttesactives.Y,
        gouttesactives.radius,
        0,
        tau
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.restore();
  }

  var randomLimit = 0.75;

  function update() {
    var particuleslocales = particules;
    var goutteslocales = gouttes;

    for (
      var i = 0, particulesactives;
      (particulesactives = particuleslocales[i]);
      i++
    ) {
      particulesactives.X += particulesactives.vitesseX;
      particulesactives.Y += particulesactives.vitesseY + 7;
      if (
        particulesactives.Y > height - 15 ||
        particulesactives.Y >
          (height - 15) *
            (controls.horizon +
              (controls.overflow / 100) *
                (1 - controls.horizon) *
                Math.pow(particulesactives.vitesseY, 2)) ||
        Math.random() > 0.9995
      ) {
        particuleslocales.splice(i--, 1);
        explosion(
          particulesactives.X,
          particulesactives.Y,
          particulesactives.color,
          null,
          particulesactives.vitesseY
        );
      }
    }

    for (var i = 0, gouttesactives; (gouttesactives = goutteslocales[i]); i++) {
      gouttesactives.X += gouttesactives.vitesseX;
      gouttesactives.Y += gouttesactives.vitesseY;
      gouttesactives.radius -= 0.075;
      if (gouttesactives.alpha > 0) {
        gouttesactives.alpha -= 0.005;
      } else {
        gouttesactives.alpha = 0;
      }
      if (gouttesactives.radius < 0) {
        goutteslocales.splice(i--, 1);
      }
    }

    var i = controls.intensity;
    while (i--) {
      Rain(Math.floor(Math.random() * width), -15);
    }
  }

  (function boucle() {
    requestAnimFrame(boucle);
    update();
    render(ctx);
  })();
}
