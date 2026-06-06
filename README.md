# 🍱 午餐忍者 Lunch Ninja

> 一款結合台灣國小營養午餐議題的切食物教育遊戲  
> An educational food-slicing game based on Taiwan elementary school lunch themes  
> 🏫 **國立政治大學 課堂期末專案 / National Chengchi University (NCCU) Class Final Project**

---

## 🇹🇼 中文說明

### 簡介

**午餐忍者**是一款受《水果忍者》啟發的網頁遊戲，專為國小學生設計，本專案為國立政治大學的課堂期末專案。透過遊戲化學習讓學生了解：

- 🥗 **健康飲食**：認識各種食材的營養價值
- 🌱 **永續農業**：認識台灣在地食材與碳足跡概念
- ♻️ **剩食議題**：體驗食物浪費帶來的後果

### 遊戲玩法

本遊戲分為兩個階段：

#### 🎮 第一階段：切食材挑戰 (動作敏捷度)
玩家需要揮動刀光切碎畫面上飛出的食材：
| 動作 | 效果 |
|------|------|
| 切到 🌱 在地食材 | +15～20 分，+營養值 |
| 切到 🌍 非在地食材 | +8～10 分，+營養值 |
| 切到 ⚠️ 剩食（灰色）| 累積廚餘 +1 份 |
| 切到 💣 炸彈 | 扣一條生命 |
| 食材沒切到飛出畫面 | 自動變剩食 +1 份 |

- **過關條件**：今日營養攝取條集滿 100% 即可進入第二階段。
- **失敗條件**：累積 5 份剩食 或 生命值歸零（若失敗仍會進入第二階段答題，但結算評價會受到影響）。

#### 📝 第二階段：午餐永續大考驗 (知識問答)
第一階段結束後，將根據玩家在遊戲中**切到的食材**動態生成專屬題庫：
- 共挑戰 **5 題單選題**（包含 3 題切中食材的背景知識題 + 2 題永續與剩食核心觀念題）。
- 每答對一題可獲得 **100 分** 加分！
- 答題完成後進行「永續午餐結算」，系統會依據總得分、剩食量與答對題數給予專屬的忍者封號與綠色評語，並呈現台灣剩食統計數據與永續飲食小知識。

### 快速開始

無需安裝任何套件，直接用瀏覽器開啟：

```bash
git clone https://github.com/YOUR_USERNAME/lunch-ninja.git
cd lunch-ninja
open index.html   # macOS
# 或直接用瀏覽器開啟 index.html
```

