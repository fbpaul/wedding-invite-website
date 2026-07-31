# 婚禮邀請單頁網站 — 視覺設計規格書

> 對象：蔡梵志 & 彭湘晴 婚禮邀請網站
> 用途：本文件為「實作規格」，供實作 agent 直接照做。所有色碼、字級、間距、狀態樣式皆已給死，實作者**不需要再做任何美感判斷**。若規格有衝突，以本文件為準。
> 技術前提：單頁式靜態網站（HTML + CSS + vanilla JS，無框架、無 build step）。字型只用 Google Fonts / 系統字型。行動優先（375px 手機、1440px 桌機皆須漂亮）。
> 語言：繁體中文為主，英文/數字作點綴。

---

## 0. 如何使用本規格

1. 第 1～7 節是「全域設計系統」：色彩、字型、間距、佈局、裝飾、動效、元件。先把第 2 節的 CSS 變數整包貼進 `css/` 的根樣式（`:root`），全站沿用。
2. 第 8 節是「各區塊版式」：7 個內容區塊，每區都有〈手機版〉〈桌機版〉wireframe 與所需元件。
3. 第 9 節是表單四狀態完整樣式（focus / error / loading / success）。
4. 第 10～12 節是無障礙、分享預覽、檔案結構與驗收自查。
5. 凡標示 `⟨placeholder⟩` 者為之後替換的內容（照片、地圖 embed、表單欄位、LINE bot），需依規格保留版位與樣式。

---

## 1. 視覺方向與情緒關鍵字

**方向一句話**：以「薰衣白 × 優雅紫 × 霧灰紫」構築一封安靜而有質感的紙本邀請函感——留白慷慨、襯線標題優雅、線條纖細，手機一打開像收到一張手工卡片，溫暖、體面、不喧嘩。（2026-08 由暖大地色系「暖象牙白 × 陶土玫瑰 × 鼠尾草綠」改版為紫色調，情緒方向與設計原則不變，僅色相調整。）

**情緒關鍵字**：優雅（elegant）、溫潤（warm）、當代（modern）、克制（restrained）、手作紙感（tactile / editorial）。

**設計原則（實作時的取捨準則）**：
- **讓內容呼吸**：寧可留白過多，不要塞滿。區塊之間用大間距與細分隔線分節，不用重色塊硬切。
- **層次靠字型與間距，不靠裝飾**：主視覺力量來自襯線標題 + 大量留白，花草線條只作點綴，絕不搶戲。
- **暖而不甜**：採柔霧紫調（優雅紫 / 薰衣白），刻意避開「粉紅疊粉紅」的甜膩與手繪水彩感，維持成熟高級。
- **輕量動效**：淡入、微位移、細膩 hover；不做浮誇彈跳、視差、自動輪播。尊重 `prefers-reduced-motion`。

---

## 2. 色彩系統

全站僅用以下代幣。**主色 3 個 + 中性色**，其餘為狀態色。所有色以 hex 定義。

### 2.1 CSS 變數（直接貼入 `:root`）

```css
:root {
  /* 背景 */
  --color-bg:          #FAF7FB; /* 主背景・薰衣白 */
  --color-bg-alt:      #F1EAF4; /* 交錯區塊背景・淡薰衣紫 */
  --color-bg-deep:     #E9DEEE; /* 卡片/表單容器底・深薰衣紫 */
  --color-white:       #FFFFFF; /* 輸入框、卡片純白底 */

  /* 文字 */
  --color-ink:         #352F3D; /* 主文字・深紫炭 */
  --color-ink-soft:    #635971; /* 次要文字/說明・霧紫灰 */

  /* 主色（優雅紫） */
  --color-primary:      #6D4C7D; /* 連結、按鈕、強調 */
  --color-primary-dark: #54395F; /* hover / active */
  --color-primary-soft: #EFE6F2; /* 主色淡底・pill/tag 背景 */

  /* 輔色（霧灰紫） */
  --color-sage:        #9A8AA3; /* 裝飾線條、大字級輔色（非正文） */
  --color-sage-dark:   #6F5F79; /* 可作正文的深霧紫 */

  /* 裝飾金（僅細線 / 圖形，禁用於文字；與紫色系仍為經典配色） */
  --color-gold:        #C9A96A;

  /* 界線 */
  --color-line:        #DED1E3; /* 分隔線、輸入框邊框 */

  /* 狀態色 */
  --color-error:       #B23A48; --color-error-bg:   #FBEDEE;
  --color-success:     #357052; --color-success-bg: #E9F3EC;

  /* focus ring 用（主色 18% 透明） */
  --focus-ring:        0 0 0 3px rgba(109, 76, 125, 0.22);
}
```

### 2.2 對比驗證表（WCAG）

正文須達 AA（一般文字 4.5:1、大文字 3:1）。以下皆已計算驗證：

