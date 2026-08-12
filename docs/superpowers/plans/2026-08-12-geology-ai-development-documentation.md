# Geology AI Development Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a visual, engineer-facing development handoff package containing a Markdown guide, rendered Word document, editable PowerPoint deck, and standalone conceptual API HTML based on the two source workbooks and the v15 HTML prototype.

**Architecture:** Treat the HTML prototype as UI and workflow evidence only. Normalize facts from the workbooks and Chrome walkthrough into one evidence ledger, then generate four consistent artifacts from the same role, module, entity, API, responsibility, and provenance model. Keep the logical architecture and ERD technology-neutral while showing a real frontend, backend API, business database, file storage, GeoServer, and AI-result integration boundary.

**Tech Stack:** Chrome browser walkthrough; `@oai/artifact-tool` for spreadsheet inspection and editable PPTX generation; Markdown and Mermaid; Python `python-docx` plus the bundled DOCX renderer; standalone HTML/CSS/JavaScript; PowerShell verification commands.

## Global Constraints

- The primary evidence is `地礦舊系統介面欄位盤點.xlsx`, `115 地礦AI_系統工項規畫 (2).xlsx`, and `地礦AI_雛型_v15_0805_feedback.html`.
- The v15 prototype contains HTML/JavaScript fake data; never describe it as an implemented backend, database, or API.
- The ERD is a logical/conceptual ERD only; do not define physical tables, database-specific data types, indexes, migration scripts, or restored legacy schemas.
- The API HTML is a proposed frontend/backend contract; proposed route names must be marked `概念設計` and not presented as existing endpoints.
- Do not select a .NET version, database engine, frontend framework, authentication product, or GeoServer deployment topology.
- The three formal roles are `地礦中心承辦`, `地方政府人員`, and `系統管理員`.
- Preserve the prototype's `空拍廠商` as an external collaboration role and label its formal inclusion as `待工程確認`.
- Engineer ownership follows the source workbook's fill colors: blue groups become Engineer A, green groups become Engineer B, yellow groups become Engineer C, and the pink AI-training row retains its named owner.
- Each screenshot must state the role, operation purpose, frontend behavior, backend responsibility, conceptual entities, and candidate API domain.
- Deliver only the four requested final artifacts and their GitHub-relative screenshot assets; keep render previews and QA logs outside the deliverable folder.

---

### Task 1: Complete the Three-Role Chrome Evidence Walkthrough

**Files:**
- Create: `documents/development/assets/screenshots/09-center-suggested-points.png`
- Create: `documents/development/assets/screenshots/10-center-investigation-case.png`
- Create: `documents/development/assets/screenshots/11-center-reminder-management.png`
- Create: `documents/development/assets/screenshots/12-local-government-survey-form.png`
- Create: `documents/development/assets/screenshots/13-local-government-violation-followup.png`
- Create: `documents/development/assets/screenshots/14-admin-role-scope-edit.png`
- Create: `documents/development/_build/chrome-flow-evidence.json`

**Interfaces:**
- Consumes: published v15 prototype at `https://sherryliao-afk.github.io/115_geology-ai/`.
- Produces: `chrome-flow-evidence.json` with `role`, `page`, `visibleModules`, `actions`, `dataScope`, `screenshot`, and `sourceStatus` fields for Tasks 2 through 6.

- [ ] **Step 1: Walk through the center officer role**

  Use Chrome to log in through `B 地礦中心承辦`, then inspect Home, Suggested Monitoring Points, Monitoring Area Selection, Interpretation/Survey Results, Reminder Management, Violation Follow-up, Map, Statistics, and User Management. Record only visible behavior and label all row values as prototype examples.

- [ ] **Step 2: Walk through the local government role**

  Reload the prototype, log in through `D 高雄市政府`, inspect the visible navigation, open an investigation case, inspect the survey-report fields and violation follow-up page, and confirm that the visible records are restricted to the prototype's Kaohsiung scope.

- [ ] **Step 3: Walk through the administrator role**

  Reload the prototype, log in through `A 系統管理員`, inspect User Management, role and county-scope editing, System Log, and any business pages visible to the administrator. Record the distinction between system administration and business operation.

- [ ] **Step 4: Capture the additional role screenshots**

  Save viewport screenshots with the exact filenames in the Files section. Ensure no browser chrome, temporary dialogs, or local absolute paths appear inside the images.

