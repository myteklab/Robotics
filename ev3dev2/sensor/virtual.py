import simPython, time

# Needed to prevent loops from locking up the javascript thread
SENSOR_DELAY = 0.001

class GPSSensor:
  _DRIVER_NAME = 'virtual-gps'

  def __init__(self, address=None):
    self.sensor = simPython.GPSSensor(address)

  @property
  def position(self):
    time.sleep(SENSOR_DELAY)
    pos = self.sensor.position()
    return (pos[0], pos[2], pos[1])

  @property
  def x(self):
    return self.position[0]

  @property
  def y(self):
    return self.position[1]

  @property
  def altitude(self):
    return self.position[2]

class ObjectTracker:
  _DRIVER_NAME = 'virtual-objecttracker'

  def __init__(self,address=None):
    self.sensor = simPython.ObjectTracker(address)

  def position(self,name):
    time.sleep(SENSOR_DELAY)
    pos = self.sensor.position(name)
    if not pos is None:
      return (pos[0],pos[2],pos[1])
    return None

  def velocity(self,name):
    time.sleep(SENSOR_DELAY)
    vel = self.sensor.velocity(name)
    if not vel is None:
      return (vel[0],vel[2],vel[1])
    return None

  def x(self,name):
    pos =  self.position(name)
    if pos is None:
      return None
    return pos[0]

  def y(self,name):
    pos = self.position(name)
    if pos is None:
      return None
    return pos[1]

  def altitude(self,name):
    pos = self.position(name)
    if pos is None:
      return None
    return pos[2]

  def vx(self,name):
    vel = self.velocity(name)
    if vel is None:
      return None
    return vel[0]

  def vy(self,name):
    vel = self.velocity(name)
    if vel is None:
      return None
    return vel[1]

  def valtitude(self,name):
    vel = self.velocity(name)
    if vel is None:
      return None
    return vel[2]

class Pen:
  _DRIVER_NAME = 'virtual-pen'

  def __init__(self, address=None):
    self.pen = simPython.Pen(address)

  def down(self):
    self.pen.down()

  def up(self):
    self.pen.up()

  def isDown(self):
    return self.pen.isDown()

  def setColor(self, r=0.5, g=0.5, b=0.5):
    """
    Set the color of the current pen trace.  rgb values should be in the
    range [0,1].  If called after pen down(), the trace will change color
    starting at the position where setColor() was called.
    """
    for channel_val, c_name in [(r, 'red'), (g, 'green'), (b, 'blue')]:
      if channel_val < 0.0 or channel_val > 1.0:
        raise ValueError('{} color channel must be in range [0,1]', c_name)
      self.pen.setColor(r, g, b)

  def setWidth(self, width=1.0):
    if width < 0:
        raise ValueError('pen width must be >= 0')
    self.pen.setWidth( width )

class CameraSensor:
  _DRIVER_NAME = 'virtual-camera'

  def __init__(self, address=None):
    self.camera = simPython.CameraSensor(address)

  def activate(self):
    self.camera.activate()

  def deactivate(self):
    self.camera.deactivate()

  def isActive(self):
    return self.camera.isActive()

class Radio:
  _DRIVER_NAME = 'virtual-radio'

  def __init__(self, address=None):
    self.radio = simPython.Radio()

  def send(self, dest, mailbox, value):
    time.sleep(SENSOR_DELAY)
    return self.radio.send(dest, mailbox, value)

  def available(self, mailbox):
    time.sleep(SENSOR_DELAY)
    return self.radio.available(mailbox)

  def read(self, mailbox):
    time.sleep(SENSOR_DELAY)
    return self.radio.read(mailbox)

  def empty(self, mailbox=None):
    time.sleep(SENSOR_DELAY)
    return self.radio.empty(mailbox)

class Keyboard:
  """
  Detects keyboard key presses from the simulation canvas.
  Click on the simulation canvas to enable keyboard capture.
  """
  _DRIVER_NAME = 'virtual-keyboard'

  def __init__(self, address=None):
    self.keyboard = simPython.Keyboard()

  def is_pressed(self, key):
    """Check if a specific key is currently pressed."""
    time.sleep(SENSOR_DELAY)
    return self.keyboard.is_pressed(key)

  def get_pressed(self):
    """Get a list of all currently pressed keys."""
    time.sleep(SENSOR_DELAY)
    return self.keyboard.get_pressed()

  def any_pressed(self):
    """Check if any key is currently pressed."""
    time.sleep(SENSOR_DELAY)
    return self.keyboard.any_pressed()

class Display:
  """
  Simulated LCD display with 5 lines of text (0-4).
  Shows text on both the 3D robot model and the sensor panel.
  Supports animation effects: scroll, typewriter, and blink.
  """
  _DRIVER_NAME = 'virtual-display'

  def __init__(self, address=None):
    self.display = simPython.Display(address)

  def text(self, line, message):
    """Set text on a specific line (0-4)."""
    self.display.text(line, message)

  def clear(self, line=None):
    """Clear all lines or a specific line."""
    if line is None:
      self.display.clear()
    else:
      self.display.clear(line)

  def set_font(self, size):
    """Set font size: 'small', 'medium', or 'large'."""
    self.display.set_font(size)

  def set_color(self, r, g, b):
    """Set text color using RGB values (0-255)."""
    self.display.set_color(r, g, b)

  def scroll_text(self, line, message, speed=50):
    """
    Scrolling marquee text effect.
    speed: pixels per second (default 50)
    """
    self.display.scroll_text(line, message, speed)

  def typewriter(self, line, message, speed=10):
    """
    Typewriter effect - text appears character by character.
    speed: characters per second (default 10)
    """
    self.display.typewriter(line, message, speed)

  def blink(self, line, message, on_time=500, off_time=500):
    """
    Blinking text effect.
    on_time: milliseconds text is visible (default 500)
    off_time: milliseconds text is hidden (default 500)
    """
    self.display.blink(line, message, on_time, off_time)

  def stop_animation(self, line):
    """Stop any animation on the specified line."""
    self.display.stop_animation(line)
