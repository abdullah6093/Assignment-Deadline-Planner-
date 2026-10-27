"""
generate_doc.py
Creates Assignment1_DeadlineIQ_Report.docx in d:/project/webproject/
"""

from docx import Document
from docx.shared import Pt, Cm, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os, datetime

# ── Paths ──────────────────────────────────────────────────────────────────
BRAIN = r"C:\Users\abdul\.gemini\antigravity-ide\brain\13cf67e4-db58-4d54-bbcb-1725a4fc85e2"
IMGS = {
    "dashboard": os.path.join(BRAIN, "screenshot_dashboard_1793130917496.jpg"),
    "add_task":  os.path.join(BRAIN, "screenshot_add_task_1793130973610.jpg"),
    "calendar":  os.path.join(BRAIN, "screenshot_calendar_1793130985177.jpg"),
    "modal":     os.path.join(BRAIN, "screenshot_modal_1793131029125.jpg"),
    "settings":  os.path.join(BRAIN, "screenshot_settings_1793131089952.jpg"),
}
OUT = r"d:\project\webproject\Assignment1_DeadlineIQ_Report.docx"

# ── Helpers ─────────────────────────────────────────────────────────────────
def set_font(run, name="Calibri", size=12, bold=False, italic=False, color=None):
    run.font.name = name
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    if color:
        run.font.color.rgb = RGBColor(*color)

def heading(doc, text, level=1, color=(55, 0, 120)):
    p = doc.add_heading(text, level=level)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    for run in p.runs:
        run.font.color.rgb = RGBColor(*color)
        run.font.name = "Calibri"
    return p

def para(doc, text="", bold=False, italic=False, size=11, align=WD_ALIGN_PARAGRAPH.LEFT, color=(30,30,30)):
    p = doc.add_paragraph()
    p.alignment = align
    if text:
        run = p.add_run(text)
        set_font(run, size=size, bold=bold, italic=italic, color=color)
    return p

def add_image(doc, path, width=Inches(6.0), caption_text=""):
    if os.path.exists(path):
        doc.add_picture(path, width=width)
        last = doc.paragraphs[-1]
        last.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if caption_text:
            cp = doc.add_paragraph(caption_text)
            cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = cp.runs[0] if cp.runs else cp.add_run(caption_text)
            set_font(r, size=9, italic=True, color=(120,120,120))
    else:
        p = doc.add_paragraph(f"[Image not found: {os.path.basename(path)}]")
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER

def add_hr(doc):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '6')
    bottom.set(qn('w:space'), '1')
    bottom.set(qn('w:color'), '7C5CFC')
    pBdr.append(bottom)
    pPr.append(pBdr)

def page_break(doc):
    doc.add_page_break()

def set_page_margins(doc):
    from docx.oxml.ns import nsmap
    section = doc.sections[0]
    section.top_margin    = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin   = Cm(2.5)
    section.right_margin  = Cm(2.5)

# ── Build Document ──────────────────────────────────────────────────────────
doc = Document()
set_page_margins(doc)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 1 – COVER PAGE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Top spacer
for _ in range(4):
    doc.add_paragraph()

# University name
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("UNIVERSITY ASSIGNMENT SUBMISSION")
set_font(r, size=13, bold=True, color=(100, 100, 100))

doc.add_paragraph()

# Project title
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("DeadlineIQ")
set_font(r, name="Calibri", size=42, bold=True, color=(124, 92, 252))

p2 = doc.add_paragraph()
p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
r2 = p2.add_run("Assignment Deadline Planner")
set_font(r2, size=20, bold=False, italic=True, color=(80, 60, 160))

doc.add_paragraph()
add_hr(doc)
doc.add_paragraph()

# Details table (centered info)
table = doc.add_table(rows=6, cols=2)
table.alignment = 1  # center
table.style = "Table Grid"

labels = [
    ("Topic",           "#12 – Assignment Deadline Planner"),
    ("Assignment",      "Assignment 1 – Client-Side Web Application"),
    ("Student Name",    "Abdullah Ahmed"),
    ("CMS ID",          "503939"),
    ("Class",           "BESE 15 B"),
    ("Date of Submission", "October 28, 2026"),
]

