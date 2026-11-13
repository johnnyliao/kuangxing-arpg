# 辦公室格鬥傳

單一 HTML 檔的 2D 橫向動作 roguelike。被壓榨的工程師羅利，今天要讓整間公司安靜下來：依序打倒八婆、肥婆、屌毛，最後是胖子。（已整合主角羅利動作圖集、特效與日文語音）

- 線上版（舊版「狂星破滅」，私人，需要在 claude.ai 用 Share 開放權限，尚未更新）：https://claude.ai/artifact/RaGLnsSJq5GTndBnJHcTV7
- 本機遊玩：直接用瀏覽器打開 `index.html`，不需要建置或安裝任何東西

## 目錄

```
index.html        遊戲本體（HTML + CSS + JS 全在這一個檔案，四位魔王 base64 sprite + 主角羅利 sprite 渲染）
art/roli-v1/      主角羅利動作圖集（roli-actions-v1.png）與特效圖集（roli-effects-v1.png）
audio/            主角日文戰鬥語音包（voice-pack.js 與 14 組 game/*.mp3 片段）
art/concept/      第一批 AI 設定圖（a_* 動畫風、b_* 格鬥遊戲風），尚未使用
art/cut/          白底生圖與去背結果（*_cut.png 是透明背景），尚未接進遊戲
art/cut/sheet.png 9 個候選主角的總覽圖（舊版狂戰士方向，已不採用）
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
| 1 / 2 / 3、A / D + Enter（或 J）、點擊卡片 | 強化三選一（只在強化畫面） |

手機會自動顯示虛擬搖桿與按鈕（`pointer: coarse` 時）。

## Roguelike 系統

- **一命到底**：一局從第一章開始，死亡即本局結束（畫面顯示到達章節、擊殺、總傷害、拿到的強化與最佳紀錄），Enter 回標題重新開始。體力與強化會跨章保留，每進新一章回復 50% 體力、氣回滿 100，怒氣保留。
- **強化三選一**：每波敵人清光後（每章三波）與每章魔王死亡後（進下一章劇情之前）會跳出三張不重複的卡，普通權重 10、稀有權重 3，已達上限的不會再出現。選牌時遊戲暫停。
- **隨機波次**：每章的敵人種類取自原本該章 `waves` 裡出現過的種類，每章 3 波，第 w 波（從 0 算）數量為 `2 + w`，第三章起再加 1。魔王不變。
- **菁英敵人**：非魔王的敵人有 15% 機率成為菁英：血量 ×2.5、傷害 ×1.3、體型 ×1.15、帶金色光環並顯示「菁英」，擊殺回復 8% 體力上限。
- **最佳紀錄**：存在 localStorage 的 `kx_best` = `{stage, kills}`，比較順序是先章節後擊殺數。死亡時 `stage` 為到達章節（1～4），通關時寫 5（顯示「完成遊戲」）。標題畫面會顯示。

### 強化表

| 名稱 | 稀有度 | 上限 | 效果 |
|---|---|---|---|
| 狂暴之拳 `fist` | 普通 | 3 | 輕攻擊傷害 +25%／層 |
| 崩山 `quake` | 普通 | 3 | 重攻擊傷害 +30%、擊退 +20%／層 |
| 連環氣彈 `multi` | 普通 | 2 | 每發氣彈額外上下各射 1 發（vy ±120×k） |
| 氣海 `sea` | 普通 | 3 | 氣回復 +60%、氣彈耗氣 -3（最少 4）、集氣速度 +30%／層 |
| 吸血本能 `leech` | 普通 | 3 | 造成傷害的 4% 回復體力／層 |
| 鋼鐵之軀 `iron` | 普通 | 3 | 體力上限 +25%（乘在章節基礎值上）／層，獲得時回復增加量 |
| 怒火中燒 `fury` | 普通 | 3 | 怒氣累積（打人與被打）+40%／層 |
| 毀滅之球 `orb` | 稀有 | 2 | 大絕招傷害 +50%、爆炸範圍 +100／層 |
| 殘影 `ghost` | 普通 | 2 | 衝刺速度 +30%、衝刺無敵 +0.15 秒／層 |
| 暴擊 `crit` | 普通 | 4 | 暴擊率 +15%／層（上限 60%），暴擊傷害 ×2 |
| 反擊氣場 `thorns` | 普通 | 2 | 受傷時對周圍 130 範圍（橢圓）敵人造成 20×層 點傷害 |
| 不死之軀 `undying` | 稀有 | 1 | 每局一次，致死攻擊保留 1 點體力並無敵 2 秒 |
| 嗜殺 `bloodlust` | 普通 | 3 | 每次擊殺回復體力上限的 3%／層 |
| 狂戰士血脈 `blood` | 稀有 | 1 | 暴走門檻 35% → 50%、暴走攻擊倍率 1.4 → 1.6 |

## 章節、魔王與小怪

| 章 | 章名 | 場景 | 魔王 | 血量 | 招式池 `pats` | 魔王投射物 `shotKind` |
|---|---|---|---|---|---|---|
| 1 | 第一章　八卦地獄 | 開放式辦公區 | 八婆 `bapo` | 560 | melee, dash, spread, melee | `spit` 白色與粉色小水滴 |
| 2 | 第二章　茶水間 | 茶水間 | 肥婆 `feipo` | 1150 | melee, spread, dash, rain | `flake` 白色頭皮屑（一發數片） |
| 3 | 第三章　Code Review | 會議室 | 屌毛 `diaomao` | 1900 | tele, melee, spread, rain, dash, tele | `text` 紅字 BUG／ERROR（隨機） |
| 4 | 終章　死線 | 機房 | 胖子 `pangzi` | 1700 | melee, spread, dash, rain, spread | `tear` 淺藍色淚滴 |

- 小怪（鍵值與 AI 不變，只換配色）：`grunt`／`shooter` 是辦公室同仁（白或淺藍襯衫、深色長褲、紅領帶）；`soldier`／`gunner` 是業務（灰西裝）；`angel`／`seraph` 是 QA（綠色 polo 衫）；`drone` 是黑色保全制服。`shooter`、`gunner`、`seraph`、`drone` 的射擊是白色紙張（`shotKind: 'paper'`）。
- 地面危險區（`rain`）仍是圓形，顏色與該魔王的 `shot` 色相同。
- 魔王的 hp 條顏色是 `pal.accent`；第四章胖子的 `pats` 為 `['melee','spread','dash','rain','spread']`。

## 程式結構（index.html 內的 script）

整個遊戲是一個 IIFE，沒有外部函式庫。依區塊順序：

1. **音效**：`tone()`、`noise()` 用 WebAudio 即時合成，`SFX` 物件是各種打擊音。沒有音檔。
2. **語音**：`say(text, who, force)` 用瀏覽器內建 `speechSynthesis`，優先挑 zh-TW 聲音。`SPEAK` 定義每個角色的名字、音高、語速、字幕顏色。同時一定會顯示字幕（`G.sub`），所以沒有中文語音的環境也看得懂。非 force 的台詞有 1.6 秒冷卻，避免洗版。
3. **輸入**：`keys`（按住狀態）與 `pressed`（本幀剛按下，幀尾清空）。`KEYMAP` 是鍵位表。
4. **sprite 資料**：`BOSS1`～`BOSS4`，每個是 `{img, anims}`，`anims` 內是各動作影格的 `x,y,w,h` 與腳底錨點 `ax,ay`。
5. **資料**：
   - `HERO_PAL`：主角配色（白襯衫、紅領帶、黑短髮）
   - `DEF`：所有小怪與魔王的數值（hp、速度、傷害、AI 類型、配色、`shot`／`shotKind`、魔王招式池 `pats`、`sprite`）
   - `STAGES`：四章的名稱、副標、開場對白、每波敵人、魔王與台詞
   - `THEME`：四章的牆色與地板色
   - `UPG`：強化表
6. **流程**：`G.mode` 狀態機：`title → story → play ⇄ draft → clear → draft → story → … → ending`，死亡進 `dead`（本局結束）回 `title`。強化相關：`openDraft()`、`pickUpgrade()`；強化效果分別在 `doMelee()`、`hitEnemy()`、`killEnemy()`、`hurtPlayer()`、`updatePlayer()` 裡用 `m(id)` 讀層數。
7. **玩家**：`updatePlayer()` 依 `P.state`（idle/walk/atk/blast/charge/ult/dash/hurt）處理。攻擊資料在 `ATK`，命中判定在 `doMelee()`，傷害在 `hitEnemy()`。血量低於 35% 進入暴走（攻擊 ×1.4、怒氣自動回）。
8. **敵人 AI**：`updateEnemy()` 三種：`melee` 近戰追擊、`range` 保持距離射擊、`boss` 從招式池隨機出招（melee 追擊 / dash 衝撞 / spread 扇形彈 / rain 地面落雷 / tele 瞬移背後）。魔王有韌性 `poise`，累積 60 傷害才會被打僵直。
9. **繪圖**：`drawFighter()` 對有 `sprite` 的 DEF（四位魔王）畫 sprite atlas，其餘（主角與小怪）畫程式幾何圖形，姿勢由 `poseOf()` 決定，鬥氣是 `drawAura()`。背景 `drawBG()` 依章節畫四種場景，`drawShot()` 畫魔王與小怪的投射物，HUD、劇情、結局各有一個 draw 函式。

畫布固定 960×540 邏輯解析度，依 devicePixelRatio 放大。

### 魔王命中特效（`bossHitFx()`）

被魔王打中時，從頭部附近（sprite 高度的 92%）噴粒子：

- 八婆：紅色血滴 `#c0101a` ＋ 2～3 片白色牙齒碎片（4×5 白色方塊，往上飛）
- 肥婆：白色頭皮屑爆開
- 屌毛：小型紅色 `BUG` 浮字（沿用 `texts[]`，帶 `col`、`sz` 欄位）
- 胖子：藍色淚滴粒子

