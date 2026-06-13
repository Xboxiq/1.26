// =============================================================
// DIWAN — Form (split-live: pro fields + live original render)
// =============================================================

const CLASSES = [
  { k:'res',  l:'منزلي',          ico:'home' },
  { k:'com',  l:'تجاري',          ico:'storefront' },
  { k:'ind',  l:'صناعي',          ico:'factory' },
  { k:'gov',  l:'حكومي',          ico:'account_balance' },
  { k:'agr',  l:'زراعي',          ico:'agriculture' },
  { k:'comp', l:'مجمع سكني',      ico:'apartment' },
  { k:'inv',  l:'مشروع استثماري', ico:'business_center' },
];

const PHASES = [
  { k:'1ph', l:'أحادي الطور',  ico:'horizontal_rule' },
  { k:'3ph', l:'ثلاثي الطور',  ico:'menu' },
];

const DOC_LIST = [
  { k:'id',    l:'هوية الأحوال المدنية' },
  { k:'house', l:'بطاقة السكن (للسكني)' },
  { k:'sukn',  l:'كتاب تأييد سكن مصدّق' },
  { k:'tabu',  l:'سند قيد الطابو' },
  { k:'neigh', l:'صورة قائمة المجاور' },
  { k:'qsam',  l:'القسام الشرعي (عند اللزوم)' },
];

const ROUTE_OPTS = ['الفنية','الصندوق','القانونية','شؤون الموظفين'];

function useAutosave(key, initial) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...initial, ...JSON.parse(raw) } : initial;
    } catch { return initial; }
  });
  const [status, setStatus] = useState('saved');
  const [fresh, setFresh] = useState({});
  const t = useRef(null);

  const update = useCallback((patch) => {
    const p = typeof patch === 'function' ? patch(data) : patch;
    setData(prev => ({ ...prev, ...p }));
    // Track which keys just changed (for live highlight)
    setFresh(f => {
      const n = { ...f };
      Object.keys(p).forEach(k => n[k] = Date.now());
      return n;
    });
    setStatus('saving');
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify({ ...data, ...p }));
        setStatus('saved');
      } catch { setStatus('error'); }
    }, 450);
  }, [data, key]);

  return [data, update, status, fresh];
}

function isFresh(fresh, k) {
  return fresh[k] && (Date.now() - fresh[k] < 1100);
}