- [ ] **Step 5: Write the Chrome evidence ledger**

  Write UTF-8 JSON in this shape:

  ```json
  {
    "prototypeVersion": "v15_0805_feedback",
    "dataNotice": "畫面資料為 HTML 雛型假資料",
    "flows": [
      {
        "role": "地礦中心承辦",
        "page": "監測區位選定",
        "visibleModules": ["監測位置管理"],
        "actions": ["選定監測範圍", "確認拍攝"],
        "dataScope": "當年度全台（雛型顯示）",
        "screenshot": "assets/screenshots/03-center-monitoring.png",
        "sourceStatus": "已確認：v15 雛型可觀察行為"
      }
    ]
  }
  ```

- [ ] **Step 6: Verify evidence completeness**

  Run:

  ```powershell
  Get-ChildItem 'documents/development/assets/screenshots' -Filter '*.png' |
    Select-Object Name,Length
  Get-Content 'documents/development/_build/chrome-flow-evidence.json' -Raw |
    ConvertFrom-Json | Select-Object prototypeVersion,dataNotice
  ```

  Expected: all 14 screenshots are non-empty and the JSON reports `v15_0805_feedback` plus the fake-data notice.

- [ ] **Step 7: Commit the Chrome evidence**

  ```powershell
  git add -- documents/development/assets/screenshots documents/development/_build/chrome-flow-evidence.json
  git commit -m "Capture geology AI role workflow evidence"
  ```

### Task 2: Build the Normalized Source and Conceptual Model Ledger

**Files:**
- Create: `documents/development/_build/development-document-data.json`
- Create: `documents/development/_build/validate-development-data.mjs`

**Interfaces:**
- Consumes: both source workbooks, `chrome-flow-evidence.json`, v15 prototype source, and the approved design spec.
- Produces: normalized `roles`, `modules`, `flows`, `legacyFields`, `entities`, `relationships`, `apiDomains`, `engineerAssignments`, `screenshots`, and `openDecisions` arrays used by all final artifacts.

- [ ] **Step 1: Normalize the three formal roles and external role**

  Store each role with `name`, `classification`, `dataScope`, `visibleModules`, `allowedActions`, `restrictions`, and `evidence` fields. Set `classification` to `正式角色` for the three user-specified roles and `外部協作角色／待工程確認` for `空拍廠商`.

- [ ] **Step 2: Normalize modules and ownership**

  Map workbook fill groups without reassigning rows:

  ```json
  {
    "engineerAssignments": [
      {"engineer":"工程師 A","sourceColors":["C9DAF8","CFE2F3"],"scope":["登入／註冊","首頁","系統管理"]},
      {"engineer":"工程師 B","sourceColors":["D9EAD3"],"scope":["盜濫採影像圖台","稽催管理","統計分析儀錶板"]},
      {"engineer":"工程師 C","sourceColors":["FFF2CC"],"scope":["監測位置管理","判釋變異點結果及查勘回報","違規行為後續處理"]},
      {"engineer":"忠晏","sourceColors":["EAD1DC"],"scope":["AI 訓練"]}
    ]
  }
  ```

- [ ] **Step 3: Normalize legacy fields**

  Retain workbook wording for field labels and examples. Add `sourceSheet`, `screenSection`, `uiControl`, `exampleValue`, `conceptualEntity`, and `confidence` without inventing physical data types.

- [ ] **Step 4: Define the logical entities and relationships**

  Include User, Role, Allowed County, Project, Suggested Monitoring Point, Monitoring Area, Monitoring Point, Cadastral Location, Imagery Period, Image Asset, Interpretation Result, Geo Layer Reference, Investigation Case, Survey Notification, Survey Report, Field Photo, Violation Type, Reminder Case, Reminder Record, Reminder Setting, Violation Follow-up, Transfer Record, Attachment, and Audit Log. Use business cardinalities only.

- [ ] **Step 5: Define conceptual API domains**

  For each domain store `conceptualBasePath`, `purpose`, `roles`, `operations`, `requestFields`, `responseFields`, `relatedEntities`, and `evidence`. Prefix all paths with `/api/v1` and set `contractStatus` to `概念設計／待工程確認`.

