# 地礦 AI 抽象資料表設計規格

版本：草案 v1
資料庫方向：PostgreSQL／EF Core 8
設計層級：邏輯資料模型，供需求確認與模組整合使用

## 1. 設計目的

本文件先定義共用資料主體、資料關係及各模組應共用的狀態，不在此階段鎖定所有 PostgreSQL 型別、索引、長度或 migration 寫法。

核心原則：

1. 建議監測、監測區位、判釋變異是同一批點位的一條龍處理流程。
2. 全系統只建立一張核心點位表 `points`。
3. 模組篩選掉的點位仍保存，只更新階段註記及排除原因。
4. 畫面上的點號由 AI 判釋成果提供，本系統不重新編號。
5. 系統內部關聯使用穩定主鍵，不以可變動的顯示點號作為所有 FK。
6. 範圍是點位的群組／圖形，不是另一種點位。
7. 附件、查勘、稽催及狀態歷程獨立保存，避免核心點位表無限擴張。
8. 雛型假資料 `MG`、`SP` 不納入正式命名規則。

## 2. 核心點位流程

| 階段 | 畫面模組 | 對同一筆點位的處理 |
|---|---|---|
| 1 | AI 判釋成果匯入 | 建立或更新 `points` |
| 2 | 建議監測點位 | 標記建議監測或未達監測標準 |
| 3 | 監測區位選定 | 標記是否納入監測／拍攝 |
| 4 | 空拍與成果上傳 | 記錄拍攝指派、執行及附件 |
| 5 | 判釋變異點 | 標記確認變異或無變異 |
| 6 | 通報地方政府 | 建立查勘通知及期限 |
| 7 | 查勘回報 | 保存查勘結果、違規資訊及照片 |
| 8 | 稽催／違規續處 | 保存寄送歷程或後續處理結果 |
| 9 | 結案 | 更新案件狀態並保存歷程 |

各模組不複製點位；畫面差異由查詢條件及角色資料範圍形成。

## 3. 資料領域總覽

| 領域 | 主要資料表 |
|---|---|
| 組織與行政區 | `organizations`、`counties`、`townships` |
| 帳號與權限 | `user_applications`、`users`、`roles`、`user_roles`、`user_county_scopes` |
| 專案與匯入 | `projects`、`point_import_batches` |
| 點位與範圍 | `points`、`monitoring_ranges`、`point_range_memberships`、`point_stage_history` |
| 拍攝與成果 | `capture_assignments`、`imagery_records`、`point_attachments` |
| 通報與查勘 | `survey_notifications`、`survey_reports`、`survey_report_photos` |
| 違規續處 | `violation_followups` |
| 稽催 | `reminder_settings`、`reminder_templates`、`reminder_contacts`、`reminder_records`、`reminder_recipients` |
| 圖台 | `gis_layers`、`range_geometries` |
| 稽核 | `audit_logs` |

## 4. 組織與行政區

### 4.1 `organizations`

保存地礦中心、地方政府、空拍廠商及其他申請單位。

| 邏輯欄位 | 用途 |
|---|---|
| `organization_id` | 內部主鍵 |
| `organization_code` | 單位代碼 |
| `organization_name` | 單位名稱 |
| `organization_type` | 中央機關、地方政府、廠商、其他 |
| `county_id` | 地方政府所屬縣市；其他單位可空白 |
| `status` | 啟用、停用 |

### 4.2 `counties`

| 邏輯欄位 | 用途 |
|---|---|
| `county_id` | 內部主鍵 |
| `county_code` | 點號及資料交換使用的縣市代號 |
| `county_name` | 縣市名稱 |
| `sort_order` | 顯示順序 |
| `status` | 啟用、停用 |

### 4.3 `townships`

| 邏輯欄位 | 用途 |
|---|---|
| `township_id` | 內部主鍵 |
| `county_id` | 所屬縣市 |
| `township_code` | 鄉鎮市區代碼 |
| `township_name` | 鄉鎮市區名稱 |
| `status` | 啟用、停用 |

點號只使用縣市代號；鄉鎮市區不參與點號組成。

## 5. 帳號與權限

### 5.1 `user_applications`

帳號申請在核准前獨立保存，不直接建立正式登入權限。

