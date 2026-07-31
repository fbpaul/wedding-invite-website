/**
 * 蔡梵志 & 彭湘晴 婚禮 RSVP 表單後端
 * ------------------------------------------------------------
 * 用途：接收網站 RSVP 表單（js/main.js 送出的 JSON），驗證後寫入 Google 試算表。
 * 設定步驟：請見 docs/SETUP.md（給非工程師看的逐步教學）。
 *
 * 重要：前端用 `Content-Type: text/plain` 送出 JSON 字串是刻意設計，
 * 目的是避免瀏覽器對跨網域 POST 發出 CORS preflight（OPTIONS）——
 * Apps Script Web App 無法自訂處理 OPTIONS 請求，若前端送 application/json
 * 會觸發 preflight 而失敗。因此這裡固定用 e.postData.contents 取得原始字串
 * 再自行 JSON.parse，不要把 Content-Type 檢查加進來。
 */

// 試算表中存放回覆的分頁名稱（不存在時會自動建立）
var SHEET_NAME = 'RSVP回覆';

// 欄位順序與表頭：務必與 index.html 表單的 15 題一一對應
var HEADERS = [
  '時間戳記',
  'Q1 姓名',
  'Q2 賓客身分（新郎/新娘關係）',
  'Q3 是否參加證婚儀式',
  'Q4 是否參加婚宴',
  'Q5 出席婚宴大人人數',
  'Q6 出席婚宴兒童人數',
  'Q7 兒童座椅或兒童餐',
  'Q8 用餐習慣',
  'Q9 特殊飲食禁忌或過敏',
  'Q10 喜帖寄送方式',
  'Q11 喜帖寄送地址',
  'Q12 手機號碼',
  'Q13 Email 或 LINE ID',
  'Q14 停車需求',
  'Q15 祝福留言'
];

/**
 * Web App 的 POST 進入點。部署後把網址填到 js/main.js 的 FORM_ENDPOINT。
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({ result: 'error', message: '缺少表單資料' });
    }

    var data = JSON.parse(e.postData.contents);

    // Honeypot 檢查：一般使用者看不到 website 欄位，機器人常會自動填寫。
    // 有填寫視為機器人，靜默丟棄（不寫入試算表），但仍回傳成功，
    // 避免讓機器人知道自己被擋下而持續嘗試其他手法。
    if (data.website) {
      return jsonOutput({ result: 'success' });
    }

    // 基本必填檢查（與前端驗證重複一次，避免前端被繞過）
    if (!data.q1_name || !String(data.q1_name).trim()) {
      return jsonOutput({ result: 'error', message: '姓名為必填欄位' });
    }
    if (!data.q12_phone || !String(data.q12_phone).trim()) {
      return jsonOutput({ result: 'error', message: '手機號碼為必填欄位' });
    }

    var sheet = getOrCreateSheet();
    var row = [
      new Date(),
      data.q1_name || '',
      data.q2_relation || '',
      data.q3_ceremony || '',
      data.q4_banquet || '',
      data.q5_adults || '',
      data.q6_children || '',
      data.q7_childneeds || '',
      data.q8_diet || '',
      data.q9_allergy || '',
      data.q10_invitation || '',
      data.q11_address || '',
      data.q12_phone || '',
      data.q13_contact || '',
      data.q14_parking || '',
      data.q15_message || ''
    ];
    sheet.appendRow(row);

    return jsonOutput({ result: 'success' });
  } catch (err) {
    return jsonOutput({ result: 'error', message: String(err && err.message ? err.message : err) });
  }
}

/**
 * 讓 Web App 網址直接用瀏覽器打開時，回傳一句提示（方便快速確認部署是否成功）。
 */
function doGet(e) {
  return ContentService
    .createTextOutput('蔡梵志 & 彭湘晴 婚禮 RSVP 表單後端運作中。請用 POST 送出表單資料。')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 測試用函式：在 Apps Script 編輯器選這個函式並按「執行」，
 * 可在不透過網站的情況下確認能否正常寫入試算表。
 * 執行後到「執行紀錄」(View > Logs / Executions) 看結果，
 * 也可以到試算表確認多了一列測試資料。
 */
function test_doPost() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        q1_name: '測試姓名',
        q2_relation: '男方（新郎）親友',
        q3_ceremony: '會參加，準時到場見證',
        q4_banquet: '一定出席，麻煩算我一份！',
        q5_adults: '2',
        q6_children: '0',
        q7_childneeds: '不需要',
        q8_diet: '葷食皆可',
        q9_allergy: '',
        q10_invitation: '不需要，我都知道婚禮資訊了',
        q11_address: '',
        q12_phone: '0912345678',
        q13_contact: 'test@example.com',
        q14_parking: '不開車',
        q15_message: '祝福新人百年好合！',
        website: ''
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
