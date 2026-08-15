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

## 遊戲改編專案《亞洲，生活：黎明時光》（東京篇，獨立時間線）

原本舞台劇《亞洲，生活》的 share house 劇本構想，改為以遊戲形式開發。**跟上面「重要截止日」表格的舞台劇徵件是分開的時間線**，不受那組截止日限制，純粹是個人專案的長期開發。

- **設計文件**：`game-design/asia-life-tokyo-gdd.md`（草案 v0.1，含世界觀、角色卡、四位房客個人支線、章節大綱、美術風格參考，開放事項已全數定案）
- **一句話**：失憶的韓國人崔載元，靠機票、手機、背包，在東京一間跨國合租房裡透過重新認識五個陌生人（包括自己）拼回身分
- **類型**：3D 步行探索遊戲
- **狀態**：GDD 草稿完成，準備進入分章節細寫階段

> 注意：這個專案跟裴硯清／吉言辦公室那條線（《在有裂縫的地方擁有光》）無關，是完全獨立的故事。

---

## 逸的背景脈絡

- **身份**：影視遊牧 × 童軍教練 × 品牌創辦人（破繭）
- **創作方向**：舞台劇、劇本開發、影視製作
- **核心美學**：A24 影響、侘寂、裂縫中的光
- **工作方式**：AI 協作、低摩擦高感知、Kairos LifeOS（Notion 個人作業系統）
