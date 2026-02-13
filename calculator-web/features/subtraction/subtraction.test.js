/**
 * Subtraction Feature Tests (Slice 3)
 * 
 * Test Coverage:
 * - TC-SUB-001: Basic subtraction
 * - TC-SUB-002: Negative result handling
 * - TC-SUB-003: Chained subtraction (left-to-right)
 * - TC-SUB-004: Decimal precision
 * - Edge cases: zero, negative numbers, large numbers
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { subtract, executeSubtraction, handleSubtraction } from './subtraction.js';
import { state } from '../shared/calculator-state.js';
import { eventBus, EVENTS } from '../shared/event-bus.js';
import * as utilities from '../shared/utilities.js';

// Mock updateDisplay to avoid DOM dependencies in tests
vi.spyOn(utilities, 'updateDisplay').mockImplementation(() => {});

describe('Subtraction Feature (Slice 3)', () => {
  
  beforeEach(() => {
    // Reset state before each test
    state.reset();
    // Clear all event listeners
    eventBus.clear();
  });
  
  describe('subtract() - Core Logic', () => {
    
    it('TC-SUB-001: should subtract two positive numbers', () => {
      const result = subtract('10', '3');
      expect(result).toBe('7');
    });
    
    it('TC-SUB-002: should handle negative results (3 - 10 = -7)', () => {
      const result = subtract('3', '10');
      expect(result).toBe('-7');
    });
    
    it('TC-SUB-004: should maintain decimal precision (0.3 - 0.1 = 0.2)', () => {
      const result = subtract('0.3', '0.1');
      expect(result).toBe('0.2'); // Not 0.19999999...
    });
    
    it('should handle subtracting zero', () => {
      const result = subtract('42', '0');
      expect(result).toBe('42');
    });
    
    it('should handle zero minus a number', () => {
      const result = subtract('0', '5');
      expect(result).toBe('-5');
    });
    
    it('should handle subtracting negative numbers', () => {
      const result = subtract('10', '-5');
      expect(result).toBe('15'); // 10 - (-5) = 10 + 5
    });
    
    it('should handle large numbers', () => {
      const result = subtract('999999999999', '1');
      expect(result).toBe('999999999998');
    });
    
    it('should handle very small decimals', () => {
      const result = subtract('0.0000000001', '0.0000000001');
      expect(result).toBe('0');
    });
    
    it('should handle mixed integer and decimal', () => {
      const result = subtract('10.5', '3');
      expect(result).toBe('7.5');
    });
    
    it('should throw error for invalid input', () => {
      expect(() => subtract('abc', '5')).toThrow('Invalid subtraction');
    });
    
  });
  
  describe('executeSubtraction() - State Integration', () => {
    
    it('should execute subtraction using state values', () => {
      state.previousValue = '10';
      state.currentValue = '3';
      state.operator = '-';
      
      const result = executeSubtraction();
      
      expect(result).toBe('7');
      expect(state.currentValue).toBe('7');
      expect(state.previousValue).toBe(null);
      expect(state.operator).toBe(null);
    });
    
    it('should emit OPERATION_COMPLETE event', () => {
      state.previousValue = '15';
      state.currentValue = '8';
      state.operator = '-';
      
      const listener = vi.fn();
      eventBus.on(EVENTS.OPERATION_COMPLETE, listener);
      
      executeSubtraction();
      
      expect(listener).toHaveBeenCalledWith({
        operator: '-',
        result: '7'
      });
    });
    
    it('TC-SUB-003: should support chained subtraction (5 - 2 - 1 = 2)', () => {
      // First subtraction: 5 - 2
      state.currentValue = '5';
      state.previousValue = null;
      state.operator = '-';
      state.waitingForOperand = true;
      
      // Enter second operand
      state.currentValue = '2';
      state.previousValue = '5';
      state.waitingForOperand = false;
      
      // Execute first subtraction
      executeSubtraction();
      expect(state.currentValue).toBe('3');
      
      // Second subtraction: 3 - 1
      state.previousValue = '3';
      state.operator = '-';
      state.currentValue = '1';
      
      // Execute second subtraction
      executeSubtraction();
      expect(state.currentValue).toBe('2');
    });
    
    it('should return current value if no previous value', () => {
      state.currentValue = '42';
      state.previousValue = null;
      
      const result = executeSubtraction();
      
      expect(result).toBe('42');
      expect(state.currentValue).toBe('42');
    });
    
    it('should set error state on calculation error', () => {
      state.previousValue = 'invalid';
      state.currentValue = '5';
      
      expect(() => executeSubtraction()).toThrow();
      expect(state.errorState).toBe(true);
    });
    
  });
  
  describe('handleSubtraction() - Button Handler', () => {
    
    it('should set up state for subtraction', () => {
      state.currentValue = '10';
      state.previousValue = null;
      state.operator = null;
      state.waitingForOperand = false;
      
      handleSubtraction();
      
      expect(state.previousValue).toBe('10');
      expect(state.operator).toBe('-');
      expect(state.waitingForOperand).toBe(true);
    });
    
    it('should emit OPERATOR_PRESSED event', () => {
      state.currentValue = '5';
      
      const listener = vi.fn();
      eventBus.on(EVENTS.OPERATOR_PRESSED, listener);
      
      handleSubtraction();
      
      expect(listener).toHaveBeenCalledWith({
        operator: '-',
        value: '5'
      });
    });
    
    it('should execute pending subtraction before starting new one', () => {
      // Set up pending operation: 10 - 5
      state.previousValue = '10';
      state.currentValue = '5';
      state.operator = '-';
      state.waitingForOperand = false;
      
      // Press minus again (should execute 10 - 5 first)
      handleSubtraction();
      
      expect(state.previousValue).toBe('5'); // Result becomes previous
      expect(state.currentValue).toBe('5');
      expect(state.operator).toBe('-');
      expect(state.waitingForOperand).toBe(true);
    });
    
    it('should reset from error state', () => {
      state.setError('Test Error');
      expect(state.errorState).toBe(true);
      
      handleSubtraction();
      
      expect(state.errorState).toBe(false);
      expect(state.currentValue).toBe('0');
    });
    
    it('should not execute operation if waiting for operand', () => {
      state.previousValue = '10';
      state.currentValue = '10';
      state.operator = '-';
      state.waitingForOperand = true;
      
      handleSubtraction();
      
      // Should still be waiting, not execute
      expect(state.previousValue).toBe('10');
      expect(state.operator).toBe('-');
    });
    
  });
  
  describe('Decimal Precision Edge Cases', () => {
    
    it('should handle JavaScript floating point issues', () => {
      // Common JavaScript issue: 0.3 - 0.1 = 0.19999999999999998
      const result = subtract('0.3', '0.1');
      expect(result).toBe('0.2'); // Decimal.js fixes this
    });
    
    it('should maintain precision with many decimal places', () => {
      const result = subtract('1.123456789', '0.123456789');
      expect(result).toBe('1');
    });
    
    it('should handle very small differences', () => {
      const result = subtract('1.0000000001', '1.0000000000');
      expect(result).toBe('0.0000000001');
    });
    
  });
  
  describe('Integration with Calculator State', () => {
    
    it('should work with state after number input', () => {
      // Simulate user entering 15, then pressing minus
      state.currentValue = '15';
      state.waitingForOperand = false;
      
      handleSubtraction();
      
      expect(state.previousValue).toBe('15');
      expect(state.operator).toBe('-');
      expect(state.waitingForOperand).toBe(true);
      
      // User enters 7
      state.currentValue = '7';
      state.waitingForOperand = false;
      
      // Execute
      const result = executeSubtraction();
      expect(result).toBe('8');
    });
    
  });
  
});
