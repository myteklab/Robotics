<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Robotics Simulator - Documentation</title>
  <link rel="icon" href="../favicon-32.png" sizes="32x32">
  <link rel="stylesheet" href="docs.css?v=20260125">
</head>
<body>

<!-- Header -->
<header class="docs-header">
  <a href="../" class="back-link">&larr; Back to Simulator</a>
  <h1>Robotics Simulator Documentation</h1>
  <div class="search-box">
    <input type="text" id="docsSearch" placeholder="Search docs...">
  </div>
</header>

<!-- Layout -->
<div class="docs-layout">

<!-- Sidebar TOC -->
<nav class="docs-sidebar">
  <div class="toc-section">
    <div class="toc-section-header"><span class="chevron">&#9660;</span> Getting Started</div>
    <div class="toc-items">
      <a class="toc-item" href="#intro">What is the Robotics Simulator?</a>
      <a class="toc-item" href="#quick-start">Quick Start</a>
      <a class="toc-item" href="#interface">Interface Overview</a>
    </div>
  </div>
  <div class="toc-section">
    <div class="toc-section-header"><span class="chevron">&#9660;</span> Building Your Robot</div>
    <div class="toc-items">
      <a class="toc-item" href="#configurator">Using the Configurator</a>
      <a class="toc-item" href="#structural-blocks">Structural Blocks</a>
      <a class="toc-item" href="#wheels">Wheels &amp; Drive Systems</a>
      <a class="toc-item" href="#sensors">Sensors</a>
      <a class="toc-item" href="#actuators">Actuators</a>
      <a class="toc-item" href="#other-parts">Other Parts</a>
    </div>
  </div>
  <div class="toc-section">
    <div class="toc-section-header"><span class="chevron">&#9660;</span> Port Assignments</div>
    <div class="toc-items">
      <a class="toc-item" href="#motor-ports">Motor Ports</a>
      <a class="toc-item" href="#sensor-ports">Sensor Ports</a>
      <a class="toc-item" href="#auto-assignment">Auto-Assignment</a>
    </div>
  </div>
  <div class="toc-section">
    <div class="toc-section-header"><span class="chevron">&#9660;</span> Python API - PyBricks</div>
    <div class="toc-items">
      <a class="toc-item" href="#pybricks-overview">Overview &amp; Imports</a>
      <a class="toc-item" href="#pybricks-motor">Motor</a>
      <a class="toc-item" href="#pybricks-drivebase">DriveBase</a>
      <a class="toc-item" href="#pybricks-touch">TouchSensor</a>
      <a class="toc-item" href="#pybricks-color">ColorSensor</a>
      <a class="toc-item" href="#pybricks-ultrasonic">UltrasonicSensor</a>
      <a class="toc-item" href="#pybricks-gyro">GyroSensor</a>
      <a class="toc-item" href="#pybricks-gps">GPSSensor</a>
      <a class="toc-item" href="#pybricks-camera">CameraSensor</a>
      <a class="toc-item" href="#pybricks-pen">Pen</a>
      <a class="toc-item" href="#pybricks-led">LED</a>
      <a class="toc-item" href="#pybricks-display">Display</a>
      <a class="toc-item" href="#pybricks-ev3brick">EV3Brick</a>
      <a class="toc-item" href="#pybricks-tools">Tools &amp; Utilities</a>
      <a class="toc-item" href="#pybricks-constants">Constants</a>
    </div>
  </div>
  <div class="toc-section">
    <div class="toc-section-header"><span class="chevron">&#9660;</span> Python API - EV3dev2</div>
    <div class="toc-items">
      <a class="toc-item" href="#ev3dev2-overview">Overview</a>
      <a class="toc-item" href="#ev3dev2-motors">Motors &amp; Speed</a>
      <a class="toc-item" href="#ev3dev2-sensors">Sensors</a>
      <a class="toc-item" href="#ev3dev2-other">Sound, Button, Radio</a>
    </div>
  </div>
  <div class="toc-section">
    <div class="toc-section-header"><span class="chevron">&#9660;</span> Code Examples</div>
    <div class="toc-items">
      <a class="toc-item" href="#ex-square">Drive in a Square</a>
      <a class="toc-item" href="#ex-line">Line Following</a>
      <a class="toc-item" href="#ex-obstacle">Obstacle Avoidance</a>
      <a class="toc-item" href="#ex-wall">Wall Following</a>
      <a class="toc-item" href="#ex-gps">GPS Navigation</a>
      <a class="toc-item" href="#ex-gyro">Gyro Turns</a>
      <a class="toc-item" href="#ex-pen">Drawing with Pen</a>
      <a class="toc-item" href="#ex-led">LED Signals</a>
      <a class="toc-item" href="#ex-display">Display Dashboard</a>
      <a class="toc-item" href="#ex-arm">Arm Control</a>
      <a class="toc-item" href="#ex-claw">Claw/Gripper</a>
      <a class="toc-item" href="#ex-paintball">Paintball Launcher</a>
      <a class="toc-item" href="#ex-multi">Multi-Sensor Robot</a>
    </div>
  </div>
  <div class="toc-section">
    <div class="toc-section-header"><span class="chevron">&#9660;</span> World Builder</div>
    <div class="toc-items">
      <a class="toc-item" href="#world-builder">Overview</a>
      <a class="toc-item" href="#wb-ground">Ground Settings</a>
      <a class="toc-item" href="#wb-objects">Objects</a>
      <a class="toc-item" href="#wb-textures">Images &amp; Textures</a>
      <a class="toc-item" href="#wb-physics">Physics</a>
      <a class="toc-item" href="#wb-animation">Animation</a>
      <a class="toc-item" href="#wb-zones">Scoring Zones</a>
      <a class="toc-item" href="#wb-snap">Snap Grid</a>
    </div>
  </div>
  <div class="toc-section">
    <div class="toc-section-header"><span class="chevron">&#9660;</span> Troubleshooting</div>
    <div class="toc-items">
      <a class="toc-item" href="#common-errors">Common Errors</a>
      <a class="toc-item" href="#debugging">Debugging with print()</a>
      <a class="toc-item" href="#sensor-tips">Sensor Tips</a>
      <a class="toc-item" href="#sensor-visualization">Sensor Visualization</a>
    </div>
  </div>
</nav>

<!-- Main Content -->
<main class="docs-main">

<!-- Getting Started -->
<section class="docs-section" id="intro">
  <h2>What is the Robotics Simulator?</h2>
  <p>The Robotics Simulator is a virtual environment where you can design, program, and test robots using Python. It simulates realistic physics (powered by Ammo.js/Bullet), sensors, and actuators, letting you experiment with robotics concepts without physical hardware.</p>
  <p>The simulator uses APIs modeled after real robotics frameworks (PyBricks and EV3dev2), so skills you learn here transfer directly to programming real LEGO EV3 or Spike robots.</p>
  <h3>What You Can Do</h3>
  <ul>
    <li>Build custom robots with structural blocks, sensors, wheels, and actuators</li>
    <li>Program robot behavior using Python</li>
    <li>Test in various environments: line following tracks, mazes, arenas, and custom worlds</li>
    <li>Use realistic sensors: color detection, distance measurement, gyroscope, GPS, touch, and camera</li>
    <li>Draw patterns with the Pen device</li>
    <li>Control arms, claws, magnets, and launchers</li>
  </ul>
</section>

<section class="docs-section" id="quick-start">
  <h2>Quick Start</h2>
  <ol class="steps">
    <li><strong>Build your robot</strong> - Go to <code>Robot &gt; Configurator</code> to design your robot, or use <code>Robot &gt; Select Robot</code> to pick a pre-built template.</li>
    <li><strong>Add sensors</strong> - In the Configurator, click <strong>Add</strong> and choose sensors (Color, Ultrasonic, Gyro, etc.) that your program will use.</li>
    <li><strong>Write your program</strong> - Click the <strong>Python</strong> tab and write your control code using the PyBricks API.</li>
    <li><strong>Run the simulation</strong> - Click the <strong>Simulator</strong> tab, then press the <strong>Play</strong> button to execute your code.</li>
    <li><strong>Iterate</strong> - Watch the results, modify your code, press <strong>Reset</strong> to reposition, and run again.</li>
  </ol>
  <div class="note">The console at the bottom of the simulator shows <code>print()</code> output and error messages. Expand it by clicking the chevron.</div>
</section>

<section class="docs-section" id="interface">
  <h2>Interface Overview</h2>
  <h3>Main Panels</h3>
  <ul>
    <li><strong>Blocks</strong> - Visual block-based programming (Blockly). Generates Python automatically.</li>
    <li><strong>Python</strong> - Direct Python code editor with syntax highlighting and auto-completion.</li>
    <li><strong>Simulator</strong> - 3D simulation view with physics and sensor feedback.</li>
  </ul>
  <h3>Menu Bar</h3>
  <ul>
    <li><strong>File</strong> - Save, load, export, and manage projects.</li>
    <li><strong>Python</strong> - Switch between PyBricks and EV3dev2 API modes.</li>
    <li><strong>Robot</strong> - Select robot templates or open the Configurator.</li>
    <li><strong>Worlds</strong> - Change simulation environment.</li>
    <li><strong>Help</strong> - Access in-app help topics and documentation.</li>
  </ul>
  <h3>Simulator Controls</h3>
  <ul>
    <li><strong>Play/Stop</strong> - Run or stop Python code execution</li>
    <li><strong>Reset</strong> - Return robot to starting position</li>
    <li><strong>Sensors panel</strong> - Toggle live sensor readings display</li>
    <li><strong>Sensor Visualization</strong> (eye icon) - Show/hide visual overlays for each sensor's detection area</li>
    <li><strong>Camera modes</strong> - Follow, Top-down, Arc (orbit), Reset</li>
    <li><strong>Ruler</strong> - Measure positions and distances</li>
    <li><strong>Joystick</strong> - Manual robot control (keyboard/virtual)</li>
    <li><strong>Lighting</strong> - Adjust sun, ambient light, and shadows</li>
  </ul>
  <h3>Keyboard Controls</h3>
  <p>When the Simulator tab is active, you can manually drive the robot using your keyboard:</p>
  <table>
    <tr><th>Key</th><th>Action</th></tr>
    <tr><td><code>↑</code> (Up Arrow)</td><td>Drive forward</td></tr>
    <tr><td><code>↓</code> (Down Arrow)</td><td>Drive backward</td></tr>
    <tr><td><code>←</code> (Left Arrow)</td><td>Turn left</td></tr>
    <tr><td><code>→</code> (Right Arrow)</td><td>Turn right</td></tr>
    <tr><td><code>Shift</code> + Arrow</td><td>Precision mode (slower, gentler turns)</td></tr>
  </table>
  <div class="note">Arrow keys will automatically start the simulation if it's not already running. The robot accelerates and decelerates smoothly for more realistic movement.</div>
</section>

