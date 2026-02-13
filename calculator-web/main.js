/**
 * Web Calculator - Main Entry Point
 * 
 * Bootstraps the calculator application by initializing shared utilities.
 * Feature slices will be imported here as they are implemented.
 * 
 * @module main
 */

import { state } from './features/shared/calculator-state.js';
import { eventBus, EVENTS } from './features/shared/event-bus.js';
import { updateDisplay } from './features/shared/utilities.js';
import './features/shared/decimal-config.js';
import { initNumberInput } from './features/number-input/number-input.js';

/**
 * Initialize calculator application
 */
function initCalculator() {
  console.log('Calculator initializing...');
  
  // Initialize display
  updateDisplay(state.getDisplayValue());
  
  // Log state for debugging
  console.log('Initial state:', state);
  
  // Set up event listeners for display updates
  eventBus.on(EVENTS.DISPLAY_UPDATE, (value) => {
    updateDisplay(value, state.hasError());
  });
  
  eventBus.on(EVENTS.ERROR, (message) => {
    updateDisplay(message, true);
  });
  
  // Initialize feature slices
  initNumberInput(); // Slice 1: Number input
  
  // TODO: Initialize remaining slices as they are implemented
  // import('./features/addition/addition.js');
  // import('./features/subtraction/subtraction.js');
  // etc.
  
  console.log('Calculator initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator);
} else {
  initCalculator();
}

// Export for debugging
window.calculatorState = state;
window.calculatorEvents = eventBus;
