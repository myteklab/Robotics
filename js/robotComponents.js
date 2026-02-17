Colors = {
  COLOR_NOCOLOR: 0, // HSV values from https://lego.fandom.com/wiki/Colour_Palette
  COLOR_BLACK: 1,   // 0, 0, 0
  COLOR_BLUE: 2,    // 207, 64, 78
  COLOR_GREEN: 3,   // 120, 100, 60
  COLOR_YELLOW: 4,  // 60, 100, 100
  COLOR_RED: 5,     // 0, 100, 100
  COLOR_WHITE: 6,   // 0, 0, 100
  COLOR_BROWN: 7,   // 24, 79, 25

  COLORS: [
    'NoColor',
    'Black',
    'Blue',
    'Green',
    'Yellow',
    'Red',
    'White',
    'Brown',
  ],

  toHSV: function(rgb) {
    var hsv = [0, 0, 0];
    var normRgb = [0, 0, 0]

    for (let i=0; i<3; i++) {
      normRgb[i] = rgb[i] / 255;
    }

    var cMax = Math.max(...normRgb);
    var cMin = Math.min(...normRgb);
    var diff = cMax - cMin;

    if (cMax == cMin) {
      hsv[0] = 0;
    } else if (cMax == normRgb[0]) {
      hsv[0] = 60 * (normRgb[1] - normRgb[2]) / diff;
    } else if (cMax == normRgb[1]) {
      hsv[0] = 60 * (2 + (normRgb[2] - normRgb[0]) / diff);
    } else {
      hsv[0] = 60 * (4 + (normRgb[0] - normRgb[1]) / diff);
    }
    if (hsv[0] < 0) {
      hsv[0] += 360;
    }

    if (cMax == 0) {
      hsv[1] = 0;
    } else {
      hsv[1] = diff / cMax * 100;
    }

    hsv[2] = cMax * 100;

    return hsv;
  },

  toLAB: function(rgb) {
    var xyz = [0, 0, 0];
    var lab = [0, 0, 0];
    var normRgb = [0, 0, 0]

    for (let i=0; i<3; i++) {
      let c = rgb[i] / 255;
      if (c > 0.04045) {
        normRgb[i] = Math.pow((c + 0.055) / 1.055, 2.4);
      } else {
        normRgb[i] = c / 12.92;
      }
    }

    xyz[0] = (normRgb[0] * 0.4124 + normRgb[1] * 0.3576 + normRgb[2] * 0.1805) / 0.95047;
    xyz[1] = (normRgb[0] * 0.2126 + normRgb[1] * 0.7152 + normRgb[2] * 0.0722) / 1.00000;
    xyz[2] = (normRgb[0] * 0.0193 + normRgb[1] * 0.1192 + normRgb[2] * 0.9505) / 1.08883;

    for (let i=0; i<3; i++) {
      if (xyz[i] > 0.008856) {
        xyz[i] = Math.pow(xyz[i], 1/3);
      } else {
        xyz[i] = (7.787 * xyz[i]) + 16/116;
      }
    }

    lab[0] = (116 * xyz[1]) - 16;
    lab[1] = 500 * (xyz[0] - xyz[1]);
    lab[2] = 200 * (xyz[1] - xyz[2]);

    return lab;
  },

  toHLS: function(rgb) {
    var hls = [0, 0, 0];
    var normRgb = [0, 0, 0]

    for (let i=0; i<3; i++) {
      normRgb[i] = rgb[i] / 255;
    }

    var cMax = Math.max(...normRgb);
    var cMin = Math.min(...normRgb);
    var diff = cMax - cMin;

    if (cMax == cMin) {
      hls[0] = 0;
    } else if (cMax == normRgb[0]) {
      hls[0] = 60 * (normRgb[1] - normRgb[2]) / diff;
    } else if (cMax == normRgb[1]) {
      hls[0] = 60 * (2 + (normRgb[2] - normRgb[0]) / diff);
    } else {
      hls[0] = 60 * (4 + (normRgb[0] - normRgb[1]) / diff);
    }
    if (hls[0] < 0) {
      hls[0] += 360;
    }

    if (cMax == 0 || cMin == 255) {
      hls[2] = 0;
    } else {
      hls[2] = diff / (1 - Math.abs(cMax + cMin - 1)) * 100;
    }

    hls[1] = (cMax + cMin) / 2 * 100;

    return hls;
  },

  toColor: function(hsv) {
    if (hsv[2] < 30)
      return Colors.COLOR_BLACK;
    else if (hsv[1] < 20)
      return Colors.COLOR_WHITE;
    else if (hsv[0] < 45 && hsv[2] < 50)
      return Colors.COLOR_BROWN;
    else if (hsv[0] < 30)
      return Colors.COLOR_RED;
    else if (hsv[0] < 90)
      return Colors.COLOR_YELLOW;
    else if (hsv[0] < 163)
      return Colors.COLOR_GREEN;
    else if (hsv[0] < 283)
      return Colors.COLOR_BLUE;
    else
      return Colors.COLOR_RED;
  },

  toColorName: function(color) {
    return Colors.COLORS[color];
  }
}

// Global list of options to ignore (e.g., deprecated options from saved projects)
var IGNORED_OPTIONS = ['componentScale'];

// Color sensor. Uses a camera to capture image and extract average RGB values
function ColorSensor(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'ColorSensor';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  this.mask = [];
  this.maskSize = 0;

  this.init = function() {
    self.setOptions(options);

    // Main body - invisible physics container (same dimensions as original)
    var body = BABYLON.MeshBuilder.CreateBox('colorSensorBody', {height: 2, width: 2, depth: 3}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;

    body.position.z -= 1.50001;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    body.parent = parent;

    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)

    // Housing (dark gray enclosure)
    var housingMat = new BABYLON.StandardMaterial('colorSensorHousing', scene);
    housingMat.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.28);
    housingMat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);
    var housing = BABYLON.MeshBuilder.CreateBox('colorSensorHousingMesh', {height: 1.8, width: 1.9, depth: 2.6}, scene);
    housing.material = housingMat;
    housing.parent = body;
    housing.position.set(0, 0, -0.15);
    scene.shadowGenerator.addShadowCaster(housing);

    // Front face plate (slightly lighter)
    var faceMat = new BABYLON.StandardMaterial('colorSensorFace', scene);
    faceMat.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.38);
    var face = BABYLON.MeshBuilder.CreateBox('colorSensorFace', {height: 1.6, width: 1.7, depth: 0.15}, scene);
    face.material = faceMat;
    face.parent = body;
    face.position.set(0, 0, 1.35);
    scene.shadowGenerator.addShadowCaster(face);

    // Lens aperture ring (dark metallic ring around the eye)
    var ringMat = new BABYLON.StandardMaterial('colorSensorRing', scene);
    ringMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.18);
    ringMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    var ring = BABYLON.MeshBuilder.CreateTorus('colorSensorRing', {diameter: 1.1, thickness: 0.15, tessellation: 16}, scene);
    ring.material = ringMat;
    ring.parent = body;
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0, 1.42);

    // Sensor eye (red lens - functional, keep position)
    var eyeMat = new BABYLON.StandardMaterial('colorSensorEyeMat', scene);
    eyeMat.diffuseColor = new BABYLON.Color3(0.6, 0.0, 0.0);
    eyeMat.specularColor = new BABYLON.Color3(0.8, 0.2, 0.2);
    eyeMat.emissiveColor = new BABYLON.Color3(0.25, 0.0, 0.0);
    self.eye = BABYLON.MeshBuilder.CreateSphere('colorSensorEye', {diameterX: 0.9, diameterY: 0.9, diameterZ: 0.5, segments: 8}, scene);
    self.eye.material = eyeMat;
    self.eye.position.z = 1.5;
    self.eye.parent = body;

    // LED indicators (two small dots on front face)
    var ledOnMat = new BABYLON.StandardMaterial('colorSensorLedOn', scene);
    ledOnMat.diffuseColor = new BABYLON.Color3(0.1, 0.7, 0.1);
    ledOnMat.emissiveColor = new BABYLON.Color3(0.05, 0.25, 0.05);
    var led1 = BABYLON.MeshBuilder.CreateCylinder('colorLed1', {height: 0.08, diameter: 0.18, tessellation: 8}, scene);
    led1.material = ledOnMat;
    led1.rotation.x = Math.PI / 2;
    led1.parent = body;
    led1.position.set(-0.55, 0.55, 1.42);

    var ledOffMat = new BABYLON.StandardMaterial('colorSensorLedOff', scene);
    ledOffMat.diffuseColor = new BABYLON.Color3(0.7, 0.5, 0.0);
    ledOffMat.emissiveColor = new BABYLON.Color3(0.2, 0.15, 0.0);
    var led2 = BABYLON.MeshBuilder.CreateCylinder('colorLed2', {height: 0.08, diameter: 0.18, tessellation: 8}, scene);
    led2.material = ledOffMat;
    led2.rotation.x = Math.PI / 2;
    led2.parent = body;
    led2.position.set(0.55, 0.55, 1.42);

    // Mounting tabs (small flanges on sides)
    var tabMat = new BABYLON.StandardMaterial('colorSensorTab', scene);
    tabMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.33);
    for (var side = -1; side <= 1; side += 2) {
      var tab = BABYLON.MeshBuilder.CreateBox('colorTab' + side, {height: 0.3, width: 0.3, depth: 0.8}, scene);
      tab.material = tabMat;
      tab.parent = body;
      tab.position.set(side * 1.05, -0.7, -0.8);
      scene.shadowGenerator.addShadowCaster(tab);
    }

    // Cable connector (back of sensor)
    var connMat = new BABYLON.StandardMaterial('colorSensorConn', scene);
    connMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.22);
    var conn = BABYLON.MeshBuilder.CreateBox('colorSensorConn', {height: 0.8, width: 0.9, depth: 0.4}, scene);
    conn.material = connMat;
    conn.parent = body;
    conn.position.set(0, 0, -1.4);

    // Create camera and RTT
    self.rttCam = new BABYLON.FreeCamera('Camera', self.position, scene, false);
    self.rttCam.fov = self.options.sensorFov;
    self.rttCam.minZ = self.options.sensorMinRange;
    self.rttCam.maxZ = self.options.sensorMaxRange;
    self.rttCam.updateUpVectorFromRotation = true;

    self.renderTarget = new BABYLON.RenderTargetTexture(
      'colorSensor',
      self.options.sensorResolution, // texture size
      scene,
      false, // generateMipMaps
      false, // doNotChangeAspectRatio
      BABYLON.Constants.TEXTURETYPE_UNSIGNED_INT,
      false,
      BABYLON.Texture.NEAREST_NEAREST
    );
    self.renderTarget.clearColor = BABYLON.Color3.Black();
    scene.customRenderTargets.push(self.renderTarget);
    self.renderTarget.activeCamera = self.rttCam;
    // self.renderTarget.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

    self.pixels = new Uint8Array(self.options.sensorResolution ** 2 * 4);
    self.waitingSync = false;

    self.renderTarget.onBeforeRender = function() {
      self.renderTarget.renderList.forEach((mesh) => {
        if (mesh.getClassName() === 'InstancedMesh') {
            return;
        }
        if (mesh.material && !mesh.isFrozen && ('isReady' in mesh) && mesh.isReady(true)) {
            const _orig_subMeshEffects = [];
            mesh.subMeshes.forEach((submesh) => {
                _orig_subMeshEffects.push([submesh.effect, submesh.materialDefines]);
            });
            mesh.isFrozen = true;
            mesh.material.freeze();
            mesh._saved_orig_material = mesh.material;
            mesh._orig_subMeshEffects = _orig_subMeshEffects;
        }
        if (!mesh._orig_subMeshEffects) {
            return;
        }

        mesh.material = mesh.rttMaterial;
        if (mesh._rtt_subMeshEffects) {
            for (let s = 0; s < mesh.subMeshes.length; ++s) {
                mesh.subMeshes[s].setEffect(...mesh._rtt_subMeshEffects[s]);
            }
        }
      });
    };
    self.renderTarget.onAfterRender = function() {
      self.renderTarget.renderList.forEach((mesh) => {
        if (mesh.getClassName() === 'InstancedMesh') {
            return;
        }
        if (!mesh._orig_subMeshEffects) {
            return;
        }
        if (!mesh._rtt_subMeshEffects) {
            mesh._rtt_subMeshEffects = [];
            mesh.subMeshes.forEach((submesh) => {
                mesh._rtt_subMeshEffects.push([submesh.effect, submesh.materialDefines]);
            });
        }

        mesh.material = mesh._saved_orig_material;
        for (let s = 0; s < mesh.subMeshes.length; ++s) {
            mesh.subMeshes[s].setEffect(...mesh._orig_subMeshEffects[s]);
        }
      });
    };

    self.buildMask();
  };

  this.loadMeshes = function(meshes) {
    meshes.forEach(function(mesh){
      if (mesh.name == 'colorSensorEye') {
        return;
      }
      self.renderTarget.renderList.push(mesh);
    });
  };

  this.setOptions = function(options) {
    self.options = {
      sensorResolution: 8,
      sensorMinRange: 0.1,
      sensorMaxRange: 5,
      sensorFov: 1.3
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    self.rttCam.position = self.eye.getAbsolutePosition();
    self.rttCam.rotationQuaternion = self.body.absoluteRotationQuaternion;
    if (babylon.engine._webGLVersion >= 2 && babylon.DISABLE_ASYNC == false) {
      self.readPixelsAsync();
    }
  };

  this.buildMask = function() {
    let r2 = (self.options.sensorResolution / 2) ** 2;
    let center = (self.options.sensorResolution - 1) / 2;
    self.mask = [];
    self.maskSize = 0;
    for (let x=0; x<self.options.sensorResolution; x++) {
      let x2 = (x-center)**2;
      for (let y=0; y<self.options.sensorResolution; y++){
        if ((x2 + (y-center)**2) < r2) {
          self.mask.push(true);
          self.maskSize++;
        } else {
          self.mask.push(false);
        }
      }
    }
  };

  this.readPixelsAsync = function() {
    let texture = self.renderTarget._texture;
    let width = self.options.sensorResolution;
    let height = self.options.sensorResolution;

    const engine = babylon.engine;

    let gl = engine._gl;
    let dummy = babylon.engine._gl.createFramebuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, dummy);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture._webGLTexture, 0);

    let readType = (texture.type !== undefined) ? engine._getWebGLTextureType(texture.type) : gl.UNSIGNED_BYTE;

    switch (readType) {
      case gl.UNSIGNED_BYTE:
        readType = gl.UNSIGNED_BYTE;
        break;
      default:
        readType = gl.FLOAT;
        break;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, self.pixels.byteLength, gl.STREAM_READ);
    gl.readPixels(0, 0, width, height, gl.RGBA, readType, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);

    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!sync) {
      return null;
    }

    gl.flush();

    self.waitingSync = true;

    return self._clientWaitAsync(sync, 0, 0).then(
      () => {
        gl.deleteSync(sync);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, buf);
        gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, self.pixels);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
        gl.deleteBuffer(buf);
        gl.bindFramebuffer(gl.FRAMEBUFFER, engine._currentFramebuffer);
        self.waitingSync = false;
      },
      () => {
        self.waitingSync = false;
      }
    );
  };

  this._clientWaitAsync = function(sync, flags = 0, interval_ms = 10) {
    let gl = babylon.engine._gl;
    return new Promise((resolve, reject) => {
      let check = () => {
        const res = gl.clientWaitSync(sync, flags, 0);
        if (res == gl.WAIT_FAILED) {
          // reject();
          resolve();
          return;
        }
        if (res == gl.TIMEOUT_EXPIRED) {
          setTimeout(check, interval_ms);
          return;
        }
        resolve();
      };

      check();
    });
  }

  this.getRGB = function() {
    var r = 0;
    var g = 0;
    var b = 0;

    // self.renderTarget.resetRefreshCounter();
    if (babylon.engine._webGLVersion < 2 || babylon.DISABLE_ASYNC) {
      self.renderTarget.readPixels(0, 0, self.pixels);
    }
    for (let i=0; i<self.pixels.length; i+=4) {
      if (self.mask[i/4]) {
        r += self.pixels[i];
        g += self.pixels[i+1];
        b += self.pixels[i+2];
      }
    }
    self.r = r;
    self.g = g;
    self.b = b;
    return [r / self.maskSize, g / self.maskSize, b / self.maskSize];
  };

  this.init();
}

