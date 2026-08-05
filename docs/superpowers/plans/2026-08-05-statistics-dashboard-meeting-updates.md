# 統計分析儀表板會議調整 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 以 v14 為基準建立 v15 雛型，完成監測統計摘要精簡、回報結果違規摘要拆分，以及盜濫採砂石統計表欄位改版。

**Architecture:** 延續專案的單一 HTML 雛型架構，複製 v14 建立新的 v15 檔案，只調整「統計分析儀表板」的靜態 HTML、Tailwind 樣式與雛型數字，不重構既有 Chart.js、篩選器或角色權限。新增一支零相依的 Node.js 靜態測試，鎖定會議指定的標籤、卡片與表格欄位，避免修改大型 HTML 時誤傷其他區塊。

**Tech Stack:** 單一 HTML、Tailwind CSS CDN、原生 JavaScript、Chart.js、Node.js 內建 `assert` / `vm`

## Global Constraints

- Baseline：`地礦AI_雛型_v14_0730_feedback.html`。
- 開發輸出：`地礦AI_雛型_v15_0805_feedback.html`；不得覆寫 v14。
- 本輪只處理會議列出的三項統計儀表板調整，不改圖表資料集、篩選器、匯出功能、角色權限、圖台或其他頁面。
- 本輪不修改 `index.html`、不建立 `archive/original` 封存副本、不推送 GitHub Pages；上述發布動作需在 v15 驗收後另行取得明確同意。
- UI 文案採會議原文：`砂石盜濫採`、`其他違法行為`、`變異點總數`、`已查勘`、`未查勘`、`涉及其他機關權責之變異點`、`已移送續處`、`尚未移送續處`。
- 附圖欄位視覺分組：`縣市`、`變異點總數`、`已查勘`、`未查勘`使用淡黃色；跨機關權責與移送三欄使用淡藍色。
- 會議資料沒有另外提供雛型數字。計畫採用下方「數字映射提案」以保留現有數值與加總關係；使用者核准本計畫，即代表同意將這組數字用於 v15 雛型。

## 核准前的數字映射提案

### 回報結果摘要卡

目前畫面為「確認違規點位 36」，目前盜濫採砂石表合計為 30，因此拆分為：

| 新卡片 | 件數 | 佔總查勘點位 142 的比例 |
|---|---:|---:|
| 砂石盜濫採 | 30 | 21.1% |
| 其他違法行為 | 6 | 4.2% |

`30 + 6 = 36`，維持現有「確認違規點位」總數不變。各縣市回報結果圖表內既有的示意 dataset 不在本次會議修改範圍，因此本輪不連動更改。

### 盜濫採砂石統計表

將既有欄位重新映射並補出可驗算的衍生欄位：

- `變異點總數`沿用現有`查獲件數`。
- `已查勘`沿用現有`已查處`。
- `未查勘 = 變異點總數 - 已查勘`。
- `已移送續處`沿用現有`移送續處`。
- `尚未移送續處`沿用現有`尚在處理`。
- `涉及其他機關權責之變異點 = 已移送續處 + 尚未移送續處`。

| 縣市 | 變異點總數 | 已查勘 | 未查勘 | 涉及其他機關權責之變異點 | 已移送續處 | 尚未移送續處 |
|---|---:|---:|---:|---:|---:|---:|
| 高雄市 | 8 | 5 | 3 | 3 | 2 | 1 |
| 屏東縣 | 7 | 4 | 3 | 3 | 2 | 1 |
| 台中市 | 5 | 3 | 2 | 2 | 1 | 1 |
| 花蓮縣 | 4 | 2 | 2 | 2 | 1 | 1 |
| 南投縣 | 3 | 2 | 1 | 1 | 0 | 1 |
| 苗栗縣 | 3 | 2 | 1 | 1 | 1 | 0 |
| 合計 | 30 | 18 | 12 | 12 | 7 | 5 |

---

## File Structure

- Create: `地礦AI_雛型_v15_0805_feedback.html` — v15 可檢視雛型，承接 v14 全部功能並包含本輪三項調整。
- Create: `tests/statistics-dashboard-v15.test.js` — 不需要 npm 套件的靜態驗收測試，只讀取 v15 HTML。
- Keep unchanged: `地礦AI_雛型_v14_0730_feedback.html` — 本輪基準檔與回退版本。
- Keep unchanged: `index.html` — 目前 GitHub Pages 對外入口，待使用者完成 v15 驗收後再決定是否更新。

---

