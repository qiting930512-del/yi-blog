using UnityEngine;
using TMPro;

/// <summary>
/// 掛在玩家角色身上。負責偵測附近有沒有可互動的物件（Interactable），
/// 有的話顯示提示文字，玩家按下互動鍵時呼叫該物件的 Interact()。
///
/// 使用方式：
/// 1. 把這個腳本拖到玩家角色物件上
/// 2. 在 Inspector 裡把場景裡的「提示文字 UI（Text 或 TextMeshPro）」拖進 promptUI 欄位
/// 3. 設定 interactionRadius（偵測範圍，建議 1.5–2 公尺）
/// </summary>
public class PlayerInteractor : MonoBehaviour
{
    [Tooltip("偵測互動物件的半徑")]
    public float interactionRadius = 2f;

    [Tooltip("只偵測這個 Layer 上的物件（建議建立一個叫 Interactable 的 Layer）")]
    public LayerMask interactableLayer;

    [Tooltip("顯示提示文字的 UI 元件，例如畫面下方的「按 E 互動」")]
    public TMP_Text promptUI;

    [Tooltip("互動鍵，預設是 E")]
    public KeyCode interactKey = KeyCode.E;

    private Interactable currentTarget;

    void Update()
    {
        FindNearestInteractable();

        if (currentTarget != null)
        {
            if (promptUI != null)
            {
                promptUI.gameObject.SetActive(true);
                promptUI.text = currentTarget.promptText;
            }

            if (Input.GetKeyDown(interactKey))
            {
                currentTarget.Interact();
            }
        }
        else
        {
            if (promptUI != null)
            {
                promptUI.gameObject.SetActive(false);
            }
        }
    }

    void FindNearestInteractable()
    {
        Collider[] hits = Physics.OverlapSphere(transform.position, interactionRadius, interactableLayer);

        Interactable nearest = null;
        float nearestDist = float.MaxValue;

        foreach (var hit in hits)
        {
            Interactable interactable = hit.GetComponent<Interactable>();
            if (interactable == null) continue;

            float dist = Vector3.Distance(transform.position, hit.transform.position);
            if (dist < nearestDist)
            {
                nearestDist = dist;
                nearest = interactable;
            }
        }

        currentTarget = nearest;
    }
}
