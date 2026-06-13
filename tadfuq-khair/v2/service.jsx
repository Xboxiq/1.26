// =============================================================
// DIWAN — Service Detail (formal notice page)
// =============================================================

const GUIDE = {
  CS0001: {
    purpose: 'تقديم طلب اشتراك جديد لمنشأة سكنية، تجارية، صناعية، حكومية، زراعية، مجمع سكني، أو مشروع استثماري — وفق ضوابط شركة توزيع كهرباء الرصافة لعام ٢٠٢٦.',
    when: [
      'العقار جاهز للتوصيل وتوجد لوحة مقاييس مهيّأة.',
      'حصل المشترك على إجازة بناء سارية أو سند تسجيل ملكية.',
      'لا يوجد دين سابق غير مسوّى على العقار أو على المالك.',
      'تم تسديد رسوم طلب الخدمة في الصندوق.',
    ],
    docs: [
      'هوية الأحوال المدنية وبطاقة السكن.',
      'كتاب تأييد سكن مصدّق (للسكني) أو إجازة بناء (لباقي الأصناف).',
      'سند الطابو الأصلي أو القسام الشرعي.',
      'صورة من قائمة حساب المجاور.',
    ],
  },
};

function computeFees(classKey) {
  const rows = [];
  const insp = (window.PRICING.inspection.items.find(x => x.key === classKey) || {});
  if (insp.amount) rows.push({ name: 'أجور الكشف', sub: insp.name, amount: insp.amount });
  rows.push({ name: 'تجهيز ونصب المقياس', sub: 'لمرة واحدة', amount: 62500 });
  rows.push({ name: 'الغطاء السفلي للمقياس', amount: 12500 });
  const monthly = classKey === 'res' ? 3000 : 10000;
  rows.push({ name: 'اشتراك شهري على قوائم الاستهلاك', amount: monthly });
  return rows;
}

