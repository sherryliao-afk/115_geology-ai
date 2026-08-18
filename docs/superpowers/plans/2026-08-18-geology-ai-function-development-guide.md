# Geology AI Function Development Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a GitHub-readable development guide that uses v15 prototype screenshots, exhaustive role/button behavior, RBAC, business/data flow, and the 2026-08-18 named engineer allocation.

**Architecture:** Use Chrome-observed prototype behavior as UI evidence, the latest workbook as planned-scope and ownership evidence, and user-confirmed decisions as the highest-priority authority. Store a compact evidence ledger, generate SVG/PNG diagrams from one script, and write one canonical Markdown guide with relative asset links.

**Tech Stack:** Chrome plugin, JSON evidence ledger, Markdown, SVG, bundled Node.js, `sharp` for SVG-to-PNG rendering, PowerShell verification.

## Global Constraints

- Do not describe HTML fake data as implemented backend behavior.
- Do not include API, physical database, framework, deployment, or AI-training technical specifications.
- AI training only explains its business input/output and owner `忠晏`.
- Inventory every data-changing, download, upload, export, submit, confirmation, and workflow button for every role.
- Pure navigation controls may be grouped when their behavior is identical.
- Final roles are `地礦中心承辦`, `空拍廠商`, `地方政府人員`, and `系統管理員`.
- System administrators cannot see or operate business modules.
- Center officers have nationwide business scope and full user-management permissions, but no system-log permission.
- Prefer user-confirmed rules, then the 2026-08-18 workbook, then v15 prototype behavior.
- Label prototype/planned differences explicitly.

---

### Task 1: Capture Four-Role Chrome Evidence

**Files:**
- Create: `documents/development/_build/button-inventory.json`
- Create: `documents/development/assets/screenshots/09-vendor-suggested-points.png`
- Create: `documents/development/assets/screenshots/10-center-investigation-case.png`
- Create: `documents/development/assets/screenshots/11-center-reminder-management.png`
- Create: `documents/development/assets/screenshots/12-local-government-survey-form.png`
- Create: `documents/development/assets/screenshots/13-local-government-violation-followup.png`
- Create: `documents/development/assets/screenshots/14-vendor-report-upload.png`

**Interfaces:**
- Consumes: v15 prototype in Chrome and user-confirmed RBAC rules.
- Produces: a JSON array of `role`, `dataScope`, `module`, `screen`, `control`, `controlType`, `visibleState`, `businessEffect`, `prototypeEvidence`, and `plannedDifference` records.

- [ ] **Step 1: Connect to the requested Chrome browser**

Initialize the Chrome browser binding through the Chrome plugin and read its complete browser documentation before any navigation.

- [ ] **Step 2: Open the v15 prototype**

Use the published v15 page if already available in Chrome; otherwise open the local `地礦AI_雛型_v15_0805_feedback.html` in Chrome. Confirm the login role shortcuts are visible.

- [ ] **Step 3: Walk the center-officer role**

Visit every visible module, open lists, details, drawers, tabs, and dialogs, and record every significant control. Capture investigation and reminder screenshots as files 10 and 11.

- [ ] **Step 4: Walk the aerial-vendor role**

Visit every visible module and record all controls, especially point creation, map drawing, KML upload, report upload, download, and navigation-to-map behavior. Capture files 09 and 14.

- [ ] **Step 5: Walk the local-government role**

Visit every visible module and record county-scoped controls, survey submission/editing, attachment upload, violation-result viewing, statistics export, and GIS querying. Capture files 12 and 13.

- [ ] **Step 6: Walk the administrator role**

Record the prototype's current controls in user management and system log. Mark every business module shown by v15 as a formal-plan difference because the confirmed production design removes those modules.

- [ ] **Step 7: Write and validate the evidence ledger**

Write `button-inventory.json` in UTF-8. Verify each of the four roles exists, every record has all required fields, and screenshots 09 through 14 are non-empty PNG files.

- [ ] **Step 8: Commit the Chrome evidence**

```powershell
git add -- documents/development/_build/button-inventory.json documents/development/assets/screenshots
git commit -m "Capture geology AI role and button evidence"
```

### Task 2: Generate RBAC and Business-Flow Diagrams

**Files:**
- Create: `scripts/build_development_guide_diagrams.mjs`
- Create: `documents/development/assets/diagrams/rbac-role-module-matrix.svg`
- Create: `documents/development/assets/diagrams/rbac-role-module-matrix.png`
- Create: `documents/development/assets/diagrams/monitoring-business-data-flow.svg`
- Create: `documents/development/assets/diagrams/monitoring-business-data-flow.png`

