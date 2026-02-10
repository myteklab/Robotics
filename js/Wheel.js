function Wheel(scene, parent, pos, rot, port, options) {
  var self = this;

  this.parent = parent;

  this.type = 'WheelActuator';
  this.port = port;
  this.options = null;

  this.components = [];

  this.bodyPosition = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
  this.rotation = new BABYLON.Vector3(rot[0], rot[1], rot[2]);
  this.initialQuaternion = new BABYLON.Quaternion.FromEulerAngles(rot[0], rot[1], rot[2]);

  this.bodyVector = null;
  this.wheelVector = null;

  this.mesh = null;
  this.joint = null;

  this.STOP_ACTION_BRAKE_FORCE = 2000;
  this.STOP_ACTION_COAST_FORCE = 1000;
  this.STOP_ACTION_HOLD_FORCE = 30000;
  this.MOTOR_POWER_DEFAULT = 30000;
  this.MAX_SPEED = 800 / 180 * Math.PI;
  this.MAX_ACCELERATION = 20;  // degrees / msec^2
  this.TIRE_DOWNWARDS_FORCE = -4000;

  this.modes = {
    STOP: 1,
    RUN: 2,
    RUN_TO_POS: 3,
    RUN_TIL_TIME: 4
  };
  //this.state = '';
  this.states = {
    RUNNING: 'running',
    RAMPING: 'ramping',
    HOLDING: 'holding',
    OVERLOADED: 'overloaded',
    STATE_STALLED: 'stalled',
    NONE: ''
  };
  this.state = this.states.HOLDING;

  this.speed_sp = 0;
  this._speed_sp = 0;
  this.stop_action = 'hold';
  this.position = 0;
  this.speed = 0;

  this.position_target = 0;
  this.prevPosition = 0;
  this.mode = this.modes.STOP;
  this.actualPosition = 0;
  this.positionAdjustment = 0;
  this.rotationRounds = 0;
  this.prevRotation = 0;
  this.angularVelocity = 0;
  this.s = null;

  //
  // Accessed by through Python
  //
  this.runForever = function() {
    self.mode = self.modes.RUN;
  };

  this.runTimed = function() {
    self.mode = self.modes.RUN_TIL_TIME;
  };

  this.runToPosition = function() {
    if (self.position_target < self.position) {
      self.positionDirectionReversed = true;
    } else {
      self.positionDirectionReversed = false;
    }
    self.mode = self.modes.RUN_TO_POS;
  };

  this.stop = function() {
    self.mode = self.modes.STOP;

    if (self.stop_action == 'hold') {
      self.joint.setMotor(0, self.stopActionHoldForce);
      self.state = self.states.HOLDING;
      self.position_target = self.position;
    } else if (self.stop_action == 'brake') {
      self.joint.setMotor(0, self.STOP_ACTION_BRAKE_FORCE);
      self.state = self.states.NONE;
    } else {
      self.joint.setMotor(0, self.STOP_ACTION_COAST_FORCE);
      self.state = self.states.NONE;
    }
  };

  this.init = function() {
    self.setOptions(options);

    self.maxAcceleration = self.options.maxAcceleration;
    self.stopActionHoldForce = self.options.stopActionHoldForce;
    self.TIRE_DOWNWARDS_FORCE = new BABYLON.Vector3(0, self.options.tireDownwardsForce, 0);

    var wheelMat = scene.getMaterialByID('wheel');
    if (wheelMat == null) {
      var wheelMat = new BABYLON.StandardMaterial('wheel', scene);
      var wheelTexture = new BABYLON.Texture('textures/robot/wheel.png', scene);
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

    self.mesh = BABYLON.MeshBuilder.CreateCylinder('wheel', wheelOptions, scene);
    self.body = self.mesh;
    self.end = self.mesh;
    self.body.component = self;
    self.mesh.material = wheelMat;

    self.mesh.parent = parent;
    self.mesh.position = self.bodyPosition;
    self.mesh.rotation.z = -Math.PI / 2;
    self.mesh.rotate(BABYLON.Axis.Y, rot[1], BABYLON.Space.LOCAL);
    self.mesh.rotate(BABYLON.Axis.X, rot[0], BABYLON.Space.LOCAL);
    self.mesh.rotate(BABYLON.Axis.Z, rot[2], BABYLON.Space.LOCAL);
    parent.removeChild(self.mesh);

    // If using custom model with scale != 1, scale the physics mesh too
    // Robot.js handles body Y positioning via effectiveWheelDiameter
    if (self.options.modelURL && self.options.modelURL !== '' && self.options.modelScale && self.options.modelScale != 1) {
      self.mesh.scaling.setAll(self.options.modelScale);
      // Adjust X position to keep wheel adjacent to body/motor
      var scaleDiff = self.options.modelScale - 1;
      var widthChange = (self.options.width / 2) * scaleDiff;
      if (self.mesh.position.x < 0) {
        self.mesh.position.x -= widthChange; // Left wheel: move further left
      } else {
        self.mesh.position.x += widthChange; // Right wheel: move further right
      }
    }

    scene.shadowGenerator.addShadowCaster(self.mesh);

    // Load custom wheel model if specified
    if (self.options.modelURL && self.options.modelURL !== '') {
      self.mesh.visibility = 0;

      // Determine the actual file extension for Babylon.js plugin selection
      // This handles URLs like file.php?file=path/to/model.stl
      var pluginExtension = null;
      var urlLower = self.options.modelURL.toLowerCase();
      if (urlLower.includes('.stl')) {
        pluginExtension = '.stl';
      } else if (urlLower.includes('.gltf')) {
        pluginExtension = '.gltf';
      } else if (urlLower.includes('.glb')) {
        pluginExtension = '.glb';
      } else if (urlLower.includes('.obj')) {
        pluginExtension = '.obj';
      }

      BABYLON.SceneLoader.ImportMeshAsync(null, '', self.options.modelURL, scene, null, pluginExtension).then(function(results) {
        // Check if scene was disposed while loading
        if (scene.isDisposed) {
          return;
        }
        var meshes = results.meshes;

        // GLTF/GLB: Strip __root__ node and convert Y-up to Z-up to match STL.
        // Babylon.js GLTF loader adds __root__ with scale(1,1,-1) for handedness.
        // BlocksCAD GLB exports Y-up vertices (glTF spec), STL exports Z-up.
        if (pluginExtension === '.glb' || pluginExtension === '.gltf') {
          if (meshes.length > 0 && meshes[0].name === '__root__') {
            var rootNode = meshes[0];
            var rootChildren = rootNode.getChildren();
            for (var c = 0; c < rootChildren.length; c++) {
              rootChildren[c].parent = null;
            }
            rootNode.dispose();
            meshes = meshes.slice(1);
          }
          for (var i = 0; i < meshes.length; i++) {
            if (meshes[i].rotationQuaternion) {
              meshes[i].rotationQuaternion = null;
            }
          }
          // Rotate -90° X to convert Y-up (glTF) to Z-up (matching STL/OpenSCAD)
          if (meshes.length > 0) {
            meshes[0].rotation.x = -Math.PI / 2;
          }
        }

        // Compute bounding box to auto-fit model to wheel dimensions
        var min = null;
        var max = null;
        for (var i = 0; i < meshes.length; i++) {
          meshes[i].computeWorldMatrix(true);
          var meshBounds = meshes[i].getBoundingInfo().boundingBox;
          if (meshBounds.extendSize.x == 0 && meshBounds.extendSize.y == 0 && meshBounds.extendSize.z == 0) {
            continue;
          }
          var meshMin = meshBounds.minimumWorld;
          var meshMax = meshBounds.maximumWorld;
          if (min == null) {
            min = meshMin.clone();
            max = meshMax.clone();
          } else {
            min = BABYLON.Vector3.Minimize(min, meshMin);
            max = BABYLON.Vector3.Maximize(max, meshMax);
          }
        }

        if (min != null) {
          var modelSizeX = max.x - min.x;
          var modelSizeY = max.y - min.y;
          var modelSizeZ = max.z - min.z;

          // Uniform scale: fit model to wheel preserving aspect ratio
          var fitScale = 1;
          if (modelSizeX > 0 && modelSizeY > 0 && modelSizeZ > 0) {
            var fitScaleX = self.options.diameter / modelSizeX;
            var fitScaleY = self.options.width / modelSizeY;
            var fitScaleZ = self.options.diameter / modelSizeZ;
            fitScale = Math.min(fitScaleX, fitScaleY, fitScaleZ);
          }

          // If parent mesh is already scaled (modelScale != 1), only use fitScale for the visual
          // Otherwise apply both fitScale and modelScale
          var parentIsScaled = self.options.modelScale && self.options.modelScale != 1;
          var finalScale = parentIsScaled ? fitScale : (fitScale * (self.options.modelScale || 1));
          meshes[0].scaling.setAll(finalScale);

          // Center the model on the wheel
          var center = min.add(max).scale(0.5);
          meshes[0].position.x = -center.x * finalScale;
          meshes[0].position.y = -center.y * finalScale;
          meshes[0].position.z = -center.z * finalScale;
        } else {
          // No bounding info - if parent scaled, use 1, otherwise use modelScale
          var parentIsScaled = self.options.modelScale && self.options.modelScale != 1;
          meshes[0].scaling.setAll(parentIsScaled ? 1 : (self.options.modelScale || 1));
        }

        // Apply color material to meshes without materials (e.g. STL files)
        var modelMat = babylon.getMaterial(scene, self.options.color);
        meshes.forEach(function(m) {
          if (!m.material) {
            m.material = modelMat;
          }
        });
        meshes[0].parent = self.mesh;
        scene.shadowGenerator.addShadowCaster(meshes[0]);
        self.wheelModel = meshes[0];
      }).catch(function(err) {
        // Silently ignore errors if scene was disposed (e.g., during reset)
        if (scene.isDisposed || (err && err.message && err.message.includes('disposed'))) {
          return;
        }
        console.log('Failed to load wheel model:', err);
        if (self.mesh && !self.mesh.isDisposed) {
          self.mesh.visibility = 1;
        }
      });
    }
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

    // Hold position if speed is too low
    var origin = self.mesh.physicsImpostor.physicsBody.getWorldTransform().getOrigin();
    var lastOrigin = [
        origin.x(),
        origin.y(),
        origin.z()
    ];

    self.mesh.physicsImpostor.registerBeforePhysicsStep(function(){
      if (self.mesh.physicsImpostor.getLinearVelocity().lengthSquared() < 0.1) {
        origin.setX(lastOrigin[0]);
        origin.setY(lastOrigin[1]);
        origin.setZ(lastOrigin[2]);
      } else {
        lastOrigin = [
          origin.x(),
          origin.y(),
          origin.z()
        ];
      }
    });
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

    let targetBody = parent;
    while (targetBody.parent) {
      mainPivot.addInPlace(targetBody.position);
      targetBody = targetBody.parent;
    }

    self.joint = new BABYLON.MotorEnabledJoint(BABYLON.PhysicsJoint.HingeJoint, {
      mainPivot: mainPivot,
      connectedPivot: new BABYLON.Vector3(0, 0, 0),
      mainAxis: mainAxis,
      connectedAxis: new BABYLON.Vector3(0, 1, 0),
    });
    targetBody.physicsImpostor.addJoint(self.mesh.physicsImpostor, self.joint);
  };

  this.setOptions = function(options) {
    self.options = {
      diameter: 5.6,
      width: 0.8,
      mass: 200,
      friction: 10,
      restitution: 0.8,
      maxAcceleration: self.MAX_ACCELERATION,
      stopActionHoldForce: self.STOP_ACTION_HOLD_FORCE,
      tireDownwardsForce: self.TIRE_DOWNWARDS_FORCE,
      components: [],
      modelURL: '',
      modelScale: 1,
      color: '333333'
    };

    for (let name in options) {
      if (typeof self.options[name] == 'undefined') {
        console.log('Unrecognized option: ' + name);
      } else {
        self.options[name] = options[name];
      }
    }
  };

  this.reset = function() {
    self.positionAdjustment += self.position;
    self.position = 0;
    self.position_target = 0;
    self.mode = self.modes.STOP;
    self.state = self.states.HOLDING;
  };

  //
  // Used in JS
  //

  this.render = function(delta) {
    if (
      typeof self.mesh == 'undefined' ||
      self.mesh == null ||
      typeof self.mesh.physicsImpostor == 'undefined'
      || self.mesh.physicsImpostor == null
    ) {
      return;
    }

    self.mesh.physicsImpostor.applyForce(self.TIRE_DOWNWARDS_FORCE, self.mesh.getAbsolutePosition());
    if (self.mode == self.modes.RUN) {
      self.setMotorSpeed(delta);
    } else if (self.mode == self.modes.RUN_TIL_TIME) {
      self.setMotorSpeed(delta);
      if (Date.now() > self.time_target) {
        self.stop();
      }
    } else if (self.mode == self.modes.RUN_TO_POS) {
      self.setMotorSpeed(delta, self.positionDirectionReversed);
      if (
        (self.positionDirectionReversed == false && self.position >= self.position_target) ||
        (self.positionDirectionReversed && self.position <= self.position_target)
      ) {
        self.stop();
      }
    } else if (self.state == self.states.HOLDING) {
      self.holdPosition(delta);
    }

    self.updatePosition(delta);
    if (delta == 0) {
      self.speed = 0;
    } else {
      self.speed = 0.8 * self.speed + 0.2 * ((self.position - self.prevPosition) / delta * 1000);
    }
    self.prevPosition = self.position;

    self.components.forEach(function(component) {
      if (typeof component.render == 'function') {
        component.render(delta);
      }
    });
  };

  this.holdPosition = function(delta) {
    const P_GAIN = 0.1;
    const MAX_POSITION_CORRECTION_SPEED = 5;
    let error = self.position_target - self.position;
    let speed = -error * P_GAIN;

    if (speed > MAX_POSITION_CORRECTION_SPEED) {
      speed = MAX_POSITION_CORRECTION_SPEED;
    } else if (speed < -MAX_POSITION_CORRECTION_SPEED) {
      speed = -MAX_POSITION_CORRECTION_SPEED;
    } else if (speed < 1) {
      // speed = 0;
    }
    self.joint.setMotor(speed, self.stopActionHoldForce);
  };

  this.setMotorSpeed = function(delta, reversed=false) {
    let diff = self.speed_sp - self._speed_sp;
    let diffLimit = delta * self.maxAcceleration;
    if (diff > diffLimit) {
      self._speed_sp += diffLimit;
      self.state = self.states.RAMPING;
    } else if (diff < -diffLimit) {
      self._speed_sp -= diffLimit;
      self.state = self.states.RAMPING;
    } else {
      self._speed_sp = self.speed_sp;
      self.state = self.states.RUNNING;
    }

    let speed = -self._speed_sp / 180 * Math.PI;
    if (speed > self.MAX_SPEED) {
      speed = self.MAX_SPEED;
    } else if (speed < -self.MAX_SPEED) {
      speed = -self.MAX_SPEED;
    }
    if (reversed) {
      speed = -speed;
    }
    self.joint.setMotor(speed, self.MOTOR_POWER_DEFAULT);
  };

  this.updatePosition = function(delta) {
    let e = self.mesh.rotationQuaternion;
    let rot = self.getRotation(self.s, e) / Math.PI * 180;

    if (rot - self.prevRotation > 180) {
      self.rotationRounds -= 1;
    } else if (rot - self.prevRotation < -180) {
      self.rotationRounds += 1;
    }
    prevRotation = self.prevRotation
    self.prevRotation = rot;

    let position = self.rotationRounds * 360 + rot;
    self.angularVelocity = (position - self.actualPosition) / delta * 1000;
    self.actualPosition = position;
    self.position = position - self.positionAdjustment;
  };

  this.getRotation = function(){
    let rotatedBodyVector = new BABYLON.Vector3(0,0,0);
    let rotatedWheelVector = new BABYLON.Vector3(0,0,0);
    let rotatedNormalVector = new BABYLON.Vector3(0,0,0);
    let zero = BABYLON.Vector3.Zero();

    this.bodyVector.rotateByQuaternionAroundPointToRef(parent.absoluteRotationQuaternion, zero, rotatedBodyVector);
    this.wheelVector.rotateByQuaternionAroundPointToRef(self.mesh.absoluteRotationQuaternion, zero, rotatedWheelVector);
    this.normalVector.rotateByQuaternionAroundPointToRef(self.mesh.absoluteRotationQuaternion, zero, rotatedNormalVector);

    return BABYLON.Vector3.GetAngleBetweenVectors(rotatedBodyVector, rotatedWheelVector, rotatedNormalVector);
  };

  this.init();
}