<!-- Building Your Robot -->
<section class="docs-section" id="configurator">
  <h2>Using the Configurator</h2>
  <p>The Configurator is a 3D editor for building your robot. Access it from <code>Robot &gt; Configurator</code> in the main simulator.</p>
  <h3>Workflow</h3>
  <ol>
    <li>Click <strong>Add</strong> to add a component (block, sensor, wheel, etc.)</li>
    <li>Select a component in the left panel to view/edit its settings</li>
    <li>Adjust position (x, y, z) and rotation in the settings panel</li>
    <li>Use <strong>Delete</strong> to remove selected components</li>
    <li>Use <strong>Undo</strong> to revert the last change</li>
  </ol>
  <h3>Tips</h3>
  <ul>
    <li>The first component is always the robot body (cannot be deleted)</li>
    <li>Use the 3D view to verify component placement</li>
    <li>Snap mode helps align components precisely</li>
    <li>The Ruler tool shows exact coordinates</li>
    <li>Components positioned below the body will drag on the ground</li>
  </ul>
</section>

<section class="docs-section" id="structural-blocks">
  <h2>Structural Blocks</h2>
  <p>Blocks form the physical structure of your robot. They add mass and collision geometry but have no electronic function.</p>
  <table>
    <tr><th>Type</th><th>Parameters</th><th>Use Case</th></tr>
    <tr><td>Box</td><td>width, height, depth</td><td>Main body, platforms, bumpers</td></tr>
    <tr><td>Cylinder</td><td>radius, height</td><td>Axles, posts, towers</td></tr>
    <tr><td>Sphere</td><td>radius</td><td>Bumpers, decorative elements</td></tr>
    <tr><td>Cone</td><td>top radius, bottom radius, height</td><td>Funnels, directional shapes</td></tr>
    <tr><td>Torus</td><td>tube radius, ring radius</td><td>Rings, guards</td></tr>
  </table>
  <h3>Common Properties (All Components)</h3>
  <ul>
    <li><strong>Position</strong> (x, y, z) - Location relative to the robot's center point</li>
    <li><strong>Rotation</strong> (x, y, z) - Orientation in degrees</li>
    <li><strong>Color</strong> - Hex color code for visual appearance</li>
    <li><strong>Mass</strong> - Weight in simulation units (affects physics behavior)</li>
  </ul>
</section>

<section class="docs-section" id="wheels">
  <h2>Wheels &amp; Drive Systems</h2>
  <h3>Driven Wheels (Wheel)</h3>
  <p>Motorized wheels connected to a motor port. You need at least two driven wheels for a DriveBase.</p>
  <ul>
    <li><strong>Wheel Diameter</strong> - Affects speed and distance calculations</li>
    <li><strong>Wheel Width</strong> - Visual width of the wheel</li>
    <li><strong>Motor Port</strong> - Which port controls this wheel (Port.A, Port.B, etc.)</li>
  </ul>
  <h3>Passive Wheels (WheelPassive)</h3>
  <p>Free-spinning caster wheels that provide balance without a motor connection. Use these as support wheels for stability.</p>
  <h3>DriveBase Requirements</h3>
  <p>To use the DriveBase class in Python, you need:</p>
  <ul>
    <li>A left wheel on one motor port (e.g., Port.A)</li>
    <li>A right wheel on another motor port (e.g., Port.B)</li>
    <li>Know the <code>wheel_diameter</code> (mm) and <code>axle_track</code> (distance between wheel centers in mm)</li>
  </ul>
  <div class="note">The axle_track is the distance between the centers of the left and right wheels. Measure it in the Configurator using the Ruler tool.</div>
</section>

<section class="docs-section" id="sensors">
  <h2>Sensors</h2>
  <p>Sensors allow your robot to perceive its environment. Each sensor is assigned a sensor port (S1-S20) and read from Python code.</p>
  <table>
    <tr><th>Sensor</th><th>What It Detects</th><th>Typical Use</th></tr>
    <tr><td>ColorSensor</td><td>Surface color and reflectivity</td><td>Line following, color sorting</td></tr>
    <tr><td>UltrasonicSensor</td><td>Distance to objects (mm)</td><td>Obstacle avoidance</td></tr>
    <tr><td>LaserRangeSensor</td><td>Precise distance (laser beam)</td><td>Wall following, mapping</td></tr>
    <tr><td>GyroSensor</td><td>Rotation angle and rate</td><td>Precise turns, heading</td></tr>
    <tr><td>GPSSensor*</td><td>X, Y position and altitude</td><td>Navigation to coordinates</td></tr>
    <tr><td>TouchSensor</td><td>Physical contact (pressed/released)</td><td>Bump detection, buttons</td></tr>
    <tr><td>CameraSensor*</td><td>Visual view (first-person)</td><td>Visualization only</td></tr>
  </table>
  <div class="warning">* GPSSensor and CameraSensor are virtual-only devices. They exist only in the simulator and have no real-world EV3 equivalent.</div>
  <h3>Sensor Placement Tips</h3>
  <ul>
    <li><strong>Color sensor</strong> - Position facing down, close to the ground surface</li>
    <li><strong>Ultrasonic/Laser</strong> - Position facing forward at obstacle height</li>
    <li><strong>Touch sensor</strong> - Position at the front as a bumper</li>
    <li><strong>Gyro</strong> - Position at the robot's center for accurate readings</li>
  </ul>
</section>

<section class="docs-section" id="actuators">
  <h2>Actuators</h2>
  <p>Actuators are motorized components that move or interact with the world. Each uses a motor port (A-T).</p>
  <table>
    <tr><th>Actuator</th><th>Motion Type</th><th>Use Case</th></tr>
    <tr><td>Wheel</td><td>Continuous rotation</td><td>Driving, locomotion</td></tr>
    <tr><td>Arm</td><td>Rotating joint</td><td>Lifting, grabbing</td></tr>
    <tr><td>Swivel</td><td>Rotating platform</td><td>Turrets, scanning</td></tr>
    <tr><td>Linear</td><td>Push/pull</td><td>Pistons, extensions</td></tr>
    <tr><td>Claw/Gripper</td><td>Opposing jaws</td><td>Gripping and carrying objects</td></tr>
    <tr><td>Magnet</td><td>On/off grip</td><td>Picking up metallic objects</td></tr>
    <tr><td>Paintball</td><td>Projectile launch</td><td>Target shooting</td></tr>
  </table>
  <p>All actuators are controlled using the <code>Motor</code> class in Python. The motor port you assign in the Configurator is what you use in code.</p>

  <h3>Claw/Gripper Details</h3>
  <p>The Claw actuator has two opposing jaws driven by a single motor port. The jaws open and close symmetrically around a pivot point.</p>
  <ul>
    <li><strong>0&deg; = fully closed</strong>, <strong>maxAngle&deg; = fully open</strong></li>
    <li><strong>Positive speed</strong> opens the jaws, <strong>negative speed</strong> closes them</li>
    <li><strong>Grip detection</strong>: When jaws close near an object marked as "Magnetic" in the World Builder, the claw automatically grips and holds it between the jaws</li>
    <li><strong>Release</strong>: Opening the jaws releases the gripped object</li>
    <li>Can be mounted on an Arm or Swivel actuator for pick-and-place workflows</li>
  </ul>
  <h4>Configurable Options</h4>
  <table>
    <tr><th>Option</th><th>Default</th><th>Description</th></tr>
    <tr><td>Jaw Length</td><td>6 cm</td><td>Length of each jaw</td></tr>
    <tr><td>Jaw Width</td><td>1 cm</td><td>Width of each jaw</td></tr>
    <tr><td>Min Angle</td><td>0&deg;</td><td>Fully closed position</td></tr>
    <tr><td>Max Angle</td><td>45&deg;</td><td>Fully open position</td></tr>
    <tr><td>Start Angle</td><td>30&deg;</td><td>Initial opening angle</td></tr>
    <tr><td>Grip Threshold</td><td>5&deg;</td><td>Degrees from closed at which grip engages</td></tr>
    <tr><td>Mass</td><td>50</td><td>Total jaw mass (reduce when mounting on arm)</td></tr>
    <tr><td>Friction</td><td>0.8</td><td>Jaw surface friction</td></tr>
  </table>
</section>

<section class="docs-section" id="other-parts">
  <h2>Other Parts</h2>
  <h3>LED</h3>
  <p>A light-emitting component. Controlled from Python to turn on/off and change color. Illuminates nearby surfaces in the simulation.</p>
  <h3>Display</h3>
  <p>A simulated LCD screen with 5 lines of text. Shows output on the 3D robot and in the sensor panel. Supports animation effects: scrolling marquee, typewriter, and blinking text.</p>
  <h3>Pen</h3>
  <p>Draws colored lines on the ground as the robot moves. Lower the pen with <code>pen.down()</code> and raise with <code>pen.up()</code>. Great for geometry and art projects.</p>
  <h3>WheelPassive</h3>
  <p>A free-spinning support wheel with no motor. Provides stability (like a caster wheel) without requiring a port assignment.</p>
  <h3>Decorative</h3>
  <p>Visual-only elements with no physics interaction. Use for appearance customization.</p>
  <h3>Hardware</h3>
  <p>Additional structural elements like mounting brackets, plates, or frames. Similar to blocks but with specialized shapes.</p>
</section>

<!-- Port Assignments -->
<section class="docs-section" id="motor-ports">
  <h2>Motor Ports</h2>
  <p>Motor ports connect actuators (wheels, arms, etc.) to your Python code. The simulator supports ports A through T (20 motor ports).</p>
  <pre>from pybricks.parameters import Port

# Common port assignments
left_wheel = Motor(Port.A)    # Left drive wheel
right_wheel = Motor(Port.B)   # Right drive wheel
arm = Motor(Port.C)           # Arm actuator
claw = Motor(Port.D)          # Claw/gripper
launcher = Motor(Port.E)      # Paintball launcher</pre>
  <h3>Port Constants</h3>
  <p><code>Port.A</code>, <code>Port.B</code>, <code>Port.C</code>, <code>Port.D</code>, <code>Port.E</code>, <code>Port.F</code>, <code>Port.G</code>, <code>Port.H</code>, <code>Port.I</code>, <code>Port.J</code>, <code>Port.K</code>, <code>Port.L</code>, <code>Port.M</code>, <code>Port.N</code>, <code>Port.O</code>, <code>Port.P</code>, <code>Port.Q</code>, <code>Port.R</code>, <code>Port.S</code>, <code>Port.T</code></p>
</section>

<section class="docs-section" id="sensor-ports">
  <h2>Sensor Ports</h2>
  <p>Sensor ports connect sensors to your Python code. The simulator supports ports S1 through S20.</p>
  <pre>from pybricks.parameters import Port

color = ColorSensor(Port.S1)
ultrasonic = UltrasonicSensor(Port.S2)
gyro = GyroSensor(Port.S3)
gps = GPSSensor(Port.S4)
touch = TouchSensor(Port.S5)</pre>
</section>

