# 地礦 AI 新系統雛型

本儲存庫保存地礦 AI 新系統雛型、歷史版本與工程師開發參考資料。

## 線上展示

GitHub Pages 由根目錄的 [`index.html`](index.html) 提供，目前對應：

`archive/original/地礦AI_雛型_v15_0805_feedback.html`

根目錄只保留展示入口；各版雛型統一保存於 `archive/original`。

## 工程師開發參考

請從以下文件開始閱讀：

- [地礦 AI 功能模組、業務流程與開發分工說明](spec/地礦AI_功能模組與開發分工說明.md)
- [RBAC 角色與模組圖](spec/assets/diagrams/rbac-role-module-matrix.png)
- [角色業務流程圖](spec/assets/diagrams/monitoring-business-data-flow.png)

## 儲存庫結構

```text
.
├─ index.html                  # GitHub Pages 展示入口，目前為 v15
├─ README.md
├─ CHANGELOG.md                # 雛型版本變更紀錄
├─ archive/
│  └─ original/               # v1～v15 原始雛型
├─ documents/
│  └─ version-plan.json        # 機器可讀的版本整理紀錄
├─ spec/                       # 工程師正式開發參考
│  ├─ 地礦AI_功能模組與開發分工說明.md
│  └─ assets/
│     ├─ diagrams/
│     └─ screenshots/
├─ docs/
│  └─ superpowers/            # 內部設計與執行紀錄
├─ scripts/                    # 產圖與維護腳本
└─ tests/                      # 雛型回歸測試
```

## 維護原則

- 新雛型版本應先保存於 `archive/original`，確認發布版本後再同步至 `index.html`。
- 不在根目錄放置版本雛型副本，避免與封存版本重複。
- `/spec` 只放工程師需要閱讀的正式開發參考；內部規劃紀錄保留於 `docs/superpowers`。
- 公開前應檢查個人資料、內部機關資訊、帳密、API 金鑰、採購敏感內容及尚未公開資料。
