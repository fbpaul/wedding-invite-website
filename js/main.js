/* ============================================================
   蔡梵志 & 彭湘晴 婚禮邀請網站 — 前端邏輯
   ============================================================ */

// ------------------------------------------------------------
// Google Apps Script Web App 網址設定
// 部署完成後，把網址貼到下面雙引號中間（保留單引號，不要有多餘空白）。
// 範例：const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx.../exec';
// 尚未設定（空字串）時，表單送出會顯示友善提示，不會噴錯或壞掉。
// 詳細部署步驟請見 docs/SETUP.md。
// ------------------------------------------------------------
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbycfZCNFJV1gv1jiWWE4bePpEsCiNLCSRrSxocK0h2zAermxoXO8jF6sxdZvj9XfBRH/exec';

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 欄位錯誤狀態輔助函式（function 宣告會被提升，initConditionalFields 與
  // initRsvpForm 皆可安全呼叫，不受初始化順序影響）
  function showFieldError(fieldId, message) {
    var wrap = document.getElementById('field-' + fieldId);
    var errorEl = document.getElementById(fieldId + '-error');
    var input = document.getElementById(fieldId);
    if (wrap) wrap.classList.add('field--error');
    if (errorEl && message) errorEl.textContent = message;
    if (input) input.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(fieldId) {
    var wrap = document.getElementById('field-' + fieldId);
    var input = document.getElementById(fieldId);
    if (wrap) wrap.classList.remove('field--error');
    if (input) input.removeAttribute('aria-invalid');
  }

  function showRadioError(groupName) {
    var idPrefix = groupName.split('_')[0];
    var wrap = document.getElementById('field-' + idPrefix);
    if (wrap) wrap.classList.add('field--error');
  }

  function clearRadioError(groupName) {
    var idPrefix = groupName.split('_')[0];
    var wrap = document.getElementById('field-' + idPrefix);
    if (wrap) wrap.classList.remove('field--error');
  }

  document.addEventListener('DOMContentLoaded', function () {
    initRevealAnimations();
    initNavScroll();
    initFloatingCta();
    initSmoothAnchors();
    initCountdown();
    initConditionalFields();
    initChoiceFallback();
    initCopyAddress();
    initRsvpForm();
  });

  // ------------------------------------------------------------
  // 進場動效（IntersectionObserver）— 尊重 prefers-reduced-motion
  // ------------------------------------------------------------
  function initRevealAnimations() {
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  // ------------------------------------------------------------
  // 導覽列：捲動超過首屏後加上背景
  // ------------------------------------------------------------
  function initNavScroll() {
    var nav = document.getElementById('siteNav');
    var hero = document.getElementById('hero');
    if (!nav || !hero) return;

    var toggle = function () {
      var heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom <= 56) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  // ------------------------------------------------------------
  // 懸浮 CTA：滑過 Hero 後浮現；捲到 RSVP 表單本身時隱藏（避免擋住表單）
  // ------------------------------------------------------------
  function initFloatingCta() {
    var cta = document.getElementById('floatingCta');
    var hero = document.getElementById('hero');
    var rsvp = document.getElementById('rsvp');
    if (!cta || !hero || !rsvp) return;

    var pastHero = false;
    var rsvpVisible = false;

    function update() {
      cta.classList.toggle('is-visible', pastHero && !rsvpVisible);
    }

    var checkHero = function () {
      pastHero = hero.getBoundingClientRect().bottom <= 56;
      update();
    };
    checkHero();
    window.addEventListener('scroll', checkHero, { passive: true });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { rsvpVisible = entry.isIntersecting; });
        update();
      }, { threshold: 0.15 });
      io.observe(rsvp);
    }
  }

  // ------------------------------------------------------------
  // 錨點平滑捲動（reduced-motion 時瀏覽器 CSS 已處理，這裡只補 focus 管理）
  // ------------------------------------------------------------
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        // 讓螢幕閱讀器/鍵盤使用者的焦點跟著移動到目標區塊
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  // ------------------------------------------------------------
  // 倒數計時（目標：2027-03-27T10:00:00+08:00，儀式入場時間）
  // ------------------------------------------------------------
  function initCountdown() {
    var el = document.getElementById('countdown');
    var marriedMsg = document.getElementById('married-msg');
    if (!el) return;

    var target = new Date('2027-03-27T10:00:00+08:00').getTime();

    var dEl = document.getElementById('cd-days');
    var hEl = document.getElementById('cd-hours');
    var mEl = document.getElementById('cd-minutes');
    var sEl = document.getElementById('cd-seconds');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var now = Date.now();
      var diff = target - now;

      if (diff <= 0) {
        el.classList.remove('is-active');
        if (marriedMsg) marriedMsg.classList.add('is-active');
        clearInterval(timer);
        return;
      }

      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);

      if (dEl) dEl.textContent = pad(days);
      if (hEl) hEl.textContent = pad(hours);
      if (mEl) mEl.textContent = pad(minutes);
      if (sEl) sEl.textContent = pad(seconds);
    }

    // 降級：JS 可執行時才開啟倒數區塊（見 design-spec 8.1.1）
    el.classList.add('is-active');
    tick();
    var timer = setInterval(tick, 1000);
  }

  // ------------------------------------------------------------
  // 條件顯示邏輯：
  //   Q6-Q11   只在 Q5 選「一定出席，我會準時到！」時顯示
  //   Q10      巢狀條件：另外要求 Q6（大人人數）目前是大於 1 的合法數字
  //   Q13      只在 Q12 選「想收到紙本喜帖，請寄給我」時顯示
  // ------------------------------------------------------------
  function initConditionalFields() {
    var q5Radios = document.querySelectorAll('input[name="q5_banquet"]');
    var q5Detail = document.getElementById('q5-detail');
    var q6 = document.getElementById('q6');
    var q7 = document.getElementById('q7');
    var q9Radios = document.querySelectorAll('input[name="q9_diet_self"]');
    var q10Radios = document.querySelectorAll('input[name="q10_diet_guest"]');
    var q10Detail = document.getElementById('q10-detail');

    function isAttendingBanquet() {
      var checked = document.querySelector('input[name="q5_banquet"]:checked');
      return !!(checked && checked.value === '一定出席，我會準時到！');
    }

    // Q10（同行者用餐習慣）：Q5 出席 且 Q6 大人人數 > 1 才顯示／必填
    function updateQ10Detail() {
      if (!q10Detail) return;
      var attending = isAttendingBanquet();
      var raw = q6 ? q6.value.trim() : '';
      var num = Number(raw);
      var showQ10 = attending && raw !== '' && !isNaN(num) && Number.isInteger(num) && num > 1;
      q10Detail.hidden = !showQ10;
      q10Radios.forEach(function (r) { r.required = !!showQ10; });
      if (!showQ10) clearRadioError('q10_diet_guest');
    }

    function updateQ5Detail() {
      var attending = isAttendingBanquet();
      if (!q5Detail) return;
      q5Detail.hidden = !attending;
      if (q6) q6.required = !!attending;
      if (q7) q7.required = !!attending;
      q9Radios.forEach(function (r) { r.required = !!attending; });
      if (!attending) {
        clearFieldError('q6');
        clearFieldError('q7');
        clearRadioError('q9_diet_self');
      }
      // Q5 出席狀態變動時，Q10 的顯示條件也要一併重新檢查
      updateQ10Detail();
    }

    q5Radios.forEach(function (r) { r.addEventListener('change', updateQ5Detail); });
    if (q6) q6.addEventListener('input', updateQ10Detail);
    updateQ5Detail();

    var q12Radios = document.querySelectorAll('input[name="q12_invitation"]');
    var q12Detail = document.getElementById('q12-detail');
    var q13 = document.getElementById('q13');

    function updateQ12Detail() {
      var checked = document.querySelector('input[name="q12_invitation"]:checked');
      var needsAddress = checked && checked.value === '想收到紙本喜帖，請寄給我';
      if (!q12Detail) return;
      q12Detail.hidden = !needsAddress;
      if (q13) q13.required = !!needsAddress;
      if (!needsAddress) clearFieldError('q13');
    }

    q12Radios.forEach(function (r) { r.addEventListener('change', updateQ12Detail); });
    updateQ12Detail();
  }

  // ------------------------------------------------------------
  // :has() 備援：不支援的瀏覽器改用 JS toggle .is-checked
  // ------------------------------------------------------------
  function initChoiceFallback() {
    var supportsHas = false;
    try { supportsHas = CSS.supports('selector(:has(*))'); } catch (e) { supportsHas = false; }
    if (supportsHas) return;

    document.querySelectorAll('.choice input[type="radio"], .choice input[type="checkbox"]').forEach(function (input) {
      input.addEventListener('change', function () {
        var name = input.name;
        document.querySelectorAll('input[name="' + name + '"]').forEach(function (sibling) {
          var choice = sibling.closest('.choice');
          if (choice) choice.classList.toggle('is-checked', sibling.checked);
        });
      });
    });
  }

  // ------------------------------------------------------------
  // 複製地址按鈕
  // ------------------------------------------------------------
  function initCopyAddress() {
    var btn = document.getElementById('copyAddressBtn');
    if (!btn) return;
    var original = btn.textContent;
    btn.addEventListener('click', function () {
      var address = btn.getAttribute('data-address') || '';
      var done = function () {
        btn.textContent = '已複製地址 ✓';
        setTimeout(function () { btn.textContent = original; }, 2000);
      };
      var fail = function () {
        window.prompt('請手動複製地址：', address);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(done).catch(fail);
      } else {
        fail();
      }
    });
  }

  // ------------------------------------------------------------
  // RSVP 表單：驗證、送出（避免 preflight 的 text/plain 作法）、四狀態切換
  // ------------------------------------------------------------
  function initRsvpForm() {
    var form = document.getElementById('rsvpForm');
    if (!form) return;

    var submitBtn = document.getElementById('submitBtn');
    var successBox = document.getElementById('formSuccess');
    var endpointNotice = document.getElementById('endpointNotice');
    var submitErrorNotice = document.getElementById('submitErrorNotice');

    if (!FORM_ENDPOINT) {
      if (endpointNotice) endpointNotice.classList.add('is-shown');
    }

    // 必填欄位（依 field id 對應：text/number → input id；radio 群組 → name）
    // 註：q14（手機號碼）另有獨立格式驗證區塊，不放進這個陣列
    var requiredTextFields = ['q1'];
    var requiredNumberFields = ['q6', 'q7']; // 是否必填由 initConditionalFields 動態切換 .required
    var requiredRadioGroups = ['q2_relation', 'q3_connection', 'q4_ceremony', 'q5_banquet', 'q9_diet_self', 'q10_diet_guest', 'q12_invitation', 'q16_parking'];

    function validate() {
      var firstInvalid = null;
      var isValid = true;

      // 一般必填文字欄位
      requiredTextFields.forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;
        clearFieldError(id);
        if (!input.value.trim()) {
          showFieldError(id);
          isValid = false;
          firstInvalid = firstInvalid || input;
        }
      });

      // Q13（條件必填 + 寬鬆長度檢查，地址寫法差異大，不套嚴格 regex）
      var q13 = document.getElementById('q13');
      if (q13 && q13.required) {
        clearFieldError('q13');
        var q13Value = q13.value.trim();
        if (!q13Value) {
          showFieldError('q13');
          isValid = false;
          firstInvalid = firstInvalid || q13;
        } else if (q13Value.length < 6) {
          showFieldError('q13', '地址似乎不完整，請確認街道與門牌號都已填寫');
          isValid = false;
          firstInvalid = firstInvalid || q13;
        }
      }

      // Q14 手機號碼（必填 + 台灣手機格式檢查，去除空白/連字號後比對）
      var q14 = document.getElementById('q14');
      if (q14) {
        clearFieldError('q14');
        var q14Value = q14.value.trim();
        if (!q14Value) {
          showFieldError('q14');
          isValid = false;
          firstInvalid = firstInvalid || q14;
        } else if (!/^09\d{8}$/.test(q14Value.replace(/[\s-]/g, ''))) {
          showFieldError('q14', '手機號碼格式不正確，請確認（例如 0912345678）');
          isValid = false;
          firstInvalid = firstInvalid || q14;
        }
      }

      // Q15 Email 或 LINE ID（必填；只有含 @ 才視為 Email 並檢查格式，避免誤擋 LINE ID）
      var q15 = document.getElementById('q15');
      if (q15) {
        clearFieldError('q15');
        var q15Value = q15.value.trim();
        if (!q15Value) {
          showFieldError('q15');
          isValid = false;
          firstInvalid = firstInvalid || q15;
        } else if (q15Value.indexOf('@') !== -1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q15Value)) {
          showFieldError('q15', 'Email 格式看起來不完整，請確認（若要留 LINE ID 可直接輸入 ID，不需要 @ 符號）');
          isValid = false;
          firstInvalid = firstInvalid || q15;
        }
      }

      // 數字欄位（Q6/Q7，條件必填 + 需為 >=0 整數）
      requiredNumberFields.forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;
        clearFieldError(id);
        if (!input.required) return;
        var raw = input.value.trim();
        var num = Number(raw);
        if (raw === '' || isNaN(num) || num < 0 || !Number.isInteger(num)) {
          showFieldError(id);
          isValid = false;
          firstInvalid = firstInvalid || input;
        }
      });

      // 單選必填群組（Q9/Q10 是條件必填，DOM 上 .required 為 false 時代表目前不適用，跳過）
      requiredRadioGroups.forEach(function (name) {
        var radios = document.querySelectorAll('input[name="' + name + '"]');
        if (!radios.length || !radios[0].required) return;
        clearRadioError(name);
        var checked = document.querySelector('input[name="' + name + '"]:checked');
        if (!checked) {
          showRadioError(name);
          isValid = false;
          if (!firstInvalid) {
            firstInvalid = document.querySelector('input[name="' + name + '"]');
          }
        }
      });

      return { isValid: isValid, firstInvalid: firstInvalid };
    }

    // 使用者輸入後即時清除錯誤狀態（漸進增強）
    form.addEventListener('input', function (e) {
      var target = e.target;
      if (target.id) clearFieldError(target.id);
    });
    form.addEventListener('change', function (e) {
      var target = e.target;
      if (target.name && target.type === 'radio') clearRadioError(target.name);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (submitErrorNotice) submitErrorNotice.classList.remove('is-shown');

      var result = validate();
      if (!result.isValid) {
        if (result.firstInvalid) {
          result.firstInvalid.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
          try { result.firstInvalid.focus(); } catch (err) { /* noop */ }
        }
        return;
      }

      if (!FORM_ENDPOINT) {
        if (endpointNotice) {
          endpointNotice.classList.add('is-shown');
          endpointNotice.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
        return;
      }

      var payload = buildPayload(form);

      submitBtn.setAttribute('data-loading', 'true');
      submitBtn.disabled = true;

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        // 用 text/plain 避免瀏覽器對跨網域 POST 送出 CORS preflight（OPTIONS）
        // Apps Script 端用 JSON.parse(e.postData.contents) 還原成物件
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          submitBtn.removeAttribute('data-loading');
          submitBtn.disabled = false;
          if (data && data.result === 'success') {
            form.hidden = true;
            if (successBox) {
              successBox.classList.add('is-shown');
              successBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
            }
          } else {
            showSubmitError();
          }
        })
        .catch(function () {
          submitBtn.removeAttribute('data-loading');
          submitBtn.disabled = false;
          showSubmitError();
        });
    });

    function showSubmitError() {
      if (submitErrorNotice) {
        submitErrorNotice.textContent = '送出失敗，請確認網路連線後再試一次，或直接與新人聯繫。';
        submitErrorNotice.classList.add('is-shown');
        submitErrorNotice.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
    }

    function buildPayload(formEl) {
      var fd = new FormData(formEl);
      var obj = {};
      fd.forEach(function (value, key) { obj[key] = value; });
      // Q14 手機號碼正規化：去除空白與連字號，只影響送出值，不改動輸入框顯示內容
      if (obj.q14_phone) {
        obj.q14_phone = String(obj.q14_phone).replace(/[\s-]/g, '');
      }
      obj.submittedAt = new Date().toISOString();
      return obj;
    }
  }
})();
