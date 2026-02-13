---
ai_generated: true
model: "anthropic/claude-3.5-sonnet@2024-10-22"
operator: "lyle.ubben"
chat_id: "frs-instructions-20260212-002"
prompt: |
  Generate instruction files from the business requirements in PRD and FRS documents,
  specifically for calculation engine specifications.
started: "2026-02-12T16:30:00Z"
ended: "2026-02-12T16:45:00Z"
task_durations:
  - task: "requirements extraction"
    duration: "00:05:00"
  - task: "instruction file creation"
    duration: "00:08:00"
  - task: "validation"
    duration: "00:02:00"
total_duration: "00:15:00"
ai_log: "ai-logs/2026/02/12/frs-instructions-20260212-002/conversation.md"
source: "requirements/web-calculator-frs.md, requirements/web-calculator-prd.md"
name: calculation-engine
description: Calculation engine specifications and mathematical requirements for Web Calculator
applyTo: "**/*.{js,ts}"
version: "1.0.0"
author: "lyle.ubben"
tags: ["calculation", "math", "decimal-precision", "pemdas", "arithmetic", "error-handling"]
owner: "Development Team"
reviewedDate: "2026-02-12"
nextReview: "2026-05-12"
---

# Web Calculator Calculation Engine Specifications

## Overview

This instruction file defines mandatory specifications for the Web Calculator calculation engine. All mathematical operations must produce accurate, predictable results following standard arithmetic rules.

