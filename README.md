# 蔡梵志 & 彭湘晴 婚禮邀請網站

單頁式婚禮邀請靜態網站，含頁內 RSVP 表單。無框架、無 build step、無 npm 依賴，純 HTML／CSS／vanilla JS，外部資源只用 Google Fonts 與 Google Maps。視覺設計依據 `docs/design-spec.md`。

## 目錄結構

```
index.html              # 單頁網站，含 7 個區塊 + OG 分享預覽 meta
css/style.css           # 全站設計變數（:root）與所有樣式
js/main.js              # 進場動效、倒數計時、表單驗證與送出邏輯
assets/photos/          # 婚紗照放這裡（目前是 placeholder 佔位）
apps-script/            # Google Apps Script 後端（RSVP 表單 → Google 試算表）
  ├─ form-backend.gs       # 網站表單的後端（doPost）
  ├─ create-google-form.gs # 一鍵生成備用 Google 表單
  └─ SETUP.md              # 給非工程師看的逐步部署教學
docs/design-spec.md     # 視覺設計規格書（唯一設計依據，不要修改）
婚禮資訊.md               # 婚禮事實資料（不要修改）
表單問題.md               # RSVP 15 題設計文件（不要修改）
```

## 本機預覽

不需要安裝任何東西，用 Python 內建的簡易伺服器即可：

```bash
cd wedding_invite_website
python3 -m http.server 8765
```

然後瀏覽器打開 `http://localhost:8765`。

（直接用瀏覽器打開 `index.html` 檔案通常也能看，但 RSVP 表單送出功能需要透過 `http://` 而非 `file://` 才會正常運作，建議一律用上面的本機伺服器方式預覽。）

## 如何換上婚紗照

目前「我們的故事」區塊（Gallery）用的是線描 icon + 「照片準備中」的優雅 placeholder。要換成真實照片：

1. 把照片放進 `assets/photos/`（例如 `01.jpg`、`02.jpg`…）。
2. 打開 `index.html`，找到 `<!-- 換圖方式 -->` 註解附近的 Gallery 區塊（`id="gallery"`）。
3. 把要換的那個 `<figure class="gallery-item">` 裡的 `.ph` 那一整塊，換成註解裡示範的 `<img>` 標籤，例如：
   ```html
   <figure class="gallery-item reveal">
     <img src="assets/photos/01.jpg" alt="蔡梵志與彭湘晴婚紗照" loading="lazy"
          style="aspect-ratio:4/5; width:100%; height:100%; object-fit:cover; border-radius:var(--radius-lg);">
   </figure>
   ```
4. 保留原本的 `class="gallery-item"` 容器與 `aspect-ratio`，版面不會跳動；`alt` 請填有意義的中文描述。
5. 分享預覽圖（LINE 打開網站時看到的封面圖）目前是待製作狀態，`index.html` 的 `<meta property="og:image">` 指向 `assets/og-cover.jpg`——之後做好 1200×630 的圖，存成這個檔名放進 `assets/` 即可自動生效。

## 如何設定表單後端（RSVP → Google 試算表）

RSVP 表單預設是「未設定狀態」（`js/main.js` 最上方 `FORM_ENDPOINT` 是空字串），此時賓客按送出會看到友善提示，不會壞掉，但也不會真的把資料存起來。

完整設定步驟（建立試算表、部署 Web App、把網址填回網站、順便生成備用 Google 表單）都寫在 **[`apps-script/SETUP.md`](apps-script/SETUP.md)**，是特別寫給不熟工程的人看的逐步教學，照著做即可。

## 之後要部署上線怎麼辦

這是純靜態網站，把整個資料夾丟到任何靜態網站託管服務都能跑，常見免費選項：

- **GitHub Pages**：把專案推上 GitHub repo，到 repo 的 Settings → Pages 選要發布的分支即可，適合已經在用 GitHub 的人。
- **Netlify**：到 [netlify.com](https://netlify.com) 把資料夾拖拉上傳（或連結 GitHub repo），幾秒鐘就有網址，介面對非工程師最友善。
- **Cloudflare Pages**：到 [pages.cloudflare.com](https://pages.cloudflare.com) 連結 GitHub repo 或直接上傳，速度快、也有免費方案。

三選一即可，設定都只需要幾分鐘、不需要額外的 build 指令（因為本專案本來就沒有 build step）。部署後記得確認 `js/main.js` 裡的 `FORM_ENDPOINT` 已經正確填好，RSVP 表單才能正常運作。