或直接線上遊玩：**[GitHub Pages 連結](#)** *(部署後填入)*

### 食材清單

**🌱 台灣在地食材（15–20 分）**
🥕 紅蘿蔔 / 🍅 番茄 / 🐟 鯖魚 / 🍠 地瓜 / 🥬 小白菜 / 🍄 香菇 / 🌽 玉米 / 🥜 花生 / 🥒 小黃瓜

**🌍 非在地健康食材（8–10 分）**
🥦 花椰菜 / 🥚 雞蛋 / 🍋 檸檬

**⚠️ 剩食（切到或未切均累積廚餘）**
🍟 剩食薯條 / 🍱 剩下的便當 / 🍰 高糖蛋糕

### 教學設計說明

本遊戲對應以下核心教育目標：

1. **健康議題**：透過切中食材後顯示的知識卡片，讓學生認識各食材的營養功能
2. **永續議題**：在地食材標有 🌱 標誌並有更高分數，強化「選擇在地 = 減少碳排」的概念
3. **剩食議題**：食物沒切到會自動成為剩食，讓學生理解「不吃完」的後果；結算頁面呈現台灣真實剩食數據

### 技術規格

- **純靜態網頁**：無需後端、無需安裝，以瀏覽器開啟 `index.html` 即可遊玩
- **相容性**：Chrome / Firefox / Safari / Edge 最新版本
- **行動裝置**：支援觸控操作（touchmove）
- **字體**：Noto Sans TC（Google Fonts）+ Silkscreen

---

## 🇺🇸 English

### Overview

**Lunch Ninja** is a browser-based food-slicing game inspired by *Fruit Ninja*, designed for elementary school students in Taiwan, created as a class final project at National Chengchi University (NCCU). It allows students to explore:

- 🥗 **Healthy eating** — learn the nutritional value of different foods
- 🌱 **Sustainable agriculture** — understand local ingredients and carbon footprint
- ♻️ **Food waste** — experience the consequences of wasting food

### Gameplay

The game consists of two stages:

#### 🎮 Stage 1: Food-Slicing Challenge
Slice nutritious ingredients while avoiding waste and bombs:
| Action | Effect |
|--------|--------|
| Slice 🌱 local ingredients | +15–20 pts, +nutrition |
| Slice 🌍 non-local ingredients | +8–10 pts, +nutrition |
| Slice ⚠️ food waste (gray items) | +1 waste count |
| Slice 💣 bomb | Lose one life |
| Miss an ingredient (falls off screen) | Auto-converts to food waste +1 |

- **Win condition**: Fill the nutrition bar to 100% to proceed to the quiz.
- **Lose conditions**: Accumulate 5 food waste items OR lose all lives (you still proceed to the quiz, but your final evaluation will be impacted).

#### 📝 Stage 2: Lunch Sustainability Quiz
After Stage 1, a quiz is dynamically generated based on the **ingredients you successfully sliced**:
- Answer **5 multiple-choice questions** (3 questions based on your sliced ingredients, and 2 general sustainability/waste questions).
- Each correct answer awards **+100 bonus points**.
- Upon completion, you will receive a final evaluation with a unique title (e.g., *Ultimate Sustainability Master*, *Imperfect Beginner*) based on your score, waste level, and quiz accuracy, alongside educational facts.

### Quick Start

No installation required — just open in a browser:

```bash
git clone https://github.com/YOUR_USERNAME/lunch-ninja.git
cd lunch-ninja
open index.html   # macOS
# Or simply open index.html in any browser
```

### Scoring System

Scores are based on **sustainability**, not just nutrition:

- **Local ingredients (15–20 pts)**: Low carbon footprint, supports local agriculture
- **Non-local ingredients (8–10 pts)**: Nutritious but higher transport emissions
- **Combo multiplier**: Consecutive cuts multiply score (×2, ×3, ×4…)

### Educational Design

| Theme | Game Mechanic |
|-------|--------------|
| Healthy eating | Info card appears on every cut showing nutritional facts |
| Sustainable food | Local items marked 🌱 with higher scores |
| Food waste | Missed food becomes waste; 5 waste = game over |
| Real data | End screen shows Taiwan's actual food waste statistics |

### Technical Specs

- **Pure static page**: No backend or installation required, simply open `index.html` in a browser
- **Compatibility**: Latest Chrome / Firefox / Safari / Edge
- **Mobile**: Touch support via `touchmove`
- **Fonts**: Noto Sans TC (Google Fonts) + Silkscreen

---

## 📁 專案結構 Project Structure

```
lunch-ninja/
├── index.html          # 遊戲主網頁 / Main game entry page
├── README.md           # 專案說明文件 / Documentation
├── css/
│   └── style.css       # 遊戲樣式表 / Game stylesheet
└── js/
    ├── data.js         # 食材與問答資料庫 / Ingredient & quiz database
    ├── game.js         # 第一階段切食材邏輯 / Slicing game logic & engine
    └── quiz.js         # 第二階段問答與結算邏輯 / Quiz phase & evaluation logic
```

---

## 🚀 部署到 GitHub Pages / Deploy to GitHub Pages

1. 將專案 push 到 GitHub
2. 進入 **Settings → Pages**
3. Source 選擇 `main` branch，根目錄 `/`
4. 儲存後即可透過 `https://YOUR_USERNAME.github.io/lunch-ninja/` 遊玩

---

## 🙏 致謝 Credits

- **本專案為國立政治大學（NCCU）課程之期末專案 / Created as a class final project at National Chengchi University**
- 遊戲靈感來自 [Fruit Ninja](https://halfbrick.com/games/fruit-ninja/)
- 菜單參考：台北市木柵國小營養午餐菜單
- 字體：[Noto Sans TC](https://fonts.google.com/noto/specimen/Noto+Sans+TC) / [Silkscreen](https://fonts.google.com/specimen/Silkscreen)

---

## 📝 授權 License

本專案供教育用途自由使用。  
Free to use for educational purposes.
