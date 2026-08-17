"use strict";

/* =========================================================
   帳庭 (Chōtei) — vanilla-JS PWA edition
   ========================================================= */

const LS_KEY = "chotei:data";

const PALETTE = ["#2C5379", "#A63D3D", "#C08A2E", "#3F6B4F", "#6B4E71", "#8A6D3B", "#4A5568", "#7A4A3A"];
const CATEGORY_PALETTE = ["#A63D3D", "#2C5379", "#C08A2E", "#3F6B4F", "#6B4E71", "#8A6D3B", "#B0724A", "#4A5568", "#7A8C99", "#9C5B5B"];
const DEFAULT_EXPENSE_CATS = ["食費", "日用品", "光熱費", "通信費", "住居費", "交通費", "娯楽", "医療", "衣服", "交際費", "その他"];
const DEFAULT_INCOME_CATS = ["給与", "副業", "お小遣い", "ボーナス", "贈与", "その他"];
const MONTH_NAMES = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
const TYPE_META = {
  bank:    { label: "銀行",   icon: "bank" },
  wallet:  { label: "手持ち", icon: "wallet" },
  savings: { label: "貯金箱", icon: "piggy" },
};

/* ---------- icons ---------- */
const ICONS = {
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  transfer: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  arrowDown: '<circle cx="12" cy="12" r="9"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/>',
  arrowUp: '<circle cx="12" cy="12" r="9"/><polyline points="8 12 12 8 16 12"/><line x1="12" y1="8" x2="12" y2="16"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  book: '<path d="M2 5c2-1.3 5-2 7-2s5 .7 7 2v14c-2-1.3-5-2-7-2s-5 .7-7 2z"/><path d="M12 5c2-1.3 5-2 7-2s2 .2 3 .6v14c-1-.4-1-.6-3-.6s-5 .7-7 2"/>',
  settings: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V19a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/>',
  grip: '<circle cx="9" cy="6" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="9" cy="18" r="1.3"/><circle cx="15" cy="6" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="15" cy="18" r="1.3"/>',
  download: '<path d="M12 3v12"/><polyline points="7 11 12 16 17 11"/><path d="M4 19h16"/>',
  upload: '<path d="M12 21V9"/><polyline points="7 13 12 8 17 13"/><path d="M4 19h16"/>',
  bank: '<polygon points="12 2 22 8 2 8"/><line x1="4" y1="8" x2="4" y2="19"/><line x1="9" y1="8" x2="9" y2="19"/><line x1="15" y1="8" x2="15" y2="19"/><line x1="20" y1="8" x2="20" y2="19"/><line x1="2" y1="21" x2="22" y2="21"/>',
  wallet: '<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="17" cy="14.5" r="1.1"/>',
  piggy: '<path d="M4 12a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1a2 2 0 0 1-2 2h-1v2h-3v-2H9v2H6v-2H5a1 1 0 0 1-1-1z"/><circle cx="16" cy="10" r="0.6"/><path d="M2 12h2"/><path d="M20 9l2-1"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
};
function icon(name, size) {
  size = size || 16;
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24">${ICONS[name] || ""}</svg>`;
}

/* ---------- helpers ---------- */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function monthKeyOf(d) { return d.slice(0, 7); }
function yearOf(d) { return d.slice(0, 4); }
function formatYen(n) {
  const v = Math.round(n || 0);
  return (v < 0 ? "−" : "") + Math.abs(v).toLocaleString("ja-JP") + "円";
}
function formatYenShort(v) {
  const av = Math.abs(v);
  if (av >= 10000) return (v / 10000).toFixed(1).replace(/\.0$/, "") + "万";
  return Math.round(v).toLocaleString("ja-JP");
}
function hashColor(str, arr) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- persisted data ---------- */
let data = {
  accounts: [],
  cards: [],
  transactions: [],
  expenseCats: DEFAULT_EXPENSE_CATS.slice(),
  incomeCats: DEFAULT_INCOME_CATS.slice(),
};

/* ---------- transient UI state ---------- */
let ui = {
  activeTab: "home",
  recordYear: String(new Date().getFullYear()),
  graphMode: "all",
  catViewType: "expense",
  catViewCategory: "",
  statusMsg: null,
};

function loadData() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      data.accounts = parsed.accounts || [];
      data.cards = parsed.cards || [];
      data.transactions = parsed.transactions || [];
      data.expenseCats = parsed.expenseCats || DEFAULT_EXPENSE_CATS.slice();
      data.incomeCats = parsed.incomeCats || DEFAULT_INCOME_CATS.slice();
      return;
    }
  } catch (e) { /* fall through to defaults */ }
  data.accounts = [
    { id: uid(), name: "メイン銀行", type: "bank", initialBalance: 0, color: PALETTE[0] },
    { id: uid(), name: "財布", type: "wallet", initialBalance: 0, color: PALETTE[2] },
  ];
}
function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) { /* storage full/unavailable */ }
}

