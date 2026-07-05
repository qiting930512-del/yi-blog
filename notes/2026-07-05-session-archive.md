# Session 歸檔｜2026-07-05 PAI 系統建置與創作方向確認

> 由 Claude 整理，記錄本次 session 所有討論與決定事項。

---

## ✅ 已完成事項

### 1. PAI 系統全面清理

- 移除所有雷蒙的樣板內容
  - 刪除 3 個「雷蒙小提醒」callout 塊
  - 刪除 Notion Tips 課程廣告 callout
- Inbox Tags 更新為逸的 5 個標籤：
  - 🟣 劇本創作
  - 🔵 電影學習
  - 🟠 品牌建立
  - 🟢 個人成長
  - 🟡 靈感筆記
- 11 個舊示範記錄移出資料庫，手動刪除確認
- GitHub PR #5「feat: PAI system data integration with Notion」已合併

### 2. Share House 劇本方向確定

| 項目 | 決定 |
|------|------|
| 類型 | 群像劇 |
| 角色人數 | 5–6 人 |
| 劇本風格 | 混合（寫實底色 + 偶爾打破第四堵牆） |
| 主角核心衝突 | 身份認同 |
| 其他角色設計 | 每人都有自己的問題（多元呈現） |

### 3. 三份研究報告（背景 Agent 執行完成）

**SEO 分析**
- 分析現有 5 篇 yi-blog 文章
- 最高潛力：《我用 Claude Code 管理自己的人生系統》
  - 原因：繁中 Claude Code 教學極少，競爭度低，搜尋意圖明確
- 次高潛力：《A24 為什麼每部電影都讓你覺得不舒服？》
  - 原因：A24 在台港有穩定受眾，長尾關鍵字豐富
- 立即行動：加內連、補截圖、提交 sitemap 至 Google Search Console

**品牌頻道研究**

| 平台 | 評分 | 策略 |
|------|------|------|
| Threads | ⭐⭐⭐⭐⭐ | 立即啟動，手指小文 + 劇本碎片 |
| Substack | ⭐⭐⭐⭐ | 六個月後啟動，建立訂閱讀者群 |
| IG | ⭐⭐⭐ | 副用，blog 內容轉化為圖文 |
| Medium | ⭐⭐ | 暫不推薦 |

**電影學習資源清單**
- 5 本推薦書籍（劇本結構 × 電影語言）
- 5 個網路學習資源
- 13 部推薦電影（結合劇本創作角度）
- 系統學習方法（禁止二刷，看完即分析）

### 4. 技術建設

- 週報 GitHub Action 建立（PR #9）
  - 觸發：每週五 09:07 台灣時間
  - 流程：抓取 Notion PAI 資料 → Claude 生成週報 → 寫回 Notion
  - 腳本：`scripts/generate-weekly-report.mjs`
  - 需設定 5 個 GitHub Secrets 才可啟用

---

## 🔴 逸 尚需手動完成

1. **GitHub Secrets 設定**（讓週報 Action 跑起來）

   前往：`https://github.com/qiting930512-del/yi-blog/settings/secrets/actions`

   需要新增：
   | Secret 名稱 | 說明 |
   |------------|------|
   | `ANTHROPIC_API_KEY` | 從 console.anthropic.com 取得 |
   | `NOTION_TOKEN` | Notion Integration Token |
   | `NOTION_WEEKLY_PARENT_ID` | 逸的作業系統頁面 ID：`38bf02a307a9814999a7d8eac2181e56` |
   | `NOTION_ACTIONS_DB_ID` | 行動資料庫 ID |
   | `NOTION_PROJECTS_DB_ID` | 專案資料庫 ID |

2. **開始劇本創作** — 方向已確定，可以動筆了

---

## 📌 長期分工備忘

| 逸負責 | Claude 負責 |
|--------|------------|
| 🎭 劇本創作（Share House 群像劇） | 🏢 品牌經營（yi-blog 內容、SEO、社群） |
| 🎬 電影學習（系統性學習電影語言） | 📅 週報系統（每週五自動生成） |
| | 🗄️ 知識管理（Inbox 整理、Projects 追蹤） |

---

## ⚙️ 系統狀態

- yi-blog：上線正常（yi-blog.vercel.app）
- PAI 系統：清理完成，運作中
- 週報 Action：已建立，待 Secrets 設定後啟用
- Notion Inbox：標籤更新完成
- GitHub main branch：PR #5 已合併（cfc6b74）

---

*由 Claude Code 整理 — 2026-07-05*
