# Claude Code 工作記憶

## 上次進度（2026-06-14）

### 目標
幫用戶在 Notion 建立 PAI 個人知識管理系統。

### 已完成
- [x] 建立主頁面：**PAI 個人知識管理系統**
- [x] 建立資料庫容器頁：**資料庫本體（請勿移動）**
- [x] 建立三個資料庫（互有雙向關聯）：
  - 📂 專案庫（Projects）
  - ✅ 行動庫（Actions）
  - 📥 收集庫（Inbox）
- [x] 在主頁面建立三個看板視圖：
  - 📂 專案看板（依狀態分欄）
  - ✅ 今日行動（依狀態 + 優先級排序）
  - 📥 收藏消化進度（依消化狀態分欄）

### 尚未完成
- [ ] 幫專案庫加頁面模版
- [ ] 加範例資料
- [ ] 在行動庫加表格視圖
- [ ] 去用戶現有 Notion 檔案找出進行中的專案，填入系統

### Notion 頁面連結
- 主頁面：https://app.notion.com/p/37ff02a307a981c79aebe5ef8df972e8
- 資料庫本體頁：https://app.notion.com/p/37ff02a307a981898e25e8fca0f0092c

### 資料庫 Collection ID
- 專案庫：`collection://15bb5501-7d71-4b36-82a4-70f5348df894`
- 行動庫：`collection://1c71cfb9-bdff-46b1-86c6-0f32d2f7e888`
- 收集庫：`collection://9b41a49e-6b25-4e1a-a8b4-63489a48d4ab`

### 用戶 Notion 帳號
- Gmail：`qiting930512@gmail.com`（Notion user ID：`32a28571-ac3d-4696-8577-f6d51d3808ad`）
- Apple relay：`rmfjhfjftd@privaterelay.appleid.com`（Notion user ID：`d8483fc1-f237-4afe-8934-35f413dfdbfe`）

---

## 下次開始時，先做這件事

**Notion 連線需要重新授權**，步驟：
1. 呼叫 `mcp__Notion__authenticate` 取得授權連結
2. 請用戶點連結並授權
3. 瀏覽器會顯示「無法連線」錯誤頁（正常）
4. 請用戶複製網址列完整 URL 貼回來
5. 呼叫 `mcp__Notion__complete_authentication` 完成授權
6. 授權成功後，去用戶工作區搜尋現有專案，填入 PAI 系統