// Camera sensor - renders scene from robot's perspective to a PIP overlay
function CameraSensor(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'CameraSensor';
  this.port = port;
  this.options = null;
  this.active = false;
  this.frameCounter = 0;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    // Invisible physics container
    var body = BABYLON.MeshBuilder.CreateBox('cameraSensorBody', {height: 2, width: 2.5, depth: 2.5}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;

    body.position.z -= 1.25;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    body.parent = parent;

    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);

    // Camera housing (dark enclosure)
    var housingMat = new BABYLON.StandardMaterial('cameraSensorHousing', scene);
    housingMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.22);
    housingMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    var housing = BABYLON.MeshBuilder.CreateBox('cameraSensorHousingMesh', {height: 1.8, width: 2.3, depth: 2.2}, scene);
    housing.material = housingMat;
    housing.parent = body;
    housing.position.set(0, 0, -0.1);
    scene.shadowGenerator.addShadowCaster(housing);

    // Lens barrel (cylinder protruding from front)
    var lensMat = new BABYLON.StandardMaterial('cameraSensorLens', scene);
    lensMat.diffuseColor = new BABYLON.Color3(0.12, 0.12, 0.15);
    lensMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    var lens = BABYLON.MeshBuilder.CreateCylinder('cameraSensorLens', {height: 0.8, diameter: 1.4, tessellation: 16}, scene);
    lens.material = lensMat;
    lens.rotation.x = -Math.PI / 2;
    lens.position.set(0, 0, 1.2);
    lens.parent = body;
    scene.shadowGenerator.addShadowCaster(lens);

    // Lens glass (blue tinted front element)
    var glassMat = new BABYLON.StandardMaterial('cameraSensorGlass', scene);
    glassMat.diffuseColor = new BABYLON.Color3(0.1, 0.15, 0.3);
    glassMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    glassMat.emissiveColor = new BABYLON.Color3(0.02, 0.04, 0.1);
    glassMat.alpha = 0.85;
    self.glass = BABYLON.MeshBuilder.CreateCylinder('cameraSensorGlass', {height: 0.1, diameter: 1.2, tessellation: 16}, scene);
    self.glass.material = glassMat;
    self.glass.rotation.x = -Math.PI / 2;
    self.glass.position.set(0, 0, 1.6);
    self.glass.parent = body;

    // Recording LED (red, glows when active)
    var ledMat = new BABYLON.StandardMaterial('cameraSensorLED', scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.3, 0.0, 0.0);
    ledMat.emissiveColor = new BABYLON.Color3(0.1, 0.0, 0.0);
    self.led = BABYLON.MeshBuilder.CreateCylinder('cameraSensorLED', {height: 0.1, diameter: 0.2, tessellation: 8}, scene);
    self.led.material = ledMat;
    self.led.rotation.x = Math.PI / 2;
    self.led.parent = body;
    self.led.position.set(0.8, 0.7, 0.5);
    self.ledMat = ledMat;

    // Mounting bracket
    var bracketMat = new BABYLON.StandardMaterial('cameraSensorBracket', scene);
    bracketMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.33);
    var bracket = BABYLON.MeshBuilder.CreateBox('cameraSensorBracket', {height: 0.3, width: 2.0, depth: 0.5}, scene);
    bracket.material = bracketMat;
    bracket.parent = body;
    bracket.position.set(0, -0.9, -0.8);
    scene.shadowGenerator.addShadowCaster(bracket);

    // Create the render camera
    self.rttCam = new BABYLON.FreeCamera('CameraSensorCam_' + port, self.position, scene, false);
    self.rttCam.fov = self.options.fov;
    self.rttCam.minZ = 0.5;
    self.rttCam.maxZ = self.options.maxRange;
    self.rttCam.updateUpVectorFromRotation = true;

    // Create render target texture
    var resWidth = self.options.resolutionWidth;
    var resHeight = self.options.resolutionHeight;
    self.renderTarget = new BABYLON.RenderTargetTexture(
      'cameraSensorRTT_' + port,
      { width: resWidth, height: resHeight },
      scene,
      false,  // generateMipMaps
      false,  // doNotChangeAspectRatio
      BABYLON.Constants.TEXTURETYPE_UNSIGNED_INT,
      false,
      BABYLON.Texture.BILINEAR_SAMPLINGMODE
    );
    self.renderTarget.clearColor = new BABYLON.Color4(0.4, 0.6, 0.9, 1.0); // sky blue background
    scene.customRenderTargets.push(self.renderTarget);
    self.renderTarget.activeCamera = self.rttCam;

    // Start with RTT disabled (not rendering until activated)
    self.renderTarget.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
    self.renderTarget.renderList = [];

    // Create PIP canvas element
    self.pipCanvas = document.createElement('canvas');
    self.pipCanvas.width = resWidth;
    self.pipCanvas.height = resHeight;
    self.pipCanvas.className = 'cameraSensorPIP';
    self.pipCanvas.style.display = 'none';
    self.pipCtx = self.pipCanvas.getContext('2d');

    // Add to simulator panel
    var simPanelEl = document.getElementById('simPanel');
    if (simPanelEl) {
      simPanelEl.appendChild(self.pipCanvas);
    }

    // Pixel buffer for reading RTT
    self.pixels = new Uint8Array(resWidth * resHeight * 4);
  };

  this.loadMeshes = function(meshes) {
    meshes.forEach(function(mesh) {
      if (mesh.name && mesh.name.indexOf('cameraSensor') === 0) return;
      self.renderTarget.renderList.push(mesh);
    });
  };

  this.setOptions = function(options) {
    self.options = {
      fov: 1.2,
      maxRange: 200,
      resolutionWidth: 160,
      resolutionHeight: 120,
      refreshInterval: 2  // render every N frames
    };

    for (var name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('CameraSensor: Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.activate = function() {
    if (self.active) return;
    self.active = true;
    self.renderTarget.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONEVERYFRAME;
    self.pipCanvas.style.display = 'block';
    // LED glow on
    self.ledMat.emissiveColor = new BABYLON.Color3(0.8, 0.0, 0.0);
    self.ledMat.diffuseColor = new BABYLON.Color3(0.9, 0.1, 0.1);
  };

  this.deactivate = function() {
    if (!self.active) return;
    self.active = false;
    self.renderTarget.refreshRate = BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
    self.pipCanvas.style.display = 'none';
    // LED glow off
    self.ledMat.emissiveColor = new BABYLON.Color3(0.1, 0.0, 0.0);
    self.ledMat.diffuseColor = new BABYLON.Color3(0.3, 0.0, 0.0);
  };

  this.render = function(delta) {
    // Update camera position/rotation to match the sensor body
    self.rttCam.position = self.glass.getAbsolutePosition();
    self.rttCam.rotationQuaternion = self.body.absoluteRotationQuaternion;

    // Sync RTT background with scene sky color
    if (scene.clearColor) {
      self.renderTarget.clearColor = scene.clearColor;
    }

    if (!self.active) return;

    // Throttle PIP updates based on refreshInterval
    self.frameCounter++;
    if (self.frameCounter % self.options.refreshInterval !== 0) return;

    // Read pixels from RTT and draw to PIP canvas
    self.renderTarget.readPixels(0, 0, self.pixels);
    var imageData = self.pipCtx.createImageData(self.options.resolutionWidth, self.options.resolutionHeight);

    // RTT pixels are bottom-up, flip vertically
    var w = self.options.resolutionWidth;
    var h = self.options.resolutionHeight;
    for (var y = 0; y < h; y++) {
      var srcRow = (h - 1 - y) * w * 4;
      var dstRow = y * w * 4;
      for (var x = 0; x < w * 4; x++) {
        imageData.data[dstRow + x] = self.pixels[srcRow + x];
      }
    }
    self.pipCtx.putImageData(imageData, 0, 0);
  };

  this.reset = function() {
    self.deactivate();
  };

  this.init();
}

// Just a dumb box with physics
function BoxBlock(scene, parent, pos, rot, options) {
  var self = this;

  this.type = 'Box';
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    var bodyMat = babylon.getMaterial(scene, self.options.color);

    let VALID_IMAGETYPES = ['top','front','repeat','all','cylinder','sphere'];
    if (VALID_IMAGETYPES.indexOf(self.options.imageType) != -1 && self.options.imageURL != '') {
      bodyMat = new BABYLON.StandardMaterial('imageObject' + self.options.imageURL, scene);
      var texture = new BABYLON.Texture(self.options.imageURL, scene);
      bodyMat.diffuseTexture = texture;
      bodyMat.diffuseTexture.uScale = self.options.uScale;
      bodyMat.diffuseTexture.vScale = self.options.vScale;
      bodyMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    }

    var faceUV = new Array(6);
    for (var i = 0; i < 6; i++) {
      faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
    }

    if (self.options.imageType == 'top') {
      faceUV[4] = new BABYLON.Vector4(0, 0, 1, 1);
    } else if (self.options.imageType == 'front') {
      faceUV[1] = new BABYLON.Vector4(0, 0, 1, 1);
    } else if (self.options.imageType == 'repeat') {
      for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(0, 0, 1, 1);
      }
    } else if (self.options.imageType == 'all') {
      faceUV[0] = new BABYLON.Vector4(0,   0,   1/3, 1/2);
      faceUV[1] = new BABYLON.Vector4(1/3, 0,   2/3, 1/2);
      faceUV[2] = new BABYLON.Vector4(2/3, 0,   1,   1/2);
      faceUV[3] = new BABYLON.Vector4(0,   1/2, 1/3, 1);
      faceUV[4] = new BABYLON.Vector4(1/3, 1/2, 2/3, 1);
      faceUV[5] = new BABYLON.Vector4(2/3, 1/2, 1,   1);
    }

    let bodyOptions = {
      height: self.options.height,
      width: self.options.width,
      depth: self.options.depth,
      faceUV: faceUV,
      wrap: true,
    };
    var body = BABYLON.MeshBuilder.CreateBox('boxBody', bodyOptions, scene);
    self.body = body;
    body.component = self;
    body.material = bodyMat;
    scene.shadowGenerator.addShadowCaster(body);

    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 1,
        restitution: 0.4,
        friction: 0.1
      },
      scene
    );
    body.parent = parent;

    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
  };

  this.setOptions = function(options) {
    self.options = {
      height: 1,
      width: 1,
      depth: 1,
      color: '4A90D9',
      imageType: 'repeat',
      imageURL: '',
      uScale: 1,
      vScale: 1
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.init();
}

// Just a dumb cylinder with physics
function CylinderBlock(scene, parent, pos, rot, options) {
  var self = this;

  this.type = 'Cylinder';
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    var bodyMat = babylon.getMaterial(scene, self.options.color);

    let VALID_IMAGETYPES = ['top','front','repeat','all','cylinder','sphere'];
    if (VALID_IMAGETYPES.indexOf(self.options.imageType) != -1 && self.options.imageURL != '') {
      bodyMat = new BABYLON.StandardMaterial('imageObject' + self.options.imageURL, scene);
      var texture = new BABYLON.Texture(self.options.imageURL, scene);
      bodyMat.diffuseTexture = texture;
      bodyMat.diffuseTexture.uScale = self.options.uScale;
      bodyMat.diffuseTexture.vScale = self.options.vScale;
      bodyMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    }

    let bodyOptions = {
      height: self.options.height,
      diameter: self.options.diameter
    };

    if (self.options.imageType == 'cylinder') {
      var faceUV = new Array(3);
      faceUV[0] = new BABYLON.Vector4(0,   0,   1/4, 1);
      faceUV[1] = new BABYLON.Vector4(3/4, 0,   1/4, 1);
      faceUV[2] = new BABYLON.Vector4(3/4, 0,   1,   1);
      bodyOptions.faceUV = faceUV;
    }

    var body = BABYLON.MeshBuilder.CreateCylinder('cylinderBody', bodyOptions, scene);
    self.body = body;
    body.component = self;
    body.material = bodyMat;
    scene.shadowGenerator.addShadowCaster(body);

    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.CylinderImpostor,
      {
        mass: 1,
        restitution: 0.4,
        friction: 0.1
      },
      scene
    );
    body.parent = parent;

    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
  };

  this.setOptions = function(options) {
    self.options = {
      height: 1,
      diameter: 1,
      color: 'D94A4A',
      imageType: 'cylinder',
      imageURL: '',
      uScale: 1,
      vScale: 1
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.init();
}

// Just a dumb sphere with physics
function SphereBlock(scene, parent, pos, rot, options) {
  var self = this;

  this.type = 'Sphere';
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    var bodyMat = babylon.getMaterial(scene, self.options.color);

    let VALID_IMAGETYPES = ['top','front','repeat','all','cylinder','sphere'];
    if (VALID_IMAGETYPES.indexOf(self.options.imageType) != -1 && self.options.imageURL != '') {
      bodyMat = new BABYLON.StandardMaterial('imageObject' + self.options.imageURL, scene);
      var texture = new BABYLON.Texture(self.options.imageURL, scene);
      bodyMat.diffuseTexture = texture;
      bodyMat.diffuseTexture.uScale = self.options.uScale;
      bodyMat.diffuseTexture.vScale = self.options.vScale;
      bodyMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    }

    let bodyOptions = {
      diameter: self.options.diameter
    };
    var body = BABYLON.MeshBuilder.CreateSphere('sphereBody', bodyOptions, scene);
    self.body = body;
    body.component = self;
    body.material = bodyMat;
    scene.shadowGenerator.addShadowCaster(body);

    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {
        mass: 1,
        restitution: 0.4,
        friction: 0.1
      },
      scene
    );
    body.parent = parent;

    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
  };

  this.setOptions = function(options) {
    self.options = {
      diameter: 1,
      color: 'E8A838',
      imageType: 'sphere',
      imageURL: '',
      uScale: 1,
      vScale: 1
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.init();
}

// Just a dumb cone with physics
function ConeBlock(scene, parent, pos, rot, options) {
  var self = this;

  this.type = 'Cone';
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    var bodyMat = babylon.getMaterial(scene, self.options.color);

    let VALID_IMAGETYPES = ['top','front','repeat','all','cylinder','sphere'];
    if (VALID_IMAGETYPES.indexOf(self.options.imageType) != -1 && self.options.imageURL != '') {
      bodyMat = new BABYLON.StandardMaterial('imageObject' + self.options.imageURL, scene);
      var texture = new BABYLON.Texture(self.options.imageURL, scene);
      bodyMat.diffuseTexture = texture;
      bodyMat.diffuseTexture.uScale = self.options.uScale;
      bodyMat.diffuseTexture.vScale = self.options.vScale;
      bodyMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    }

    let bodyOptions = {
      height: self.options.height,
      diameterTop: 0,
      diameterBottom: self.options.diameter,
      tessellation: 16
    };
    var body = BABYLON.MeshBuilder.CreateCylinder('coneBody', bodyOptions, scene);
    self.body = body;
    body.component = self;
    body.material = bodyMat;
    scene.shadowGenerator.addShadowCaster(body);

    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.CylinderImpostor,
      {
        mass: 1,
        restitution: 0.4,
        friction: 0.1
      },
      scene
    );
    body.parent = parent;

    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
  };

  this.setOptions = function(options) {
    self.options = {
      height: 2,
      diameter: 1,
      color: '7B4AD9',
      imageType: 'cylinder',
      imageURL: '',
      uScale: 1,
      vScale: 1
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.init();
}

// Just a dumb torus with physics
function TorusBlock(scene, parent, pos, rot, options) {
  var self = this;

  this.type = 'Torus';
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    var bodyMat = babylon.getMaterial(scene, self.options.color);

    let VALID_IMAGETYPES = ['top','front','repeat','all','cylinder','sphere'];
    if (VALID_IMAGETYPES.indexOf(self.options.imageType) != -1 && self.options.imageURL != '') {
      bodyMat = new BABYLON.StandardMaterial('imageObject' + self.options.imageURL, scene);
      var texture = new BABYLON.Texture(self.options.imageURL, scene);
      bodyMat.diffuseTexture = texture;
      bodyMat.diffuseTexture.uScale = self.options.uScale;
      bodyMat.diffuseTexture.vScale = self.options.vScale;
      bodyMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    }

    let bodyOptions = {
      diameter: self.options.diameter,
      thickness: self.options.thickness,
      tessellation: 24
    };
    var body = BABYLON.MeshBuilder.CreateTorus('torusBody', bodyOptions, scene);
    self.body = body;
    body.component = self;
    body.material = bodyMat;
    scene.shadowGenerator.addShadowCaster(body);

    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.CylinderImpostor,
      {
        mass: 1,
        restitution: 0.4,
        friction: 0.1
      },
      scene
    );
    body.parent = parent;

    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
  };

  this.setOptions = function(options) {
    self.options = {
      diameter: 2,
      thickness: 0.5,
      color: '3DC9A8',
      imageType: 'sphere',
      imageURL: '',
      uScale: 1,
      vScale: 1
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.init();
}

// Ultrasonic distance sensor
function UltrasonicSensor(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'UltrasonicSensor';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    // Invisible physics container (same dimensions)
    var body = BABYLON.MeshBuilder.CreateBox('ultrasonicSensorBody', {height: 2, width: 5, depth: 2.5}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;
    body.parent = parent;
    body.position = self.position;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)

    // Check if we should use realistic 3D model or procedural geometry
    if (self.options.useRealisticModel && self.options.realisticModelURL) {
      // Load realistic GLB model
      var modelUrl = self.options.realisticModelURL;
      var urlForExt = modelUrl.split('#')[0];
      var pluginExt = urlForExt.substring(urlForExt.lastIndexOf('.')).toLowerCase();
      BABYLON.SceneLoader.ImportMeshAsync(null, '', modelUrl, scene, null, pluginExt).then(function(results) {
        var meshes = results.meshes;
        // Find and handle all meshes
        meshes.forEach(function(m, index) {
          // Disable any physics/collision on loaded meshes
          if (m.physicsImpostor) {
            m.physicsImpostor.dispose();
            m.physicsImpostor = null;
          }
          m.checkCollisions = false;
          m.ultrasonicDetection = 'invisible';
          m.laserDetection = 'invisible';

          // Parent all orphan root meshes to meshes[0], or dispose if not needed
          if (index > 0 && !m.parent) {
            m.parent = meshes[0];
          }
        });
        // Scale the root (12 = base size to match procedural model)
        meshes[0].scaling.setAll(12);
        meshes[0].parent = body;
        // Apply rotation (180° on Y axis)
        meshes[0].rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);
        // Adjust position to align with procedural model origin
        meshes[0].position.z = -3;
        self.model = meshes[0];
      }).catch(function(err) {
        console.log('Failed to load realistic ultrasonic model:', err);
      });
    } else {
      // Use procedural geometry (original design)
      // Main housing (dark blue-gray enclosure)
      var housingMat = new BABYLON.StandardMaterial('ultrasonicHousing', scene);
      housingMat.diffuseColor = new BABYLON.Color3(0.2, 0.22, 0.3);
      housingMat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.2);
      var housing = BABYLON.MeshBuilder.CreateBox('ultrasonicHousingMesh', {height: 1.8, width: 4.8, depth: 1.8}, scene);
      housing.material = housingMat;
      housing.parent = body;
      housing.position.z = -0.2;
      scene.shadowGenerator.addShadowCaster(housing);

      // Front plate (lighter face where transducers mount)
      var faceMat = new BABYLON.StandardMaterial('ultrasonicFace', scene);
      faceMat.diffuseColor = new BABYLON.Color3(0.32, 0.34, 0.4);
      var face = BABYLON.MeshBuilder.CreateBox('ultrasonicFace', {height: 1.6, width: 4.6, depth: 0.2}, scene);
      face.material = faceMat;
      face.parent = body;
      face.position.z = 0.7;
      scene.shadowGenerator.addShadowCaster(face);

      // Transducer housings (metallic cylinders - keep at same positions for ray alignment)
      var transducerMat = new BABYLON.StandardMaterial('ultrasonicTransducer', scene);
      transducerMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.62);
      transducerMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);

      // Left transducer (transmitter)
      var transL = BABYLON.MeshBuilder.CreateCylinder('ultraTransL', {height: 0.7, diameter: 1.9, tessellation: 16}, scene);
      transL.material = transducerMat;
      transL.rotation.x = -Math.PI / 2;
      transL.position.set(-1.5, 0, 1);
      transL.parent = body;
      scene.shadowGenerator.addShadowCaster(transL);

      // Left transducer cone (inner mesh pattern)
      var coneMat = new BABYLON.StandardMaterial('ultrasonicCone', scene);
      coneMat.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.38);
      var coneL = BABYLON.MeshBuilder.CreateCylinder('ultraConeL', {height: 0.15, diameterTop: 1.5, diameterBottom: 1.0, tessellation: 16}, scene);
      coneL.material = coneMat;
      coneL.rotation.x = -Math.PI / 2;
      coneL.position.set(-1.5, 0, 1.35);
      coneL.parent = body;

      // Right transducer (receiver)
      var transR = BABYLON.MeshBuilder.CreateCylinder('ultraTransR', {height: 0.7, diameter: 1.9, tessellation: 16}, scene);
      transR.material = transducerMat;
      transR.rotation.x = -Math.PI / 2;
      transR.position.set(1.5, 0, 1);
      transR.parent = body;
      scene.shadowGenerator.addShadowCaster(transR);

      // Right transducer cone
      var coneR = BABYLON.MeshBuilder.CreateCylinder('ultraConeR', {height: 0.15, diameterTop: 1.5, diameterBottom: 1.0, tessellation: 16}, scene);
      coneR.material = coneMat;
      coneR.rotation.x = -Math.PI / 2;
      coneR.position.set(1.5, 0, 1.35);
      coneR.parent = body;

      // PCB board visible between transducers
      var pcbMat = new BABYLON.StandardMaterial('ultrasonicPCB', scene);
      pcbMat.diffuseColor = new BABYLON.Color3(0.1, 0.4, 0.2);
      var pcb = BABYLON.MeshBuilder.CreateBox('ultrasonicPCB', {height: 0.8, width: 1.2, depth: 0.15}, scene);
      pcb.material = pcbMat;
      pcb.parent = body;
      pcb.position.set(0, -0.3, 0.65);

      // Small IC chip on PCB
      var chipMat = new BABYLON.StandardMaterial('ultrasonicChip', scene);
      chipMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.12);
      var chip = BABYLON.MeshBuilder.CreateBox('ultrasonicChip', {height: 0.3, width: 0.5, depth: 0.1}, scene);
      chip.material = chipMat;
      chip.parent = body;
      chip.position.set(0, -0.3, 0.73);

      // Connector pins on rear
      var pinMat = new BABYLON.StandardMaterial('ultrasonicPins', scene);
      pinMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.78);
      pinMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
      for (var i = 0; i < 4; i++) {
        var pin = BABYLON.MeshBuilder.CreateBox('ultraPin' + i, {height: 0.6, width: 0.1, depth: 0.08}, scene);
        pin.material = pinMat;
        pin.parent = body;
        pin.position.set(-0.6 + i * 0.4, -0.6, -1.05);
      }

      // Status LED
      var ledMat = new BABYLON.StandardMaterial('ultrasonicLED', scene);
      ledMat.diffuseColor = new BABYLON.Color3(0.1, 0.6, 0.9);
      ledMat.emissiveColor = new BABYLON.Color3(0.05, 0.2, 0.4);
      var led = BABYLON.MeshBuilder.CreateCylinder('ultrasonicLED', {height: 0.1, diameter: 0.2, tessellation: 8}, scene);
      led.material = ledMat;
      led.rotation.x = Math.PI / 2;
      led.parent = body;
      led.position.set(0, 0.6, 0.75);
    }

    // Prep rays
    self.rays = [];
    self.rayVectors = [];
    var straightVector = new BABYLON.Vector3(0,0,1);
    let origin = new BABYLON.Vector3(0,0,0);

    self.options.rayRotations.forEach(function(rayRotation){
      var matrixX = BABYLON.Matrix.RotationAxis(BABYLON.Axis.X, rayRotation[0]);
      var matrixY = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, rayRotation[1]);
      var vec = BABYLON.Vector3.TransformCoordinates(straightVector, matrixX);
      vec = BABYLON.Vector3.TransformCoordinates(vec, matrixY);

      self.rayVectors.push(vec);
      var ray = new BABYLON.Ray(origin, new BABYLON.Vector3(0,0,1), self.options.rayLength);
      self.rays.push(ray);

      // BABYLON.RayHelper.CreateAndShow(ray, scene, new BABYLON.Color3(1, 1, 1));
    });
  };

  this.setOptions = function(options) {
    self.options = {
      rayOrigin:  new BABYLON.Vector3(0,0,1.25),
      rayRotations: [
        [-0.035, -0.305], [-0.035, -0.183], [-0.035, -0.061], [-0.035, 0.061], [-0.035, 0.183], [-0.035, 0.305],
        [0, -0.367], [0, -0.244], [0, -0.122], [-0.035,0], [0, 0], [0.035,0], [0, 0.122], [0, 0.244], [0, 0.367],
        [0.035, -0.305], [0.035, -0.183], [0.035, -0.061], [0.035, 0.061], [0.035, 0.183], [0.035, 0.305]
      ],
      rayLength: 255,
      rayIncidentLimit: 0.698132,
      useRealisticModel: false,
      realisticModelURL: '',
      realisticModelScale: 5,
      realisticModelRotation: [0, -180, 0]
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.filterRay = function(mesh) {
    if (mesh.isPickable == false) {
      return false;
    }
    if (mesh.ultrasonicDetection == 'invisible') {
      return false;
    }
    return true;
  };

  this.getDistance = function() {
    var shortestDistance = self.options.rayLength;

    var rayOffset = new BABYLON.Vector3(0,0,0);
    self.options.rayOrigin.rotateByQuaternionToRef(self.body.absoluteRotationQuaternion, rayOffset);
    self.rays[0].origin.copyFrom(self.body.absolutePosition);
    self.rays[0].origin.addInPlace(rayOffset);

    self.rayVectors.forEach(function(rayVector, i){
      rayVector.rotateByQuaternionToRef(self.body.absoluteRotationQuaternion, self.rays[i].direction);

      var hit = scene.pickWithRay(self.rays[i], self.filterRay);
      if (hit.hit == false || hit.pickedMesh.ultrasonicDetection == 'absorb') {
        return;
      }
      if (hit.distance < shortestDistance) {
        let hitVector = hit.getNormal(true);
        if (hitVector) {
          var incidentAngle = Math.abs(BABYLON.Vector3.Dot(hitVector, self.rays[i].direction));
          if (incidentAngle > self.options.rayIncidentLimit && incidentAngle < (Math.PI - self.options.rayIncidentLimit)) {
            shortestDistance = hit.distance;
          }
        }
      }
    });

    return shortestDistance;
  };

  this.init();
}

// Gyro sensor
function GyroSensor(scene, parent, pos, port, options) {
  var self = this;

  this.type = 'GyroSensor';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.yawRotation = {
    angularVelocity: 0,
    actualRotation: 0,
    rotationRounds: 0,
    rotationAdjustment: 0
  };
  this.pitchRotation = {
    angularVelocity: 0,
    actualRotation: 0,
    rotationRounds: 0,
    rotationAdjustment: 0
  };
  this.rollRotation = {
    angularVelocity: 0,
    actualRotation: 0,
    rotationRounds: 0,
    rotationAdjustment: 0
  };
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(0, 0, 0);
  this.UP = new BABYLON.Vector3(0,1,0);
  this.RIGHT = new BABYLON.Vector3(1,0,0);
  this.FORWARD = new BABYLON.Vector3(0,0,1);
  this.s1 = new BABYLON.Vector3(0,0,1);
  this.s2 = new BABYLON.Vector3(1,0,0);
  this.origin = new BABYLON.Vector3(0,0,0);

  this.init = function() {
    self.setOptions(options);

    // Main body - invisible physics container
    var body = BABYLON.MeshBuilder.CreateBox('gyroSensorBody', {height: 1, width: 2, depth: 2}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;
    body.parent = parent;
    body.position = self.position;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );

    // PCB board (green)
    var pcbMat = new BABYLON.StandardMaterial('gyroPCB', scene);
    pcbMat.diffuseColor = new BABYLON.Color3(0.1, 0.45, 0.2);
    pcbMat.specularColor = new BABYLON.Color3(0.1, 0.2, 0.1);
    var pcb = BABYLON.MeshBuilder.CreateBox('gyroPCBBoard', {height: 0.3, width: 1.9, depth: 1.9}, scene);
    pcb.material = pcbMat;
    pcb.parent = body;
    pcb.position.y = -0.15;
    scene.shadowGenerator.addShadowCaster(pcb);

    // IC chip (dark gray/black package)
    var chipMat = new BABYLON.StandardMaterial('gyroChip', scene);
    chipMat.diffuseColor = new BABYLON.Color3(0.12, 0.12, 0.14);
    chipMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    var chip = BABYLON.MeshBuilder.CreateBox('gyroChipBody', {height: 0.35, width: 1.2, depth: 1.2}, scene);
    chip.material = chipMat;
    chip.parent = body;
    chip.position.y = 0.15;
    scene.shadowGenerator.addShadowCaster(chip);

    // Chip orientation dot (white circle on corner)
    var dotMat = new BABYLON.StandardMaterial('gyroDot', scene);
    dotMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    dotMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    var dot = BABYLON.MeshBuilder.CreateCylinder('gyroDot', {height: 0.05, diameter: 0.2, tessellation: 8}, scene);
    dot.material = dotMat;
    dot.parent = body;
    dot.position.set(-0.45, 0.34, -0.45);

    // Chip label text line (small silver rectangle)
    var labelMat = new BABYLON.StandardMaterial('gyroLabel', scene);
    labelMat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.72);
    var label = BABYLON.MeshBuilder.CreateBox('gyroLabel', {height: 0.02, width: 0.6, depth: 0.15}, scene);
    label.material = labelMat;
    label.parent = body;
    label.position.set(0.1, 0.33, 0);

    // Connector pins (silver) along one edge
    var pinMat = new BABYLON.StandardMaterial('gyroPins', scene);
    pinMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.78);
    pinMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    for (var i = 0; i < 4; i++) {
      var pin = BABYLON.MeshBuilder.CreateBox('gyroPin' + i, {height: 0.5, width: 0.12, depth: 0.08}, scene);
      pin.material = pinMat;
      pin.parent = body;
      pin.position.set(-0.6 + i * 0.4, 0, -0.95);
      scene.shadowGenerator.addShadowCaster(pin);
    }

    // Small capacitor (tan cylinder on PCB)
    var capMat = new BABYLON.StandardMaterial('gyroCap', scene);
    capMat.diffuseColor = new BABYLON.Color3(0.76, 0.6, 0.42);
    var cap = BABYLON.MeshBuilder.CreateCylinder('gyroCap', {height: 0.3, diameter: 0.25, tessellation: 8}, scene);
    cap.material = capMat;
    cap.parent = body;
    cap.position.set(0.7, 0.12, 0.6);
    scene.shadowGenerator.addShadowCaster(cap);

    // Small resistor (dark rectangle on PCB)
    var resMat = new BABYLON.StandardMaterial('gyroRes', scene);
    resMat.diffuseColor = new BABYLON.Color3(0.2, 0.18, 0.15);
    var res = BABYLON.MeshBuilder.CreateBox('gyroRes', {height: 0.15, width: 0.3, depth: 0.15}, scene);
    res.material = resMat;
    res.parent = body;
    res.position.set(-0.65, 0.08, 0.55);
  };

  this.setOptions = function(options) {
    self.options = {
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    self.updateRotation(delta);
  };

  this.updateRotation = function(delta) {
    let e = new BABYLON.Vector3(0,0,0);

    function calculateActualAndVelocity(rot, rotationObj) {
      if (! isNaN(rot)) {
        if (rot - rotationObj.prevRotation > 180) {
          rotationObj.rotationRounds -= 1;
        } else if (rot - rotationObj.prevRotation < -180) {
          rotationObj.rotationRounds += 1;
        }
        rotationObj.prevRotation = rot;

        let rotation = rotationObj.rotationRounds * 360 + rot;
        if (delta > 0) {
          rotationObj.angularVelocity = 0.8 * rotationObj.angularVelocity + 0.2 * ((rotation - rotationObj.actualRotation) / delta * 1000);
        }
        rotationObj.actualRotation = rotation;
      }
    }

    // Yaw
    self.s1.rotateByQuaternionAroundPointToRef(self.body.absoluteRotationQuaternion, self.origin, e);
    let ey = e.y;
    e.y = 0;
    let rot = BABYLON.Vector3.GetAngleBetweenVectors(self.s1, e, self.UP) / Math.PI * 180;
    calculateActualAndVelocity(rot, self.yawRotation);

    // Pitch
    e.y = ey;
    e.x = 0;
    e.z = Math.sqrt(1 - e.y**2);
    rot = BABYLON.Vector3.GetAngleBetweenVectors(self.s1, e, self.RIGHT) / Math.PI * -180;
    calculateActualAndVelocity(rot, self.pitchRotation);

    // Roll
    self.s2.rotateByQuaternionAroundPointToRef(self.body.absoluteRotationQuaternion, self.origin, e);
    e.x = Math.sqrt(1 - e.y**2);
    e.z = 0;
    rot = BABYLON.Vector3.GetAngleBetweenVectors(self.s2, e, self.FORWARD) / Math.PI * -180;
    calculateActualAndVelocity(rot, self.rollRotation);
  };

  this.reset = function() {
    self.yawRotation.rotationAdjustment = self.yawRotation.actualRotation;
    self.pitchRotation.rotationAdjustment = self.pitchRotation.actualRotation;
    self.rollRotation.rotationAdjustment = self.rollRotation.actualRotation;
  };

  this.getYawAngle = function() {
    return self.yawRotation.actualRotation - self.yawRotation.rotationAdjustment;
  };

  this.getYawRate = function() {
    return self.yawRotation.angularVelocity;
  };

  this.getPitchAngle = function() {
    return self.pitchRotation.actualRotation - self.pitchRotation.rotationAdjustment;
  };

  this.getPitchRate = function() {
    return self.pitchRotation.angularVelocity;
  };

  this.getRollAngle = function() {
    return self.rollRotation.actualRotation - self.rollRotation.rotationAdjustment;
  };

  this.getRollRate = function() {
    return self.rollRotation.angularVelocity;
  };

  this.init();
}

