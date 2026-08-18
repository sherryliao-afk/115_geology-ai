import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const outputDir = path.join(projectRoot, "documents", "development", "assets", "diagrams");
await fs.mkdir(outputDir, { recursive: true });

const colors = {
  primary: "#007D6D",
  primaryDark: "#065F56",
  primarySoft: "#DDF4EF",
  navy: "#183B56",
  text: "#243746",
  muted: "#64748B",
  line: "#CBD5E1",
  soft: "#F8FAFC",
  denied: "#E2E8F0",
  deniedText: "#94A3B8",
  white: "#FFFFFF",
  purple: "#7C3AED",
  purpleSoft: "#EDE9FE",
  blue: "#2563EB",
  blueSoft: "#DBEAFE",
  green: "#15803D",
  greenSoft: "#DCFCE7",
  amber: "#B45309",
  amberSoft: "#FEF3C7",
  orange: "#C2410C",
  orangeSoft: "#FFEDD5",
};

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function text(x, y, value, options = {}) {
  const {
    size = 24,
    weight = 400,
    fill = colors.text,
    anchor = "start",
    lines = null,
    lineHeight = Math.round(size * 1.35),
  } = options;
  const content = lines ?? [value];
  const tspans = content
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}">${tspans}</text>`;
}

function roundedRect(x, y, width, height, fill, stroke = "none", radius = 18, strokeWidth = 1) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function ownerTag(x, y, owner) {
  const ownerStyles = {
    忠晏: [colors.purpleSoft, colors.purple],
    守陽: [colors.blueSoft, colors.blue],
    金億: [colors.greenSoft, colors.green],
    育萱: [colors.amberSoft, colors.amber],
  };
  const [fill, ink] = ownerStyles[owner];
  return `${roundedRect(x, y, 104, 36, fill, "none", 18)}${text(x + 52, y + 25, owner, {
    size: 18,
    weight: 500,
    fill: ink,
    anchor: "middle",
  })}`;
}

function svgDocument(width, height, body, description) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(description)}</title>
  <desc id="desc">${escapeXml(description)}</desc>
  <rect width="${width}" height="${height}" fill="${colors.white}"/>
  <g font-family="Microsoft JhengHei, Noto Sans TC, Arial, sans-serif">
  ${body}
  </g>
