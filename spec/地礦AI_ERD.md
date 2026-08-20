# 地礦 AI 抽象 ERD

版本：草案 v1
設計層級：邏輯資料模型
對應文件：[介面欄位完整盤點](地礦AI_介面欄位完整盤點.md)、[資料表設計規格](地礦AI_資料表設計規格.md)

## 1. 點位一條龍流程

![點位一條龍流程](assets/diagrams/point-lifecycle-overview.svg)

圖檔：[SVG](assets/diagrams/point-lifecycle-overview.svg)｜[PNG](assets/diagrams/point-lifecycle-overview.png)

```mermaid
flowchart LR
    A[AI 判釋成果檔] --> B[匯入批次]
    B --> P[(points 核心點位)]
    P --> S{建議監測篩選}
    S -->|納入| M{監測區位選定}
    S -->|排除| H[保留點位與排除原因]
    M -->|納入拍攝| C[拍攝與成果上傳]
    M -->|排除| H
    C --> I{變異判釋}
    I -->|確認變異| N[通報地方政府]
    I -->|無變異| H
    N --> R[查勘回報]
    R --> F[稽催／違規續處／結案]
    S -.狀態歷程.-> SH[(point_stage_history)]
    M -.狀態歷程.-> SH
    I -.狀態歷程.-> SH
```

重點：所有階段都操作同一筆 `points`。點位未通過某階段時只更新狀態與原因，不另建點位、不刪除。

## 2. 全系統 ERD 總覽

![全系統抽象 ERD](assets/diagrams/abstract-erd-overview.svg)

