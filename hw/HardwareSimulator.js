/**
 * HardwareSimulator - Lightweight simulation controller for the Robotics Hardware tab
 * Manages run/stop state and assigns wire currents based on validator connection results.
 * Supports both full (with controller) and direct (GPIO to motor) topologies.
 */
class HardwareSimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.running = false;
        this._damageTimer = null;
        this.onDamage = null; // Callback: function(component, message)
    }

    start() {
        this.running = true;
        // Reset damage state on all components
        for (var i = 0; i < this.canvas.components.length; i++) {
            this.canvas.components[i].damaged = false;
        }
        this._damageTimer = null;
        this.canvas.validator.invalidate();
    }

    stop() {
        this.running = false;
        if (this._damageTimer) {
            clearTimeout(this._damageTimer);
            this._damageTimer = null;
        }
        for (var i = 0; i < this.canvas.wires.length; i++) {
            this.canvas.wires[i].current = 0;
        }
        this.canvas.validator.invalidate();
    }

    toggle() {
        if (this.running) this.stop();
        else this.start();
        return this.running;
    }

    /**
     * Called each frame from HardwareCanvas.animate().
     * Sets wire.current values and checks for damage conditions.
     */
    simulate() {
        if (!this.running) return;

        var validator = this.canvas.validator;
        var c = validator.connections;
        var comps = validator.findComponents();
        var pi = comps.pi;
        var controller = comps.controller;

        // If Pi is damaged, kill all current
        if (pi && pi.damaged) {
            for (var i = 0; i < this.canvas.wires.length; i++) {
                this.canvas.wires[i].current = 0;
            }
            return;
        }

        // Determine upstream power states
        var piPowered = pi && c.piPower && c.piGnd;

        for (var i = 0; i < this.canvas.wires.length; i++) {
            var wire = this.canvas.wires[i];
            wire.current = this._getWireCurrent(wire, comps, c, piPowered);
        }

        // Damage check: GPIO pins driving motors directly (no controller)
        // Real GPIO pins can only output ~16mA, motors draw 100-500mA.
        // This fries the Pi after a short delay so students see it try to work first.
        if (!controller && piPowered && !this._damageTimer) {
            var directMotorActive = false;
            if (comps.motors[0] && pi.gpioA && c.directA1 && c.directA2) directMotorActive = true;
            if (comps.motors[1] && pi.gpioB && c.directB1 && c.directB2) directMotorActive = true;

            if (directMotorActive) {
                var self = this;
                this._damageTimer = setTimeout(function() {
                    if (!self.running || !pi || pi.damaged) return;
                    pi.damaged = true;
                    // Visual effects
                    self.canvas.visualEffects.createSmoke(pi.x, pi.y, '#555');
                    self.canvas.visualEffects.createSparks(pi.x, pi.y, 30);
                    self.canvas.visualEffects.createExplosion(pi.x, pi.y);
                    // Stop motors
                    for (var m = 0; m < comps.motors.length; m++) {
                        comps.motors[m].spinning = false;
                    }
                    // Notify UI
                    if (self.onDamage) {
                        self.onDamage(pi, 'GPIO pin burned out! Motors draw too much current for a GPIO pin. Use a Motor Controller to safely drive motors.');
                    }
                }, 1500);
            }
        }
    }

    _getWireCurrent(wire, comps, c, piPowered) {
        var ft = wire.fromTerminal;
        var tt = wire.toTerminal;
        var fc = wire.fromComponent;
        var tc = wire.toComponent;

        // --- Power wires (Battery to Pi) ---
        if (this._matchTerminals(ft, tt, 'positive', '5V_IN') && piPowered) return 0.05;
        if (this._matchTerminals(ft, tt, 'negative', 'GND') && this._involvesComp(fc, tc, comps.pi) && piPowered) return 0.05;

        if (comps.controller) {
            // --- Full topology wires ---
            var ctrlPowered = c.ctrlPower && c.ctrlGnd && piPowered;
            var sigA = ctrlPowered && c.signalA && comps.pi.gpioA;
            var sigB = ctrlPowered && c.signalB && comps.pi.gpioB;
            var motA = sigA && c.motorA1 && c.motorA2;
            var motB = sigB && c.motorB1 && c.motorB2;

            // Battery to controller power
            if (this._matchTerminals(ft, tt, 'positive', 'VCC') && ctrlPowered) return 0.05;
            if (this._matchTerminals(ft, tt, 'negative', 'GND') && this._involvesComp(fc, tc, comps.controller) && ctrlPowered) return 0.05;

            // GPIO signal wires
            if (this._matchTerminals(ft, tt, 'GPIO_A', 'IN_A') && sigA) return 0.03;
            if (this._matchTerminals(ft, tt, 'GPIO_B', 'IN_B') && sigB) return 0.03;

            // Motor output wires
            if (this._isMotorOutWire(ft, tt, 'OUT_A1', 'OUT_A2') && motA) return 0.04;
            if (this._isMotorOutWire(ft, tt, 'OUT_B1', 'OUT_B2') && motB) return 0.04;
        } else {
            // --- Direct topology wires (GPIO to motor) ---
            var gpioA = piPowered && comps.pi && comps.pi.gpioA;
            var gpioB = piPowered && comps.pi && comps.pi.gpioB;
            var directA = gpioA && c.directA1 && c.directA2;
            var directB = gpioB && c.directB1 && c.directB2;

            // GPIO to motor terminal
            if (this._matchTerminals(ft, tt, 'GPIO_A', 'terminal_1') && directA) return 0.03;
            if (this._matchTerminals(ft, tt, 'GPIO_B', 'terminal_1') && directB) return 0.03;

            // GND to motor terminal_2
            var motorTerms = ['terminal_2'];
            var gndTerms = ['negative', 'GND'];
            if (gndTerms.indexOf(ft) !== -1 && motorTerms.indexOf(tt) !== -1) {
                var motor = tc;
                if (motor === comps.motors[0] && directA) return 0.04;
                if (motor === comps.motors[1] && directB) return 0.04;
            }
            if (gndTerms.indexOf(tt) !== -1 && motorTerms.indexOf(ft) !== -1) {
                var motor = fc;
                if (motor === comps.motors[0] && directA) return 0.04;
                if (motor === comps.motors[1] && directB) return 0.04;
            }
        }

        return 0;
    }

    _matchTerminals(ft, tt, termA, termB) {
        return (ft === termA && tt === termB) || (ft === termB && tt === termA);
    }

    _involvesComp(fc, tc, comp) {
        return fc === comp || tc === comp;
    }

    _isMotorOutWire(ft, tt, outA, outB) {
        var motorTerms = ['terminal_1', 'terminal_2'];
        return ((ft === outA || ft === outB) && motorTerms.indexOf(tt) !== -1) ||
               ((tt === outA || tt === outB) && motorTerms.indexOf(ft) !== -1);
    }
}