<section class="docs-section" id="auto-assignment">
  <h2>Auto-Assignment</h2>
  <p>When you add components in the Configurator, ports are automatically assigned sequentially:</p>
  <ul>
    <li>First wheel added gets Port.A, second gets Port.B, etc.</li>
    <li>First sensor added gets Port.S1, second gets Port.S2, etc.</li>
  </ul>
  <p>You can manually change port assignments in the component settings panel. Make sure your Python code matches the ports set in the Configurator.</p>
  <div class="warning">If your code uses <code>Port.A</code> but the wheel is assigned to <code>Port.B</code> in the Configurator, the wheel won't respond to your code.</div>
</section>

<!-- PyBricks API -->
<section class="docs-section" id="pybricks-overview">
  <h2>PyBricks API - Overview</h2>
  <p>PyBricks is the primary Python API for the simulator. It is modeled after the real PyBricks MicroPython library used on EV3 and Spike Prime robots.</p>
  <h3>Standard Imports</h3>
  <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor, TouchSensor, ColorSensor, UltrasonicSensor, GyroSensor
from pybricks.ev3devices import GPSSensor, CameraSensor, Pen, LED
from pybricks.parameters import Port, Stop, Direction, Color, Button
from pybricks.robotics import DriveBase
from pybricks.tools import wait</pre>
  <h3>Basic Program Structure</h3>
  <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase
from pybricks.tools import wait

# Initialize
ev3 = EV3Brick()
left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)

# Your code here
robot.straight(300)
robot.turn(90)
ev3.speaker.beep()</pre>
</section>

<section class="docs-section" id="pybricks-motor">
  <h2>Motor</h2>
  <pre>from pybricks.ev3devices import Motor
from pybricks.parameters import Port, Stop, Direction

motor = Motor(Port.A)
motor = Motor(Port.A, positive_direction=Direction.COUNTERCLOCKWISE)</pre>
  <h3>Movement Methods</h3>
  <table>
    <tr><th>Method</th><th>Parameters</th><th>Description</th></tr>
    <tr><td><code>run(speed)</code></td><td>speed (deg/s)</td><td>Run continuously at specified speed</td></tr>
    <tr><td><code>run_time(speed, time)</code></td><td>speed (deg/s), time (ms), then, wait</td><td>Run for a duration then stop</td></tr>
    <tr><td><code>run_angle(speed, angle)</code></td><td>speed (deg/s), angle (deg), then, wait</td><td>Run for a specific rotation angle</td></tr>
    <tr><td><code>run_target(speed, target)</code></td><td>speed (deg/s), target (deg), then, wait</td><td>Run to an absolute angle position</td></tr>
    <tr><td><code>stop()</code></td><td>-</td><td>Coast to stop (no active braking)</td></tr>
    <tr><td><code>brake()</code></td><td>-</td><td>Apply braking force</td></tr>
    <tr><td><code>hold()</code></td><td>-</td><td>Actively hold current position</td></tr>
    <tr><td><code>dc(duty)</code></td><td>duty (-100 to 100)</td><td>Set raw duty cycle percentage</td></tr>
  </table>
  <h3>Reading Methods</h3>
  <table>
    <tr><th>Method</th><th>Returns</th><th>Description</th></tr>
    <tr><td><code>speed()</code></td><td>int (deg/s)</td><td>Current rotation speed</td></tr>
    <tr><td><code>angle()</code></td><td>int (degrees)</td><td>Current angular position</td></tr>
    <tr><td><code>reset_angle(angle)</code></td><td>-</td><td>Set angle counter to specified value</td></tr>
  </table>
  <h3>Stop Mode Parameters</h3>
  <ul>
    <li><code>then=Stop.HOLD</code> - Hold position actively after stopping (default)</li>
    <li><code>then=Stop.BRAKE</code> - Apply passive braking</li>
    <li><code>then=Stop.COAST</code> - Let motor coast freely</li>
  </ul>
  <h3>Wait Parameter</h3>
  <ul>
    <li><code>wait=True</code> (default) - Block until motion completes</li>
    <li><code>wait=False</code> - Return immediately, motor runs in background</li>
  </ul>
  <pre># Examples
motor.run(500)                              # Spin at 500 deg/s
motor.run_time(300, 2000)                   # 300 deg/s for 2 seconds
motor.run_angle(500, 360)                   # One full rotation
motor.run_angle(500, 360, then=Stop.COAST)  # Full rotation, then coast
motor.run_target(200, 90)                   # Go to 90 degree position

# Non-blocking (run two motors simultaneously)
motor_a.run_angle(500, 360, wait=False)
motor_b.run_angle(500, -360, wait=True)  # Wait for this one</pre>
</section>

<section class="docs-section" id="pybricks-drivebase">
  <h2>DriveBase</h2>
  <p>Controls two motors together for differential-drive robots (left + right wheels).</p>
  <pre>from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase

left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)</pre>
  <h3>Constructor Parameters</h3>
  <ul>
    <li><code>left_motor</code> - Motor instance for the left wheel</li>
    <li><code>right_motor</code> - Motor instance for the right wheel</li>
    <li><code>wheel_diameter</code> - Wheel diameter in mm (used for distance calculations)</li>
    <li><code>axle_track</code> - Distance between wheel centers in mm (used for turn calculations)</li>
  </ul>
  <h3>Movement Methods</h3>
  <table>
    <tr><th>Method</th><th>Parameters</th><th>Description</th></tr>
    <tr><td><code>straight(distance)</code></td><td>distance (mm)</td><td>Drive straight. Negative = backward.</td></tr>
    <tr><td><code>turn(angle)</code></td><td>angle (degrees)</td><td>Turn in place. Positive = clockwise.</td></tr>
    <tr><td><code>drive(speed, turn_rate)</code></td><td>speed (mm/s), turn_rate (deg/s)</td><td>Continuous driving with optional turning</td></tr>
    <tr><td><code>stop()</code></td><td>-</td><td>Stop both motors</td></tr>
  </table>
  <h3>Reading Methods</h3>
  <table>
    <tr><th>Method</th><th>Returns</th><th>Description</th></tr>
    <tr><td><code>distance()</code></td><td>float (mm)</td><td>Total distance driven since reset</td></tr>
    <tr><td><code>angle()</code></td><td>float (degrees)</td><td>Total angle turned since reset</td></tr>
    <tr><td><code>state()</code></td><td>tuple</td><td>(distance, speed, angle, turn_rate)</td></tr>
    <tr><td><code>reset()</code></td><td>-</td><td>Reset distance and angle counters to 0</td></tr>
  </table>
  <h3>Settings</h3>
  <pre># Set max speeds and accelerations
robot.settings(
    straight_speed=200,       # mm/s
    straight_acceleration=400,  # mm/s^2
    turn_rate=90,             # deg/s
    turn_acceleration=180     # deg/s^2
)

# Read current settings
speed, accel, turn, turn_accel = robot.settings()</pre>
  <h3>drive() vs straight()/turn()</h3>
  <ul>
    <li><code>straight()</code> and <code>turn()</code> are blocking - they complete the motion before returning</li>
    <li><code>drive()</code> is non-blocking - it sets speeds and returns immediately, good for continuous control loops</li>
  </ul>
  <pre># Blocking movement
robot.straight(500)  # Waits until done
robot.turn(90)       # Waits until done

# Non-blocking (for sensor-based control)
while True:
    if sensor.distance() < 200:
        robot.drive(0, 90)   # Turn in place
    else:
        robot.drive(150, 0)  # Drive forward</pre>
</section>

<section class="docs-section" id="pybricks-touch">
  <h2>TouchSensor</h2>
  <pre>from pybricks.ev3devices import TouchSensor
from pybricks.parameters import Port

touch = TouchSensor(Port.S1)</pre>
  <table>
    <tr><th>Method</th><th>Returns</th><th>Description</th></tr>
    <tr><td><code>pressed()</code></td><td>bool</td><td>True if sensor is currently pressed</td></tr>
  </table>
  <pre># Wait for button press
while not touch.pressed():
    wait(10)
print("Button pressed!")</pre>
</section>

<section class="docs-section" id="pybricks-color">
  <h2>ColorSensor</h2>
  <pre>from pybricks.ev3devices import ColorSensor
from pybricks.parameters import Port, Color

color_sensor = ColorSensor(Port.S1)</pre>
  <table>
    <tr><th>Method</th><th>Returns</th><th>Description</th></tr>
    <tr><td><code>color()</code></td><td>Color constant or None</td><td>Detected color name</td></tr>
    <tr><td><code>reflection()</code></td><td>int (0-100)</td><td>Reflected light intensity</td></tr>
    <tr><td><code>ambient()</code></td><td>int (0-100)</td><td>Ambient light intensity</td></tr>
    <tr><td><code>rgb()</code></td><td>tuple (R, G, B)</td><td>RGB values, each 0-100</td></tr>
  </table>
  <h3>Color Constants</h3>
  <p>The <code>color()</code> method returns one of these constants, or <code>None</code> if no color is detected:</p>
  <ul>
    <li><code>Color.BLACK</code> (1), <code>Color.BLUE</code> (2), <code>Color.GREEN</code> (3)</li>
    <li><code>Color.YELLOW</code> (4), <code>Color.RED</code> (5), <code>Color.WHITE</code> (6)</li>
    <li><code>Color.BROWN</code> (7), <code>Color.ORANGE</code> (8), <code>Color.PURPLE</code> (9)</li>
  </ul>
  <h3>reflection() for Line Following</h3>
  <p>Returns 0 for pure black and 100 for pure white. This is the most commonly used method for line-following robots:</p>
  <pre># Simple threshold-based line following
while True:
    if color_sensor.reflection() < 30:
        robot.drive(100, -40)  # Turn left (on the line)
    else:
        robot.drive(100, 40)   # Turn right (off the line)</pre>
</section>

<section class="docs-section" id="pybricks-ultrasonic">
  <h2>UltrasonicSensor</h2>
  <pre>from pybricks.ev3devices import UltrasonicSensor
from pybricks.parameters import Port

ultrasonic = UltrasonicSensor(Port.S2)</pre>
  <table>
    <tr><th>Method</th><th>Returns</th><th>Description</th></tr>
    <tr><td><code>distance()</code></td><td>float (mm)</td><td>Distance to nearest object in millimeters</td></tr>
  </table>
  <div class="note">The sensor measures distance in millimeters. Common thresholds: 150mm = very close, 300mm = nearby, 1000mm = distant.</div>
  <pre># Simple obstacle detection
while True:
    d = ultrasonic.distance()
    print("Distance:", d, "mm")
    if d < 150:
        robot.stop()
        break
    robot.drive(200, 0)
    wait(50)</pre>
</section>

<section class="docs-section" id="pybricks-gyro">
  <h2>GyroSensor</h2>
  <pre>from pybricks.ev3devices import GyroSensor
from pybricks.parameters import Port

