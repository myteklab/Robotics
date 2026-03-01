/**
 * DCMotor - DC Motor with wheel visuals on shaft
 * Enhanced for Robotics Hardware Tab: shows tire/wheel spinning
 */
class DCMotor extends Component {
    constructor(x, y) {
        super('dcMotor', x || 0, y || 0);
        this.width = 60;
        this.height = 75; // Taller to accommodate wheel

        this.spinning = false;
        this.spinAngle = 0;

        this.terminals = [
            { id: 'terminal_1', x: -30, y: 0 },
            { id: 'terminal_2', x: 30, y: 0 }
        ];
    }

    update(deltaTime) {
        if (this.spinning) {
            this.spinAngle += deltaTime * 5;
            if (this.spinAngle > Math.PI * 2) {
                this.spinAngle -= Math.PI * 2;
            }
        }
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        // Motor body (circle)
        var radius = 25;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.spinning ? '#1a4a2a' : '#2c3e50';
        ctx.fill();
        ctx.strokeStyle = this.spinning ? '#27ae60' : '#555';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Spinning animation
        if (this.spinning) {
            ctx.save();
            ctx.rotate(this.spinAngle);
            ctx.strokeStyle = '#27ae60';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();

            // Glow
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(39, 174, 96, 0.4)';
            ctx.lineWidth = 4;
            ctx.stroke();
        }

        // "M" label
        ctx.fillStyle = this.spinning ? '#4ade80' : '#95a5a6';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('M', 0, 0);

        // Shaft line
        ctx.strokeStyle = '#777';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, -radius - 8);
        ctx.stroke();

        // Shaft cap
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.arc(0, -radius - 8, 3, 0, Math.PI * 2);
        ctx.fill();

        // === Wheel on shaft ===
        var wheelY = -radius - 18;
        var wheelRadius = 12;

        ctx.save();
        ctx.translate(0, wheelY);

        // Wheel spins with motor
        if (this.spinning) {
            ctx.rotate(this.spinAngle);
        }

        // Tire (dark rubber)
        ctx.beginPath();
        ctx.arc(0, 0, wheelRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rim
        ctx.beginPath();
        ctx.arc(0, 0, wheelRadius - 3, 0, Math.PI * 2);
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Hub
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#777';
        ctx.fill();

        // Tread marks (small dashes around circumference)
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1.5;
        for (var i = 0; i < 8; i++) {
            var angle = (i / 8) * Math.PI * 2;
            var innerR = wheelRadius - 2;
            var outerR = wheelRadius + 1;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
            ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
            ctx.stroke();
        }

        // Spokes
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        for (var j = 0; j < 4; j++) {
            var a = (j / 4) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * (wheelRadius - 4), Math.sin(a) * (wheelRadius - 4));
            ctx.stroke();
        }

        ctx.restore();

        // Terminal dots
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(-30, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(30, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // Terminal labels
        ctx.fillStyle = '#aaa';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('1', -30, 14);
        ctx.fillText('2', 30, 14);

        ctx.restore();
    }

    getProperties() {
        return {
            'Type': 'DC Motor',
            'Status': this.spinning ? 'Spinning' : 'Idle'
        };
    }

    reset() {
        this.current = 0;
        this.damaged = false;
        this.temperature = 0;
    }

    toJSON() { return super.toJSON(); }

    fromJSON(data) {
        super.fromJSON(data);
        this.spinning = false;
        this.spinAngle = 0;
    }
}
