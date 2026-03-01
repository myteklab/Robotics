/**
 * Component - Base class for all circuit components
 * Forked from CircuitSim for Robotics Hardware Tab
 */
class Component {
    constructor(type, x, y) {
        this.id = 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.rotation = 0;
        this.selected = false;
        this.hovered = false;

        // Connection points (terminals)
        this.terminals = [];

        // Electrical properties
        this.voltage = 0;
        this.current = 0;
        this.resistance = 0;

        // Visual properties
        this.color = '#667eea';
        this.damaged = false;
        this.temperature = 0;
    }

    update(deltaTime) {
        if (this.temperature > 0) {
            this.temperature -= deltaTime * 0.5;
            if (this.temperature < 0) this.temperature = 0;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        if (this.selected) {
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            ctx.strokeRect(-this.width/2 - 5, -this.height/2 - 5, this.width + 10, this.height + 10);
        }

        if (this.hovered && !this.selected) {
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.width/2 - 3, -this.height/2 - 3, this.width + 6, this.height + 6);
        }

        if (this.damaged) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        }

        if (this.temperature > 0) {
            var intensity = Math.min(this.temperature / 100, 1);
            ctx.shadowColor = 'rgba(239, 68, 68, ' + intensity + ')';
            ctx.shadowBlur = 20 * intensity;
        }

        ctx.restore();
    }

    containsPoint(x, y) {
        var dx = x - this.x;
        var dy = y - this.y;
        return Math.abs(dx) < this.width/2 && Math.abs(dy) < this.height/2;
    }

    getTerminalPosition(terminalId) {
        var terminal = this.terminals.find(function(t) { return t.id === terminalId; });
        if (!terminal) return null;

        var angle = (this.rotation * Math.PI) / 180;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        var rotatedX = terminal.x * cos - terminal.y * sin;
        var rotatedY = terminal.x * sin + terminal.y * cos;

        return {
            x: this.x + rotatedX,
            y: this.y + rotatedY
        };
    }

    getClosestTerminal(x, y, maxDistance) {
        if (maxDistance === undefined) maxDistance = 20;
        var closest = null;
        var minDist = maxDistance;

        for (var i = 0; i < this.terminals.length; i++) {
            var terminal = this.terminals[i];
            var pos = this.getTerminalPosition(terminal.id);
            var dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));

            if (dist < minDist) {
                minDist = dist;
                closest = terminal;
            }
        }

        return closest;
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            rotation: this.rotation
        };
    }

    fromJSON(data) {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation || 0;
    }

    getProperties() {
        return {
            'Type': this.type,
            'Voltage': this.voltage.toFixed(2) + 'V',
            'Current': (this.current * 1000).toFixed(1) + 'mA'
        };
    }

    reset() {
        this.voltage = 0;
        this.current = 0;
        this.damaged = false;
        this.temperature = 0;
    }
}