/* ---------- derived data ---------- */
function getAccount(id) { return data.accounts.find((a) => a.id === id); }
function getCard(id) { return data.cards.find((c) => c.id === id); }
function resolvedAccountIdForTx(tx) {
  if (tx.cardId) { const c = getCard(tx.cardId); return c ? c.linkedAccountId : null; }
  return tx.accountId;
}
function getAccountBalance(accountId) {
  const acc = getAccount(accountId);
  if (!acc) return 0;
  let bal = acc.initialBalance || 0;
  data.transactions.forEach((tx) => {
    if (tx.type === "expense") { if (resolvedAccountIdForTx(tx) === accountId) bal -= tx.amount; }
    else if (tx.type === "income") { if (tx.accountId === accountId) bal += tx.amount; }
    else if (tx.type === "transfer") {
      if (tx.accountId === accountId) bal -= tx.amount;
      if (tx.toAccountId === accountId) bal += tx.amount;
    }
  });
  return bal;
}
function netWorth() { return data.accounts.reduce((s, a) => s + getAccountBalance(a.id), 0); }
function availableYears() {
  const s = new Set(data.transactions.map((t) => yearOf(t.date)));
  s.add(String(new Date().getFullYear()));
  return Array.from(s).sort().reverse();
}
function yearMonthlyStats(year) {
  const months = [];
  for (let m = 1; m <= 12; m++) months.push({ month: `${year}-${String(m).padStart(2, "0")}`, label: MONTH_NAMES[m - 1], income: 0, expense: 0 });
  const byKey = {}; months.forEach((m) => (byKey[m.month] = m));
  data.transactions.forEach((tx) => {
    const mk = monthKeyOf(tx.date);
    if (!byKey[mk]) return;
    if (tx.type === "income") byKey[mk].income += tx.amount;
    if (tx.type === "expense") byKey[mk].expense += tx.amount;
  });
  return months.map((m) => ({ ...m, net: m.income - m.expense }));
}
function categoryYearSeries(year, type, cat) {
  const months = [];
  for (let m = 1; m <= 12; m++) months.push({ month: `${year}-${String(m).padStart(2, "0")}`, label: MONTH_NAMES[m - 1], amount: 0 });
  const byKey = {}; months.forEach((m) => (byKey[m.month] = m));
  if (cat) {
    data.transactions.forEach((tx) => {
      if (tx.type !== type) return;
      if ((tx.category || "その他") !== cat) return;
      const mk = monthKeyOf(tx.date);
      if (byKey[mk]) byKey[mk].amount += tx.amount;
    });
  }
  return months;
}
function sortedTransactions() {
  return [...data.transactions].sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
}
function sourceLabel(tx) {
  if (tx.type === "transfer") {
    const from = getAccount(tx.accountId), to = getAccount(tx.toAccountId);
    return `${from ? from.name : "?"} → ${to ? to.name : "?"}`;
  }
  if (tx.cardId) {
    const c = getCard(tx.cardId), acc = c ? getAccount(c.linkedAccountId) : null;
    return `${acc ? acc.name : "?"}（${c ? c.name : "?"}）`;
  }
  const acc = getAccount(tx.accountId);
  return acc ? acc.name : "?";
}

