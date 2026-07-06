# 地礦 AI 新系統雛型

This repository preserves the HTML prototype version history for 地礦 AI 新系統雛型.

## Demo entry

GitHub Pages should serve the root index.html. The current index.html corresponds to:

`	ext
地礦AI_雛型_v9.html
`

Latest version: `archive/original/地礦AI_雛型_v10.html`（依 20260630 線上會議紀錄更新，包含 T1/T4/T5/T6/T7/T8/T9/T11/T12/T13/T14 共 11 項調整；確認後再複製為根目錄 index.html 對外發布）.

## Repository structure

`	ext
.
??? index.html
??? README.md
??? CHANGELOG.md
??? version-plan.json
??? documents/
??? archive/
    ??? original/
`

- index.html: current GitHub Pages entry point.
- CHANGELOG.md: version ordering, original filename, diff summary, and commit message.
- ersion-plan.json: machine-readable version plan generated during migration.
- documents/: project documents can be added here after content review.
- rchive/original/: original HTML files copied as source backups.

## Notes

Versions were sorted by original file LastWriteTime, then committed one by one as index.html.

Before publishing documents to a public repository, review them for personal data, internal agency information, credentials, API keys, procurement-sensitive details, and unpublished material.