圖檔：[SVG](assets/diagrams/abstract-erd-overview.svg)｜[PNG](assets/diagrams/abstract-erd-overview.png)

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ USERS : contains
    COUNTIES ||--o{ TOWNSHIPS : contains
    USERS ||--o{ USER_ROLES : assigned
    ROLES ||--o{ USER_ROLES : grants
    USERS ||--o{ USER_COUNTY_SCOPES : scoped
    COUNTIES ||--o{ USER_COUNTY_SCOPES : authorizes

    PROJECTS ||--o{ POINT_IMPORT_BATCHES : imports
    PROJECTS ||--o{ POINTS : contains
    POINT_IMPORT_BATCHES ||--o{ POINTS : supplies
    COUNTIES ||--o{ POINTS : locates
    TOWNSHIPS ||--o{ POINTS : locates

    PROJECTS ||--o{ MONITORING_RANGES : contains
    MONITORING_RANGES ||--o{ RANGE_GEOMETRIES : versions
    MONITORING_RANGES ||--o{ POINT_RANGE_MEMBERSHIPS : groups
    POINTS ||--o{ POINT_RANGE_MEMBERSHIPS : belongs
    POINTS ||--o{ POINT_STAGE_HISTORY : traces

    MONITORING_RANGES ||--o{ CAPTURE_ASSIGNMENTS : assigned
    ORGANIZATIONS ||--o{ CAPTURE_ASSIGNMENTS : performs
    POINTS ||--o{ IMAGERY_RECORDS : has
    MONITORING_RANGES ||--o{ IMAGERY_RECORDS : covers
    POINTS ||--o{ POINT_ATTACHMENTS : owns

    POINTS ||--o{ SURVEY_NOTIFICATIONS : notified
    SURVEY_NOTIFICATIONS ||--o| SURVEY_REPORTS : receives
    POINTS ||--o{ SURVEY_REPORTS : reported
    SURVEY_REPORTS ||--o{ SURVEY_REPORT_PHOTOS : includes
    POINT_ATTACHMENTS ||--o{ SURVEY_REPORT_PHOTOS : references
    SURVEY_REPORTS ||--o| VIOLATION_FOLLOWUPS : triggers

    SURVEY_NOTIFICATIONS ||--o{ REMINDER_RECORDS : reminds
    POINTS ||--o{ REMINDER_RECORDS : concerns
    REMINDER_TEMPLATES ||--o{ REMINDER_RECORDS : snapshots
    REMINDER_RECORDS ||--o{ REMINDER_RECIPIENTS : delivers
    COUNTIES ||--o{ REMINDER_CONTACTS : groups

    USERS ||--o{ AUDIT_LOGS : operates
```

## 3. 帳號權限 ERD

![帳號權限 ERD](assets/diagrams/access-control-erd.svg)

圖檔：[SVG](assets/diagrams/access-control-erd.svg)｜[PNG](assets/diagrams/access-control-erd.png)

```mermaid
erDiagram
    COUNTIES ||--o{ TOWNSHIPS : contains
    COUNTIES ||--o{ ORGANIZATIONS : locates
    ORGANIZATIONS ||--o{ USERS : employs
    USER_APPLICATIONS ||--o| USERS : approves_into
    USERS ||--o{ USER_ROLES : assigned
    ROLES ||--o{ USER_ROLES : grants
    USERS ||--o{ USER_COUNTY_SCOPES : limited_by
    COUNTIES ||--o{ USER_COUNTY_SCOPES : authorizes
    USERS ||--o{ AUDIT_LOGS : operates
```

權限判斷必須同時考慮：

1. 使用者帳號狀態。
2. 使用者擁有的角色。
3. 角色可使用的模組與操作。
4. 地方政府的縣市資料範圍。
5. 空拍廠商的指派專案／範圍。

## 4. 查勘、稽催與違規續處 ERD

![查勘稽催 ERD](assets/diagrams/survey-reminder-erd.svg)

圖檔：[SVG](assets/diagrams/survey-reminder-erd.svg)｜[PNG](assets/diagrams/survey-reminder-erd.png)

```mermaid
erDiagram
    POINTS ||--o{ SURVEY_NOTIFICATIONS : notified
    SURVEY_NOTIFICATIONS ||--o| SURVEY_REPORTS : receives
    SURVEY_REPORTS ||--o{ SURVEY_REPORT_PHOTOS : includes
    POINT_ATTACHMENTS ||--o{ SURVEY_REPORT_PHOTOS : references
    SURVEY_REPORTS ||--o| VIOLATION_FOLLOWUPS : triggers

    SURVEY_NOTIFICATIONS ||--o{ REMINDER_RECORDS : reminds
    REMINDER_SETTINGS ||--o{ REMINDER_RECORDS : controls
    REMINDER_TEMPLATES ||--o{ REMINDER_RECORDS : snapshots
    REMINDER_RECORDS ||--o{ REMINDER_RECIPIENTS : delivers
    REMINDER_CONTACTS ||--o{ REMINDER_RECIPIENTS : resolves
    COUNTIES ||--o{ REMINDER_CONTACTS : groups
```

## 5. 關聯摘要

| 主體 | 關聯 |
|---|---|
| 專案與點位 | 一個專案包含多筆點位 |
| 匯入批次與點位 | 一個批次匯入多筆點位；同點號不得重複建立 |
| 點位與範圍 | 多對多，透過 `point_range_memberships` |
| 點位與階段歷程 | 一對多，每次篩選或狀態變更都新增歷程 |
| 範圍與拍攝指派 | 一對多，允許重新指派或保留歷次指派 |
| 點位與附件 | 一對多 |
| 點位與通報 | 一對多，是否允許重複通報待確認 |
| 通報與查勘回報 | 原則上一筆有效通報對一筆有效回報 |
| 查勘回報與違規續處 | 無違規時沒有續處；需要續處時建立一筆 |
| 通報與稽催 | 一對多，每次寄送不可覆寫 |
| 稽催與收件人 | 一對多，保存寄送當下收件資料快照 |
| 使用者與角色 | 多對多 |
| 使用者與縣市範圍 | 多對多 |

## 6. 尚未定案但不影響總體關係

- AI 成果檔案格式及匯入觸發方式。
- 正式縣市代號表。
- 範圍代號規則。
- PostGIS 是否於第一階段啟用。
- 同一自然地點跨年度出現時的識別規則。
- 違規後續處理資料的正式維護角色。