### Task 1: 建立 v15 基準與靜態測試骨架

**Files:**
- Create: `地礦AI_雛型_v15_0805_feedback.html`
- Create: `tests/statistics-dashboard-v15.test.js`
- Read: `地礦AI_雛型_v14_0730_feedback.html:2138`

**Interfaces:**
- Consumes: v14 單一 HTML 雛型。
- Produces: 後續任務共同修改的 v15 HTML，以及 `sliceBetween()`、`stripTags()`、`extractRows()` 測試輔助函式。

- [ ] **Step 1: 複製 v14 建立 v15，不修改 v14**

Run:

```powershell
Copy-Item -LiteralPath '地礦AI_雛型_v14_0730_feedback.html' -Destination '地礦AI_雛型_v15_0805_feedback.html'
```

Expected: 新檔存在，兩檔 SHA-256 相同。

```powershell
Get-FileHash -Algorithm SHA256 '地礦AI_雛型_v14_0730_feedback.html','地礦AI_雛型_v15_0805_feedback.html'
```

- [ ] **Step 2: 建立可重複使用的零相依測試骨架**

Create `tests/statistics-dashboard-v15.test.js`：

```js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, '地礦AI_雛型_v15_0805_feedback.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function sliceBetween(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `找不到起始標記：${start}`);
  assert.notEqual(endIndex, -1, `找不到結束標記：${end}`);
  return source.slice(startIndex, endIndex);
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractRows(tableHtml) {
  return [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((row) =>
    [...row[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((cell) => stripTags(cell[1]))
  );
}

test('v15 保留統計分析儀表板三個頁籤', () => {
  assert.match(html, /id="stats-tab-monitor"/);
  assert.match(html, /id="stats-tab-report"/);
  assert.match(html, /id="stats-tab-violation"/);
});

let failed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(error.message);
  }
}
process.exitCode = failed === 0 ? 0 : 1;
```

- [ ] **Step 3: 執行基準測試**

Run:

```powershell
node tests/statistics-dashboard-v15.test.js
```

Expected: `PASS v15 保留統計分析儀表板三個頁籤`，exit code 0。

- [ ] **Step 4: 建立基準提交**

```powershell
git add -- '地礦AI_雛型_v15_0805_feedback.html' 'tests/statistics-dashboard-v15.test.js'
git commit -m "Start v15 statistics dashboard update"
```

---

### Task 2: 監測統計移除「監測縣市數」

**Files:**
- Modify: `地礦AI_雛型_v15_0805_feedback.html`，對應 v14 第 2457–2469 行。
- Modify: `tests/statistics-dashboard-v15.test.js`

**Interfaces:**
- Consumes: `#stats-tab-monitor-content` 與既有「總監測次數」卡片。
- Produces: `#stats-monitor-summary` 單欄摘要區與 `#stats-monitor-total-card`。

- [ ] **Step 1: 先加入會失敗的監測摘要測試**

在測試執行迴圈之前加入：

```js
test('監測統計只保留總監測次數摘要', () => {
  const monitor = sliceBetween(
    html,
    '<div id="stats-tab-monitor-content"',
    '<!-- ── 使用者管理 ── -->'
  );
  assert.doesNotMatch(monitor, /監測縣市數/);
  assert.match(monitor, /id="stats-monitor-summary"/);
  assert.match(monitor, /id="stats-monitor-total-card"/);
  assert.match(monitor, /總監測次數/);
});
```

- [ ] **Step 2: 執行測試並確認它因舊卡片仍存在而失敗**

Run: `node tests/statistics-dashboard-v15.test.js`

Expected: FAIL，訊息包含 `監測縣市數` 或缺少 `stats-monitor-summary`。

- [ ] **Step 3: 刪除監測縣市卡並讓剩餘卡片占滿摘要列**

將 v15 原本兩張摘要卡片替換為：

```html
<!-- 摘要卡片 -->
<div id="stats-monitor-summary" class="grid grid-cols-1 gap-3 mb-3">
  <div id="stats-monitor-total-card" class="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
    <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">總監測次數</p>
    <p class="text-2xl font-bold text-[#007d6d]">186</p>
    <p class="text-xs text-slate-400 mt-1">衛星監測＋無人載具</p>
  </div>
</div>
```

- [ ] **Step 4: 執行測試確認通過**

Run: `node tests/statistics-dashboard-v15.test.js`

Expected: 監測摘要測試 PASS，頁面其他頁籤測試仍 PASS。

- [ ] **Step 5: 提交監測摘要調整**