/* ---------- mutations ---------- */
function addTransaction(tx) { data.transactions.push({ id: uid(), ...tx }); saveState(); }
function deleteTransaction(id) { data.transactions = data.transactions.filter((t) => t.id !== id); saveState(); renderApp(); }
function addAccountRecord(acc) { data.accounts.push({ id: uid(), ...acc }); saveState(); }
function addCardRecord(card) { data.cards.push({ id: uid(), ...card }); saveState(); }
function addCategory(kind, name) {
  if (!name || !name.trim()) return;
  name = name.trim();
  const arr = kind === "expense" ? data.expenseCats : data.incomeCats;
  if (!arr.includes(name)) arr.push(name);
  saveState();
}
function removeCategory(kind, name) {
  if (kind === "expense") data.expenseCats = data.expenseCats.filter((c) => c !== name);
  else data.incomeCats = data.incomeCats.filter((c) => c !== name);
  saveState(); renderApp();
}
function resetAll() {
  data.accounts = []; data.cards = []; data.transactions = [];
  data.expenseCats = DEFAULT_EXPENSE_CATS.slice(); data.incomeCats = DEFAULT_INCOME_CATS.slice();
  saveState();
  ui.statusMsg = { type: "success", text: "すべてのデータを削除しました。" };
  renderApp();
}
function exportBackup() {
  const payload = { ...data, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `chotei-backup-${todayStr()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  ui.statusMsg = { type: "success", text: "バックアップファイルを書き出しました。" };
  renderApp();
}
function importBackupFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || typeof parsed !== "object") throw new Error("invalid");
      openConfirmModal("バックアップを読み込むと、現在のデータはすべて上書きされます。よろしいですか？", () => {
        data.accounts = parsed.accounts || [];
        data.cards = parsed.cards || [];
        data.transactions = parsed.transactions || [];
        data.expenseCats = parsed.expenseCats || DEFAULT_EXPENSE_CATS.slice();
        data.incomeCats = parsed.incomeCats || DEFAULT_INCOME_CATS.slice();
        saveState();
        ui.statusMsg = { type: "success", text: "バックアップからデータを復元しました。" };
        renderApp();
      });
    } catch (err) {
      ui.statusMsg = { type: "error", text: "読み込みに失敗しました。ファイルの形式を確認してください。" };
      renderApp();
    }
  };
  reader.readAsText(file);
}

/* ---------- chart SVGs ---------- */
function composedChartSVG(stats) {
  const w = 760, h = 300, padL = 50, padR = 50, padT = 16, padB = 30;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const n = stats.length, groupW = plotW / n;
  const maxRight = Math.max(1, ...stats.map((s) => Math.max(s.income, s.expense)));
  const maxLeftAbs = Math.max(1, ...stats.map((s) => Math.abs(s.net)));
  const yRight = (v) => padT + plotH - (v / maxRight) * plotH;
  const yLeft = (v) => padT + plotH / 2 - (v / maxLeftAbs) * (plotH / 2);
  const barW = groupW * 0.3;
  let bars = "", xlabels = "";
  const linePoints = [];
  stats.forEach((s, i) => {
    const cx = padL + groupW * i + groupW / 2;
    const xIncome = cx - barW - 2, xExpense = cx + 2;
    const baseline = yRight(0);
    const yInc = yRight(s.income), yExp = yRight(s.expense);
    bars += `<rect x="${xIncome.toFixed(1)}" y="${yInc.toFixed(1)}" width="${barW.toFixed(1)}" height="${(baseline - yInc).toFixed(1)}" fill="#2C5379" rx="2"/>`;
    bars += `<rect x="${xExpense.toFixed(1)}" y="${yExp.toFixed(1)}" width="${barW.toFixed(1)}" height="${(baseline - yExp).toFixed(1)}" fill="#A63D3D" rx="2"/>`;
    linePoints.push([cx, yLeft(s.net)]);
    xlabels += `<text x="${cx.toFixed(1)}" y="${h - 8}" font-size="10" fill="#5B6472" text-anchor="middle">${s.label}</text>`;
  });
  const linePath = linePoints.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  let grid = "";
  for (let i = 0; i <= 4; i++) { const y = padT + (plotH / 4) * i; grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#DCD2B8" stroke-width="1"/>`; }
  const leftLabels = `
    <text x="${padL - 8}" y="${yLeft(maxLeftAbs) + 4}" font-size="10" fill="#C08A2E" text-anchor="end">${formatYenShort(maxLeftAbs)}</text>
    <text x="${padL - 8}" y="${yLeft(0) + 4}" font-size="10" fill="#C08A2E" text-anchor="end">0</text>
    <text x="${padL - 8}" y="${yLeft(-maxLeftAbs) + 4}" font-size="10" fill="#C08A2E" text-anchor="end">-${formatYenShort(maxLeftAbs)}</text>`;
  const rightLabels = `
    <text x="${w - padR + 8}" y="${yRight(maxRight) + 4}" font-size="10" fill="#5B6472">${formatYenShort(maxRight)}</text>
    <text x="${w - padR + 8}" y="${yRight(0) + 4}" font-size="10" fill="#5B6472">0</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;display:block;">
    ${grid}
    <line x1="${padL}" y1="${yLeft(0)}" x2="${w - padR}" y2="${yLeft(0)}" stroke="#5B6472" stroke-dasharray="4 4"/>
    ${bars}
    <path d="${linePath}" fill="none" stroke="#C08A2E" stroke-width="2.75"/>
    ${linePoints.map((p) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#C08A2E"/>`).join("")}
    ${xlabels}${leftLabels}${rightLabels}
  </svg>`;
}
function categoryBarChartSVG(series, color) {
  const w = 760, h = 260, padL = 46, padR = 16, padT = 16, padB = 30;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const n = series.length, groupW = plotW / n, barW = groupW * 0.5;
  const max = Math.max(1, ...series.map((s) => s.amount));
  const y = (v) => padT + plotH - (v / max) * plotH;
  let bars = "", xlabels = "";
  series.forEach((s, i) => {
    const cx = padL + groupW * i + groupW / 2, x = cx - barW / 2, yy = y(s.amount);
    bars += `<rect x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${barW.toFixed(1)}" height="${(padT + plotH - yy).toFixed(1)}" fill="${color}" rx="2"/>`;
    xlabels += `<text x="${cx.toFixed(1)}" y="${h - 8}" font-size="10" fill="#5B6472" text-anchor="middle">${s.label}</text>`;
  });
  let grid = "";
  for (let i = 0; i <= 4; i++) { const yy = padT + (plotH / 4) * i; grid += `<line x1="${padL}" y1="${yy}" x2="${w - padR}" y2="${yy}" stroke="#DCD2B8" stroke-width="1"/>`; }
  const maxLabel = `<text x="${padL - 8}" y="${padT + 4}" font-size="10" fill="#5B6472" text-anchor="end">${formatYenShort(max)}</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;display:block;">${grid}${bars}${xlabels}${maxLabel}</svg>`;
}

/* ---------- render: header ---------- */
function renderHeader() {
  return `
    <div class="kb-header">
      <div class="kb-title"><span class="tab">帳</span><span class="kb-display">帳庭 — 家計の庭</span></div>
      <div class="kb-netbadge">
        <div class="kb-stamp">総資産</div>
        <div><div class="kb-netlabel">純資産合計</div><div class="kb-netvalue kb-num">${formatYen(netWorth())}</div></div>
      </div>
    </div>`;
}