for i, (lbl, val) in enumerate(labels):
    row = table.rows[i]
    c0, c1 = row.cells[0], row.cells[1]
    # Label cell
    r0 = c0.paragraphs[0].add_run(lbl)
    set_font(r0, size=11, bold=True, color=(80, 60, 160))
    c0.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    # Value cell
    r1 = c1.paragraphs[0].add_run(val)
    set_font(r1, size=11, bold=(lbl in ["Student Name", "CMS ID", "Class"]),
             color=(30, 30, 30) if lbl not in ["Student Name"] else (20, 20, 80))
    c1.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.LEFT
    # Column widths
    c0.width = Inches(2.2)
    c1.width = Inches(3.8)

doc.add_paragraph()
add_hr(doc)
doc.add_paragraph()

# Course info
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Web Development | CLO 1, 2, 4")
set_font(r, size=11, italic=True, color=(120, 120, 120))

for _ in range(5):
    doc.add_paragraph()

# Links section on cover
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("🔗  GitHub Repository:")
set_font(r, size=11, bold=True, color=(80, 60, 160))

p2 = doc.add_paragraph()
p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
r2 = p2.add_run("https://github.com/abdullah6093/Assignment-Deadline-Planner-")
set_font(r2, size=10, color=(0, 80, 180))

doc.add_paragraph()

p3 = doc.add_paragraph()
p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
r3 = p3.add_run("🌐  Live Demo URL:")
set_font(r3, size=11, bold=True, color=(80, 60, 160))

p4 = doc.add_paragraph()
p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
r4 = p4.add_run("https://abdullah6093.github.io/Assignment-Deadline-Planner-/")
set_font(r4, size=10, color=(0, 80, 180))

page_break(doc)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 2 – PROJECT OVERVIEW
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

heading(doc, "1. Project Overview", level=1)
add_hr(doc)

para(doc, (
    "DeadlineIQ is a fully responsive, client-side Assignment Deadline Planner built using "
    "semantic HTML5, vanilla CSS (with custom properties, Flexbox, Grid, and media queries), "
    "and vanilla JavaScript. The application allows university students to manage multiple "
    "assignment deadlines across different courses."
), size=11)

doc.add_paragraph()

heading(doc, "Key Features", level=2)
features = [
    "📋  Dashboard with task cards showing priority, progress, status, and countdown",
    "➕  Add / Edit / Delete assignments via a validated form",
    "📅  Interactive calendar view with month navigation and day-detail panel",
    "⚡  Automatic conflict detection (2+ HIGH-priority tasks on same day)",
    "🔥  Overload alerts (3+ any-priority tasks on same day)",
    "🔄  Recurring task auto-generation (weekly / bi-weekly / monthly)",
    "🔍  Live search with debounce + multi-filter (course, priority, status, sort)",
    "💾  localStorage persistence — data survives page refresh",
    "🎨  Theme switcher: Dark / Light / Midnight + 4 accent colors",
    "📤  Export to CSV and JSON; Import from JSON",
    "♿  Full accessibility: ARIA labels, keyboard navigation, focus management",
]
for f in features:
    p = doc.add_paragraph(style="List Bullet")
    r = p.add_run(f)
    set_font(r, size=10.5)

doc.add_paragraph()

heading(doc, "Technology Stack", level=2)
tech_rows = [
    ("HTML5",       "Semantic structure: header, nav, main, section, article, aside, form"),
    ("CSS3",        "Custom properties, Grid, Flexbox, 4 media-query breakpoints"),
    ("JavaScript",  "Vanilla ES6+: CRUD, DOM events, localStorage, form validation"),
    ("Storage",     "localStorage (client-side) — no backend required for Assignment 1"),
    ("Hosting",     "GitHub Pages (static site, free)"),
]
t = doc.add_table(rows=1, cols=2)
t.style = "Table Grid"
hdr = t.rows[0].cells
hdr[0].paragraphs[0].add_run("Technology").font.bold = True
hdr[1].paragraphs[0].add_run("Usage").font.bold = True
for tech, desc in tech_rows:
    row = t.add_row().cells
    row[0].paragraphs[0].add_run(tech).font.bold = True
    row[1].paragraphs[0].add_run(desc)

