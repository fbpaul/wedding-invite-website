/**
 * 蔡梵志 & 彭湘晴 婚禮 RSVP — Google 表單自動生成腳本（備用管道）
 * ------------------------------------------------------------
 * 用途：一鍵建立一份與網站 RSVP 表單相同 15 題的 Google 表單，
 * 作為網站表單以外的備用回覆管道（例如網站故障、或有賓客不方便用網頁時）。
 *
 * 使用方式：見 docs/SETUP.md。簡單說是「開新的 Apps Script 專案、
 * 貼上這個檔案的內容、執行 createWeddingRSVPForm 這個函式」。
 *
 * 重要差異（Google 表單原生限制，簡化處理，見 SETUP.md 詳細說明）：
 * 1. 網站版有「條件顯示」：Q5/Q6/Q7 只在 Q4 選「一定出席」時出現、
 *    Q11 只在 Q10 選「紙本喜帖」時出現。Google 表單雖然可用『跳到指定頁面』
 *    做分支，但頁面分支的顆粒度較粗、且會讓表單被拆成很多頁、體驗變差，
 *    對一份 15 題的表單來說得不償失。因此這裡簡化成「單頁、全部題目都顯示」，
 *    改用題目說明文字提醒賓客「若不適用可跳過」。
 * 2. Q5/Q6（人數）在網站版是條件必填，這裡一律設為非必填，並在說明文字
 *    註明「不出席婚宴者請留空」。
 */

function createWeddingRSVPForm() {
  var form = FormApp.create('蔡梵志 & 彭湘晴 婚禮 RSVP 回函（備用表單）');
  form.setDescription(
    '誠摯邀請您參加我們的婚禮 🤍\n' +
    '2027/3/27（六）午宴，台中 蘭克斯特 Lancaster House（臺中市北屯區崇德路二段347號）。\n' +
    '儀式 10:00 入場、10:30 準時開始；婚宴 11:30 入場、12:10 準時開席。\n' +
    '請於 2027/2/28 前回覆，讓我們為您預留座位，謝謝！\n\n' +
    '※ 若您已在婚禮邀請網站上填過 RSVP，請不用重複填寫本表單。'
  );
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(true);
  form.setConfirmationMessage('已收到您的回覆，謝謝您撥空回覆，我們期待與您相見 ♡');

  // Q1
  form.addTextItem()
    .setTitle('Q1｜可以留下您的大名嗎？')
    .setHelpText('會用來核對賓客名單與喜帖')
    .setRequired(true);

  // Q2
  form.addMultipleChoiceItem()
    .setTitle('Q2｜請問您是新郎／新娘哪一邊的親友呢？')
    .setChoiceValues(['男方（新郎）親友', '女方（新娘）親友', '雙方共同朋友', '其他'])
    .setRequired(true);

  // Q3
  form.addMultipleChoiceItem()
    .setTitle('Q3｜是否會參加 10:30 開始的證婚儀式？')
    .setChoiceValues(['會參加，準時到場見證', '不參加儀式'])
    .setRequired(true);

  // Q4
  form.addMultipleChoiceItem()
    .setTitle('Q4｜是否會參加 12:10 開席的婚宴？')
    .setChoiceValues(['一定出席，麻煩算我一份！', '禮到人不到，仍請保留祝福', '無法出席，獻上誠摯祝福'])
    .setRequired(true);

  // Q5（簡化：非必填 + 數字驗證，說明文字取代條件顯示）
  var q5Validation = FormApp.createTextValidation()
    .setHelpText('請輸入 0 以上的整數')
    .requireNumberGreaterThanOrEqualTo(0)
    .build();
  form.addTextItem()
    .setTitle('Q5｜出席婚宴的大人人數（不含兒童）')
    .setHelpText('僅 Q4 選擇出席婚宴者需填寫；若不出席婚宴可留空')
    .setValidation(q5Validation)
    .setRequired(false);

  // Q6
  var q6Validation = FormApp.createTextValidation()
    .setHelpText('請輸入 0 以上的整數，無則填 0')
    .requireNumberGreaterThanOrEqualTo(0)
    .build();
  form.addTextItem()
    .setTitle('Q6｜出席婚宴的兒童人數（12 歲以下）')
    .setHelpText('僅 Q4 選擇出席婚宴者需填寫，無則填 0；若不出席婚宴可留空')
    .setValidation(q6Validation)
    .setRequired(false);

  // Q7
  form.addMultipleChoiceItem()
    .setTitle('Q7｜是否需要兒童座椅或兒童餐？')
    .setChoiceValues(['不需要', '需要兒童座椅', '需要兒童餐', '兒童座椅與兒童餐都需要'])
    .setRequired(false);

  // Q8
  form.addMultipleChoiceItem()
    .setTitle('Q8｜用餐習慣（葷食／素食）')
    .setChoiceValues(['葷食皆可', '全素（不含蛋奶）', '蛋奶素', '其他（請於下題說明）'])
    .setRequired(true);

  // Q9
  form.addTextItem()
    .setTitle('Q9｜有特殊飲食禁忌或過敏食材嗎？')
    .setHelpText('例：不吃牛肉、對海鮮過敏。無則可留空')
    .setRequired(false);

  // Q10
  form.addMultipleChoiceItem()
    .setTitle('Q10｜喜帖需要寄送嗎？')
    .setChoiceValues(['想收到紙本喜帖，請寄給我', '請寄電子喜帖給我（環保愛地球）', '不需要，我都知道婚禮資訊了'])
    .setRequired(true);

  // Q11（簡化：非必填，說明文字取代條件顯示）
  form.addTextItem()
    .setTitle('Q11｜喜帖寄送地址')
    .setHelpText('僅 Q10 選擇「想收到紙本喜帖」者需填寫；若不需紙本喜帖可留空')
    .setRequired(false);

  // Q12
  form.addTextItem()
    .setTitle('Q12｜您的手機號碼')
    .setRequired(true);

  // Q13
  form.addTextItem()
    .setTitle('Q13｜Email 或 LINE ID（方便通知婚禮相關訊息）')
    .setRequired(false);

  // Q14
  form.addMultipleChoiceItem()
    .setTitle('Q14｜是否需要開車前來、有停車需求？')
    .setChoiceValues(['不開車', '開車前來，需要 1 個車位', '開車前來，需要 2 個以上車位（請於祝福留言註明車輛數）'])
    .setRequired(false);

  // Q15
  form.addParagraphTextItem()
    .setTitle('Q15｜想對我們說的話（祝福留言）')
    .setRequired(false);

  // 建立一份新的 Google 試算表來接收表單回覆，方便與網站表單分開檢視
  var ss = SpreadsheetApp.create('蔡梵志 & 彭湘晴 婚禮 RSVP 回覆（Google 表單版）');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log('表單已建立完成！');
  Logger.log('填寫用網址（分享給賓客）：' + form.getPublishedUrl());
  Logger.log('編輯用網址（新人自己用）：' + form.getEditUrl());
  Logger.log('回覆試算表網址：' + ss.getUrl());
}