### 平衡數值速查

- 主角每章：血量 `(220 + 80×章) × (1 + 0.25×鋼鐵之軀層數)`，攻擊倍率 `1 + 0.65×章`（在 `startStage()` 與 `calcMax()`）；暴走門檻 35%（狂戰士血脈後為 50%）
- 魔王血量：八婆 560、肥婆 1150、屌毛 1900、胖子 1700（在 `DEF`）
- 魔王 sprite 大小：每位魔王在畫面上約 170×mul×(size/1.25) 像素高，`size` 來自 DEF

## 目前狀態

- 四章、結局、語音、手機操作都可以完整玩完。2026-11-13 headless 冒煙測試（四章，每章打王、命中特效、通關、結局）0 console 錯誤。
- Roguelike 版（分支 `roguelike`）另有冒煙測試：抽強化、章節過渡、死亡、最佳紀錄都跑過，沒有 console 錯誤。
- 語音與打擊手感沒有真人測過。
- **美術狀態**：四位魔王已是 sprite；主角已替換為羅利專屬 sprite 與能量特效；小怪維持幾何圖形。

## 美術

### 魔王 sprite（四組 atlas）

四組 atlas 都以 base64 PNG 內嵌在 `index.html`（`BOSS1`～`BOSS4` 常數，位置在 `const DEF=` 之前），各動作影格座標與腳底錨點寫在同一常數的 `anims` 內。

