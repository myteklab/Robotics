/* global Sk, sim */
/* exported $builtinmodule */

var $builtinmodule = function(name) {
  var mod = {};

  mod.System = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
    });

    $loc.reset_simulator = new Sk.builtin.func(function(self, command) {
      simPanel.resetSim(false);
    });
  }, 'System', []);

  mod.Motor = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      if (robot.processedOptions.wheels && address.v == 'outA') {
        self.motor = robot.leftWheel;
      } else if (robot.processedOptions.wheels && address.v == 'outB') {
        self.motor = robot.rightWheel;
      } else {
        self.motor = robot.getComponentByPort(address.v);
        if (!self.motor) {
          throw new Sk.builtin.TypeError('No motor connected to ' + String(address.v));
        }
      }
    });

    $loc.command = new Sk.builtin.func(function(self, command) {
      if (command.v == 'run-timed') {
        self.motor.time_target = Date.now() + self.motor.time_sp * 1000;
        self.motor.runTimed();

      } else if (command.v == 'run-to-rel-pos') {
        self.motor.position_target = self.motor.position + self.motor.position_sp;
        self.motor.runToPosition();

      } else if (command.v == 'run-to-abs-pos') {
        self.motor.position_target = self.motor.position_sp;
        self.motor.runToPosition();

      } else if (command.v == 'run-forever') {
        self.motor.runForever();

      } else if (command.v == '') {
        self.motor.stop();
      }

      self.motor.command = command.v;
    });

    $loc.stop_action = new Sk.builtin.func(function(self, stop_action) {
      if (typeof stop_action != 'undefined') {
        self.motor.stop_action = stop_action.v;
      } else {
        return Sk.ffi.remapToPy(self.motor.stop_action);
      }
    });

    $loc.state = new Sk.builtin.func(function(self) {
      return Sk.ffi.remapToPy(self.motor.state);
    });

    $loc.speed_sp = new Sk.builtin.func(function(self, speed_sp) {
      if (typeof speed_sp != 'undefined') {
        self.motor.speed_sp = speed_sp.v;
      } else {
        return Sk.ffi.remapToPy(self.motor.speed_sp);
      }
    });

    $loc.time_sp = new Sk.builtin.func(function(self, time_sp) {
      if (typeof time_sp != 'undefined') {
        self.motor.time_sp = time_sp.v;
      } else {
        return Sk.ffi.remapToPy(self.motor.time_sp);
      }
    });

    $loc.position = new Sk.builtin.func(function(self, pos) {
      if (typeof pos != 'undefined') {
        self.motor.positionAdjustment += self.motor.position - pos.v;
        self.motor.position = pos.v;
        self.motor.position_target = pos.v;
        self.motor.prevPosition = pos.v;
      } else {
        return Sk.ffi.remapToPy(self.motor.position);
      }
    });

    $loc.polarity = new Sk.builtin.func(function(self, polarity) {
      if (typeof polarity != 'undefined') {
        self.motor.polarity = polarity.v;
      } else {
        return Sk.ffi.remapToPy(self.motor.polarity);
      }
    });

    $loc.position_sp = new Sk.builtin.func(function(self, position_sp) {
      if (typeof position_sp != 'undefined') {
        self.motor.position_sp = position_sp.v;
      } else {
        return Sk.ffi.remapToPy(self.motor.position_sp);
      }
    });

    $loc.speed = new Sk.builtin.func(function(self) {
      return Sk.ffi.remapToPy(self.motor.speed);
    });

  }, 'Motor', []);

  mod.Pen = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.pen = robot.getComponentByPort(address.v);
      if (!self.pen || self.pen.type != 'Pen') {
        throw new Sk.builtin.TypeError('No pen connected to ' + String(address.v));
      }
    });

    $loc.down = new Sk.builtin.func(function(self) {
      self.pen.down();
    });

    $loc.up = new Sk.builtin.func(function(self) {
      self.pen.up();
    });

    $loc.isDown = new Sk.builtin.func(function(self) {
      return self.pen.isDown;
    });

    $loc.setColor = new Sk.builtin.func(function(self, r, g, b) {
      self.pen.setTraceColor(r.v, g.v, b.v);
    });

    $loc.setWidth = new Sk.builtin.func(function(self, width) {
      self.pen.setWidth(width.v);
    });

    // $loc.setOptions = new Sk.builtin.func(function(self, o) {
    //   self.robot.pen.set_options(o)
    // });

  }, 'Pen', []);

  mod.LED = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.led = robot.getComponentByPort(address.v);
      if (!self.led || self.led.type != 'LED') {
        throw new Sk.builtin.TypeError('No LED connected to ' + String(address.v));
      }
    });

    $loc.on = new Sk.builtin.func(function(self) {
      self.led.on();
    });

    $loc.off = new Sk.builtin.func(function(self) {
      self.led.off();
    });

    $loc.setColor = new Sk.builtin.func(function(self, r, g, b) {
      self.led.setColor(r.v, g.v, b.v);
    });

    $loc.setRange = new Sk.builtin.func(function(self, range) {
      self.led.setRange(range.v);
    });

  }, 'LED', []);

  mod.Display = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.display = robot.getComponentByPort(address.v);
      if (!self.display || self.display.type != 'Display') {
        throw new Sk.builtin.TypeError('No Display connected to ' + String(address.v));
      }
    });

    $loc.text = new Sk.builtin.func(function(self, line, message) {
      self.display.text(line.v, message.v);
    });

    $loc.clear = new Sk.builtin.func(function(self, line) {
      if (typeof line === 'undefined' || line === Sk.builtin.none.none$) {
        self.display.clear();
      } else {
        self.display.clear(line.v);
      }
    });

    $loc.set_font = new Sk.builtin.func(function(self, size) {
      self.display.setFont(size.v);
    });

    $loc.set_color = new Sk.builtin.func(function(self, r, g, b) {
      self.display.setTextColor(r.v, g.v, b.v);
    });

    // Scrolling marquee text effect
    $loc.scroll_text = new Sk.builtin.func(function(self, line, message, speed) {
      var spd = (typeof speed === 'undefined' || speed === Sk.builtin.none.none$) ? 50 : speed.v;
      self.display.scrollText(line.v, message.v, spd);
    });

    // Typewriter effect - text appears character by character
    $loc.typewriter = new Sk.builtin.func(function(self, line, message, speed) {
      var spd = (typeof speed === 'undefined' || speed === Sk.builtin.none.none$) ? 10 : speed.v;
      self.display.typewriter(line.v, message.v, spd);
    });

    // Blinking text effect
    $loc.blink = new Sk.builtin.func(function(self, line, message, on_time, off_time) {
      var onT = (typeof on_time === 'undefined' || on_time === Sk.builtin.none.none$) ? 500 : on_time.v;
      var offT = (typeof off_time === 'undefined' || off_time === Sk.builtin.none.none$) ? 500 : off_time.v;
      self.display.blink(line.v, message.v, onT, offT);
    });

    // Stop animation on a line
    $loc.stop_animation = new Sk.builtin.func(function(self, line) {
      self.display.stopAnimation(line.v);
    });

  }, 'Display', []);

  mod.CameraSensor = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.sensor = robot.getComponentByPort(address.v);
      if (!self.sensor || self.sensor.type != 'CameraSensor') {
        throw new Sk.builtin.TypeError('No camera sensor connected to ' + String(address.v));
      }
    });

    $loc.activate = new Sk.builtin.func(function(self) {
      self.sensor.activate();
    });

    $loc.deactivate = new Sk.builtin.func(function(self) {
      self.sensor.deactivate();
    });

    $loc.isActive = new Sk.builtin.func(function(self) {
      return Sk.ffi.remapToPy(self.sensor.active);
    });

  }, 'CameraSensor', []);

  mod.ColorSensor = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.sensor = robot.getComponentByPort(address.v);
      if (!self.sensor || self.sensor.type != 'ColorSensor') {
        throw new Sk.builtin.TypeError('No color sensor connected to ' + String(address.v));
      }
    });

    $loc.value = new Sk.builtin.func(function(self) {
      return Sk.ffi.remapToPy(self.sensor.getRGB());
    });

    $loc.valueLAB = new Sk.builtin.func(function(self) {
      let rgb = self.sensor.getRGB();
      let lab = Colors.toLAB(rgb);

      return Sk.ffi.remapToPy(lab);
    });

    $loc.valueHSV = new Sk.builtin.func(function(self) {
      let rgb = self.sensor.getRGB();
      let hsv = Colors.toHSV(rgb);

      return Sk.ffi.remapToPy(hsv);
    });

    $loc.valueHLS = new Sk.builtin.func(function(self) {
      let rgb = self.sensor.getRGB();
      let hls = Colors.toHLS(rgb);

      return Sk.ffi.remapToPy(hls);
    });

    $loc.color = new Sk.builtin.func(function(self) {
      let rgb = self.sensor.getRGB();
      let hsv = Colors.toHSV(rgb);
      let color = Colors.toColor(hsv);

      return Sk.ffi.remapToPy(color);
    });

    $loc.colorName = new Sk.builtin.func(function(self) {
      let rgb = self.sensor.getRGB();
      let hsv = Colors.toHSV(rgb);
      let color = Colors.toColor(hsv);
      let colorName = Colors.toColorName(color);

      return Sk.ffi.remapToPy(colorName);
    });

  }, 'ColorSensor', []);

  mod.GyroSensor = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.sensor = robot.getComponentByPort(address.v);
      if (!self.sensor || self.sensor.type != 'GyroSensor') {
        throw new Sk.builtin.TypeError('No gyro sensor connected to ' + String(address.v));
      }
    });

    $loc.yawAngleAndRate = new Sk.builtin.func(function(self, float) {
      var gyro = [];

      gyro[0] = self.sensor.getYawAngle();
      gyro[1] = self.sensor.getYawRate();

      if (float.v == false) {
        gyro[0] = Math.round(gyro[0]);
        gyro[1] = Math.round(gyro[1]);
      }

      return Sk.ffi.remapToPy(gyro);
    });

    $loc.pitchAngleAndRate = new Sk.builtin.func(function(self, float) {
      var gyro = [];

      gyro[0] = self.sensor.getPitchAngle();
      gyro[1] = self.sensor.getPitchRate();

      if (float.v == false) {
        gyro[0] = Math.round(gyro[0]);
        gyro[1] = Math.round(gyro[1]);
      }

      return Sk.ffi.remapToPy(gyro);
    });

    $loc.rollAngleAndRate = new Sk.builtin.func(function(self, float) {
      var gyro = [];

      gyro[0] = self.sensor.getRollAngle();
      gyro[1] = self.sensor.getRollRate();

      if (float.v == false) {
        gyro[0] = Math.round(gyro[0]);
        gyro[1] = Math.round(gyro[1]);
      }

      return Sk.ffi.remapToPy(gyro);
    });

    $loc.reset = new Sk.builtin.func(function(self) {
      self.sensor.reset();
    });

  }, 'GyroSensor', []);

  mod.GPSSensor = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.sensor = robot.getComponentByPort(address.v);
      if (!self.sensor || self.sensor.type != 'GPSSensor') {
        throw new Sk.builtin.TypeError('No GPS sensor connected to ' + String(address.v));
      }
    });

    $loc.position = new Sk.builtin.func(function(self) {
      var position = [];

      position = self.sensor.getPosition();

      return Sk.ffi.remapToPy(position);
    });

    $loc.reset = new Sk.builtin.func(function(self) {
      self.sensor.reset();
    });

  }, 'GPSSensor', []);

  mod.ObjectTracker = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {});

    $loc.position = new Sk.builtin.func(function(self,foo) {
      var position = [];

      position = robot.objectTrackerPosition(foo.v);

      return Sk.ffi.remapToPy(position);
    });

    $loc.velocity = new Sk.builtin.func(function(self,foo) {
      var velocity = [];

      velocity = robot.objectTrackerVelocity(foo.v);

      return Sk.ffi.remapToPy(velocity);
    });
  }, 'ObjectTracker', []);

  mod.UltrasonicSensor = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.sensor = robot.getComponentByPort(address.v);
      if (!self.sensor || (self.sensor.type != 'UltrasonicSensor' && self.sensor.type != 'LaserRangeSensor')) {
        throw new Sk.builtin.TypeError('No ultrasonic sensor connected to ' + String(address.v));
      }
    });

    $loc.dist = new Sk.builtin.func(function(self) {
      return Sk.ffi.remapToPy(self.sensor.getDistance());
    });

  }, 'UltrasonicSensor', []);

  mod.TouchSensor = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.sensor = robot.getComponentByPort(address.v);
      if (!self.sensor || self.sensor.type != 'TouchSensor') {
        throw new Sk.builtin.TypeError('No touch sensor connected to ' + String(address.v));
      }
    });

    $loc.isPressed = new Sk.builtin.func(function(self) {
      return Sk.ffi.remapToPy(self.sensor.isPressed());
    });

  }, 'TouchSensor', []);

  mod.Sound = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    this.playing = false;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      self.volume = 1.0;
      self.audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
      self.gainNode = self.audioCtx.createGain();

      self.gainNode.connect(self.audioCtx.destination);
    });

    $loc.speak = new Sk.builtin.func(function(self, text) {
      var utter = new SpeechSynthesisUtterance(text.v);
      utter.volume = self.volume;
      speechSynthesis.speak(utter);
    });

    $loc.set_volume = new Sk.builtin.func(function(self, volume) {
      self.volume = parseFloat(volume.v) / 100;
      self.gainNode.gain.value = self.volume;
    });

    $loc.get_volume = new Sk.builtin.func(function(self) {
      return self.volume;
    });

    $loc.isSpeaking = new Sk.builtin.func(function(self) {
      return speechSynthesis.speaking;
    });

    $loc.play_tone = new Sk.builtin.func(function(self, frequency, duration, delay) {
      self.playing = true;
      oscillator = self.audioCtx.createOscillator();

      oscillator.type = 'sine';
      oscillator.connect(self.gainNode);
      oscillator.onended = function() {
        if (delay.v > 0) {
          setTimeout(function(){ self.playing = false; }, delay.v * 1000);
        } else {
          self.playing = false;
        }
      };
      oscillator.frequency.value = frequency.v;

      oscillator.start(self.audioCtx.currentTime);
      oscillator.stop(self.audioCtx.currentTime + duration.v);
    });

    $loc.isPlaying = new Sk.builtin.func(function(self) {
      return self.playing;
    });
  }, 'Sound', []);

  mod.Radio = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
      robot.radioEmpty();
    });

    $loc.send = new Sk.builtin.func(function(self, dest, mailbox, value) {
      return Sk.ffi.remapToPy(robot.radioSend(dest.v, mailbox.v, Sk.ffi.remapToJs(value)));
    });

    $loc.available = new Sk.builtin.func(function(self, mailbox) {
      return Sk.ffi.remapToPy(robot.radioAvailable(mailbox.v));
    });

    $loc.read = new Sk.builtin.func(function(self, mailbox) {
      return Sk.ffi.remapToPy(robot.radioRead(mailbox.v));
    });

    $loc.empty = new Sk.builtin.func(function(self, mailbox) {
      if (mailbox.v == null) {
        return Sk.ffi.remapToPy(robot.radioEmpty());
      }
      return Sk.ffi.remapToPy(robot.radioEmpty(mailbox.v));
    });

  }, 'Radio', []);

  mod.HubButtons = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    var self = this;

    $loc.__init__ = new Sk.builtin.func(function(self, address) {
    });

    $loc.pybricks_pressed = new Sk.builtin.func(function(self) {
      let map = {
        down: 2,
        left: 4,
        enter: 5,
        right: 6,
        up: 8
      }

      let pressed = [];

      let hubButtons = robot.getHubButtons(); 
      for (let btn in hubButtons) {
        if (hubButtons[btn] && btn in map) {
          pressed.push(map[btn]);
        }
      }

      return Sk.ffi.remapToPy(pressed);
    });

    $loc.ev3dev_buttons_pressed = new Sk.builtin.func(function(self) {
      let pressed = [];

      let hubButtons = robot.getHubButtons();
      for (let btn in hubButtons) {
        if (hubButtons[btn]) {
          pressed.push(btn);
        }
      }

      return Sk.ffi.remapToPy(pressed);
    });

    $loc.ev3dev_any = new Sk.builtin.func(function(self) {
      let hubButtons = robot.getHubButtons();
      for (let btn in hubButtons) {
        if (hubButtons[btn]) {
          return Sk.ffi.remapToPy(true);
        }
      }

      return Sk.ffi.remapToPy(false);
    });

    $loc.ev3dev_check_buttons = new Sk.builtin.func(function(self, buttons) {
      buttons = Sk.ffi.remapToJs(buttons);
      let hubButtons = robot.getHubButtons();
      let pressed = [];

      for (let btn in hubButtons) {
        if (hubButtons[btn]) {
          pressed.push(btn);
        }
      }

      if (buttons.length != pressed.length) {
        return Sk.ffi.remapToPy(false);
      }

      for (let btn of pressed) {
        if (buttons.indexOf(btn) == -1) {
          return Sk.ffi.remapToPy(false);
        }
      }

      return Sk.ffi.remapToPy(true);
    });

    $loc.getButton = new Sk.builtin.func(function(self, button) {
      button = Sk.ffi.remapToJs(button);
      let hubButtons = robot.getHubButtons();

      return Sk.ffi.remapToPy(hubButtons[button]);
    });

    $loc.getButtons = new Sk.builtin.func(function(self) {
      return Sk.ffi.remapToPy(robot.getHubButtons());
    });

  }, 'HubButtons', []);

  // Keyboard class for detecting custom keyboard key presses
  mod.Keyboard = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      return Sk.builtin.none.none$;
    });

    // Check if a specific key is currently pressed
    $loc.is_pressed = new Sk.builtin.func(function(self, key) {
      key = Sk.ffi.remapToJs(key);
      return Sk.ffi.remapToPy(robot.getKeyPressed(key));
    });

    // Get list of all currently pressed keys
    $loc.get_pressed = new Sk.builtin.func(function(self) {
      return Sk.ffi.remapToPy(robot.getKeysPressed());
    });

    // Check if any key is pressed
    $loc.any_pressed = new Sk.builtin.func(function(self) {
      let pressed = robot.getKeysPressed();
      return Sk.ffi.remapToPy(pressed.length > 0);
    });

  }, 'Keyboard', []);

  return mod;
};
