# Unity 匯入包（Mac 適用）

這個資料夾的結構跟 Unity 專案的 `Assets` 資料夾一模一樣，
在 Finder 裡整包拖進去就好，不用一個個找檔案。

## 怎麼用（Mac）

1. **開啟/建立 Unity 專案**
   打開 Unity Hub → 新增專案 → 選 3D (URP) 範本

2. **裝 Ink 外掛**（一定要先裝，不然 `.ink` 檔案不會自動編譯）
   Unity Editor 裡：`Window → Package Manager` → 左上角「+」
   → `Add package from git URL...` → 貼上：
   `https://github.com/inkle/ink-unity-integration.git`

3. **找到你的 Unity 專案資料夾**
   在 Finder 裡，Unity 專案本身就是一個資料夾（跟你取的專案名稱一樣），
   裡面已經有一個 `Assets` 資料夾——這是 Unity 建專案時自動生成的。

4. **拖曳匯入**
   把這個 `unity-import/Assets/` 資料夾裡的 **`Dialogue` 和 `Scripts` 兩個子資料夾**，
   直接拖進你 Unity 專案資料夾裡的 `Assets` 資料夾。
   （在 Finder 打開兩個視窗，一個是這個 repo 的 `game-design/unity-import/Assets/`，
   一個是你 Unity 專案的 `Assets/`，把 `Dialogue`、`Scripts` 兩個資料夾拖過去即可）

5. **回到 Unity Editor**
   Unity 偵測到新檔案會自動編譯：
   - `Dialogue/00_prologue.ink` 旁邊會多出一個 `00_prologue.json`（Ink 外掛自動產生的）
   - `Scripts/` 裡四支 `.cs` 檔會被編譯，Console 面板沒有紅字錯誤就代表沒問題

6. **接線**（Unity Editor 內操作，細節見 `game-design/starter-scripts/` 各檔案開頭的註解）
   - Hierarchy 建空物件掛 `DialogueRunner.cs`，把 `00_prologue.json` 拖進 `Ink Json Asset` 欄位
   - 建對話 UI（Text、Vertical Layout Group、Button prefab），拖進對應欄位
   - 建空物件掛 `ObjectivePrompt.cs`
   - `Interactable.cs` 掛在場景裡可互動的物件上（機票、背包、手機、門鈴……）
   - `PlayerInteractor.cs` 掛在玩家角色身上

## 之後要更新內容怎麼辦？

之後如果 `game-design/ink/` 或 `game-design/starter-scripts/` 裡的原始檔案有修改，
這個 `unity-import/` 資料夾要記得同步更新（或直接請 Claude 重新複製一份），
再重新拖一次覆蓋到 Unity 專案裡即可，Unity 會自動重新編譯。
