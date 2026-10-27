/**
 * data.js – Sample Records & Data Layer
 * DeadlineIQ – Assignment Deadline Planner
 * Topic #12 | Assignment 1
 *
 * Provides: 6+ student-created sample records, CRUD helpers,
 * localStorage persistence, and conflict/overload detection.
 */

'use strict';

/* ──────────────────────────────────────────
   CONSTANTS
────────────────────────────────────────── */
const STORAGE_KEY  = 'deadlineIQ_tasks';
const SETTINGS_KEY = 'deadlineIQ_settings';
const ID_KEY       = 'deadlineIQ_nextId';

/* ──────────────────────────────────────────
   DEFAULT SETTINGS
────────────────────────────────────────── */
const DEFAULT_SETTINGS = {
  theme:          'dark',
  accent:         'violet',
  warnDays:       3,
  overloadAlerts: true,
  conflictAlerts: true
};

/* ──────────────────────────────────────────
   SAMPLE DATA – 6 Student-Created Records
   (Dates set relative to today for demo)
────────────────────────────────────────── */
function buildSampleTasks() {
  const now   = new Date();
  const dFrom = (days, h = 23, m = 59) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  return [
    {
      id:        1,
      course:    'CS 301 – Data Structures',
      title:     'Linked List Implementation & Analysis Report',
      dueDate:   dFrom(2),
      priority:  'high',
      progress:  45,
      status:    'in-progress',
      recurring: 'none',
      notes:     'Cover singly and doubly linked lists. Include Big-O analysis. Submit PDF via LMS portal.',
      createdAt: new Date(now.getTime() - 5 * 86400000).toISOString()
    },
    {
      id:        2,
      course:    'MTH 201 – Calculus II',
      title:     'Integration Techniques Problem Set',
      dueDate:   dFrom(5),
      priority:  'medium',
      progress:  70,
      status:    'in-progress',
      recurring: 'weekly',
      notes:     'Problems 1–40 from Chapter 7. Show all working steps. No calculator allowed.',
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString()
    },
    {
      id:        3,
      course:    'ENG 110 – Academic Writing',
      title:     'Argumentative Essay – Climate Policy',
      dueDate:   dFrom(1),
      priority:  'high',
      progress:  90,
      status:    'in-progress',
      recurring: 'none',
      notes:     '1500–2000 words, APA 7th edition. Minimum 5 peer-reviewed sources required.',
      createdAt: new Date(now.getTime() - 7 * 86400000).toISOString()
    },
    {
      id:        4,
      course:    'PHY 205 – Classical Mechanics',
      title:     'Lab Report #4 – Projectile Motion',
      dueDate:   dFrom(10),
      priority:  'low',
      progress:  20,
      status:    'in-progress',
      recurring: 'none',
      notes:     'Include error analysis, graphs and conclusion. Lab partner: Ali Hassan.',
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString()
    },
    {
      id:        5,
      course:    'CS 301 – Data Structures',
      title:     'Binary Search Tree – Coding Assignment',
      dueDate:   dFrom(2),
      priority:  'high',
      progress:  10,
      status:    'not-started',
      recurring: 'none',
      notes:     'Implement insert, delete, search, in-order traversal in Python. Submit on GitHub.',
      createdAt: new Date(now.getTime() - 2 * 86400000).toISOString()
    },
    {
      id:        6,
      course:    'HIS 150 – World History',
      title:     'Reading Summary – Chapter 12 & 13',
      dueDate:   dFrom(7),
      priority:  'low',
      progress:  100,
      status:    'completed',
      recurring: 'weekly',
      notes:     'One-page summary per chapter. Focus on industrial revolution causes and effects.',
      createdAt: new Date(now.getTime() - 8 * 86400000).toISOString()
    },
    {
      id:        7,
      course:    'MTH 201 – Calculus II',
      title:     'Midterm Exam Preparation Quiz',
      dueDate:   dFrom(3),
      priority:  'medium',
      progress:  55,
      status:    'in-progress',
      recurring: 'none',
      notes:     'Timed online quiz, 45 minutes. Topics: Series, Sequences, L\'Hopital\'s Rule.',
      createdAt: new Date(now.getTime() - 4 * 86400000).toISOString()
    },
    {
      id:        8,
      course:    'ENG 110 – Academic Writing',
      title:     'Peer Review – Classmate Draft',
      dueDate:   dFrom(1),
      priority:  'medium',
      progress:  0,
      status:    'not-started',
      recurring: 'none',
      notes:     'Review Sarah Kim\'s essay draft on Turnitin. Use the provided rubric.',
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString()
    }
  ];
}

/* ──────────────────────────────────────────
   ID GENERATOR
────────────────────────────────────────── */
function getNextId() {
  let id = parseInt(localStorage.getItem(ID_KEY) || '100', 10);
  id += 1;
  localStorage.setItem(ID_KEY, id.toString());
  return id;
}