| 前景 | 背景 | 對比 | 判定 | 用途 |
|---|---|---|---|---|
| `--color-ink` `#352F3D` | `--color-bg` `#FAF7FB` | **12.2 : 1** | AAA ✓ | **正文主色**（主要文字/背景組合） |
| `--color-ink` `#352F3D` | `--color-bg-alt` `#F1EAF4` | 11.0 : 1 | AAA ✓ | 交錯區塊正文 |
| `--color-ink` `#352F3D` | `--color-white` `#FFFFFF` | 12.9 : 1 | AAA ✓ | 輸入框內文字 |
| `--color-ink-soft` `#635971` | `--color-bg` `#FAF7FB` | 6.2 : 1 | AA ✓ | 次要文字、說明、label |
| `--color-ink-soft` `#635971` | `--color-bg-alt` `#F1EAF4` | 5.6 : 1 | AA ✓ | 交錯區塊次要文字 |
| `--color-ink-soft` `#635971` | `--color-primary-soft` `#EFE6F2` | 4.6 : 1 | AA ✓ | LINE bot 預留卡等淡紫底次要文字 |
| `--color-primary` `#6D4C7D` | `--color-bg` `#FAF7FB` | 6.6 : 1 | AA ✓ | 連結、強調文字 |
| `--color-white` `#FFFFFF` | `--color-primary` `#6D4C7D` | 7.0 : 1 | AAA ✓ | 主按鈕文字 |
| `--color-white` `#FFFFFF` | `--color-primary-dark` `#54395F` | 9.9 : 1 | AAA ✓ | 按鈕 hover 文字 |
| `--color-error` `#B23A48` | `--color-bg` `#FAF7FB` | 5.5 : 1 | AA ✓ | 錯誤訊息文字 |
| `--color-success` `#357052` | `--color-bg` `#FAF7FB` | 5.5 : 1 | AA ✓ | 成功訊息文字 |
| `--color-sage-dark` `#6F5F79` | `--color-bg` `#FAF7FB` | 5.5 : 1 | AA ✓ | 若霧紫需作正文，用此深色 |
| `#C6BBD1`（頁尾次要文字，硬編碼於 `.site-footer__date`/`.site-footer__copyright`） | `--color-ink`（頁尾底色）`#352F3D` | 7.0 : 1 | AAA ✓ | 深底次要文字 |

**禁用組合（會不合格，實作勿犯）**：
- `--color-gold` `#C9A96A` 對背景僅 ~2.1:1 → **只能作細線/圖形，禁止當任何文字色**。
- `--color-sage` `#9A8AA3` 對背景僅 ~3.0:1 → 僅可用於**裝飾線條或 ≥24px 的大字級標籤**，禁止當正文。正文要用輔色請改用 `--color-sage-dark`。

---

## 3. 字型系統

### 3.1 字型家族與載入

- **中文標題 & 中文正文**：`Noto Serif TC`（標題）＋ `Noto Sans TC`（正文）。
- **英文/數字點綴**（姓名英拼、日期數字、英文小標籤、倒數數字）：`Cormorant Garamond`（優雅襯線）。
- **系統字備援**：`system-ui, -apple-system, "PingFang TC", "Microsoft JhengHei", sans-serif`。

在 `<head>` 貼入（含 preconnect 加速）：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

字型變數：

```css
:root {
  --font-serif: "Noto Serif TC", "Songti TC", serif;                 /* 中文標題 */
  --font-sans:  "Noto Sans TC", system-ui, -apple-system, "PingFang TC", "Microsoft JhengHei", sans-serif; /* 中文正文 */
  --font-latin: "Cormorant Garamond", Georgia, "Times New Roman", serif; /* 英文/數字點綴 */
}
body { font-family: var(--font-sans); color: var(--color-ink); background: var(--color-bg); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
```

### 3.2 字級階層（mobile-first，root = 16px）

以下為手機（375px）與桌機（1440px）兩套值；中間用 `clamp()` 平滑過渡（已附建議式）。中文正文行高刻意放大到 1.9 以求呼吸感。

| Token / 用途 | 字型 | 字重 | 手機 | 桌機 | 建議 clamp | 行高 | 字距 |
|---|---|---|---|---|---|---|---|
| `--fs-display` Hero 姓名 | serif | 600 | 40px / 2.5rem | 72px / 4.5rem | `clamp(2.5rem, 5vw + 1.2rem, 4.5rem)` | 1.15 | 0.02em |
| `--fs-h1` 區塊主標 | serif | 600 | 28px / 1.75rem | 40px / 2.5rem | `clamp(1.75rem, 3vw + 0.9rem, 2.5rem)` | 1.25 | 0.01em |
| `--fs-h2` 次標 | serif | 500 | 22px / 1.375rem | 28px / 1.75rem | `clamp(1.375rem, 1.5vw + 1rem, 1.75rem)` | 1.3 | 0.01em |
| `--fs-h3` 卡片/小標 | serif | 500 | 18px / 1.125rem | 20px / 1.25rem | `clamp(1.125rem, 0.5vw + 1rem, 1.25rem)` | 1.4 | 0 |
| `--fs-eyebrow` 英文小標籤 | latin | 600 | 12px | 13px | — | 1.4 | 0.28em（`text-transform: uppercase`） |
| `--fs-lead` 引言/導語 | sans | 300 | 18px / 1.125rem | 20px / 1.25rem | `clamp(1.125rem, 0.5vw + 1rem, 1.25rem)` | 1.9 | 0.02em |
| `--fs-body` 正文 | sans | 400 | 16px / 1rem | 16px / 1rem | — | 1.9 | 0.02em |
| `--fs-small` 註解/caption | sans | 400 | 14px | 14px | — | 1.7 | 0.02em |
| `--fs-button` 按鈕文字 | sans | 500 | 16px | 16px | — | 1 | 0.08em |
| `--fs-num` 日期/倒數數字 | latin | 500 | 依區塊 | 依區塊 | — | 1 | 0.04em |

**規則**：
- 所有中文文字加 `letter-spacing: 0.02em` 提升可讀性（標題除外，見上表）。
- 正文最大寬度限制在 `--container-narrow`（640px），避免行過長。
- 輸入框內文字必須 **≥16px**（防 iOS Safari 自動放大）。
- 英文小標籤（eyebrow）一律大寫 + 寬字距，作為每個區塊標題上方的裝飾性導語（例：`OUR WEDDING`、`SCHEDULE`、`WITH LOVE`）。