// GPS sensor
function GPSSensor(scene, parent, pos, port, options) {
  var self = this;

  this.type = 'GPSSensor';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(0, 0, 0);

  this.init = function() {
    self.setOptions(options);

    // Main body - invisible physics container
    var body = BABYLON.MeshBuilder.CreateBox('gpsSensorBody', {height: 1, width: 2, depth: 2}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;
    body.parent = parent;
    body.position = self.position;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );

    // PCB board (blue-green)
    var pcbMat = new BABYLON.StandardMaterial('gpsPCB', scene);
    pcbMat.diffuseColor = new BABYLON.Color3(0.08, 0.3, 0.45);
    pcbMat.specularColor = new BABYLON.Color3(0.1, 0.15, 0.2);
    var pcb = BABYLON.MeshBuilder.CreateBox('gpsPCBBoard', {height: 0.25, width: 1.9, depth: 1.9}, scene);
    pcb.material = pcbMat;
    pcb.parent = body;
    pcb.position.y = -0.2;
    scene.shadowGenerator.addShadowCaster(pcb);

    // Ceramic patch antenna (tan/white square on top)
    var antennaMat = new BABYLON.StandardMaterial('gpsAntenna', scene);
    antennaMat.diffuseColor = new BABYLON.Color3(0.85, 0.78, 0.65);
    antennaMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    var antenna = BABYLON.MeshBuilder.CreateBox('gpsAntennaBody', {height: 0.4, width: 1.4, depth: 1.4}, scene);
    antenna.material = antennaMat;
    antenna.parent = body;
    antenna.position.set(0, 0.15, 0);
    scene.shadowGenerator.addShadowCaster(antenna);

    // Antenna center pad (metallic square)
    var padMat = new BABYLON.StandardMaterial('gpsPad', scene);
    padMat.diffuseColor = new BABYLON.Color3(0.72, 0.72, 0.74);
    padMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    var pad = BABYLON.MeshBuilder.CreateBox('gpsAntennaPad', {height: 0.02, width: 0.9, depth: 0.9}, scene);
    pad.material = padMat;
    pad.parent = body;
    pad.position.set(0, 0.36, 0);

    // Small status LED (green dot)
    var ledMat = new BABYLON.StandardMaterial('gpsLED', scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    ledMat.emissiveColor = new BABYLON.Color3(0.05, 0.3, 0.05);
    var led = BABYLON.MeshBuilder.CreateCylinder('gpsLED', {height: 0.1, diameter: 0.2, tessellation: 8}, scene);
    led.material = ledMat;
    led.parent = body;
    led.position.set(0.75, -0.02, 0.75);

    // Connector pins (gold) along one edge
    var pinMat = new BABYLON.StandardMaterial('gpsPins', scene);
    pinMat.diffuseColor = new BABYLON.Color3(0.83, 0.69, 0.22);
    pinMat.specularColor = new BABYLON.Color3(0.9, 0.8, 0.4);
    for (var i = 0; i < 5; i++) {
      var pin = BABYLON.MeshBuilder.CreateBox('gpsPin' + i, {height: 0.4, width: 0.1, depth: 0.08}, scene);
      pin.material = pinMat;
      pin.parent = body;
      pin.position.set(-0.7 + i * 0.35, -0.1, -0.95);
    }

    // Small chip on PCB (black rectangle next to antenna)
    var chipMat = new BABYLON.StandardMaterial('gpsChip', scene);
    chipMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.12);
    var chip = BABYLON.MeshBuilder.CreateBox('gpsChip', {height: 0.2, width: 0.5, depth: 0.4}, scene);
    chip.material = chipMat;
    chip.parent = body;
    chip.position.set(-0.6, -0.02, 0.6);
    scene.shadowGenerator.addShadowCaster(chip);

    // Crystal oscillator (silver can)
    var crystalMat = new BABYLON.StandardMaterial('gpsCrystal', scene);
    crystalMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.78);
    crystalMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    var crystal = BABYLON.MeshBuilder.CreateBox('gpsCrystal', {height: 0.15, width: 0.35, depth: 0.2}, scene);
    crystal.material = crystalMat;
    crystal.parent = body;
    crystal.position.set(0.65, -0.02, -0.5);
  };

  this.setOptions = function(options) {
    self.options = {
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.getPosition = function() {
    return [
      self.body.absolutePosition.x,
      self.body.absolutePosition.y,
      self.body.absolutePosition.z
    ];
  };

  this.init();
}

// Magnet
function MagnetActuator(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'MagnetActuator';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  this.power = 0;

  // Used in Python
  this.modes = {
    STOP: 1,
    RUN: 2,
    RUN_TO_POS: 3,
    RUN_TIL_TIME: 4
  };
  this.mode = this.modes.STOP;

  this.state = '';
  this.states = {
    RUNNING: 'running',
    RAMPING: 'ramping',
    HOLDING: 'holding',
    OVERLOADED: 'overloaded',
    STATE_STALLED: 'stalled',
    NONE: ''
  };

  this.speed_sp = 0;

  this.runTimed = function() {
    self.mode = self.modes.RUN_TIL_TIME;
    self.state = self.states.RUNNING;
  };

  this.runToPosition = function() {
    self.mode = self.modes.RUN_TO_POS;
    self.state = self.states.RUNNING;
  };

  this.runForever = function() {
    self.mode = self.modes.RUN;
    self.state = self.states.RUNNING;
  };

  this.stop = function() {
    self.mode = self.modes.STOP;
    self.setPower(0);
    self.state = self.states.HOLDING;
  };

  this.reset = function() {
    self.setPower(0);
    self.mode = self.modes.STOP;
    self.state = self.states.HOLDING;
  };

  // Used in JS
  this.init = function() {
    self.setOptions(options);

    // Invisible physics container (same dimensions)
    var body = BABYLON.MeshBuilder.CreateBox('magnetActuatorBody', {height: 2.5, width: 2, depth: 2}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;
    body.parent = parent;
    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)

    // Iron core (functional attractor - keep position at y = -0.75)
    var coreMat = new BABYLON.StandardMaterial('magnetCore', scene);
    coreMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.52);
    coreMat.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    var attractor = BABYLON.MeshBuilder.CreateCylinder('magnetActuatorAttractor', {height: 1, diameter: 1.6, tessellation: 12}, scene);
    self.attractor = attractor;
    attractor.material = coreMat;
    attractor.parent = body;
    attractor.position.y = -0.75;
    scene.shadowGenerator.addShadowCaster(attractor);

    // Pole face (flat bottom of the core - the contact surface)
    var poleMat = new BABYLON.StandardMaterial('magnetPole', scene);
    poleMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.63);
    poleMat.specularColor = new BABYLON.Color3(0.85, 0.85, 0.85);
    var pole = BABYLON.MeshBuilder.CreateCylinder('magnetPole', {height: 0.1, diameter: 1.7, tessellation: 12}, scene);
    pole.material = poleMat;
    pole.parent = body;
    pole.position.y = -1.2;
    scene.shadowGenerator.addShadowCaster(pole);

    // Coil winding (copper-colored torus around the core)
    var coilMat = new BABYLON.StandardMaterial('magnetCoil', scene);
    coilMat.diffuseColor = new BABYLON.Color3(0.72, 0.45, 0.2);
    coilMat.specularColor = new BABYLON.Color3(0.5, 0.35, 0.15);
    var coil = BABYLON.MeshBuilder.CreateTorus('magnetCoil', {diameter: 1.6, thickness: 0.4, tessellation: 16}, scene);
    coil.material = coilMat;
    coil.parent = body;
    coil.position.y = -0.5;
    scene.shadowGenerator.addShadowCaster(coil);

    // Second coil layer
    var coil2 = BABYLON.MeshBuilder.CreateTorus('magnetCoil2', {diameter: 1.6, thickness: 0.35, tessellation: 16}, scene);
    coil2.material = coilMat;
    coil2.parent = body;
    coil2.position.y = -0.85;
    scene.shadowGenerator.addShadowCaster(coil2);

    // Housing/yoke (dark gray enclosure around the coil)
    var yokeMat = new BABYLON.StandardMaterial('magnetYoke', scene);
    yokeMat.diffuseColor = new BABYLON.Color3(0.22, 0.22, 0.25);
    yokeMat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);
    var yoke = BABYLON.MeshBuilder.CreateBox('magnetYoke', {height: 1.6, width: 1.9, depth: 1.9}, scene);
    yoke.material = yokeMat;
    yoke.parent = body;
    yoke.position.y = 0.3;
    scene.shadowGenerator.addShadowCaster(yoke);

    // Top plate (mounting surface)
    var topMat = new BABYLON.StandardMaterial('magnetTop', scene);
    topMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.33);
    topMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    var top = BABYLON.MeshBuilder.CreateBox('magnetTop', {height: 0.15, width: 2.0, depth: 2.0}, scene);
    top.material = topMat;
    top.parent = body;
    top.position.y = 1.15;
    scene.shadowGenerator.addShadowCaster(top);

    // Wire terminals (two small posts on top)
    var termMat = new BABYLON.StandardMaterial('magnetTerminal', scene);
    termMat.diffuseColor = new BABYLON.Color3(0.83, 0.69, 0.22);
    termMat.specularColor = new BABYLON.Color3(0.9, 0.8, 0.4);
    for (var t = -1; t <= 1; t += 2) {
      var terminal = BABYLON.MeshBuilder.CreateCylinder('magnetTerm' + t, {height: 0.3, diameter: 0.2, tessellation: 8}, scene);
      terminal.material = termMat;
      terminal.parent = body;
      terminal.position.set(t * 0.5, 1.3, 0.6);
    }

    // Status LED
    var ledMat = new BABYLON.StandardMaterial('magnetLED', scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.1, 0.7, 0.1);
    ledMat.emissiveColor = new BABYLON.Color3(0.05, 0.25, 0.05);
    var led = BABYLON.MeshBuilder.CreateCylinder('magnetLED', {height: 0.08, diameter: 0.18, tessellation: 8}, scene);
    led.material = ledMat;
    led.parent = body;
    led.position.set(0, 1.24, -0.7);
  };

  this.loadImpostor = function() {
    self.body.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 0
      },
      scene
    );
  };

  this.setOptions = function(options) {
    self.options = {
      maxRange: 8,
      maxPower: 4000,
      dGain : 0.08
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    if (self.mode == self.modes.RUN) {
      self.setPower(self.speed_sp / 1050);
    } else if (self.mode == self.modes.RUN_TIL_TIME) {
      self.setPower(self.speed_sp / 1050);
      if (Date.now() > self.time_target) {
        self.stop();
      }
    } else if (self.mode == self.modes.RUN_TO_POS) {
      self.setPower(self.speed_sp / 1050);
    }
    scene.meshes.forEach(self.applyMagneticForce);
  };

  this.applyMagneticForce = function(mesh) {
    if (! mesh.isMagnetic) {
      return;
    }
    if (self.power == 0) {
      return;
    }

    let vec = self.attractor.absolutePosition.subtract(mesh.absolutePosition);
    let distance = vec.length();

    if (distance > self.options.maxRange) {
      return;
    }

    function getPhysicsParent(body) {
      let parent = body;
      while (true) {
        if (parent.parent == null) {
          return parent;
        } else {
          parent = parent.parent;
        }
      }
    }

    let meshPhysicsParent = getPhysicsParent(mesh);

    let power = 1 / distance^2 * self.power;
    if (self.power < 0){
      vec.normalize();
      meshPhysicsParent.physicsImpostor.applyForce(vec.scale(power), mesh.absolutePosition);
    }
    else{
      let meshVel = meshPhysicsParent.physicsImpostor.getLinearVelocity();

      let physicsParent = getPhysicsParent(self.body);
      let center = physicsParent.absolutePosition;
      let centerVel = physicsParent.physicsImpostor.getLinearVelocity();
      let omega = physicsParent.physicsImpostor.getAngularVelocity();
      let bodyVel = centerVel.add(BABYLON.Vector3.Cross(omega,mesh.absolutePosition.subtract(center)));

      let error = meshVel.subtract(bodyVel);

      let normalVec = vec.normalize();
      error.subtractInPlace(normalVec.scale(BABYLON.Vector3.Dot(error, normalVec)));

      let pd = error.scale(self.options.dGain);
      let pdAdded = mesh.absolutePosition.add(pd);
      let pdVec = self.attractor.absolutePosition.subtract(pdAdded);
      pdVec.normalize();

      meshPhysicsParent.physicsImpostor.applyForce(pdVec.scale(power), mesh.absolutePosition);
    }
  };

  this.setPower = function(fraction) {
    if (fraction > 1) {
      fraction = 1;
    }
    self.power = fraction * self.options.maxPower;
  };

  this.init();
}