gyro = GyroSensor(Port.S3)</pre>
  <table>
    <tr><th>Method</th><th>Returns</th><th>Description</th></tr>
    <tr><td><code>angle()</code></td><td>float (degrees)</td><td>Cumulative yaw rotation since last reset</td></tr>
    <tr><td><code>speed()</code></td><td>float (deg/s)</td><td>Current rotation rate</td></tr>
    <tr><td><code>reset_angle(angle)</code></td><td>-</td><td>Set the angle counter to a specific value</td></tr>
  </table>
  <div class="note">The gyro measures yaw (horizontal rotation). Positive values = clockwise. It does not measure tilt (pitch/roll).</div>
  <pre># Precise 90-degree turn using gyro
gyro.reset_angle(0)
robot.drive(0, 80)  # Start rotating clockwise
while gyro.angle() < 90:
    wait(10)
robot.stop()
print("Turned", gyro.angle(), "degrees")</pre>
</section>

<section class="docs-section" id="pybricks-gps">
  <h2>GPSSensor</h2>
  <div class="warning">Virtual-only device. Does not exist on real EV3 hardware.</div>
  <pre>from pybricks.ev3devices import GPSSensor
from pybricks.parameters import Port

gps = GPSSensor(Port.S4)</pre>
  <table>
    <tr><th>Property</th><th>Returns</th><th>Description</th></tr>
    <tr><td><code>position</code></td><td>tuple (x, y, alt)</td><td>Full 3D position</td></tr>
    <tr><td><code>x</code></td><td>float</td><td>X coordinate in world units</td></tr>
    <tr><td><code>y</code></td><td>float</td><td>Y coordinate in world units</td></tr>
    <tr><td><code>altitude</code></td><td>float</td><td>Height above ground</td></tr>
  </table>
  <div class="note">These are properties, not methods. Use <code>gps.x</code> not <code>gps.x()</code>.</div>
  <pre># Print current position
print("Position:", gps.x, gps.y)
print("Altitude:", gps.altitude)
print("Full:", gps.position)</pre>
</section>

<section class="docs-section" id="pybricks-camera">
  <h2>CameraSensor</h2>
  <div class="warning">Virtual-only device. Provides first-person view overlay but does not return image data for processing.</div>
  <pre>from pybricks.ev3devices import CameraSensor
from pybricks.parameters import Port

camera = CameraSensor(Port.S5)</pre>
  <table>
    <tr><th>Method</th><th>Description</th></tr>
    <tr><td><code>activate()</code></td><td>Turn on camera (shows first-person view in simulator)</td></tr>
    <tr><td><code>deactivate()</code></td><td>Turn off camera view</td></tr>
  </table>
</section>

<section class="docs-section" id="pybricks-pen">
  <h2>Pen</h2>
  <div class="warning">Virtual-only device. Draws lines on the ground surface.</div>
  <pre>from pybricks.ev3devices import Pen

pen = Pen()</pre>
  <table>
    <tr><th>Method</th><th>Parameters</th><th>Description</th></tr>
    <tr><td><code>down()</code></td><td>-</td><td>Lower pen to start drawing</td></tr>
    <tr><td><code>up()</code></td><td>-</td><td>Raise pen to stop drawing</td></tr>
    <tr><td><code>setColor(r, g, b)</code></td><td>r, g, b (0.0-1.0)</td><td>Set drawing color</td></tr>
    <tr><td><code>setWidth(width)</code></td><td>width (float)</td><td>Set line thickness</td></tr>
  </table>
  <div class="note">Color values use 0.0-1.0 range (not 0-255). Example: red = (1.0, 0.0, 0.0), green = (0.0, 1.0, 0.0).</div>
  <pre># Draw a colorful pattern
colors = [(1,0,0), (0,1,0), (0,0,1), (1,1,0)]
pen.setWidth(1.5)
pen.down()
for r, g, b in colors:
    pen.setColor(r, g, b)
    robot.straight(150)
    robot.turn(90)
pen.up()</pre>
</section>

<section class="docs-section" id="pybricks-led">
  <h2>LED</h2>
  <div class="warning">Virtual-only device. Emits visible light in the simulation.</div>
  <pre>from pybricks.ev3devices import LED

led = LED()</pre>
  <table>
    <tr><th>Method</th><th>Parameters</th><th>Description</th></tr>
    <tr><td><code>on()</code></td><td>-</td><td>Turn LED on</td></tr>
    <tr><td><code>off()</code></td><td>-</td><td>Turn LED off</td></tr>
    <tr><td><code>setColor(r, g, b)</code></td><td>r, g, b (0-255)</td><td>Set LED color</td></tr>
    <tr><td><code>setRange(range)</code></td><td>range (float)</td><td>Set light illumination radius</td></tr>
  </table>
  <div class="note">LED color uses 0-255 range (different from Pen which uses 0.0-1.0).</div>
</section>

<section class="docs-section" id="pybricks-display">
  <h2>Display</h2>
  <div class="warning">Virtual-only device. Simulated LCD screen that shows text on the robot.</div>
  <pre>from ev3dev2.sensor.virtual import Display

display = Display('in1')  # Uses a sensor port</pre>
  <p>The Display component simulates a small LCD screen with 5 lines of text (lines 0-4). Text appears both on the 3D robot model and in the sensor panel overlay.</p>

  <h3>Basic Methods</h3>
  <table>
    <tr><th>Method</th><th>Parameters</th><th>Description</th></tr>
    <tr><td><code>text(line, message)</code></td><td>line (0-4), message (string)</td><td>Set text on a specific line</td></tr>
    <tr><td><code>clear()</code></td><td>-</td><td>Clear all lines</td></tr>
    <tr><td><code>clear(line)</code></td><td>line (0-4)</td><td>Clear a specific line</td></tr>
    <tr><td><code>set_font(size)</code></td><td>'small', 'medium', 'large'</td><td>Change font size</td></tr>
    <tr><td><code>set_color(r, g, b)</code></td><td>r, g, b (0-255)</td><td>Set text color (RGB)</td></tr>
  </table>

  <h3>Animation Effects</h3>
  <table>
    <tr><th>Method</th><th>Parameters</th><th>Description</th></tr>
    <tr><td><code>scroll_text(line, message, speed)</code></td><td>line (0-4), message (string), speed (pixels/sec, default 50)</td><td>Scrolling marquee effect</td></tr>
    <tr><td><code>typewriter(line, message, speed)</code></td><td>line (0-4), message (string), speed (chars/sec, default 10)</td><td>Text appears character by character</td></tr>
    <tr><td><code>blink(line, message, on_time, off_time)</code></td><td>line (0-4), message (string), times in ms (default 500)</td><td>Blinking text effect</td></tr>
    <tr><td><code>stop_animation(line)</code></td><td>line (0-4)</td><td>Stop animation on a line</td></tr>
  </table>

  <h3>Example: Display with Animations</h3>
  <pre>from ev3dev2.sensor.virtual import Display
from pybricks.tools import wait

display = Display('in1')

# Static text
display.text(0, "Robot Status:")
display.set_color(0, 255, 255)  # Cyan

# Scrolling headline
display.scroll_text(1, "Welcome to MyTekOS Robotics Simulator!   ", 60)

# Typewriter effect
display.typewriter(2, "Initializing systems...", 8)
wait(3000)

# Blinking warning
display.set_color(255, 0, 0)  # Red
display.blink(3, "LOW BATTERY", 300, 300)

# Show sensor value
distance = 42
display.text(4, "Dist: " + str(distance) + " cm")</pre>
  <div class="note">Animation effects run continuously until you call <code>text()</code>, <code>clear()</code>, or <code>stop_animation()</code> on that line.</div>
</section>

<section class="docs-section" id="pybricks-ev3brick">
  <h2>EV3Brick</h2>
  <pre>from pybricks.hubs import EV3Brick
ev3 = EV3Brick()</pre>
  <h3>Speaker</h3>
  <table>
    <tr><th>Method</th><th>Parameters</th><th>Description</th></tr>
    <tr><td><code>ev3.speaker.beep(freq, duration)</code></td><td>freq (Hz), duration (ms)</td><td>Play a tone. Defaults: 500Hz, 100ms</td></tr>
    <tr><td><code>ev3.speaker.say(text)</code></td><td>text (string)</td><td>Text-to-speech output</td></tr>
    <tr><td><code>ev3.speaker.set_volume(vol)</code></td><td>volume (0-100)</td><td>Set speaker volume</td></tr>
  </table>
  <h3>Buttons</h3>
  <pre>from pybricks.parameters import Button

pressed = ev3.buttons.pressed()

# Check specific buttons
if Button.CENTER in pressed:
    print("Center!")
if Button.UP in pressed:
    print("Up!")</pre>
  <p>Button constants: <code>Button.UP</code> (8), <code>Button.DOWN</code> (2), <code>Button.LEFT</code> (4), <code>Button.RIGHT</code> (6), <code>Button.CENTER</code> (5)</p>
</section>

<section class="docs-section" id="pybricks-tools">
  <h2>Tools &amp; Utilities</h2>
  <pre>from pybricks.tools import wait</pre>
  <h3>wait(time)</h3>
  <p>Pause program execution for the specified number of milliseconds.</p>
  <pre>wait(1000)   # Wait 1 second
wait(500)    # Wait 0.5 seconds
wait(50)     # Wait 50ms (good for control loops)</pre>
  <div class="note">Use <code>wait()</code> in loops to prevent them from consuming too much CPU. A <code>wait(10)</code> or <code>wait(50)</code> in a while loop is good practice.</div>
</section>

<section class="docs-section" id="pybricks-constants">
  <h2>Constants Reference</h2>
  <pre>from pybricks.parameters import Port, Direction, Stop, Color, Button</pre>
  <h3>Port</h3>
  <ul>
    <li>Motor ports: <code>Port.A</code> through <code>Port.T</code> (20 ports)</li>
    <li>Sensor ports: <code>Port.S1</code> through <code>Port.S20</code> (20 ports)</li>
  </ul>
  <h3>Direction</h3>
  <ul>
    <li><code>Direction.CLOCKWISE</code> - Default positive direction</li>
    <li><code>Direction.COUNTERCLOCKWISE</code> - Reversed direction</li>
  </ul>
  <h3>Stop</h3>
  <ul>
    <li><code>Stop.COAST</code> - No braking, free spin</li>
    <li><code>Stop.BRAKE</code> - Passive resistance</li>
    <li><code>Stop.HOLD</code> - Active position holding</li>
  </ul>
  <h3>Color</h3>
  <ul>
    <li><code>Color.BLACK</code>, <code>Color.BLUE</code>, <code>Color.GREEN</code>, <code>Color.YELLOW</code></li>
    <li><code>Color.RED</code>, <code>Color.WHITE</code>, <code>Color.BROWN</code>, <code>Color.ORANGE</code>, <code>Color.PURPLE</code></li>
  </ul>
  <h3>Button</h3>
  <ul>
    <li><code>Button.UP</code>, <code>Button.DOWN</code>, <code>Button.LEFT</code>, <code>Button.RIGHT</code>, <code>Button.CENTER</code></li>
  </ul>
</section>