---

## 4. 間距系統與版心

### 4.1 間距刻度（4px 基準）

```css
:root {
  --space-3xs: 4px;  --space-2xs: 8px;  --space-xs: 12px;
  --space-sm: 16px;  --space-md: 24px;  --space-lg: 32px;
  --space-xl: 48px;  --space-2xl: 64px; --space-3xl: 96px; --space-4xl: 128px;
}
```

### 4.2 版心與間隔

```css
:root {
  --container-max:    1120px; /* 一般區塊內容最大寬 */
  --container-narrow:  640px; /* 正文段落 / 表單 欄寬 */
  --gutter:            20px;  /* 手機左右安全邊距 */
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 20px; --radius-pill: 999px;
  --shadow-sm: 0 1px 2px rgba(53,47,61,.06), 0 2px 8px rgba(53,47,61,.05);
  --shadow-md: 0 4px 16px rgba(53,47,61,.08), 0 14px 34px rgba(53,47,61,.06);
}
@media (min-width: 600px) { :root { --gutter: 32px; } }
@media (min-width: 1200px) { :root { --gutter: 40px; } }

.container { width: 100%; max-width: var(--container-max); margin-inline: auto; padding-inline: var(--gutter); }
.container--narrow { max-width: var(--container-narrow); }
```

### 4.3 區塊節奏（section rhythm）

- 每個 `<section>` 上下留白：**手機 `--space-2xl`（64px）／桌機 `--space-4xl`（128px）**。
  ```css
  section { padding-block: var(--space-2xl); }
  @media (min-width: 900px) { section { padding-block: var(--space-4xl); } }
  ```
- 區塊背景交錯：奇數區塊 `--color-bg`，偶數區塊 `--color-bg-alt`，形成安靜的節奏但不用重色。
- 每個區塊標題群組結構固定：`eyebrow（英文小標）` → `分隔小飾（第 6 節）` →可略→ `h1 主標` → `lead 導語`，整組置中，下方 `--space-xl`（48px）再接內容。

### 4.4 響應式斷點

行動優先（先寫手機樣式，再用 `min-width` 往上加）：

| 斷點 | 寬度 | 對應裝置 |
|---|---|---|
| base | ≤ 599px | 手機（含 375px 基準） |
| `sm` | ≥ 600px | 大手機 / 平板直式 |
| `md` | ≥ 900px | 平板橫式 / 小筆電 |
| `lg` | ≥ 1200px | 桌機（含 1440px 基準） |

---

## 5. 佈局與元件庫

### 5.1 按鈕

三種變體，皆為 pill 圓角、48px 高（觸控友善）、`--fs-button`。

```css
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 48px; padding: 0 28px; border-radius: var(--radius-pill);
  font: 500 var(--fs-button)/1 var(--font-sans); letter-spacing: 0.08em;
  cursor: pointer; border: 1.5px solid transparent; text-decoration: none;
  transition: background-color .25s ease, color .25s ease, transform .25s ease, box-shadow .25s ease; }

/* 主按鈕：填色 */
.btn--primary { background: var(--color-primary); color: var(--color-white); }
.btn--primary:hover { background: var(--color-primary-dark); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn--primary:active { transform: translateY(0); }

/* 次按鈕：外框 */
.btn--ghost { background: transparent; color: var(--color-primary); border-color: var(--color-primary); }
.btn--ghost:hover { background: var(--color-primary-soft); }

/* 文字按鈕 */
.btn--text { min-height: auto; padding: 4px 0; color: var(--color-primary); border-radius: 0; }

.btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
```

### 5.2 卡片

```css
.card { background: var(--color-white); border: 1px solid var(--color-line);
  border-radius: var(--radius-lg); padding: var(--space-lg);
  box-shadow: var(--shadow-sm); }
```

### 5.3 連結（正文內）

```css
a { color: var(--color-primary); text-decoration: none;
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px; background-position: 0 100%; background-repeat: no-repeat;
  transition: background-size .3s ease; }
a:hover { background-size: 100% 1px; }   /* 底線由左往右展開 */
a:focus-visible { outline: none; box-shadow: var(--focus-ring); border-radius: 2px; }
```

---

## 6. 裝飾元素（純 CSS / inline SVG，禁用外部圖片）

所有裝飾以 inline SVG 或 CSS 實現，`aria-hidden="true"`，不得依賴外部圖檔。

### 6.1 分隔飾線（區塊標題下方 / 段落間）

兩條漸隱細線中間夾一片線描葉子；線用 `--color-line`，葉用 `--color-gold`。

```html
<div class="divider" aria-hidden="true">
  <span class="divider__line"></span>
  <svg class="divider__mark" width="26" height="26" viewBox="0 0 26 26">
    <path d="M13 2 C15 8 15 18 13 24 C11 18 11 8 13 2 Z" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M13 13 C9 11 7 13 4 13 M13 13 C17 11 19 13 22 13" fill="none" stroke="currentColor" stroke-width="1"/>
  </svg>
  <span class="divider__line"></span>
</div>
```
```css
.divider { display: flex; align-items: center; gap: var(--space-sm); max-width: 320px; margin: var(--space-md) auto; }
.divider__line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--color-line) 45%, var(--color-line) 55%, transparent); }
.divider__mark { flex: none; color: var(--color-gold); }
```

### 6.2 花草角飾（Hero 四角 / 區塊背景點綴）

線描植物枝條，描邊 `--color-sage`，`opacity: .5`，尺寸 120–200px，絕對定位在角落、允許溢出裁切。

