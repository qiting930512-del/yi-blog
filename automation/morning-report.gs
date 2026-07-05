/**
 * P1：每日晨間報告 — 自動寄信到你的 Gmail（手機即收到通知）
 *
 * 設定步驟：
 * 1. 前往 script.google.com → 新增專案
 * 2. 貼入此檔案全部內容
 * 3. 填寫下方 CONFIG 的值
 * 4. 執行一次 setupTrigger() 設定排程
 * 5. 授權 Gmail / Calendar / UrlFetch 權限
 */

const CONFIG = {
  MY_EMAIL: 'qiting930512@gmail.com',       // 收報告的信箱（你的 Gmail）
  MORNING_HOUR: 8,                           // 幾點發送（24小時制，8 = 早上8點）
  NOTION_API_KEY: 'YOUR_NOTION_API_KEY',     // Notion Integration Token（見下方說明）
  NOTION_TASKS_DB_ID: 'YOUR_TASKS_DB_ID',   // Notion 任務資料庫 ID（見下方說明）
};

/**
 * 主函式：每天早上自動執行
 */
function sendMorningReport() {
  const today = new Date();
  const dateStr = Utilities.formatDate(today, 'Asia/Taipei', 'M/d (EEE)');

  const sections = [];

  // 區塊一：今日 Google Calendar 行程
  sections.push(getCalendarSection(today));

  // 區塊二：Gmail 重要未讀信件（星號 or 標示重要）
  sections.push(getGmailSection());

  // 區塊三：Notion 今日到期任務
  sections.push(getNotionTasksSection(today));

  // 區塊四：舞台劇截止倒數
  sections.push(getMilestoneCountdown(today));

  const body = sections.join('\n\n' + '─'.repeat(40) + '\n\n');

  GmailApp.sendEmail(
    CONFIG.MY_EMAIL,
    `☀️ 今日報告 ${dateStr}`,
    body,
    { name: 'Kairos 晨間報告' }
  );
}

/**
 * 今日 Calendar 行程
 */
function getCalendarSection(today) {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const events = CalendarApp.getDefaultCalendar().getEvents(start, end);

  if (events.length === 0) {
    return '📅 今日行程\n（無行程）';
  }

  const lines = events.map(e => {
    const time = Utilities.formatDate(e.getStartTime(), 'Asia/Taipei', 'HH:mm');
    return `  ${time}  ${e.getTitle()}`;
  });

  return '📅 今日行程\n' + lines.join('\n');
}

/**
 * Gmail 重要未讀信件（星號 / 重要）
 */
function getGmailSection() {
  // 搜尋過去 24 小時內的星號或重要未讀信
  const threads = GmailApp.search('is:unread (is:starred OR is:important) newer_than:1d', 0, 10);

  if (threads.length === 0) {
    return '📬 重要郵件\n（無重要未讀）';
  }

  const lines = threads.map(t => {
    const msg = t.getMessages()[0];
    const from = msg.getFrom().replace(/<.*>/, '').trim();
    const subject = t.getFirstMessageSubject();
    return `  ・${from}：${subject}`;
  });

  return `📬 重要郵件（${threads.length} 封）\n` + lines.join('\n');
}

/**
 * Notion 今日到期任務
 */
function getNotionTasksSection(today) {
  if (!CONFIG.NOTION_API_KEY || CONFIG.NOTION_API_KEY === 'YOUR_NOTION_API_KEY') {
    return '✅ Notion 任務\n（尚未設定 Notion API Key，跳過）';
  }

  try {
    const todayStr = Utilities.formatDate(today, 'Asia/Taipei', 'yyyy-MM-dd');

    const payload = {
      filter: {
        and: [
          { property: '狀態', status: { does_not_equal: '完成' } },
          {
            or: [
              { property: '截止日', date: { equals: todayStr } },
              { property: '截止日', date: { before: todayStr } },
            ]
          }
        ]
      },
      sorts: [{ property: '截止日', direction: 'ascending' }],
      page_size: 10
    };

    const response = UrlFetchApp.fetch(
      `https://api.notion.com/v1/databases/${CONFIG.NOTION_TASKS_DB_ID}/query`,
      {
        method: 'post',
        contentType: 'application/json',
        headers: {
          Authorization: `Bearer ${CONFIG.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true,
      }
    );

    const data = JSON.parse(response.getContentText());
    if (!data.results || data.results.length === 0) {
      return '✅ Notion 任務\n（今日無待辦）';
    }

    const lines = data.results.map(page => {
      const title = page.properties['名稱']?.title?.[0]?.plain_text
        || page.properties['任務']?.title?.[0]?.plain_text
        || '(無標題)';
      const due = page.properties['截止日']?.date?.start || '';
      const overdue = due < Utilities.formatDate(today, 'Asia/Taipei', 'yyyy-MM-dd') ? ' ⚠️ 逾期' : '';
      return `  ・${title}${overdue}`;
    });

    return `✅ Notion 任務（${data.results.length} 項待辦）\n` + lines.join('\n');
  } catch (e) {
    return `✅ Notion 任務\n（讀取失敗：${e.message}）`;
  }
}

/**
 * 舞台劇截止倒數（硬編碼，不需要 API）
 */
function getMilestoneCountdown(today) {
  const milestones = [
    { name: '人物設定 + 大綱', date: new Date('2026-06-28') },
    { name: '初稿', date: new Date('2026-08-02') },
    { name: '投稿截止', date: new Date('2026-08-31') },
  ];

  const lines = milestones.map(m => {
    const diff = Math.ceil((m.date - today) / (1000 * 60 * 60 * 24));
    const emoji = diff <= 7 ? '🔴' : diff <= 21 ? '🟡' : '🟢';
    return `  ${emoji} ${m.name}  還剩 ${diff} 天`;
  });

  return '🎭 《亞洲，生活》截止倒數\n' + lines.join('\n');
}

/**
 * 初次設定：建立每日定時觸發器
 * 只需執行一次
 */
function setupTrigger() {
  // 先清除舊的觸發器，避免重複
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'sendMorningReport')
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('sendMorningReport')
    .timeBased()
    .atHour(CONFIG.MORNING_HOUR)
    .everyDays(1)
    .inTimezone('Asia/Taipei')
    .create();

  Logger.log(`✅ 觸發器設定完成，每天 ${CONFIG.MORNING_HOUR}:00 台北時間發送晨間報告`);
}
