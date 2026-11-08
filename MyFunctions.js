
// ---------------- home.html ----------------
let page = window.location.pathname.split("/").pop();
if (page === "home.html") {
  window.onload = function () {
    alert("Welcome to GOLDEN DRIVE🔥🏎");
  }
}


// ---------------- Cars.html ----------------

// التأكد أن التاريخ موجود فعلاً (مثلاً 2026-02-31 مرفوض)
function isRealDate(s) {
  let p = s.split("-");
  let y = parseInt(p[0], 10);
  let m = parseInt(p[1], 10);
  let d = parseInt(p[2], 10);
  let date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

// التحقق من الحقول: ترجع true إذا كل شيء صحيح
function validateForm() {
  let ok = true;
  $(".err").text("");

  // الاسم (يقبل الفراغ)
  let name = $("#username").val();
  if (name !== "" && !/^[\u0621-\u064A\s]+$/.test(name)) {
    $("#errusername").text("أحرف عربية فقط");
    ok = false;
  }

  // الرقم الوطني (إلزامي)
  let Nid = $("#Idnumb").val();
  let prov = parseInt(Nid.substring(0, 2), 10);
  if (Nid.length !== 11) {
    $("#errIdnumb").text("يجب أن يتكون الرقم الوطني من 11 خانة");
    ok = false;
  }
  else if (isNaN(Nid)) {
    $("#errIdnumb").text("يجب أن يحتوي الرقم الوطني على أرقام فقط");
    ok = false;
  }
  else if (prov < 1 || prov > 14) {
    $("#errIdnumb").text("أول خانتين يجب أن تكونا بين 01 و14");
    ok = false;
  }

  // التواريخ (إلزامية) بصيغة yyyy-mm-dd
  let d1 = $("#RH").val();
  let d2 = $("#ERH").val();
  let dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  let d1ok = false;

  if (d1 === "") {
    $("#errRH").text("يرجى إدخال تاريخ بداية صحيح");
    ok = false;
  }
  else if (!dateFormat.test(d1)) {
    $("#errRH").text("الصيغة يجب أن تكون yyyy-mm-dd");
    ok = false;
  }
  else if (!isRealDate(d1)) {
    $("#errRH").text("هذا التاريخ غير موجود");
    ok = false;
  }
  else {
    d1ok = true;
  }

  if (d2 === "") {
    $("#errERH").text("يرجى إدخال تاريخ نهاية صحيح");
    ok = false;
  }
  else if (!dateFormat.test(d2)) {
    $("#errERH").text("الصيغة يجب أن تكون yyyy-mm-dd");
    ok = false;
  }
  else if (!isRealDate(d2)) {
    $("#errERH").text("هذا التاريخ غير موجود");
    ok = false;
  }
  else if (d1ok && d2 <= d1) {
    $("#errERH").text("يجب أن يكون بعد تاريخ البداية");
    ok = false;
  }

  // رقم الموبايل (يقبل الفراغ)
  let mob = $("#TelNum").val();
  let prefix = mob.substring(0, 3);
  if (mob !== "") {
    if (isNaN(mob)) {
      $("#errTelNum").text("يجب إدخال أرقام فقط");
      ok = false;
    }
    else if (mob.length !== 10) {
      $("#errTelNum").text("يجب أن يكون رقم الموبايل من 10 خانات");
      ok = false;
    }
    else if (prefix !== "093" && prefix !== "098" && prefix !== "099" &&
             prefix !== "094" && prefix !== "095" && prefix !== "096") {
      $("#errTelNum").text("يجب أن يبدأ الرقم بـ (093, 094, 095, 096, 098, 099)");
      ok = false;
    }
  }

  // البريد الإلكتروني (يقبل الفراغ)
  let mail = $("#Email").val();
  if (mail !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    $("#errEmail").text("صيغة البريد الإلكتروني غير صالحة");
    ok = false;
  }

  return ok;
}

// حساب الكلفة وعرض النتيجة
function showResult() {
  // 1) قراءة التاريخين وحساب عدد الأيام
  let d1 = new Date($("#RH").val());
  let d2 = new Date($("#ERH").val());
  let days = Math.round((d2 - d1) / 86400000);

  // 2) المرور على السيارات المختارة وحساب المجموع
  let total = 0;
  let msg = "السيارات المختارة:\n";

  $("input.pick:checked").each(function () {
    let price = parseInt($(this).val(), 10);
    let model = $(this).attr("title");
    let cost = price * days;

    msg += model + " - " + days + " يوم - " + cost + " ل.س\n";
    total += cost;
  });

  // 3) الخصم إذا زادت المدة عن 7 أيام
  let discount = 0;
  if (days > 7) {
    discount = total * 0.10;
  }

  // 4) عرض النتيجة
  msg += "المجموع: " + total + " ل.س\n";
  msg += "الخصم: " + discount + " ل.س\n";
  msg += "المبلغ النهائي: " + (total - discount) + " ل.س";
  alert(msg);
}

// ربط الأحداث (jQuery) - يعمل فقط إذا كانت مكتبة jQuery محمّلة في الصفحة
if (window.jQuery) {
  $(document).ready(function () {

    // إظهار/إخفاء تفاصيل السيارة
    $("input.details").click(function () {
      $(this).closest("tr").next(".detailsRow").toggle(this.checked);
    });

    // زر "متابعة": إظهار النموذج إذا تم اختيار سيارة
    $("#continueBtn").click(function () {
      if ($("input.pick:checked").length == 0) {
        alert("اختر سيارة واحدة على الأقل");
        return;
      }
      $("#bookingBox").slideDown();
    });

    // زر "إرسال": تحقق ثم عرض النتيجة
    $("#bookingForm").submit(function () {
      if ($("input.pick:checked").length == 0) {
        alert("اختر سيارة واحدة على الأقل");
        return false;
      }
      if (validateForm()) {
        showResult();
      }
      return false; // لمنع إعادة تحميل الصفحة
    });

  });
}
