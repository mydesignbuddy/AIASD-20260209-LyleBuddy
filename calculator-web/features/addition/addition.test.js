/**
 * Addition Operation Tests (Slice 2)
 * 
 * Tests for addition functionality including:
 * - Basic addition
 * - Decimal precision
 * - Negative numbers
 * - Chained additions
 * - Edge cases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { add, executeAddition, handleAddition, initAddition } from './addition.js';
import { state } from '../shared/calculator-state.js';
import { eventBus, EVENTS } from '../shared/event-bus.js';

describe('Addition Operation', () => {
  beforeEach(() => {
    // Reset state before each test
    state.reset();
    // Clear event listeners
    eventBus.clear();
  });
  
  describe('add()', () => {
    it('should add two positive integers (TC-ADD-001)', () => {
      const result = add('5', '3');
      expect(result).toBe('8');
    });
    
    it('should add two decimal numbers with precision (TC-ADD-002)', () => {
      const result = add('0.1', '0.2');
      expect(result).toBe('0.3');
    });
    
    it('should add negative and positive numbers (TC-ADD-003)', () => {
      const result = add('-5', '3');
      expect(result).toBe('-2');
    });
    
    it('should handle large numbers', () => {
      const result = add('999999999', '1');
      expect(result).toBe('1000000000');
    });
    
    it('should handle zero as operand', () => {
      const result = add('0', '5');
      expect(result).toBe('5');
    });
    
    it('should handle both operands as zero', () => {
      const result = add('0', '0');
      expect(result).toBe('0');
    });
    
    it('should handle negative numbers on both sides', () => {
      const result = add('-5', '-3');
      expect(result).toBe('-8');
    });
    
    it('should handle decimal places correctly', () => {
      const result = add('123.456', '789.123');
      expect(result).toBe('912.579');
    });
    
    it('should throw error for invalid operands', () => {
      expect(() => add('abc', '123')).toThrow();
    });
  });
  
  describe('executeAddition()', () => {
    it('should execute addition using state values', () => {
      state.previousValue = '5';
      state.currentValue = '3';
      state.operator = '+';
      
      const result = executeAddition();
      
      expect(result).toBe('8');
      expect(state.currentValue).toBe('8');
    });
    
    it('should return null when previousValue is missing', () => {
      state.previousValue = null;
      state.currentValue = '3';
      
      const result = executeAddition();
      
      expect(result).toBeNull();
    });
    
    it('should return null when currentValue is missing', () => {
      state.previousValue = '5';
      state.currentValue = null;
      
      const result = executeAddition();
      
      expect(result).toBeNull();
    });
    
    it('should emit CALCULATION_COMPLETE event', () => {
      const emitSpy = vi.spyOn(eventBus, 'emit');
      
      state.previousValue = '5';
      state.currentValue = '3';
      
      executeAddition();
      
      expect(emitSpy).toHaveBeenCalledWith(
        EVENTS.CALCULATION_COMPLETE,
        expect.objectContaining({
          operator: '+',
          operand1: '5',
          operand2: '3'
        })
      );
    });
    
    it('should handle errors gracefully', () => {
      state.previousValue = 'invalid';
      state.currentValue = '3';
      
      const result = executeAddition();
      
      expect(result).toBeNull();
      expect(state.errorState).toBe(true);
    });
  });
  
  describe('handleAddition()', () => {
    it('should store current value as previous value', () => {
      state.currentValue = '5';
      
      handleAddition();
      
      expect(state.previousValue).toBe('5');
    });
    
    it('should set operator to +', () => {
      state.currentValue = '5';
      
      handleAddition();
      
      expect(state.operator).toBe('+');
    });
    
    it('should set waitingForOperand flag', () => {
      state.currentValue = '5';
      
      handleAddition();
      
      expect(state.waitingForOperand).toBe(true);
    });
    
    it('should emit OPERATOR_PRESSED event', () => {
      const emitSpy = vi.spyOn(eventBus, 'emit');
      state.currentValue = '5';
      
      handleAddition();
      
      expect(emitSpy).toHaveBeenCalledWith(
        EVENTS.OPERATOR_PRESSED,
        expect.objectContaining({
          operator: '+',
          currentValue: '5'
        })
      );
    });
    
    it('should reset error state before operation', () => {
      state.errorState = true;
      state.errorMessage = 'Test error';
      state.currentValue = '5';
      
      handleAddition();
      
      expect(state.errorState).toBe(false);
      expect(state.operator).toBe('+');
    });
    
    it('should execute pending operation before setting new operator', () => {
      // Set up a pending addition: 2 +
      state.previousValue = '2';
      state.currentValue = '3';
      state.operator = '+';
      state.waitingForOperand = false;
      
      // Press + again (should execute 2 + 3 = 5, then set up next addition)
      handleAddition();
      
      // Should have executed pending operation
      expect(state.previousValue).toBe('5');
      expect(state.currentValue).toBe('5');
      expect(state.operator).toBe('+');
      expect(state.waitingForOperand).toBe(true);
    });
  });
  
  describe('Chained Addition (TC-ADD-004)', () => {
    it('should handle chained additions: 2 + 3 + 4 = 9', () => {
      // Enter 2
      state.currentValue = '2';
      
      // Press +
      handleAddition();
      expect(state.previousValue).toBe('2');
      expect(state.operator).toBe('+');
      
      // Enter 3
      state.currentValue = '3';
      state.waitingForOperand = false;
      
      // Press + again (should calculate 2 + 3 = 5)
      handleAddition();
      expect(state.currentValue).toBe('5');
      expect(state.previousValue).toBe('5');
      
      // Enter 4
      state.currentValue = '4';
      state.waitingForOperand = false;
      
      // Execute final operation
      const result = executeAddition();
      expect(result).toBe('9');
      expect(state.currentValue).toBe('9');
    });
  });
  
  describe('initAddition()', () => {
    it('should be a function', () => {
      expect(typeof initAddition).toBe('function');
    });
  });
  
  describe('Edge Cases', () => {
    it('should handle very small decimals', () => {
      const result = add('0.0001', '0.0002');
      expect(result).toBe('0.0003');
    });
    
    it('should handle numbers with many decimal places', () => {
      const result = add('1.123456789', '2.987654321');
      expect(result).toBe('4.11111111');
    });
    
    it('should handle scientific notation', () => {
      const result = add('1e10', '2e10');
      expect(result).toBe('30000000000');
    });
  });
});