// Motorized Arm
function ArmActuator(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'ArmActuator';
  this.port = port;
  this.options = null;

  this.components = [];

  this.bodyPosition = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  // Used in Python
  this.modes = {
    STOP: 1,
    RUN: 2,
    RUN_TO_POS: 3,
    RUN_TIL_TIME: 4
  };
  this.mode = this.modes.STOP;

  this.state = 'holding';
  this.states = {
    RUNNING: 'running',
    RAMPING: 'ramping',
    HOLDING: 'holding',
    OVERLOADED: 'overloaded',
    STATE_STALLED: 'stalled',
    NONE: ''
  };

  this.speed = 0;
  this.speed_sp = 30;
  this.position_sp = 0;
  this.position_target = 0;
  this.position = 0;
  this.prevPosition = 0;
  this.positionAdjustment = 0;
  this.prevRotation = 0;
  this.rotationRounds = 0;

  this.runTimed = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN_TIL_TIME;
    self.state = self.states.RUNNING;
  };

  this.runToPosition = function() {
    if (self.position_target < self.position) {
      self.positionDirectionReversed = true;
    } else {
      self.positionDirectionReversed = false;
    }
    self.mode = self.modes.RUN_TO_POS;
    self.state = self.states.RUNNING;
  };

  this.runForever = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN;
    self.state = self.states.RUNNING;
  };

  this.stop = function() {
    self.mode = self.modes.STOP;
    self.position_target = self.position;
    self.state = self.states.HOLDING;
  };

  this.reset = function() {
    self.positionAdjustment += self.position;
    self.position = 0;
    self.prevPosition = 0;
    self.position_target = 0;
    self.mode = self.modes.STOP;
    self.state = self.states.HOLDING;
  };

  // Used in JS
  this.init = function() {
    self.setOptions(options);

    var body = BABYLON.MeshBuilder.CreateBox('armBody', {height: 3, width: 2, depth: 3}, scene);
    self.body = body;
    body.component = self;
    body.visibility = false;
    body.parent = parent;
    body.position = self.bodyPosition;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);

    // Dark metallic servo housing material
    var armBaseMat = new BABYLON.StandardMaterial('armBaseMat', scene);
    armBaseMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.23);
    armBaseMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.45);

    var armBase = BABYLON.MeshBuilder.CreateBox('armBase', {height: 3, width: 0.5, depth: 3}, scene);
    armBase.material = armBaseMat;
    armBase.parent = body;
    armBase.position.x = -0.75;
    scene.shadowGenerator.addShadowCaster(armBase);

    var armBase2 = BABYLON.MeshBuilder.CreateBox('armBase', {height: 3, width: 0.5, depth: 3}, scene);
    armBase2.material = armBaseMat;
    armBase2.parent = body;
    armBase2.position.x = 0.75;
    scene.shadowGenerator.addShadowCaster(armBase2);

    // Motor cylinder between side panels
    var motorMat = new BABYLON.StandardMaterial('armMotor', scene);
    motorMat.diffuseColor = new BABYLON.Color3(0.28, 0.26, 0.24);
    motorMat.specularColor = new BABYLON.Color3(0.35, 0.35, 0.35);
    var motorCyl = BABYLON.MeshBuilder.CreateCylinder('armMotorCyl', {height: 1.0, diameter: 1.8, tessellation: 14}, scene);
    motorCyl.material = motorMat;
    motorCyl.rotation.z = Math.PI / 2;
    motorCyl.parent = body;
    motorCyl.position.set(0, 0.5, 0);
    scene.shadowGenerator.addShadowCaster(motorCyl);

    // Copper coil ring on motor
    var coilMat = new BABYLON.StandardMaterial('armCoil', scene);
    coilMat.diffuseColor = new BABYLON.Color3(0.72, 0.45, 0.2);
    coilMat.specularColor = new BABYLON.Color3(0.6, 0.4, 0.2);
    var coil = BABYLON.MeshBuilder.CreateTorus('armCoil', {diameter: 1.4, thickness: 0.1, tessellation: 16}, scene);
    coil.material = coilMat;
    coil.rotation.z = Math.PI / 2;
    coil.parent = body;
    coil.position.set(0, 0.5, 0);

    // Status LED (green) on left side panel
    var ledMat = new BABYLON.StandardMaterial('armLED', scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    ledMat.emissiveColor = new BABYLON.Color3(0.05, 0.3, 0.05);
    var led = BABYLON.MeshBuilder.CreateCylinder('armLED', {height: 0.1, diameter: 0.2, tessellation: 8}, scene);
    led.material = ledMat;
    led.rotation.z = Math.PI / 2;
    led.parent = body;
    led.position.set(-1.01, 1.0, 1.0);

    // Connector pins (brass) on back of housing
    var pinMat = new BABYLON.StandardMaterial('armPins', scene);
    pinMat.diffuseColor = new BABYLON.Color3(0.83, 0.69, 0.22);
    pinMat.specularColor = new BABYLON.Color3(0.9, 0.8, 0.4);
    for (var p = 0; p < 3; p++) {
      var pin = BABYLON.MeshBuilder.CreateBox('armPin' + p, {height: 0.5, width: 0.1, depth: 0.08}, scene);
      pin.material = pinMat;
      pin.parent = body;
      pin.position.set(-0.3 + p * 0.3, -1.0, -1.55);
    }

    // Metallic pivot material with specular
    var pivotMat = new BABYLON.StandardMaterial('armPivotMat', scene);
    pivotMat.diffuseColor = new BABYLON.Color3(0.45, 0.45, 0.48);
    pivotMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.65);

    var pivot = BABYLON.MeshBuilder.CreateBox('pivot', {height: 0.5, wdth: 2.4, depth: 0.5}, scene);;
    self.pivot = pivot;
    pivot.component = self;
    pivot.material = pivotMat;
    pivot.position.y = 0.5;
    scene.shadowGenerator.addShadowCaster(pivot);

    // Axle shaft through pivot point (silver metallic)
    var axleMat = new BABYLON.StandardMaterial('armAxle', scene);
    axleMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.78);
    axleMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    var axle = BABYLON.MeshBuilder.CreateCylinder('armAxle', {height: 2.2, diameter: 0.25, tessellation: 10}, scene);
    axle.material = axleMat;
    axle.rotation.z = Math.PI / 2;
    axle.parent = pivot;
    axle.position.y = 0;
    scene.shadowGenerator.addShadowCaster(axle);

    // Mounting bolts on pivot sides
    var boltMat = new BABYLON.StandardMaterial('armBolts', scene);
    boltMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.63);
    boltMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    for (var b = 0; b < 2; b++) {
      var bolt = BABYLON.MeshBuilder.CreateCylinder('armBolt' + b, {height: 0.15, diameter: 0.2, tessellation: 6}, scene);
      bolt.material = boltMat;
      bolt.rotation.z = Math.PI / 2;
      bolt.parent = pivot;
      bolt.position.set((b === 0 ? -0.6 : 0.6), 0, 0);
    }

    // Default arm material (metallic, used when no texture)
    var armMat = new BABYLON.StandardMaterial('armDefaultMat', scene);
    armMat.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.38);
    armMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.55);

    let VALID_IMAGETYPES = ['top','front','repeat','all','cylinder','sphere'];
    if (VALID_IMAGETYPES.indexOf(self.options.imageType) != -1 && self.options.imageURL != '') {
      armMat = new BABYLON.StandardMaterial('imageObject' + self.options.imageURL, scene);
      var texture = new BABYLON.Texture(self.options.imageURL, scene);
      armMat.diffuseTexture = texture;
      armMat.diffuseTexture.uScale = self.options.uScale;
      armMat.diffuseTexture.vScale = self.options.vScale;
      armMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    }

    var faceUV = new Array(6);
    for (var i = 0; i < 6; i++) {
      faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
    }

    if (self.options.imageType == 'top') {
      faceUV[4] = new BABYLON.Vector4(0, 0, 1, 1);
    } else if (self.options.imageType == 'front') {
      faceUV[1] = new BABYLON.Vector4(0, 0, 1, 1);
    } else if (self.options.imageType == 'repeat') {
      for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(0, 0, 1, 1);
      }
    } else if (self.options.imageType == 'all') {
      faceUV[0] = new BABYLON.Vector4(0,   0,   1/3, 1/2);
      faceUV[1] = new BABYLON.Vector4(1/3, 0,   2/3, 1/2);
      faceUV[2] = new BABYLON.Vector4(2/3, 0,   1,   1/2);
      faceUV[3] = new BABYLON.Vector4(0,   1/2, 1/3, 1);
      faceUV[4] = new BABYLON.Vector4(1/3, 1/2, 2/3, 1);
      faceUV[5] = new BABYLON.Vector4(2/3, 1/2, 1,   1);
    }

    let armOptions = {
      height: 1,
      width: 1,
      depth: self.options.armLength,
      faceUV: faceUV,
      wrap: true
    };

    var arm = BABYLON.MeshBuilder.CreateBox('arm', armOptions, scene);;
    self.arm = arm;
    self.end = arm;
    arm.material = armMat;
    scene.shadowGenerator.addShadowCaster(arm);
    arm.position.z += (self.options.armLength / 2) - 1;

    pivot.parent = parent;
    pivot.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    pivot.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    pivot.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);
    pivot.position = self.bodyPosition.clone();
    pivot.translate(BABYLON.Axis.Y, 0.5, BABYLON.Space.LOCAL);
    pivot.rotate(BABYLON.Axis.X, -(self.options.startAngle * Math.PI / 180), BABYLON.Space.LOCAL);
    parent.removeChild(pivot);
    arm.parent = pivot;

    self.positionAdjustment = self.options.startAngle;
  };

  this.loadImpostor = function() {
    self.body.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 0
      },
      scene
    );
    self.arm.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.arm,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 0
      },
      scene
    );
    self.pivot.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.pivot,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: self.options.mass,
        restitution: self.options.restitution,
        friction: self.options.friction
      },
      scene
    );
  };

  this.loadJoints = function() {
    let mainPivot = BABYLON.Vector3.Zero();
    mainPivot.y += 0.5;
    mainPivot.rotateByQuaternionToRef(self.body.rotationQuaternion, mainPivot);
    let connectedPivot = BABYLON.Vector3.Zero();
    let axisVec = new BABYLON.Vector3(1, 0, 0);
    axisVec.rotateByQuaternionAroundPointToRef(self.body.rotationQuaternion, BABYLON.Vector3.Zero(), axisVec);

    self.joint = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.HingeJoint, {
      mainPivot: mainPivot,
      connectedPivot: connectedPivot,
      mainAxis: axisVec,
      connectedAxis: new BABYLON.Vector3(1, 0, 0),
    });

    let targetBody = self.body;
    while (targetBody.parent) {
      mainPivot.addInPlace(targetBody.position);
      targetBody = targetBody.parent;
    }
    targetBody.physicsImpostor.addJoint(self.pivot.physicsImpostor, self.joint);
  };

  this.setOptions = function(options) {
    self.options = {
      armLength: 18,
      minAngle: -5,
      maxAngle: 180,
      startAngle: 0,
      mass: 100,
      baseColor: 'A39C0D',
      pivotColor: '808080',
      armColor: 'A3CF0D',
      imageType: 'repeat',
      imageURL: '',
      uScale: 1,
      vScale: 1,
      restitution: 0.4,
      friction: 0.1,
      components: []
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    self.position = self.getPosition();
    self.speed = 0.8 * self.speed + 0.2 * ((self.position - self.prevPosition) / delta * 1000);
    self.prevPosition = self.position;

    if (self.mode == self.modes.RUN) {
      self.setMotorSpeed();
    } else if (self.mode == self.modes.RUN_TIL_TIME) {
      self.setMotorSpeed();
      if (Date.now() > self.time_target) {
        self.stop();
      }
    } else if (self.mode == self.modes.RUN_TO_POS) {
      self.setMotorSpeed();
      if (
        (self.positionDirectionReversed == false && self.position >= self.position_target) ||
        (self.positionDirectionReversed && self.position <= self.position_target)
      ) {
        self.stop();
      }
    } else if (self.mode == self.modes.STOP) {
      self.holdPosition();
    }

    self.components.forEach(function(component) {
      if (typeof component.render == 'function') {
        component.render(delta);
      }
    });
  };

  this.setMotorSpeed = function() {
    let speed = self.speed_sp / 180 * Math.PI;
    if (self.positionDirectionReversed) {
      speed = -speed;
    }
    if (
      (speed > 0 && (self.position + self.positionAdjustment) > self.options.maxAngle)
      || (speed < 0 && (self.position + self.positionAdjustment) < self.options.minAngle)
    ) {
      self.joint.setMotor(0);
    } else {
      self.joint.setMotor(speed);
    }
  };

  this.holdPosition = function(delta) {
    const P_GAIN = 0.1;
    const MAX_POSITION_CORRECTION_SPEED = 0.5;
    let error = self.position_target - self.position;
    let speed = error * P_GAIN;

    if (speed > MAX_POSITION_CORRECTION_SPEED) {
      speed = MAX_POSITION_CORRECTION_SPEED;
    } else if (speed < -MAX_POSITION_CORRECTION_SPEED) {
      speed = -MAX_POSITION_CORRECTION_SPEED;
    }
    self.joint.setMotor(speed);
  };

  this.getPosition = function() {
    let baseVector = new BABYLON.Vector3(0, 0, 1);
    let armVector = new BABYLON.Vector3(0, 0, 1);
    let normalVector = new BABYLON.Vector3(1, 0, 0);
    let zero = BABYLON.Vector3.Zero();

    baseVector.rotateByQuaternionAroundPointToRef(self.body.absoluteRotationQuaternion, zero, baseVector);
    normalVector.rotateByQuaternionAroundPointToRef(self.body.absoluteRotationQuaternion, zero, normalVector);
    armVector.rotateByQuaternionAroundPointToRef(self.pivot.absoluteRotationQuaternion, zero, armVector);

    let rotation = -BABYLON.Vector3.GetAngleBetweenVectors(baseVector, armVector, normalVector) / Math.PI * 180;
    if (isNaN(rotation)) {
      rotation = 0;
    }
    if (rotation < -90 && self.prevRotation > 90) {
      self.rotationRounds += 1;
    } else if (rotation > 90 && self.prevRotation < -90) {
      self.rotationRounds -= 1;
    }
    self.prevRotation = rotation;

    return self.rotationRounds * 360 + rotation - self.positionAdjustment;
  };

  this.init();
}

// Claw/Gripper - two opposing jaws controlled by a single motor port
function ClawActuator(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'ClawActuator';
  this.port = port;
  this.options = null;

  this.components = [];

  this.bodyPosition = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  // Used in Python
  this.modes = {
    STOP: 1,
    RUN: 2,
    RUN_TO_POS: 3,
    RUN_TIL_TIME: 4
  };
  this.mode = this.modes.STOP;

  this.state = 'holding';
  this.states = {
    RUNNING: 'running',
    RAMPING: 'ramping',
    HOLDING: 'holding',
    OVERLOADED: 'overloaded',
    STATE_STALLED: 'stalled',
    NONE: ''
  };

  this.speed = 0;
  this.speed_sp = 30;
  this.position_sp = 0;
  this.position_target = 0;
  this.position = 0;
  this.prevPosition = 0;
  this.positionAdjustment = 0;
  this.prevRotation = 0;
  this.rotationRounds = 0;

  // Grip state
  this.grippedMesh = null;
  this.gripLocalOffset = null;
  this.grippedOriginalImpostorType = null;
  this.grippedOriginalMass = null;
  this.grippedOriginalFriction = null;
  this.grippedOriginalRestitution = null;
  this.magneticMeshes = [];
  this.wasOpenSinceLastGrip = true; // Must open gripper before it can grab

  this.runTimed = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN_TIL_TIME;
    self.state = self.states.RUNNING;
  };

  this.runToPosition = function() {
    if (self.position_target < self.position) {
      self.positionDirectionReversed = true;
    } else {
      self.positionDirectionReversed = false;
    }
    self.mode = self.modes.RUN_TO_POS;
    self.state = self.states.RUNNING;
  };

  this.runForever = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN;
    self.state = self.states.RUNNING;
  };

  this.stop = function() {
    self.mode = self.modes.STOP;
    self.position_target = self.position;
    self.state = self.states.HOLDING;
  };

  this.reset = function() {
    self.positionAdjustment += self.position;
    self.position = 0;
    self.prevPosition = 0;
    self.position_target = 0;
    self.mode = self.modes.STOP;
    self.state = self.states.HOLDING;
  };

  this.init = function() {
    self.setOptions(options);

    // Invisible anchor body
    var body = BABYLON.MeshBuilder.CreateBox('clawBody', {height: 2, width: 3, depth: 2}, scene);
    self.body = body;
    body.component = self;
    body.visibility = false;
    body.parent = parent;
    body.position = self.bodyPosition;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);

    // Dark metallic housing
    var housingMat = new BABYLON.StandardMaterial('clawHousingMat', scene);
    housingMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.23);
    housingMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.45);

    var housing = BABYLON.MeshBuilder.CreateBox('clawHousing', {height: 1.8, width: 2.5, depth: 1.8}, scene);
    housing.material = housingMat;
    housing.parent = body;
    housing.position.y = 0.1;
    scene.shadowGenerator.addShadowCaster(housing);

    // Motor cylinder
    var motorMat = new BABYLON.StandardMaterial('clawMotor', scene);
    motorMat.diffuseColor = new BABYLON.Color3(0.28, 0.26, 0.24);
    motorMat.specularColor = new BABYLON.Color3(0.35, 0.35, 0.35);
    var motorCyl = BABYLON.MeshBuilder.CreateCylinder('clawMotorCyl', {height: 1.2, diameter: 1.4, tessellation: 14}, scene);
    motorCyl.material = motorMat;
    motorCyl.rotation.z = Math.PI / 2;
    motorCyl.parent = body;
    motorCyl.position.set(0, 0.3, 0);
    scene.shadowGenerator.addShadowCaster(motorCyl);

    // Status LED
    var ledMat = new BABYLON.StandardMaterial('clawLED', scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    ledMat.emissiveColor = new BABYLON.Color3(0.05, 0.3, 0.05);
    var led = BABYLON.MeshBuilder.CreateCylinder('clawLED', {height: 0.1, diameter: 0.2, tessellation: 8}, scene);
    led.material = ledMat;
    led.rotation.z = Math.PI / 2;
    led.parent = body;
    led.position.set(-1.3, 0.6, 0.6);

    // Jaw material - metallic
    var jawMat = new BABYLON.StandardMaterial('clawJawMat', scene);
    jawMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.55);
    jawMat.specularColor = new BABYLON.Color3(0.7, 0.7, 0.75);

    // Pivot material
    var pivotMat = new BABYLON.StandardMaterial('clawPivotMat', scene);
    pivotMat.diffuseColor = new BABYLON.Color3(0.45, 0.45, 0.48);
    pivotMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.65);

    var jawLength = self.options.jawLength;
    var jawWidth = self.options.jawWidth;
    var jawSpacing = 1.2; // half-width offset from center

    // Left pivot
    var leftPivot = BABYLON.MeshBuilder.CreateBox('clawLeftPivot', {height: 0.5, width: jawWidth, depth: 0.5}, scene);
    self.leftPivot = leftPivot;
    leftPivot.component = self;
    leftPivot.material = pivotMat;
    scene.shadowGenerator.addShadowCaster(leftPivot);

    // Left jaw
    var leftJaw = BABYLON.MeshBuilder.CreateBox('clawLeftJaw', {height: jawLength, width: jawWidth, depth: 0.4}, scene);
    leftJaw.material = jawMat;
    leftJaw.parent = leftPivot;
    leftJaw.position.y = -(jawLength / 2);
    scene.shadowGenerator.addShadowCaster(leftJaw);

    // Left jaw tip (angled inner face)
    var leftTip = BABYLON.MeshBuilder.CreateBox('clawLeftTip', {height: 1.5, width: jawWidth, depth: 0.3}, scene);
    leftTip.material = jawMat;
    leftTip.parent = leftPivot;
    leftTip.position.y = -(jawLength - 0.5);
    leftTip.position.z = 0.2;
    leftTip.rotation.x = 0.3;
    scene.shadowGenerator.addShadowCaster(leftTip);

    // Position left pivot relative to parent, then detach for physics
    leftPivot.parent = parent;
    leftPivot.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    leftPivot.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    leftPivot.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);
    leftPivot.position = self.bodyPosition.clone();
    leftPivot.translate(BABYLON.Axis.Y, -0.8, BABYLON.Space.LOCAL);
    leftPivot.translate(BABYLON.Axis.X, -jawSpacing, BABYLON.Space.LOCAL);
    // Apply start angle (negative = open outward for left jaw)
    leftPivot.rotate(BABYLON.Axis.Z, -(self.options.startAngle * Math.PI / 180), BABYLON.Space.LOCAL);
    parent.removeChild(leftPivot);

    // Right pivot
    var rightPivot = BABYLON.MeshBuilder.CreateBox('clawRightPivot', {height: 0.5, width: jawWidth, depth: 0.5}, scene);
    self.rightPivot = rightPivot;
    rightPivot.component = self;
    rightPivot.material = pivotMat;
    scene.shadowGenerator.addShadowCaster(rightPivot);

    // Right jaw
    var rightJaw = BABYLON.MeshBuilder.CreateBox('clawRightJaw', {height: jawLength, width: jawWidth, depth: 0.4}, scene);
    rightJaw.material = jawMat;
    rightJaw.parent = rightPivot;
    rightJaw.position.y = -(jawLength / 2);
    scene.shadowGenerator.addShadowCaster(rightJaw);

    // Right jaw tip (angled inner face, same as left for symmetry)
    var rightTip = BABYLON.MeshBuilder.CreateBox('clawRightTip', {height: 1.5, width: jawWidth, depth: 0.3}, scene);
    rightTip.material = jawMat;
    rightTip.parent = rightPivot;
    rightTip.position.y = -(jawLength - 0.5);
    rightTip.position.z = 0.2;
    rightTip.rotation.x = 0.3;
    scene.shadowGenerator.addShadowCaster(rightTip);

    // Position right pivot, mirrored
    rightPivot.parent = parent;
    rightPivot.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    rightPivot.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    rightPivot.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);
    rightPivot.position = self.bodyPosition.clone();
    rightPivot.translate(BABYLON.Axis.Y, -0.8, BABYLON.Space.LOCAL);
    rightPivot.translate(BABYLON.Axis.X, jawSpacing, BABYLON.Space.LOCAL);
    // Apply start angle (positive = open outward for right jaw, mirrored)
    rightPivot.rotate(BABYLON.Axis.Z, (self.options.startAngle * Math.PI / 180), BABYLON.Space.LOCAL);
    parent.removeChild(rightPivot);

    self.positionAdjustment = self.options.startAngle;
  };

  this.loadImpostor = function() {
    self.body.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    self.leftPivot.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.leftPivot,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: self.options.mass / 2,
        restitution: self.options.restitution,
        friction: self.options.friction
      },
      scene
    );
    self.rightPivot.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.rightPivot,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: self.options.mass / 2,
        restitution: self.options.restitution,
        friction: self.options.friction
      },
      scene
    );
  };

  this.loadJoints = function() {
    // Left jaw hinge joint - rotates on Z axis
    let leftMainPivot = BABYLON.Vector3.Zero();
    leftMainPivot.y -= 0.8;
    leftMainPivot.x -= 1.2;
    leftMainPivot.rotateByQuaternionToRef(self.body.rotationQuaternion, leftMainPivot);
    let leftConnectedPivot = BABYLON.Vector3.Zero();
    let leftAxis = new BABYLON.Vector3(0, 0, 1);
    leftAxis.rotateByQuaternionAroundPointToRef(self.body.rotationQuaternion, BABYLON.Vector3.Zero(), leftAxis);

    self.leftJoint = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.HingeJoint, {
      mainPivot: leftMainPivot,
      connectedPivot: leftConnectedPivot,
      mainAxis: leftAxis,
      connectedAxis: new BABYLON.Vector3(0, 0, 1),
    });

    let targetBody = self.body;
    while (targetBody.parent) {
      leftMainPivot.addInPlace(targetBody.position);
      targetBody = targetBody.parent;
    }
    targetBody.physicsImpostor.addJoint(self.leftPivot.physicsImpostor, self.leftJoint);

    // Set joint limits to prevent overextension (angles in radians)
    if (self.leftJoint.physicsJoint && self.leftJoint.physicsJoint.setLimit) {
      let minRad = self.options.minAngle * Math.PI / 180;
      let maxRad = self.options.maxAngle * Math.PI / 180;
      self.leftJoint.physicsJoint.setLimit(minRad, maxRad, 0.9, 0.3, 1.0);
    }

    // Right jaw hinge joint - rotates on Z axis (mirrored)
    let rightMainPivot = BABYLON.Vector3.Zero();
    rightMainPivot.y -= 0.8;
    rightMainPivot.x += 1.2;
    rightMainPivot.rotateByQuaternionToRef(self.body.rotationQuaternion, rightMainPivot);
    let rightConnectedPivot = BABYLON.Vector3.Zero();
    let rightAxis = new BABYLON.Vector3(0, 0, 1);
    rightAxis.rotateByQuaternionAroundPointToRef(self.body.rotationQuaternion, BABYLON.Vector3.Zero(), rightAxis);

    self.rightJoint = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.HingeJoint, {
      mainPivot: rightMainPivot,
      connectedPivot: rightConnectedPivot,
      mainAxis: rightAxis,
      connectedAxis: new BABYLON.Vector3(0, 0, 1),
    });

    targetBody = self.body;
    while (targetBody.parent) {
      rightMainPivot.addInPlace(targetBody.position);
      targetBody = targetBody.parent;
    }
    targetBody.physicsImpostor.addJoint(self.rightPivot.physicsImpostor, self.rightJoint);

    // Set joint limits for right jaw (mirrored, so negative angles)
    if (self.rightJoint.physicsJoint && self.rightJoint.physicsJoint.setLimit) {
      let minRad = self.options.minAngle * Math.PI / 180;
      let maxRad = self.options.maxAngle * Math.PI / 180;
      self.rightJoint.physicsJoint.setLimit(-maxRad, -minRad, 0.9, 0.3, 1.0);
    }
  };

  this.setOptions = function(options) {
    self.options = {
      jawLength: 6,
      jawWidth: 1,
      minAngle: 0,
      maxAngle: 45,
      startAngle: 30,
      gripAngleThreshold: 5,
      gripForce: 500,
      mass: 50,
      restitution: 0.4,
      friction: 0.8
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    self.position = self.getPosition();
    self.speed = 0.8 * self.speed + 0.2 * ((self.position - self.prevPosition) / delta * 1000);
    self.prevPosition = self.position;

    if (self.mode == self.modes.RUN) {
      self.setMotorSpeed();
    } else if (self.mode == self.modes.RUN_TIL_TIME) {
      self.setMotorSpeed();
      if (Date.now() > self.time_target) {
        self.stop();
      }
    } else if (self.mode == self.modes.RUN_TO_POS) {
      self.setMotorSpeed();
      if (
        (self.positionDirectionReversed == false && self.position >= self.position_target) ||
        (self.positionDirectionReversed && self.position <= self.position_target)
      ) {
        self.stop();
      }
    } else if (self.mode == self.modes.STOP) {
      self.holdPosition();
    }

    // Check grip state each frame
    self.checkGrip();

    // Update gripped object position to follow jaw tips
    self.updateGrippedPosition();

    self.components.forEach(function(component) {
      if (typeof component.render == 'function') {
        component.render(delta);
      }
    });
  };

  this.setMotorSpeed = function() {
    let speed = self.speed_sp / 180 * Math.PI;
    if (self.positionDirectionReversed) {
      speed = -speed;
    }
    if (
      (speed > 0 && (self.position + self.positionAdjustment) > self.options.maxAngle)
      || (speed < 0 && (self.position + self.positionAdjustment) < self.options.minAngle)
    ) {
      self.leftJoint.setMotor(0);
      self.rightJoint.setMotor(0);
    } else {
      // Left jaw: positive speed opens (rotates outward)
      self.leftJoint.setMotor(speed);
      // Right jaw: mirrored (negative speed opens)
      self.rightJoint.setMotor(-speed);
    }
  };

  this.holdPosition = function() {
    const P_GAIN = 0.1;
    const MAX_POSITION_CORRECTION_SPEED = 0.5;
    let error = self.position_target - self.position;
    let speed = error * P_GAIN;

    if (speed > MAX_POSITION_CORRECTION_SPEED) {
      speed = MAX_POSITION_CORRECTION_SPEED;
    } else if (speed < -MAX_POSITION_CORRECTION_SPEED) {
      speed = -MAX_POSITION_CORRECTION_SPEED;
    }
    self.leftJoint.setMotor(speed);
    self.rightJoint.setMotor(-speed);
  };

  this.getPosition = function() {
    let baseVector = new BABYLON.Vector3(0, -1, 0);
    let jawVector = new BABYLON.Vector3(0, -1, 0);
    let normalVector = new BABYLON.Vector3(0, 0, 1);
    let zero = BABYLON.Vector3.Zero();

    baseVector.rotateByQuaternionAroundPointToRef(self.body.absoluteRotationQuaternion, zero, baseVector);
    normalVector.rotateByQuaternionAroundPointToRef(self.body.absoluteRotationQuaternion, zero, normalVector);
    jawVector.rotateByQuaternionAroundPointToRef(self.leftPivot.absoluteRotationQuaternion, zero, jawVector);

    let rotation = -BABYLON.Vector3.GetAngleBetweenVectors(baseVector, jawVector, normalVector) / Math.PI * 180;
    if (isNaN(rotation)) {
      rotation = 0;
    }
    if (rotation < -90 && self.prevRotation > 90) {
      self.rotationRounds += 1;
    } else if (rotation > 90 && self.prevRotation < -90) {
      self.rotationRounds -= 1;
    }
    self.prevRotation = rotation;

    return self.rotationRounds * 360 + rotation - self.positionAdjustment;
  };

  this.loadMeshes = function(meshes) {
    self.magneticMeshes = [];
    meshes.forEach(function(mesh) {
      if (mesh.isMagnetic) {
        self.magneticMeshes.push(mesh);
      }
    });
  };

  this.checkGrip = function() {
    let currentAngle = self.position + self.positionAdjustment;
    let openThreshold = self.options.minAngle + self.options.gripAngleThreshold + 10;

    // Release check: if jaws open beyond threshold + hysteresis
    if (self.grippedMesh) {
      if (currentAngle > self.options.gripAngleThreshold + 5) {
        self.releaseGrip();
      }
      return;
    }

    // Track when gripper is opened - must open before it can grab
    if (currentAngle > openThreshold) {
      self.wasOpenSinceLastGrip = true;
    }

    // Grip check: only grip if gripper was opened first AND is now near closed
    if (self.wasOpenSinceLastGrip && currentAngle <= self.options.minAngle + self.options.gripAngleThreshold) {
      self.tryGrip();
    }
  };

  this.tryGrip = function() {
    if (self.grippedMesh) return;

    let gripCenter = self.getGripCenter();
    let gripRadius = self.options.jawWidth + 2;

    // Check magnetic meshes for nearby objects
    for (let i = 0; i < self.magneticMeshes.length; i++) {
      let mesh = self.magneticMeshes[i];
      if (!mesh.physicsImpostor && !mesh.parent) continue;

      let meshPos = mesh.absolutePosition;
      let distance = BABYLON.Vector3.Distance(gripCenter, meshPos);

      if (distance < gripRadius) {
        self.attachGrip(mesh);
        return;
      }
    }

    // Fallback: scan all scene meshes for isMagnetic
    for (let i = 0; i < scene.meshes.length; i++) {
      let mesh = scene.meshes[i];
      if (!mesh.isMagnetic) continue;
      if (self.magneticMeshes.indexOf(mesh) !== -1) continue;

      let meshPos = mesh.absolutePosition;
      let distance = BABYLON.Vector3.Distance(gripCenter, meshPos);

      if (distance < gripRadius) {
        self.attachGrip(mesh);
        return;
      }
    }
  };

  this.attachGrip = function(mesh) {
    // Find the physics root of the mesh
    let physicsTarget = mesh;
    while (physicsTarget.parent && !physicsTarget.physicsImpostor) {
      physicsTarget = physicsTarget.parent;
    }
    if (!physicsTarget.physicsImpostor) return;

    // Store original physics properties to restore on release
    self.grippedOriginalImpostorType = physicsTarget.physicsImpostor.type;
    self.grippedOriginalMass = physicsTarget.physicsImpostor.mass;
    self.grippedOriginalFriction = physicsTarget.physicsImpostor.friction;
    self.grippedOriginalRestitution = physicsTarget.physicsImpostor.restitution;

    // Compute the grip center (midpoint of jaw tips)
    let gripCenter = self.getGripCenter();

    // Compute offset in local space (relative to body orientation) so it
    // rotates correctly when the robot turns
    let worldOffset = physicsTarget.absolutePosition.subtract(gripCenter);
    let bodyQuatInverse = BABYLON.Quaternion.Inverse(self.body.absoluteRotationQuaternion);
    self.gripLocalOffset = BABYLON.Vector3.Zero();
    worldOffset.rotateByQuaternionToRef(bodyQuatInverse, self.gripLocalOffset);

    // Remove from physics world entirely to prevent collision forces
    // between the gripped object and the robot body/jaw pivots
    physicsTarget.physicsImpostor.dispose();
    physicsTarget.physicsImpostor = null;

    self.grippedMesh = physicsTarget;
    // Must open gripper again before it can grab another object
    self.wasOpenSinceLastGrip = false;

    // Update grip indicator
    if (typeof simPanel !== 'undefined' && simPanel.updateGripIndicator) {
      simPanel.updateGripIndicator(true);
    }
  };

  this.getGripCenter = function() {
    let leftTipPos = self.leftPivot.absolutePosition.clone();
    let rightTipPos = self.rightPivot.absolutePosition.clone();

    let leftDown = new BABYLON.Vector3(0, -self.options.jawLength, 0);
    leftDown.rotateByQuaternionAroundPointToRef(self.leftPivot.absoluteRotationQuaternion, BABYLON.Vector3.Zero(), leftDown);
    leftTipPos.addInPlace(leftDown);

    let rightDown = new BABYLON.Vector3(0, -self.options.jawLength, 0);
    rightDown.rotateByQuaternionAroundPointToRef(self.rightPivot.absoluteRotationQuaternion, BABYLON.Vector3.Zero(), rightDown);
    rightTipPos.addInPlace(rightDown);

    return leftTipPos.add(rightTipPos).scale(0.5);
  };

  this.updateGrippedPosition = function() {
    if (!self.grippedMesh) return;

    // Compute current grip center
    let gripCenter = self.getGripCenter();

    // Convert local offset back to world space using current body orientation
    let worldOffset = BABYLON.Vector3.Zero();
    self.gripLocalOffset.rotateByQuaternionToRef(self.body.absoluteRotationQuaternion, worldOffset);

    // Set mesh position directly (no physics body exists, so no desync)
    let targetPos = gripCenter.add(worldOffset);
    self.grippedMesh.position.copyFrom(targetPos);
  };

  this.releaseGrip = function() {
    if (self.grippedMesh) {
      // Recreate the physics impostor with stored original properties
      self.grippedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
        self.grippedMesh,
        self.grippedOriginalImpostorType,
        {
          mass: self.grippedOriginalMass || 1,
          friction: self.grippedOriginalFriction || 0.1,
          restitution: self.grippedOriginalRestitution || 0.1
        },
        scene
      );
      // Zero out velocity so the object doesn't fly away
      self.grippedMesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
      self.grippedMesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    }
    self.grippedMesh = null;
    self.gripLocalOffset = null;
    self.grippedOriginalImpostorType = null;
    self.grippedOriginalMass = null;
    self.grippedOriginalFriction = null;
    self.grippedOriginalRestitution = null;

    // Update grip indicator
    if (typeof simPanel !== 'undefined' && simPanel.updateGripIndicator) {
      simPanel.updateGripIndicator(false);
    }
  };

  this.init();
}

