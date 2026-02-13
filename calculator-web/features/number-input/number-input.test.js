/**
 * Number Input Tests
 * 
 * Unit tests for number input validation and handling.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  handleDigitInput, 
  handleDecimalInput, 
  handleBackspace,
  initNumberInput 
} from './number-input.js';
import {
  canAddDigit,
  canAddDecimal,
  isValidNumberInput,
  formatNumberInput,
  isZero,
  isValidNumberFormat,
  removeLastCharacter
} from './validators.js';
import { state } from '../shared/calculator-state.js';
import { eventBus, EVENTS } from '../shared/event-bus.js';

describe('Number Input Validators', () => {
  describe('canAddDigit()', () => {
    it('should allow adding digit when under 15 digits', () => {
      expect(canAddDigit('123')).toBe(true);
      expect(canAddDigit('1234567890')).toBe(true);
      expect(canAddDigit('123456789012345')).toBe(false);
    });
    
    it('should count digits excluding decimal point', () => {
      expect(canAddDigit('123.456')).toBe(true); // 6 digits
      expect(canAddDigit('12345678901234.')).toBe(false); // 15 digits (decimal doesn't count)
    });
    
    it('should handle single zero', () => {
      expect(canAddDigit('0')).toBe(true);
    });
  });
  
  describe('canAddDecimal()', () => {
    it('should allow decimal when not present', () => {
      expect(canAddDecimal('123')).toBe(true);
      expect(canAddDecimal('0')).toBe(true);
    });
    
    it('should not allow decimal when already present', () => {
      expect(canAddDecimal('123.45')).toBe(false);
      expect(canAddDecimal('0.')).toBe(false);
    });
  });
  
  describe('isValidNumberInput()', () => {
    it('should validate digit input', () => {
      expect(isValidNumberInput('123', '4')).toBe(true);
      expect(isValidNumberInput('123456789012345', '6')).toBe(false); // Too many digits
    });
    
    it('should validate decimal input', () => {
      expect(isValidNumberInput('123', '.')).toBe(true);
      expect(isValidNumberInput('123.45', '.')).toBe(false); // Already has decimal
    });
    
    it('should reject invalid input', () => {
      expect(isValidNumberInput('123', 'a')).toBe(false);
      expect(isValidNumberInput('123', '+')).toBe(false);
    });
  });
  
  describe('formatNumberInput()', () => {
    it('should remove leading zeros', () => {
      expect(formatNumberInput('007')).toBe('7');
      expect(formatNumberInput('00123')).toBe('123');
    });
    
    it('should preserve "0" and "0.x"', () => {
      expect(formatNumberInput('0')).toBe('0');
      expect(formatNumberInput('0.5')).toBe('0.5');
      expect(formatNumberInput('0.123')).toBe('0.123');
    });
    
    it('should add leading zero to decimal', () => {
      expect(formatNumberInput('.')).toBe('0.');
      expect(formatNumberInput('.5')).toBe('0.5');
      expect(formatNumberInput('.123')).toBe('0.123');
    });
    
    it('should handle empty input', () => {
      expect(formatNumberInput('')).toBe('0');
    });
  });
  
  describe('isZero()', () => {
    it('should identify zero values', () => {
      expect(isZero('0')).toBe(true);
      expect(isZero('0.')).toBe(true);
      expect(isZero('')).toBe(true);
      expect(isZero('0.0')).toBe(true);
    });
    
    it('should identify non-zero values', () => {
      expect(isZero('1')).toBe(false);
      expect(isZero('0.5')).toBe(false);
      expect(isZero('123')).toBe(false);
    });
  });
  
  describe('isValidNumberFormat()', () => {
    it('should validate correct number formats', () => {
      expect(isValidNumberFormat('123')).toBe(true);
      expect(isValidNumberFormat('123.45')).toBe(true);
      expect(isValidNumberFormat('0.5')).toBe(true);
    });
    
    it('should reject invalid formats', () => {
      expect(isValidNumberFormat('abc')).toBe(false);
      expect(isValidNumberFormat('12.34.56')).toBe(false);
      expect(isValidNumberFormat('12a34')).toBe(false);
    });
  });
  
  describe('removeLastCharacter()', () => {
    it('should remove last character', () => {
      expect(removeLastCharacter('123')).toBe('12');
      expect(removeLastCharacter('12.3')).toBe('12.');
    });
    
    it('should return "0" when empty', () => {
      expect(removeLastCharacter('1')).toBe('0');
      expect(removeLastCharacter('')).toBe('0');
      expect(removeLastCharacter('0')).toBe('0');
    });
  });
});

describe('Number Input Handlers', () => {
  beforeEach(() => {
    // Reset state before each test
    state.reset();
    
    // Clear event bus listeners
    eventBus.clear();
  });
  
  describe('handleDigitInput()', () => {
    it('should add digit to empty display', () => {
      handleDigitInput('5');
      expect(state.currentValue).toBe('5');
    });
    
    it('should append digit to existing value', () => {
      state.currentValue = '12';
      handleDigitInput('3');
      expect(state.currentValue).toBe('123');
    });
    
    it('should replace "0" with digit', () => {
      state.currentValue = '0';
      handleDigitInput('5');
      expect(state.currentValue).toBe('5');
    });
    
    it('should not replace "0." with digit', () => {
      state.currentValue = '0.';
      handleDigitInput('5');
      expect(state.currentValue).toBe('0.5');
    });
    
    it('should reject input when 15 digits reached', () => {
      state.currentValue = '123456789012345'; // 15 digits
      handleDigitInput('6');
      expect(state.currentValue).toBe('123456789012345'); // Unchanged
    });
    
    it('should start new number after operator', () => {
      state.currentValue = '5';
      state.waitingForOperand = true;
      handleDigitInput('3');
      expect(state.currentValue).toBe('3');
      expect(state.waitingForOperand).toBe(false);
    });
    
    it('should reset on error state', () => {
      state.errorState = true;
      state.errorMessage = 'Test error';
      state.currentValue = 'Error';
      handleDigitInput('5');
      expect(state.errorState).toBe(false);
      expect(state.currentValue).toBe('5');
    });
    
    it('should emit NUMBER_INPUT event', () => {
      const listener = vi.fn();
      eventBus.on(EVENTS.NUMBER_INPUT, listener);
      
      handleDigitInput('7');
      
      expect(listener).toHaveBeenCalledWith({ digit: '7', value: '7' });
    });
    
    it('should reject non-digit input', () => {
      state.currentValue = '5';
      handleDigitInput('a');
      expect(state.currentValue).toBe('5'); // Unchanged
    });
  });
  
  describe('handleDecimalInput()', () => {
    it('should add decimal to integer', () => {
      state.currentValue = '5';
      handleDecimalInput();
      expect(state.currentValue).toBe('5.');
    });
    
    it('should start with "0." after operator', () => {
      state.waitingForOperand = true;
      handleDecimalInput();
      expect(state.currentValue).toBe('0.');
      expect(state.waitingForOperand).toBe(false);
    });
    
    it('should reject second decimal point', () => {
      state.currentValue = '5.2';
      handleDecimalInput();
      expect(state.currentValue).toBe('5.2'); // Unchanged
    });
    
    it('should add decimal to "0"', () => {
      state.currentValue = '0';
      handleDecimalInput();
      expect(state.currentValue).toBe('0.');
    });
    
    it('should reset on error state', () => {
      state.errorState = true;
      handleDecimalInput();
      expect(state.errorState).toBe(false);
      expect(state.currentValue).toBe('0.');
    });
    
    it('should emit NUMBER_INPUT event', () => {
      const listener = vi.fn();
      eventBus.on(EVENTS.NUMBER_INPUT, listener);
      
      state.currentValue = '5';
      handleDecimalInput();
      
      expect(listener).toHaveBeenCalledWith({ digit: '.', value: '5.' });
    });
  });
  
  describe('handleBackspace()', () => {
    it('should remove last digit', () => {
      state.currentValue = '123';
      handleBackspace();
      expect(state.currentValue).toBe('12');
    });
    
    it('should remove decimal point', () => {
      state.currentValue = '12.';
      handleBackspace();
      expect(state.currentValue).toBe('12');
    });
    
    it('should return "0" when removing last digit', () => {
      state.currentValue = '5';
      handleBackspace();
      expect(state.currentValue).toBe('0');
    });
    
    it('should ignore when error state', () => {
      state.errorState = true;
      state.currentValue = '5';
      handleBackspace();
      expect(state.currentValue).toBe('5'); // Unchanged
    });
    
    it('should ignore when waiting for operand', () => {
      state.waitingForOperand = true;
      state.currentValue = '5';
      handleBackspace();
      expect(state.currentValue).toBe('5'); // Unchanged
    });
    
    it('should emit NUMBER_INPUT event', () => {
      const listener = vi.fn();
      eventBus.on(EVENTS.NUMBER_INPUT, listener);
      
      state.currentValue = '123';
      handleBackspace();
      
      expect(listener).toHaveBeenCalledWith({ 
        digit: 'backspace', 
        value: '12' 
      });
    });
  });
});