</svg>`;
}

function buildRbacSvg() {
  const width = 1680;
  const height = 1260;
  const x0 = 60;
  const tableY = 180;
  const moduleWidth = 380;
  const roleWidth = 300;
  const headerHeight = 120;
  const rowHeight = 78;
  const roles = [
    { key: "center", label: "地礦中心承辦", scope: "全國業務資料" },
    { key: "vendor", label: "空拍廠商", scope: "受指派專案" },
    { key: "local", label: "地方政府人員", scope: "授權縣市" },
    { key: "admin", label: "系統管理員", scope: "帳號與日誌" },
  ];
  const rows = [
    ["業務首頁", [1, 1, 1, 0]],
    ["建議監測點位", [1, 1, 0, 0]],
    ["監測區位選定", [1, 1, 0, 0]],
    ["判釋變異點及查勘", [1, 1, 1, 0]],
    ["稽催管理", [1, 0, 0, 0]],
    ["違規行為後續處理", [1, 0, 1, 0]],
    ["盜濫採影像圖台", [1, 1, 1, 0]],
    ["統計分析儀錶板", [1, 1, 1, 0]],
    ["使用者管理", [1, 0, 0, 1]],
    ["系統日誌", [0, 0, 0, 1]],
  ];

  const parts = [];
  parts.push(text(60, 72, "地礦 AI 正式版 RBAC：角色 × 模組", { size: 40, weight: 500, fill: colors.navy }));
  parts.push(text(60, 116, "前端選單與後端授權必須採用同一套規則；「可見」不代表可跨越資料範圍。", { size: 22, fill: colors.muted }));

  parts.push(roundedRect(x0, tableY, moduleWidth, headerHeight, colors.primaryDark, "none", 16));
  parts.push(text(x0 + 28, tableY + 70, "功能模組", { size: 25, weight: 500, fill: colors.white }));

  roles.forEach((role, index) => {
    const x = x0 + moduleWidth + index * roleWidth;
    parts.push(roundedRect(x + 6, tableY, roleWidth - 12, headerHeight, colors.primary, "none", 16));
    parts.push(text(x + roleWidth / 2, tableY + 48, role.label, {
      size: 23,
      weight: 500,
      fill: colors.white,
      anchor: "middle",
    }));
    parts.push(text(x + roleWidth / 2, tableY + 84, role.scope, {
      size: 18,
      fill: colors.primarySoft,
      anchor: "middle",
    }));
  });

  rows.forEach(([label, permissions], rowIndex) => {
    const y = tableY + headerHeight + rowIndex * rowHeight;
    const background = rowIndex % 2 === 0 ? colors.white : colors.soft;
    parts.push(`<rect x="${x0}" y="${y}" width="${moduleWidth + roles.length * roleWidth}" height="${rowHeight}" fill="${background}"/>`);
    parts.push(`<line x1="${x0}" y1="${y + rowHeight}" x2="${x0 + moduleWidth + roles.length * roleWidth}" y2="${y + rowHeight}" stroke="${colors.line}"/>`);
    parts.push(text(x0 + 28, y + 49, label, { size: 22, weight: 500 }));
    permissions.forEach((allowed, roleIndex) => {
      const cx = x0 + moduleWidth + roleIndex * roleWidth + roleWidth / 2;
      if (allowed) {
        parts.push(`<circle cx="${cx}" cy="${y + rowHeight / 2}" r="23" fill="${colors.primarySoft}"/>`);
        parts.push(text(cx, y + 49, "✓", { size: 30, weight: 500, fill: colors.primaryDark, anchor: "middle" }));
      } else {
        parts.push(text(cx, y + 48, "—", { size: 28, fill: colors.deniedText, anchor: "middle" }));
      }
    });
  });

  const footerY = tableY + headerHeight + rows.length * rowHeight + 42;
  parts.push(roundedRect(60, footerY, 1560, 104, colors.primarySoft, "none", 16));
  parts.push(text(88, footerY + 38, "權責分離重點", { size: 21, weight: 500, fill: colors.primaryDark }));
  parts.push(text(88, footerY + 74, "系統管理員不得進入任何業務模組；地礦中心承辦可管理帳號，但不可查看系統日誌。", { size: 21, fill: colors.text }));

  return svgDocument(width, height, parts.join("\n"), "地礦 AI 正式版 RBAC 角色與模組矩陣");
}

function arrowPath(x1, y1, x2, y2, label = "") {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="${colors.primary}" stroke-width="4" marker-end="url(#arrow)"/>${label ? text(mx, my - 14, label, { size: 17, fill: colors.muted, anchor: "middle" }) : ""}`;
}

function flowNode(x, y, width, height, number, titleLines, owner, detailLines, secondOwner = null) {
  const parts = [];
  parts.push(roundedRect(x, y, width, height, colors.white, colors.line, 20, 2));
  parts.push(`<circle cx="${x + 34}" cy="${y + 34}" r="22" fill="${colors.primary}"/>`);
  parts.push(text(x + 34, y + 42, number, { size: 20, weight: 500, fill: colors.white, anchor: "middle" }));
  parts.push(text(x + 68, y + 37, "", { size: 24, weight: 500, lines: titleLines }));
  parts.push(ownerTag(x + 24, y + 93, owner));
  if (secondOwner) parts.push(ownerTag(x + 138, y + 93, secondOwner));
  parts.push(text(x + 24, y + 154, "", { size: 17, fill: colors.muted, lines: detailLines, lineHeight: 27 }));
  return parts.join("");
}

