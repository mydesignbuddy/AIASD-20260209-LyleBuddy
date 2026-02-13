/**
 * Shared Utility Functions
 * 
 * Common helper functions used across calculator features.
 */

/**
 * Check if a character is a valid operator
 * @param {string} char - Character to check
 * @returns {boolean} True if valid operator
 */
export function isOperator(char) {
  return ['+', '-', '*', '/', '×', '÷'].includes(char);
}

/**
 * Check if a character is a digit
 * @param {string} char - Character to check
 * @returns {boolean} True if digit
 */
export function isDigit(char) {
  return /^[0-9]$/.test(char);
}

/**
 * Normalize operator symbols (handle × and ÷)
 * @param {string} operator - Operator to normalize
 * @returns {string} Normalized operator
 */
export function normalizeOperator(operator) {
  const map = {
    '×': '*',
    '÷': '/'
  };
  return map[operator] || operator;
}

/**
 * Update the calculator display element
 * @param {string} value - Value to display
 * @param {boolean} isError - Whether this is an error message
 */
export function updateDisplay(value, isError = false) {
  const display = document.getElementById('calculator-display');
  if (!display) {
    console.warn('Display element not found');
    return;
  }
  
  display.textContent = value;
  
  // Update ARIA live region for screen readers
  display.setAttribute('aria-live', isError ? 'assertive' : 'polite');
  
  // Add error class if needed
  if (isError) {
    display.classList.add('display--error');
  } else {
    display.classList.remove('display--error');
  }
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
