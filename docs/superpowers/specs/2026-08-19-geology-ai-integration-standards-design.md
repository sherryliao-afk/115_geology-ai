# 地礦 AI 跨模組整合規格文件設計

> 文件狀態：已完成口頭方向確認，待書面審閱
>
> 設計日期：2026-08-19
>
> 預定讀者：地礦 AI 前端、後端及功能模組工程師

## 1. 目的

產出一組適合放在 GitHub 閱讀的精簡 Markdown 文件，協助三位工程師在分別開發功能模組時，盡量統一前端視覺、API 命名及身分驗證做法，降低最後以檔案拖拉方式整合時的差異。

這些文件屬於系統分析建議，不代表工程團隊已承諾採用，也不宣稱雛型中的展示行為已完成實作。文件必須明確區分「雛型現況」、「SA 建議」及「待工程確認」。

## 2. 已知限制

- 公司目前沒有供工程團隊共同協作的 Git repository。
- 三位工程師可能以檔案拖拉、互相覆蓋的方式整合。
- 沒有明確的最終整合負責人。
- 不要求工程師提供異動清單、套件清單或資料庫異動腳本。
- 本次不規劃單元測試與整合測試規範。
- 規格文件會放在 GitHub 供工程師自行閱讀，但文件本身不具強制力。

因此，本設計採用「可拖拉整合的模組契約」作為過渡方案。它能降低檔名衝突與規格分歧，但不能保證最後可無痛整合。

## 3. 預定交付物

文件放在 `spec/development-standards/`：

1. `README.md`：閱讀入口、文件定位、技術選型與模組對照。
2. `01-frontend-design-system.md`：Design System、Vue/Vite 結構、daisyUI 與 Chart.js 規格。
3. `02-rest-api-guidelines.md`：API 前綴、資源命名、功能模組路由、回傳與錯誤格式。
4. `03-authentication-authorization.md`：帳號生命週期、RBAC、資料範圍、JWT 發放與儲存原則。

每份文件以能快速查表為主，避免教科書式背景說明。必要範例保留，其餘細節連結至官方文件。

## 4. 建議技術基準

以下是延續公司其他平台選型的優先建議，不寫成已定案技術：

- 前端：Vite、Vue 3、Vue Router、Pinia、Tailwind CSS 4、daisyUI。
- 圖表：Chart.js。
- 後端：C# .NET 8 Web API、EF Core 8、PostgreSQL。

若工程團隊採用其他方案，應至少維持本文件定義的色彩語意、API 資源名稱、錯誤語意及 RBAC 邊界。

## 5. 可拖拉整合的模組契約

### 5.1 前端建議結構

```text
src/
├─ core/                  # 應用程式骨架、API client、登入狀態
├─ components/ui/         # 共用 UI 元件
├─ styles/                # Tailwind 與 daisyUI 主題
├─ charts/                # Chart.js 共用設定
└─ modules/
   ├─ identity/
   ├─ dashboard/
   ├─ monitoring/
   ├─ imagery/
   ├─ investigation/
   ├─ reminder/
   ├─ violation/
   ├─ statistics/
   └─ audit/
```

各功能頁、Pinia store、route 定義及 API 呼叫盡量留在自己的模組資料夾。共用骨架與共用元件不應由多位工程師各自建立不同版本。

### 5.2 後端建議結構

後端採相同模組名稱分隔 Controller、Service、DTO 與資料存取程式。跨模組共用的使用者識別、角色、資料範圍及錯誤格式集中在 `Common` 或等價資料夾，不在各模組重複定義。

跨模組交換時統一使用不可變的識別碼，例如 `projectId`、`monitoringAreaId`、`variationPointId`、`surveyCaseId` 與 `userId`，不得以畫面顯示文字作為關聯鍵。

## 6. 前端 Design System 設計

### 6.1 實作方向

- 不再建議加入 Element Plus，避免與既有 Tailwind CSS 4、daisyUI 選型重複。
- 建議建立唯一的 `bmgeo` daisyUI 自訂主題。
- Tailwind 4 theme variables 集中保存設計 Token；Vue 頁面不散落自訂色碼。
- daisyUI 處理按鈕、表單、表格、Badge、Modal、Drawer、Alert 等基礎外觀。
- daisyUI 不具備完整行為的縣市複選、GIS 圖層樹等，再建立少量 Vue 共用元件。

### 6.2 雛型色彩 Token

| 語意 | 色彩 |
|---|---|
| 品牌主色 | `#007D6D` |
| 主色 Hover | `#006B5D` |
| 主色 Pressed | `#005A4D` |
| 主色淡背景／Highlight | `#F4F7F6` |
| Focus Ring | `rgba(0,125,109,0.30)` |
| 頁面背景 | `#F8FAFC` |
| 元件背景 | `#FFFFFF` |
| 主要文字 | `#334155` |
| 次要文字 | `#64748B` |
| Placeholder／停用文字 | `#94A3B8` |
| 一般邊框 | `#E2E8F0` |
| 停用背景 | `#F1F5F9` |

