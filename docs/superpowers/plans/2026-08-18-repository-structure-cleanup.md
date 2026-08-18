# Repository Structure Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move prototype history, version metadata, and engineer-facing specifications into their approved locations, then publish the verified `main` branch to GitHub.

**Architecture:** Keep `index.html` as the GitHub Pages entry and keep all versioned prototypes only under `archive/original`. Move the engineer package as one intact directory to `/spec`, update active consumers of moved paths, and preserve internal planning records under `docs/superpowers`.

**Tech Stack:** Git, GitHub CLI, Node.js tests, PowerShell validation, GitHub Pages static HTML.

## Global Constraints

- Publish repository: `sherryliao-afk/115_geology-ai` via the configured `origin` remote.
- Publish branch: `main`.
- Preserve `index.html` as the v15 GitHub Pages entry.
- Keep `docs/superpowers` in place.
- Put only engineer-facing development reference files under `/spec`.
- Do not stage, move, delete, or publish unrelated untracked files.
- Do not change `version-plan.json` content while moving it.

---

### Task 1: Move tracked files into the approved structure

**Files:**
- Delete duplicate: `地礦AI_雛型_v14_0730_feedback.html`
- Delete duplicate: `地礦AI_雛型_v15_0805_feedback.html`
- Move: `version-plan.json` → `documents/version-plan.json`
- Move tracked package: `documents/development/assets/**` and `documents/development/地礦AI_功能模組與開發分工說明.md` → `spec/**`

**Interfaces:**
- Consumes: verified identical hashes for root and archived v14/v15 files.
- Produces: a single archived copy of each prototype and one root `/spec` engineer package.

- [ ] **Step 1: Verify duplicate hashes**

Run SHA-256 comparisons for root and archived v14/v15. Expected: both pairs report identical hashes.

- [ ] **Step 2: Remove only the tracked root duplicates**

```powershell
git rm -- '地礦AI_雛型_v14_0730_feedback.html' '地礦AI_雛型_v15_0805_feedback.html'
```

- [ ] **Step 3: Move the version plan**

```powershell
git mv -- version-plan.json documents/version-plan.json
```

- [ ] **Step 4: Move the engineer package**

```powershell
New-Item -ItemType Directory -Path spec
git mv -- documents/development/assets spec/assets
git mv -- 'documents/development/地礦AI_功能模組與開發分工說明.md' 'spec/地礦AI_功能模組與開發分工說明.md'
```

Expected: tracked Markdown, diagrams, and screenshots retain their relative layout under `spec`; untracked `documents/development/_build` remains in place and is not staged.

### Task 2: Repair active references and repository documentation

**Files:**
- Modify: `tests/statistics-dashboard-v15.test.js`
- Modify: `scripts/build_development_guide_diagrams.mjs`
- Modify: `spec/地礦AI_功能模組與開發分工說明.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: final paths from Task 1.
- Produces: valid tests, repeatable diagram generation, and a current repository map.

- [ ] **Step 1: Update the v15 test source**

Change the HTML path construction to:

```js
const htmlPath = path.join(root, 'archive', 'original', '地礦AI_雛型_v15_0805_feedback.html');
```

- [ ] **Step 2: Update the diagram output directory**

Change the generator output path to:

```js
const outputDir = path.join(projectRoot, "spec", "assets", "diagrams");
```

- [ ] **Step 3: Update the engineer guide source reference**

Use `archive/original/地礦AI_雛型_v15_0805_feedback.html` as the v15 evidence path. Keep all `assets/...` image links unchanged.

- [ ] **Step 4: Rewrite README structure text**

Document v15 as the current demo, link to `spec/地礦AI_功能模組與開發分工說明.md`, and list `archive/original`, `documents/version-plan.json`, `spec`, and `docs/superpowers` accurately.

### Task 3: Validate, commit, and publish

**Files:**
- Verify: `index.html`
- Verify: `archive/original/地礦AI_雛型_v15_0805_feedback.html`
- Verify: `documents/version-plan.json`
- Verify: `spec/**`
- Verify: `tests/statistics-dashboard-v15.test.js`

**Interfaces:**
- Consumes: Tasks 1 and 2 outputs.
- Produces: a verified commit pushed to `origin/main`.

- [ ] **Step 1: Validate file structure and links**

Confirm root duplicates are absent, the moved files exist, all 10 Markdown image targets exist, and `index.html` matches archived v15 by SHA-256.

- [ ] **Step 2: Run tests and safety scans**

Run:

```powershell
node --test tests/statistics-dashboard-v15.test.js
git diff --check
rg -n "C:\\|file:///|localhost|127\.0\.0\.1" spec README.md
```

Expected: tests pass, no diff errors, and no public local-path matches.

- [ ] **Step 3: Commit only approved paths**

```powershell
git add -- README.md documents/version-plan.json spec scripts/build_development_guide_diagrams.mjs tests/statistics-dashboard-v15.test.js
git commit -m "Organize prototype history and development specs"
```

The tracked root duplicate removals are already staged by `git rm`.

- [ ] **Step 4: Synchronize and push**

Fetch `origin`, verify local `main` contains `origin/main`, then push:

```powershell
git push origin main
```

Expected: GitHub reports `main` updated to the new cleanup commit.
