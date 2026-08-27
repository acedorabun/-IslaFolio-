"use strict";

/* =========================================================
   IslaFolio — vanilla-JS PWA edition
   ========================================================= */

const LS_KEY = "islafolio:data";

const PALETTE = ["#4FBE8D", "#7FB3C4", "#D97757", "#5E93A6", "#8FA998", "#C9A66B", "#6B7FA3", "#4A8F7C"];
const CATEGORY_PALETTE = ["#D97757", "#4FBE8D", "#7FB3C4", "#C9A66B", "#6B7FA3", "#8FA998", "#5E93A6", "#4A8F7C", "#B98A9A", "#8A9BA8"];
const DEFAULT_EXPENSE_CATS = ["食費", "日用品", "光熱費", "通信費", "住居費", "交通費", "娯楽", "医療", "衣服", "交際費", "その他"];
const DEFAULT_INCOME_CATS = ["給与", "副業", "お小遣い", "ボーナス", "贈与", "その他"];
const MONTH_NAMES = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

/* ---------- Google Drive sync config ----------
   READMEの手順でGoogle Cloud ConsoleからOAuthクライアントIDを取得し、
   下の値を書き換えてください。
--------------------------------------------------*/
const CONFIG = {
  GOOGLE_CLIENT_ID: "983014776265-5bkndcmmaijm61ieedjf43de6a8hccq6.apps.googleusercontent.com",
};
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const DRIVE_FILE_NAME = "islafolio-data.json";
const DRIVE_CONNECTED_KEY = "islafolio:drive_connected";
const DRIVE_AUTOSYNC_KEY = "islafolio:drive_autosync";
const DRIVE_LAST_SYNC_KEY = "islafolio:drive_last_synced_at";
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
  calendar: '<rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  compass: '<circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.2 13.2 8.5 15.5 10.8 10.8 15.5 8.5"/>',
  cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 6 19h11.5z"/>',
  cloudOff: '<path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97"/><path d="M9.2 5.2A6 6 0 0 1 17.9 10.5"/><path d="M5.6 8A4 4 0 0 0 6 19h9.5"/><line x1="2" y1="2" x2="22" y2="22"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
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
function shadeColor(hex, percent) {
  // percent negative = darker, positive = lighter
  const n = hex.replace("#", "");
  const num = parseInt(n, 16);
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function formatAmountInput(el) {
  const raw = el.value.replace(/[^\d]/g, "");
  const pos = el.selectionStart;
  const before = el.value.length;
  el.value = raw ? Number(raw).toLocaleString("ja-JP") : "";
  const after = el.value.length;
  const newPos = Math.max(0, (pos || after) + (after - before));
  try { el.setSelectionRange(newPos, newPos); } catch (e) { /* ignore on unsupported input types */ }
}
function parseAmountInput(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  return Number(el.value.replace(/[^\d]/g, "")) || 0;
}

/* ---------- persisted data ---------- */
let data = {
  accounts: [],
  cards: [],
  transactions: [],
  expenseCats: DEFAULT_EXPENSE_CATS.slice(),
  incomeCats: DEFAULT_INCOME_CATS.slice(),
  recurringExpenses: [],
};

/* ---------- transient UI state ---------- */
let ui = {
  activeTab: "home",
  recordYear: String(new Date().getFullYear()),
  graphMode: "all",
  catViewType: "expense",
  catViewCategory: "",
  statusMsg: null,
  driveStatusMsg: null,
  netWorthViewMonth: "",
  txFilterMode: "all",
  txFilterMonth: "",
  graphCenterMonth: "",
};

/* ---------- Google Drive sync state (not persisted in data payload) ---------- */
let drive = {
  gisReady: false,
  tokenClient: null,
  token: null,
  connected: false,
  busy: false,
  lastSync: null,
  autoSync: localStorage.getItem(DRIVE_AUTOSYNC_KEY) !== "0",
};
let driveAutoSyncTimer = null;

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
      data.recurringExpenses = parsed.recurringExpenses || [];
      return;
    }
  } catch (e) { /* fall through to defaults */ }
  data.accounts = [
    { id: uid(), name: "メイン銀行", type: "bank", initialBalance: 0, color: PALETTE[1] },
    { id: uid(), name: "財布", type: "wallet", initialBalance: 0, color: PALETTE[2] },
  ];
}
function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) { /* storage full/unavailable */ }
  scheduleDriveAutoSync();
}

/* ---------- Google Drive sync ---------- */
function driveConfigured() {
  return !!(CONFIG.GOOGLE_CLIENT_ID && CONFIG.GOOGLE_CLIENT_ID.indexOf("YOUR_GOOGLE_OAUTH_CLIENT_ID") === -1);
}
function onGisReady() {
  drive.gisReady = true;
  if (!driveConfigured()) return;
  initGoogleClient();
  if (localStorage.getItem(DRIVE_CONNECTED_KEY) === "1") connectDrive(false);
}
window.onGisReady = onGisReady;