/* ---------- render: home tab ---------- */
function renderHomeTab() {
  const accountsHtml = data.accounts.map((acc) => {
    const meta = TYPE_META[acc.type] || TYPE_META.bank;
    return `
      <div class="kb-account" data-reorder-item="account" data-id="${acc.id}" style="--acc-color:${acc.color}">
        <div class="kb-account-top" data-reorder-handle>
          <div class="kb-account-name">
            <span class="kb-account-icon">${icon(meta.icon, 14)}</span>
            ${escapeHtml(acc.name)}
            <span class="kb-account-type">${meta.label}</span>
          </div>
          ${icon("grip", 16).replace('class="icon"', 'class="icon kb-grip"')}
        </div>
        <div class="kb-account-balance kb-num">${formatYen(getAccountBalance(acc.id))}</div>
        <div class="kb-account-actions">
          <button class="kb-mini-btn" onclick="C.openTxModal('income', '${acc.id}')">${icon("arrowDown", 13)} 入金</button>
          <button class="kb-mini-btn" onclick="C.openTxModal('transfer', '${acc.id}')">${icon("transfer", 13)} 移動</button>
          <button class="kb-mini-btn" onclick="C.openTxModal('expense', '${acc.id}')">${icon("arrowUp", 13)} 使用</button>
        </div>
      </div>`;
  }).join("");

  const cardsHtml = data.cards.map((c) => {
    const acc = getAccount(c.linkedAccountId);
    return `
      <div class="kb-card-chip" data-reorder-item="card" data-id="${c.id}" data-reorder-handle style="--acc-color:${c.color}">
        <span class="kb-card-icon">${icon("card", 13)}</span>
        <div class="kb-card-body">
          <div>${escapeHtml(c.name)}</div>
          <div class="kb-card-sub">支払元：${escapeHtml(acc ? acc.name : "未設定")}</div>
        </div>
        ${icon("grip", 16).replace('class="icon"', 'class="icon kb-grip"')}
      </div>`;
  }).join("");

  return `
    <div class="kb-sticky-actions">
      <div class="kb-sticky-actions-inner">
        <button class="kb-big-btn expense" onclick="C.openTxModal('expense')">${icon("arrowUp", 20)} 出費</button>
        <button class="kb-big-btn income" onclick="C.openTxModal('income')">${icon("arrowDown", 20)} 入金</button>
        <button class="kb-big-btn transfer" onclick="C.openTxModal('transfer')">${icon("transfer", 20)} 移動</button>
      </div>
    </div>
    <div class="kb-two-col">
      <div class="kb-panel" style="margin-bottom:0">
        <div class="kb-panel-title"><span class="vtab">資産</span><h2>口座・貯蓄場所</h2></div>
        ${data.accounts.length > 1 ? `<div class="kb-hint">名前の部分を長押しすると並び替えできます</div>` : ""}
        ${data.accounts.length === 0 ? `<div class="kb-empty">まだ口座がありません</div>` : accountsHtml}
        <button class="kb-add-btn" onclick="C.openAccountModal()">${icon("plus", 14)} 口座・貯蓄場所を追加</button>
      </div>
      <div class="kb-panel" style="margin-bottom:0">
        <div class="kb-panel-title"><span class="vtab" style="background:var(--gold)">札</span><h2>カード</h2></div>
        ${data.cards.length > 1 ? `<div class="kb-hint">長押しすると並び替えできます</div>` : ""}
        ${data.cards.length === 0 ? `<div class="kb-empty">まだカードがありません</div>` : cardsHtml}
        <button class="kb-add-btn" ${data.accounts.length === 0 ? "disabled" : ""} onclick="C.openCardModal()">${icon("plus", 14)} カードを追加</button>
      </div>
    </div>`;
}