**Interfaces:**
- Consumes: confirmed RBAC rules, workbook ownership, and Task 1 evidence.
- Produces: two matching SVG/PNG pairs at 2x PNG density.

- [ ] **Step 1: Build the diagram generator**

Create one deterministic Node script that generates a role/module matrix and the lifecycle flow. Use a Chinese-capable sans-serif font stack, the v15 green as the primary accent, text labels in addition to color, and SVG `viewBox` dimensions sized for GitHub reading.

- [ ] **Step 2: Render SVG and PNG**

Run with the bundled Node.js runtime. Import `sharp` from the bundled dependency directory and render each SVG to PNG at twice its logical width.

- [ ] **Step 3: Verify diagram content**

Check the RBAC diagram contains all four roles and all ten module/submodule rows. Check the business-flow diagram contains every lifecycle stage and the four owner names `忠晏`, `守陽`, `金億`, and `育萱`.

- [ ] **Step 4: Visually inspect both PNG files**

Open both PNGs at original detail and repair clipped, overlapping, or unreadable labels.

- [ ] **Step 5: Commit the diagrams**

```powershell
git add -- scripts/build_development_guide_diagrams.mjs documents/development/assets/diagrams
git commit -m "Add geology AI RBAC and workflow diagrams"
```

### Task 3: Write the GitHub Development Guide

**Files:**
- Create: `documents/development/地礦AI_功能模組與開發分工說明.md`

**Interfaces:**
- Consumes: workbook facts, screenshots 01 through 14, Task 1 ledger, and Task 2 diagrams.
- Produces: the canonical engineer-facing Markdown guide.

- [ ] **Step 1: Write the purpose, evidence, and terminology sections**

State that screenshots are v15 prototype evidence, the workbook is planned scope, and user-confirmed decisions override both when conflicts exist.

- [ ] **Step 2: Write role and RBAC sections**

Embed the RBAC PNG and include readable Markdown tables for module visibility, data scope, and per-module actions.

- [ ] **Step 3: Write the business and data-flow section**

Embed the lifecycle PNG. Explain each transition in business terms: producer, input, output, recipient, and owner.

- [ ] **Step 4: Write every module chapter**

For AI training, login/registration, home, map, monitoring position management, interpretation/survey, reminders, violation follow-up, statistics, user management, and system log, include owner, roles, purpose, screenshot, button table, operation flow, input, output, and dependency.

- [ ] **Step 5: Write engineer allocation and dependency sections**

List exact workbook ownership and explain the handoffs: `忠晏 → 育萱`, `育萱 ↔ 金億`, `育萱／金億 → 守陽`, and `守陽` cross-cutting identity/home/statistics responsibilities.

- [ ] **Step 6: Write the prototype/planned-difference section**

Document administrator separation, center-officer user management, desired aerial-point creation, and violation follow-up read-only behavior.

- [ ] **Step 7: Commit the Markdown guide**

```powershell
git add -- documents/development/地礦AI_功能模組與開發分工說明.md
git commit -m "Document geology AI feature development plan"
```

### Task 4: Validate the Complete Deliverable

**Files:**
- Modify: `documents/development/地礦AI_功能模組與開發分工說明.md` only if validation finds a defect.
- Modify: diagram or screenshot assets only if visual inspection finds a defect.

**Interfaces:**
- Consumes: Tasks 1 through 3.
- Produces: a verified GitHub-readable package with no missing assets or unsupported claims.

- [ ] **Step 1: Validate relative image links**

Parse every Markdown image target and confirm the referenced file exists under `documents/development`.

- [ ] **Step 2: Validate content coverage**

Search for all four roles, all four engineer names, every module, `RBAC`, `資料流`, `雛型現況`, and `正式規劃`. Confirm each module section contains a button table.

- [ ] **Step 3: Validate exclusions**

Confirm there are no endpoint paths, Request／Response samples, physical table definitions, or AI-model technical explanations.

- [ ] **Step 4: Inspect final images**

Open screenshots and diagrams at original detail. Confirm there is no Chrome personal data, clipped content, or unreadable Chinese text.

- [ ] **Step 5: Run repository checks**

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; only unrelated pre-existing user files may remain untracked or modified.

- [ ] **Step 6: Commit validation repairs**

If repairs were necessary, commit only the repaired deliverable files:

```powershell
git add -- documents/development scripts/build_development_guide_diagrams.mjs
git commit -m "Polish geology AI development guide"
```
