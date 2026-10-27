# DeadlineIQ – Assignment Deadline Planner

> **Topic #12 | Assignment 1 | Client-Side Web Application**  
> Course: Web Development | Due: Friday 30 October 2026

---

## 📸 Screenshots

| Dashboard | Add Task Form | Calendar View |
|-----------|--------------|---------------|
| Responsive card grid with priority badges, progress bars, and countdown timers | Multi-field validated form with auto-status sync | Month calendar with task dots and day-detail panel |

---

## 🚀 Setup & Running

### Prerequisites
- Any modern browser (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- No build tools, no npm, no server required

### Run Locally
```bash
# Option 1 – Just open the file
Open index.html in your browser (double-click)

# Option 2 – VS Code Live Server (recommended)
1. Install "Live Server" extension in VS Code
2. Right-click index.html → "Open with Live Server"

# Option 3 – Python simple server
python -m http.server 8080
# Then open http://localhost:8080
```

---

## 📁 Project Structure

```
webproject/
├── index.html          # Main HTML – all views/sections
├── css/
│   └── style.css       # Complete stylesheet (design tokens, layout, responsive)
├── js/
│   ├── data.js         # Data layer: localStorage, CRUD, conflict detection, utilities
│   └── app.js          # App logic: DOM events, rendering, validation, interactions
├── wireframe.jpg       # Hand-drawn wireframe (see below)
└── README.md           # This file
```

---

## 🎯 Assigned Idea & Rule

- **Idea #12:** Assignment Deadline Planner
- **Features:** Course calendars, priority, progress states, recurring tasks, conflict/overload summaries
- **Data Variant:** Each task has a course tag, priority (high/medium/low), a progress slider (0–100%), a status state (not-started/in-progress/completed), and optional recurrence (weekly/bi-weekly/monthly)

---

## 👤 User & Problem Statement

**User:** University student enrolled in 4–6 courses simultaneously  
**Problem:** Managing overlapping assignment deadlines across multiple courses leads to missed submissions, last-minute panic, and poor time distribution  
**Solution:** A single-page deadline planner with visual priority, progress tracking, and automatic conflict detection

---

## 🏗 WDLC Stages

| Stage | Activity |
|-------|----------|
| **Planning** | Defined user persona, core use cases, data model |
| **Analysis** | Identified features: CRUD, filtering, calendar, conflicts |
| **Design** | Wireframed all views; chose dark theme with glassmorphism; defined CSS tokens |
| **Development** | Coded HTML → CSS → JS layer by layer |
| **Testing** | Tested on Chrome, Firefox, mobile viewport; tested empty/invalid inputs |
| **Deployment** | Static files – open `index.html` directly |

---

## 🌐 Client vs. Server Responsibilities

| Concern | Location | Technology |
|---------|----------|-----------|
| UI Rendering | **Client** | HTML + CSS |
| User Interactions | **Client** | Vanilla JavaScript |
| Form Validation | **Client** | JS + HTML5 attributes |
| Data Storage | **Client** | `localStorage` |
| Conflict Detection | **Client** | JS algorithm |
| Theme/Settings | **Client** | `localStorage` |
| REST Persistence (future A2) | **Server** | Would use fetch/JSON API |
| Authentication (future A3) | **Server** | Would use JWT/sessions |

> **Note:** At this stage (Assignment 1) the app is fully client-side. No backend required.

---

## ✅ Features Implemented

### Core (Assignment Requirements)
- [x] Semantic HTML5 structure (header, nav, main, section, article, aside)
- [x] Accessible form with labels, `aria-describedby`, required fields, browser validation
- [x] Custom CSS validation with descriptive error messages
- [x] Flexbox + CSS Grid layout
- [x] 3 media-query breakpoints (desktop 1024px+, tablet 768–1024px, mobile <768px)
- [x] CSS custom properties (design token system)
- [x] Variables, functions, arrays, conditionals, DOM events in JavaScript
- [x] At least 2 meaningful interactions (filter+sort, progress update, conflict check)
- [x] Edge case handling (empty search, invalid dates, no tasks state)
- [x] 8 pre-loaded sample records

### Bonus Features
- [x] Priority-based visual hierarchy (color-coded cards)
- [x] Progress slider with live % display and auto-status sync
- [x] Status states: Not Started / In Progress / Completed
- [x] Recurring task generation (weekly / bi-weekly / monthly)
- [x] Conflict detection (2+ HIGH priority tasks on same day)
- [x] Overload detection (3+ any-priority tasks on same day)
- [x] Calendar view with month navigation and task dots
- [x] Multi-course sidebar filter
- [x] Live search with debounce
- [x] Priority + Status + Sort dropdowns
- [x] Active filter chips display
- [x] Task detail modal
- [x] Delete confirmation dialog
- [x] Toast notifications
- [x] Export to CSV / JSON
- [x] Import from JSON
- [x] Theme switcher (Dark / Light / Midnight Blue)
- [x] Accent color switcher (Violet / Cyan / Rose / Amber)
- [x] Configurable warning days
- [x] localStorage persistence across sessions
- [x] Keyboard navigation (Tab, Enter, Escape, Space)
- [x] ARIA roles and live regions
- [x] Skip-to-main link
- [x] HTML `<meta>` description for SEO

---

## 📊 Sample Data Records

| # | Course | Title | Priority | Status |
|---|--------|-------|----------|--------|
| 1 | CS 301 | Linked List Implementation | High | In Progress |
| 2 | MTH 201 | Integration Techniques Problem Set | Medium | In Progress |
| 3 | ENG 110 | Argumentative Essay – Climate Policy | High | In Progress |
| 4 | PHY 205 | Lab Report #4 – Projectile Motion | Low | In Progress |
| 5 | CS 301 | Binary Search Tree Coding Assignment | High | Not Started |
| 6 | HIS 150 | Reading Summary – Chapter 12 & 13 | Low | Completed |
| 7 | MTH 201 | Midterm Exam Preparation Quiz | Medium | In Progress |
| 8 | ENG 110 | Peer Review – Classmate Draft | Medium | Not Started |

---

## 🧠 JavaScript Concepts Used

- **Variables:** `const`, `let` throughout
- **Functions:** Named functions, arrow functions, closures, factory functions
- **Arrays:** `filter`, `map`, `sort`, `forEach`, `find`, `some`
- **Conditionals:** `if/else`, ternary, `switch`
- **DOM Events:** `click`, `change`, `input`, `submit`, `keydown`, `DOMContentLoaded`
- **DOM Manipulation:** `createElement`, `appendChild`, `innerHTML`, `dataset`, `classList`
- **Form Handling:** Custom validation, `FormData`-style field reading, error display
- **Storage:** `localStorage` read/write/clear
- **Date Handling:** `new Date()`, `toISOString()`, countdown calculation
- **Debounce:** Custom debounce for search input
- **Event Delegation:** Single listener on task grid handles all card buttons
- **ES6+:** Template literals, spread operator, destructuring, default params

---

## ♿ Accessibility

- Semantic HTML5 elements throughout
- All form inputs have associated `<label>`
- Error messages linked via `aria-describedby`
- `role="alert"` and `aria-live="polite"` for dynamic updates
- Modal uses `role="dialog"`, `aria-modal`, `aria-labelledby`
- Focus management on modal open
- Keyboard operable (Tab, Shift+Tab, Enter, Space, Escape)
- Skip-to-main link for screen readers
- Sufficient color contrast
- Progress bars have `role="progressbar"` with `aria-valuenow`

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| `> 1024px` (Desktop) | 4-col stats, sidebar + task grid side-by-side |
| `768–1024px` (Tablet) | 2-col stats, narrower sidebar |
| `< 768px` (Mobile) | Single column, hamburger menu, stacked sidebar |
| `< 480px` (Small) | 2-col stats, compressed typography |

---

## 🤖 AI Assistance Disclosure

This project was developed with AI assistance (Google Antigravity / Claude). AI helped with:
- Boilerplate structure suggestions
- CSS design token system layout
- JavaScript utility function patterns

All code was reviewed, understood, and adapted. No full-site templates were used.

---

## 📜 Attribution

- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter) + [Outfit](https://fonts.google.com/specimen/Outfit) from Google Fonts (SIL Open Font License)
- **Icons:** Unicode emoji (no external dependencies)
- **No external CSS frameworks** (pure vanilla CSS)
- **No JavaScript libraries** (pure vanilla JS)
