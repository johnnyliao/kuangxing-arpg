# 狂星破滅

單一 HTML 檔的 2D 橫向動作 ARPG。被族人放逐的原創狂戰士「凱嵐」，依序打倒同族、宇宙帝王、神，最後摧毀星核，讓世界毀滅。

- 線上版（私人，需要在 claude.ai 用 Share 開放權限）：https://claude.ai/artifact/RaGLnsSJq5GTndBnJHcTV7
- 本機遊玩：直接用瀏覽器打開 `index.html`，不需要建置或安裝任何東西

## 目錄

```
index.html        遊戲本體（HTML + CSS + JS 全在這一個檔案，約 700 行）
art/concept/      第一批 AI 設定圖（a_* 動畫風、b_* 格鬥遊戲風），尚未使用
art/cut/          白底生圖與去背結果（*_cut.png 是透明背景），尚未接進遊戲
art/cut/sheet.png 9 個候選主角的總覽圖
```

## 操作

| 按鍵 | 動作 |
|---|---|
| WASD / 方向鍵 | 移動（橫向 + 縱深） |
| J | 輕攻擊，連按為三連擊，第三下擊退 |
| K | 重攻擊，大擊退，打魔王可削韌性 |
| L | 氣彈，消耗 12 氣 |
| I（按住） | 集氣，回氣並累積怒氣，不能移動 |
| U | 大絕招，怒氣 100 才能用，蓄力 0.9 秒後射出貫穿光球，結束時全場爆炸 |
| Shift / 空白 | 衝刺閃避，有短暫無敵 |
| Enter / 點擊 | 推進劇情、選單 |

手機會自動顯示虛擬搖桿與按鈕（`pointer: coarse` 時）。

## 程式結構（index.html 內的 script）

整個遊戲是一個 IIFE，沒有外部函式庫。依區塊順序：

1. **音效**：`tone()`、`noise()` 用 WebAudio 即時合成，`SFX` 物件是各種打擊音。沒有音檔。
2. **語音**：`say(text, who, force)` 用瀏覽器內建 `speechSynthesis`，優先挑 zh-TW 聲音。`SPEAK` 定義每個角色的名字、音高、語速、字幕顏色。同時一定會顯示字幕（`G.sub`），所以沒有中文語音的環境也看得懂。非 force 的台詞有 1.6 秒冷卻，避免洗版。
3. **輸入**：`keys`（按住狀態）與 `pressed`（本幀剛按下，幀尾清空）。`KEYMAP` 是鍵位表。
4. **資料**：
   - `HERO_PAL`：主角配色
   - `DEF`：所有敵人與魔王的數值（hp、速度、傷害、AI 類型、配色、魔王招式池 `pats`）
   - `STAGES`：四章的名稱、開場對白、每波敵人、魔王與台詞
   - `THEME`：四章背景色
5. **流程**：`G.mode` 狀態機：`title → story → play → clear → story → … → ending`，死亡進 `dead` 可重打本章。
6. **玩家**：`updatePlayer()` 依 `P.state`（idle/walk/atk/blast/charge/ult/dash/hurt）處理。攻擊資料在 `ATK`，命中判定在 `doMelee()`，傷害在 `hitEnemy()`。血量低於 35% 進入暴走（攻擊 ×1.4、怒氣自動回）。
7. **敵人 AI**：`updateEnemy()` 三種：`melee` 近戰追擊、`range` 保持距離射擊、`boss` 從招式池隨機出招（melee 追擊 / dash 衝撞 / spread 扇形彈 / rain 地面落雷 / tele 瞬移背後）。魔王有韌性 `poise`，累積 60 傷害才會被打僵直。終章魔王是不會動的 `core`（`updateCore()`），定時召喚無人機和落雷。
8. **繪圖**：角色全部是程式畫的幾何圖形（`drawFighter()`，依 `poseOf()` 決定姿勢），鬥氣是 `drawAura()`。背景 `drawBG()`、HUD、劇情、結局各有一個 draw 函式。

畫布固定 960×540 邏輯解析度，依 devicePixelRatio 放大。