/* ---------- render: record tab ---------- */
function renderRecordTab() {
  const years = availableYears();
  const stats = yearMonthlyStats(ui.recordYear);
  const cats = ui.catViewType === "expense" ? data.expenseCats : data.incomeCats;
  if (!cats.includes(ui.catViewCategory)) ui.catViewCategory = cats[0] || "";
  const catSeries = categoryYearSeries(ui.recordYear, ui.catViewType, ui.catViewCategory);
  const tx = sortedTransactions();

  const chartBlock = ui.graphMode === "all"
    ? `<div class="kb-chart-box">
         <div class="kb-chart-label">左目盛り：収支（折れ線）／ 右目盛り：入金・出費（棒） — ${ui.recordYear}年</div>
         ${composedChartSVG(stats)}
         <div class="kb-chart-legend">
           <span><i class="kb-legend-dot" style="background:#2C5379"></i>入金</span>
           <span><i class="kb-legend-dot" style="background:#A63D3D"></i>出費</span>
           <span><i class="kb-legend-dot" style="background:#C08A2E"></i>収支（左目盛り）</span>
         </div>
       </div>`
    : `<div class="kb-chart-box">
         <div class="kb-chart-label">${escapeHtml(ui.catViewCategory || "カテゴリ未選択")}（${ui.recordYear}年 月別）</div>
         ${categoryBarChartSVG(catSeries, hashColor(ui.catViewCategory || "その他", CATEGORY_PALETTE))}
       </div>`;

  const txHtml = tx.length === 0 ? `<div class="kb-empty">記録がありません。ホームタブのボタンから追加しましょう。</div>` : `
    <div class="kb-txlist">
      ${tx.map((t) => `
        <div class="kb-tx-row">
          <div class="kb-tx-mark" style="background:${t.type === "expense" ? "var(--seal)" : t.type === "income" ? "var(--indigo)" : "var(--gold)"}"></div>
          <div class="kb-tx-date">${t.date.slice(5).replace("-", "/")}</div>
          <div class="kb-tx-mid">
            <div class="kb-tx-memo">
              ${t.category ? `<span class="kb-tx-cat" style="background:${hashColor(t.category, CATEGORY_PALETTE)}">${escapeHtml(t.category)}</span>` : ""}
              ${escapeHtml(t.memo || (t.type === "transfer" ? "資金移動" : "（メモなし）"))}
            </div>
            <div class="kb-tx-sub">${escapeHtml(sourceLabel(t))}</div>
          </div>
          <div class="kb-tx-amt kb-num" style="color:${t.type === "expense" ? "var(--seal)" : t.type === "income" ? "var(--indigo)" : "var(--ink-soft)"}">
            ${t.type === "expense" ? "−" : t.type === "income" ? "+" : ""}${formatYen(t.amount)}
          </div>
          <button class="kb-tx-del" onclick="C.deleteTx('${t.id}')" title="削除">${icon("trash", 14)}</button>
        </div>`).join("")}
    </div>`;

  return `
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="vtab">図</span><h2>グラフ</h2></div>
      <div class="kb-toolbar">
        <select class="kb-select" onchange="C.setRecordYear(this.value)">
          ${years.map((y) => `<option value="${y}" ${y === ui.recordYear ? "selected" : ""}>${y}年</option>`).join("")}
        </select>
        <button class="kb-tabbtn ${ui.graphMode === "all" ? "active" : ""}" onclick="C.setGraphMode('all')">全カテゴリ</button>
        <button class="kb-tabbtn ${ui.graphMode === "byCategory" ? "active" : ""}" onclick="C.setGraphMode('byCategory')">カテゴリ別</button>
        ${ui.graphMode === "byCategory" ? `
          <button class="kb-tabbtn ${ui.catViewType === "expense" ? "active" : ""}" onclick="C.setCatViewType('expense')">支出</button>
          <button class="kb-tabbtn ${ui.catViewType === "income" ? "active" : ""}" onclick="C.setCatViewType('income')">収入</button>
          <select class="kb-select" onchange="C.setCatViewCategory(this.value)">
            ${cats.map((c) => `<option value="${escapeHtml(c)}" ${c === ui.catViewCategory ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
          </select>` : ""}
      </div>
      ${chartBlock}
    </div>
    <div class="kb-panel" style="margin-bottom:0">
      <div class="kb-panel-title"><span class="vtab" style="background:var(--ink)">録</span><h2>入出金履歴</h2></div>
      ${txHtml}
    </div>`;
}

/* ---------- render: other tab ---------- */
function renderOtherTab() {
  const catRow = (kind, name) => `
    <div class="kb-cat-manage-row">
      <span>${escapeHtml(name)}</span>
      <button onclick="C.removeCategory('${kind}', '${escapeHtml(name).replace(/'/g, "\\'")}')">${icon("trash", 14)}</button>
    </div>`;
  const statusHtml = ui.statusMsg ? `<div class="kb-status ${ui.statusMsg.type}">${escapeHtml(ui.statusMsg.text)}</div>` : "";

  return `
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="vtab">分</span><h2>支出の種類を管理</h2></div>
      ${data.expenseCats.map((c) => catRow("expense", c)).join("")}
      <div class="kb-inline-add">
        <input type="text" id="newExpenseCat" placeholder="新しい種類を追加" />
        <button onclick="C.addCategoryFromInput('expense', 'newExpenseCat')">追加</button>
      </div>
    </div>
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="vtab" style="background:var(--gold)">分</span><h2>収入の種類を管理</h2></div>
      ${data.incomeCats.map((c) => catRow("income", c)).join("")}
      <div class="kb-inline-add">
        <input type="text" id="newIncomeCat" placeholder="新しい種類を追加" />
        <button onclick="C.addCategoryFromInput('income', 'newIncomeCat')">追加</button>
      </div>
    </div>
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="vtab" style="background:var(--seal)">設</span><h2>データ管理</h2></div>
      ${statusHtml}
      <p style="font-size:13px;color:var(--ink-soft);margin-top:0">他の端末にデータを持っていくときは、バックアップを書き出してファイルを送り、もう一方の端末で読み込んでください。</p>
      <div class="kb-btn-row">
        <button class="kb-outline-btn" onclick="C.exportBackup()">${icon("download", 15)} バックアップを書き出す</button>
        <button class="kb-outline-btn" onclick="document.getElementById('importFileInput').click()">${icon("upload", 15)} バックアップから復元</button>
        <input type="file" id="importFileInput" accept="application/json" style="display:none" onchange="C.handleImportFile(this)" />
      </div>
      <p style="font-size:13px;color:var(--ink-soft)">口座・カード・取引の記録をすべて削除して、最初の状態に戻します。この操作は取り消せません。</p>
      <button class="kb-danger-btn" onclick="C.confirmReset()">すべてのデータをリセット</button>
    </div>
    <div class="kb-panel" style="margin-bottom:0">
      <div class="kb-panel-title"><span class="vtab" style="background:var(--indigo)">証</span><h2>クレジット</h2></div>
      <div class="kb-credits">
        <div><b>帳庭 — 家計の庭</b>（個人利用向け家計簿アプリ）</div>
        <div>PWA版：ブラウザのローカルストレージにデータを保存します。</div>
        <div>データを端末間で共有する場合は、上のバックアップ機能をご利用ください。</div>
      </div>
    </div>`;
}

/* ---------- render: bottom nav ---------- */
function renderBottomNav() {
  const tabs = [["home", "home", "ホーム"], ["record", "book", "記録"], ["other", "settings", "その他"]];
  return `<div class="kb-bottomnav">
    ${tabs.map(([id, ic, label]) => `
      <button class="kb-navbtn ${ui.activeTab === id ? "active" : ""}" onclick="C.setTab('${id}')">
        ${icon(ic, 19)}<span>${label}</span><span class="navdot"></span>
      </button>`).join("")}
  </div>`;
}

/* ---------- master render ---------- */
function renderApp() {
  const app = document.getElementById("app");
  let body = "";
  if (ui.activeTab === "home") body = renderHomeTab();
  else if (ui.activeTab === "record") body = renderRecordTab();
  else body = renderOtherTab();
  app.innerHTML = renderHeader() + `<div>${body}</div>` + renderBottomNav();
  if (ui.activeTab === "home") setupReorder();
}

/* ---------- long-press reorder ---------- */
let dragSession = { id: null, kind: null, timer: null, active: false, startY: 0 };
function setupReorder() {
  document.querySelectorAll("[data-reorder-item]").forEach((row) => {
    const handle = row.querySelector("[data-reorder-handle]") || row;
    handle.addEventListener("pointerdown", (e) => startDrag(e, row.dataset.id, row.dataset.reorderItem));
  });
}
function startDrag(e, id, kind) {
  dragSession = { id, kind, timer: null, active: false, startY: e.clientY };
  window.addEventListener("pointermove", onDragMove, { passive: false });
  window.addEventListener("pointerup", onDragUp);
  dragSession.timer = setTimeout(() => {
    dragSession.active = true;
    if (navigator.vibrate) navigator.vibrate(12);
    const el = document.querySelector(`[data-reorder-item="${kind}"][data-id="${id}"]`);
    if (el) el.classList.add("kb-dragging");
  }, 420);
}
function onDragMove(e) {
  if (!dragSession.id) return;
  if (!dragSession.active) {
    if (Math.abs(e.clientY - dragSession.startY) > 10) cancelDrag();
    return;
  }
  e.preventDefault();
  const el = document.querySelector(`[data-reorder-item="${dragSession.kind}"][data-id="${dragSession.id}"]`);
  if (!el) return;
  const delta = e.clientY - dragSession.startY;
  el.style.transform = `translateY(${delta}px)`;
  const h = el.offsetHeight + 10;
  if (Math.abs(delta) >= h) {
    const arr = dragSession.kind === "account" ? data.accounts : data.cards;
    const idx = arr.findIndex((x) => x.id === dragSession.id);
    const newIdx = Math.max(0, Math.min(arr.length - 1, idx + (delta > 0 ? 1 : -1)));
    if (newIdx !== idx) {
      const [moved] = arr.splice(idx, 1);
      arr.splice(newIdx, 0, moved);
      saveState();
      dragSession.startY = e.clientY;
      renderApp();
      const el2 = document.querySelector(`[data-reorder-item="${dragSession.kind}"][data-id="${dragSession.id}"]`);
      if (el2) el2.classList.add("kb-dragging");
    }
  }
}
function onDragUp() { cancelDrag(); }
function cancelDrag() {
  window.removeEventListener("pointermove", onDragMove);
  window.removeEventListener("pointerup", onDragUp);
  clearTimeout(dragSession.timer);
  if (dragSession.id) {
    const el = document.querySelector(`[data-reorder-item="${dragSession.kind}"][data-id="${dragSession.id}"]`);
    if (el) { el.classList.remove("kb-dragging"); el.style.transform = ""; }
  }
  dragSession = { id: null, kind: null, timer: null, active: false, startY: 0 };
}

/* ---------- modals ---------- */
function closeModal() {
  const existing = document.getElementById("modalRoot");
  if (existing) existing.remove();
}
function mountModal(html) {
  closeModal();
  const div = document.createElement("div");
  div.id = "modalRoot";
  div.innerHTML = html;
  document.body.appendChild(div);
  const backdrop = div.querySelector(".kb-modal-backdrop");
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });
}

function openConfirmModal(message, onConfirm) {
  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" style="max-width:340px" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3 style="color:var(--seal)">確認</h3>
        <p style="font-size:13.5px;line-height:1.7;margin-top:0">${escapeHtml(message)}</p>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="kb-outline-btn" style="flex:1;justify-content:center" onclick="C.closeModal()">キャンセル</button>
          <button class="kb-submit" style="flex:1;margin-top:0;background:var(--seal)" id="confirmModalOkBtn">実行する</button>
        </div>
      </div>
    </div>`);
  document.getElementById("confirmModalOkBtn").addEventListener("click", () => { closeModal(); onConfirm(); });
}
function confirmReset() {
  openConfirmModal("すべてのデータを削除します。この操作は取り消せません。本当によろしいですか？", resetAll);
}

