/**
 * 週報自動生成腳本
 * 每週五從 Notion PAI 系統抓取本週資料，透過 Claude 生成週報，寫回 Notion。
 *
 * 所需 GitHub Secrets：
 *   ANTHROPIC_API_KEY      — Anthropic API 金鑰
 *   NOTION_TOKEN           — Notion Integration Token
 *   NOTION_ACTIONS_DB_ID   — PAI 行動資料庫 ID
 *   NOTION_PROJECTS_DB_ID  — PAI 專案資料庫 ID
 *   NOTION_WEEKLY_PARENT_ID — 存放週報的 Notion 頁面 ID
 */

const {
  ANTHROPIC_API_KEY,
  NOTION_TOKEN,
  NOTION_ACTIONS_DB_ID,
  NOTION_PROJECTS_DB_ID,
  NOTION_WEEKLY_PARENT_ID,
} = process.env;

function requireEnv(name) {
  if (!process.env[name]) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
}
['ANTHROPIC_API_KEY', 'NOTION_TOKEN', 'NOTION_WEEKLY_PARENT_ID'].forEach(requireEnv);

// ── 日期工具 ──────────────────────────────────────────────────
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return String(Math.ceil(((d - yearStart) / 86400000 + 1) / 7)).padStart(2, '0');
}

const now = new Date();
const weekLabel = `${now.getFullYear()}-W${isoWeek(now)}`;
const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

// ── Notion API ────────────────────────────────────────────────
async function notionRequest(path, method = 'GET', body) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion API ${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function queryDatabase(dbId, filter) {
  if (!dbId) return [];
  try {
    const data = await notionRequest(`/databases/${dbId}/query`, 'POST', { filter });
    return data.results ?? [];
  } catch (e) {
    console.warn(`⚠ 無法查詢資料庫 ${dbId}:`, e.message);
    return [];
  }
}

function extractTitle(page) {
  for (const key of ['名稱', 'Name', 'title', '任務', '行動']) {
    const prop = page.properties?.[key];
    if (prop?.title?.[0]?.plain_text) return prop.title[0].plain_text;
  }
  return '（無標題）';
}

function extractSelect(page, keys) {
  for (const key of keys) {
    const prop = page.properties?.[key];
    if (prop?.select?.name) return prop.select.name;
    if (prop?.status?.name) return prop.status.name;
  }
  return null;
}

// ── 抓取 Notion 資料 ─────────────────────────────────────────
async function fetchWeeklyData() {
  const [actions, projects] = await Promise.all([
    // 用 last_edited_time 取近 7 天編輯的行動（不依賴特定欄位名稱）
    queryDatabase(NOTION_ACTIONS_DB_ID, {
      timestamp: 'last_edited_time',
      last_edited_time: { on_or_after: sevenDaysAgo },
    }),
    // 支援多種進行中狀態名稱
    queryDatabase(NOTION_PROJECTS_DB_ID, {
      or: [
        { property: '狀態', status: { equals: 'In Progress｜執行中' } },
        { property: '狀態', status: { equals: 'In progress' } },
        { property: '狀態', status: { equals: '即將開始' } },
        { property: 'Status', status: { equals: 'In Progress' } },
        { property: 'Status', status: { equals: 'In progress' } },
      ],
    }),
  ]);

  const completedActions = actions
    .filter(p => {
      const s = extractSelect(p, ['狀態', 'Status']);
      return !s || s.includes('完成') || s.includes('Done') || s.includes('已完成');
    })
    .map(extractTitle);

  const activeProjects = projects.map(extractTitle);

  return { completedActions, activeProjects };
}

// ── Claude 生成週報 ──────────────────────────────────────────
async function generateReport(data) {
  const prompt = `你是逸（綺庭張）的個人助理 Claude。今天是週五，請根據以下本週資料，用繁體中文撰寫一份簡潔的週報。

本週完成的行動（Actions）：
${data.completedActions.length ? data.completedActions.map(a => `- ${a}`).join('\n') : '- （本週無記錄完成的行動）'}

目前進行中的專案（Projects）：
${data.activeProjects.length ? data.activeProjects.map(p => `- ${p}`).join('\n') : '- （無進行中專案）'}

請輸出以下 JSON 格式（只輸出 JSON，不要有其他文字）：
{
  "completed": ["完成項目1", "完成項目2"],
  "inProgress": ["進行中項目1"],
  "nextWeek": ["下週重點1", "下週重點2", "下週重點3"],
  "messageToYi": "給逸的一句話（溫暖、簡短）"
}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error: ${res.status} — ${errText}`);
  }
  const data2 = await res.json();
  const text = data2.content?.[0]?.text ?? '{}';
  return JSON.parse(text);
}

// ── 建立 Notion 頁面 ─────────────────────────────────────────
function richText(content) {
  return [{ type: 'text', text: { content } }];
}

function bullet(text) {
  return {
    object: 'block',
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: richText(text) },
  };
}

function heading(text, level = 2) {
  const type = `heading_${level}`;
  return { object: 'block', type, [type]: { rich_text: richText(text) } };
}

async function createWeeklyPage(report) {
  const blocks = [
    heading('本週完成 ✅'),
    ...( report.completed.length
      ? report.completed.map(bullet)
      : [bullet('本週無記錄')]),

    heading('進行中 🔄'),
    ...(report.inProgress.length
      ? report.inProgress.map(bullet)
      : [bullet('無進行中項目')]),

    heading('下週重點 🎯'),
    ...(report.nextWeek.length
      ? report.nextWeek.map(bullet)
      : [bullet('待規劃')]),

    { object: 'block', type: 'divider', divider: {} },

    {
      object: 'block',
      type: 'quote',
      quote: { rich_text: richText(report.messageToYi ?? '繼續前進，逸。') },
    },
  ];

  await notionRequest('/pages', 'POST', {
    parent: { page_id: NOTION_WEEKLY_PARENT_ID },
    properties: {
      title: { title: richText(`週報 ${weekLabel}`) },
    },
    children: blocks,
  });

  console.log(`✅ 週報「週報 ${weekLabel}」已建立`);
}

// ── 主流程 ────────────────────────────────────────────────────
async function main() {
  console.log(`📋 開始生成 ${weekLabel} 週報...`);

  const weeklyData = await fetchWeeklyData();
  console.log(`  已完成行動：${weeklyData.completedActions.length} 筆`);
  console.log(`  進行中專案：${weeklyData.activeProjects.length} 筆`);

  const report = await generateReport(weeklyData);
  console.log('  Claude 生成週報完成');

  await createWeeklyPage(report);
}

main().catch(err => {
  console.error('❌ 週報生成失敗:', err);
  process.exit(1);
});