function ServiceDetail({ code, onNav, onStart }) {
  const svc = window.SERVICE_MAP[code];
  const sec = window.SECTION_MAP[svc.section];
  const guide = GUIDE[code] || {
    purpose: 'تقدّم هذه الخدمة للمشتركين عبر مركز خدمات المشتركين ضمن إجراءات قسم ' + sec.name + ' وفق ضوابط الشركة.',
    when: [
      'استكمال الوثائق المطلوبة من المشترك.',
      'دفع رسوم الطلب في الصندوق قبل التحويل.',
      'عدم وجود حالات قائمة معلقة على نفس الاشتراك.',
    ],
    docs: [
      'هوية الأحوال المدنية وبطاقة السكن.',
      'مستند ملكية أو وكالة قانونية إن اقتضى.',
      'صورة من آخر قائمة استهلاك للاشتراك.',
    ],
  };

  const fees = code === 'CS0001'
    ? computeFees('res')
    : svc.fixedPrice
      ? [{ name: 'الأجور الثابتة', amount: svc.fixedPrice }]
      : [];
  const total = fees.reduce((s,r) => s + r.amount, 0);

  return (
    <div className="svcd fade-in" style={{ '--svc-c': sec.color }}>
      <Crumb trail={[
        { label: 'الديوان', onClick: () => onNav('home') },
        { label: 'سجلّ الخدمات', onClick: () => onNav('reg') },
        { label: svc.code + ' · ' + svc.name },
      ]} />

      <header className="svcd__head">
        <div className="svcd__code">
          {svc.code.slice(2)}
          <small>{svc.code.slice(0,2)} · {sec.name}</small>
        </div>
        <div>
          <h1 className="svcd__title">{svc.name}</h1>
          <p className="svcd__lede">{guide.purpose}</p>
          <div className="svcd__actions">
            <Btn variant="crimson" size="lg" icon="edit_document" onClick={onStart}>
              ابدأ تعبئة النموذج
            </Btn>
            <Btn variant="ghost" size="lg" icon="print">
              نموذج فارغ للطباعة
            </Btn>
            <Btn variant="ghost" size="lg" icon="folder_open" onClick={() => onNav('cases')}>
              إضبارات مفتوحة
            </Btn>
          </div>
        </div>
        <div className="svcd__stamp">
          <Stamp kind={svc.urgent ? 'urgent' : 'ok'}>{svc.urgent ? 'عاجل' : 'فعّال'}</Stamp>
          <div className="svcd__sla">
            {svc.sla}
            <small>أيام عمل</small>
          </div>
          <div className="svcd__sla" style={{ fontSize: '1.5rem' }}>
            {svc.fixedPrice ? fmtIQD(svc.fixedPrice) : (total ? fmtIQD(total) : '—')}
            <small>تقديري</small>
          </div>
        </div>
      </header>

      <div className="svcd__body">
        <div className="stack" style={{ gap: 28 }}>
          <section className="svcd__block">
            <h3>متى تقدَّم هذه الخدمة <small>· شروط أساسية</small></h3>
            <ul className="svcd__list">
              {guide.when.map((w,i) => <li key={i}>{w}</li>)}
            </ul>
          </section>

          <section className="svcd__block">
            <h3>الوثائق المطلوبة <small>· تختلف حسب الصنف</small></h3>
            <ul className="svcd__list">
              {guide.docs.map((d,i) => <li key={i}>{d}</li>)}
            </ul>
          </section>

          <section className="svcd__block">
            <h3>مسار الطلب <small>· ٧ مراحل</small></h3>
            <div className="flow">
              {[
                { name: 'استلام وتعبئة النموذج', by: 'موظف خدمات المشتركين', dur: 'فوري' },
                { name: 'دفع رسوم طلب الخدمة', by: 'الصندوق', dur: '15 دقيقة' },
                { name: 'الكشف الميداني', by: 'الدائرة الفنية', dur: '٣ أيام' },
                { name: 'تقدير الأجور والمطالبة المالية', by: 'الدائرة المالية', dur: 'يوم واحد' },
                { name: 'موافقة المدير وإصدار الأمر', by: 'مدير المركز', dur: 'يوم' },
                { name: 'دفع المطالبة وإصدار الموافقة', by: 'الصندوق', dur: 'فوري' },
                { name: 'تنفيذ التوصيل وإصدار رقم اشتراك', by: 'الدائرة الفنية', dur: 'يومان' },
              ].map((s, i) => (
                <div key={i} className={`flow__step ${i === 0 ? 'is-now' : ''}`}>
                  <span className="flow__num">{String(i+1).padStart(2,'0')}</span>
                  <div className="flow__main">
                    <span className="flow__name">{s.name}</span>
                    <span className="flow__by">{s.by}</span>
                  </div>
                  <span className="flow__dur">{s.dur}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="stack" style={{ gap: 22 }}>
          <div className="ledger">
            <div className="ledger__head">
              <span className="t">سجل الأجور</span>
              <small>SVC-2026 / TBL-{svc.section}</small>
            </div>
            {fees.length > 0 ? [
              ...fees.map((r,i) => (
                <div key={i} className="ledger__row">
                  <span className="n">
                    {r.name}
                    {r.sub && <span style={{ fontFamily: 'var(--d-mono)', fontSize: '0.72rem', color: 'var(--ink-mute)', marginInlineStart: 6 }}>({r.sub})</span>}
                  </span>
                  <span className="v">{fmtIQD(r.amount)}</span>
                </div>
              )),
              <div key="total" className="ledger__total">
                <span className="l">المجموع التقديري</span>
                <span className="v">{fmtIQD(total)}</span>
              </div>
            ] : (
              <p style={{ margin: 0, fontFamily: 'var(--d-display)', color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                لا توجد أجور ثابتة لهذه الخدمة. تُحتسب أثناء التعبئة.
              </p>
            )}
            <p className="mono muted" style={{ fontSize: '0.7rem', marginTop: 14, lineHeight: 1.55, letterSpacing: '0.04em' }}>
              المصدر: جدول الأسعار الرسمي لعام ٢٠٢٦. يُعاد الاحتساب حسب الصنف ونوع الربط.
            </p>
          </div>

          <div className="ledger" style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' }}>
            <div className="ledger__head" style={{ borderBottomColor: 'rgba(244,236,217,0.2)' }}>
              <span className="t" style={{ color: 'var(--paper)' }}>تنبيه إجرائي</span>
              <small style={{ color: 'var(--gold-soft)' }}>أخطاء شائعة</small>
            </div>
            <ul style={{ margin: 0, padding: '0 18px', fontFamily: 'var(--d-display)', fontSize: '0.88rem', lineHeight: 1.85, color: 'rgba(244,236,217,0.88)' }}>
              <li>عدم إرفاق كتاب التأييد المصدّق هو السبب الأول لإرجاع الطلب.</li>
              <li>إغفال نوع الربط (أحادي/ثلاثي) يؤخّر الكشف ٣ أيام.</li>
              <li>القسام الشرعي مطلوب فوراً إن وُجد.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { ServiceDetail, computeFees });