doc.add_paragraph()

heading(doc, "GitHub & Live Links", level=2)
link_info = [
    ("GitHub Repository",
     "https://github.com/abdullah6093/Assignment-Deadline-Planner-"),
    ("Live Demo (GitHub Pages)",
     "https://abdullah6093.github.io/Assignment-Deadline-Planner-/"),
]
for label, url in link_info:
    p = doc.add_paragraph(style="List Bullet")
    r1 = p.add_run(f"{label}: ")
    set_font(r1, size=11, bold=True, color=(80, 60, 160))
    r2 = p.add_run(url)
    set_font(r2, size=11, color=(0, 80, 180))

page_break(doc)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 3 – SCREENSHOT 1: DASHBOARD
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

heading(doc, "2. Application Screenshots", level=1)
add_hr(doc)

heading(doc, "2.1  Dashboard View", level=2)
para(doc, (
    "The main dashboard shows 4 summary stat cards (Total Tasks, Due Soon, Completed, Conflicts), "
    "a sidebar with course filters and priority/status dropdowns, and a responsive grid of task cards. "
    "Each card displays the course badge, priority badge, assignment title, due date, status chip, "
    "countdown timer, progress bar, and action buttons."
), size=10.5, italic=True, color=(80,80,80))
doc.add_paragraph()
add_image(doc, IMGS["dashboard"], width=Inches(6.2),
          caption_text="Figure 1: Dashboard – Task card grid with sidebar filters and stat summary")

page_break(doc)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 4 – SCREENSHOT 2: ADD TASK FORM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

heading(doc, "2.2  Add New Assignment Form", level=2)
para(doc, (
    "The Add Task form includes all required fields: Course Name, Assignment Title, Due Date & Time, "
    "Priority (High/Medium/Low), a live progress slider (0–100%), Status, Recurring frequency, and Notes. "
    "Custom JavaScript validation prevents empty fields, past dates on new entries, and auto-syncs "
    "the Status field when progress reaches 100%. Required fields are marked with a red asterisk (*)."
), size=10.5, italic=True, color=(80,80,80))
doc.add_paragraph()
add_image(doc, IMGS["add_task"], width=Inches(6.2),
          caption_text="Figure 2: Add Assignment Form with 2-column grid layout, range slider, and action buttons")

page_break(doc)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 5 – SCREENSHOT 3: CALENDAR
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

heading(doc, "2.3  Calendar View", level=2)
para(doc, (
    "The interactive calendar renders all assignment due dates visually on a monthly grid. "
    "Today's date is highlighted. Colored dots appear under each date (🔴 red = High, 🟡 yellow = Medium, "
    "🟢 green = Low priority). Clicking a day opens the Day Detail panel below showing all assignments "
    "due on that date with course, priority, and status information. Month navigation buttons allow "
    "browsing past and future months."
), size=10.5, italic=True, color=(80,80,80))
doc.add_paragraph()
add_image(doc, IMGS["calendar"], width=Inches(6.2),
          caption_text="Figure 3: Calendar View – October 2026 with color-coded deadline dots and Day Detail panel")

page_break(doc)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 6 – SCREENSHOT 4: TASK MODAL
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

heading(doc, "2.4  Task Detail Modal", level=2)
para(doc, (
    "Clicking 'View' on any task card opens a full-detail modal dialog. The modal shows the course badge, "
    "assignment title, due date/time, priority, recurring status, current state, progress bar, notes, "
    "and a live countdown chip (e.g., '2d left'). Footer buttons allow Edit, Mark Complete (toggle), "
    "or Delete with a confirmation dialog. The modal is fully keyboard accessible (Escape to close, "
    "Tab to navigate buttons) and uses ARIA roles."
), size=10.5, italic=True, color=(80,80,80))
doc.add_paragraph()
add_image(doc, IMGS["modal"], width=Inches(5.5),
          caption_text="Figure 4: Task Detail Modal – showing assignment info, progress bar, countdown, and action buttons")