function initGoogleClient() {
  if (drive.tokenClient || !window.google || !google.accounts || !google.accounts.oauth2) return;
  drive.tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CONFIG.GOOGLE_CLIENT_ID,
    scope: DRIVE_SCOPE,
    callback: (resp) => {
      drive.busy = false;
      if (resp && resp.access_token) {
        drive.token = resp.access_token;
        drive.connected = true;
        localStorage.setItem(DRIVE_CONNECTED_KEY, "1");
        handleDriveConnected();
      } else {
        ui.driveStatusMsg = { type: "error", text: "Googleへのログインに失敗しました。" };
        renderApp();
      }
    },
    error_callback: () => {
      drive.busy = false;
      ui.driveStatusMsg = { type: "error", text: "Googleへのログインがキャンセルされました。" };
      renderApp();
    },
  });
}
function connectDrive(interactive) {
  if (!driveConfigured()) {
    ui.driveStatusMsg = { type: "error", text: "READMEの手順でGoogle Cloud ConsoleのクライアントIDを設定してください。" };
    renderApp();
    return;
  }
  if (!drive.tokenClient) initGoogleClient();
  if (!drive.tokenClient) {
    ui.driveStatusMsg = { type: "error", text: "Googleログイン機能の読み込みに失敗しました。しばらくしてから再度お試しください。" };
    renderApp();
    return;
  }
  drive.busy = true;
  renderApp();
  drive.tokenClient.requestAccessToken({ prompt: interactive ? "consent" : "" });
}
function disconnectDrive() {
  if (drive.token && window.google && google.accounts && google.accounts.oauth2) {
    google.accounts.oauth2.revoke(drive.token, () => {});
  }
  drive.token = null;
  drive.connected = false;
  drive.lastSync = null;
  localStorage.removeItem(DRIVE_CONNECTED_KEY);
  ui.driveStatusMsg = { type: "success", text: "Google Driveとの連携を解除しました。" };
  renderApp();
}
async function handleDriveConnected() {
  ui.driveStatusMsg = { type: "success", text: "Google Driveに接続しました。確認しています…" };
  renderApp();
  try {
    const remote = await driveDownload();
    const lastKnown = localStorage.getItem(DRIVE_LAST_SYNC_KEY);
    if (remote && remote.syncedAt && (!lastKnown || remote.syncedAt > lastKnown)) {
      // Drive genuinely has data newer than anything we've seen before -> safe to pull.
      applyRemoteData(remote);
      localStorage.setItem(DRIVE_LAST_SYNC_KEY, remote.syncedAt);
      ui.driveStatusMsg = { type: "success", text: "Driveの新しいデータを取得しました。" };
    } else {
      // Drive has nothing, or nothing newer than what we already synced last time -> this
      // device may hold edits Drive doesn't have yet (e.g. made while logged out), so push
      // instead of overwriting them.
      const syncedAt = await driveUpload();
      localStorage.setItem(DRIVE_LAST_SYNC_KEY, syncedAt);
      ui.driveStatusMsg = { type: "success", text: remote ? "この端末の内容をDriveに保存しました。" : "接続しました（この端末の内容をDriveに保存しました）。" };
    }
    drive.lastSync = new Date().toISOString();
  } catch (e) {
    ui.driveStatusMsg = { type: "error", text: `Driveとの同期確認に失敗しました（${driveErrorText(e)}）。` };
  }
  renderApp();
}
function driveErrorText(e) {
  if (e && e.status === 403) return "権限エラー(403)。Google Drive APIが有効化されているか、OAuth同意画面のスコープにdrive.appdataが追加されているかご確認ください";
  if (e && e.status === 401) return "認証切れ(401)。再度ログインしてください";
  if (e && e.status === 404) return "見つかりません(404)";
  if (e && e.detail) return `${e.status}: ${e.detail}`;
  if (e && e.message) return e.message;
  return "不明なエラー";
}
async function driveApiFetch(url, options) {
  options = options || {};
  options.headers = Object.assign({}, options.headers, { Authorization: `Bearer ${drive.token}` });
  const res = await fetch(url, options);
  if (!res.ok) {
    let detail = "";
    try { const errJson = await res.json(); detail = (errJson.error && errJson.error.message) || ""; } catch (e) { /* ignore parse failure */ }
    const err = new Error(`drive_api_error_${res.status}`);
    err.status = res.status;
    err.detail = detail;
    throw err;
  }
  return res;
}
async function driveFindFile() {
  const q = encodeURIComponent(`name='${DRIVE_FILE_NAME}' and trashed=false`);
  const res = await driveApiFetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,name,modifiedTime)`);
  const json = await res.json();
  return (json.files && json.files[0]) || null;
}
async function driveUpload() {
  const syncedAt = new Date().toISOString();
  const payload = JSON.stringify({
    accounts: data.accounts, cards: data.cards, transactions: data.transactions,
    expenseCats: data.expenseCats, incomeCats: data.incomeCats, recurringExpenses: data.recurringExpenses,
    syncedAt,
  });
  const existing = await driveFindFile();
  if (existing) {
    await driveApiFetch(`https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=media`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: payload,
    });
  } else {
    const boundary = "islafolio_boundary_xyz";
    const metadata = { name: DRIVE_FILE_NAME, parents: ["appDataFolder"] };
    const body =
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${payload}\r\n--${boundary}--`;
    await driveApiFetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST", headers: { "Content-Type": `multipart/related; boundary=${boundary}` }, body,
    });
  }
  return syncedAt;
}
async function driveDownload() {
  const existing = await driveFindFile();
  if (!existing) return null;
  const res = await driveApiFetch(`https://www.googleapis.com/drive/v3/files/${existing.id}?alt=media`);
  return await res.json();
}
function applyRemoteData(remote) {
  data.accounts = remote.accounts || [];
  data.cards = remote.cards || [];
  data.transactions = remote.transactions || [];
  data.expenseCats = remote.expenseCats || DEFAULT_EXPENSE_CATS.slice();
  data.incomeCats = remote.incomeCats || DEFAULT_INCOME_CATS.slice();
  data.recurringExpenses = remote.recurringExpenses || [];
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
}
function scheduleDriveAutoSync() {
  if (!drive.autoSync || !drive.connected || drive.token == null) return;
  clearTimeout(driveAutoSyncTimer);
  driveAutoSyncTimer = setTimeout(() => {
    drive.busy = true;
    driveUpload()
      .then((syncedAt) => { localStorage.setItem(DRIVE_LAST_SYNC_KEY, syncedAt); drive.lastSync = new Date().toISOString(); drive.busy = false; renderApp(); })
      .catch((e) => { drive.busy = false; ui.driveStatusMsg = { type: "error", text: `自動保存に失敗しました（${driveErrorText(e)}）。` }; renderApp(); });
  }, 4000);
}
function manualDriveUpload() {
  if (!drive.connected) return;
  drive.busy = true; renderApp();
  driveUpload()
    .then((syncedAt) => { localStorage.setItem(DRIVE_LAST_SYNC_KEY, syncedAt); drive.lastSync = new Date().toISOString(); drive.busy = false; ui.driveStatusMsg = { type: "success", text: "Driveに保存しました。" }; renderApp(); })
    .catch((e) => { drive.busy = false; ui.driveStatusMsg = { type: "error", text: `Driveへの保存に失敗しました（${driveErrorText(e)}）。` }; renderApp(); });
}
function manualDriveDownload() {
  if (!drive.connected) return;
  openConfirmModal("Driveの最新データを取得します。現在この端末にあるデータは上書きされます。よろしいですか？（この操作は明示的な復元なので、保存時刻に関わらずDriveの内容を適用します）", () => {
    drive.busy = true; renderApp();
    driveDownload()
      .then((remote) => {
        drive.busy = false;
        if (remote) {
          applyRemoteData(remote);
          if (remote.syncedAt) localStorage.setItem(DRIVE_LAST_SYNC_KEY, remote.syncedAt);
          ui.driveStatusMsg = { type: "success", text: "Driveから復元しました。" };
        } else { ui.driveStatusMsg = { type: "error", text: "Drive上にバックアップが見つかりませんでした。" }; }
        drive.lastSync = new Date().toISOString();
        renderApp();
      })
      .catch((e) => { drive.busy = false; ui.driveStatusMsg = { type: "error", text: `Driveからの取得に失敗しました（${driveErrorText(e)}）。` }; renderApp(); });
  });
}
function toggleDriveAutoSync() {
  drive.autoSync = !drive.autoSync;
  localStorage.setItem(DRIVE_AUTOSYNC_KEY, drive.autoSync ? "1" : "0");
  if (drive.autoSync) scheduleDriveAutoSync();
  renderApp();
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
function recurringMonthlyTotals(mk) {
  let income = 0, expense = 0;
  data.recurringExpenses.forEach((r) => {
    if (mk < r.startMonth) return;
    if (r.endMonth && mk > r.endMonth) return;
    if (r.type === "income") income += r.amount; else expense += r.amount;
  });
  return { income, expense };
}
function addMonths(mk, offset) {
  let [y, m] = mk.split("-").map(Number);
  m += offset;
  while (m > 12) { m -= 12; y += 1; }
  while (m < 1) { m += 12; y -= 1; }
  return `${y}-${String(m).padStart(2, "0")}`;
}
function windowMonthlyStats(centerMonth) {
  const nowKey = currentMonthKey();
  const months = [];
  for (let offset = -5; offset <= 6; offset++) {
    const mk = addMonths(centerMonth, offset);
    const m = parseInt(mk.slice(5, 7), 10);
    const label = m === 1 ? `${mk.slice(0, 4)}年1月` : `${m}月`;
    months.push({ month: mk, label, income: 0, expense: 0, projected: mk > nowKey });
  }
  const byKey = {}; months.forEach((mo) => (byKey[mo.month] = mo));
  data.transactions.forEach((tx) => {
    const mk = monthKeyOf(tx.date);
    if (!byKey[mk] || byKey[mk].projected) return;
    if (tx.type === "income") byKey[mk].income += tx.amount;
    if (tx.type === "expense") byKey[mk].expense += tx.amount;
  });
  months.forEach((mo) => {
    if (mo.projected) {
      const t = recurringMonthlyTotals(mo.month);
      mo.income = t.income; mo.expense = t.expense;
    }
    mo.net = mo.income - mo.expense;
  });
  return months;
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
function copyTx(id) {
  const tx = data.transactions.find((t) => t.id === id);
  if (!tx) return;
  openTxModal(tx.type, null, {
    amount: tx.amount, memo: tx.memo, category: tx.category, date: tx.date,
    accountId: tx.accountId, cardId: tx.cardId, toAccountId: tx.toAccountId,
  });
}
function deleteTxConfirm(id) {
  const tx = data.transactions.find((t) => t.id === id);
  if (!tx) return;
  const label = tx.memo || (tx.type === "transfer" ? "資金移動" : "（メモなし）");
  openConfirmModal(`この記録（${label}／${formatYen(tx.amount)}）を削除します。この操作は取り消せません。よろしいですか？`, () => deleteTransaction(id));
}
function txRowTap(e, id) {
  if (e.target.closest("button")) return;
  openTxDetail(id);
}
function openTxDetail(id) {
  const tx = data.transactions.find((t) => t.id === id);
  if (!tx) return;
  const accent = tx.type === "expense" ? "var(--coral)" : tx.type === "income" ? "var(--mint-deep)" : "var(--wash)";
  const typeLabel = tx.type === "expense" ? "出費" : tx.type === "income" ? "入金" : "資金移動";
  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3 style="color:${accent}">${typeLabel}の詳細</h3>
        <div class="kb-field"><label>日付</label><div>${tx.date}</div></div>
        ${tx.category ? `<div class="kb-field"><label>種類</label><div><span class="kb-tx-cat" style="background:${hashColor(tx.category, CATEGORY_PALETTE)}">${escapeHtml(tx.category)}</span></div></div>` : ""}
        <div class="kb-field"><label>用途・メモ</label><div style="font-size:14px">${escapeHtml(tx.memo || "（メモなし）")}</div></div>
        <div class="kb-field"><label>${tx.type === "transfer" ? "移動元 → 移動先" : tx.type === "income" ? "入金先" : "支払い元"}</label><div style="font-size:14px">${escapeHtml(sourceLabel(tx))}</div></div>
        <div class="kb-field"><label>金額</label><div class="kb-num" style="font-size:19px;color:${accent}">${tx.type === "expense" ? "−" : tx.type === "income" ? "+" : ""}${formatYen(tx.amount)}</div></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          ${tx.type !== "transfer" ? `<button class="kb-outline-btn" style="flex:1;justify-content:center" onclick="C.copyTx('${tx.id}')">${icon("copy", 15)} コピーして入力</button>` : ""}
          <button class="kb-danger-btn" style="flex:1" onclick="C.deleteTxConfirm('${tx.id}')">${icon("trash", 15)} 削除</button>
        </div>
      </div>
    </div>`);
}

/* ---------- recurring fixed costs ---------- */
function currentMonthKey() { return monthKeyOf(todayStr()); }
function nextMonthKeyOf(mk) {
  let [y, m] = mk.split("-").map(Number);
  m += 1; if (m > 12) { m = 1; y += 1; }
  return `${y}-${String(m).padStart(2, "0")}`;
}
function monthRangeInclusive(start, end) {
  const res = [];
  if (start > end) return res;
  let [y, m] = start.split("-").map(Number);
  const [ey, em] = end.split("-").map(Number);
  while (y < ey || (y === ey && m <= em)) {
    res.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1; if (m > 12) { m = 1; y += 1; }
  }
  return res;
}
function recurringSourceLabel(r) {
  if (r.cardId) {
    const c = getCard(r.cardId), acc = c ? getAccount(c.linkedAccountId) : null;
    return `${acc ? acc.name : "?"}（${c ? c.name : "?"}）`;
  }
  const acc = getAccount(r.accountId);
  return acc ? acc.name : "?";
}
function materializeRecurringExpenses() {
  const nowKey = currentMonthKey();
  let changed = false;
  data.recurringExpenses.forEach((r) => {
    const end = r.endMonth && r.endMonth < nowKey ? r.endMonth : nowKey;
    monthRangeInclusive(r.startMonth, end).forEach((mk) => {
      const exists = data.transactions.some((t) => t.recurringId === r.id && monthKeyOf(t.date) === mk);
      if (!exists) {
        data.transactions.push({
          id: uid(), type: r.type === "income" ? "income" : "expense", date: `${mk}-01`, amount: r.amount,
          memo: r.name, category: r.category || null,
          accountId: r.cardId ? null : r.accountId, cardId: r.cardId || null,
          recurringId: r.id,
        });
        changed = true;
      }
    });
  });
  if (changed) saveState();
}
function activeRecurringMonthlyTotal() {
  const nowKey = currentMonthKey();
  return data.recurringExpenses
    .filter((r) => r.startMonth <= nowKey && (!r.endMonth || r.endMonth >= nowKey))
    .reduce((s, r) => s + (r.type === "income" ? r.amount : -r.amount), 0);
}
function projectedNetWorth(targetMonth) {
  let total = netWorth();
  const nowKey = currentMonthKey();
  if (!targetMonth || targetMonth <= nowKey) return total;
  const months = monthRangeInclusive(nextMonthKeyOf(nowKey), targetMonth);
  data.recurringExpenses.forEach((r) => {
    months.forEach((mk) => {
      if (mk < r.startMonth) return;
      if (r.endMonth && mk > r.endMonth) return;
      total += r.type === "income" ? r.amount : -r.amount;
    });
  });
  return total;
}
function getAccountBalanceBefore(accountId, cutoffExclusiveDateStr) {
  const acc = getAccount(accountId);
  if (!acc) return 0;
  let bal = acc.initialBalance || 0;
  data.transactions.forEach((tx) => {
    if (tx.date >= cutoffExclusiveDateStr) return;
    if (tx.type === "expense") { if (resolvedAccountIdForTx(tx) === accountId) bal -= tx.amount; }
    else if (tx.type === "income") { if (tx.accountId === accountId) bal += tx.amount; }
    else if (tx.type === "transfer") {
      if (tx.accountId === accountId) bal -= tx.amount;
      if (tx.toAccountId === accountId) bal += tx.amount;
    }
  });
  return bal;
}
function netWorthAtMonth(mk) {
  const nowKey = currentMonthKey();
  if (!mk || mk === nowKey) return netWorth();
  if (mk > nowKey) return projectedNetWorth(mk);
  const cutoffExclusive = `${nextMonthKeyOf(mk)}-01`;
  return data.accounts.reduce((sum, a) => sum + getAccountBalanceBefore(a.id, cutoffExclusive), 0);
}
function projectedAccountBalance(accountId, targetMonth) {
  let bal = getAccountBalance(accountId);
  const nowKey = currentMonthKey();
  if (!targetMonth || targetMonth <= nowKey) return bal;
  const months = monthRangeInclusive(nextMonthKeyOf(nowKey), targetMonth);
  data.recurringExpenses.forEach((r) => {
    const resolvedAcc = r.cardId ? ((getCard(r.cardId) || {}).linkedAccountId) : r.accountId;
    if (resolvedAcc !== accountId) return;
    months.forEach((mk) => {
      if (mk < r.startMonth) return;
      if (r.endMonth && mk > r.endMonth) return;
      bal += r.type === "income" ? r.amount : -r.amount;
    });
  });
  return bal;
}
function accountValueAtMonth(accountId, mk) {
  const nowKey = currentMonthKey();
  if (!mk || mk === nowKey) return getAccountBalance(accountId);
  if (mk > nowKey) return projectedAccountBalance(accountId, mk);
  const cutoffExclusive = `${nextMonthKeyOf(mk)}-01`;
  return getAccountBalanceBefore(accountId, cutoffExclusive);
}

/* ---------- mutations ---------- */
function addTransaction(tx) { data.transactions.push({ id: uid(), ...tx }); saveState(); }
function deleteTransaction(id) { data.transactions = data.transactions.filter((t) => t.id !== id); saveState(); renderApp(); }
function addAccountRecord(acc) { data.accounts.push({ id: uid(), ...acc }); saveState(); }
function addCardRecord(card) { data.cards.push({ id: uid(), ...card }); saveState(); }
function deleteAccountCascade(id) {
  const linkedCardIds = data.cards.filter((c) => c.linkedAccountId === id).map((c) => c.id);
  data.cards = data.cards.filter((c) => c.linkedAccountId !== id);
  data.transactions = data.transactions.filter((t) => {
    if (t.accountId === id || t.toAccountId === id) return false;
    if (t.cardId && linkedCardIds.includes(t.cardId)) return false;
    return true;
  });
  data.recurringExpenses = data.recurringExpenses.filter((r) => !(r.accountId === id || linkedCardIds.includes(r.cardId)));
  data.accounts = data.accounts.filter((a) => a.id !== id);
  saveState(); renderApp();
}
function deleteCardCascade(id) {
  data.transactions = data.transactions.filter((t) => t.cardId !== id);
  data.recurringExpenses = data.recurringExpenses.filter((r) => r.cardId !== id);
  data.cards = data.cards.filter((c) => c.id !== id);
  saveState(); renderApp();
}
function addRecurringExpense(r) {
  data.recurringExpenses.push({ id: uid(), type: "expense", ...r });
  materializeRecurringExpenses();
  saveState(); renderApp();
}
function updateRecurringExpense(id, patch) {
  const idx = data.recurringExpenses.findIndex((r) => r.id === id);
  if (idx === -1) return;
  data.recurringExpenses[idx] = { ...data.recurringExpenses[idx], ...patch };
  const nowKey = currentMonthKey();
  // drop current/future auto-generated entries so they regenerate with the new values;
  // past months stay as historical fact.
  data.transactions = data.transactions.filter((t) => !(t.recurringId === id && monthKeyOf(t.date) >= nowKey));
  materializeRecurringExpenses();
  saveState(); renderApp();
}
function removeRecurringExpense(id) {
  data.recurringExpenses = data.recurringExpenses.filter((r) => r.id !== id);
  data.transactions = data.transactions.filter((t) => t.recurringId !== id);
  saveState(); renderApp();
}
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
  a.href = url; a.download = `islafolio-backup-${todayStr()}.json`;
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
  const firstProjectedIdx = stats.findIndex((s) => s.projected);
  stats.forEach((s, i) => {
    const cx = padL + groupW * i + groupW / 2;
    const xIncome = cx - barW - 2, xExpense = cx + 2;
    const baseline = yRight(0);
    const yInc = yRight(s.income), yExp = yRight(s.expense);
    const op = s.projected ? ' fill-opacity="0.45"' : "";
    bars += `<rect x="${xIncome.toFixed(1)}" y="${yInc.toFixed(1)}" width="${barW.toFixed(1)}" height="${(baseline - yInc).toFixed(1)}" fill="#4FBE8D" rx="3"${op}/>`;
    bars += `<rect x="${xExpense.toFixed(1)}" y="${yExp.toFixed(1)}" width="${barW.toFixed(1)}" height="${(baseline - yExp).toFixed(1)}" fill="#D97757" rx="3"${op}/>`;
    linePoints.push([cx, yLeft(s.net), !!s.projected]);
    xlabels += `<text x="${cx.toFixed(1)}" y="${h - 8}" font-size="10" fill="${s.projected ? "#8A9BA8" : "#5D7688"}" text-anchor="middle">${s.label}</text>`;
  });
  // split the net line into a solid (actual) segment and a dashed (projected) segment
  let solidPath = "", dashedPath = "";
  linePoints.forEach((p, i) => {
    const seg = (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1) + " ";
    if (p[2]) dashedPath += seg; else solidPath += seg;
    if (i > 0 && !linePoints[i - 1][2] && p[2]) {
      // bridge the join point so the dashed segment connects smoothly to the solid one
      dashedPath = "M" + linePoints[i - 1][0].toFixed(1) + "," + linePoints[i - 1][1].toFixed(1) + " " + dashedPath;
    }
  });
  let grid = "";
  for (let i = 0; i <= 4; i++) { const y = padT + (plotH / 4) * i; grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#DCE7E9" stroke-width="1"/>`; }
  const leftLabels = `
    <text x="${padL - 8}" y="${yLeft(maxLeftAbs) + 4}" font-size="10" fill="#16324F" text-anchor="end">${formatYenShort(maxLeftAbs)}</text>
    <text x="${padL - 8}" y="${yLeft(0) + 4}" font-size="10" fill="#16324F" text-anchor="end">0</text>
    <text x="${padL - 8}" y="${yLeft(-maxLeftAbs) + 4}" font-size="10" fill="#16324F" text-anchor="end">-${formatYenShort(maxLeftAbs)}</text>`;
  const rightLabels = `
    <text x="${w - padR + 8}" y="${yRight(maxRight) + 4}" font-size="10" fill="#5D7688">${formatYenShort(maxRight)}</text>
    <text x="${w - padR + 8}" y="${yRight(0) + 4}" font-size="10" fill="#5D7688">0</text>`;
  let separator = "";
  if (firstProjectedIdx > 0) {
    const bx = padL + groupW * firstProjectedIdx;
    separator = `
      <line x1="${bx.toFixed(1)}" y1="${padT}" x2="${bx.toFixed(1)}" y2="${padT + plotH}" stroke="#16324F" stroke-dasharray="2 3" stroke-width="1" opacity="0.45"/>
      <text x="${(bx + 4).toFixed(1)}" y="${padT + 11}" font-size="9.5" fill="#8A9BA8">予測 →</text>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;display:block;">
    ${grid}
    <line x1="${padL}" y1="${yLeft(0)}" x2="${w - padR}" y2="${yLeft(0)}" stroke="#5D7688" stroke-dasharray="4 4"/>
    ${bars}
    ${separator}
    <path d="${solidPath}" fill="none" stroke="#16324F" stroke-width="2.75"/>
    ${dashedPath ? `<path d="${dashedPath}" fill="none" stroke="#16324F" stroke-width="2.75" stroke-dasharray="5 4"/>` : ""}
    ${linePoints.map((p) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3" fill="#16324F"${p[2] ? ' fill-opacity="0.55"' : ""}/>`).join("")}
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
    bars += `<rect x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${barW.toFixed(1)}" height="${(padT + plotH - yy).toFixed(1)}" fill="${color}" rx="3"/>`;
    xlabels += `<text x="${cx.toFixed(1)}" y="${h - 8}" font-size="10" fill="#5D7688" text-anchor="middle">${s.label}</text>`;
  });
  let grid = "";
  for (let i = 0; i <= 4; i++) { const yy = padT + (plotH / 4) * i; grid += `<line x1="${padL}" y1="${yy}" x2="${w - padR}" y2="${yy}" stroke="#DCE7E9" stroke-width="1"/>`; }
  const maxLabel = `<text x="${padL - 8}" y="${padT + 4}" font-size="10" fill="#5D7688" text-anchor="end">${formatYenShort(max)}</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;display:block;">${grid}${bars}${xlabels}${maxLabel}</svg>`;
}

