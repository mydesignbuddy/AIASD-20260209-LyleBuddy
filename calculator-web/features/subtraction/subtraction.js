/**
 * Subtraction Operation Feature (Slice 3)
 * 
 * Handles subtraction with:
 * - Decimal.js precision for accurate subtraction
 * - Negative result support
 * - Left-to-right evaluation
 * - Chained subtraction operations
 * 
 * Maps to:
 * - FR-CALC-002: Subtraction Operation
 * - FR-CALC-005: Order of Operations (partial)
 * - BR-002: Order of Operations
 */

import { Decimal } from '../shared/decimal-config.js';
import { state } from '../shared/calculator-state.js';
import { eventBus, EVENTS } from '../shared/event-bus.js';
import { updateDisplay } from '../shared/utilities.js';

/**
 * Perform subtraction using Decimal.js
 * @param {string|number} operand1 - First operand (minuend)
 * @param {string|number} operand2 - Second operand (subtrahend)
 * @returns {string} Result of subtraction
 */
export function subtract(operand1, operand2) {
  try {
    const result = new Decimal(operand1).minus(operand2);
    return result.toString();
  } catch (error) {
    console.error('Subtraction error:', error);
    throw new Error('Invalid subtraction');
  }
}

/**
 * Execute pending subtraction operation
 * Updates state with result
 * @returns {string} Result of subtraction
 */
export function executeSubtraction() {
  if (state.previousValue === null) {
    return state.currentValue;
  }
  
  try {
    const result = subtract(state.previousValue, state.currentValue);
    
    // Update state
    state.previousValue = null;
    state.currentValue = result;
    state.operator = null;
    
    // Emit result event
    eventBus.emit(EVENTS.OPERATION_COMPLETE, {
      operator: '-',
      result: result
    });
    
    return result;
  } catch (error) {
    state.setError('Error');
    eventBus.emit(EVENTS.ERROR, 'Error');
    throw error;
  }
}

/**
 * Handle subtraction button press
 * - Executes pending operation if one exists
 * - Sets up state for subtraction
 */
export function handleSubtraction() {
  // Reset error state if present
  if (state.errorState) {
    state.reset();
    return;
  }
  
  // Execute pending operation if exists and not waiting for operand
  if (state.operator && !state.waitingForOperand) {
    // Execute the pending operation based on operator type
    switch (state.operator) {
      case '-':
        executeSubtraction();
        break;
      case '+':
        // Will be handled by addition slice
        console.warn('Addition not yet implemented');
        break;
      case '*':
        // Will be handled by multiplication slice
        console.warn('Multiplication not yet implemented');
        break;
      case '/':
        // Will be handled by division slice
        console.warn('Division not yet implemented');
        break;
    }
  }
  
  // Set up for subtraction
  state.previousValue = state.currentValue;
  state.operator = '-';
  state.waitingForOperand = true;
  
  // Update display (show current value with operator indicator)
  updateDisplay(state.currentValue);
  
  // Emit event
  eventBus.emit(EVENTS.OPERATOR_PRESSED, {
    operator: '-',
    value: state.currentValue
  });
}

/**
 * Initialize subtraction feature
 * Sets up button click and keyboard event handlers
 */
export function initSubtraction() {
  // Button click handler for subtraction
  const subtractButton = document.getElementById('btn-subtract');
  if (subtractButton) {
    subtractButton.addEventListener('click', handleSubtraction);
  } else {
    console.warn('Subtraction button not found in DOM');
  }
  
  // Keyboard event handler for minus/dash key
  document.addEventListener('keydown', (e) => {
    if (e.key === '-' || e.key === 'Subtract') {
      e.preventDefault();
      handleSubtraction();
    }
  });
  
  console.log('Subtraction feature initialized');
}