- [ ] **Step 6: Write a deterministic validator**

  The validator must fail when a formal role is missing, a screenshot path is absent, an entity relationship references an unknown entity, an API lacks `contractStatus`, or a workbook-derived field lacks `sourceSheet`.

  ```js
  import fs from "node:fs";
  const data = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const requiredRoles = ["地礦中心承辦", "地方政府人員", "系統管理員"];
  for (const role of requiredRoles) {
    if (!data.roles.some((item) => item.name === role && item.classification === "正式角色")) {
      throw new Error(`Missing formal role: ${role}`);
    }
  }
  for (const api of data.apiDomains) {
    if (api.contractStatus !== "概念設計／待工程確認") {
      throw new Error(`Invalid API status: ${api.conceptualBasePath}`);
    }
  }
  console.log("Development document data OK");
  ```

- [ ] **Step 7: Run the validator**

  Run:

  ```powershell
  node documents/development/_build/validate-development-data.mjs documents/development/_build/development-document-data.json
  ```

  Expected: `Development document data OK`.

- [ ] **Step 8: Commit the normalized model**

  ```powershell
  git add -- documents/development/_build/development-document-data.json documents/development/_build/validate-development-data.mjs
  git commit -m "Define geology AI documentation model"
  ```

### Task 3: Create the GitHub Markdown Development Guide

**Files:**
- Create: `documents/development/地礦AI_系統開發說明_v1.md`

**Interfaces:**
- Consumes: `development-document-data.json` and screenshots from Task 1.
- Produces: the canonical narrative and terminology source for the Word document and slide deck.

- [ ] **Step 1: Write the evidence and architecture sections**

  Include system purpose, source hierarchy, fake-data notice, logical architecture, system boundaries, and a technology-selection checklist. Use a Mermaid flowchart showing Frontend, Backend API, Business Database, File Storage, GeoServer, and AI Result Source.

- [ ] **Step 2: Write the visual role walkthroughs**

  For each formal role, insert two or more relative screenshot links. Under every image add a six-field explanation: `角色`, `畫面`, `操作目的`, `前端責任`, `後端／GeoServer 責任`, and `關聯概念實體／API`.

- [ ] **Step 3: Write the role and module matrices**

  Include role visibility, data scope, read/write behavior, external-role note, module ownership, and cross-engineer dependencies.

- [ ] **Step 4: Write the conceptual ERD**

  Use Mermaid `erDiagram` with the entities from Task 2. Add a note stating that names and cardinalities are logical design and must be reconciled with the actual legacy schema by engineering.

- [ ] **Step 5: Write field, flow, GeoServer, and API summaries**

  Include the old-interface field mapping by business domain, the main monitoring-to-investigation lifecycle, GIS layer responsibilities, attachment categories, and a concise API-domain table linking to the standalone HTML document.

- [ ] **Step 6: Write engineering handoff and acceptance sections**

  Include Engineer A/B/C scope, dependency order, open technical decisions, frontend/backend/GIS acceptance checks, and explicit out-of-scope items.

- [ ] **Step 7: Validate Markdown structure**

  Run:

  ```powershell
  rg -n "HTML 雛型假資料|概念 ERD|概念設計／待工程確認|GeoServer|工程師 A|工程師 B|工程師 C" documents/development/地礦AI_系統開發說明_v1.md
  rg -n "C:\\|file:///|localhost|127\.0\.0\.1" documents/development/地礦AI_系統開發說明_v1.md
  ```

  Expected: the first scan finds all required concepts; the second scan returns no matches.

- [ ] **Step 8: Commit the Markdown guide**

  ```powershell
  git add -- documents/development/地礦AI_系統開發說明_v1.md
  git commit -m "Add geology AI development guide"
  ```

### Task 4: Create the Standalone Conceptual API HTML

**Files:**
- Create: `documents/development/地礦AI_API概念文件_v1.html`
- Create: `documents/development/_build/validate-api-html.mjs`

**Interfaces:**
- Consumes: `development-document-data.json` and the terminology established in the Markdown guide.
- Produces: a browser-readable API handoff with stable section anchors that the Markdown and Word documents can reference.

- [ ] **Step 1: Build the standalone document shell**

  Create a single HTML file with embedded CSS and JavaScript, a sticky navigation rail, module filter, text search, role chips, evidence-status chips, responsive layout, print styles, and no external CDN dependencies.

