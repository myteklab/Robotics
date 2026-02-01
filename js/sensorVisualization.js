// Sensor Visualization Module
// Shows per-sensor overlays: ultrasonic cone, color disc, laser beam, touch highlight, gyro arrow
var sensorViz = (function() {
  var enabled = false;
  var meshes = [];
  var sensorData = []; // { sensor, type, meshes: {} }
  var renderIndex = -1;
  var MAX_ULTRASONIC_VISUAL = 50;

  function findSensors(components) {
    var results = [];
    if (!components) return results;
    for (var i = 0; i < components.length; i++) {
      var c = components[i];
      if (c.type === 'UltrasonicSensor' || c.type === 'ColorSensor' ||
          c.type === 'LaserRangeSensor' || c.type === 'TouchSensor' ||
          c.type === 'GyroSensor') {
        results.push(c);
      }
      if (c.components) {
        results = results.concat(findSensors(c.components));
      }
    }
    return results;
  }

  function createUltrasonicVisual(sensor, scene) {
    // Cone mesh representing detection area
    var mat = new BABYLON.StandardMaterial('vizUltrasonic_' + sensor.port, scene);
    mat.diffuseColor = new BABYLON.Color3(0.3, 0.85, 1.0);
    mat.emissiveColor = new BABYLON.Color3(0.05, 0.15, 0.2);
    mat.alpha = 0.15;
    mat.backFaceCulling = false;

    var cone = BABYLON.MeshBuilder.CreateCylinder('vizUltrasonicCone_' + sensor.port, {
      height: 1,
      diameterTop: 0,
      diameterBottom: 1,
      tessellation: 8
    }, scene);
    cone.material = mat;
    cone.isPickable = false;

    // Hit point indicator
    var hitMat = new BABYLON.StandardMaterial('vizUltrasonicHit_' + sensor.port, scene);
    hitMat.diffuseColor = new BABYLON.Color3(0.3, 1.0, 1.0);
    hitMat.emissiveColor = new BABYLON.Color3(0.2, 0.6, 0.6);
    hitMat.alpha = 0.6;

    var hitSphere = BABYLON.MeshBuilder.CreateSphere('vizUltrasonicHitPt_' + sensor.port, {
      diameter: 1.0,
      segments: 6
    }, scene);
    hitSphere.material = hitMat;
    hitSphere.isPickable = false;
    hitSphere.isVisible = false;

    meshes.push(cone, hitSphere);
    return { cone: cone, hitSphere: hitSphere, mat: mat };
  }

  function createColorVisual(sensor, scene) {
    // Ground disc showing detected color
    var mat = new BABYLON.StandardMaterial('vizColor_' + sensor.port, scene);
    mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    mat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    mat.alpha = 0.6;
    mat.backFaceCulling = false;

    var disc = BABYLON.MeshBuilder.CreateDisc('vizColorDisc_' + sensor.port, {
      radius: 1.0,
      tessellation: 16
    }, scene);
    disc.material = mat;
    disc.isPickable = false;
    disc.rotation.x = Math.PI / 2; // Lay flat on ground

    meshes.push(disc);
    return { disc: disc, mat: mat, frameSkip: 0 };
  }

  function createLaserVisual(sensor, scene) {
    // Red beam cylinder
    var mat = new BABYLON.StandardMaterial('vizLaser_' + sensor.port, scene);
    mat.diffuseColor = new BABYLON.Color3(1.0, 0.1, 0.1);
    mat.emissiveColor = new BABYLON.Color3(0.5, 0.0, 0.0);
    mat.alpha = 0.5;

    var beam = BABYLON.MeshBuilder.CreateCylinder('vizLaserBeam_' + sensor.port, {
      height: 1,
      diameter: 0.15,
      tessellation: 6
    }, scene);
    beam.material = mat;
    beam.isPickable = false;

    // Hit dot
    var dotMat = new BABYLON.StandardMaterial('vizLaserDot_' + sensor.port, scene);
    dotMat.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.2);
    dotMat.emissiveColor = new BABYLON.Color3(0.8, 0.0, 0.0);

    var dot = BABYLON.MeshBuilder.CreateSphere('vizLaserDotPt_' + sensor.port, {
      diameter: 0.5,
      segments: 6
    }, scene);
    dot.material = dotMat;
    dot.isPickable = false;

    meshes.push(beam, dot);
    return { beam: beam, dot: dot };
  }

  function createTouchVisual(sensor, scene) {
    // Highlight box around the touch sensor
    var w = (sensor.options && sensor.options.width) || 2;
    var d = (sensor.options && sensor.options.depth) || 2;

    var mat = new BABYLON.StandardMaterial('vizTouch_' + sensor.port, scene);
    mat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    mat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    mat.alpha = 0.25;
    mat.backFaceCulling = false;

    var box = BABYLON.MeshBuilder.CreateBox('vizTouchBox_' + sensor.port, {
      width: w + 0.5,
      height: 1.2,
      depth: d + 0.5
    }, scene);
    box.material = mat;
    box.isPickable = false;

    meshes.push(box);
    return { box: box, mat: mat };
  }

  function createGyroVisual(sensor, scene) {
    // Arrow on ground showing yaw direction
    // Shaft
    var shaftMat = new BABYLON.StandardMaterial('vizGyroShaft_' + sensor.port, scene);
    shaftMat.diffuseColor = new BABYLON.Color3(1.0, 0.75, 0.0);
    shaftMat.emissiveColor = new BABYLON.Color3(0.3, 0.2, 0.0);
    shaftMat.alpha = 0.7;

    var shaft = BABYLON.MeshBuilder.CreateCylinder('vizGyroShaft_' + sensor.port, {
      height: 3,
      diameter: 0.3,
      tessellation: 6
    }, scene);
    shaft.material = shaftMat;
    shaft.isPickable = false;
    shaft.rotation.x = Math.PI / 2; // Lay flat

    // Arrowhead
    var head = BABYLON.MeshBuilder.CreateCylinder('vizGyroHead_' + sensor.port, {
      height: 1.2,
      diameterTop: 0,
      diameterBottom: 1.0,
      tessellation: 6
    }, scene);
    head.material = shaftMat;
    head.isPickable = false;
    head.rotation.x = Math.PI / 2;
    head.position.z = 2.1;

    // Parent node to rotate together
    var pivot = new BABYLON.TransformNode('vizGyroPivot_' + sensor.port, scene);
    shaft.parent = pivot;
    head.parent = pivot;

    meshes.push(shaft, head, pivot);
    return { shaft: shaft, head: head, pivot: pivot };
  }

  // Align a mesh's local Y axis to point along a given direction
  function alignToDirection(mesh, direction) {
    var yAxis = new BABYLON.Vector3(0, 1, 0);
    var cross = BABYLON.Vector3.Cross(yAxis, direction);
    var dot = BABYLON.Vector3.Dot(yAxis, direction);

    if (cross.length() < 0.0001) {
      // Parallel or anti-parallel to Y
      if (dot > 0) {
        mesh.rotationQuaternion = BABYLON.Quaternion.Identity();
      } else {
        mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, Math.PI);
      }
    } else {
      var angle = Math.acos(Math.max(-1, Math.min(1, dot)));
      cross.normalize();
      mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(cross, angle);
    }
  }

  function updateUltrasonic(entry) {
    var sensor = entry.sensor;
    var viz = entry.vizMeshes;

    var dist = sensor.getDistance();
    var visualDist = Math.min(dist, MAX_ULTRASONIC_VISUAL);

    // Cone dimensions based on distance and widest ray angle (0.367 rad)
    var bottomDiam = 2 * visualDist * Math.tan(0.367);
    viz.cone.scaling.y = visualDist;
    viz.cone.scaling.x = bottomDiam;
    viz.cone.scaling.z = bottomDiam;

    // Position at sensor origin
    var rayOffset = new BABYLON.Vector3(0, 0, 0);
    sensor.options.rayOrigin.rotateByQuaternionToRef(
      sensor.body.absoluteRotationQuaternion, rayOffset
    );
    var origin = sensor.body.absolutePosition.add(rayOffset);

    // Direction: sensor's forward (Z axis rotated by body quaternion)
    var forward = new BABYLON.Vector3(0, 0, 1);
    forward.rotateByQuaternionToRef(sensor.body.absoluteRotationQuaternion, forward);

    // Position cone at midpoint along the beam direction
    viz.cone.position.copyFrom(origin);
    viz.cone.position.addInPlace(forward.scale(visualDist / 2));

    // Orient cone so its height axis (Y) aligns with forward direction
    alignToDirection(viz.cone, forward);

    // Hit sphere at detected distance
    if (dist < sensor.options.rayLength) {
      viz.hitSphere.isVisible = true;
      viz.hitSphere.position.copyFrom(origin);
      viz.hitSphere.position.addInPlace(forward.scale(dist));
    } else {
      viz.hitSphere.isVisible = false;
    }
  }

  function updateColor(entry) {
    var sensor = entry.sensor;
    var viz = entry.vizMeshes;

    // Only update color every 3 frames for performance
    viz.frameSkip = (viz.frameSkip || 0) + 1;
    if (viz.frameSkip < 3) return;
    viz.frameSkip = 0;

    // Position: cast ray from sensor eye downward/forward to find ground
    var eyePos = sensor.eye.getAbsolutePosition();
    var forward = new BABYLON.Vector3(0, 0, 1);
    forward.rotateByQuaternionToRef(sensor.body.absoluteRotationQuaternion, forward);

    var ray = new BABYLON.Ray(eyePos, forward, sensor.options.sensorMaxRange || 10);
    var hit = babylon.scene.pickWithRay(ray, function(mesh) {
      return mesh.isPickable && mesh !== sensor.body && mesh !== sensor.eye;
    });

    if (hit && hit.hit) {
      viz.disc.position.copyFrom(hit.pickedPoint);
      viz.disc.position.y += 0.05; // Slight offset above surface
      viz.disc.isVisible = true;
    } else {
      // Place disc at estimated position
      viz.disc.position.copyFrom(eyePos);
      viz.disc.position.addInPlace(forward.scale(3));
      viz.disc.isVisible = true;
    }

    // Update color from sensor reading
    var rgb = sensor.getRGB();
    if (rgb && rgb.length >= 3) {
      viz.mat.diffuseColor.r = rgb[0] / 255;
      viz.mat.diffuseColor.g = rgb[1] / 255;
      viz.mat.diffuseColor.b = rgb[2] / 255;
      viz.mat.emissiveColor.r = rgb[0] / 512;
      viz.mat.emissiveColor.g = rgb[1] / 512;
      viz.mat.emissiveColor.b = rgb[2] / 512;
    }
  }

  function updateLaser(entry) {
    var sensor = entry.sensor;
    var viz = entry.vizMeshes;

    var dist = sensor.getDistance();

    // Sensor origin and direction
    var rayOffset = new BABYLON.Vector3(0, 0, 0);
    sensor.options.rayOrigin.rotateByQuaternionToRef(
      sensor.body.absoluteRotationQuaternion, rayOffset
    );
    var origin = sensor.body.absolutePosition.add(rayOffset);

    // Direction: default is downward (0, -1, 0) rotated by body
    var dir = new BABYLON.Vector3(0, -1, 0);
    dir.rotateByQuaternionToRef(sensor.body.absoluteRotationQuaternion, dir);

    // Beam length
    var beamLen = Math.min(dist, 100); // Visual cap
    viz.beam.scaling.y = beamLen;

    // Position beam at midpoint
    viz.beam.position.copyFrom(origin);
    viz.beam.position.addInPlace(dir.scale(beamLen / 2));

    // Orient beam so its height axis (Y) aligns with ray direction
    alignToDirection(viz.beam, dir);

    // Dot at hit point
    if (dist < sensor.options.rayLength) {
      viz.dot.isVisible = true;
      viz.dot.position.copyFrom(origin);
      viz.dot.position.addInPlace(dir.scale(dist));
    } else {
      viz.dot.isVisible = false;
    }
  }

  function updateTouch(entry) {
    var sensor = entry.sensor;
    var viz = entry.vizMeshes;

    // Position at the touch sensor fake body
    if (sensor.fakeSensor) {
      viz.box.position.copyFrom(sensor.fakeSensor.getAbsolutePosition());
      viz.box.rotationQuaternion = sensor.fakeSensor.absoluteRotationQuaternion.clone();
    }

    // Toggle color based on pressed state
    var pressed = sensor.isPressed();
    if (pressed) {
      viz.mat.diffuseColor.set(0.1, 0.9, 0.2);
      viz.mat.emissiveColor.set(0.05, 0.5, 0.1);
      viz.mat.alpha = 0.4;
    } else {
      viz.mat.diffuseColor.set(0.3, 0.3, 0.3);
      viz.mat.emissiveColor.set(0.1, 0.1, 0.1);
      viz.mat.alpha = 0.25;
    }
  }

  function updateGyro(entry) {
    var sensor = entry.sensor;
    var viz = entry.vizMeshes;

    // Position arrow on ground below robot
    var pos = sensor.body.absolutePosition.clone();
    pos.y = 0.15; // Just above ground plane
    viz.pivot.position.copyFrom(pos);

    // Rotate by yaw angle
    var yawDeg = sensor.getYawAngle();
    viz.pivot.rotation.y = -yawDeg * Math.PI / 180;
  }

  function render(delta) {
    if (!enabled) return;
    for (var i = 0; i < sensorData.length; i++) {
      var entry = sensorData[i];
      try {
        switch (entry.type) {
          case 'UltrasonicSensor': updateUltrasonic(entry); break;
          case 'ColorSensor': updateColor(entry); break;
          case 'LaserRangeSensor': updateLaser(entry); break;
          case 'TouchSensor': updateTouch(entry); break;
          case 'GyroSensor': updateGyro(entry); break;
        }
      } catch (e) {
        // Sensor may not be fully initialized yet
      }
    }
  }

  return {
    toggle: function() {
      if (enabled) {
        this.disable();
      } else {
        this.enable();
      }
    },

    enable: function() {
      enabled = true;
      this.createVisuals();
      if (renderIndex === -1) {
        renderIndex = babylon.renders.length;
        babylon.renders.push(render);
      }
      var btn = document.querySelector('.sensorViz');
      if (btn) btn.classList.add('active');
    },

    disable: function() {
      enabled = false;
      this.dispose();
      var btn = document.querySelector('.sensorViz');
      if (btn) btn.classList.remove('active');
    },

    isEnabled: function() {
      return enabled;
    },

    createVisuals: function() {
      this.dispose();
      if (!robots || !robots[0] || !robots[0].components) return;

      var scene = babylon.scene;
      if (!scene) return;

      var sensors = findSensors(robots[0].components);

      for (var i = 0; i < sensors.length; i++) {
        var sensor = sensors[i];
        var vizMeshes = null;

        switch (sensor.type) {
          case 'UltrasonicSensor':
            vizMeshes = createUltrasonicVisual(sensor, scene);
            break;
          case 'ColorSensor':
            vizMeshes = createColorVisual(sensor, scene);
            break;
          case 'LaserRangeSensor':
            vizMeshes = createLaserVisual(sensor, scene);
            break;
          case 'TouchSensor':
            vizMeshes = createTouchVisual(sensor, scene);
            break;
          case 'GyroSensor':
            vizMeshes = createGyroVisual(sensor, scene);
            break;
        }

        if (vizMeshes) {
          sensorData.push({
            sensor: sensor,
            type: sensor.type,
            vizMeshes: vizMeshes
          });
        }
      }
    },

    dispose: function() {
      for (var i = 0; i < meshes.length; i++) {
        if (meshes[i] && meshes[i].dispose) {
          meshes[i].dispose();
        }
      }
      meshes = [];
      sensorData = [];
    },

    // Call after scene reset to recreate visuals if enabled
    onSceneReset: function() {
      // Meshes are already disposed by scene.dispose()
      // Just clear our references
      meshes = [];
      sensorData = [];
      // The render function stays in babylon.renders (it persists across resets)
      // It will harmlessly iterate an empty sensorData until we recreate
      if (enabled) {
        // Delay to let scene and robot components initialize
        setTimeout(function() {
          if (enabled) {
            sensorViz.createVisuals();
          }
        }, 500);
      }
    }
  };
})();
