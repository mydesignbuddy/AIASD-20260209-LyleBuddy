---
ai_generated: true
model: "anthropic/claude-3.5-sonnet@2024-10-22"
operator: "lyle.ubben"
chat_id: "frs-enhancements-20260212"
prompt: |
  Add a section on how a human would showcase the slice to stakeholders, then save to markdown file
started: "2026-02-12T18:30:00Z"
ended: "2026-02-12T18:45:00Z"
task_durations:
  - task: "content creation"
    duration: "00:12:00"
  - task: "formatting and examples"
    duration: "00:03:00"
total_duration: "00:15:00"
ai_log: "ai-logs/2026/02/12/frs-enhancements-20260212/conversation.md"
source: "lyle.ubben"
---

# Slice Demonstration and Stakeholder Showcase Guide

## Overview

This guide provides a comprehensive framework for demonstrating completed vertical slices to stakeholders. Each completed slice should be showcased to validate requirements, gather feedback, and maintain alignment with business objectives.

## Table of Contents

1. [Purpose of Slice Demonstrations](#purpose-of-slice-demonstrations)
2. [Pre-Demonstration Preparation](#pre-demonstration-preparation)
3. [Demo Structure](#demo-structure)
4. [Demo Script Template](#demo-script-template)
5. [What to Highlight for Different Stakeholders](#what-to-highlight-for-different-stakeholders)
6. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
7. [Post-Demo Actions](#post-demo-actions)
8. [Example: Slice 1 Demo Plan](#example-slice-1-demo-plan)

---

## Purpose of Slice Demonstrations

### Primary Objectives

- **Validate Requirements**: Confirm the implementation meets stated requirements
- **Gather Feedback**: Collect stakeholder input while changes are still easy to make
- **Build Confidence**: Show tangible progress and maintain stakeholder engagement
- **Identify Issues Early**: Surface usability problems, missing features, or misunderstandings
- **Celebrate Progress**: Recognize team achievements and maintain momentum

### Stakeholder Benefits

- See working software frequently (not just at final release)
- Provide input that shapes the product
- Understand technical constraints and trade-offs
- Feel ownership and investment in the product

---

## Pre-Demonstration Preparation

### Checklist (Complete 24 hours before demo)

- [ ] **Slice Completion Verified**: All acceptance criteria met
- [ ] **Tests Passing**: Automated test suite at 100% pass rate
- [ ] **Demo Environment Ready**: Clean, stable environment with no unrelated bugs
- [ ] **Test Data Prepared**: Realistic scenarios ready to demonstrate
- [ ] **Demo Script Created**: Step-by-step walkthrough planned (see below)
- [ ] **Backup Plan**: Screenshots/video available if live demo fails
- [ ] **Stakeholders Invited**: Calendar invites sent with clear agenda
- [ ] **Access Provided**: Stakeholders can access demo environment (URL shared)
- [ ] **Documentation Ready**: Slice completion document available (e.g., SLICE-N-COMPLETE.md)

### Demo Environment Setup

```bash
# Example: Running demo locally
npm run build              # Production build
npm run preview            # Serve production build
# Share local URL via ngrok or similar for remote stakeholders
```

**OR use deployed demo environment**:

- Demo URL: `https://calculator-demo.example.com/slice-N`
- Versioned by slice for concurrent demos
- Reset data between demos (fresh state)

---

## Demo Structure (Recommended 15-30 minutes)

### Timing Breakdown

| Segment               | Duration | Purpose                              |
| --------------------- | -------- | ------------------------------------ |
| Introduction          | 2-3 min  | Context, objectives, what's new      |
| Live Demonstration    | 10-15 min| Show features, happy path + edge cases|
| Q&A / Exploratory     | 5-8 min  | Stakeholder questions and exploration|
| Feedback Collection   | 3-5 min  | Structured feedback capture          |
| Wrap-up / Next Steps  | 2-3 min  | Summary, action items, next demo     |

---

## Demo Script Template

### 1. Introduction (2-3 minutes)

*"Good [morning/afternoon], everyone. Today we're showcasing [Slice Name], which delivers [primary user value]. This slice completes [Epic Name] and brings us [X%] toward MVP completion."*

**What to Cover**:
- Which slice is being demonstrated (e.g., "Slice 0: Foundation" or "Slice 1: Number Input")
- User stories delivered
- How it fits into the overall product
- What stakeholders should focus on

**Example (Slice 0: Foundation)**:

*"This is Slice 0, our foundation slice. It establishes the basic calculator UI and event system. While it doesn't perform calculations yet, it demonstrates the visual design, responsive layout, and framework that all future slices will build upon."*

---

### 2. Live Demonstration (10-15 minutes)

#### Part A: Happy Path (Show it working as intended)

*"Let me walk through the typical user workflow..."*

**Demonstration Steps** (adapt per slice):

1. **Show Initial State**
   - Open calculator in browser
   - Point out key UI elements (display, buttons, layout)
   - Mention responsive design (resize window)

2. **Demonstrate Core Functionality**
   - Walk through primary user story
   - Narrate actions: *"I'm clicking the '2' button..."*
   - Highlight output: *"Notice the display updates immediately"*

3. **Show Integration Points**
   - How this slice connects to previous slices
   - Preserved functionality from earlier work

**Example (Slice 1: Number Input)**:

```
Demo Flow:
1. "Let me enter a number: 1-2-3"
   → Show display updating
2. "Now I'll add a decimal: point, 4-5"
   → Show decimal validation (only one decimal allowed)
3. "Let's try entering invalid input..."
   → Show error handling (letters rejected)
4. "Here's keyboard input working..."
   → Type numbers using keyboard
5. "And on mobile..."
   → Switch to responsive view (DevTools or actual device)
```

#### Part B: Edge Cases (Show error handling and boundaries)

*"Now let's see how it handles edge cases..."*

**Demonstrate**:
- Boundary conditions (very long numbers, max digits)
- Error states (invalid input, constraints)
- Recovery (clear, backspace)

**Example**:

```
"What if I try to enter a second decimal point?"
→ Rejected, only first decimal accepted

"What happens at the digit limit?"
→ Additional digits ignored, or notation applied

"How do I correct a mistake?"
→ Backspace removes last digit
```

#### Part C: Non-Functional Requirements (if applicable)

- **Accessibility**: Demonstrate keyboard navigation, screen reader (if stakeholder interested)
- **Performance**: "Notice the instant response time"
- **Responsive Design**: Show on different viewport sizes

---

### 3. Q&A and Exploratory Session (5-8 minutes)

*"I'll hand you the controls now. Feel free to try anything—break it if you can!"*

**Facilitation Tips**:

- Share demo URL for stakeholders to try themselves
- Encourage experimentation: *"Try edge cases, see if you can find issues"*
- Observe how stakeholders interact (usability insights)
- Take notes on confusion points or questions
- Don't be defensive about bugs—log them and move on

**Capture**:
- Write down questions
- Note any confusion or hesitation
- Log bugs discovered in real-time

---

### 4. Feedback Collection (3-5 minutes)

**Structured Questions** (asked verbally or via form):

| Question                                      | Purpose                        |
| --------------------------------------------- | ------------------------------ |
| "Does this meet your expectations for [feature]?" | Validate requirements          |
| "Is anything missing or unexpected?"          | Identify gaps                  |
| "How intuitive is the [interaction/flow]?"    | Usability assessment           |
| "Any concerns about [performance/design]?"    | Surface quality issues         |
| "What should we prioritize for the next slice?" | Input on roadmap               |

**Feedback Capture Methods**:

- **Live Notes**: Scribe captures feedback in shared doc
- **Survey**: Post-demo form (Google Forms, Typeform)
- **Recording**: Record session (with permission) for later review
- **Issue Tracker**: Log bugs and enhancement requests in GitHub Issues

**Example Feedback Template**:

```markdown
## Slice N Demo Feedback - [Date]

**Attendees**: [Names/Roles]

### What Worked Well
- [Positive feedback item 1]
- [Positive feedback item 2]

### Issues Identified
| Issue | Severity | Action Item |
|-------|----------|-------------|
| [Description] | P0/P1/P2 | [Assigned to] |

### Enhancement Requests
- [Request 1] - Priority: P1/P2
- [Request 2] - Priority: P1/P2

### Questions/Clarifications Needed
- [Question 1] - Owner: [Name]
- [Question 2] - Owner: [Name]

### Decisions Made
- [Decision 1]
- [Decision 2]
```

---

### 5. Wrap-up and Next Steps (2-3 minutes)

*"Thank you for your feedback. Here's what we heard..."*

**Summarize**:
- Key feedback themes
- Decisions made during the demo
- Action items (assigned to specific people)
- Timeline for fixes or changes

**Preview Next Demo**:
- Which slice is next
- Expected delivery date
- What stakeholders should expect

**Example**:

*"We heard that the decimal input is intuitive, but you'd like clearer visual feedback on the digit limit. We'll add that before the next slice. Next demo will be Slice 2: Basic Operations (Addition/Subtraction) in 3 days. We'll show actual calculations working end-to-end. Thank you!"*

---

## What to Highlight for Different Stakeholders

### Technical Stakeholders (CTO, Architects, Developers)

- Code quality and architecture decisions
- Test coverage and quality metrics
- Performance characteristics
- Technical debt or constraints
- Integration points and APIs

### Business Stakeholders (Product Owners, Managers, Executives)

- User value delivered
- Progress toward MVP goals
- Timeline and velocity metrics
- Risk mitigation
- Budget implications

### End Users / User Proxies (UX, Customer Success, Beta Testers)

- Usability and intuitiveness
- Visual design and consistency
- Accessibility features
- Mobile experience
- Error messages and help text

---

## Common Pitfalls to Avoid

### ❌ Don't

- Show unstable or buggy features (not ready for demo)
- Dive into technical implementation details unless asked
- Apologize excessively for incomplete features ("This doesn't work yet, but...")
- Skip preparation and "wing it"
- Ignore or dismiss stakeholder feedback
- Go over time without consent

### ✅ Do

- Rehearse demo at least once before presenting
- Start with working features that provide value
- Be honest about what's not done yet
- Celebrate progress and team effort
- Take feedback seriously (even if you disagree)
- Keep energy positive and collaborative
- Have a backup plan if live demo fails

---

## Post-Demo Actions

### Immediately After (Within 1 hour)

- [ ] Send thank-you email to attendees
- [ ] Share feedback summary document
- [ ] Log bugs/issues in tracking system (GitHub Issues)
- [ ] Assign action items with owners

### Within 24 Hours

- [ ] Prioritize feedback (P0/P1/P2)
- [ ] Update backlog with enhancement requests
- [ ] Update slice documentation with any decisions made
- [ ] Schedule follow-up for any unresolved questions

### Within 1 Week

- [ ] Address P0 issues (blocking bugs)
- [ ] Communicate progress on action items
- [ ] Adjust roadmap if needed based on feedback
- [ ] Prepare for next slice demo

---

## Example: Slice 1 Demo Plan

### Overview

**Slice**: Number Input and Display

**User Stories Delivered**:
- US-1.1: Enter single-digit numbers
- US-1.2: Enter multi-digit numbers
- US-1.3: Enter decimal numbers

### Demo Scenario

```
1. Introduction (2 min)
   "Today we're showing Slice 1: Number Input. Users can now 
    enter numbers including decimals, and the display updates in real-time."

2. Happy Path Demo (8 min)
   - Enter "123" → Display shows "123"
   - Enter "45.67" → Display shows "45.67"
   - Use keyboard to enter "890" → Works
   - Switch to mobile view → Touch input works

3. Edge Cases (5 min)
   - Try entering "12.34.56" → Second decimal rejected ✓
   - Reach digit limit (10 digits) → Additional input blocked ✓
   - Type letters → Rejected ✓
   - Backspace to correct → Last digit removed ✓

4. Q&A (5 min)
   - Let stakeholders try it
   - Answer questions
   - Note any confusion

5. Feedback (3 min)
   - "Does number entry feel intuitive?"
   - "Any unexpected behavior?"
   - "Is the visual feedback clear?"

6. Wrap-up (2 min)
   - "Next slice: Addition and subtraction operations"
   - "Expected demo: 3 days"
   - "Thanks for your feedback!"
```

### Success Criteria for Demo

- All stakeholders understand what was delivered
- At least 3 pieces of actionable feedback received
- No P0 bugs discovered (or if discovered, immediately logged)
- Stakeholders express confidence in progress

---

## Additional Resources

- [Web Calculator FRS](../requirements/web-calculator-frs.md) - Full requirements specification
- [Web Calculator PRD](../requirements/web-calculator-prd.md) - Product vision and goals
- [Implementation Plan](../requirements/web-calculator-implementation-plan.md) - Slice breakdown and timeline

---

## Document History

| Version | Date       | Author     | Changes                          |
| ------- | ---------- | ---------- | -------------------------------- |
| 1.0     | 2026-02-12 | lyle.ubben | Initial guide creation           |

---

**End of Slice Demonstration Guide**