function FormPage({ code, onNav, onCases }) {
  const svc = window.SERVICE_MAP[code];
  const sec = window.SECTION_MAP[svc.section];

  const [data, set, save, fresh] = useAutosave(`diwan-form-${code}`, {
    reqDate: new Date().toISOString().slice(0, 10),
    reqNumber: 'CS0001-RS014-' + (Math.floor(Math.random() * 90000) + 10000),
    classKey: 'res',
    phaseKey: '1ph',
    docs: {},
    route: [],
  });

  // Re-render every 350ms to update fresh-cell highlights
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick(n => n + 1), 380);
    return () => clearInterval(t);
  }, []);

  // Progress %
  const progress = useMemo(() => {
    const checks = [
      !!data.subscriberName, !!data.nationalId, !!data.phone,
      !!data.classKey, !!data.phaseKey,
      !!data.neigh, !!data.house,
      Object.values(data.docs || {}).filter(Boolean).length >= 3,
      (data.route || []).length > 0,
      !!data.pledge,
    ];
    return Math.round(checks.filter(Boolean).length / checks.length * 100);
  }, [data]);

  const fees = useMemo(() => computeFees(data.classKey || 'res'), [data.classKey]);
  const total = fees.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="formpg fade-in">
      <Crumb trail={[
        { label: 'الديوان', onClick: () => onNav('home') },
        { label: 'سجلّ الخدمات', onClick: () => onNav('reg') },
        { label: svc.name, onClick: () => onNav('detail', { code }) },
        { label: 'النموذج' },
      ]} />

      <header className="formpg__head">
        <div>
          <h1 className="formpg__title">{svc.name}</h1>
          <div className="formpg__sub">
            نموذج رقم <strong>{svc.code}</strong> &nbsp;·&nbsp; مدّة معتادة {svc.sla} أيام &nbsp;·&nbsp; مركز الرصافة—الكرادة
          </div>
        </div>
        <div className="formpg__bar">
          <span className={`savebadge ${save === 'saving' ? 'is-saving' : 'is-saved'}`}>
            <Icon name={save === 'saving' ? 'cloud_sync' : 'cloud_done'} size={16} />
            {save === 'saving' ? 'جاري الحفظ…' : 'محفوظ تلقائياً'}
          </span>
          <Btn variant="ghost" icon="print" onClick={() => window.print()}>طباعة</Btn>
          <Btn variant="crimson" icon="send" disabled={progress < 60} onClick={() => {
            alert('تم تقديم النموذج وتحويله للدائرة الفنية.\nرقم المتابعة: ' + data.reqNumber);
            onCases();
          }}>
            تقديم
          </Btn>
        </div>
      </header>

      <div className="progress">
        <span className="progress__pct">{progress}<span className="u">٪</span></span>
        <div className="progress__bar"><div className="progress__fill" style={{ width: progress + '%' }} /></div>
        <span className="progress__txt">
          {progress < 60 ? 'استكمل البيانات الأساسية لتفعيل التقديم' : 'جاهز للتقديم'}
        </span>
      </div>

      <div className="split">
        {/* LEFT: pro form */}
        <div className="split__pro">
          <div className="split__lbl">
            <span className="t"><Icon name="auto_awesome" size={18} /> الواجهة الاحترافية</span>
            <span className="note">ترتيب محسّن للإدخال السريع</span>
          </div>

          {/* 1. Subscriber */}
          <section className="fsec">
            <header className="fsec__head">
              <span className="fsec__num">01</span>
              <h3 className="fsec__t">بيانات المشترك</h3>
              <span className="fsec__meta">SECT.A</span>
            </header>
            <div className="fgrid">
              <div className="field">
                <label className="field__lbl">اسم المشترك <span className="req">*</span> <span className="key">name</span></label>
                <input className="input" value={data.subscriberName||''} onChange={e=>set({subscriberName:e.target.value})} placeholder="الاسم الرباعي" />
              </div>
              <div className="field">
                <label className="field__lbl">البطاقة الموحدة <span className="req">*</span> <span className="key">nid</span></label>
                <input className="input mono" value={data.nationalId||''} onChange={e=>set({nationalId:e.target.value})} placeholder="١٢٣٤٥٦٧٨٩٠١٢" />
              </div>
              <div className="field">
                <label className="field__lbl">بطاقة السكن <span className="key">house-id</span></label>
                <input className="input mono" value={data.houseCard||''} onChange={e=>set({houseCard:e.target.value})} />
              </div>
              <div className="field">
                <label className="field__lbl">الهاتف <span className="req">*</span> <span className="key">phone</span></label>
                <input className="input mono" value={data.phone||''} onChange={e=>set({phone:e.target.value})} placeholder="٠٧٧٠٠٠٠٠٠٠٠" />
              </div>
            </div>
          </section>

          {/* 2. Class + phase */}
          <section className="fsec">
            <header className="fsec__head">
              <span className="fsec__num">02</span>
              <h3 className="fsec__t">الصنف ونوع الربط</h3>
              <span className="fsec__meta">SECT.B</span>
            </header>
            <div className="field">
              <label className="field__lbl">صنف الاشتراك <span className="req">*</span></label>
              <div className="chips">
                {CLASSES.map(c => (
                  <label key={c.k} className={`chip ${data.classKey === c.k ? 'is-on' : ''}`}>
                    <input type="radio" name="cls" checked={data.classKey === c.k} onChange={() => set({classKey: c.k})} />
                    <Icon name={c.ico} size={16} />{c.l}
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="field__lbl">قوة التغذية <span className="req">*</span></label>
              <div className="chips">
                {PHASES.map(p => (
                  <label key={p.k} className={`chip ${data.phaseKey === p.k ? 'is-on' : ''}`}>
                    <input type="radio" name="ph" checked={data.phaseKey === p.k} onChange={() => set({phaseKey: p.k})} />
                    <Icon name={p.ico} size={16} />{p.l}
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Address */}
          <section className="fsec">
            <header className="fsec__head">
              <span className="fsec__num">03</span>
              <h3 className="fsec__t">عنوان العقار</h3>
              <span className="fsec__meta">SECT.C</span>
            </header>
            <div className="fgrid fgrid--3">
              {[['neigh','الحي'],['quarter','المحلة'],['alley','الزقاق'],['house','الدار'],['parcel','القطعة'],['floor','الطابق'],['flat','الشقة'],['code','الترميز الجديد'],['gps','GPS']].map(([k,l]) => (
                <div key={k} className="field">
                  <label className="field__lbl">{l} <span className="key">{k}</span></label>
                  <input className="input mono" value={data[k]||''} onChange={e=>set({[k]:e.target.value})} />
                </div>
              ))}
            </div>
          </section>

          {/* 4. Docs */}
          <section className="fsec">
            <header className="fsec__head">
              <span className="fsec__num">04</span>
              <h3 className="fsec__t">الوثائق المرفقة</h3>
              <span className="fsec__meta">
                {Object.values(data.docs || {}).filter(Boolean).length} / {DOC_LIST.length}
              </span>
            </header>
            {DOC_LIST.map(d => {
              const on = !!(data.docs && data.docs[d.k]);
              return (
                <div key={d.k} className={`doc ${on ? 'is-on' : ''}`}
                     onClick={() => set({ docs: { ...(data.docs||{}), [d.k]: !on } })}>
                  <span className="doc__ck">{on && <Icon name="check" size={14} />}</span>
                  <div>
                    <div className="doc__t">{d.l}</div>
                    <div className="doc__s">{on ? 'تم استلامها' : 'لم تُرفع بعد'}</div>
                  </div>
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', letterSpacing: '0.08em' }}>
                    {d.k.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </section>

          {/* 5. Routing + pledge */}
          <section className="fsec">
            <header className="fsec__head">
              <span className="fsec__num">05</span>
              <h3 className="fsec__t">يحوّل لاستكمال الإجراءات إلى</h3>
              <span className="fsec__meta">SECT.E</span>
            </header>
            <div className="chips">
              {ROUTE_OPTS.map(r => {
                const on = (data.route||[]).includes(r);
                return (
                  <label key={r} className={`chip ${on ? 'is-on' : ''}`}>
                    <input type="checkbox" checked={on} onChange={() => {
                      const cur = data.route || [];
                      set({ route: on ? cur.filter(x=>x!==r) : [...cur, r] });
                    }} />
                    <Icon name="arrow_back" size={16} />الدائرة {r}
                  </label>
                );
              })}
            </div>
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              marginTop: 14, padding: 14,
              background: 'var(--paper-2)',
              border: '1.5px solid var(--paper-line)',
              cursor: 'pointer',
              fontFamily: 'var(--d-display)',
            }}>
              <input type="checkbox" checked={!!data.pledge} onChange={e=>set({pledge:e.target.checked})}
                     style={{ accentColor: 'var(--crimson)', width: 20, height: 20, marginTop: 2 }} />
              <span style={{ fontSize: '0.86rem', lineHeight: 1.7 }}>
                <strong>إقرار وتعهّد:</strong> أُقر أنني الموقّع أدناه وأتعهّد بموجب هذا النموذج بصحة البيانات والالتزام بشروط منح الاشتراك،
                وعدم التعرّض للتجهيزات الكهربائية، وعدم التزويد لمبنى آخر، وعدم منع موظفي الشركة من الدخول للفحص أو القراءة.
              </span>
            </label>
          </section>

          {/* Footer total */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'baseline',
            padding: '18px 0 4px', borderTop: '2px solid var(--paper-line)',
          }}>
            <span style={{ fontFamily: 'var(--d-display)', fontWeight: 800, color: 'var(--ink-soft)' }}>المطالبة المالية التقديرية</span>
            <span style={{
              fontFamily: 'var(--d-numeral)', fontWeight: 900,
              fontSize: '1.8rem', letterSpacing: '-0.02em', color: 'var(--crimson)',
              transition: 'all 350ms',
              ...(isFresh(fresh, 'classKey') ? { background: 'var(--gold-soft)', padding: '2px 8px' } : {}),
            }}>
              {fmtIQD(total)}
            </span>
          </div>
        </div>

        {/* RIGHT: live original render */}
        <div className="split__orig">
          <div className="split__lbl">
            <span className="t"><Icon name="description" size={18} /> الفورمة الأصلية — تتحدث مباشرة</span>
            <span className="note">طبق الأصل · للطباعة</span>
          </div>
          <LiveOriginal data={data} fresh={fresh} />
        </div>
      </div>
    </div>
  );
}

// ---------- LiveOriginal ----------
function LiveOriginal({ data, fresh }) {
  const ck = (on) => <span className={`papyr__ck ${on ? 'on' : ''}`} />;
  const live = (k, val) => (
    <span data-live={k} className={isFresh(fresh, k) ? 'is-fresh' : ''}>{val || '\u00a0'}</span>
  );
  const cls = data.classKey || 'res';
  const ph = data.phaseKey || '1ph';

  return (
    <div className="papyr">
      <div className="papyr__head">
        <div className="papyr__logo"><img src="assets/logo.png" alt="" /></div>
        <div className="papyr__title">
          <h2>طلب عمل اشتراك جديد</h2>
          <small>الشركة العامة لتوزيع كهرباء بغداد — كهرباء الرصافة</small>
        </div>
        <div className="papyr__num">
          نموذج
          <strong>CS0001</strong>
        </div>
      </div>

      <table>
        <tbody>
          <tr><td className="lbl">اسم المركز</td><td>الرصافة — الكرادة</td>
              <td className="lbl">تاريخ الطلب</td><td>{live('reqDate', data.reqDate)}</td></tr>
          <tr><td className="lbl">رقم المركز</td><td className="mono">RS-014</td>
              <td className="lbl">رقم الطلب</td><td className="mono">{live('reqNumber', data.reqNumber)}</td></tr>
          <tr><td className="lbl">اسم المشترك</td><td colSpan="3">{live('subscriberName', data.subscriberName)}</td></tr>
          <tr><td className="lbl">البطاقة الموحدة</td><td colSpan="3" className="mono">{live('nationalId', data.nationalId)}</td></tr>
        </tbody>
      </table>

      <h3>صنف الاشتراك المطلوب</h3>
      <div className="papyr__lbl-row">
        {CLASSES.map(c => <label key={c.k}>{ck(cls===c.k)} {c.l}</label>)}
      </div>

      <h3>قوة التغذية</h3>
      <div className="papyr__lbl-row">
        {PHASES.map(p => <label key={p.k}>{ck(ph===p.k)} {p.l}</label>)}
      </div>

      <h3>عنوان العقار</h3>
      <table>
        <tbody>
          <tr><td className="lbl">الحي</td><td>{live('neigh', data.neigh)}</td>
              <td className="lbl">المحلة</td><td>{live('quarter', data.quarter)}</td>
              <td className="lbl">الزقاق</td><td>{live('alley', data.alley)}</td></tr>
          <tr><td className="lbl">دار</td><td>{live('house', data.house)}</td>
              <td className="lbl">القطعة</td><td>{live('parcel', data.parcel)}</td>
              <td className="lbl">الترميز الجديد</td><td>{live('code', data.code)}</td></tr>
          <tr><td className="lbl">الطابق</td><td>{live('floor', data.floor)}</td>
              <td className="lbl">الشقة</td><td>{live('flat', data.flat)}</td>
              <td className="lbl">GPS</td><td className="mono">{live('gps', data.gps)}</td></tr>
          <tr><td className="lbl">رقم الهاتف</td><td colSpan="3" className="mono">{live('phone', data.phone)}</td>
              <td className="lbl">رقم بطاقة السكن</td><td className="mono">{live('houseCard', data.houseCard)}</td></tr>
        </tbody>
      </table>

      <h3>الوثائق المرفقة</h3>
      <table>
        <tbody>
          {DOC_LIST.map(d => (
            <tr key={d.k}>
              <td style={{ width: 30, textAlign: 'center' }}>{ck(!!(data.docs && data.docs[d.k]))}</td>
              <td>{d.l}</td>
              <td className="mono" style={{ width: 90 }}>{(data.docs && data.docs[d.k]) ? '✔ مرفقة' : '— لم تُرفع'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>يحوّل لاستكمال الإجراءات إلى</h3>
      <div className="papyr__lbl-row">
        {ROUTE_OPTS.map(r => (
          <label key={r}>{ck((data.route||[]).includes(r))} الدائرة {r}</label>
        ))}
      </div>

      <h3>الإقرار والتعهّد</h3>
      <p className="papyr__pledge">
        أُقرّ أنا الموقّع أدناه وأتعهد بموجب هذا النموذج بصحة البيانات أعلاه والالتزام بشروط منح الاشتراك وأصناف المساهمات والتأمينات،
        وعدم التعرّض للتجهيزات الكهربائية الخاصة بالشركة، وعدم السماح لأي شخص بالتزود بالتيار الكهربائي لأي مبنى آخر،
        وعدم منع موظفي الشركة من الدخول للفحص أو القراءة. وأُقرّ أنني أُخلي مسؤولية الشركة عن أية أضرار ناجمة عن مخالفة هذه الالتزامات.
      </p>

      <div className="papyr__sig">
        <div>اسم وتوقيع موظف خدمات المشتركين</div>
        <div>اسم وتوقيع مقدم الطلب</div>
        <div>اسم وتوقيع مسؤول مركز خدمات المشتركين</div>
      </div>
    </div>
  );
}

Object.assign(window, { FormPage });