// Laser distance sensor
function LaserRangeSensor(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'LaserRangeSensor';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    // Invisible physics container (same dimensions: 2.5 tall, 1.5 wide/deep)
    var body = BABYLON.MeshBuilder.CreateBox('laserRangeSensorBody', {height: 2.5, width: 1.5, depth: 1.5}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;
    body.parent = parent;
    body.position = self.position;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)

    // Main housing (dark enclosure)
    var housingMat = new BABYLON.StandardMaterial('laserHousing', scene);
    housingMat.diffuseColor = new BABYLON.Color3(0.18, 0.18, 0.22);
    housingMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.12);
    var housing = BABYLON.MeshBuilder.CreateBox('laserHousingMesh', {height: 2.2, width: 1.4, depth: 1.4}, scene);
    housing.material = housingMat;
    housing.parent = body;
    housing.position.y = 0.1;
    scene.shadowGenerator.addShadowCaster(housing);

    // Lens window (bottom face - where laser points down)
    var lensMat = new BABYLON.StandardMaterial('laserLens', scene);
    lensMat.diffuseColor = new BABYLON.Color3(0.15, 0.05, 0.05);
    lensMat.specularColor = new BABYLON.Color3(0.5, 0.2, 0.2);
    lensMat.emissiveColor = new BABYLON.Color3(0.15, 0.0, 0.0);
    var lens = BABYLON.MeshBuilder.CreateCylinder('laserLens', {height: 0.12, diameter: 0.9, tessellation: 12}, scene);
    lens.material = lensMat;
    lens.parent = body;
    lens.position.y = -1.15;
    scene.shadowGenerator.addShadowCaster(lens);

    // Lens ring
    var ringMat = new BABYLON.StandardMaterial('laserRing', scene);
    ringMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.52);
    ringMat.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    var ring = BABYLON.MeshBuilder.CreateTorus('laserRing', {diameter: 1.0, thickness: 0.1, tessellation: 16}, scene);
    ring.material = ringMat;
    ring.parent = body;
    ring.position.y = -1.1;

    // Top cap (slightly rounded)
    var capMat = new BABYLON.StandardMaterial('laserCap', scene);
    capMat.diffuseColor = new BABYLON.Color3(0.22, 0.22, 0.26);
    var cap = BABYLON.MeshBuilder.CreateCylinder('laserCap', {height: 0.3, diameterTop: 1.0, diameterBottom: 1.3, tessellation: 4}, scene);
    cap.material = capMat;
    cap.parent = body;
    cap.position.y = 1.1;
    cap.rotation.y = Math.PI / 4;
    scene.shadowGenerator.addShadowCaster(cap);

    // Status LED (red - laser active indicator)
    var ledMat = new BABYLON.StandardMaterial('laserLED', scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.9, 0.1, 0.1);
    ledMat.emissiveColor = new BABYLON.Color3(0.4, 0.0, 0.0);
    var led = BABYLON.MeshBuilder.CreateCylinder('laserLED', {height: 0.08, diameter: 0.18, tessellation: 8}, scene);
    led.material = ledMat;
    led.rotation.z = Math.PI / 2;
    led.parent = body;
    led.position.set(0.72, 0.7, 0);

    // Label strip (silver)
    var labelMat = new BABYLON.StandardMaterial('laserLabel', scene);
    labelMat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.72);
    var label = BABYLON.MeshBuilder.CreateBox('laserLabel', {height: 0.3, width: 0.02, depth: 0.8}, scene);
    label.material = labelMat;
    label.parent = body;
    label.position.set(0.71, 0.1, 0);

    // Connector (back)
    var connMat = new BABYLON.StandardMaterial('laserConn', scene);
    connMat.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.28);
    var conn = BABYLON.MeshBuilder.CreateBox('laserConn', {height: 0.6, width: 0.8, depth: 0.3}, scene);
    conn.material = connMat;
    conn.parent = body;
    conn.position.set(0, 0.5, -0.72);

    // Connector pins
    var pinMat = new BABYLON.StandardMaterial('laserPins', scene);
    pinMat.diffuseColor = new BABYLON.Color3(0.83, 0.69, 0.22);
    for (var i = 0; i < 3; i++) {
      var pin = BABYLON.MeshBuilder.CreateBox('laserPin' + i, {height: 0.35, width: 0.08, depth: 0.06}, scene);
      pin.material = pinMat;
      pin.parent = body;
      pin.position.set(-0.2 + i * 0.2, 0.5, -0.88);
    }

    // Prep rays
    self.rays = [];
    self.rayVectors = [];
    var straightVector = new BABYLON.Vector3(0,-1,0);
    let origin = new BABYLON.Vector3(0,0,0);

    self.options.rayRotations.forEach(function(rayRotation){
      var matrixX = BABYLON.Matrix.RotationAxis(BABYLON.Axis.X, rayRotation[0]);
      var matrixY = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, rayRotation[1]);
      var vec = BABYLON.Vector3.TransformCoordinates(straightVector, matrixX);
      vec = BABYLON.Vector3.TransformCoordinates(vec, matrixY);

      self.rayVectors.push(vec);
      var ray = new BABYLON.Ray(origin, new BABYLON.Vector3(0,-1,0), self.options.rayLength);
      self.rays.push(ray);

      // BABYLON.RayHelper.CreateAndShow(ray, scene, new BABYLON.Color3(1, 1, 1));
    });
  };

  this.setOptions = function(options) {
    self.options = {
      rayOrigin:  new BABYLON.Vector3(0,-1.26,0),
      rayRotations: [ [0, 0] ],
      rayLength: 400
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.filterRay = function(mesh) {
    if (mesh.isPickable == false) {
      return false;
    }
    if (mesh.laserDetection == 'invisible') {
      return false;
    }
    return true;
  };

  this.getDistance = function() {
    var shortestDistance = self.options.rayLength;

    var rayOffset = new BABYLON.Vector3(0,0,0);
    self.options.rayOrigin.rotateByQuaternionToRef(self.body.absoluteRotationQuaternion, rayOffset);
    self.rays[0].origin.copyFrom(self.body.absolutePosition);
    self.rays[0].origin.addInPlace(rayOffset);

    self.rayVectors.forEach(function(rayVector, i){
      rayVector.rotateByQuaternionToRef(self.body.absoluteRotationQuaternion, self.rays[i].direction);

      var hit = scene.pickWithRay(self.rays[i], self.filterRay);
      if (hit.hit == false || hit.pickedMesh.laserDetection == 'absorb') {
        return;
      }
      if (hit.distance < shortestDistance) {
        shortestDistance = hit.distance;
      }
    });

    return shortestDistance;
  };

  this.init();
}

// Motorized swivel platform
function SwivelActuator(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'SwivelActuator';
  this.port = port;
  this.options = null;

  this.components = [];

  this.bodyPosition = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  // Used in Python
  this.modes = {
    STOP: 1,
    RUN: 2,
    RUN_TO_POS: 3,
    RUN_TIL_TIME: 4
  };
  this.mode = this.modes.STOP;

  this.state = 'holding';
  this.states = {
    RUNNING: 'running',
    RAMPING: 'ramping',
    HOLDING: 'holding',
    OVERLOADED: 'overloaded',
    STATE_STALLED: 'stalled',
    NONE: ''
  };

  this.speed = 0;
  this.speed_sp = 30;
  this.position_sp = 0;
  this.position_target = 0;
  this.position = 0;
  this.prevPosition = 0;
  this.positionAdjustment = 0;
  this.prevRotation = 0;
  this.rotationRounds = 0;

  this.runTimed = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN_TIL_TIME;
    self.state = self.states.RUNNING;
  };

  this.runToPosition = function() {
    if (self.position_target < self.position) {
      self.positionDirectionReversed = true;
    } else {
      self.positionDirectionReversed = false;
    }
    self.mode = self.modes.RUN_TO_POS;
    self.state = self.states.RUNNING;
  };

  this.runForever = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN;
    self.state = self.states.RUNNING;
  };

  this.stop = function() {
    self.mode = self.modes.STOP;
    self.position_target = self.position;
    self.state = self.states.HOLDING;
  };

  this.reset = function() {
    self.positionAdjustment += self.position;
    self.position = 0;
    self.prevPosition = 0;
    self.position_target = 0;
    self.mode = self.modes.STOP;
    self.state = self.states.HOLDING;
  };

  // Used in JS
  this.init = function() {
    self.setOptions(options);

    // Dark metallic housing material
    var swivelBodyMat = new BABYLON.StandardMaterial('swivelBodyMat', scene);
    swivelBodyMat.diffuseColor = new BABYLON.Color3(0.22, 0.22, 0.25);
    swivelBodyMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.45);

    var body = BABYLON.MeshBuilder.CreateBox('swivelBody', {height: 1, width: self.options.width, depth: self.options.width}, scene);
    self.body = body;
    body.component = self;
    self.body.material = swivelBodyMat;
    body.parent = parent;
    body.position = self.bodyPosition;
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
    scene.shadowGenerator.addShadowCaster(body);

    // Motor housing detail (partially visible cylinder inside base)
    var motorMat = new BABYLON.StandardMaterial('swivelMotor', scene);
    motorMat.diffuseColor = new BABYLON.Color3(0.28, 0.26, 0.24);
    motorMat.specularColor = new BABYLON.Color3(0.35, 0.35, 0.35);
    var motorHousing = BABYLON.MeshBuilder.CreateCylinder('swivelMotor', {height: 0.6, diameter: self.options.width * 0.6, tessellation: 14}, scene);
    motorHousing.material = motorMat;
    motorHousing.parent = body;
    motorHousing.position.y = 0.25;
    scene.shadowGenerator.addShadowCaster(motorHousing);

    // Bearing ring (silver torus on top of base)
    var bearingMat = new BABYLON.StandardMaterial('swivelBearing', scene);
    bearingMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.78);
    bearingMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    var bearing = BABYLON.MeshBuilder.CreateTorus('swivelBearing', {diameter: self.options.width * 0.65, thickness: 0.08, tessellation: 20}, scene);
    bearing.material = bearingMat;
    bearing.parent = body;
    bearing.position.y = 0.5;

    // Status LED (green) on side of base
    var ledMat = new BABYLON.StandardMaterial('swivelLED', scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    ledMat.emissiveColor = new BABYLON.Color3(0.05, 0.3, 0.05);
    var led = BABYLON.MeshBuilder.CreateCylinder('swivelLED', {height: 0.1, diameter: 0.2, tessellation: 8}, scene);
    led.material = ledMat;
    led.rotation.x = Math.PI / 2;
    led.parent = body;
    led.position.set(0, 0.2, self.options.width * 0.51);

    // Connector pins (brass) on back of base
    var pinMat = new BABYLON.StandardMaterial('swivelPins', scene);
    pinMat.diffuseColor = new BABYLON.Color3(0.83, 0.69, 0.22);
    pinMat.specularColor = new BABYLON.Color3(0.9, 0.8, 0.4);
    for (var p = 0; p < 3; p++) {
      var pin = BABYLON.MeshBuilder.CreateBox('swivelPin' + p, {height: 0.4, width: 0.1, depth: 0.08}, scene);
      pin.material = pinMat;
      pin.parent = body;
      pin.position.set(-0.3 + p * 0.3, 0, -self.options.width * 0.52);
    }

    // Darker metallic turntable material
    var platformMat = new BABYLON.StandardMaterial('swivelPlatform', scene);
    platformMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.33);
    platformMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.55);

    var platform = BABYLON.MeshBuilder.CreateCylinder('platform', {height: 0.5, diameter: self.options.width / 3 * 2.5, tessellation:12}, scene);;
    self.platform = platform;
    platform.component = self;
    self.end = platform;
    platform.material = platformMat;

    platform.parent = parent;
    platform.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    platform.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    platform.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
    platform.position = self.bodyPosition.clone();
    platform.translate(BABYLON.Axis.Y, 0.75, BABYLON.Space.LOCAL);
    parent.removeChild(platform);
    scene.shadowGenerator.addShadowCaster(platform);

    // Grip ridges on top of platform (smaller cylinder)
    var gripMat = new BABYLON.StandardMaterial('swivelGrip', scene);
    gripMat.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.28);
    gripMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    var grip = BABYLON.MeshBuilder.CreateCylinder('swivelGrip', {height: 0.08, diameter: self.options.width / 3 * 2.0, tessellation: 12}, scene);
    grip.material = gripMat;
    grip.parent = platform;
    grip.position.y = 0.28;

    // Gear indicator ring around platform edge
    var gearMat = new BABYLON.StandardMaterial('swivelGear', scene);
    gearMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.53);
    gearMat.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    var gear = BABYLON.MeshBuilder.CreateTorus('swivelGear', {diameter: self.options.width / 3 * 2.5, thickness: 0.06, tessellation: 20}, scene);
    gear.material = gearMat;
    gear.parent = platform;
    gear.position.y = 0;
  };

  this.loadImpostor = function() {
    self.body.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 0,
      },
      scene
    );
    self.platform.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.platform,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: self.options.mass,
        restitution: self.options.restitution,
        friction: self.options.friction
      },
      scene
    );
  };

  this.loadJoints = function() {
    let mainPivot = BABYLON.Vector3.Zero();
    let connectedPivot = BABYLON.Vector3.Zero();
    connectedPivot.y = -0.75;
    let axisVec = new BABYLON.Vector3(0, 1, 0);
    let rotationQuaternion = BABYLON.Quaternion.FromEulerVector(self.rotation);
    axisVec.rotateByQuaternionAroundPointToRef(rotationQuaternion, BABYLON.Vector3.Zero(), axisVec);

    let targetBody = self.body;
    while (targetBody.parent) {
      mainPivot.addInPlace(targetBody.position);
      targetBody = targetBody.parent;
    }

    self.joint = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.HingeJoint, {
      mainPivot: mainPivot,
      connectedPivot: connectedPivot,
      mainAxis: axisVec,
      connectedAxis: new BABYLON.Vector3(0, 1, 0),
    });

    targetBody.physicsImpostor.addJoint(self.platform.physicsImpostor, self.joint);
  };

  this.setOptions = function(options) {
    self.options = {
      mass: 100,
      baseColor: 'A39C0D',
      platformColor: '808080',
      width: 3,
      restitution: 0.4,
      friction: 0.1,
      components: []
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    self.position = self.getPosition();
    self.speed = 0.8 * self.speed + 0.2 * ((self.position - self.prevPosition) / delta * 1000);
    self.prevPosition = self.position;

    if (self.mode == self.modes.RUN) {
      self.setMotorSpeed();
    } else if (self.mode == self.modes.RUN_TIL_TIME) {
      self.setMotorSpeed();
      if (Date.now() > self.time_target) {
        self.stop();
      }
    } else if (self.mode == self.modes.RUN_TO_POS) {
      self.setMotorSpeed();
      if (
        (self.positionDirectionReversed == false && self.position >= self.position_target) ||
        (self.positionDirectionReversed && self.position <= self.position_target)
      ) {
        self.stop();
      }
    } else if (self.mode == self.modes.STOP) {
      self.holdPosition();
    }

    self.components.forEach(function(component) {
      if (typeof component.render == 'function') {
        component.render(delta);
      }
    });
  };

  this.setMotorSpeed = function() {
    let speed = self.speed_sp / 180 * Math.PI;
    if (self.positionDirectionReversed) {
      speed = -speed;
    }
    self.joint.setMotor(speed);
  };

  this.holdPosition = function(delta) {
    const P_GAIN = 0.1;
    const MAX_POSITION_CORRECTION_SPEED = 0.5;
    let error = self.position_target - self.position;
    let speed = error * P_GAIN;

    if (speed > MAX_POSITION_CORRECTION_SPEED) {
      speed = MAX_POSITION_CORRECTION_SPEED;
    } else if (speed < -MAX_POSITION_CORRECTION_SPEED) {
      speed = -MAX_POSITION_CORRECTION_SPEED;
    }
    self.joint.setMotor(speed);
  };

  this.getPosition = function() {
    let baseVector = new BABYLON.Vector3(0, 0, 1);
    let armVector = new BABYLON.Vector3(0, 0, 1);
    let normalVector = new BABYLON.Vector3(0, 1, 0);
    let zero = BABYLON.Vector3.Zero();

    baseVector.rotateByQuaternionAroundPointToRef(self.body.absoluteRotationQuaternion, zero, baseVector);
    normalVector.rotateByQuaternionAroundPointToRef(self.body.absoluteRotationQuaternion, zero, normalVector);
    armVector.rotateByQuaternionAroundPointToRef(self.platform.absoluteRotationQuaternion, zero, armVector);

    let rotation = -BABYLON.Vector3.GetAngleBetweenVectors(baseVector, armVector, normalVector) / Math.PI * 180;
    if (isNaN(rotation)) {
      rotation = 0;
    }
    if (rotation < -90 && self.prevRotation > 90) {
      self.rotationRounds += 1;
    } else if (rotation > 90 && self.prevRotation < -90) {
      self.rotationRounds -= 1;
    }
    self.prevRotation = rotation;

    return self.rotationRounds * 360 + rotation - self.positionAdjustment;
  };

  this.init();
}

