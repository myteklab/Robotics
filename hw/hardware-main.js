/**
 * hardware-main.js - Robotics Hardware Tab initialization and parent communication
 */
(function() {
    'use strict';

    var hwCanvas = null;
    var hwUI = null;
    var historyManager = null;
    var isEmbedded = (window.parent !== window);

    // Initialize when DOM is ready
    function init() {
        hwCanvas = new HardwareCanvas('hw-canvas');
        hwUI = new HardwareUI(hwCanvas);
        historyManager = new HistoryManager(hwCanvas);

        // Make accessible for undo/redo buttons
        window.historyManager = historyManager;
        window.hwCanvas = hwCanvas;

        // Wire state change callback
        hwCanvas.onStateChange = function(state) {
            hwUI.updateChecklist();

            // Send state to parent if embedded
            if (isEmbedded) {
                window.parent.postMessage({
                    type: 'robotics:hardwareState',
                    state: state
                }, '*');
            }
        };

        // Setup undo/redo buttons
        var undoBtn = document.getElementById('btn-undo');
        var redoBtn = document.getElementById('btn-redo');
        if (undoBtn) {
            undoBtn.addEventListener('click', function() {
                historyManager.undo();
            });
        }
        if (redoBtn) {
            redoBtn.addEventListener('click', function() {
                historyManager.redo();
            });
        }

        // Keyboard shortcut for undo/redo
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    historyManager.redo();
                } else {
                    historyManager.undo();
                }
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                historyManager.redo();
            }
        });

        // Initial UI update
        hwUI.updateChecklist();

        // Listen for messages from parent (Robotics app)
        if (isEmbedded) {
            window.addEventListener('message', function(event) {
                var data = event.data;
                if (!data || !data.type) return;

                if (data.type === 'robotics:loadHardware') {
                    // Restore saved circuit
                    if (data.circuitData) {
                        hwCanvas.fromJSON(data.circuitData);
                        historyManager.clear();
                        hwUI.updateChecklist();
                    }
                } else if (data.type === 'robotics:requestHardwareState') {
                    // Parent is asking for current state (e.g., before save)
                    var state = hwCanvas.getHardwareState();
                    window.parent.postMessage({
                        type: 'robotics:hardwareState',
                        state: state
                    }, '*');
                }
            });

            // Notify parent that hardware tool is ready
            window.parent.postMessage({
                type: 'robotics:childReady',
                tool: 'hardware'
            }, '*');
        }
    }

    // Start on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
