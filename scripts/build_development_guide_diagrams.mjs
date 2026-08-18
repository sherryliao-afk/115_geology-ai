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
  const width = 1600;
  const height = 2050;
  const laneTop = 220;
  const laneBottom = 1970;
  const laneWidth = 325;
  const laneStart = 260;
  const laneCenters = [422.5, 747.5, 1072.5, 1397.5];
  const parts = [];

  parts.push(`<defs><marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,8 L10,4 z" fill="${colors.primary}"/></marker></defs>`);
  parts.push(text(40, 68, "地礦 AI 角色業務流程", { size: 38, weight: 500, fill: colors.navy }));
  parts.push(text(40, 110, "功能模組依實際操作角色排列；箭頭表示案件與資料的交接方向。", { size: 21, fill: colors.muted }));

  const laneLabels = ["地礦中心承辦", "空拍廠商", "地方政府人員", "系統自動作業"];
  parts.push(roundedRect(40, 140, 200, 70, colors.primaryDark, "none", 8));
  parts.push(text(140, 184, "流程階段", { size: 23, weight: 500, fill: colors.white, anchor: "middle" }));
  laneLabels.forEach((label, index) => {
    const x = laneStart + index * laneWidth;
    parts.push(roundedRect(x + 4, 140, laneWidth - 8, 70, colors.primary, "none", 8));
    parts.push(text(x + laneWidth / 2, 184, label, { size: 22, weight: 500, fill: colors.white, anchor: "middle" }));
    parts.push(`<rect x="${x}" y="${laneTop}" width="${laneWidth}" height="${laneBottom - laneTop}" fill="${index % 2 === 0 ? colors.white : colors.soft}" stroke="${colors.line}"/>`);
  });
  parts.push(`<rect x="40" y="${laneTop}" width="200" height="${laneBottom - laneTop}" fill="${colors.soft}" stroke="${colors.line}"/>`);
  const stageLabels = [
    { label: "監測規劃", y: 430 },
    { label: "空拍與通報", y: 850 },
    { label: "查勘與稽催", y: 1300 },
    { label: "後續處理／結案", y: 1770 },
  ];
  stageLabels.forEach(({ label, y }) => {
    parts.push(text(140, y, label, { size: 19, weight: 500, fill: colors.navy, anchor: "middle" }));
  });

  function node(x, y, widthValue, heightValue, lines, options = {}) {
    const fill = options.fill ?? colors.white;
    const stroke = options.stroke ?? colors.primary;
    const fontSize = options.fontSize ?? 20;
    const lineHeight = options.lineHeight ?? 29;
    const startY = y + heightValue / 2 - ((lines.length - 1) * lineHeight) / 2 + 7;
    return `${roundedRect(x, y, widthValue, heightValue, fill, stroke, 10, 2)}${text(x + widthValue / 2, startY, "", {
      size: fontSize,
      weight: 500,
      fill: colors.text,
      anchor: "middle",
      lines,
      lineHeight,
    })}`;
  }

  function diamond(cx, cy, widthValue, heightValue, lines) {
    const points = `${cx},${cy - heightValue / 2} ${cx + widthValue / 2},${cy} ${cx},${cy + heightValue / 2} ${cx - widthValue / 2},${cy}`;
    const startY = cy - ((lines.length - 1) * 24) / 2 + 6;
    return `<polygon points="${points}" fill="${colors.primarySoft}" stroke="${colors.primary}" stroke-width="2"/>${text(cx, startY, "", {
      size: 18,
      weight: 500,
      fill: colors.text,
      anchor: "middle",
      lines,
      lineHeight: 24,
    })}`;
  }

  function connector(pathData, label = "", labelX = 0, labelY = 0, dashed = false, marker = true) {
    return `<path d="${pathData}" fill="none" stroke="${colors.primary}" stroke-width="3"${dashed ? ' stroke-dasharray="8 7"' : ""}${marker ? ' marker-end="url(#arrow)"' : ""}/>${label ? text(labelX, labelY, label, { size: 17, weight: 500, fill: colors.primaryDark, anchor: "middle" }) : ""}`;
  }

  const sharedX = 310;
  const sharedWidth = 550;
  parts.push(text(585, 252, "地礦中心承辦＋空拍廠商共同使用", { size: 18, fill: colors.primaryDark, anchor: "middle" }));
  parts.push(node(sharedX, 270, sharedWidth, 74, ["建議監測點位"], { fill: colors.primarySoft }));
  parts.push(connector("M 585 344 L 585 374"));
  parts.push(node(sharedX, 385, sharedWidth, 74, ["地圖圈繪"], { fill: colors.primarySoft }));
  parts.push(connector("M 585 459 L 585 489"));
  parts.push(node(sharedX, 500, sharedWidth, 74, ["區位選定"], { fill: colors.primarySoft }));

  parts.push(connector("M 585 574 L 585 610 L 422.5 610 L 422.5 640"));
  parts.push(node(297.5, 650, 250, 78, ["空拍通知作業"]));
  parts.push(connector("M 422.5 728 L 422.5 760 L 747.5 760 L 747.5 790"));
  parts.push(node(622.5, 800, 250, 92, ["上傳 KML", "空拍判釋報告"]));
  parts.push(connector("M 747.5 892 L 747.5 925 L 422.5 925 L 422.5 955"));
  parts.push(node(297.5, 965, 250, 92, ["通報地方政府人員", "進行查勘"]));
  parts.push(connector("M 422.5 1057 L 422.5 1085 L 1072.5 1085 L 1072.5 1105"));

  parts.push(diamond(1072.5, 1160, 220, 100, ["14 天內", "完成查勘？"]));
  parts.push(connector("M 1072.5 1210 L 1072.5 1240", "否", 1048, 1230));
  parts.push(diamond(1072.5, 1290, 220, 92, ["有公文說明？"]));

  parts.push(connector("M 1182.5 1160 L 1215 1160 L 1215 1470 L 1197.5 1470", "是", 1200, 1145));
  parts.push(connector("M 962.5 1290 L 930 1290 L 930 1340 L 947.5 1340", "是", 930, 1275));
  parts.push(node(947.5, 1350, 250, 88, ["上傳公文說明", "不觸發自動稽催"], { fontSize: 18 }));
  parts.push(connector("M 1072.5 1438 L 1072.5 1470"));

  parts.push(connector("M 1182.5 1290 L 1397.5 1290 L 1397.5 1340", "否", 1270, 1275));
  parts.push(node(1272.5, 1350, 250, 100, ["自動寄送稽催信", "＋系統通知"], { fill: colors.primarySoft, fontSize: 18 }));
  parts.push(connector("M 1397.5 1450 L 1397.5 1470 L 1197.5 1470"));

  parts.push(node(947.5, 1480, 250, 82, ["上傳查勘回報"]));
  parts.push(connector("M 1072.5 1562 L 1072.5 1590"));
  parts.push(diamond(1072.5, 1640, 230, 96, ["需要後續處理？"]));

  parts.push(connector("M 1072.5 1688 L 1072.5 1720", "是", 1046, 1710));
  parts.push(node(297.5, 1740, 250, 86, ["違規行為後續處理", "可查看"], { fontSize: 18 }));
  parts.push(node(947.5, 1740, 250, 86, ["違規行為後續處理", "可查看"], { fontSize: 18 }));
  parts.push(connector("M 947.5 1783 L 547.5 1783", "同一張表", 747.5, 1768, true, false));

  parts.push(connector("M 957.5 1640 L 900 1640 L 900 1875 L 547.5 1875", "否", 925, 1625));
  parts.push(connector("M 422.5 1826 L 422.5 1860"));
  parts.push(node(297.5, 1880, 250, 74, ["視情況結案"], { fill: colors.primarySoft }));

  parts.push(text(40, 2015, "規則：超過查勘天數 14 天且沒有公文說明時，系統才自動寄送稽催信與系統通知。", {
    size: 20,
    weight: 500,
    fill: colors.primaryDark,
  }));

  return svgDocument(width, height, parts.join("\n"), "地礦 AI 四角色業務泳道流程");
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
