/**
 * app.js – Main Application Logic
 * DeadlineIQ – Assignment Deadline Planner
 * Topic #12 | Assignment 1
 *
 * Covers: DOM events, filtering, sorting, search,
 * CRUD interactions, calendar rendering, settings,
 * conflict/overload summaries, form validation.
 */

'use strict';

/* ═══════════════════════════════════════════
   1. APP STATE
═══════════════════════════════════════════ */
const State = {
  tasks:         [],
  settings:      {},
  filter: {
    courses:  [],   // selected course names (empty = all)
    priority: 'all',
    status:   'all',
    sort:     'due-date',
    search:   ''
  },
  calendarDate:  new Date(),   // displayed month
  editingTaskId: null,
  pendingDeleteId: null
};

/* ═══════════════════════════════════════════
   2. DOM REFERENCES
═══════════════════════════════════════════ */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const DOM = {
  // Nav
  hamburger:       $('hamburger-btn'),
  mobileMenu:      $('mobile-menu'),
  navLinks:        $$('.nav-link'),
  mobLinks:        $$('.mob-link'),

  // Views
  views: {
    dashboard: $('dashboard'),
    'add-task': $('add-task'),
    'calendar-view': $('calendar-view'),
    'settings-view': $('settings-view')
  },

  // Alert
  alertBanner:    $('alert-banner'),
  alertMessage:   $('alert-message'),
  alertCloseBtn:  $('alert-close-btn'),

  // Stats
  statTotal:  $('stat-total-num'),
  statUrgent: $('stat-urgent-num'),
  statDone:   $('stat-done-num'),
  statOverload: $('stat-overload-num'),

  // Sidebar
  courseFilterList: $('course-filter-list'),
  filterPriority:   $('filter-priority'),
  filterStatus:     $('filter-status'),
  filterSort:       $('filter-sort'),
  resetFiltersBtn:  $('reset-filters-btn'),
  sidebarAddBtn:    $('sidebar-add-btn'),
  exportBtn:        $('export-btn'),

  // Tasks
  searchInput:      $('search-input'),
  activeFiltersBar: $('active-filters-bar'),
  taskGrid:         $('task-grid'),
  emptyState:       $('empty-state'),
  emptyAddBtn:      $('empty-add-btn'),

  // Form
  formTitle:      $('form-title'),
  taskForm:       $('task-form'),
  taskId:         $('task-id'),
  taskCourse:     $('task-course'),
  taskTitle:      $('task-title'),
  taskDue:        $('task-due'),
  taskPriority:   $('task-priority'),
  taskProgress:   $('task-progress'),
  progressDisplay: $('progress-display'),
  taskStatus:     $('task-status'),
  taskRecurring:  $('task-recurring'),
  taskNotes:      $('task-notes'),
  formSubmit:     $('form-submit-btn'),
  formCancel:     $('form-cancel-btn'),
  formReset:      $('form-reset-btn'),

  // Form errors
  courseError:   $('course-error'),
  titleError:    $('title-error'),
  dueError:      $('due-error'),
  priorityError: $('priority-error'),

  // Calendar
  calPrev:        $('cal-prev'),
  calNext:        $('cal-next'),
  calMonthLabel:  $('cal-month-label'),
  calGrid:        $('cal-grid'),
  calDetailTitle: $('cal-detail-title'),
  calDetailList:  $('cal-detail-list'),

  // Settings
  themeSelect:    $('theme-select'),
  accentSelect:   $('accent-select'),
  warnDays:       $('warn-days'),
  overloadToggle: $('overload-toggle'),
  conflictToggle: $('conflict-toggle'),
  dataCount:      $('data-count'),
  dataSize:       $('data-size'),
  importBtn:      $('import-btn'),
  importFile:     $('import-file'),
  exportJsonBtn:  $('export-json-btn'),
  clearDataBtn:   $('clear-data-btn'),

  // Modal
  taskModal:       $('task-modal'),
  modalCloseBtn:   $('modal-close-btn'),
  modalCourseBadge: $('modal-course-badge'),
  modalTitle:      $('modal-title'),
  modalDue:        $('modal-due'),
  modalPriority:   $('modal-priority'),
  modalRecurring:  $('modal-recurring'),
  modalStatus:     $('modal-status'),
  modalProgressBar: $('modal-progress-bar'),
  modalProgressPct: $('modal-progress-pct'),
  modalProgressBg:  document.querySelector('.modal-progress-bar-bg'),
  modalNotes:      $('modal-notes'),
  modalCountdown:  $('modal-countdown-label'),
  modalEditBtn:    $('modal-edit-btn'),
  modalCompleteBtn: $('modal-complete-btn'),
  modalDeleteBtn:  $('modal-delete-btn'),

  // Confirm dialog
  confirmDialog:  $('confirm-dialog'),
  confirmMessage: $('confirm-message'),
  confirmYes:     $('confirm-yes-btn'),
  confirmNo:      $('confirm-no-btn'),

  // Toast
  toast: $('toast'),
};

