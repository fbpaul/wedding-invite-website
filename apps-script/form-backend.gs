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

// 欄位順序與表頭：務必與 index.html 表單的 17 題一一對應
var HEADERS = [
  '時間戳記',
  'Q1 姓名',
  'Q2 賓客身分（新郎/新娘關係）',
  'Q3 與新人關係',
  'Q4 是否參加證婚儀式',
  'Q5 是否參加婚宴',
  'Q6 出席婚宴大人人數',
  'Q7 出席婚宴兒童人數',
  'Q8 兒童座椅或兒童餐',
  'Q9 本人用餐習慣',
  'Q10 同行者用餐習慣',
  'Q11 特殊飲食禁忌或過敏',
  'Q12 喜帖寄送方式',
  'Q13 喜帖寄送地址',
  'Q14 手機號碼',
  'Q15 Email',
  'Q16 是否開車前來',
  'Q17 祝福留言',
  '花好月圓投票'
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
    if (!data.q14_phone || !String(data.q14_phone).trim()) {
      return jsonOutput({ result: 'error', message: '手機號碼為必填欄位' });
    }

    var sheet = getOrCreateSheet();
    var row = [
      new Date(),
      data.q1_name || '',
      data.q2_relation || '',
      data.q3_connection || '',
      data.q4_ceremony || '',
      data.q5_banquet || '',
      data.q6_adults || '',
      data.q7_children || '',
      data.q8_childneeds || '',
      data.q9_diet_self || '',
      data.q10_diet_guest || '',
      data.q11_allergy || '',
      data.q12_invitation || '',
      data.q13_address || '',
      data.q14_phone || '',
      data.q15_contact || '',
      data.q16_parking || '',
      data.q17_message || '',
      data.q_dessert_vote || ''
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
  // Q14 手機號碼是 0 開頭，試算表若當數字存會自動吃掉開頭的 0
  // （例如 0912345678 變成 912345678）。把整欄固定成純文字格式，
  // 之後寫入的值就不會被自動轉成數字。每次呼叫都執行一次，
  // 這樣舊試算表（欄位還沒被格式化過）也會在下一次送出時被修正。
  var phoneCol = HEADERS.indexOf('Q14 手機號碼') + 1;
  sheet.getRange(1, phoneCol, sheet.getMaxRows(), 1).setNumberFormat('@');
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
        q3_connection: '朋友',
        q4_ceremony: '會參加，準時到場見證',
        q5_banquet: '一定出席，我會準時到！',
        q6_adults: '2',
        q7_children: '0',
        q8_childneeds: '不需要',
        q9_diet_self: '葷食皆可',
        q10_diet_guest: '葷食皆可',
        q11_allergy: '',
        q12_invitation: '不需要，我都知道婚禮資訊了',
        q13_address: '',
        q14_phone: '0912345678',
        q15_contact: 'test@example.com',
        q16_parking: '不開車',
        q17_message: '祝福新人百年好合！',
        q_dessert_vote: '黃色＆紫色地瓜',
        website: ''
      })
    }
  };
  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
