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
  //   Q5/Q6/Q7 只在 Q4 選「一定出席，麻煩算我一份！」時顯示
  //   Q11      只在 Q10 選「想收到紙本喜帖，請寄給我」時顯示
  // ------------------------------------------------------------
  function initConditionalFields() {
    var q4Radios = document.querySelectorAll('input[name="q4_banquet"]');
    var q4Detail = document.getElementById('q4-detail');
    var q5 = document.getElementById('q5');
    var q6 = document.getElementById('q6');

    function updateQ4Detail() {
      var checked = document.querySelector('input[name="q4_banquet"]:checked');
      var attending = checked && checked.value === '一定出席，麻煩算我一份！';
      if (!q4Detail) return;
      q4Detail.hidden = !attending;
      if (q5) q5.required = !!attending;
      if (q6) q6.required = !!attending;
      if (!attending) {
        clearFieldError('q5');
        clearFieldError('q6');
      }
    }

    q4Radios.forEach(function (r) { r.addEventListener('change', updateQ4Detail); });
    updateQ4Detail();

    var q10Radios = document.querySelectorAll('input[name="q10_invitation"]');
    var q10Detail = document.getElementById('q10-detail');
    var q11 = document.getElementById('q11');

    function updateQ10Detail() {
      var checked = document.querySelector('input[name="q10_invitation"]:checked');
      var needsAddress = checked && checked.value === '想收到紙本喜帖，請寄給我';
      if (!q10Detail) return;
      q10Detail.hidden = !needsAddress;
      if (q11) q11.required = !!needsAddress;
      if (!needsAddress) clearFieldError('q11');
    }

    q10Radios.forEach(function (r) { r.addEventListener('change', updateQ10Detail); });
    updateQ10Detail();
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
    var requiredTextFields = ['q1', 'q12'];
    var requiredNumberFields = ['q5', 'q6']; // 是否必填由 initConditionalFields 動態切換 .required
    var requiredRadioGroups = ['q2_relation', 'q3_ceremony', 'q4_banquet', 'q8_diet', 'q10_invitation'];

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

      // Q11（條件必填）
      var q11 = document.getElementById('q11');
      if (q11 && q11.required) {
        clearFieldError('q11');
        if (!q11.value.trim()) {
          showFieldError('q11');
          isValid = false;
          firstInvalid = firstInvalid || q11;
        }
      }

      // 數字欄位（Q5/Q6，條件必填 + 需為 >=0 整數）
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

      // 單選必填群組
      requiredRadioGroups.forEach(function (name) {
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
      obj.submittedAt = new Date().toISOString();
      return obj;
    }
  }
})();
