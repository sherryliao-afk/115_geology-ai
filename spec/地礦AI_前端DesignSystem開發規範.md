# 地礦 AI 前端 Design System 開發規範

> 文件性質：SA 優先建議，待工程團隊確認。
>
> 證據範圍：色彩與元件來自目前 `index.html` 雛型；Vue 專案結構及套件使用方式屬建議，並非已完成實作。

[返回開發規格索引](地礦AI_開發規格索引.md)

## 1. 建議技術

- Vite、Vue 3、Vue Router、Pinia。
- Tailwind CSS 4＋daisyUI；不再增加第二套完整 UI 元件庫。
- Chart.js 作為統計圖表共用套件。
- 字型使用 `Noto Sans TC`，一般內文建議 14px，輔助文字不小於 12px。

## 2. Design Tokens

### 2.1 品牌與中性色

| Token | 用途 | 色彩 |
|---|---|---|
| `brand-primary` | 主要按鈕、選取、連結 | `#007D6D` |
| `brand-hover` | Primary Hover | `#006B5D` |
| `brand-pressed` | Primary Pressed | `#005A4D` |
| `brand-highlight` | 選取列、淡色提示 | `#F4F7F6` |
| `focus-ring` | 鍵盤 Focus Ring | `rgba(0,125,109,0.30)` |
| `page` | 頁面背景 | `#F8FAFC` |
| `surface` | 卡片、Modal、Drawer | `#FFFFFF` |
| `text-primary` | 標題及主要內容 | `#334155` |
| `text-secondary` | 說明及次要內容 | `#64748B` |
| `text-disabled` | Placeholder、停用文字 | `#94A3B8` |
| `border` | 一般邊框 | `#E2E8F0` |
| `disabled-bg` | 停用背景 | `#F1F5F9` |

### 2.2 狀態色

| 狀態 | 背景 | 文字 | 邊框 |
|---|---|---|---|
| Info／處理中 | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` |
| Success／已完成 | `#F0FDF4` | `#15803D` | `#BBF7D0` |
| Warning／待補充 | `#FFF7ED` | `#C2410C` | `#FED7AA` |
| Danger／逾期或錯誤 | `#FEF2F2` | `#B91C1C` | `#FECACA` |

狀態不能只靠顏色判斷，需同時顯示文字或圖示。

## 3. Tailwind 4＋daisyUI 主題

建議只建立一個 `bmgeo` 主題，並在共用 CSS 集中定義；各 `.vue` 頁面避免直接散落 Hex 色碼。

```css
@import "tailwindcss";

@plugin "daisyui" {
  themes: bmgeo --default;
}

@plugin "daisyui/theme" {
  name: "bmgeo";
  default: true;
  color-scheme: light;
  --color-primary: #007d6d;
  --color-primary-content: #ffffff;
  --color-base-100: #ffffff;
  --color-base-200: #f8fafc;
  --color-base-300: #e2e8f0;
  --color-base-content: #334155;
  --color-info: #1d4ed8;
  --color-success: #15803d;
  --color-warning: #c2410c;
  --color-error: #b91c1c;
  --radius-field: 0.5rem;
  --radius-box: 0.75rem;
  --border: 1px;
}

@theme {
  --color-brand-hover: #006b5d;
  --color-brand-pressed: #005a4d;
  --color-brand-highlight: #f4f7f6;
  --font-sans: "Noto Sans TC", sans-serif;
}
```