```html
<svg class="sprig" width="160" height="160" viewBox="0 0 160 160" aria-hidden="true">
  <path d="M80 150 C80 100 70 60 40 30" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <path d="M74 118 C60 112 50 116 44 128"/><path d="M72 96 C58 90 48 94 42 106"/>
    <path d="M68 74 C56 66 46 70 40 82"/><path d="M60 52 C50 44 42 46 36 58"/>
    <path d="M78 128 C90 122 100 126 106 138"/><path d="M74 104 C86 98 96 102 102 114"/>
    <path d="M70 80 C82 72 92 76 98 88"/>
  </g>
</svg>
```
```css
.sprig { position: absolute; color: var(--color-sage); opacity: .5; pointer-events: none; }
```

### 6.3 其他純 CSS 裝飾

- **紙質微紋理**（可選，極淡）：`background-image: radial-gradient(rgba(53,47,61,.015) 1px, transparent 1px); background-size: 4px 4px;` 疊在主背景上。
- **時間軸連接線**：`1px` 直線 `--color-line` + 節點小圓（見 8.3）。
- **首字/序號圓章**：圓形 `--color-primary-soft` 底 + `--color-primary` 數字。

---

## 7. 動效規格

全部以 CSS transition / `IntersectionObserver` 實作，輕量、無第三方庫。

### 7.1 進場（scroll reveal）

元素初始 `opacity:0; translateY(16px)`，進入視窗後加 `.is-visible` 淡入上移。同一群組用 `--i` 做 80ms 階梯延遲。

```css
.reveal { opacity: 0; transform: translateY(16px);
  transition: opacity .7s ease, transform .7s cubic-bezier(.22,.61,.36,1);
  transition-delay: calc(var(--i, 0) * 80ms); }
.reveal.is-visible { opacity: 1; transform: none; }
```
```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
```

### 7.2 Hover / 互動

- 按鈕：見 5.1（`translateY(-2px)` + 加深底色 + 陰影，`.25s`）。
- 正文連結：底線左→右展開（見 5.3）。
- Gallery 圖／卡片：`transform: scale(1.04)`（容器 `overflow: hidden`），`.6s ease`。
- 倒數數字：秒數更新用純數字替換，**不做翻牌彈跳**（維持沉靜）。

### 7.3 Hero 首屏

載入後姓名淡入 + 由 `scale(.98)` → `1`（`1s ease`），飾線與日期依序 delay 150ms／300ms。首屏動畫僅播一次。

### 7.4 尊重使用者偏好（必做）

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important;
    transition-duration: .001ms !important; scroll-behavior: auto !important; }
  .reveal { opacity: 1 !important; transform: none !important; }
}
```
JS 中也需守門：`const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;`——若為 true，直接把所有 `.reveal` 設為可見、跳過進場動畫。

---

## 8. 各區塊版式（7 區・手機 + 桌機）

> 全站順序：導覽（可選）→ ① Hero → ② Gallery → ③ Timeline → ④ Location → ⑤ RSVP → ⑥ 小叮嚀 → ⑦ 頁尾。
> 背景交錯：① bg → ② bg-alt → ③ bg → ④ bg-alt → ⑤ bg → ⑥ bg-alt → ⑦ 深色頁尾（見 8.7）。

### 8.0 導覽列（可選，建議做極簡版）

- **樣式**：置頂 `position: sticky; top: 0`，初始透明；捲動超過 Hero 後加 `.is-scrolled`（底色 `rgba(251,247,242,.9)` + `backdrop-filter: blur(8px)` + 底部 `1px` `--color-line` + `--shadow-sm`）。高度 56px。
- **內容**：左為 monogram「蔡 & 彭」（serif，18px）；右為錨點連結（`流程`／`地點`／`回覆`），smooth-scroll。
- **手機**：只保留 monogram 置中 + 右側一顆「回覆出席」`.btn--primary` 小尺寸（min-height 40px）；其餘連結收起或省略（單頁捲動即可）。
- **桌機**：monogram 左、錨點連結右，字距 0.1em。

### 8.1 ① Hero（首屏）

**內容**：主標姓名「蔡梵志 & 彭湘晴」／日期「2027 . 03 . 27（六）」／地點一行「台中 · 蘭克斯特 Lancaster House」／倒數計時（可選）。
**目標**：手機一開就驚豔——大量留白 + 大字襯線姓名 + 角落花草線描。

版式結構（由上到下，置中）：
1. eyebrow：`THE WEDDING OF`（latin, uppercase, `--color-primary`, 字距 0.28em）
2. 主標姓名：`蔡梵志　&　彭湘晴`
   - `&` 用 `--font-latin` italic、`--color-primary`，比中文字略大。
   - 手機建議斷成三行：`蔡梵志` / `&` / `彭湘晴`（`&` 獨立一行置中）；桌機同一行。
3. 分隔飾線（6.1）
4. 日期：`2027 . 03 . 27` 用 `--font-latin` 500，字距 0.16em；後接 `（週六）午宴` 用 `--fs-small` `--color-ink-soft`。
5. 地點行：`台中 · 蘭克斯特 Lancaster House`（`--fs-lead`, `--color-ink-soft`）。
6. 倒數計時（可選，見 8.1.1）。
7. 向下捲動提示：細箭頭 SVG + `--color-ink-soft`，`opacity` 呼吸動畫（reduced-motion 時停）。

**手機版（375px）**：
- 全區至少 `100svh` 高、內容垂直置中，左右 `--gutter`。
- 花草角飾：左上、右下各一枚 `.sprig`（120px），`opacity .4`，允許被裁切。
- 姓名 `--fs-display`（40px）三行；`&` 一行。
- 倒數若放，四格橫排一列、緊湊（見下）。

**桌機版（1440px）**：
- 高度 `100vh`，內容置中欄 `max-width: 720px`。
- 姓名同一行 72px；四角各放 `.sprig`（180–200px），對角對稱。
- 日期與地點分兩行、間距加大（`--space-md`）。
- 背景可加極淡紙紋（6.3）。

#### 8.1.1 倒數計時元件（可選）

- **目標時間**：`2027-03-27T10:00:00+08:00`（儀式入場）。
- **結構**：四個單位卡「天 / 時 / 分 / 秒」。數字 `--font-latin` 500；手機 32px、桌機 44px；單位標籤 `--fs-small` `--color-ink-soft`、uppercase。
- **樣式**：每格 `--color-bg-deep` 底、`--radius-md`、內距 `--space-sm`；四格 `gap: --space-sm`。手機一列四格（等寬 `flex:1`），桌機加大間距。
- **動效**：僅數字文字替換，無翻牌。婚期已過則顯示「我們結婚了 ♡」一行取代倒數。
- **降級**：JS 失效時整個倒數區塊預設 `display:none`（用 JS 開啟），不留空版位。

### 8.2 ② 婚紗照 Gallery（Placeholder）

**現況**：尚無照片。需以優雅 placeholder 佔位，並定義未來換圖方式。

**Placeholder 長相（定義）**：
- 一個 `figure.gallery-item`，內含固定比例的佔位框 `.ph`。
- `.ph` 背景：`--color-bg-deep`，疊 45° 極淡斜紋 `repeating-linear-gradient(45deg, rgba(53,47,61,.02) 0 10px, transparent 10px 20px)`，`--radius-lg`，`1px solid --color-line`。
- 置中線描 icon（相機或花束，inline SVG，描邊 `--color-sage`，`opacity .55`，48px）＋ 下方一行 `照片準備中`（`--fs-small`, `--color-ink-soft`）。
- 比例：主圖 `aspect-ratio: 4/5`（直式婚紗），次圖可 `3/4` 或 `1/1`。用 `aspect-ratio` 撐開版位，換圖時尺寸不跳動。

```css
.ph { display: grid; place-items: center; aspect-ratio: 4 / 5;
  background: var(--color-bg-deep) repeating-linear-gradient(45deg, rgba(53,47,61,.02) 0 10px, transparent 10px 20px);
  border: 1px solid var(--color-line); border-radius: var(--radius-lg); color: var(--color-sage); }
