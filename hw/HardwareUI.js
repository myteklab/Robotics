/**
 * HardwareUI - Simplified UI for Robotics Hardware Tab
 * Manages wiring checklist, guidance, and undo/redo state
 */
class HardwareUI {
    constructor(canvas) {
        this.canvas = canvas; // HardwareCanvas instance
        this._lastProgress = -1;
        this._lastTotal = -1;
    }

    /**
     * Update the wiring checklist panel
     */
    updateChecklist() {
        var validator = this.canvas.validator;
        var progress = validator.getProgress();
        var total = validator.getTotal();
        var checklist = validator.getChecklist();
        var hasComponents = validator.hasRoboticsComponents();

        // Progress bar
        var progressBar = document.getElementById('hw-progress-bar');
        var progressText = document.getElementById('hw-progress-text');
        if (progressBar && progressText) {
            if (total > 0) {
                var pct = Math.round((progress / total) * 100);
                progressBar.style.width = pct + '%';
                progressBar.style.backgroundColor = progress === total ? '#2ecc71' : '#3498db';
                progressText.textContent = progress + ' / ' + total + ' connections';
            } else if (hasComponents) {
                progressBar.style.width = '0%';
                progressText.textContent = 'Add all components to begin';
            } else {
                progressBar.style.width = '0%';
                progressText.textContent = 'Drag components to begin';
            }
        }

        // Checklist items
        var checklistEl = document.getElementById('hw-checklist');
        if (checklistEl) {
            if (checklist.length === 0) {
                checklistEl.innerHTML = '<div class="hw-checklist-empty">Add Battery, Pi, Controller, and 2 Motors to see wiring checklist</div>';
            } else {
                var html = '';
                for (var i = 0; i < checklist.length; i++) {
                    var item = checklist[i];
                    var icon = item.connected ? '<span class="hw-check-icon done">&#10003;</span>' : '<span class="hw-check-icon pending">&#9675;</span>';
                    var cls = item.connected ? 'hw-checklist-item done' : 'hw-checklist-item';
                    html += '<div class="' + cls + '">' + icon + '<span>' + item.label + '</span></div>';
                }
                checklistEl.innerHTML = html;
            }
        }

        // Guidance message
        this.updateGuidance(hasComponents, progress, total);

        // Complete indicator
        var completeEl = document.getElementById('hw-complete');
        if (completeEl) {
            completeEl.style.display = (progress === total && total > 0) ? 'block' : 'none';
        }

        this._lastProgress = progress;
        this._lastTotal = total;
    }

    /**
     * Show contextual guidance based on current state
     */
    updateGuidance(hasComponents, progress, total) {
        var guidanceEl = document.getElementById('hw-guidance');
        if (!guidanceEl) return;

        var comps = this.canvas.validator.findComponents();
        var msg = '';

        if (!hasComponents) {
            msg = 'Drag a Battery Pack onto the canvas to begin building your robot circuit.';
        } else if (!comps.battery) {
            msg = 'Add a Battery Pack to power the circuit.';
        } else if (!comps.pi) {
            msg = 'Now add a Raspberry Pi as the brain of your robot.';
        } else if (!comps.controller) {
            msg = 'Add a Motor Controller (L298N) to drive the motors.';
        } else if (comps.motors.length === 0) {
            msg = 'Add DC Motors to complete your robot hardware.';
        } else if (total > 0 && progress < total) {
            msg = 'Connect the wires! Click a terminal dot, then click another terminal to wire them.';
        } else if (progress === total && total > 0) {
            msg = 'All wired up! Toggle GPIO pins to test the motors. Your robot is ready to code!';
        }

        guidanceEl.textContent = msg;
    }

    /**
     * Show a brief status toast
     */
    showStatus(message, type, duration) {
        var toast = document.getElementById('hw-toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className = 'hw-toast show ' + (type || 'info');
        clearTimeout(this._toastTimeout);
        this._toastTimeout = setTimeout(function() {
            toast.className = 'hw-toast';
        }, duration || 2000);
    }
}
