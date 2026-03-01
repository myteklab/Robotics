/**
 * RobotWiringValidator - Validates robotics component wiring for the Hardware tab
 * Checks 10 required connections and updates component visual states
 * Motors auto-spin when all wiring is complete (no external simulator dependency)
 */
class RobotWiringValidator {
    constructor(canvas) {
        this.canvas = canvas;
        this.connections = new Array(10).fill(false);
        this.lastWireCount = -1;
    }

    /**
     * Check if two terminals are connected by any wire
     */
    isConnected(compA, termA, compB, termB) {
        for (const wire of this.canvas.wires) {
            // Check both directions
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
     * Run validation and update component states
     * Connection checks cached (only re-run when wire/component count changes)
     * Component states always re-applied each call
     */
    validate() {
        const currentWireCount = this.canvas.wires.length;
        const componentCount = this.canvas.components.length;

        // Re-check connections only when wires or components change
        if (currentWireCount !== this.lastWireCount || componentCount !== this._lastCompCount) {
            this.lastWireCount = currentWireCount;
            this._lastCompCount = componentCount;
            this._recheckConnections();
        }

        // Always apply component states (they may have been reset externally)
        this._applyStates();

        return this.connections;
    }

    /**
     * Re-check which terminals are connected by wires
     */
    _recheckConnections() {
        const { battery, pi, controller, motors } = this.findComponents();

        this.connections = new Array(10).fill(false);

        if (!battery || !pi) return;

        // Pi power connections (always check if battery and pi exist)
        this.connections[0] = this.isConnected(battery, 'positive', pi, '5V_IN');
        this.connections[1] = this.isConnected(battery, 'negative', pi, 'GND');

        if (!controller) return;

        const motorA = motors[0] || null;
        const motorB = motors[1] || null;

        this.connections[2] = this.isConnected(battery, 'positive', controller, 'VCC');
        this.connections[3] = this.isConnected(battery, 'negative', controller, 'GND');
        this.connections[4] = this.isConnected(pi, 'GPIO_A', controller, 'IN_A');
        this.connections[5] = this.isConnected(pi, 'GPIO_B', controller, 'IN_B');

        if (motorA) {
            this.connections[6] = this.isConnected(controller, 'OUT_A1', motorA, 'terminal_1');
            this.connections[7] = this.isConnected(controller, 'OUT_A2', motorA, 'terminal_2');
        }
        if (motorB) {
            this.connections[8] = this.isConnected(controller, 'OUT_B1', motorB, 'terminal_1');
            this.connections[9] = this.isConnected(controller, 'OUT_B2', motorB, 'terminal_2');
        }
    }

    /**
     * Apply visual states to components based on current connections
     * Motors auto-spin when all wiring is complete
     */
    _applyStates() {
        var wiringComplete = this.getProgress() === this.getTotal() && this.getTotal() > 0;
        const { pi, controller, motors } = this.findComponents();

        if (!pi) {
            if (controller) {
                controller.powered = false;
                controller.signalA = false;
                controller.signalB = false;
            }
            for (const motor of motors) {
                motor.spinning = false;
            }
            return;
        }

        if (!controller) {
            pi.poweredOn = this.connections[0] && this.connections[1];
            for (const motor of motors) {
                motor.spinning = false;
            }
            return;
        }

        const motorA = motors[0] || null;
        const motorB = motors[1] || null;

        pi.poweredOn = this.connections[0] && this.connections[1];
        controller.powered = this.connections[2] && this.connections[3];
        controller.signalA = this.connections[4] && pi.poweredOn && pi.gpioA;
        controller.signalB = this.connections[5] && pi.poweredOn && pi.gpioB;

        if (motorA) {
            motorA.spinning = wiringComplete && this.connections[6] && this.connections[7] &&
                              controller.powered && controller.signalA;
        }
        if (motorB) {
            motorB.spinning = wiringComplete && this.connections[8] && this.connections[9] &&
                              controller.powered && controller.signalB;
        }
    }

    /**
     * Get progress count (how many of 10 connections are made)
     */
    getProgress() {
        return this.connections.filter(c => c).length;
    }

    /**
     * Get total possible connections based on available components
     */
    getTotal() {
        const { battery, pi, controller, motors } = this.findComponents();
        if (!battery || !pi || !controller) return 0;

        let total = 6; // First 6 connections always needed
        if (motors.length >= 1) total += 2; // Motor A connections
        if (motors.length >= 2) total += 2; // Motor B connections
        return total;
    }

    /**
     * Get checklist data for UI display
     */
    getChecklist() {
        const { battery, pi, controller, motors } = this.findComponents();
        const items = [
            { label: 'Battery (+) \u2192 Pi (5V)', connected: this.connections[0] },
            { label: 'Battery (-) \u2192 Pi (GND)', connected: this.connections[1] },
            { label: 'Battery (+) \u2192 Controller (VCC)', connected: this.connections[2] },
            { label: 'Battery (-) \u2192 Controller (GND)', connected: this.connections[3] },
            { label: 'Pi (GPIO A) \u2192 Controller (IN_A)', connected: this.connections[4] },
            { label: 'Pi (GPIO B) \u2192 Controller (IN_B)', connected: this.connections[5] }
        ];

        if (motors.length >= 1) {
            items.push({ label: 'Controller (A1) \u2192 Motor A (1)', connected: this.connections[6] });
            items.push({ label: 'Controller (A2) \u2192 Motor A (2)', connected: this.connections[7] });
        }
        if (motors.length >= 2) {
            items.push({ label: 'Controller (B1) \u2192 Motor B (1)', connected: this.connections[8] });
            items.push({ label: 'Controller (B2) \u2192 Motor B (2)', connected: this.connections[9] });
        }

        return items;
    }

    /**
     * Get current hardware tab state for save/load and cross-tab communication
     * @returns {Object} State object with wiring status and serialized circuit data
     */
    getState() {
        return {
            hasComponents: this.hasRoboticsComponents(),
            wiringComplete: this.getProgress() === this.getTotal() && this.getTotal() > 0,
            wiringProgress: this.getProgress(),
            wiringTotal: this.getTotal(),
            circuitData: this.canvas.toJSON()
        };
    }

    /**
     * Force re-validation on next call
     */
    invalidate() {
        this.lastWireCount = -1;
        this._lastCompCount = -1;
    }
}
