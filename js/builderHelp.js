// Robotics World Builder - In-App Help System

var builderHelpSystem = (function() {
  var currentTopic = 'about';

  var topics = {
    about: {
      title: 'About',
      category: 'general',
      content: `
        <h4>Welcome to the World Builder</h4>
        <p>The World Builder lets you create custom environments for your robot to navigate. Design arenas, obstacle courses, mazes, and challenge environments with 3D objects, textures, physics, and animations.</p>
        <h5>Key Features</h5>
        <ul>
          <li><strong>Custom Ground</strong> - Set ground images, size, and physics properties</li>
          <li><strong>3D Objects</strong> - Add boxes, cylinders, spheres, and 3D models</li>
          <li><strong>Physics</strong> - Configure mass, friction, and bounciness for each object</li>
          <li><strong>Animations</strong> - Animate objects with keyframe-based movement</li>
          <li><strong>Textures</strong> - Apply built-in images or custom URLs to objects</li>
          <li><strong>Snap Grid</strong> - Align objects precisely with snap-to-grid options</li>
          <li><strong>Compounds & Hinges</strong> - Group objects and create jointed mechanisms</li>
          <li><strong>3D Models</strong> - Import from a library of 200+ models (animals, vehicles, buildings, etc.)</li>
        </ul>
        <h5>Getting Started</h5>
        <ol>
          <li>Set up your <strong>Ground</strong> - choose a texture (competition mat, grid, etc.)</li>
          <li>Configure <strong>Walls</strong> if you want boundaries</li>
          <li>Set the <strong>Robot Start</strong> position</li>
          <li>Add objects to create obstacles, goals, and scenery</li>
          <li><strong>Save</strong> your world (File > Save world to Server)</li>
        </ol>
        <div class="help-note">Tip: Use the built-in competition mats (FLL, WRO) as ground textures to practice for real robotics competitions!</div>
      `
    },

    interface: {
      title: 'Interface',
      category: 'general',
      content: `
        <h4>World Builder Interface</h4>
        <h5>Header Bar</h5>
        <ul>
          <li><strong>File</strong> - New, save, and load worlds or individual objects</li>
          <li><strong>World</strong> - Toggle animation preview on/off</li>
          <li><strong>Snap</strong> - Set snap-to-grid spacing for precise placement</li>
          <li><strong>?</strong> - Open this help window</li>
        </ul>
        <h5>Objects Panel (Left Side)</h5>
        <p>This panel lists everything in your world:</p>
        <ul>
          <li><strong>Ground</strong> - Click to configure the ground surface</li>
          <li><strong>Walls</strong> - Click to configure boundary walls</li>
          <li><strong>Timer</strong> - Click to set up a challenge timer</li>
          <li><strong>Robot Start</strong> - Click to set where the robot spawns</li>
          <li><strong>Animation</strong> - Click for global animation settings</li>
          <li><strong>Objects</strong> - Your custom objects appear below these</li>
        </ul>
        <h5>Buttons</h5>
        <ul>
          <li><strong>Add</strong> - Add a new object (Box, Cylinder, Sphere, Model, Compound, Hinge)</li>
          <li><strong>Clone</strong> - Duplicate the currently selected object with all its settings</li>
          <li><strong>Delete</strong> - Remove the selected object from the world</li>
          <li><strong>Undo</strong> - Revert the last change you made</li>
        </ul>
        <h5>Settings Panel (Right Side)</h5>
        <p>Shows configuration options for whatever is selected in the objects list. Options change depending on the type of object selected.</p>
        <h5>3D Viewport (Center)</h5>
        <ul>
          <li><strong>Left-click + drag on empty space</strong> - Rotate the camera</li>
          <li><strong>Right-click + drag</strong> - Pan the camera</li>
          <li><strong>Scroll wheel</strong> - Zoom in/out</li>
          <li><strong>Click an object</strong> - Select it for editing</li>
          <li><strong>Drag an object</strong> - Move it in the world (respects snap settings)</li>
        </ul>
        <h5>Ruler Tool</h5>
        <p>The ruler icon in the viewport shows real-time measurements: position (X, Y, Alt), distance between points, and angles. Useful for precise placement.</p>
      `
    },

    fileMenu: {
      title: 'File & Save',
      category: 'general',
      content: `
        <h4>File Menu</h4>
        <table>
          <tr><th>Option</th><th>Description</th></tr>
          <tr><td>New World</td><td>Start fresh with a completely empty world (ground + walls only)</td></tr>
          <tr><td>Save world to Server</td><td>Save the current world to your MyTekOS project. This is the main save - use it regularly!</td></tr>
          <tr><td>Load world from file</td><td>Import a previously exported world from a local .json file</td></tr>
          <tr><td>Save world to file</td><td>Export the entire world (all objects, settings) as a .json file to your computer</td></tr>
          <tr><td>Load object from file</td><td>Import a single object from a .json file into your current world</td></tr>
          <tr><td>Save object to file</td><td>Export just the selected object as a .json file</td></tr>
        </table>
        <h5>Tips</h5>
        <ul>
          <li>Save to Server frequently to avoid losing work</li>
          <li>Save objects to file to build a personal library of reusable pieces</li>
          <li>Share .json world files with friends so they can try your challenges</li>
          <li>Export before making big changes so you can go back if needed</li>
        </ul>
        <div class="help-warning">There is no auto-save in the World Builder. Remember to save manually!</div>
      `
    },

    snap: {
      title: 'Snap Grid',
      category: 'general',
      content: `
        <h4>Snap-to-Grid</h4>
        <p>The Snap menu controls how objects align when you drag or position them. Snapping ensures objects line up precisely.</p>
        <h5>Snap Options</h5>
        <table>
          <tr><th>Option</th><th>Grid Size</th><th>Best For</th></tr>
          <tr><td>No Snapping</td><td>Free movement</td><td>Fine-tuning, organic layouts</td></tr>
          <tr><td>0.2 cm</td><td>2mm grid</td><td>Detailed precision work</td></tr>
          <tr><td>Lego Technic</td><td>4mm (all axes)</td><td>Technic-compatible spacing</td></tr>
          <tr><td>Lego</td><td>4mm x/y, 4.8mm z</td><td>Lego brick-compatible spacing (height differs)</td></tr>
          <tr><td>0.5 cm</td><td>5mm grid</td><td>General building, medium precision</td></tr>
          <tr><td>1 cm</td><td>10mm grid</td><td>Large-scale layouts, quick arenas</td></tr>
        </table>
        <h5>How It Works</h5>
        <ul>
          <li>When you drag an object, it jumps to the nearest grid point</li>
          <li>Position sliders in the settings panel also respect the snap setting</li>
          <li>The active snap option shows a checkmark (&#x2713;) in the menu</li>
          <li>Change snap at any time - it only affects future movements</li>
        </ul>
        <div class="help-note">Start with 1cm snap for rough layout, then switch to finer snap for precision adjustments.</div>
      `
    },

    ground: {
      title: 'Ground',
      category: 'world',
      content: `
        <h4>Ground Configuration</h4>
        <p>The ground is the base surface of your world. Select <strong>Ground</strong> in the objects list to configure it.</p>
        <h5>Ground Type</h5>
        <table>
          <tr><th>Type</th><th>Description</th></tr>
          <tr><td>Box</td><td>Flat rectangular ground. Supports walls. Most common choice.</td></tr>
          <tr><td>Cylinder</td><td>Round/circular ground surface. No wall support.</td></tr>
          <tr><td>None</td><td>No ground at all. Only use if adding a custom ground object.</td></tr>
        </table>
        <h5>Image Settings</h5>
        <table>
          <tr><th>Setting</th><th>Description</th></tr>
          <tr><td>Select built-in image</td><td>Browse the texture library (competition mats, grids, arenas)</td></tr>
          <tr><td>Image URL</td><td>Enter a custom URL (Imgur links work best)</td></tr>
          <tr><td>Image Scale</td><td>Scales the texture. At 2, each pixel = 2mm. Increase for larger ground with smaller images.</td></tr>
          <tr><td>U Scale</td><td>Repeats the image horizontally. Set to 2 to tile it twice across.</td></tr>
          <tr><td>V Scale</td><td>Repeats the image vertically. Set to 2 to tile it twice up/down.</td></tr>
        </table>
        <h5>Physics</h5>
        <table>
          <tr><th>Setting</th><th>Default</th><th>Description</th></tr>
          <tr><td>Ground Friction</td><td>1.0</td><td>How much grip. Lower = slippery ice, Higher = sticky rubber.</td></tr>
          <tr><td>Ground Restitution</td><td>0</td><td>Bounciness. Set higher to make objects bounce off the ground.</td></tr>
        </table>
        <div class="help-note">For line-following challenges: use a ground image with black lines on white. For sumo: use a circular arena image. For FLL/WRO: select the matching competition mat.</div>
      `
    },

    walls: {
      title: 'Walls',
      category: 'world',
      content: `
        <h4>Wall Configuration</h4>
        <p>Walls create boundaries around the edge of your world, preventing the robot from driving off. Select <strong>Walls</strong> in the objects list.</p>
        <h5>Settings</h5>
        <table>
          <tr><th>Setting</th><th>Range</th><th>Description</th></tr>
          <tr><td>Wall (on/off)</td><td>-</td><td>Toggle walls on or off</td></tr>
          <tr><td>Wall Height</td><td>0.1 - 30 cm</td><td>How tall the walls are. 5-10cm is typical.</td></tr>
          <tr><td>Wall Thickness</td><td>0.1 - 30 cm</td><td>How thick the walls are. 1-2cm is typical.</td></tr>
          <tr><td>Wall Color</td><td>Hex code</td><td>Visual color of the walls</td></tr>
          <tr><td>Wall Friction</td><td>0 - 10</td><td>Friction when robot/objects slide against walls</td></tr>
          <tr><td>Wall Restitution</td><td>0 - 10</td><td>How much objects bounce off walls</td></tr>
        </table>
        <div class="help-warning">Walls only work with a Box ground type. If you need boundaries with a cylinder ground, add box objects as walls manually.</div>
        <h5>Common Setups</h5>
        <ul>
          <li><strong>Sumo ring</strong>: No walls, cylinder ground with ring image</li>
          <li><strong>Competition table</strong>: Low walls (5cm), box ground with mat image</li>
          <li><strong>Arena</strong>: Tall walls (15cm+), prevents any escape</li>
        </ul>
      `
    },

    timer: {
      title: 'Timer',
      category: 'world',
      content: `
        <h4>World Timer</h4>
        <p>Add a countdown or count-up timer for timed challenges. Select <strong>Timer</strong> in the objects list.</p>
        <h5>Timer Modes</h5>
        <table>
          <tr><th>Mode</th><th>Description</th></tr>
          <tr><td>None</td><td>No timer displayed during simulation</td></tr>
          <tr><td>Count up from zero</td><td>Starts at 0:00 and counts up. Good for time trials.</td></tr>
          <tr><td>Count down from duration</td><td>Starts at the set duration and counts to 0. Good for time limits.</td></tr>
        </table>
        <h5>Duration</h5>
        <p>Set the timer duration from 1 to 300 seconds (5 minutes max).</p>
        <h5>What Happens When Time Runs Out (countdown only)</h5>
        <table>
          <tr><th>Option</th><th>Effect</th></tr>
          <tr><td>Continue running</td><td>Timer shows 0:00 but everything keeps going</td></tr>
          <tr><td>Stop the timer only</td><td>Timer freezes at 0:00, robot keeps moving</td></tr>
          <tr><td>Stop the timer and robot</td><td>Everything stops - simulation ends. Best for competitions!</td></tr>
        </table>
        <div class="help-note">For competitions: use "Count down" with "Stop the timer and robot" to enforce strict time limits.</div>
      `
    },

    robotStart: {
      title: 'Robot Start',
      category: 'world',
      content: `
        <h4>Robot Start Position</h4>
        <p>Configure where the robot spawns when the simulation begins. Select <strong>Robot Start</strong> in the objects list.</p>
        <h5>Settings</h5>
        <table>
          <tr><th>Setting</th><th>Range</th><th>Description</th></tr>
          <tr><td>Start Position X</td><td>-200 to 200</td><td>Left/right position (in cm)</td></tr>
          <tr><td>Start Position Y</td><td>-200 to 200</td><td>Forward/backward position (in cm)</td></tr>
          <tr><td>Start Position Z</td><td>-200 to 200</td><td>Height above ground (in cm, usually 0)</td></tr>
          <tr><td>Start Rotation</td><td>-180 to 180</td><td>Direction the robot faces (in degrees)</td></tr>
        </table>
        <h5>Rotation Guide</h5>
        <ul>
          <li><strong>0°</strong> - Facing forward (default)</li>
          <li><strong>90°</strong> - Facing right</li>
          <li><strong>-90°</strong> - Facing left</li>
          <li><strong>180°</strong> - Facing backward</li>
        </ul>
        <div class="help-note">The robot start position is shown as a small marker in the 3D view. Position it so the robot begins where you want for your challenge.</div>
      `
    },

    animationSettings: {
      title: 'Animation',
      category: 'world',
      content: `
        <h4>Global Animation Settings</h4>
        <p>Select <strong>Animation</strong> in the objects list for global animation options.</p>
        <h5>Settings</h5>
        <ul>
          <li><strong>Restart Animation on Run</strong> - When checked, all object animations reset to their starting position each time you run the simulation. When unchecked, animations continue from wherever they are.</li>
        </ul>
        <h5>World Menu > Animate</h5>
        <p>Toggle this to preview animations while building. Objects will move along their keyframe paths so you can see the motion without running the full simulation.</p>
        <div class="help-note">See the "Object Animation" topic in the Objects category for details on setting up keyframes.</div>
      `
    },

    objects: {
      title: 'Overview',
      category: 'objects',
      content: `
        <h4>World Objects</h4>
        <p>Click <strong>Add</strong> to place objects in your world. Choose from 6 types:</p>
        <table>
          <tr><th>Type</th><th>Description</th><th>Use For</th></tr>
          <tr><td>Box</td><td>Rectangular block</td><td>Walls, ramps, platforms, obstacles</td></tr>
          <tr><td>Cylinder</td><td>Cylindrical shape</td><td>Pillars, cans, wheels, poles</td></tr>
          <tr><td>Sphere</td><td>Ball shape</td><td>Balls, collectibles, rounded obstacles</td></tr>
          <tr><td>Model</td><td>3D model file</td><td>Trees, animals, vehicles, buildings</td></tr>
          <tr><td>Compound</td><td>Group of shapes</td><td>Complex objects that move as one unit</td></tr>
          <tr><td>Hinge</td><td>Jointed connection</td><td>Doors, levers, swinging gates</td></tr>
        </table>
        <h5>Common Properties (Box, Cylinder, Sphere)</h5>
        <ul>
          <li><strong>Position</strong> (x, y, z) - Location in cm. Use "Drop to Ground" button to auto-place on surface.</li>
          <li><strong>Rotation</strong> (x, y, z) - Orientation in degrees (-180 to 180)</li>
          <li><strong>Size</strong> - Dimensions in cm (1 to 100)</li>
          <li><strong>Color</strong> - Hex color code (e.g., #FF0000 for red)</li>
          <li><strong>Image/Texture</strong> - Apply a visual texture to the surface</li>
          <li><strong>Physics</strong> - Fixed, Moveable, Physicsless, or Custom</li>
          <li><strong>Magnetic</strong> - Can be picked up by a robot's magnet actuator</li>
          <li><strong>Shadows</strong> - Cast and/or receive shadows</li>
        </ul>
        <div class="help-note">Use Clone to quickly duplicate objects. Great for creating rows of identical obstacles!</div>
      `
    },

    boxCylSphere: {
      title: 'Box/Cylinder/Sphere',
      category: 'objects',
      content: `
        <h4>Basic Shape Details</h4>
        <h5>Box</h5>
        <p>A rectangular block. Size is set as width (x), depth (y), and height (z).</p>
        <ul>
          <li>Supports 5 image mapping modes (repeat, top, front, all faces, none)</li>
          <li>Great for walls, ramps, platforms, steps, and barriers</li>
          <li>Tip: Make a ramp by rotating a thin box on the X or Y axis</li>
        </ul>
        <h5>Cylinder</h5>
        <p>A cylindrical shape. Size X = diameter, Size Z = height.</p>
        <ul>
          <li>Image wraps around the curved surface</li>
          <li>Good for pillars, cans, traffic cones (adjust size), and poles</li>
          <li>Tip: A flat cylinder (small Z, large X) makes a good round platform</li>
        </ul>
        <h5>Sphere</h5>
        <p>A ball shape. Size X = diameter (Y and Z are ignored).</p>
        <ul>
          <li>Image maps as a sphere projection (use planet textures for best results)</li>
          <li>Great for balls, collectible items, and rounded bumpers</li>
          <li>Tip: Make a moveable sphere for the robot to push into a goal</li>
        </ul>
        <h5>Drop to Ground</h5>
        <p>All three types have a "Drop to Ground" button that automatically sets the object's height so it sits on the ground surface. Very useful after changing the size!</p>
      `
    },

    models: {
      title: '3D Models',
      category: 'objects',
      content: `
        <h4>3D Model Objects</h4>
        <p>Models let you add detailed 3D objects from a library of 200+ pre-built models in GLTF format.</p>
        <h5>Adding a Model</h5>
        <ol>
          <li>Click <strong>Add</strong> and select <strong>Model</strong></li>
          <li>In the settings panel, click <strong>Select built-in model</strong></li>
          <li>Browse or search the library, then click Select on a model</li>
          <li>Adjust position, rotation, and scale as needed</li>
        </ol>
        <h5>Model Categories</h5>
        <table>
          <tr><th>Source</th><th>Categories</th></tr>
          <tr><td>Kenny.nl</td><td>Cars, Characters, City/Urban, Fantasy Town, Food, Furniture, Graveyard, Holiday, Nature, Racer, Space, Watercrafts</td></tr>
          <tr><td>Quaternius</td><td>Animals, Cute Monsters, Farm Animals, Posed Characters, Ships</td></tr>
          <tr><td>KayKit</td><td>Dungeon, Mini-Game Variety, Spooktober Seasonal</td></tr>
          <tr><td>Other</td><td>Chess pieces, Town buildings, Ice Age Animals, Misc</td></tr>
        </table>
        <h5>Model Settings</h5>
        <ul>
          <li><strong>Model Scale</strong> (5-200) - Resize the model. Default is usually fine, adjust if too big/small.</li>
          <li><strong>Model Animation</strong> - Some models have built-in animations (walk, idle, etc.). Select one if available.</li>
          <li><strong>Custom URL</strong> - Load a GLTF (.glb/.gltf) model from a URL. GitHub-hosted files work best.</li>
        </ul>
        <div class="help-note">Models have full physics support - make them fixed obstacles, or moveable objects the robot can push around!</div>
      `
    },

    compounds: {
      title: 'Compounds',
      category: 'objects',
      content: `
        <h4>Compound Objects</h4>
        <p>A Compound groups multiple shapes into a single physics body. All objects inside a compound move together as one unit.</p>
        <h5>Creating a Compound</h5>
        <ol>
          <li>Click <strong>Add</strong> and select <strong>Compound</strong></li>
          <li>Select the new Compound in the objects list</li>
          <li>Click <strong>Add</strong> again to add shapes inside it (Box, Cylinder, Sphere, Model)</li>
          <li>Position each child shape relative to the compound's center</li>
        </ol>
        <h5>Rules</h5>
        <ul>
          <li>The first object in a compound cannot be another compound</li>
          <li>Child positions are relative to the compound's origin</li>
          <li>Physics applies to the entire compound as one body</li>
          <li>You can nest compounds to build complex structures</li>
        </ul>
        <h5>Use Cases</h5>
        <ul>
          <li><strong>L-shaped wall</strong> - Two boxes at right angles</li>
          <li><strong>Table</strong> - A flat box (top) + 4 cylinders (legs)</li>
          <li><strong>Complex obstacle</strong> - Multiple shapes that must move together</li>
          <li><strong>Hinged mechanism</strong> - Add a Hinge inside a compound for rotating parts</li>
        </ul>
        <div class="help-note">Compounds are essential for creating realistic complex objects. Without them, each shape would be an independent physics object.</div>
      `
    },

    hinges: {
      title: 'Hinges',
      category: 'objects',
      content: `
        <h4>Hinge Joints</h4>
        <p>A Hinge creates a rotating joint between objects, like a door hinge or a lever pivot. Hinges can only be added inside a Compound.</p>
        <h5>Creating a Hinge</h5>
        <ol>
          <li>Create a <strong>Compound</strong> first</li>
          <li>Add at least one shape to the compound (the base/fixed part)</li>
          <li>Select the compound, then Add > <strong>Hinge</strong></li>
          <li>Add a shape inside the hinge (the moving part)</li>
          <li>Configure hinge position, rotation, and motor settings</li>
        </ol>
        <h5>Hinge Settings</h5>
        <table>
          <tr><th>Setting</th><th>Description</th></tr>
          <tr><td>Position</td><td>Where the hinge pivot point is located</td></tr>
          <tr><td>Rotation</td><td>The axis the hinge rotates around</td></tr>
          <tr><td>Size</td><td>Visual size of the hinge indicator</td></tr>
          <tr><td>Hide</td><td>Hide the hinge visual (usually enabled for finished worlds)</td></tr>
          <tr><td>Speed</td><td>Rotation speed in radians/second (0 = free-spinning, no motor)</td></tr>
          <tr><td>Max Force</td><td>Motor force to achieve the speed (higher = stronger motor)</td></tr>
        </table>
        <h5>Rules</h5>
        <ul>
          <li>Hinges can only be added inside a Compound</li>
          <li>The compound must have at least one shape before adding a hinge</li>
          <li>Each hinge can only contain one object (the swinging part)</li>
          <li>Set Speed > 0 and Max Force > 0 to make a motorized hinge</li>
        </ul>
        <h5>Examples</h5>
        <ul>
          <li><strong>Swinging door</strong> - Compound with box (frame) + hinge with box (door panel)</li>
          <li><strong>Rotating barrier</strong> - Speed = 2, Max Force = 100 for continuous rotation</li>
          <li><strong>Pendulum</strong> - Hinge at top, heavy sphere at bottom, no motor</li>
        </ul>
      `
    },

    textures: {
      title: 'Textures',
      category: 'objects',
      content: `
        <h4>Images & Textures</h4>
        <p>Apply image textures to boxes, cylinders, spheres, and the ground to make them visually distinct.</p>
        <h5>Built-In Image Library</h5>
        <p>Click <strong>Select built-in image</strong> to browse. Use the filter dropdown and search box to find textures. Categories:</p>
        <ul>
          <li><strong>Box</strong> (15 textures) - ABC letters, cardboard, caution strips, metal, wood</li>
          <li><strong>Cylinder</strong> (5 textures) - Bio drum, flammable, radioactive, steel, wheel</li>
          <li><strong>Sphere</strong> (13 textures) - Basketball, beach ball, tennis, Earth, Mars, Jupiter, Saturn, Moon, and more planets</li>
          <li><strong>Ground</strong> (16 textures) - Grid, arena maps, FLL challenge mats, WRO competition maps</li>
          <li><strong>Robot</strong> (2 textures) - Robot body and orientation markers</li>
        </ul>
        <h5>Image Type (Box only)</h5>
        <table>
          <tr><th>Type</th><th>Effect</th><th>Best For</th></tr>
          <tr><td>None</td><td>No texture, solid color</td><td>Simple colored blocks</td></tr>
          <tr><td>Repeat on every face</td><td>Same image on all 6 faces</td><td>Uniform appearance</td></tr>
          <tr><td>Only on top face</td><td>Image on top only</td><td>Floor markers, signs</td></tr>
          <tr><td>Only on front face</td><td>Image on front only</td><td>Target boards, displays</td></tr>
          <tr><td>Map across all faces</td><td>Image mapped across faces</td><td>ABC letters (different per face)</td></tr>
        </table>
        <h5>Custom Image URLs</h5>
        <p>Type a direct URL to any PNG/JPG image. Due to browser security (CORS), most websites won't work. Known working sources:</p>
        <ul>
          <li><strong>Imgur</strong> - Upload to imgur.com and use the direct image link</li>
          <li><strong>GitHub</strong> - Use raw file URLs from repositories</li>
        </ul>
      `
    },

    physics: {
      title: 'Physics',
      category: 'objects',
      content: `
        <h4>Object Physics</h4>
        <p>Physics settings control how objects behave during simulation - whether they're solid walls, pushable obstacles, or just visual decorations.</p>
        <h5>Physics Modes</h5>
        <table>
          <tr><th>Mode</th><th>Behavior</th><th>Use For</th></tr>
          <tr><td>Fixed</td><td>Cannot be moved or pushed by anything</td><td>Walls, ramps, permanent obstacles</td></tr>
          <tr><td>Moveable</td><td>Affected by gravity, can be pushed by robot</td><td>Balls, cans, collectibles, targets</td></tr>
          <tr><td>Physicsless</td><td>No physical presence at all - things pass through</td><td>Visual markers, decorations, guide lines</td></tr>
          <tr><td>Custom</td><td>Fine-tune all physics properties individually</td><td>Special behaviors</td></tr>
        </table>
        <h5>Custom Physics Properties</h5>
        <table>
          <tr><th>Property</th><th>Default</th><th>Description</th></tr>
          <tr><td>Mass</td><td>100</td><td>Weight. 0 = fixed/immovable. Higher = harder to push.</td></tr>
          <tr><td>Friction</td><td>0.1</td><td>Surface grip. 0 = ice. 1.0 = rubber. Ground default is 1.0.</td></tr>
          <tr><td>Restitution</td><td>0</td><td>Bounciness. 0 = no bounce. 1.0 = super bouncy.</td></tr>
          <tr><td>Damp Linear</td><td>0</td><td>Slows down sliding. Higher = stops faster.</td></tr>
          <tr><td>Damp Angular</td><td>0</td><td>Slows down spinning. Higher = stops rotating faster.</td></tr>
          <tr><td>Group</td><td>1</td><td>Collision group bitmask. Objects only collide if their groups/masks overlap.</td></tr>
          <tr><td>Mask</td><td>-1 (all)</td><td>Which groups this object collides with. -1 = collides with everything.</td></tr>
        </table>
        <h5>Sensor Detection</h5>
        <p>Control whether robot sensors (laser, ultrasonic) can "see" each object:</p>
        <ul>
          <li><strong>Default</strong> - Normal for physical objects, Invisible for physicsless</li>
          <li><strong>Normal</strong> - Sensors detect the object at its actual distance</li>
          <li><strong>Invisible</strong> - Sensor beams pass through (object is undetectable)</li>
          <li><strong>Absorb</strong> - Absorbs the sensor beam with no reflection (reads as max distance)</li>
        </ul>
        <h5>Magnetic</h5>
        <p>Enable this to allow the robot's Magnet actuator to pick up the object. Great for collection/sorting challenges!</p>
      `
    },

    animation: {
      title: 'Animating',
      category: 'objects',
      content: `
        <h4>Object Animation</h4>
        <p>Animate objects to create moving platforms, conveyor belts, swinging obstacles, patrol paths, and more. Any Box, Cylinder, Sphere, or Model can be animated.</p>
        <h5>Setting Up Animation</h5>
        <ol>
          <li>Select an object in the objects list</li>
          <li>Set <strong>Animation Mode</strong> to Loop or Alternate</li>
          <li>Position the object at its <strong>starting location</strong></li>
          <li>In Animation Keys, set <strong>Time = 0</strong> and click <strong>Add Key</strong></li>
          <li>Move the object to a <strong>new position</strong></li>
          <li>Set a <strong>new Time</strong> (e.g., 2 seconds) and click <strong>Add Key</strong></li>
          <li>Add more keys for complex paths</li>
        </ol>
        <h5>Animation Modes</h5>
        <table>
          <tr><th>Mode</th><th>Behavior</th><th>Example</th></tr>
          <tr><td>None</td><td>No animation</td><td>-</td></tr>
          <tr><td>Loop</td><td>Plays all keys in order, jumps back to start, repeats</td><td>Conveyor belt, patrol path</td></tr>
          <tr><td>Alternate</td><td>Plays forward then backward, smooth back-and-forth</td><td>Pendulum, sliding door</td></tr>
        </table>
        <h5>Tips</h5>
        <ul>
          <li>You need <strong>at least 2 keys</strong> for animation to work</li>
          <li>The object moves smoothly (interpolates) between key positions</li>
          <li>Use <strong>World > Animate</strong> to preview without running the simulation</li>
          <li>Animated fixed objects will push the robot and moveable objects</li>
          <li>Time values are in seconds - larger gaps = slower movement</li>
        </ul>
        <h5>Example: Moving Platform</h5>
        <ol>
          <li>Create a flat Box (size: 20, 20, 2)</li>
          <li>Set Animation Mode to Alternate</li>
          <li>Position at left side, Time = 0, Add Key</li>
          <li>Position at right side, Time = 3, Add Key</li>
          <li>Robot must time its approach to ride the platform!</li>
        </ol>
      `
    },

    tips: {
      title: 'Tips & Ideas',
      category: 'objects',
      content: `
        <h4>World Design Tips</h4>
        <h5>Common World Types</h5>
        <ul>
          <li><strong>Line Following Course</strong> - White ground with black line image, objects as obstacles along the path</li>
          <li><strong>Obstacle Course</strong> - Fixed boxes and cylinders the robot must navigate around</li>
          <li><strong>Sumo Ring</strong> - Cylinder ground, moveable opponent object to push out</li>
          <li><strong>Collection Challenge</strong> - Magnetic spheres scattered around, robot must gather them</li>
          <li><strong>Maze</strong> - Grid of fixed box walls with a path to the exit</li>
          <li><strong>Moving Obstacles</strong> - Animated objects that sweep back and forth</li>
          <li><strong>Precision Parking</strong> - Tight spaces the robot must drive into</li>
        </ul>
        <h5>Performance Tips</h5>
        <ul>
          <li>Use fewer objects when possible - many objects slow down the simulation</li>
          <li>Use Physicsless for decorative objects that don't need collision</li>
          <li>Disable shadows on objects that don't need them</li>
          <li>Simple shapes (Box/Cylinder) are faster than complex Models</li>
        </ul>
        <h5>Design Tips</h5>
        <ul>
          <li><strong>Clone</strong> objects instead of creating new ones - saves time and keeps things consistent</li>
          <li>Use <strong>Snap to 1cm</strong> when building grids and mazes</li>
          <li>The <strong>Ruler</strong> tool helps measure gaps to ensure the robot fits</li>
          <li>Test your world frequently - run the simulation to check if objects are placed correctly</li>
          <li>Save objects to file to build a reusable library of walls, obstacles, and decorations</li>
          <li>Use color-coded objects: red for hazards, green for goals, yellow for collectibles</li>
        </ul>
        <div class="help-note">Start simple! Build a basic layout first, test it works, then add complexity and decorations.</div>
      `
    }
  };

  var categories = {
    general: { label: 'General', topics: ['about', 'interface', 'fileMenu', 'snap'] },
    world: { label: 'World', topics: ['ground', 'walls', 'timer', 'robotStart', 'animationSettings'] },
    objects: { label: 'Objects', topics: ['objects', 'boxCylSphere', 'models', 'compounds', 'hinges', 'textures', 'physics', 'animation', 'tips'] }
  };

  function getRelatedTopics(topicId) {
    var topic = topics[topicId];
    if (!topic) return [];
    var cat = topic.category;
    return categories[cat] ? categories[cat].topics : [];
  }

  function showHelp(topicId) {
    if (!topicId || !topics[topicId]) topicId = 'about';
    currentTopic = topicId;

    var overlay = document.getElementById('builderHelpOverlay');
    if (!overlay) return;

    var titleEl = overlay.querySelector('.help-modal-header h3');
    titleEl.textContent = topics[topicId].title;

    var strip = overlay.querySelector('.help-topics-strip');
    strip.innerHTML = '';

    // Show category tabs first
    Object.keys(categories).forEach(function(catId) {
      var cat = categories[catId];
      var isActive = cat.topics.indexOf(topicId) !== -1;
      var catBtn = document.createElement('button');
      catBtn.className = 'help-topic-btn help-cat-btn' + (isActive ? ' active' : '');
      catBtn.textContent = cat.label;
      catBtn.style.fontWeight = 'bold';
      catBtn.onclick = function() { showHelp(cat.topics[0]); };
      strip.appendChild(catBtn);
    });

    // Add separator
    var sep = document.createElement('span');
    sep.style.cssText = 'border-left: 1px solid #3a3a5e; margin: 0 4px;';
    strip.appendChild(sep);

    // Show topics in current category
    var related = getRelatedTopics(topicId);
    related.forEach(function(tid) {
      var btn = document.createElement('button');
      btn.className = 'help-topic-btn' + (tid === topicId ? ' active' : '');
      btn.textContent = topics[tid].title;
      btn.onclick = function() { showHelp(tid); };
      strip.appendChild(btn);
    });

    var content = overlay.querySelector('.help-modal-content');
    content.innerHTML = topics[topicId].content;
    content.scrollTop = 0;

    overlay.classList.add('active');
  }

  function closeHelp() {
    var overlay = document.getElementById('builderHelpOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  return {
    showHelp: showHelp,
    closeHelp: closeHelp,
    topics: topics
  };
})();
