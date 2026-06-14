---
title: Manus 任務結果自動同步 Notion 整合指南
description: 當 Manus 任務完成時，如何透過 Notion MCP 整合或 Webhook + Make/Zapier，自動將任務結果同步到 Notion。
date: 2026-06-14
category: 工具流
tags: [Manus, Notion, 自動化, Webhook, Make, Zapier, MCP, 工作流]
draft: false
---

當 Manus 任務完成時，有兩種主要方式可以將任務結果與資料自動同步到 Notion：

1. **直接透過 Notion MCP 整合（推薦，最簡單）**：在任務指令中直接要求 Manus 使用 Notion MCP 工具建立頁面。
2. **透過 Webhook 串接 Make/Zapier（適合進階自動化）**：設定 Manus Webhook，當任務完成（`task_stopped`）時觸發 Make 或 Zapier 流程，再寫入 Notion。

---

## 方案一：使用 Notion MCP 直接建立頁面（最簡單）

如果您已經在 Manus 中啟用了 Notion MCP 整合，您只需在任務指令中加入特定要求，Manus 就能在任務結束前自動幫您建立或更新 Notion 頁面。

### 設定步驟

1. 確保您的 Manus 已經啟用了 Notion MCP（可以在 Manus 設定中的 Integrations 啟用）。
2. 在您的提示詞（Prompt）或任務指令結尾，加入以下指令：

> **指令範例：**
> 「任務完成後，請將整理好的資料與最終結果，透過 Notion MCP 建立一個新的 Notion 頁面（或寫入指定的 Database ID: `您的_Database_ID`）。頁面標題請設定為『[任務名稱] 整理結果』，並將內容以 Markdown 格式寫入。」

### Manus 會執行的動作

當 Manus 收到此指令並完成主要任務後，會自動呼叫 `notion-create-pages` 或 `notion-create-database` 等 MCP 工具，將資料結構化並寫入您的 Notion 工作區。

---

## 方案二：使用 Manus Webhook + Make / Zapier 串接

如果您希望建立一個**全自動的背景工作流**，不需要每次都在指令中提及，或者希望將所有完成的任務都記錄到 Notion 中，使用 Webhook 是最佳選擇。

### 架構說明

`Manus 任務完成 (Webhook) -> Make / Zapier 接收資料 -> 建立 Notion 頁面 / Database 項目`

### 步驟 1：在 Make 或 Zapier 建立 Webhook 接收端

1. 在 Make.com 建立新 Scenario，或在 Zapier 建立新 Zap。
2. 選擇 **Webhooks** 作為觸發器（Trigger），並選擇 **Custom Webhook**（Make）或 **Catch Hook**（Zapier）。
3. 系統會生成一組專屬的 Webhook URL（例如：`https://hook.us1.make.com/xxxxxx`）。請複製此 URL。

### 步驟 2：在 Manus 設定 Webhook

1. 進入 Manus 的 **API Integration settings**。
2. 新增一個 Webhook，將剛剛複製的 URL 貼上。
3. 儲存後，Manus 會發送測試請求。您的 Make/Zapier 需要設定為「聆聽（Listen）」狀態以接收並解析資料結構。

### 步驟 3：解析 Manus Webhook 資料結構

當 Manus 任務完成時，會發送 `task_stopped` 事件。您在 Make/Zapier 中會收到類似以下的 JSON 資料：

```json
{
  "event_id": "task_stopped_task_abc123",
  "event_type": "task_stopped",
  "task_detail": {
    "task_id": "task_abc123",
    "task_title": "整理最新的影視專案資料",
    "task_url": "https://manus.im/app/task_abc123",
    "message": "我已經完成了資料整理...",
    "stop_reason": "finish",
    "attachments": [
      {
        "file_name": "data.csv",
        "url": "https://...",
        "size_bytes": 1024
      }
    ]
  }
}
```

### 步驟 4：設定 Notion 動作 (Action)

1. 在 Make / Zapier 的下一步，新增 **Notion** 模組。
2. 選擇動作：**Create a Page**（建立頁面）或 **Create a Database Item**（建立資料庫項目）。
3. 連結您的 Notion 帳號。
4. 將 Manus 傳來的變數對應到 Notion 欄位：
   - **標題 (Title)**：對應 `task_detail.task_title`
   - **內容 (Content/Body)**：對應 `task_detail.message`
   - **任務連結 (URL)**：對應 `task_detail.task_url`
   - **狀態**：可設定為「已完成」（如果 `stop_reason` 是 `finish`）

### 步驟 5：測試與啟用

完成設定後，啟動您的 Make Scenario 或 Zapier Zap。未來只要有 Manus 任務完成，結果就會自動同步到您的 Notion 中。

---

## 建議與最佳實踐

* **單次任務**：建議使用 **方案一 (Notion MCP)**，只需在對話中告知 Manus 即可，無需額外設定。
* **常態性自動化**：如果您有使用 `manus-config schedule` 設定排程任務（例如每日資料收集），建議使用 **方案二 (Webhook)**，讓資料自動流入 Notion 成為資料庫的一部分。
* **結構化輸出**：如果您需要非常精確的欄位對應（例如特定的 Notion Database 屬性），可以在 Manus 任務中使用「Structured Output (結構化輸出)」功能，這樣 Webhook 傳送的 JSON 會有 `task_detail.structured_output` 欄位，在 Make/Zapier 中對應 Notion 屬性會更加精準。
