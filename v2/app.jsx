// =============================================================
// DIWAN — Fees ledger & Guide pages + App router
// =============================================================

function FeesPage({ onNav }) {
  return (
    <div className="reg fade-in">
      <Crumb trail={[
        { label: 'الديوان', onClick: () => onNav('home') },
        { label: 'لائحة الأجور الرسمية' },
      ]} />
      <header className="reg__intro">
        <h1 className="big">لائحة الأجور<br/><em>٢٠٢٦</em></h1>
        <p className="lede">
          المرجع الرسمي لكافة أجور الخدمات المقدّمة من قبل شركة توزيع كهرباء بغداد — الرصافة. تُحتسب الأجور تلقائياً داخل نماذج الخدمات بناءً على هذه اللائحة.
        </p>
        <div className="meta">REF: FEE/2026/03 · 14.NOV.26</div>
      </header>

      {Object.entries(window.PRICING).map(([key, table]) => (
        <section key={key} className="reg__section">
          <div className="reg__index">
            <span className="l" style={{ fontSize: '2.6rem' }}>{key.slice(0,3).toUpperCase()}</span>
            <span className="n">{table.items.length.toString().padStart(2,'0')} · ITEMS</span>
            <span className="nm">{table.label}</span>
          </div>
          <div className="reg__items">
            {table.items.map(it => (
              <div key={it.key} className="svc" style={{ cursor: 'default' }}>
                <div className="svc__num" style={{ fontSize: '1.1rem' }}>—</div>
                <div>
                  <h3 className="svc__title">{it.name}</h3>
                </div>
                <div className="svc__sla" style={{ fontSize: '1.4rem', color: 'var(--crimson)' }}>
                  {fmtIQD(it.amount)}
                  <small>د.ع</small>
                </div>
                <span />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function GuidePage({ onNav, onPick }) {
  return (
    <div className="reg fade-in">
      <Crumb trail={[
        { label: 'الديوان', onClick: () => onNav('home') },
        { label: 'دليل الإجراءات' },
      ]} />
      <header className="reg__intro">
        <h1 className="big">دليل<br/>الإجراءات</h1>
        <p className="lede">
          شرح موحّد للموظفين: لكلّ خدمة من ثلاثين خدمة، متى تقدّم، شروطها، وثائقها، وأخطاؤها الشائعة.
          استخدم الدليل كمرجع سريع أثناء التعبئة.
        </p>
        <div className="meta">REF: GUIDE/2026 · 14.NOV.26</div>
      </header>
      {window.SECTIONS.map(s => {
        const items = window.SERVICES.filter(x => x.section === s.code);
        return (
          <section key={s.code} className="reg__section">
            <div className="reg__index" style={{ '--ix-c': s.color }}>
              <span className="l">{s.code}</span>
              <span className="n">{items.length} · SERVICES</span>
              <span className="nm">{s.name}</span>
            </div>
            <div className="reg__items">
              {items.map(svc => (
                <div key={svc.code} className="svc" style={{ '--svc-c': s.color }} onClick={() => onPick(svc.code)}>
                  <div className="svc__num">{svc.code.slice(2)}<small>{svc.code.slice(0,2)}</small></div>
                  <div>
                    <h3 className="svc__title">{svc.name}</h3>
                    <div className="svc__meta">مدّة معتادة {svc.sla} أيام عمل</div>
                  </div>
                  <div className="svc__sla" style={{ fontSize: '1rem' }}>اقرأ الدليل<small>تعليمات كاملة</small></div>
                  <span className="svc__arrow">افتح <Icon name="arrow_back" size={14} /></span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ---------- ROUTER ----------
function App() {
  const [route, setRoute] = useState(() => {
    try { return JSON.parse(localStorage.getItem('diwan-route') || '{"name":"home"}'); }
    catch { return { name: 'home' }; }
  });
  useEffect(() => { localStorage.setItem('diwan-route', JSON.stringify(route)); }, [route]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [route.name, route.code, route.section]);

  const nav = (name, params = {}) => setRoute({ name, ...params });
  const railRoute =
    route.name === 'detail' || route.name === 'form' ? 'reg' :
    route.name === 'case' ? 'cases' :
    route.name;

  let page = null;
  switch (route.name) {
    case 'home':
      page = <Home onNav={nav} onPick={(code) => nav('detail', { code })} />;
      break;
    case 'reg':
      page = <Registry initialSection={route.section || 'all'} onPick={(code) => nav('detail', { code })} onNav={nav} />;
      break;
    case 'detail':
      page = <ServiceDetail code={route.code} onNav={nav} onStart={() => nav('form', { code: route.code })} />;
      break;
    case 'form':
      page = <FormPage code={route.code} onNav={nav} onCases={() => nav('cases')} />;
      break;
    case 'cases':
      page = <Cases onOpen={(c) => nav('case', { id: c.id, svc: c.svc })} onNav={nav} />;
      break;
    case 'case':
      page = <CaseDetail caseData={SAMPLE_CASE} onBack={() => nav('cases')} onNav={nav} />;
      break;
    case 'fees':
      page = <FeesPage onNav={nav} />;
      break;
    case 'guide':
      page = <GuidePage onNav={nav} onPick={(code) => nav('detail', { code })} />;
      break;
    default:
      page = <Home onNav={nav} onPick={(code) => nav('detail', { code })} />;
  }

  return (
    <div className="diwan">
      <WireTicker />
      <Letterhead />
      <TabBar route={railRoute} onNav={nav} />
      <div className="shell">
        <div className="column">
          <div className="page">{page}</div>
        </div>
        <MiniRail route={railRoute} onNav={nav} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