page_break(doc)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 7 – SCREENSHOT 5: SETTINGS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

heading(doc, "2.5  Settings & Preferences", level=2)
para(doc, (
    "The Settings page allows the user to customize the app experience. Appearance settings include "
    "theme (Dark / Light / Midnight Blue) and accent color (Violet / Cyan / Rose / Amber). "
    "Reminder settings let users set the warning threshold (days before deadline), and toggle "
    "overload alerts and conflict detection on or off. The Data card shows how many tasks are stored "
    "and storage usage, with Import/Export/Clear options. All settings are saved to localStorage instantly."
), size=10.5, italic=True, color=(80,80,80))
doc.add_paragraph()
add_image(doc, IMGS["settings"], width=Inches(6.2),
          caption_text="Figure 5: Settings Page – Appearance, Reminders, Data management, and About sections")

page_break(doc)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 8 – DESIGN NOTES & WDLC
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

heading(doc, "3. Design Notes & WDLC Stages", level=1)
add_hr(doc)

heading(doc, "3.1  User & Problem", level=2)
para(doc, (
    "Target User: University student enrolled in 4–6 courses simultaneously.\n"
    "Core Problem: Overlapping assignment deadlines across multiple courses lead to missed submissions, "
    "last-minute panic, and poor time allocation.\n"
    "Solution: A single-page planner with visual priority, progress tracking, and automatic conflict detection."
), size=11)

doc.add_paragraph()
heading(doc, "3.2  WDLC Stages", level=2)
wdlc = [
    ("Planning",    "Defined user persona, core use cases, data model, and feature list."),
    ("Analysis",    "Identified: CRUD operations, filtering, calendar view, conflict detection needed."),
    ("Design",      "Wireframed all 4 views; chose dark glassmorphism theme; defined CSS custom property token system."),
    ("Development", "Built HTML structure → CSS design system → JavaScript data layer → app logic."),
    ("Testing",     "Tested on Chrome, Firefox; tested empty state, invalid inputs, past-date validation, edge cases."),
    ("Deployment",  "Pushed to GitHub; enabled GitHub Pages for static hosting at the live URL above."),
]
t = doc.add_table(rows=1, cols=2)
t.style = "Table Grid"
t.rows[0].cells[0].paragraphs[0].add_run("Stage").font.bold = True
t.rows[0].cells[1].paragraphs[0].add_run("Activity").font.bold = True
for stage, activity in wdlc:
    row = t.add_row().cells
    row[0].paragraphs[0].add_run(stage).font.bold = True
    row[1].paragraphs[0].add_run(activity)

doc.add_paragraph()
heading(doc, "3.3  Client vs Server", level=2)
cv_rows = [
    ("UI Rendering",         "Client",  "HTML + CSS"),
    ("User Interactions",    "Client",  "Vanilla JavaScript"),
    ("Form Validation",      "Client",  "JS + HTML5 required/minlength/type"),
    ("Data Storage (A1)",    "Client",  "localStorage"),
    ("Conflict Detection",   "Client",  "JS algorithm"),
    ("Theme/Settings",       "Client",  "localStorage"),
    ("REST Persistence (A2)","Server",  "Future: fetch() + JSON API"),
    ("Authentication (A3)",  "Server",  "Future: JWT / sessions"),
]
t2 = doc.add_table(rows=1, cols=3)
t2.style = "Table Grid"
for txt, cell in zip(["Concern", "Location", "Technology"], t2.rows[0].cells):
    cell.paragraphs[0].add_run(txt).font.bold = True
for concern, loc, tech in cv_rows:
    row = t2.add_row().cells
    row[0].paragraphs[0].add_run(concern)
    r = row[1].paragraphs[0].add_run(loc)
    r.font.bold = True
    r.font.color.rgb = RGBColor(80, 60, 160) if loc == "Client" else RGBColor(180, 60, 60)
    row[2].paragraphs[0].add_run(tech)

