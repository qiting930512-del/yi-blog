# 開發工具與資源清單

> 隸屬《亞洲，生活：黎明時光》。整理給一個人、沒有程式/美術背景的開發情況使用的實際工具清單，對應 `production-roadmap.md` 各階段會用到的東西。連結是 2026 年搜尋當下的結果，之後可能會有新版本或新工具，建議定期回來更新。

---

## 引擎與敘事工具

| 工具 | 用途 | 費用 | 連結 |
|------|------|------|------|
| **Unity Hub + Unity 2022 LTS** | 遊戲引擎本體 | 免費（個人/小型收入可用 Personal 方案）| [unity.com/download](https://unity.com/download) |
| **Inky** | Ink 語言的官方編輯器，寫分支對話劇本用，可以邊寫邊測試 | 免費、開源 | [inklestudios.com/ink](https://www.inklestudios.com/ink/)、[GitHub](https://github.com/inkle/inky) |
| **ink-unity-integration** | 把 Ink 檔案串進 Unity 的官方外掛 | 免費 | [GitHub](https://github.com/inkle/ink-unity-integration) |

---

## 3D 場景/道具素材（Unity Asset Store）

| 素材 | 說明 | 連結 |
|------|------|------|
| Japanese House - Traditional | 傳統日式建築，含室內外，支援 URP | [連結](https://assetstore.unity.com/packages/3d/environments/historic/japanese-house-traditional-324622) |
| Old Japanese House and Exterior | 室內外整合環境素材 | [連結](https://assetstore.unity.com/packages/3d/environments/old-japanese-house-and-exterior-243994) |
| Japanese Apartment PBR Pack | 較寫實的公寓室內素材，貼合半寫實美術方向 | [連結](https://assetstore.unity.com/packages/3d/props/interior/japanese-apartment-pbr-pack-151626) |
| Anime-Style Japanese Apartment Interior | 風格偏動漫，如果想要更軟一點的視覺可以參考 | [連結](https://assetstore.unity.com/packages/3d/props/interior/anime-style-japanese-apartment-interior-289423) |
| Japanese Furniture Set | 單件家具素材，補充場景細節用 | [連結](https://assetstore.unity.com/packages/3d/props/interior/japanese-furniture-set-194708) |

🔸提案：語言學校、醫院、箱根溫泉旅館這幾個場景還沒找對應素材，可以之後用類似關鍵字（「school classroom URP」「onsen ryokan asset」）在 Asset Store 上搜尋。

---

## 角色模型

| 素材 | 說明 | 連結 |
|------|------|------|
| Stylized Characters Complete Bundle | 半寫實、可自訂的角色包，貼合美術方向 | [連結](https://assetstore.unity.com/packages/3d/characters/humanoids/stylized-characters-complete-bundle-352872) |
| Stylized Character Pack（免費）| Unity 官方免費角色包，適合階段 0–1 拿來測試互動系統，不用等正式角色就能先跑起來 | [連結](https://assetstore.unity.com/packages/3d/characters/stylized-character-pack-360808) |

---

## 動畫/骨架綁定

| 工具 | 用途 | 費用 | 連結 |
|------|------|------|------|
| **Mixamo**（Adobe）| 上傳人形角色模型，自動綁骨架 + 套用大量現成動作庫（走路、跑步、坐下、揮手等），直接匯出用在 Unity。瀏覽器操作，不用裝軟體 | 免費（需 Adobe 帳號）| [mixamo.com](https://www.mixamo.com/) |

**限制**：只支援人形角色、只能用預設動作庫，沒辦法做特殊客製動作（例如崔載元檢查背包的動作可能需要自己另外處理，或找對應的動作包）。

---

## AI 3D 模型生成（文字/圖片 → 3D 模型）

這類工具可以省下大量美術時間——用文字描述（例如「一張舊式木造餐桌」）就能生出堪用的 3D 素材，特別適合場景道具、次要物件這類不需要極致精緻的東西。

| 工具 | 特色 | 連結 |
|------|------|------|
| **Meshy** | 目前最多人用，生成、貼材質、綁骨架、動畫、匯出遊戲引擎格式一條龍，通常兩分鐘內出一個完整貼圖模型 | [meshy.ai](https://www.meshy.ai/) |
| **3D AI Studio** | 整合度最高，生成→重新拓樸→貼材質→綁骨架→匯出到任何引擎，全部在一個工具裡完成 | [3daistudio.com](https://www.3daistudio.com/) |
| **Tripo AI** | 適合快速做概念驗證用的模型 | 搜尋 "Tripo AI" |
| **Rodin** | 模型細節做得比較好，適合角色類 | 搜尋 "Rodin AI" |

🔸建議：主角、五個核心角色的模型還是建議用正式的角色素材包（上面 Stylized Characters Bundle）或請人設計，AI 生成的角色模型目前在細節/表情控制上還沒辦法完全取代——但場景道具、背景 NPC、次要物件很適合用 AI 生成節省時間。

---

## 待確認

- [ ] 語言學校、醫院、箱根溫泉旅館的場景素材還沒找，需要之後補搜尋
- [ ] 要不要試用看看 Meshy 或 3D AI Studio 的免費額度，實際感受一下 AI 生成的品質再決定要不要付費
- [ ] 音樂/音效工具目前完全沒有整理，之後可以另外開一份文件討論（例如免費音效庫、AI 配樂工具）
