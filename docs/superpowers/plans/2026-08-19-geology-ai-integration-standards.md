# Geology AI Integration Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce one GitHub reading index and three concise engineer-facing Markdown standards directly under `spec/`.

**Architecture:** Keep the documents beside the existing module/RBAC specification and connect them with relative links. Treat the prototype as UI evidence and all technology, API, and JWT details as SA recommendations pending engineering confirmation.

**Tech Stack:** Markdown, Vue 3, Vite, Vue Router, Pinia, Tailwind CSS 4, daisyUI, Chart.js, C# .NET 8 Web API, EF Core 8, PostgreSQL.

## Global Constraints

- Keep the documents concise and scan-friendly.
- Do not claim that prototype behavior, APIs, schemas, JWT flows, or technology choices are implemented or formally adopted.
- Do not add unit-test, integration-test, Git-flow, CI/CD, delivery-change-log, package-ledger, or database-migration requirements.
- Use the formal module ownership and RBAC in `spec/地礦AI_功能模組與開發分工說明.md`.
- Prefer `/api/v1`; accept `/api` as a transition; never mix both within one system.
- Preserve unrelated files and stage only the planned documents.

---

### Task 1: Create the GitHub Reading Index

**Files:**
- Create: `spec/地礦AI_開發規格索引.md`

**Interfaces:**
- Consumes: approved design and existing module specification.
- Produces: links to all three standards and a compact module/technology summary.

- [x] Add `文件定位`, `建議技術基準`, `模組對照`, `可拖拉整合建議`, `閱讀順序`, and `共同底線`.
- [x] Link to all three sibling standards and `地礦AI_功能模組與開發分工說明.md`.
- [x] Verify all four local links exist.

### Task 2: Create the Frontend Design System Standard

**Files:**
- Create: `spec/地礦AI_前端DesignSystem開發規範.md`

**Interfaces:**
- Consumes: tokens extracted from `index.html` and approved recommended stack.
- Produces: colors, interaction states, component rules, Chart.js conventions, and module folder guidance.

- [x] State the evidence boundary and recommend Vite, Vue 3, Vue Router, Pinia, Tailwind CSS 4, daisyUI, and Chart.js.
- [x] Add complete brand, neutral, information, success, warning, and danger token tables.
- [x] Add one compact `bmgeo` daisyUI theme example.
- [x] Cover the approved UI component inventory and default, hover, focus, pressed, disabled, and loading states.
- [x] Add Chart.js palette, responsive, empty-data, legend/tooltip, and accessibility guidance.
- [x] Add the recommended `src/core`, `src/components/ui`, `src/styles`, `src/charts`, and `src/modules` structure.

### Task 3: Create the REST API Standard

**Files:**
- Create: `spec/地礦AI_REST_API開發規範.md`

**Interfaces:**
- Consumes: approved nine module resource groups and ownership.
- Produces: shared path, request, response, error, and authorization naming contracts.

- [x] Define `{apiBase}`, `/api/v1`, accepted `/api` transition, plural kebab-case resources, camelCase JSON, and ISO 8601 UTC.
- [x] Add identity, dashboard, monitoring, imagery, investigation, reminder, violation, statistics, and audit resource roots.
- [x] Add standard methods, non-CRUD action suffixes, pagination, single/list response, error response, and HTTP status meanings.
- [x] Define immutable shared IDs and state that frontend filters are not authorization evidence.

### Task 4: Create the Authentication and Authorization Standard

**Files:**
- Create: `spec/地礦AI_身分驗證與權限規範.md`

**Interfaces:**
- Consumes: formal four-role RBAC and approved JWT recommendations.
- Produces: account lifecycle, token lifecycle, server-side scope checks, and engineering confirmation list.

- [x] Cover pending, active, disabled, and deactivated account states and all four roles.
- [x] Recommend ASP.NET Core Identity password hashing, 15-to-30-minute access tokens, Pinia/in-memory access-token storage, HttpOnly Secure refresh cookies, rotation, and revocation.
- [x] Cover signature, issuer, audience, expiration, minimal claims, 401/403, downloads, exports, maps, statistics, and audit events.
- [x] Add a five-step request flow, compact checklist, and engineering-confirmation items.

### Task 5: Verify and Publish

**Files:**
- Verify: `spec/地礦AI_開發規格索引.md`
- Verify: `spec/地礦AI_前端DesignSystem開發規範.md`
- Verify: `spec/地礦AI_REST_API開發規範.md`
- Verify: `spec/地礦AI_身分驗證與權限規範.md`

**Interfaces:**
- Consumes: the four completed documents.
- Produces: a verified GitHub-readable package.

- [x] Scan for placeholders, implementation overclaims, and excluded requirements.
- [x] Resolve every relative Markdown link and require `BROKEN_LINKS=0`.
- [x] Run `git diff --check` and verify only planned files are staged.
- [x] Run the existing v15 Node test and require 5/5 PASS.
- [x] Commit the verified package on `codex/integration-standards`; final branch integration and push follow the finishing workflow.
