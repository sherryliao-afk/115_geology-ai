# 地礦 AI REST API 開發規範

> 文件性質：SA 優先建議，API 尚未實作或定案時，以下名稱均待工程確認。

[返回開發規格索引](地礦AI_開發規格索引.md)

## 1. API 前綴

- 優先建議：`/api/v1/{resource}`。
- 團隊若沒有 API 版本路徑習慣，可先使用 `/api/{resource}`。
- 同一套系統只能選一種，不可部分有 `v1`、部分沒有。
- 本文件以 `{apiBase}` 代表最後選定的共同前綴。

## 2. 命名原則

- URL 使用英文、小寫、複數名詞及 `kebab-case`。
- JSON 欄位使用 `camelCase`。
- 日期時間使用 ISO 8601 UTC，例如 `2026-08-19T08:30:00Z`。
- `GET` 查詢、`POST` 新增、`PATCH` 部分修改、`DELETE` 刪除。
- 避免 `/getUser`、`/queryList`、`/saveData` 等動詞路徑。
- 跨模組識別碼建立後不變，不使用畫面中文名稱作為關聯鍵。

參考：[Google Cloud API Design Guide](https://docs.cloud.google.com/apis/design)、[AIP-121 Resource-oriented design](https://google.aip.dev/121)。

## 3. 模組與資源名稱

| 模組 | 建議 API 資源 | 主要負責 |
|---|---|---|
| identity | `/sessions`、`/registration-applications`、`/users`、`/roles` | 守陽 |
| dashboard | `/dashboard-summaries`、`/notifications` | 守陽 |
| monitoring | `/monitoring-projects`、`/suggested-monitoring-points`、`/monitoring-areas`、`/aerial-surveys` | 育萱 |
| imagery | `/map-layers`、`/aerial-images`、`/map-features` | 金億 |
| investigation | `/interpretation-results`、`/variation-points`、`/survey-cases`、`/survey-reports` | 育萱 |
| reminder | `/survey-reminders`、`/reminder-settings`、`/notification-templates`、`/notification-contacts` | 金億 |
| violation | `/violation-cases`、`/violation-follow-ups` | 育萱 |
| statistics | `/monitoring-statistics`、`/survey-statistics`、`/violation-statistics` | 守陽 |
| audit | `/audit-logs` | 守陽 |

## 4. 路由範例

```http
GET    {apiBase}/monitoring-projects
GET    {apiBase}/monitoring-projects/{projectId}
POST   {apiBase}/suggested-monitoring-points
PATCH  {apiBase}/suggested-monitoring-points/{pointId}
GET    {apiBase}/monitoring-areas/{monitoringAreaId}
GET    {apiBase}/monitoring-areas/{monitoringAreaId}/variation-points
POST   {apiBase}/survey-cases/{surveyCaseId}/survey-reports
GET    {apiBase}/violation-cases
GET    {apiBase}/audit-logs
```

結案、重新開啟、審核及發送通知無法自然對應 CRUD 時，才使用自訂動作：

```http
POST {apiBase}/survey-cases/{surveyCaseId}:close
POST {apiBase}/survey-cases/{surveyCaseId}:reopen
POST {apiBase}/registration-applications/{applicationId}:approve
POST {apiBase}/registration-applications/{applicationId}:reject
POST {apiBase}/survey-reminders/{reminderId}:send
```

## 5. 查詢與分頁

統一使用 `page`、`pageSize`，不要混用 `pageNo`、`limit`、`rows`。

```http
GET {apiBase}/survey-cases?page=1&pageSize=20&countyCode=KHH&status=overdue
```

```json
{
  "items": [
    {
      "surveyCaseId": "2f0d5a0b-14ac-4f10-a556-ea71ae5e88dd",
      "status": "overdue",
      "countyCode": "KHH"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 68
}
```

## 6. 單筆與錯誤回傳

單筆資源直接回傳資料，不再包多層 `data`：

```json
{
  "monitoringAreaId": "5dbb4587-fb93-4fd6-b7a1-a5432e33cc55",
  "projectId": "115-Q2",
  "status": "selected",
  "updatedAt": "2026-08-19T08:30:00Z"
}
```

錯誤格式固定：

```json
{
  "error": {
    "code": "SURVEY_CASE_FORBIDDEN",
    "message": "無權存取此查勘案件。",
    "traceId": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
  }
}
```

前端顯示 `message`；工程追查使用穩定的 `code` 與 `traceId`。

## 7. HTTP 狀態碼

| 狀態碼 | 用途 |
|---|---|
| `200` | 查詢或修改成功 |
| `201` | 資源建立成功 |
| `204` | 成功且不需回傳內容 |
| `400` | 格式或參數錯誤 |
| `401` | 未登入、Token 無效或已到期 |
| `403` | 已登入，但無功能或資料權限 |
| `404` | 資源不存在，或基於安全考量不揭露其存在 |
| `409` | 狀態衝突或重複操作 |
| `500` | 未預期的伺服器錯誤；不得回傳 Stack Trace |

## 8. 跨模組契約

建議固定使用：`projectId`、`monitoringAreaId`、`variationPointId`、`surveyCaseId`、`userId`。

- 前端傳入的 `countyCode`、`projectId`、`role`、`userId` 只是查詢條件，不是授權證明。
- 後端依目前登入者重新判斷全國、授權縣市或指派專案範圍。
- 下載、匯出、Chart.js 統計與 GIS 圖層 API 使用相同權限規則。
- 系統管理員的 Token 不得因此取得業務 API 權限。

## 9. 待工程確認

- 最終採用 `/api/v1` 或 `/api`。
- ID 使用 UUID、既有流水號或兩者並存的轉換方式。
- OpenAPI／Swagger 的產出與欄位描述方式。
- 大型檔案上傳、KML、報告及影像下載的限制與儲存位置。