| 狀態 | 背景 | 文字 | 邊框 |
|---|---|---|---|
| 資訊／處理中 | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` |
| 成功／已完成 | `#F0FDF4` | `#15803D` | `#BBF7D0` |
| 警告／待補充 | `#FFF7ED` | `#C2410C` | `#FED7AA` |
| 危險／逾期 | `#FEF2F2` | `#B91C1C` | `#FECACA` |

### 6.3 元件範圍

規格涵蓋按鈕、Icon Button、文字與日期欄位、Select、Checkbox、Switch、縣市複選、查詢條件區、表格、分頁、狀態標籤、頁籤、Accordion、統計卡片、Modal、Drawer、Toast、Alert、檔案上傳、側邊選單、GIS 工具列、圖層面板及圖例。

互動元件至少說明 `default`、`hover`、`focus`、`pressed`、`disabled` 與 `loading` 狀態。文件不要求工程師增加第二套 UI 元件庫。

### 6.4 Chart.js

建議建立共用色盤與預設值，統一圖例、Tooltip、響應式尺寸及空資料畫面。圖表不得只以顏色傳達狀態，每張 Canvas 應有 `aria-label`、替代文字或可讀取的資料摘要。

## 7. REST API 設計

### 7.1 API 前綴

- 優先建議：`/api/v1/{resource}`。
- 團隊若不採路徑版本：接受 `/api/{resource}` 作為過渡方案。
- 同一套系統只能選一種前綴，不可部分有 `v1`、部分沒有。
- 文件以 `{apiBase}` 代表共同前綴。

### 7.2 模組資源名稱

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

### 7.3 共通 API 原則

- 路徑使用英文、小寫、複數名詞及 `kebab-case`。
- 標準操作使用 `GET`、`POST`、`PATCH`、`DELETE`。
- 結案、重新開啟、開通、拒絕、寄送稽催等非 CRUD 流程，才使用 `:close`、`:reopen`、`:approve`、`:reject`、`:send` 等自訂方法。
- JSON 欄位使用 `camelCase`。
- 日期時間使用 ISO 8601 UTC。
- 分頁統一使用 `page`、`pageSize`；清單回傳 `items`、`page`、`pageSize`、`total`。
- 錯誤至少回傳穩定的 `code`、可讀的 `message` 與供追查的 `traceId`。
- `401` 表示尚未通過身分驗證；`403` 表示已登入但沒有功能或資料權限。

## 8. 身分驗證與授權設計

- 建議使用 ASP.NET Core Identity 管理帳號與密碼雜湊，不儲存明碼或可還原密碼。
- JWT Access Token 建議為 15 至 30 分鐘的短效 Token。
- Access Token 不建議存放於 `localStorage` 或 `sessionStorage`；Vue 前端僅保存在 Pinia／記憶體。
- Refresh Token 建議放在 `HttpOnly`、`Secure` Cookie，更新時輪替，後端保存可撤銷的對應紀錄。
- API 驗證 JWT 簽章、issuer、audience 與到期時間。
- JWT 僅保存使用者識別碼、角色等必要資訊，不保存密碼、聯絡資料或大量授權清單。
- 後端每次查詢、下載、匯出及異動都重新檢查角色與資料範圍，不信任前端傳入的角色、縣市或專案條件。
- 帳號停用、註銷或權限變更後，Refresh Token 應失效；登出時清除 Cookie 並撤銷 Refresh Token。
- 系統管理員僅能管理帳號與系統日誌，不得讀取或操作業務資料。

## 9. 文件篇幅與語氣

- 四份交付文件均以精簡、查表、可複製為主。
- 不重複現有的完整功能說明；以相對連結導向 `spec/地礦AI_功能模組與開發分工說明.md`。
- 不納入單元測試、整合測試、Git flow、CI/CD、交付異動紀錄及資料庫 Migration 流程。
- 使用「建議」、「應優先」、「待工程確認」等符合文件定位的語氣，不將 SA 建議寫成工程團隊已承諾事項。

## 10. 參考原則

- [Google Cloud API Design Guide](https://docs.cloud.google.com/apis/design)
- [Google AIP-121 Resource-oriented design](https://google.aip.dev/121)
- [Tailwind CSS 4 Theme variables](https://tailwindcss.com/docs/theme)
- [daisyUI Themes](https://daisyui.com/docs/themes/)
- [Material Design interaction states](https://m3.material.io/foundations/interaction/states/overview)
- [Chart.js Accessibility](https://www.chartjs.org/docs/latest/general/accessibility.html)
- [Microsoft ASP.NET Core JWT bearer authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication)

## 11. 完成條件

- 入口文件能在一頁內說明文件定位、推薦技術與閱讀順序。
- 三份規格各自可獨立閱讀，並以相對連結互相導覽。
- 色票涵蓋品牌、Highlight、Hover、Pressed、Focus、Disabled、Info、Success、Warning 與 Danger。
- API 文件涵蓋九個模組的資源名稱、共同前綴、HTTP 方法、分頁及錯誤格式。
- 身分驗證文件涵蓋帳號狀態、四種角色、資料範圍、JWT 發放、儲存、更新、撤銷及 401／403 語意。
- 所有建議均明示為 SA 建議或待工程確認，不將雛型展示誤寫成完成的正式系統功能。
