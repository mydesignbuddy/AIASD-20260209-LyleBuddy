/**
 * Number Input Feature
 * 
 * Handles digit and decimal point input via button clicks and keyboard.
 * Validates input length (15 digit max) and format (single decimal).
 */

import { state } from '../shared/calculator-state.js';
import { eventBus, EVENTS } from '../shared/event-bus.js';
import { updateDisplay } from '../shared/utilities.js';
import {
  isValidNumberInput,
  formatNumberInput,
  isZero,
  canAddDecimal,
  removeLastCharacter
} from './validators.js';

/**
 * Handle digit input (0-9)
 * @param {string} digit - Digit to input (0-9)
 */
export function handleDigitInput(digit) {
  // Validate digit
  if (!/^[0-9]$/.test(digit)) {
    console.warn('Invalid digit:', digit);
    return;
  }
  
  // Reset on error
  if (state.errorState) {
    state.reset();
  }
  
  // Start new number after operator or equals
  if (state.waitingForOperand) {
    state.currentValue = digit;
    state.waitingForOperand = false;
  } else {
    // Validate length before appending
    if (!isValidNumberInput(state.currentValue, digit)) {
      console.warn('Cannot add digit: maximum 15 digits reached');
      return;
    }
    
    // Replace "0" with digit (unless "0." for decimal)
    if (isZero(state.currentValue) && !state.currentValue.includes('.')) {
      state.currentValue = digit;
    } else {
      // Append digit
      state.currentValue += digit;
    }
  }
  
  // Format and update display
  state.currentValue = formatNumberInput(state.currentValue);
  updateDisplay(state.currentValue);
  
  // Emit event
  eventBus.emit(EVENTS.NUMBER_INPUT, { digit, value: state.currentValue });
}

/**
 * Handle decimal point input
 */
export function handleDecimalInput() {
  // Reset on error
  if (state.errorState) {
    state.reset();
  }
  
  // Start new number with "0." after operator
  if (state.waitingForOperand) {
    state.currentValue = '0.';
    state.waitingForOperand = false;
  } else {
    // Check if decimal already present
    if (!canAddDecimal(state.currentValue)) {
      console.warn('Cannot add decimal: already present');
      return;
    }
    
    // Add decimal point
    state.currentValue += '.';
  }
  
  // Update display
  updateDisplay(state.currentValue);
  
  // Emit event
  eventBus.emit(EVENTS.NUMBER_INPUT, { digit: '.', value: state.currentValue });
}

/**
 * Handle backspace (remove last character)
 */
export function handleBackspace() {
  // Ignore if error state or waiting for operand
  if (state.errorState) {
    return;
  }
  
  if (state.waitingForOperand) {
    return;
  }
  
  // Remove last character
  state.currentValue = removeLastCharacter(state.currentValue);
  
  // Update display
  updateDisplay(state.currentValue);
  
  // Emit event
  eventBus.emit(EVENTS.NUMBER_INPUT, { 
    digit: 'backspace', 
    value: state.currentValue 
  });
}

/**
 * Initialize number input feature
 * Sets up button click and keyboard event handlers
 */
export function initNumberInput() {
  // Button click handlers for digits
  const digitButtons = document.querySelectorAll('[data-digit]');
  digitButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const digit = e.currentTarget.dataset.digit;
      handleDigitInput(digit);
    });
  });
  
  // Decimal button click handler
  const decimalButton = document.getElementById('btn-decimal');
  if (decimalButton) {
    decimalButton.addEventListener('click', handleDecimalInput);
  }
  
  // Backspace button click handler
  const backspaceButton = document.getElementById('btn-backspace');
  if (backspaceButton) {
    backspaceButton.addEventListener('click', handleBackspace);
  }
  
  // Keyboard event handlers
  document.addEventListener('keydown', (e) => {
    // Digit keys (0-9)
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      handleDigitInput(e.key);
    }
    
    // Decimal point (. or comma on some keyboards)
    if (e.key === '.' || e.key === ',') {
      e.preventDefault();
      handleDecimalInput();
    }
    
    // Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
    }
  });
  
  console.log('Number input initialized');
}