### 平衡數值速查

- 主角每章：血量 `220 + 80×章`，攻擊倍率 `1 + 0.65×章`（在 `newPlayer()`）
- 魔王血量：拉卡 560、澤諾瓦 1150、艾爾忒 1900、星核 1700（在 `DEF`）

## 目前狀態

- 四章、結局、語音、手機操作都可以完整玩完。自動化測試（headless Chrome 跑 25 秒輸入）沒有 console 錯誤。
- 語音與打擊手感沒有真人測過。
- **美術是最大缺口**：角色還是幾何小人。

## 美術：做到哪裡、下一步

### 已確定的設計決定

- 主角是**原創角色**，不能做成任何現有作品的角色（例如七龍珠的布羅利）或其招牌元素（綠色刺蝟頭、金色頭冠護腕、白色寬褲加紅腰布、猴子尾巴、賽亞人戰鬥服）。
- 主角設定：巨漢狂戰士、上身赤裸、赤手空拳、全白眼、金綠色鬥氣。
- 鬥氣不畫進圖裡，在遊戲中用程式畫（半透明光暈去背會被吃掉，程式畫還能做動畫）。
- 全白眼模型畫不準，打算在遊戲裡直接把眼睛塗白。

### 候選主角（art/cut/sheet.png）

推薦 **v_1**（深紅刺蝟頭、寬褲紅腰帶）、v_4（暗紅鬃毛，最有魔王感）、v_6（火焰刺頭）。c_1、c_3 不建議。主角尚未定案。

### 生圖環境（10.16.41.144）

- 位置：`/home/johnny/shorts/gen`，venv 在 `/home/johnny/shorts/gen/venv`
- 模型：SDXL-Turbo（純 CPU），512×896、4 steps、guidance 0，每張約 31 秒
- 一律背景執行並限制資源：`setsid nohup taskset -c 4-7 nice -n 19 ionice -c 3 venv/bin/python xxx.py > xxx.log 2>&1 &`（VPN 常斷，前景跑會被殺）
- 腳本（在主機上，尚未放進 repo）：`hero_concept.py`（第一批）、`hero_cut.py`（白底 + 去背）、`hero_var.py`（6 個變體），輸出在 `out_hero/`、`out_cut/`
- **提示詞不能超過 CLIP 的 77 token**，超過的部分會被直接截掉（log 會出現 `truncated`）。重點特徵要放在最前面。
- SDXL-Turbo 不吃 negative prompt。要「不拿武器」只能在正向寫 `unarmed, bare fists`。
- 磁碟：`/` 在生完圖後是 67%，注意不要塞爆（ES 也在這台）。

已用的提示詞（v_1，seed 7）：

```
1990s anime fighting game sprite, 16-bit pixel art, full body, unarmed hulking muscular warrior, tall spiky crimson hair standing straight up, glowing blank white eyes, bare chest, torn black baggy pants, red sash, iron collar, plain white background
```

### 去背（rembg 2.0.87，模型 isnet-general-use）

venv 只裝了 `rembg[cpu]`（函式庫），沒有命令列版（`rembg[cli]` 會多裝 gradio 等幾百 MB）。用法：

```bash
~/shorts/gen/venv/bin/python -c "
from rembg import remove, new_session
from PIL import Image
remove(Image.open('輸入.jpg'), session=new_session('isnet-general-use')).save('輸出.png')
"
```

輸出一定要存 `.png`。

### 接下來要做的

1. 定案主角版本。
2. 以定案圖為基準生各動作：站立、走路、輕攻擊、重攻擊、發氣彈、集氣、大絕招、受傷、倒下，每個 2～6 格。SDXL-Turbo 很難讓同一角色在不同動作保持一致，可能需要多生挑選，或改用 img2img（strength 約 0.25～0.4）從定案圖延伸。
3. 去背後排成 sprite sheet，以同目錄檔案或 data URI 載入。
4. 改 `drawFighter()`：主角改畫圖片，依 `poseOf()` 選動作幀；保留 `drawAura()` 畫鬥氣（改成金綠色）。
5. 敵人與魔王照同樣流程。
