/**
 * BatteryPackAA - 4xAA Battery Pack (6V fixed)
 * Robotics component for powering Pi and motor controller
 */
class BatteryPackAA extends Component {
    constructor(x, y) {
        super('batteryPackAA', x || 0, y || 0);
        this.width = 90;
        this.height = 50;
        this.voltage = 6;

        this.terminals = [
            { id: 'positive', x: 45, y: 0, polarity: '+' },
            { id: 'negative', x: -45, y: 0, polarity: '-' }
        ];
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        // Battery pack body
        ctx.fillStyle = '#2d2d2d';
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-40, -22, 80, 44, 4);
        ctx.fill();
        ctx.stroke();

        // Draw 4 AA cells
        var cellWidth = 16;
        var cellGap = 2;
        var startX = -35;
        for (var i = 0; i < 4; i++) {
            var cx = startX + i * (cellWidth + cellGap);
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(cx, -14, cellWidth, 28);
            ctx.fillStyle = '#888';
            ctx.fillRect(cx + 6, -16, 4, 3);
            ctx.fillStyle = '#666';
            ctx.font = '7px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('AA', cx + cellWidth / 2, 0);
        }

        // Red wire stub (positive)
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(38, 0);
        ctx.lineTo(45, 0);
        ctx.stroke();

        // Black wire stub (negative)
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-38, 0);
        ctx.lineTo(-45, 0);
        ctx.stroke();

        // Voltage label
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('6V', 0, -22);

        // Terminal dots
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(45, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-45, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // Polarity labels
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('+', 45, -10);
        ctx.fillStyle = '#3498db';
        ctx.fillText('-', -45, -10);

        ctx.restore();
    }

    getProperties() {
        return {
            'Type': '4xAA Battery Pack',
            'Voltage': '6V (4 x 1.5V)'
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
        this.voltage = 6;
    }
}
