// =============================================================
// FINAL — Form Page (CS0001 example)
// Tabs: احترافية (smart form) / أصلية (faithful paper replica)
// Autosave + live fee counter
// =============================================================

const FF_CLASSES = ['منزلي', 'تجاري', 'صناعي', 'حكومي', 'زراعي', 'مجمع سكني', 'مشروع استثماري'];
const FF_PHASE = ['أحادي الطور', 'ثلاثي الطور'];
const FF_CLASS_FEE = { 'منزلي': 15000, 'تجاري': 100000, 'زراعي': 50000, 'صناعي': 150000, 'حكومي': 150000, 'مجمع سكني': 150000, 'مشروع استثماري': 150000 };

const FF_DOCS = [
  { n: 'نسخة من هوية الأحوال المدنية', all: true },
  { n: 'نسخة من بطاقة السكن', all: true },
  { n: 'كتاب تأييد سكن مصدق', all: true },
  { n: 'صورة موثقة للقسام الشرعي', opt: 'عند اللزوم' },
  { n: 'كتاب ضريبة العقار' },
  { n: 'إجازة البناء مصدقة', opt: 'بدل ضريبة العقار' },
  { n: 'سند قيد التسجيل للعقار (الطابو)' },
  { n: 'صورة من قائمة حساب المجاور' },
  { n: 'كتاب التنمية الصناعية', opt: 'صناعي', for: 'صناعي' },
  { n: 'كتاب المضخة الزراعية', opt: 'زراعي', for: 'زراعي' },
  { n: 'كتاب من الدائرة', opt: 'حكومي', for: 'حكومي' },
  { n: 'إجازة الاستثمار', opt: 'استثماري', for: 'مجمع سكني|مشروع استثماري' },
];

// animated number
function useCountUp(target) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    if (from === target) return;
    const start = performance.now();
    const dur = 520;
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