| 邏輯欄位 | 用途 |
|---|---|
| `application_id` | 申請主鍵 |
| `requested_account` | 申請帳號 |
| `email` | 電子信箱 |
| `password_hash` | 密碼雜湊；不得保存明碼 |
| `county_id` | 申請所屬縣市 |
| `organization_name` | 申請單位名稱 |
| `applicant_name` | 申請人姓名 |
| `phone` | 聯絡電話 |
| `mobile` | 聯絡手機 |
| `other_contact` | 其他聯絡方式 |
| `requested_role_id` | 申請角色 |
| `application_status` | 待審核、核准、拒絕、取消 |
| `reviewed_by` | 審核人 |
| `reviewed_at` | 審核時間 |
| `rejection_reason` | 拒絕原因 |

### 5.2 `users`

| 邏輯欄位 | 用途 |
|---|---|
| `user_id` | 內部主鍵 |
| `account` | 登入帳號，唯一 |
| `display_name` | 姓名／顯示名稱 |
| `email` | Email |
| `password_hash` | 密碼雜湊 |
| `organization_id` | 所屬單位 |
| `account_status` | 待啟用、已開通、停用、註銷、鎖定 |
| `last_login_at` | 最後登入時間 |
| `application_id` | 來源申請；既有帳號可空白 |

### 5.3 `roles`

| 邏輯欄位 | 用途 |
|---|---|
| `role_id` | 主鍵 |
| `role_code` | 系統管理員、地礦中心承辦、空拍廠商、地方政府人員、唯讀 |
| `role_name` | 顯示名稱 |
| `status` | 啟用、停用 |

### 5.4 `user_roles`

一個帳號可有多個角色。

| 邏輯欄位 | 用途 |
|---|---|
| `user_id` | 使用者 |
| `role_id` | 角色 |
| `granted_by` | 授權人 |
| `granted_at` | 授權時間 |

### 5.5 `user_county_scopes`

地方政府或唯讀角色可被授權多個縣市。

| 邏輯欄位 | 用途 |
|---|---|
| `user_id` | 使用者 |
| `county_id` | 容許縣市 |
| `granted_by` | 授權人 |
| `granted_at` | 授權時間 |

## 6. 專案與 AI 成果匯入

### 6.1 `projects`

| 邏輯欄位 | 用途 |
|---|---|
| `project_id` | 專案主鍵 |
| `project_code` | 專案代碼 |
| `project_name` | 專案名稱 |
| `project_year` | 專案年度，例如民國 115 年 |
| `project_status` | 草稿、進行中、已結案 |
| `start_date` | 開始日期 |
| `end_date` | 結束日期 |

### 6.2 `point_import_batches`

AI 判釋工程師將成果檔匯入專案資料夾後，本系統以批次方式讀取。檔案格式及自動／人工觸發方式後續確認。

| 邏輯欄位 | 用途 |
|---|---|
| `import_batch_id` | 匯入批次主鍵 |
| `project_id` | 所屬專案 |
| `source_filename` | 原始檔名 |
| `file_checksum` | 判斷同一檔案是否重複 |
| `imported_at` | 匯入時間 |
| `imported_by` | 執行者或系統帳號 |
| `total_count` | 總筆數 |
| `success_count` | 成功筆數 |
| `failed_count` | 失敗筆數 |
| `import_status` | 處理中、成功、部分成功、失敗 |
| `error_summary` | 批次錯誤摘要 |

匯入原則：

- 同一點號重複匯入時不得建立重複點位。
- 新檔案缺少既有點位時不得自動刪除舊點位。
- 匯入失敗不應留下半套不可辨識資料。

## 7. 核心點位與範圍

### 7.1 `points`

全系統唯一的核心點位表。

#### 識別與來源

| 邏輯欄位 | 用途 |
|---|---|
| `point_id` | 內部穩定主鍵 |
| `project_id` | 所屬專案 |
| `import_batch_id` | 最初或最近匯入來源 |
| `point_code` | AI 提供的正式點號 |
| `project_quarter` | 專案季度，例如 Q1、Q2 |
| `source_type` | AI 判釋為目前已知來源；人工新增、圖台圈繪僅為雛型待確認項目 |
| `source_reference` | 外部來源識別或檔案內代碼 |

點號格式目前定義為：

```text
<專案年度><專案季度>_<縣市代號>_<流水編號>
```

例如 `115Q2_KH_003`。實際縣市代碼表後續確認；本系統不產生或改寫 AI 提供的點號。若未來保留雛型中的手動新增功能，點號取得方式必須另行定義，目前不得假設由本系統自動編號。