```powershell
git add -- '地礦AI_雛型_v15_0805_feedback.html' 'tests/statistics-dashboard-v15.test.js'
git commit -m "Remove monitored county summary card"
```

---

### Task 3: 將「確認違規點位」拆成兩張摘要卡

**Files:**
- Modify: `地礦AI_雛型_v15_0805_feedback.html`，對應 v14 第 2234–2255 行。
- Modify: `tests/statistics-dashboard-v15.test.js`

**Interfaces:**
- Consumes: 現有回報結果摘要總數 142、無違規 89、確認違規 36、尚未查勘 17，以及核准的 30/6 拆分規則。
- Produces: `#stats-report-summary` 五卡摘要列、`#stats-report-sand-card` 與 `#stats-report-other-card`。

- [ ] **Step 1: 先加入會失敗的回報摘要測試**

在測試執行迴圈之前加入：

```js
test('確認違規摘要拆成砂石盜濫採與其他違法行為', () => {
  const report = sliceBetween(
    html,
    '<div id="stats-tab-report-content"',
    '<!-- Tab：違規行為統計 -->'
  );
  assert.doesNotMatch(report, />確認違規點位</);
  assert.match(report, /id="stats-report-summary"/);
  assert.match(report, /id="stats-report-sand-card"[\s\S]*?砂石盜濫採[\s\S]*?>30</);
  assert.match(report, /id="stats-report-other-card"[\s\S]*?其他違法行為[\s\S]*?>6</);
});
```

- [ ] **Step 2: 執行測試並確認舊「確認違規點位」卡造成失敗**

Run: `node tests/statistics-dashboard-v15.test.js`

Expected: FAIL，訊息指出仍存在`確認違規點位`或缺少兩張新卡片。

- [ ] **Step 3: 將四卡摘要替換成五卡摘要**

```html
<div id="stats-report-summary" class="grid grid-cols-5 gap-3 mb-4">
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
    <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">總查勘點位數</p>
    <p class="text-2xl font-bold text-slate-800">142</p>
    <p class="text-xs text-slate-400 mt-1">115年度全台</p>
  </div>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
    <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">無違規行為</p>
    <p class="text-2xl font-bold text-[#007d6d]">89</p>
    <p class="text-xs text-slate-400 mt-1">佔 62.7%</p>
  </div>
  <div id="stats-report-sand-card" class="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
    <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">砂石盜濫採</p>
    <p class="text-2xl font-bold text-red-600">30</p>
    <p class="text-xs text-slate-400 mt-1">佔 21.1%</p>
  </div>
  <div id="stats-report-other-card" class="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
    <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">其他違法行為</p>
    <p class="text-2xl font-bold text-slate-600">6</p>
    <p class="text-xs text-slate-400 mt-1">佔 4.2%</p>
  </div>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
    <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">尚未查勘</p>
    <p class="text-2xl font-bold text-orange-500">17</p>
    <p class="text-xs text-slate-400 mt-1">佔 12.0%</p>
  </div>
</div>
```

- [ ] **Step 4: 執行測試確認通過**

Run: `node tests/statistics-dashboard-v15.test.js`

Expected: 回報摘要測試 PASS；`30 + 6 = 36`，其餘三張卡數值不變。

- [ ] **Step 5: 提交回報摘要調整**

```powershell
git add -- '地礦AI_雛型_v15_0805_feedback.html' 'tests/statistics-dashboard-v15.test.js'
git commit -m "Split confirmed violation summary cards"
```

---

### Task 4: 依附圖重做盜濫採砂石統計表欄位

**Files:**
- Modify: `地礦AI_雛型_v15_0805_feedback.html`，對應 v14 第 2264–2300 行。
- Modify: `tests/statistics-dashboard-v15.test.js`

**Interfaces:**
- Consumes: 核准的七欄表格、六縣市數字與兩組欄位配色。
- Produces: `#stats-sand-mining-table`，其每列均符合兩個加總關係。

- [ ] **Step 1: 先加入表頭、數字與加總關係測試**

在測試執行迴圈之前加入：

