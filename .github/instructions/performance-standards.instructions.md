---
ai_generated: true
model: "anthropic/claude-3.5-sonnet@2024-10-22"
operator: "lyle.ubben"
chat_id: "frs-instructions-20260212-002"
prompt: |
  Generate instruction files from the business requirements in PRD and FRS documents,
  specifically for performance standards.
started: "2026-02-12T16:15:00Z"
ended: "2026-02-12T16:30:00Z"
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
name: performance-standards
description: Performance requirements and optimization standards for Web Calculator
applyTo: "**/*.{html,css,js,ts,jsx,tsx}"
version: "1.0.0"
author: "lyle.ubben"
tags: ["performance", "optimization", "load-time", "response-time", "web-vitals"]
owner: "Development Team"
reviewedDate: "2026-02-12"
nextReview: "2026-05-12"
---

# Web Calculator Performance Standards

## Overview

This instruction file defines mandatory performance requirements for the Web Calculator application. All code must meet specified performance targets to ensure fast, responsive user experience.

**Target Audience**: Developers, performance engineers, AI assistants
**Scope**: Page load performance, runtime performance, bundle size, and optimization techniques
**Related Documentation**:
- [Web Calculator FRS - Section 9.1](../../requirements/web-calculator-frs.md#91-performance-requirements)
- [Web Calculator Accessibility Standards](.\accessibility-standards.instructions.md) - Focus indicators and animation requirements
- [Web Calculator Calculation Engine](.\calculation-engine.instructions.md) - Decimal.js precision requirements
- [Web Vitals](https://web.dev/vitals/)

## Table of Contents

- [Performance Targets](#performance-targets)
- [Page Load Performance](#page-load-performance)
- [Runtime Performance](#runtime-performance)
- [Bundle Size Limits](#bundle-size-limits)
- [Optimization Requirements](#optimization-requirements)
- [Measurement and Monitoring](#measurement-and-monitoring)
- [Performance Budget](#performance-budget)
- [Validation Checklist](#validation-checklist)

## Performance Targets

### Critical Performance Requirements

| Metric | Target | Measurement | Priority |
|--------|--------|-------------|----------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse | P0 |
| Largest Contentful Paint (LCP) | < 2.5s | Web Vitals | P0 |
| Time to Interactive (TTI) | < 3.0s | Lighthouse | P0 |
| Calculation Response | < 50ms | Custom instrumentation | P0 |
| UI Response Time | < 100ms | Animation frame timing | P0 |
| Total Page Size | < 200KB | Network tab | P0 |
| Bundle Size (gzipped) | < 50KB | Webpack/bundle analyzer | P0 |
| Animation Frame Rate | 60 FPS | Chrome DevTools | P1 |

**Reference**: [FRS Section 9.1](../../requirements/web-calculator-frs.md#91-performance-requirements)

## Page Load Performance

### NFR-PERF-003: Page Load Targets

**Requirements**:
- First Contentful Paint (FCP): **< 1.5 seconds**
- Largest Contentful Paint (LCP): **< 2.5 seconds**
- Time to Interactive (TTI): **< 3.0 seconds**
- Total page size: **< 200KB** (all assets)

### Critical Rendering Path Optimization

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ✓ CORRECT: Minimal critical CSS inline -->
  <style>
    /* Inline only critical above-the-fold CSS (< 14KB) */
    body { margin: 0; font-family: system-ui; }
    .calculator { /* critical styles */ }
  </style>
  
  <!-- ✓ CORRECT: Preload critical resources -->
  <link rel="preload" href="/fonts/calculator-font.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- ✓ CORRECT: Async non-critical CSS -->
  <link rel="stylesheet" href="/styles/calculator.css" media="print" onload="this.media='all'">
  
  <!-- ✓ CORRECT: Defer non-critical JavaScript -->
  <script src="/js/calculator.js" defer></script>
</head>
<body>
  <div id="calculator-root"></div>
  
  <!-- ✗ INCORRECT: Blocking script in body -->
  <!-- <script src="/js/analytics.js"></script> -->
  
  <!-- ✓ CORRECT: Async non-critical scripts -->
  <script src="/js/analytics.js" async></script>
</body>
</html>
```

### Resource Loading Strategy

```javascript
// ✓ CORRECT: Lazy load non-critical features
async function loadAdvancedFeatures() {
  if (user.requestsScientificMode) {
    const scientificModule = await import('./scientific-mode.js');
    scientificModule.init();
  }
}

// ✓ CORRECT: Code splitting for V1.1+ features
async function loadHistory() {
  const { HistoryManager } = await import('./history-manager.js');
  return new HistoryManager();
}

// ✗ INCORRECT: Loading everything upfront
// import './scientific-mode.js'; // Not needed for MVP
// import './history-manager.js'; // V1.1+ feature
```

## Runtime Performance

### NFR-PERF-001: Calculation Response Time

**Requirement**: Calculations SHALL complete in **< 50ms**

```javascript
// ✓ CORRECT: Using efficient decimal library
import Decimal from 'decimal.js';

function calculate(operand1, operand2, operator) {
  const start = performance.now();
  
  let result;
  switch(operator) {
    case '+':
      result = Decimal(operand1).plus(operand2);
      break;
    case '-':
      result = Decimal(operand1).minus(operand2);
      break;
    case '×':
      result = Decimal(operand1).times(operand2);
      break;
    case '÷':
      if (Decimal(operand2).equals(0)) {
        throw new Error('Cannot divide by zero');
      }
      result = Decimal(operand1).dividedBy(operand2);
      break;
  }
  
  const duration = performance.now() - start;
  
  // Monitor performance
  if (duration > 50) {
    console.warn(`Calculation exceeded 50ms target: ${duration.toFixed(2)}ms`);
  }
  
  return result.toString();
}

// ✗ INCORRECT: Inefficient calculation
function calculateSlow(operand1, operand2, operator) {
  // Don't parse strings repeatedly
  const a = parseFloat(operand1);
  const b = parseFloat(operand2);
  
  // Native floating point has precision issues
  if (operator === '+') {
    return (a + b).toString(); // 0.1 + 0.2 = 0.30000000000000004
  }
  // ...
}
```

### NFR-PERF-002: UI Response Time

**Requirement**: Button press SHALL provide feedback within **< 100ms**

```javascript
// ✓ CORRECT: Immediate UI update, async calculation if needed
function handleButtonPress(button) {
  const startTime = performance.now();
  
  // 1. Immediate visual feedback (< 16ms for smooth animation)
  button.classList.add('active');
  
  // 2. Update display synchronously (< 50ms)
  updateDisplay(button.value);
  
  // 3. Log performance
  const duration = performance.now() - startTime;
  if (duration > 100) {
    console.warn(`UI update too slow: ${duration.toFixed(2)}ms`);
  }
  
  // 4. Remove active state after animation
  setTimeout(() => button.classList.remove('active'), 150);
}

// ✗ INCORRECT: Synchronous heavy operations
function handleButtonPressSlow(button) {
  // Don't do expensive operations in event handler
  recalculateEntireHistory(); // Blocks UI
  validateAllInputs(); // Blocks UI
  updateAllComponents(); // Blocks UI
  button.classList.add('active');
}
```

### NFR-PERF-004: Animation Performance

**Requirement**: UI animations SHALL maintain **60 FPS** (16.67ms per frame)

```css
/* ✓ CORRECT: GPU-accelerated animations */
.calculator-button {
  transition: transform 0.15s ease, opacity 0.15s ease;
  will-change: transform, opacity; /* Hint for GPU acceleration */
}

.calculator-button:active {
  transform: scale(0.98); /* GPU-accelerated */
  opacity: 0.9;
}

/* ✗ INCORRECT: Layout-triggering animations */
.calculator-button-slow:active {
  width: 98%; /* Triggers layout reflow - SLOW */
  margin: 1%; /* Triggers layout reflow - SLOW */
}
```

```javascript
// ✓ CORRECT: Request animation frame for smooth updates
function animateDisplayUpdate(newValue) {
  requestAnimationFrame(() => {
    displayElement.textContent = newValue;
    displayElement.classList.add('updated');
    
    requestAnimationFrame(() => {
      displayElement.classList.remove('updated');
    });
  });
}

// ✗ INCORRECT: Forced synchronous layout
function animateDisplaySlow(newValue) {
  displayElement.textContent = newValue;
  displayElement.offsetHeight; // Forces reflow - AVOID
  displayElement.classList.add('updated');
}
```

## Bundle Size Limits

### Maximum Bundle Sizes

**Strict Limits**:
- **Main bundle (gzipped)**: < 50KB
- **Total page size**: < 200KB
- **Individual JS file**: < 30KB before gzipping
- **CSS file**: < 20KB before gzipping

### Bundle Analysis

```bash
# ✓ REQUIRED: Analyze bundle size before every release
npm run build
npm run analyze-bundle

# Example output requirements:
# main.js (gzipped): 42 KB ✓ (< 50 KB)
# styles.css (gzipped): 8 KB ✓ (< 20 KB)
# vendor.js (gzipped): 15 KB ✓ (< 30 KB)
# Total: 65 KB ✓ (< 200 KB)
```

### Tree Shaking and Dead Code Elimination

```javascript
// ✓ CORRECT: Import only required functions
import { add, subtract, multiply, divide } from './calculator-operations.js';

// ✗ INCORRECT: Importing entire library
import * as operations from './calculator-operations.js'; // Includes unused code

// ✓ CORRECT: Conditional imports for optional features
if (featureFlags.enableHistory) {
  import('./history.js').then(module => {
    module.initHistory();
  });
}
```

### Dependency Audit

```javascript
// ✓ APPROVED: Minimal, essential dependencies
// - decimal.js (~9KB gzipped, ~32KB minified) - Required for precision arithmetic
// - CRITICAL: This is our only runtime dependency for MVP
// - Leaves ~41KB budget for application code (50KB total - 9KB Decimal.js)
// - No other runtime dependencies for MVP

// ✗ REJECTED: Heavy dependencies
// - moment.js (68KB) - Use native Date instead
// - lodash (71KB) - Use native array methods
// - jQuery (87KB) - Use vanilla JavaScript
```

**Decimal.js Bundle Impact**:
- **Minified**: ~32KB
- **Gzipped**: ~9KB
- **Impact on budget**: Uses 18% of 50KB gzipped budget
- **Remaining budget**: 41KB for application code
- **Verification**: Use webpack-bundle-analyzer to confirm size

```bash
# Verify Decimal.js impact
npm run build
npm run analyze

# Expected output:
# decimal.js: 9.2 KB (gzipped)
# app code: 32.8 KB (gzipped)
# Total: 42 KB (gzipped) ✓ Under 50KB budget
```

## Optimization Requirements

### Image Optimization

**Preferred Format**: SVG for all calculator icons and graphics

```html
<!-- ✓ CORRECT: Optimized SVG icons -->
<svg class="icon-plus" width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" fill="none"/>
</svg>

<!-- If raster images needed, use WebP with fallback -->
<picture>
  <source srcset="calculator-bg.webp" type="image/webp">
  <img src="calculator-bg.jpg" alt="" loading="lazy">
</picture>

<!-- ✗ INCORRECT: Unoptimized images -->
<!-- <img src="huge-image.png" /> Large PNG, no optimization -->
```

**SVG Optimization**:

```bash
# Install SVGO
npm install -D svgo

# Optimize SVG files
svgo -f src/icons -o dist/icons

# SVGO config (svgo.config.js)
module.exports = {
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeUselessDefs',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',
    'cleanupEnableBackground',
    'convertStyleToAttrs',
    'convertColors',
    'convertPathData',
    'convertTransform',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'cleanupNumericValues',
    'cleanupListOfValues',
    'removeDimensions', // Allows CSS sizing
    'removeStyleElement'
  ]
};
```

**SVG Best Practices**:
- Remove unnecessary metadata and comments
- Use `currentColor` for fill/stroke to inherit text color
- Remove fixed width/height attributes, use viewBox for scaling
- Inline small SVGs (<2KB) to reduce HTTP requests
- Use CSS classes for reusable styling
- Typical optimized calculator icon: 200-500 bytes

### CSS Optimization

```css
/* ✓ CORRECT: Efficient selectors */
.calculator-button { /* Class selector - fast */ }
.button-operator { /* Class selector - fast */ }

/* ✗ INCORRECT: Slow selectors */
div button[data-type="operator"] { /* Complex, slow */ }
.calculator * { /* Universal selector - SLOW */ }
```

### JavaScript Optimization

```javascript
// ✓ CORRECT: Debounce rapid events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedResize = debounce(() => {
  recalculateLayout();
}, 250);

window.addEventListener('resize', debouncedResize);

// ✗ INCORRECT: Handle every event
window.addEventListener('resize', () => {
  recalculateLayout(); // Fires hundreds of times per resize
});
```

### Memory Management

**Critical**: Prevent memory leaks in long-running sessions

```javascript
// ✓ CORRECT: Limit history size
class HistoryManager {
  constructor(maxSize = 10) {
    this.maxSize = maxSize;
    this.entries = [];
  }
  
  addEntry(entry) {
    this.entries.unshift(entry);
    
    // Prevent memory leak
    if (this.entries.length > this.maxSize) {
      this.entries = this.entries.slice(0, this.maxSize);
    }
  }
}

// ✗ INCORRECT: Unbounded growth
class HistoryManagerBad {
  constructor() {
    this.entries = []; // Never cleaned up
  }
  
  addEntry(entry) {
    this.entries.push(entry); // Grows indefinitely
  }
}
```

### Memory Leak Prevention

**Common Sources of Memory Leaks**:

```javascript
// ✗ INCORRECT: Event listeners not removed
function setupCalculator() {
  const button = document.querySelector('.calc-button');
  button.addEventListener('click', handleClick); // Leaks if called multiple times
}

// ✓ CORRECT: Remove old listeners or use once
function setupCalculator() {
  const button = document.querySelector('.calc-button');
  // Option 1: Remove old listener
  button.removeEventListener('click', handleClick);
  button.addEventListener('click', handleClick);
  
  // Option 2: Use once for one-time events
  document.addEventListener('DOMContentLoaded', init, { once: true });
}

// ✗ INCORRECT: Timers not cleared
let timerId;
function startAnimation() {
  timerId = setInterval(animate, 16); // Never cleared
}

// ✓ CORRECT: Clear timers
let timerId;
function startAnimation() {
  stopAnimation(); // Clear existing
  timerId = setInterval(animate, 16);
}

function stopAnimation() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

// ✗ INCORRECT: DOM references in closures
function createButton() {
  const button = document.createElement('button');
  document.body.appendChild(button);
  
  button.addEventListener('click', () => {
    // Closure keeps reference to button even after removal
    console.log(button.textContent);
  });
  
  return button;
}

// ✓ CORRECT: Clean up references
function createButton() {
  const button = document.createElement('button');
  document.body.appendChild(button);
  
  const handleClick = (event) => {
    console.log(event.target.textContent);
  };
  
  button.addEventListener('click', handleClick);
  
  // Cleanup function
  button.cleanup = () => {
    button.removeEventListener('click', handleClick);
    button.remove();
  };
  
  return button;
}
```

**Memory Leak Testing**:

```javascript
// Use Chrome DevTools Memory Profiler
// 1. Take heap snapshot
// 2. Perform actions (calculations, history additions)
// 3. Take another snapshot
// 4. Compare - memory should not grow indefinitely

// Automated leak detection
if (process.env.NODE_ENV === 'development') {
  let lastHeapSize = 0;
  
  setInterval(() => {
    if (performance.memory) {
      const currentHeap = performance.memory.usedJSHeapSize;
      const growth = currentHeap - lastHeapSize;
      
      if (growth > 5 * 1024 * 1024) { // 5MB growth
        console.warn(`Potential memory leak detected: +${(growth / 1024 / 1024).toFixed(2)}MB`);
      }
      
      lastHeapSize = currentHeap;
    }
  }, 10000); // Check every 10 seconds
}
```

## Measurement and Monitoring

### Performance Instrumentation

```javascript
// ✓ REQUIRED: Performance monitoring in production
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      calculations: [],
      uiUpdates: [],
      pageLoad: {}
    };
  }
  
  measureCalculation(operation, duration) {
    this.metrics.calculations.push({
      operation,
      duration,
      timestamp: Date.now()
    });
    
    if (duration > 50) {
      console.warn(`Slow calculation: ${operation} took ${duration}ms`);
    }
  }
  
  measureUIUpdate(component, duration) {
    this.metrics.uiUpdates.push({
      component,
      duration,
      timestamp: Date.now()
    });
    
    if (duration > 100) {
      console.warn(`Slow UI update: ${component} took ${duration}ms`);
    }
  }
  
  recordPageLoad() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      this.metrics.pageLoad = {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime
      };
    }
  }
  
  getReport() {
    return {
      avgCalculationTime: this.average(this.metrics.calculations.map(m => m.duration)),
      avgUIUpdateTime: this.average(this.metrics.uiUpdates.map(m => m.duration)),
      pageLoadMetrics: this.metrics.pageLoad,
      slowOperations: this.metrics.calculations.filter(m => m.duration > 50),
      slowUIUpdates: this.metrics.uiUpdates.filter(m => m.duration > 100)
    };
  }
  
  average(arr) {
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }
}

// Initialize global monitor
const perfMonitor = new PerformanceMonitor();

// Measure page load
window.addEventListener('load', () => {
  perfMonitor.recordPageLoad();
});
```

### Lighthouse Audits

**Required**: Run Lighthouse audit before every PR

```bash
# Command line
lighthouse https://calculator.example.com --view

# CI/CD integration
npm run lighthouse -- --min-score=90
```

**Acceptance Criteria**:
- Performance score ≥ 90
- Accessibility score ≥ 95
- Best Practices score ≥ 90
- SEO score ≥ 90

## Performance Budget

### Enforcement Strategy

```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 51200, // 50 KB
    maxEntrypointSize: 51200,
    hints: 'error' // Fail build if exceeded
  }
};
```

### Budget Breakdown

| Asset Type | Budget | Current | Status |
|------------|--------|---------|--------|
| JavaScript (main) | 50 KB | 42 KB | ✓ Pass |
| CSS | 20 KB | 8 KB | ✓ Pass |
| Fonts | 30 KB | 0 KB | ✓ Pass (system fonts) |
| Images | 50 KB | 0 KB | ✓ Pass (SVG icons) |
| **Total** | **200 KB** | **50 KB** | **✓ Pass** |

**Note**: JavaScript budget includes Decimal.js (~9KB gzipped). Application code must stay under ~41KB gzipped.

## Caching Strategy

### Browser Caching (MVP)

**Static Assets**: Use appropriate cache headers

```nginx
# nginx configuration
location ~* \.(js|css|svg|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location / {
  # HTML - revalidate
  add_header Cache-Control "no-cache, must-revalidate";
}
```

```javascript
// Webpack: Add content hashes for cache busting
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  }
};
```

### Service Workers (V1.1+)

**Scope**: Not included in MVP, planned for V1.1

```javascript
// V1.1+ Service worker for offline support
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('calculator-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/calculator.js',
        '/decimal.min.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**Benefits**:
- Offline functionality
- Faster subsequent loads
- Reduced server bandwidth
- Progressive Web App (PWA) capability

## Validation Checklist

Before merging any code:

### Page Load Performance
- [ ] Lighthouse Performance score ≥ 90
- [ ] FCP < 1.5s on 3G connection
- [ ] LCP < 2.5s on 3G connection
- [ ] TTI < 3.0s on 3G connection
- [ ] Total page size < 200KB

### Runtime Performance
- [ ] Calculation response < 50ms (tested with Performance API)
- [ ] UI updates < 100ms (tested with Performance API)
- [ ] Animations maintain 60 FPS (verified in DevTools)
- [ ] No layout thrashing detected

### Bundle Size
- [ ] Main bundle < 50KB gzipped (includes Decimal.js ~9KB)
- [ ] Application code < 41KB gzipped (excluding Decimal.js)
- [ ] Bundle analysis report attached to PR
- [ ] No unnecessary dependencies added
- [ ] Tree shaking verified
- [ ] Decimal.js size confirmed with webpack-bundle-analyzer

### Optimization
- [ ] Images optimized (SVG preferred)
- [ ] CSS minified and purged of unused styles
- [ ] JavaScript minified and uglified
- [ ] No console.log statements in production

### Monitoring
- [ ] Performance instrumentation added for new features
- [ ] Error boundaries catch performance-impacting errors
- [ ] Performance metrics logged to analytics (if applicable)

## Common Performance Pitfalls

### ❌ Pitfall 1: Forced Synchronous Layout

```javascript
// ✗ INCORRECT: Reading layout properties in loop
for (let button of buttons) {
  button.style.width = button.offsetWidth + 10 + 'px'; // Forces reflow each iteration
}

// ✓ CORRECT: Batch reads and writes
const widths = Array.from(buttons).map(b => b.offsetWidth); // Batch read
widths.forEach((width, i) => {
  buttons[i].style.width = width + 10 + 'px'; // Batch write
});
```

### ❌ Pitfall 2: Heavy Operations in Render Loop

```javascript
// ✗ INCORRECT: Expensive calculation in render
function render() {
  const result = performComplexCalculation(); // Recalculates every frame
  display.textContent = result;
  requestAnimationFrame(render);
}

// ✓ CORRECT: Calculate once, cache result
let cachedResult;
function updateCalculation() {
  cachedResult = performComplexCalculation();
}

function render() {
  display.textContent = cachedResult; // Use cached value
  if (needsUpdate) {
    requestAnimationFrame(render);
  }
}
```

### ❌ Pitfall 3: Loading Too Much JavaScript

```javascript
// ✗ INCORRECT: Import everything
import _ from 'lodash'; // 71KB
import moment from 'moment'; // 68KB

// ✓ CORRECT: Import only what you need, or use native
// Instead of lodash
const unique = arr => [...new Set(arr)];

// Instead of moment
const formatDate = date => new Intl.DateTimeFormat('en-US').format(date);
```

## References

- [Web Calculator FRS - Performance Requirements](../../requirements/web-calculator-frs.md#91-performance-requirements)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Chrome DevTools Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance)

---

**Performance Monitoring**: Required for all production deployments
**Contact**: Development Team for performance optimization questions
**Last Updated**: 2026-02-12
