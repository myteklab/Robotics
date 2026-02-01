// Robotics Simulator - In-App Help System

var helpSystem = (function() {
  var currentTopic = 'about';

  var topics = {
    about: {
      title: 'About',
      category: 'general',
      content: `
        <h4>About This Simulator</h4>
        <p>This robotics simulator is a modification and expansion of <strong>GearsBot</strong>, an open source robotics simulation project.</p>
        <p style="margin-top: 1.5em;"><a href="https://github.com/QuirkyCort/gears" target="_blank" style="color: #6c5ce7; font-weight: bold;">View GearsBot on GitHub</a></p>
        <p style="margin-top: 1.5em; font-size: 0.9em; color: #888;">Licensed under GNU General Public License v3.0</p>
      `
    },

    quickStart: {
      title: 'Quick Start Guide',
      category: 'general',
      content: `
        <h4>Getting Started in 5 Steps</h4>
        <h5>1. Choose or Build a Robot</h5>
        <p>Go to <strong>Robot &gt; Select Robot</strong> to pick a template, or open the <strong>Configurator</strong> from <strong>Robot &gt; Configurator</strong> to build your own.</p>
        <h5>2. Add Sensors</h5>
        <p>In the Configurator, click <strong>Add</strong> to add sensors like Color, Ultrasonic, or Gyro to your robot.</p>
        <h5>3. Write Your Code</h5>
        <p>Click the <strong>Python</strong> tab and write your control program. Use the PyBricks API to control motors and read sensors.</p>
        <h5>4. Run the Simulation</h5>
        <p>Click the <strong>Simulator</strong> tab, then press the <strong>Play</strong> button to run your code.</p>
        <h5>5. Iterate</h5>
        <p>Watch how your robot behaves, modify your code, and try again. Use <strong>Reset</strong> to return the robot to its starting position.</p>
        <div class="help-note">The console at the bottom of the simulator shows print() output and error messages.</div>
      `
    },

    components: {
      title: 'Components Overview',
      category: 'building',
      content: `
        <h4>Robot Components</h4>
        <p>Robots are built from components attached to a base body. Each component has a type, position, rotation, and type-specific options.</p>
        <h5>Component Categories</h5>
        <table>
          <tr><th>Category</th><th>Types</th><th>Purpose</th></tr>
          <tr><td>Blocks</td><td>Box, Cylinder, Sphere, Cone, Torus</td><td>Structural elements</td></tr>
          <tr><td>Sensors</td><td>Color, Ultrasonic, LaserRange, Gyro, GPS, Touch, Camera</td><td>Perceive environment</td></tr>
          <tr><td>Actuators</td><td>Arm, Swivel, Linear, Magnet, Paintball, Wheel</td><td>Move and interact</td></tr>
          <tr><td>Other</td><td>LED, Pen, WheelPassive, Decorative, Hardware</td><td>Visual, drawing, structure</td></tr>
        </table>
        <h5>Adding Components</h5>
        <p>In the Configurator, click <strong>Add</strong> to open the component dialog. Select a type and it will be added to your robot. Use the settings panel to adjust position, rotation, and options.</p>
        <div class="help-note">Components are positioned relative to the robot's center. Use the 3D view to see placement in real-time.</div>
      `
    },

    blocks: {
      title: 'Structural Blocks',
      category: 'building',
      content: `
        <h4>Structural Block Components</h4>
        <p>Blocks are the building pieces of your robot's body. They add physical mass and shape but have no electronic function.</p>
        <h5>Box</h5>
        <p>Rectangular block. Set width, height, and depth dimensions.</p>
        <h5>Cylinder</h5>
        <p>Cylindrical shape. Set radius and height. Good for axles, posts, and towers.</p>
        <h5>Sphere</h5>
        <p>Ball shape. Set radius. Useful for decorative elements or rounded bumpers.</p>
        <h5>Cone</h5>
        <p>Tapered shape. Set top radius, bottom radius, and height.</p>
        <h5>Torus</h5>
        <p>Donut shape. Set tube radius and ring radius.</p>
        <h5>Common Properties</h5>
        <ul>
          <li><strong>Position</strong> (x, y, z) - Location relative to robot center</li>
          <li><strong>Rotation</strong> (x, y, z) - Orientation in degrees</li>
          <li><strong>Color</strong> - Visual appearance (hex color code)</li>
          <li><strong>Mass</strong> - Weight of the component (affects physics)</li>
        </ul>
      `
    },

    sensors: {
      title: 'Sensors Overview',
      category: 'building',
      content: `
        <h4>Sensor Components</h4>
        <p>Sensors allow your robot to perceive its environment. Each sensor is assigned a port and can be read from Python code.</p>
        <table>
          <tr><th>Sensor</th><th>Port Type</th><th>Reads</th></tr>
          <tr><td>ColorSensor</td><td>S1-S20</td><td>Color, reflection, RGB values</td></tr>
          <tr><td>UltrasonicSensor</td><td>S1-S20</td><td>Distance to objects (mm)</td></tr>
          <tr><td>LaserRangeSensor</td><td>S1-S20</td><td>Precise distance (laser)</td></tr>
          <tr><td>GyroSensor</td><td>S1-S20</td><td>Rotation angle and rate</td></tr>
          <tr><td>GPSSensor</td><td>S1-S20</td><td>X, Y position and altitude</td></tr>
          <tr><td>TouchSensor</td><td>S1-S20</td><td>Pressed (true/false)</td></tr>
          <tr><td>CameraSensor</td><td>S1-S20</td><td>Activates visual overlay</td></tr>
        </table>
        <div class="help-warning">GPSSensor and CameraSensor are virtual-only devices. They don't exist on real EV3 hardware.</div>
      `
    },

    actuators: {
      title: 'Actuators Overview',
      category: 'building',
      content: `
        <h4>Actuator Components</h4>
        <p>Actuators let your robot move and interact with the world. Motors are assigned letter ports (A-T).</p>
        <table>
          <tr><th>Actuator</th><th>Port Type</th><th>Function</th></tr>
          <tr><td>Wheel</td><td>A-T</td><td>Driven wheel for movement</td></tr>
          <tr><td>Arm</td><td>A-T</td><td>Rotating arm joint</td></tr>
          <tr><td>Swivel</td><td>A-T</td><td>Rotating platform</td></tr>
          <tr><td>Linear</td><td>A-T</td><td>Linear push/pull actuator</td></tr>
          <tr><td>Magnet</td><td>A-T</td><td>Electromagnetic gripper</td></tr>
          <tr><td>Paintball</td><td>A-T</td><td>Launches projectiles</td></tr>
        </table>
        <h5>Wheels</h5>
        <p>Set wheel radius and width. The robot needs at least two driven wheels to use DriveBase. Assign left and right wheels to different motor ports.</p>
        <div class="help-note">Use WheelPassive (under Other Parts) for caster wheels that don't need motors.</div>
      `
    },

    otherParts: {
      title: 'Other Parts',
      category: 'building',
      content: `
        <h4>Other Component Types</h4>
        <h5>Display</h5>
        <p>A simulated screen that can show text and numbers. Matches EV3/Spike Prime displays with 5 lines of text. Control via Python to output sensor readings, debug info, or messages.</p>
        <h5>LED</h5>
        <p>A light-emitting component. Can be turned on/off and change color from Python.</p>
        <h5>Pen</h5>
        <p>Draws lines on the ground as the robot moves. Set color and width from code. Great for drawing patterns.</p>
        <h5>WheelPassive</h5>
        <p>A free-spinning wheel (no motor). Used as a caster/support wheel that rolls freely.</p>
        <h5>Decorative</h5>
        <p>Visual-only elements with no physics interaction. Custom meshes or shapes for appearance.</p>
        <h5>Hardware</h5>
        <p>Additional structural elements like mounting brackets, plates, or frames.</p>
      `
    },

    displayComponent: {
      title: 'Display Component',
      category: 'python',
      content: `
        <h4>Display Component</h4>
        <p>The Display component simulates a small LCD screen on your robot. It has 5 lines of text (0-4) and can show text, numbers, or sensor readings.</p>
        <h5>Adding a Display</h5>
        <p>In the Configurator, go to <strong>Add &gt; Others &gt; Display</strong>. Position it on your robot where you want the screen to appear.</p>
        <h5>Python API</h5>
        <pre>from ev3dev2.sensor.virtual import Display

# Initialize display on sensor port (e.g., 'in1')
display = Display('in1')

# Show text on a specific line (0-4)
display.text(0, "Hello World!")
display.text(1, "Line 2 here")

# Show sensor readings
display.text(2, "Distance: " + str(distance))

# Clear all lines
display.clear()

# Clear a specific line
display.clear(1)

# Change font size: 'small', 'medium', 'large'
display.set_font('large')

# Change text color (RGB)
display.set_color(255, 255, 0)  # Yellow

# ANIMATION EFFECTS:

# Scrolling marquee text (speed = pixels/second)
display.scroll_text(0, "Breaking News: Robot wins competition!", 50)

# Typewriter effect (speed = characters/second)
display.typewriter(1, "System initializing...", 10)

# Blinking text (on_time, off_time in milliseconds)
display.blink(2, "WARNING!", 500, 500)

# Stop animation on a line
display.stop_animation(0)</pre>
        <h5>Display Options (Configurator)</h5>
        <ul>
          <li><strong>textColor</strong> - Text color as hex (default: 00FF00 green)</li>
          <li><strong>backgroundColor</strong> - Screen background color (default: 1A1A2E dark)</li>
          <li><strong>scale</strong> - Size of the display component</li>
        </ul>
        <h5>Sensor Panel</h5>
        <p>When the simulation runs, the sensor panel shows a real-time copy of what's on the display. Click the sensors button (📊) in the top right to open the panel.</p>
        <div class="help-note">The Display uses a sensor port (in1, in2...) just like sensors, but it's an output device for showing information.</div>
      `
    },

    ports: {
      title: 'Port Assignments',
      category: 'building',
      content: `
        <h4>How Ports Work</h4>
        <p>Each motor and sensor must be assigned a port. Ports connect hardware to your Python code.</p>
        <h5>Motor Ports (A-T)</h5>
        <p>Used for wheels and actuators. In code: <code>Port.A</code>, <code>Port.B</code>, etc.</p>
        <pre>left_motor = Motor(Port.A)
right_motor = Motor(Port.B)
arm_motor = Motor(Port.C)</pre>
        <h5>Sensor Ports (S1-S20)</h5>
        <p>Used for all sensors. In code: <code>Port.S1</code>, <code>Port.S2</code>, etc.</p>
        <pre>color = ColorSensor(Port.S1)
ultrasonic = UltrasonicSensor(Port.S2)
gyro = GyroSensor(Port.S3)</pre>
        <h5>Auto-Assignment</h5>
        <p>When you add components in the Configurator, ports are automatically assigned in order. You can change them in the component settings.</p>
        <div class="help-warning">Make sure your Python code uses the same port letters/numbers as set in the Configurator!</div>
      `
    },

    pythonOverview: {
      title: 'Python API Overview',
      category: 'python',
      content: `
        <h4>Choosing Your Python API</h4>
        <p>The simulator supports two Python APIs. Select from the <strong>Python</strong> menu.</p>
        <h5>PyBricks (Recommended)</h5>
        <p>The primary API, based on the real PyBricks MicroPython library for EV3/Spike.</p>
        <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor, ColorSensor, UltrasonicSensor, GyroSensor, TouchSensor
from pybricks.parameters import Port, Stop, Direction, Color, Button
from pybricks.robotics import DriveBase
from pybricks.tools import wait</pre>
        <h5>EV3dev2 (Alternative)</h5>
        <p>An older API based on the ev3dev2 Python library. Uses different class names and speed specifications.</p>
        <pre>from ev3dev2.motor import LargeMotor, MoveSteering, SpeedPercent
from ev3dev2.sensor.lego import ColorSensor, UltrasonicSensor</pre>
        <div class="help-note">New users should use PyBricks. It has simpler syntax and more consistent behavior.</div>
      `
    },

    motors: {
      title: 'Motor API',
      category: 'python',
      content: `
        <h4>Motor Class (PyBricks)</h4>
        <pre>from pybricks.ev3devices import Motor
from pybricks.parameters import Port, Stop, Direction

motor = Motor(Port.A)</pre>
        <h5>Movement Methods</h5>
        <table>
          <tr><th>Method</th><th>Description</th></tr>
          <tr><td><code>run(speed)</code></td><td>Run continuously at speed (deg/s)</td></tr>
          <tr><td><code>run_time(speed, time)</code></td><td>Run for time (ms), then stop</td></tr>
          <tr><td><code>run_angle(speed, angle)</code></td><td>Run for a specific angle (degrees)</td></tr>
          <tr><td><code>run_target(speed, target)</code></td><td>Run to absolute angle position</td></tr>
          <tr><td><code>stop()</code></td><td>Coast to stop (no braking)</td></tr>
          <tr><td><code>brake()</code></td><td>Apply braking force</td></tr>
          <tr><td><code>hold()</code></td><td>Actively hold current position</td></tr>
          <tr><td><code>dc(duty)</code></td><td>Set duty cycle (-100 to 100)</td></tr>
        </table>
        <h5>Reading Methods</h5>
        <table>
          <tr><th>Method</th><th>Returns</th></tr>
          <tr><td><code>speed()</code></td><td>Current speed in deg/s</td></tr>
          <tr><td><code>angle()</code></td><td>Current angle in degrees</td></tr>
          <tr><td><code>reset_angle(angle)</code></td><td>Reset angle counter</td></tr>
        </table>
        <h5>Parameters</h5>
        <ul>
          <li><code>then=Stop.HOLD</code> - What to do after: Stop.HOLD, Stop.BRAKE, Stop.COAST</li>
          <li><code>wait=True</code> - Block until motion completes (True/False)</li>
        </ul>
        <pre># Example: Run motor for 2 seconds at 300 deg/s
motor.run_time(300, 2000)

# Run motor 360 degrees then hold position
motor.run_angle(500, 360, then=Stop.HOLD)</pre>
      `
    },

    driveBase: {
      title: 'DriveBase API',
      category: 'python',
      content: `
        <h4>DriveBase Class (PyBricks)</h4>
        <p>Controls two motors together for differential drive robots.</p>
        <pre>from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase

left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)</pre>
        <h5>Movement Methods</h5>
        <table>
          <tr><th>Method</th><th>Description</th></tr>
          <tr><td><code>straight(distance)</code></td><td>Drive straight (mm). Negative = backward</td></tr>
          <tr><td><code>turn(angle)</code></td><td>Turn in place (degrees). Positive = right</td></tr>
          <tr><td><code>drive(speed, turn_rate)</code></td><td>Continuous drive (mm/s, deg/s)</td></tr>
          <tr><td><code>stop()</code></td><td>Stop both motors</td></tr>
        </table>
        <h5>Reading Methods</h5>
        <table>
          <tr><th>Method</th><th>Returns</th></tr>
          <tr><td><code>distance()</code></td><td>Total distance driven (mm)</td></tr>
          <tr><td><code>angle()</code></td><td>Total angle turned (degrees)</td></tr>
          <tr><td><code>state()</code></td><td>(distance, speed, angle, turn_rate)</td></tr>
          <tr><td><code>reset()</code></td><td>Reset distance and angle to 0</td></tr>
        </table>
        <h5>Settings</h5>
        <pre># Set speeds: straight_speed, straight_accel, turn_rate, turn_accel
robot.settings(200, 400, 90, 180)

# Read current settings
speed, accel, turn, turn_accel = robot.settings()</pre>
        <h5>Constructor Parameters</h5>
        <ul>
          <li><code>wheel_diameter</code> - Diameter of drive wheels in mm</li>
          <li><code>axle_track</code> - Distance between wheel centers in mm</li>
        </ul>
      `
    },

    colorSensor: {
      title: 'Color Sensor',
      category: 'python',
      content: `
        <h4>ColorSensor (PyBricks)</h4>
        <pre>from pybricks.ev3devices import ColorSensor
from pybricks.parameters import Port, Color

color_sensor = ColorSensor(Port.S1)</pre>
        <h5>Methods</h5>
        <table>
          <tr><th>Method</th><th>Returns</th></tr>
          <tr><td><code>color()</code></td><td>Detected color constant (Color.RED, etc.) or None</td></tr>
          <tr><td><code>reflection()</code></td><td>Reflected light intensity (0-100)</td></tr>
          <tr><td><code>ambient()</code></td><td>Ambient light intensity (0-100)</td></tr>
          <tr><td><code>rgb()</code></td><td>Tuple of (R, G, B) values (0-100 each)</td></tr>
        </table>
        <h5>Color Constants</h5>
        <p>Colors returned by <code>color()</code>:</p>
        <ul>
          <li>Color.BLACK, Color.BLUE, Color.GREEN, Color.YELLOW</li>
          <li>Color.RED, Color.WHITE, Color.BROWN, Color.ORANGE, Color.PURPLE</li>
          <li>None (no color detected)</li>
        </ul>
        <pre># Line following example
while True:
    if color_sensor.reflection() < 30:
        # On the line (dark)
        robot.drive(100, -30)
    else:
        # Off the line (light)
        robot.drive(100, 30)</pre>
      `
    },

    ultrasonicSensor: {
      title: 'Ultrasonic Sensor',
      category: 'python',
      content: `
        <h4>UltrasonicSensor (PyBricks)</h4>
        <pre>from pybricks.ev3devices import UltrasonicSensor
from pybricks.parameters import Port

ultrasonic = UltrasonicSensor(Port.S2)</pre>
        <h5>Methods</h5>
        <table>
          <tr><th>Method</th><th>Returns</th></tr>
          <tr><td><code>distance()</code></td><td>Distance to nearest object in mm</td></tr>
        </table>
        <div class="help-note">The sensor returns distance in millimeters. Divide by 10 for centimeters.</div>
        <pre># Obstacle avoidance
while True:
    dist = ultrasonic.distance()
    if dist < 200:  # Object within 200mm
        robot.turn(90)   # Turn right 90 degrees
    else:
        robot.drive(150, 0)  # Drive forward</pre>
      `
    },

    gyroSensor: {
      title: 'Gyro Sensor',
      category: 'python',
      content: `
        <h4>GyroSensor (PyBricks)</h4>
        <pre>from pybricks.ev3devices import GyroSensor
from pybricks.parameters import Port

gyro = GyroSensor(Port.S3)</pre>
        <h5>Methods</h5>
        <table>
          <tr><th>Method</th><th>Returns</th></tr>
          <tr><td><code>angle()</code></td><td>Cumulative rotation angle (degrees)</td></tr>
          <tr><td><code>speed()</code></td><td>Current rotation rate (deg/s)</td></tr>
          <tr><td><code>reset_angle(angle)</code></td><td>Set angle to a specific value</td></tr>
        </table>
        <pre># Turn exactly 90 degrees using gyro
gyro.reset_angle(0)
robot.drive(0, 80)  # Start turning right
while gyro.angle() < 90:
    pass
robot.stop()</pre>
        <div class="help-note">The gyro measures yaw rotation (turning). It does not measure tilt or roll.</div>
      `
    },

    gpsSensor: {
      title: 'GPS Sensor',
      category: 'python',
      content: `
        <h4>GPSSensor (PyBricks - Virtual Only)</h4>
        <pre>from pybricks.ev3devices import GPSSensor
from pybricks.parameters import Port

gps = GPSSensor(Port.S4)</pre>
        <h5>Properties</h5>
        <table>
          <tr><th>Property</th><th>Returns</th></tr>
          <tr><td><code>position</code></td><td>Tuple (x, y, altitude)</td></tr>
          <tr><td><code>x</code></td><td>X position in world units</td></tr>
          <tr><td><code>y</code></td><td>Y position in world units</td></tr>
          <tr><td><code>altitude</code></td><td>Height above ground</td></tr>
        </table>
        <div class="help-warning">GPSSensor is a virtual device for the simulator only. It does not exist on real EV3 hardware.</div>
        <pre># Navigate to a target position
import math

target_x, target_y = 100, 50
while True:
    dx = target_x - gps.x
    dy = target_y - gps.y
    dist = math.sqrt(dx*dx + dy*dy)
    if dist < 5:
        robot.stop()
        break
    robot.drive(150, 0)</pre>
      `
    },

    touchSensor: {
      title: 'Touch Sensor',
      category: 'python',
      content: `
        <h4>TouchSensor (PyBricks)</h4>
        <pre>from pybricks.ev3devices import TouchSensor
from pybricks.parameters import Port

touch = TouchSensor(Port.S1)</pre>
        <h5>Methods</h5>
        <table>
          <tr><th>Method</th><th>Returns</th></tr>
          <tr><td><code>pressed()</code></td><td>True if sensor is pressed, False otherwise</td></tr>
        </table>
        <pre># Wait until bumper is pressed, then back up
while not touch.pressed():
    robot.drive(100, 0)
robot.straight(-200)
robot.turn(90)</pre>
      `
    },

    cameraSensor: {
      title: 'Camera Sensor',
      category: 'python',
      content: `
        <h4>CameraSensor (PyBricks - Virtual Only)</h4>
        <pre>from pybricks.ev3devices import CameraSensor
from pybricks.parameters import Port

camera = CameraSensor(Port.S5)</pre>
        <h5>Methods</h5>
        <table>
          <tr><th>Method</th><th>Returns</th></tr>
          <tr><td><code>activate()</code></td><td>Turn camera on (shows camera view overlay)</td></tr>
          <tr><td><code>deactivate()</code></td><td>Turn camera off</td></tr>
        </table>
        <div class="help-warning">CameraSensor is a virtual device for the simulator only. It provides a first-person camera view but doesn't return image data for processing.</div>
      `
    },

    penDevice: {
      title: 'Pen Device',
      category: 'python',
      content: `
        <h4>Pen (PyBricks - Virtual Only)</h4>
        <pre>from pybricks.ev3devices import Pen

pen = Pen()</pre>
        <h5>Methods</h5>
        <table>
          <tr><th>Method</th><th>Description</th></tr>
          <tr><td><code>down()</code></td><td>Lower pen to start drawing</td></tr>
          <tr><td><code>up()</code></td><td>Raise pen to stop drawing</td></tr>
          <tr><td><code>setColor(r, g, b)</code></td><td>Set pen color (values 0.0-1.0)</td></tr>
          <tr><td><code>setWidth(width)</code></td><td>Set line width (default 1.0)</td></tr>
        </table>
        <pre># Draw a red square
pen.setColor(1.0, 0.0, 0.0)
pen.setWidth(2.0)
pen.down()
for i in range(4):
    robot.straight(200)
    robot.turn(90)
pen.up()</pre>
        <div class="help-note">Color values use 0.0-1.0 range, not 0-255. For example, (1.0, 0.5, 0.0) is orange.</div>
      `
    },

    ledDevice: {
      title: 'LED Device',
      category: 'python',
      content: `
        <h4>LED (PyBricks - Virtual Only)</h4>
        <pre>from pybricks.ev3devices import LED

led = LED()</pre>
        <h5>Methods</h5>
        <table>
          <tr><th>Method</th><th>Description</th></tr>
          <tr><td><code>on()</code></td><td>Turn LED on</td></tr>
          <tr><td><code>off()</code></td><td>Turn LED off</td></tr>
          <tr><td><code>setColor(r, g, b)</code></td><td>Set LED color (values 0-255)</td></tr>
          <tr><td><code>setRange(range)</code></td><td>Set light radius/range</td></tr>
        </table>
        <pre># Flash LED red 5 times
led.setColor(255, 0, 0)
for i in range(5):
    led.on()
    wait(500)
    led.off()
    wait(500)</pre>
      `
    },

    utilities: {
      title: 'Utilities',
      category: 'python',
      content: `
        <h4>Utility Functions</h4>
        <h5>wait(ms)</h5>
        <p>Pause execution for a specified number of milliseconds.</p>
        <pre>from pybricks.tools import wait

wait(1000)  # Wait 1 second</pre>
        <h5>EV3Brick Speaker</h5>
        <pre>from pybricks.hubs import EV3Brick
ev3 = EV3Brick()

ev3.speaker.beep(500, 200)     # Beep at 500Hz for 200ms
ev3.speaker.say("Hello")       # Text-to-speech
ev3.speaker.set_volume(50)     # Set volume (0-100)</pre>
        <h5>EV3Brick Buttons</h5>
        <pre>from pybricks.parameters import Button

pressed = ev3.buttons.pressed()
if Button.CENTER in pressed:
    print("Center button pressed!")</pre>
        <p>Button constants: <code>Button.UP</code>, <code>Button.DOWN</code>, <code>Button.LEFT</code>, <code>Button.RIGHT</code>, <code>Button.CENTER</code></p>
      `
    },

    simulator: {
      title: 'Using the Simulator',
      category: 'general',
      content: `
        <h4>Simulator Controls</h4>
        <h5>Toolbar Buttons</h5>
        <ul>
          <li><strong>Play</strong> - Start running your Python code</li>
          <li><strong>Reset</strong> - Return robot to starting position</li>
          <li><strong>Sensors</strong> - Show/hide sensor readings panel</li>
        </ul>
        <h5>Camera Controls</h5>
        <ul>
          <li><strong>Follow</strong> - Camera follows the robot</li>
          <li><strong>Top</strong> - Bird's-eye view looking down</li>
          <li><strong>Arc</strong> - Orbit around the robot (drag to rotate)</li>
          <li><strong>Reset Camera</strong> - Return to default view</li>
        </ul>
        <h5>Other Controls</h5>
        <ul>
          <li><strong>Ruler</strong> - Measure distances in the world</li>
          <li><strong>Joystick</strong> - Manual control of the robot</li>
          <li><strong>Lighting</strong> - Adjust sun, ambient light, and shadows</li>
        </ul>
        <h5>Console</h5>
        <p>Click the bottom bar to expand the console. Shows <code>print()</code> output and error messages from your code.</p>
      `
    },

    exampleSquare: {
      title: 'Example: Drive a Square',
      category: 'examples',
      content: `
        <h4>Drive in a Square</h4>
        <p>This example makes the robot drive in a square pattern using DriveBase.</p>
        <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase

ev3 = EV3Brick()
left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)

# Drive in a square (4 sides)
for i in range(4):
    robot.straight(300)   # Forward 300mm
    robot.turn(90)        # Turn right 90 degrees

ev3.speaker.beep()</pre>
        <div class="help-note">Adjust wheel_diameter and axle_track to match your robot's actual wheel size and spacing.</div>
      `
    },

    exampleLine: {
      title: 'Example: Line Following',
      category: 'examples',
      content: `
        <h4>Line Following</h4>
        <p>Follow a dark line on a light surface using a color sensor and proportional control.</p>
        <pre>from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor, ColorSensor
from pybricks.parameters import Port
from pybricks.robotics import DriveBase

ev3 = EV3Brick()
left = Motor(Port.A)
right = Motor(Port.B)
robot = DriveBase(left, right, wheel_diameter=56, axle_track=120)
color = ColorSensor(Port.S1)

# Target reflection value (between line and background)
target = 50
# Proportional gain
gain = 1.5
# Base speed
speed = 100

while True:
    error = target - color.reflection()
    turn = gain * error
    robot.drive(speed, turn)</pre>
        <div class="help-note">Use the "Line Following" world for testing. Adjust the target value based on your line color.</div>
      `
    },

    exampleObstacle: {
      title: 'Example: Obstacle Avoidance',
      category: 'examples',
      content: `
        <h4>Obstacle Avoidance</h4>
        <p>Use an ultrasonic sensor to detect and avoid obstacles.</p>
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
        # Too close! Back up and turn
        robot.stop()
        robot.straight(-100)
        robot.turn(90)
    elif distance < 300:
        # Getting close, slow down and veer
        robot.drive(80, 30)
    else:
        # Clear path, drive forward
        robot.drive(200, 0)

    wait(50)</pre>
      `
    },

    exampleGPS: {
      title: 'Example: GPS Navigation',
      category: 'examples',
      content: `
        <h4>GPS Navigation</h4>
        <p>Navigate to waypoints using the GPS sensor.</p>
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

# Define waypoints to visit
waypoints = [(50, 50), (50, -50), (-50, -50), (-50, 50)]

for target_x, target_y in waypoints:
    while True:
        dx = target_x - gps.x
        dy = target_y - gps.y
        dist = math.sqrt(dx*dx + dy*dy)

        if dist < 10:
            robot.stop()
            ev3.speaker.beep()
            wait(500)
            break

        # Simple drive toward target
        robot.drive(min(dist * 2, 200), 0)
        wait(50)

print("All waypoints reached!")</pre>
        <div class="help-warning">GPS is virtual-only. This code won't work on real EV3 hardware.</div>
      `
    }
  };

  // Category groupings for the topic strip
  var categories = {
    general: { label: 'General', topics: ['about', 'quickStart', 'simulator'] },
    building: { label: 'Building', topics: ['components', 'blocks', 'sensors', 'actuators', 'otherParts', 'ports'] },
    python: { label: 'Python API', topics: ['pythonOverview', 'motors', 'driveBase', 'colorSensor', 'ultrasonicSensor', 'gyroSensor', 'gpsSensor', 'touchSensor', 'cameraSensor', 'penDevice', 'ledDevice', 'utilities'] },
    examples: { label: 'Examples', topics: ['exampleSquare', 'exampleLine', 'exampleObstacle', 'exampleGPS'] }
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

    var overlay = document.getElementById('helpOverlay');
    if (!overlay) return;

    // Update title
    var titleEl = overlay.querySelector('.help-modal-header h3');
    titleEl.textContent = topics[topicId].title;

    // Update topic strip
    var strip = overlay.querySelector('.help-topics-strip');
    strip.innerHTML = '';
    var related = getRelatedTopics(topicId);
    related.forEach(function(tid) {
      var btn = document.createElement('button');
      btn.className = 'help-topic-btn' + (tid === topicId ? ' active' : '');
      btn.textContent = topics[tid].title;
      btn.onclick = function() { showHelp(tid); };
      strip.appendChild(btn);
    });

    // Update content
    var content = overlay.querySelector('.help-modal-content');
    content.innerHTML = topics[topicId].content;
    content.scrollTop = 0;

    // Show overlay
    overlay.classList.add('active');
  }

  function closeHelp() {
    var overlay = document.getElementById('helpOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  function showHelpForComponent(componentType) {
    var typeMap = {
      'Box': 'blocks',
      'Cylinder': 'blocks',
      'Sphere': 'blocks',
      'Cone': 'blocks',
      'Torus': 'blocks',
      'ColorSensor': 'colorSensor',
      'UltrasonicSensor': 'ultrasonicSensor',
      'LaserRangeSensor': 'ultrasonicSensor',
      'GyroSensor': 'gyroSensor',
      'GPSSensor': 'gpsSensor',
      'TouchSensor': 'touchSensor',
      'CameraSensor': 'cameraSensor',
      'Wheel': 'actuators',
      'Arm': 'actuators',
      'Swivel': 'actuators',
      'Linear': 'actuators',
      'Magnet': 'actuators',
      'Paintball': 'actuators',
      'LED': 'ledDevice',
      'Pen': 'penDevice',
      'WheelPassive': 'otherParts',
      'Decorative': 'otherParts',
      'Hardware': 'otherParts'
    };
    var topic = typeMap[componentType] || 'components';
    showHelp(topic);
  }

  // Get all topic IDs for menu building
  function getMenuItems() {
    return [
      { label: '--- General ---', separator: true },
      { id: 'about', label: 'About' },
      { id: 'quickStart', label: 'Quick Start Guide' },
      { id: 'simulator', label: 'Simulator Controls' },
      { label: '--- Building ---', separator: true },
      { id: 'components', label: 'Components Overview' },
      { id: 'ports', label: 'Port Assignments' },
      { label: '--- Python API ---', separator: true },
      { id: 'pythonOverview', label: 'Python API Overview' },
      { id: 'motors', label: 'Motor' },
      { id: 'driveBase', label: 'DriveBase' },
      { id: 'colorSensor', label: 'ColorSensor' },
      { id: 'ultrasonicSensor', label: 'UltrasonicSensor' },
      { id: 'gyroSensor', label: 'GyroSensor' },
      { id: 'gpsSensor', label: 'GPSSensor' },
      { id: 'touchSensor', label: 'TouchSensor' },
      { id: 'penDevice', label: 'Pen' },
      { id: 'ledDevice', label: 'LED' },
      { id: 'utilities', label: 'Utilities (wait, speaker)' },
      { label: '--- Examples ---', separator: true },
      { id: 'exampleSquare', label: 'Drive a Square' },
      { id: 'exampleLine', label: 'Line Following' },
      { id: 'exampleObstacle', label: 'Obstacle Avoidance' },
      { id: 'exampleGPS', label: 'GPS Navigation' }
    ];
  }

  return {
    showHelp: showHelp,
    closeHelp: closeHelp,
    showHelpForComponent: showHelpForComponent,
    getMenuItems: getMenuItems,
    topics: topics
  };
})();