// Paintball launcher
function PaintballLauncherActuator(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'PaintballLauncherActuator';
  this.port = port;
  this.options = null;

  this.components = [];

  this.bodyPosition = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  this.ammo = -1;

  // Used in Python
  this.modes = {
    STOP: 1,
    RUN: 2,
    RUN_TO_POS: 3,
    RUN_TIL_TIME: 4
  };
  this.mode = this.modes.STOP;

  this.state = 'holding';
  this.states = {
    RUNNING: 'running',
    RAMPING: 'ramping',
    HOLDING: 'holding',
    OVERLOADED: 'overloaded',
    STATE_STALLED: 'stalled',
    NONE: ''
  };

  this.speed = 0;
  this.speed_sp = 30;
  this.position_sp = 0;
  this.position_target = 0;
  this.position = 0;
  this.prevPosition = 0;
  this.positionAdjustment = 0;
  this.prevRotation = 0;
  this.rotationRounds = 0;

  this.runTimed = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN_TIL_TIME;
    self.state = self.states.RUNNING;
  };

  this.runToPosition = function() {
    if (self.position_target < self.position) {
      self.positionDirectionReversed = true;
    } else {
      self.positionDirectionReversed = false;
    }
    self.mode = self.modes.RUN_TO_POS;
    self.state = self.states.RUNNING;
  };

  this.runForever = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN;
    self.state = self.states.RUNNING;
  };

  this.stop = function() {
    self.mode = self.modes.STOP;
    self.position_target = self.position;
    self.state = self.states.HOLDING;
  };

  this.reset = function() {
    self.positionAdjustment += self.position;
    self.position = 0;
    self.prevPosition = 0;
    self.position_target = 0;
    self.mode = self.modes.STOP;
    self.state = self.states.HOLDING;
  };

  // Used in JS
  this.init = function() {
    self.setOptions(options);

    self.ammo = self.options.ammo;

    // Dark metallic housing material
    var launcherBodyMat = new BABYLON.StandardMaterial('launcherBodyMat', scene);
    launcherBodyMat.diffuseColor = new BABYLON.Color3(0.22, 0.22, 0.25);
    launcherBodyMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.45);

    // Gunmetal barrel material
    var launcherTubeMat = new BABYLON.StandardMaterial('launcherTubeMat', scene);
    launcherTubeMat.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.28);
    launcherTubeMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.55);

    var body = BABYLON.MeshBuilder.CreateBox('launcherBody', {height: 2.5, width: 2, depth: 9}, scene);
    self.body = body;
    body.component = self;
    self.body.visibility = 0;
    body.parent = parent;
    body.position = self.bodyPosition;
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
    scene.shadowGenerator.addShadowCaster(body);

    var base = BABYLON.MeshBuilder.CreateBox('launcherBase', {height: 0.5, width: 2, depth: 9}, scene);
    base.parent = body;
    base.position.y = -1;
    base.material = launcherBodyMat;
    scene.shadowGenerator.addShadowCaster(base);

    // Back plate (darker metallic)
    var backMat = new BABYLON.StandardMaterial('launcherBackMat', scene);
    backMat.diffuseColor = new BABYLON.Color3(0.18, 0.18, 0.2);
    backMat.specularColor = new BABYLON.Color3(0.35, 0.35, 0.4);
    var back = BABYLON.MeshBuilder.CreateBox('launcherBack', {height: 2.5, width: 2, depth: 1}, scene);
    back.parent = body;
    back.position.z = -4;
    back.material = backMat;
    scene.shadowGenerator.addShadowCaster(back);

    // Ventilation slots on back plate
    var ventMat = new BABYLON.StandardMaterial('launcherVent', scene);
    ventMat.diffuseColor = new BABYLON.Color3(0.12, 0.12, 0.14);
    for (var v = 0; v < 3; v++) {
      var slot = BABYLON.MeshBuilder.CreateBox('launcherSlot' + v, {height: 0.15, width: 1.4, depth: 0.1}, scene);
      slot.material = ventMat;
      slot.parent = body;
      slot.position.set(0, -0.4 + v * 0.6, -4.52);
    }

    // Hopper mount (cylinder on top of body, where paintballs load)
    var hopperMat = new BABYLON.StandardMaterial('launcherHopper', scene);
    hopperMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.33);
    hopperMat.specularColor = new BABYLON.Color3(0.45, 0.45, 0.5);
    var hopper = BABYLON.MeshBuilder.CreateCylinder('launcherHopper', {height: 1.0, diameter: 1.2, tessellation: 12}, scene);
    hopper.material = hopperMat;
    hopper.parent = body;
    hopper.position.set(0, 0.8, -1.5);
    scene.shadowGenerator.addShadowCaster(hopper);

    // Hopper opening (darker top)
    var hopperTopMat = new BABYLON.StandardMaterial('launcherHopperTop', scene);
    hopperTopMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.17);
    var hopperTop = BABYLON.MeshBuilder.CreateCylinder('launcherHopperTop', {height: 0.08, diameter: 0.9, tessellation: 12}, scene);
    hopperTop.material = hopperTopMat;
    hopperTop.parent = body;
    hopperTop.position.set(0, 1.35, -1.5);

    // Pressure gauge (brass sphere on side of base)
    var gaugeMat = new BABYLON.StandardMaterial('launcherGauge', scene);
    gaugeMat.diffuseColor = new BABYLON.Color3(0.83, 0.69, 0.22);
    gaugeMat.specularColor = new BABYLON.Color3(0.9, 0.8, 0.4);
    var gauge = BABYLON.MeshBuilder.CreateSphere('launcherGauge', {diameter: 0.5, segments: 10}, scene);
    gauge.material = gaugeMat;
    gauge.parent = body;
    gauge.position.set(1.1, -0.3, -2.5);

    // Status LED (green) on back plate
    var ledMat = new BABYLON.StandardMaterial('launcherLED', scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    ledMat.emissiveColor = new BABYLON.Color3(0.05, 0.3, 0.05);
    var led = BABYLON.MeshBuilder.CreateCylinder('launcherLED', {height: 0.1, diameter: 0.25, tessellation: 8}, scene);
    led.material = ledMat;
    led.rotation.x = Math.PI / 2;
    led.parent = body;
    led.position.set(0.7, 0.8, -4.52);

    // Connector pins (brass) on back
    var pinMat = new BABYLON.StandardMaterial('launcherPins', scene);
    pinMat.diffuseColor = new BABYLON.Color3(0.83, 0.69, 0.22);
    pinMat.specularColor = new BABYLON.Color3(0.9, 0.8, 0.4);
    for (var p = 0; p < 4; p++) {
      var pin = BABYLON.MeshBuilder.CreateBox('launcherPin' + p, {height: 0.5, width: 0.1, depth: 0.08}, scene);
      pin.material = pinMat;
      pin.parent = body;
      pin.position.set(-0.45 + p * 0.3, -0.8, -4.55);
    }

    let a = BABYLON.MeshBuilder.CreateCylinder('launcherBarrelA', {height: 7.8, diameter: 2, tessellation:12}, scene);
    let b = BABYLON.MeshBuilder.CreateCylinder('launcherBarrelb', {height: 7.8, diameter: 1.4, tessellation:12}, scene);
    a.visibility = 0;
    b.visibility = 0;
    b.position.y = 1;
    let aCSG = BABYLON.CSG.FromMesh(a);
    let bCSG = BABYLON.CSG.FromMesh(b);
    var subCSG = aCSG.subtract(bCSG);
    var barrel = subCSG.toMesh('launcherBarrel', launcherTubeMat, scene);
    barrel.parent = body;
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = 0.4;
    barrel.position.y = 0.25;
    scene.shadowGenerator.addShadowCaster(barrel);

    // Barrel tip sight
    var tipMat = new BABYLON.StandardMaterial('launcherTipMat', scene);
    tipMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.22);
    tipMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    var barrelTip = BABYLON.MeshBuilder.CreateBox('launcherBarrelTip', {height: 0.8, width: 0.2, depth: 0.4}, scene);;
    barrelTip.parent = barrel;
    barrelTip.position.y = 3.4;
    barrelTip.position.z = -1.1;
    barrelTip.material = tipMat;

    // Paintball colors
    self.paintballColors = []
    self.paintballColors.push(babylon.getMaterial(scene, '0ff'));
    self.paintballColors.push(babylon.getMaterial(scene, '0f0'));
    self.paintballColors.push(babylon.getMaterial(scene, 'ff0'));
    self.paintballColors.push(babylon.getMaterial(scene, 'f00'));
    self.paintballColors.push(babylon.getMaterial(scene, 'f0f'));
    self.paintballColors.push(babylon.getMaterial(scene, '00f'));

    // Paint splatter material
    self.splatterColors = [];
    for (let i=0; i<6; i++) {
      self.splatterColors.push(new BABYLON.StandardMaterial('paintSplatter', scene));
      self.splatterColors[i].diffuseTexture = new BABYLON.Texture('textures/robot/splatter' + i + '.png', scene);
      self.splatterColors[i].diffuseTexture.hasAlpha = true;
      self.splatterColors[i].zOffset = -1;
    }
  };

  this.loadImpostor = function() {
    self.body.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 1,
        restitution: 0.4,
        friction: 0.1
      },
      scene
    );
  };

  this.setOptions = function(options) {
    self.options = {
      drawBackLimit: -1000,
      powerScale: 2,
      maxSpeed: 600,
      color: 0,
      ttl: 10000,
      ammo: -1,
      splatterTTL: -1
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    self.speed = 0.8 * self.speed + 0.2 * ((self.position - self.prevPosition) / delta * 1000);
    self.prevPosition = self.position;

    if (self.mode == self.modes.RUN) {
      self.setMotorSpeed(delta);
    } else if (self.mode == self.modes.RUN_TIL_TIME) {
      self.setMotorSpeed(delta);
      if (Date.now() > self.time_target) {
        self.stop();
      }
    } else if (self.mode == self.modes.RUN_TO_POS) {
      self.setMotorSpeed(delta);
      if (
        (self.positionDirectionReversed == false && self.position >= self.position_target) ||
        (self.positionDirectionReversed && self.position <= self.position_target)
      ) {
        self.stop();
      }
    } else if (self.mode == self.modes.STOP) {
      // Do nothing
    }
  };

  self.paintballCollide = function(ownImpostor, otherImpostor) {
    let delta = scene.getEngine().getDeltaTime();

    let start = ownImpostor.object.absolutePosition;
    let direction = ownImpostor.getLinearVelocity();
    direction.scaleInPlace(delta / 1000);
    start.subtractInPlace(direction);
    let length = direction.length() * 2;
    direction.normalize();

    var ray = new BABYLON.Ray(start, direction, length);
    var hit = ray.intersectsMesh(otherImpostor.object, false);

    if (hit.hit == false) {
      direction = otherImpostor.object.absolutePosition.subtract(ownImpostor.object.absolutePosition);
      ray = new BABYLON.Ray(start, direction, direction.length());
      var hit = ray.intersectsMesh(otherImpostor.object, false);
      if (hit.hit == false) {
        console.log('Cannot find intersect');
      }
    }

    decal = BABYLON.MeshBuilder.CreateDecal(
      'splatter',
      otherImpostor.object,
      {
        position: hit.pickedPoint,
        normal: hit.getNormal(true),
        size: new BABYLON.Vector3(7, 7, 7)
      },
      scene
    );
    decal.material = self.splatterColors[self.options.color];

    decal.parent = otherImpostor.object;
    var m = new BABYLON.Matrix();
    otherImpostor.object.getWorldMatrix().invertToRef(m);
    let position = BABYLON.Vector3.TransformCoordinates(hit.pickedPoint, m);
    decal.position = position;

    decal.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
      decal.rotation.x,
      decal.rotation.y,
      decal.rotation.z
    );
    let rotationQuaternion = BABYLON.Quaternion.Inverse(otherImpostor.object.absoluteRotationQuaternion);
    decal.rotationQuaternion = rotationQuaternion.multiply(decal.rotationQuaternion);

    if (self.options.splatterTTL > 0) {
      setTimeout(
        (function (d) {
          return function(){
            d.dispose();
          };
        }) (decal),
        self.options.splatterTTL
      );
    }

    if (typeof otherImpostor.object.paintballCollide == 'function') {
      otherImpostor.object.paintballCollide(otherImpostor, ownImpostor, hit);
    }

    ownImpostor.toBeDisposed = true;
  }

  this.createPaintball = function(power) {
    let paintball = new BABYLON.MeshBuilder.CreateSphere('paintball', {diameter: 1, segments: 3}, scene);
    paintball.material = self.paintballColors[self.options.color];
    paintball.color = self.options.color;
    paintball.parent = self.body;
    paintball.position.y = 0.25;
    paintball.position.z = 5.2;
    self.body.removeChild(paintball);

    paintball.physicsImpostor = new BABYLON.PhysicsImpostor(
      paintball,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {
        mass: 10
      },
      scene
    );

    scene.meshes.forEach(function(mesh){
      if (mesh.id == 'paintball' || mesh.parent != null) return;
      if (mesh.physicsImpostor) {
        paintball.physicsImpostor.registerOnPhysicsCollide(mesh.physicsImpostor, self.paintballCollide);
      }
    })
    paintball.physicsImpostor.toBeDisposed = false;
    paintball.physicsImpostor.registerBeforePhysicsStep(function(impostor){
      if (impostor.toBeDisposed) {
        impostor.object.dispose();
        impostor.dispose();
      }
    })

    let impulseVector = new BABYLON.Vector3(0, 0, self.options.powerScale);
    impulseVector.rotateByQuaternionToRef(self.body.absoluteRotationQuaternion, impulseVector);
    impulseVector.scaleInPlace(power);
    paintball.physicsImpostor.applyImpulse(impulseVector, paintball.getAbsolutePosition());

    return paintball;
  };

  this.firePaintball = function() {
    let power = self.position * -1;
    self.position = 0;
    self.state = self.states.HOLDING;

    if (self.ammo == 0) {
      return;
    } else if (self.ammo > 0) {
      self.ammo--;
    }

    let paintball = self.createPaintball(power);
    setTimeout(function(){
      if (paintball.physicsImpostor) {
        paintball.physicsImpostor.toBeDisposed = true;
      }
    }, self.options.ttl)
    // self.paintballs.push(paintball);
  };

  this.setMotorSpeed = function(delta) {
    let speed = self.speed_sp;

    if (speed > self.options.maxSpeed) {
      speed = self.options.maxSpeed;
    } else if (speed < -self.options.maxSpeed) {
      speed = -self.options.maxSpeed;
    }

    if (self.positionDirectionReversed) {
      speed = -speed;
    }

    if (speed > 0 && self.position < 0) {
      self.firePaintball();
    }

    let position = self.position;
    position += speed * delta / 1000;

    if (position > 0) {
      position = 0;
      self.state = self.states.STATE_STALLED;
    } else if (position < self.options.drawBackLimit) {
      position = self.options.drawBackLimit;
      self.state = self.states.STATE_STALLED;
    }

    self.position = position;
  };

  this.init();
}

// Pen
function Pen(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'Pen';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(0, 0, 0);

  this.isDown = false;
  this.traceColor = '000';
  this.traceWidth = 0.5;
  this.traceMat = null;
  this.traceMeshes = [];
  this.currentMesh = null;
  this.prevPos = null;
  this.currentPathDirty = false;
  this.currentRibbonPath = [[], []];

  this.init = function() {
    self.setOptions(options);

    // Invisible physics container (same dimensions)
    var body = BABYLON.MeshBuilder.CreateBox('penBody', {height: 3, width: 1.5, depth: 1.5}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;

    body.position.y += 2.5;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    body.parent = parent;

    body.position = self.position;

    // Marker body (cylindrical, yellow/orange)
    var markerMat = new BABYLON.StandardMaterial('penMarker', scene);
    markerMat.diffuseColor = new BABYLON.Color3(0.88, 0.64, 0.17);
    markerMat.specularColor = new BABYLON.Color3(0.3, 0.25, 0.1);
    var marker = BABYLON.MeshBuilder.CreateCylinder('penMarkerMesh', {
      height: 2.4,
      diameter: 1.3,
      tessellation: 12
    }, scene);
    marker.material = markerMat;
    marker.parent = body;
    marker.position.y = 0.2;
    scene.shadowGenerator.addShadowCaster(marker);

    // Cap (top of marker - darker)
    var capMat = new BABYLON.StandardMaterial('penCap', scene);
    capMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.22);
    capMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    var cap = BABYLON.MeshBuilder.CreateCylinder('penCapMesh', {
      height: 0.4,
      diameterTop: 1.1,
      diameterBottom: 1.35,
      tessellation: 12
    }, scene);
    cap.material = capMat;
    cap.parent = body;
    cap.position.y = 1.35;
    scene.shadowGenerator.addShadowCaster(cap);

    // Grip ring (rubberized band near tip)
    var gripMat = new BABYLON.StandardMaterial('penGrip', scene);
    gripMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.32);
    gripMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    var grip = BABYLON.MeshBuilder.CreateCylinder('penGripMesh', {
      height: 0.5,
      diameter: 1.4,
      tessellation: 12
    }, scene);
    grip.material = gripMat;
    grip.parent = body;
    grip.position.y = -0.7;
    scene.shadowGenerator.addShadowCaster(grip);

    // Nib holder (tapered section above tip)
    var nibHolderMat = new BABYLON.StandardMaterial('penNibHolder', scene);
    nibHolderMat.diffuseColor = new BABYLON.Color3(0.75, 0.55, 0.15);
    var nibHolder = BABYLON.MeshBuilder.CreateCylinder('penNibHolder', {
      height: 0.6,
      diameterTop: 1.2,
      diameterBottom: 0.5,
      tessellation: 12
    }, scene);
    nibHolder.material = nibHolderMat;
    nibHolder.parent = body;
    nibHolder.position.y = -1.2;
    scene.shadowGenerator.addShadowCaster(nibHolder);

    // Tip (functional - keep at y = -2, conical)
    var tipMat = new BABYLON.StandardMaterial('penTipMat', scene);
    tipMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    tipMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    self.tip = BABYLON.MeshBuilder.CreateCylinder('penTip', {
      height: 0.8,
      diameterTop: 0.45,
      diameterBottom: 0.08,
      tessellation: 8
    }, scene);
    self.tip.material = tipMat;
    self.tip.position.y = -2;
    self.tip.parent = body;
    scene.shadowGenerator.addShadowCaster(self.tip);

    // Clip (small flat piece on side of marker body)
    var clipMat = new BABYLON.StandardMaterial('penClip', scene);
    clipMat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.72);
    clipMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    var clip = BABYLON.MeshBuilder.CreateBox('penClip', {height: 1.8, width: 0.08, depth: 0.3}, scene);
    clip.material = clipMat;
    clip.parent = body;
    clip.position.set(0.68, 0.4, 0);
  };

  this.setOptions = function(options) {
    self.options = {
      doubleSided: false
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    self.updateTracePath();
    if (self.currentPathDirty) {
      self.rebuildMesh()
    }
  }

  // Lower the pen (begin drawing a trace)
  this.down = function() {
    self.currentRibbonPath = [[], []];
    self.currentMesh = null;
    self.prevPos = null;
    self.isDown = true;
  };

  // Raise the pen (stop drawing a trace)
  this.up = function() {
    self.isDown = false
    if (self.currentMesh != null) {
      self.traceMeshes.push(self.currentMesh)
      self.currentMesh = null;
    }
    self.currentPathDirty = false
  };

  this.setTraceColor = function(r, g, b) {
    // if the pen is down, setting the trace color causes a new trace to start.
    // This is so the new ribbon can have a different material.
    if (self.isDown) {
      self.up();
      self.down();
    }
    r = ('0' + Math.round(r*255).toString(16)).slice(-2);
    g = ('0' + Math.round(g*255).toString(16)).slice(-2);
    b = ('0' + Math.round(b*255).toString(16)).slice(-2);
    self.traceColor = r + g + b;
    self.traceMat = babylon.getMaterial(scene, self.traceColor);
  };

  this.setWidth = function(width) {
    self.traceWidth = width / 2;
  }

  this.updateTracePath = function() {
    if (!self.isDown) {
      return;
    }
    let pos = self.tip.getAbsolutePosition();
    pos.y -= 0.48;

    if (self.prevPos === null) {
      self.prevPos = pos.clone();
      self.currentPathDirty = true;
    } else {
      const penPathEpsilon = 0.2;
      let dirV = pos.subtract(self.prevPos);
      if (dirV.lengthSquared() > penPathEpsilon) {
        self.prevPos = pos.clone();
        let left = new BABYLON.Vector3(0, self.traceWidth, 0);
        let right = new BABYLON.Vector3(0, -self.traceWidth, 0);
        // cross product is proprtional to lengths of both vectors, but we
        // do not want the trace width to vary with the robot speed
        dirV = dirV.normalize()
        left = dirV.cross(left);
        right = dirV.cross(right);
        left.addInPlace(pos);
        right.addInPlace(pos);
        self.currentRibbonPath[0].push(left);
        self.currentRibbonPath[1].push(right);
        self.currentPathDirty = true;
      }
    }
  };

  this.rebuildMesh = function() {
    if (self.currentRibbonPath[0].length < 2) {
      return;
    }
    if (self.currentMesh != null ) {
      scene.removeMesh(self.currentMesh);
      self.currentMesh.dispose();
    }
    if (self.traceMat == null) {
      self.traceMat = babylon.getMaterial(scene, self.traceColor);
    }
    let options = {
      pathArray: self.currentRibbonPath,
    };
    if (self.options.doubleSided) {
      options.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
    }
    self.currentMesh = BABYLON.MeshBuilder.CreateRibbon("ribbon", options, scene);
    self.currentMesh.material = self.traceMat;
  };

  this.init();
}

