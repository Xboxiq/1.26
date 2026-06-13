// =============================================================
// DIWAN — Cases + Case Detail
// =============================================================

const CASE_STAGES = [
  { k:'received',  ico:'inbox',                name:'استلام الطلب',           who:'موظف خدمات المشتركين', dur:'فوري' },
  { k:'feeInit',   ico:'currency_exchange',    name:'دفع رسوم طلب الخدمة',    who:'الصندوق',              dur:'15 دقيقة' },
  { k:'siteCheck', ico:'location_searching',   name:'الكشف الميداني',         who:'الدائرة الفنية',       dur:'٣ أيام' },
  { k:'estimate',  ico:'price_change',         name:'تقدير الأجور',           who:'الدائرة المالية',      dur:'يوم' },
  { k:'approval',  ico:'verified',             name:'موافقة المدير',          who:'مدير المركز',          dur:'يوم' },
  { k:'feeFinal',  ico:'payments',             name:'دفع المطالبة المالية',   who:'الصندوق',              dur:'فوري' },
  { k:'execute',   ico:'electrical_services',  name:'تنفيذ التوصيل',          who:'الدائرة الفنية',       dur:'يومان' },
  { k:'closed',    ico:'check_circle',         name:'إصدار رقم الاشتراك',     who:'النظام',               dur:'فوري' },
];

const SAMPLE_CASE = {
  id: 'TQ-2026-08-1417',
  svc: 'CS0001',
  subscriber: 'علي عبدالله حسين الجبوري',
  classKey: 'res',
  phaseKey: '1ph',
  totalFee: 93000,
  opened: '12 / 06 / 2026',
  officer: 'م. كرار البياتي',
  currentStage: 2,
  events: [
    { stage: 0, at: '12 / 06 — 09:14', by: 'م. كرار',          note: 'تم استلام النموذج والمستمسكات الأصلية.' },
    { stage: 1, at: '12 / 06 — 09:42', by: 'الصندوق',          note: 'وصل قبض رقم 38291 — 15,000 د.ع.' },
    { stage: 2, at: '14 / 06 — 11:30', by: 'الفريق الفني',     note: 'موعد الكشف الميداني محدّد · فريق في الطريق.' },
  ],
};

