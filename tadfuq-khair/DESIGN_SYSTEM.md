# Tadfuq Al-Khayr — Design System v1.0 (Handoff Spec)

منصة خدمات المشتركين لشبكة الكهرباء — ٣١ خدمة عبر ٤ أقسام (CS اشتراكات / CT فنية / CB فواتير / CA شكاوى).
هذا الملف هو المرجع الأول لأي عمل قادم (Claude Code أو مطوّر بشري).

## Entry points
| File | What |
|---|---|
| `portal.html` | **بوابة الدخول** — فهرس كل المنصة والمختبرات |
| `final3d.html` | **النسخة المعتمدة الحالية** — React + Babel inline, RTL Arabic |
| `final.html` | نفس التطبيق بدون طبقة 3D tilt |
| `اتجاهات التصميم.html` | **جديد** — ١٠ اتجاهات بصرية + ترشيح ☆ للاختيار |
| `كل المقترحات.html` | أرشيف المختبرات في صفحة واحدة |
| `Design System.html` | الدليل البصري الحي (tokens, type, icons, materials, motion) |
| `versions/v1-approved/` | Snapshot معتمد قبل طبقات التجارب — لا تلمسه |
| `uploads/form_example-*.docx` | الفورمة الأصلية الحكومية (CS0001) — مصدر "النسخة الأصلية" في صفحة الفورمة |

## Architecture (layered CSS — order matters)
1. `final.css` — tokens + core components (top bar, deck, cards, buttons, form, cases)
2. `final_pages.css`, `final_hub.css`, `final_advisory.css`, `final_apple.css`, `final_polish.css`, `final_icons.css`, `final_micro.css`, `final_sticker.css`, `final_spotlight.css` — feature layers
3. `final_elite.css` — typography upgrade (Alexandria/Readex) + frosted energy ring + UX-audit fixes
4. `final_trends.css` + `final_trends.js` — ambient layer: aurora field, film grain, cursor glow, scroll reveal, progressive glass top bar. **Framework-free, additive, removable.**
5. `final_chroma.css` — color/gradient discipline (Vercel buttons × Apple glass CTAs × Notion calm canvas). **Loads last, wins.**

JSX (Babel standalone, each file exports via `Object.assign(window, {...})`):
`final_globals.jsx` → `final_spotlight.jsx` → `final_services.jsx` → `final_form.jsx` → `final_cases.jsx` → `final.jsx` (App, mounts last).

## Tokens (source: final.css `:root` + `.f-body.dark`)
- Canvas: `--f-bg #fafaf7` (warm paper), surfaces `--f-surface/2/3`, ink `--f-ink #161513` + 2 muted steps
- Primary: `--f-navy #1e2a4d`, accent `--f-gold #b8861b`
- Departments (muted): CS `#4a6285` slate · CT `#8a7350` bronze · CB `#4e7a7d` teal · CA `#8a5560` rose. Dark mode = pastel oklch variants.
- **Tint ramp rule:** dept color only ever at 11% fill / 22% border / 100% glyph. Open-panel wash: 9%→4%→0 @155deg.
- Type: `--f-disp` Alexandria (headings) · `--f-arab` Readex Pro (body) · `--f-mono` Geist Mono (codes/numbers, always `direction:ltr`)
- Motion: `--f-spring cubic-bezier(0.34,1.3,0.45,1)` — micro 180ms, transitions 420ms, deck expand 620ms. All gated by `prefers-reduced-motion`.
- Materials: one top light source — every raised card gets inset top specular. Glass = `blur(34px) saturate(1.9)` on 88% surface.

## Custom icons — `ds_icons.js`
Hand-drawn 24×24 stroke-1.75 sprite (`TadfuqIcons.mount()` / `TadfuqIcons.el(name, size)`).
Names: tdq-subscriptions, tdq-technical, tdq-billing, tdq-reports, tdq-meter, tdq-pole, tdq-cable, tdq-plug, tdq-tower, tdq-gauge-max, tdq-form, tdq-stamp, tdq-fees, tdq-case, tdq-add-service, tdq-guide.
Material Symbols stays for generic actions only (search/close/print). New service icons: add a `<symbol>` to ICONS following the same stroke language.