<!-- EV3dev2 API -->
<section class="docs-section" id="ev3dev2-overview">
  <h2>EV3dev2 API - Overview</h2>
  <p>EV3dev2 is an alternative Python API available in the simulator. It is based on the ev3dev2 Python library. Select it from the <code>Python</code> menu dropdown.</p>
  <div class="note">PyBricks is recommended for new users. EV3dev2 is provided for compatibility with existing programs.</div>
  <pre>from ev3dev2.motor import LargeMotor, MoveSteering, MoveTank, SpeedPercent
from ev3dev2.sensor.lego import ColorSensor, UltrasonicSensor, GyroSensor, TouchSensor
from ev3dev2.sound import Sound
from ev3dev2.button import Button</pre>
</section>

<section class="docs-section" id="ev3dev2-motors">
  <h2>EV3dev2 - Motors &amp; Speed</h2>
  <h3>Speed Classes</h3>
  <table>
    <tr><th>Class</th><th>Description</th></tr>
    <tr><td><code>SpeedPercent(pct)</code></td><td>Speed as percentage (0-100)</td></tr>
    <tr><td><code>SpeedRPS(rps)</code></td><td>Rotations per second</td></tr>
    <tr><td><code>SpeedRPM(rpm)</code></td><td>Rotations per minute</td></tr>
    <tr><td><code>SpeedDPS(dps)</code></td><td>Degrees per second</td></tr>
  </table>
  <h3>LargeMotor</h3>
  <pre>from ev3dev2.motor import LargeMotor, SpeedPercent, OUTPUT_A

motor = LargeMotor(OUTPUT_A)
motor.on_for_seconds(SpeedPercent(75), 2)   # 75% speed for 2 seconds
motor.on_for_rotations(SpeedPercent(50), 3) # 50% speed for 3 rotations
motor.on_for_degrees(SpeedPercent(60), 180) # 60% speed for 180 degrees</pre>
  <h3>MoveSteering &amp; MoveTank</h3>
  <pre>from ev3dev2.motor import MoveSteering, MoveTank, OUTPUT_A, OUTPUT_B, SpeedPercent

# Steering-based movement
steer = MoveSteering(OUTPUT_A, OUTPUT_B)
steer.on_for_seconds(0, SpeedPercent(50), 2)     # Straight at 50%
steer.on_for_seconds(50, SpeedPercent(50), 1)    # Turn right

# Tank-based movement (individual wheel speeds)
tank = MoveTank(OUTPUT_A, OUTPUT_B)
tank.on_for_seconds(SpeedPercent(50), SpeedPercent(50), 2)  # Straight
tank.on_for_seconds(SpeedPercent(50), SpeedPercent(-50), 1) # Spin</pre>
</section>

<section class="docs-section" id="ev3dev2-sensors">
  <h2>EV3dev2 - Sensors</h2>
  <pre>from ev3dev2.sensor.lego import ColorSensor, UltrasonicSensor, GyroSensor, TouchSensor
from ev3dev2.sensor import INPUT_1, INPUT_2, INPUT_3</pre>
  <h3>ColorSensor</h3>
  <table>
    <tr><th>Property/Method</th><th>Returns</th></tr>
    <tr><td><code>reflected_light_intensity</code></td><td>Reflected light (0-100)</td></tr>
    <tr><td><code>color</code></td><td>Color constant (0-7)</td></tr>
    <tr><td><code>rgb</code></td><td>Tuple (R, G, B) values 0-255</td></tr>
  </table>
  <h3>UltrasonicSensor</h3>
  <table>
    <tr><th>Property</th><th>Returns</th></tr>
    <tr><td><code>distance_centimeters</code></td><td>Distance in cm</td></tr>
  </table>
  <h3>GyroSensor</h3>
  <table>
    <tr><th>Property</th><th>Returns</th></tr>
    <tr><td><code>angle</code></td><td>Cumulative angle (degrees)</td></tr>
    <tr><td><code>rate</code></td><td>Rotation rate (deg/s)</td></tr>
  </table>
  <h3>TouchSensor</h3>
  <table>
    <tr><th>Property</th><th>Returns</th></tr>
    <tr><td><code>is_pressed</code></td><td>True/False</td></tr>
  </table>
</section>

<section class="docs-section" id="ev3dev2-other">
  <h2>EV3dev2 - Sound, Button, Radio</h2>
  <h3>Sound</h3>
  <pre>from ev3dev2.sound import Sound

sound = Sound()
sound.beep()
sound.speak("Hello world")
sound.play_tone(440, 0.5)  # 440Hz for 0.5 seconds</pre>
  <h3>Button</h3>
  <pre>from ev3dev2.button import Button

btn = Button()
if btn.up:
    print("Up pressed")
if btn.down:
    print("Down pressed")</pre>
</section>

<!-- Code Examples -->
<section class="docs-section" id="ex-square">
  <h2>Example: Drive in a Square</h2>
  <p>The most basic robot program - drive in a square pattern using DriveBase.</p>
  <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase

ev3 = EV3Brick()
left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)

# Drive in a square
for i in range(4):
    robot.straight(300)   # Forward 300mm
    robot.turn(90)        # Turn right 90 degrees

ev3.speaker.beep()
print("Square complete!")</pre>
</section>

<section class="docs-section" id="ex-line">
  <h2>Example: Line Following</h2>
  <p>Follow a dark line using proportional control with a color sensor.</p>
  <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor, ColorSensor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase
from pybricks.tools import wait

ev3 = EV3Brick()
left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
color = ColorSensor(Port.S1)

# Proportional line follower
target = 50    # Target reflection (between line and surface)
Kp = 1.5       # Proportional gain
speed = 100    # Base forward speed

while True:
    error = target - color.reflection()
    turn = Kp * error
    robot.drive(speed, turn)
    wait(10)</pre>
  <div class="note">Use the "Line Following" world. Adjust <code>target</code> based on your line/surface colors. Higher <code>Kp</code> = more aggressive turning.</div>
</section>

<section class="docs-section" id="ex-obstacle">
  <h2>Example: Obstacle Avoidance</h2>
  <p>Navigate around obstacles using an ultrasonic sensor.</p>
  <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor, UltrasonicSensor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase
from pybricks.tools import wait

ev3 = EV3Brick()
left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
ultrasonic = UltrasonicSensor(Port.S2)

while True:
    distance = ultrasonic.distance()

    if distance < 150:
        # Very close - back up and turn
        robot.stop()
        ev3.speaker.beep(800, 50)
        robot.straight(-150)
        robot.turn(90)
    elif distance < 300:
        # Approaching - slow down and veer right
        robot.drive(80, 40)
    else:
        # Clear - drive forward
        robot.drive(200, 0)

    wait(50)</pre>
</section>

<section class="docs-section" id="ex-wall">
  <h2>Example: Wall Following</h2>
  <p>Follow along a wall at a constant distance using proportional control.</p>
  <pre>from pybricks.ev3devices import Motor, UltrasonicSensor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
side_sensor = UltrasonicSensor(Port.S2)  # Mounted facing right

target_distance = 150   # Desired distance from wall (mm)
Kp = 0.3               # Proportional gain
speed = 120            # Forward speed

while True:
    dist = side_sensor.distance()
    error = dist - target_distance
    turn = Kp * error   # Positive error = too far, turn toward wall
    robot.drive(speed, turn)
    wait(50)</pre>
  <div class="note">Mount the ultrasonic sensor facing sideways (perpendicular to the direction of travel) for wall following.</div>
</section>

<section class="docs-section" id="ex-gps">
  <h2>Example: GPS Navigation</h2>
  <p>Navigate to a sequence of waypoints using GPS and gyro sensors.</p>
  <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor, GPSSensor, GyroSensor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase
from pybricks.tools import wait
import math

ev3 = EV3Brick()
left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
gps = GPSSensor(Port.S4)
gyro = GyroSensor(Port.S3)

waypoints = [(50, 50), (50, -50), (-50, -50), (-50, 50), (0, 0)]

for target_x, target_y in waypoints:
    print("Heading to:", target_x, target_y)

    while True:
        dx = target_x - gps.x
        dy = target_y - gps.y
        dist = math.sqrt(dx*dx + dy*dy)

        if dist < 10:
            robot.stop()
            ev3.speaker.beep(600, 100)
            wait(300)
            break

        # Drive toward target with speed proportional to distance
        speed = min(dist * 3, 250)
        robot.drive(speed, 0)
        wait(50)

print("All waypoints reached!")
ev3.speaker.beep(1000, 500)</pre>
  <div class="warning">This is a simplified example. A real GPS navigator would also calculate heading angles for proper targeting.</div>
</section>

<section class="docs-section" id="ex-gyro">
  <h2>Example: Gyro Turns</h2>
  <p>Make precise turns using the gyro sensor instead of timed motor commands.</p>
  <pre>from pybricks.ev3devices import Motor, GyroSensor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
gyro = GyroSensor(Port.S3)

def gyro_turn(degrees, speed=80):
    """Turn precisely using gyro feedback."""
    gyro.reset_angle(0)
    if degrees > 0:
        robot.drive(0, speed)
        while gyro.angle() < degrees:
            wait(10)
    else:
        robot.drive(0, -speed)
        while gyro.angle() > degrees:
            wait(10)
    robot.stop()

# Drive a precise square
for i in range(4):
    robot.straight(300)
    gyro_turn(90)

print("Gyro square complete!")</pre>
  <div class="note">Gyro turns are more accurate than DriveBase.turn() because they use actual rotation feedback rather than wheel odometry.</div>
</section>

<section class="docs-section" id="ex-pen">
  <h2>Example: Drawing with Pen</h2>
  <p>Draw colorful geometric patterns on the ground.</p>
  <pre>from pybricks.ev3devices import Motor, Pen
from pybricks.parameters import Port
from pybricks.robotics import DriveBase
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
pen = Pen()

# Draw a star pattern
pen.setWidth(2.0)
pen.setColor(1.0, 0.8, 0.0)  # Gold color
pen.down()

for i in range(5):
    robot.straight(200)
    robot.turn(144)   # 144 degrees for 5-point star

pen.up()

# Move away and draw a circle approximation
robot.straight(100)
pen.setColor(0.0, 0.5, 1.0)  # Blue
pen.setWidth(1.0)
pen.down()

for i in range(36):
    robot.straight(15)
    robot.turn(10)

pen.up()
print("Drawing complete!")</pre>
</section>

<section class="docs-section" id="ex-led">
  <h2>Example: LED Signals</h2>
  <p>Use LED to signal robot state with different colors.</p>
  <pre>from pybricks.ev3devices import Motor, LED, UltrasonicSensor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
led = LED()
ultrasonic = UltrasonicSensor(Port.S2)

led.setRange(3.0)

while True:
    dist = ultrasonic.distance()

    if dist < 150:
        # Danger - red LED, stop
        led.setColor(255, 0, 0)
        led.on()
        robot.stop()
        robot.straight(-100)
        robot.turn(90)
    elif dist < 400:
        # Caution - yellow LED, slow
        led.setColor(255, 200, 0)
        led.on()
        robot.drive(80, 0)
    else:
        # Safe - green LED, full speed
        led.setColor(0, 255, 0)
        led.on()
        robot.drive(200, 0)

    wait(50)</pre>
