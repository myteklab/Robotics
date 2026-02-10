function Robot() {
  var self = this;

  this.options = {};
  this.processedOptions = {};

  this.body = null;
  this.leftWheel = null;
  this.rightWheel = null;
  this.components = [];

  this.sensorCount = 0;
  this.actuatorCount = 2;
  this.componentIndex = 0;

  this.playerIndividualColors = [
    new BABYLON.Color3(0.2, 0.94, 0.94),
    new BABYLON.Color3(0.2, 0.94, 0.2),
    new BABYLON.Color3(0.94, 0.94, 0.2),
    new BABYLON.Color3(0.94, 0.2, 0.2),
    new BABYLON.Color3(0.94, 0.2, 0.94),
    new BABYLON.Color3(0.2, 0.2, 0.94)
  ];

  this.playerTeamColors = [
    new BABYLON.Color3(0.09, 0.09, 0.902),
    new BABYLON.Color3(0.09, 0.495, 0.9),
    new BABYLON.Color3(0.9, 0.09, 0.09),
    new BABYLON.Color3(0.9, 0.09, 0.495),
  ];

  this.defaultOptions = {
    color: '#f09c0d',
    imageType: 'all',
    imageURL: '',
    caster: true,
    wheels: true
  };

  this.mailboxes = {};

  this.hubButtons = {
    backspace: false,
    up: false,
    down: false,
    left: false,
    right: false,
    enter: false
  };

  // Keyboard keys state for custom key detection
  this.keyboardKeys = {};

  // Run on page load
  this.init = function() {
  };

  // Create the scene
  this.load = function (scene, robotStart) {
    var options = {...self.defaultOptions};
    self.processedOptions = options;
    Object.assign(options, self.options);
    self.scene = scene;

    return new Promise(function(resolve, reject) {
      var startPos = new BABYLON.Vector3(0,0,0);
      var startRot = new BABYLON.Vector3(0,0,0);
      if (typeof robotStart != 'undefined') {
        if (typeof robotStart.position != 'undefined') {
          startPos = robotStart.position;
        }
        if (typeof robotStart.rotation != 'undefined') {
          startRot = robotStart.rotation;
        }
      }

      // Backward compatibility: migrate old 'color' to 'bodyColor'
      if (!options.bodyColor && options.color) {
        options.bodyColor = options.color;
      }

      // Component scale factor - scales all components (wheels, sensors, etc.) together
      var compScale = options.componentScale || 1;
      var scaledWheelDiameter = options.wheelDiameter * compScale;
      var scaledWheelWidth = options.wheelWidth * compScale;
      var scaledCasterDiameter = (options.casterDiameter || 4) * compScale;

      // Effective diameter accounts for custom wheel model scaling
      var wheelModelScale = (options.wheelModelURL && options.wheelModelScale) ? options.wheelModelScale : 1;
      var effectiveWheelDiameter = scaledWheelDiameter * wheelModelScale;

      // Body
      var bodyMat = new BABYLON.StandardMaterial('body', scene);
      var faceUV = new Array(6);
      for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
      }

      function setCustomColors() {
        let VALID_IMAGETYPES = ['top','front','repeat','all','cylinder','sphere'];
        if (VALID_IMAGETYPES.indexOf(options.imageType) != -1 && options.imageURL != '') {
          if (options.imageType == 'top') {
            faceUV[4] = new BABYLON.Vector4(0, 0, 1, 1);
          } else if (options.imageType == 'front') {
            faceUV[1] = new BABYLON.Vector4(0, 0, 1, 1);
          } else if (options.imageType == 'repeat') {
            for (var i = 0; i < 6; i++) {
              faceUV[i] = new BABYLON.Vector4(0, 0, 1, 1);
            }
          } else if (options.imageType == 'all') {
            faceUV[0] = new BABYLON.Vector4(0,   0,   1/3, 1/2);
            faceUV[1] = new BABYLON.Vector4(1/3, 0,   2/3, 1/2);
            faceUV[2] = new BABYLON.Vector4(2/3, 0,   1,   1/2);
            faceUV[3] = new BABYLON.Vector4(0,   1/2, 1/3, 1);
            faceUV[4] = new BABYLON.Vector4(1/3, 1/2, 2/3, 1);
            faceUV[5] = new BABYLON.Vector4(2/3, 1/2, 1,   1);
          }

          bodyMat.diffuseTexture = new BABYLON.Texture(options.imageURL, scene);
        } else {
          bodyMat = babylon.getMaterial(scene, options.bodyColor);
        }
      }

      if (self.player == 'single') {
        setCustomColors();
      } else {
        // Arena mode
        let robotColorMode = null;
        if (typeof arena != 'undefined') {
          robotColorMode = arena.robotColorMode;
        }

        if (robotColorMode == 'team') {
          bodyMat.diffuseColor = self.playerTeamColors[self.player];
        } else if (robotColorMode == 'custom') {
          setCustomColors();
        } else {
          bodyMat.diffuseColor = self.playerIndividualColors[self.player];
        }
      }
      bodyMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      bodyMat.freeze();

      var body;
      if (options.bodyShape == 'cylinder') {
        let bodyOptions = {
          height: options.bodyHeight,
          diameter: Math.max(options.bodyWidth, options.bodyLength),
          tessellation: 24
        };
        body = BABYLON.MeshBuilder.CreateCylinder('body', bodyOptions, scene);
      } else if (options.bodyShape == 'sphere') {
        let bodyOptions = {
          diameterX: options.bodyWidth,
          diameterY: options.bodyHeight,
          diameterZ: options.bodyLength,
          segments: 16
        };
        body = BABYLON.MeshBuilder.CreateSphere('body', bodyOptions, scene);
      } else if (options.bodyShape == 'cone') {
        let bodyOptions = {
          height: options.bodyHeight,
          diameterTop: 0,
          diameterBottom: Math.max(options.bodyWidth, options.bodyLength),
          tessellation: 16
        };
        body = BABYLON.MeshBuilder.CreateCylinder('body', bodyOptions, scene);
      } else if (options.bodyShape == 'torus') {
        let bodyOptions = {
          diameter: Math.max(options.bodyWidth, options.bodyLength),
          thickness: options.bodyHeight / 2,
          tessellation: 24
        };
        body = BABYLON.MeshBuilder.CreateTorus('body', bodyOptions, scene);
      } else {
        let bodyOptions = {
          height: options.bodyHeight,
          width: options.bodyWidth,
          depth: options.bodyLength,
          faceUV: faceUV
        };
        body = BABYLON.MeshBuilder.CreateBox('body', bodyOptions, scene);
      }
      self.body = body;
      body.material = bodyMat;
      body.visibility = 1;

      // Load custom 3D model for body if specified
      if (options.bodyShape == 'model' && options.bodyModelURL) {
        body.visibility = 0;
        body.isPickable = false;

        // Determine the actual file extension for Babylon.js plugin selection
        // This handles URLs like file.php?file=path/to/model.stl
        var bodyPluginExtension = null;
        var bodyUrlLower = options.bodyModelURL.toLowerCase();
        if (bodyUrlLower.includes('.stl')) {
          bodyPluginExtension = '.stl';
        } else if (bodyUrlLower.includes('.gltf')) {
          bodyPluginExtension = '.gltf';
        } else if (bodyUrlLower.includes('.glb')) {
          bodyPluginExtension = '.glb';
        } else if (bodyUrlLower.includes('.obj')) {
          bodyPluginExtension = '.obj';
        }

        BABYLON.SceneLoader.ImportMeshAsync(null, '', options.bodyModelURL, scene, null, bodyPluginExtension).then(function(results) {
          var meshes = results.meshes;

          // Compute model bounding box to auto-fit to body dimensions
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
            var modelWidth = max.x - min.x;
            var modelHeight = max.y - min.y;
            var modelDepth = max.z - min.z;

            var finalScale;

            if (options.bodyMmPerUnit && options.bodyMmPerUnit > 0) {
              // Real world scale mode: model is in mm, convert to sim units
              // Scale factor converts mm to units: 1 / mmPerUnit
              finalScale = 1 / options.bodyMmPerUnit;

              // Calculate actual dimensions at this scale
              var actualWidth = modelWidth * finalScale;
              var actualHeight = modelHeight * finalScale;
              var actualLength = modelDepth * finalScale;

              // Store actual dimensions for reference
              self.actualBodyWidth = actualWidth;
              self.actualBodyHeight = actualHeight;
              self.actualBodyLength = actualLength;

              // Fire callback if provided (for configurator to update UI)
              if (typeof self.onBodySizeCalculated === 'function') {
                self.onBodySizeCalculated(actualWidth, actualHeight, actualLength);
              }

              // Scale the invisible physics body to match the model
              if (options.bodyWidth > 0 && options.bodyHeight > 0 && options.bodyLength > 0) {
                body.scaling.x = actualWidth / options.bodyWidth;
                body.scaling.y = actualHeight / options.bodyHeight;
                body.scaling.z = actualLength / options.bodyLength;
              }
            } else {
              // Standard mode: fit model inside body box while preserving aspect ratio
              var fitScale = 1;
              if (modelWidth > 0 && modelHeight > 0 && modelDepth > 0) {
                var fitScaleX = options.bodyWidth / modelWidth;
                var fitScaleY = options.bodyHeight / modelHeight;
                var fitScaleZ = options.bodyLength / modelDepth;
                fitScale = Math.min(fitScaleX, fitScaleY, fitScaleZ);
              }
              finalScale = fitScale * (options.bodyModelScale || 1);
            }

            meshes[0].scaling.setAll(finalScale);

            // Center the model on the body
            var center = min.add(max).scale(0.5);
            meshes[0].position.x = -center.x * finalScale;
            meshes[0].position.y = -center.y * finalScale + (options.bodyModelOffsetY || 0);
            meshes[0].position.z = -center.z * finalScale;
          } else {
            meshes[0].scaling.setAll(options.bodyModelScale || 1);
            meshes[0].position.y = options.bodyModelOffsetY || 0;
          }

          // Apply body color to meshes without materials (e.g. STL files)
          meshes.forEach(function(m) {
            if (!m.material) {
              m.material = bodyMat;
            }
          });

          meshes[0].parent = body;
          scene.shadowGenerator.addShadowCaster(meshes[0]);
          self.bodyModel = meshes[0];
        }).catch(function(err) {
          console.log('Failed to load body model:', err);
          body.visibility = 1;
          body.isPickable = true;
        });
      }
      body.position.x = 0;
      body.position.y = (options.bodyHeight / 2) + (effectiveWheelDiameter / 2) - options.bodyEdgeToWheelCenterY;
      body.position.z = 0;
      scene.shadowGenerator.addShadowCaster(body);
      body.position.addInPlace(startPos);
      body.rotate(BABYLON.Axis.Y, startRot.y, BABYLON.Space.LOCAL);
      body.rotate(BABYLON.Axis.X, startRot.x, BABYLON.Space.LOCAL);
      body.rotate(BABYLON.Axis.Z, startRot.z, BABYLON.Space.LOCAL);

      // Add label
      self.addLabel();

      // Add a paintballCollide function
      body.paintballCollide = self.paintballCollide;

      // Rear caster
      if (options.caster) {

        // Use scaled caster diameter
        var ballRadius = scaledCasterDiameter / 2;

        // Ball (visible, with physics)
        var ballMat = new BABYLON.StandardMaterial('casterBall', scene);
        ballMat.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.78);
        ballMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        ballMat.specularPower = 128;
        ballMat.freeze();

        var caster = BABYLON.MeshBuilder.CreateSphere("casterBall", {
          diameter: scaledCasterDiameter,
          segments: 24
        }, scene);
        caster.material = ballMat;
        caster.position.y = -(options.bodyHeight / 2) + options.bodyEdgeToWheelCenterY - effectiveWheelDiameter / 2 + ballRadius;
        caster.position.z = -(options.bodyLength / 2) + ballRadius;
        if (typeof options.casterOffsetZ != 'undefined') {
          caster.position.z += options.casterOffsetZ;
        }
        scene.shadowGenerator.addShadowCaster(caster);
        caster.parent = body;

        caster.physicsImpostor = new BABYLON.PhysicsImpostor(
          caster,
          BABYLON.PhysicsImpostor.SphereImpostor,
          {
            mass: options.casterMass,
            restitution: 0.0,
            friction: options.casterFriction
          },
          scene
        );

        // Housing material
        var housingMat = new BABYLON.StandardMaterial('casterHousing', scene);
        housingMat.diffuseColor = new BABYLON.Color3(0.35, 0.35, 0.38);
        housingMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        housingMat.specularPower = 32;
        housingMat.freeze();

        // Housing cup (cylinder that wraps upper portion of ball)
        var housingHeight = ballRadius * 1.0;
        var housingDiameter = scaledCasterDiameter * 1.15;
        var housing = BABYLON.MeshBuilder.CreateCylinder("casterHousing", {
          height: housingHeight,
          diameter: housingDiameter,
          tessellation: 24
        }, scene);
        housing.material = housingMat;
        // Position so bottom edge is slightly below ball center
        housing.position.y = caster.position.y + housingHeight / 2 - ballRadius * 0.1;
        housing.position.z = caster.position.z;
        housing.parent = body;
        scene.shadowGenerator.addShadowCaster(housing);

        // Housing rim (torus around the opening to give it a lip)
        var rim = BABYLON.MeshBuilder.CreateTorus("casterRim", {
          diameter: housingDiameter,
          thickness: ballRadius * 0.15,
          tessellation: 24
        }, scene);
        rim.material = housingMat;
        rim.position.y = caster.position.y - ballRadius * 0.1;
        rim.position.z = caster.position.z;
        rim.parent = body;
        scene.shadowGenerator.addShadowCaster(rim);

        // Mounting plate on top
        var plateDiameter = housingDiameter * 0.9;
        var plateHeight = ballRadius * 0.15;
        var plate = BABYLON.MeshBuilder.CreateCylinder("casterPlate", {
          height: plateHeight,
          diameter: plateDiameter,
          tessellation: 24
        }, scene);
        plate.material = housingMat;
        plate.position.y = caster.position.y + housingHeight - ballRadius * 0.1 + plateHeight / 2;
        plate.position.z = caster.position.z;
        plate.parent = body;
        scene.shadowGenerator.addShadowCaster(plate);
      }
      // Add components
      self.components = [];
      self.sensorCount = 0;
      self.motorCount = options.wheels ? 2 : 0;

      self.componentIndex = 0;
      self.loadComponents(self.options.components, self.components, self.body, compScale);

      // Add Physics — match impostor type to body shape
      var bodyImpostorType = BABYLON.PhysicsImpostor.BoxImpostor;
      if (options.bodyShape == 'cylinder' || options.bodyShape == 'cone') {
        bodyImpostorType = BABYLON.PhysicsImpostor.CylinderImpostor;
      } else if (options.bodyShape == 'sphere') {
        bodyImpostorType = BABYLON.PhysicsImpostor.SphereImpostor;
      }

      body.physicsImpostor = new BABYLON.PhysicsImpostor(
        body,
        bodyImpostorType,
        {
          mass: options.bodyMass,
          restitution: 0.4,
          friction: options.bodyFriction
        },
        scene
      );

      // Hold position if speed is too low
      var origin = body.physicsImpostor.physicsBody.getWorldTransform().getOrigin();
      var lastOrigin = [
          origin.x(),
          origin.y(),
          origin.z()
      ];

      body.physicsImpostor.registerBeforePhysicsStep(function(){
        if (body.physicsImpostor.getLinearVelocity().lengthSquared() < 0.1) {
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

      // Add joints
      self.loadJoints(self.components);


      // Wheels - use pre-calculated scaled dimensions
      driveWheelOptions = {
        diameter: scaledWheelDiameter,
        width: scaledWheelWidth,
        mass: options.wheelMass,
        friction: options.wheelFriction,
        maxAcceleration: options.wheelMaxAcceleration,
        stopActionHoldForce: options.wheelStopActionHoldForce,
        tireDownwardsForce: options.wheelTireDownwardsForce,
        modelURL: options.wheelModelURL || '',
        modelScale: options.wheelModelScale || 1,
        color: options.wheelColor || '333333'
      };

      if (options.wheels){
        self.leftWheel = new Wheel(
          scene,
          body,
          [
            -(scaledWheelWidth + options.bodyWidth) / 2 - options.wheelToBodyOffset,
            -(options.bodyHeight / 2) + options.bodyEdgeToWheelCenterY,
            (options.bodyLength / 2) - options.bodyEdgeToWheelCenterZ
          ],
          [0,0,0],
          'outA',
          driveWheelOptions
        );
        self.leftWheel.loadImpostor();
        self.leftWheel.loadJoints();

        self.rightWheel = new Wheel(
          scene,
          body,
          [
            (scaledWheelWidth + options.bodyWidth) / 2 + options.wheelToBodyOffset,
            -(options.bodyHeight / 2) + options.bodyEdgeToWheelCenterY,
            (options.bodyLength / 2) - options.bodyEdgeToWheelCenterZ
          ],
          [0,0,0],
          'outB',
          driveWheelOptions
        );
        self.rightWheel.loadImpostor();
        self.rightWheel.loadJoints();

        // Gear motors (visual only)
        if (options.showMotors) {
          var motorMat = babylon.getMaterial(scene, options.motorColor || '2A2A2A');
          var shaftMat = new BABYLON.StandardMaterial('motorShaft', scene);
          shaftMat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.72);
          shaftMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
          shaftMat.specularPower = 64;
          shaftMat.freeze();

          var endCapMat = new BABYLON.StandardMaterial('motorEndCap', scene);
          endCapMat.diffuseColor = new BABYLON.Color3(0.45, 0.45, 0.48);
          endCapMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
          endCapMat.freeze();

          var motorDiameter = options.motorDiameter || 2.5;
          var motorLength = options.motorLength || 3;
          var motorRadius = motorDiameter / 2;
          var shaftDiameter = motorRadius * 0.25;
          var wheelY = -(options.bodyHeight / 2) + options.bodyEdgeToWheelCenterY;
          var wheelZ = (options.bodyLength / 2) - options.bodyEdgeToWheelCenterZ;
          var bodyEdgeX = options.bodyWidth / 2;
          var wheelCenterX = (options.wheelWidth + options.bodyWidth) / 2 + options.wheelToBodyOffset;

          // Shaft length from body edge to wheel center
          var shaftLength = wheelCenterX - bodyEdgeX;

          // Motor position: centered on the body side, extending inward
          var motorCenterX = bodyEdgeX - motorLength / 2;

          // Left motor
          var leftMotor = BABYLON.MeshBuilder.CreateCylinder("motorL", {
            height: motorLength,
            diameter: motorDiameter,
            tessellation: 20
          }, scene);
          leftMotor.material = motorMat;
          leftMotor.rotation.z = Math.PI / 2;
          leftMotor.position.x = -motorCenterX;
          leftMotor.position.y = wheelY;
          leftMotor.position.z = wheelZ;
          leftMotor.parent = body;
          scene.shadowGenerator.addShadowCaster(leftMotor);

          // Left motor end cap
          var leftCap = BABYLON.MeshBuilder.CreateCylinder("motorCapL", {
            height: 0.2,
            diameter: motorDiameter * 0.85,
            tessellation: 20
          }, scene);
          leftCap.material = endCapMat;
          leftCap.rotation.z = Math.PI / 2;
          leftCap.position.x = -(bodyEdgeX - motorLength - 0.1);
          leftCap.position.y = wheelY;
          leftCap.position.z = wheelZ;
          leftCap.parent = body;
          scene.shadowGenerator.addShadowCaster(leftCap);

          // Left shaft
          var leftShaft = BABYLON.MeshBuilder.CreateCylinder("shaftL", {
            height: shaftLength,
            diameter: shaftDiameter,
            tessellation: 8
          }, scene);
          leftShaft.material = shaftMat;
          leftShaft.rotation.z = Math.PI / 2;
          leftShaft.position.x = -(bodyEdgeX + shaftLength / 2);
          leftShaft.position.y = wheelY;
          leftShaft.position.z = wheelZ;
          leftShaft.parent = body;
          scene.shadowGenerator.addShadowCaster(leftShaft);

          // Right motor
          var rightMotor = BABYLON.MeshBuilder.CreateCylinder("motorR", {
            height: motorLength,
            diameter: motorDiameter,
            tessellation: 20
          }, scene);
          rightMotor.material = motorMat;
          rightMotor.rotation.z = Math.PI / 2;
          rightMotor.position.x = motorCenterX;
          rightMotor.position.y = wheelY;
          rightMotor.position.z = wheelZ;
          rightMotor.parent = body;
          scene.shadowGenerator.addShadowCaster(rightMotor);

          // Right motor end cap
          var rightCap = BABYLON.MeshBuilder.CreateCylinder("motorCapR", {
            height: 0.2,
            diameter: motorDiameter * 0.85,
            tessellation: 20
          }, scene);
          rightCap.material = endCapMat;
          rightCap.rotation.z = Math.PI / 2;
          rightCap.position.x = bodyEdgeX - motorLength - 0.1;
          rightCap.position.y = wheelY;
          rightCap.position.z = wheelZ;
          rightCap.parent = body;
          scene.shadowGenerator.addShadowCaster(rightCap);

          // Right shaft
          var rightShaft = BABYLON.MeshBuilder.CreateCylinder("shaftR", {
            height: shaftLength,
            diameter: shaftDiameter,
            tessellation: 8
          }, scene);
          rightShaft.material = shaftMat;
          rightShaft.rotation.z = Math.PI / 2;
          rightShaft.position.x = bodyEdgeX + shaftLength / 2;
          rightShaft.position.y = wheelY;
          rightShaft.position.z = wheelZ;
          rightShaft.parent = body;
          scene.shadowGenerator.addShadowCaster(rightShaft);

          // Motor support brackets (built-in)
          if (options.showMotorSupports) {
            var bracketMat = new BABYLON.StandardMaterial('motorBracket', scene);
            bracketMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.42);
            bracketMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            bracketMat.specularPower = 32;
            bracketMat.freeze();

            var bracketThickness = motorRadius * 0.2;
            var bodyBottomY = -(options.bodyHeight / 2);

            function createMotorBracket(side) {
              var xSign = (side == 'left') ? -1 : 1;
              var outsideX = xSign * (bodyEdgeX + bracketThickness / 2);

              // Motor face plate (visible on outside of body, around shaft)
              var facePlate = BABYLON.MeshBuilder.CreateCylinder("bracket_face_" + side, {
                height: bracketThickness,
                diameter: motorDiameter * 1.3,
                tessellation: 20
              }, scene);
              facePlate.material = bracketMat;
              facePlate.rotation.z = Math.PI / 2;
              facePlate.position.x = outsideX;
              facePlate.position.y = wheelY;
              facePlate.position.z = wheelZ;
              facePlate.parent = body;
              scene.shadowGenerator.addShadowCaster(facePlate);

              // Two clamp bands around motor (visible from underneath/sides)
              var band1X = xSign * (bodyEdgeX - motorLength * 0.2);
              var band2X = xSign * (bodyEdgeX - motorLength * 0.7);
              var clampThickness = motorRadius * 0.15;

              var band1 = BABYLON.MeshBuilder.CreateTorus("bracket_band1_" + side, {
                diameter: motorDiameter + clampThickness * 2,
                thickness: clampThickness,
                tessellation: 20
              }, scene);
              band1.material = bracketMat;
              band1.rotation.z = Math.PI / 2;
              band1.position.x = band1X;
              band1.position.y = wheelY;
              band1.position.z = wheelZ;
              band1.parent = body;
              scene.shadowGenerator.addShadowCaster(band1);

              var band2 = BABYLON.MeshBuilder.CreateTorus("bracket_band2_" + side, {
                diameter: motorDiameter + clampThickness * 2,
                thickness: clampThickness,
                tessellation: 20
              }, scene);
              band2.material = bracketMat;
              band2.rotation.z = Math.PI / 2;
              band2.position.x = band2X;
              band2.position.y = wheelY;
              band2.position.z = wheelZ;
              band2.parent = body;
              scene.shadowGenerator.addShadowCaster(band2);

              // Top rail connecting both bands to body (above motor)
              var railLength = Math.abs(band1X - band2X) + clampThickness * 2;
              var railY = wheelY + motorRadius + clampThickness;
              var topRail = BABYLON.MeshBuilder.CreateBox("bracket_rail_" + side, {
                width: railLength,
                height: bracketThickness * 0.8,
                depth: bracketThickness
              }, scene);
              topRail.material = bracketMat;
              topRail.position.x = (band1X + band2X) / 2;
              topRail.position.y = railY;
              topRail.position.z = wheelZ;
              topRail.parent = body;
              scene.shadowGenerator.addShadowCaster(topRail);

              // Bottom rail connecting both bands (under motor, visible from below)
              var bottomRailY = wheelY - motorRadius - clampThickness;
              var bottomRail = BABYLON.MeshBuilder.CreateBox("bracket_brail_" + side, {
                width: railLength,
                height: bracketThickness * 0.8,
                depth: bracketThickness
              }, scene);
              bottomRail.material = bracketMat;
              bottomRail.position.x = (band1X + band2X) / 2;
              bottomRail.position.y = bottomRailY;
              bottomRail.position.z = wheelZ;
              bottomRail.parent = body;
              scene.shadowGenerator.addShadowCaster(bottomRail);
            }

            createMotorBracket('left');
            createMotorBracket('right');
          }
        }
      }
      resolve();
    });
  };

  // Add label
  this.addLabel = function() {
    if (typeof babylon.gui != 'undefined' && self.name) {
      self.nameLabel = new BABYLON.GUI.Rectangle();
      self.nameLabel.height = '30px';
      self.nameLabel.width = '200px';
      self.nameLabel.cornerRadius = 0;
      self.nameLabel.thickness = 0;
      babylon.gui.addControl(self.nameLabel);

      var label = new BABYLON.GUI.TextBlock();
      self.label = label;
      label.fontFamily = 'sans';
      label.text = self.name;
      label.color = '#FFFF77';
      label.outlineWidth = 1;
      label.outlineColor = 'black'
      label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      label.fontSize = 20;
      self.nameLabel.addControl(label);

      self.nameLabel.linkWithMesh(self.body);
      self.nameLabel.linkOffsetY = -50;

      self.nameLabel.isVisible = false;
    }
  };

  // Hide label
  this.hideLabel = function() {
    if (typeof self.nameLabel != 'undefined') {
      self.nameLabel.isVisible = false;
    }
  };

  // Show label
  this.showLabel = function() {
    if (typeof self.nameLabel != 'undefined') {
      self.nameLabel.isVisible = true;
    }
  };

  // Paintball collide function. Used to notify world of hit for score keeping.
  this.paintballCollide = function(thisImpostor, otherImpostor, hit) {
    if (typeof babylon.world.paintBallHit == 'function'){
      babylon.world.paintBallHit(self, otherImpostor, hit);
    }
  };

  // Add joints
  this.loadJoints = function(components) {
    components.forEach(function(component) {
      if (typeof component.components != 'undefined') {
        self.loadJoints(component.components);
      }
      if (typeof component.loadJoints == 'function') {
        component.loadJoints();
      }
    });
  };

  // Load components
  this.loadComponents = function(componentsConfig, components, parent, compScale) {
    let PORT_LETTERS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    compScale = compScale || 1;

    componentsConfig.forEach(function(componentConfig){
      let component = null;

      // Scale position by componentScale
      let scaledPosition = componentConfig.position;
      if (compScale !== 1 && componentConfig.position) {
        scaledPosition = componentConfig.position.map(function(val) {
          return val * compScale;
        });
      }

      // Add componentScale to options for internal dimension scaling
      let scaledOptions = Object.assign({}, componentConfig.options || {});
      scaledOptions.componentScale = compScale;

      if (componentConfig.type == 'ColorSensor') {
        component = new ColorSensor(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'in' + (++self.sensorCount),
          scaledOptions);
      } else if (componentConfig.type == 'UltrasonicSensor') {
        component = new UltrasonicSensor(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'in' + (++self.sensorCount),
          scaledOptions);
      } else if (componentConfig.type == 'GyroSensor') {
        component = new GyroSensor(
          self.scene,
          parent,
          scaledPosition,
          'in' + (++self.sensorCount),
          scaledOptions);
      } else if (componentConfig.type == 'GPSSensor') {
        component = new GPSSensor(
          self.scene,
          parent,
          scaledPosition,
          'in' + (++self.sensorCount),
          scaledOptions);
      } else if (componentConfig.type == 'Box') {
        component = new BoxBlock(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'Cylinder') {
        component = new CylinderBlock(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'Sphere') {
        component = new SphereBlock(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'Cone') {
        component = new ConeBlock(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'Torus') {
        component = new TorusBlock(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'WheelPassive') {
        component = new WheelPassive(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'MagnetActuator') {
        component = new MagnetActuator(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'out' + PORT_LETTERS[(++self.motorCount)],
          scaledOptions);
      } else if (componentConfig.type == 'ArmActuator') {
        component = new ArmActuator(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'out' + PORT_LETTERS[(++self.motorCount)],
          scaledOptions);
      } else if (componentConfig.type == 'ClawActuator') {
        component = new ClawActuator(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'out' + PORT_LETTERS[(++self.motorCount)],
          scaledOptions);
      } else if (componentConfig.type == 'LaserRangeSensor') {
        component = new LaserRangeSensor(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'in' + (++self.sensorCount),
          scaledOptions);
      } else if (componentConfig.type == 'SwivelActuator') {
        component = new SwivelActuator(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'out' + PORT_LETTERS[(++self.motorCount)],
          scaledOptions);
      } else if (componentConfig.type == 'PaintballLauncherActuator') {
        component = new PaintballLauncherActuator(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'out' + PORT_LETTERS[(++self.motorCount)],
          scaledOptions);
      } else if (componentConfig.type == 'WheelActuator') {
        component = new Wheel(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'out' + PORT_LETTERS[(++self.motorCount)],
          scaledOptions);
      } else if (componentConfig.type == 'Pen') {
        component = new Pen(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'in' + (++self.sensorCount),
          scaledOptions);
      } else if (componentConfig.type == 'TouchSensor') {
        component = new TouchSensor(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'in' + (++self.sensorCount),
          scaledOptions);
      } else if (componentConfig.type == 'CameraSensor') {
        component = new CameraSensor(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'in' + (++self.sensorCount),
          scaledOptions);
      } else if (componentConfig.type == 'LinearActuator') {
        component = new LinearActuator(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'out' + PORT_LETTERS[(++self.motorCount)],
          scaledOptions);
      } else if (componentConfig.type == 'DecorativeModel') {
        component = new DecorativeModel(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'RaspberryPi') {
        component = new DecorativeModel(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'MotorController') {
        component = new DecorativeModel(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'ESPModule') {
        component = new DecorativeModel(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'MiniBreadboard') {
        component = new DecorativeModel(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'ArduinoNano') {
        component = new DecorativeModel(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'ArduinoUno') {
        component = new DecorativeModel(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'BatteryPack') {
        component = new BatteryPack(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          scaledOptions);
      } else if (componentConfig.type == 'LED') {
        component = new LED(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'out' + PORT_LETTERS[(++self.motorCount)],
          scaledOptions);
      } else if (componentConfig.type == 'Display') {
        component = new Display(
          self.scene,
          parent,
          scaledPosition,
          componentConfig.rotation,
          'in' + (++self.sensorCount),
          scaledOptions);
      } else {
        console.log('Unrecognized component type: ' + componentConfig.type);
      }
      if (component != null) {
        component.componentIndex = self.componentIndex++;
      }
      if (component) {
        // Apply individual component scale (from component's own options)
        var individualScale = scaledOptions.scale || 1;
        if (individualScale !== 1 && component.body) {
          component.body.scaling.x *= individualScale;
          component.body.scaling.y *= individualScale;
          component.body.scaling.z *= individualScale;
        }
        // Apply global componentScale on top of individual scale
        if (compScale !== 1 && component.body) {
          component.body.scaling.x *= compScale;
          component.body.scaling.y *= compScale;
          component.body.scaling.z *= compScale;
        }
        if (typeof componentConfig.components != 'undefined') {
          self.loadComponents(componentConfig.components, component.components, component.end, compScale);
        }
        if (typeof component.loadImpostor == 'function') {
          component.loadImpostor();
        }
        components.push(component);
      }
    });
  };

  // Load meshes for components that needs it
  this.loadMeshes = function(meshes) {
    function loadMeshes(components) {
      components.forEach(function(component) {
        if (component.components) {
          loadMeshes(component.components);
        }
        if (typeof component.loadMeshes == 'function') {
          component.loadMeshes(meshes);
        }
      });
    }
    loadMeshes(self.components);
  };

  // Get component based on port name
  this.getComponentByPort = function(port) {
    return self._getComponentByPort(port, self.components);
  };

  this._getComponentByPort = function(port, components) {
    for (let i=0; i<components.length; i++) {
      if (components[i].port == port) {
        return components[i];
      } else if (components[i].components) {
        let result = self._getComponentByPort(port, components[i].components);
        if (result) {
          return result;
        }
      }
    }
  };

  // Get component based on componentIndex
  this.getComponentByIndex = function(index) {
    return self._getComponentByIndex(index, self.components);
  };

  this._getComponentByIndex = function(index, components) {
    for (let i=0; i<components.length; i++) {
      if (components[i].componentIndex == index) {
        return components[i];
      } else if (components[i].components) {
        let result = self._getComponentByIndex(index, components[i].components);
        if (result) {
          return result;
        }
      }
    }
  };

  // Reset robot
  this.reset = function() {
    if (self.leftWheel) {
      self.leftWheel.reset();
    }
    if (self.rightWheel) {
      self.rightWheel.reset();
    }
    self.components.forEach(function(component) {
      if (typeof component.reset == 'function') {
        component.reset();
      }
    })
  };

  // Render loop
  this.render = function(delta) {
    if (self.leftWheel != null) {
      self.leftWheel.render(delta);
    }
    if (self.rightWheel != null) {
      self.rightWheel.render(delta);
    }

    self.components.forEach(function(component) {
      if (typeof component.render == 'function') {
        component.render(delta);
      }
    });
  };

  // Force all motors to stop
  this.stopAll = function() {
    if (self.leftWheel) {
      self.leftWheel.stop();
    }
    if (self.rightWheel) {
      self.rightWheel.stop();
    }
    self.components.forEach(function(component){
      if (typeof component.stop == 'function') {
        component.stop();
      }
    })
  };

  // Send a message
  this.radioSend = function(dest, mailbox, value) {
    const TEAM_MATES = [
      [1],
      [0],
      [3],
      [2]
    ];
    const ALL = [0, 1, 2, 3];

    if (dest == 'all') {
      dest = ALL;
    } else if (dest == 'team') {
      if (self.player == 'single') {
        dest = [1]
      } else {
        dest = TEAM_MATES[self.player];
      }
    } else if (typeof dest == 'number') {
      dest = [dest];
    }

    dest.forEach(function(d){
      if (d == self.player) {
        return;
      }

      let recepient = window.parent.robots[d];

      if (typeof recepient != 'undefined') {
        if (typeof recepient.mailboxes[mailbox] == 'undefined') {
          recepient.mailboxes[mailbox] = [];
        }
        recepient.mailboxes[mailbox].push([value, self.player]);
      }
    })
  };

  // Check if messages available
  this.radioAvailable = function(mailbox) {
    if (typeof self.mailboxes[mailbox] == 'undefined') {
      return 0;
    }

    return self.mailboxes[mailbox].length;
  };

  // Read message
  this.radioRead = function(mailbox) {
    if (typeof self.mailboxes[mailbox] == 'undefined') {
      return null;
    }

    if (self.mailboxes[mailbox].length == 0) {
      return null;
    }

    return self.mailboxes[mailbox].shift();
  };

  // Empty mailbox
  this.radioEmpty = function(mailbox) {
    if (typeof mailbox == 'undefined') {
      self.mailboxes = {};
    } else if (typeof self.mailboxes[mailbox] != 'undefined') {
      self.mailboxes[mailbox] = [];
    }
  };

  // Set button
  this.setHubButton = function(btn, state) {
    self.hubButtons[btn] = state;
  };

  // Get buttons
  this.getHubButtons = function() {
    return self.hubButtons;
  };

  // Set keyboard key state
  this.setKeyPressed = function(key, state) {
    self.keyboardKeys[key.toLowerCase()] = state;
  };

  // Get single keyboard key state
  this.getKeyPressed = function(key) {
    return self.keyboardKeys[key.toLowerCase()] || false;
  };

  // Get all pressed keyboard keys
  this.getKeysPressed = function() {
    let pressed = [];
    for (let key in self.keyboardKeys) {
      if (self.keyboardKeys[key]) {
        pressed.push(key);
      }
    }
    return pressed;
  };

  // Clear all keyboard keys (called on simulation stop/reset)
  this.clearKeyboardKeys = function() {
    self.keyboardKeys = {};
  };

  this.objectTrackerGetByName = function(name){
    if ([0,1,2,3,'team','opponent1','opponent2','self'].includes(name)){
      if (self.player == 'single' && name != 'self'){
        return null;
      }

      let player_num = 0;
      if (typeof name == 'number'){
        player_num = name;
      }
      else if (name == 'team'){
        const TEAM_MATES = [1,0,3,2];
        player_num = TEAM_MATES[self.player];
      }
      else if (name == 'opponent1'){
        const OPP1 = [2,2,0,0];
        player_num = OPP1[self.player];
      }
      else if (name == 'opponent2'){
        const OPP2 = [3,3,1,1];
        player_num = OPP2[self.player];
      }
      else{
        if (self.player == 'single'){
          player_num = 0;
        }
        else{
          player_num = self.player;
        }
      }
      let robot = robots[player_num];
      if (robot != null && robot.body != null){
          return robot.body;
      }
      return null;
    } else if (typeof name == 'string'){
      for (mesh of self.scene.meshes){
        if (mesh.objectTrackerLabel == name){
          return mesh;
        }
      }
    }
    return null;
  };

  this.objectTrackerPosition = function(name){
    let temp = self.objectTrackerGetByName(name);
    if (temp != null){
      let pos = temp.absolutePosition;
      return [pos.x, pos.y, pos.z];
    }
    return null;
  };

  this.objectTrackerVelocity = function(name){
    let temp = self.objectTrackerGetByName(name);
    if (temp != null && temp.physicsImpostor != null){
      let vel = temp.physicsImpostor.getLinearVelocity();
      return [vel.x, vel.y, vel.z];
    }
    return null;
  };

  // Init class
  self.init();
}

