/**
 * Event Bus for Calculator
 * 
 * Simple publish-subscribe pattern for decoupled component communication.
 * Allows slices to communicate without tight coupling.
 */

class EventBus {
  constructor() {
    this.listeners = new Map();
  }
  
  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (!this.listeners.has(event)) {
      return;
    }
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error);
      }
    });
  }
  
  /**
   * Remove all listeners for an event
   * @param {string} event - Event name
   */
  off(event) {
    this.listeners.delete(event);
  }
  
  /**
   * Remove all listeners
   */
  clear() {
    this.listeners.clear();
  }
}

// Export singleton instance
export const eventBus = new EventBus();

// Standard event names for calculator
export const EVENTS = {
  DISPLAY_UPDATE: 'display:update',
  STATE_CHANGE: 'state:change',
  ERROR: 'error',
  CALCULATION_START: 'calculation:start',
  CALCULATION_COMPLETE: 'calculation:complete',
  OPERATOR_PRESSED: 'operator:pressed',
  NUMBER_INPUT: 'number:input',
  CLEAR: 'clear',
  EQUALS: 'equals'
};
