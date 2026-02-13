/**
 * Calculator State Management Tests
 * 
 * Unit tests for CalculatorState class functionality.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CalculatorState, state } from './calculator-state.js';

describe('CalculatorState', () => {
  let testState;
  
  beforeEach(() => {
    testState = new CalculatorState();
  });
  
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(testState.currentValue).toBe('0');
      expect(testState.previousValue).toBe(null);
      expect(testState.operator).toBe(null);
      expect(testState.waitingForOperand).toBe(false);
      expect(testState.errorState).toBe(false);
      expect(testState.errorMessage).toBe(null);
      expect(testState.lastOperand).toBe(null);
      expect(testState.lastOperator).toBe(null);
    });
    
    it('should provide a singleton instance', () => {
      expect(state).toBeInstanceOf(CalculatorState);
      expect(state.currentValue).toBe('0');
    });
  });
  
  describe('reset()', () => {
    it('should reset all properties to initial state', () => {
      // Modify state
      testState.currentValue = '42';
      testState.previousValue = '10';
      testState.operator = '+';
      testState.waitingForOperand = true;
      testState.errorState = true;
      testState.errorMessage = 'Error';
      
      // Reset
      testState.reset();
      
      // Verify reset
      expect(testState.currentValue).toBe('0');
      expect(testState.previousValue).toBe(null);
      expect(testState.operator).toBe(null);
      expect(testState.waitingForOperand).toBe(false);
      expect(testState.errorState).toBe(false);
      expect(testState.errorMessage).toBe(null);
    });
  });
  
  describe('clearEntry()', () => {
    it('should clear current value but preserve operator state', () => {
      // Set up state
      testState.currentValue = '42';
      testState.previousValue = '10';
      testState.operator = '+';
      testState.waitingForOperand = true;
      
      // Clear entry
      testState.clearEntry();
      
      // Current value cleared, other state preserved
      expect(testState.currentValue).toBe('0');
      expect(testState.previousValue).toBe('10');
      expect(testState.operator).toBe('+');
      expect(testState.waitingForOperand).toBe(true);
    });
    
    it('should clear error state', () => {
      testState.currentValue = '42';
      testState.errorState = true;
      testState.errorMessage = 'Division by zero';
      
      testState.clearEntry();
      
      expect(testState.errorState).toBe(false);
      expect(testState.errorMessage).toBe(null);
      expect(testState.currentValue).toBe('0');
    });
  });
  
  describe('setError()', () => {
    it('should set error state with message', () => {
      testState.setError('Division by zero');
      
      expect(testState.errorState).toBe(true);
      expect(testState.errorMessage).toBe('Division by zero');
      expect(testState.currentValue).toBe('0');
    });
    
    it('should reset current value when setting error', () => {
      testState.currentValue = '12345';
      testState.setError('Overflow');
      
      expect(testState.currentValue).toBe('0');
    });
  });
  
  describe('getDisplayValue()', () => {
    it('should return current value when no error', () => {
      testState.currentValue = '42';
      expect(testState.getDisplayValue()).toBe('42');
    });
    
    it('should return error message when in error state', () => {
      testState.currentValue = '42';
      testState.errorState = true;
      testState.errorMessage = 'Error: Division by zero';
      
      expect(testState.getDisplayValue()).toBe('Error: Division by zero');
    });
    
    it('should return current value if error state but no message', () => {
      testState.currentValue = '42';
      testState.errorState = true;
      testState.errorMessage = null;
      
      expect(testState.getDisplayValue()).toBe('42');
    });
  });
  
  describe('hasError()', () => {
    it('should return false when no error', () => {
      expect(testState.hasError()).toBe(false);
    });
    
    it('should return true when error state is set', () => {
      testState.errorState = true;
      expect(testState.hasError()).toBe(true);
    });
  });
  
  describe('Expression tracking', () => {
    it('should initialize with empty expression array', () => {
      expect(testState.expression).toEqual([]);
    });
    
    it('should preserve expression array on clearEntry', () => {
      testState.expression = ['2', '+', '3'];
      testState.clearEntry();
      expect(testState.expression).toEqual(['2', '+', '3']);
    });
    
    it('should reset expression array on full reset', () => {
      testState.expression = ['2', '+', '3'];
      testState.reset();
      expect(testState.expression).toEqual([]);
    });
  });
});
