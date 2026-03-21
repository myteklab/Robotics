/**
 * RobotWiringValidator - Validates robotics component wiring for the Hardware tab
 * Supports two topologies:
 *   1. Full: Battery -> Pi -> MotorController -> Motors
 *   2. Direct: Battery -> Pi -> Motors (GPIO drives motors directly)
 * Updates component visual states based on connections and simulation mode.
 */
class RobotWiringValidator {
    constructor(canvas) {
        this.canvas = canvas;
        this.connections = {};
        this.lastWireCount = -1;
        this.simulator = null; // Set by HardwareCanvas after construction
    }

    /**
     * Check if two terminals are connected by any wire
     */
    isConnected(compA, termA, compB, termB) {
        for (const wire of this.canvas.wires) {
            if (wire.fromComponent === compA && wire.fromTerminal === termA &&
                wire.toComponent === compB && wire.toTerminal === termB) {
                return true;
            }
            if (wire.fromComponent === compB && wire.fromTerminal === termB &&
                wire.toComponent === compA && wire.toTerminal === termA) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a component terminal is connected to ANY terminal on another component
     */
    isConnectedTo(compA, termA, compB) {
        for (const wire of this.canvas.wires) {
            if (wire.fromComponent === compA && wire.fromTerminal === termA && wire.toComponent === compB) return true;
            if (wire.toComponent === compA && wire.toTerminal === termA && wire.fromComponent === compB) return true;
        }
        return false;
    }

    /**
     * Find all robotics components on canvas
     */
    findComponents() {
        const components = this.canvas.components;
        return {
            battery: components.find(c => c.type === 'batteryPackAA'),
            pi: components.find(c => c.type === 'raspberryPi'),
            controller: components.find(c => c.type === 'motorController'),
            motors: components.filter(c => c.type === 'dcMotor')
        };
    }

    /**
     * Check if any robotics components are on the canvas
     */
    hasRoboticsComponents() {
        const comps = this.findComponents();
        return !!(comps.battery || comps.pi || comps.controller || comps.motors.length > 0);
    }

    /**
     * Determine topology: 'full' (with controller), 'direct' (GPIO to motors), or 'none'
     */
    getTopology() {
        const { battery, pi, controller, motors } = this.findComponents();
        if (!battery || !pi) return 'none';
        if (controller) return 'full';
        if (motors.length > 0) return 'direct';
        return 'none';
    }

    /**
     * Run validation and update component states
     */
    validate() {
        const currentWireCount = this.canvas.wires.length;
        const componentCount = this.canvas.components.length;

        if (currentWireCount !== this.lastWireCount || componentCount !== this._lastCompCount) {
            this.lastWireCount = currentWireCount;
            this._lastCompCount = componentCount;
            this._recheckConnections();
        }

        this._applyStates();
        return this.connections;
    }

    /**
     * Re-check which terminals are connected by wires
     */
    _recheckConnections() {
        const { battery, pi, controller, motors } = this.findComponents();
        this.connections = {};

        if (!battery || !pi) return;

        // Pi power (always needed)
        this.connections.piPower = this.isConnected(battery, 'positive', pi, '5V_IN');
        this.connections.piGnd = this.isConnected(battery, 'negative', pi, 'GND');

        if (controller) {
            // Full topology: Battery -> Controller power, Pi -> Controller signals, Controller -> Motors
            this.connections.ctrlPower = this.isConnected(battery, 'positive', controller, 'VCC');
            this.connections.ctrlGnd = this.isConnected(battery, 'negative', controller, 'GND');
            this.connections.signalA = this.isConnected(pi, 'GPIO_A', controller, 'IN_A');
            this.connections.signalB = this.isConnected(pi, 'GPIO_B', controller, 'IN_B');

            var motorA = motors[0] || null;
            var motorB = motors[1] || null;
            if (motorA) {
                this.connections.motorA1 = this.isConnected(controller, 'OUT_A1', motorA, 'terminal_1');
                this.connections.motorA2 = this.isConnected(controller, 'OUT_A2', motorA, 'terminal_2');
            }
            if (motorB) {
                this.connections.motorB1 = this.isConnected(controller, 'OUT_B1', motorB, 'terminal_1');
                this.connections.motorB2 = this.isConnected(controller, 'OUT_B2', motorB, 'terminal_2');
            }
        } else if (motors.length > 0) {
            // Direct topology: GPIO -> Motor terminals
            var motorA = motors[0] || null;
            var motorB = motors[1] || null;
            if (motorA) {
                this.connections.directA1 = this.isConnected(pi, 'GPIO_A', motorA, 'terminal_1');
                this.connections.directA2 = this.isConnected(battery, 'negative', motorA, 'terminal_2') ||
                                            this.isConnected(pi, 'GND', motorA, 'terminal_2');
            }
            if (motorB) {
                this.connections.directB1 = this.isConnected(pi, 'GPIO_B', motorB, 'terminal_1');
                this.connections.directB2 = this.isConnected(battery, 'negative', motorB, 'terminal_2') ||
                                            this.isConnected(pi, 'GND', motorB, 'terminal_2');
            }
        }
    }

    /**
     * Apply visual states to components based on current connections
     */
    _applyStates() {
        var simRunning = this.simulator ? this.simulator.running : false;
        const { pi, controller, motors } = this.findComponents();
        var c = this.connections;

        if (!pi) {
            if (controller) { controller.powered = false; controller.signalA = false; controller.signalB = false; }
            for (const motor of motors) motor.spinning = false;
            return;
        }

        pi.poweredOn = simRunning && c.piPower && c.piGnd;

        if (controller) {
            controller.powered = simRunning && c.ctrlPower && c.ctrlGnd;
            controller.signalA = c.signalA && pi.poweredOn && pi.gpioA;
            controller.signalB = c.signalB && pi.poweredOn && pi.gpioB;

            var motorA = motors[0] || null;
            var motorB = motors[1] || null;
            if (motorA) {
                motorA.spinning = c.motorA1 && c.motorA2 && controller.powered && controller.signalA;
            }
            if (motorB) {
                motorB.spinning = c.motorB1 && c.motorB2 && controller.powered && controller.signalB;
            }
        } else {
            // Direct GPIO drive
            var motorA = motors[0] || null;
            var motorB = motors[1] || null;
            if (motorA) {
                motorA.spinning = pi.poweredOn && pi.gpioA && c.directA1 && c.directA2;
            }
            if (motorB) {
                motorB.spinning = pi.poweredOn && pi.gpioB && c.directB1 && c.directB2;
            }
        }
    }

    /**
     * Get progress count
     */
    getProgress() {
        var count = 0;
        for (var key in this.connections) {
            if (this.connections[key]) count++;
        }
        return count;
    }

    /**
     * Get total possible connections based on available components
     */
    getTotal() {
        var count = 0;
        for (var key in this.connections) {
            count++;
        }
        return count;
    }

    /**
     * Get checklist data for UI display
     */
    getChecklist() {
        const { battery, pi, controller, motors } = this.findComponents();
        var c = this.connections;
        var items = [];

        if (!battery || !pi) return items;

        items.push({ label: 'Battery (+) \u2192 Pi (5V)', connected: !!c.piPower });
        items.push({ label: 'Battery (-) \u2192 Pi (GND)', connected: !!c.piGnd });

        if (controller) {
            items.push({ label: 'Battery (+) \u2192 Controller (VCC)', connected: !!c.ctrlPower });
            items.push({ label: 'Battery (-) \u2192 Controller (GND)', connected: !!c.ctrlGnd });
            items.push({ label: 'Pi (GPIO A) \u2192 Controller (IN_A)', connected: !!c.signalA });
            items.push({ label: 'Pi (GPIO B) \u2192 Controller (IN_B)', connected: !!c.signalB });
            if (motors.length >= 1) {
                items.push({ label: 'Controller (A1) \u2192 Motor A (1)', connected: !!c.motorA1 });
                items.push({ label: 'Controller (A2) \u2192 Motor A (2)', connected: !!c.motorA2 });
            }
            if (motors.length >= 2) {
                items.push({ label: 'Controller (B1) \u2192 Motor B (1)', connected: !!c.motorB1 });
                items.push({ label: 'Controller (B2) \u2192 Motor B (2)', connected: !!c.motorB2 });
            }
        } else {
            if (motors.length >= 1) {
                items.push({ label: 'Pi (GPIO A) \u2192 Motor A (1)', connected: !!c.directA1 });
                items.push({ label: 'GND \u2192 Motor A (2)', connected: !!c.directA2 });
            }
            if (motors.length >= 2) {
                items.push({ label: 'Pi (GPIO B) \u2192 Motor B (1)', connected: !!c.directB1 });
                items.push({ label: 'GND \u2192 Motor B (2)', connected: !!c.directB2 });
            }
        }

        return items;
    }

    /**
     * Get current hardware tab state
     */
    getState() {
        var total = this.getTotal();
        return {
            hasComponents: this.hasRoboticsComponents(),
            wiringComplete: total > 0 && this.getProgress() === total,
            wiringProgress: this.getProgress(),
            wiringTotal: total,
            circuitData: this.canvas.toJSON()
        };
    }

    /**
     * Get wiring errors for simulation feedback (only requires battery + pi)
     */
    getWiringErrors() {
        var errors = [];
        var comps = this.findComponents();

        if (!comps.battery) errors.push({ type: 'missing', message: 'No battery on canvas' });
        if (!comps.pi) errors.push({ type: 'missing', message: 'No Raspberry Pi on canvas' });

        // Check for polarity errors
        for (var i = 0; i < this.canvas.wires.length; i++) {
            var wire = this.canvas.wires[i];
            var ft = wire.fromTerminal;
            var tt = wire.toTerminal;
            var positives = ['positive', 'VCC', '5V_IN'];
            var negatives = ['negative', 'GND'];
            var fromIsPos = positives.indexOf(ft) !== -1;
            var fromIsNeg = negatives.indexOf(ft) !== -1;
            var toIsPos = positives.indexOf(tt) !== -1;
            var toIsNeg = negatives.indexOf(tt) !== -1;
            if ((fromIsPos && toIsNeg) || (fromIsNeg && toIsPos)) {
                errors.push({ type: 'polarity', message: 'Reversed polarity: ' + ft + ' to ' + tt, wire: wire });
            }
        }

        return errors;
    }

    /**
     * Force re-validation on next call
     */
    invalidate() {
        this.lastWireCount = -1;
        this._lastCompCount = -1;
    }
}