參考：[Tailwind Theme Variables](https://tailwindcss.com/docs/theme)、[daisyUI Themes](https://daisyui.com/docs/themes/)。

## 4. 共用互動狀態

| 狀態 | 建議呈現 |
|---|---|
| Default | 使用元件預設背景、文字與邊框 |
| Hover | Primary 改為 `#006B5D`；次要元件使用淡背景 |
| Focus | 顯示清楚的 `focus-ring`，不可只移除 outline |
| Pressed | Primary 改為 `#005A4D` |
| Disabled | `#F1F5F9` 背景、`#94A3B8` 文字、禁止點擊游標 |
| Loading | 保留原寬度，顯示 Spinner 並禁止重複送出 |

## 5. UI 元件對照

| 元件 | 建議基礎 | 統一重點 |
|---|---|---|
| Primary Button | `btn btn-primary` | 儲存、送出、確認；同區只保留一個主要操作 |
| Secondary Button | `btn btn-outline` | 取消、返回、次要操作 |
| Danger Button | `btn btn-error` | 註銷、刪除等高風險操作，需再次確認 |
| Icon Button | `btn btn-ghost btn-square` | 必須有 `aria-label` 或 Tooltip |
| Input／Textarea | `input`／`textarea` | Label、錯誤訊息及必填標示位置一致 |
| Select／日期 | `select`／原生日期欄位 | 不同模組不自訂另一套高度與圓角 |
| Checkbox／Switch | `checkbox`／`toggle` | Switch 只用於立即生效的開關 |
| 縣市複選 | Vue 共用元件 | 統一全選、清除、套用與停用行為 |
| 查詢條件區 | Card＋欄位 Grid | 重設在前、查詢在後；欄位順序維持一致 |
| Table | `table` | 表頭、列 Hover、空資料、載入中與操作欄一致 |
| Pagination | `join`＋Button | 顯示目前頁及總筆數，停用不可用按鈕 |
| Status Badge | `badge` | 使用 Info／Success／Warning／Danger 語意色 |
| Tabs／Accordion | `tabs`／`collapse` | Active、Focus 狀態必須可辨識 |
| Card／統計卡 | `card`／`stat` | 數字、單位、資料範圍及更新時間分開呈現 |
| Modal | `modal` | 短表單及確認；Esc／關閉不儲存 |
| Drawer | `drawer` | 較長明細或編輯；標題及操作區固定 |
| Toast／Alert | `toast`／`alert` | Toast 用短暫結果；需處理的錯誤留在頁面 |
| Upload | `file-input` | 顯示格式、大小、進度、成功與失敗狀態 |
| Sidebar | `menu` | Active、Hover、收合及角色可見性一致 |
| GIS 工具列 | 共用 Vue 元件 | 圖示、Tooltip、選取、停用與互斥工具一致 |
| 圖層面板／圖例 | 共用 Vue 元件 | 圖層勾選、透明度、圖例色彩與資料範圍一致 |

## 6. Chart.js

### 6.1 共用色盤

`#007D6D`、`#2563EB`、`#F59E0B`、`#EF4444`、`#16A34A`、`#7C3AED`、`#0284C7`。

### 6.2 共用規則

- 圖表放在有明確高度的響應式容器，建議 `responsive: true`、`maintainAspectRatio: false`。
- 同一指標跨頁使用同一色彩；Warning 與 Danger 不挪作一般分類色。
- Tooltip 使用完整名稱、數值及單位；Legend 順序與資料順序相同。
- 無資料時顯示文字空狀態，不呈現全為零的誤導圖表。
- Canvas 提供 `role="img"`、`aria-label`，或在旁提供相同數據摘要。
- 下載及匯出仍受角色與資料範圍限制。

參考：[Chart.js Responsive Charts](https://www.chartjs.org/docs/latest/configuration/responsive.html)、[Chart.js Accessibility](https://www.chartjs.org/docs/latest/general/accessibility.html)。

## 7. 建議目錄

```text
src/
├─ core/                  # API client、登入狀態、共用路由骨架
├─ components/ui/         # 共用 UI 元件
├─ styles/                # Tailwind 4 與 bmgeo 主題
├─ charts/                # Chart.js 色盤與預設值
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

各模組的 page、route、store 及 API 呼叫盡量留在自己的資料夾；`core` 與共用 UI 避免由多人各自建立不同版本。

## 8. 待工程確認

- 實際 Vue、Tailwind CSS、daisyUI 及 Chart.js 版本。
- 是否需要支援舊版 Edge／IE；Vue 3 與 Tailwind CSS 4 不以 IE 為支援目標。
- 共用元件由誰維護，以及 GIS 元件採用何種圖台函式庫。
