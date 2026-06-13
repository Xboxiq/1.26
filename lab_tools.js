// lab_tools — فهرس الأقسام + ترشيح المفاهيم (★) يحفظ في localStorage
(function () {
  'use strict';

  // ---------- index nav ----------
  const secs = [...document.querySelectorAll('.lab-sec-title')];
  if (secs.length) {
    const nav = document.createElement('nav');
    nav.className = 'labnav';
    const brand = document.createElement('span');
    brand.className = 'labnav__brand';
    brand.textContent = 'الفهرس';
    nav.appendChild(brand);
    secs.forEach((h, i) => {
      if (!h.id) h.id = 'sec-' + i;
      const a = document.createElement('a');
      a.href = '#' + h.id;
      const parts = h.textContent.split('—');
      a.textContent = (parts[1] || parts[0]).trim().slice(0, 30);
      nav.appendChild(a);
    });
    document.body.prepend(nav);
  }

  // ---------- pick mode ----------
  const file = decodeURIComponent((location.pathname.split('/').pop() || 'lab'));
  const KEY = 'tdq-lab-picks::' + file;
  let picks;
  try { picks = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); }
  catch (e) { picks = new Set(); }

  const bar = document.createElement('div');
  bar.className = 'labpick';
  document.body.appendChild(bar);

  function save() {
    localStorage.setItem(KEY, JSON.stringify([...picks]));
    render();
  }

  function render() {
    const list = [...picks];
    bar.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = 'اختياراتك (' + list.length + ')';
    const span = document.createElement('span');
    span.className = 'labpick__list';
    span.textContent = list.length ? list.join(' · ') : 'انقر ☆ على أي مفهوم لترشيحه ثم أخبرني بالقائمة';
    bar.appendChild(b);
    bar.appendChild(span);
    if (list.length) {
      const copy = document.createElement('button');
      copy.className = 'labpick__copy';
      copy.textContent = 'نسخ';
      copy.title = 'نسخ القائمة للحافظة';
      copy.addEventListener('click', () => {
        const text = list.join('\n');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => { copy.textContent = '✓'; setTimeout(() => { copy.textContent = 'نسخ'; }, 1500); });
        } else {
          prompt('انسخ القائمة:', text);
        }
      });
      bar.appendChild(copy);
      const clr = document.createElement('button');
      clr.className = 'labpick__clear';
      clr.textContent = 'مسح';
      clr.addEventListener('click', () => { picks.clear(); save(); });
      bar.appendChild(clr);
    }
    document.querySelectorAll('.pickbtn').forEach((btn) => {
      const on = picks.has(btn.dataset.key);
      btn.classList.toggle('is-on', on);
      btn.textContent = on ? '★' : '☆';
    });
  }

  document.querySelectorAll('.lab-card h3').forEach((h) => {
    const code = (h.childNodes[0] && h.childNodes[0].textContent || h.textContent).split('—')[0].trim();
    const name = (h.textContent.split('—')[1] || '').replace(/\s+/g, ' ').trim().slice(0, 26);
    const key = (code + ' ' + name).trim();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pickbtn';
    btn.dataset.key = key;
    btn.title = 'ترشيح هذا المفهوم';
    btn.addEventListener('click', () => {
      if (picks.has(key)) picks.delete(key); else picks.add(key);
      save();
    });
    h.appendChild(btn);
  });

  render();
})();