/* ═══════════════════════════════════════════
   3. TOAST NOTIFICATION
═══════════════════════════════════════════ */
let toastTimer = null;
function showToast(message, type = 'info', duration = 3000) {
  DOM.toast.textContent = message;
  DOM.toast.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, duration);
}

/* ═══════════════════════════════════════════
   4. VIEW / NAVIGATION
═══════════════════════════════════════════ */
function switchView(viewId) {
  // Hide all views
  Object.values(DOM.views).forEach(v => {
    if (v) { v.hidden = true; v.classList.remove('active-view'); }
  });

  // Show target
  const target = DOM.views[viewId];
  if (target) { target.hidden = false; target.classList.add('active-view'); }

  // Update nav active state
  DOM.navLinks.forEach(a => {
    a.classList.toggle('active', a.id === `nav-${viewId.replace('-view', '').replace('add-', 'add')}`);
    a.removeAttribute('aria-current');
    if (a.classList.contains('active')) a.setAttribute('aria-current', 'page');
  });
  DOM.mobLinks.forEach(a => {
    a.classList.toggle('active', a.id === `mob-${viewId.replace('-view', '').replace('add-', 'add')}`);
  });

  // Close mobile menu
  DOM.mobileMenu.hidden = true;
  DOM.hamburger.setAttribute('aria-expanded', 'false');

  // View-specific setup
  if (viewId === 'calendar-view') renderCalendar();
  if (viewId === 'settings-view') renderSettingsInfo();
  if (viewId === 'dashboard') {
    loadState();
    renderDashboard();
  }
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════════════════════════════════
   5. STATE LOAD & INIT
═══════════════════════════════════════════ */
function loadState() {
  State.tasks    = Store.loadTasks();
  State.settings = Store.loadSettings();
}

function init() {
  loadState();
  applyTheme();
  bindEvents();
  switchView('dashboard');
}

/* ═══════════════════════════════════════════
   6. THEME / SETTINGS APPLY
═══════════════════════════════════════════ */
function applyTheme() {
  const { theme, accent } = State.settings;
  // Remove old theme classes
  document.body.className = document.body.className
    .replace(/theme-\w+/g, '')
    .replace(/accent-\w+/g, '')
    .trim();
  if (theme !== 'dark')   document.body.classList.add(`theme-${theme}`);
  if (accent !== 'violet') document.body.classList.add(`accent-${accent}`);
}

/* ═══════════════════════════════════════════
   7. DASHBOARD RENDER
═══════════════════════════════════════════ */
function renderDashboard() {
  renderStats();
  renderCourseFilters();
  renderTaskGrid();
  renderConflictAlert();
}

/* ─── Stats ─── */
function renderStats() {
  const tasks    = State.tasks;
  const now      = new Date();
  const warnMs   = (State.settings.warnDays || 3) * 86400000;
  const total    = tasks.length;
  const done     = tasks.filter(t => t.status === 'completed').length;
  const urgent   = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const diff = new Date(t.dueDate) - now;
    return diff > 0 && diff <= warnMs;
  }).length;
  const conflicts = Conflicts.detect(tasks, State.settings).length;

  DOM.statTotal.textContent   = total;
  DOM.statDone.textContent    = done;
  DOM.statUrgent.textContent  = urgent;
  DOM.statOverload.textContent = conflicts;
}