| 常數 | 魔王 | 來源截圖（不在 repo 內） | idle | walk | attack | special | hurt |
|---|---|---|---|---|---|---|---|
| `BOSS1` | 八婆 | 2.png | 6 | 9 | 5 | 10 | 6 |
| `BOSS2` | 肥婆 | 4.png | 6 | 9 | 5 | 8 | 6 |
| `BOSS3` | 屌毛 | 5.png | 6 | 9 | 5 | 8 | 6 |
| `BOSS4` | 胖子 | 6.png | 6 | 9 | 5 | 8 | 3 |

- 2.png 的 special 列原本就是 10 格。4.png、5.png、6.png 的 special 列圖上只有 8 人，所以切成 8 格（不是預期的 9）。
- **BOSS4 特殊處理**：6.png 沒有受傷列。`hurt` 取自 ATTACK 列第 6～8 格（揮舞後倒下），`attack` 只用第 1～5 格。6.png 最下面那一列是「VFX ONLY」，已忽略。
- BOSS2 與 BOSS3 的受傷列含掉落的頭皮屑與「當機」字樣、星星，都歸在該格內。
- 屌毛 special 列的氣泡與 BUG／ERROR 字樣依人物位置分欄，邊界取兩人中間最空的欄位，所以偶爾會有字被切到的小殘影。

