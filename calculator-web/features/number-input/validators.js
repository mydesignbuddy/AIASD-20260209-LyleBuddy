/**
 * Number Input Validators
 * 
 * Validation functions for calculator number input.
 * Enforces 15 digit maximum, single decimal point, and proper formatting.
 */

/**
 * Check if adding a digit would exceed the maximum length
 * @param {string} currentValue - Current display value
 * @returns {boolean} True if can add more digits
 */
export function canAddDigit(currentValue) {
  // Remove decimal point for counting digits
  const digitsOnly = currentValue.replace('.', '');
  
  // Maximum 15 digits (per FR-CALC-008)
  return digitsOnly.length < 15;
}

/**
 * Check if a decimal point can be added
 * @param {string} currentValue - Current display value
 * @returns {boolean} True if can add decimal point
 */
export function canAddDecimal(currentValue) {
  // Only one decimal point allowed
  return !currentValue.includes('.');
}

/**
 * Validate that a number input is valid
 * @param {string} currentValue - Current display value
 * @param {string} input - Input to add (digit or decimal)
 * @returns {boolean} True if valid to add this input
 */
export function isValidNumberInput(currentValue, input) {
  // Check if input is a digit
  if (/^[0-9]$/.test(input)) {
    return canAddDigit(currentValue);
  }
  
  // Check if input is decimal point
  if (input === '.') {
    return canAddDecimal(currentValue);
  }
  
  // Invalid input
  return false;
}

/**
 * Format number input by removing leading zeros (except "0" or "0.x")
 * @param {string} value - Value to format
 * @returns {string} Formatted value
 */
export function formatNumberInput(value) {
  // Handle empty or invalid
  if (!value || value === '') {
    return '0';
  }
  
  // Handle decimal point at start (implicit leading zero)
  if (value === '.') {
    return '0.';
  }
  
  // Handle leading decimal (e.g., ".5" becomes "0.5")
  if (value.startsWith('.')) {
    return '0' + value;
  }
  
  // Remove leading zeros, but keep "0" or "0.x"
  if (value.length > 1 && value.startsWith('0') && value[1] !== '.') {
    // Remove leading zeros: "007" becomes "7"
    return value.replace(/^0+/, '');
  }
  
  return value;
}

/**
 * Check if value is effectively zero
 * @param {string} value - Value to check
 * @returns {boolean} True if zero
 */
export function isZero(value) {
  return parseFloat(value) === 0 || value === '0' || value === '0.' || value === '';
}

/**
 * Validate complete number format
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid number format
 */
export function isValidNumberFormat(value) {
  // Allow "0", digits, and one decimal point
  const regex = /^[0-9]+\.?[0-9]*$/;
  return regex.test(value);
}

/**
 * Remove last character (backspace functionality)
 * @param {string} value - Current value
 * @returns {string} Value with last character removed
 */
export function removeLastCharacter(value) {
  if (!value || value.length === 0) {
    return '0';
  }
  
  // Remove last character
  const newValue = value.slice(0, -1);
  
  // If empty, return "0"
  if (newValue === '' || newValue === '-') {
    return '0';
  }
  
  return newValue;
}