// LED
function LED(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'LED';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);

  this.isOn = false;
  this.color = [255, 255, 255];
  this.lensMat = null;
  this.lensMesh = null;
  this.light = null;

  // Actuator interface (used by Python API)
  this.modes = {
    STOP: 1,
    RUN: 2,
    RUN_TO_POS: 3,
    RUN_TIL_TIME: 4
  };
  this.mode = this.modes.STOP;
  this.state = '';
  this.states = {
    RUNNING: 'running',
    RAMPING: 'ramping',
    HOLDING: 'holding',
    OVERLOADED: 'overloaded',
    STATE_STALLED: 'stalled',
    NONE: ''
  };
  this.speed_sp = 0;

  // Update the visual appearance of the LED lens and point light
  this._updateVisual = function() {
    if (!self.lensMat) return;
    var r = self.color[0] / 255;
    var g = self.color[1] / 255;
    var b = self.color[2] / 255;

    // Unfreeze the material so property changes take effect
    // (The RTT system in ColorSensor freezes all mesh materials for optimization)
    self.lensMat.unfreeze();

    if (self.isOn) {
      self.lensMat.emissiveColor = new BABYLON.Color3(r, g, b);
      self.lensMat.diffuseColor = new BABYLON.Color3(r * 0.3, g * 0.3, b * 0.3);
    } else {
      self.lensMat.emissiveColor = new BABYLON.Color3(r * 0.05, g * 0.05, b * 0.05);
      self.lensMat.diffuseColor = new BABYLON.Color3(r * 0.2, g * 0.2, b * 0.2);
    }

    // Update point light
    if (self.light) {
      if (self.isOn) {
        self.light.diffuse = new BABYLON.Color3(r, g, b);
        self.light.intensity = 1.5;
      } else {
        self.light.intensity = 0;
      }
    }
  };

  this.runForever = function() {
    self.mode = self.modes.RUN;
    self.state = self.states.RUNNING;
    self.isOn = true;
    self._updateVisual();
  };

  this.runTimed = function() {
    self.mode = self.modes.RUN_TIL_TIME;
    self.state = self.states.RUNNING;
    self.isOn = true;
    self._updateVisual();
  };

  this.stop = function() {
    self.mode = self.modes.STOP;
    self.state = self.states.HOLDING;
    self.isOn = false;
    self._updateVisual();
  };

  this.reset = function() {
    self.isOn = false;
    self.mode = self.modes.STOP;
    self.state = self.states.HOLDING;
    self._updateVisual();
  };

  this.on = function() {
    self.isOn = true;
    self._updateVisual();
  };

  this.off = function() {
    self.isOn = false;
    self._updateVisual();
  };

  this.setColor = function(r, g, b) {
    self.color = [r, g, b];
    self._updateVisual();
  };

  this.setRange = function(range) {
    if (self.light) {
      self.light.range = Math.max(1, Math.min(range, 200));
    }
  };

  this.init = function() {
    self.setOptions(options);

    // Parse initial color from hex option
    var hex = self.options.color;
    self.color = [
      parseInt(hex.substring(0, 2), 16) || 255,
      parseInt(hex.substring(2, 4), 16) || 0,
      parseInt(hex.substring(4, 6), 16) || 0
    ];

    // Unique ID for material names
    var uid = port + '_' + Date.now();

    // Invisible physics container
    var body = BABYLON.MeshBuilder.CreateBox('ledBody_' + uid, {height: 2.0, width: 1, depth: 1}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;
    body.parent = parent;
    body.position = self.position;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);

    // LED base (cylindrical housing)
    var baseMat = new BABYLON.StandardMaterial('ledBase_' + uid, scene);
    baseMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.17);
    baseMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    var base = BABYLON.MeshBuilder.CreateCylinder('ledBaseMesh_' + uid, {
      height: 0.5,
      diameter: 0.8,
      tessellation: 20
    }, scene);
    base.material = baseMat;
    base.parent = body;
    base.position.y = -0.4;
    scene.shadowGenerator.addShadowCaster(base);

    // LED flange (small rim where base meets dome)
    var rimMat = new BABYLON.StandardMaterial('ledRim_' + uid, scene);
    rimMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.52);
    rimMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    var rim = BABYLON.MeshBuilder.CreateCylinder('ledRimMesh_' + uid, {
      height: 0.08,
      diameter: 0.92,
      tessellation: 20
    }, scene);
    rim.material = rimMat;
    rim.parent = body;
    rim.position.y = -0.12;
    scene.shadowGenerator.addShadowCaster(rim);

    // LED dome (rounded dome, slightly taller than hemispherical)
    self.lensMat = new BABYLON.StandardMaterial('ledLens_' + uid, scene);
    self.lensMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    self.lensMat.alpha = 1.0;
    self.lensMesh = BABYLON.MeshBuilder.CreateSphere('ledLensMesh_' + uid, {
      diameterX: 0.8,
      diameterY: 1.1,
      diameterZ: 0.8,
      segments: 20
    }, scene);
    self.lensMesh.material = self.lensMat;
    self.lensMesh.parent = body;
    self.lensMesh.position.y = 0.3;
    scene.shadowGenerator.addShadowCaster(self.lensMesh);

    // Point light (actual light source that illuminates surroundings)
    self.light = new BABYLON.PointLight('ledLight_' + uid, new BABYLON.Vector3(0, 0.6, 0), scene);
    self.light.parent = body;
    self.light.intensity = 0;
    self.light.range = 30;
    self.light.specular = new BABYLON.Color3(0.3, 0.3, 0.3);
    // Exclude the dome from the LED's own light so the dome shows its true material color
    self.light.excludedMeshes.push(self.lensMesh);

    // Connector pins (two wire legs)
    var pinMat = new BABYLON.StandardMaterial('ledPins_' + uid, scene);
    pinMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.78);
    pinMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    for (var p = -1; p <= 1; p += 2) {
      var pin = BABYLON.MeshBuilder.CreateCylinder('ledPin_' + uid + '_' + p, {height: 0.6, diameter: 0.06, tessellation: 8}, scene);
      pin.material = pinMat;
      pin.parent = body;
      pin.position.set(p * 0.15, -0.95, 0);
    }

    // Set initial dim (off) state
    self._updateVisual();
  };

  this.setOptions = function(options) {
    self.options = {
      color: 'FF0000'
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    // Visual updates are handled directly by on/off/setColor methods
    // This render function kept for compatibility with the component system
  };

  this.init();
}

// Display component - simulated screen showing text/numbers
function Display(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'Display';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  // Display state - 5 lines of text (0-4)
  this.lines = ['', '', '', '', ''];
  this.fontSize = 'medium';  // 'small', 'medium', 'large'
  this._debugId = 'Display_' + port + '_' + Date.now(); // For debugging object identity
  console.log('Display created:', this._debugId);
  this.textColor = [0, 255, 0];  // RGB - default green
  this.backgroundColor = [26, 26, 46];  // RGB - dark background

  // Animation state for each line
  this.animations = [null, null, null, null, null];
  // Animation types: { type: 'scroll'|'typewriter'|'blink', text: '', speed: 1, offset: 0, visible: true }

  // DynamicTexture for rendering text
  this.texture = null;
  this.textureWidth = 256;
  this.textureHeight = 128;
  this.lastRenderTime = 0;

  // Set text on a specific line (0-4)
  this.text = function(line, message) {
    if (line >= 0 && line < 5) {
      self.lines[line] = String(message);
      self.animations[line] = null; // Cancel any animation on this line
      console.log('Display.text() on', self._debugId, ': line=' + line + ', message="' + message + '"');
      self._updateTexture();
    }
  };

  // Clear all lines or a specific line
  this.clear = function(line) {
    if (typeof line === 'undefined') {
      self.lines = ['', '', '', '', ''];
      self.animations = [null, null, null, null, null];
    } else if (line >= 0 && line < 5) {
      self.lines[line] = '';
      self.animations[line] = null;
    }
    self._updateTexture();
  };

  // Scrolling marquee text effect
  this.scrollText = function(line, message, speed) {
    if (line >= 0 && line < 5) {
      speed = (typeof speed !== 'undefined') ? speed : 50; // pixels per second
      self.lines[line] = '';
      self.animations[line] = {
        type: 'scroll',
        text: String(message) + '     ', // Add spacing for loop
        speed: speed,
        offset: 0
      };
      self._updateTexture();
    }
  };

  // Typewriter effect - text appears character by character
  this.typewriter = function(line, message, speed) {
    if (line >= 0 && line < 5) {
      speed = (typeof speed !== 'undefined') ? speed : 10; // characters per second
      self.lines[line] = '';
      self.animations[line] = {
        type: 'typewriter',
        text: String(message),
        speed: speed,
        charIndex: 0,
        lastCharTime: 0
      };
      self._updateTexture();
    }
  };

  // Blinking text effect
  this.blink = function(line, message, onTime, offTime) {
    if (line >= 0 && line < 5) {
      onTime = (typeof onTime !== 'undefined') ? onTime : 500; // ms
      offTime = (typeof offTime !== 'undefined') ? offTime : 500; // ms
      self.lines[line] = String(message);
      self.animations[line] = {
        type: 'blink',
        text: String(message),
        onTime: onTime,
        offTime: offTime,
        visible: true,
        lastToggle: 0
      };
      self._updateTexture();
    }
  };

  // Stop animation on a line (keep current text)
  this.stopAnimation = function(line) {
    if (line >= 0 && line < 5 && self.animations[line]) {
      // Keep the current displayed text
      self.animations[line] = null;
    }
  };

  // Set font size ('small', 'medium', 'large')
  this.setFont = function(size) {
    if (['small', 'medium', 'large'].indexOf(size) !== -1) {
      self.fontSize = size;
      self._updateTexture();
    }
  };

  // Set text color (RGB)
  this.setTextColor = function(r, g, b) {
    self.textColor = [
      Math.max(0, Math.min(255, r)),
      Math.max(0, Math.min(255, g)),
      Math.max(0, Math.min(255, b))
    ];
    self._updateTexture();
  };

  // Get all lines (for sensor panel display)
  this.getLines = function() {
    return self.lines.slice();
  };

  // Reset display to initial state
  this.reset = function() {
    self.lines = ['', '', '', '', ''];
    self.fontSize = 'medium';
    self.textColor = [0, 255, 0];
    self._updateTexture();
  };

  // Update the DynamicTexture with current text
  this._updateTexture = function() {
    if (!self.texture) return;

    var ctx = self.texture.getContext();
    var w = self.textureWidth;
    var h = self.textureHeight;

    // Clear with background color
    ctx.fillStyle = 'rgb(' + self.backgroundColor[0] + ',' + self.backgroundColor[1] + ',' + self.backgroundColor[2] + ')';
    ctx.fillRect(0, 0, w, h);

    // Set text properties
    var fontSizes = { small: 14, medium: 18, large: 24 };
    var lineHeight = fontSizes[self.fontSize] + 4;
    ctx.font = fontSizes[self.fontSize] + 'px monospace';
    ctx.fillStyle = 'rgb(' + self.textColor[0] + ',' + self.textColor[1] + ',' + self.textColor[2] + ')';
    ctx.textBaseline = 'top';

    // Draw each line
    var startY = 6;
    var textX = 8;
    var maxWidth = w - 16; // Clipping width

    for (var i = 0; i < 5; i++) {
      var anim = self.animations[i];
      var y = startY + (i * lineHeight);

      if (anim && anim.type === 'scroll') {
        // Scrolling marquee effect
        ctx.save();
        ctx.beginPath();
        ctx.rect(textX, y - 2, maxWidth, lineHeight);
        ctx.clip();

        var textWidth = ctx.measureText(anim.text).width;
        var scrollX = textX - anim.offset;

        // Draw text and its repeat for seamless scrolling
        ctx.fillText(anim.text, scrollX, y);
        if (scrollX + textWidth < w) {
          ctx.fillText(anim.text, scrollX + textWidth, y);
        }

        ctx.restore();
      } else if (anim && anim.type === 'typewriter') {
        // Typewriter effect - show partial text
        var partialText = anim.text.substring(0, Math.floor(anim.charIndex));
        ctx.fillText(partialText, textX, y);

        // Draw cursor (blinking underscore)
        if (anim.charIndex < anim.text.length && Date.now() % 500 < 250) {
          var cursorX = textX + ctx.measureText(partialText).width;
          ctx.fillText('_', cursorX, y);
        }
      } else if (anim && anim.type === 'blink') {
        // Blinking effect
        if (anim.visible) {
          ctx.fillText(anim.text, textX, y);
        }
      } else {
        // Normal static text
        ctx.fillText(self.lines[i], textX, y);
      }
    }

    self.texture.update();
  };

  this.init = function() {
    self.setOptions(options);

    var uid = port + '_' + Date.now();

    // Invisible physics body
    var body = BABYLON.MeshBuilder.CreateBox('displayBody_' + uid, {height: 2.0, width: 3.0, depth: 0.4}, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;
    body.parent = parent;
    body.position = self.position;
    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);

    // Housing (dark plastic frame)
    var housingMat = new BABYLON.StandardMaterial('displayHousing_' + uid, scene);
    housingMat.diffuseColor = new BABYLON.Color3(0.12, 0.12, 0.14);
    housingMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    var housing = BABYLON.MeshBuilder.CreateBox('displayHousingMesh_' + uid, {
      height: 2.0,
      width: 3.0,
      depth: 0.35
    }, scene);
    housing.material = housingMat;
    housing.parent = body;
    housing.position.z = -0.02;
    scene.shadowGenerator.addShadowCaster(housing);

    // Screen bezel (slightly recessed frame around screen)
    var bezelMat = new BABYLON.StandardMaterial('displayBezel_' + uid, scene);
    bezelMat.diffuseColor = new BABYLON.Color3(0.08, 0.08, 0.10);
    bezelMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    var bezel = BABYLON.MeshBuilder.CreateBox('displayBezelMesh_' + uid, {
      height: 1.7,
      width: 2.7,
      depth: 0.08
    }, scene);
    bezel.material = bezelMat;
    bezel.parent = body;
    bezel.position.z = 0.14;
    scene.shadowGenerator.addShadowCaster(bezel);

    // Create DynamicTexture for the screen
    self.texture = new BABYLON.DynamicTexture('displayTexture_' + uid, {width: self.textureWidth, height: self.textureHeight}, scene, false);
    var screenMat = new BABYLON.StandardMaterial('displayScreen_' + uid, scene);
    screenMat.diffuseTexture = self.texture;
    screenMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    screenMat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    // Screen plane (the actual display surface)
    var screen = BABYLON.MeshBuilder.CreatePlane('displayScreenMesh_' + uid, {
      height: 1.5,
      width: 2.5
    }, scene);
    screen.material = screenMat;
    screen.parent = body;
    screen.position.z = 0.19;
    screen.rotation.y = Math.PI; // Face forward
    scene.shadowGenerator.addShadowCaster(screen);

    // Power LED indicator (small green dot)
    var ledMat = new BABYLON.StandardMaterial('displayLed_' + uid, scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    ledMat.emissiveColor = new BABYLON.Color3(0.1, 0.5, 0.1);
    var led = BABYLON.MeshBuilder.CreateSphere('displayLedMesh_' + uid, {
      diameter: 0.1,
      segments: 8
    }, scene);
    led.material = ledMat;
    led.parent = body;
    led.position.set(-1.35, -0.85, 0.15);

    // Corner accents (small cylinders at corners for visual interest)
    var accentMat = new BABYLON.StandardMaterial('displayAccent_' + uid, scene);
    accentMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.32);
    var cornerPositions = [
      [-1.4, 0.9], [1.4, 0.9], [-1.4, -0.9], [1.4, -0.9]
    ];
    for (var c = 0; c < cornerPositions.length; c++) {
      var accent = BABYLON.MeshBuilder.CreateCylinder('displayAccent_' + uid + '_' + c, {
        height: 0.38,
        diameter: 0.12,
        tessellation: 8
      }, scene);
      accent.material = accentMat;
      accent.parent = body;
      accent.rotation.x = Math.PI / 2;
      accent.position.set(cornerPositions[c][0], cornerPositions[c][1], 0.01);
    }

    // Initialize texture with test content (for debugging)
    self.lines[0] = 'Display Ready';
    self._updateTexture();
  };

  this.setOptions = function(options) {
    self.options = {
      width: 3.0,
      height: 2.0,
      depth: 0.4,
      textColor: '00FF00',
      backgroundColor: '1A1A2E'
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }

    // Parse text color from hex
    var hex = self.options.textColor;
    self.textColor = [
      parseInt(hex.substring(0, 2), 16) || 0,
      parseInt(hex.substring(2, 4), 16) || 255,
      parseInt(hex.substring(4, 6), 16) || 0
    ];

    // Parse background color from hex
    var bgHex = self.options.backgroundColor;
    self.backgroundColor = [
      parseInt(bgHex.substring(0, 2), 16) || 26,
      parseInt(bgHex.substring(2, 4), 16) || 26,
      parseInt(bgHex.substring(4, 6), 16) || 46
    ];
  };

  this.render = function(delta) {
    var now = Date.now();
    var hasActiveAnimation = false;

    // Update each animation
    for (var i = 0; i < 5; i++) {
      var anim = self.animations[i];
      if (!anim) continue;

      hasActiveAnimation = true;

      if (anim.type === 'scroll') {
        // Advance scroll offset
        anim.offset += (anim.speed * delta / 1000);

        // Measure text width for wrap-around
        if (self.texture) {
          var ctx = self.texture.getContext();
          var fontSizes = { small: 14, medium: 18, large: 24 };
          ctx.font = fontSizes[self.fontSize] + 'px monospace';
          var textWidth = ctx.measureText(anim.text).width;

          // Reset when fully scrolled
          if (anim.offset >= textWidth) {
            anim.offset = 0;
          }
        }
        // Update lines for sensor panel display (show truncated scrolling text)
        self.lines[i] = '\u25B6 ' + anim.text.trim(); // Show play symbol + text
      } else if (anim.type === 'typewriter') {
        // Advance character index
        if (anim.charIndex < anim.text.length) {
          var charDelay = 1000 / anim.speed;
          if (now - anim.lastCharTime >= charDelay) {
            anim.charIndex++;
            anim.lastCharTime = now;
            // Update displayed line for sensor panel
            self.lines[i] = anim.text.substring(0, Math.floor(anim.charIndex));
          }
        }
      } else if (anim.type === 'blink') {
        // Toggle visibility
        var interval = anim.visible ? anim.onTime : anim.offTime;
        if (now - anim.lastToggle >= interval) {
          anim.visible = !anim.visible;
          anim.lastToggle = now;
          // Update displayed line for sensor panel
          self.lines[i] = anim.visible ? anim.text : '';
        }
      }
    }

    // Only update texture if there are active animations
    if (hasActiveAnimation) {
      self._updateTexture();
    }
  };

  this.init();
}