</section>

<section class="docs-section" id="ex-display">
  <h2>Example: Display Dashboard</h2>
  <p>Use the Display to create a live dashboard showing robot status and sensor readings.</p>
  <pre>from pybricks.ev3devices import Motor, UltrasonicSensor, ColorSensor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase
from pybricks.tools import wait
from ev3dev2.sensor.virtual import Display

left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
ultrasonic = UltrasonicSensor(Port.S2)
color = ColorSensor(Port.S1)
display = Display('in3')

# Title with scrolling effect
display.set_color(0, 255, 255)  # Cyan
display.scroll_text(0, "MyTekOS Robot Dashboard   ", 40)

# Startup message
display.typewriter(1, "Systems online!", 12)
wait(2000)

display.set_color(0, 255, 0)  # Green

while True:
    dist = ultrasonic.distance()
    intensity = color.reflection()

    # Update dashboard lines
    display.text(1, "Dist: " + str(int(dist)) + " mm")
    display.text(2, "Light: " + str(intensity) + "%")

    # Status indicator
    if dist < 200:
        display.set_color(255, 0, 0)  # Red
        display.blink(3, "OBSTACLE!", 200, 200)
        robot.stop()
    else:
        display.set_color(0, 255, 0)  # Green
        display.text(3, "Status: OK")
        robot.drive(100, 0)

    display.text(4, "Speed: " + str(robot.speed()) + " mm/s")
    wait(100)</pre>
</section>

<section class="docs-section" id="ex-arm">
  <h2>Example: Arm Control</h2>
  <p>Control a motorized arm to pick up and place objects.</p>
  <pre>from pybricks.ev3devices import Motor, TouchSensor
from pybricks.parameters import Port, Stop
from pybricks.robotics import DriveBase
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
arm = Motor(Port.C)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
touch = TouchSensor(Port.S1)

# Lower arm to ground
arm.run_angle(200, -90, then=Stop.HOLD)
wait(500)

# Drive forward until touch sensor hits
while not touch.pressed():
    robot.drive(80, 0)
    wait(10)
robot.stop()

# Lift arm (grab object)
arm.run_angle(200, 180, then=Stop.HOLD)
wait(500)

# Back up and turn
robot.straight(-200)
robot.turn(180)

# Drive to drop zone
robot.straight(400)

# Lower arm (release object)
arm.run_angle(200, -180, then=Stop.COAST)

print("Object moved!")</pre>
</section>

<section class="docs-section" id="ex-claw">
  <h2>Example: Claw/Gripper</h2>
  <p>Use the claw actuator to grip, carry, and release objects. The claw grips objects marked as "Magnetic" in the World Builder when the jaws close around them.</p>
  <pre>from pybricks.ev3devices import Motor, UltrasonicSensor
from pybricks.parameters import Port, Stop
from pybricks.robotics import DriveBase
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
claw = Motor(Port.C)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
ultrasonic = UltrasonicSensor(Port.S2)

# Open claw fully
claw.run_angle(200, 45, then=Stop.HOLD)
wait(500)

# Drive forward until object is detected
while ultrasonic.distance() > 80:
    robot.drive(100, 0)
    wait(10)
robot.stop()

# Close claw to grip object (negative angle = closing)
claw.run_angle(200, -45, then=Stop.HOLD)
wait(500)

# Lift and carry (if claw is on an arm)
# arm.run_angle(200, 60, then=Stop.HOLD)

# Drive to drop zone
robot.straight(-200)
robot.turn(180)
robot.straight(300)

# Open claw to release
claw.run_angle(200, 45, then=Stop.COAST)
wait(500)

# Back away
robot.straight(-100)
print("Object delivered!")</pre>
  <div class="note">The claw automatically grips objects when the jaws close to within the grip threshold (default: 5&deg; from fully closed). Objects must be marked as "Magnetic" in the World Builder to be grippable.</div>

  <h3>World Setup for Grip Testing</h3>
  <p>To test the claw gripper, you need a grippable object in your world:</p>
  <ol>
    <li>Open the <strong>World Builder</strong> (World &gt; World Builder)</li>
    <li>Add a small box or cylinder (e.g. 2&times;2&times;2 cm)</li>
    <li>Check the <strong>"Magnetic"</strong> property in the object&rsquo;s settings &mdash; this makes it grippable by both the Magnet and Claw actuators</li>
    <li>Set a low mass (e.g. 5&ndash;20) so the object is easy to pick up</li>
    <li>Position the object in front of your robot where the jaws can reach it</li>
    <li>Save the world and refresh the simulator</li>
  </ol>

  <h3>Claw on an Arm (Pick and Place)</h3>
  <p>Mount a ClawActuator as a child component of an ArmActuator for full pick-and-place capability:</p>
  <pre>from pybricks.ev3devices import Motor
from pybricks.parameters import Port, Stop
from pybricks.robotics import DriveBase
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
arm = Motor(Port.C)      # Arm actuator
claw = Motor(Port.D)     # Claw mounted on arm
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)

# Lower arm and open claw
arm.run_angle(150, -60, then=Stop.HOLD)
claw.run_angle(200, 45, then=Stop.HOLD)
wait(300)

# Drive to object
robot.straight(200)

# Close claw (grips object)
claw.run_angle(200, -45, then=Stop.HOLD)
wait(500)

# Raise arm with object
arm.run_angle(150, 120, then=Stop.HOLD)
wait(300)

# Move to destination
robot.turn(90)
robot.straight(300)

# Lower arm and release
arm.run_angle(150, -60, then=Stop.HOLD)
wait(300)
claw.run_angle(200, 45, then=Stop.COAST)

print("Pick and place complete!")</pre>
</section>

<section class="docs-section" id="ex-paintball">
  <h2>Example: Paintball Launcher</h2>
  <p>Use the paintball actuator to shoot at targets detected by the ultrasonic sensor.</p>
  <pre>from pybricks.ev3devices import Motor, UltrasonicSensor
from pybricks.parameters import Port, Stop
from pybricks.robotics import DriveBase
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
launcher = Motor(Port.C)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
ultrasonic = UltrasonicSensor(Port.S2)

# Scan and shoot
robot.drive(0, 60)  # Rotate slowly to scan

while True:
    dist = ultrasonic.distance()

    if dist < 500:
        # Target detected! Stop and fire
        robot.stop()
        wait(200)

        # Fire launcher (quick motor pulse)
        launcher.run_angle(1000, 360, then=Stop.COAST)
        wait(500)

        # Resume scanning
        robot.drive(0, 60)

    wait(50)</pre>
</section>

<section class="docs-section" id="ex-multi">
  <h2>Example: Multi-Sensor Robot</h2>
  <p>A comprehensive example combining multiple sensors for intelligent navigation.</p>
  <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor, ColorSensor, UltrasonicSensor, GyroSensor, TouchSensor
from pybricks.parameters import Port, Color
from pybricks.robotics import DriveBase
from pybricks.tools import wait

ev3 = EV3Brick()
left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)

color = ColorSensor(Port.S1)
ultrasonic = UltrasonicSensor(Port.S2)
gyro = GyroSensor(Port.S3)
touch = TouchSensor(Port.S4)

STATE_DRIVE = 0
STATE_AVOID = 1
STATE_LINE = 2

state = STATE_DRIVE
gyro.reset_angle(0)

while True:
    # Check touch sensor (emergency stop)
    if touch.pressed():
        robot.stop()
        ev3.speaker.beep(200, 500)
        robot.straight(-200)
        robot.turn(180)
        continue

    # Check for obstacles
    dist = ultrasonic.distance()
    if dist < 200 and state != STATE_AVOID:
        state = STATE_AVOID
        robot.stop()

    # State machine
    if state == STATE_DRIVE:
        # Check if we've hit a line
        if color.reflection() < 20:
            state = STATE_LINE
        else:
            robot.drive(150, 0)

    elif state == STATE_AVOID:
        ev3.speaker.beep(600, 50)
        robot.straight(-100)
        robot.turn(90)
        state = STATE_DRIVE

    elif state == STATE_LINE:
        # Simple line following
        error = 50 - color.reflection()
        robot.drive(80, error * 1.5)
        # Leave line mode if surface is very light
        if color.reflection() > 80:
            state = STATE_DRIVE

    wait(20)</pre>
  <div class="note">This example uses a simple state machine pattern. Each state handles a different behavior, and sensor readings trigger state transitions.</div>
</section>

<!-- World Builder -->
<section class="docs-section" id="world-builder">
  <h2>World Builder Overview</h2>
  <p>The World Builder lets you create custom environments for your robot to navigate. Design arenas, obstacle courses, mazes, and challenge environments with 3D objects, textures, physics, and animations.</p>
  <h3>Opening the World Builder</h3>
  <p>From the main simulator, go to <strong>World &gt; World Builder</strong> to open the builder in a new window. Changes you make are saved as part of your robotics project.</p>
  <h3>Interface</h3>
  <ul>
    <li><strong>Header</strong> - File, World, and Snap menus, plus a Help button (?)</li>
    <li><strong>Objects Panel (left)</strong> - Lists all objects. Add, Clone, Delete, and Undo buttons</li>
    <li><strong>3D Viewport (center)</strong> - Interactive 3D view of your world</li>
    <li><strong>Settings Panel (right)</strong> - Configuration for the selected item</li>
    <li><strong>Ruler</strong> - Shows position and distance measurements</li>
  </ul>
  <h3>Camera Controls</h3>
  <ul>
    <li><strong>Left-click + drag</strong> - Rotate the camera</li>
    <li><strong>Right-click + drag</strong> - Pan the camera</li>
    <li><strong>Scroll wheel</strong> - Zoom in/out</li>
    <li><strong>Click an object</strong> - Select it for editing</li>
  </ul>
  <h3>File Menu</h3>
  <table>
    <tr><th>Option</th><th>Description</th></tr>
    <tr><td>New World</td><td>Start fresh with an empty world</td></tr>
    <tr><td>Save world to Server</td><td>Save to your MyTekOS project</td></tr>
    <tr><td>Load world from file</td><td>Import a world from a local JSON file</td></tr>
    <tr><td>Save world to file</td><td>Export the world as a JSON file</td></tr>
    <tr><td>Load object from file</td><td>Import a single object from JSON</td></tr>
    <tr><td>Save object to file</td><td>Export the selected object as JSON</td></tr>
  </table>
</section>

