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