## Data model — `data.js` (single source of truth)
- `window.SECTIONS` — 4 depts {code, name, color, icon, blurb}
- `window.SERVICES` — 31 items `{code, section, name, sla, popularity, fixedPrice|hasPrice+priceNote, icon, fees?[]}`
- `window.PRICING` — 2026 fee tables (kashf, cut/restore, meter swap, …)
- **Adding a service = adding one object.** Deck counts, wallet, Spotlight, services grid, fee calculator all derive from it.

## Key UX contracts
- Navigation is in-app state (`nav(page, params)` in final.jsx). Suggested next step: hash deep-links (`#/form/CS0001`).
- Spotlight: ⌘K/Ctrl+K overlay (final_spotlight.jsx) — popular services pre-query, arrows+Enter nav.
- Form page: tabs احترافية/أصلية, autosave to localStorage (never clear foreign keys), auto fee total, print = original layout.
- Advisory ticker on dashboard: rotates per load; designed to become editable (add/edit tips) later.
- Touch targets ≥44px (invisible expanded hit areas in final_elite.css). `touch-action: manipulation` everywhere.

## Don'ts
- لا تدرجات صارخة ولا ألوان جديدة — استعمل سُلّم الشفافية على ألوان الأقسام أو oklch قريب منها.
- لا تلمس `versions/v1-approved/` ولا تكسر `<style id="__om-edit-overrides">` إن وُجد.
- الأرقام والأكواد دائماً Geist Mono LTR داخل سياق RTL.

## [مقترح — غير مطبق، قيد التجربة في Adoption Bank] Color semantics (لماذا هذا اللون هنا)
| Token | اللون | المعنى | أين يظهر |
|---|---|---|---|
| `--f-cs` | كوبالت | ثقة — بداية العلاقة الرسمية | كل ما يخص الاشتراكات |
| `--f-ct` | تيل بحري | دقة الأجهزة والعمل الميداني | الطلبات الفنية، الفحوصات |
| `--f-cb` | برونز ذهبي | العملة والمال | الفواتير، الأجور، التقسيط |
| `--f-ca` | خشب الورد | جدية إدارية — قريب الإنذار دون أن يكونه | البلاغات والشكاوى الإدارية |
| `--f-navy` | كحلي عميق | الفعل الأساسي الوحيد (Von Restorff) | زر CTA واحد لكل شاشة |
| `--f-ok/warn/err` | أخضر/عنبر/أحمر | لغة سلامة — **لا تُستعمل للهوية أبداً** | حالات المعاملات فقط؛ الأحمر حصراً للتدميري (قطع/إلغاء) |

## [مقترح — غير مطبق] Laws of UX — أين سيُطبّق كل قانون (lawsofux.com)
| القانون | التطبيق في المنصة |
|---|---|
| Hick | الرئيسية تعرض 4 أقسام فقط — الخدمات الـ 31 تظهر بعد اختيار القسم (progressive disclosure) |
| Miller | الخدمات مقسومة إلى 4 مجموعات ≤9 — لا قائمة واحدة طويلة |
| Fitts | أهداف لمس ≥44px + hit-area موسعة خفية (final_elite.css) + CTA كبير قريب من مسار العين |
| Jakob | أنماط مألوفة: ⌘K Spotlight، تبويبات، بحث أعلى الصفحة، breadcrumb الحالات |
| Von Restorff | لون فعل واحد (كحلي) — زر بارز واحد لكل شاشة، والخطر أحمر حصري |
| Doherty | كل تفاعل يرد خلال <400ms (micro 180ms / transition 420ms) — autosave صامت |
| Proximity/Common Region | الأجور مجموعة في محفظة واحدة؛ كل خدمة بطاقة بحدود واضحة |
| Serial Position | الأكثر طلباً أول الشبكة (popularity sort) والإجراءات الحرجة آخر الفورمة |
| Goal-Gradient | شريط تقدم الفورمة يُظهر المنجز، وحلقات الأقسام تمتلئ عند الاقتراب |
| Peak-End | لحظة الذروة = اعتماد الأجور (طقس الختم/الإيصال)، والنهاية = تأكيد أخضر هادئ |
| Aesthetic-Usability | الزجاج + السبرنغ ليسا زخرفة — يرفعان التسامح مع الأخطاء الصغيرة |
| Tesler | التعقيد الذي لا يُحذف (جداول أجور 2026) يتحمله النظام: الحاسبة تلقائية لا يدوية |
| Reduced Motion | كل حركة خلف `prefers-reduced-motion` — المحتوى يظهر دائماً بدونها |
