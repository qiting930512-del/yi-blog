// 《亞洲，生活：黎明時光》
// 序章：抵達
// 展開自 game-design/scripts/00-prologue-script.md
// 使用方式：用 Inky 開啟這個檔案測試，之後透過 ink-unity-integration 匯入 Unity

// current_objective 是「引導層」讀取的全域變數，
// Unity 端的 ObjectivePrompt.cs 會訂閱這個變數並顯示在畫面上
VAR current_objective = "看看四周"

-> scene_01_arrival

=== scene_01_arrival ===
// 場景一：入境大廳（自言自語）
東京・某機場入境大廳，接近打烊的深夜時段。

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

崔載元: ……這把鑰匙，開的是哪裡？
-> scene_02_items

= check_phone
崔載元: （螢幕全黑，鎖住）
~ current_objective = "試著解鎖手機"
崔載元: 連自己是誰都不知道，這張臉倒是挺誠實的。
~ current_objective = "看看手機桌面上有什麼"
-> scene_03_phone_desktop

=== scene_03_phone_desktop ===
// 場景三：手機桌面
手機桌面顯示幾個 App 圖示：WaWa（翻譯）、記事本、訊息、健康提醒——都可以點開。旁邊還有四個圖示是灰顯的：相簿、另一個聊天 App、行事曆、銀行 App。

+ [點擊灰顯圖示] -> locked_apps
+ [打開記事本] -> notebook
+ [打開訊息] -> messages -> scene_04_leaving_airport

= locked_apps
// 系統提示：暫時無法開啟
崔載元: ……好，看來這支手機比我知道的還多。
-> scene_03_phone_desktop

= notebook
崔載元: 這是我的字。但我不記得寫過這些。
// 提示：記事本會保存重要資訊，隨時可以回來查看
-> scene_03_phone_desktop

= messages
陳沐: 房間我幫你留好了，房東人很好

陳沐: 到了傳訊息給我，我來接你也可以

崔載元（過去）: 謝謝你，真的

陳沐: 說什麼謝謝，你都要來了

// 記憶碎片觸發：畫面短暫扭曲、雜訊閃過一兩秒（此提示不用寫進 current_objective，是被動觸發的系統事件）
崔載元: 陳沐。至少現在，這是我唯一認得的名字。
~ current_objective = "打開地圖，前往目的地"
->->

=== scene_04_leaving_airport ===
// 場景四：離開機場，前往 Share House
崔載元走出航廈，夜間的東京街景在他面前展開。

崔載元: 好，那接下來呢。

// 教學提示：打開地圖 App，前往目的地
// 引導式移動：月台、電車車廂、深夜的住宅區小巷

崔載元: 一個不記得自己是誰的人，坐電車去一個自己不記得答應過的地方。這聽起來應該要很可怕，但老實說……還好。

~ current_objective = "走到 share house 門口"
-> scene_05_doorbell

=== scene_05_doorbell ===
// 場景五：抵達 Share House 門口
崔載元站在一棟舊式木造公寓門前，抬頭看了一眼門牌上模糊的字。

崔載元: 好。

// 玩家操作：按下門鈴

門鈴聲在安靜的巷子裡顯得特別清楚。

-> END
