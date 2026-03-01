/**
 * VisualEffects - Handles dramatic visual effects like smoke, sparks, and explosions
 */
class VisualEffects {
    constructor(canvas) {
        this.canvas = canvas;
        this.effects = [];
    }

    createSmoke(x, y, color) {
        if (!color) color = '#666';
        for (var i = 0; i < 10; i++) {
            this.effects.push({
                type: 'smoke',
                x: x + (Math.random() - 0.5) * 20,
                y: y,
                vx: (Math.random() - 0.5) * 50,
                vy: -50 - Math.random() * 50,
                size: 5 + Math.random() * 10,
                alpha: 0.8,
                color: color,
                life: 1.0,
                createdAt: Date.now()
            });
        }
    }

    createSparks(x, y, count) {
        if (!count) count = 15;
        for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 100 + Math.random() * 150;
            this.effects.push({
                type: 'spark',
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 3,
                alpha: 1.0,
                color: Math.random() > 0.5 ? '#ff6b35' : '#ffd93d',
                life: 1.0,
                createdAt: Date.now()
            });
        }
    }

    createExplosion(x, y) {
        this.effects.push({
            type: 'explosion', x: x, y: y,
            size: 10, maxSize: 80, alpha: 1.0, life: 1.0,
            createdAt: Date.now()
        });
    }

    createArc(x1, y1, x2, y2) {
        this.effects.push({
            type: 'arc', x1: x1, y1: y1, x2: x2, y2: y2,
            alpha: 1.0, life: 1.0,
            segments: this.generateArcSegments(x1, y1, x2, y2),
            createdAt: Date.now()
        });
    }

    generateArcSegments(x1, y1, x2, y2) {
        var segments = [];
        var steps = 8;
        for (var i = 0; i <= steps; i++) {
            var t = i / steps;
            segments.push({
                x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30,
                y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 30
            });
        }
        return segments;
    }

    update(deltaTime) {
        var now = Date.now();
        this.effects = this.effects.filter(function(effect) {
            var age = (now - effect.createdAt) / 1000;
            effect.life = Math.max(0, 1 - age);
            if (effect.life <= 0) return false;
            switch (effect.type) {
                case 'smoke':
                    effect.x += effect.vx * deltaTime;
                    effect.y += effect.vy * deltaTime;
                    effect.vy += 30 * deltaTime;
                    effect.size += 20 * deltaTime;
                    effect.alpha = effect.life * 0.6;
                    break;
                case 'spark':
                    effect.x += effect.vx * deltaTime;
                    effect.y += effect.vy * deltaTime;
                    effect.vy += 400 * deltaTime;
                    effect.alpha = effect.life;
                    break;
                case 'explosion':
                    effect.size += (effect.maxSize - effect.size) * deltaTime * 10;
                    effect.alpha = effect.life;
                    break;
                case 'arc':
                    effect.alpha = effect.life;
                    break;
            }
            return true;
        });
    }

    draw(ctx) {
        ctx.save();
        for (var i = 0; i < this.effects.length; i++) {
            var effect = this.effects[i];
            ctx.globalAlpha = effect.alpha;
            switch (effect.type) {
                case 'smoke':
                    var sg = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, effect.size);
                    sg.addColorStop(0, effect.color);
                    sg.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = sg;
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'spark':
                    ctx.fillStyle = effect.color;
                    ctx.shadowColor = effect.color;
                    ctx.shadowBlur = 5;
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    break;
                case 'explosion':
                    var eg = ctx.createRadialGradient(effect.x, effect.y, 0, effect.x, effect.y, effect.size);
                    eg.addColorStop(0, 'rgba(255, 255, 255, 1)');
                    eg.addColorStop(0.3, 'rgba(255, 200, 0, 0.8)');
                    eg.addColorStop(0.6, 'rgba(255, 100, 0, 0.4)');
                    eg.addColorStop(1, 'rgba(255, 0, 0, 0)');
                    ctx.fillStyle = eg;
                    ctx.beginPath();
                    ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'arc':
                    ctx.strokeStyle = '#6dd5ed';
                    ctx.lineWidth = 3;
                    ctx.shadowColor = '#6dd5ed';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.moveTo(effect.segments[0].x, effect.segments[0].y);
                    for (var j = 1; j < effect.segments.length; j++) {
                        ctx.lineTo(effect.segments[j].x, effect.segments[j].y);
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    break;
            }
        }
        ctx.restore();
    }

    clear() {
        this.effects = [];
    }
}
