/**
 * HardwareSimulator - Lightweight simulation controller for the Robotics Hardware tab
 * Manages run/stop state and assigns wire currents based on validator connection results.
 * No Ohm's Law or path-finding needed: the robotics circuit has a fixed known topology.
 */
class HardwareSimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.running = false;
    }

    start() {
        this.running = true;
        this.canvas.validator.invalidate();
    }

    stop() {
        this.running = false;
        // Reset all wire currents
        for (var i = 0; i < this.canvas.wires.length; i++) {
            this.canvas.wires[i].current = 0;
        }
        // Validator will set components to unpowered on next frame
        this.canvas.validator.invalidate();
    }

    toggle() {
        if (this.running) this.stop();
        else this.start();
        return this.running;
    }

    /**
     * Called each frame from HardwareCanvas.animate().
     * Sets wire.current values based on which connections are active.
     */
    simulate() {
        if (!this.running) return;

        var validator = this.canvas.validator;
        var conns = validator.connections;
        var comps = validator.findComponents();
        var pi = comps.pi;
        var controller = comps.controller;

        // Determine upstream power states
        var piPowered = pi && conns[0] && conns[1];
        var controllerPowered = controller && conns[2] && conns[3];
        var signalA = piPowered && pi.gpioA && conns[4];
        var signalB = piPowered && pi.gpioB && conns[5];
        var motorADriven = controllerPowered && signalA && conns[6] && conns[7];
        var motorBDriven = controllerPowered && signalB && conns[8] && conns[9];

        for (var i = 0; i < this.canvas.wires.length; i++) {
            var wire = this.canvas.wires[i];
            wire.current = this._getWireCurrent(wire, comps, piPowered, controllerPowered, signalA, signalB, motorADriven, motorBDriven);
        }
    }

    _getWireCurrent(wire, comps, piPowered, ctrlPowered, sigA, sigB, motA, motB) {
        var ft = wire.fromTerminal;
        var tt = wire.toTerminal;
        var fc = wire.fromComponent;
        var tc = wire.toComponent;

        // Battery positive to Pi 5V or Controller VCC
        if (this._connects(fc, ft, tc, tt, 'positive', '5V_IN') && piPowered) return 0.05;
        if (this._connects(fc, ft, tc, tt, 'positive', 'VCC') && ctrlPowered) return 0.05;

        // Battery negative to Pi GND or Controller GND
        if (this._connects(fc, ft, tc, tt, 'negative', 'GND') && piPowered) return 0.05;
        if (this._connectsGnd(fc, ft, tc, tt, comps) && ctrlPowered) return 0.05;

        // GPIO signal wires
        if (this._connects(fc, ft, tc, tt, 'GPIO_A', 'IN_A') && sigA) return 0.03;
        if (this._connects(fc, ft, tc, tt, 'GPIO_B', 'IN_B') && sigB) return 0.03;

        // Motor output wires
        if (this._connectsMotor(ft, tt, 'OUT_A1', 'OUT_A2') && motA) return 0.04;
        if (this._connectsMotor(ft, tt, 'OUT_B1', 'OUT_B2') && motB) return 0.04;

        return 0;
    }

    /** Check if wire connects terminal A to terminal B (either direction) */
    _connects(fc, ft, tc, tt, termA, termB) {
        return (ft === termA && tt === termB) || (ft === termB && tt === termA);
    }

    /** Check if this is the controller GND wire (not the Pi GND wire) */
    _connectsGnd(fc, ft, tc, tt, comps) {
        if (ft === 'negative' && tt === 'GND') {
            return tc === comps.controller;
        }
        if (tt === 'negative' && ft === 'GND') {
            return fc === comps.controller;
        }
        return false;
    }

    /** Check if wire connects to motor terminals */
    _connectsMotor(ft, tt, outA, outB) {
        var motorTerms = ['terminal_1', 'terminal_2'];
        return ((ft === outA || ft === outB) && motorTerms.indexOf(tt) !== -1) ||
               ((tt === outA || tt === outB) && motorTerms.indexOf(ft) !== -1);
    }
}
