/**
 * HardwareCanvas - Canvas interaction engine for Robotics Hardware Tab
 * Forked from CircuitSim's CircuitCanvas, stripped to robotics components only.
 * No CircuitSimulator integration, no basic electronics (battery, resistor, LED, etc).
 * Only handles: batteryPackAA, raspberryPi, motorController, dcMotor.
 */
class HardwareCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Components and wires
        this.components = [];
        this.wires = [];

        // Grid settings
        this.gridSize = 50;
        this.snapToGrid = true;

        // Interaction state
        this.selectedComponent = null;
        this.hoveredComponent = null;
        this.draggingComponent = null;
        this.dragOffset = { x: 0, y: 0 };

        // Wire drawing state
        this.drawingWire = false;
        this.wireStart = null; // { component, terminal }
        this.wireWaypoints = []; // Intermediate points for wire routing
        this.wirePreviewEnd = { x: 0, y: 0 };

        // Pan and zoom
        this.panOffset = { x: 0, y: 0 };
        this.scale = 1;
        this.minScale = 0.25;
        this.maxScale = 3;
        this.isPanning = false;
        this.panStart = { x: 0, y: 0 };
        this.spacePressed = false;

        // Animation
        this.lastTime = 0;
        this.animationId = null;

        // Visual effects system
        this.visualEffects = new VisualEffects(this.canvas);

        // Wiring validator
        this.validator = new RobotWiringValidator(this);

        // State change callback (set externally)
        this.onStateChange = null;
        this._lastStateJSON = '';

        this.setupCanvas();
        this.setupEventListeners();
        this.startAnimation();
    }

    /**
     * Setup canvas size
     */
    setupCanvas() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Resize canvas to fill container
     */
    resize() {
        var container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.render();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));

        // Mouse wheel for zoom
        this.canvas.addEventListener('wheel', (e) => this.onMouseWheel(e), { passive: false });

        // Keyboard events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Drag and drop from palette
        document.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('componentType', item.dataset.component);
            });
        });

        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            var componentType = e.dataTransfer.getData('componentType');
            if (componentType) {
                var rect = this.canvas.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var worldPos = this.screenToWorld(x, y);
                this.addComponent(componentType, worldPos.x, worldPos.y);
            }
        });
    }

    /**
     * Get mouse position relative to canvas
     */
    getMousePos(e) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    /**
     * Convert screen coordinates to world coordinates (accounting for pan and zoom)
     */
    screenToWorld(screenX, screenY) {
        return {
            x: (screenX - this.panOffset.x) / this.scale,
            y: (screenY - this.panOffset.y) / this.scale
        };
    }

    /**
     * Convert world coordinates to screen coordinates
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX * this.scale + this.panOffset.x,
            y: worldY * this.scale + this.panOffset.y
        };
    }

    /**
     * Snap position to grid
     */
    snapToGridPos(x, y) {
        if (!this.snapToGrid) return { x: x, y: y };
        return {
            x: Math.round(x / this.gridSize) * this.gridSize,
            y: Math.round(y / this.gridSize) * this.gridSize
        };
    }

    /**
     * Mouse down handler
     */
    onMouseDown(e) {
        var screenPos = this.getMousePos(e);

        // Middle mouse button or Space+Left mouse = pan
        if (e.button === 1 || (e.button === 0 && this.spacePressed)) {
            this.isPanning = true;
            this.panStart = { x: screenPos.x - this.panOffset.x, y: screenPos.y - this.panOffset.y };
            this.canvas.style.cursor = 'grabbing';
            e.preventDefault();
            return;
        }

        // Convert to world coordinates
        var pos = this.screenToWorld(screenPos.x, screenPos.y);

        // If currently drawing a wire, check for terminal or add waypoint
        if (this.drawingWire) {
            // Check if clicking on a terminal to finish wire
            for (var i = 0; i < this.components.length; i++) {
                var component = this.components[i];
                if (component === this.wireStart.component) continue; // Can't connect to self

                var terminal = component.getClosestTerminal(pos.x, pos.y, 15);
                if (terminal) {
                    this.finishWireDrawing(component, terminal.id);
                    return;
                }
            }

            // Not on a terminal, add waypoint on empty canvas
            this.wireWaypoints.push({ x: pos.x, y: pos.y });
            return;
        }

        // Check if clicking on a terminal to start wire drawing
        for (var i = 0; i < this.components.length; i++) {
            var terminal = this.components[i].getClosestTerminal(pos.x, pos.y, 15);
            if (terminal) {
                this.startWireDrawing(this.components[i], terminal.id);
                return;
            }
        }

        // Check if clicking on a component (iterate reverse for z-order)
        var clickedComponent = null;
        for (var i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].containsPoint(pos.x, pos.y)) {
                clickedComponent = this.components[i];
                break;
            }
        }

        if (clickedComponent) {
            this.selectComponent(clickedComponent);
            this.draggingComponent = clickedComponent;
            this.dragOffset = {
                x: pos.x - clickedComponent.x,
                y: pos.y - clickedComponent.y
            };
            return;
        }

        // Check if clicking on a wire
        for (var i = 0; i < this.wires.length; i++) {
            if (this.wires[i].containsPoint(pos.x, pos.y)) {
                this.selectWire(this.wires[i]);
                return;
            }
        }

        // Clicking on empty space, deselect
        this.selectComponent(null);
    }

    /**
     * Mouse move handler
     */
    onMouseMove(e) {
        var screenPos = this.getMousePos(e);

        // Handle panning
        if (this.isPanning) {
            this.panOffset.x = screenPos.x - this.panStart.x;
            this.panOffset.y = screenPos.y - this.panStart.y;
            return;
        }

        // Convert to world coordinates
        var pos = this.screenToWorld(screenPos.x, screenPos.y);

        // Update wire preview if drawing
        if (this.drawingWire) {
            this.wirePreviewEnd = pos;
            return;
        }

        // Drag component
        if (this.draggingComponent) {
            var snapped = this.snapToGridPos(
                pos.x - this.dragOffset.x,
                pos.y - this.dragOffset.y
            );
            this.draggingComponent.x = snapped.x;
            this.draggingComponent.y = snapped.y;
            return;
        }

        // Update hover state
        var hoveredComponent = null;
        for (var i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].containsPoint(pos.x, pos.y)) {
                hoveredComponent = this.components[i];
                break;
            }
        }

        // Update hover state for all components
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].hovered = (this.components[i] === hoveredComponent);
        }
        this.hoveredComponent = hoveredComponent;
    }

    /**
     * Mouse up handler
     */
    onMouseUp(e) {
        // Stop panning
        if (this.isPanning) {
            this.isPanning = false;
            this.canvas.style.cursor = this.spacePressed ? 'grab' : 'crosshair';
        }

        // Stop dragging and capture state if component was moved
        if (this.draggingComponent) {
            this.markDirty();
            this.draggingComponent = null;
        }
    }

    /**
     * Mouse wheel handler for zoom
     */
    onMouseWheel(e) {
        e.preventDefault();

        var screenPos = this.getMousePos(e);
        var worldPosBefore = this.screenToWorld(screenPos.x, screenPos.y);

        // Zoom in/out
        var zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        var newScale = this.scale * zoomFactor;

        // Clamp scale
        this.scale = Math.max(this.minScale, Math.min(this.maxScale, newScale));

        // Adjust pan to zoom towards mouse cursor
        var worldPosAfter = this.screenToWorld(screenPos.x, screenPos.y);
        this.panOffset.x += (worldPosAfter.x - worldPosBefore.x) * this.scale;
        this.panOffset.y += (worldPosAfter.y - worldPosBefore.y) * this.scale;
    }

    /**
     * Key down handler
     */
    onKeyDown(e) {
        // Space key, enable pan mode
        if (e.key === ' ' && !this.spacePressed && e.target === document.body) {
            this.spacePressed = true;
            if (!this.isPanning) {
                this.canvas.style.cursor = 'grab';
            }
            e.preventDefault();
            return;
        }

        // Escape key, cancel wire drawing
        if (e.key === 'Escape') {
            if (this.drawingWire) {
                this.cancelWireDrawing();
                e.preventDefault();
                return;
            }
        }

        // Reset zoom with '0' key
        if (e.key === '0') {
            if (this.components.length > 0) {
                this.centerOnComponents();
            } else {
                this.scale = 1;
                this.panOffset = { x: 0, y: 0 };
            }
            e.preventDefault();
            return;
        }

        // Zoom in with '+'
        if (e.key === '+' || e.key === '=') {
            var centerX = this.canvas.width / 2;
            var centerY = this.canvas.height / 2;
            var worldPosBefore = this.screenToWorld(centerX, centerY);
            this.scale = Math.min(this.maxScale, this.scale * 1.2);
            var worldPosAfter = this.screenToWorld(centerX, centerY);
            this.panOffset.x += (worldPosAfter.x - worldPosBefore.x) * this.scale;
            this.panOffset.y += (worldPosAfter.y - worldPosBefore.y) * this.scale;
            e.preventDefault();
            return;
        }

        // Zoom out with '-'
        if (e.key === '-' || e.key === '_') {
            var centerX = this.canvas.width / 2;
            var centerY = this.canvas.height / 2;
            var worldPosBefore = this.screenToWorld(centerX, centerY);
            this.scale = Math.max(this.minScale, this.scale / 1.2);
            var worldPosAfter = this.screenToWorld(centerX, centerY);
            this.panOffset.x += (worldPosAfter.x - worldPosBefore.x) * this.scale;
            this.panOffset.y += (worldPosAfter.y - worldPosBefore.y) * this.scale;
            e.preventDefault();
            return;
        }

        // Delete selected component or wire
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (this.selectedComponent) {
                this.deleteComponent(this.selectedComponent);
                e.preventDefault();
            } else {
                // Check if any wire is selected
                var selectedWire = this.wires.find(function(w) { return w.selected; });
                if (selectedWire) {
                    this.deleteWire(selectedWire);
                    e.preventDefault();
                }
            }
        }

        // Rotate selected component
        if (e.key === 'r' || e.key === 'R') {
            if (this.selectedComponent) {
                this.selectedComponent.rotation = (this.selectedComponent.rotation + 45) % 360;
                this.markDirty();
                e.preventDefault();
            }
        }

        // Toggle grid snap
        if (e.key === 'g' || e.key === 'G') {
            this.snapToGrid = !this.snapToGrid;
            e.preventDefault();
        }
    }

    /**
     * Key up handler
     */
    onKeyUp(e) {
        // Space key released, disable pan mode
        if (e.key === ' ') {
            this.spacePressed = false;
            if (!this.isPanning) {
                this.canvas.style.cursor = 'crosshair';
            }
        }
    }

    /**
     * Start drawing a wire
     */
    startWireDrawing(component, terminalId) {
        this.drawingWire = true;
        this.wireStart = { component: component, terminal: terminalId };
        this.wireWaypoints = [];
        var pos = component.getTerminalPosition(terminalId);
        this.wirePreviewEnd = pos;
    }

    /**
     * Finish drawing a wire
     */
    finishWireDrawing(toComponent, toTerminalId) {
        var wire = new Wire(
            this.wireStart.component,
            this.wireStart.terminal,
            toComponent,
            toTerminalId,
            this.wireWaypoints
        );
        this.wires.push(wire);
        this.cancelWireDrawing();
        this.markDirty();
    }

    /**
     * Cancel wire drawing
     */
    cancelWireDrawing() {
        this.drawingWire = false;
        this.wireStart = null;
        this.wireWaypoints = [];
    }

    /**
     * Add a component (only robotics types)
     */
    addComponent(type, x, y) {
        var snapped = this.snapToGridPos(x, y);
        var component;

        switch (type) {
            case 'batteryPackAA':
                component = new BatteryPackAA(snapped.x, snapped.y);
                break;
            case 'raspberryPi':
                component = new RaspberryPi(snapped.x, snapped.y);
                break;
            case 'motorController':
                component = new MotorController(snapped.x, snapped.y);
                break;
            case 'dcMotor':
                component = new DCMotor(snapped.x, snapped.y);
                break;
            default:
                return;
        }

        this.components.push(component);
        this.selectComponent(component);
        this.markDirty();

        // Hide empty state
        var emptyState = document.getElementById('empty-state');
        if (emptyState && this.components.length > 0) {
            emptyState.style.display = 'none';
        }
    }

    /**
     * Mark canvas as having unsaved changes.
     * Pushes history state and fires onStateChange callback.
     */
    markDirty() {
        // Capture state for undo/redo
        if (window.historyManager) {
            window.historyManager.pushState();
        }

        // Check and fire state change
        this._checkAndNotifyStateChange();
    }

    /**
     * Delete a component and all connected wires
     */
    deleteComponent(component) {
        // Remove wires connected to this component
        this.wires = this.wires.filter(function(wire) { return !wire.connectsTo(component); });

        // Remove component
        this.components = this.components.filter(function(c) { return c !== component; });

        this.selectComponent(null);
        this.markDirty();

        // Show empty state if no components
        if (this.components.length === 0) {
            var emptyState = document.getElementById('empty-state');
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        }
    }

    /**
     * Delete a wire
     */
    deleteWire(wire) {
        this.wires = this.wires.filter(function(w) { return w !== wire; });
        this.updatePropertiesPanel(null);
        this.markDirty();
    }

    /**
     * Select a component
     */
    selectComponent(component) {
        // Deselect all
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].selected = false;
        }
        for (var i = 0; i < this.wires.length; i++) {
            this.wires[i].selected = false;
        }

        if (component) {
            component.selected = true;
        }

        this.selectedComponent = component;
        this.updatePropertiesPanel();
    }

    /**
     * Select a wire
     */
    selectWire(wire) {
        // Deselect all
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].selected = false;
        }
        for (var i = 0; i < this.wires.length; i++) {
            this.wires[i].selected = false;
        }

        wire.selected = true;
        this.selectedComponent = null;
        this.updatePropertiesPanel(wire);
    }

    /**
     * Update properties panel.
     * Simplified: only Raspberry Pi gets interactive GPIO controls.
     * Other components get generic property display.
     */
    updatePropertiesPanel(item) {
        var target = (arguments.length > 0) ? item : this.selectedComponent;
        var container = document.getElementById('properties-content');
        if (!container) return;

        if (!target) {
            container.innerHTML =
                '<div class="property-group">' +
                    '<div class="property-label">Status</div>' +
                    '<div class="property-value">No component selected</div>' +
                '</div>';
            return;
        }

        var html = '';

        if (target.type === 'raspberryPi') {
            html = this.buildRaspberryPiProperties(target);
        } else {
            // Generic display for batteryPackAA, motorController, dcMotor, wires
            var properties = target.getProperties();
            var keys = Object.keys(properties);
            for (var i = 0; i < keys.length; i++) {
                html +=
                    '<div class="property-group">' +
                        '<div class="property-label">' + keys[i] + '</div>' +
                        '<div class="property-value">' + properties[keys[i]] + '</div>' +
                    '</div>';
            }
        }

        container.innerHTML = html;
        this.attachPropertyEventListeners(target);
    }

    /**
     * Build Raspberry Pi properties with GPIO toggle buttons
     */
    buildRaspberryPiProperties(pi) {
        var gpioALabel = pi.gpioA ? 'HIGH' : 'LOW';
        var gpioBLabel = pi.gpioB ? 'HIGH' : 'LOW';
        var gpioAStyle = pi.gpioA ? 'background: rgba(46,204,113,0.3); border-color: #2ecc71;' : '';
        var gpioBStyle = pi.gpioB ? 'background: rgba(46,204,113,0.3); border-color: #2ecc71;' : '';
        var disabled = !pi.poweredOn ? 'opacity: 0.5; pointer-events: none;' : '';

        return '' +
            '<div class="property-group">' +
                '<div class="property-label">Type</div>' +
                '<div class="property-value">Raspberry Pi</div>' +
            '</div>' +
            '<div class="property-group">' +
                '<div class="property-label">Power</div>' +
                '<div class="property-value">' + (pi.poweredOn ? 'ON' : 'OFF') + '</div>' +
            '</div>' +
            '<div class="property-group editable" style="' + disabled + '">' +
                '<div class="property-label">GPIO A</div>' +
                '<button class="property-button" id="prop-gpio-a" style="' + gpioAStyle + '">' +
                    gpioALabel +
                '</button>' +
            '</div>' +
            '<div class="property-group editable" style="' + disabled + '">' +
                '<div class="property-label">GPIO B</div>' +
                '<button class="property-button" id="prop-gpio-b" style="' + gpioBStyle + '">' +
                    gpioBLabel +
                '</button>' +
            '</div>' +
            '<div class="property-group">' +
                '<div class="property-label" style="font-size: 10px; color: #888; font-style: italic;">Toggle pins to send signals to the motor controller</div>' +
            '</div>';
    }

    /**
     * Attach event listeners to interactive property controls.
     * Only GPIO toggle buttons for Raspberry Pi.
     */
    attachPropertyEventListeners(component) {
        var self = this;

        // GPIO A toggle
        var gpioABtn = document.getElementById('prop-gpio-a');
        if (gpioABtn) {
            gpioABtn.addEventListener('click', function() {
                component.gpioA = !component.gpioA;
                self.validator.invalidate();
                self.updatePropertiesPanel();
                self.markDirty();
            });
        }

        // GPIO B toggle
        var gpioBBtn = document.getElementById('prop-gpio-b');
        if (gpioBBtn) {
            gpioBBtn.addEventListener('click', function() {
                component.gpioB = !component.gpioB;
                self.validator.invalidate();
                self.updatePropertiesPanel();
                self.markDirty();
            });
        }
    }

    /**
     * Clear all components and wires
     */
    clear() {
        this.components = [];
        this.wires = [];
        this.selectedComponent = null;
        this.selectComponent(null);

        var emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }

    /**
     * Start animation loop
     */
    startAnimation() {
        this.lastTime = performance.now();
        this.animate();
    }

    /**
     * Animation loop.
     * Runs validator, updates components/wires/effects, renders, checks state.
     * No CircuitSimulator integration (robotics-only).
     */
    animate() {
        var currentTime = performance.now();
        var deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;

        // Run robotics wiring validator
        this.validator.validate();

        // Update components (visual state, animations)
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].update(deltaTime);
        }

        // Update wires (current flow particles, etc.)
        for (var i = 0; i < this.wires.length; i++) {
            this.wires[i].update(deltaTime);
        }

        // Update visual effects
        this.visualEffects.update(deltaTime);

        // Render
        this.render();

        // Check if state changed and fire callback
        this._checkAndNotifyStateChange();

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Render the canvas
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0f3460';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context and apply transformations
        this.ctx.save();
        this.ctx.translate(this.panOffset.x, this.panOffset.y);
        this.ctx.scale(this.scale, this.scale);

        // Draw grid
        this.drawGrid();

        // Draw wires
        for (var i = 0; i < this.wires.length; i++) {
            this.wires[i].draw(this.ctx);
        }

        // Draw wire preview with waypoints
        if (this.drawingWire && this.wireStart) {
            var startPos = this.wireStart.component.getTerminalPosition(this.wireStart.terminal);
            this.ctx.strokeStyle = '#60a5fa';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([5, 5]);
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(startPos.x, startPos.y);

            // Draw through waypoints
            for (var i = 0; i < this.wireWaypoints.length; i++) {
                this.ctx.lineTo(this.wireWaypoints[i].x, this.wireWaypoints[i].y);
            }

            this.ctx.lineTo(this.wirePreviewEnd.x, this.wirePreviewEnd.y);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // Draw waypoint markers
            this.ctx.fillStyle = '#60a5fa';
            for (var i = 0; i < this.wireWaypoints.length; i++) {
                this.ctx.beginPath();
                this.ctx.arc(this.wireWaypoints[i].x, this.wireWaypoints[i].y, 5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        // Draw components
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].draw(this.ctx);
        }

        // Draw visual effects (on top of everything)
        this.visualEffects.draw(this.ctx);

        // Restore context
        this.ctx.restore();

        // Draw zoom indicator (in screen space)
        this.drawZoomIndicator();
    }

    /**
     * Draw zoom level indicator
     */
    drawZoomIndicator() {
        if (this.scale !== 1) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(10, 10, 80, 30);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText((this.scale * 100).toFixed(0) + '%', 50, 25);
            this.ctx.restore();
        }
    }

    /**
     * Draw grid
     */
    drawGrid() {
        if (!this.snapToGrid) return;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1 / this.scale;

        // Calculate visible area in world coordinates
        var topLeft = this.screenToWorld(0, 0);
        var bottomRight = this.screenToWorld(this.canvas.width, this.canvas.height);

        // Snap to grid
        var startX = Math.floor(topLeft.x / this.gridSize) * this.gridSize;
        var startY = Math.floor(topLeft.y / this.gridSize) * this.gridSize;
        var endX = Math.ceil(bottomRight.x / this.gridSize) * this.gridSize;
        var endY = Math.ceil(bottomRight.y / this.gridSize) * this.gridSize;

        // Vertical lines
        for (var x = startX; x <= endX; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (var y = startY; y <= endY; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }
    }

    /**
     * Serialize canvas state to JSON
     */
    toJSON() {
        return {
            version: '1.0',
            components: this.components.map(function(c) { return c.toJSON(); }),
            wires: this.wires.map(function(w) { return w.toJSON(); })
        };
    }

    /**
     * Load canvas state from JSON (only robotics component types)
     */
    fromJSON(data) {
        this.clear();

        if (!data || !data.components) return;

        // Restore components (only robotics types)
        var componentMap = new Map();
        for (var i = 0; i < data.components.length; i++) {
            var compData = data.components[i];
            var component = null;

            switch (compData.type) {
                case 'batteryPackAA':
                    component = new BatteryPackAA();
                    break;
                case 'raspberryPi':
                    component = new RaspberryPi();
                    break;
                case 'motorController':
                    component = new MotorController();
                    break;
                case 'dcMotor':
                    component = new DCMotor();
                    break;
            }

            if (component) {
                component.fromJSON(compData);
                this.components.push(component);
                componentMap.set(compData.id, component);
            }
        }

        // Restore wires
        if (data.wires) {
            for (var i = 0; i < data.wires.length; i++) {
                var wireData = data.wires[i];
                var fromComp = componentMap.get(wireData.from.componentId);
                var toComp = componentMap.get(wireData.to.componentId);

                if (fromComp && toComp) {
                    var wire = new Wire(
                        fromComp,
                        wireData.from.terminal,
                        toComp,
                        wireData.to.terminal,
                        wireData.waypoints || []
                    );
                    wire.id = wireData.id;
                    this.wires.push(wire);
                }
            }
        }

        // Hide empty state if we have components
        var emptyState = document.getElementById('empty-state');
        if (emptyState && this.components.length > 0) {
            emptyState.style.display = 'none';
        }

        // Force validator recheck
        this.validator.invalidate();

        // Center the view on loaded components
        this.centerOnComponents();
    }

    /**
     * Pan and zoom so all components are centered and visible in the canvas.
     */
    centerOnComponents() {
        if (this.components.length === 0) return;

        // Calculate bounding box of all components in world space
        var minX = Infinity, minY = Infinity;
        var maxX = -Infinity, maxY = -Infinity;

        for (var i = 0; i < this.components.length; i++) {
            var c = this.components[i];
            var hw = (c.width || 60) / 2 + 20;
            var hh = (c.height || 60) / 2 + 20;
            if (c.x - hw < minX) minX = c.x - hw;
            if (c.y - hh < minY) minY = c.y - hh;
            if (c.x + hw > maxX) maxX = c.x + hw;
            if (c.y + hh > maxY) maxY = c.y + hh;
        }

        var contentW = maxX - minX;
        var contentH = maxY - minY;
        var centerX = (minX + maxX) / 2;
        var centerY = (minY + maxY) / 2;

        // Fit to canvas with padding
        var canvasW = this.canvas.width;
        var canvasH = this.canvas.height;
        var padding = 60;
        var scaleX = (canvasW - padding * 2) / contentW;
        var scaleY = (canvasH - padding * 2) / contentH;
        var fitScale = Math.min(scaleX, scaleY, 1.5); // don't zoom in too much
        fitScale = Math.max(this.minScale, Math.min(this.maxScale, fitScale));

        this.scale = fitScale;
        this.panOffset.x = (canvasW / 2) - (centerX * fitScale);
        this.panOffset.y = (canvasH / 2) - (centerY * fitScale);
    }

    /**
     * Get current hardware state for parent communication.
     * Returns wiring progress, completion status, and circuit data.
     */
    getHardwareState() {
        var progress = this.validator.getProgress();
        var total = this.validator.getTotal();
        var hasComponents = this.validator.hasRoboticsComponents();

        return {
            hasComponents: hasComponents,
            wiringComplete: total > 0 && progress === total,
            wiringProgress: progress,
            wiringTotal: total,
            circuitData: this.toJSON()
        };
    }

    /**
     * Compare current state against last snapshot and fire onStateChange if different.
     * Uses JSON stringification for deep comparison.
     */
    _checkAndNotifyStateChange() {
        if (!this.onStateChange) return;

        var state = this.getHardwareState();
        var stateJSON = JSON.stringify({
            hasComponents: state.hasComponents,
            wiringComplete: state.wiringComplete,
            wiringProgress: state.wiringProgress,
            wiringTotal: state.wiringTotal
        });

        if (stateJSON !== this._lastStateJSON) {
            this._lastStateJSON = stateJSON;
            this.onStateChange(state);
        }
    }
}