function Cases({ onOpen, onNav }) {
  const [q, setQ] = useState('');

  const list = window.RECENT_CASES.filter(c => {
    if (!q.trim()) return true;
    return c.id.includes(q) || c.subscriber.includes(q);
  });

  return (
    <div className="cases fade-in">
      <Crumb trail={[
        { label: 'الديوان', onClick: () => onNav('home') },
        { label: 'الإضبارات النشطة' },
      ]} />

      <header className="cases__head">
        <div>
          <h1 style={{
            fontFamily: 'var(--d-display)', fontWeight: 900,
            fontSize: 'clamp(2rem, 3.8vw, 3rem)',
            letterSpacing: '-0.025em', lineHeight: 1,
            margin: '0 0 6px',
          }}>
            الإضبارات<br/>النشطة
          </h1>
          <p className="mono muted" style={{ fontSize: '0.86rem', letterSpacing: '0.06em' }}>
            {list.length} ملفّاً مفتوحاً · مركز RS-014 · نوبة الصباح
          </p>
        </div>
        <Btn variant="crimson" size="lg" icon="add" onClick={() => onNav('reg')}>افتح إضبارة جديدة</Btn>
      </header>

      <div className="reg__strip">
        <div className="reg__search">
          <Icon name="search" size={20} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="ابحث برقم الإضبارة أو اسم المشترك…"
          />
        </div>
        <div className="reg__chips">
          <button className="reg__chip is-on">الكل <span className="n">{list.length}</span></button>
          <button className="reg__chip">عاجل <span className="n">2</span></button>
          <button className="reg__chip">VIP <span className="n">1</span></button>
        </div>
        <span className="mono muted" style={{ fontSize: '0.74rem', letterSpacing: '0.06em' }}>تصفية</span>
      </div>

      <div className="stack" style={{ gap: 0 }}>
        {list.map(c => {
          const svc = window.SERVICE_MAP[c.svc];
          const sec = window.SECTION_MAP[svc.section];
          return (
            <div key={c.id} className="casecard"
                 style={{ '--svc-c': sec.color }}
                 onClick={() => onOpen(c)}>
              <div className="casecard__id">
                {c.id.split('-').slice(-1)[0]}
                <small>{c.id}</small>
              </div>
              <div className="casecard__main">
                <span className="casecard__svc">{c.svc} · {svc.name}</span>
                <span className="casecard__name">{c.subscriber}</span>
                <span className="casecard__sub">{c.officer}</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                {c.priority === 'urgent' && <Stamp kind="urgent">عاجل</Stamp>}
                {c.priority === 'vip' && <Stamp kind="vip">VIP</Stamp>}
                {c.priority === 'standard' && <Stamp>عادي</Stamp>}
              </div>
              <div>
                <span className="casecard__status">{c.status}</span>
                <div className="casecard__age">{c.age}</div>
              </div>
              <Icon name="arrow_back" size={24} style={{ color: 'var(--ink-soft)' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CaseDetail({ caseData = SAMPLE_CASE, onBack, onNav }) {
  const svc = window.SERVICE_MAP[caseData.svc];
  const sec = window.SECTION_MAP[svc.section];
  const fees = computeFees(caseData.classKey);
  const total = fees.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="svcd fade-in" style={{ '--svc-c': sec.color }}>
      <Crumb trail={[
        { label: 'الديوان', onClick: () => onNav('home') },
        { label: 'الإضبارات', onClick: onBack },
        { label: caseData.id },
      ]} />

      <header className="svcd__head">
        <div className="svcd__code">
          {caseData.id.split('-').slice(-1)[0]}
          <small>{caseData.id} · OPENED {caseData.opened}</small>
        </div>
        <div>
          <h1 className="svcd__title">{svc.name}</h1>
          <p className="svcd__lede">
            المشترك: <strong style={{ color: 'var(--ink)' }}>{caseData.subscriber}</strong> · المسؤول: {caseData.officer}
          </p>
          <div className="svcd__actions">
            <Btn variant="crimson" icon="edit_document">تابع التعبئة</Btn>
            <Btn variant="ghost" icon="print">طباعة الملف</Btn>
            <Btn variant="ghost" icon="share">إحالة</Btn>
          </div>
        </div>
        <div className="svcd__stamp">
          <Stamp kind="pending">{CASE_STAGES[caseData.currentStage].name}</Stamp>
          <div className="svcd__sla">
            {caseData.currentStage + 1} / {CASE_STAGES.length}
            <small>المرحلة الحالية</small>
          </div>
        </div>
      </header>

      <div className="svcd__body">
        <div>
          <div className="svcd__block">
            <h3>المسار الكامل <small>· سجل مرحلي</small></h3>
            <div className="tline">
              {CASE_STAGES.map((stg, i) => {
                const state = i < caseData.currentStage ? 'is-done' : i === caseData.currentStage ? 'is-now' : 'is-pending';
                const ev = caseData.events.find(e => e.stage === i);
                return (
                  <div key={stg.k} className={`tline__row ${state}`}>
                    <div className="tline__title">
                      <span>{String(i+1).padStart(2,'0')}. {stg.name}</span>
                      <span className="tline__time">{ev ? ev.at : '— ' + stg.dur}</span>
                    </div>
                    <div className="tline__desc">
                      {ev ? ev.note : `سيتم تنفيذ هذه المرحلة بواسطة ${stg.who} بمدة معتادة ${stg.dur}.`}
                      {ev && <span style={{ display:'inline-block', marginInlineStart: 10, padding: '2px 8px', background: 'var(--paper-2)', fontFamily: 'var(--d-mono)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)' }}>{ev.by}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="stack" style={{ gap: 22 }}>
          <div className="ledger">
            <div className="ledger__head">
              <span className="t">المطالبة المالية</span>
              <small>EST. {fmtIQD(total)}</small>
            </div>
            {fees.map((r, i) => (
              <div key={i} className="ledger__row">
                <span className="n">{r.name}</span>
                <span className="v">{fmtIQD(r.amount)}</span>
              </div>
            ))}
            <div className="ledger__total">
              <span className="l">المجموع المستحق</span>
              <span className="v">{fmtIQD(total)}</span>
            </div>
          </div>

          <div style={{
            background: 'var(--paper-2)',
            border: '2px solid var(--paper-line)',
            padding: 22,
          }}>
            <div style={{
              fontFamily: 'var(--d-display)', fontWeight: 900,
              fontSize: '0.84rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              borderBottom: '1.5px solid var(--paper-line)',
              paddingBottom: 8, marginBottom: 12,
            }}>
              مستمسكات الإضبارة
            </div>
            {[
              { n:'هوية الأحوال المدنية', s:'PDF · 240 KB',  ok:true },
              { n:'بطاقة السكن',          s:'PDF · 180 KB',  ok:true },
              { n:'كتاب تأييد سكن',       s:'PDF · 320 KB',  ok:true },
              { n:'سند الطابو',           s:'PDF · 520 KB',  ok:true },
              { n:'قائمة المجاور',        s:'لم تُرفق بعد',  ok:false },
            ].map((d,i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '20px 1fr auto',
                gap: 12, alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px dashed color-mix(in srgb, var(--paper-line) 35%, transparent)',
                fontFamily: 'var(--d-display)',
              }}>
                <span style={{ color: d.ok ? 'var(--signal)' : 'var(--gold)' }}>
                  <Icon name={d.ok ? 'description' : 'pending'} size={18} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{d.n}</div>
                  <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>{d.s}</div>
                </div>
                {d.ok
                  ? <Icon name="download" size={16} style={{ color: 'var(--ink-soft)' }} />
                  : <Btn size="sm" variant="ghost">ارفع</Btn>}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { Cases, CaseDetail, SAMPLE_CASE, CASE_STAGES });