#### 行政區、地籍與座標

| 邏輯欄位 | 用途 |
|---|---|
| `county_id` | 縣市 |
| `township_id` | 鄉鎮市區 |
| `land_section` | 地段 |
| `land_number` | 地號 |
| `approximate_location` | 大約地點文字 |
| `twd97_x` | TWD97 X |
| `twd97_y` | TWD97 Y |
| `longitude` | 經度 |
| `latitude` | 緯度 |
| `point_geometry` | 建議以 PostGIS 保存點幾何；未安裝時可後補 |

#### 判釋與估算

| 邏輯欄位 | 用途 |
|---|---|
| `monitoring_method` | 衛星、無人載具、其他 |
| `t1_image_date` | 前期影像日期 |
| `t2_image_date` | 後期影像日期 |
| `interpretation_date` | 判釋日期 |
| `estimated_area` | 估計面積 |
| `estimated_earth_volume` | 估計土方量 |
| `notes` | 點位備註 |

#### 一條龍階段註記

| 邏輯欄位 | 建議狀態 |
|---|---|
| `suggestion_status` | 待確認、建議監測、不建議監測 |
| `suggestion_rejection_reason` | 未達監測標準等排除原因 |
| `monitoring_status` | 待選定、已選定、不納入監測 |
| `capture_status` | 未指派、已指派、拍攝中、已完成 |
| `interpretation_status` | 待判釋、確認變異、無變異 |
| `notification_status` | 未通報、已通報 |
| `survey_status` | 未查勘、已查勘、逾期 |
| `followup_status` | 不需續處、待續處、處理中、已完成 |
| `case_status` | 處理中、已結案、重新開啟 |
| `current_stage` | 目前流程階段，供畫面快速查詢 |

狀態欄位供目前畫面快速查詢；完整異動仍寫入 `point_stage_history`。

### 7.2 `monitoring_ranges`

保存圖台圈繪的範圍／群組。範圍不是另一種點位。

| 邏輯欄位 | 用途 |
|---|---|
| `range_id` | 主鍵 |
| `project_id` | 所屬專案 |
| `range_code` | 顯示代碼；正式規則後續確認 |
| `range_name` | 範圍名稱 |
| `range_status` | 草稿、待確認、已確認、取消 |
| `area_value` | 範圍面積 |
| `created_source` | 圖台圈繪、廠商補繪等 |

### 7.3 `range_geometries`

| 邏輯欄位 | 用途 |
|---|---|
| `range_geometry_id` | 主鍵 |
| `range_id` | 所屬範圍 |
| `geometry` | Polygon／MultiPolygon |
| `geometry_version` | 圖形版本 |
| `created_by` | 建立者 |
| `created_at` | 建立時間 |

### 7.4 `point_range_memberships`

支援一個範圍包含多個點位，也保留點位被重新分組的可能。

| 邏輯欄位 | 用途 |
|---|---|
| `range_id` | 範圍 |
| `point_id` | 點位 |
| `membership_status` | 有效、移除 |
| `added_at` | 加入時間 |
| `removed_at` | 移除時間 |

### 7.5 `point_stage_history`

| 邏輯欄位 | 用途 |
|---|---|
| `history_id` | 主鍵 |
| `point_id` | 點位 |
| `stage` | 建議監測、監測選定、拍攝、判釋、通報、查勘、續處、結案 |
| `previous_status` | 異動前狀態 |
| `new_status` | 異動後狀態 |
| `decision` | 通過、排除、退回、重開等 |
| `reason` | 原因 |
| `operated_by` | 操作者 |
| `operated_at` | 操作時間 |

## 8. 拍攝、影像與附件

### 8.1 `capture_assignments`

| 邏輯欄位 | 用途 |
|---|---|
| `capture_assignment_id` | 主鍵 |
| `range_id` | 指派範圍 |
| `organization_id` | 空拍廠商 |
| `notification_date` | 通知日期 |
| `planned_execution_date` | 預計執行日期 |
| `actual_execution_date` | 實際執行日期 |
| `expected_report_date` | 預計報告日期 |
| `actual_report_date` | 實際報告日期 |
| `assignment_status` | 待執行、執行中、已完成、取消 |

### 8.2 `imagery_records`

