# Role Swimlane Business Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the engineer-tagged business data-flow diagram with a simple four-role swimlane diagram and align the development guide with the approved 14-day reminder logic.

**Architecture:** Keep the existing SVG generator and output filenames so GitHub links do not change. Replace only `buildFlowSvg()` with a white-background swimlane layout; keep the RBAC diagram unchanged. Update the Markdown flow section to describe the same roles, decisions, and handoffs shown in the image.

**Tech Stack:** Node.js SVG generation, local Chrome headless SVG-to-PNG rendering, GitHub Markdown.

## Global Constraints

- Use four lanes: 地礦中心承辦、空拍廠商、地方政府人員、系統自動作業.
- Use a white background, thin lines, one geology-green primary color, and direct labels.
- Do not show engineer tags or engineer names in the business-flow diagram.
- Automatically send reminder email and system notification only when the survey is over 14 days late and no official explanatory document exists.
- Preserve the existing diagram filenames and all unrelated workspace files.

---

### Task 1: Replace the business-flow SVG layout

**Files:**
- Modify: `scripts/build_development_guide_diagrams.mjs`
- Regenerate: `documents/development/assets/diagrams/monitoring-business-data-flow.svg`
- Regenerate: `documents/development/assets/diagrams/monitoring-business-data-flow.png`

**Interfaces:**
- Consumes: the approved roles and condition branches recorded in the design spec.
- Produces: `buildFlowSvg(): string`, an SVG with four labeled lanes and no engineer tags.

- [ ] **Step 1: Replace the flow-node composition**

Implement four horizontal lanes and direct labeled steps for shared point selection, center notification, vendor uploads, local-government reporting, the 14-day/no-document decision, automated reminders, violation follow-up, and center closure.

- [ ] **Step 2: Regenerate the SVG**

Run:

```powershell
& 'C:\Users\sherryliao\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'scripts\build_development_guide_diagrams.mjs'
```

Expected: `monitoring-business-data-flow.svg` is regenerated without changing the RBAC content.

- [ ] **Step 3: Render PNG with local Chrome**

Render the SVG at its declared width and height using Chrome headless mode.

Expected: `monitoring-business-data-flow.png` is a valid PNG with the same semantic content as the SVG.

- [ ] **Step 4: Inspect the PNG**

Check the full-size image for clipping, overlapping labels, excessive decoration, engineer names, and unclear arrows. Revise and rerender until all labels remain readable.

### Task 2: Align the Markdown flow explanation

**Files:**
- Modify: `documents/development/地礦AI_功能模組與開發分工說明.md`

**Interfaces:**
- Consumes: the final swimlane roles and branches from Task 1.
- Produces: a role-based flow section whose wording matches the diagram.

- [ ] **Step 1: Replace the stage table**

Use columns for stage, operating role, function/action, next result, and condition. Keep engineer allocation only in the separate development-allocation chapter.

- [ ] **Step 2: Add the exact reminder condition**

State that an official explanatory document prevents automatic reminders, while no document plus more than 14 days triggers both reminder email and system notification to local-government personnel.

- [ ] **Step 3: Add violation and closure behavior**

State that cases requiring follow-up enter the violation-follow-up table visible to the center and local government, and that the center closes cases according to the case situation.

### Task 3: Verify and commit

**Files:**
- Verify: `scripts/build_development_guide_diagrams.mjs`
- Verify: `documents/development/地礦AI_功能模組與開發分工說明.md`
- Verify: `documents/development/assets/diagrams/monitoring-business-data-flow.svg`
- Verify: `documents/development/assets/diagrams/monitoring-business-data-flow.png`

**Interfaces:**
- Consumes: Tasks 1 and 2 outputs.
- Produces: a clean commit containing only the approved flow revision.

- [ ] **Step 1: Validate required text and image links**

Confirm the Markdown contains all four lanes, `14 天`, `公文`, `稽催信`, `系統通知`, `違規行為後續處理`, and `結案`, and that all embedded image paths exist.

- [ ] **Step 2: Validate the generated assets**

Confirm the PNG signature and dimensions, confirm the SVG has no `ownerTag(` output inside `buildFlowSvg()`, and visually inspect the PNG.

- [ ] **Step 3: Run repository checks**

Run `git diff --check` and `node --test tests/statistics-dashboard-v15.test.js`.

Expected: no diff warnings and one passing test file with zero failures.

- [ ] **Step 4: Commit**

```powershell
git add -- scripts/build_development_guide_diagrams.mjs documents/development/地礦AI_功能模組與開發分工說明.md documents/development/assets/diagrams/monitoring-business-data-flow.svg documents/development/assets/diagrams/monitoring-business-data-flow.png
git commit -m "Clarify role-based monitoring business flow"
```
