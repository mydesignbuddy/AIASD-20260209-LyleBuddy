/**
 * Event Bus Tests
 * 
 * Unit tests for event bus publish-subscribe functionality.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus, eventBus, EVENTS } from './event-bus.js';

describe('EventBus', () => {
  let bus;
  
  beforeEach(() => {
    bus = new EventBus();
  });
  
  describe('on() - Subscribe to events', () => {
    it('should register event listener', () => {
      const callback = vi.fn();
      bus.on('test', callback);
      
      bus.emit('test', 'data');
      
      expect(callback).toHaveBeenCalledWith('data');
      expect(callback).toHaveBeenCalledTimes(1);
    });
    
    it('should support multiple listeners for same event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      bus.on('test', callback1);
      bus.on('test', callback2);
      
      bus.emit('test', 'data');
      
      expect(callback1).toHaveBeenCalledWith('data');
      expect(callback2).toHaveBeenCalledWith('data');
    });
    
    it('should return unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = bus.on('test', callback);
      
      expect(typeof unsubscribe).toBe('function');
      
      // Verify listener works
      bus.emit('test', 'data1');
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Unsubscribe
      unsubscribe();
      
      // Verify listener removed
      bus.emit('test', 'data2');
      expect(callback).toHaveBeenCalledTimes(1); // Still only 1
    });
  });
  
  describe('emit() - Publish events', () => {
    it('should emit event to all listeners', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      bus.on('test', callback1);
      bus.on('test', callback2);
      
      bus.emit('test', { value: 42 });
      
      expect(callback1).toHaveBeenCalledWith({ value: 42 });
      expect(callback2).toHaveBeenCalledWith({ value: 42 });
    });
    
    it('should handle emit with no listeners', () => {
      expect(() => {
        bus.emit('nonexistent', 'data');
      }).not.toThrow();
    });
    
    it('should catch errors in listeners', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Test error');
      });
      const normalCallback = vi.fn();
      
      bus.on('test', errorCallback);
      bus.on('test', normalCallback);
      
      // Should not throw, but log error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      bus.emit('test', 'data');
      
      expect(consoleSpy).toHaveBeenCalled();
      expect(normalCallback).toHaveBeenCalledWith('data'); // Other listeners still called
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('off() - Unsubscribe events', () => {
    it('should remove all listeners for event', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      bus.on('test', callback1);
      bus.on('test', callback2);
      
      bus.off('test');
      
      bus.emit('test', 'data');
      
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
    
    it('should handle removing non-existent event', () => {
      expect(() => {
        bus.off('nonexistent');
      }).not.toThrow();
    });
  });
  
  describe('clear() - Remove all listeners', () => {
    it('should remove all listeners from all events', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      bus.on('event1', callback1);
      bus.on('event2', callback2);
      
      bus.clear();
      
      bus.emit('event1', 'data1');
      bus.emit('event2', 'data2');
      
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });
  
  describe('Singleton instance', () => {
    it('should export singleton eventBus instance', () => {
      expect(eventBus).toBeInstanceOf(EventBus);
    });
  });
  
  describe('EVENTS constants', () => {
    it('should export standard event names', () => {
      expect(EVENTS.DISPLAY_UPDATE).toBe('display:update');
      expect(EVENTS.STATE_CHANGE).toBe('state:change');
      expect(EVENTS.ERROR).toBe('error');
      expect(EVENTS.CALCULATION_START).toBe('calculation:start');
      expect(EVENTS.CALCULATION_COMPLETE).toBe('calculation:complete');
      expect(EVENTS.OPERATOR_PRESSED).toBe('operator:pressed');
      expect(EVENTS.NUMBER_INPUT).toBe('number:input');
      expect(EVENTS.CLEAR).toBe('clear');
      expect(EVENTS.EQUALS).toBe('equals');
    });
  });
});