影格對應（`drawFighter()` 的 sprite 分支）：idle → `idle`（6 fps 循環）；walk → `walk`（10 fps 循環）；wind／punch → `attack`，依攻擊進度播放；spread／dash／rain → `special`，依攻擊進度播放；stun／die → `hurt`，播一次後停在最後一格。

縮放：每位魔王的 sprite 在畫面上高度為 `170×mul×(size/1.25)` 像素。程式用「170 ÷ (1.25 × 第一個 idle 影格高度)」當局部比例，所以不同魔王的 `size` 不同也能站到約 170 px。翻轉依 `face`、腳底錨點對齊 `(e.x, e.y)`，關閉圖片平滑，命中時白閃、死亡淡出，鬥氣照常畫。

切圖方法（工具腳本在暫存資料夾，不在 repo）：以畫面最常見的顏色當背景鍵除；去掉列標籤（只清去飽和的像素，範圍限在標籤框內，並清掉上一列殘留的腳影）；每列依人物位置分欄（一般列用投影峰谷合併／切分，特效列用指定的人物中心）；每格取 tight bbox；錨點取底部 12 列的水平中心，y 為 bbox 底部。

### shotKind 與魔王投射物

`DEF` 的 `shotKind` 決定投射物畫法（`drawShot()`），沒有的仍畫發光圓球：

| `shotKind` | 用在 | 畫法 |
|---|---|---|
| `spit` | 八婆 | 白色圓點 ＋ 粉色小圓點 |
| `flake` | 肥婆 | 4 片白色小方塊，隨時間旋轉，一發一組 |
| `text` | 屌毛 | 紅色 `BUG` 或 `ERROR`（建立時隨機），粗體加深色描邊 |
| `tear` | 胖子 | 淺藍色淚滴形 |
| `paper` | 射手、業務槍手、QA 射手、保全 | 白色小紙片，邊飛邊轉 |

## 設計決定

- 主角與敵人皆為原創角色，不借用任何現有作品的角色或招牌元素（髮型、服裝、配色、招式名稱）。
- 主角是**凱嵐**，工程師，程式畫的幾何人物（`HERO_PAL`：膚色 `#d9a27a`、黑短髮、白襯衫、深色長褲、紅領帶）。衝刺殘影仍為紅色。
- 鬥氣不畫進圖裡，在遊戲中用程式畫（半透明光暈去背會被吃掉，程式畫還能做動畫）。

## 接下來要做的

1. 小怪改成 sprite：配色已換成辦公室風格，照魔王的切圖流程做 `DEF` 的 `sprite`。
2. 主角改 sprite（目前是幾何人物）。
3. 切圖工具可重用到其他角色。

## 附錄：主角 AI 生圖流程（舊，尚未用於遊戲）

早期的主角候選與生圖筆記保留如下，供之後參考。

### 生圖環境（10.16.41.144）

- 位置：`/home/johnny/shorts/gen`，venv 在 `/home/johnny/shorts/gen/venv`
- 模型：SDXL-Turbo（純 CPU），512×896、4 steps、guidance 0，每張約 31 秒
- 一律背景執行並限制資源：`setsid nohup taskset -c 4-7 nice -n 19 ionice -c 3 venv/bin/python xxx.py > xxx.log 2>&1 &`（VPN 常斷，前景跑會被殺）
- 腳本（在主機上，尚未放進 repo）：`hero_concept.py`（第一批）、`hero_cut.py`（白底 + 去背）、`hero_var.py`（6 個變體），輸出在 `out_hero/`、`out_cut/`
- **提示詞不能超過 CLIP 的 77 token**，超過的部分會被直接截掉（log 會出現 `truncated`）。重點特徵要放在最前面。
- SDXL-Turbo 不吃 negative prompt。要「不拿武器」只能在正向寫 `unarmed, bare fists`。
- 磁碟：`/` 在生完圖後是 67%，注意不要塞爆（ES 也在這台）。

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