<section class="docs-section" id="wb-ground">
  <h2>Ground Settings</h2>
  <p>The ground is the base surface of your world. Select "Ground" in the objects list to configure it.</p>
  <table>
    <tr><th>Setting</th><th>Description</th></tr>
    <tr><td>Image</td><td>Select a built-in image or enter a custom URL. Built-in images include competition mats (FLL, WRO), grid patterns, and arena maps.</td></tr>
    <tr><td>Ground Type</td><td><strong>Box</strong> (flat, supports walls), <strong>Cylinder</strong> (round), or <strong>None</strong> (no ground)</td></tr>
    <tr><td>Image Scale</td><td>Scales the texture. When set to 2, each pixel equals 2mm.</td></tr>
    <tr><td>U Scale</td><td>Repeats the image horizontally (2 = image appears twice across)</td></tr>
    <tr><td>V Scale</td><td>Repeats the image vertically</td></tr>
    <tr><td>Ground Friction</td><td>Surface grip (higher values = more friction, default 1.0)</td></tr>
    <tr><td>Ground Restitution</td><td>Bounciness (higher = more bounce)</td></tr>
  </table>
  <h3>Walls</h3>
  <p>Walls create boundaries around the ground edge. Only available with Box ground type.</p>
  <table>
    <tr><th>Setting</th><th>Description</th></tr>
    <tr><td>Wall (on/off)</td><td>Enable or disable boundary walls</td></tr>
    <tr><td>Wall Height</td><td>Height of the walls (0.1 to 30 cm)</td></tr>
    <tr><td>Wall Thickness</td><td>Thickness of the walls (0.1 to 30 cm)</td></tr>
    <tr><td>Wall Color</td><td>Hex color code for wall appearance</td></tr>
    <tr><td>Friction / Restitution</td><td>Physics properties when objects contact walls</td></tr>
  </table>
  <h3>Timer</h3>
  <p>Add a timer for timed challenges. Modes: None, Count Up (from zero), or Count Down (from a set duration). When counting down, choose what happens when time runs out: continue running, stop the timer, or stop both timer and robot.</p>
  <h3>Robot Start Position</h3>
  <p>Set where the robot spawns (X, Y, Z coordinates from -200 to 200) and which direction it faces (rotation from -180 to 180 degrees).</p>
</section>

<section class="docs-section" id="wb-objects">
  <h2>World Objects</h2>
  <p>Click <strong>Add</strong> to place objects in your world.</p>
  <h3>Object Types</h3>
  <table>
    <tr><th>Type</th><th>Description</th></tr>
    <tr><td>Box</td><td>Rectangular block with width, height, and depth</td></tr>
    <tr><td>Cylinder</td><td>Cylindrical shape with radius and height</td></tr>
    <tr><td>Sphere</td><td>Ball with configurable radius</td></tr>
    <tr><td>Model</td><td>3D model from the built-in library</td></tr>
    <tr><td>Compound</td><td>Multiple shapes grouped into one physics body</td></tr>
    <tr><td>Hinge</td><td>Hinged joint between objects (doors, levers)</td></tr>
    <tr><td>Zone</td><td>Scoring/objective zone that detects robot entry or object placement (see <a href="#wb-zones">Scoring Zones</a>)</td></tr>
  </table>
  <h3>Common Properties</h3>
  <ul>
    <li><strong>Position</strong> (x, y, z) - Location in centimeters</li>
    <li><strong>Rotation</strong> (x, y, z) - Orientation in degrees</li>
    <li><strong>Size</strong> - Dimensions (width, height, depth or radius)</li>
    <li><strong>Color</strong> - Hex color code</li>
    <li><strong>Drop to Ground</strong> - Positions the object sitting on the ground surface</li>
    <li><strong>Magnetic</strong> - Can be picked up by a magnet actuator or gripped by a claw actuator</li>
    <li><strong>Receive/Cast Shadows</strong> - Visual shadow rendering</li>
  </ul>
  <h3>Sensor Detection</h3>
  <p>Control how robot sensors interact with each object:</p>
  <ul>
    <li><strong>Normal</strong> - Sensors detect the object normally</li>
    <li><strong>Invisible</strong> - Sensor rays pass through (default for physicsless objects)</li>
    <li><strong>Absorb</strong> - Detects the object but no reflection (appears as maximum distance)</li>
  </ul>
</section>

<section class="docs-section" id="wb-textures">
  <h2>Images &amp; Textures</h2>
  <p>Apply image textures to boxes, cylinders, spheres, and the ground.</p>
  <h3>Built-In Image Library</h3>
  <p>Click <strong>Select built-in image</strong> to browse textures organized by category:</p>
  <ul>
    <li><strong>Box</strong> - Letters (ABC), cardboard, caution strips, metal, wood</li>
    <li><strong>Cylinder</strong> - Bio drums, flammable, radioactive, steel, wheels</li>
    <li><strong>Sphere</strong> - Basketball, beach ball, planets (Earth, Mars, Jupiter, Saturn, etc.)</li>
    <li><strong>Ground</strong> - Grid patterns, FLL challenge mats, WRO competition maps, arena layouts</li>
    <li><strong>Robot</strong> - Robot body and orientation textures</li>
  </ul>
  <p>Use the filter dropdown and search box to find textures quickly.</p>
  <h3>Image Type (Box only)</h3>
  <table>
    <tr><th>Type</th><th>Effect</th></tr>
    <tr><td>None</td><td>No texture, solid color only</td></tr>
    <tr><td>Repeat on every face</td><td>Same image on all 6 faces</td></tr>
    <tr><td>Only on top face</td><td>Image on top, solid color elsewhere</td></tr>
    <tr><td>Only on front face</td><td>Image on front face only</td></tr>
    <tr><td>Map across all faces</td><td>Image mapped across faces (e.g., different letters per face)</td></tr>
  </table>
  <h3>Custom Image URLs</h3>
  <p>Enter a direct URL to any image. Note: most web hosts block cross-origin requests (CORS). Imgur URLs typically work.</p>
</section>

<section class="docs-section" id="wb-physics">
  <h2>Object Physics</h2>
  <p>Each object has physics settings that control its behavior during simulation.</p>
  <h3>Physics Modes</h3>
  <table>
    <tr><th>Mode</th><th>Mass</th><th>Use Case</th></tr>
    <tr><td>Fixed</td><td>0 (immovable)</td><td>Walls, obstacles, ramps</td></tr>
    <tr><td>Moveable</td><td>100 (default)</td><td>Pushable objects, balls, collectibles</td></tr>
    <tr><td>Physicsless</td><td>N/A</td><td>Visual decorations, markers, guidelines</td></tr>
    <tr><td>Custom</td><td>User-defined</td><td>Fine-tuned behavior</td></tr>
  </table>
  <h3>Custom Properties</h3>
  <table>
    <tr><th>Property</th><th>Default</th><th>Description</th></tr>
    <tr><td>Mass</td><td>100</td><td>Weight (0 = fixed/immovable)</td></tr>
    <tr><td>Friction</td><td>0.1</td><td>Surface grip (ground default: 1.0)</td></tr>
    <tr><td>Restitution</td><td>0</td><td>Bounciness</td></tr>
    <tr><td>Damp Linear</td><td>0</td><td>Reduces sliding movement</td></tr>
    <tr><td>Damp Angular</td><td>0</td><td>Reduces spinning</td></tr>
    <tr><td>Group</td><td>1</td><td>Physics collision group (bitmask)</td></tr>
    <tr><td>Mask</td><td>-1</td><td>Which groups this collides with (-1 = all)</td></tr>
  </table>
  <div class="tip"><strong>Tip:</strong> Use groups and masks to create objects that only interact with specific other objects. For example, a "ghost wall" that blocks the robot but not balls.</div>
</section>

<section class="docs-section" id="wb-animation">
  <h2>Object Animation</h2>
  <p>Animate objects to create moving platforms, conveyor belts, swinging obstacles, and more.</p>
  <h3>Setting Up Animation</h3>
  <ol>
    <li>Select an object and set <strong>Animation Mode</strong> to Loop or Alternate</li>
    <li>Position the object at its starting location</li>
    <li>In the Animation Keys section, set Time to 0 and click <strong>Add Key</strong></li>
    <li>Move the object to a new position</li>
    <li>Set a new Time value (in seconds) and click <strong>Add Key</strong></li>
    <li>Repeat for additional waypoints</li>
  </ol>
  <h3>Animation Modes</h3>
  <ul>
    <li><strong>Loop</strong> - Plays all keys in order, then jumps back to the start and repeats</li>
    <li><strong>Alternate</strong> - Plays forward then backward, creating smooth back-and-forth motion</li>
  </ul>
  <h3>Preview &amp; Runtime</h3>
  <ul>
    <li>Use <strong>World &gt; Animate</strong> to preview animations in the builder</li>
    <li>Check <strong>Restart Animation on Run</strong> to reset all animations when the simulation starts</li>
    <li>Animated objects with physics will push the robot and other moveable objects</li>
  </ul>
</section>