/* ---------- render: header ---------- */
function renderHeader() {
  const nowKey = currentMonthKey();
  if (!ui.netWorthViewMonth) ui.netWorthViewMonth = nowKey;
  const viewed = netWorthAtMonth(ui.netWorthViewMonth);
  let label = "純資産合計";
  if (ui.netWorthViewMonth > nowKey) label = `${monthDisplayLabel(ui.netWorthViewMonth)}の資産予測`;
  else if (ui.netWorthViewMonth < nowKey) label = `${monthDisplayLabel(ui.netWorthViewMonth)}時点の純資産`;
  return `
    <div class="kb-header">
      <div class="kb-title">
        <div class="kb-logo-mark"></div>
        <div class="kb-title-text">
          <span class="brand logo-font">IslaFolio</span>
          <span class="tagline">資産の島々</span>
        </div>
      </div>
      <div class="kb-netbadge" onclick="C.netBadgeTap(event)" style="cursor:pointer">
        <div class="kb-net-dot"></div>
        <div>
          <div class="kb-netlabel">${label}
            <input type="month" value="${ui.netWorthViewMonth}" onchange="C.setNetWorthViewMonth(this.value)" onclick="event.stopPropagation()" style="border:none;background:none;font-size:10.5px;color:var(--ink-soft);font-family:inherit;padding:0;margin-left:4px" />
          </div>
          <div class="kb-netvalue kb-num">${formatYen(viewed)}</div>
        </div>
      </div>
    </div>`;
}
function monthDisplayLabel(mk) {
  const [y, m] = mk.split("-");
  return `${y}年${parseInt(m, 10)}月`;
}

