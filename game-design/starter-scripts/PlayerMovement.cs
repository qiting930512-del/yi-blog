using UnityEngine;

/// <summary>
/// 簡易第一人稱移動：WASD 走動、滑鼠環顧四周。
/// 直接掛在 Main Camera（玩家視角）上使用，不需要額外的 Player 物件。
///
/// 前置作業：
/// 1. 把這個腳本拖進 Assets/Scripts
/// 2. 掛到 Main Camera 上——因為標了 [RequireComponent]，
///    Unity 會自動幫這個物件加上 Character Controller 元件，不用手動加
///
/// 操作方式：
/// WASD 移動、滑鼠環顧四周、按 Esc 可以放開滑鼠鎖定（方便切回 Editor 操作介面）
/// </summary>
[RequireComponent(typeof(CharacterController))]
public class PlayerMovement : MonoBehaviour
{
    [Tooltip("走路速度（公尺/秒）")]
    public float moveSpeed = 3f;

    [Tooltip("滑鼠靈敏度")]
    public float mouseSensitivity = 2f;

    [Tooltip("上下看的角度限制，避免翻過頭")]
    public float maxLookAngle = 80f;

    private CharacterController controller;
    private float yaw;
    private float pitch;

    void Start()
    {
        controller = GetComponent<CharacterController>();

        Vector3 angles = transform.eulerAngles;
        yaw = angles.y;
        pitch = angles.x;

        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            bool isLocked = Cursor.lockState == CursorLockMode.Locked;
            Cursor.lockState = isLocked ? CursorLockMode.None : CursorLockMode.Locked;
            Cursor.visible = isLocked;
        }

        HandleLook();
        HandleMove();
    }

    /// <summary>
    /// 滑鼠橫向移動控制左右環顧（yaw），縱向移動控制上下看（pitch），
    /// pitch 有夾限角度避免視角翻過頭。
    /// </summary>
    void HandleLook()
    {
        if (Cursor.lockState != CursorLockMode.Locked) return;

        yaw += Input.GetAxis("Mouse X") * mouseSensitivity;
        pitch -= Input.GetAxis("Mouse Y") * mouseSensitivity;
        pitch = Mathf.Clamp(pitch, -maxLookAngle, maxLookAngle);

        transform.rotation = Quaternion.Euler(pitch, yaw, 0f);
    }

    /// <summary>
    /// 用 CharacterController.Move（不是 SimpleMove）是刻意的：
    /// SimpleMove 會自動套用重力，但這個場景目前沒有地板 Collider，
    /// 玩家會一直往下掉。Move 只依照給定的向量移動，不會自動加重力，
    /// 適合現在這種還沒做地板的原型階段。
    /// </summary>
    void HandleMove()
    {
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");

        Vector3 forward = transform.forward;
        Vector3 right = transform.right;
        forward.y = 0f;
        right.y = 0f;
        forward.Normalize();
        right.Normalize();

        Vector3 move = (forward * v + right * h) * moveSpeed;
        controller.Move(move * Time.deltaTime);
    }
}