```

**未來換圖方式（寫進註解供日後替換）**：
```html
<!-- 換圖：把 .ph 整塊換成 <img>，保留相同 class 的容器與 aspect-ratio -->
<figure class="gallery-item">
  <img src="assets/gallery/01.jpg" alt="蔡梵志與彭湘晴婚紗照" loading="lazy"
       style="aspect-ratio:4/5; width:100%; height:100%; object-fit:cover; border-radius:var(--radius-lg);">
  <figcaption class="gallery-cap">⟨可選說明文字⟩</figcaption>
</figure>
```
- 照片放 `assets/gallery/`，統一 `object-fit: cover`、`loading="lazy"`、務必給中文 `alt`。
- 保留同一組 `.gallery-item` 結構與比例，換圖不需改版。

**手機版**：標題群組（eyebrow `MOMENTS` + 主標「我們的故事」+ 導語）→ 單欄直向堆疊 3–5 個佔位框，`gap: --space-md`。第一張大（4/5），其後可交錯 3/4、1/1。
**桌機版**：非對稱網格——`display: grid; grid-template-columns: repeat(3, 1fr); gap: --space-md;`；第一張跨兩欄兩列（`grid-column: span 2; grid-row: span 2`）作主視覺，其餘填 1×1，形成雜誌感排版。hover 微放大（7.2）。

### 8.3 ③ 時間安排 Timeline

**內容（固定）**：
- 儀式：10:00 入場 / 10:30 準時開始
- 婚宴：11:30 入場 / 12:10 準時開席

**元件**：垂直時間軸，左側一條 `1px --color-line` 直線，節點為 `--color-primary` 小圓（12px），每個事件一張輕卡。

節點結構：`時間（--font-latin 500，--color-primary，24px）` → `事件名（--fs-h3 serif）` → `說明（--fs-small --color-ink-soft）`。共 4 個時間點，或分「儀式 / 婚宴」兩大群，各含入場+開始兩行。

建議分兩群組（更清楚）：
- 群組一「迎賓・儀式」：10:00 賓客入場 → 10:30 婚禮儀式準時開始
- 群組二「婚宴・午宴」：11:30 賓客入席 → 12:10 婚宴準時開席

**手機版**：單欄。時間軸線靠左（距左緣 `--space-lg`），節點與線對齊，卡片在右側。群組標題（`--fs-h2`）上方加分隔飾線。整段用 `.reveal` 由上而下階梯淡入（`--i` 遞增）。
**桌機版**：置中軸（線在中央），事件卡左右交錯（zig-zag）：奇數在左、偶數在右，各佔 `calc(50% - 40px)`，節點壓在中線上。時間數字放大到 32px。整體 `max-width: 760px` 置中。

```css
/* 桌機交錯示意 */
@media (min-width: 900px) {
  .timeline { position: relative; max-width: 760px; margin-inline: auto; }
  .timeline::before { content:""; position:absolute; left:50%; top:0; bottom:0; width:1px; background:var(--color-line); transform:translateX(-50%); }
  .timeline__item:nth-child(odd)  { margin-right: auto; text-align: right; }
  .timeline__item:nth-child(even) { margin-left: auto; text-align: left; }
}
```

### 8.4 ④ 地點 Location

**內容（固定）**：
- 場地：台中 蘭克斯特 Lancaster House
- 地址：`406 臺中市北屯區崇德路二段347號`（原始資料含「松竹里」，顯示可省略；完整為 臺中市北屯區松竹里崇德路二段347號）
- Google Maps 嵌入 + 「用 Google 地圖開啟」按鈕。

版式：左（或上）為地圖，右（或下）為資訊卡。
資訊卡內容：eyebrow `VENUE` → 場地名（`--fs-h2` serif）→ 地址（`--fs-body` `--color-ink-soft`，可點擊 `複製地址` 文字按鈕）→ `.btn--primary`「用 Google 地圖開啟」→ 可選：`.btn--ghost`「一鍵導航」。

**地圖嵌入**（免 API key 版，供實作直接用；正式上線可換 Google Maps「分享 > 嵌入地圖」產生的 iframe）：
```html
<div class="map-embed">
  <iframe
    src="https://www.google.com/maps?q=%E8%98%AD%E5%85%8B%E6%96%AF%E7%89%B9%20Lancaster%20House%20%E8%87%BA%E4%B8%AD%E5%B8%82%E5%8C%97%E5%B1%AF%E5%8D%80%E5%B4%87%E5%BE%B7%E8%B7%AF%E4%BA%8C%E6%AE%B5347%E8%99%9F&output=embed"
    loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="蘭克斯特 Lancaster House 地圖"></iframe>
