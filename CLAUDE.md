# yi-blog 專案記憶

## 專案概況
- **名稱**：逸今天又分心了｜個人部落格
- **技術**：Astro + Vercel 部署
- **GitHub**：qiting930512-del/yi-blog

---

## 已建立的 Claude Code Skills（`.claude/commands/`）

| Skill | 說明 |
|-------|------|
| `/storyboard` | 影視分鏡腳本製作，含景別、鏡頭運動、視覺備注 |
| `/ig-reply` | IG 留言互動回覆，依類型自動選策略，輸出多版本 |
| `/milestone-countdown` | 舞台劇截止倒數，自動標示緊急程度 + 本週 Top 3 行動 |
| `/monthly-review` | 月回顧對話式引導，生成結構化報告 |

> 另有 4 個 Skill 在 branch `claude/brave-brown-ojxjnx` 尚未合併：
> `/artist-statement`、`/milestone-tracker`、`/formal-letter`、`/submission-prep`

---

## 自動化腳本（`automation/`）

**P1 + P2：Google Apps Script**（已寫好，尚未啟用）

- `automation/morning-report.gs`：每日 8am 發晨間報告到 Gmail（含 Calendar、Gmail 重要信、Notion 任務、舞台劇倒數）
- `automation/gmail-to-notion.gs`：每小時掃描星號未讀信，自動建 Notion 任務

**啟用步驟（待辦）：**
1. 前往 notion.so/my-integrations → 建 Integration → 複製 `secret_` 開頭的 Token
2. 打開 Notion 任務資料庫 → 右上角連接到剛建的 Integration → 複製 DB ID（URL 中的 32 位數字）
3. 填入兩個 `.gs` 檔案的 `NOTION_API_KEY` 與 `NOTION_TASKS_DB_ID`
4. 前往 script.google.com → 貼入兩個腳本 → 執行 `setupTrigger()` 和 `setupGmailTrigger()`

---

## 重要截止日

| 截止日 | 任務 |
|--------|------|
| **2026-06-28** | 舞台劇《亞洲，生活》— 人物設定 + 大綱 |
| **2026-08-02** | 舞台劇初稿 |
| **2026-08-31** | 舞台劇投稿截止 |

---

## 逸的背景脈絡

- **身份**：影視遊牧 × 童軍教練 × 品牌創辦人（破繭）
- **創作方向**：舞台劇、劇本開發、影視製作
- **核心美學**：A24 影響、侘寂、裂縫中的光
- **工作方式**：AI 協作、低摩擦高感知、Kairos LifeOS（Notion 個人作業系統）
