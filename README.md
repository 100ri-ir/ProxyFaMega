# ⚡ پروکسی‌فا مگا (ProxyFaMega)

**مدیریت پروکسی مرورگر — بومی، کاربرپسند و حرفه‌ای**

افزونه‌ای مدرن با طراحی الهام‌گرفته از iOS برای مدیریت پروفایل‌های پروکسی. این پروژه، بازطراحی و بومی‌سازی افزونهٔ [ZeroOmega](https://github.com/zero-peak/ZeroOmega) است که با ۱۰ پروفایل آماده (Hiddify، v2rayN، NekoBox، Happ، Clash و...)، سوییچ خودکار هوشمند (با حالت پیش‌فرض **«سایت‌های ایرانی مستقیم، بقیه با پروکسی»**) و ۸ تم رنگی ارائه شده است.

توسعه‌یافته توسط [**100ri.ir**](https://github.com/100ri-ir) برای کاربران فارسی‌زبان

[**📥 دانلود آخرین نسخه**](https://github.com/100ri-ir/ProxyFaMega/releases/latest) · [**✨ امکانات**](#-امکانات) · [**📥 آموزش نصب**](#-آموزش-نصب) · [**🎬 پیش‌نمایش بدون نصب**](#-مشاهده-پیشنمایش-بدون-نیاز-به-نصب) · [**🇬🇧 English**](#-proxyfamega-english)

## 💡 چرا ProxyFaMega؟

اکثر کاربرانی که از نرم‌افزارهایی نظیر Hiddify، v2rayN یا NekoBox استفاده می‌کنند، معمولاً با چالش تغییر سریع و آسان پروکسی در مرورگر مواجه هستند. افزونه‌های پیشین مانند SwitchyOmega یا نسخهٔ جدیدتر آن (ZeroOmega)، با وجود عملکرد فنی مطلوب، از زبان فارسی پشتیبانی نمی‌کنند، رابط کاربری قدیمی‌تری دارند و فاقد تنظیمات پیش‌فرض برای نیازهای کاربران ایرانی هستند.

افزونهٔ **ProxyFaMega** همان کارایی و قدرت را با یک رابط کاربری کاملاً فارسی، راست‌چین و مدرن ارائه می‌دهد. گنجاندن پورت‌های پیش‌فرض نرم‌افزارهای رایج، تنظیمات آماده برای سایت‌های ایرانی، و ارائهٔ توضیحات روشن برای هر بخش، این امکان را فراهم کرده تا تمامی کاربران به‌سادگی از آن استفاده نمایند.

## ✨ امکانات

* 🇮🇷 **پشتیبانی کامل از زبان فارسی (راست‌چین)** و زبان انگلیسی — همراه با فونت زیبای [**وزیرمتن**](https://github.com/rastikerdar/vazirmatn) و قابلیت تغییر زبان در لحظه.

* 🎨 **۸ تم رنگی مدرن** (شفق قطبی، غروب، اقیانوس، نعنایی، آب‌نباتی، طلایی، نیمه‌شب، نئون) + **حالت شب (Dark Mode) خودکار** هماهنگ با سیستم‌عامل.

* 🚀 **۱۰ پروفایل آماده** به همراه پورت‌های پیش‌فرض نرم‌افزارهای پراستفاده (جزئیات در جدول زیر ⬇️).

* 🔀 **سوییچ خودکار هوشمند** با پشتیبانی از قوانین دامنه، آدرس و Regex + **ابزار تست زندهٔ آدرس** + ۴ تنظیم از پیش‌آماده. یکی از این تنظیمات حالت **«ایران مستقیم، بقیه با پروکسی»** است که در آن ترافیک دامنه‌های `ir.` و وب‌سایت‌های پرکاربرد ایرانی (نظیر دیجی‌کالا، آپارات، ترب، ورزش۳ و...) به‌صورت مستقیم و بدون پروکسی هدایت می‌شود.

* 💾 **سیستم پشتیبان‌گیری (Backup) پیشرفته**: خروجی رمزنگاری‌شده با استاندارد AES-256-GCM، ذخیرهٔ خودکار تاریخچه تغییرات (تا ۱۰ نسخه) و **امکان درون‌ریزی (Import) مستقیم از ZeroOmega / SwitchyOmega**.

* 📝 **توضیحات و مثال‌های کاربردی** برای تمامی تنظیمات جهت جلوگیری از سردرگمی کاربران.

* ⌨️ **کلیدهای میان‌بر** (`Alt+Shift+P` برای جابه‌جایی بین پروفایل‌ها)، منوی راست‌کلیک روی آیکون، نشانگر رنگی وضعیت، و ابزار تست سرعت اتصال.

* 🔒 **ذخیرهٔ خودکار** تمامی تغییرات به همراه قابلیت همگام‌سازی اختیاری میان دستگاه‌های مختلف.

* 🕵️ **حفظ حریم خصوصی** — هیچ‌گونه اطلاعاتی از کاربر جمع‌آوری نمی‌شود و تمامی داده‌ها صرفاً روی دستگاه شما ذخیره می‌گردند.

* 🧪 **تضمین پایداری** — تمامی نسخه‌ها پیش از انتشار، تست‌های منطقی و PAC را با موفقیت پشت سر می‌گذارند.

## 🚀 پروفایل‌های پیش‌فرض

| نام برنامه | پورت | پروتکل | 
| ----- | ----- | ----- | 
| Hiddify | `12334` | Mixed (SOCKS5/HTTP) | 
| v2rayN / V2Ray | `10808` | SOCKS5 | 
| v2rayN (HTTP) | `10809` | HTTP | 
| NekoBox / Nekoray | `2080` | Mixed (SOCKS5/HTTP) | 
| Happ | `10808` | SOCKS5 (HTTP: `10809`) | 
| Clash Verge / CFW | `7890` | Mixed (HTTP/SOCKS5) | 
| Firefox Proxy | `10810` | سفارشی | 
| Shadowsocks | `1080` | SOCKS5 | 
| Tor | `9050` | SOCKS5 | 
| Psiphon | `8080` | HTTP (SOCKS: `1080`) | 

## 📸 پیش‌نمایش رابط کاربری

## 📥 آموزش نصب

### 🟢 مرورگرهای مبتنی بر کرومیوم (Chrome, Edge, Brave)

۱. آخرین نسخه را از [**بخش Releases**](https://github.com/100ri-ir/ProxyFaMega/releases/latest) دانلود نمایید. فایل مورد نظر `ProxyFaMega-v1.0.0-chrome.zip` است (این فایل برای مرورگر اج نیز کاربرد دارد). ۲. فایل ZIP دانلودشده را استخراج (Extract) کنید. ۳. در نوار آدرس مرورگر خود عبارت `chrome://extensions` (و در مرورگر اج `edge://extensions`) را وارد کنید. ۴. گزینهٔ **Developer mode** (حالت توسعه‌دهنده) را فعال کنید. ۵. بر روی دکمهٔ **Load unpacked** کلیک کرده و پوشهٔ استخراج‌شده را انتخاب نمایید.

### 🦊 مرورگر فایرفاکس

۱. در نوار آدرس مرورگر عبارت `about:debugging#/runtime/this-firefox` را وارد کنید. ۲. روی گزینهٔ **Load Temporary Add-on…** کلیک نموده و فایل `manifest.json` واقع در پوشهٔ `firefox` را انتخاب کنید.

> 💡 **توجه:** نصب از این طریق در فایرفاکس موقتی بوده و با بسته شدن مرورگر غیرفعال می‌شود. نسخهٔ نهایی به‌زودی در فروشگاه رسمی افزونه‌های فایرفاکس منتشر خواهد شد.

## ⌨️ کلیدهای میان‌بر

| عملکرد | کلید میان‌بر | 
| ----- | ----- | 
| انتقال به پروفایل بعدی | `Alt + Shift + P` | 
| بازگشت به پروفایل قبلی | `Alt + Shift + O` | 

## 🎬 مشاهده پیش‌نمایش (بدون نیاز به نصب)

شما می‌توانید فایل‌های `options/options.html` و `popup/popup.html` را مستقیماً در مرورگر خود باز کنید. در این حالت، افزونه در **حالت دمو** و با داده‌های نمونه اجرا می‌شود:

```
options/options.html?view=auto&mode=dark&lang=en

```

**پارامترهای قابل تغییر در آدرس:**

* `view` (`dashboard` / `profiles` / `auto` / `settings` / `backup` / `about`)

* `mode` (`light` / `dark`)

* `lang` (`fa` / `en`)

* `theme` (مانند `aurora`، `sunset`، `ocean`، `midnight` و...)

## 🛠️ بیلد و توسعه از سورس کد

```
git clone https://github.com/100ri-ir/ProxyFaMega.git
cd ProxyFaMega
python3 scripts/build.py      # → ایجاد فایل‌های نصبی در پوشه: dist/ProxyFaMega-v1.0.0-{chrome,firefox,edge}.zip
node test/logic_test.js       # اجرای تست‌های منطق و PAC
python3 scripts/check_i18n.py # بررسی یکپارچگی فایل‌های ترجمه

```

**پیش‌نیازها:** برای توسعه تنها به **پایتون ۳.۶+** و **Node.js** نیاز دارید و پروژه فاقد هرگونه وابستگی خارجی است. همچنین بسته‌های انتشار به‌صورت خودکار توسط GitHub Actions بیلد شده و در بخش [Releases](https://github.com/100ri-ir/ProxyFaMega/releases) قرار می‌گیرند.

## 🔄 انتقال اطلاعات از ZeroOmega یا SwitchyOmega

برای انتقال اطلاعات، به بخش **پشتیبان‌گیری ← بازیابی** مراجعه کرده و فایل خروجی (JSON) دریافت شده از ZeroOmega یا SwitchyOmega را در آنجا رها کنید (Drag & Drop). پروفایل‌ها و قوانین سوییچ خودکار شما شناسایی شده و با امکان پیش‌نمایش، آمادهٔ ادغام یا جایگزینی خواهند بود.

## 🧩 ساختار پروژه

```
ProxyFaMega/
├── src/                  ← سورس اصلی افزونه
│   ├── background/       ← سرویس‌ورکر MV3 (کرومیوم) و موتور پروکسی MV2 (فایرفاکس)
│   ├── common/           ← ثابت‌ها، تم‌ها، i18n، ذخیره‌سازی، موتور قوانین (matcher/PAC)
│   ├── popup/            ← پاپ‌آپ جهت تعویض سریع پروفایل‌ها
│   ├── options/          ← صفحه تنظیمات جامع (داشبورد، پروفایل‌ها، سوییچ خودکار و...)
│   ├── assets/           ← آیکون‌ها و فونت‌ها (وزیرمتن)
│   ├── _locales/         ← فایل‌های بومی‌سازی و ترجمه (fa / en)
│   └── manifests/        ← فایل‌های مانیفست مختص مرورگرها (chrome / firefox)
├── scripts/              ← اسکریپت‌های اتوماسیون: build.py ، gen_icons.py ، check_i18n.py
├── test/                 ← تست‌های منطق و PAC (مبتنی بر Node.js)
├── screenshots/          ← تصاویر رابط کاربری برای مستندات
├── assets/               ← بنرها و گرافیک‌های مربوط به مخزن
└── .github/workflows/    ← تنظیمات GitHub Actions برای بیلد و انتشار خودکار

```

## 🗺️ نقشهٔ راه (Roadmap)

* \[x\] انتشار نسخهٔ ۱.۰ — شامل داشبورد، پروفایل‌ها، سوییچ خودکار، بکاپ، ۸ تم و پشتیبانی دوزبانه.

* \[ \] انتشار رسمی در فروشگاه Chrome Web Store و Firefox Add-ons.

* \[ \] افزودن پروفایل‌های آمادهٔ بیشتر و قابلیت ویرایش گروهی.

* \[ \] امکان خروجی‌گرفتن و درون‌ریزی قوانین با فرمت‌های استاندارد نظیر Clash و PAC.

* \[ \] اضافه‌کردن ابزار تست کانکشن پروکسی به داخل افزونه.

## 🤝 قدردانی

این پروژه حاصل بازطراحی و توسعهٔ ایدهٔ نرم‌افزارهای مدیریت پروکسی پیشین است که توسعهٔ آن بدون پروژه‌های متن‌باز زیر امکان‌پذیر نبود:

* [**ZeroOmega**](https://github.com/zero-peak/ZeroOmega)**:** الهام‌بخش اصلی این پروژه و جانشین مدرن نرم‌افزار SwitchyOmega.

* [**SwitchyOmega**](https://github.com/FelisCatus/SwitchyOmega)**:** افزونهٔ کلاسیک و نام‌آشنای مدیریت پروکسی که سال‌ها مورد استفادهٔ کاربران قرار داشت.

* [**وزیرمتن (Vazirmatn)**](https://github.com/rastikerdar/vazirmatn)**:** تایپ‌فیس زیبا و استاندارد فارسی، اثر زنده‌یاد [صابر راستی‌کردار](https://github.com/rastikerdar).

## 👤 سازنده

این پروژه توسط [**100ri.ir**](https://github.com/100ri-ir) توسعه یافته و منتشر شده است.

در صورت تمایل می‌توانید با دادن ستاره (⭐) در گیت‌هاب، از روند توسعهٔ این پروژه اپن‌سورس حمایت کنید. از همراهی شما سپاسگزاریم.

## 📄 مجوز و سلب مسئولیت

[**MIT**](LICENSE) — این نرم‌افزار کاملاً متن‌باز بوده و استفاده، ایجاد تغییرات و انتشار مجدد آن آزاد است.

> ⚠️ **سلب مسئولیت:** این افزونه صرفاً یک ابزار کاربردی برای «مدیریت پروکسی» است و ارائه‌دهنده هیچ‌گونه سرور، کانفیگ یا سرویس عبور از تحریم نیست. استفاده از این ابزار برای مصارف شخصی در نظر گرفته شده و مسئولیت رعایت قوانین و نحوهٔ استفاده از آن کاملاً بر عهدهٔ کاربر است. نرم‌افزار ProxyFaMega به هیچ عنوان داده‌های کاربران را جمع‌آوری نکرده و به هیچ سرور خارجی متصل نمی‌شود.

# ⚡ ProxyFaMega (English)

**A gorgeous, Persian-first browser proxy manager** — an Iranian-made, Persian-redesigned take on the classic [ZeroOmega](https://github.com/zero-peak/ZeroOmega) / SwitchyOmega idea, built with ❤️ by [**100ri.ir**](https://github.com/100ri-ir).

[**📥 Download**](https://github.com/100ri-ir/ProxyFaMega/releases/latest) · [**✨ Features**](#-features) · [**📥 Install**](#-install) · [**🎬 Live preview**](#-live-preview-without-installing)

## Why ProxyFaMega?

If you run Hiddify, v2rayN or NekoBox, you know the pain: switching the browser proxy mid-work. SwitchyOmega (and its successor ZeroOmega) are legendary — but English-only, dated-looking, and with zero defaults for the apps most Iranian users actually use. ProxyFaMega brings the same power with a fully Persian (RTL), iOS-inspired UI, ready-made profiles for the apps people use today, Iranian one-click presets, and a friendly explanation under every single setting.

## ✨ Features

* 🇮🇷 **Persian-first, fully RTL** + English — instant language switching, beautiful [Vazirmatn](https://github.com/rastikerdar/vazirmatn) font baked in

* 🎨 **8 iOS-style color themes** (Aurora, Sunset, Ocean, Mint, Candy, Gold, Midnight, Neon) + **auto dark mode** following the OS

* 🚀 **10 ready-made profiles** — Hiddify `12334`, v2rayN `10808/10809`, NekoBox `2080`, Happ, Clash `7890`, Shadowsocks `1080`, Tor `9050`, Psiphon `8080`, and more

* 🔀 **Smart auto-switch** with domain/URL/regex rules, a **live URL tester**, and 4 one-click presets — including **"Iran direct, rest proxied"** (every `*.ir` site plus famous Iranian sites stays direct)

* 💾 **Professional backup** — AES-256-GCM encrypted exports, automatic snapshots (up to 10), and **direct import from ZeroOmega / SwitchyOmega**

* 📝 **Every setting documented** with a Persian explanation and a practical example

* ⌨️ `Alt+Shift+P` / `Alt+Shift+O` shortcuts, context menu, colored status badge, connection latency test

* 🔒 **Autosave everywhere** + optional cross-device sync

* 🕵️ **Zero telemetry** — everything stays on your device

* 🧪 **Logic & PAC test suite** — releases are built only with green tests

## 📥 Install

**Chrome / Brave / Edge (MV3) & Firefox (MV2):** grab the latest zip from the [Releases page](https://github.com/100ri-ir/ProxyFaMega/releases/latest), extract it, then:

* **Chrome / Brave / Edge:** open `chrome://extensions` (or `edge://extensions`), enable **Developer mode**, click **Load unpacked** and select the extracted folder.

* **Firefox:** open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…** and pick the `manifest.json` inside the firefox package.

## 🎬 Live preview without installing

Open `options/options.html` or `popup/popup.html` directly in any browser — the extension runs in **demo mode** with sample data:

```
options/options.html?view=auto&mode=dark&lang=en

```

Parameters: `view` (`dashboard`, `profiles`, `auto`, `settings`, `backup`, `about`), `mode` (`light`/`dark`), `lang` (`fa`/`en`), `theme` (e.g. `aurora`, `sunset`, `ocean`, `midnight`…).

## 🛠️ Build from source

```
git clone https://github.com/100ri-ir/ProxyFaMega.git
cd ProxyFaMega
python3 scripts/build.py      # -> dist/ProxyFaMega-v1.0.0-{chrome,firefox,edge}.zip
node test/logic_test.js       # logic & PAC tests
python3 scripts/check_i18n.py # translation health check

```

Requirements: **Python 3.6+** and **Node** only — no external dependencies. Tagged commits automatically build and publish packages via GitHub Actions.

## 🔄 Migrating from ZeroOmega / SwitchyOmega

Backup page → Restore → drop the JSON export from ZeroOmega or SwitchyOmega; profiles and auto-switch rules are imported with a preview and merge/replace options.

## 🤝 Credits

* [**ZeroOmega**](https://github.com/zero-peak/ZeroOmega) — the main inspiration for this project

* [**SwitchyOmega**](https://github.com/FelisCatus/SwitchyOmega) — the classic proxy manager

* [**Vazirmatn**](https://github.com/rastikerdar/vazirmatn) — the beautiful Persian font

## 📄 License

[**MIT**](LICENSE) — free to use, modify and share. This extension is a proxy *manager*: it ships no servers or configs and collects no data; use it responsibly.

**Made with ❤️ in Iran by [100ri.ir](https://github.com/100ri-ir)** — if it helps you, give it a star ⭐