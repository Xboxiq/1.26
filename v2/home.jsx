// =============================================================
// DIWAN — Home (editorial dashboard)
// =============================================================

function Home({ onNav, onPick }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Live ticking counter (visual flair)
  const [tickIn, setTickIn] = useState(84);
  useEffect(() => {
    const t = setInterval(() => setTickIn(n => n + (Math.random() < 0.3 ? 1 : 0)), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="home fade-in">
      {/* ---------- MASTHEAD ---------- */}
      <section className="mast">
        <div className="mast__left">
          <div className="mast__date">
            <span><span className="vol">VOL. XIV</span> · العدد ٢٤٧</span>
            <span>الأحد، ١٤ تشرين الثاني ٢٠٢٦</span>
            <span>RS-014 · الكرادة</span>
          </div>
          <div>
            <h1 className="mast__hd">
              السجل الرسمي<br/>
              لـ<em>خدمات المشتركين</em>
              <span className="sm">— ثلاثون خدمة، أربعة أقسام، نظام موحّد —</span>
            </h1>
            <p className="mast__lede">
              منصة موظفي خدمات المشتركين في مركز توزيع كهرباء الرصافة. تعبئة، متابعة، استرجاع، وإصدار رسمي.
              نموذجان لكل خدمة: <strong style={{color:'var(--ink)'}}>الأصلي طبق الأصل</strong> و<strong style={{color:'var(--ink)'}}>الاحترافي المُعاد ترتيبه</strong> — بنفس البيانات وذات المنهجية.
            </p>
          </div>
          <div className="mast__cta">
            <Btn variant="crimson" size="lg" icon="add" onClick={() => onNav('reg')}>افتح طلب جديد</Btn>
            <Btn size="lg" icon="folder_open" onClick={() => onNav('cases')}>الإضبارات النشطة</Btn>
            <Btn variant="ghost" size="lg" icon="menu_book" onClick={() => onNav('guide')}>دليل الإجراءات</Btn>
          </div>
        </div>

        <div className="mast__right">
          <div className="now__row">
            <span className="now__lbl">في هذه اللحظة</span>
            <Stamp kind="ok">على الهواء</Stamp>
          </div>
          <div className="now__row">
            <div>
              <div className="now__big">{tickIn}<sup>طلب اليوم</sup></div>
              <div className="now__sub">أُدخلت في النظام منذ بداية الدوام</div>
            </div>
          </div>
          <div className="now__grid">
            <div className="now__cell">
              <div className="v">213</div>
              <div className="l">قيد المعالجة</div>
            </div>
            <div className="now__cell">
              <div className="v">06</div>
              <div className="l">بانتظار توقيعك</div>
            </div>
            <div className="now__cell">
              <div className="v">94<small style={{fontSize:'0.55em',fontWeight:700}}>٪</small></div>
              <div className="l">نسبة الرضا</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SPARK DIVIDER ---------- */}
      <div className="spark" />

      {/* ---------- DEPARTMENTS ---------- */}
      <section>
        <div className="rule">
          <span className="rule__num">II — الأقسام الأربعة</span>
          <h2 className="rule__title">قطاعات الخدمة</h2>
          <span className="rule__meta">٣٠ خدمة موزّعة وفق دليل ٢٠٢٦</span>
        </div>
        <div className="depts">
          {window.SECTIONS.map(s => {
            const count = window.SERVICES.filter(x => x.section === s.code).length;
            return (
              <div key={s.code} className="dept"
                   style={{ '--dept-c': s.color }}
                   onClick={() => onNav('reg', { section: s.code })}>
                <div className="dept__bg">{s.code}</div>
                <div className="dept__top">
                  <span className="dept__code">{s.code}</span>
                  <span className="dept__count">{count}<small>خدمة</small></span>
                </div>
                <h3 className="dept__name">{s.name}</h3>
                <p className="dept__sub">{s.blurb}</p>
                <span className="dept__arrow">
                  افتح القسم <Icon name="arrow_back" size={16} />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- DOCKET ---------- */}
      <section>
        <div className="rule">
          <span className="rule__num">III — جدول اليوم</span>
          <h2 className="rule__title">قائمة الطلبات المسلَّمة لك</h2>
          <span className="rule__meta">آخر تحديث: قبل دقيقة</span>
        </div>
        <div className="dock">
          <div className="dock__list">
            {window.RECENT_CASES.map((c, i) => {
              const svc = window.SERVICE_MAP[c.svc];
              const sec = window.SECTION_MAP[svc.section];
              return (
                <div key={c.id} className="docket" onClick={() => onPick(svc.code)}>
                  <span className="docket__num" style={{color: sec.color}}>{String(i+1).padStart(2,'0')}</span>
                  <div className="docket__main">
                    <span className="docket__svc">{c.svc} · {svc.name}</span>
                    <span className="docket__name">{c.subscriber}</span>
                    <span className="docket__who">{c.officer} · {c.status}</span>
                  </div>
                  {c.priority === 'urgent' && <Stamp kind="urgent">عاجل</Stamp>}
                  {c.priority === 'vip' && <Stamp kind="vip">VIP</Stamp>}
                  <span className="docket__time">{c.age}</span>
                </div>
              );
            })}
          </div>

          <aside className="log">
            <div className="log__title">
              <span className="dot" />
              <span>سجل الحركة الحيّ</span>
            </div>
            <div className="log__list">
              <div className="log__row">
                <span className="t">٠٩:٤٢</span>
                <span>الصندوق وَصَل قبض رقم <span className="id">38291</span> بمبلغ <strong>15,000 د.ع</strong> — رسوم طلب CS0001.</span>
              </div>
              <div className="log__row">
                <span className="t">٠٩:٣٥</span>
                <span>الفريق الفني خرج للكشف على عنوان <strong>محلة ٣١٨ — زقاق ٤٤</strong> · ساعة ميدانية متوقعة.</span>
              </div>
              <div className="log__row">
                <span className="t">٠٩:٢٢</span>
                <span>صدرت مطالبة مالية على ملف <span className="id">TQ-2026-08-1413</span> · <strong>60,000 د.ع</strong>.</span>
              </div>
              <div className="log__row">
                <span className="t">٠٩:١٠</span>
                <span>تم إغلاق <span className="id">TQ-2026-08-1406</span> — صنف منزلي، أحادي الطور. <strong>اشتراك ٠١٠٣٤٤٢٩٩٤٢</strong>.</span>
              </div>
              <div className="log__row">
                <span className="t">٠٨:٥٤</span>
                <span>المدير وقّع على تقسيط لـ <strong>دار النور التجارية</strong> — ٦ أقساط على ٦ أشهر.</span>
              </div>
              <div className="log__row">
                <span className="t">٠٨:٤٠</span>
                <span>افتتاح نوبة الصباح في مركز <strong>الكرادة — RS-014</strong> · ٣ موظفين، ٢ كاشير.</span>
              </div>
            </div>
            <div style={{
              paddingTop: 12,
              borderTop: '1.5px dashed var(--paper-line)',
              fontFamily: 'var(--d-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
              color: 'var(--ink-soft)',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span>BUFFER · 6 · 256</span>
              <a href="#" style={{ color: 'var(--crimson)', fontWeight: 800 }}>عرض السجل الكامل ←</a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Home });