function buildFlowSvg() {
  const width = 1900;
  const height = 1110;
  const nodeW = 300;
  const nodeH = 230;
  const y1 = 170;
  const y2 = 520;
  const xsTop = [60, 420, 780, 1140, 1500];
  const xsBottom = [1500, 1140, 780, 420, 60];
  const parts = [];

  parts.push(`<defs><marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,8 L10,4 z" fill="${colors.primary}"/></marker></defs>`);
  parts.push(text(60, 72, "地礦 AI 核心業務與資料流", { size: 40, weight: 500, fill: colors.navy }));
  parts.push(text(60, 116, "由 AI 建議點位開始，經監測、空拍、查勘與後續處理，最後形成統計與首頁摘要。", { size: 22, fill: colors.muted }));

  parts.push(flowNode(xsTop[0], y1, nodeW, nodeH, "1", ["AI 判釋"], "忠晏", ["輸入：歷史資料", "輸出：建議監測點位"]));
  parts.push(flowNode(xsTop[1], y1, nodeW, nodeH, "2", ["建議監測點位"], "育萱", ["依專案年度列入清單", "可補充手動建議點位"]));
  parts.push(flowNode(xsTop[2], y1, nodeW, nodeH, "3", ["圖台圈繪"], "金億", ["帶入選取點位", "輸出：監測範圍圖資"]));
  parts.push(flowNode(xsTop[3], y1, nodeW, nodeH, "4", ["監測區位選定"], "育萱", ["地礦中心確認拍攝區位", "可新增欲空拍點位"]));
  parts.push(flowNode(xsTop[4], y1, nodeW, nodeH, "5", ["空拍通知與作業"], "育萱", ["輸入：拍攝區位與通知", "執行者：空拍廠商"]));

  parts.push(flowNode(xsBottom[0], y2, nodeW, nodeH, "6", ["報告／KML 上傳"], "育萱", ["空拍廠商提供成果", "輸出：變異點與附件"]));
  parts.push(flowNode(xsBottom[1], y2, nodeW, nodeH, "7", ["地礦中心通報"], "育萱", ["填寫通報查勘日期", "通知地方政府承辦"]));
  parts.push(flowNode(xsBottom[2], y2, nodeW, nodeH, "8", ["地方政府查勘"], "育萱", ["回報結果與現場照片", "逾期可上傳原因公文"]));
  parts.push(flowNode(xsBottom[3], y2, nodeW, nodeH, "9", ["稽催／違規後續"], "金億", ["未回報：產生稽催紀錄", "確認違規：形成後續結果"], "育萱"));
  parts.push(flowNode(xsBottom[4], y2, nodeW, nodeH, "10", ["統計與首頁摘要"], "守陽", ["彙整監測、回報與違規", "依角色顯示資料範圍"]));

  for (let i = 0; i < xsTop.length - 1; i += 1) {
    parts.push(arrowPath(xsTop[i] + nodeW, y1 + nodeH / 2, xsTop[i + 1] - 16, y1 + nodeH / 2));
  }
  parts.push(`<path d="M ${xsTop[4] + nodeW / 2} ${y1 + nodeH} L ${xsTop[4] + nodeW / 2} ${y2 - 18}" fill="none" stroke="${colors.primary}" stroke-width="4" marker-end="url(#arrow)"/>`);
  for (let i = 0; i < xsBottom.length - 1; i += 1) {
    parts.push(arrowPath(xsBottom[i], y2 + nodeH / 2, xsBottom[i + 1] + nodeW + 16, y2 + nodeH / 2));
  }

  parts.push(roundedRect(60, 825, 1740, 190, colors.soft, colors.line, 20, 1));
  parts.push(text(90, 870, "橫向共用能力", { size: 24, weight: 500, fill: colors.navy }));
  parts.push(ownerTag(90, 894, "守陽"));
  parts.push(text(214, 920, "登入／註冊、使用者管理與系統日誌支援各角色進入系統，但不改變業務資料的角色範圍。", { size: 20 }));
  parts.push(text(90, 972, "工程介接重點：忠晏 → 育萱（AI 點位）；育萱 ↔ 金億（清單與圖台）；育萱／金億 → 守陽（統計與首頁摘要）。", { size: 20, fill: colors.muted }));

  return svgDocument(width, height, parts.join("\n"), "地礦 AI 核心業務流程與資料流向");
}

async function writeDiagram(baseName, svg) {
  const svgPath = path.join(outputDir, `${baseName}.svg`);
  await fs.writeFile(svgPath, svg, "utf8");
  return { svgPath };
}

const outputs = [];
outputs.push(await writeDiagram("rbac-role-module-matrix", buildRbacSvg()));
outputs.push(await writeDiagram("monitoring-business-data-flow", buildFlowSvg()));

console.log(JSON.stringify(outputs, null, 2));
