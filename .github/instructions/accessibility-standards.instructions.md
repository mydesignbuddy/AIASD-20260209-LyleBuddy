---
ai_generated: true
model: "anthropic/claude-3.5-sonnet@2024-10-22"
operator: "lyle.ubben"
chat_id: "frs-instructions-20260212-002"
prompt: |
  Generate instruction files from the business requirements in PRD and FRS documents,
  specifically for accessibility standards.
started: "2026-02-12T16:00:00Z"
ended: "2026-02-12T16:15:00Z"
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
name: accessibility-standards
description: WCAG 2.1 AA accessibility compliance requirements for Web Calculator
applyTo: "**/*.{html,css,js,ts,jsx,tsx}"
version: "1.0.0"
author: "lyle.ubben"
tags: ["accessibility", "wcag", "a11y", "compliance", "keyboard-navigation", "screen-reader"]
owner: "Development Team"
reviewedDate: "2026-02-12"
nextReview: "2026-05-12"
---

# Web Calculator Accessibility Standards

## Overview

This instruction file defines mandatory accessibility requirements for the Web Calculator application. All code must comply with WCAG 2.1 Level AA standards to ensure the calculator is usable by people with disabilities.

**Target Audience**: Developers, QA engineers, AI assistants
**Scope**: Accessibility requirements for UI components, keyboard navigation, screen reader support, and visual design
**Related Documentation**:
- [Web Calculator FRS - Section 9.2](../../requirements/web-calculator-frs.md#92-accessibility-requirements)
- [Web Calculator Performance Standards](.\performance-standards.instructions.md) - Animation performance requirements (60 FPS)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Table of Contents

- [Mandatory Requirements](#mandatory-requirements)
- [Color Contrast Standards](#color-contrast-standards)
- [Keyboard Accessibility](#keyboard-accessibility)
- [Screen Reader Support](#screen-reader-support)
- [Touch Target Sizing](#touch-target-sizing)
- [Focus Management](#focus-management)
- [ARIA Implementation](#aria-implementation)
- [Testing Requirements](#testing-requirements)
- [Validation Checklist](#validation-checklist)

## Mandatory Requirements

### HTML Document Structure

**WCAG 2.1 Success Criterion 3.1.1 (Level A)**: Page MUST have language declared

```html
<!-- ✓ CORRECT: Language declaration -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Calculator - Accessible Online Calculator</title>
  <!-- ... -->
</head>
```

**Requirements**:
- `lang` attribute MUST be present on `<html>` element
- `<title>` element MUST be descriptive and unique
- `<meta charset>` MUST be specified (UTF-8)
- `<meta name="viewport">` MUST be present for responsive design

**Why**: Screen readers use language declaration to pronounce content correctly. Title helps users understand page purpose when navigating browser tabs.

### NFR-A11Y-001: WCAG 2.1 AA Compliance

**Requirement**: Application SHALL meet WCAG 2.1 Level AA standards

**Critical Success Criteria**:
- ✓ Zero violations in axe DevTools automated scans
- ✓ Manual testing passes with NVDA or JAWS screen readers
- ✓ All functionality accessible via keyboard only
- ✓ Focus indicators visible at all times
- ✓ Text resizable to 200% without loss of functionality

**Reference**: [FRS NFR-A11Y-001](../../requirements/web-calculator-frs.md)

## Color Contrast Standards

### Minimum Contrast Ratios

**Text Contrast** (WCAG 2.1 Success Criterion 1.4.3):
- Normal text (< 18pt): **4.5:1** minimum
- Large text (≥ 18pt or ≥ 14pt bold): **3:1** minimum
- UI components and graphics: **3:1** minimum

### Implementation Rules

```css
/* ✓ CORRECT: High contrast display */
.calculator-display {
  background-color: #ffffff;
  color: #000000; /* 21:1 contrast ratio */
}

/* ✓ CORRECT: Sufficient contrast for buttons */
.calculator-button {
  background-color: #f0f0f0;
  color: #333333; /* 11.4:1 contrast ratio */
}

/* ✗ INCORRECT: Insufficient contrast */
.calculator-button-error {
  background-color: #ffcccc;
  color: #ff6666; /* Only 2.3:1 - FAILS AA */
}

/* ✓ CORRECT: Error state with sufficient contrast */
.calculator-button-error {
  background-color: #fff5f5;
  color: #cc0000; /* 5.9:1 - PASSES AA */
}
```

### Testing Contrast

**Required Tools**:
- Chrome DevTools Contrast Checker
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- axe DevTools browser extension

**Process**:
1. Test all text against backgrounds
2. Test button states (default, hover, active, focus, disabled)
3. Test error messages and notifications
4. Document contrast ratios in design system

## Keyboard Accessibility

### Keyboard Navigation Requirements

**All functionality MUST be operable via keyboard**:

| Function | Keyboard Shortcut | Alternative | Notes |
|----------|-------------------|-------------|-------|
| Number input | 0-9 | Numpad 0-9 | |
| Addition | + | Numpad + | |
| Subtraction | - | Numpad - | |
| Multiplication | * (asterisk) | Numpad * | |
| Division | / (slash) | Numpad / | |
| Decimal | . (period) | Numpad . | |
| Equals | Enter | Numpad Enter | |
| Clear | Escape | - | Full reset |
| Backspace | Backspace | - | Delete last digit |
| Delete | Delete | - | Same as Backspace |
| Focus navigation | Tab | - |
| Reverse navigation | Shift+Tab | - |

### Implementation Pattern

```javascript
// ✓ CORRECT: Comprehensive keyboard handler
document.addEventListener('keydown', (event) => {
  const { key, shiftKey, ctrlKey, metaKey } = event;
  
  // Don't interfere with browser shortcuts
  if (ctrlKey || metaKey) return;
  
  // Handle calculator keys
  if (/^[0-9]$/.test(key)) {
    handleDigitInput(key);
    event.preventDefault();
    return;
  }
  
  // Operator keys
  if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
    event.preventDefault();
    return;
  }
  
  // Special keys
  switch(key) {
    case 'Enter':
      handleEquals();
      event.preventDefault();
      break;
    case 'Escape':
      handleClear();
      event.preventDefault();
      break;
    case 'Backspace':
    case 'Delete':
      handleBackspace();
      event.preventDefault();
      break;
  }
});
```

### No Keyboard Traps

**Rule**: Users MUST be able to navigate away from any element using keyboard alone

```javascript
// ✗ INCORRECT: Trapping focus
document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault(); // NEVER do this globally
  }
});

// ✓ CORRECT: Allow Tab navigation, manage focus properly
function setupFocusTrap(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Only trap within modal/dialog contexts, not main app
  if (isModal(container)) {
    container.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    });
  }
}
```

## Screen Reader Support

### ARIA Labels for All Buttons

**Rule**: Every interactive element MUST have an accessible name

```html
<!-- ✓ CORRECT: Proper ARIA labels -->
<button class="calculator-button number" aria-label="Seven">7</button>
<button class="calculator-button operator" aria-label="Plus">+</button>
<button class="calculator-button equals" aria-label="Equals">=</button>
<button class="calculator-button clear" aria-label="Clear">C</button>
<button class="calculator-button backspace" aria-label="Backspace">←</button>

<!-- ✗ INCORRECT: No accessible name -->
<button class="calculator-button">7</button> <!-- Just visual text -->
<button class="calculator-button">+</button> <!-- Symbol without context -->
```

### Live Regions for Display Updates

**Rule**: Display value changes MUST be announced to screen readers

```html
<!-- ✓ CORRECT: Display with live region -->
<div class="calculator-display" 
     role="region" 
     aria-live="polite" 
     aria-atomic="true"
     aria-label="Calculator display">
  <div class="display-expression" aria-label="Expression">5 + 3</div>
  <div class="display-result" aria-label="Result">8</div>
</div>
```

**ARIA Live Region Rules**:
- Use `aria-live="polite"` for display updates (non-urgent)
- Use `aria-live="assertive"` for errors (urgent)
- Set `aria-atomic="true"` to announce entire content
- Update content programmatically triggers announcement

```javascript
// ✓ CORRECT: Update display with screen reader announcement
function updateDisplay(value, expression = '') {
  const display = document.querySelector('.calculator-display');
  const resultElement = display.querySelector('.display-result');
  const expressionElement = display.querySelector('.display-expression');
  
  // Update content (triggers aria-live announcement)
  resultElement.textContent = value;
  if (expression) {
    expressionElement.textContent = expression;
  }
  
  // Optionally update aria-label for clarity
  display.setAttribute('aria-label', 
    `Calculator display showing ${expression ? expression + ' equals ' : ''}${value}`
  );
}
```

### Error Announcements

```html
<!-- ✓ CORRECT: Error with assertive announcement -->
<div class="calculator-display error" 
     role="alert" 
     aria-live="assertive"
     aria-atomic="true">
  <span class="error-message">Cannot divide by zero</span>
</div>
```

```javascript
// ✓ CORRECT: Error handling with screen reader support
function showError(message) {
  state.errorState = true;
  state.errorMessage = message;
  
  const display = document.querySelector('.calculator-display');
  display.classList.add('error');
  display.setAttribute('role', 'alert'); // Triggers assertive announcement
  display.setAttribute('aria-live', 'assertive');
  display.textContent = message;
}
```

## Touch Target Sizing

### Minimum Touch Target Requirements

**WCAG 2.1 Success Criterion 2.5.5 (AAA) - Target Size**:
- Minimum: **44×44 CSS pixels**
- Recommended: **48×48 CSS pixels** for better usability

### Implementation

```css
/* ✓ CORRECT: Accessible touch targets */
.calculator-button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
  
  /* See performance-standards.instructions.md for animation requirements */
  transition: transform 0.15s ease;
  
  /* Increase on larger screens */
  @media (min-width: 768px) {
    min-width: 56px;
    min-height: 56px;
  }
  
  @media (min-width: 1024px) {
    min-width: 64px;
    min-height: 64px;
  }
}

/* ✗ INCORRECT: Too small for touch */
.calculator-button-incorrect {
  width: 30px;
  height: 30px; /* Only 30×30px - FAILS WCAG */
}
```

### Spacing Between Targets

**Rule**: Maintain adequate spacing between interactive elements

```css
/* ✓ CORRECT: Spacing prevents accidental touches */
.calculator-button {
  margin: 4px;
  /* Creates 8px gap between buttons */
}

.calculator-grid {
  gap: 8px; /* Using CSS Grid gap */
}
```

## Focus Management

### Visible Focus Indicators

**WCAG 2.1 Success Criterion 2.4.7**: Focus indicator MUST be clearly visible

```css
/* ✓ CORRECT: High-contrast focus indicator */
.calculator-button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  /* Ensure focus visible in both light and dark modes */
}

/* Alternative: Custom focus ring */
.calculator-button:focus-visible {
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.4);
  outline: 2px solid #0066cc;
}

/* ✗ INCORRECT: Removing focus outline */
.calculator-button:focus {
  outline: none; /* NEVER remove without replacement */
}

/* ✗ INCORRECT: Insufficient contrast */
.calculator-button:focus {
  outline: 1px solid #ccc; /* Too thin, low contrast */
}
```

### Focus Order

**Rule**: Tab order MUST follow logical reading order (left-to-right, top-to-bottom)

```html
<!-- ✓ CORRECT: Logical tab order -->
<div class="calculator">
  <div class="calculator-display" tabindex="0"></div>
  
  <div class="calculator-grid">
    <!-- Row 1: 7, 8, 9, ÷ -->
    <button tabindex="0">7</button>
    <button tabindex="0">8</button>
    <button tabindex="0">9</button>
    <button tabindex="0">÷</button>
    
    <!-- Row 2: 4, 5, 6, × -->
    <button tabindex="0">4</button>
    <button tabindex="0">5</button>
    <button tabindex="0">6</button>
    <button tabindex="0">×</button>
    
    <!-- ...etc -->
  </div>
</div>

<!-- ✗ INCORRECT: Custom tabindex that breaks logical order -->
<button tabindex="5">5</button>
<button tabindex="1">1</button> <!-- Will focus before 5 -->
```

### Reduced Motion Support

**WCAG 2.1 Success Criterion 2.3.3**: Respect user preference for reduced motion

**Why**: Users with vestibular disorders may experience nausea or dizziness from animations.

```css
/* ✓ CORRECT: Respect prefers-reduced-motion */
.calculator-button {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.calculator-button:active {
  transform: scale(0.98);
}

/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .calculator-button {
    transition: none;
  }
  
  .calculator-button:active {
    transform: none;
    opacity: 0.9; /* Use opacity instead of transform */
  }
  
  /* Disable all non-essential animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Testing**:
- **Windows**: Settings > Ease of Access > Display > Show animations
- **macOS**: System Preferences > Accessibility > Display > Reduce motion
- **iOS**: Settings > Accessibility > Motion > Reduce Motion
- **Android**: Settings > Accessibility > Remove animations

**Implementation Requirements**:
- ALL animations MUST respect `prefers-reduced-motion`
- Functionality MUST work identically with/without animations
- Consider using opacity changes instead of transforms for reduced motion
- See [Performance Standards](./performance-standards.instructions.md#nfr-perf-004-animation-performance) for related requirements

## ARIA Implementation

### Calculator Application Role

```html
<!-- ✓ CORRECT: Proper semantic structure -->
<main role="main">
  <div class="calculator" 
       role="application"
       aria-label="Web Calculator">
    
    <div class="calculator-display" 
         role="region"
         aria-live="polite"
         aria-atomic="true"
         aria-label="Calculator display showing result">
      <span id="calc-result">0</span>
    </div>
    
    <div class="calculator-controls" 
         role="group"
         aria-label="Calculator buttons">
      <!-- Buttons here -->
    </div>
  </div>
</main>
```

### Button Roles and States

```html
<!-- ✓ CORRECT: Buttons with state management -->
<button type="button"
        class="calculator-button operator"
        aria-label="Addition"
        aria-pressed="false">
  +
</button>

<!-- For toggle buttons (if applicable) -->
<button type="button"
        class="calculator-mode-toggle"
        aria-label="Toggle scientific mode"
        aria-pressed="false"
        aria-describedby="mode-description">
  SCI
</button>
<span id="mode-description" class="sr-only">
  Switches between basic and scientific calculator modes
</span>
```

### Screen Reader Only Content

```css
/* ✓ CORRECT: Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

```html
<!-- ✓ CORRECT: Additional context for screen readers -->
<button aria-label="Seven">
  7
  <span class="sr-only">Number button</span>
</button>
```

## Testing Requirements

### Automated Testing

**Required Tools**:
- **axe DevTools**: Browser extension for automated WCAG testing
- **Lighthouse**: Accessibility audit in Chrome DevTools
- **eslint-plugin-jsx-a11y**: Linting for React (if applicable)

**Acceptance Criteria**:
- Zero axe violations at WCAG 2.1 AA level
- Lighthouse accessibility score ≥ 95
- All linting rules pass

### Manual Testing

**Required Testing Protocol**:

1. **Keyboard-Only Navigation**:
   - Unplug mouse, use keyboard only
   - Complete full workflow (calculation, clear, error recovery)
   - Verify Tab order is logical
   - Verify all functions accessible

2. **Screen Reader Testing**:
   - **Desktop** (Windows): Test with NVDA (free) or JAWS
   - **Desktop** (macOS): Test with VoiceOver (built-in)
   - **Mobile** (iOS): Test with VoiceOver (Settings > Accessibility > VoiceOver)
   - **Mobile** (Android): Test with TalkBack (Settings > Accessibility > TalkBack)
   - Verify all button labels announced correctly
   - Verify display updates announced (aria-live regions)
   - Verify error messages announced immediately
   - Test navigation order matches visual layout
   - Test with both touch and swipe gestures (mobile)

3. **Zoom/Resize Testing**:
   - Test at 200% browser zoom
   - Verify no horizontal scrolling
   - Verify all content remains accessible
   - Verify touch targets still adequate

4. **Color Blindness Testing**:
   - Use browser extension (e.g., "Colorblind - Dalton")
   - Verify information not conveyed by color alone
   - Test with deuteranopia, protanopia, tritanopia filters

5. **Motion Sensitivity Testing**:
   - Enable "Reduce Motion" in OS settings (Windows/macOS/iOS/Android)
   - Verify animations are reduced or removed
   - Verify functionality still works without animations
   - Test with `prefers-reduced-motion: reduce` media query

### Screen Reader Testing Details

**Mobile Screen Readers**:

**iOS VoiceOver**:
- Enable: Settings > Accessibility > VoiceOver
- Gestures:
  - Swipe right/left: Navigate between elements
  - Double-tap: Activate button
  - Two-finger swipe up: Read from top
  - Three-finger swipe: Scroll
- Test calculator buttons announce correctly ("Seven button", "Plus button")
- Test display updates announce immediately with aria-live

**Android TalkBack**:
- Enable: Settings > Accessibility > TalkBack
- Gestures:
  - Swipe right/left: Navigate between elements
  - Double-tap: Activate button
  - Swipe down then up: Read from top
  - Two-finger swipe: Scroll
- Verify focus indicator visible on all interactive elements
- Test with motion gestures enabled and disabled

### Test Documentation

**Required**: Document test results for each release

```markdown
## Accessibility Test Results - Version 1.0.0

**Date**: 2026-02-12
**Tester**: lyle.ubben

### Automated Testing
- ✓ axe DevTools: 0 violations (WCAG 2.1 AA)
- ✓ Lighthouse: Accessibility score 98/100
- ✓ HTML validation: No errors

### Manual Testing
- ✓ Keyboard navigation: All functions accessible
- ✓ NVDA screen reader (Windows): All content announced correctly
- ✓ VoiceOver (macOS): All interactions accessible
- ✓ VoiceOver (iOS): Touch and swipe gestures work correctly
- ✓ TalkBack (Android): All buttons and display updates announced
- ✓ 200% zoom: No loss of functionality
- ✓ Color blindness: No color-only information
- ✓ Reduced motion: Animations disabled, functionality preserved

### Issues Found
- None

### Recommendations
- Consider adding keyboard shortcut documentation accessible via "?" key
```

## Validation Checklist

Before merging any UI code, verify:

### Color Contrast
- [ ] All text meets 4.5:1 contrast ratio (normal text)
- [ ] Large text meets 3:1 contrast ratio
- [ ] UI components meet 3:1 contrast ratio
- [ ] Focus indicators clearly visible
- [ ] Error messages have sufficient contrast

### Keyboard Accessibility
- [ ] All functions operable via keyboard
- [ ] Tab order is logical
- [ ] No keyboard traps
- [ ] Focus indicator always visible
- [ ] Keyboard shortcuts don't conflict with browser

### Screen Reader Support
- [ ] All buttons have aria-label attributes
- [ ] Display has aria-live region
- [ ] Errors use role="alert"
- [ ] Semantic HTML used where possible
- [ ] ARIA labels accurate and descriptive

### Touch Targets
- [ ] All buttons minimum 44×44px
- [ ] Adequate spacing between targets (≥8px)
- [ ] Buttons scale appropriately on different screens

### Testing
- [ ] axe DevTools shows 0 violations
- [ ] Manual keyboard navigation tested
- [ ] Screen reader tested (NVDA or JAWS on desktop)
- [ ] Screen reader tested (VoiceOver or TalkBack on mobile)
- [ ] Zoom to 200% tested
- [ ] Reduced motion preference tested
- [ ] HTML lang attribute present
- [ ] Page title descriptive and unique
- [ ] Test results documented

### Documentation
- [ ] Accessibility features documented in README
- [ ] Keyboard shortcuts documented
- [ ] Test results attached to PR
- [ ] Known issues logged with remediation plan

## Common Mistakes to Avoid

### ❌ Mistake 1: Removing Focus Outlines

```css
/* NEVER DO THIS */
* {
  outline: none;
}

button:focus {
  outline: none;
}
```

**Why it's wrong**: Keyboard users cannot see where focus is
**Solution**: Always provide visible focus indicator

### ❌ Mistake 2: Using Only Color to Convey Information

```css
/* INSUFFICIENT: Color-only error indication */
.display.error {
  color: red; /* Color blind users cannot distinguish */
}
```

**Solution**: Use multiple indicators (color + icon + text)

```html
<div class="display error">
  <span class="error-icon" aria-hidden="true">⚠</span>
  <span class="error-message">Cannot divide by zero</span>
</div>
```

### ❌ Mistake 3: Missing ARIA Labels

```html
<!-- INCORRECT: Symbol without context -->
<button>+</button>
<button>×</button>
<button>=</button>
```

**Solution**: Always provide aria-label

```html
<button aria-label="Addition">+</button>
<button aria-label="Multiplication">×</button>
<button aria-label="Equals">=</button>
```

### ❌ Mistake 4: Tiny Touch Targets

```css
/* FAILS WCAG: Too small */
.button {
  width: 32px;
  height: 32px;
}
```

**Solution**: Minimum 44×44px

### ❌ Mistake 5: Not Testing with Real Users

**Problem**: Assuming automated tests are sufficient

**Solution**: Conduct manual testing with:
- Keyboard-only users
- Screen reader users
- Users with low vision
- Users with motor disabilities

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Calculator FRS - NFR-A11Y](../../requirements/web-calculator-frs.md#92-accessibility-requirements)
- [MDN: ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [A11y Project](https://www.a11yproject.com/)

---

**Compliance Enforcement**: All PRs must pass accessibility validation before merge.
**Contact**: Development Team for accessibility questions
**Last Updated**: 2026-02-12