/* ──────────────────────────────────────────
   STORAGE HELPERS
────────────────────────────────────────── */
const Store = {
  /** Load all tasks from localStorage, seeding sample data if empty */
  loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const samples = buildSampleTasks();
        this.saveTasks(samples);
        // Set id counter past sample ids
        localStorage.setItem(ID_KEY, '100');
        return samples;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('DeadlineIQ: Error loading tasks', e);
      return [];
    }
  },

  /** Persist tasks array to localStorage */
  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('DeadlineIQ: Error saving tasks', e);
    }
  },

  /** Load settings */
  loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  /** Save settings */
  saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('DeadlineIQ: Error saving settings', e);
    }
  },

  /** CRUD – Add a task */
  addTask(taskData) {
    const tasks = this.loadTasks();
    const newTask = {
      ...taskData,
      id:        getNextId(),
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  },

  /** CRUD – Update a task by id */
  updateTask(id, updates) {
    const tasks = this.loadTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveTasks(tasks);
    return tasks[idx];
  },

  /** CRUD – Delete a task by id */
  deleteTask(id) {
    let tasks = this.loadTasks();
    const prev = tasks.length;
    tasks = tasks.filter(t => t.id !== id);
    this.saveTasks(tasks);
    return tasks.length < prev;
  },

  /** Get a single task by id */
  getTask(id) {
    return this.loadTasks().find(t => t.id === id) || null;
  },

  /** Clear all data */
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ID_KEY);
  },

  /** Get storage size in bytes */
  getSize() {
    const raw = localStorage.getItem(STORAGE_KEY) || '';
    return raw.length * 2; // approx UTF-16 bytes
  }
};

/* ──────────────────────────────────────────
   CONFLICT / OVERLOAD DETECTION
────────────────────────────────────────── */
const Conflicts = {
  /**
   * Returns an array of conflict summaries.
   * A conflict = 2+ HIGH priority tasks due on the same calendar day.
   * An overload = 3+ any-priority tasks due on the same day.
   */
  detect(tasks, settings) {
    const results = [];
    if (!settings.conflictAlerts && !settings.overloadAlerts) return results;

    const active = tasks.filter(t => t.status !== 'completed');
    const byDay  = {};

    active.forEach(t => {
      const dateStr = t.dueDate.slice(0, 10); // YYYY-MM-DD
      if (!byDay[dateStr]) byDay[dateStr] = [];
      byDay[dateStr].push(t);
    });

    Object.entries(byDay).forEach(([dateStr, dayTasks]) => {
      if (settings.conflictAlerts) {
        const highTasks = dayTasks.filter(t => t.priority === 'high');
        if (highTasks.length >= 2) {
          results.push({
            type:  'conflict',
            date:  dateStr,
            count: highTasks.length,
            tasks: highTasks,
            message: `⚡ Conflict: ${highTasks.length} HIGH-priority assignments due on ${formatDateShort(dateStr)} (${highTasks.map(t => t.title).join(', ')}).`
          });
        }
      }
      if (settings.overloadAlerts && dayTasks.length >= 3) {
        results.push({
          type:  'overload',
          date:  dateStr,
          count: dayTasks.length,
          tasks: dayTasks,
          message: `🔥 Overload: ${dayTasks.length} assignments due on ${formatDateShort(dateStr)} – consider rescheduling.`
        });
      }
    });

    return results;
  }
};

/* ──────────────────────────────────────────
   DATE / TIME UTILITIES
────────────────────────────────────────── */
function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function formatDateShort(isoOrStr) {
  const d = new Date(isoOrStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(iso) {
  const now  = new Date();
  const due  = new Date(iso);
  const diff = due - now;
  return Math.ceil(diff / 86400000);
}

function hoursUntil(iso) {
  const diff = new Date(iso) - new Date();
  return Math.round(diff / 3600000);
}

function getCountdownLabel(iso, status) {
  if (status === 'completed') return { text: '✓ Completed', cls: 'done' };
  const days = daysUntil(iso);
  if (days < 0)  return { text: `Overdue by ${Math.abs(days)}d`, cls: 'overdue' };
  if (days === 0) {
    const h = hoursUntil(iso);
    if (h <= 0) return { text: 'Overdue', cls: 'overdue' };
    return { text: `Due in ${h}h`, cls: 'urgent' };
  }
  if (days <= 2)  return { text: `${days}d left`, cls: 'urgent' };
  if (days <= 7)  return { text: `${days}d left`, cls: 'warning' };
  return { text: `${days}d left`, cls: 'safe' };
}

function isValidFutureDate(iso) {
  if (!iso) return false;
  return new Date(iso) > new Date();
}

/* ──────────────────────────────────────────
   PRIORITY HELPERS
────────────────────────────────────────── */
const PRIORITY_RANK = { high: 3, medium: 2, low: 1 };

function priorityLabel(p) {
  return { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' }[p] || p;
}

function statusLabel(s) {
  return { 'not-started': '⏳ Not Started', 'in-progress': '🔄 In Progress', 'completed': '✅ Completed' }[s] || s;
}

function recurringLabel(r) {
  return { none: 'None', weekly: '📅 Weekly', biweekly: '📅 Bi-weekly', monthly: '📅 Monthly' }[r] || r;
}

/* ──────────────────────────────────────────
   UNIQUE COURSES HELPER
────────────────────────────────────────── */
function getUniqueCourses(tasks) {
  const seen = new Set();
  return tasks
    .map(t => t.course)
    .filter(c => { if (seen.has(c)) return false; seen.add(c); return true; });
}

/* ──────────────────────────────────────────
   EXPORT HELPERS
────────────────────────────────────────── */
function exportCSV(tasks) {
  const headers = ['ID', 'Course', 'Title', 'Due Date', 'Priority', 'Progress (%)', 'Status', 'Recurring', 'Notes', 'Created At'];
  const rows = tasks.map(t => [
    t.id,
    `"${t.course.replace(/"/g, '""')}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    formatDateTime(t.dueDate),
    t.priority,
    t.progress,
    t.status,
    t.recurring,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    formatDateTime(t.createdAt)
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
