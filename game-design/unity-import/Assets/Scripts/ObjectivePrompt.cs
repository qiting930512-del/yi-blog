using UnityEngine;
using TMPro;

/// <summary>
/// 「引導層」的核心：畫面上常駐顯示目前的教學提示/目標文字
/// （例如「按住觀察鍵，檢查身上的物品」），內容由 Ink 裡的一個全域變數控制。
///
/// 前置作業：在 .ink 檔案最上面宣告一個變數，並在劇情推進時更新它，例如：
///
///   VAR current_objective = "檢查身上的物品"
///
///   === scene_03_phone_desktop ===
///   ~ current_objective = "打開手機看看"
///   ...
///
/// 使用方式：
/// 1. 建立一個空物件掛上這個腳本
/// 2. 把畫面上顯示提示的 Text 拖進 objectiveText 欄位
/// 3. variableName 保持預設的 "current_objective"（或改成跟你 .ink 檔案裡宣告的名稱一致）
/// </summary>
public class ObjectivePrompt : MonoBehaviour
{
    public TMP_Text objectiveText;
    public string variableName = "current_objective";

    void Start()
    {
        // 遊戲一開始先讀一次目前的值
        RefreshFromStory();

        // 訂閱這個變數，之後只要 Ink 裡改了它，這裡會自動更新畫面，不用手動同步
        DialogueRunner.Instance.SubscribeToVariable(variableName, OnObjectiveChanged);
    }

    void RefreshFromStory()
    {
        object value = DialogueRunner.Instance.GetVariable(variableName);
        if (value != null) objectiveText.text = value.ToString();
    }

    void OnObjectiveChanged(string varName, object newValue)
    {
        objectiveText.text = newValue.ToString();
    }
}