</div>
```
```css
.map-embed { position: relative; aspect-ratio: 4/3; border-radius: var(--radius-lg); overflow: hidden;
  border: 1px solid var(--color-line); box-shadow: var(--shadow-sm); }
.map-embed iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
@media (min-width: 900px) { .map-embed { aspect-ratio: 16/10; } }
```
**開啟連結**（按鈕 `href`）：
`https://www.google.com/maps/search/?api=1&query=蘭克斯特+Lancaster+House+臺中市北屯區崇德路二段347號`

**手機版**：上下堆疊——地圖（`4/3`）在上，資訊卡在下，全寬。按鈕全寬（`width:100%`）。
**桌機版**：兩欄 `grid-template-columns: 1.2fr 1fr; gap: --space-xl;` 地圖左、資訊卡右垂直置中；資訊卡可加 `--color-white` 底 + 陰影浮於 `--color-bg-alt` 上。

### 8.5 ⑤ RSVP 表單區

**現況**：欄位之後才定案。本區先定義表單**視覺樣式**與版位（欄位以 `⟨placeholder⟩` 佔位）。四種狀態完整樣式見第 9 節。

版式：
- 標題群組：eyebrow `RSVP` → 主標「敬邀您的出席」→ 導語「請於 2027/2/28 前回覆，讓我們為您預留座位。」（`--color-ink-soft`）。
- 表單容器：`.card` 質感（白底、`--radius-lg`、`--shadow-sm`、內距手機 `--space-lg` / 桌機 `--space-xl`），寬度 `--container-narrow`（640px）置中。
- 欄位示意（實際欄位待定，先保留版位）：
  1. 姓名（text input）
  2. 出席與否（radio：出席 / 無法出席）
  3. 人數（number / select）
  4. 素食需求（checkbox 或 radio）
  5. 給新人的話（textarea）
  6. 送出按鈕（`.btn--primary`，桌機靠右或全寬、手機全寬）。
- 欄位間距 `--space-lg`；label 在輸入框上方（見 9.1）。

**手機版**：單欄，所有輸入框與按鈕全寬（`width:100%`）。radio/checkbox 以「可點選卡片」呈現（見 9.3）縱向堆疊，觸控目標 ≥48px。
**桌機版**：仍為單欄置中（表單單欄最好填），但可將「姓名 + 人數」並排為兩欄（`grid-template-columns: 1fr 1fr; gap: --space-md`）。送出按鈕置中或靠右，寬度 auto（min 200px）。

### 8.6 ⑥ 小叮嚀區

**用途**：預留交通 / 服裝 / 停車等提醒；先放範例文案結構。

版式：eyebrow `GOOD TO KNOW` → 主標「給您的小叮嚀」→ 卡片群。每則叮嚀一張卡：頂部線描 icon（inline SVG，`--color-sage`，40px）→ 小標（`--fs-h3` serif）→ 內文（`--fs-body` `--color-ink-soft`）。

範例文案結構（實作先放這些，之後可改）：
- **交通**：「會場位於台中北屯，鄰近⟨主要幹道/交流道⟩。建議搭乘計程車至『蘭克斯特 Lancaster House』。」
- **停車**：「現場備有停車位，⟨數量/是否免費⟩；車位有限，建議共乘或多加利用大眾運輸。」
- **服裝**：「無特定 dress code，誠摯邀請您以⟨半正式 / 明亮色系⟩前來，一起留下美好合影。」
- **兒童 / 其他**：「⟨如有其他叮嚀，於此補充⟩。」

**手機版**：單欄，卡片縱向堆疊 `gap: --space-md`。
**桌機版**：`grid-template-columns: repeat(2, 1fr)`（或 3 欄，依卡數）；卡片等高 `align-items: stretch`。

### 8.7 ⑦ 頁尾（含 LINE bot 預留位）

深色收尾，與全站淺底形成優雅對比。

