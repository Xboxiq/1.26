// =============================================================
// DIWAN — Wire ticker, Letterhead, Tab bar, Mini rail
// =============================================================

function WireTicker() {
  const items = [
    { id: 'TQ-2026-08-1417', who: 'علي عبدالله',     act: 'فُتح كشف ميداني',     svc: 'CS0001' },
    { id: 'TQ-2026-08-1413', who: 'هدى محمود',       act: 'مطالبة مالية صدرت',  svc: 'CT0009' },
    { id: 'TQ-2026-08-1409', who: 'حسن جاسم',        act: 'تقسيط موافق عليه',    svc: 'CB0006' },
    { id: 'TQ-2026-08-1407', who: 'سرى ناجي',        act: 'تنبيه خطر — تنفيذ',   svc: 'CA0002' },
    { id: 'TQ-2026-08-1402', who: 'أحمد علي',        act: 'نقل ملكية',           svc: 'CS0011' },
    { id: 'TQ-2026-08-1395', who: 'مريم رياض',       act: 'نقل مقياس',           svc: 'CT0008' },
    { id: 'TQ-2026-08-1389', who: 'وداد جاسم',       act: 'دفع قائمة 84,500 د.ع', svc: 'CB0001' },
    { id: 'TQ-2026-08-1382', who: 'كهرباء الكرادة',  act: 'إصدار نموذج جديد',    svc: 'CS0010' },
  ];
  const strip = (
    <div className="wire__strip">
      {[...items, ...items].map((it, i) => (
        <span key={i} className="wire__item">
          <span className="wire__pulse" />
          <span className="wire__id">{it.id}</span>
          <span>·</span>
          <span style={{ opacity: 0.9 }}>{it.who}</span>
          <span style={{ opacity: 0.7 }}>{it.act}</span>
          <span style={{ opacity: 0.6 }}>[{it.svc}]</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="wire">
      <span className="wire__lbl">LIVE · على الهواء</span>
      <div className="wire__track">{strip}</div>
    </div>
  );
}

function Letterhead() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const dateStr = now.toLocaleDateString('ar-IQ-u-ca-gregory', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return (
    <header className="head">
      <div className="head__seal">
        <div className="head__mark"><img src="assets/logo.png" alt="" /></div>
        <div className="head__title">
          <span className="ar">تدفّق الخير</span>
          <span className="div" />
          <span className="en">RASAFA · SUBSCRIBER SERVICES · DIWAN 014</span>
        </div>
      </div>
      <div className="head__center">
        <div className="sub">السجل الرسمي للخدمات</div>
        <div className="reg">REGISTRUM SERVITIORUM · VOL. XIV</div>
        <div className="frame">
          <span className="dot" />
          <span>{dateStr} · {timeStr}</span>
        </div>
      </div>
      <div className="head__user">
        <div className="head__who">
          <strong>م. كرار البياتي</strong>
          <small>RS-014 · مشرف نوبة الصباح</small>
        </div>
        <div className="head__avatar">كب</div>
      </div>
    </header>
  );
}

const NAV = [
  { key: 'home',    label: 'الديوان',        num: '01', icon: 'auto_stories' },
  { key: 'reg',     label: 'سجلّ الخدمات',  num: '02', icon: 'library_books' },
  { key: 'cases',   label: 'الإضبارات',      num: '03', icon: 'folder_special' },
  { key: 'fees',    label: 'لائحة الأجور',   num: '04', icon: 'request_quote' },
  { key: 'guide',   label: 'دليل الإجراءات', num: '05', icon: 'menu_book' },
];

function TabBar({ route, onNav }) {
  return (
    <nav className="tabs" role="tablist">
      {NAV.map(it => (
        <button
          key={it.key}
          role="tab"
          aria-selected={route === it.key}
          className={`tab ${route === it.key ? 'is-on' : ''}`}
          onClick={() => onNav(it.key)}
        >
          <span className="tab__num">{it.num}</span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}

function MiniRail({ route, onNav }) {
  return (
    <aside className="minirail" aria-label="quick">
      {NAV.map(it => (
        <button
          key={it.key}
          className={`minirail__btn ${route === it.key ? 'is-on' : ''}`}
          onClick={() => onNav(it.key)}
          title={it.label}
          aria-label={it.label}
        >
          <Icon name={it.icon} />
        </button>
      ))}
      <span className="minirail__sep" />
      <button className="minirail__btn" title="بحث" aria-label="بحث"><Icon name="search" /></button>
      <button className="minirail__btn" title="إشعارات" aria-label="إشعارات"><Icon name="notifications" /></button>
      <button className="minirail__btn" title="الإعدادات" aria-label="الإعدادات"><Icon name="settings" /></button>
      <button className="minirail__sos" title="بلاغ طارئ — CA0002" aria-label="بلاغ طارئ">
        <Icon name="crisis_alert" />
      </button>
    </aside>
  );
}

Object.assign(window, { WireTicker, Letterhead, TabBar, MiniRail, NAV });