/* ─── Course filter sidebar ─── */
function renderCourseFilters() {
  const courses = getUniqueCourses(State.tasks);
  const selected = State.filter.courses;

  DOM.courseFilterList.innerHTML = '';

  // "All" option
  const allLi = document.createElement('li');
  allLi.className = 'course-filter-item';
  const allCb = document.createElement('input');
  allCb.type = 'checkbox';
  allCb.id = 'course-all';
  allCb.checked = selected.length === 0;
  allCb.addEventListener('change', () => {
    State.filter.courses = [];
    renderCourseFilters();
    renderTaskGrid();
  });
  const allLbl = document.createElement('label');
  allLbl.htmlFor = 'course-all';
  allLbl.textContent = 'All Courses';
  const allCount = document.createElement('span');
  allCount.className = 'course-badge-count';
  allCount.textContent = State.tasks.length;
  allLi.append(allCb, allLbl, allCount);
  DOM.courseFilterList.appendChild(allLi);

  courses.forEach((course, idx) => {
    const count = State.tasks.filter(t => t.course === course).length;
    const li    = document.createElement('li');
    li.className = 'course-filter-item';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id   = `course-cb-${idx}`;
    cb.checked = selected.includes(course);
    cb.addEventListener('change', () => {
      if (cb.checked) {
        State.filter.courses.push(course);
      } else {
        State.filter.courses = State.filter.courses.filter(c => c !== course);
      }
      renderCourseFilters();
      renderTaskGrid();
    });

    const lbl = document.createElement('label');
    lbl.htmlFor = cb.id;
    lbl.textContent = course;

    const badge = document.createElement('span');
    badge.className = 'course-badge-count';
    badge.textContent = count;

    li.append(cb, lbl, badge);
    DOM.courseFilterList.appendChild(li);
  });
}

/* ─── Filter & Sort tasks ─── */
function getFilteredTasks() {
  let tasks = [...State.tasks];
  const f = State.filter;

  // Course filter
  if (f.courses.length > 0) tasks = tasks.filter(t => f.courses.includes(t.course));
  // Priority filter
  if (f.priority !== 'all') tasks = tasks.filter(t => t.priority === f.priority);
  // Status filter
  if (f.status !== 'all') tasks = tasks.filter(t => t.status === f.status);
  // Search filter
  if (f.search.trim()) {
    const q = f.search.toLowerCase();
    tasks = tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.course.toLowerCase().includes(q) ||
      (t.notes || '').toLowerCase().includes(q)
    );
  }

  // Sort
  tasks.sort((a, b) => {
    switch (f.sort) {
      case 'priority':
        return (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0);
      case 'course':
        return a.course.localeCompare(b.course);
      case 'progress':
        return b.progress - a.progress;
      case 'due-date':
      default:
        return new Date(a.dueDate) - new Date(b.dueDate);
    }
  });

  return tasks;
}

/* ─── Active filters bar ─── */
function renderActiveFiltersBar() {
  const f = State.filter;
  const chips = [];
  if (f.courses.length > 0) chips.push(`Course: ${f.courses.length} selected`);
  if (f.priority !== 'all') chips.push(`Priority: ${f.priority}`);
  if (f.status   !== 'all') chips.push(`Status: ${f.status}`);
  if (f.search.trim())      chips.push(`Search: "${f.search}"`);

  DOM.activeFiltersBar.innerHTML = chips
    .map(c => `<span class="filter-chip">${c}</span>`)
    .join('');
}

/* ─── Task Grid ─── */
function renderTaskGrid() {
  const tasks = getFilteredTasks();
  renderActiveFiltersBar();

  if (tasks.length === 0) {
    DOM.taskGrid.innerHTML = '';
    DOM.emptyState.hidden = false;
    return;
  }
  DOM.emptyState.hidden = true;
  DOM.taskGrid.innerHTML = '';

  tasks.forEach(task => {
    const card = createTaskCard(task);
    DOM.taskGrid.appendChild(card);
  });
}