**Target Audience**: Developers, QA engineers, AI assistants
**Scope**: Mathematical operations, precision requirements, order of operations, error handling
**Related Documentation**:
- [Web Calculator FRS - Section 3.1](../../requirements/web-calculator-frs.md#31-calculation-operations-fr-calc)
- [Web Calculator FRS - Section 6](../../requirements/web-calculator-frs.md#6-business-rules)

## Table of Contents

- [Core Requirements](#core-requirements)
- [Decimal Precision](#decimal-precision)
- [Arithmetic Operations](#arithmetic-operations)
- [Order of Operations](#order-of-operations)
- [Error Handling](#error-handling)
- [Number Representation](#number-representation)
- [Business Rules](#business-rules)
- [Testing Requirements](#testing-requirements)
- [Validation Checklist](#validation-checklist)

## Core Requirements

### Precision Library Requirement

**MANDATORY**: Use `Decimal.js` or equivalent arbitrary-precision library

```javascript
// ✓ REQUIRED: Import and configure Decimal.js
import Decimal from 'decimal.js';

// Configure precision and rounding
Decimal.set({
  precision: 20,           // Internal precision: 20 significant digits
  rounding: Decimal.ROUND_HALF_UP, // Round 0.5 up
  toExpNeg: -15,           // Exponential notation threshold
  toExpPos: 15
});

// ✗ INCORRECT: Using native JavaScript numbers
const result = 0.1 + 0.2; // Returns 0.30000000000000004 - UNACCEPTABLE
```

**Why**: JavaScript's native number type (IEEE 754 floating-point) has precision errors that are unacceptable for a calculator.

### Precision Requirements

| Requirement | Value | Rationale |
|-------------|-------|-----------|
| Input digits | 15 max | Prevents overflow, matches standard calculators |
| Display decimal places | 10 places max | Balance between precision and readability |
| Internal precision | 20 significant digits | Headroom for intermediate calculations without rounding errors |
| Decimal places (display) | Variable (0-10) | Show only significant digits, trim trailing zeros |
| Rounding mode | ROUND_HALF_UP | Standard rounding (0.5 rounds up) |

**Important**: Internal precision uses **significant digits** (not just decimal places). The Decimal.js `precision` setting of 20 means calculations maintain 20 significant figures throughout, while display formatting limits the output to a maximum of 10 decimal places.

**Reference**: [FRS FR-CALC-006](../../requirements/web-calculator-frs.md#fr-calc-006-decimal-number-support)

## Decimal Precision

### FR-CALC-006: Decimal Number Support

**Requirements**:
1. Accept decimal point input via button or keyboard "."
2. Allow only ONE decimal point per number
3. Support up to 15 digits of input (including decimal point, excluding minus sign)
4. Maintain 20 significant digits internally, display up to 10 decimal places
5. Handle floating-point edge cases correctly (0.1 + 0.2 = 0.3)
6. Remove trailing zeros in display (e.g., "5.50" displays as "5.5")

### Implementation

```javascript
// ✓ CORRECT: Decimal arithmetic with proper precision
function add(operand1, operand2) {
  return Decimal(operand1).plus(operand2).toString();
}

function subtract(operand1, operand2) {
  return Decimal(operand1).minus(operand2).toString();
}

function multiply(operand1, operand2) {
  return Decimal(operand1).times(operand2).toString();
}

function divide(operand1, operand2) {
  if (Decimal(operand2).equals(0)) {
    throw new Error('Cannot divide by zero');
  }
  return Decimal(operand1).dividedBy(operand2).toString();
}

// ✗ INCORRECT: Native arithmetic
function addIncorrect(operand1, operand2) {
  return parseFloat(operand1) + parseFloat(operand2); // Precision errors
}
```

### Test Cases for Precision

```javascript
// REQUIRED: All these tests must pass
describe('Decimal Precision', () => {
  test('0.1 + 0.2 equals 0.3', () => {
    expect(add('0.1', '0.2')).toBe('0.3'); // Not 0.30000000000000004
  });
  
  test('0.3 - 0.1 equals 0.2', () => {
    expect(subtract('0.3', '0.1')).toBe('0.2');
  });
  
  test('0.1 × 0.1 equals 0.01', () => {
    expect(multiply('0.1', '0.1')).toBe('0.01');
  });
  
  test('1 ÷ 3 has 10 decimal places', () => {
    const result = divide('1', '3');
    expect(result).toBe('0.3333333333'); // Exactly 10 places
  });
});
```

### Display Formatting

```javascript
// ✓ CORRECT: Format for display (remove trailing zeros)
function formatForDisplay(value) {
  const decimal = new Decimal(value);
  
  // Round to 10 decimal places maximum for display
  let formatted = decimal.toDecimalPlaces(10, Decimal.ROUND_HALF_UP).toFixed(10);
  
  // Remove trailing zeros and unnecessary decimal point
  formatted = formatted.replace(/\.?0+$/, '');
  
  // Handle very small numbers (underflow to zero)
  if (decimal.abs().lessThan(new Decimal('1e-10'))) {
    return '0';
  }
  
  // Handle very large numbers (overflow check)
  if (decimal.abs().greaterThanOrEqualTo(new Decimal('1e16'))) {
    throw new Error('Error: Number too large');
  }
  
  return formatted;
}

// Examples:
formatForDisplay('5.00')                // '5'
formatForDisplay('5.50')                // '5.5'
formatForDisplay('5.123456789012345')   // '5.1234567890' (10 places max)
formatForDisplay('0.3333333333333')     // '0.3333333333' (10 places max)
formatForDisplay('0.10')                // '0.1' (trailing zero removed)
```

## Arithmetic Operations

### Addition (FR-CALC-001)

**Requirements**:
- Support chained additions (2 + 3 + 4 + 5)
- Handle negative numbers
- Handle decimal numbers
- Precision maintained to 10 decimal places

```javascript
// ✓ CORRECT: Addition implementation
function performAddition(state) {
  const result = Decimal(state.previousValue)
    .plus(state.currentValue);
  
  return result.toString();
}

// Test cases (REQUIRED)
expect(add('5', '3')).toBe('8');
expect(add('0.1', '0.2')).toBe('0.3');
expect(add('-5', '3')).toBe('-2');
```

### Subtraction (FR-CALC-002)

**Requirements**:
- Support chained subtractions (5 - 2 - 1)
- Evaluate left-to-right
- Support negative results
- Differentiate between subtraction operator and negative sign

```javascript
// ✓ CORRECT: Subtraction implementation
function performSubtraction(state) {
  const result = Decimal(state.previousValue)
    .minus(state.currentValue);
  
  return result.toString();
}

// Test cases (REQUIRED)
expect(subtract('10', '3')).toBe('7');
expect(subtract('3', '10')).toBe('-7');
expect(subtract('0.3', '0.1')).toBe('0.2');
```

### Multiplication (FR-CALC-003)

**Requirements**:
- Support chained multiplications (2 × 3 × 4)
- Higher precedence than addition/subtraction
- Zero property: n × 0 = 0
- Identity property: n × 1 = n

```javascript
// ✓ CORRECT: Multiplication implementation
function performMultiplication(state) {
  const result = Decimal(state.previousValue)
    .times(state.currentValue);
  
  return result.toString();
}

// Test cases (REQUIRED)
expect(multiply('5', '3')).toBe('15');
expect(multiply('7', '0')).toBe('0');
expect(multiply('8', '1')).toBe('8');
expect(multiply('0.1', '0.1')).toBe('0.01');
```

### Division (FR-CALC-004)

**Requirements**:
- Support chained divisions (20 ÷ 4 ÷ 2)
- Evaluate left-to-right
- Detect and prevent division by zero
- Display specific error message: "Cannot divide by zero"
- Higher precedence than addition/subtraction

```javascript
// ✓ CORRECT: Division with error handling
function performDivision(state) {
  const divisor = Decimal(state.currentValue);
  
  // Critical: Check for division by zero
  if (divisor.equals(0)) {
    throw new Error('Cannot divide by zero');
  }
  
  const result = Decimal(state.previousValue)
    .dividedBy(divisor);
  
  return result.toString();
}

// Test cases (REQUIRED)
expect(divide('15', '3')).toBe('5');
expect(divide('1', '3')).toBe('0.3333333333'); // 10 decimal places
expect(() => divide('10', '0')).toThrow('Cannot divide by zero');
```

## Order of Operations

### BR-002: Order of Operations (PEMDAS)

**Rule**: Multiplication and division have higher precedence than addition and subtraction

**Precedence Levels**:
1. **Parentheses** (V2.0+ feature)
2. **Exponents** (V2.0+ feature)
3. **Multiplication and Division** (left-to-right) ← MVP
4. **Addition and Subtraction** (left-to-right) ← MVP

### Implementation Strategy

```javascript
// ✓ CORRECT: Expression parser with operator precedence
class ExpressionEvaluator {
  constructor() {
    this.operatorPrecedence = {
      '+': 1,
      '-': 1,
      '×': 2,
      '÷': 2
    };
  }
  
  evaluate(expression) {
    // Parse expression into tokens
    const tokens = this.tokenize(expression);
    
    // Convert to postfix notation (Shunting Yard algorithm)
    const postfix = this.infixToPostfix(tokens);
    
    // Evaluate postfix expression
    return this.evaluatePostfix(postfix);
  }
  
  tokenize(expression) {
    // Split "2 + 3 × 4" into ["2", "+", "3", "×", "4"]
    return expression.split(' ').filter(t => t.length > 0);
  }
  
  infixToPostfix(tokens) {
    const output = [];
    const operators = [];
    
    for (const token of tokens) {
      if (this.isNumber(token)) {
        output.push(token);
      } else if (this.isOperator(token)) {
        // Pop operators with higher or equal precedence
        while (
          operators.length > 0 &&
          this.operatorPrecedence[operators[operators.length - 1]] >= 
          this.operatorPrecedence[token]
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      }
    }
    
    // Pop remaining operators
    while (operators.length > 0) {
      output.push(operators.pop());
    }
    
    return output;
  }
  
  evaluatePostfix(postfix) {
    const stack = [];
    
    for (const token of postfix) {
      if (this.isNumber(token)) {
        stack.push(new Decimal(token));
      } else if (this.isOperator(token)) {
        const b = stack.pop();
        const a = stack.pop();
        
        let result;
        switch(token) {
          case '+': result = a.plus(b); break;
          case '-': result = a.minus(b); break;
          case '×': result = a.times(b); break;
          case '÷':
            if (b.equals(0)) throw new Error('Cannot divide by zero');
            result = a.dividedBy(b);
            break;
        }
        
        stack.push(result);
      }
    }
    
    return stack[0].toString();
  }
  
  isNumber(token) {
    return !isNaN(parseFloat(token));
  }
  
  isOperator(token) {
    return ['+', '-', '×', '÷'].includes(token);
  }
}

// Usage
const evaluator = new ExpressionEvaluator();
evaluator.evaluate('2 + 3 × 4'); // Returns "14" (not "20")
```

### Test Cases for Order of Operations

```javascript
// REQUIRED: All these tests must pass
describe('Order of Operations (PEMDAS)', () => {
  test('2 + 3 × 4 equals 14 (not 20)', () => {
    expect(evaluate('2 + 3 × 4')).toBe('14');
  });
  
  test('10 - 6 ÷ 2 equals 7 (not 2)', () => {
    expect(evaluate('10 - 6 ÷ 2')).toBe('7');
  });
  
  test('2 × 3 + 4 × 5 equals 26', () => {
    expect(evaluate('2 × 3 + 4 × 5')).toBe('26');
  });
  
  test('8 ÷ 4 × 2 equals 4 (left-to-right)', () => {
    expect(evaluate('8 ÷ 4 × 2')).toBe('4');
  });
  
  test('10 - 3 + 2 equals 9 (left-to-right)', () => {
    expect(evaluate('10 - 3 + 2')).toBe('9');
  });
});
```

## Error Handling

### ERR-001: Division by Zero

**Trigger**: User attempts to divide any number by zero

**Required Behavior**:
1. Do NOT execute calculation
2. Set error state flag
3. Display error message: "Cannot divide by zero"
4. Disable numeric/operator inputs
5. Enable only Clear button

```javascript
// ✓ CORRECT: Division by zero handling
function handleCalculation(state) {
  try {
    const result = calculate(
      state.previousValue,
      state.currentValue,
      state.operator
    );
    
    return {
      ...state,
      currentValue: result,
      errorState: false,
      errorMessage: null
    };
  } catch (error) {
    if (error.message === 'Cannot divide by zero') {
      return {
        ...state,
        errorState: true,
        errorMessage: 'Cannot divide by zero',
        currentValue: 'Cannot divide by zero'
      };
    }
    throw error; // Re-throw unexpected errors
  }
}

// UI handling
function updateUI(state) {
  if (state.errorState) {
    displayElement.classList.add('error');
    displayElement.textContent = state.errorMessage;
    
    // Disable all buttons except Clear
    buttons.forEach(button => {
      if (button.dataset.action !== 'clear') {
        button.disabled = true;
      }
    });
  }
}
```

### ERR-002: Number Overflow

**Trigger**: Result exceeds 15 digits

```javascript
// ✓ CORRECT: Overflow detection
function checkOverflow(value) {
  const decimal = new Decimal(value);
  const digitsOnly = decimal.toFixed(0).replace('-', '');
  
  if (digitsOnly.length > 15) {
    throw new Error('Error: Number too large');
  }
  
  return value;
}
```

## Number Representation

### Input Validation

```javascript
// ✓ CORRECT: Number input validation
function isValidNumberInput(currentValue, newDigit) {
  // Rule: Maximum 15 digits (excluding decimal point and minus sign)
  const digitsOnly = currentValue.replace(/[.-]/g, '');
  if (digitsOnly.length >= 15 && /\d/.test(newDigit)) {
    return false; // Reject if at digit limit
  }
  
  // Rule: Only one decimal point
  if (newDigit === '.' && currentValue.includes('.')) {
    return false;
  }
  
  return true;
}

// ✓ CORRECT: Format numbers with leading/trailing zero handling
function formatNumberInput(input) {
  // Remove leading zeros except for decimals
  if (input !== '0' && input.startsWith('0') && !input.startsWith('0.')) {
    return input.replace(/^0+/, '') || '0';
  }
  
  return input;
}
```

## Business Rules

### BR-001: Division by Zero

**Rule**: Division by zero shall result in error state with specific message

**Implementation**: See [Error Handling](#err-001-division-by-zero) above

### BR-003: Number Range Limits

**Rule**: Numbers exceeding 15 digits shall be rejected or display error

```javascript
const MAX_DIGITS = 15;

function validateNumberRange(value) {
  const digitsOnly = value.replace(/[.-]/g, '');
  if (digitsOnly.length > MAX_DIGITS) {
    throw new Error('Error: Number too large');
  }
}
```

### BR-004: Decimal Precision

**Rules**:
- Internal calculations: 10 decimal places precision
- Display: Show minimum necessary decimals (trim trailing zeros)
- Rounding: Round-half-up for display purposes

```javascript
// ✓ CORRECT: Display formatting
function formatResult(value) {
  const decimal = new Decimal(value);
  
  // Round to 10 decimal places for display
  const rounded = decimal.toDecimalPlaces(10, Decimal.ROUND_HALF_UP);
  
  // Remove trailing zeros
  let formatted = rounded.toFixed(10);
  formatted = formatted.replace(/\.?0+$/, '');
  
  return formatted;
}

// Examples:
formatResult('5.00000000') // '5'
formatResult('5.50000000') // '5.5'
formatResult('5.12345678901234') // '5.1234567890'
```

### BR-010: Single Decimal Point

**Rule**: Only one decimal point allowed per number

```javascript
function handleDecimalInput(state) {
  // Reject if decimal point already exists
  if (state.currentValue.includes('.')) {
    return state; // No change
  }
  
  return {
    ...state,
    currentValue: state.currentValue + '.'
  };
}
```

### BR-011: Consecutive Operators

**Rule**: Consecutive operator inputs replace the previous operator

**Behavior**:
- `5 + + 3` → Second `+` replaces first → Evaluates as `5 + 3`
- `5 + × 3` → `×` replaces `+` → Evaluates as `5 × 3`
- `5 × - 3` → Allow negative sign after operator (see BR-012)

```javascript
// ✓ CORRECT: Handle consecutive operators
function handleOperatorInput(state, operator) {
  // If user presses operator immediately after another operator
  // Replace the previous operator (except for negative sign handling)
  if (state.waitingForOperand && state.operator) {
    // Special case: Allow minus after operator for negative numbers
    if (operator === '-' && state.operator !== '-') {
      // Start entering negative number
      return {
        ...state,
        currentValue: '-',
        waitingForOperand: false
      };
    }
    
    // Otherwise, replace the operator
    return {
      ...state,
      operator: operator
    };
  }
  
  // Normal operator handling...
  return processOperator(state, operator);
}
```

### BR-012: Negative Number Input

**Rule**: Support entering negative numbers

**Methods**:
1. **Minus after operator**: `5 × - 3` → Multiply by negative three
2. **Negate button** (+/−): Toggle sign of current value (V1.1+ feature)

```javascript
// ✓ CORRECT: Negative number support
function handleNegativeInput(state, digit) {
  // If entering digits after minus following an operator
  if (state.currentValue === '-') {
    return {
      ...state,
      currentValue: '-' + digit,
      waitingForOperand: false
    };
  }
  
  // Normal digit handling
  return handleDigitInput(state, digit);
}

// V1.1+ Toggle sign function
function toggleSign(state) {
  const value = Decimal(state.currentValue);
  return {
    ...state,
    currentValue: value.negated().toString()
  };
}
```

### BR-013: Repeated Equals Behavior

**Rule**: Pressing equals multiple times repeats the last operation

**Example**:
- `5 + 3 = ` → Display shows `8`
- `= ` → Adds 3 again → Display shows `11`
- `= ` → Adds 3 again → Display shows `14`

```javascript
// ✓ CORRECT: Repeat last operation on consecutive equals
function handleEquals(state) {
  if (!state.operator) {
    return state; // No operation to perform
  }
  
  // Perform calculation
  const result = calculate(
    state.previousValue,
    state.currentValue,
    state.operator
  );
  
  // Store operation for repeat
  return {
    ...state,
    currentValue: result,
    previousValue: result,          // Update for repeat
    lastOperand: state.currentValue, // Store for repeat
    lastOperator: state.operator,    // Store for repeat
    waitingForOperand: true
  };
}

function handleRepeatedEquals(state) {
  if (!state.lastOperator || !state.lastOperand) {
    return state; // No previous operation to repeat
  }
  
  // Repeat the last operation
  const result = calculate(
    state.currentValue,
    state.lastOperand,
    state.lastOperator
  );
  
  return {
    ...state,
    currentValue: result,
    previousValue: result
  };
}
```

### BR-014: Clear (C) vs All Clear (AC)

**Rule**: Different clear operations for different contexts

**Clear (C)** - MVP:
- Clears current value only
- Preserves operator and previous value
- Allows continuing the calculation
- Label shows "C"

**All Clear (AC)** - V1.1+ feature:
- Resets entire calculator state
- Clears all values, operators, and memory
- Returns to initial state
- Label shows "AC"

```javascript
// ✓ CORRECT: Clear current entry (MVP)
function handleClear(state) {
  return {
    ...state,
    currentValue: '0',
    errorState: false,
    errorMessage: null
    // Preserves: previousValue, operator
  };
}

// ✓ CORRECT: All Clear - reset everything (V1.1+)
function handleAllClear(state) {
  return {
    currentValue: '0',
    previousValue: null,
    operator: null,
    lastOperand: null,
    lastOperator: null,
    errorState: false,
    errorMessage: null,
    waitingForOperand: false
  };
}

// MVP Implementation: Single clear button behavior
// Shows "C" when editing, "AC" after equals or error
function getClearButtonLabel(state) {
  if (state.errorState || state.waitingForOperand) {
    return 'AC'; // Full reset needed
  }
  return 'C'; // Just clear current entry
}
```

## Testing Requirements

### Required Test Coverage

**Minimum**: 100% coverage of calculation engine functions

```javascript
describe('Calculation Engine', () => {
  // Basic operations
  describe('Addition', () => {
    test('adds positive numbers', () => {
      expect(add('5', '3')).toBe('8');
    });
    
    test('handles decimal precision', () => {
      expect(add('0.1', '0.2')).toBe('0.3');
    });
    
    test('handles negative numbers', () => {
      expect(add('-5', '3')).toBe('-2');
    });
    
    test('chained additions', () => {
      expect(add(add('2', '3'), '4')).toBe('9');
    });
  });
  
  // Division by zero
  describe('Division', () => {
    test('divides correctly', () => {
      expect(divide('15', '3')).toBe('5');
    });
    
    test('throws on division by zero', () => {
      expect(() => divide('10', '0')).toThrow('Cannot divide by zero');
    });
    
    test('handles repeating decimals', () => {
      expect(divide('1', '3')).toBe('0.3333333333');
    });
  });
  
  // Order of operations
  describe('Expression Evaluation', () => {
    test('multiplication before addition', () => {
      expect(evaluate('2 + 3 × 4')).toBe('14');
    });
    
    test('division before subtraction', () => {
      expect(evaluate('10 - 6 ÷ 2')).toBe('7');
    });
    
    test('left-to-right for same precedence', () => {
      expect(evaluate('8 ÷ 4 × 2')).toBe('4');
      expect(evaluate('10 - 3 + 2')).toBe('9');
    });
  });
  
  // Edge cases
  describe('Edge Cases', () => {
    test('handles very small numbers', () => {
      expect(add('0.0000000001', '0.0000000002')).toBe('0.0000000003');
    });
    
    test('handles large numbers', () => {
      expect(add('999999999999999', '1')).toBe('1000000000000000');
    });
    
    test('detects overflow', () => {
      expect(() => multiply('9999999999999999', '10'))
        .toThrow('Error: Number too large');
    });
  });
});
```

## Validation Checklist

Before merging calculation engine code:

### Precision
- [ ] Decimal.js library configured correctly
- [ ] All operations use Decimal, not native numbers
- [ ] Floating-point test cases pass (0.1 + 0.2 = 0.3)
- [ ] Precision maintained to 10 decimal places

### Operations
- [ ] Addition produces correct results
- [ ] Subtraction handles negative results
- [ ] Multiplication respects zero and identity properties
- [ ] Division handles division by zero with specific error

### Order of Operations
- [ ] PEMDAS test cases pass
- [ ] Multiplication/division before addition/subtraction
- [ ] Same-level operators evaluate left-to-right
- [ ] Expression parser handles complex expressions

### Error Handling
- [ ] Division by zero throws correct error
- [ ] Overflow detected and handled
- [ ] Error messages match specification exactly
- [ ] Error state properly managed

### Testing
- [ ] 100% code coverage for calculation functions
- [ ] All test cases from FRS implemented
- [ ] Edge cases tested (very small, very large, zero, negative)
- [ ] Performance tests pass (< 50ms calculation time)

## References

- [Web Calculator FRS - Calculation Operations](../../requirements/web-calculator-frs.md#31-calculation-operations-fr-calc)
- [Web Calculator FRS - Business Rules](../../requirements/web-calculator-frs.md#6-business-rules)
- [Decimal.js Documentation](https://mikemcl.github.io/decimal.js/)
- [IEEE 754 Floating Point](https://en.wikipedia.org/wiki/IEEE_754)

---

**Critical Requirement**: All calculation code MUST use Decimal.js or equivalent
**Contact**: Development Team for calculation engine questions
**Last Updated**: 2026-02-12

## Future Enhancements

### Percentage Operator (V1.1+)

**Scope**: Not included in MVP, planned for V1.1

**Expected Behavior**:
- `100 × 15%` → Calculate 15% of 100 → Result: `15`
- `100 + 15%` → Add 15% of 100 to 100 → Result: `115`
- `100 - 15%` → Subtract 15% of 100 from 100 → Result: `85`

```javascript
// V1.1+ Percentage implementation
function handlePercentage(state) {
  if (!state.previousValue || !state.operator) {
    // Percentage without context: divide by 100
    return {
      ...state,
      currentValue: Decimal(state.currentValue).dividedBy(100).toString()
    };
  }
  
  const base = Decimal(state.previousValue);
  const percent = Decimal(state.currentValue).dividedBy(100);
  
  switch(state.operator) {
    case '×':
    case '÷':
      // Multiplication/division: just convert to decimal
      return {
        ...state,
        currentValue: percent.toString()
      };
    
    case '+':
    case '-':
      // Addition/subtraction: calculate percentage of base
      return {
        ...state,
        currentValue: base.times(percent).toString()
      };
  }
}
```
