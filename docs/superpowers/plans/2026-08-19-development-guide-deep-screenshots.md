# Development Guide Deep Screenshots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the screenshot limitations section and add verified project, range, and point-list screenshots for the three nested business modules.

**Architecture:** Keep the v15 prototype unchanged and capture deterministic UI states from its existing page functions. Store only final PNG evidence under `spec/assets/screenshots`, then reference those files in the existing Markdown without changing RBAC, business rules, or engineer ownership.

**Tech Stack:** v15 single-file HTML prototype, Chrome browser capture, Markdown, PowerShell, Git.

## Global Constraints

- Keep the Markdown layout simple and use normal image links plus one-line captions.
- Use the 地礦中心承辦 role for the three nested business flows.
- Keep the existing 地方政府通報／查勘表單 screenshot.
- Do not modify RBAC, button descriptions, business rules, or engineer assignments.
- Do not include system-administrator business screenshots.

---

### Task 1: Capture the nested module states

**Files:**
- Read: `archive/original/地礦AI_雛型_v15_0805_feedback.html`
- Create: `spec/assets/screenshots/19-ai-range-list.png`
- Create: `spec/assets/screenshots/20-ai-point-list.png`
- Create: `spec/assets/screenshots/21-monitoring-range-list.png`
- Create: `spec/assets/screenshots/22-monitoring-point-list.png`
- Create: `spec/assets/screenshots/23-suspect-project-list.png`
- Create: `spec/assets/screenshots/24-suspect-range-list.png`
- Create: `spec/assets/screenshots/25-suspect-point-list.png`

**Interfaces:**
- Consumes: v15 functions `loginAs`, `showPage`, `showAiProject`, `backToAiRanges`, `showAiRange`, `showMgmtProject`, `showMgmtRange`, `showSuspectProject`, and `showSuspectRange`.
- Produces: seven 1279 × 631 PNG screenshots with visible role, heading, and content anchors.

- [ ] **Step 1: Record the expected screenshot anchors before capture**

```powershell
$expected = @{
  '19-ai-range-list.png' = '判釋範圍列表'
  '20-ai-point-list.png' = '115Q2_RG_011內點位列表'
  '21-monitoring-range-list.png' = '建議監測範圍列表'
  '22-monitoring-point-list.png' = '115Q2_MG_011內點位列表'
  '23-suspect-project-list.png' = '判釋變異點結果及查勘回報'
  '24-suspect-range-list.png' = '判釋變異範圍列表'
  '25-suspect-point-list.png' = '115Q2_SP_011內點位列表'
}
$expected.GetEnumerator() | Sort-Object Name
```

Expected: seven filename-to-heading mappings are printed.

- [ ] **Step 2: Capture the 建議監測點位 range list**

Run these commands in the loaded v15 page after logging in as role B:

```js
loginAs('B', '王大明', 'bmgeo_wang', '地礦中心承辦');
showPage('ai-list');
showAiProject('115');
backToAiRanges();
```

Save the viewport as `spec/assets/screenshots/19-ai-range-list.png` only after `判釋範圍列表`, `115 年度監測專案`, and `共 13 個判釋範圍` are visible.

- [ ] **Step 3: Capture the 建議監測點位 point list**

```js
showAiRange('115Q2_RG_011');
```

Save as `spec/assets/screenshots/20-ai-point-list.png` only after the range code, `內點位列表`, and point rows are visible.

- [ ] **Step 4: Capture the 監測區位選定 range list**

```js
showPage('management-list');
showMgmtProject('115');
```

Save as `spec/assets/screenshots/21-monitoring-range-list.png` only after `建議監測範圍列表`, `115 年度監測專案`, and the range rows are visible.

- [ ] **Step 5: Capture the 監測區位選定 point list**

```js
showMgmtRange('115Q2_MG_011');
```

Save as `spec/assets/screenshots/22-monitoring-point-list.png` only after the range code, `內點位列表`, point rows, and 地礦中心操作按鈕 are visible.

- [ ] **Step 6: Capture the 判釋變異點 project list**

```js
showPage('suspect-list');
```

Save as `spec/assets/screenshots/23-suspect-project-list.png` only after `判釋變異點結果及查勘回報` and the 115／114 project cards are visible.

- [ ] **Step 7: Capture the 判釋變異點 range list**

```js
showSuspectProject('115');
```

Save as `spec/assets/screenshots/24-suspect-range-list.png` only after `判釋變異範圍列表`, `115 年度監測專案`, and the range rows are visible.

- [ ] **Step 8: Capture the 判釋變異點 point list**

```js
showSuspectRange('115Q2_SP_011');
```

Save as `spec/assets/screenshots/25-suspect-point-list.png` only after the range code, `內點位列表`, and point rows are visible.

- [ ] **Step 9: Verify all screenshots are valid PNG files with identical viewport dimensions**

```powershell
Add-Type -AssemblyName System.Drawing
$files = 19..25 | ForEach-Object {
  Get-ChildItem 'spec/assets/screenshots' -Filter ("$($_)-*.png")
}
if ($files.Count -ne 7) { throw "Expected 7 screenshots, found $($files.Count)" }
foreach ($file in $files) {
  $image = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    if ($image.Width -ne 1279 -or $image.Height -ne 631) {
      throw "Unexpected dimensions: $($file.Name) $($image.Width)x$($image.Height)"
    }
  } finally {
    $image.Dispose()
  }
}
Write-Output 'PASS: 7 nested screenshots are 1279x631.'
```