page_break(doc)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PAGE 9 – SAMPLE DATA & RUBRIC
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

heading(doc, "4. Sample Data Records (8 pre-loaded)", level=1)
add_hr(doc)

samples = [
    ("1", "CS 301",  "Linked List Implementation & Analysis Report", "High",   "In Progress", "45%"),
    ("2", "MTH 201", "Integration Techniques Problem Set",           "Medium", "In Progress", "70%"),
    ("3", "ENG 110", "Argumentative Essay – Climate Policy",         "High",   "In Progress", "90%"),
    ("4", "PHY 205", "Lab Report #4 – Projectile Motion",           "Low",    "In Progress", "20%"),
    ("5", "CS 301",  "Binary Search Tree – Coding Assignment",       "High",   "Not Started", "10%"),
    ("6", "HIS 150", "Reading Summary – Chapter 12 & 13",           "Low",    "Completed",   "100%"),
    ("7", "MTH 201", "Midterm Exam Preparation Quiz",               "Medium", "In Progress", "55%"),
    ("8", "ENG 110", "Peer Review – Classmate Draft",               "Medium", "Not Started", "0%"),
]
t3 = doc.add_table(rows=1, cols=6)
t3.style = "Table Grid"
for txt, cell in zip(["#","Course","Assignment Title","Priority","Status","Progress"], t3.rows[0].cells):
    r = cell.paragraphs[0].add_run(txt)
    r.font.bold = True
    cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
for row_data in samples:
    row = t3.add_row().cells
    for i, val in enumerate(row_data):
        row[i].paragraphs[0].add_run(val)
        row[i].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph()
heading(doc, "5. Marking Rubric Coverage", level=1)
add_hr(doc)

rubric = [
    ("Working application & interactions",       "10", "CRUD, filter/sort/search, conflict detection, calendar, modal, progress tracking"),
    ("Semantic HTML, forms & accessibility",     "5",  "header/nav/main/section/article/aside, labels, aria-*, role=*, skip link"),
    ("CSS layout & responsive behavior",          "7",  "Grid + Flexbox, 4 breakpoints (1024px/768px/480px), CSS custom properties"),
    ("JavaScript logic, DOM events & edge cases","5",  "Arrays/functions/conditionals, debounce, event delegation, empty state, XSS prevention"),
    ("GitHub, README, attribution & walkthrough", "3",  "README with setup, WDLC, client vs server, AI disclosure, live URL"),
]
t4 = doc.add_table(rows=1, cols=3)
t4.style = "Table Grid"
for txt, cell in zip(["Criterion","Marks","Evidence in Project"], t4.rows[0].cells):
    r = cell.paragraphs[0].add_run(txt)
    r.font.bold = True
for crit, marks, evidence in rubric:
    row = t4.add_row().cells
    row[0].paragraphs[0].add_run(crit)
    r = row[1].paragraphs[0].add_run(marks + "/30")
    r.font.bold = True
    r.font.color.rgb = RGBColor(80, 60, 160)
    row[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    row[2].paragraphs[0].add_run(evidence)

doc.add_paragraph()

# AI Disclosure
heading(doc, "6. AI Assistance Disclosure", level=1)
add_hr(doc)
para(doc, (
    "This project was developed with AI coding assistance (Google Antigravity / Claude). "
    "AI assistance was used for: boilerplate HTML structure suggestions, CSS design token layout patterns, "
    "and JavaScript utility function patterns. All code was personally reviewed, understood, and adapted. "
    "No full-site templates or framework code were used. All sample records are original student-created data."
), size=11)

doc.add_paragraph()
p_end = doc.add_paragraph()
p_end.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_end = p_end.add_run("— End of Document —")
set_font(r_end, size=10, italic=True, color=(150, 150, 150))

# ── Save ────────────────────────────────────────────────────────────────────
doc.save(OUT)
print(f"✅ Document saved: {OUT}")