// Touch sensor
function TouchSensor(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'TouchSensor';
  this.port = port;
  this.options = null;

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  this.pressed = false;

  this.init = function() {
    self.setOptions(options);

    // Main body - invisible physics container
    let bodyOptions = {
      height: 2,
      width: self.options.width,
      depth: self.options.depth
    };
    var body = BABYLON.MeshBuilder.CreateBox('touchSensorBody', bodyOptions, scene);
    self.body = body;
    body.component = self;
    body.visibility = 0;
    body.isPickable = false;

    body.physicsImpostor = new BABYLON.PhysicsImpostor(
      body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      scene
    );
    body.parent = parent;

    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);

    // Metal bracket housing (dark gray)
    var bracketMat = new BABYLON.StandardMaterial('touchBracket', scene);
    bracketMat.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.38);
    bracketMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    var bracket = BABYLON.MeshBuilder.CreateBox('touchBracketMesh', {
      height: 1.8,
      width: self.options.width - 0.1,
      depth: self.options.depth - 0.1
    }, scene);
    bracket.material = bracketMat;
    bracket.parent = body;
    bracket.position.y = 0.1;
    scene.shadowGenerator.addShadowCaster(bracket);

    // Mounting plate (top)
    var plateMat = new BABYLON.StandardMaterial('touchPlate', scene);
    plateMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.43);
    plateMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    var plate = BABYLON.MeshBuilder.CreateBox('touchPlateMesh', {
      height: 0.2,
      width: self.options.width + 0.2,
      depth: self.options.depth + 0.2
    }, scene);
    plate.material = plateMat;
    plate.parent = body;
    plate.position.y = 0.9;
    scene.shadowGenerator.addShadowCaster(plate);

    // Mounting holes (dark circles on plate)
    var holeMat = new BABYLON.StandardMaterial('touchHole', scene);
    holeMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.18);
    var holePositions = [
      [-self.options.width/2 + 0.3, -self.options.depth/2 + 0.3],
      [self.options.width/2 - 0.3, -self.options.depth/2 + 0.3],
      [-self.options.width/2 + 0.3, self.options.depth/2 - 0.3],
      [self.options.width/2 - 0.3, self.options.depth/2 - 0.3]
    ];
    for (var h = 0; h < holePositions.length; h++) {
      var hole = BABYLON.MeshBuilder.CreateCylinder('touchHole' + h, {height: 0.05, diameter: 0.25, tessellation: 8}, scene);
      hole.material = holeMat;
      hole.parent = body;
      hole.position.set(holePositions[h][0], 1.01, holePositions[h][1]);
    }

    // Spring mechanism (visible coils between bracket and button)
    var springMat = new BABYLON.StandardMaterial('touchSpring', scene);
    springMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.62);
    springMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    var spring = BABYLON.MeshBuilder.CreateCylinder('touchSpring', {
      height: 0.5,
      diameter: 0.5,
      tessellation: 8
    }, scene);
    spring.material = springMat;
    spring.parent = body;
    spring.position.y = -0.7;

    // Button pad (red, functional - keeps same position)
    var buttonMat = new BABYLON.StandardMaterial('touchButton', scene);
    buttonMat.diffuseColor = new BABYLON.Color3(0.85, 0.12, 0.12);
    buttonMat.specularColor = new BABYLON.Color3(0.4, 0.1, 0.1);
    let sensorOptions = {
      height: 0.6,
      width: self.options.width - 0.3,
      depth: self.options.depth - 0.3
    };
    self.fakeSensor = BABYLON.MeshBuilder.CreateBox('touchSensorBodyFake', sensorOptions, scene);
    self.fakeSensor.material = buttonMat;
    self.fakeSensor.position.y = -1.4;
    self.fakeSensor.parent = body;
    scene.shadowGenerator.addShadowCaster(self.fakeSensor);

    // Button edge bevel (dark rim around button)
    var rimMat = new BABYLON.StandardMaterial('touchRim', scene);
    rimMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.22);
    var rim = BABYLON.MeshBuilder.CreateBox('touchRim', {
      height: 0.15,
      width: self.options.width - 0.15,
      depth: self.options.depth - 0.15
    }, scene);
    rim.material = rimMat;
    rim.parent = body;
    rim.position.y = -1.05;

    // Real sensor is invisible, but with a physics body
    self.realSensor = BABYLON.MeshBuilder.CreateBox('touchSensorBodyReal', sensorOptions, scene);
    self.realSensor.material = buttonMat;
    self.realSensor.isVisible = false;
    self.realSensor.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.realSensor,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 0
      },
      scene
    );
    self.realSensor.physicsImpostor.physicsBody.setCollisionFlags(4);

    self.realSensor.physicsImpostor.registerBeforePhysicsStep(function(){
      self.realSensor.position = self.fakeSensor.getAbsolutePosition();
      self.realSensor.rotationQuaternion = self.fakeSensor.absoluteRotationQuaternion;
      self.realSensor.physicsImpostor.forceUpdate();
      self.realSensor.physicsImpostor.physicsBody.setCollisionFlags(4);
      self.pressed = false;
    });
  };

  this.loadMeshes = function(meshes) {
    meshes.forEach(function(mesh){
      if (mesh.parent != null || mesh == parent || mesh == self.realSensor) return;
      if (mesh.physicsImpostor) {
        self.realSensor.physicsImpostor.registerOnPhysicsCollide(mesh.physicsImpostor, function(own, other){
          self.pressed = true;
        });
      }
    });
  }

  this.setOptions = function(options) {
    self.options = {
      width: 2,
      depth: 2
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.isPressed = function() {
    return self.pressed;
  };

  this.init();
}

// Motorized linear
function LinearActuator(scene, parent, pos, rot, port, options) {
  var self = this;

  this.type = 'LinearActuator';
  this.port = port;
  this.options = null;

  this.components = [];

  this.bodyPosition = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  // Used in Python
  this.modes = {
    STOP: 1,
    RUN: 2,
    RUN_TO_POS: 3,
    RUN_TIL_TIME: 4
  };
  this.mode = this.modes.STOP;

  this.state = 'holding';
  this.states = {
    RUNNING: 'running',
    RAMPING: 'ramping',
    HOLDING: 'holding',
    OVERLOADED: 'overloaded',
    STATE_STALLED: 'stalled',
    NONE: ''
  };

  this.speed = 0;
  this.speed_sp = 30;
  this.position_sp = 0;
  this.position_target = 0;
  this.position = 0;
  this.prevPosition = 0;
  this.positionAdjustment = 0;
  this.prevRotation = 0;
  this.rotationRounds = 0;
  this.positionDirectionReversed = false;

  this.runTimed = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN_TIL_TIME;
    self.state = self.states.RUNNING;
  };

  this.runToPosition = function() {
    if (self.position_target < self.position) {
      self.positionDirectionReversed = true;
    } else {
      self.positionDirectionReversed = false;
    }
    self.mode = self.modes.RUN_TO_POS;
    self.state = self.states.RUNNING;
  };

  this.runForever = function() {
    self.positionDirectionReversed = false;
    self.mode = self.modes.RUN;
    self.state = self.states.RUNNING;
  };

  this.stop = function() {
    self.mode = self.modes.STOP;
    self.position_target = self.position;
    self.state = self.states.HOLDING;
  };

  this.reset = function() {
    self.positionAdjustment += self.position;
    self.position = 0;
    self.prevPosition = 0;
    self.position_target = 0;
    self.mode = self.modes.STOP;
    self.state = self.states.HOLDING;
  };

  // Used in JS
  this.init = function() {
    function getPhysicsParent(mesh) {
      if (mesh.parent != null) {
        return getPhysicsParent(mesh.parent);
      } else {
        return mesh;
      }
    }
    parent = getPhysicsParent(parent);

    self.setOptions(options);

    // Dark metallic housing material
    var mainBodyMat = new BABYLON.StandardMaterial('linearBody', scene);
    mainBodyMat.diffuseColor = new BABYLON.Color3(0.22, 0.22, 0.25);
    mainBodyMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.45);

    var body = BABYLON.MeshBuilder.CreateBox('sliderBody', {height: self.options.width, width: self.options.baseLength, depth: self.options.baseThickness}, scene);
    self.body = body;
    body.component = self;
    self.body.material = mainBodyMat;
    body.parent = parent;
    body.position = self.bodyPosition;
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
    scene.shadowGenerator.addShadowCaster(body);

    // Guide channel (groove on top of rail)
    var grooveMat = new BABYLON.StandardMaterial('linearGroove', scene);
    grooveMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.17);
    grooveMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    var groove = BABYLON.MeshBuilder.CreateBox('linearGroove', {height: self.options.width * 0.4, width: self.options.baseLength * 0.85, depth: self.options.baseThickness * 0.3}, scene);
    groove.material = grooveMat;
    groove.parent = body;
    groove.position.z = self.options.baseThickness * 0.4;
    scene.shadowGenerator.addShadowCaster(groove);

    // Lead screw (silver rod through center)
    var screwMat = new BABYLON.StandardMaterial('linearScrew', scene);
    screwMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.78);
    screwMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    var screw = BABYLON.MeshBuilder.CreateCylinder('linearScrew', {height: self.options.baseLength * 0.9, diameter: self.options.width * 0.15, tessellation: 10}, scene);
    screw.material = screwMat;
    screw.rotation.z = Math.PI / 2;
    screw.parent = body;
    screw.position.z = self.options.baseThickness * 0.25;
    scene.shadowGenerator.addShadowCaster(screw);

    // Guide rails (two thin rods along sides)
    var railMat = new BABYLON.StandardMaterial('linearRails', scene);
    railMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.63);
    railMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    for (var r = 0; r < 2; r++) {
      var rail = BABYLON.MeshBuilder.CreateCylinder('linearRail' + r, {height: self.options.baseLength * 0.95, diameter: self.options.width * 0.08, tessellation: 8}, scene);
      rail.material = railMat;
      rail.rotation.z = Math.PI / 2;
      rail.parent = body;
      rail.position.y = (r === 0 ? 1 : -1) * self.options.width * 0.35;
      rail.position.z = self.options.baseThickness * 0.3;
      scene.shadowGenerator.addShadowCaster(rail);
    }

    // Motor end cap (darker cylinder on one end)
    var motorMat = new BABYLON.StandardMaterial('linearMotor', scene);
    motorMat.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.18);
    motorMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.35);
    var motor = BABYLON.MeshBuilder.CreateCylinder('linearMotor', {height: self.options.width * 0.6, diameter: self.options.width * 0.8, tessellation: 12}, scene);
    motor.material = motorMat;
    motor.rotation.z = Math.PI / 2;
    motor.parent = body;
    motor.position.x = -self.options.baseLength * 0.45;
    motor.position.z = self.options.baseThickness * 0.15;
    scene.shadowGenerator.addShadowCaster(motor);

    // Motor ventilation ring
    var ventMat = new BABYLON.StandardMaterial('linearVent', scene);
    ventMat.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.38);
    ventMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    var vent = BABYLON.MeshBuilder.CreateTorus('linearVent', {diameter: self.options.width * 0.7, thickness: 0.08, tessellation: 16}, scene);
    vent.material = ventMat;
    vent.rotation.z = Math.PI / 2;
    vent.parent = body;
    vent.position.x = -self.options.baseLength * 0.5;
    vent.position.z = self.options.baseThickness * 0.15;

    // Status LED (green) on motor end
    var ledMat = new BABYLON.StandardMaterial('linearLED', scene);
    ledMat.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    ledMat.emissiveColor = new BABYLON.Color3(0.05, 0.3, 0.05);
    var led = BABYLON.MeshBuilder.CreateCylinder('linearLED', {height: 0.1, diameter: 0.2, tessellation: 8}, scene);
    led.material = ledMat;
    led.parent = body;
    led.position.set(-self.options.baseLength * 0.4, self.options.width * 0.35, self.options.baseThickness * 0.5);

    // Connector pins (brass) on back of motor
    var pinMat = new BABYLON.StandardMaterial('linearPins', scene);
    pinMat.diffuseColor = new BABYLON.Color3(0.83, 0.69, 0.22);
    pinMat.specularColor = new BABYLON.Color3(0.9, 0.8, 0.4);
    for (var p = 0; p < 3; p++) {
      var pin = BABYLON.MeshBuilder.CreateBox('linearPin' + p, {height: 0.12, width: 0.08, depth: 0.4}, scene);
      pin.material = pinMat;
      pin.parent = body;
      pin.position.set(-self.options.baseLength * 0.45, -self.options.width * 0.25 + p * self.options.width * 0.25, -self.options.baseThickness * 0.55);
    }

    // Darker metallic carriage material
    var platformMat = new BABYLON.StandardMaterial('linearPlatform', scene);
    platformMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.33);
    platformMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.55);

    var platform = BABYLON.MeshBuilder.CreateBox('platform', {height: self.options.width, width: self.options.platformLength, depth: self.options.platformThickness}, scene);;
    self.platform = platform;
    platform.component = self;
    self.end = platform;
    platform.material = platformMat;

    platform.parent = parent;
    platform.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL)
    platform.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL)
    platform.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL)
    platform.position = self.bodyPosition.clone();
    platform.translate(BABYLON.Axis.Z, (self.options.baseThickness + self.options.platformThickness) / 2, BABYLON.Space.LOCAL);
    platform.translate(BABYLON.Axis.X, self.options.startPos, BABYLON.Space.LOCAL);
    parent.removeChild(platform);
    scene.shadowGenerator.addShadowCaster(platform);

    self.positionAdjustment = self.options.startPos * self.options.degreesPerCm;
  };

  this.loadImpostor = function() {
    self.body.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.body,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: 0,
      },
      scene
    );
    self.platform.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.platform,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: self.options.mass,
        restitution: self.options.restitution,
        friction: self.options.friction
      },
      scene
    );
  };

  this.loadJoints = function() {
    let axis1 = new Ammo.btTransform();
    let axis2 = new Ammo.btTransform();

    axis1.setIdentity();
    axis2.setIdentity();

    let offset = new BABYLON.Vector3(0, 0, (self.options.baseThickness + self.options.platformThickness) / 2 + 0.01);
    offset.rotateByQuaternionToRef(self.body.rotationQuaternion, offset);

    axis1.setOrigin(new Ammo.btVector3(
      self.body.position.x + offset.x,
      self.body.position.y + offset.y,
      self.body.position.z + offset.z
    )); 

    let babylonQuaternion = BABYLON.Quaternion.FromEulerAngles(self.rotation.x, self.rotation.y, self.rotation.z);
    let ammoQuaternion = new Ammo.btQuaternion();
    ammoQuaternion.setValue(babylonQuaternion.x, babylonQuaternion.y, babylonQuaternion.z, babylonQuaternion.w);
    axis1.setRotation(ammoQuaternion);

    self.joint = new Ammo.btSliderConstraint(self.body.parent.physicsImpostor.physicsBody, self.platform.physicsImpostor.physicsBody, axis1, axis2, true);

    self.joint.setLowerAngLimit(0);
    self.joint.setUpperAngLimit(0);
    self.joint.setLowerLinLimit(0);
    self.joint.setUpperLinLimit(0);

    let physicsWorld = babylon.scene.getPhysicsEngine().getPhysicsPlugin().world;
    physicsWorld.addConstraint(self.joint);

    self.setPosition();
  };

  this.setOptions = function(options) {
    self.options = {
      mass: 100,
      restitution: 0.1,
      friction: 1,
      degreesPerCm: 360,
      width: 2,
      baseLength: 5,
      baseThickness: 1,
      baseColor: 'A39C0D',
      platformLength: 2,
      platformThickness: 1,
      platformColor: '808080',
      max: 10,
      min: -10,
      startPos: 0,
      components: []
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.render = function(delta) {
    if (self.mode == self.modes.RUN) {
      self.processSpeed(delta);
      self.setPosition();
    } else if (self.mode == self.modes.RUN_TIL_TIME) {
      self.processSpeed(delta);
      self.setPosition();
      if (Date.now() > self.time_target) {
        self.stop();
      }
    } else if (self.mode == self.modes.RUN_TO_POS) {
      self.processSpeed(delta);
      self.setPosition();
      if (
        (self.positionDirectionReversed == false && self.position >= self.position_target) ||
        (self.positionDirectionReversed && self.position <= self.position_target)
      ) {
        self.position = self.position_target;
        self.setPosition();
        self.stop();
      }
    } else if (self.mode == self.modes.STOP) {
      // Don't need to do anything, it always holds
    }

    self.components.forEach(function(component) {
      if (typeof component.render == 'function') {
        component.render(delta);
      }
    });
  };

  this.setPosition = function() {
    let linearPos = (self.position + self.positionAdjustment) / self.options.degreesPerCm;

    self.joint.setLowerLinLimit(linearPos);
    self.joint.setUpperLinLimit(linearPos);
  };

  this.processSpeed = function(delta) {
    let positionDelta = self.speed_sp * delta / 1000;
    if (self.positionDirectionReversed) {
      positionDelta = -positionDelta;
    }
    self.position += positionDelta;

    if ((self.position + self.positionAdjustment) > (self.options.max * self.options.degreesPerCm)) {
      self.position = (self.options.max * self.options.degreesPerCm) - self.positionAdjustment;
    } else if ((self.position + self.positionAdjustment) < (self.options.min * self.options.degreesPerCm)) {
      self.position = (self.options.min * self.options.degreesPerCm) - self.positionAdjustment;
    }
  };

  this.init();
}

// Passive wheel
function WheelPassive(scene, parent, pos, rot, options) {
  var self = this;

  this.parent = parent;

  this.type = 'WheelPassive';
  this.options = null;

  this.components = [];

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    var wheelMat = scene.getMaterialByID('wheelPassive');
    if (wheelMat == null) {
      var wheelMat = new BABYLON.StandardMaterial('wheelPassive', scene);
      var wheelTexture = new BABYLON.Texture('textures/robot/wheelPassive.png', scene);
      wheelMat.diffuseTexture = wheelTexture;
      wheelMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      wheelMat.freeze();
    }

    var faceUV = new Array(3);
    faceUV[0] = new BABYLON.Vector4(0, 0, 200/828, 1);
    faceUV[1] = new BABYLON.Vector4(200/828, 3/4, 1, 1);
    faceUV[2] = new BABYLON.Vector4(0, 0, 200/828, 1);
    let wheelOptions = {
      height: self.options.width,
      diameter: self.options.diameter,
      tessellation: 24,
      faceUV: faceUV
    };

    self.mesh = BABYLON.MeshBuilder.CreateCylinder('wheelPassive', wheelOptions, scene);
    self.body = self.mesh;
    self.end = self.mesh;
    self.body.component = self;
    self.mesh.material = wheelMat;
    
    self.mesh.parent = parent;
    self.mesh.position = self.position;
    self.mesh.rotation.z = -Math.PI / 2;
    self.mesh.rotate(BABYLON.Axis.Y, rot[1], BABYLON.Space.LOCAL);
    self.mesh.rotate(BABYLON.Axis.X, rot[0], BABYLON.Space.LOCAL);
    self.mesh.rotate(BABYLON.Axis.Z, rot[2], BABYLON.Space.LOCAL);
    parent.removeChild(self.mesh);

    scene.shadowGenerator.addShadowCaster(self.mesh);
  };

  this.loadImpostor = function(){
    self.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      self.mesh,
      BABYLON.PhysicsImpostor.CylinderImpostor,
      {
        mass: options.mass,
        restitution: options.restitution,
        friction: options.friction
      },
      scene
    );
  };

  this.loadJoints = function(){
    var wheel2world = self.mesh.absoluteRotationQuaternion;
    
    let zero = BABYLON.Vector3.Zero();
    var world2body = parent.absoluteRotationQuaternion;
    world2body = BABYLON.Quaternion.Inverse(world2body);

    var mainPivot = self.mesh.position.subtract(parent.position);
    mainPivot.rotateByQuaternionAroundPointToRef(world2body, zero, mainPivot);

    var mainAxis = new BABYLON.Vector3(0, 1, 0);
    mainAxis.rotateByQuaternionAroundPointToRef(wheel2world, zero, mainAxis);
    mainAxis.rotateByQuaternionAroundPointToRef(world2body, zero, mainAxis);

    self.wheelVector = new BABYLON.Vector3(1,0,0);
    self.bodyVector = new BABYLON.Vector3(0,0,0);
    self.wheelVector.rotateByQuaternionAroundPointToRef(wheel2world, zero, self.bodyVector);
    self.bodyVector.rotateByQuaternionAroundPointToRef(world2body, zero, self.bodyVector);
    self.normalVector = new BABYLON.Vector3(0,1,0)

    self.joint = new BABYLON.HingeJoint({
      mainPivot: mainPivot,
      connectedPivot: new BABYLON.Vector3(0, 0, 0),
      mainAxis: mainAxis,
      connectedAxis: new BABYLON.Vector3(0, 1, 0),
    });
    parent.physicsImpostor.addJoint(self.mesh.physicsImpostor, self.joint);
  };

  this.setOptions = function(options) {
    self.options = {
      diameter: 5.6,
      width: 0.8,
      mass: 200,
      friction: 10,
      restitution: 0.8,
      components: []
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.init();
}

// Decorative 3D model component (visual only, no physics)
function DecorativeModel(scene, parent, pos, rot, options) {
  var self = this;

  this.type = 'DecorativeModel';
  this.options = null;
  this.components = [];

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    // Create a small placeholder box as the component body for selection/positioning
    var bodyMat = babylon.getMaterial(scene, self.options.color);
    let bodyOptions = {
      height: 1,
      width: 1,
      depth: 1
    };
    var body = BABYLON.MeshBuilder.CreateBox('decorativeModel', bodyOptions, scene);
    self.body = body;
    self.end = body;
    body.component = self;
    body.material = bodyMat;

    body.parent = parent;
    body.position = self.position;
    body.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    body.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);

    // Load the 3D model if URL is provided
    if (self.options.modelURL && self.options.modelURL !== '') {
      body.visibility = 0; // Hide placeholder
      // Detect file extension from full URL (handles file.php?file=model.glb patterns)
      var modelUrl = self.options.modelURL;
      var urlForExt = modelUrl.split('#')[0];
      var pluginExt = urlForExt.substring(urlForExt.lastIndexOf('.')).toLowerCase();
      BABYLON.SceneLoader.ImportMeshAsync(null, '', modelUrl, scene, null, pluginExt).then(function(results) {
        var meshes = results.meshes;
        meshes[0].scaling.setAll(self.options.modelScale || 1);
        // Apply model rotation if specified (in degrees)
        if (self.options.modelRotation && self.options.modelRotation.length === 3) {
          var degToRad = Math.PI / 180;
          meshes[0].rotation.x = self.options.modelRotation[0] * degToRad;
          meshes[0].rotation.y = self.options.modelRotation[1] * degToRad;
          meshes[0].rotation.z = self.options.modelRotation[2] * degToRad;
        }
        // Apply color to meshes without materials (e.g. STL files)
        meshes.forEach(function(m) {
          if (!m.material) {
            m.material = bodyMat;
          }
        });
        meshes[0].parent = body;
        scene.shadowGenerator.addShadowCaster(meshes[0]);
        self.model = meshes[0];
      }).catch(function(err) {
        console.log('Failed to load decorative model:', err);
        body.visibility = 1; // Show placeholder on failure
      });
    } else {
      scene.shadowGenerator.addShadowCaster(body);
    }
  };

  this.setOptions = function(options) {
    self.options = {
      modelURL: '',
      modelScale: 1,
      modelRotation: null,
      color: 'CCCCCC'
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.reset = function() {};
  this.render = function(delta) {};

  this.init();
}

// 4-AA Battery Pack component (visual, no physics)
function BatteryPack(scene, parent, pos, rot, options) {
  var self = this;

  this.type = 'BatteryPack';
  this.options = null;
  this.components = [];

  this.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);

  this.init = function() {
    self.setOptions(options);

    var holderMat = babylon.getMaterial(scene, self.options.holderColor);

    // Main holder box
    var holder = BABYLON.MeshBuilder.CreateBox('batteryHolder', {
      width: self.options.holderWidth,
      height: self.options.holderHeight,
      depth: self.options.holderDepth
    }, scene);
    self.body = holder;
    self.end = holder;
    holder.component = self;
    holder.material = holderMat;
    scene.shadowGenerator.addShadowCaster(holder);

    holder.parent = parent;
    holder.position = self.position;
    holder.rotate(BABYLON.Axis.X, self.rotation.x, BABYLON.Space.LOCAL);
    holder.rotate(BABYLON.Axis.Y, self.rotation.y, BABYLON.Space.LOCAL);
    holder.rotate(BABYLON.Axis.Z, self.rotation.z, BABYLON.Space.LOCAL);

    // Individual scale is now handled centrally in Robot.js loadComponents()

    // Battery materials
    var batteryMat = babylon.getMaterial(scene, self.options.batteryColor);
    var terminalMat = babylon.getMaterial(scene, self.options.terminalColor);
    var negativeMat = babylon.getMaterial(scene, self.options.negativeColor);

    var batteryDiam = self.options.batteryDiameter;
    var batteryLen = self.options.batteryLength;

    // 4 batteries in a row across the holder width
    var totalBatteries = 4;
    var spacing = self.options.holderWidth / (totalBatteries + 1);

    for (var i = 0; i < totalBatteries; i++) {
      // Battery cylinder (rotated to lay along depth axis)
      var battery = BABYLON.MeshBuilder.CreateCylinder('battery' + i, {
        height: batteryLen,
        diameter: batteryDiam,
        tessellation: 16
      }, scene);
      battery.material = batteryMat;
      battery.parent = holder;

      var xPos = -self.options.holderWidth / 2 + spacing * (i + 1);
      battery.position.x = xPos;
      battery.position.y = self.options.holderHeight * 0.15;
      battery.rotation.x = Math.PI / 2; // lay on side along Z

      scene.shadowGenerator.addShadowCaster(battery);

      // Positive terminal bump
      var terminal = BABYLON.MeshBuilder.CreateCylinder('battTerminal' + i, {
        height: 0.15,
        diameter: batteryDiam * 0.3,
        tessellation: 12
      }, scene);
      terminal.material = terminalMat;
      terminal.parent = battery;
      terminal.position.y = batteryLen / 2 + 0.075;

      // Negative flat cap
      var negCap = BABYLON.MeshBuilder.CreateCylinder('battNegCap' + i, {
        height: 0.08,
        diameter: batteryDiam * 0.65,
        tessellation: 12
      }, scene);
      negCap.material = negativeMat;
      negCap.parent = battery;
      negCap.position.y = -(batteryLen / 2 + 0.04);
    }

    // Holder lip/rim on two long sides (thin raised edges)
    var rimMat = babylon.getMaterial(scene, self.options.holderColor);
    var rimHeight = self.options.holderHeight * 0.3;
    var rimThickness = 0.15;

    for (var side = 0; side < 2; side++) {
      var rim = BABYLON.MeshBuilder.CreateBox('holderRim' + side, {
        width: self.options.holderWidth,
        height: rimHeight,
        depth: rimThickness
      }, scene);
      rim.material = rimMat;
      rim.parent = holder;
      rim.position.y = self.options.holderHeight / 2 + rimHeight / 2;
      rim.position.z = (side === 0 ? 1 : -1) * (self.options.holderDepth / 2 - rimThickness / 2);
    }
  };

  this.setOptions = function(options) {
    self.options = {
      holderWidth: 5.0,
      holderDepth: 4.0,
      holderHeight: 1.2,
      holderColor: '1A1A1A',
      batteryDiameter: 1.0,
      batteryLength: 3.5,
      batteryColor: '2266BB',
      terminalColor: 'C0C0C0',
      negativeColor: '707070',
      scale: 1
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        if (IGNORED_OPTIONS.indexOf(name) === -1) console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.reset = function() {};
  this.render = function(delta) {};

  this.init();
}