```js
test('盜濫採砂石統計表符合附圖欄位與加總規則', () => {
  const table = sliceBetween(
    html,
    '<table id="stats-sand-mining-table"',
    '</table>'
  );
  const rows = extractRows(table);
  assert.deepEqual(rows[0], [
    '縣市',
    '變異點總數',
    '已查勘',
    '未查勘',
    '涉及其他機關權責之變異點',
    '已移送續處',
    '尚未移送續處'
  ]);
  assert.deepEqual(rows.at(-1), ['合計', '30', '18', '12', '12', '7', '5']);

  for (const row of rows.slice(1)) {
    const [, total, inspected, uninspected, external, transferred, pendingTransfer] = row;
    assert.equal(Number(total), Number(inspected) + Number(uninspected), `${row[0]}查勘數不平`);
    assert.equal(Number(external), Number(transferred) + Number(pendingTransfer), `${row[0]}移送數不平`);
  }
});
```

- [ ] **Step 2: 執行測試並確認缺少新表格 ID／新欄位而失敗**

Run: `node tests/statistics-dashboard-v15.test.js`

Expected: FAIL，訊息為找不到`<table id="stats-sand-mining-table"`。

- [ ] **Step 3: 以七欄、雙色分組表格取代既有五欄表格**

保留既有卡片標題與年度，在其下方改為：

```html
<div class="overflow-x-auto">
  <table id="stats-sand-mining-table" class="min-w-[1100px] w-full text-xs">
    <thead class="border-b border-slate-300">
      <tr>
        <th class="bg-amber-50 px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase">縣市</th>
        <th class="bg-amber-50 px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">變異點總數</th>
        <th class="bg-amber-50 px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">已查勘</th>
        <th class="bg-amber-50 px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">未查勘</th>
        <th class="bg-blue-50 border-l-2 border-slate-300 px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">涉及其他機關權責之變異點</th>
        <th class="bg-blue-50 px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">已移送續處</th>
        <th class="bg-blue-50 px-4 py-3 text-right text-[10px] font-bold text-slate-600 uppercase">尚未移送續處</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100">
      <tr class="hover:brightness-[0.98]"><td class="bg-amber-50 px-4 py-3 font-medium text-slate-700">高雄市</td><td class="bg-amber-50 px-4 py-3 text-right font-bold text-slate-700">8</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">5</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">3</td><td class="bg-blue-50 border-l-2 border-slate-300 px-4 py-3 text-right text-slate-600">3</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">2</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">1</td></tr>
      <tr class="hover:brightness-[0.98]"><td class="bg-amber-50 px-4 py-3 font-medium text-slate-700">屏東縣</td><td class="bg-amber-50 px-4 py-3 text-right font-bold text-slate-700">7</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">4</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">3</td><td class="bg-blue-50 border-l-2 border-slate-300 px-4 py-3 text-right text-slate-600">3</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">2</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">1</td></tr>
      <tr class="hover:brightness-[0.98]"><td class="bg-amber-50 px-4 py-3 font-medium text-slate-700">台中市</td><td class="bg-amber-50 px-4 py-3 text-right font-bold text-slate-700">5</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">3</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">2</td><td class="bg-blue-50 border-l-2 border-slate-300 px-4 py-3 text-right text-slate-600">2</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">1</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">1</td></tr>
      <tr class="hover:brightness-[0.98]"><td class="bg-amber-50 px-4 py-3 font-medium text-slate-700">花蓮縣</td><td class="bg-amber-50 px-4 py-3 text-right font-bold text-slate-700">4</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">2</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">2</td><td class="bg-blue-50 border-l-2 border-slate-300 px-4 py-3 text-right text-slate-600">2</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">1</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">1</td></tr>
      <tr class="hover:brightness-[0.98]"><td class="bg-amber-50 px-4 py-3 font-medium text-slate-700">南投縣</td><td class="bg-amber-50 px-4 py-3 text-right font-bold text-slate-700">3</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">2</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">1</td><td class="bg-blue-50 border-l-2 border-slate-300 px-4 py-3 text-right text-slate-600">1</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">0</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">1</td></tr>
      <tr class="hover:brightness-[0.98]"><td class="bg-amber-50 px-4 py-3 font-medium text-slate-700">苗栗縣</td><td class="bg-amber-50 px-4 py-3 text-right font-bold text-slate-700">3</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">2</td><td class="bg-amber-50 px-4 py-3 text-right text-slate-600">1</td><td class="bg-blue-50 border-l-2 border-slate-300 px-4 py-3 text-right text-slate-600">1</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">1</td><td class="bg-blue-50 px-4 py-3 text-right text-slate-600">0</td></tr>
    </tbody>
    <tfoot class="border-t border-slate-300">
      <tr>
        <td class="bg-amber-50 px-4 py-3 font-bold text-slate-700">合計</td><td class="bg-amber-50 px-4 py-3 text-right font-bold text-slate-800">30</td><td class="bg-amber-50 px-4 py-3 text-right font-bold text-slate-700">18</td><td class="bg-amber-50 px-4 py-3 text-right font-bold text-slate-700">12</td><td class="bg-blue-50 border-l-2 border-slate-300 px-4 py-3 text-right font-bold text-slate-700">12</td><td class="bg-blue-50 px-4 py-3 text-right font-bold text-slate-700">7</td><td class="bg-blue-50 px-4 py-3 text-right font-bold text-slate-700">5</td>
      </tr>
    </tfoot>
  </table>
</div>
```