function openAccountModal() {
  let type = "bank", color = PALETTE[0];
  const typeChip = () => Object.entries(TYPE_META).map(([k, v]) =>
    `<div class="kb-chip ${type === k ? "active" : ""}" data-type="${k}">${icon(v.icon, 13)} ${v.label}</div>`).join("");
  const colorDots = () => PALETTE.map((c) => `<div class="kb-color-dot ${color === c ? "active" : ""}" data-color="${c}" style="background:${c}"></div>`).join("");

  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3>口座・貯蓄場所を追加</h3>
        <div class="kb-field"><label>名前</label><input type="text" id="accName" placeholder="例：〇〇銀行、財布、貯金箱" /></div>
        <div class="kb-field"><label>種類</label><div class="kb-chip-group" id="accTypeGroup">${typeChip()}</div></div>
        <div class="kb-field"><label>現在の残高</label><input type="number" id="accBalance" placeholder="0" /></div>
        <div class="kb-field"><label>色</label><div class="kb-color-row" id="accColorRow">${colorDots()}</div></div>
        <button class="kb-submit" id="accSubmitBtn">追加する</button>
      </div>
    </div>`);

  document.getElementById("accTypeGroup").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-type]"); if (!chip) return;
    type = chip.dataset.type;
    document.getElementById("accTypeGroup").innerHTML = typeChip();
  });
  document.getElementById("accColorRow").addEventListener("click", (e) => {
    const dot = e.target.closest("[data-color]"); if (!dot) return;
    color = dot.dataset.color;
    document.getElementById("accColorRow").innerHTML = colorDots();
  });
  document.getElementById("accSubmitBtn").addEventListener("click", () => {
    const name = document.getElementById("accName").value.trim();
    if (!name) return;
    const balance = Number(document.getElementById("accBalance").value) || 0;
    addAccountRecord({ name, type, initialBalance: balance, color });
    closeModal(); renderApp();
  });
}

function openCardModal() {
  if (data.accounts.length === 0) return;
  let linkedAccountId = data.accounts[0].id, color = PALETTE[2];
  const colorDots = () => PALETTE.map((c) => `<div class="kb-color-dot ${color === c ? "active" : ""}" data-color="${c}" style="background:${c}"></div>`).join("");

  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3>カードを追加</h3>
        <div class="kb-field"><label>カード名</label><input type="text" id="cardName" placeholder="例：〇〇カード" /></div>
        <div class="kb-field"><label>支払い元の銀行</label>
          <select id="cardLinkedAccount">${data.accounts.map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`).join("")}</select>
        </div>
        <div class="kb-field"><label>色</label><div class="kb-color-row" id="cardColorRow">${colorDots()}</div></div>
        <button class="kb-submit" id="cardSubmitBtn">追加する</button>
      </div>
    </div>`);

  document.getElementById("cardColorRow").addEventListener("click", (e) => {
    const dot = e.target.closest("[data-color]"); if (!dot) return;
    color = dot.dataset.color;
    document.getElementById("cardColorRow").innerHTML = colorDots();
  });
  document.getElementById("cardSubmitBtn").addEventListener("click", () => {
    const name = document.getElementById("cardName").value.trim();
    if (!name) return;
    linkedAccountId = document.getElementById("cardLinkedAccount").value;
    addCardRecord({ name, linkedAccountId, color });
    closeModal(); renderApp();
  });
}

function openTxModal(mode, presetAccountId) {
  const accentMap = { expense: "var(--seal)", income: "var(--indigo)", transfer: "var(--gold)" };
  const titleMap = { expense: "出費を記録", income: "入金を記録", transfer: "資金移動" };
  let category = "";
  let sourceType = "account";
  let accountId = presetAccountId || (data.accounts[0] && data.accounts[0].id) || "";
  let cardId = "";
  let toAccountId = (data.accounts.find((a) => a.id !== accountId) || {}).id || "";
  const cats = mode === "expense" ? data.expenseCats : data.incomeCats;

  function catChipsHtml() {
    return cats.map((c) => `<div class="kb-chip ${category === c ? "active" : ""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</div>`).join("");
  }
  function sourceTypeChipsHtml() {
    return `
      <div class="kb-chip ${sourceType === "account" ? "active" : ""}" data-src="account">口座・手持ち</div>
      <div class="kb-chip ${sourceType === "card" ? "active" : ""}" data-src="card" style="opacity:${data.cards.length ? 1 : 0.4};pointer-events:${data.cards.length ? "auto" : "none"}">カード</div>`;
  }
  function sourceFieldHtml() {
    if (sourceType === "account") {
      return `<select id="txAccountSelect">${data.accounts.map((a) => `<option value="${a.id}" ${a.id === accountId ? "selected" : ""}>${escapeHtml(a.name)}</option>`).join("")}</select>`;
    }
    const linked = cardId ? getAccount((getCard(cardId) || {}).linkedAccountId) : null;
    return `
      <select id="txCardSelect">
        <option value="">選択してください</option>
        ${data.cards.map((c) => `<option value="${c.id}" ${c.id === cardId ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}
      </select>
      ${cardId ? `<div style="font-size:11.5px;color:var(--ink-soft);margin-top:6px">支払元銀行：${escapeHtml(linked ? linked.name : "未設定")}</div>` : ""}`;
  }

  function bodyHtml() {
    let categorySection = "";
    if (mode !== "transfer") {
      categorySection = `
        <div class="kb-field">
          <label>種類</label>
          <div class="kb-chip-group" id="txCatChips">${catChipsHtml()}</div>
          <div class="kb-inline-add">
            <input type="text" id="txNewCat" placeholder="新しい種類を追加" />
            <button id="txAddCatBtn">追加</button>
          </div>
        </div>`;
    }
    let sourceSection = "";
    if (mode === "expense") {
      sourceSection = `
        <div class="kb-field">
          <label>支払い元</label>
          <div class="kb-chip-group" id="txSourceTypeChips" style="margin-bottom:8px">${sourceTypeChipsHtml()}</div>
          <div id="txSourceField">${sourceFieldHtml()}</div>
        </div>`;
    } else if (mode === "income") {
      sourceSection = `
        <div class="kb-field"><label>入金先</label>
          <select id="txAccountSelect">${data.accounts.map((a) => `<option value="${a.id}" ${a.id === accountId ? "selected" : ""}>${escapeHtml(a.name)}</option>`).join("")}</select>
        </div>`;
    } else {
      sourceSection = `
        <div class="kb-field"><label>移動元</label>
          <select id="txFromAccount">${data.accounts.map((a) => `<option value="${a.id}" ${a.id === accountId ? "selected" : ""}>${escapeHtml(a.name)}</option>`).join("")}</select>
        </div>
        <div class="kb-field"><label>移動先</label>
          <select id="txToAccount">${data.accounts.map((a) => `<option value="${a.id}" ${a.id === toAccountId ? "selected" : ""}>${escapeHtml(a.name)}</option>`).join("")}</select>
        </div>`;
    }
    return `
      <div class="kb-field"><label>金額</label><input type="number" min="0" inputmode="numeric" placeholder="0" id="txAmount" /></div>
      <div class="kb-field"><label>用途・メモ</label><input type="text" placeholder="例：スーパーで買い物" id="txMemo" /></div>
      <div class="kb-field"><label>日付</label><input type="date" id="txDate" value="${todayStr()}" /></div>
      ${categorySection}
      ${sourceSection}
      <button class="kb-submit" id="txSubmitBtn" style="background:${accentMap[mode]}">記録する</button>`;
  }

  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3 style="color:${accentMap[mode]}">${titleMap[mode]}</h3>
        <div id="txModalBody">${bodyHtml()}</div>
      </div>
    </div>`);

  function wire() {
    const body = document.getElementById("txModalBody");
    const catChips = document.getElementById("txCatChips");
    if (catChips) catChips.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-cat]"); if (!chip) return;
      category = chip.dataset.cat;
      catChips.innerHTML = catChipsHtml();
    });
    const addCatBtn = document.getElementById("txAddCatBtn");
    if (addCatBtn) addCatBtn.addEventListener("click", () => {
      const input = document.getElementById("txNewCat");
      const val = input.value.trim();
      if (!val) return;
      addCategory(mode, val);
      if (!cats.includes(val)) cats.push(val);
      category = val;
      input.value = "";
      document.getElementById("txCatChips").innerHTML = catChipsHtml();
    });
    const srcChips = document.getElementById("txSourceTypeChips");
    if (srcChips) srcChips.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-src]"); if (!chip) return;
      sourceType = chip.dataset.src;
      body.innerHTML = bodyHtml();
      wire();
    });
    const cardSelect = document.getElementById("txCardSelect");
    if (cardSelect) cardSelect.addEventListener("change", (e) => {
      cardId = e.target.value;
      document.getElementById("txSourceField").innerHTML = sourceFieldHtml();
    });
    const submitBtn = document.getElementById("txSubmitBtn");
    submitBtn.addEventListener("click", () => {
      const amount = Number(document.getElementById("txAmount").value);
      if (!amount || amount <= 0) return;
      const memo = document.getElementById("txMemo").value.trim();
      const date = document.getElementById("txDate").value || todayStr();
      const base = { date, amount, memo };
      if (mode === "transfer") {
        const from = document.getElementById("txFromAccount").value;
        const to = document.getElementById("txToAccount").value;
        if (!from || !to || from === to) return;
        addTransaction({ ...base, type: "transfer", accountId: from, toAccountId: to });
      } else if (mode === "expense") {
        if (sourceType === "card") {
          if (!cardId) return;
          addTransaction({ ...base, type: "expense", category: category || null, accountId: null, cardId });
        } else {
          const accId = document.getElementById("txAccountSelect").value;
          if (!accId) return;
          addTransaction({ ...base, type: "expense", category: category || null, accountId: accId, cardId: null });
        }
      } else {
        const accId = document.getElementById("txAccountSelect").value;
        if (!accId) return;
        addTransaction({ ...base, type: "income", category: category || null, accountId: accId });
      }
      closeModal();
      renderApp();
    });
  }
  wire();
}

