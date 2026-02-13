/**
 * Calculator State Management
 * 
 * Centralized state for calculator application.
 * Manages current value, operator, previous value, and error states.
 */

/**
 * CalculatorState class manages all calculator state
 */
export class CalculatorState {
  constructor() {
    this.currentValue = '0';      // Current display value
    this.previousValue = null;    // Previous value (for operations)
    this.operator = null;         // Current operator (+, -, *, /)
    this.waitingForOperand = false; // True after operator pressed
    this.errorState = false;      // True when error occurred
    this.errorMessage = null;     // Error message text
    this.lastOperand = null;      // For repeated equals (BR-013)
    this.lastOperator = null;     // For repeated equals (BR-013)
    this.expression = [];         // Expression tokens for PEMDAS
  }
  
  /**
   * Reset state to initial values
   */
  reset() {
    Object.assign(this, new CalculatorState());
  }
  
  /**
   * Clear current entry only (C function per BR-014)
   */
  clearEntry() {
    this.currentValue = '0';
    this.errorState = false;
    this.errorMessage = null;
  }
  
  /**
   * Set error state with message
   * @param {string} message - Error message to display
   */
  setError(message) {
    this.errorState = true;
    this.errorMessage = message;
    this.currentValue = '0';
  }
  
  /**
   * Get current display value (either error message or currentValue)
   * @returns {string} Display value
   */
  getDisplayValue() {
    if (this.errorState && this.errorMessage) {
      return this.errorMessage;
    }
    return this.currentValue;
  }
  
  /**
   * Check if calculator is in error state
   * @returns {boolean} True if error
   */
  hasError() {
    return this.errorState;
  }
}

// Export singleton instance
export const state = new CalculatorState();
