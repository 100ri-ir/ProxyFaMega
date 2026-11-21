<div dir="rtl">

# 🤝 مشارکت در ProxyFaMega

از هر نوع مشارکتی خوشحال می‌شویم — گزارش باگ، ایدهٔ امکانات، بهبود متن‌ها یا کد! 🎉

## 🚀 شروع سریع

```bash
git clone https://github.com/100ri-ir/ProxyFaMega.git
cd ProxyFaMega
node test/logic_test.js              # تست‌های منطق و PAC
node test/background_smoke_test.js  # اسموک پس‌زمینه (بارگذاری واقعی)
python3 scripts/check_i18n.py        # سلامت ترجمه‌ها
python3 scripts/build.py             # بیلد بستهٔ واحد در dist/
```

نیازمندی فقط پایتون ۳.۶+ و Node است؛ هیچ `npm install` یا وابستگی خارجی وجود ندارد.

## 🧭 راهنماها

- 🇮🇷 زبان اصلیِ پروژه **فارسی است**؛ متن‌های جدید باید در `src/common/i18n.js` برای **هر دو زبان** (fa و en) تعریف شوند و از `scripts/check_i18n.py` عبور کنند.
- 🎨 استایل از متغیرهای تم در `src/common/constants.js` و `ui.css` استفاده می‌کند؛ رنگ هاردکد نکنید.
- 🧪 اگر منطق جدیدی به matcher/PAC اضافه می‌کنید، حتماً تست متناظرش را در `test/logic_test.js` بنویسید.
- 📸 اگر رابط کاربری تغییر کرد، اسکرین‌شات‌های `screenshots/` را با پلی‌رایت بازتولید و README را به‌روز کنید.
- 🙈 در PRهای خود چیزی به‌صورت خودکار به سرور خارجی نفرستید — این پروژه صفر تلمتری است (PRIVACY.md را ببینید).
- 📦 کدهای داخل `src/` با ES5 ساده و بدون ابزار بیلد نوشته می‌شوند — سازگاری با مرورگرهای قدیمی‌تر مهم است.
- ✍️ برای پیام‌های مرورگر، هر دو `_locales/fa/messages.json` و `_locales/en/messages.json` را به‌روز کنید.

## 📮 ارسال تغییرات

1. از `main` یک برنچ جدا بزنید (مثلاً `feat/rtl-tooltips`)
2. تغییرات را کامیت کنید — پیام کامیت مختصر و توصیفی
3. قبل از Push مطمئن شوید `node test/logic_test.js` و `node test/background_smoke_test.js` سبز هستند
4. یک Pull Request با توضیح فارسی (یا انگلیسی) باز کنید

## 🐞 گزارش باگ

از [ایسووی جدید](https://github.com/100ri-ir/ProxyFaMega/issues/new) استفاده کنید و بنویسید: مرورگر + نسخهٔ آن، سیستم‌عامل، مراحل بازتولید و اسکرین‌شات اگر ممکن است.

با ❤️ — [100ri.ir](https://github.com/100ri-ir)

</div>