/* ---------- global namespace for inline handlers ---------- */
window.C = {
  setTab(tab) { ui.activeTab = tab; renderApp(); },
  setRecordYear(y) { ui.recordYear = y; renderApp(); },
  setGraphMode(m) { ui.graphMode = m; renderApp(); },
  setCatViewType(t) { ui.catViewType = t; ui.catViewCategory = ""; renderApp(); },
  setCatViewCategory(c) { ui.catViewCategory = c; renderApp(); },
  deleteTx(id) { deleteTransaction(id); },
  removeCategory(kind, name) { removeCategory(kind, name); },
  addCategoryFromInput(kind, inputId) {
    const el = document.getElementById(inputId);
    addCategory(kind, el.value);
    el.value = "";
    renderApp();
  },
  openTxModal(mode, presetAccountId) { openTxModal(mode, presetAccountId); },
  openAccountModal() { openAccountModal(); },
  openCardModal() { openCardModal(); },
  closeModal() { closeModal(); },
  exportBackup() { exportBackup(); },
  handleImportFile(inputEl) {
    const file = inputEl.files && inputEl.files[0];
    if (file) importBackupFile(file);
    inputEl.value = "";
  },
  confirmReset() { confirmReset(); },
};

/* ---------- init ---------- */
loadData();
renderApp();
