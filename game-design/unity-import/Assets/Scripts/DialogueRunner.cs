using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Events;
using System.Collections.Generic;
using Ink.Runtime;
using TMPro;

// UnityEvent<string> 本身不能直接在 Inspector 裡顯示/設定，
// 需要包成一個具名的子類別，這是 Unity 的固定寫法
[System.Serializable]
public class StringUnityEvent : UnityEvent<string> { }

/// <summary>
/// 整個遊戲只需要一個 DialogueRunner（單例），負責：
/// 讀取編譯好的 Ink 檔案、播放對話文字、顯示選項按鈕、處理玩家選擇。
///
/// 前置作業：
/// 1. 先安裝 ink-unity-integration 外掛（github.com/inkle/ink-unity-integration）
/// 2. 把 .ink 檔案（例如 00_prologue.ink）放進 Unity 專案的 Assets/Dialogue/ 資料夾
/// 3. Unity 會自動編譯成 .json，把這個 .json 檔案拖進 Inspector 的 inkJSONAsset 欄位
///
/// 使用方式：
/// 1. 建立一個空物件叫 "DialogueRunner"，掛上這個腳本
/// 2. 建立對話 UI：一個顯示文字的 TextMeshPro Text、一個裝選項按鈕的容器（Vertical Layout Group）、
///    一個選項按鈕的 Prefab（上面要有一個 TextMeshPro Text 子物件顯示選項文字）
/// 3. 把這些 UI 元件拖進對應欄位
/// </summary>
public class DialogueRunner : MonoBehaviour
{
    public static DialogueRunner Instance { get; private set; }

    [Header("Ink")]
    [Tooltip("編譯好的 Ink JSON 檔案")]
    public TextAsset inkJSONAsset;

    [Header("UI")]
    public GameObject dialoguePanel;
    [Tooltip("顯示角色名字的 UI（可留空，如果不想顯示名牌）")]
    public TMP_Text speakerNameText;
    public TMP_Text dialogueText;
    public Transform choicesContainer;
    public Button choiceButtonPrefab;

    [Header("事件")]
    [Tooltip("整段對話播完（沒有更多內容、也沒有選項）時觸發，可以拿來解除鎖定下一步")]
    public UnityEvent onDialogueComplete;

    [Tooltip("每次讀到一個 # fx:xxx 標籤時觸發，參數是標籤內容（例如 \"fx:memory_fragment\"）。" +
             "可以另外寫一個 EffectsController 訂閱這個事件，依標籤名稱播放對應的畫面/音效")]
    public StringUnityEvent onTag;

    private Story story;
    private List<GameObject> spawnedChoiceButtons = new List<GameObject>();

    void Awake()
    {
        // 簡單的單例模式，讓其他腳本可以用 DialogueRunner.Instance 呼叫
        if (Instance == null) Instance = this;
        else Destroy(gameObject);

        story = new Story(inkJSONAsset.text);
        dialoguePanel.SetActive(false);
    }

    /// <summary>
    /// 從指定的 knot/stitch 開始播放對話。例如 DialogueRunner.Instance.StartDialogueAtKnot("check_ticket");
    /// </summary>
    public void StartDialogueAtKnot(string knotName)
    {
        story.ChoosePathString(knotName);
        dialoguePanel.SetActive(true);
        ContinueStory();
    }

    void ContinueStory()
    {
        if (story.canContinue)
        {
            string text = story.Continue().Trim();
            DisplayLine(text);
            HandleTags(story.currentTags);
            DisplayChoicesIfAny();
        }
        else if (story.currentChoices.Count > 0)
        {
            DisplayChoicesIfAny();
        }
        else
        {
            EndDialogue();
        }
    }

    /// <summary>
    /// 把 "角色名: 台詞" 這種寫法切開，角色名顯示在 speakerNameText，
    /// 台詞顯示在 dialogueText。如果這行沒有冒號（例如場景描述），
    /// 就整行當作台詞顯示、speakerNameText 清空。
    /// </summary>
    void DisplayLine(string rawLine)
    {
        int colonIndex = rawLine.IndexOf('：'); // 全形冒號
        if (colonIndex < 0) colonIndex = rawLine.IndexOf(':'); // 半形冒號

        if (colonIndex > 0)
        {
            string speaker = rawLine.Substring(0, colonIndex).Trim();
            string line = rawLine.Substring(colonIndex + 1).Trim();

            if (speakerNameText != null) speakerNameText.text = speaker;
            dialogueText.text = line;
        }
        else
        {
            if (speakerNameText != null) speakerNameText.text = "";
            dialogueText.text = rawLine;
        }
    }

    /// <summary>
    /// 讀取這一行帶的標籤（例如 "fx:memory_fragment"、"location:phone_ui"），
    /// 全部透過 onTag 事件丟出去，實際要做什麼效果由訂閱的腳本（例如 EffectsController）決定。
    /// 這裡刻意不寫死任何特效邏輯，保持 DialogueRunner 只負責「播放對話」這一件事。
    /// </summary>
    void HandleTags(List<string> tags)
    {
        if (tags == null) return;
        foreach (string tag in tags)
        {
            onTag?.Invoke(tag);
        }
    }

    void DisplayChoicesIfAny()
    {
        ClearChoices();

        if (story.currentChoices.Count == 0) return;

        for (int i = 0; i < story.currentChoices.Count; i++)
        {
            Choice choice = story.currentChoices[i];
            Button button = Instantiate(choiceButtonPrefab, choicesContainer);
            button.GetComponentInChildren<TMP_Text>().text = choice.text;

            int choiceIndex = i; // 避免 closure 抓到錯誤的 i
            button.onClick.AddListener(() => OnChoiceClicked(choiceIndex));

            spawnedChoiceButtons.Add(button.gameObject);
        }
    }

    void OnChoiceClicked(int choiceIndex)
    {
        story.ChooseChoiceIndex(choiceIndex);
        ClearChoices();
        ContinueStory();
    }

    void ClearChoices()
    {
        foreach (var btn in spawnedChoiceButtons) Destroy(btn);
        spawnedChoiceButtons.Clear();
    }

    /// <summary>
    /// 給 UI 上的「繼續」按鈕或按鍵呼叫，往下播放下一句
    /// </summary>
    public void OnContinueClicked()
    {
        if (story.currentChoices.Count == 0) ContinueStory();
    }

    /// <summary>
    /// 沒有選項按鈕顯示時（單純的台詞），滑鼠左鍵點一下就往下播放下一句。
    /// 有選項按鈕顯示時交給按鈕自己的 onClick 處理，這裡不搶著推進。
    /// </summary>
    void Update()
    {
        if (dialoguePanel.activeSelf && story.currentChoices.Count == 0 && Input.GetMouseButtonDown(0))
        {
            OnContinueClicked();
        }
    }

    void EndDialogue()
    {
        dialoguePanel.SetActive(false);
        onDialogueComplete?.Invoke();
    }

    /// <summary>
    /// 讀取 Ink 全域變數的值，例如檢查旗標用：
    /// bool unlocked = (bool)DialogueRunner.Instance.GetVariable("phone_unlocked");
    /// </summary>
    public object GetVariable(string variableName)
    {
        return story.variablesState[variableName];
    }

    /// <summary>
    /// 訂閱一個 Ink 全域變數，該變數在劇情裡被 ~ current_objective = "..." 這樣改變時，
    /// callback 會自動被呼叫——ObjectivePrompt 就是用這個機制更新畫面文字。
    /// </summary>
    public void SubscribeToVariable(string variableName, Story.VariableObserver callback)
    {
        story.ObserveVariable(variableName, callback);
    }
}
