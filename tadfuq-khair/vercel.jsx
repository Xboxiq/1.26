// =============================================================
// Vercel-style Dashboard
// Pure monochrome, deployment-list aesthetic
// =============================================================

const { useState, useEffect, useMemo, useRef } = React;

function Icon({ name, size }) {
  return <span className="material-symbols-outlined" style={size ? { fontSize: size } : null}>{name}</span>;
}

function TriangleLogo() {
  return (
    <span className="v-tri" aria-hidden="true">
      <svg viewBox="0 0 76 65" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
    </span>
  );
}

// =============================================================
// Top Chrome
// =============================================================
function TopChrome({ tab, setTab, dark, setDark }) {
  return (
    <div className="v-top">
      <div className="v-top__row">
        <a className="v-top__brand" href="#">
          <TriangleLogo />
          tadfuq
        </a>
        <span className="v-top__sep" />
        <button className="v-top__team">
          <span className="v-top__team-ico">رص</span>
          <span>RS-014 · الرصافة</span>
          <Icon name="unfold_more" />
        </button>
        <span className="v-top__push" />
        <div className="v-top__actions">
          <button className="v-search">
            <Icon name="search" />
            <span className="v-search__input">ابحث…</span>
            <span className="v-kbd">⌘K</span>
          </button>
          <button className="v-iconbtn" title="Changelog"><Icon name="article" /></button>
          <button className="v-iconbtn" title="Help"><Icon name="help" /></button>
          <button className="v-iconbtn" onClick={() => setDark(!dark)} title="Theme">
            <Icon name={dark ? 'light_mode' : 'dark_mode'} />
          </button>
          <button className="v-iconbtn"><Icon name="notifications" /></button>
          <button className="v-avatar">كب</button>
        </div>
      </div>
      <div className="v-tabs">
        {[
          { k: 'overview', l: 'نظرة عامة' },
          { k: 'services', l: 'الخدمات' },
          { k: 'cases',    l: 'الحالات' },
          { k: 'reports',  l: 'التقارير' },
          { k: 'pricing',  l: 'الأجور' },
          { k: 'settings', l: 'الإعدادات' },
        ].map(t => (
          <button key={t.k} className={`v-tab ${tab === t.k ? 'is-on' : ''}`} onClick={() => setTab(t.k)}>
            {t.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================
// Sparkline (fake but believable)
// =============================================================
function Spark({ seed = 7 }) {
  const bars = useMemo(() => {
    const a = [];
    let n = seed;
    for (let i = 0; i < 14; i++) {
      n = (n * 9301 + 49297) % 233280;
      a.push(20 + (n / 233280) * 80);
    }
    return a;
  }, [seed]);
  return (
    <div className="v-spark" aria-hidden="true">
      {bars.map((h, i) => <span key={i} style={{ height: h + '%' }} />)}
    </div>
  );
}

// =============================================================
// Stats strip
// =============================================================
function StatStrip() {
  const k = window.KPIS;
  return (
    <div className="v-stats">
      <div className="v-stat">
        <div className="v-stat__lbl"><Icon name="bolt" /> طلبات اليوم</div>
        <div className="v-stat__val">
          {k.todayCases}
          <span className="v-stat__unit">طلب</span>
        </div>
        <span className="v-stat__delta up"><Icon name="arrow_upward" /> +12% مقارنة بأمس</span>
        <div className="v-stat__spark"><Spark seed={3} /></div>
      </div>
      <div className="v-stat">
        <div className="v-stat__lbl"><Icon name="pending_actions" /> قيد المعالجة</div>
        <div className="v-stat__val">
          {k.pending}
          <span className="v-stat__unit">حالة</span>
        </div>
        <span className="v-stat__delta up"><Icon name="arrow_upward" /> +5%</span>
        <div className="v-stat__spark"><Spark seed={9} /></div>
      </div>
      <div className="v-stat">
        <div className="v-stat__lbl"><Icon name="payments" /> محصّل اليوم</div>
        <div className="v-stat__val">
          {fmt(k.collected)}
          <span className="v-stat__unit">د.ع</span>
        </div>
        <span className="v-stat__delta up"><Icon name="arrow_upward" /> +8%</span>
        <div className="v-stat__spark"><Spark seed={17} /></div>
      </div>
      <div className="v-stat">
        <div className="v-stat__lbl"><Icon name="sentiment_satisfied" /> رضا المشتركين</div>
        <div className="v-stat__val">
          {k.satisfaction}
          <span className="v-stat__unit">%</span>
        </div>
        <span className="v-stat__delta up"><Icon name="arrow_upward" /> +2%</span>
        <div className="v-stat__spark"><Spark seed={11} /></div>
      </div>
    </div>
  );
}

// =============================================================
// Projects grid (departments as "projects")
// =============================================================
function ProjectsGrid() {
  const todayBySection = { CS: 28, CT: 19, CB: 31, CA: 6 };
  return (
    <>
      <div className="v-h2">
        <div>
          <h2>الأقسام</h2>
          <div className="v-h2-sub">{window.SERVICES.length} خدمة موزّعة على 4 أقسام</div>
        </div>
        <button className="v-btn"><Icon name="add" /> قسم جديد</button>
      </div>
      <div className="v-grid">
        {window.SECTIONS.map(s => {
          const services = window.SERVICES.filter(v => v.section === s.code);
          const today = todayBySection[s.code] ?? 0;
          return (
            <button key={s.code} className="v-project">
              <div className="v-project__top">
                <span className="v-project__ico">
                  <Icon name={s.icon} />
                </span>
                <button className="v-project__menu" onClick={(e) => e.stopPropagation()}>
                  <Icon name="more_horiz" />
                </button>
              </div>
              <h3 className="v-project__name">{s.name}</h3>
              <div className="v-project__meta">
                <span><b>{services.length}</b> خدمة</span>
                <span><b>{today}</b> اليوم</span>
              </div>
              <div className="v-project__activity">
                <span className="v-project__pulse" />
                <span>آخر نشاط منذ دقيقتين · {s.code.toLowerCase()}.tadfuq.iq</span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

// =============================================================
// Deployments-style activity feed
// =============================================================
function Activity() {
  return (
    <div className="v-card">
      <div className="v-card__head">
        <div>
          <h3 className="v-card__title">آخر النشاط</h3>
          <p className="v-card__sub">السجل اللحظي للطلبات والمعاملات في مركزك</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span className="v-live">على الهواء</span>
          <button className="v-btn v-btn--ghost"><Icon name="filter_alt" /> فلترة</button>
        </div>
      </div>
      <div className="v-feed">
        {window.RECENT_CASES.map(c => {
          const svc = window.SERVICE_MAP[c.svc];
          const cls = c.priority === 'urgent' ? 'err' : c.priority === 'vip' ? 'warn' : '';
          return (
            <div key={c.id} className="v-feed__row">
              <span className="v-feed__hash">{c.id.split('-').pop()}</span>
              <div className="v-feed__main">
                <span className="v-feed__svc">{svc.code}</span>
                <span className="v-feed__who">{c.subscriber}</span>
                <span style={{color:'var(--v-text-2)',fontWeight:400,fontSize:'0.82rem'}}>· {svc.name}</span>
              </div>
              <span className={`v-status ${cls}`}>{c.status}</span>
              <span className="v-pill v-pill--gray">{c.officer}</span>
              <span className="v-feed__time">{c.age}</span>
            </div>
          );
        })}
      </div>
      <div className="v-card__foot">
        <span>عرض 6 من 213 حالة نشطة</span>
        <a href="#" style={{color:'var(--v-text)',fontWeight:500}}>عرض الكل ←</a>
      </div>
    </div>
  );
}

// =============================================================
// Services list (Vercel "deployments" style table)
// =============================================================
function ServicesList() {
  const [q, setQ] = useState('');
  const [sec, setSec] = useState('all');

  const list = useMemo(() => {
    return window.SERVICES.filter(s => {
      if (sec !== 'all' && s.section !== sec) return false;
      if (q.trim() && !s.name.includes(q.trim()) && !s.code.includes(q.trim())) return false;
      return true;
    }).sort((a, b) => b.popularity - a.popularity).slice(0, 12);
  }, [q, sec]);

  return (
    <div className="v-card">
      <div className="v-card__head">
        <div>
          <h3 className="v-card__title">دليل الخدمات</h3>
          <p className="v-card__sub">جميع الخدمات الـ {window.SERVICES.length} مرتبة حسب الاستخدام</p>
        </div>
        <button className="v-btn v-btn--primary"><Icon name="add" /> خدمة جديدة</button>
      </div>
      <div className="v-filterbar">
        <div className="v-filterbar__search">
          <Icon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم الخدمة أو رقمها…" />
        </div>
        <button className={`v-chip ${sec === 'all' ? 'is-on' : ''}`} onClick={() => setSec('all')}>
          الكل <span className="v-chip__n">{window.SERVICES.length}</span>
        </button>
        {window.SECTIONS.map(s => (
          <button key={s.code} className={`v-chip ${sec === s.code ? 'is-on' : ''}`} onClick={() => setSec(s.code)}>
            {s.code} <span className="v-chip__n">{window.SERVICES.filter(x => x.section === s.code).length}</span>
          </button>
        ))}
      </div>
      <div>
        {list.map(svc => {
          const sec = window.SECTION_MAP[svc.section];
          return (
            <div key={svc.code} className="v-row">
              <span className="v-row__lead" />
              <div className="v-row__main">
                <div className="v-row__title">
                  {svc.name}
                  <span className="v-code">/{svc.code}</span>
                </div>
                <div className="v-row__sub">
                  {sec.name} · مدة {svc.sla}ي · طلب {svc.popularity}٪
                </div>
              </div>
              <span className="v-pill v-pill--success v-pill--dot">فعّال</span>
              <div className="v-row__meta">
                {svc.fixedPrice ? fmtIQD(svc.fixedPrice) : svc.priceNote || 'حسب الصنف'}
                <small>الأجور</small>
              </div>
              <div className="v-row__meta">
                {svc.sla} أيام
                <small>SLA</small>
              </div>
              <button className="v-row__cta"><Icon name="chevron_left" /></button>
            </div>
          );
        })}
      </div>
      <div className="v-card__foot">
        <span>عرض {list.length} من {window.SERVICES.length}</span>
        <a href="#" style={{color:'var(--v-text)',fontWeight:500}}>الصفحة التالية ←</a>
      </div>
    </div>
  );
}

// =============================================================
// Sidebar: usage / quick / tip
// =============================================================
function Sidebar() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div className="v-card">
        <div className="v-card__head">
          <div>
            <h3 className="v-card__title">الاستخدام هذا الشهر</h3>
            <p className="v-card__sub">٢٤٨١ حالة · ٩٤٪ ضمن SLA</p>
          </div>
        </div>
        <div className="v-card__body v-card__body--p">
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {window.SECTIONS.map((s, i) => {
              const count = window.SERVICES.filter(x => x.section === s.code).length * 19;
              const pct = Math.min(100, Math.round((count / 600) * 100));
              return (
                <div key={s.code}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <span style={{fontSize:'0.8rem',fontWeight:500,letterSpacing:'-0.005em'}}>
                      <span style={{fontFamily:'var(--v-font-mono)',fontSize:'0.72rem',color:'var(--v-text-3)',marginInlineEnd:6}}>{s.code}</span>
                      {s.name}
                    </span>
                    <span style={{fontFamily:'var(--v-font-mono)',fontSize:'0.76rem',color:'var(--v-text-2)'}}>{count}</span>
                  </div>
                  <div style={{height:4,background:'var(--v-bg-3)',borderRadius:999,overflow:'hidden'}}>
                    <div style={{width:pct+'%',height:'100%',background:'var(--v-text)',borderRadius:999}} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="v-card">
        <div className="v-card__head">
          <div>
            <h3 className="v-card__title">أوامر سريعة</h3>
            <p className="v-card__sub">اضغط <span className="v-kbd">⌘K</span> للبحث الشامل</p>
          </div>
        </div>
        <div style={{padding:'8px'}}>
          {[
            { lbl: 'فتح حالة جديدة', kbd: 'N', ico: 'add_circle' },
            { lbl: 'البحث برقم اشتراك', kbd: '/', ico: 'search' },
            { lbl: 'الانتقال إلى الحالات', kbd: 'G I', ico: 'inventory_2' },
            { lbl: 'الانتقال إلى الخدمات', kbd: 'G S', ico: 'apps' },
            { lbl: 'التبديل بين الفاتح والداكن', kbd: '⌘ J', ico: 'contrast' },
          ].map((it, i) => (
            <button key={i} style={{
              display:'flex',alignItems:'center',gap:10,
              padding:'8px 10px',width:'100%',
              border:0,background:'transparent',
              borderRadius:'var(--v-radius)',
              fontSize:'0.84rem',fontWeight:500,
              color:'var(--v-text)',
              transition:'background 140ms',
            }}
            onMouseEnter={(e)=>e.currentTarget.style.background='var(--v-bg-3)'}
            onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
              <Icon name={it.ico} />
              <span style={{flex:1, textAlign:'start'}}>{it.lbl}</span>
              <span className="v-kbd">{it.kbd}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="v-banner">
        <span className="v-banner__ico"><Icon name="lightbulb" /></span>
        <div>
          <b>تذكير</b>
          <div style={{marginTop:2}}>
            أرفق كتاب تأييد السكن المصدّق قبل تحويل طلب CS0001. <a href="#">اقرأ المزيد</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Page
// =============================================================
function App() {
  const [tab, setTab] = useState('overview');
  const [dark, setDark] = useState(false);
  useEffect(() => { document.body.classList.toggle('v-dark', dark); }, [dark]);

  return (
    <>
      <TopChrome tab={tab} setTab={setTab} dark={dark} setDark={setDark} />
      <main className="v-page">
        <div className="v-pagehead">
          <div>
            <h1>نظرة عامة</h1>
            <p>مركز الرصافة · الكرادة — كل البيانات الحيّة لمحطة عمل اليوم.</p>
          </div>
          <div className="v-pagehead__actions">
            <button className="v-btn"><Icon name="file_download" /> تصدير</button>
            <button className="v-btn"><Icon name="filter_alt" /> فلترة</button>
            <button className="v-btn v-btn--primary"><Icon name="add" /> طلب جديد</button>
          </div>
        </div>

        <StatStrip />

        <ProjectsGrid />

        <div className="v-two">
          <Activity />
          <Sidebar />
        </div>

        <div style={{ marginTop: 24 }}>
          <ServicesList />
        </div>
      </main>

      <a className="v-floatcompare" href="index.html">
        مقارنة مع النسخة الأصلية
        <span className="v-floatcompare__btn">
          <Icon name="arrow_back" /> افتح
        </span>
      </a>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
