# Privacy Policy | بیانیهٔ حریم خصوصی

**EN** — ProxyFaMega collects nothing. There are no analytics, no accounts, no external servers and no logs. All data (profiles, rules, settings, snapshots) lives in your browser's local storage. If you explicitly enable "Sync across devices", your settings travel only through your own browser sync account (`browser.storage.sync`). The only network requests the extension can make are the user-triggered connection/latency tests against `gstatic.com` / `cp.cloudflare.com`. Proxied traffic flows through your own local proxy client, never through us — there is no "us".

**FA** — پروکسی‌فامگا هیچ داده‌ای جمع نمی‌کند. بدون تحلیل رفتار، بدون حساب کاربری، بدون سرور خارجی و بدون لاگ. همهٔ داده‌ها (پروفایل‌ها، قوانین، تنظیمات، اسنپ‌شات‌ها) فقط در حافظهٔ محلی مرورگر شما هستند. اگر «همگام‌سازی بین دستگاه‌ها» را خودتان روشن کنید، تنظیمات فقط از طریق حساب همگام‌سازی خودِ مرورگر (`browser.storage.sync`) جابه‌جا می‌شوند. تنها درخواست‌های شبکه‌ای افزونه، تست‌های اتصال اختیاری (به تصمیم شما) به `gstatic.com` / `cp.cloudflare.com` هستند. ترافیک پروکسی‌شده از کلاینت محلیِ خودِ شما عبور می‌کند، نه از ما — چون اصلاً «ما» وجود نداریم.

## Permissions | مجوزها

| Permission | چرا؟ / Why? |
|---|---|
| `storage`, `unlimitedStorage` | ذخیرهٔ پروفایل‌ها/قوانین/اسنپ‌شات‌ها locally · store profiles, rules and snapshots locally |
| `proxy` | اعمال پروکسی روی مرورگر · apply the proxy to the browser |
| `contextMenus` | تعویض سریع از راست‌کلیک · quick switching from the right-click menu |
| `notifications` | اعلان تأیید تعویض پروفایل · profile-switch confirmation |
| `clipboardWrite` / `clipboardRead` | کپی/چسباندن اطلاعات پروکسی · copy/paste proxy info |
| `https://www.gstatic.com/*`, `https://cp.cloudflare.com/*` | فقط تست اتصال (اختیاری) · connection test only (optional) |

> v2.1.0: tokens left over from the removed 2.0.x VPN module are deleted automatically on the first run after updating. | توکن‌های به‌جامانده از ماژول VPN نسخه‌های 2.0.x در اولین اجرا بعد از به‌روزرسانی خودکار حذف می‌شوند.
