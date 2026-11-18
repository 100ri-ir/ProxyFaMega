/* ProxyFaMega — bilingual i18n (fa default / en) — tuple format [fa, en] */
'use strict';

var i18n = (function () {
  var lang = 'fa';

  var MSG = {
    /* ---------- common ---------- */
    'common.confirm': ['تأیید', 'Confirm'],
    'common.cancel': ['انصراف', 'Cancel'],
    'common.ok': ['تأیید', 'OK'],
    'common.save': ['ذخیره', 'Save'],
    'common.copy': ['کپی', 'Copy'],
    'common.never': ['هرگز', 'Never'],

    /* ---------- app shell ---------- */
    'app.saving': ['در حال ذخیره…', 'Saving…'],
    'app.saved': ['ذخیره شد', 'Saved'],
    'toast.saved': ['تغییرات ذخیره شد', 'Changes saved'],
    'toast.deleted': ['حذف شد', 'Deleted'],
    'toast.switched': ['پروفایل فعال شد', 'Profile activated'],
    'toast.switchFail': ['خطا در اعمال پروفایل', 'Failed to apply profile'],

    /* ---------- nav ---------- */
    'nav.dashboard': ['داشبورد', 'Dashboard'],
    'nav.profiles': ['پروفایل‌ها', 'Profiles'],
    'nav.auto': ['سوییچ خودکار', 'Auto Switch'],
    'nav.settings': ['تنظیمات', 'Settings'],
    'nav.backup': ['پشتیبان‌گیری', 'Backup'],
    'nav.about': ['درباره', 'About'],

    /* ---------- menus / notifications (background) ---------- */
    'menu.direct': ['اتصال مستقیم', 'Direct connection'],
    'menu.system': ['پروکسی سیستم', 'System proxy'],
    'menu.auto': ['سوییچ خودکار', 'Auto switch'],
    'notify.switched': ['«{name}» فعال شد', '"{name}" activated'],

    /* ---------- popup ---------- */
    'popup.current': ['وضعیت فعلی', 'Current status'],
    'popup.noProfiles': ['هنوز پروفایلی ندارید — از تنظیمات اضافه کنید', 'No profiles yet — add one in settings'],
    'popup.settings': ['تنظیمات', 'Settings'],
    'popup.test': ['تست اتصال', 'Test connection'],
    'popup.testFail': ['ناموفق', 'Failed'],
    'popup.search': ['جستجوی پروفایل…', 'Search profiles…'],
    'mode.direct': ['مستقیم', 'Direct'],
    'mode.system': ['سیستم', 'System'],
    'mode.auto': ['خودکار', 'Auto'],

    /* ---------- dashboard ---------- */
    'dash.currentMode': ['حالت فعلی', 'Current mode'],
    'dash.proxyOn': ['پروکسی', 'Proxy'],
    'dash.statsTitle': ['نمای کلی', 'Overview'],
    'dash.profilesCount': ['پروفایل', 'profiles'],
    'dash.rulesCount': ['قانون فعال', 'active rules'],
    'dash.lastBackup': ['آخرین پشتیبان', 'last backup'],
    'dash.quickTitle': ['دسترسی سریع', 'Quick access'],
    'dash.quickDesc': ['با یک کلیک بین پروفایل‌ها جابه‌جا شوید — میان‌بر صفحه‌کلید: Alt+Shift+P', 'Switch between profiles with one click — keyboard shortcut: Alt+Shift+P'],
    'dash.testTitle': ['تست سرعت اتصال', 'Connection test'],
    'dash.testDesc': ['پاسخ‌گویی مسیر فعلی را می‌سنجد؛ اگر پروکسی خاموش باشد، تست مستقیم انجام می‌شود.', 'Measures the responsiveness of the current route.'],
    'dash.testNow': ['تست کن', 'Test now'],
    'dash.testNote': ['زیر ۳۰۰ میلی‌ثانیه عالی است', 'Under 300 ms is excellent'],
    'dash.tipsTitle': ['نکته‌های طلایی', 'Pro tips'],
    'dash.tip1': ['حالت «سوییچ خودکار» را فعال کنید تا سایت‌های ایرانی مستقیم و بقیه با پروکسی باز شوند.', 'Enable "Auto switch" to keep Iranian sites direct and route everything else through the proxy.'],
    'dash.tip2': ['با راست‌کلیک روی آیکون افزونه هم می‌توانید سریع پروفایل عوض کنید.', 'Right-click the extension icon to switch profiles quickly.'],
    'dash.tip3': ['قبل از هر تغییر بزرگ، نسخه پشتیبان خودکار گرفته می‌شود — خیالتان راحت باشد.', 'A snapshot is saved automatically before every major change.'],

    /* ---------- profiles ---------- */
    'profiles.hint': ['برای جابه‌جایی، کارت‌ها را بکشید و رها کنید', 'Drag cards to reorder'],
    'profiles.restoreDefaults': ['بازگردانی پیش‌فرض‌ها', 'Restore defaults'],
    'profiles.builtIn': ['پیش‌فرض', 'built-in'],
    'profiles.active': ['فعال', 'active'],
    'profiles.edit': ['ویرایش', 'Edit'],
    'profiles.duplicate': ['کپی', 'Duplicate'],
    'profiles.delete': ['حذف', 'Delete'],
    'profiles.dragHint': ['بکشید', 'drag'],
    'profiles.addNew': ['افزودن پروفایل جدید', 'Add new profile'],
    'profiles.activate': ['فعال‌سازی', 'Activate'],
    'profiles.current': ['فعال است', 'Current'],
    'profiles.newTitle': ['پروفایل جدید', 'New profile'],
    'profiles.editTitle': ['ویرایش پروفایل', 'Edit profile'],
    'profiles.fName': ['نام پروفایل', 'Profile name'],
    'profiles.phName': ['مثلاً: سرور شخصی', 'e.g. My server'],
    'profiles.fProtocol': ['پروتکل', 'Protocol'],
    'profiles.hProto': ['<b>SOCKS5</b> برای v2rayN و Hiddify — <b>HTTP</b> برای کلَش و برنامه‌های قدیمی‌تر', '<b>SOCKS5</b> for v2rayN & Hiddify — <b>HTTP</b> for Clash and older apps'],
    'profiles.fHost': ['آدرس سرور', 'Host'],
    'profiles.hHost': ['<b>مثال:</b> 127.0.0.1 (لوکال) یا 192.168.1.5', '<b>Example:</b> 127.0.0.1 (local) or 192.168.1.5'],
    'profiles.fPort': ['پورت', 'Port'],
    'profiles.hPort': ['<b>مثال:</b> 12334 برای هیدی‌فای، 10808 برای v2rayN', '<b>Example:</b> 12334 for Hiddify, 10808 for v2rayN'],
    'profiles.fColor': ['رنگ کارت', 'Card color'],
    'profiles.fIcon': ['آیکون', 'Icon'],
    'profiles.fNote': ['یادداشت (اختیاری)', 'Note (optional)'],
    'profiles.phNote': ['توضیح کوتاه برای خودتان…', 'A short note for yourself…'],
    'profiles.fBypass': ['استثناها — این آدرس‌ها مستقیم باز شوند (هر خط یک آدرس)', 'Bypass list — these hosts go direct (one per line)'],
    'profiles.hBypass': ['<b>مثال:</b> *.company.ir یا 10.0.0.*', '<b>Example:</b> *.company.ir or 10.0.0.*'],
    'profiles.create': ['ایجاد پروفایل', 'Create profile'],
    'profiles.resetThis': ['بازگردانی این پروفایل', 'Reset this profile'],
    'profiles.resetDone': ['به تنظیمات پیش‌فرض برگشت', 'Reset to defaults'],
    'profiles.deleteTitle': ['حذف پروفایل', 'Delete profile'],
    'profiles.deleteConfirm': ['پروفایل «{name}» حذف شود؟ این کار قابل بازگشت با پشتیبان است.', 'Delete profile "{name}"? You can restore it from a snapshot.'],
    'profiles.restoreConfirm': ['همه پروفایل‌های پیش‌فرض (Hiddify، v2rayN، NekoBox، Happ و…) بازگردانی شوند؟ پروفایل‌های سفارشی شما حذف نمی‌شوند.', 'Restore all default profiles (Hiddify, v2rayN, NekoBox, Happ…)? Your custom profiles are kept.'],
    'profiles.dupDone': ['کپی ساخته شد', 'Duplicated'],
    'err.name': ['نام پروفایل را وارد کنید', 'Enter a profile name'],
    'err.host': ['آدرس سرور را وارد کنید', 'Enter a host'],
    'err.port': ['پورت باید بین ۱ تا ۶۵۵۳۵ باشد', 'Port must be 1–65535'],
    'err.duplicate': ['پروفایلی با این نام وجود دارد', 'A profile with this name exists'],
    'err.pattern': ['الگو را وارد کنید', 'Enter a pattern'],

    /* ---------- auto switch ---------- */
    'auto.testerTitle': ['تست‌کننده قانون', 'Rule tester'],
    'auto.testerDesc': ['آدرس هر سایتی را بنویسید تا ببینید کدام قانون رویش اعمال می‌شود و با کدام پروفایل باز می‌شود.', 'Type any URL to see which rule matches and which profile serves it.'],
    'auto.direct': ['مستقیم (بدون پروکسی)', 'Direct (no proxy)'],
    'auto.matchedRule': ['قانون مطابقت‌یافته', 'matched rule'],
    'auto.noMatch': ['هیچ قانونی مطابقت نداشت — پیش‌فرض اعمال شد', 'No rule matched — default applied'],
    'auto.rulesTitle': ['قوانین مسیریابی', 'Routing rules'],
    'auto.rulesDesc': ['قوانین از بالا به پایین بررسی می‌شوند؛ اولین قانون مطابقت‌یافته برنده است.', 'Rules are evaluated top to bottom; the first match wins.'],
    'auto.defaultAction': ['اگر هیچ قانونی مطابقت نداشت', 'When no rule matches'],
    'auto.defaultDesc': ['عمل پیش‌فرض برای سایت‌هایی که هیچ قانونی ندارند.', 'The default action for sites that match no rule.'],
    'auto.defaultExample': ['مثال: همه سایت‌ها با Hiddify باز شوند مگر سایت‌های ایرانی', 'e.g. Everything via Hiddify except Iranian sites'],
    'auto.typeDomain': ['دامنه (Wildcard)', 'Domain (wildcard)'],
    'auto.typeUrl': ['آدرس کامل (Wildcard)', 'Full URL (wildcard)'],
    'auto.typeRegex': ['عبارت باقاعده (Regex)', 'Regex'],
    'auto.addRule': ['افزودن قانون', 'Add rule'],
    'auto.ruleAdded': ['قانون اضافه شد', 'Rule added'],
    'auto.fType': ['نوع', 'Type'],
    'auto.fPattern': ['الگو', 'Pattern'],
    'auto.fAction': ['مسیر', 'Action'],
    'auto.noRules': ['هنوز قانونی نیست — از پیش‌تنظیم‌های آماده پایین صفحه شروع کنید', 'No rules yet — start from the presets below'],
    'auto.moveUp': ['انتقال به بالا', 'Move up'],
    'auto.presetsTitle': ['پیش‌تنظیم‌های آماده', 'Ready-made presets'],
    'auto.presetsDesc': ['با یک کلیک، مجموعه‌قوانین‌های رایج ایرانی اعمال شود.', 'Apply common Iranian routing setups with one click.'],
    'auto.applyPreset': ['اعمال', 'Apply'],
    'auto.presetConfirm': ['قوانین تکراری اضافه نمی‌شوند و قبل از تغییر، نسخه پشتیبان گرفته می‌شود.', 'Duplicate rules are skipped and a snapshot is taken first.'],
    'auto.presetDone': ['پیش‌تنظیم اعمال شد', 'Preset applied'],

    /* ---------- settings ---------- */
    'set.appearanceTitle': ['ظاهر و زبان', 'Appearance & language'],
    'set.appearanceDesc': ['زبان، تم روشن/تاریک، اندازه فونت و تم رنگی را از این‌جا تنظیم کنید.', 'Set language, light/dark mode, font size and color theme here.'],
    'set.lang': ['زبان برنامه', 'App language'],
    'set.langDesc': ['زبان رابط کاربری؛ فارسی راست‌به‌چپ و کامل است.', 'Interface language; Persian is fully RTL.'],
    'set.langExample': ['مثال: فارسی (پیش‌فرض) یا English', 'e.g. Persian (default) or English'],
    'set.langDone': ['زبان تغییر کرد', 'Language changed'],
    'set.appearance': ['حالت نمایش', 'Appearance'],
    'set.appearanceDesc2': ['خودکار با سیستم‌عامل هماهنگ می‌شود؛ یا ثابت روی روشن/تاریک بگذارید.', '"Auto" follows your OS; or pin light/dark.'],
    'set.appearanceExample': ['مثال: شب‌ها تاریک، روزها روشن', 'e.g. dark at night, light by day'],
    'set.app.auto': ['خودکار', 'Auto'],
    'set.app.light': ['روشن', 'Light'],
    'set.app.dark': ['تاریک', 'Dark'],
    'set.fontSize': ['اندازه فونت', 'Font size'],
    'set.fontSizeDesc': ['اندازه متن‌های برنامه را بزرگ‌تر یا کوچک‌تر کنید.', 'Make app text larger or smaller.'],
    'set.fontSizeExample': ['مثال: بزرگ — مناسب نمایشگرهای 4K', 'e.g. Large — great for 4K displays'],
    'set.fs.sm': ['کوچک', 'Small'],
    'set.fs.md': ['متوسط', 'Medium'],
    'set.fs.lg': ['بزرگ', 'Large'],
    'set.themeTitle': ['تم رنگی', 'Color theme'],
    'set.themeDesc': ['۸ تم رنگی الهام‌گرفته از طراحی iOS — هر تم حالت روشن و تاریک دارد.', '8 iOS-inspired themes — each has light & dark variants.'],
    'set.themeDone': ['تم اعمال شد', 'Theme applied'],
    'set.behaviorTitle': ['رفتار و عملکرد', 'Behavior'],
    'set.behaviorDesc': ['رفتار افزونه را دقیق تنظیم کنید؛ هر گزینه توضیح و مثال دارد.', 'Fine-tune how the extension behaves; every option is documented.'],
    'set.badge': ['نشان روی آیکون', 'Icon badge'],
    'set.badgeDesc': ['حالت فعال را روی آیکون افزونه در نوار ابزار نشان می‌دهد.', 'Shows the active mode on the toolbar icon.'],
    'set.badgeExample': ['مثال: HD برای Hiddify یا OFF', 'e.g. HD for Hiddify or OFF'],
    'set.notif': ['اعلان هنگام تعویض', 'Switch notification'],
    'set.notifDesc': ['بعد از هر تعویض پروفایل، یک اعلان کوچک نشان می‌دهد.', 'Shows a small notification after each profile switch.'],
    'set.notifExample': ['مثال: «Hiddify فعال شد»', 'e.g. "Hiddify activated"'],
    'set.saveToast': ['پیام «ذخیره شد»', 'Saved toast'],
    'set.saveToastDesc': ['پس از هر تغییر، پیام تأیید ذخیره‌سازی نمایش داده شود.', 'Show a confirmation toast after each change.'],
    'set.saveToastExample': ['مثال: تغییر تم → «تغییرات ذخیره شد»', 'e.g. theme change → "Changes saved"'],
    'set.bypassLocal': ['عبور از شبکه داخلی', 'Bypass LAN'],
    'set.bypassLocalDesc': ['آدرس‌های داخلی (localhost و 127.0.0.1 و رنج 10.x و 192.168.x و…) هرگز از پروکسی نمی‌روند.', 'Local addresses (localhost, 127.0.0.1, 10.x, 192.168.x…) never go through the proxy.'],
    'set.bypassLocalExample': ['مثال: 192.168.1.1 (مودم خانه) مستقیم باز می‌شود', 'e.g. 192.168.1.1 (home router) loads directly'],
    'set.remoteDns': ['DNS از راه دور (SOCKS5)', 'Remote DNS (SOCKS5)'],
    'set.remoteDnsDesc': ['در فایرفاکس، ترجمه دامنه‌ها هم از پروکسی انجام می‌شود تا DNS Leak رخ ندهد.', 'On Firefox, domain resolution goes through the proxy too (prevents DNS leaks).'],
    'set.remoteDnsExample': ['مثال: باز کردن سایت فیلترشده بدون DNS مستقیم', 'e.g. filtered sites without direct DNS exposure'],
    'set.fallback': ['در صورت قطع پروکسی، مستقیم', 'Fall back to direct'],
    'set.fallbackDesc': ['اگر سرور پروکسی پاسخ نداد، مرورگر خودکار بدون پروکسی ادامه دهد. برای حریم خصوصی بهتر، خاموش بگذارید.', 'If the proxy is down, the browser continues without it. Keep OFF for better privacy.'],
    'set.fallbackExample': ['مثال: خاموش = اگر پروکسی قطع باشد، سایت باز نمی‌شود (امن‌تر)', 'e.g. OFF = sites fail loudly when proxy is down (safer)'],
    'set.sync': ['همگام‌سازی بین دستگاه‌ها', 'Sync across devices'],
    'set.syncDesc': ['پروفایل‌ها و تنظیمات در حساب مرورگر شما (Google/Firefox) همگام می‌شوند. حجم زیاد ممکن است با محدودیت مواجه شود.', 'Profiles & settings sync through your browser account (Google/Firefox). Large data may hit quota.'],
    'set.syncExample': ['مثال: یک بار بسازید، همه دستگاه‌ها داشته باشند', 'e.g. set it once, have it everywhere'],
    'set.syncOn': ['همگام‌سازی فعال شد', 'Sync enabled'],
    'set.syncOff': ['همگام‌سازی خاموش شد', 'Sync disabled'],
    'set.syncQuota': ['حجم همگام‌سازی پر شد؛ همگام‌سازی خاموش شد', 'Sync quota exceeded; sync disabled'],
    'set.kbdTitle': ['میان‌برهای صفحه‌کلید', 'Keyboard shortcuts'],
    'set.kbdDesc': ['بدون باز کردن پاپ‌آپ، پروفایل بعدی/قبلی را فعال کنید.', 'Cycle profiles without opening the popup.'],
    'set.kbdNext': ['پروفایل بعدی', 'Next profile'],
    'set.kbdPrev': ['پروفایل قبلی', 'Previous profile'],
    'set.kbdWhere': ['نشانی تغییر میان‌برها — در نوار آدرس مرورگر باز کنید', 'Paste this in the address bar to change shortcuts'],
    'set.copied': ['کپی شد', 'Copied'],
    'set.dangerTitle': ['بازنشانی کامل', 'Full reset'],
    'set.dangerDesc': ['همه‌چیز به حالت اولیه برمی‌گردد (یک نسخه پشتیبان خودکار گرفته می‌شود).', 'Everything returns to factory defaults (a snapshot is saved first).'],
    'set.resetAll': ['بازنشانی همه‌چیز', 'Reset everything'],
    'set.resetConfirm': ['همه پروفایل‌ها، قوانین و تنظیمات پاک و به حالت اول برمی‌گردند. برای تأیید کلمه بازنشانی را تایپ کنید.', 'All profiles, rules and settings return to factory state. Type the confirmation word.'],
    'set.resetDone': ['بازنشانی انجام شد', 'Reset complete'],

    /* ---------- backup ---------- */
    'bk.exportTitle': ['خروجی گرفتن', 'Export'],
    'bk.exportDesc': ['از همه‌چیز (یا فقط پروفایل‌ها/تنظیمات) فایل پشتیبان بسازید. با رمز، خروجی AES-256 رمزدار می‌شود.', 'Create a backup of everything (or profiles/settings only). With a password it is AES-256 encrypted.'],
    'bk.scope': ['محدوده', 'Scope'],
    'bk.scopeFull': ['همه‌چیز (کامل)', 'Everything (full)'],
    'bk.scopeProfiles': ['فقط پروفایل‌ها', 'Profiles only'],
    'bk.scopeSettings': ['فقط تنظیمات', 'Settings only'],
    'bk.passPh': ['رمز اختیاری برای رمزداری…', 'Optional password to encrypt…'],
    'bk.passHint': ['اگر خالی بگذارید خروجی ساده JSON است؛ با رمز، با AES-GCM رمزگذاری می‌شود و فقط داخل ProxyFaMega باز می‌شود.', 'Leave empty for plain JSON; with a password it is AES-GCM encrypted and only openable in ProxyFaMega.'],
    'bk.download': ['دانلود فایل پشتیبان', 'Download backup'],
    'bk.copyJson': ['کپی JSON', 'Copy JSON'],
    'bk.exported': ['پشتیبان ساخته شد', 'Backup created'],
    'bk.copied': ['در کلیپ‌بورد کپی شد', 'Copied to clipboard'],
    'bk.cryptErr': ['خطا در رمزگذاری — رمز کوتاه است؟', 'Encryption failed — password too short?'],
    'bk.importTitle': ['بازیابی و ورودی', 'Import & restore'],
    'bk.importDesc': ['فایل پشتیبان ProxyFaMega یا خروجی ZeroOmega/SwitchyOmega را بکشید، انتخاب یا متنش کنید.', 'Drop, pick or paste a ProxyFaMega backup or a ZeroOmega/SwitchyOmega export.'],
    'bk.dropHere': ['فایل را این‌جا رها کنید یا کلیک کنید', 'Drop a file here or click to browse'],
    'bk.dropHint': ['پشتیبان ProxyFaMega (JSON / رمزدار) یا ZeroOmega', 'ProxyFaMega backup (JSON / encrypted) or ZeroOmega'],
    'bk.paste': ['یا متن JSON را این‌جا بچسبانید', 'Or paste JSON text here'],
    'bk.importBtn': ['بررسی و بازیابی', 'Analyze & import'],
    'bk.soNote': ['خروجی ZeroOmega/SwitchyOmega هم پشتیبانی می‌شود — پروفایل‌ها و قوانین سوییچ خودکار منتقل می‌شوند.', 'ZeroOmega/SwitchyOmega exports are supported — profiles and switch rules are migrated.'],
    'bk.emptyImport': ['چیزی برای بررسی نیست', 'Nothing to analyze'],
    'bk.badJson': ['فایل JSON معتبر نیست', 'Invalid JSON file'],
    'bk.unknownFormat': ['قالب شناسایی نشد', 'Unrecognized format'],
    'bk.encryptedNote': ['این فایل رمزدار است؛ رمزش را وارد کنید.', 'This backup is encrypted; enter its password.'],
    'bk.enterPass': ['رمز پشتیبان', 'Backup password'],
    'bk.decrypt': ['بازگشایی', 'Decrypt'],
    'bk.wrongPass': ['رمز درست نیست', 'Wrong password'],
    'bk.nProfiles': ['{n} پروفایل', '{n} profiles'],
    'bk.fullBackup': ['پشتیبان کامل', 'Full backup'],
    'bk.conflict': ['هم‌نام — جایگزین می‌شود', 'name clash — will replace'],
    'bk.soRulesNote': ['قوانین «سوییچ خودکار» از فایل ZeroOmega هم منتقل می‌شوند (فقط قانون‌هایی که پروفایل موجود دارند).', 'Auto-switch rules from the ZeroOmega file are also migrated (only ones targeting existing profiles).'],
    'bk.previewTitle': ['پیش‌نمایش بازیابی', 'Import preview'],
    'bk.importMode': ['حالت بازیابی', 'Import mode'],
    'bk.merge': ['ادغام', 'Merge'],
    'bk.replace': ['جایگزینی کامل', 'Full replace'],
    'bk.modeDesc': ['ادغام: پروفایل‌های هم‌نام جایگزین و بقیه اضافه می‌شوند. جایگزینی: همه‌چیز با فایل جدید عوض می‌شود.', 'Merge: same-name profiles replace, others append. Replace: everything is swapped with the file.'],
    'bk.imported': ['بازیابی انجام شد', 'Import complete'],
    'bk.importedFrom': ['درون‌ریزی از', 'Imported from'],
    'bk.snapTitle': ['نسخه‌های پشتیبان خودکار', 'Automatic snapshots'],
    'bk.snapDesc': ['قبل از هر تغییر مهم (ورودی، حذف، بازنشانی و…) به‌صورت خودکار تا ۱۰ نسخه محلی نگه داشته می‌شود.', 'Up to 10 local snapshots are kept automatically before every major change (import, delete, reset…).'],
    'bk.autoSnap': ['خودکار', 'automatic'],
    'bk.restore': ['بازیابی', 'Restore'],
    'bk.restoreConfirm': ['وضعیت فعلی با این نسخه جایگزین شود؟', 'Replace current state with this snapshot?'],
    'bk.restored': ['نسخه بازیابی شد', 'Snapshot restored'],
    'bk.dlSnap': ['دانلود این نسخه', 'Download this snapshot'],
    'bk.noSnap': ['هنوز نسخه‌ای ذخیره نشده', 'No snapshots yet'],

    /* ---------- about ---------- */
    'about.features': ['چه چیزهایی دارد؟', 'What is inside?'],
    'about.f1': ['۱۰ پروفایل آماده برای Hiddify، v2rayN، NekoBox، Happ، Clash، Tor، Psiphon و…', '10 ready profiles for Hiddify, v2rayN, NekoBox, Happ, Clash, Tor, Psiphon…'],
    'about.f2': ['سوییچ خودکار هوشمند با قوانین دامنه/آدرس/Regex و پیش‌تنظیم «ایران مستقیم»', 'Smart auto-switch with domain/URL/regex rules and the "Iran direct" preset'],
    'about.f3': ['۸ تم رنگی iOS-سبک + حالت شب خودکار + فونت وزیرمتن', '8 iOS-style themes + auto dark mode + Vazirmatn font'],
    'about.f4': ['بکاپ حرفه‌ای: رمزداری AES-256، اسنپ‌شات خودکار و درون‌ریزی از ZeroOmega', 'Pro backup: AES-256 encryption, auto snapshots, ZeroOmega import'],
    'about.f5': ['ذخیره خودکار همه تغییرات + همگام‌سازی اختیاری بین دستگاه‌ها', 'Autosave for every change + optional cross-device sync'],
    'about.f6': ['میان‌بر صفحه‌کلید، منوی راست‌کلیک و تست سرعت اتصال', 'Keyboard shortcuts, right-click menu, connection test'],
    'about.f7': ['بدون هیچ جمع‌آوری داده — همه‌چیز فقط روی دستگاه شما', 'Zero data collection — everything stays on your device'],
    'about.credits': ['سپاس و اعتبارها', 'Credits'],
    'about.creditsDesc': ['این پروژه با الهام از افزونه‌های بزرگ مدیریت پروکسی ساخته شده و قدردان زحمات جامعه متن‌باز فارسی است.', 'Inspired by the great proxy-manager extensions; grateful to the Persian open-source community.'],
    'about.privacy': ['حریم خصوصی', 'Privacy'],
    'about.privacyDesc': ['هیچ داده‌ای به هیچ سروری ارسال نمی‌شود. پروفایل‌ها و تنظیمات فقط در حافظه داخلی مرورگر (و در صورت فعال‌سازی، در حساب همگام‌ساز خودتان) ذخیره می‌شوند.', 'No data is ever sent to any server. Profiles and settings live only in your browser storage (and your own sync account if enabled).'],
    'about.license': ['مجوز', 'License'],
    'about.licenseDesc': ['منتشرشده با مجوز MIT — آزاد برای استفاده، تغییر و انتشار. کد منبع برای انتشار در گیت‌هاب آماده است.', 'Released under the MIT license — free to use, change and publish. Source is ready for GitHub.'],
  };

  function t(key, vars) {
    var e = MSG[key];
    var s = e ? (lang === 'fa' ? e[0] : e[1]) : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return s;
  }

  return {
    t: t,
    setLang: function (l) {
      lang = (l === 'en') ? 'en' : 'fa';
      try { localStorage.setItem('pfm:lang', lang); } catch (e) { /* SW / file */ }
    },
    lang: function () { return lang; },
    /* inline bilingual helper: L('فارسی', 'English') */
    tLang: function (fa, en) { return lang === 'fa' ? fa : en; },
    fmtNum: function (n) {
      try { return new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(n); }
      catch (e) { return String(n); }
    },
    fmtDate: function (ts) {
      try {
        return new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts));
      } catch (e) { return new Date(ts).toLocaleString(); }
    },
    fmtBytes: function (b) {
      var kb = b / 1024;
      if (kb >= 1024) return i18n.fmtNum(Math.round(kb / 10.24) / 100) + ' MB';
      return i18n.fmtNum(Math.max(1, Math.round(kb))) + ' KB';
    },
  };
})();

/* boot-time cached language (set by theme.js applyLangGlobal / boot.js) */
try {
  var cachedLang = localStorage.getItem('pfm:lang');
  if (cachedLang) i18n.setLang(cachedLang);
} catch (e) { /* service worker */ }