/* ---------- render: home tab ---------- */
function renderHomeTab() {
  const islandsHtml = data.accounts.map((acc) => {
    const meta = TYPE_META[acc.type] || TYPE_META.bank;
    const deep = shadeColor(acc.color, -16);
    return `
      <div class="kb-island" data-reorder-item="account" data-id="${acc.id}" style="--island-color:${acc.color};--island-color-deep:${deep}" onclick="C.islandTap(event, '${acc.id}')">
        <div class="kb-island-top" data-reorder-handle>
          <span class="kb-island-icon">${icon(meta.icon, 14)}</span>
          ${icon("grip", 15).replace('class="icon"', 'class="icon kb-island-grip"')}
        </div>
        <div>
          <div class="kb-island-name">${escapeHtml(acc.name)}</div>
          <span class="kb-island-type">${meta.label}</span>
          <div class="kb-island-balance kb-num">${formatYen(getAccountBalance(acc.id))}</div>
        </div>
        <div class="kb-island-actions">
          <button class="kb-island-mini-btn" title="入金" onclick="C.openTxModal('income', '${acc.id}')">${icon("arrowDown", 14)}</button>
          <button class="kb-island-mini-btn" title="移動" onclick="C.openTxModal('transfer', '${acc.id}')">${icon("transfer", 14)}</button>
          <button class="kb-island-mini-btn" title="使用" onclick="C.openTxModal('expense', '${acc.id}')">${icon("arrowUp", 14)}</button>
        </div>
      </div>`;
  }).join("");

  const docksHtml = data.cards.map((c) => {
    const acc = getAccount(c.linkedAccountId);
    return `
      <div class="kb-dock" data-reorder-item="card" data-id="${c.id}" data-reorder-handle style="--dock-color:${c.color}" onclick="C.dockTap(event, '${c.id}')">
        <div class="kb-dock-top">
          <span class="kb-dock-icon">${icon("card", 13)}</span>
          <span class="kb-dock-name">${escapeHtml(c.name)}</span>
          ${icon("grip", 15).replace('class="icon"', 'class="icon kb-dock-grip"')}
        </div>
        <div class="kb-dock-sub">支払元：${escapeHtml(acc ? acc.name : "未設定")}</div>
      </div>`;
  }).join("");

  const nowKey = currentMonthKey();
  const recurringRows = data.recurringExpenses.map((r) => {
    const period = `${r.startMonth}〜${r.endMonth || "終了なし"}`;
    const isActive = r.startMonth <= nowKey && (!r.endMonth || r.endMonth >= nowKey);
    const isIncome = r.type === "income";
    return `
      <div class="kb-cat-manage-row" style="align-items:flex-start;cursor:pointer" onclick="if(!event.target.closest('button'))C.openRecurringModal('${r.id}')">
        <span>
          ${r.category ? `<span class="kb-tx-cat" style="background:${hashColor(r.category, CATEGORY_PALETTE)}">${escapeHtml(r.category)}</span>` : ""}
          <span class="kb-tx-cat" style="background:${isIncome ? "var(--mint-deep)" : "var(--coral)"}">${isIncome ? "収入" : "支出"}</span>
          <b style="color:var(--navy)">${escapeHtml(r.name)}</b>　${formatYen(r.amount)}${isActive ? "" : `<span style="color:var(--ink-soft)">（現在は対象外）</span>`}
          <div style="font-size:11px;color:var(--ink-soft);margin-top:3px">${escapeHtml(recurringSourceLabel(r))}／${period}</div>
        </span>
        <button onclick="event.stopPropagation();C.deleteRecurringConfirm('${r.id}')">${icon("trash", 14)}</button>
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
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="kb-panel-icon">${icon("bank", 15)}</span><h2>資金源の島々</h2></div>
      <div class="kb-hint">タップで入金・移動・使用を選択、長押しで並び替えできます</div>
      <div class="kb-island-grid">
        ${islandsHtml}
        <button class="kb-add-island" onclick="C.openAccountModal()">${icon("plus", 20)}<span>島を追加</span></button>
      </div>
    </div>
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="kb-panel-icon navy">${icon("card", 15)}</span><h2>カード</h2></div>
      <div class="kb-hint">タップで出費を記録${data.cards.length > 1 ? "、長押しで並び替え" : ""}できます</div>
      <div class="kb-dock-grid">
        ${docksHtml}
        <button class="kb-add-island" style="min-height:auto;padding:20px 0" ${data.accounts.length === 0 ? "disabled" : ""} onclick="C.openCardModal()">${icon("plus", 18)}<span>カードを追加</span></button>
      </div>
    </div>
    <div class="kb-panel" style="margin-bottom:0">
      <div class="kb-panel-title"><span class="kb-panel-icon coral">${icon("calendar", 15)}</span><h2>固定費・固定収入</h2></div>
      <div class="kb-hint" style="margin-top:-2px">現在有効な固定費の合計：${formatYen(activeRecurringMonthlyTotal())}／月　タップで内容を編集できます</div>
      ${data.recurringExpenses.length === 0 ? `<div class="kb-empty">登録された固定費・固定収入はありません</div>` : recurringRows}
      <button class="kb-add-btn" style="margin-top:10px" ${data.accounts.length === 0 ? "disabled" : ""} onclick="C.openRecurringModal()">${icon("plus", 14)} 固定費・固定収入を追加</button>
    </div>`;
}

/* ---------- render: record tab ---------- */
function renderRecordTab() {
  const years = availableYears();
  if (!ui.graphCenterMonth) ui.graphCenterMonth = currentMonthKey();
  const stats = windowMonthlyStats(ui.graphCenterMonth);
  const cats = ui.catViewType === "expense" ? data.expenseCats : data.incomeCats;
  if (!cats.includes(ui.catViewCategory)) ui.catViewCategory = cats[0] || "";
  const catSeries = categoryYearSeries(ui.recordYear, ui.catViewType, ui.catViewCategory);
  if (!ui.txFilterMonth) ui.txFilterMonth = currentMonthKey();
  const allTx = sortedTransactions();
  const tx = ui.txFilterMode === "month" ? allTx.filter((t) => monthKeyOf(t.date) === ui.txFilterMonth) : allTx;

  const chartBlock = ui.graphMode === "all"
    ? `<div class="kb-chart-box kb-swipe-area" id="graphSwipeArea">
         <div id="graphSwipeTrack" class="kb-swipe-track">
           <div class="kb-chart-label">左目盛り：収支（折れ線）／ 右目盛り：入金・出費（棒）　${monthDisplayLabel(addMonths(ui.graphCenterMonth, -5))} 〜 ${monthDisplayLabel(addMonths(ui.graphCenterMonth, 6))}</div>
           ${composedChartSVG(stats)}
           <div class="kb-chart-legend">
             <span><i class="kb-legend-dot" style="background:#4FBE8D"></i>入金</span>
             <span><i class="kb-legend-dot" style="background:#D97757"></i>出費</span>
             <span><i class="kb-legend-dot" style="background:#16324F"></i>収支（左目盛り）</span>
             <span><i class="kb-legend-dot" style="background:#8A9BA8"></i>薄い部分は固定費・固定収入からの予測</span>
           </div>
         </div>
       </div>
       <div class="kb-hint" style="margin:6px 2px 0">左右にスワイプ、または月を選んで表示範囲を移動できます</div>`
    : `<div class="kb-chart-box">
         <div class="kb-chart-label">${escapeHtml(ui.catViewCategory || "カテゴリ未選択")}（${ui.recordYear}年 月別）</div>
         ${categoryBarChartSVG(catSeries, hashColor(ui.catViewCategory || "その他", CATEGORY_PALETTE))}
       </div>`;

  const txHtml = tx.length === 0 ? `<div class="kb-empty">${ui.txFilterMode === "month" ? "この月の記録はありません。" : "記録がありません。ホームタブのボタンから追加しましょう。"}</div>` : `
    <div class="kb-txlist">
      ${tx.map((t) => `
        <div class="kb-tx-row" onclick="C.txRowTap(event, '${t.id}')">
          <div class="kb-tx-mark" style="background:${t.type === "expense" ? "var(--coral)" : t.type === "income" ? "var(--mint)" : "var(--wash)"}"></div>
          <div class="kb-tx-date">${t.date.slice(5).replace("-", "/")}</div>
          <div class="kb-tx-mid">
            ${t.category ? `<div><span class="kb-tx-cat" style="background:${hashColor(t.category, CATEGORY_PALETTE)}">${escapeHtml(t.category)}</span></div>` : ""}
            <div class="kb-tx-memo">${escapeHtml(t.memo || (t.type === "transfer" ? "資金移動" : "（メモなし）"))}</div>
          </div>
          <div class="kb-tx-amt kb-num" style="color:${t.type === "expense" ? "var(--coral)" : t.type === "income" ? "var(--mint-deep)" : "var(--ink-soft)"}">
            ${t.type === "expense" ? "−" : t.type === "income" ? "+" : ""}${formatYen(t.amount)}
          </div>
          ${t.type !== "transfer" ? `<button class="kb-tx-del" onclick="C.copyTx('${t.id}')" title="コピーして新規入力">${icon("copy", 14)}</button>` : ""}
          <button class="kb-tx-del" onclick="C.deleteTxConfirm('${t.id}')" title="削除">${icon("trash", 14)}</button>
        </div>`).join("")}
    </div>`;

  return `
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="kb-panel-icon">${icon("book", 15)}</span><h2>グラフ</h2></div>
      <div class="kb-toolbar">
        <button class="kb-tabbtn ${ui.graphMode === "all" ? "active" : ""}" onclick="C.setGraphMode('all')">全カテゴリ</button>
        <button class="kb-tabbtn ${ui.graphMode === "byCategory" ? "active" : ""}" onclick="C.setGraphMode('byCategory')">カテゴリ別</button>
        ${ui.graphMode === "all"
          ? `<input type="month" class="kb-select" value="${ui.graphCenterMonth}" onchange="C.setGraphCenterMonth(this.value)" />`
          : `<select class="kb-select" onchange="C.setRecordYear(this.value)">
               ${years.map((y) => `<option value="${y}" ${y === ui.recordYear ? "selected" : ""}>${y}年</option>`).join("")}
             </select>
             <button class="kb-tabbtn ${ui.catViewType === "expense" ? "active" : ""}" onclick="C.setCatViewType('expense')">支出</button>
             <button class="kb-tabbtn ${ui.catViewType === "income" ? "active" : ""}" onclick="C.setCatViewType('income')">収入</button>
             <select class="kb-select" onchange="C.setCatViewCategory(this.value)">
               ${cats.map((c) => `<option value="${escapeHtml(c)}" ${c === ui.catViewCategory ? "selected" : ""}>${escapeHtml(c)}</option>`).join("")}
             </select>`}
      </div>
      ${chartBlock}
    </div>
    <div class="kb-panel" style="margin-bottom:0">
      <div class="kb-panel-title"><span class="kb-panel-icon navy">${icon("transfer", 15)}</span><h2>入出金履歴</h2></div>
      <div class="kb-toolbar">
        <button class="kb-tabbtn ${ui.txFilterMode !== "month" ? "active" : ""}" onclick="C.setTxFilterMode('all')">全期間</button>
        <button class="kb-tabbtn ${ui.txFilterMode === "month" ? "active" : ""}" onclick="C.setTxFilterMode('month')">月別</button>
        ${ui.txFilterMode === "month" ? `<input type="month" class="kb-select" value="${ui.txFilterMonth}" onchange="C.setTxFilterMonth(this.value)" />` : ""}
      </div>
      ${ui.txFilterMode === "month" ? `<div class="kb-hint" style="margin-top:-4px">左右にスワイプで前後の月へ移動できます</div>` : ""}
      <div class="kb-swipe-area" id="txSwipeArea"><div class="kb-swipe-track" id="txSwipeTrack">${txHtml}</div></div>
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

  const accountRows = data.accounts.map((a) => `
    <div class="kb-cat-manage-row">
      <span>${icon(TYPE_META[a.type] ? TYPE_META[a.type].icon : "bank", 13)} ${escapeHtml(a.name)}　<span style="color:var(--ink-soft)">${formatYen(getAccountBalance(a.id))}</span></span>
      <button onclick="C.deleteAccountConfirm('${a.id}')">${icon("trash", 14)}</button>
    </div>`).join("");
  const cardRows = data.cards.map((c) => `
    <div class="kb-cat-manage-row">
      <span>${icon("card", 13)} ${escapeHtml(c.name)}　<span style="color:var(--ink-soft)">支払元：${escapeHtml((getAccount(c.linkedAccountId) || {}).name || "未設定")}</span></span>
      <button onclick="C.deleteCardConfirm('${c.id}')">${icon("trash", 14)}</button>
    </div>`).join("");

  return `
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="kb-panel-icon coral">${icon("arrowUp", 15)}</span><h2>支出の種類を管理</h2></div>
      ${data.expenseCats.map((c) => catRow("expense", c)).join("")}
      <div class="kb-inline-add">
        <input type="text" id="newExpenseCat" placeholder="新しい種類を追加" />
        <button onclick="C.addCategoryFromInput('expense', 'newExpenseCat')">追加</button>
      </div>
    </div>
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="kb-panel-icon">${icon("arrowDown", 15)}</span><h2>収入の種類を管理</h2></div>
      ${data.incomeCats.map((c) => catRow("income", c)).join("")}
      <div class="kb-inline-add">
        <input type="text" id="newIncomeCat" placeholder="新しい種類を追加" />
        <button onclick="C.addCategoryFromInput('income', 'newIncomeCat')">追加</button>
      </div>
    </div>
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="kb-panel-icon navy">${icon("bank", 15)}</span><h2>島・カードの管理</h2></div>
      <div class="kb-hint" style="margin-top:-2px">削除すると、紐づく取引記録も一緒に削除されます</div>
      ${data.accounts.length === 0 ? `<div class="kb-empty">島がありません</div>` : accountRows}
      ${data.cards.length ? `<div style="height:8px"></div>${cardRows}` : ""}
    </div>
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="kb-panel-icon">${icon(drive.connected ? "cloud" : "cloudOff", 15)}</span><h2>クラウド同期（Google Drive）</h2></div>
      ${ui.driveStatusMsg ? `<div class="kb-status ${ui.driveStatusMsg.type}">${escapeHtml(ui.driveStatusMsg.text)}</div>` : ""}
      ${!driveConfigured() ? `
        <div class="kb-hint" style="margin-top:-2px">READMEの手順でGoogle Cloud ConsoleのOAuthクライアントIDを取得し、app.js内のCONFIG.GOOGLE_CLIENT_IDに設定すると使えるようになります。</div>
      ` : drive.connected ? `
        <div style="font-size:12.5px;color:var(--ink-soft);margin-bottom:10px">
          接続済み${drive.lastSync ? `／最終同期：${new Date(drive.lastSync).toLocaleString("ja-JP")}` : ""}${drive.busy ? "／同期中…" : ""}
        </div>
        <div class="kb-btn-row">
          <button class="kb-outline-btn" ${drive.busy ? "disabled" : ""} onclick="C.manualDriveUpload()">${icon("upload", 15)} 今すぐDriveに保存</button>
          <button class="kb-outline-btn" ${drive.busy ? "disabled" : ""} onclick="C.manualDriveDownload()">${icon("download", 15)} Driveから復元</button>
        </div>
        <div class="kb-cat-manage-row" style="margin-top:4px">
          <span>変更時に自動でDriveへ保存する</span>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="checkbox" ${drive.autoSync ? "checked" : ""} onchange="C.toggleDriveAutoSync()" />
          </label>
        </div>
        <button class="kb-outline-btn" style="margin-top:10px" onclick="C.disconnectDrive()">連携を解除する</button>
      ` : `
        <div class="kb-hint" style="margin-top:-2px">Googleアカウントでログインすると、変更内容が自動でGoogle Driveに保存され、他の端末からも復元できます。</div>
        <button class="kb-outline-btn" ${drive.busy ? "disabled" : ""} onclick="C.connectDrive()">${icon("cloud", 15)} Googleでログイン</button>
      `}
    </div>
    <div class="kb-panel">
      <div class="kb-panel-title"><span class="kb-panel-icon navy">${icon("settings", 15)}</span><h2>データ管理</h2></div>
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
      <div class="kb-panel-title"><span class="kb-panel-icon">${icon("bank", 15)}</span><h2>クレジット</h2></div>
      <div class="kb-credits">
        <div><b>IslaFolio</b>（個人利用向け家計簿アプリ）</div>
        <div>資金源やカードを「島」として管理します。</div>
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
  if (ui.activeTab === "record") {
    setupSwipe("txSwipeArea", "txSwipeTrack", () => ui.txFilterMode === "month", (dir) => shiftTxFilterMonth(dir));
    setupSwipe("graphSwipeArea", "graphSwipeTrack", () => ui.graphMode === "all", (dir) => shiftGraphCenterMonth(dir));
  }
}

/* ---------- generic horizontal swipe-to-navigate (drag-follow + slide, Android-safe) ---------- */
function setupSwipe(areaId, trackId, isEnabled, onCommit) {
  const area = document.getElementById(areaId);
  const track = document.getElementById(trackId);
  if (!area || !track) return;
  let sx = 0, sy = 0, dx = 0, dragging = false, bailed = false;

  function onDown(e) {
    if (!isEnabled()) return;
    sx = e.clientX; sy = e.clientY; dx = 0; dragging = true; bailed = false;
    track.style.transition = "none";
    try { area.setPointerCapture(e.pointerId); } catch (err) { /* not supported */ }
  }
  function onMove(e) {
    if (!dragging || bailed) return;
    dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 18) {
      // vertical intent - let the page scroll, abandon the swipe
      bailed = true; dragging = false;
      track.style.transition = "transform 0.15s ease";
      track.style.transform = "translateX(0px)";
      return;
    }
    track.style.transform = `translateX(${dx}px)`;
  }
  function onEnd() {
    if (!dragging) return;
    dragging = false;
    const w = area.clientWidth || 300;
    track.style.transition = "transform 0.2s ease";
    if (Math.abs(dx) > Math.max(50, w * 0.18)) {
      const dir = dx < 0 ? 1 : -1;
      track.style.transform = `translateX(${dx < 0 ? -w : w}px)`;
      setTimeout(() => onCommit(dir), 170);
    } else {
      track.style.transform = "translateX(0px)";
    }
  }
  area.addEventListener("pointerdown", onDown);
  area.addEventListener("pointermove", onMove);
  area.addEventListener("pointerup", onEnd);
  area.addEventListener("pointercancel", onEnd);
}
function shiftTxFilterMonth(delta) {
  ui.txFilterMonth = addMonths(ui.txFilterMonth || currentMonthKey(), delta);
  ui.graphCenterMonth = ui.txFilterMonth;
  renderApp();
}
function shiftGraphCenterMonth(delta) {
  ui.graphCenterMonth = addMonths(ui.graphCenterMonth || currentMonthKey(), delta);
  renderApp();
}

/* ---------- long-press grid reorder (2D: for both list and grid layouts) ---------- */
let dragSession = { id: null, kind: null, timer: null, active: false, startX: 0, startY: 0 };
let justDragged = false;
function setupReorder() {
  document.querySelectorAll("[data-reorder-item]").forEach((row) => {
    const handle = row.querySelector("[data-reorder-handle]") || row;
    handle.addEventListener("pointerdown", (e) => startDrag(e, row.dataset.id, row.dataset.reorderItem));
  });
}
function startDrag(e, id, kind) {
  dragSession = { id, kind, timer: null, active: false, startX: e.clientX, startY: e.clientY };
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
    if (Math.abs(e.clientX - dragSession.startX) > 10 || Math.abs(e.clientY - dragSession.startY) > 10) cancelDrag();
    return;
  }
  e.preventDefault();
  const el = document.querySelector(`[data-reorder-item="${dragSession.kind}"][data-id="${dragSession.id}"]`);
  if (!el) return;
  const dx = e.clientX - dragSession.startX, dy = e.clientY - dragSession.startY;
  el.style.transform = `translate(${dx}px, ${dy}px)`;

  const siblings = Array.from(document.querySelectorAll(`[data-reorder-item="${dragSession.kind}"]`));
  let closest = null, closestDist = Infinity;
  siblings.forEach((sib) => {
    if (sib === el) return;
    const r = sib.getBoundingClientRect();
    const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    if (d < closestDist) { closestDist = d; closest = sib; }
  });
  if (closest && closestDist < 90) {
    const arr = dragSession.kind === "account" ? data.accounts : data.cards;
    const idx = arr.findIndex((x) => x.id === dragSession.id);
    const targetIdx = arr.findIndex((x) => x.id === closest.dataset.id);
    if (idx !== -1 && targetIdx !== -1 && idx !== targetIdx) {
      const [moved] = arr.splice(idx, 1);
      arr.splice(targetIdx, 0, moved);
      saveState();
      renderApp();
      const el2 = document.querySelector(`[data-reorder-item="${dragSession.kind}"][data-id="${dragSession.id}"]`);
      if (el2) {
        el2.classList.add("kb-dragging");
        el2.style.transform = "translate(0px,0px)";
      }
      dragSession.startX = e.clientX; dragSession.startY = e.clientY;
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
  if (dragSession.active) {
    justDragged = true;
    setTimeout(() => { justDragged = false; }, 80);
  }
  dragSession = { id: null, kind: null, timer: null, active: false, startX: 0, startY: 0 };
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

function islandTap(e, id) {
  if (justDragged) return;
  if (e.target.closest("button")) return;
  openIslandActions(id);
}
function netBadgeTap(e) {
  if (e.target.closest("input")) return;
  openNetWorthDetail();
}
function openNetWorthDetail() {
  const mk = ui.netWorthViewMonth || currentMonthKey();
  const nowKey = currentMonthKey();
  const kindLabel = mk > nowKey ? "資産予測" : mk < nowKey ? "時点の記録" : "現在の内訳";
  const rows = data.accounts.map((acc) => {
    const meta = TYPE_META[acc.type] || TYPE_META.bank;
    const val = accountValueAtMonth(acc.id, mk);
    return `
      <div class="kb-cat-manage-row">
        <span>${icon(meta.icon, 13)} ${escapeHtml(acc.name)}</span>
        <span class="kb-num" style="color:var(--navy)">${formatYen(val)}</span>
      </div>`;
  }).join("");
  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3>${monthDisplayLabel(mk)}の${kindLabel}</h3>
        ${data.accounts.length === 0 ? `<div class="kb-empty">島がありません</div>` : rows}
        <div class="kb-cat-manage-row" style="background:var(--wash-soft);border:none;margin-top:10px">
          <span style="font-weight:700;color:var(--navy)">合計</span>
          <span class="kb-num" style="color:var(--navy)">${formatYen(netWorthAtMonth(mk))}</span>
        </div>
        ${mk > nowKey ? `<div class="kb-hint" style="margin:10px 0 0">登録済みの固定費・固定収入を反映した見込み額です。</div>` : ""}
      </div>
    </div>`);
}
function dockTap(e, id) {
  if (justDragged) return;
  if (e.target.closest("button")) return;
  openTxModal("expense", null, { cardId: id });
}
function openIslandActions(id) {
  const acc = getAccount(id);
  if (!acc) return;
  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" style="max-width:340px" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3>${escapeHtml(acc.name)}</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="kb-big-btn income" style="flex-direction:row;justify-content:center;padding:13px" onclick="C.openTxModal('income','${id}')">${icon("arrowDown", 18)} 入金</button>
          <button class="kb-big-btn transfer" style="flex-direction:row;justify-content:center;padding:13px" onclick="C.openTxModal('transfer','${id}')">${icon("transfer", 18)} 移動</button>
          <button class="kb-big-btn expense" style="flex-direction:row;justify-content:center;padding:13px" onclick="C.openTxModal('expense','${id}')">${icon("arrowUp", 18)} 使用</button>
        </div>
      </div>
    </div>`);
}

function openConfirmModal(message, onConfirm) {
  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" style="max-width:340px" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3 style="color:var(--coral)">確認</h3>
        <p style="font-size:13.5px;line-height:1.7;margin-top:0">${escapeHtml(message)}</p>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="kb-outline-btn" style="flex:1;justify-content:center" onclick="C.closeModal()">キャンセル</button>
          <button class="kb-submit" style="flex:1;margin-top:0;background:var(--coral)" id="confirmModalOkBtn">実行する</button>
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
        <h3>島を追加</h3>
        <div class="kb-field"><label>名前</label><input type="text" id="accName" placeholder="例：〇〇銀行、財布、貯金箱" /></div>
        <div class="kb-field"><label>種類</label><div class="kb-chip-group" id="accTypeGroup">${typeChip()}</div></div>
        <div class="kb-field"><label>現在の残高</label><input type="text" inputmode="numeric" id="accBalance" placeholder="0" oninput="formatAmountInput(this)" /></div>
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
    const balance = parseAmountInput("accBalance");
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

function deleteAccountConfirm(id) {
  const acc = getAccount(id);
  if (!acc) return;
  const linkedCards = data.cards.filter((c) => c.linkedAccountId === id).length;
  const txCount = data.transactions.filter((t) => t.accountId === id || t.toAccountId === id || (t.cardId && getCard(t.cardId) && getCard(t.cardId).linkedAccountId === id)).length;
  let msg = `「${acc.name}」を削除します。`;
  if (linkedCards || txCount) msg += `紐づくカード${linkedCards}件・取引記録${txCount}件も一緒に削除されます。`;
  msg += "この操作は取り消せません。本当によろしいですか？";
  openConfirmModal(msg, () => deleteAccountCascade(id));
}
function deleteCardConfirm(id) {
  const c = getCard(id);
  if (!c) return;
  const txCount = data.transactions.filter((t) => t.cardId === id).length;
  let msg = `「${c.name}」を削除します。`;
  if (txCount) msg += `このカードに紐づく取引記録${txCount}件も一緒に削除されます。`;
  msg += "この操作は取り消せません。本当によろしいですか？";
  openConfirmModal(msg, () => deleteCardCascade(id));
}
function deleteRecurringConfirm(id) {
  const r = data.recurringExpenses.find((x) => x.id === id);
  if (!r) return;
  const txCount = data.transactions.filter((t) => t.recurringId === id).length;
  openConfirmModal(`「${r.name}」の登録を削除します。これまでに自動記録された取引${txCount}件もすべて削除されます。この操作は取り消せません。よろしいですか？`, () => removeRecurringExpense(id));
}

function openRecurringModal(existingId) {
  if (data.accounts.length === 0) return;
  const existing = existingId ? data.recurringExpenses.find((r) => r.id === existingId) : null;
  let type = existing ? existing.type : "expense";
  let category = existing ? (existing.category || "") : "";
  let sourceType = existing && existing.cardId ? "card" : "account";
  let accountId = (existing && existing.accountId) || data.accounts[0].id;
  let cardId = (existing && existing.cardId) || "";
  let hasEnd = !!(existing && existing.endMonth);
  const nowKey = currentMonthKey();

  function cats() { return type === "expense" ? data.expenseCats : data.incomeCats; }
  function typeChipsHtml() {
    return `
      <div class="kb-chip ${type === "expense" ? "active" : ""}" data-type="expense">支出（固定費）</div>
      <div class="kb-chip ${type === "income" ? "active" : ""}" data-type="income">収入（固定収入）</div>`;
  }
  function catChipsHtml() {
    return cats().map((c) => `<div class="kb-chip ${category === c ? "active" : ""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</div>`).join("");
  }
  function sourceTypeChipsHtml() {
    return `
      <div class="kb-chip ${sourceType === "account" ? "active" : ""}" data-src="account">口座・手持ち</div>
      <div class="kb-chip ${sourceType === "card" ? "active" : ""}" data-src="card" style="opacity:${data.cards.length && type === "expense" ? 1 : 0.4};pointer-events:${data.cards.length && type === "expense" ? "auto" : "none"}">カード</div>`;
  }
  function sourceFieldHtml() {
    if (sourceType === "account") {
      return `<select id="recAccountSelect">${data.accounts.map((a) => `<option value="${a.id}" ${a.id === accountId ? "selected" : ""}>${escapeHtml(a.name)}</option>`).join("")}</select>`;
    }
    return `<select id="recCardSelect"><option value="">選択してください</option>${data.cards.map((c) => `<option value="${c.id}" ${c.id === cardId ? "selected" : ""}>${escapeHtml(c.name)}</option>`).join("")}</select>`;
  }

  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3 style="color:var(--coral)">${existing ? "固定費・固定収入を編集" : "固定費・固定収入を追加"}</h3>
        <div class="kb-field"><label>種類</label><div class="kb-chip-group" id="recTypeChips">${typeChipsHtml()}</div></div>
        <div class="kb-field"><label>名前</label><input type="text" id="recName" placeholder="例：家賃、〇〇サブスク、家賃収入" value="${escapeHtml(existing ? existing.name : "")}" /></div>
        <div class="kb-field"><label>金額（月あたり）</label><input type="text" inputmode="numeric" id="recAmount" placeholder="0" value="${existing ? Number(existing.amount).toLocaleString("ja-JP") : ""}" oninput="formatAmountInput(this)" /></div>
        <div class="kb-field"><label>カテゴリ</label><div class="kb-chip-group" id="recCatChips">${catChipsHtml()}</div></div>
        <div class="kb-field" id="recSourceWrap">
          <label id="recSourceLabel">${type === "income" ? "入金先" : "支払い元"}</label>
          <div class="kb-chip-group" id="recSourceTypeChips" style="margin-bottom:8px;${type === "income" ? "display:none" : ""}">${sourceTypeChipsHtml()}</div>
          <div id="recSourceField">${sourceFieldHtml()}</div>
        </div>
        <div class="kb-field"><label>開始月</label><input type="month" id="recStart" value="${existing ? existing.startMonth : nowKey}" /></div>
        <div class="kb-field">
          <label><input type="checkbox" id="recHasEnd" style="width:auto;margin-right:6px" ${hasEnd ? "checked" : ""} />終了月を設定する</label>
          <input type="month" id="recEnd" value="${existing && existing.endMonth ? existing.endMonth : nowKey}" style="margin-top:8px;display:${hasEnd ? "block" : "none"}" />
        </div>
        <button class="kb-submit" id="recSubmitBtn" style="background:var(--coral)">${existing ? "更新する" : "追加する"}</button>
      </div>
    </div>`);

  function refreshSourceSection() {
    document.getElementById("recSourceLabel").textContent = type === "income" ? "入金先" : "支払い元";
    document.getElementById("recSourceTypeChips").style.display = type === "income" ? "none" : "flex";
    if (type === "income") sourceType = "account";
    document.getElementById("recSourceTypeChips").innerHTML = sourceTypeChipsHtml();
    document.getElementById("recSourceField").innerHTML = sourceFieldHtml();
  }

  document.getElementById("recTypeChips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-type]"); if (!chip) return;
    type = chip.dataset.type;
    category = "";
    document.getElementById("recTypeChips").innerHTML = typeChipsHtml();
    document.getElementById("recCatChips").innerHTML = catChipsHtml();
    refreshSourceSection();
  });
  document.getElementById("recCatChips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-cat]"); if (!chip) return;
    category = chip.dataset.cat;
    document.getElementById("recCatChips").innerHTML = catChipsHtml();
  });
  document.getElementById("recSourceTypeChips").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-src]"); if (!chip) return;
    sourceType = chip.dataset.src;
    document.getElementById("recSourceTypeChips").innerHTML = sourceTypeChipsHtml();
    document.getElementById("recSourceField").innerHTML = sourceFieldHtml();
  });
  document.getElementById("recHasEnd").addEventListener("change", (e) => {
    hasEnd = e.target.checked;
    document.getElementById("recEnd").style.display = hasEnd ? "block" : "none";
  });
  document.getElementById("recSubmitBtn").addEventListener("click", () => {
    const name = document.getElementById("recName").value.trim();
    const amount = parseAmountInput("recAmount");
    if (!name || !amount || amount <= 0) return;
    const startMonth = document.getElementById("recStart").value || nowKey;
    const endMonth = hasEnd ? (document.getElementById("recEnd").value || null) : null;
    let recAccountId = null, recCardId = null;
    if (sourceType === "card" && type === "expense") {
      recCardId = document.getElementById("recCardSelect").value;
      if (!recCardId) return;
    } else {
      recAccountId = document.getElementById("recAccountSelect").value;
      if (!recAccountId) return;
    }
    const payload = { type, name, amount, category: category || null, accountId: recAccountId, cardId: recCardId, startMonth, endMonth };
    if (existing) updateRecurringExpense(existing.id, payload);
    else addRecurringExpense(payload);
    closeModal();
  });
}

function openTxModal(mode, presetAccountId, prefill) {
  prefill = prefill || {};
  const accentMap = { expense: "var(--coral)", income: "var(--mint-deep)", transfer: "var(--wash)" };
  const titleMap = { expense: "出費を記録", income: "入金を記録", transfer: "資金移動" };
  let category = prefill.category || "";
  let sourceType = prefill.cardId ? "card" : "account";
  let accountId = prefill.accountId || presetAccountId || (data.accounts[0] && data.accounts[0].id) || "";
  let cardId = prefill.cardId || "";
  let toAccountId = prefill.toAccountId || (data.accounts.find((a) => a.id !== accountId) || {}).id || "";
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
      <div class="kb-field"><label>金額</label><input type="text" inputmode="numeric" placeholder="0" id="txAmount" value="${prefill.amount != null ? Number(prefill.amount).toLocaleString("ja-JP") : ""}" oninput="formatAmountInput(this)" /></div>
      <div class="kb-field"><label>用途・メモ</label><input type="text" placeholder="例：スーパーで買い物" id="txMemo" value="${escapeHtml(prefill.memo || "")}" /></div>
      <div class="kb-field"><label>日付</label><input type="date" id="txDate" value="${prefill.date || todayStr()}" /></div>
      ${categorySection}
      ${sourceSection}
      <button class="kb-submit" id="txSubmitBtn" style="background:${accentMap[mode]}">記録する</button>`;
  }

  mountModal(`
    <div class="kb-modal-backdrop">
      <div class="kb-modal" onclick="event.stopPropagation()">
        <button class="kb-modal-close" onclick="C.closeModal()">${icon("x", 18)}</button>
        <h3 style="color:${accentMap[mode]}">${titleMap[mode]}${prefill.amount != null ? "（コピー）" : ""}</h3>
        <div id="txModalBody">${bodyHtml()}</div>
      </div>
    </div>`);

  function wire() {
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
      document.getElementById("txSourceTypeChips").innerHTML = sourceTypeChipsHtml();
      document.getElementById("txSourceField").innerHTML = sourceFieldHtml();
      wireSourceField();
    });
    wireSourceField();
    const submitBtn = document.getElementById("txSubmitBtn");
    submitBtn.addEventListener("click", () => {
      const amount = parseAmountInput("txAmount");
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
  function wireSourceField() {
    const cardSelect = document.getElementById("txCardSelect");
    if (cardSelect) cardSelect.addEventListener("change", (e) => {
      cardId = e.target.value;
      document.getElementById("txSourceField").innerHTML = sourceFieldHtml();
      wireSourceField();
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
  deleteTxConfirm(id) { deleteTxConfirm(id); },
  txRowTap(e, id) { txRowTap(e, id); },
  openTxDetail(id) { openTxDetail(id); },
  removeCategory(kind, name) { removeCategory(kind, name); },
  addCategoryFromInput(kind, inputId) {
    const el = document.getElementById(inputId);
    addCategory(kind, el.value);
    el.value = "";
    renderApp();
  },
  openTxModal(mode, presetAccountId) { openTxModal(mode, presetAccountId); },
  openAccountModal() { openAccountModal(); },
  islandTap(e, id) { islandTap(e, id); },
  dockTap(e, id) { dockTap(e, id); },
  netBadgeTap(e) { netBadgeTap(e); },
  copyTx(id) { copyTx(id); },
  openCardModal() { openCardModal(); },
  deleteAccountConfirm(id) { deleteAccountConfirm(id); },
  deleteCardConfirm(id) { deleteCardConfirm(id); },
  openRecurringModal(existingId) { openRecurringModal(existingId); },
  deleteRecurringConfirm(id) { deleteRecurringConfirm(id); },
  setNetWorthViewMonth(v) { ui.netWorthViewMonth = v; ui.graphCenterMonth = v; renderApp(); },
  setTxFilterMode(m) { ui.txFilterMode = m; renderApp(); },
  setTxFilterMonth(v) { ui.txFilterMonth = v; ui.graphCenterMonth = v; renderApp(); },
  setGraphCenterMonth(v) { ui.graphCenterMonth = v; renderApp(); },
  connectDrive() { connectDrive(true); },
  disconnectDrive() { disconnectDrive(); },
  manualDriveUpload() { manualDriveUpload(); },
  manualDriveDownload() { manualDriveDownload(); },
  toggleDriveAutoSync() { toggleDriveAutoSync(); },
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
materializeRecurringExpenses();
renderApp();
if (window.__gisScriptLoaded) onGisReady();
