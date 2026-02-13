# Web Calculator

High-precision web-based calculator with decimal arithmetic support.

## Slice 0: Foundation Infrastructure ✅

This implements the foundational infrastructure for the Web Calculator project.

**Status**: Complete  
**Effort**: 2 days  
**Priority**: P0

### Deliverables

- ✅ Project setup with Vite build system
- ✅ Decimal.js integration (v10.4.3)
- ✅ HTML shell with accessible calculator layout
- ✅ CSS foundation (reset, variables, layout)
- ✅ Shared utilities (state management, event bus, decimal config)
- ✅ Development environment (ESLint, Prettier)
- ✅ Unit tests for state management and event bus

### Technology Stack

- **Runtime**: Vanilla JavaScript (ES6+)
- **Build**: Vite 5.x
- **Testing**: Vitest with 100% coverage target
- **Decimal Library**: Decimal.js v10.4.3 (~9KB gzipped)
- **Linting**: ESLint
- **Formatting**: Prettier

### Project Structure

```
calculator-web/
├── features/
│   └── shared/
│       ├── calculator-state.js       # State management
│       ├── calculator-state.test.js  # State tests
│       ├── decimal-config.js         # Decimal.js configuration
│       ├── event-bus.js              # Pub/sub pattern
│       ├── event-bus.test.js         # Event bus tests
│       └── utilities.js              # Helper functions
├── styles/
│   ├── reset.css                     # CSS reset
│   ├── variables.css                 # Design tokens
│   └── layout.css                    # Calculator layout
├── index.html                        # HTML shell
├── main.js                           # Application entry point
├── package.json                      # Dependencies
├── vite.config.js                    # Build configuration
├── vitest.config.js                  # Test configuration
├── .eslintrc.json                    # Linting rules
├── .prettierrc.json                  # Formatting rules
└── .gitignore                        # Git ignore patterns
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The development server runs at `http://localhost:3000` by default.

### Bundle Size Budget

**Target**: <50KB gzipped total  
**Breakdown**:
- Decimal.js: ~9KB gzipped
- Application code: <41KB gzipped

Run `npm run build` to verify bundle size.

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm test -- --coverage
```

**Coverage Requirements**:
- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

### Test Files

- `features/shared/calculator-state.test.js` - State management tests
- `features/shared/event-bus.test.js` - Event bus tests

## Architecture

### Vertical Slice Architecture

Each feature is organized as a complete vertical slice:
```
features/
└── <slice-name>/
    ├── <slice-name>.js        # Implementation
    ├── <slice-name>.test.js   # Unit tests
    ├── validators.js          # Validation logic
    └── <slice-name>.spec.md   # Feature specification
```

### State Management

Centralized state using `CalculatorState` class:
- `currentValue`: Current display value
- `previousValue`: Previous operand
- `operator`: Current operator
- `errorState`: Error flag
- `expression`: Token array for PEMDAS

### Event Bus

Pub/sub pattern for decoupled communication:
- `DISPLAY_UPDATE`: Update display
- `STATE_CHANGE`: State changed
- `ERROR`: Error occurred
- `CALCULATION_COMPLETE`: Calculation done

## Decimal Configuration

Decimal.js configured per FRS requirements:
- **Precision**: 20 significant digits (internal)
- **Rounding**: ROUND_HALF_UP
- **Display**: 10 decimal places maximum
- **Range**: 1e-15 to 9.99999999999999e+15

## Accessibility

WCAG 2.1 Level AA compliant:
- Semantic HTML with ARIA labels
- Keyboard navigation support
- Screen reader announcements (aria-live regions)
- 44×44px minimum touch targets
- Focus indicators (3px outline)
- Reduced motion support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 13+
- Edge 90+

## Next Steps

**Slice 1: Number Input** (3 days)
- Implement digit input (0-9)
- Add decimal point support
- Input validation (15 digit max)
- Keyboard input handling

See [Implementation Plan](../requirements/web-calculator-implementation-plan.md) for complete roadmap.

## License

MIT