<section class="docs-section" id="wb-zones">
  <h2>Scoring Zones</h2>
  <p>Zones are semi-transparent 3D regions that detect when the robot enters or when objects are placed inside, awarding (or deducting) points. Use them to create objective-based challenges, scored courses, and timed competitions.</p>

  <h3>Adding a Zone</h3>
  <ol>
    <li>Click <strong>Add</strong> in the Objects panel</li>
    <li>Select <strong>Zone</strong> from the dropdown</li>
    <li>A green semi-transparent box appears in the world</li>
    <li>Position and resize it using the settings panel</li>
  </ol>
  <div class="tip"><strong>Note:</strong> Zones cannot be placed inside compounds or hinges. They exist as top-level objects only.</div>

  <h3>Zone Properties</h3>
  <table>
    <tr><th>Property</th><th>Description</th></tr>
    <tr><td>Position</td><td>X, Y, Z coordinates (-100 to 100)</td></tr>
    <tr><td>Rotation</td><td>X, Y, Z rotation in degrees (-180 to 180)</td></tr>
    <tr><td>Size</td><td>Width, depth, height of the zone (1 to 200)</td></tr>
    <tr><td>Color</td><td>Hex color with optional alpha. Use 8 characters for transparency, e.g. <code>#00ff0060</code> = green at 38% opacity. Last 2 digits control alpha (00=invisible, ff=solid).</td></tr>
    <tr><td>Label</td><td>Text displayed above the zone (optional)</td></tr>
    <tr><td>Show Label</td><td>Toggle label visibility. Labels are billboarded (always face the camera).</td></tr>
  </table>

  <h3>Trigger Types</h3>
  <table>
    <tr><th>Trigger</th><th>Condition</th><th>Use Case</th></tr>
    <tr><td>Robot Enters Zone</td><td>Any part of the robot body is inside the zone</td><td>Checkpoints, finish lines, waypoints</td></tr>
    <tr><td>Object Placed in Zone</td><td>An ungripped magnetic object is inside the zone</td><td>Delivery tasks, sorting challenges</td></tr>
    <tr><td>Object Stays in Zone</td><td>A magnetic object remains in the zone for the specified dwell time</td><td>Precision placement, parking challenges</td></tr>
  </table>
  <div class="tip"><strong>Tip:</strong> For "Object Placed" and "Object Stays" triggers, only magnetic objects are detected. Make sure to enable the <strong>Magnetic</strong> property on objects you want zones to detect. Objects being held by a claw or magnet actuator are ignored.</div>

  <h3>Scoring Settings</h3>
  <table>
    <tr><th>Setting</th><th>Default</th><th>Description</th></tr>
    <tr><td>Points</td><td>10</td><td>Points awarded when triggered. Use negative values for penalty zones (e.g. -5 for hazard areas).</td></tr>
    <tr><td>Repeatable</td><td>Off</td><td>When off, the zone scores only once per simulation run. When on, the zone can score repeatedly (with a 1-second cooldown between triggers).</td></tr>
    <tr><td>Dwell Time</td><td>0</td><td>Seconds the object must remain inside the zone before scoring. Only applies to the "Object Stays in Zone" trigger.</td></tr>
  </table>

  <h3>Score Threshold</h3>
  <p>When the total accumulated score reaches a threshold value, an automatic action can be triggered:</p>
  <table>
    <tr><th>Setting</th><th>Description</th></tr>
    <tr><td>Score Threshold</td><td>Total score that triggers the action. Set to 0 to disable.</td></tr>
    <tr><td>Score Threshold Action</td><td><strong>None</strong> - no action, <strong>Stop Robot</strong> - stops the simulation, <strong>Stop Timer</strong> - freezes the score counter</td></tr>
  </table>
  <div class="tip"><strong>Example:</strong> Set threshold to 30 with action "Stop Robot" to automatically end the simulation when the robot collects 30 points worth of objectives.</div>

  <h3>Score Display</h3>
  <p>When zones are present, a score overlay appears in the top-right corner during simulation. The display shows:</p>
  <ul>
    <li><span style="color:#00ff88">Green text</span> for positive scores</li>
    <li><span style="color:#ff4444">Red text</span> for negative scores</li>
  </ul>
  <p>The score resets to 0 each time the simulation starts. It coexists with the timer display if both are configured.</p>

  <h3>Visual Feedback</h3>
  <p>When a zone is triggered, it flashes briefly (its transparency pulses brighter) to provide visual confirmation that points were awarded.</p>

  <h3>Zone Behavior</h3>
  <ul>
    <li>Zones have <strong>no physics</strong> - the robot drives through them freely</li>
    <li>Zones are <strong>not detected by sensors</strong> (laser, ultrasonic, color)</li>
    <li>Zones can be selected, dragged, cloned, and deleted like any other object</li>
    <li>Zone data is saved/loaded as part of your world JSON</li>
    <li>Zones are visible in the builder and during simulation, but can be made nearly invisible using a low alpha value (e.g. <code>#00ff0010</code>)</li>
  </ul>

  <h3>Challenge Ideas</h3>
  <ul>
    <li><strong>Obstacle Course</strong> - Place zones as checkpoints along a path. Robot must visit each in order.</li>
    <li><strong>Delivery Challenge</strong> - Robot picks up magnetic objects and delivers them into scoring zones.</li>
    <li><strong>Speed Run</strong> - Combine a countdown timer with a score threshold. Robot must reach the target score before time runs out.</li>
    <li><strong>Penalty Course</strong> - Mix positive zones (goals) with negative zones (hazards). Robot must maximize score while avoiding penalties.</li>
    <li><strong>Precision Parking</strong> - Use "Object Stays" with a dwell time to require precise object placement.</li>
  </ul>
</section>

<section class="docs-section" id="wb-snap">
  <h2>Snap Grid</h2>
  <p>The Snap menu controls object alignment precision. Objects will snap to the nearest grid point when moved.</p>
  <table>
    <tr><th>Option</th><th>Grid Size</th><th>Best For</th></tr>
    <tr><td>No Snapping</td><td>Free movement</td><td>Fine-tuning positions</td></tr>
    <tr><td>0.2 cm</td><td>2mm</td><td>Precise detailed work</td></tr>
    <tr><td>Lego Technic</td><td>4mm (all axes)</td><td>Technic-compatible builds</td></tr>
    <tr><td>Lego</td><td>4mm x/y, 4.8mm z</td><td>Lego brick-compatible spacing</td></tr>
    <tr><td>0.5 cm</td><td>5mm</td><td>General building</td></tr>
    <tr><td>1 cm</td><td>10mm</td><td>Large-scale layouts, arenas</td></tr>
  </table>
  <p>The current snap setting is indicated with a checkmark (&#x2713;) in the Snap menu.</p>
</section>

<!-- Troubleshooting -->
<section class="docs-section" id="common-errors">
  <h2>Common Errors</h2>
  <h3>NameError: name 'Motor' is not defined</h3>
  <p>You forgot to import the class. Add the proper import at the top of your program:</p>
  <pre>from pybricks.ev3devices import Motor</pre>

  <h3>TypeError: Motor() takes at least 1 argument</h3>
  <p>You need to specify the port when creating a motor:</p>
  <pre>motor = Motor(Port.A)  # Correct
motor = Motor()         # Wrong - missing port</pre>

  <h3>Robot doesn't move</h3>
  <ul>
    <li>Check that port assignments in code match the Configurator settings</li>
    <li>Make sure the simulation is running (Play button pressed)</li>
    <li>Check the console for error messages</li>
    <li>Verify left/right motors aren't swapped</li>
  </ul>

  <h3>Robot turns in circles</h3>
  <ul>
    <li>Left and right motor ports may be swapped - try switching Port.A and Port.B</li>
    <li>One motor may have reversed direction - use <code>Direction.COUNTERCLOCKWISE</code></li>
  </ul>

  <h3>Sensor returns wrong values</h3>
  <ul>
    <li>Verify the sensor port in code matches the Configurator</li>
    <li>Check sensor positioning (color sensor should face down, ultrasonic forward)</li>
    <li>Open the Sensors panel to see live readings</li>
  </ul>

  <h3>Program freezes / hangs</h3>
  <ul>
    <li>Infinite loop without <code>wait()</code> - add <code>wait(10)</code> in your loop</li>
    <li>Blocking call that never completes - check <code>wait=True</code> conditions</li>
    <li>DriveBase waiting to reach a position it can't reach</li>
  </ul>
</section>

<section class="docs-section" id="debugging">
  <h2>Debugging with print()</h2>
  <p>Use <code>print()</code> statements to understand what your program is doing.</p>
  <pre># Print sensor values to understand readings
while True:
    ref = color.reflection()
    dist = ultrasonic.distance()
    angle = gyro.angle()
    print("Ref:", ref, "Dist:", dist, "Angle:", angle)
    wait(200)  # Don't print too fast</pre>
  <h3>Debugging Tips</h3>
  <ul>
    <li>Print sensor values before making decisions to verify they're reasonable</li>
    <li>Print state transitions to track program flow</li>
    <li>Add <code>wait()</code> after prints to slow output (too many prints can overwhelm the console)</li>
    <li>Use the Sensors panel (click the sensor icon in the simulator) for live readings without code changes</li>
  </ul>
</section>

<section class="docs-section" id="sensor-tips">
  <h2>Sensor Tips</h2>
  <h3>Color Sensor</h3>
  <ul>
    <li>Position 5-15mm above the surface for best readings</li>
    <li><code>reflection()</code> is more reliable than <code>color()</code> for line following</li>
    <li>Calibrate your threshold by printing values while manually moving over line and surface</li>
  </ul>
  <h3>Ultrasonic Sensor</h3>
  <ul>
    <li>Has a cone-shaped detection area (not a laser beam)</li>
    <li>Very close objects (&lt;30mm) may not be detected</li>
    <li>Angled surfaces may reflect sound away from the sensor</li>
    <li>LaserRangeSensor provides more precise point measurements</li>
  </ul>
  <h3>Gyro Sensor</h3>
  <ul>
    <li>Call <code>reset_angle(0)</code> before making a turn you want to measure</li>
    <li>The gyro measures cumulative rotation - it doesn't reset automatically</li>
    <li>Positive angle = clockwise rotation</li>
  </ul>
  <h3>General Tips</h3>
  <ul>
    <li>Always add <code>wait(10)</code> or more in sensor reading loops</li>
    <li>Check the Sensors panel to see what your sensors are reading in real-time</li>
    <li>Multiple sensors on the same port will conflict - use different ports</li>
  </ul>
</section>

<section class="docs-section" id="sensor-visualization">
  <h2>Sensor Visualization</h2>
  <p>The Sensor Visualization tool shows real-time overlays of what each sensor "sees" during simulation. This makes it much easier to understand sensor behavior and debug programs.</p>
  <h3>Enabling Sensor Visualization</h3>
  <p>Click the <strong>eye icon</strong> in the top-right of the Simulator panel (below the sensor readings icon). The icon turns cyan when active. Click again to toggle off.</p>
  <h3>What Each Sensor Shows</h3>
  <table>
    <tr><th>Sensor</th><th>Visual Overlay</th><th>What It Means</th></tr>
    <tr><td>Ultrasonic</td><td>Semi-transparent cyan cone</td><td>Shows the detection cone shape and range. The cone shrinks when an object is detected closer. A small sphere appears at the point where the sensor detects a surface.</td></tr>
    <tr><td>Color</td><td>Colored disc on the ground</td><td>Shows the exact spot the color sensor is reading. The disc color matches the RGB value the sensor is detecting.</td></tr>
    <tr><td>Laser Range</td><td>Thin red beam with dot</td><td>Shows the laser beam direction and where it hits. The beam shortens as the detected surface gets closer.</td></tr>
    <tr><td>Touch</td><td>Semi-transparent box</td><td>Shows the touch sensor's detection area. Turns green when the sensor is pressed, gray when released.</td></tr>
    <tr><td>Gyro</td><td>Yellow arrow on ground</td><td>Shows the current yaw heading as reported by the gyro. The arrow rotates as the robot turns.</td></tr>
  </table>
  <h3>Tips</h3>
  <ul>
    <li>The ultrasonic cone is capped at 50 units visually, even though the sensor can detect up to 255 units away</li>
    <li>The color sensor disc updates every few frames for performance - slight delay is normal</li>
    <li>All visualization meshes are invisible to sensors, so they won't interfere with your robot's readings</li>
    <li>Visualization survives scene resets - it will reappear after the robot is rebuilt</li>
    <li>Works with any robot configuration - it automatically finds all sensors on the robot</li>
  </ul>
  <h3>Common Debugging Scenarios</h3>
  <ul>
    <li><strong>"My ultrasonic sensor doesn't see the wall"</strong> - Enable visualization to check if the cone is pointing in the right direction. The sensor has a ~42-degree wide cone, not a laser beam.</li>
    <li><strong>"My color sensor reads wrong colors"</strong> - Check the disc position. If the sensor is too high or angled wrong, it may be reading the wrong spot on the ground.</li>
    <li><strong>"My touch sensor doesn't trigger"</strong> - Watch for the green flash. If the box never lights up, the object may not have a physics body, or it's not making contact with the sensor's collision area.</li>
    <li><strong>"My gyro reading is off"</strong> - The arrow shows the cumulative yaw since start/reset. If the arrow doesn't match your expectation, check whether you called <code>reset_angle(0)</code>.</li>
  </ul>
</section>

</main>
</div>

<!-- Mobile sidebar toggle -->
<button class="sidebar-toggle" aria-label="Toggle navigation">&#9776;</button>

<script src="docs.js?v=20260123"></script>
</body>
</html>