- **底色**：`--color-ink` `#352F3D`；文字 `--color-bg` `#FAF7FB`（此組合對比 12.2:1 ✓，等同正文倒置）；次要文字用 `#C6BBD1`（冷淺紫灰，對深底 7.0:1）。
- **內容**（置中，`--space-3xl` 上下內距）：
  1. monogram「蔡 & 彭」（serif，28px）
  2. 日期「2027.03.27　台中 蘭克斯特 Lancaster House」（`--fs-small`）
  3. 分隔飾線（金線在深底上更顯質感）
  4. **LINE bot 預留區**（見下）
  5. 版權小字「© 2027 蔡梵志 & 彭湘晴」（`--fs-small`）
  6. 回頂端按鈕（`.btn--ghost` 深底版：邊框與文字改用淺色）

**LINE bot 預留位（定義）**：
- 一個置中卡片 `.linebot-slot`：`--color-primary-soft` 底、`--radius-md`、內距 `--space-lg`。
- 內容：LINE 線描 icon（inline SVG，勿用外部圖）＋ 標題「LINE 智慧小幫手」＋ 說明「即將上線，屆時可用 LINE 詢問婚禮資訊」＋ **disabled 狀態按鈕**（`opacity:.6; pointer-events:none`，文字「敬請期待」）。
- 未來啟用：把 disabled 按鈕換成 LINE 綠 `#06C755` 的加好友按鈕（此為唯一允許出現的 LINE 品牌色，僅限該按鈕），連到官方帳號連結。保留同一 `.linebot-slot` 版位。

**手機版**：全部置中單欄堆疊。
**桌機版**：monogram/日期置中一組，LINE 預留卡 `max-width: 480px` 置中，版權與回頂端可放同一列兩端對齊。

---

## 9. 表單元件完整樣式規格（focus / error / loading / success）

### 9.1 基礎輸入框（text / email / tel / number / textarea / select）

```css
.field { display: flex; flex-direction: column; gap: var(--space-2xs); margin-bottom: var(--space-lg); }
.field__label { font: 500 var(--fs-small)/1.4 var(--font-sans); color: var(--color-ink); letter-spacing: .02em; }
.field__label .req { color: var(--color-primary); margin-left: 4px; }   /* 必填星號 */

.input {
  width: 100%; min-height: 48px; padding: 12px 16px;
  font: 400 16px/1.5 var(--font-sans); color: var(--color-ink);       /* 16px 防 iOS 縮放 */
  background: var(--color-white); border: 1px solid var(--color-line);
  border-radius: var(--radius-sm); transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease; }
.input::placeholder { color: var(--color-ink-soft); opacity: .7; }
textarea.input { min-height: 120px; resize: vertical; line-height: 1.7; }

/* 自訂 select 下拉箭頭（inline SVG data-URI，無外部圖） */
select.input { appearance: none; padding-right: 44px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4' fill='none' stroke='%236E6459' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 16px center; }
```

### 9.2 狀態一：Focus（聚焦）

```css
.input:focus, .input:focus-visible {
  outline: none; border-color: var(--color-primary); box-shadow: var(--focus-ring); }
```
- 邊框轉主色 + 3px 主色 22% 光暈環。適用鍵盤與滑鼠聚焦，確保可見焦點（無障礙必要）。

### 9.3 自訂 Radio / Checkbox（可點選卡片）

隱藏原生控件，改用自訂圓/方塊；整張卡片可點，選中時主色高亮。

```css
.choice { display: flex; align-items: center; gap: var(--space-sm);
  min-height: 48px; padding: 12px 16px; cursor: pointer;
  border: 1.5px solid var(--color-line); border-radius: var(--radius-md);
  background: var(--color-white); transition: border-color .2s, background-color .2s, box-shadow .2s; }
.choice input { position: absolute; opacity: 0; width: 0; height: 0; }
.choice__box { flex: none; width: 20px; height: 20px; border: 1.5px solid var(--color-line);
  display: grid; place-items: center; transition: all .2s; }
.choice[data-type="radio"] .choice__box { border-radius: 50%; }
.choice[data-type="check"] .choice__box { border-radius: 5px; }

/* 選中：卡片與控件同步高亮 */
.choice:has(input:checked) { border-color: var(--color-primary); background: var(--color-primary-soft); }
.choice:has(input:checked) .choice__box { border-color: var(--color-primary); background: var(--color-primary); }
.choice__box::after { content:""; opacity: 0; transition: opacity .15s; }
.choice[data-type="radio"] input:checked ~ .choice__box::after { opacity:1; width:8px; height:8px; border-radius:50%; background: var(--color-white); }
.choice[data-type="check"] input:checked ~ .choice__box::after { opacity:1; width:11px; height:11px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 12 12'%3E%3Cpath d='M2 6l3 3 5-6' fill='none' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat; }

/* 鍵盤聚焦環 */
.choice:has(input:focus-visible) { box-shadow: var(--focus-ring); }
```
> 備援：若需支援不支援 `:has()` 的舊瀏覽器，實作可改用 JS 於 change 時 toggle `.is-checked` class 達成相同視覺。

### 9.4 狀態二：Error（驗證錯誤）

在該 `.field` 上加 `.field--error`。

```css
.field--error .input,
.field--error .choice { border-color: var(--color-error); }
.field--error .input { background: var(--color-error-bg); }
.field__error { display: none; align-items: center; gap: 6px;
  font: 400 var(--fs-small)/1.4 var(--font-sans); color: var(--color-error); margin-top: 2px; }
.field--error .field__error { display: flex; }
```
```html
<p class="field__error">
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.5v4.5M8 11.2h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
  請填寫您的姓名
</p>
```
- 無障礙：錯誤輸入加 `aria-invalid="true"` 並用 `aria-describedby` 指向 `.field__error` 的 `id`。錯誤訊息置於欄位下方，紅字 + 圓驚嘆號 icon（inline SVG）。不可只靠顏色，故一律附文字與 icon。

