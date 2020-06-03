Examples = {
  snow: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 200, 100),
    positionSpread: new THREE.Vector3(500, 0, 500),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, -30, 0),
    velocitySpread: new THREE.Vector3(50, 20, 50),
    accelerationBase: new THREE.Vector3(0, -5, 0),

    angleBase: 0,
    angleSpread: 720,
    angleVelocityBase: 0,
    angleVelocitySpread: 60,

    particleTexture: THREE.ImageUtils.loadTexture(
      chrome.runtime.getURL("particles/images/snow.png")
    ),

    sizeTween: new Tween([0, 1], [1, 10]),
    colorBase: new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
    opacityTween: new Tween([2, 3], [0.8, 0.6]),

    particlesPerSecond: 250,
    particleDeathAge: 4.0,
    emitterDeathAge: 60
  },

  fireflies: {
    positionStyle: Type.CUBE,
    positionBase: new THREE.Vector3(0, 0, 0),
    positionSpread: new THREE.Vector3(400, 400, 300),

    velocityStyle: Type.CUBE,
    velocityBase: new THREE.Vector3(0, 0, 0),
    velocitySpread: new THREE.Vector3(70, 20, 70),

    particleTexture: THREE.ImageUtils.loadTexture(
      chrome.runtime.getURL("particles/images/spark.png")
    ),

    sizeBase: 30.0,
    sizeSpread: 3.0,
    opacityTween: new Tween(
      [0.0, 1.0, 1.1, 2.0, 2.1, 3.0, 3.1, 4.0, 4.1, 5.0, 5.1, 6.0, 6.1],
      [0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2]
    ),
    colorBase: new THREE.Vector3(0.2, 3.0, 0.5), // H,S,L
    colorSpread: new THREE.Vector3(0.3, 0.0, 0.0),

    particlesPerSecond: 150,
    particleDeathAge: 6.1,
    emitterDeathAge: 600
  },

  firework: {
    positionStyle: Type.SPHERE,
    positionBase: new THREE.Vector3(0, 100, 0),
    positionRadius: 10,

    velocityStyle: Type.SPHERE,
    speedBase: 90,
    speedSpread: 10,

    accelerationBase: new THREE.Vector3(0, -80, 0),

    particleTexture: THREE.ImageUtils.loadTexture(
      chrome.runtime.getURL("particles/images/spark.png")
    ),

    sizeTween: new Tween([0.5, 0.7, 1.3], [5, 40, 1]),
    opacityTween: new Tween([0.2, 0.7, 2.5], [0.75, 1, 0]),
    colorTween: new Tween(
      [0.4, 0.8, 1.0],
      [
        new THREE.Vector3(0, 1, 1),
        new THREE.Vector3(0, 1, 0.6),
        new THREE.Vector3(0.8, 1, 0.6)
      ]
    ),
    blendStyle: THREE.AdditiveBlending,

    particlesPerSecond: 3000,
    particleDeathAge: 2.5,
    emitterDeathAge: 0.2
  }
};
