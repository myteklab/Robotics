var configurator = new function() {
  var self = this;

  this.isEmbedded = (window.parent !== window);

  this.savedRobot = null;

  this.bodyTemplate = {
    defaultConfig: {
      bodyHeight: 4,
      bodyWidth: 14,
      bodyLength: 16,
      wheels: true,
      wheelDiameter: 5.6,
      wheelWidth: 0.8,
      wheelToBodyOffset: 0.2,
      bodyEdgeToWheelCenterY: 1,
      bodyEdgeToWheelCenterZ: 2,
      caster: true,
      casterDiameter: 4,
      bodyMass: 1000,
      wheelMass: 200,
      casterMass: 0,
      wheelFriction: 10,
      bodyFriction: 0,
      casterFriction: 0,
      casterOffsetZ: 0,
      bodyColor: '#F09C0D',
      bodyShape: 'box',
      bodyModelURL: '',
      bodyModelScale: 1,
      bodyModelOffsetY: 0,
      bodyMmPerUnit: 0,
      wheelModelURL: '',
      wheelModelScale: 1,
      wheelColor: '#333333',
      showMotors: true,
      showMotorSupports: true,
      motorColor: '#2A2A2A',
      motorDiameter: 2.5,
      motorLength: 3
    },
    optionsConfigurations: [
      // ===== BODY DIMENSIONS =====
      {
        option: 'bodyHeight',
        type: 'slider',
        min: '1',
        max: '20',
        step: '0.5',
        reset: true,
        section: 'Body Dimensions',
        sectionIcon: '📐',
        sectionOpen: true
      },
      {
        option: 'bodyWidth',
        type: 'slider',
        min: '1',
        max: '20',
        step: '0.5',
        reset: true,
        section: 'Body Dimensions'
      },
      {
        option: 'bodyLength',
        type: 'slider',
        min: '1',
        max: '30',
        step: '0.5',
        reset: true,
        section: 'Body Dimensions'
      },
      // ===== BODY SHAPE =====
      {
        option: 'bodyShape',
        type: 'select',
        options: [
          ['Box', 'box'],
          ['Cylinder', 'cylinder'],
          ['Sphere', 'sphere'],
          ['Cone', 'cone'],
          ['Torus', 'torus'],
          ['Custom 3D Model', 'model']
        ],
        reset: true,
        section: 'Body Shape',
        sectionIcon: '🔷'
      },
      {
        option: 'bodyColor',
        type: 'color',
        help: 'Body color in hex',
        reset: true,
        section: 'Body Shape'
      },
      {
        option: 'bodyModelURL',
        type: 'strText',
        reset: true,
        help: 'URL for 3D model file (.glb, .gltf, .stl)',
        section: 'Body Shape',
        showWhen: { option: 'bodyShape', value: 'model' }
      },
      {
        option: 'bodyModelScale',
        type: 'slider',
        min: '0.1',
        max: '10',
        step: '0.1',
        reset: true,
        help: 'Scale factor for the 3D model',
        section: 'Body Shape',
        showWhen: { option: 'bodyShape', value: 'model' }
      },
      {
        option: 'bodyModelOffsetY',
        type: 'slider',
        min: '-10',
        max: '10',
        step: '0.5',
        reset: true,
        help: 'Vertical offset for the model visual',
        section: 'Body Shape',
        showWhen: { option: 'bodyShape', value: 'model' }
      },
      {
        option: 'bodyMmPerUnit',
        type: 'slider',
        min: '0',
        max: '20',
        step: '0.5',
        reset: true,
        help: 'Real world scale: mm per unit (0 = disabled). E.g., 10 means 1 unit = 10mm. Use with 3D models designed in mm.',
        section: 'Body Shape',
        showWhen: { option: 'bodyShape', value: 'model' }
      },
      // ===== BODY APPEARANCE =====
      {
        option: 'imageType',
        type: 'select',
        options: [
          ['None', 'none'],
          ['Repeat on every face', 'repeat'],
          ['Only on top face', 'top'],
          ['Only on front face', 'front'],
          ['Map across all faces', 'all']
        ],
        reset: true,
        section: 'Body Appearance',
        sectionIcon: '🎨'
      },
      {
        option: 'imageURL',
        type: 'selectImage',
        reset: true,
        section: 'Body Appearance',
        showWhen: { option: 'imageType', notValue: 'none' }
      },
      {
        option: 'imageURL',
        type: 'strText',
        reset: true,
        help: 'URL for robot body image. Will not work with most webhosts; Imgur will work.',
        section: 'Body Appearance',
        showWhen: { option: 'imageType', notValue: 'none' }
      },
      // ===== WHEELS =====
      {
        option: 'wheels',
        type: 'boolean',
        reset: true,
        section: 'Wheels',
        sectionIcon: '⚙️'
      },
      {
        option: 'wheelDiameter',
        type: 'slider',
        min: '1',
        max: '10',
        step: '0.1',
        reset: true,
        section: 'Wheels',
        showWhen: { option: 'wheels', value: true }
      },
      {
        option: 'wheelWidth',
        type: 'slider',
        min: '0.2',
        max: '4',
        step: '0.1',
        reset: true,
        section: 'Wheels',
        showWhen: { option: 'wheels', value: true }
      },
      {
        option: 'wheelColor',
        type: 'color',
        reset: true,
        help: 'Color for wheels (used when model has no materials)',
        section: 'Wheels',
        showWhen: { option: 'wheels', value: true }
      },
      {
        option: 'wheelToBodyOffset',
        type: 'slider',
        min: '0.1',
        max: '2',
        step: '0.1',
        reset: true,
        section: 'Wheels',
        showWhen: { option: 'wheels', value: true }
      },
      {
        option: 'bodyEdgeToWheelCenterY',
        type: 'slider',
        min: '0.1',
        max: '5',
        step: '0.1',
        reset: true,
        section: 'Wheels',
        showWhen: { option: 'wheels', value: true }
      },
      {
        option: 'bodyEdgeToWheelCenterZ',
        type: 'slider',
        min: '0.1',
        max: '20',
        step: '0.1',
        reset: true,
        section: 'Wheels',
        showWhen: { option: 'wheels', value: true }
      },
      // ===== WHEEL MODEL =====
      {
        option: 'wheelModelURL',
        type: 'strText',
        reset: true,
        help: 'URL for wheel model (.glb, .gltf, .stl). Physics cylinder stays unchanged.',
        section: 'Wheel 3D Model',
        sectionIcon: '🛞',
        showWhen: { option: 'wheels', value: true }
      },
      {
        option: 'wheelModelScale',
        type: 'slider',
        min: '0.1',
        max: '10',
        step: '0.1',
        reset: true,
        help: 'Scale factor for the wheel model',
        section: 'Wheel 3D Model',
        showWhen: { option: 'wheels', value: true }
      },
      // ===== MOTORS =====
      {
        option: 'showMotors',
        type: 'boolean',
        reset: true,
        help: 'Show gear motors attached to the wheels',
        section: 'Motors',
        sectionIcon: '🔌',
        showWhen: { option: 'wheels', value: true }
      },
      {
        option: 'motorColor',
        type: 'color',
        reset: true,
        help: 'Color of the motor housing',
        section: 'Motors',
        showWhen: { option: 'showMotors', value: true }
      },
      {
        option: 'motorDiameter',
        type: 'slider',
        min: '1',
        max: '6',
        step: '0.25',
        reset: true,
        help: 'Diameter of the motor housing',
        section: 'Motors',
        showWhen: { option: 'showMotors', value: true }
      },
      {
        option: 'motorLength',
        type: 'slider',
        min: '1',
        max: '8',
        step: '0.25',
        reset: true,
        help: 'Length of the motor housing',
        section: 'Motors',
        showWhen: { option: 'showMotors', value: true }
      },
      {
        option: 'showMotorSupports',
        type: 'boolean',
        reset: true,
        help: 'Show motor mount brackets attaching motors to the body',
        section: 'Motors',
        showWhen: { option: 'showMotors', value: true }
      },
      // ===== CASTERS =====
      {
        option: 'caster',
        type: 'boolean',
        reset: true,
        section: 'Caster Wheel',
        sectionIcon: '🔘'
      },
      {
        option: 'casterDiameter',
        type: 'slider',
        min: '0',
        max: '10',
        step: '0.1',
        reset: true,
        help: 'Set to 0 to use wheel diameter',
        section: 'Caster Wheel',
        showWhen: { option: 'caster', value: true }
      },
      {
        option: 'casterOffsetZ',
        type: 'slider',
        min: '0',
        max: '20',
        step: '0.5',
        reset: true,
        section: 'Caster Wheel',
        showWhen: { option: 'caster', value: true }
      },
      // ===== PHYSICS =====
      {
        option: 'bodyMass',
        type: 'floatText',
        section: 'Physics',
        sectionIcon: '⚖️'
      }
    ]
  };

  this.componentTemplates = [
    {
      name: 'Box',
      category: 'Blocks',
      defaultConfig: {
        type: 'Box',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          height: 1,
          width: 1,
          depth: 1,
          color: '4A90D9',
          imageType: 'repeat',
          imageURL: '',
          uScale: 1,
          vScale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'height',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'width',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'depth',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'color',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'imageType',
          type: 'select',
          options: [
            ['None', 'none'],
            ['Repeat on every face', 'repeat'],
            ['Only on top face', 'top'],
            ['Only on front face', 'front'],
            ['Map across all faces', 'all']
          ],
          reset: true
        },
        {
          option: 'imageURL',
          type: 'selectImage',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'strText',
          reset: true,
          help: 'URL for image texture. Will not work with most webhosts; Imgur will work.'
        },  
      ]
    },
    {
      name: 'Cylinder',
      category: 'Blocks',
      defaultConfig: {
        type: 'Cylinder',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          height: 1,
          diameter: 1,
          color: 'D94A4A',
          imageType: 'cylinder',
          imageURL: '',
          uScale: 1,
          vScale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'height',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'diameter',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'color',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'selectImage',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'strText',
          reset: true,
          help: 'URL for image texture. Will not work with most webhosts; Imgur will work.'
        },
      ]
    },
    {
      name: 'Sphere',
      category: 'Blocks',
      defaultConfig: {
        type: 'Sphere',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          diameter: 1,
          color: 'E8A838',
          imageType: 'sphere',
          imageURL: '',
          uScale: 1,
          vScale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'diameter',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'color',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'selectImage',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'strText',
          reset: true,
          help: 'URL for image texture. Will not work with most webhosts; Imgur will work.'
        },
      ]
    },
    {
      name: 'Cone',
      category: 'Blocks',
      defaultConfig: {
        type: 'Cone',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          height: 2,
          diameter: 1,
          color: '7B4AD9',
          imageType: 'cylinder',
          imageURL: '',
          uScale: 1,
          vScale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'height',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'diameter',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'color',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'selectImage',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'strText',
          reset: true,
          help: 'URL for image texture. Will not work with most webhosts; Imgur will work.'
        },
      ]
    },
    {
      name: 'Torus',
      category: 'Blocks',
      defaultConfig: {
        type: 'Torus',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          diameter: 2,
          thickness: 0.5,
          color: '3DC9A8',
          imageType: 'sphere',
          imageURL: '',
          uScale: 1,
          vScale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'diameter',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'thickness',
          type: 'slider',
          min: '0.1',
          max: '5',
          step: '0.1',
          reset: true
        },
        {
          option: 'color',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'selectImage',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'strText',
          reset: true,
          help: 'URL for image texture. Will not work with most webhosts; Imgur will work.'
        },
      ]
    },
    {
      name: 'ColorSensor',
      category: 'Sensors',
      defaultConfig: {
        type: 'ColorSensor',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'sensorMinRange',
          type: 'floatText',
          help: 'Anything nearer than this will not be detected. Leave blank to use default.'
        },
        {
          option: 'sensorMaxRange',
          type: 'floatText',
          help: 'Anything further than this will not be detected. Leave blank to use default.'
        },
        {
          option: 'sensorFov',
          type: 'floatText',
          help: 'Field of View in radians. Leave blank to use default.'
        },
      ]
    },
    {
      name: 'UltrasonicSensor',
      category: 'Sensors',
      defaultConfig: {
        type: 'UltrasonicSensor',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'rayLength',
          type: 'floatText',
          help: 'Anything further than this will not be detected. Leave blank to use default.'
        },
        {
          option: 'rayIncidentLimit',
          type: 'floatText',
          help: 'Ignore object if angle of incident (radian) is greater than this. Leave blank to use default.'
        },
        {
          option: 'useRealisticModel',
          type: 'boolean',
          reset: true,
          help: 'Use a realistic 3D model instead of the stylized version'
        },
      ]
    },
    {
      name: 'LaserRangeSensor',
      category: 'Sensors',
      defaultConfig: {
        type: 'LaserRangeSensor',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'rayLength',
          type: 'floatText',
          help: 'Anything further than this will not be detected. Leave blank to use default.'
        },
      ]
    },
    {
      name: 'TouchSensor',
      category: 'Sensors',
      defaultConfig: {
        type: 'TouchSensor',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          width: 2,
          depth: 2,
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'width',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'depth',
          type: 'slider',
          min: '1',
          max: '20',
          step: '1',
          reset: true
        },
      ]
    },
    {
      name: 'GyroSensor',
      category: 'Sensors',
      defaultConfig: {
        type: 'GyroSensor',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
      ]
    },
    {
      name: 'GPSSensor',
      category: 'Sensors',
      defaultConfig: {
        type: 'GPSSensor',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
      ]
    },
    {
      name: 'CameraSensor',
      category: 'Sensors',
      defaultConfig: {
        type: 'CameraSensor',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'fov',
          type: 'floatText',
          help: 'Field of View in radians (default 1.2). Wider = more visible area.'
        },
        {
          option: 'maxRange',
          type: 'floatText',
          help: 'Maximum visible distance (default 200).'
        },
      ]
    },
    {
      name: 'MagnetActuator',
      category: 'Actuators',
      defaultConfig: {
        type: 'MagnetActuator',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'maxRange',
          type: 'floatText',
          help: 'Anything further than this will not be attracted. Leave blank to use default.'
        },
        {
          option: 'maxPower',
          type: 'floatText',
          help: 'Maximum attraction force. Actual will be lower due to distance falloff. Leave blank to use default.'
        },
        {
          option: 'dGain',
          type: 'floatText',
          help: 'Positive gain used to reduce wobbling of objects being attracted. Leave blank to use default of none (0).'
        }
      ]
    },
    {
      name: 'ArmActuator',
      category: 'Actuators',
      defaultConfig: {
        type: 'ArmActuator',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        components: [],
        options: {
          armLength: 18,
          minAngle: -5,
          maxAngle: 180,
          mass: 100,
          startAngle: 0,
          baseColor: 'A39C0D',
          pivotColor: '808080',
          armColor: 'A3CF0D',
          imageType: 'repeat',
          imageURL: '',
          uScale: 1,
          vScale: 1,
          restitution: 0.4,
          friction: 0.1,
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'armLength',
          type: 'floatText',
          help: 'Length of arm in cm. Leave blank to use default.',
          reset: true
        },
        {
          option: 'baseColor',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'pivotColor',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'armColor',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'imageType',
          type: 'select',
          options: [
            ['None', 'none'],
            ['Repeat on every face', 'repeat'],
            ['Only on top face', 'top'],
            ['Only on front face', 'front'],
            ['Map across all faces', 'all']
          ],
          reset: true
        },
        {
          option: 'imageURL',
          type: 'selectImage',
          reset: true
        },
        {
          option: 'imageURL',
          type: 'strText',
          reset: true,
          help: 'URL for image texture. Will not work with most webhosts; Imgur will work.'
        },
        {
          option: 'minAngle',
          type: 'floatText',
          help: 'Lowest possible angle for arm. Leave blank to use default.'
        },
        {
          option: 'maxAngle',
          type: 'floatText',
          help: 'Highest possible angle for arm. Leave blank to use default.'
        },
        {
          option: 'mass',
          type: 'floatText',
          help: 'If chaining actuators, it\'s recommended to reduce mass of child actuators'
        },
        {
          option: 'startAngle',
          type: 'floatText',
          reset: true
        },
        {
          option: 'friction',
          type: 'slider',
          min: '0',
          max: '1',
          step: '0.05',
          help: 'This will also apply to all child objects'
        },
      ]
    },
    {
      name: 'ClawActuator',
      category: 'Actuators',
      defaultConfig: {
        type: 'ClawActuator',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          jawLength: 6,
          jawWidth: 1,
          minAngle: 0,
          maxAngle: 45,
          startAngle: 30,
          gripAngleThreshold: 5,
          mass: 50,
          restitution: 0.4,
          friction: 0.8,
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'jawLength',
          type: 'floatText',
          help: 'Length of each jaw in cm. Leave blank to use default.',
          reset: true
        },
        {
          option: 'jawWidth',
          type: 'floatText',
          help: 'Width of each jaw in cm. Leave blank to use default.',
          reset: true
        },
        {
          option: 'minAngle',
          type: 'floatText',
          help: 'Closed position angle (degrees). 0 = fully closed.'
        },
        {
          option: 'maxAngle',
          type: 'floatText',
          help: 'Fully open angle (degrees). Leave blank to use default.'
        },
        {
          option: 'startAngle',
          type: 'floatText',
          help: 'Initial opening angle (degrees).',
          reset: true
        },
        {
          option: 'gripAngleThreshold',
          type: 'floatText',
          help: 'Degrees from closed at which grip engages. Leave blank to use default.'
        },
        {
          option: 'mass',
          type: 'floatText',
          help: 'Total jaw mass (split between two pivots). Reduce if mounted on an arm.'
        },
        {
          option: 'friction',
          type: 'slider',
          min: '0',
          max: '1',
          step: '0.05',
          help: 'Jaw surface friction. Higher = better grip on objects.'
        },
      ]
    },
    {
      name: 'SwivelActuator',
      category: 'Actuators',
      defaultConfig: {
        type: 'SwivelActuator',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        components: [],
        options: {
          mass: 100,
          baseColor: 'A39C0D',
          platformColor: '808080',
          width: 3,
          restitution: 0.4,
          friction: 0.1,
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'baseColor',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'platformColor',
          type: 'color',
          help: 'Color in hex',
          reset: true
        },
        {
          option: 'width',
          type: 'slider',
          min: '1',
          max: '20',
          step: '0.5',
          reset: true,
          help: 'Width of the base'
        },
        {
          option: 'mass',
          type: 'floatText',
          help: 'If chaining actuators, it\'s recommended to reduce mass of child actuators'
        },
        {
          option: 'friction',
          type: 'slider',
          min: '0',
          max: '1',
          step: '0.05',
          help: 'This will also apply to all child objects'
        },
      ]
    },
    {
      name: 'LinearActuator',
      category: 'Actuators',
      defaultConfig: {
        type: 'LinearActuator',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        components: [],
        options: {
          mass: 100,
          restitution: 0.1,
          friction: 1,
          degreesPerCm: 360,
          width: 2,
          baseColor: 'A39C0D',
          baseLength: 5,
          baseThickness: 1,
          platformLength: 2,
          platformThickness: 1,
          platformColor: '808080',
          max: 10,
          min: -10,
          startPos: 0,
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'mass',
          type: 'floatText',
          help: 'If chaining actuators, it\'s recommended to reduce mass of child actuators'
        },
        {
          option: 'degreesPerCm',
          type: 'floatText',
          help: 'The degrees of rotation required to produce one cm of linear movement'
        },
        {
          option: 'baseColor',
          type: 'color',
          reset: true
        },
        {
          option: 'width',
          type: 'slider',
          min: '0',
          max: '5',
          step: '0.1',
          reset: true,
          help: 'Width of both the base and moving platform'
        },
        {
          option: 'baseLength',
          type: 'slider',
          min: '1',
          max: '20',
          step: '0.5',
          reset: true,
          help: 'Length of the base'
        },
        {
          option: 'baseThickness',
          type: 'slider',
          min: '0',
          max: '5',
          step: '0.1',
          reset: true,
        },
        {
          option: 'platformColor',
          type: 'color',
          reset: true
        },
        {
          option: 'platformLength',
          type: 'slider',
          min: '0',
          max: '5',
          step: '0.1',
          reset: true,
        },
        {
          option: 'platformThickness',
          type: 'slider',
          min: '0',
          max: '5',
          step: '0.1',
          reset: true,
        },
        {
          option: 'startPos',
          type: 'slider',
          min: '-10',
          max: '10',
          step: '0.5',
          reset: true,
          help: 'Starting position of the moving platform'
        },
        {
          option: 'max',
          type: 'floatText',
          help: 'Max position'
        },
        {
          option: 'min',
          type: 'floatText',
          help: 'Min position'
        },
        {
          option: 'friction',
          type: 'slider',
          min: '0',
          max: '1',
          step: '0.05',
          help: 'This will also apply to all child objects'
        },
      ]
    },
    {
      name: 'PaintballLauncherActuator',
      category: 'Actuators',
      defaultConfig: {
        type: 'PaintballLauncherActuator',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'drawBackLimit',
          type: 'floatText',
          help: 'The limit that you can pull back the spring in degrees. Leave blank to use default.'
        },
        {
          option: 'powerScale',
          type: 'floatText',
          help: 'This is multiplied by the spring drawback to determine the initial velocity of the paintball. Leave blank to use default.'
        },
        {
          option: 'maxSpeed',
          type: 'floatText',
          help: 'Maximum rotation speed of the motor. NOT the maximum speed of the paintball. Leave blank to use default.'
        },
        {
          option: 'color',
          type: 'intText',
          help: 'Color of the paintball. From 0 to 5, they are Cyan, Green, Yellow, Red, Magenta, Blue. Leave blank to use default.'
        },
        {
          option: 'ttl',
          type: 'intText',
          help: 'Time-To-Live in milliseconds. After this duration, the paintball will be removed. Leave blank to use default.'
        },
        {
          option: 'ammo',
          type: 'intText',
          help: 'Amount of ammo available to the launcher at start. Set to "-1" for unlimited ammo. Leave blank to use default.'
        },
        {
          option: 'splatterTTL',
          type: 'intText',
          help: 'Time-To-Live in milliseconds for the paint splatter. After this duration, the paint splatter will be removed. Set a negative number to last forever. Leave blank to use default.'
        },
      ]
    },
    {
      name: 'WheelActuator',
      category: 'Actuators',
      defaultConfig: {
        type: 'WheelActuator',
        position: [0, 2.8, 0],
        rotation: [0, 0, 0],
        components: [],
        options: {
          diameter: 5.6,
          width: 0.8,
          mass: 200,
          friction: 10,
          restitution: 0.8,
          modelURL: '',
          modelScale: 1,
          color: '333333'
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'diameter',
          type: 'slider',
          min: '1',
          max: '10',
          step: '0.1',
          reset: true
        },
        {
          option: 'width',
          type: 'slider',
          min: '0.2',
          max: '4',
          step: '0.1',
          reset: true
        },
        {
          option: 'mass',
          type: 'floatText',
        },
        {
          option: 'friction',
          type: 'slider',
          min: '0',
          max: '10',
          step: '0.1',
        },
        {
          option: 'restitution',
          type: 'slider',
          min: '0',
          max: '1',
          step: '0.05',
        },
        {
          option: 'modelURL',
          type: 'strText',
          reset: true,
          help: 'URL for wheel model (.glb, .gltf, .stl). Physics cylinder stays unchanged.'
        },
        {
          option: 'modelScale',
          type: 'slider',
          min: '0.1',
          max: '10',
          step: '0.1',
          reset: true,
          help: 'Scale factor for the wheel model'
        },
        {
          option: 'color',
          type: 'color',
          reset: true,
          help: 'Color for wheel model (used when model has no materials)'
        },
      ]
    },
    {
      name: 'WheelPassive',
      category: 'Others',
      defaultConfig: {
        type: 'WheelPassive',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        components: [],
        options: {
          diameter: 5.6,
          width: 0.8,
          mass: 200,
          friction: 10,
          restitution: 0.8
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'diameter',
          type: 'slider',
          min: '1',
          max: '10',
          step: '0.1',
          reset: true
        },
        {
          option: 'width',
          type: 'slider',
          min: '0.2',
          max: '4',
          step: '0.1',
          reset: true
        },
        {
          option: 'mass',
          type: 'floatText',
        },
        {
          option: 'friction',
          type: 'slider',
          min: '0',
          max: '10',
          step: '0.1',
        },
        {
          option: 'restitution',
          type: 'slider',
          min: '0',
          max: '1',
          step: '0.05',
        },        
      ]
    },
    {
      name: 'Pen',
      category: 'Others',
      defaultConfig: {
        type: 'Pen',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          doubleSided: false,
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'doubleSided',
          type: 'boolean',
          help: 'If true, the drawn trace will be visible from both sides.'
        }
      ]
    },
    {
      name: 'LED',
      category: 'Others',
      defaultConfig: {
        type: 'LED',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          color: 'FF0000',
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'color',
          type: 'text',
          help: 'LED color as hex (e.g. FF0000 for red, 00FF00 for green, 0000FF for blue)'
        }
      ]
    },
    {
      name: 'Display',
      category: 'Others',
      defaultConfig: {
        type: 'Display',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          textColor: '00FF00',
          backgroundColor: '1A1A2E',
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Scale this component'
        },
        {
          option: 'textColor',
          type: 'color',
          reset: true,
          help: 'Text color (hex, default green 00FF00)'
        },
        {
          option: 'backgroundColor',
          type: 'color',
          reset: true,
          help: 'Screen background color (hex, default dark 1A1A2E)'
        }
      ]
    },
    {
      name: 'DecorativeModel',
      category: 'Decorative',
      defaultConfig: {
        type: 'DecorativeModel',
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        options: {
          modelURL: '',
          modelScale: 1,
          color: 'CCCCCC'
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'modelURL',
          type: 'strText',
          reset: true,
          help: 'URL for 3D model file (.glb, .gltf, .stl)'
        },
        {
          option: 'modelScale',
          type: 'slider',
          min: '0.1',
          max: '10',
          step: '0.1',
          reset: true,
          help: 'Scale factor for the model'
        },
        {
          option: 'color',
          type: 'color',
          reset: true,
          help: 'Fallback color if no model loaded'
        }
      ]
    },
    {
      name: 'RaspberryPi',
      category: 'Hardware',
      defaultConfig: {
        type: 'RaspberryPi',
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        options: {
          modelURL: 'models/custom/1-7693-0.glb',
          modelScale: 1.1,
          color: '2E8B57'
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'modelScale',
          type: 'slider',
          min: '0.1',
          max: '5',
          step: '0.1',
          reset: true,
          help: 'Scale factor for the model'
        },
        {
          option: 'color',
          type: 'color',
          reset: true,
          help: 'Fallback color if model fails to load'
        }
      ]
    },
    {
      name: 'MotorController',
      category: 'Hardware',
      defaultConfig: {
        type: 'MotorController',
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        options: {
          modelURL: 'models/custom/1-7694-0.glb',
          modelScale: 50,
          color: '1A1A8B'
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'modelScale',
          type: 'slider',
          min: '1',
          max: '100',
          step: '1',
          reset: true,
          help: 'Scale factor for the model'
        },
        {
          option: 'color',
          type: 'color',
          reset: true,
          help: 'Fallback color if model fails to load'
        }
      ]
    },
    {
      name: 'BatteryPack',
      category: 'Hardware',
      defaultConfig: {
        type: 'BatteryPack',
        position: [0, 5, 0],
        rotation: [0, 0, 0],
        options: {
          holderColor: '1A1A1A',
          batteryColor: '2266BB',
          terminalColor: 'C0C0C0',
          scale: 1
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'scale',
          type: 'slider',
          min: '0.5',
          max: '3',
          step: '0.1',
          reset: true,
          help: 'Overall scale of the battery pack'
        },
        {
          option: 'holderColor',
          type: 'color',
          reset: true,
          help: 'Color of the battery holder case'
        },
        {
          option: 'batteryColor',
          type: 'color',
          reset: true,
          help: 'Color of the battery bodies'
        }
      ]
    },
    {
      name: 'ESPModule',
      category: 'Hardware',
      defaultConfig: {
        type: 'ESPModule',
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        options: {
          modelURL: 'models/custom/1-7779-0.glb',
          modelScale: 0.5,
          color: '1A1A8B'
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'modelScale',
          type: 'slider',
          min: '0.1',
          max: '10',
          step: '0.1',
          reset: true,
          help: 'Scale factor for the model'
        },
        {
          option: 'color',
          type: 'color',
          reset: true,
          help: 'Fallback color if model fails to load'
        }
      ]
    },
    {
      name: 'MiniBreadboard',
      category: 'Hardware',
      defaultConfig: {
        type: 'MiniBreadboard',
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        options: {
          modelURL: 'models/custom/1-7777-0.glb',
          modelScale: 1,
          color: 'F5F5DC'
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'modelScale',
          type: 'slider',
          min: '1',
          max: '500',
          step: '5',
          reset: true,
          help: 'Scale factor for the model'
        },
        {
          option: 'color',
          type: 'color',
          reset: true,
          help: 'Fallback color if model fails to load'
        }
      ]
    },
    {
      name: 'ArduinoNano',
      category: 'Hardware',
      defaultConfig: {
        type: 'ArduinoNano',
        position: [0, 3, 0],
        rotation: [0, 0, 0],
        options: {
          modelURL: 'models/custom/1-7783-0.glb',
          modelScale: 5,
          color: '008080'
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'modelScale',
          type: 'slider',
          min: '0.1',
          max: '10',
          step: '0.1',
          reset: true,
          help: 'Scale factor for the model'
        },
        {
          option: 'color',
          type: 'color',
          reset: true,
          help: 'Fallback color if model fails to load'
        }
      ]
    },
    {
      name: 'ArduinoUno',
      category: 'Hardware',
      defaultConfig: {
        type: 'ArduinoUno',
        position: [0, 3, 0],
        rotation: [1.5708, 0, 0],
        options: {
          modelURL: 'models/custom/1-7784-0.glb',
          modelScale: 5,
          color: '008080'
        }
      },
      optionsConfigurations: [
        {
          option: 'position',
          type: 'vectors',
          min: '-20',
          max: '20',
          step: '1',
          reset: true
        },
        {
          option: 'rotation',
          type: 'vectors',
          min: '-180',
          max: '180',
          step: '5',
          deg2rad: true,
          reset: true
        },
        {
          option: 'modelScale',
          type: 'slider',
          min: '0.1',
          max: '10',
          step: '0.1',
          reset: true,
          help: 'Scale factor for the model'
        },
        {
          option: 'color',
          type: 'color',
          reset: true,
          help: 'Fallback color if model fails to load'
        }
      ]
    },
  ];

  this.pointerDragPlaneNormal = new BABYLON.Vector3(0,1,0);

  // Run on page load
  this.init = function() {
    if (typeof babylon.scene == 'undefined') {
      setTimeout(self.init, 500);
      return;
    }

    self.$panelControls = $('.panelControlsArea .panelControls');
    self.$panels = $('.panels .panel');
    self.$fileMenu = $('.fileMenu');
    self.$robotMenu = $('.robotMenu');
    self.$snapMenu = $('.snapMenu');

    self.$robotName = $('#robotName');

    self.$addComponent = $('.addComponent');
    self.$deleteComponent = $('.deleteComponent');
    self.$componentList = $('.componentsList');
    self.$settingsArea = $('.settingsArea');
    self.$undo = $('.undo');

    self.$fileMenu.click(self.toggleFileMenu);
    self.$robotMenu.click(self.toggleRobotMenu);
    self.$snapMenu.click(self.toggleSnapMenu);

    self.$addComponent.click(self.addComponent);
    self.$deleteComponent.click(self.deleteComponent);
    self.$undo.click(self.undo);

    //self.$robotName.change(self.setRobotName);

    babylon.scene.physicsEnabled = false;
    babylon.setCameraMode('arc')
    babylon.renders.push(self.render);

    // Callback for when body model size is calculated (with real world scale)
    // Updates robot.options and triggers a rebuild with correct dimensions
    self._bodySizeRebuildPending = false;
    robot.onBodySizeCalculated = function(width, height, length) {
      // Round to 1 decimal place for cleaner display
      var roundedWidth = Math.round(width * 10) / 10;
      var roundedHeight = Math.round(height * 10) / 10;
      var roundedLength = Math.round(length * 10) / 10;

      // Check if dimensions actually changed (avoid infinite rebuild loops)
      var widthChanged = Math.abs(robot.options.bodyWidth - roundedWidth) > 0.05;
      var heightChanged = Math.abs(robot.options.bodyHeight - roundedHeight) > 0.05;
      var lengthChanged = Math.abs(robot.options.bodyLength - roundedLength) > 0.05;

      if (!widthChanged && !heightChanged && !lengthChanged) {
        console.log('Body model size unchanged, skipping rebuild');
        return;
      }

      // Prevent multiple concurrent rebuilds
      if (self._bodySizeRebuildPending) {
        return;
      }

      console.log('Body model size (in sim units):', roundedWidth, 'x', roundedHeight, 'x', roundedLength);

      // Show helpful info about current scale
      if (robot.options.bodyMmPerUnit && robot.options.bodyMmPerUnit > 0) {
        var mmPerUnit = robot.options.bodyMmPerUnit;
        console.log('Scale: 1 unit = ' + mmPerUnit + 'mm');
        console.log('Body size in mm: ' + Math.round(roundedWidth * mmPerUnit) + ' x ' + Math.round(roundedHeight * mmPerUnit) + ' x ' + Math.round(roundedLength * mmPerUnit));
      }

      // Update robot options with actual dimensions
      robot.options.bodyWidth = roundedWidth;
      robot.options.bodyHeight = roundedHeight;
      robot.options.bodyLength = roundedLength;

      // Trigger rebuild with correct dimensions (delayed to avoid conflicts)
      self._bodySizeRebuildPending = true;
      setTimeout(function() {
        self._bodySizeRebuildPending = false;
        self.resetScene();
      }, 100);
    };

    self.saveHistory();
    self.resetScene();
    self.saveRobotOptions();

    // Embedded mode: auto-sync changes to parent, listen for initial config
    if (self.isEmbedded) {
      var _receivingFromParent = false;
      var _syncTimer = null;

      // Wrap resetScene to auto-sync robot changes to parent (debounced)
      var _origResetScene = self.resetScene;
      self.resetScene = function() {
        var result = _origResetScene.apply(self, arguments);
        if (!_receivingFromParent) {
          if (_syncTimer) clearTimeout(_syncTimer);
          _syncTimer = setTimeout(function() {
            window.parent.postMessage({
              type: 'robotics:applyRobot',
              robotOptions: JSON.parse(JSON.stringify(robot.options))
            }, '*');
          }, 300);
        }
        return result;
      };

      // Listen for initial config from parent
      window.addEventListener('message', function(event) {
        var data = event.data;
        if (!data || data.type !== 'robotics:loadRobot') return;

        try {
          var opts = data.robotOptions;
          if (typeof opts === 'string') {
            opts = JSON.parse(opts);
          }
          _receivingFromParent = true;
          robot.options = JSON.parse(JSON.stringify(opts));
          self.resetScene();
          self.saveRobotOptions();
        } catch (e) {
          console.error('Configurator: failed to load robot from parent', e);
        } finally {
          _receivingFromParent = false;
        }
      });

      window.parent.postMessage({ type: 'robotics:childReady', tool: 'configurator' }, '*');
    }
  };

  // Apply pointerDragBehavior to selected mesh
  this.applyDragToSelected = function() {
    let selected = self.$componentList.find('.component-item.selected');
    if (selected.length < 1) {
      return;
    }

    let index = selected[0].componentIndex;
    if (typeof index != 'undefined') {
      let dragBody = robot.getComponentByIndex(index).body;
      let dragBodyPos;

      if (dragBody.getBehaviorByName('PointerDrag')) {
        return;
      }

      let selected = self.$componentList.find('.component-item.selected');
      if (typeof selected[0].component == 'undefined') {
        return;
      }

      function notClose(a, b) {
        if (Math.abs(a - b) > 0.01) {
          return true;
        }
        return false;
      }

      // Object drag start
      function dragStart(event) {
        dragBodyPos = dragBody.position.clone();
      }

      // Object drag
      function drag(event) {
        let delta = event.delta;
        
        if (dragBody.parent) {
          let matrix = dragBody.parent.getWorldMatrix().clone().invert();
          matrix.setTranslation(BABYLON.Vector3.Zero());
          delta = BABYLON.Vector3.TransformCoordinates(delta, matrix);  
        }

        dragBodyPos.addInPlace(delta);

        if (notClose(selected[0].component.position[0], dragBodyPos.x)) {
          dragBody.position.x = self.roundToSnap(dragBodyPos.x, self.snapStep[0]);
        }
        if (notClose(selected[0].component.position[1], dragBodyPos.y)) {
          dragBody.position.y = self.roundToSnap(dragBodyPos.y, self.snapStep[2]);
        }
        if (notClose(selected[0].component.position[2], dragBodyPos.z)) {
          dragBody.position.z = self.roundToSnap(dragBodyPos.z, self.snapStep[1]);
        }
      }

      // Object drag end
      function dragEnd(event) {
        self.saveHistory();
        let pos = dragBody.position;

        if (dragBody.parent == null && typeof dragBody.component.parent != 'undefined') {
          pos = pos.subtract(dragBody.component.parent.absolutePosition);
        }

        if (notClose(selected[0].component.position[0], pos.x)) {
          selected[0].component.position[0] = self.roundToSnap(pos.x, self.snapStep[0]);
        }
        if (notClose(selected[0].component.position[1], pos.y)) {
          selected[0].component.position[1] = self.roundToSnap(pos.y, self.snapStep[2]);
        }
        if (notClose(selected[0].component.position[2], pos.z)) {
          selected[0].component.position[2] = self.roundToSnap(pos.z, self.snapStep[1]);
        }
        self.resetScene(false);
      };

      let pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: self.pointerDragPlaneNormal});
      pointerDragBehavior.useObjectOrientationForDragging = false;
      pointerDragBehavior.moveAttached = false;

      pointerDragBehavior.onDragStartObservable.add(dragStart);
      pointerDragBehavior.onDragObservable.add(drag);
      pointerDragBehavior.onDragEndObservable.add(dragEnd);

      dragBody.isPickable = true;
      dragBody.addBehavior(pointerDragBehavior);
    }
  };
  
  // Runs every frame
  this.render = function(delta) {
    let camera = babylon.scene.activeCamera;
    let dir = camera.getTarget().subtract(camera.position);
    let x2 = dir.x ** 2;
    let y2 = dir.y ** 2;
    let z2 = dir.z ** 2;
    let max = Math.max(x2, y2, z2);

    self.pointerDragPlaneNormal.x = 0;
    self.pointerDragPlaneNormal.y = 0;
    self.pointerDragPlaneNormal.z = 0;
    if (x2 == max) {
      self.pointerDragPlaneNormal.x = 1;
    } else if (y2 == max) {
      self.pointerDragPlaneNormal.y = 1;
    } else {
      self.pointerDragPlaneNormal.z = 1;
    }

    if (self.wireframe && typeof self.wireframe.body != 'undefined') {
      self.wireframe.body.computeWorldMatrix(true);
    }
  }

  // Save history
  this.saveHistory = function() {
    if (typeof self.editHistory == 'undefined') {
      self.editHistory = [];
    }

    self.editHistory.push(JSON.stringify(robot.options));
  };

  // Clear history
  this.clearHistory = function() {
    if (typeof self.editHistory != 'undefined') {
      self.editHistory = [];
    }
  };

  // Undo
  this.undo = function() {
    if (typeof self.editHistory != 'undefined' && self.editHistory.length > 0) {
      var lastDesign = self.editHistory.pop();
      robot.options = JSON.parse(lastDesign);
      self.resetScene();
    }
  };

  // Save robot options
  this.saveRobotOptions = function() {
    self.savedRobot = JSON.parse(JSON.stringify(robot.options));
  };

  // Load robot options
  this.loadRobotOptions = function() {
    robot.options = JSON.parse(JSON.stringify(self.savedRobot));
    self.resetScene();
  };

  // Set the robot name
  this.setRobotName = function() {
    //robot.options.name = self.$robotName.val();
  };

  // Show options
  this.showComponentOptions = function(component) {
    // Preserve which sections are expanded before clearing
    var openSections = {};
    self.$settingsArea.find('.config-section.open').each(function() {
      var name = $(this).attr('data-section');
      if (name) openSections[name] = true;
    });

    self.$settingsArea.empty();

    let genConfig = new GenConfig(self, self.$settingsArea);

    if (typeof component.options == 'undefined' || component.options == null) {
      component.options = {};
    }

    if (typeof component.bodyMass != 'undefined') { // main body
      // Fill in missing body properties from template defaults so sliders show correct initial values
      for (let key in self.bodyTemplate.defaultConfig) {
        if (typeof component[key] == 'undefined') {
          component[key] = self.bodyTemplate.defaultConfig[key];
        }
      }
      genConfig.displayOptionsConfigurations(self.bodyTemplate, component);
    } else {
      let componentTemplate = self.componentTemplates.find(componentTemplate => componentTemplate.name == component.type);
      // Fill in missing component options from template defaults so sliders show correct initial values
      if (componentTemplate.defaultConfig) {
        if (componentTemplate.defaultConfig.options) {
          for (let key in componentTemplate.defaultConfig.options) {
            if (typeof component.options[key] == 'undefined') {
              component.options[key] = componentTemplate.defaultConfig.options[key];
            }
          }
        }
        if (typeof component.position == 'undefined' && componentTemplate.defaultConfig.position) {
          component.position = componentTemplate.defaultConfig.position.slice();
        }
        if (typeof component.rotation == 'undefined' && componentTemplate.defaultConfig.rotation) {
          component.rotation = componentTemplate.defaultConfig.rotation.slice();
        }
      }
      componentTemplate.optionsConfigurations.forEach(function(optionConfiguration){
        let options = component.options;
        if (optionConfiguration.option == 'position' || optionConfiguration.option == 'rotation') {
          options = component;
        }
        if (typeof genConfig.gen[optionConfiguration.type] != 'undefined') {
          self.$settingsArea.append(genConfig.gen[optionConfiguration.type](optionConfiguration, options));
        } else {
          console.log('Unrecognized configuration type');
        }
      });
    }
    if (component.type == 'Pen') {
      self.penSpecialCaseSetup(component);
    }

    // Restore previously expanded sections
    self.$settingsArea.find('.config-section').each(function() {
      var name = $(this).attr('data-section');
      if (name && openSections[name]) {
        $(this).addClass('open');
        $(this).find('.config-section-content').show();
        $(this).find('.section-toggle').text('▼');
      }
    });
  };

  // Select built in images
  this.selectImage = function(opt, objectOptions) {
    let $body = $('<div class="selectImage"></div>');
    let $filter = $(
      '<div class="filter">Filter by Type: ' +
        '<select>' +
          '<option selected value="any">Any</option>' +
          '<option value="box">Box</option>' +
          '<option value="cylinder">Cylinder</option>' +
          '<option value="sphere">Sphere</option>' +
          '<option value="ground">Ground</option>' +
          '<option value="robot">Robot</option>' +
        '</select>' +
      '</div>'
    );
    let $select = $filter.find('select');
    let $imageList = $('<div class="images"></div>');

    BUILT_IN_IMAGES.forEach(function(image){
      let basename = image.url.split('/').pop();

      let $row = $('<div class="row"></div>');
      $row.addClass(image.type);

      let $preview = $('<div class="preview"><img src="' + image.url + '" alt="' + basename + '"></div>');

      let $descriptionBox = $('<div class="description"></div>');
      let $basename = $('<p class="bold"></p>').text(basename + ' (' + image.type + ')');
      let $description = $('<p></p>').text(image.description);
      $descriptionBox.append($basename);
      $descriptionBox.append($description);

      let $selectBox = $('<div class="select"><button>Select</button></div>');
      let $select = $selectBox.find('button');
      $select.prop('url', image.url);

      $select.click(function(e){
        objectOptions.imageURL = e.target.url;
        self.resetScene(false);
        $dialog.close();
      });

      $row.append($preview);
      $row.append($descriptionBox);
      $row.append($selectBox);
      $imageList.append($row);
    });

    $body.append($filter);
    $body.append($imageList);

    $select.change(function(){
      let filter = $select.val();

      $imageList.find('.row').removeClass('hide');
      if (filter != 'any') {
        $imageList.find(':not(.row.' + filter + ')').addClass('hide');
      }
    });

    let $buttons = $(
      '<button type="button" class="cancel btn-light">Cancel</button>'
    );

    let $dialog = dialog('Select Built-In Image', $body, $buttons);

    $buttons.click(function() { $dialog.close(); });
  };

  // Special case for the pen, add some buttons to move it to useful locations
  this.penSpecialCaseSetup = function(component) {

    function moveTo(x,z) {
      let $posDiv = self.$settingsArea.find("div.configurationTitle:contains('position')")
      // Get the input boxes for x/y/z so value changes can be made visible
      let $inputX = $posDiv.next().find('input[type=text]');
      let $inputY = $posDiv.next().next().find('input[type=text]');
      let $inputZ = $posDiv.next().next().next().find('input[type=text]');
      // change only X and Z vals, Y is height from ground
      self.saveHistory();
      $inputX.val(x)
      component.position[0]=x
      $inputZ.val(z)
      component.position[2]=z
      self.resetScene(false);
    };

    let $centerWheelAxisBtn = $('<div class="btn_pen">Center On Wheel Axis</div>');
    $centerWheelAxisBtn.click(function(){
      // move the pen to the center of the wheel axis
      wheelAxisCenter = robot.leftWheel.mesh.position.add(robot.rightWheel.mesh.position).scale(1/2.0)
      moveTo(wheelAxisCenter.x, wheelAxisCenter.z)
    });
    let $centerWheelBtn = $('<div class="btn_pen">Center On Wheel</div>');
    let nextWheelCenter = 'L';
    $centerWheelBtn.click(function(){
      // move the pen to the center of a wheel.
      // Alternate between L and R wheels (and castor?)
      if (nextWheelCenter == 'L') {
        nextWheelCenter = 'R';
        wheelCenter = robot.leftWheel.mesh.position;
      } else {
        nextWheelCenter = 'L';
        wheelCenter = robot.rightWheel.mesh.position;
      }
      moveTo(wheelCenter.x, wheelCenter.z)
    });
    let $centerCSBtn = $('<div class="btn_pen">Center On Color Sensor</div>');
    let nextColorSensor = 0;
    $centerCSBtn.click(function(){
      // Move the pen to the center of the color sensor.  If there is more
      // than one color sensor, move to the next one
      var colorSensors = []
      for (c of robot.components) {
        if (c.type == "ColorSensor") {
          colorSensors.push(c);
        }
      }
      if (colorSensors.length <= 0) {
        return;
      }
      csPos = colorSensors[nextColorSensor].position
      nextColorSensor++;
      if (nextColorSensor >= colorSensors.length) {
        nextColorSensor = 0;
      }
      moveTo(csPos.x, csPos.z)
    });

    let $btndiv = $('<div class="buttons"></div>')
    $btndiv.append($centerWheelAxisBtn);
    $btndiv.append($centerWheelBtn);
    $btndiv.append($centerCSBtn);
    self.$settingsArea.append($btndiv)
  }

  // Setup picking ray
  this.setupPickingRay = function() {
    babylon.scene.onPointerUp = function(e, hit) {
      if (e.button != 0) {
        return;
      }

      if (hit.pickedMesh != null) {
        function getComponent(mesh) {
          if (typeof mesh.component != 'undefined') {
            return mesh.component;
          } else if (mesh.parent != null) {
            return getComponent(mesh.parent);
          } else if (mesh.id == 'body') {
            return true;
          } else {
            return null;
          }
        }

        let $components = self.$componentList.find('.component-item');

        let component = getComponent(hit.pickedMesh);
        if (component) {
          $components.removeClass('selected');
          let $target = self.$componentList.find('.component-item[componentIndex=' + component.componentIndex + ']');
          if ($target.length > 0) {
            $target.addClass('selected');
            self.showComponentOptions($target[0].component);
          } else {
            $($components[0]).addClass('selected');
            self.showComponentOptions($components[0].component);
          }
  
          self.highlightSelected();
          self.applyDragToSelected();
        }
      }
    }
  };

  // Reset scene
  this.resetScene = function(reloadComponents=true) {
    // Backward compatibility: migrate old 'color' to 'bodyColor'
    if (!robot.options.bodyColor && robot.options.color) {
      robot.options.bodyColor = robot.options.color;
      delete robot.options.color;
    }

    if (typeof self.cameraRadius == 'undefined') {
      self.cameraRadius = 40;
    } else {
      self.cameraRadius = babylon.scene.cameras[0].radius;
    }
    babylon.resetScene();
    babylon.scene.physicsEnabled = false;
    self.setupPickingRay();
    babylon.scene.cameras[0].radius = self.cameraRadius;
    if (reloadComponents) {
      //self.$robotName.val(robot.options.name);
      self.loadIntoComponentsWindow(robot.options);
      self.showComponentOptions(robot.options);
    }
    let $target = self.$componentList.find('.component-item.selected');
    self.showComponentOptions($target[0].component);
    self.highlightSelected();
    self.applyDragToSelected();
  }

  // Base path for component SVG icons
  this.iconBasePath = 'images/components/';

  // Component icon filenames (maps component name to SVG file)
  this.componentIcons = {
    'Box': 'box',
    'Cylinder': 'cylinder',
    'Sphere': 'sphere',
    'Cone': 'cone',
    'Torus': 'torus',
    'ColorSensor': 'colorsensor',
    'UltrasonicSensor': 'ultrasonicsensor',
    'GyroSensor': 'gyrosensor',
    'GPSSensor': 'gpssensor',
    'LaserRangeSensor': 'laserrangesensor',
    'TouchSensor': 'touchsensor',
    'CameraSensor': 'camerasensor',
    'ArmActuator': 'armactuator',
    'ClawActuator': 'clawactuator',
    'SwivelActuator': 'swivelactuator',
    'LinearActuator': 'linearactuator',
    'WheelActuator': 'wheelactuator',
    'WheelPassive': 'wheelpassive',
    'MagnetActuator': 'magnetactuator',
    'PaintballLauncherActuator': 'paintballlauncheractuator',
    'Pen': 'pen',
    'LED': 'led',
    'Display': 'display',
    'RaspberryPi': 'raspberrypi',
    'MotorController': 'motorcontroller',
    'BatteryPack': 'batterypack',
    'ESPModule': 'espmodule',
    'MiniBreadboard': 'minibreadboard',
    'ArduinoNano': 'arduinonano',
    'ArduinoUno': 'arduinouno',
    'DecorativeModel': 'decorativemodel'
  };

  // Helper to get icon HTML for a component
  this.getComponentIconHtml = function(componentName) {
    let iconFile = self.componentIcons[componentName];
    if (iconFile) {
      return '<img src="' + self.iconBasePath + iconFile + '.svg" alt="' + componentName + '" class="component-svg-icon">';
    }
    return '<span class="component-emoji-icon">📦</span>';
  };

  // Add a new component to selected
  this.addComponent = function() {
    let $selected = self.getSelectedComponent();
    let COMPATIBLE_TYPES = ['ArmActuator', 'ClawActuator', 'SwivelActuator', 'LinearActuator', 'WheelActuator', 'WheelPassive'];
    let isBody = !$selected[0].component.type; // Body doesn't have a type property
    if (
      !isBody
      && COMPATIBLE_TYPES.indexOf($selected[0].component.type) == -1
    ) {
      toastMsg('Components can only be added to Body and Actuators.');
      return;
    }

    let selectedComponent = null;
    let $body = $('<div class="component-picker"></div>');

    // Get unique categories
    let categories = [];
    self.componentTemplates.forEach(function(componentTemplate) {
      if (categories.indexOf(componentTemplate.category) == -1) {
        categories.push(componentTemplate.category);
      }
    });

    // Create tabs
    let $tabs = $('<div class="component-picker-tabs"></div>');
    let $panels = $('<div class="component-picker-panels"></div>');

    categories.forEach(function(category, index) {
      // Create tab
      let $tab = $('<div class="component-picker-tab"></div>');
      $tab.text(category);
      $tab.attr('data-category', category);
      if (index === 0) $tab.addClass('active');

      $tab.click(function() {
        $tabs.find('.component-picker-tab').removeClass('active');
        $(this).addClass('active');
        $panels.find('.component-picker-panel').removeClass('active');
        $panels.find('.component-picker-panel[data-category="' + category + '"]').addClass('active');
      });

      $tabs.append($tab);

      // Create panel with grid
      let $panel = $('<div class="component-picker-panel"></div>');
      $panel.attr('data-category', category);
      if (index === 0) $panel.addClass('active');

      let $grid = $('<div class="component-picker-grid"></div>');

      self.componentTemplates.forEach(function(componentTemplate) {
        if (componentTemplate.category !== category) return;

        let iconHtml = self.getComponentIconHtml(componentTemplate.name);
        let $item = $('<div class="component-picker-item"></div>');
        $item.attr('data-name', componentTemplate.name);
        $item.html(
          '<div class="component-picker-icon">' + iconHtml + '</div>' +
          '<div class="component-picker-name">' + componentTemplate.name + '</div>'
        );

        // Single click to select
        $item.click(function() {
          $panels.find('.component-picker-item').removeClass('selected');
          $(this).addClass('selected');
          selectedComponent = componentTemplate.name;
        });

        // Double click to add immediately
        $item.dblclick(function() {
          selectedComponent = componentTemplate.name;
          addSelectedComponent();
          $dialog.close();
        });

        $grid.append($item);
      });

      $panel.append($grid);
      $panels.append($panel);
    });

    $body.append($tabs);
    $body.append($panels);

    let $buttons = $(
      '<button type="button" class="cancel btn-light">Cancel</button>' +
      '<button type="button" class="confirm btn-success">Add Component</button>'
    );

    let $dialog = dialog('Add Component', $body, $buttons);

    function addSelectedComponent() {
      if (!selectedComponent) {
        toastMsg('Please select a component first');
        return;
      }
      self.saveHistory();
      let component = self.componentTemplates.find(ct => ct.name == selectedComponent);
      if (typeof $selected[0].component.components == 'undefined') {
        $selected[0].component.components = [];
      }
      $selected[0].component.components.push(JSON.parse(JSON.stringify(component.defaultConfig)));
      self.resetScene();
    }

    $buttons.siblings('.cancel').click(function() { $dialog.close(); });
    $buttons.siblings('.confirm').click(function() {
      addSelectedComponent();
      $dialog.close();
    });
  };

  // Delete selected component
  this.deleteComponent = function() {
    let $selected = self.getSelectedComponent();
    let isBody = !$selected[0].component.type; // Body doesn't have a type property
    if (isBody) {
      toastMsg('Cannot delete main body');
      return;
    }

    self.saveHistory();
    let i = $selected[0].componentParent.indexOf($selected[0].component);
    $selected[0].componentParent.splice(i, 1);
    self.resetScene();
  };

  // Get selected component
  this.getSelectedComponent = function() {
    return self.$componentList.find('.component-item.selected');
  };

  // Select list item on click
  this.componentSelect = function(e) {
    // 'this' is the .component-item element when called via .call()
    let item = this;
    if (typeof item.component != 'undefined') {
      self.$componentList.find('.component-item').removeClass('selected');
      item.classList.add('selected');

      self.showComponentOptions(item.component);
      self.highlightSelected();
      self.applyDragToSelected();
    }
  };

  // Highlight selected component
  this.highlightSelected = function() {
    let $selected = self.$componentList.find('.component-item.selected');
    if ($selected.length < 1) {
      return;
    }

    let wireframe = babylon.scene.getMeshByID('wireframeComponentSelector');
    if (wireframe != null) {
      wireframe.dispose();
    }
    let index = $selected[0].componentIndex;
    if (typeof index != 'undefined') {
      let body = robot.getComponentByIndex(index).body;
      let size = body.getBoundingInfo().boundingBox.extendSize;
      let options = {
        height: size.y * 2,
        width: size.x * 2,
        depth: size.z * 2
      };
      let wireframeMat = babylon.scene.getMaterialByID('wireframeComponentSelector');
      if (wireframeMat == null) {
        wireframeMat = new BABYLON.StandardMaterial('wireframeComponentSelector', babylon.scene);
        wireframeMat.alpha = 0;
      }

      wireframe = BABYLON.MeshBuilder.CreateBox('wireframeComponentSelector', options, babylon.scene);
      wireframe.material = wireframeMat;
      wireframe.isPickable = false;

      wireframe.body = body;
      self.wireframe = wireframe;    

      wireframe.position = body.absolutePosition;

      wireframe.rotationQuaternion = body.absoluteRotationQuaternion;
      wireframe.enableEdgesRendering();
      wireframe.edgesWidth = 10;
      let wireframeAnimation = new BABYLON.Animation(
        'wireframeAnimation',
        'edgesColor',
        30,
        BABYLON.Animation.ANIMATIONTYPE_COLOR4,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
      );
      var keys = [];
      keys.push({
        frame: 0,
        value: new BABYLON.Color4(0, 0, 1, 1)
      });
      keys.push({
        frame: 15,
        value: new BABYLON.Color4(1, 0, 0, 1)
      });
      keys.push({
        frame: 30,
        value: new BABYLON.Color4(0, 0, 1, 1)
      });
      wireframeAnimation.setKeys(keys);
      wireframe.animations.push(wireframeAnimation);
      babylon.scene.beginAnimation(wireframe, 0, 30, true);
    }
  }

  // Load robot into components window
  // Track expanded state for component tree
  this.expandedComponents = {};

  this.loadIntoComponentsWindow = function(options) {
    let PORT_LETTERS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let ACTUATORS = ['MagnetActuator', 'ArmActuator', 'ClawActuator', 'SwivelActuator', 'LinearActuator', 'PaintballLauncherActuator','WheelActuator', 'LED'];
    let DUMB_BLOCKS = ['Box', 'Cylinder', 'Sphere', 'Cone', 'Torus', 'WheelPassive', 'DecorativeModel', 'RaspberryPi', 'MotorController', 'BatteryPack', 'ESPModule', 'MiniBreadboard', 'ArduinoNano', 'ArduinoUno'];
    let motorCount = options.wheels ? 2 : 0;
    let sensorCount = 0;
    let componentIndex = 0;

    let $ul = $('<ul class="component-tree"></ul>');

    // Body item with icon
    let $bodyLi = $('<li class="component-item selected"></li>');
    let $bodyContent = $('<div class="component-content"></div>');
    $bodyContent.html(
      '<span class="tree-toggle-spacer"></span>' +
      '<img src="' + self.iconBasePath + 'box.svg" class="component-tree-icon" alt="Body">' +
      '<span class="component-label">Body</span>'
    );
    $bodyLi.append($bodyContent);
    $bodyLi[0].component = options;
    $ul.append($bodyLi);

    function addComponents(components, depth) {
      let $list = $('<ul class="component-children"></ul>');

      components.forEach(function(component) {
        let $item = $('<li class="component-item"></li>');
        $item.attr('componentIndex', componentIndex);
        $item.attr('data-depth', depth);

        let hasChildren = component.components instanceof Array && component.components.length > 0;
        let componentId = 'comp_' + componentIndex;
        let isExpanded = self.expandedComponents[componentId] !== false; // Default to expanded

        // Build the label text
        let labelText = component.type;
        let portText = '';
        if (DUMB_BLOCKS.indexOf(component.type) != -1) {
          // No port info
        } else if (ACTUATORS.indexOf(component.type) != -1) {
          portText = '<span class="component-port">(out' + PORT_LETTERS[(++motorCount)] + ')</span>';
        } else {
          portText = '<span class="component-port">(in' + (++sensorCount) + ')</span>';
        }

        // Get icon for this component type
        let iconFile = self.componentIcons[component.type] || 'box';
        let iconHtml = '<img src="' + self.iconBasePath + iconFile + '.svg" class="component-tree-icon" alt="' + component.type + '">';

        // Build the content
        let $content = $('<div class="component-content"></div>');

        if (hasChildren) {
          let toggleClass = isExpanded ? 'expanded' : 'collapsed';
          $content.html(
            '<span class="tree-toggle ' + toggleClass + '"></span>' +
            iconHtml +
            '<span class="component-label">' + labelText + '</span>' +
            portText
          );
        } else {
          $content.html(
            '<span class="tree-toggle-spacer"></span>' +
            iconHtml +
            '<span class="component-label">' + labelText + '</span>' +
            portText
          );
        }

        $item.append($content);
        $item[0].componentParent = components;
        $item[0].component = component;
        $item[0].componentIndex = componentIndex;
        $item.attr('data-component-id', componentId);
        componentIndex++;

        $list.append($item);

        // Add children recursively
        if (hasChildren) {
          let $childrenContainer = addComponents(component.components, depth + 1);
          if ($childrenContainer) {
            if (!isExpanded) {
              $childrenContainer.hide();
            }
            $item.append($childrenContainer);
          }
        }
      });

      if ($list.children().length > 0) {
        return $list;
      } else {
        return null;
      }
    }

    let $children = addComponents(options.components, 1);
    if ($children) {
      $ul.append($children);
    }

    // Click handler for selection
    $ul.find('.component-item').click(function(e) {
      e.stopPropagation();
      self.componentSelect.call(this, e);
    });

    // Click handler for expand/collapse toggle
    $ul.find('.tree-toggle').click(function(e) {
      e.stopPropagation();
      let $toggle = $(this);
      let $item = $toggle.closest('.component-item');
      let $children = $item.children('.component-children');
      let componentId = $item.attr('data-component-id');

      if ($toggle.hasClass('expanded')) {
        $toggle.removeClass('expanded').addClass('collapsed');
        $children.hide();
        self.expandedComponents[componentId] = false;
      } else {
        $toggle.removeClass('collapsed').addClass('expanded');
        $children.show();
        self.expandedComponents[componentId] = true;
      }
    });

    self.$componentList.empty();
    self.$componentList.append($ul);
  };

  // Save robot to json file
  this.saveRobot = function() {
    if (robotTemplates.findIndex(r => r.name == robot.options.name) != -1) {
      robot.options.name = robot.options.name + ' (Custom)';
      self.$robotName.val(robot.options.name);
    }

    robot.options.shortDescription = robot.options.name;
    robot.options.longDescription = '<p>Custom robot created in the configurator.</p>';

    let wheelSpacing = Math.round((robot.options.bodyWidth + robot.options.wheelWidth + robot.options.wheelToBodyOffset * 2) * 10) / 10;
    let sensors = '';
    var i = 1;
    var sensor = null;
    while (sensor = robot.getComponentByPort('in' + i)) {
      if (sensor.type == 'ColorSensor') {
        sensors += '<li>#robot-port# ' + i + ' : #robot-color#</li>';
      } else if (sensor.type == 'UltrasonicSensor') {
        sensors += '<li>#robot-port# ' + i + ' : #robot-ultrasonic#</li>';
      } else if (sensor.type == 'GyroSensor') {
        sensors += '<li>#robot-port# ' + i + ' : #robot-gyro#</li>';
      } else if (sensor.type == 'GPSSensor') {
        sensors += '<li>#robot-port# ' + i + ' : GPS</li>';
      } else if (sensor.type == 'LaserRangeSensor') {
        sensors += '<li>#robot-port# ' + i + ' : #robot-laser#</li>';
      } else if (sensor.type == 'TouchSensor') {
        sensors += '<li>#robot-port# ' + i + ' : #robot-touch#</li>';
      } else if (sensor.type == 'Pen') {
        sensors += '<li>#robot-port# ' + i + ' : #robot-pen#</li>';
      } else {
        console.log(sensor);
      }
      i++;
    }
    let ports = robot.options.wheels ?
      '<li>#robot-port# A : #robot-leftWheel#</li>' +
      '<li>#robot-port# B : #robot-rightWheel#</li>' : "";
    let PORT_LETTERS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //i = 3;
    i = robot.options.wheels ? 3 : 1;
    var motor = null;
    while (motor = robot.getComponentByPort('out' + PORT_LETTERS[i])) {
      if (motor.type == 'ArmActuator') {
        ports += '<li>#robot-port# ' + PORT_LETTERS[i] + ' : #robot-motorizedArm#</li>';
      } else if (motor.type == 'SwivelActuator') {
        ports += '<li>#robot-port# ' + PORT_LETTERS[i] + ' : #robot-swivel#</li>';
      } else if (motor.type == 'LinearActuator') {
        ports += '<li>#robot-port# ' + PORT_LETTERS[i] + ' : #robot-linear#</li>';
      } else if (motor.type == 'PaintballLauncherActuator') {
        ports += '<li>#robot-port# ' + PORT_LETTERS[i] + ' : #robot-paintball#</li>';
      } else if (motor.type == 'MagnetActuator') {
        ports += '<li>#robot-port# ' + PORT_LETTERS[i] + ' : #robot-electromagnet#</li>';
      } else if (motor.type == 'ClawActuator') {
        ports += '<li>#robot-port# ' + PORT_LETTERS[i] + ' : Claw/Gripper</li>';
      } else if (motor.type == 'WheelActuator') {
        ports += '<li>#robot-port# ' + PORT_LETTERS[i] + ' : #robot-wheel#</li>';
      } else if (motor.type == 'LED') {
        ports += '<li>#robot-port# ' + PORT_LETTERS[i] + ' : LED</li>';
      }
      i++;
    }

    robot.options.longerDescription =
      '<h3>#robot-dimensions#</h3>' +
      '<ul>' +
        '<li>#robot-wheelDiameter#: ' + robot.options.wheelDiameter + ' cm</li>' +
        '<li>#robot-wheelSpacing#: ' + wheelSpacing + ' cm</li>' +
      '</ul>' +
      '<h3>#robot-actuators#</h3>' +
      '<ul>' + ports + '</ul>' +
      '<h3>#robot-sensors#</h3>' +
      '<ul>' + sensors +'</ul>';

    robot.options.thumbnail = '';
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:application/json;base64,' + btoa(JSON.stringify(robot.options, null, 2));
    hiddenElement.target = '_blank';
    hiddenElement.download = robot.options.name + '.json';
    hiddenElement.dispatchEvent(new MouseEvent('click'));
  };

  // Load robot from json file
  this.loadRobotLocal = function() {
    var hiddenElement = document.createElement('input');
    hiddenElement.type = 'file';
    hiddenElement.accept = 'application/json,.json';
    hiddenElement.dispatchEvent(new MouseEvent('click'));
    hiddenElement.addEventListener('change', function(e){
      var reader = new FileReader();
      reader.onload = function() {
        robot.options = JSON.parse(this.result);
        self.clearHistory();
        self.saveHistory();
        self.resetScene();
      };
      reader.readAsText(e.target.files[0]);
    });
  };

  // Select robot from templates
  this.selectRobot = function() {
    let $body = $('<div class="selectRobot"></div>');
    let $select = $('<select></select>');
    let $description = $('<div class="description"><img class="thumbnail" width="200" height="200"><div class="text"></div></div>');
    let $configurations = $('<div class="configurations"></div>');

    function displayRobotDescriptions(robot) {
      $description.find('.text').html(i18n.get(robot.longDescription));
      if (robot.thumbnail) {
        $description.find('.thumbnail').attr('src', robot.thumbnail);
      } else {
        $description.find('.thumbnail').attr('src', 'images/robots/default_thumbnail.png');
      }

      $configurations.html(i18n.replace(robot.longerDescription));
    }

    robotTemplates.forEach(function(robotTemplate){
      let $robot = $('<option></option>');
      $robot.prop('value', robotTemplate.name);
      $robot.text(i18n.get(robotTemplate.shortDescription));
      if (robotTemplate.name == robot.options.name) {
        $robot.attr('selected', 'selected');
        displayRobotDescriptions(robotTemplate);
      }
      $select.append($robot);
    });

    $body.append($select);
    $body.append($description);
    $body.append($configurations);

    $select.change(function(){
      let robotTemplate = robotTemplates.find(robotTemplate => robotTemplate.name == $select.val());
      displayRobotDescriptions(robotTemplate);
    });

    let $buttons = $(
      '<button type="button" class="cancel btn-light">Cancel</button>' +
      '<button type="button" class="confirm btn-success">Ok</button>'
    );

    let $dialog = dialog(i18n.get('#main-select_robot#'), $body, $buttons);

    $buttons.siblings('.cancel').click(function() { $dialog.close(); });
    $buttons.siblings('.confirm').click(function(){
      robot.options = JSON.parse(JSON.stringify(robotTemplates.find(robotTemplate => robotTemplate.name == $select.val())));
      self.clearHistory();
      self.saveHistory();
      self.resetScene();
      $dialog.close();
    });
  };

  // Display current position
  this.displayPosition = function() {
    let x = Math.round(robot.body.position.x * 10) / 10;
    let y = Math.round(robot.body.position.z * 10) / 10;
    let angles = robot.body.absoluteRotationQuaternion.toEulerAngles();
    let rot = Math.round(angles.y / Math.PI * 1800) / 10;

    acknowledgeDialog({
      title: 'Robot Position',
      message: $(
        '<p>Position: ' + x + ', ' + y + '</p>' +
        '<p>Rotation: ' + rot + ' degrees</p>'
      )
    })
  };

  // Save screenshot
  this.screenshot = function() {
    BABYLON.Tools.CreateScreenshotUsingRenderTargetAsync(
      babylon.scene.getEngine(),
      babylon.scene.activeCamera,
      { width: 600, height: 480 },
      undefined,
      'image/png',
      8,
      false,
      'screenshot.png'
    );
  }


  // Save current position
  this.savePosition = function() {
    let x = Math.round(robot.body.position.x * 10) / 10;
    let y = Math.round(robot.body.position.z * 10) / 10;
    let angles = robot.body.absoluteRotationQuaternion.toEulerAngles();
    let rot = Math.round(angles.y / Math.PI * 1800) / 10;

    if (typeof babylon.world.defaultOptions.startPosXY != 'undefined') {
      babylon.world.options.startPosXY = x + ',' +y;
    } else {
      toastMsg('Current world doesn\'t allow saving of position');
      return;
    }
    if (typeof babylon.world.defaultOptions.startRot != 'undefined') {
      babylon.world.options.startRot = rot.toString();
    } else {
      toastMsg('Current world doesn\'t allow saving of rotation');
    }
    babylon.world.setOptions();
  };

  // Clear current position
  this.clearPosition = function() {
    if (babylon.world.options.startPosXY) {
      babylon.world.options.startPosXY = '';
    }
    if (babylon.world.options.startRot) {
      babylon.world.options.startRot = '';
    }
    babylon.world.setOptions();
  };

  // Apply robot config to simulator
  this.applyToSimulator = function() {
    // Embedded mode: use postMessage to parent
    if (self.isEmbedded) {
      window.parent.postMessage({
        type: 'robotics:applyRobot',
        robotOptions: JSON.parse(JSON.stringify(robot.options))
      }, '*');
      acknowledgeDialog({ title: 'Applied', message: 'Robot config sent to simulator.' });
      return;
    }

    // Standalone mode: try window.opener
    if (window.opener && !window.opener.closed) {
      try {
        var target = window.opener.main || (window.opener.frames && window.opener.frames[0] && window.opener.frames[0].main);
        if (target) {
          var json = JSON.stringify(robot.options);
          target.loadRobot(json);
          acknowledgeDialog({ title: 'Applied', message: 'Robot config sent to simulator.' });
          return;
        }
      } catch (e) {
        // Cross-origin access blocked — fall through to save prompt
      }
    }
    acknowledgeDialog({
      title: 'Simulator Not Connected',
      message: 'The simulator tab was refreshed or closed, so the config can\'t be sent directly. Use <strong>File → Save to file</strong> to save your robot, then load it in the simulator with <strong>Robot → Load from file</strong>.'
    });
  };

  // Toggle filemenu
  this.toggleFileMenu = function(e) {
    if ($('.fileMenuDropDown').length == 0) {
      $('.menuDropDown').remove();
      e.stopPropagation();
      let menuItems = [
        {html: 'Select Robot', line: true, callback: self.selectRobot},
        {html: 'Load from file', line: false, callback: self.loadRobotLocal},
        {html: 'Save to file', line: false, callback: self.saveRobot},
        {html: 'Apply to Simulator', line: false, callback: self.applyToSimulator},
      ];

      menuDropDown(self.$fileMenu, menuItems, {className: 'fileMenuDropDown'});
    }
  };

  // Toggle robotmenu
  this.toggleRobotMenu = function(e) {
    if ($('.robotMenuDropDown').length == 0) {
      $('.menuDropDown').remove();
      e.stopPropagation();

      let menuItems = [
        {html: 'Select Robot', line: false, callback: self.selectRobot},
      ];

      menuDropDown(self.$robotMenu, menuItems, {className: 'robotMenuDropDown'});
    }
  };

  // Snapping
  this.snapStep = [0, 0, 0];
  this.roundToSnap = function(value, snap) {
    if (snap == 0) {
      return value;
    }
    let inv = 1.0 / snap;
    return Math.round(value * inv) / inv;
  }

  // Toggle snapmenu
  this.toggleSnapMenu = function(e) {
    if ($('.snapMenuDropDown').length == 0) {
      $('.menuDropDown').remove();
      e.stopPropagation();

      function snapNone() {
        self.snapStep = [0, 0, 0];
      }
      function snap25() {
        self.snapStep = [0.25, 0.25, 0.25];
      }
      function snapTechnic() {
        self.snapStep = [0.4, 0.4, 0.4];
      }
      function snap05() {
        self.snapStep = [0.5, 0.5, 0.5];
      }
      function snapLego() {
        self.snapStep = [0.4, 0.4, 0.48];
      }
      function snap10() {
        self.snapStep = [1, 1, 1];
      }

      let menuItems = [
        {html: 'No Snapping', line: false, callback: snapNone},
        {html: 'Snap to 0.25cm', line: false, callback: snap25},
        {html: 'Snap to 0.4cm (Lego Technic)', line: false, callback: snapTechnic},
        {html: 'Snap to Lego (xy: 0.4, z: 0.48)', line: false, callback: snapLego},
        {html: 'Snap to 0.5cm', line: false, callback: snap05},
        {html: 'Snap to 1cm', line: false, callback: snap10},
      ];
      var tickIndex = 0;
      if (self.snapStep[2] == 0) {
        tickIndex = 0;
      } else if (self.snapStep[2] == 0.25) {
        tickIndex = 1;
      } else if (self.snapStep[2] == 0.4) {
        tickIndex = 2;
      } else if (self.snapStep[2] == 0.48) {
        tickIndex = 3;
      } else if (self.snapStep[2] == 0.5) {
        tickIndex = 4;
      } else if (self.snapStep[2] == 1) {
        tickIndex = 5;
      }
      menuItems[tickIndex].html = '<span class="tick">&#x2713;</span> ' + menuItems[tickIndex].html;

      menuDropDown(self.$snapMenu, menuItems, {className: 'snapMenuDropDown'});
    }
  };

}

// Init class
configurator.init();