function FormPage({ nav, code }) {
  const svc = window.SERVICE_MAP[code] || window.SERVICE_MAP['CS0001'];
  const sec = window.SECTION_MAP[svc.section];
  const storageKey = 'tq-form-' + svc.code;

  const [tab, setTab] = useState('pro');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const [form, setForm] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || 'null') || { cls: 'منزلي', phase: 'أحادي الطور', docs: {}, meter: false, cover: false }; }
    catch { return { cls: 'منزلي', phase: 'أحادي الطور', docs: {}, meter: false, cover: false }; }
  });

  // autosave with pulse
  useEffect(() => {
    setSaving(true);
    const id = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(form));
      setSaving(false);
      setSavedAt(new Date());
    }, 600);
    return () => clearTimeout(id);
  }, [form, storageKey]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // fees
  const inspFee = FF_CLASS_FEE[form.cls] || 15000;
  const meterFee = form.meter ? 62500 : 0;
  const coverFee = form.cover ? 12500 : 0;
  const total = useCountUp(inspFee + meterFee + coverFee);

  const visibleDocs = FF_DOCS.filter(d => !d.for || d.for.split('|').includes(form.cls));

  return (
    <div className="fp-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button className="fp-back" onClick={() => nav('detail', { code: svc.code })}>
        <Icon name="arrow_forward" /> {svc.name}
      </button>

      <div className="ff-head">
        <div className="f-h2__main">
          <h2 className="f-h2__title">
            <span className="f-h2__icon"><Icon name="edit_document" /></span>
            نموذج {svc.code} — {svc.name}
          </h2>
          <span className="f-h2__sub">النسختان متطابقتان بالمعلومات — الاحترافية للتعبئة والأصلية للطباعة الرسمية</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span className={`ff-autosave ${saving ? 'is-saving' : ''}`}>
            <span className="ff-autosave__dot" />
            {saving ? 'يحفظ…' : savedAt ? 'محفوظ تلقائياً' : 'جاهز'}
          </span>
          <div className="ff-tabs">
            <button className={`ff-tab ${tab === 'pro' ? 'is-on' : ''}`} onClick={() => setTab('pro')}>
              <Icon name="auto_awesome" /> الاحترافية
            </button>
            <button className={`ff-tab ${tab === 'orig' ? 'is-on' : ''}`} onClick={() => setTab('orig')}>
              <Icon name="description" /> الأصلية
            </button>
          </div>
        </div>
      </div>

      {tab === 'pro' ? (
        <div className="ff-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* 1. بيانات مقدم الطلب */}
            <div className="f-card ff-section">
              <div className="f-card__head">
                <h3 className="f-card__title"><Icon name="person" /> بيانات مقدم الطلب</h3>
              </div>
              <div className="ff-section__body">
                <div className="ff-row">
                  <div className="ff-field">
                    <label>اسم المشترك / طالب الخدمة</label>
                    <input value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="الاسم الرباعي واللقب" />
                  </div>
                  <div className="ff-field">
                    <label>رقم البطاقة الموحدة / الهوية</label>
                    <input value={form.nid || ''} onChange={e => set('nid', e.target.value)} placeholder="مثال: 199801012345" />
                  </div>
                </div>
                <div className="ff-row">
                  <div className="ff-field">
                    <label>رقم بطاقة السكن</label>
                    <input value={form.housing || ''} onChange={e => set('housing', e.target.value)} />
                  </div>
                  <div className="ff-field">
                    <label>رقم هاتف / موبايل</label>
                    <input value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="07xxxxxxxxx" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. صنف الاشتراك */}
            <div className="f-card ff-section">
              <div className="f-card__head">
                <h3 className="f-card__title"><Icon name="category" /> صنف الاشتراك المطلوب</h3>
              </div>
              <div className="ff-section__body">
                <div className="ff-seg">
                  {FF_CLASSES.map(c => (
                    <button key={c} className={`ff-seg__opt ${form.cls === c ? 'is-on' : ''}`} onClick={() => set('cls', c)}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="ff-field">
                  <label>قوة التغذية المطلوبة (نوع الربط)</label>
                  <div className="ff-seg">
                    {FF_PHASE.map(p => (
                      <button key={p} className={`ff-seg__opt ${form.phase === p ? 'is-on' : ''}`} onClick={() => set('phase', p)}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. عنوان العقار */}
            <div className="f-card ff-section">
              <div className="f-card__head">
                <h3 className="f-card__title"><Icon name="home_pin" /> عنوان العقار المطلوب له الخدمة</h3>
              </div>
              <div className="ff-section__body">
                <div className="ff-row" style={{ '--cols': 4 }}>
                  {[['hay', 'حي'], ['mahalla', 'محلة'], ['zuqaq', 'زقاق'], ['dar', 'دار']].map(([k, l]) => (
                    <div key={k} className="ff-field">
                      <label>{l}</label>
                      <input value={form[k] || ''} onChange={e => set(k, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="ff-row" style={{ '--cols': 4 }}>
                  {[['ramz', 'الترميز الجديد'], ['piece', 'القطعة والمقاطعة'], ['floor', 'الطابق'], ['apt', 'رقم الشقة']].map(([k, l]) => (
                    <div key={k} className="ff-field">
                      <label>{l}</label>
                      <input value={form[k] || ''} onChange={e => set(k, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="ff-row">
                  <div className="ff-field">
                    <label>GPS / نقطة دالة</label>
                    <input value={form.gps || ''} onChange={e => set('gps', e.target.value)} placeholder="33.3152, 44.3661 — قرب جامع…" />
                  </div>
                  <div className="ff-field">
                    <label>رقم الحساب المخصص</label>
                    <input value={form.acct || ''} onChange={e => set('acct', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. المستمسكات */}
            <div className="f-card ff-section">
              <div className="f-card__head">
                <div>
                  <h3 className="f-card__title"><Icon name="folder_open" /> الوثائق / المستمسكات</h3>
                  <p className="f-card__sub">القائمة تتكيّف تلقائياً مع صنف «{form.cls}»</p>
                </div>
              </div>
              <div className="ff-section__body">
                {visibleDocs.map((d, i) => {
                  const on = !!form.docs[d.n];
                  return (
                    <div key={i} className={`ff-check ${on ? 'is-on' : ''}`}
                         onClick={() => set('docs', { ...form.docs, [d.n]: !on })}>
                      <span className="ff-check__box">{on && <Icon name="check" />}</span>
                      {d.n}
                      {d.opt && <span className="ff-check__opt">{d.opt}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* fee panel */}
          <aside className="ff-feepanel">
            <div className="ff-feepanel__head"><Icon name="request_quote" /> الأجور المتوقعة</div>
            <div className="ff-feepanel__rows">
              <div className="ff-feerow">
                <span>أجور الكشف ({form.cls})</span>
                <b>{fmtIQD(inspFee)}</b>
              </div>
              <div className="ff-feerow" style={{ cursor: 'pointer' }} onClick={() => set('meter', !form.meter)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span className={`ff-check__box ${form.meter ? '' : ''}`} style={{ background: form.meter ? 'var(--f-ok)' : 'transparent', borderColor: form.meter ? 'var(--f-ok)' : 'var(--f-border-2)' }}>
                    {form.meter && <Icon name="check" />}
                  </span>
                  مقياس المستهلك
                </span>
                <b>{fmtIQD(62500)}</b>
              </div>
              <div className="ff-feerow" style={{ cursor: 'pointer' }} onClick={() => set('cover', !form.cover)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span className="ff-check__box" style={{ background: form.cover ? 'var(--f-ok)' : 'transparent', borderColor: form.cover ? 'var(--f-ok)' : 'var(--f-border-2)' }}>
                    {form.cover && <Icon name="check" />}
                  </span>
                  الغطاء السفلي للمقياس
                </span>
                <b>{fmtIQD(12500)}</b>
              </div>
            </div>
            <div className="ff-feepanel__total">
              <span className="lbl">المجموع</span>
              <span className="val">{fmt(total)}<small>د.ع</small></span>
            </div>
            <div className="ff-feepanel__actions">
              <button className="f-btn f-btn--primary" onClick={() => alert('تم تجهيز الطلب — يحوّل للدائرة المختصة (تجريبي)')}>
                <Icon name="send" /> تقديم الطلب
              </button>
              <button className="f-btn" onClick={() => { setTab('orig'); setTimeout(() => window.print(), 350); }}>
                <Icon name="print" /> طباعة بصيغة الأصلية
              </button>
            </div>
          </aside>
        </div>
      ) : (
        <OriginalPaper form={form} />
      )}
    </div>
  );
}

// =============================================================
// ORIGINAL PAPER — faithful replica of CS0001
// =============================================================
function Cell({ v, w }) {
  return <td style={{ minWidth: w || 60 }}>{v || '\u00a0'}</td>;
}

function OriginalPaper({ form }) {
  const cb = (on) => on ? '☑' : '☐';
  const d = form.docs || {};
  return (
    <div className="ff-paper-wrap fp-enter">
      <div className="ff-paper" dir="rtl">
        <h2>طلب عمل اشتراك جديد</h2>
        <div className="ff-paper__sub">نموذج رقم (CS0001)</div>

        <div className="head-band">
          <span>رقم وصل قبض (رسوم طلب الخدمة): ............</span>
          <span>اسم المركز: الرصافة — الكرادة</span>
          <span>تاريخ الطلب: {new Date().toLocaleDateString('ar-IQ-u-ca-gregory')}</span>
        </div>

        <table>
          <tbody>
            <tr>
              <th style={{ width: '28%' }}>رقم الطلب</th>
              <Cell v="" />
              <th style={{ width: '20%' }}>رقم المركز</th>
              <Cell v="RS-014" />
            </tr>
            <tr>
              <th>اسم المشترك / طالب الخدمة</th>
              <Cell v={form.name} />
              <th>رقم البطاقة الموحدة / الهوية</th>
              <Cell v={form.nid} />
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th style={{ width: '28%' }}>صنف الاشتراك المطلوب</th>
              <td colSpan={3}>
                {FF_CLASSES.map(c => `${cb(form.cls === c)} ${c}`).join('    ')}
              </td>
            </tr>
            <tr>
              <th>قوة التغذية المطلوبة (نوع الربط)</th>
              <td colSpan={3}>
                {FF_PHASE.map(p => `${cb(form.phase === p)} ${p}`).join('      ')}
              </td>
            </tr>
            <tr>
              <th>رقم بطاقة السكن</th>
              <Cell v={form.housing} />
              <th>رقم الحساب المخصص</th>
              <Cell v={form.acct} />
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th colSpan={8} style={{ background: '#e8e5db' }}>عنوان العقار / الدار / الشقة المطلوب له الخدمة</th>
            </tr>
            <tr>
              <th>حي</th><Cell v={form.hay} />
              <th>محلة</th><Cell v={form.mahalla} />
              <th>زقاق</th><Cell v={form.zuqaq} />
              <th>دار</th><Cell v={form.dar} />
            </tr>
            <tr>
              <th>الترميز الجديد</th><Cell v={form.ramz} />
              <th>القطعة والمقاطعة</th><Cell v={form.piece} />
              <th>الطابق</th><Cell v={form.floor} />
              <th>رقم الشقة</th><Cell v={form.apt} />
            </tr>
            <tr>
              <th>هاتف / موبايل</th><Cell v={form.phone} />
              <th>GPS</th><Cell v={form.gps} />
              <th>نقطة دالة</th>
              <td colSpan={3}>{'\u00a0'}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th style={{ width: 34 }}>الحالة</th>
              <th style={{ width: 24 }}>#</th>
              <th>الوثائق / المستمسكات المطلوبة</th>
              <th style={{ width: '34%' }}>الأصناف المشمولة</th>
            </tr>
          </thead>
          <tbody>
            {FF_DOCS.map((doc, i) => (
              <tr key={i}>
                <td className="c">{cb(!!d[doc.n])}</td>
                <td className="c">{i + 1}</td>
                <td>{doc.n}</td>
                <td className="c" style={{ fontSize: '0.68rem', color: '#555' }}>
                  {doc.all ? 'جميع الأصناف' : doc.opt || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table>
          <thead>
            <tr><th>الوثيقة</th><th>رقم الوثيقة</th><th>تاريخ الوثيقة</th></tr>
          </thead>
          <tbody>
            {['كتاب ضريبة العقار', 'كتاب التنمية الصناعية', 'كتاب الدائرة الحكومية', 'إجازة الاستثمار', 'القسام الشرعي'].map(v => (
              <tr key={v}><td>{v}</td><td>{'\u00a0'}</td><td>{'\u00a0'}</td></tr>
            ))}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th style={{ width: '40%' }}>رقم وصل قبض (رسوم المطالبة المالية بعد الدراسة)</th>
              <td>{'\u00a0'}</td>
            </tr>
            <tr>
              <th>يحول لاستكمال الإجراءات</th>
              <td>☐ خدمات المشتركين &nbsp; ☐ الدائرة الفنية &nbsp; ☐ الدائرة القانونية &nbsp; ☐ الصندوق &nbsp; ☐ شؤون الموظفين &nbsp; ☐ إلغاء الطلب</td>
            </tr>
          </tbody>
        </table>

        <div className="sig-row">
          <div>اسم وتوقيع موظف خدمات المشتركين<div className="line">{'\u00a0'}</div></div>
          <div>اسم وتوقيع مقدم الطلب<div className="line">{form.name || '\u00a0'}</div></div>
          <div>اسم وتوقيع مسؤول مركز خدمات المشتركين<div className="line">{'\u00a0'}</div></div>
        </div>

        <div className="decl">
          <h3>إقرار وتعهّد والتزام</h3>
          <p>أقر أنا الموقع أدناه وأتعهد والتزم لشركة توزيع الكهرباء بما يلي:</p>
          <p><b>أولاً:</b> أقر بعلمي وموافقتي وأنا بكامل أهليتي القانونية أن الأساس القانوني الذي ينظم علاقتي بشركة تدفق الخير والشركة العامة لتوزيع كهرباء بغداد – كهرباء الرصافة هي الأنظمة الصادرة عن هذه الشركة في كل ما يتعلق بشؤون الكهرباء من حيث شروط منح الاشتراكات وأصناف المساهمات والتأمينات وأية أنظمة أو لوائح أو قرارات.</p>
          <p><b>ثانياً:</b> ألتزم وأتعهد بصفة خاصة بما يلي: عدم التعرض للتجهيزات الكهربائية الخاصة بالشركة بقصد أو بدون قصد، مباشرةً أو بالواسطة ومهما كان الغرض منها وهي «الأعمدة وشبكة الضغط المنخفض - كابل التغذية الرئيسي الواصل بين الشبكة العامة ولوحة المقاييس بمحتوياتها الداخلية والخارجية والأختام التي تحرزها الشركة على هذه اللوحة»، كما ألزم نفسي بعدم العبث بها وإبلاغ الشركة فوراً عن أي عطل أو خلل قد يصيب أياً من التجهيزات المذكورة. وعدم السماح لأي شخص بالتزود بالتيار الكهربائي لأي مبنى أو جزء من مبنى آخر باستثناء هذا البناء الذي سيتم الموافقة على منحه الاشتراك، وعدم التعرض لموظفي الشركة في الدخول إلى البناء الموجود به الاشتراك في أية ساعة من ساعات اليوم سواءً لأغراض الفحص الفني الدوري أو المفاجئ أو لقراءة العداد، والتزم بتقديم العون والمساعدة لهم عند الطلب.</p>
          <p><b>ثالثاً:</b> أقر بأنني أخلي مسؤولية الشركة عن أية أضرار أو ادعاءات بوقوع أضرار ناجمة عن: مخالفة أي التزام من الالتزامات المنصوص عليها في هذا السند، أو فصل التيار الكهربائي نتيجة عدم الوفاء بالالتزامات المالية، أو الأضرار الناجمة عن انقطاع الكهرباء نتيجة أعمال الصيانة والتطوير أو الانقطاع المفاجئ الذي لا دخل لإدارة الشركة فيه.</p>
          <div className="sig-row" style={{ marginTop: 12 }}>
            <div>اسم وتوقيع مقدم الطلب<div className="line">{form.name || '\u00a0'}</div></div>
            <div></div>
            <div>التاريخ<div className="line">{new Date().toLocaleDateString('ar-IQ-u-ca-gregory')}</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FormPage });
