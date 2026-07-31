<div align="center">

# 蔡梵志 & 彭湘晴 婚禮邀請網站

**2027.03.27（六）午宴｜台中蘭克斯特 Lancaster House**

[🔗 網站在線上](https://fbpaul.github.io/wedding-invite-website/)

</div>

---

一封給親友的線上喜帖：婚禮資訊、時間流程、地點地圖，以及一份可直接在頁面上填寫的出席回覆（RSVP）表單，賓客送出後即時存進新人的 Google 試算表。

## 特色

- 🎨 **紙感邀請函風格** — 暖象牙白 × 陶土玫瑰配色，襯線標題，行動裝置優先設計
- 📝 **頁內 RSVP 表單** — 15 題出席調查，支援條件顯示（例如選擇出席才會展開人數與飲食欄位）
- 📊 **免後端維運** — 表單資料經 Google Apps Script 直接寫入 Google 試算表，不需要自架伺服器或資料庫
- 📱 **LINE 分享預覽** — 分享連結到 LINE／訊息時會顯示標題與封面圖
- ⚡ **零依賴** — 純 HTML／CSS／vanilla JavaScript，無框架、無 build step，開啟即改

## 專案結構

```
index.html          單頁網站（Hero、婚紗照、時間流程、地點、RSVP 表單、小叮嚀、頁尾）
css/style.css        全站設計變數與樣式
js/main.js           進場動效、倒數計時、表單驗證與送出邏輯
assets/photos/       婚紗照存放處
apps-script/          Google Apps Script 後端程式碼
  ├─ form-backend.gs        接收 RSVP 表單、寫入 Google 試算表
  └─ create-google-form.gs  一鍵生成備用 Google 表單
docs/                 設計文件與設定教學
  ├─ design-spec.md         視覺設計規格書
  ├─ SETUP.md               表單後端設定教學（給不熟工程的人看）
  ├─ 婚禮資訊.md              婚禮事實資料
  └─ 表單問題.md              RSVP 題目設計文件
```

## 本機預覽

不需要安裝任何東西，用 Python 內建的簡易伺服器即可：

```bash
python3 -m http.server 8765
```

瀏覽器打開 `http://localhost:8765`。

> 直接雙擊打開 `index.html` 通常也能看，但 RSVP 表單送出功能需要透過 `http://` 而非 `file://` 才會正常運作，建議一律用上面的本機伺服器方式預覽。

## 設定表單後端

RSVP 表單預設為「未設定」狀態，此時賓客送出會看到友善提示，不會壞掉，但資料也不會被存下來。完整設定步驟（建立試算表、部署 Web App、生成備用 Google 表單）見 **[`docs/SETUP.md`](docs/SETUP.md)**，是特別寫給不熟工程的人看的逐步教學。

## 部署

純靜態網站，可部署到任何靜態網站託管服務。本站目前部署於 [GitHub Pages](https://pages.github.com/)，`main` 分支推送後自動重新發布。其他常見免費選項：[Netlify](https://netlify.com)、[Cloudflare Pages](https://pages.cloudflare.com)。

---

<div align="center">
<sub>Built for 蔡梵志 & 彭湘晴's wedding · 設計規格見 <a href="docs/design-spec.md">docs/design-spec.md</a></sub>
</div>
