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
