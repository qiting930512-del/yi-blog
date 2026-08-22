// 《亞洲，生活：黎明時光》
// 序章：抵達
// 展開自 game-design/scripts/00-prologue-script.md
// 使用方式：用 Inky 開啟這個檔案測試，之後透過 ink-unity-integration 匯入 Unity
//
// 標籤（tag）說明：
// 這個檔案用 # 標籤標記需要觸發 Unity 特效/系統事件的地方（例如畫面扭曲、解鎖手機）。
// 標籤不是註解——它會被編譯進 .json，Unity 端可以在 story.currentTags 讀到，
// 藉此觸發對應的視覺/音效——這是讓劇本真正「驅動」畫面的關鍵機制，不只是顯示文字。
// 對照：DialogueRunner.cs 裡的 HandleTags() 會處理這些標籤。
//
// 對話行維持「角色名: 台詞」的寫法，方便閱讀；
// Unity 端會自動用冒號切開，取出角色名跟台詞分開顯示（不用額外標籤）。

VAR current_objective = "看看四周"

-> scene_01_arrival

=== scene_01_arrival ===
// 場景一：入境大廳（自言自語）
東京・某機場入境大廳，接近打烊的深夜時段。 # location:airport_hall

崔載元從海關通道走出，腳步停在原地。

崔載元: ……我叫什麼名字？

崔載元: 好吧。這裡是哪裡？

崔載元: ……好，那我大概知道我不在韓國了。

~ current_objective = "按住觀察鍵，檢查身上的物品"
-> scene_02_items

=== scene_02_items ===
// 場景二：檢查隨身物品
崔載元低頭看向自己的背包、口袋。

+ [檢查機票] -> check_ticket
+ [檢查背包] -> check_backpack
+ [檢查手機] -> check_phone

= check_ticket
崔載元: ……CHOI JAE-WON。

崔載元: 如果這是我的名字，那還算好唸。仁川出發，東京抵達——好，至少我知道我從哪裡來、要去哪裡，只是不知道自己是誰而已。這樣算進度嗎？
-> scene_02_items

= check_backpack
崔載元: 東西打包得挺整齊的。是我自己整理的嗎，還是我本來就是這種人？

崔載元: ……這把鑰匙，開的是哪裡？ # fx:highlight_key
-> scene_02_items

= check_phone
崔載元: （螢幕全黑，鎖住）
~ current_objective = "試著解鎖手機"
崔載元: 連自己是誰都不知道，這張臉倒是挺誠實的。 # fx:face_id_unlock
~ current_objective = "看看手機桌面上有什麼"
-> scene_03_phone_desktop

=== scene_03_phone_desktop ===
// 場景三：手機桌面
手機桌面顯示幾個 App 圖示：WaWa（翻譯）、記事本、訊息、健康提醒——都可以點開。旁邊還有四個圖示是灰顯的：相簿、另一個聊天 App、行事曆、銀行 App。 # location:phone_ui

+ [點擊灰顯圖示] -> locked_apps
+ [打開記事本] -> notebook
+ [打開訊息] -> messages -> scene_04_leaving_airport

= locked_apps
崔載元: ……好，看來這支手機比我知道的還多。 # fx:app_locked_denied
-> scene_03_phone_desktop

= notebook
崔載元: 這是我的字。但我不記得寫過這些。
-> scene_03_phone_desktop

= messages
陳沐: 房間我幫你留好了，房東人很好

陳沐: 到了傳訊息給我，我來接你也可以

崔載元（過去）: 謝謝你，真的

陳沐: 說什麼謝謝，你都要來了

崔載元: 陳沐。至少現在，這是我唯一認得的名字。 # fx:memory_fragment
~ current_objective = "打開地圖，前往目的地"
->->

=== scene_04_leaving_airport ===
// 場景四：離開機場，前往 Share House
崔載元走出航廈，夜間的東京街景在他面前展開。 # location:tokyo_street_night

崔載元: 好，那接下來呢。

// 引導式移動：月台、電車車廂、深夜的住宅區小巷（此段落沒有對話，交給 Unity 端的過場處理）

崔載元: 一個不記得自己是誰的人，坐電車去一個自己不記得答應過的地方。這聽起來應該要很可怕，但老實說……還好。

~ current_objective = "走到 share house 門口"
-> scene_05_doorbell

=== scene_05_doorbell ===
// 場景五：抵達 Share House 門口
崔載元站在一棟舊式木造公寓門前，抬頭看了一眼門牌上模糊的字。 # location:sharehouse_exterior

崔載元: 好。

// 玩家操作：按下門鈴（互動由 Interactable.cs 處理，不是對話選項）

門鈴聲在安靜的巷子裡顯得特別清楚。 # fx:doorbell_sound

-> END
