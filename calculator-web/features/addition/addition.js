/**
 * Addition Operation Feature (Slice 2)
 * 
 * Handles addition operations with decimal precision using Decimal.js.
 * Supports chained additions and negative numbers.
 */

import { Decimal } from '../shared/decimal-config.js';
import { state } from '../shared/calculator-state.js';
import { eventBus, EVENTS } from '../shared/event-bus.js';

/**
 * Perform addition of two operands with decimal precision
 * @param {string|number} operand1 - First operand
 * @param {string|number} operand2 - Second operand
 * @returns {string} Result as string
 */
export function add(operand1, operand2) {
  try {
    const result = Decimal(operand1).plus(operand2);
    return result.toString();
  } catch (error) {
    console.error('Addition error:', error);
    throw new Error('Invalid addition operands');
  }
}

/**
 * Execute pending addition operation
 * Updates state.currentValue with the result
 * @returns {string|null} Result of addition or null if no operation to perform
 */
export function executeAddition() {
  // Need both previous and current values
  if (state.previousValue === null || state.currentValue === null) {
    return null;
  }
  
  try {
    const operand1 = state.previousValue;
    const operand2 = state.currentValue;
    const result = add(operand1, operand2);
    state.currentValue = result;
    
    // Emit calculation complete event
    eventBus.emit(EVENTS.CALCULATION_COMPLETE, {
      operator: '+',
      operand1,
      operand2,
      result
    });
    
    return result;
  } catch (error) {
    state.setError('Addition Error');
    return null;
  }
}

/**
 * Handle addition operator press
 * Executes pending operation if one exists, then sets up for new addition
 */
export function handleAddition() {
  // If there's an error, reset first
  if (state.errorState) {
    state.reset();
  }
  
  // If there's a pending operation and we're not waiting for operand, execute it
  if (state.operator && !state.waitingForOperand) {
    executeCurrentOperation();
  }
  
  // Store current value as previous value
  state.previousValue = state.currentValue;
  state.operator = '+';
  state.waitingForOperand = true;
  
  // Emit operator pressed event
  eventBus.emit(EVENTS.OPERATOR_PRESSED, {
    operator: '+',
    currentValue: state.currentValue
  });
}

/**
 * Execute the current pending operation based on state.operator
 * This allows chained operations like 2 + 3 + 4
 */
function executeCurrentOperation() {
  if (!state.operator || !state.previousValue) {
    return;
  }
  
  // Execute based on current operator
  switch (state.operator) {
    case '+':
      executeAddition();
      break;
    // Future operators will be added here in later slices
    default:
      console.warn(`Unknown operator: ${state.operator}`);
  }
  
  // Clear operator after execution
  state.operator = null;
}

/**
 * Initialize addition feature
 * Sets up event listeners for addition button and keyboard
 */
export function initAddition() {
  // Find addition button
  const addButton = document.querySelector('[data-operator="+"]');
  
  if (addButton) {
    addButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddition();
    });
  } else {
    console.warn('Addition button not found');
  }
  
  // Keyboard support for '+' key
  document.addEventListener('keydown', (e) => {
    if (e.key === '+') {
      e.preventDefault();
      handleAddition();
    }
  });
  
  console.log('Addition feature initialized');
}
