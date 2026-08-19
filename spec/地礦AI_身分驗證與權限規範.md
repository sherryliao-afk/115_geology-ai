# 地礦 AI 身分驗證與權限規範

> 文件性質：SA 安全原則建議，實際 Identity Provider、Token 服務與部署方式待工程確認。

[返回開發規格索引](地礦AI_開發規格索引.md)

## 1. 核心原則

- 驗證（Authentication）回答「使用者是誰」；授權（Authorization）回答「可做什麼、可看哪些資料」。
- 前端選單、按鈕及 route 隱藏只改善操作體驗，不能取代後端授權。
- 後端每次查詢、下載、匯出、異動、圖表及圖層請求都重新檢查角色與資料範圍。

## 2. 帳號狀態

| 狀態 | 可否登入 | 說明 |
|---|:---:|---|
| `pending` | 否 | 註冊申請待審核 |
| `active` | 是 | 已開通且未停用 |
| `disabled` | 否 | 暫時停用，可由管理者恢復 |
| `deactivated` | 否 | 已註銷；歷史業務與稽核紀錄保留 |

密碼建議交由 ASP.NET Core Identity 雜湊與驗證，不儲存明碼或可還原密碼。

## 3. 角色與資料範圍

| 角色 | 資料範圍 | 主要限制 |
|---|---|---|
| 地礦中心承辦 | 全國業務資料 | 可管理使用者，不可查看系統日誌 |
| 空拍廠商 | 被指派的專案、年度及拍攝區域 | 不可查看其他廠商或未指派案件 |
| 地方政府人員 | 帳號獲授權的縣市 | 不可查看其他縣市 |
| 系統管理員 | 使用者及系統稽核資料 | 不得看見或操作任何業務功能 |

完整矩陣請見 [功能模組與開發分工說明](地礦AI_功能模組與開發分工說明.md)。

## 4. 建議 JWT 生命週期

| 項目 | SA 建議 |
|---|---|
| Access Token | 15～30 分鐘短效 JWT |
| 前端儲存 | 僅放 Pinia／JavaScript 記憶體 |
| Refresh Token | 放在 `HttpOnly`、`Secure` Cookie，前端 JavaScript 不可讀取 |
| 更新 | Refresh Token 每次使用後輪替，舊 Token 失效 |
| 登出 | 清除 Cookie，並在後端撤銷 Refresh Token |
| 權限異動 | 帳號停用、註銷或重要權限變更後撤銷既有 Refresh Token |

不建議將 Access Token 或 Refresh Token 存在 `localStorage`、`sessionStorage` 或可被前端程式讀取的 Cookie。

參考：[ASP.NET Core JWT bearer authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication)。

## 5. JWT 內容與驗證

JWT 僅放必要 Claims，例如：

```json
{
  "sub": "使用者唯一識別碼",
  "role": "local_government",
  "iss": "地礦AI Token 發行者",
  "aud": "地礦AI API",
  "iat": 1787126400,
  "exp": 1787128200,
  "jti": "Token 唯一識別碼"
}
```

- 不放密碼、電話、Email、完整個資或大量縣市／專案清單。
- API 驗證簽章、`issuer`、`audience`、到期時間及必要 Claims。
- 簽章金鑰不得寫在前端、Git repository 或公開設定檔。
- Token 內角色只供初步判斷；容易變動的縣市及專案授權以後端資料為準。

## 6. Request Flow

1. 使用者登入；後端驗證帳號為 `active`。
2. 後端回傳短效 Access Token，並設定 HttpOnly Refresh Cookie。
3. Vue 將 Access Token 放在 Pinia／記憶體，呼叫 API 時送出 `Authorization: Bearer <token>`。
4. Access Token 到期後，由 Refresh Cookie 換取新 Access Token 並輪替 Refresh Token。
5. 登出、帳號停用或權限撤銷時，後端撤銷 Refresh Token，前端清除記憶體狀態。

## 7. 401 與 403

| 狀態碼 | 情境 | 前端處理建議 |
|---|---|---|
| `401 Unauthorized` | 未提供 Token、Token 無效或過期 | 嘗試更新一次；仍失敗則回登入頁 |
| `403 Forbidden` | 已登入但無功能或資料權限 | 顯示無權限訊息，不反覆嘗試更新 Token |

必要時可用 `404` 隱藏未授權資源是否存在，但同類 API 應採一致策略。

## 8. 後端授權檢查

- 先檢查功能權限，再檢查資料範圍。
- 地礦中心承辦：可查全國業務資料，但不可查系統日誌。
- 空拍廠商：依後端指派關係過濾專案及區域。
- 地方政府人員：依帳號授權縣市過濾。
- 系統管理員：只允許使用者管理與系統日誌 API，拒絕所有業務 API。
- 清單總數、Chart.js 統計、GIS 圖層、附件、下載及匯出都不得洩漏範圍外資料。

## 9. 建議留存的安全事件

- 登入成功、登入失敗、登出及 Refresh Token 撤銷。
- 帳號開通、拒絕、停用、恢復、註銷。
- 角色、縣市及專案授權異動前後值。
- 被拒絕的重要操作、結案／取消結案及稽催通知。

日誌不得記錄密碼、完整 JWT、Refresh Token 或敏感附件內容。

## 10. 工程確認清單

- [ ] 採 ASP.NET Core Identity 自行管理，或介接既有 OIDC／Identity Provider。
- [ ] Access Token 與 Refresh Token 實際有效時間。
- [ ] JWT 簽章演算法、金鑰保存及輪替方式。
- [ ] Refresh Token 撤銷紀錄保存位置與清理週期。
- [ ] 前端與 API 的網域、Cookie Domain、SameSite 及 CORS 設定。
- [ ] 帳號權限變更後立即失效或最長容許延遲時間。
