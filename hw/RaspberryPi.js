/**
 * RaspberryPi - Simplified Raspberry Pi with key pins
 * Robotics component with power input and GPIO outputs
 */
class RaspberryPi extends Component {
    constructor(x, y) {
        super('raspberryPi', x || 0, y || 0);
        this.width = 100;
        this.height = 60;

        this.poweredOn = false;
        this.gpioA = false;
        this.gpioB = false;

        this.terminals = [
            { id: '5V_IN', x: -50, y: -15, polarity: '+' },
            { id: 'GND', x: -50, y: 15, polarity: '-' },
            { id: 'GPIO_A', x: 50, y: -15 },
            { id: 'GPIO_B', x: 50, y: 15 }
        ];
    }

    draw(ctx) {
        super.draw(ctx);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        // PCB
        ctx.fillStyle = '#1a5c2a';
        ctx.strokeStyle = '#2d8a4e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-45, -27, 90, 54, 3);
        ctx.fill();
        ctx.stroke();

        // Chip
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(-18, -14, 36, 28);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-18, -14, 36, 28);

        // Chip dot
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(-14, -10, 2, 0, Math.PI * 2);
        ctx.fill();

        // GPIO header dots (right)
        ctx.fillStyle = '#555';
        for (var row = 0; row < 2; row++) {
            for (var col = 0; col < 4; col++) {
                ctx.beginPath();
                ctx.arc(22 + col * 5, -8 + row * 16, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Power header dots (left)
        ctx.fillStyle = '#555';
        for (var col2 = 0; col2 < 3; col2++) {
            ctx.beginPath();
            ctx.arc(-32 + col2 * 5, -15, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-32 + col2 * 5, 15, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Power LED
        var ledX = 30, ledY = -22;
        if (this.poweredOn) {
            var gradient = ctx.createRadialGradient(ledX, ledY, 0, ledX, ledY, 8);
            gradient.addColorStop(0, 'rgba(39, 174, 96, 0.8)');
            gradient.addColorStop(1, 'rgba(39, 174, 96, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(ledX, ledY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#2ecc71';
        } else {
            ctx.fillStyle = '#c0392b';
        }
        ctx.beginPath();
        ctx.arc(ledX, ledY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.fillStyle = '#aaa';
        ctx.font = '8px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('5V', -42, -20);
        ctx.fillText('GND', -38, 10);
        ctx.textAlign = 'left';
        ctx.fillText('GPIO A', 28, -20);
        ctx.fillText('GPIO B', 28, 10);

        // Pi label
        ctx.fillStyle = this.poweredOn ? '#4ade80' : '#666';
        ctx.font = 'bold 9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Raspberry Pi', 0, 24);

        // Terminal dots
        for (var i = 0; i < this.terminals.length; i++) {
            var terminal = this.terminals[i];
            if (terminal.id === 'GPIO_A' && this.poweredOn && this.gpioA) {
                ctx.fillStyle = '#2ecc71';
            } else if (terminal.id === 'GPIO_B' && this.poweredOn && this.gpioB) {
                ctx.fillStyle = '#2ecc71';
            } else {
                ctx.fillStyle = '#fbbf24';
            }
            ctx.beginPath();
            ctx.arc(terminal.x, terminal.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    getProperties() {
        return {
            'Type': 'Raspberry Pi',
            'Power': this.poweredOn ? 'ON' : 'OFF',
            'GPIO_A': this.gpioA ? 'HIGH' : 'LOW',
            'GPIO_B': this.gpioB ? 'HIGH' : 'LOW'
        };
    }

    reset() {
        this.current = 0;
        this.damaged = false;
        this.temperature = 0;
    }

    toJSON() {
        var data = super.toJSON();
        data.gpioA = this.gpioA;
        data.gpioB = this.gpioB;
        return data;
    }

    fromJSON(data) {
        super.fromJSON(data);
        this.poweredOn = false;
        this.gpioA = data.gpioA || false;
        this.gpioB = data.gpioB || false;
    }
}