- [ ] **Step 4: 執行測試確認所有縣市與合計列皆符合兩個加總關係**

Run: `node tests/statistics-dashboard-v15.test.js`

Expected: 所有測試 PASS，exit code 0。

- [ ] **Step 5: 提交表格調整**

```powershell
git add -- '地礦AI_雛型_v15_0805_feedback.html' 'tests/statistics-dashboard-v15.test.js'
git commit -m "Update sand mining statistics columns"
```

---

### Task 5: 完整驗證與交付使用者檢視

**Files:**
- Verify: `地礦AI_雛型_v15_0805_feedback.html`
- Verify: `tests/statistics-dashboard-v15.test.js`
- Keep unchanged: `index.html`

**Interfaces:**
- Consumes: Tasks 1–4 完成的 v15。
- Produces: 可供使用者本機驗收、但尚未發布的 v15 雛型。

- [ ] **Step 1: 執行所有靜態需求測試**

Run: `node tests/statistics-dashboard-v15.test.js`

Expected: 4 個測試全部 PASS。

- [ ] **Step 2: 驗證 v15 所有內嵌 JavaScript 語法**

Run:

```powershell
@'
const fs = require('fs');
const vm = require('vm');
const file = '地礦AI_雛型_v15_0805_feedback.html';
const html = fs.readFileSync(file, 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .filter((match) => !/type\s*=\s*['"](?:application\/json|application\/ld\+json)['"]/i.test(match[0]));
scripts.forEach((match, index) => new vm.Script(match[1], { filename: `${file}#script-${index + 1}` }));
console.log(`JS OK: ${scripts.length} inline scripts`);
'@ | node -
```

Expected: `JS OK: 4 inline scripts`。

- [ ] **Step 3: 執行 Git whitespace 與範圍檢查**

```powershell
git diff --check
git status --short
git diff --name-only HEAD
```

Expected:

- `git diff --check` 無錯誤。
- 功能修改只出現在 v15 與測試檔。
- v14、`index.html`、`archive/original` 沒有修改。
- 原本工作區內其他未追蹤檔案維持原狀，不加入提交。

- [ ] **Step 4: 瀏覽器人工驗收統計分析儀表板**

開啟 `地礦AI_雛型_v15_0805_feedback.html`，依序確認：

1. 「監測統計」沒有「監測縣市數」，「總監測次數」卡片占滿摘要區。
2. 「回報結果統計」依序顯示五張卡：總查勘點位數、無違規行為、砂石盜濫採、其他違法行為、尚未查勘。
3. 不再出現「確認違規點位」摘要卡。
4. 盜濫採砂石統計表有七欄，淡黃色與淡藍色分組和附圖一致。
5. 表格在內容寬度不足時可水平捲動，長欄名與數值沒有被裁切。
6. 三個統計頁籤仍可切換，既有圖表正常顯示，瀏覽器 console 沒有錯誤。
7. 篩選器與「匯出統計結果」按鈕仍維持原本互動。

- [ ] **Step 5: 將 v15 路徑交付使用者檢視，停止在發布邊界前**

交付：`地礦AI_雛型_v15_0805_feedback.html`。

明確說明本輪尚未改動 `index.html`、尚未封存至 `archive/original`、尚未推送 GitHub Pages；等使用者確認 v15 畫面後再另行執行發布流程。

---

## Self-Review Result

- Spec coverage：三項會議需求分別由 Task 2、Task 3、Task 4 完整覆蓋。
- Scope control：圖表 dataset、篩選器、匯出、角色與發布流程均明確列為本輪不修改。
- Data consistency：摘要拆分保持 `30 + 6 = 36`；表格逐列與合計列均有自動驗算。
- Version safety：v14、`index.html` 與公開 Pages 保持不變，直到使用者完成 v15 驗收。
- Open approval item：本計畫已將會議未提供的雛型數字轉為明確映射提案；核准本計畫即核准這組 v15 假資料。
