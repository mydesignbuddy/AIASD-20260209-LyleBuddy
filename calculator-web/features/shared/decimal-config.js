/**
 * Decimal.js Configuration
 * 
 * Configures Decimal.js with precision requirements from FRS:
 * - 20 significant digits internal precision
 * - ROUND_HALF_UP rounding mode
 * - Exponential notation thresholds
 */

import Decimal from 'decimal.js';

// Configure Decimal.js per calculation-engine.instructions.md requirements
Decimal.set({
  precision: 20,              // Internal precision: 20 significant digits
  rounding: Decimal.ROUND_HALF_UP,  // Standard rounding (0.5 rounds up)
  toExpNeg: -15,              // Use exponential for numbers < 1e-15
  toExpPos: 15,               // Use exponential for numbers > 1e15
  minE: -9e15,                // Min exponent
  maxE: 9e15                  // Max exponent
});

/**
 * Format number for display with 10 decimal places maximum
 * @param {Decimal|string|number} value - The value to format
 * @returns {string} Formatted display string
 */
export function formatForDisplay(value) {
  const decimal = new Decimal(value);
  
  // Remove trailing zeros after decimal point
  let formatted = decimal.toFixed(10);
  
  // Remove trailing zeros
  if (formatted.includes('.')) {
    formatted = formatted.replace(/\.?0+$/, '');
  }
  
  return formatted;
}

/**
 * Validate that a number is within calculator's operational range
 * @param {Decimal} value - The value to validate
 * @returns {boolean} True if valid
 */
export function isWithinRange(value) {
  const abs = value.abs();
  
  // Check for overflow (per BR-006)
  if (abs.greaterThan(new Decimal('9.99999999999999e+15'))) {
    return false;
  }
  
  // Zero is always valid
  if (value.isZero()) {
    return true;
  }
  
  // Check for underflow (too small to represent)
  if (abs.lessThan(new Decimal('1e-15')) && !value.isZero()) {
    return false;
  }
  
  return true;
}

export { Decimal };