- [ ] **Step 2: Add the non-implementation warning**

  Place this notice at the top of the page:

  ```text
  本文件為依舊系統欄位、工項規劃與 v15 HTML 雛型推導的概念 API 契約。端點名稱、驗證方式、資料型別與 GeoServer 介接方式均須由工程團隊確認；本文件不表示後端 API 已存在。
  ```

- [ ] **Step 3: Render API modules from embedded data**

  For each API domain show purpose, proposed method/path, formal-role access, query/request fields, example JSON response, related conceptual entities, evidence, and implementation questions. Use only fields present in the normalized ledger.

- [ ] **Step 4: Add cross-cutting contracts**

  Define conceptual pagination, filtering, sorting, validation-error, authorization-error, attachment metadata, audit metadata, and county data-scope behavior. Do not choose an authentication product or database type.

- [ ] **Step 5: Add GeoServer boundary documentation**

  Explain that the backend owns authorization and business references while GeoServer serves spatial layers/features. Describe conceptual WMS/WFS use, layer-reference identifiers, and frontend map consumption without specifying actual workspace, store, layer, or SLD names.

- [ ] **Step 6: Write an HTML validator**

  Validate presence of the non-implementation warning, all API domain anchors, all three formal-role labels, conceptual-status labels, and absence of local paths and remote scripts.

- [ ] **Step 7: Test in Chrome**

  Open the local HTML through Chrome, test search, module filtering, navigation anchors, code-block readability, and narrow/wide layouts. Capture internal QA screenshots outside `documents/development`.

- [ ] **Step 8: Commit the API document**

  ```powershell
  git add -- documents/development/地礦AI_API概念文件_v1.html documents/development/_build/validate-api-html.mjs
  git commit -m "Add conceptual geology AI API reference"
  ```

### Task 5: Create and Render the Word Development Document

**Files:**
- Create: `documents/development/_build/build-development-docx.py`
- Create: `documents/development/地礦AI_系統開發說明_v1.docx`

**Interfaces:**
- Consumes: `development-document-data.json`, the canonical Markdown content, and the selected screenshots.
- Produces: a visually polished Word version with the same terminology, conceptual ERD, role flows, module matrices, and evidence boundaries.

- [ ] **Step 1: Configure the document design system**

  Use the `compact_reference_guide` document preset and a restrained first-page title band. Apply explicit page geometry, heading styles, paragraph rhythm, real lists, table geometry, headers, footers, page numbers, and consistent evidence callouts.

- [ ] **Step 2: Build the title, reading guide, and architecture**

  Create a title page followed by a concise reading guide explaining `已確認`, `概念設計`, and `待工程確認`. Insert a native diagram or embedded vector showing the logical architecture.

- [ ] **Step 3: Add visual role walkthroughs**

  Insert the selected Chrome screenshots at readable widths with captions and the six-field explanation used in Markdown. Keep each screenshot, caption, and explanation together across page breaks.

- [ ] **Step 4: Add matrices, ERD, and handoff sections**

  Build deliberate tables for role permissions, module ownership, API domains, legacy-field mapping, and open decisions. Use a legible conceptual ERD diagram rather than a screenshot of Mermaid source.

- [ ] **Step 5: Build and structurally audit the DOCX**

  Run the bundled Python runtime to generate the DOCX, then audit headings, table geometry, images, and page sections. Expected: no fake bullets, no clipped fixed-height table rows, and all images have captions.

- [ ] **Step 6: Render every Word page**

  Run:

  ```powershell
  & $bundledPython $renderDocx documents/development/地礦AI_系統開發說明_v1.docx --output_dir $qaDocxDir --emit_pdf
  ```

  Expected: one `page-*.png` per page and a non-empty QA PDF.

- [ ] **Step 7: Inspect and repair**

  Inspect every page PNG at 100% zoom. Repair clipping, split captions, narrow tables, blank pages, missing glyphs, or weak image resolution, then rerender until clean.

- [ ] **Step 8: Commit the Word deliverable**

  ```powershell
  git add -- documents/development/_build/build-development-docx.py documents/development/地礦AI_系統開發說明_v1.docx
  git commit -m "Add geology AI Word development document"
  ```

### Task 6: Create and Render the Editable Engineer Presentation

**Files:**
- Create: `documents/development/_build/build-engineer-deck.mjs`
- Create: `documents/development/地礦AI_工程師說明簡報_v1.pptx`

