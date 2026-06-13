// =============================================================
// DIWAN — Registry (services as a sectioned register)
// =============================================================

function Registry({ initialSection = 'all', onPick, onNav }) {
  const [q, setQ] = useState('');
  const [sec, setSec] = useState(initialSection);

  const groups = useMemo(() => {
    const list = window.SERVICES.filter(s => {
      if (sec !== 'all' && s.section !== sec) return false;
      if (q.trim()) {
        const t = q.trim();
        return s.name.includes(t)
            || s.code.toLowerCase().includes(t.toLowerCase())
            || window.SECTION_MAP[s.section].name.includes(t);
      }
      return true;
    });
    // group by section, preserving order in window.SECTIONS
    const byS = Object.fromEntries(window.SECTIONS.map(s => [s.code, []]));
    list.forEach(s => byS[s.section].push(s));
    return window.SECTIONS.map(sec => ({ sec, items: byS[sec.code] }))
                          .filter(g => g.items.length > 0);
  }, [q, sec]);

  return (
    <div className="reg fade-in">
      <Crumb trail={[
        { label: 'الديوان', onClick: () => onNav('home') },
        { label: 'سجلّ الخدمات' },
      ]} />

      <header className="reg__intro">
        <h1 className="big">سجلّ الخدمات<br/><em>الـ ٣٠</em></h1>
        <p className="lede">
          فهرس رسمي بجميع الخدمات المقدّمة للمواطنين والمشتركين عبر مركز خدمات الرصافة.
          كل خدمة لها رقم تعريفي ثابت، شروط محدّدة، أجور رسمية، ومدّة معتادة. اختر خدمة لفتح صفحتها التفصيلية أو ابدأ النموذج مباشرةً.
        </p>
        <div className="meta">
          REF: SVC-CAT/2026<br/>
          REV. 03 · 14.NOV.26
        </div>
      </header>

      <div className="reg__strip">
        <div className="reg__search">
          <Icon name="search" size={20} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="ابحث: اسم الخدمة، الرقم (مثل CS0001)، أو اسم القسم…"
          />
        </div>
        <div className="reg__chips">
          <button className={`reg__chip ${sec === 'all' ? 'is-on' : ''}`} onClick={() => setSec('all')}>
            الكل <span className="n">{window.SERVICES.length}</span>
          </button>
          {window.SECTIONS.map(s => (
            <button key={s.code}
                    className={`reg__chip ${sec === s.code ? 'is-on' : ''}`}
                    onClick={() => setSec(s.code)}>
              {s.code} · {s.name}
              <span className="n">{window.SERVICES.filter(x => x.section === s.code).length}</span>
            </button>
          ))}
        </div>
        <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--ink-soft)', letterSpacing: '0.06em' }}>
          ZOOM · DENSE
        </span>
      </div>

      {groups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)', fontFamily: 'var(--d-display)' }}>
          <Icon name="search_off" size={48} />
          <p style={{ marginTop: 10 }}>لا توجد خدمات مطابقة.</p>
        </div>
      ) : (
        groups.map(g => (
          <section key={g.sec.code} className="reg__section">
            <div className="reg__index" style={{ '--ix-c': g.sec.color }}>
              <span className="l">{g.sec.code}</span>
              <span className="n">{g.items.length.toString().padStart(2,'0')} · SERVICES</span>
              <span className="nm">{g.sec.name}</span>
            </div>
            <div className="reg__items">
              {g.items.map(svc => (
                <div key={svc.code}
                     className="svc"
                     style={{ '--svc-c': g.sec.color }}
                     onClick={() => onPick(svc.code)}>
                  <div className="svc__num">
                    {svc.code.slice(2)}
                    <small>{svc.code.slice(0,2)}</small>
                  </div>
                  <div>
                    <h3 className="svc__title">{svc.name}</h3>
                    <div className="svc__meta">
                      {svc.fixedPrice ? fmtIQD(svc.fixedPrice) : (svc.priceNote || 'الأجور حسب الصنف')}
                      &nbsp;·&nbsp; أكثر طلباً {svc.popularity}٪
                      {svc.urgent && <span style={{color:'var(--crimson)',fontWeight:800,marginInlineStart:8}}>· عاجل</span>}
                    </div>
                  </div>
                  <div className="svc__sla">
                    {svc.sla}<small>أيام عمل</small>
                  </div>
                  <span className="svc__arrow">
                    افتح <Icon name="arrow_back" size={14} />
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

Object.assign(window, { Registry });