Expected: `PASS: 7 nested screenshots are 1279x631.`

### Task 2: Update the engineer-facing Markdown

**Files:**
- Modify: `spec/地礦AI_功能模組與開發分工說明.md:123-221`
- Modify: `spec/地礦AI_功能模組與開發分工說明.md:397-401`

**Interfaces:**
- Consumes: the seven screenshot paths produced by Task 1.
- Produces: three ordered visual flows and no section 9.

- [ ] **Step 1: Add the 5.3 visual flow after the existing project screenshot**

Insert these exact Markdown blocks before the 5.3 business logic paragraph:

```markdown
專案內的判釋範圍列表：

![建議監測點位－判釋範圍列表](assets/screenshots/19-ai-range-list.png)

選定範圍後的零散點位列表：

![建議監測點位－範圍內點位列表](assets/screenshots/20-ai-point-list.png)
```

- [ ] **Step 2: Add the 5.4 visual flow after the existing project screenshot**

```markdown
進入年度專案後的建議監測範圍列表：

![監測區位選定－建議監測範圍列表](assets/screenshots/21-monitoring-range-list.png)

選定範圍後的監測點位列表：

![監測區位選定－範圍內點位列表](assets/screenshots/22-monitoring-point-list.png)
```

- [ ] **Step 3: Add the 5.6 visual flow before the existing local-government form**

```markdown
年度監測專案列表：

![判釋變異點－年度監測專案列表](assets/screenshots/23-suspect-project-list.png)

進入年度專案後的判釋變異範圍列表：

![判釋變異點－判釋變異範圍列表](assets/screenshots/24-suspect-range-list.png)

選定範圍後的變異點列表：

![判釋變異點－範圍內點位列表](assets/screenshots/25-suspect-point-list.png)

地方政府通報與查勘表單：
```

- [ ] **Step 4: Remove section 9 completely**

Delete the heading `## 9. 截圖來源與限制` and its three list items. The document must end after section 8.

- [ ] **Step 5: Verify section order and references**

```powershell
$path = 'spec/地礦AI_功能模組與開發分工說明.md'
$text = Get-Content -LiteralPath $path -Raw -Encoding UTF8
if ($text -match '## 9\. 截圖來源與限制') { throw 'Section 9 still exists' }
foreach ($name in @(
  '19-ai-range-list.png', '20-ai-point-list.png',
  '21-monitoring-range-list.png', '22-monitoring-point-list.png',
  '23-suspect-project-list.png', '24-suspect-range-list.png',
  '25-suspect-point-list.png'
)) {
  if ($text -notmatch [regex]::Escape($name)) { throw "Missing Markdown reference: $name" }
}
Write-Output 'PASS: section 9 removed and 7 nested screenshots referenced.'
```

Expected: `PASS: section 9 removed and 7 nested screenshots referenced.`

### Task 3: Final verification and publication

**Files:**
- Verify: `spec/地礦AI_功能模組與開發分工說明.md`
- Verify: `spec/assets/screenshots/*.png`

**Interfaces:**
- Consumes: completed screenshot and Markdown changes.
- Produces: one scoped Git commit pushed to `origin/main`.

- [ ] **Step 1: Verify every Markdown image exists**

```powershell
$path = 'spec/地礦AI_功能模組與開發分工說明.md'
$root = (Resolve-Path 'spec').Path
$text = Get-Content -LiteralPath $path -Raw -Encoding UTF8
$refs = [regex]::Matches($text, '!\[[^\]]*\]\(([^)]+)\)')
foreach ($ref in $refs) {
  $full = Join-Path $root ($ref.Groups[1].Value -replace '/', '\')
  if (-not (Test-Path -LiteralPath $full)) { throw "Missing image: $full" }
}
Write-Output "PASS: $($refs.Count) Markdown images exist."
```

- [ ] **Step 2: Verify the diff is scoped and whitespace-clean**

```powershell
git status --short -- spec
git diff --check -- spec
git diff --stat -- spec
```

Expected: only the Markdown file and the seven new PNG files are changed; `git diff --check` exits 0.

- [ ] **Step 3: Commit only the engineer-facing changes**

```powershell
git add -- 'spec/地礦AI_功能模組與開發分工說明.md' 'spec/assets/screenshots/19-ai-range-list.png' 'spec/assets/screenshots/20-ai-point-list.png' 'spec/assets/screenshots/21-monitoring-range-list.png' 'spec/assets/screenshots/22-monitoring-point-list.png' 'spec/assets/screenshots/23-suspect-project-list.png' 'spec/assets/screenshots/24-suspect-range-list.png' 'spec/assets/screenshots/25-suspect-point-list.png'
git commit -m "Add nested module screenshots"
```

- [ ] **Step 4: Push and verify the remote commit**

```powershell
git push origin main
git rev-parse HEAD
git rev-parse origin/main
```

Expected: both commit hashes are identical.