/* ─── Task Card DOM builder ─── */
function createTaskCard(task) {
  const card = document.createElement('article');
  card.className = `task-card priority-${task.priority} status-${task.status}`;
  card.setAttribute('role', 'listitem');
  card.setAttribute('data-id', task.id);
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${task.title} – ${task.course}`);

  const cd       = getCountdownLabel(task.dueDate, task.status);
  const isDone   = task.status === 'completed';
  const pctWidth = task.progress + '%';

  card.innerHTML = `
    <div class="card-top">
      <span class="card-course">${escHtml(task.course)}</span>
      <span class="priority-badge ${task.priority}">${priorityLabel(task.priority)}</span>
    </div>

    <h3 class="card-title">${escHtml(task.title)}</h3>

    <div class="card-meta">
      <div class="card-meta-row">
        <span class="card-meta-label">📅 Due</span>
        <span class="card-meta-value">${formatDateShort(task.dueDate)}</span>
      </div>
      <div class="card-meta-row">
        <span class="status-chip ${task.status}">${statusLabel(task.status)}</span>
        <span class="countdown-chip ${cd.cls}">${cd.text}</span>
      </div>
      ${task.recurring !== 'none' ? `
      <div class="card-meta-row">
        <span class="recurring-chip">🔄 ${recurringLabel(task.recurring)}</span>
      </div>` : ''}
    </div>

    <div class="card-progress-wrap">
      <div class="card-progress-header">
        <span class="card-progress-label">Progress</span>
        <span class="card-progress-pct">${task.progress}%</span>
      </div>
      <div class="progress-bar-bg" role="progressbar" aria-valuenow="${task.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress ${task.progress}%">
        <div class="progress-bar-fill ${isDone ? 'done' : ''}" style="width:${pctWidth}"></div>
      </div>
    </div>

    <div class="card-actions">
      <button class="btn btn-outline btn-sm" data-action="view" data-id="${task.id}" aria-label="View details of ${escHtml(task.title)}">View</button>
      <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${task.id}" aria-label="Edit ${escHtml(task.title)}">✏ Edit</button>
      <button class="btn btn-${isDone ? 'secondary' : 'success'} btn-sm" data-action="complete" data-id="${task.id}" aria-label="${isDone ? 'Undo completion' : 'Mark complete'} for ${escHtml(task.title)}">
        ${isDone ? '↩ Undo' : '✓ Done'}
      </button>
    </div>
  `;

  return card;
}

/* ─── Conflict / Overload Alert Banner ─── */
function renderConflictAlert() {
  const conflicts = Conflicts.detect(State.tasks, State.settings);
  if (conflicts.length === 0) {
    DOM.alertBanner.hidden = true;
    return;
  }
  const topConflict = conflicts[0];
  DOM.alertMessage.textContent = topConflict.message +
    (conflicts.length > 1 ? ` (+${conflicts.length - 1} more alerts)` : '');
  DOM.alertBanner.hidden = false;
}

/* ═══════════════════════════════════════════
   8. FORM – ADD / EDIT TASK
═══════════════════════════════════════════ */
function openAddForm() {
  State.editingTaskId = null;
  DOM.formTitle.textContent = 'Add New Assignment';
  DOM.formSubmit.textContent = '✓ Save Assignment';
  clearFormErrors();
  DOM.taskForm.reset();
  DOM.progressDisplay.textContent = '0%';
  // Set min date to now
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  DOM.taskDue.min = now.toISOString().slice(0, 16);
  switchView('add-task');
}

function openEditForm(taskId) {
  const task = Store.getTask(taskId);
  if (!task) { showToast('Task not found.', 'error'); return; }
  State.editingTaskId = taskId;
  DOM.formTitle.textContent = 'Edit Assignment';
  DOM.formSubmit.innerHTML = '✓ Update Assignment';
  clearFormErrors();

  // Populate form
  DOM.taskId.value       = task.id;
  DOM.taskCourse.value   = task.course;
  DOM.taskTitle.value    = task.title;
  DOM.taskPriority.value = task.priority;
  DOM.taskProgress.value = task.progress;
  DOM.progressDisplay.textContent = task.progress + '%';
  DOM.taskStatus.value   = task.status;
  DOM.taskRecurring.value = task.recurring;
  DOM.taskNotes.value    = task.notes || '';

  // Format date for datetime-local input
  const d = new Date(task.dueDate);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  DOM.taskDue.value = d.toISOString().slice(0, 16);

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  DOM.taskDue.min = now.toISOString().slice(0, 16);

  closeModal();
  switchView('add-task');
}

/* ─── Form Validation ─── */
function validateForm() {
  let valid = true;
  clearFormErrors();

  const course   = DOM.taskCourse.value.trim();
  const title    = DOM.taskTitle.value.trim();
  const dueVal   = DOM.taskDue.value;
  const priority = DOM.taskPriority.value;

  if (!course || course.length < 2) {
    showFieldError(DOM.courseError, 'Course name must be at least 2 characters.');
    DOM.taskCourse.focus();
    valid = false;
  }
  if (!title || title.length < 2) {
    showFieldError(DOM.titleError, 'Assignment title must be at least 2 characters.');
    if (valid) DOM.taskTitle.focus();
    valid = false;
  }
  if (!dueVal) {
    showFieldError(DOM.dueError, 'Please select a due date and time.');
    if (valid) DOM.taskDue.focus();
    valid = false;
  } else {
    const dueDate = new Date(dueVal);
    const now     = new Date();
    // Allow editing past tasks but warn if adding new with past date
    if (!State.editingTaskId && dueDate <= now) {
      showFieldError(DOM.dueError, 'Due date must be in the future for new assignments.');
      if (valid) DOM.taskDue.focus();
      valid = false;
    }
  }
  if (!priority) {
    showFieldError(DOM.priorityError, 'Please select a priority level.');
    if (valid) DOM.taskPriority.focus();
    valid = false;
  }

  return valid;
}

function showFieldError(el, msg) {
  el.textContent = msg;
}
function clearFormErrors() {
  [DOM.courseError, DOM.titleError, DOM.dueError, DOM.priorityError]
    .forEach(el => { el.textContent = ''; });
}

/* ─── Form Submit Handler ─── */
function handleFormSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const progress = parseInt(DOM.taskProgress.value, 10);
  // Auto-set status based on progress
  let status = DOM.taskStatus.value;
  if (progress === 100) status = 'completed';
  else if (progress > 0 && status === 'not-started') status = 'in-progress';

  const taskData = {
    course:    DOM.taskCourse.value.trim(),
    title:     DOM.taskTitle.value.trim(),
    dueDate:   new Date(DOM.taskDue.value).toISOString(),
    priority:  DOM.taskPriority.value,
    progress,
    status,
    recurring: DOM.taskRecurring.value,
    notes:     DOM.taskNotes.value.trim()
  };

  if (State.editingTaskId) {
    Store.updateTask(State.editingTaskId, taskData);
    showToast('✓ Assignment updated successfully!', 'success');
  } else {
    Store.addTask(taskData);
    showToast('✓ Assignment added!', 'success');
    // Handle recurring: create future occurrences
    createRecurringTasks(taskData);
  }

  State.editingTaskId = null;
  loadState();
  switchView('dashboard');
}

/* ─── Recurring task generator ─── */
function createRecurringTasks(taskData) {
  if (taskData.recurring === 'none') return;
  const intervals = { weekly: 7, biweekly: 14, monthly: 30 };
  const days = intervals[taskData.recurring];
  if (!days) return;

  // Create 2 more future occurrences
  for (let i = 1; i <= 2; i++) {
    const nextDue = new Date(taskData.dueDate);
    nextDue.setDate(nextDue.getDate() + days * i);
    Store.addTask({
      ...taskData,
      dueDate:   nextDue.toISOString(),
      progress:  0,
      status:    'not-started',
      notes:     `[Recurring] ${taskData.notes}`.substring(0, 500)
    });
  }
}

/* ═══════════════════════════════════════════
   9. TASK MODAL
═══════════════════════════════════════════ */
function openModal(taskId) {
  const task = Store.getTask(taskId);
  if (!task) return;

  DOM.modalCourseBadge.textContent  = task.course;
  DOM.modalTitle.textContent        = task.title;
  DOM.modalDue.textContent          = formatDateTime(task.dueDate);
  DOM.modalPriority.textContent     = priorityLabel(task.priority);
  DOM.modalRecurring.textContent    = recurringLabel(task.recurring);
  DOM.modalStatus.textContent       = statusLabel(task.status);
  DOM.modalNotes.textContent        = task.notes || 'No notes provided.';

  // Progress
  const pct = task.progress + '%';
  DOM.modalProgressBar.style.width = pct;
  DOM.modalProgressPct.textContent = pct;
  if (DOM.modalProgressBg) {
    DOM.modalProgressBg.setAttribute('aria-valuenow', task.progress);
  }

  // Countdown
  const cd = getCountdownLabel(task.dueDate, task.status);
  DOM.modalCountdown.textContent  = cd.text;
  DOM.modalCountdown.className    = `countdown-label countdown-chip ${cd.cls}`;

  // Store id for actions
  DOM.modalEditBtn.dataset.id     = task.id;
  DOM.modalCompleteBtn.dataset.id = task.id;
  DOM.modalDeleteBtn.dataset.id   = task.id;

  // Mark complete button text
  DOM.modalCompleteBtn.textContent = task.status === 'completed' ? '↩ Undo Complete' : '✓ Mark Complete';

  DOM.taskModal.hidden = false;
  DOM.modalCloseBtn.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  DOM.taskModal.hidden = true;
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════
   10. DELETE CONFIRM
═══════════════════════════════════════════ */
function openConfirmDelete(taskId) {
  const task = Store.getTask(taskId);
  if (!task) return;
  State.pendingDeleteId = taskId;
  DOM.confirmMessage.textContent = `Are you sure you want to delete "${task.title}"? This cannot be undone.`;
  DOM.confirmDialog.hidden = false;
  DOM.confirmYes.focus();
  document.body.style.overflow = 'hidden';
}

function closeConfirm() {
  DOM.confirmDialog.hidden = true;
  State.pendingDeleteId = null;
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════
   11. CALENDAR RENDER
═══════════════════════════════════════════ */
function renderCalendar() {
  const tasks = Store.loadTasks();
  const d     = State.calendarDate;
  const year  = d.getFullYear();
  const month = d.getMonth();

  DOM.calMonthLabel.textContent = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Build date → tasks map
  const tasksByDate = {};
  tasks.forEach(t => {
    const key = t.dueDate.slice(0, 10);
    if (!tasksByDate[key]) tasksByDate[key] = [];
    tasksByDate[key].push(t);
  });

  // First day & days in month
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr    = new Date().toISOString().slice(0, 10);

  DOM.calGrid.innerHTML = '';

  // Leading blanks from prev month
  const prevDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const cell = document.createElement('div');
    cell.className = 'cal-day other-month';
    cell.innerHTML = `<span class="day-num">${prevDays - i}</span>`;
    DOM.calGrid.appendChild(cell);
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell    = document.createElement('div');
    cell.className = 'cal-day' + (dateStr === todayStr ? ' today' : '');
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    cell.dataset.date = dateStr;

    cell.innerHTML = `<div class="day-num">${day}</div>`;

    const dayTasks = tasksByDate[dateStr] || [];
    const shown    = dayTasks.slice(0, 3);
    shown.forEach(t => {
      const dot = document.createElement('div');
      dot.className = `cal-dot ${t.priority}`;
      dot.title = t.title;
      cell.appendChild(dot);
    });
    if (dayTasks.length > 3) {
      const more = document.createElement('div');
      more.className = 'cal-more';
      more.textContent = `+${dayTasks.length - 3} more`;
      cell.appendChild(more);
    }

    cell.addEventListener('click', () => selectCalDay(dateStr, dayTasks, cell));
    cell.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCalDay(dateStr, dayTasks, cell); }
    });
    cell.setAttribute('tabindex', '0');

    DOM.calGrid.appendChild(cell);
  }

  // Trailing blanks
  const totalCells = firstDay + daysInMonth;
  const trailing   = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= trailing; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day other-month';
    cell.innerHTML = `<span class="day-num">${i}</span>`;
    DOM.calGrid.appendChild(cell);
  }
}

function selectCalDay(dateStr, tasks, cellEl) {
  // Deselect previous
  $$('.cal-day.selected').forEach(c => c.classList.remove('selected'));
  cellEl.classList.add('selected');

  DOM.calDetailTitle.textContent = new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  DOM.calDetailList.innerHTML = '';

  if (tasks.length === 0) {
    const li = document.createElement('li');
    li.style.color = 'var(--text-muted)';
    li.style.fontSize = '0.88rem';
    li.textContent = 'No assignments due on this day.';
    DOM.calDetailList.appendChild(li);
    return;
  }

  tasks.forEach(t => {
    const li  = document.createElement('li');
    li.className = `cal-detail-item ${t.priority}`;
    li.innerHTML = `
      <span class="priority-badge ${t.priority}">${priorityLabel(t.priority)}</span>
      <div>
        <strong>${escHtml(t.title)}</strong>
        <br/><small style="color:var(--text-muted)">${escHtml(t.course)} · ${statusLabel(t.status)}</small>
      </div>
    `;
    DOM.calDetailList.appendChild(li);
  });
}

/* ═══════════════════════════════════════════
   12. SETTINGS
═══════════════════════════════════════════ */
function renderSettingsInfo() {
  loadState();
  const tasks = State.tasks;
  DOM.dataCount.textContent = tasks.length + ' tasks';
  const bytes = Store.getSize();
  DOM.dataSize.textContent  = bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB';

  // Sync form controls to settings
  DOM.themeSelect.value    = State.settings.theme    || 'dark';
  DOM.accentSelect.value   = State.settings.accent   || 'violet';
  DOM.warnDays.value       = State.settings.warnDays || 3;
  DOM.overloadToggle.checked = State.settings.overloadAlerts !== false;
  DOM.conflictToggle.checked = State.settings.conflictAlerts !== false;
}

function saveSettings() {
  State.settings = {
    theme:          DOM.themeSelect.value,
    accent:         DOM.accentSelect.value,
    warnDays:       parseInt(DOM.warnDays.value, 10) || 3,
    overloadAlerts: DOM.overloadToggle.checked,
    conflictAlerts: DOM.conflictToggle.checked
  };
  Store.saveSettings(State.settings);
  applyTheme();
  showToast('Settings saved!', 'success');
}

/* ═══════════════════════════════════════════
   13. IMPORT / EXPORT
═══════════════════════════════════════════ */
function handleExportCSV() {
  const tasks = Store.loadTasks();
  const csv   = exportCSV(tasks);
  downloadFile(csv, `deadlineiq_tasks_${Date.now()}.csv`, 'text/csv');
  showToast('CSV exported!', 'success');
}

function handleExportJSON() {
  const tasks = Store.loadTasks();
  downloadFile(JSON.stringify(tasks, null, 2), `deadlineiq_tasks_${Date.now()}.json`, 'application/json');
  showToast('JSON exported!', 'success');
}

function handleImportJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error('Invalid format');
      const existing = Store.loadTasks();
      const merged   = [...existing, ...data.map(t => ({ ...t, id: getNextId ? getNextId() : Date.now() }))];
      Store.saveTasks(merged);
      loadState();
      renderDashboard();
      showToast(`Imported ${data.length} task(s)!`, 'success');
    } catch {
      showToast('Import failed: invalid JSON file.', 'error');
    }
  };
  reader.readAsText(file);
}

/* ═══════════════════════════════════════════
   14. EVENT BINDINGS
═══════════════════════════════════════════ */
function bindEvents() {
  /* --- Navigation --- */
  DOM.hamburger.addEventListener('click', () => {
    const open = !DOM.mobileMenu.hidden;
    DOM.mobileMenu.hidden = open;
    DOM.hamburger.setAttribute('aria-expanded', !open);
  });

  // All nav & mobile links
  document.querySelectorAll('[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const hash = a.getAttribute('href').slice(1);
      if (DOM.views[hash]) switchView(hash);
      else if (hash === 'add-task') openAddForm();
    });
  });

  /* --- Sidebar Add / Export --- */
  DOM.sidebarAddBtn.addEventListener('click', openAddForm);
  DOM.emptyAddBtn.addEventListener('click', openAddForm);
  DOM.exportBtn.addEventListener('click', handleExportCSV);

  /* --- Filters --- */
  DOM.filterPriority.addEventListener('change', () => {
    State.filter.priority = DOM.filterPriority.value;
    renderTaskGrid();
  });
  DOM.filterStatus.addEventListener('change', () => {
    State.filter.status = DOM.filterStatus.value;
    renderTaskGrid();
  });
  DOM.filterSort.addEventListener('change', () => {
    State.filter.sort = DOM.filterSort.value;
    renderTaskGrid();
  });
  DOM.resetFiltersBtn.addEventListener('click', () => {
    State.filter = { courses: [], priority: 'all', status: 'all', sort: 'due-date', search: '' };
    DOM.filterPriority.value = 'all';
    DOM.filterStatus.value   = 'all';
    DOM.filterSort.value     = 'due-date';
    DOM.searchInput.value    = '';
    renderCourseFilters();
    renderTaskGrid();
    showToast('Filters reset.', 'info');
  });

  /* --- Search --- */
  DOM.searchInput.addEventListener('input', debounce(() => {
    State.filter.search = DOM.searchInput.value;
    renderTaskGrid();
  }, 250));

  /* --- Task Grid event delegation --- */
  DOM.taskGrid.addEventListener('click', handleTaskGridClick);
  DOM.taskGrid.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const card = e.target.closest('.task-card');
      if (card && e.target === card) openModal(parseInt(card.dataset.id, 10));
    }
  });

  /* --- Task card click (card body = view) --- */
  DOM.taskGrid.addEventListener('click', e => {
    const card = e.target.closest('.task-card');
    if (card && !e.target.closest('.btn')) {
      openModal(parseInt(card.dataset.id, 10));
    }
  });

  /* --- Form --- */
  DOM.taskForm.addEventListener('submit', handleFormSubmit);
  DOM.formCancel.addEventListener('click', () => switchView('dashboard'));
  DOM.formReset.addEventListener('click', () => {
    DOM.taskForm.reset();
    DOM.progressDisplay.textContent = '0%';
    clearFormErrors();
  });
  DOM.taskProgress.addEventListener('input', () => {
    DOM.progressDisplay.textContent = DOM.taskProgress.value + '%';
    // Auto-update status select
    const v = parseInt(DOM.taskProgress.value, 10);
    if (v === 100)      DOM.taskStatus.value = 'completed';
    else if (v > 0)     DOM.taskStatus.value = 'in-progress';
    else                DOM.taskStatus.value = 'not-started';
  });

  /* --- Alert banner close --- */
  DOM.alertCloseBtn.addEventListener('click', () => { DOM.alertBanner.hidden = true; });

  /* --- Modal --- */
  DOM.modalCloseBtn.addEventListener('click', closeModal);
  DOM.taskModal.addEventListener('click', e => { if (e.target === DOM.taskModal) closeModal(); });
  DOM.modalEditBtn.addEventListener('click', () => openEditForm(parseInt(DOM.modalEditBtn.dataset.id, 10)));
  DOM.modalCompleteBtn.addEventListener('click', () => {
    const id = parseInt(DOM.modalCompleteBtn.dataset.id, 10);
    const task = Store.getTask(id);
    if (!task) return;
    const newStatus   = task.status === 'completed' ? 'in-progress' : 'completed';
    const newProgress = newStatus === 'completed' ? 100 : task.progress;
    Store.updateTask(id, { status: newStatus, progress: newProgress });
    closeModal();
    loadState();
    renderDashboard();
    showToast(newStatus === 'completed' ? '✓ Marked as complete!' : '↩ Unmarked.', 'success');
  });
  DOM.modalDeleteBtn.addEventListener('click', () => {
    const id = parseInt(DOM.modalDeleteBtn.dataset.id, 10);
    closeModal();
    openConfirmDelete(id);
  });

  /* --- Confirm dialog --- */
  DOM.confirmYes.addEventListener('click', () => {
    if (State.pendingDeleteId) {
      Store.deleteTask(State.pendingDeleteId);
      loadState();
      renderDashboard();
      showToast('Task deleted.', 'info');
    }
    closeConfirm();
  });
  DOM.confirmNo.addEventListener('click', closeConfirm);
  DOM.confirmDialog.addEventListener('click', e => { if (e.target === DOM.confirmDialog) closeConfirm(); });

  /* --- Escape key closes modals --- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!DOM.taskModal.hidden) closeModal();
      if (!DOM.confirmDialog.hidden) closeConfirm();
    }
  });

  /* --- Calendar --- */
  DOM.calPrev.addEventListener('click', () => {
    State.calendarDate.setMonth(State.calendarDate.getMonth() - 1);
    renderCalendar();
  });
  DOM.calNext.addEventListener('click', () => {
    State.calendarDate.setMonth(State.calendarDate.getMonth() + 1);
    renderCalendar();
  });

  /* --- Settings --- */
  [DOM.themeSelect, DOM.accentSelect, DOM.warnDays, DOM.overloadToggle, DOM.conflictToggle]
    .forEach(el => el.addEventListener('change', saveSettings));

  DOM.exportBtn.addEventListener('click', handleExportCSV);
  DOM.exportJsonBtn.addEventListener('click', handleExportJSON);
  DOM.importBtn.addEventListener('click', () => DOM.importFile.click());
  DOM.importFile.addEventListener('change', () => {
    handleImportJSON(DOM.importFile.files[0]);
    DOM.importFile.value = '';
  });
  DOM.clearDataBtn.addEventListener('click', () => {
    if (!confirm('This will permanently delete ALL tasks. Are you sure?')) return;
    Store.clearAll();
    loadState();
    renderDashboard();
    renderSettingsInfo();
    showToast('All data cleared.', 'info');
  });
}

/* ─── Task grid button delegation (action buttons) ─── */
function handleTaskGridClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  e.stopPropagation();
  const id     = parseInt(btn.dataset.id, 10);
  const action = btn.dataset.action;

  switch (action) {
    case 'view':
      openModal(id);
      break;
    case 'edit':
      openEditForm(id);
      break;
    case 'complete': {
      const task = Store.getTask(id);
      if (!task) return;
      const newStatus   = task.status === 'completed' ? 'in-progress' : 'completed';
      const newProgress = newStatus === 'completed' ? 100 : task.progress;
      Store.updateTask(id, { status: newStatus, progress: newProgress });
      loadState();
      renderDashboard();
      showToast(newStatus === 'completed' ? '✓ Done!' : '↩ Undone.', 'success');
      break;
    }
  }
}

/* ═══════════════════════════════════════════
   15. UTILITY HELPERS
═══════════════════════════════════════════ */
/** HTML escape to prevent XSS */
function escHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str || ''));
  return d.innerHTML;
}

/** Debounce factory */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ═══════════════════════════════════════════
   16. BOOT
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', init);