| 邏輯欄位 | 用途 |
|---|---|
| `imagery_id` | 主鍵 |
| `project_id` | 專案 |
| `point_id` | 對應點位；整區影像可空白 |
| `range_id` | 對應範圍；單點影像可空白 |
| `imagery_title` | 影像標題 |
| `imagery_type` | 衛星、UAV、直升機等 |
| `capture_date` | 拍攝日期 |
| `provider_organization_id` | 提供單位 |
| `period_role` | T1、T2、其他 |
| `coverage_geometry` | 影像涵蓋範圍，選用 |

### 8.3 `point_attachments`

統一保存檔案 metadata；檔案本體可存檔案系統或物件儲存空間。

| 邏輯欄位 | 用途 |
|---|---|
| `attachment_id` | 主鍵 |
| `point_id` | 所屬點位 |
| `attachment_type` | T1、T2、KML、判釋報告、體積比對圖、現場照片、公文等 |
| `original_filename` | 原始檔名 |
| `storage_path` | 儲存位置 |
| `content_type` | MIME type |
| `file_size` | 檔案大小 |
| `file_checksum` | 檔案雜湊 |
| `uploaded_by` | 上傳者 |
| `uploaded_at` | 上傳時間 |
| `status` | 有效、取代、刪除標記 |

## 9. 通報、查勘及違規續處

### 9.1 `survey_notifications`

| 邏輯欄位 | 用途 |
|---|---|
| `notification_id` | 主鍵 |
| `point_id` | 點位 |
| `county_id` | 通報縣市 |
| `notification_date` | 通報日期 |
| `survey_due_date` | 查勘期限 |
| `notified_by` | 通報人 |
| `notification_status` | 草稿、已通報、取消 |
| `notice_content` | 通報摘要；是否需要正式欄位待確認 |

### 9.2 `survey_reports`

| 邏輯欄位 | 用途 |
|---|---|
| `survey_report_id` | 主鍵 |
| `notification_id` | 對應通報 |
| `point_id` | 點位 |
| `survey_date` | 查勘日期 |
| `survey_result` | 尚未查勘、無違規、確認違規等 |
| `violation_type` | 土石採取法、區域計畫法、水土保持法、其他 |
| `violation_description` | 違規說明 |
| `report_description` | 查勘回報內容 |
| `is_overdue_override` | 人工逾期註記；是否保留待確認 |
| `requires_followup` | 是否移請相關單位續處 |
| `submitted_by` | 填報人 |
| `submitted_at` | 送出時間 |
| `report_status` | 草稿、已送出、退回、已鎖定 |

查勘結果與違規類型應分成不同欄位，不沿用雛型共用下拉選單的資料結構。

### 9.3 `survey_report_photos`

| 邏輯欄位 | 用途 |
|---|---|
| `survey_report_id` | 查勘回報 |
| `attachment_id` | 現場照片 |
| `display_order` | 顯示順序 |
| `caption` | 照片說明，選用 |

### 9.4 `violation_followups`

| 邏輯欄位 | 用途 |
|---|---|
| `followup_id` | 主鍵 |
| `survey_report_id` | 來源查勘回報 |
| `point_id` | 點位 |
| `followup_status` | 待處理、處理中、已完成 |
| `transfer_required` | 是否移交其他機關 |
| `transfer_organization_id` | 移交單位 |
| `transfer_date` | 移交日期 |
| `document_number` | 文號 |
| `disposition` | 處分／後續處理情形 |
| `updated_by` | 最後更新人 |
| `updated_at` | 最後更新時間 |

目前雛型只證明此資料可查詢／檢視，實際維護角色與來源仍待確認。

## 10. 稽催管理

### 10.1 `reminder_settings`

| 邏輯欄位 | 用途 |
|---|---|
| `reminder_setting_id` | 主鍵 |
| `first_overdue_days` | 第一次稽催門檻 |
| `repeat_overdue_days` | 後續稽催門檻 |
| `notify_center_by_email` | 是否寄送地礦中心 |
| `show_system_popup` | 是否顯示系統通知 |
| `status` | 啟用、停用 |

### 10.2 `reminder_templates`

| 邏輯欄位 | 用途 |
|---|---|
| `template_id` | 主鍵 |
| `template_name` | 模板名稱 |
| `subject` | 主旨 |
| `body` | 內文 |
| `status` | 啟用、停用 |

### 10.3 `reminder_contacts`

