# 地礦 AI GitHub 儲存庫結構整理設計

- 日期：2026-08-18
- 目標儲存庫：`sherryliao-afk/115_geology-ai`
- 發布分支：`main`

## 1. 目標

整理 GitHub 儲存庫根目錄，使雛型版本、文件及工程師開發參考資料各自有明確位置，並在驗證後推送至 GitHub。

## 2. 目標結構

```text
/
├─ index.html
├─ README.md
├─ CHANGELOG.md
├─ archive/
│  └─ original/
│     └─ 地礦AI_雛型_v1～v15.html
├─ documents/
│  └─ version-plan.json
├─ spec/
│  ├─ 地礦AI_功能模組與開發分工說明.md
│  └─ assets/
│     ├─ diagrams/
│     └─ screenshots/
├─ docs/
│  └─ superpowers/
├─ scripts/
└─ tests/
```

## 3. 搬移與保留規則

1. 根目錄 v14、v15 與 `archive/original` 內同名檔案 SHA-256 完全相同，因此移除根目錄重複檔，不另建第三份副本。
2. `index.html` 與封存 v15 完全相同，保留在根目錄作為 GitHub Pages 入口。
3. `version-plan.json` 僅移至 `documents/version-plan.json`，不變更內容。
4. `documents/development` 的已追蹤工程師交付資料移至根目錄 `spec`。
5. `docs/superpowers/specs` 及 `docs/superpowers/plans` 保留原位，作為內部設計與執行紀錄，不放入 `spec`。
6. 工作區其他未追蹤的 Word、QA、分析及暫存檔不搬移、不刪除、不提交。

## 4. 引用修正

- `tests/statistics-dashboard-v15.test.js` 改讀取 `archive/original/地礦AI_雛型_v15_0805_feedback.html`。
- `scripts/build_development_guide_diagrams.mjs` 改輸出至 `spec/assets/diagrams`。
- 工程師 Markdown 中的 v15 來源位置改為 `archive/original/地礦AI_雛型_v15_0805_feedback.html`。
- Markdown 內圖片仍使用 `assets/...` 相對路徑，移至 `spec` 後不需改變。
- README 更新為 v15、正確目錄樹及工程師開發參考入口。

歷史執行計畫中的舊路徑保留為當時紀錄，不批次改寫。

## 5. 驗證與發布

1. 再次驗證根目錄 v14／v15 與封存檔內容相同後才移除重複檔。
2. 驗證 `index.html` 與封存 v15 SHA-256 相同。
3. 驗證根目錄不存在 v14、v15 及 `version-plan.json`。
4. 驗證 `documents/version-plan.json`、`spec` Markdown、2 張流程圖及 8 張截圖存在。
5. 驗證工程師 Markdown 的 10 個圖片連結全部有效。
6. 執行 `tests/statistics-dashboard-v15.test.js`、`git diff --check` 及公開路徑掃描。
7. 只提交本設計列出的追蹤檔案，保留所有無關未追蹤檔。
8. 確認遠端 `main` 未出現未整合提交後，推送本地 `main` 至 `origin/main`。