**Interfaces:**
- Consumes: `development-document-data.json`, the canonical Markdown, and selected Chrome screenshots.
- Produces: an editable 12-to-15-slide engineering handoff deck.

- [ ] **Step 1: Write the slide plan and provenance ledger in the external presentation scratch workspace**

  Plan these slides: cover, evidence boundary, target logical architecture, formal-role matrix, center-officer flow, local-government flow, administrator flow, monitoring-to-investigation lifecycle, prototype-to-backend responsibility mapping, conceptual ERD, conceptual API domains, GeoServer boundary, Engineer A/B/C ownership, dependency sequence, and confirmation checklist.

- [ ] **Step 2: Create the deck with artifact-tool only**

  Use editable text, shapes, tables, connectors, and screenshots. Use the prototype's geology green as the dominant color, dark slate as the support tone, and one orange accent. Keep screenshot callouts as editable shapes rather than baking annotations into full-slide images.

- [ ] **Step 3: Add source/evidence labels**

  Every screenshot slide must include `v15 HTML 雛型／畫面資料為假資料`. Every ERD or API slide must include `概念設計／待工程確認`.

- [ ] **Step 4: Export and render all slides**

  Export with `PresentationFile.exportPptx(presentation)`, render every slide to PNG, and create a contact sheet in the external scratch workspace.

- [ ] **Step 5: Inspect and repair**

  Check full-size slide renders for overflow, clipped Chinese text, unreadable screenshots, misaligned connectors, inconsistent page markers, and source labels below 10 px. Repair and rerender until all slides pass.

- [ ] **Step 6: Verify PPTX structure**

  Confirm expected slide count, non-empty PPTX, intended font typefaces in the package, and editable native objects on architecture, ERD, assignment, and dependency slides.

- [ ] **Step 7: Commit the presentation**

  ```powershell
  git add -- documents/development/_build/build-engineer-deck.mjs documents/development/地礦AI_工程師說明簡報_v1.pptx
  git commit -m "Add geology AI engineer handoff deck"
  ```

### Task 7: Cross-Artifact Consistency and Final Delivery

**Files:**
- Create: `documents/development/_build/validate-deliverables.ps1`
- Modify: `documents/development/地礦AI_系統開發說明_v1.md`
- Modify: `documents/development/地礦AI_API概念文件_v1.html`
- Modify: `documents/development/地礦AI_系統開發說明_v1.docx`
- Modify: `documents/development/地礦AI_工程師說明簡報_v1.pptx`

**Interfaces:**
- Consumes: all four final artifacts and the normalized ledger.
- Produces: a final package with aligned terminology, evidence labels, role scope, conceptual entities, API domains, engineer ownership, and screenshot references.

- [ ] **Step 1: Validate required deliverables**

  Check that all four artifacts exist, are non-empty, and use the exact filenames in this plan.

- [ ] **Step 2: Run consistency scans**

  The PowerShell validator must verify that Markdown and HTML contain all formal roles, `GeoServer`, `概念 ERD`, fake-data warnings, Engineer A/B/C labels, and the external-role note. It must also fail on local absolute paths, `file:///`, `localhost`, or `127.0.0.1`.

- [ ] **Step 3: Compare visual documents to canonical terminology**

  Extract Word and PPTX text using the bundled runtime and compare required terms against the Markdown. Expected: no role naming drift and no claim that the backend/API/database already exists.

- [ ] **Step 4: Perform final visual review**

  Reinspect every final Word page, every PowerPoint slide, the API HTML at wide and narrow layouts, and every screenshot referenced by Markdown. Fix only material defects and rerun the affected validations.

- [ ] **Step 5: Remove internal-only artifacts from user-facing scope**

  Confirm `documents/development` exposes the four requested deliverables and `assets/screenshots`; internal QA renders remain in external scratch. Builder and evidence files stay under `_build` for reproducibility but are not linked as user deliverables.

- [ ] **Step 6: Commit final consistency fixes**

  ```powershell
  git add -- documents/development
  git commit -m "Finalize geology AI development documentation package"
  ```

- [ ] **Step 7: Report delivery**

  Return clickable absolute links to the Markdown, DOCX, PPTX, and HTML files, plus a concise QA statement covering Chrome role walkthrough, Word page rendering, slide rendering, API HTML browser testing, and the conceptual-design boundary.
