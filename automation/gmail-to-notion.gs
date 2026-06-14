/**
 * P2：Gmail 重要信件自動摘要 → Notion 任務
 *
 * 邏輯：掃描 Gmail 星號信件，尚未同步的自動建立 Notion 任務
 *
 * 設定步驟：
 * 1. 可加在同一個 Apps Script 專案（morning-report.gs 的同個專案）
 * 2. 填寫下方 GMAIL_NOTION_CONFIG 的值
 * 3. 在 Gmail 建立標籤「notion-synced」（手動或讓腳本自動建）
 * 4. 執行一次 setupGmailTrigger() 設定定時同步
 */

const GMAIL_NOTION_CONFIG = {
  NOTION_API_KEY: 'YOUR_NOTION_API_KEY',   // 與 morning-report.gs 相同
  NOTION_TASKS_DB_ID: 'YOUR_TASKS_DB_ID', // 與 morning-report.gs 相同
  SYNCED_LABEL: 'notion-synced',           // Gmail 標籤名稱（用來標記已同步）
  SEARCH_QUERY: 'is:starred is:unread',    // 要同步哪些信（預設：星號未讀）
};

/**
 * 主函式：掃描 Gmail 並同步到 Notion
 */
function syncGmailToNotion() {
  if (!GMAIL_NOTION_CONFIG.NOTION_API_KEY || GMAIL_NOTION_CONFIG.NOTION_API_KEY === 'YOUR_NOTION_API_KEY') {
    Logger.log('⚠️ 請先填入 NOTION_API_KEY');
    return;
  }

  // 確保 Gmail 標籤存在
  const syncedLabel = getOrCreateLabel(GMAIL_NOTION_CONFIG.SYNCED_LABEL);

  // 搜尋符合條件且尚未同步的信
  const query = `${GMAIL_NOTION_CONFIG.SEARCH_QUERY} -label:${GMAIL_NOTION_CONFIG.SYNCED_LABEL} newer_than:7d`;
  const threads = GmailApp.search(query, 0, 20);

  if (threads.length === 0) {
    Logger.log('✅ 沒有新的重要信件需要同步');
    return;
  }

  Logger.log(`找到 ${threads.length} 封待同步信件`);

  let successCount = 0;
  threads.forEach(thread => {
    const message = thread.getMessages()[0];
    const success = createNotionTask(message, thread);

    if (success) {
      // 標記為已同步，移除星號（可選）
      syncedLabel.addToThread(thread);
      successCount++;
    }

    // 避免超過 API 速率限制
    Utilities.sleep(300);
  });

  Logger.log(`✅ 同步完成，成功建立 ${successCount} 個 Notion 任務`);
}

/**
 * 在 Notion 建立任務
 */
function createNotionTask(message, thread) {
  try {
    const from = message.getFrom();
    const subject = thread.getFirstMessageSubject();
    const date = message.getDate();
    const snippet = message.getPlainBody().substring(0, 500).replace(/\n+/g, ' ');
    const threadUrl = `https://mail.google.com/mail/u/0/#inbox/${thread.getId()}`;

    // 自動判斷優先度：有星號 = 高
    const isStarred = message.isStarred();

    const payload = {
      parent: { database_id: GMAIL_NOTION_CONFIG.NOTION_TASKS_DB_ID },
      properties: {
        // 任務名稱（欄位名稱請依你的 Notion 資料庫調整）
        '名稱': {
          title: [{ text: { content: `📧 ${subject}` } }]
        },
        // 以下欄位依你的資料庫結構選擇性加入：
        // '優先度': { select: { name: isStarred ? '高' : '中' } },
        // '來源': { select: { name: 'Gmail' } },
        // '截止日': { date: { start: Utilities.formatDate(date, 'Asia/Taipei', 'yyyy-MM-dd') } },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { type: 'text', text: { content: `寄件人：${from}\n` } },
              { type: 'text', text: { content: `日期：${Utilities.formatDate(date, 'Asia/Taipei', 'yyyy-MM-dd HH:mm')}\n` } },
              { type: 'text', text: { content: `連結：`, } },
              { type: 'text', text: { content: threadUrl, link: { url: threadUrl } } },
            ]
          }
        },
        {
          object: 'block',
          type: 'quote',
          quote: {
            rich_text: [{ type: 'text', text: { content: snippet + (snippet.length >= 500 ? '...' : '') } }]
          }
        }
      ]
    };

    const response = UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: `Bearer ${GMAIL_NOTION_CONFIG.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    const result = JSON.parse(response.getContentText());
    if (result.id) {
      Logger.log(`✅ 建立任務：${subject}`);
      return true;
    } else {
      Logger.log(`❌ 建立失敗：${subject}｜${result.message}`);
      return false;
    }
  } catch (e) {
    Logger.log(`❌ 錯誤：${e.message}`);
    return false;
  }
}

/**
 * 取得或建立 Gmail 標籤
 */
function getOrCreateLabel(labelName) {
  let label = GmailApp.getUserLabelByName(labelName);
  if (!label) {
    label = GmailApp.createLabel(labelName);
    Logger.log(`建立 Gmail 標籤：${labelName}`);
  }
  return label;
}

/**
 * 初次設定：建立每小時定時觸發器
 * 只需執行一次
 */
function setupGmailTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncGmailToNotion')
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('syncGmailToNotion')
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log('✅ Gmail → Notion 同步觸發器設定完成，每小時執行一次');
}
