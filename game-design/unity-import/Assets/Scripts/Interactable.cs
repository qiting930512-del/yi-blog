using UnityEngine;

/// <summary>
/// 掛在任何「玩家可以互動的物件」上（機票、背包、手機、門鈴……）。
/// 負責：偵測玩家靠近時顯示提示、被互動時觸發指定的 Ink knot。
///
/// 使用方式：
/// 1. 把這個腳本拖到場景裡的物件上（記得該物件要有 Collider，勾選 Is Trigger）
/// 2. 在 Inspector 裡填入 inkKnotName（例如 "check_ticket"，對應 .ink 檔案裡的 knot/stitch 名稱）
/// 3. PlayerInteractor 會自動偵測這個物件並呼叫 Interact()
/// </summary>
public class Interactable : MonoBehaviour
{
    [Tooltip("互動時要跳到的 Ink knot 或 stitch 名稱，例如 check_ticket、scene_03_phone_desktop")]
    public string inkKnotName;

    [Tooltip("靠近時顯示的提示文字，例如「按 E 檢查機票」")]
    public string promptText = "按 E 互動";

    [Tooltip("互動後是否要停用這個物件（例如已經看過的東西不用再顯示提示）")]
    public bool disableAfterInteract = false;

    private bool hasInteracted = false;

    public void Interact()
    {
        if (disableAfterInteract && hasInteracted) return;

        if (string.IsNullOrEmpty(inkKnotName))
        {
            Debug.LogWarning($"{gameObject.name} 沒有設定 inkKnotName，無法觸發對話");
            return;
        }

        DialogueRunner.Instance.StartDialogueAtKnot(inkKnotName);
        hasInteracted = true;
    }
}