### 9.5 狀態三：Loading（送出中）

送出時按鈕進入 loading，禁止重複點擊。

```css
.btn[data-loading="true"] { pointer-events: none; opacity: .85; cursor: progress; }
.btn[data-loading="true"] .btn__label { visibility: hidden; }
.btn[data-loading="true"]::after {
  content: ""; position: absolute; width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.45); border-top-color: #fff; animation: btn-spin .7s linear infinite; }
@keyframes btn-spin { to { transform: rotate(360deg); } }
```
- 按鈕加 `position: relative`。文字改為「傳送中…」或以旋轉圈取代（`.btn__label` 隱藏、`::after` spinner 顯示）。
- `prefers-reduced-motion` 時 spinner 停轉、改顯示「傳送中…」文字即可（見 7.4 已全域降速）。

### 9.6 狀態四：Success（送出成功）

成功後以成功卡取代整個表單（或於表單上方插入成功橫幅）。

```css
.form-success { display: none; text-align: center; padding: var(--space-xl);
  background: var(--color-success-bg); border: 1px solid var(--color-success);
  border-radius: var(--radius-lg); color: var(--color-ink); }
.form-success.is-shown { display: block; }
.form-success__icon { width: 56px; height: 56px; margin: 0 auto var(--space-md);
  border-radius: 50%; background: var(--color-success); display: grid; place-items: center; }
.form-success__title { font: 600 var(--fs-h2)/1.3 var(--font-serif); color: var(--color-success); margin-bottom: var(--space-2xs); }
.form-success__text { font: 400 var(--fs-body) var(--font-sans); color: var(--color-ink-soft); }
```
```html
<div class="form-success" role="status" aria-live="polite">
  <div class="form-success__icon">
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </div>
  <p class="form-success__title">已收到您的回覆</p>
  <p class="form-success__text">謝謝您撥空回覆，我們期待與您相見 ♡</p>
</div>
```
- 綠勾 icon（白勾 + 成功綠圓底）＋ 標題「已收到您的回覆」＋ 說明文。容器加 `role="status" aria-live="polite"` 讓螢幕閱讀器朗讀。
- 欄位級成功（可選）：驗證通過的欄位邊框轉 `--color-success`，右側加淡綠小勾。

---

## 10. 無障礙與品質基準

- 所有互動元素觸控目標 ≥ 44×44px（本規格輸入框/按鈕/選項皆 ≥48px）。
- 焦點永遠可見：全站 `:focus-visible` 一律套 `--focus-ring`，勿全域 `outline:none` 而不補。
- 表單每個欄位有 `<label for>`；錯誤用 `aria-invalid` + `aria-describedby`；狀態訊息用 `aria-live`。
- 顏色不單獨承載資訊（錯誤/成功皆附 icon + 文字）。
- 圖片一律給中文 `alt`；裝飾 SVG 一律 `aria-hidden="true"`。
- 語意化標籤：`header / main / section / footer`，每區一個 `<h2>`，Hero 用 `<h1>`。
- `<html lang="zh-Hant">`。
- Google Fonts 用 `display=swap` 避免 FOIT；關鍵字型可考慮 `preload`。

## 11. 分享預覽（Open Graph，重要）

親友多從 LINE 點開，分享卡片就是第一印象，務必設定：
```html
<meta property="og:title" content="蔡梵志 & 彭湘晴 の婚禮邀請｜2027.03.27 台中">
<meta property="og:description" content="誠摯邀請您參加我們的婚禮，台中 蘭克斯特 Lancaster House，敬請回覆出席。">
<meta property="og:image" content="assets/og-cover.jpg"><!-- 1200×630，套本規格色系與襯線姓名；⟨待製作⟩ -->
<meta property="og:type" content="website">
<meta name="theme-color" content="#FAF7FB">
```
- `og:image` 未備妥前，可先用純 CSS Hero 截圖或象牙底 + 襯線姓名 + 金線的 1200×630 佔位圖。

## 12. 建議檔案結構與落地清單

```
wedding_invite_website/
├─ index.html              # 單頁，含全部 7 區塊 + OG meta + Google Fonts link
├─ css/
│  ├─ tokens.css           # 第 2、3、4 節所有 CSS 變數（:root）
│  └─ style.css            # 佈局、元件、各區塊、動效、表單狀態
├─ js/
│  └─ main.js              # IntersectionObserver 進場、倒數、表單狀態切換、reduced-motion 守門
└─ assets/
   ├─ gallery/             # 之後放婚紗照
   └─ og-cover.jpg         # 分享預覽圖（待製作）
```

### 落地檢查（實作 agent 完成後逐條自查）
1. `:root` 已載入第 2 節全部顏色變數；正文採用 `--color-ink` on `--color-bg`（11.5:1）。
2. Google Fonts link 已放入 `<head>`，三套字型可正常顯示。
3. 7 個區塊皆存在且順序正確，背景依 4.3 交錯。
4. 手機（375px）與桌機（1440px）皆無水平捲動、無破版；Hero 首屏在兩尺寸都置中漂亮。
5. 表單四狀態（focus / error / loading / success）樣式皆可觸發並符合第 9 節。
6. 所有裝飾為 inline SVG / CSS，無任何外部圖片相依。
7. `prefers-reduced-motion: reduce` 時動畫關閉、`.reveal` 直接可見。
8. `⟨placeholder⟩` 版位（照片、地圖、表單欄位、LINE bot、OG 圖）皆已保留且樣式到位。