| 邏輯欄位 | 用途 |
|---|---|
| `contact_id` | 主鍵 |
| `county_id` | 所屬縣市群組 |
| `name` | 姓名 |
| `email` | Email |
| `job_title` | 職稱 |
| `status` | 啟用、停用 |

### 10.4 `reminder_records`

每次寄送獨立新增，不覆寫歷史紀錄。

| 邏輯欄位 | 用途 |
|---|---|
| `reminder_id` | 主鍵 |
| `notification_id` | 對應查勘通報 |
| `point_id` | 點位 |
| `template_id` | 使用模板 |
| `reminder_round` | 第幾次稽催 |
| `sent_at` | 發送時間 |
| `subject_snapshot` | 寄送當下主旨 |
| `body_snapshot` | 寄送當下內文 |
| `send_status` | 待發送、成功、部分成功、失敗 |
| `sent_by` | 系統或人工補發者 |

### 10.5 `reminder_recipients`

| 邏輯欄位 | 用途 |
|---|---|
| `reminder_recipient_id` | 主鍵 |
| `reminder_id` | 稽催紀錄 |
| `contact_id` | 聯絡人；額外 Email 可空白 |
| `recipient_name` | 寄送當下姓名快照 |
| `recipient_email` | 寄送當下 Email 快照 |
| `recipient_type` | 收件人、副本、額外收件人 |
| `delivery_status` | 成功、失敗 |

## 11. 圖台與系統稽核

### 11.1 `gis_layers`

| 邏輯欄位 | 用途 |
|---|---|
| `layer_id` | 主鍵 |
| `layer_code` | 圖層代碼 |
| `layer_name` | 圖層名稱 |
| `layer_type` | 底圖、參考圖層、業務圖層 |
| `service_url` | 圖層服務位置 |
| `status` | 啟用、停用 |

### 11.2 `audit_logs`

| 邏輯欄位 | 用途 |
|---|---|
| `audit_log_id` | 主鍵 |
| `occurred_at` | 操作時間 |
| `user_id` | 操作者 |
| `account_snapshot` | 當時帳號 |
| `display_name_snapshot` | 當時姓名 |
| `action_type` | 登入、登出、新增、修改、刪除、上下載、Email、帳號審核 |
| `target_type` | 操作資料種類 |
| `target_id` | 操作資料主鍵 |
| `target_label` | 畫面顯示的操作對象 |
| `ip_address` | IP 位址 |
| `description` | 說明 |
| `before_values` | 異動前摘要，必要時保存 |
| `after_values` | 異動後摘要，必要時保存 |

## 12. 各畫面對 `points` 的查詢概念

| 畫面 | 查詢概念 |
|---|---|
| 建議監測點位 | 顯示匯入或人工建立的候選點位及 `suggestion_status` |
| 監測區位選定 | 顯示已建議監測、待決定是否拍攝的點位 |
| 判釋變異點 | 顯示已完成拍攝且進入判釋的點位 |
| 地方政府查勘 | 顯示確認變異且已通報至該使用者授權縣市的點位 |
| 逾期未查勘 | 顯示已通報、期限已過且未完成查勘的點位 |
| 違規後續處理 | 顯示查勘結果確認違規或需移交續處的點位 |

API 必須依角色、專案及縣市資料範圍限制結果，不能只靠前端隱藏選單。

## 13. 不建議的設計

- 不建立 `suggested_points`、`monitoring_points`、`variation_points` 三張重複主表。
- 不因點位被篩選掉就刪除資料。
- 不使用點號作為所有資料表的實體 FK。
- 不把所有附件直接塞進 `points`。
- 不把查勘結果和違規法規混成同一個狀態欄位。
- 不只保存最後一次稽催內容而覆寫歷史。
- 不把縣市／鄉鎮／地段／地號永久保存成一個無法拆解的字串。
- 不依雛型假代號 MG／SP 建立特殊資料表。

## 14. 待確認但不阻礙 ERD 的事項

1. AI 成果檔案格式與匯入觸發方式。
2. 正式縣市代號表。
3. 範圍代號是否需要正式規則。
4. 通報內容是否需要保存完整公文資料。
5. 違規後續處理由哪個角色／畫面維護。
6. PostGIS 是否納入正式環境；未納入時先保存座標與圖資檔案。
7. 點位跨年度重複出現時，是同一自然地點的新監測紀錄，還是延續同一點位。
