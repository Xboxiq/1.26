// =============================================================
// DIWAN — shared atoms
// =============================================================
const { useState, useEffect, useMemo, useRef, useCallback, Fragment } = React;

function Icon({ name, size = 22, className = "", style = {} }) {
  return <span className={`material-symbols-outlined ${className}`} style={{ fontSize: size, ...style }}>{name}</span>;
}

function Btn({ variant, size, icon, iconEnd, children, ...rest }) {
  const cls = ['btn',
    variant === 'crimson' && 'btn--crimson',
    variant === 'gold' && 'btn--gold',
    variant === 'ghost' && 'btn--ghost',
    size === 'lg' && 'btn--lg',
    size === 'sm' && 'btn--sm',
  ].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={18} />}
    </button>
  );
}

function RefCode({ pre, num, className = "" }) {
  return (
    <span className={`refcode ${className}`}>
      {pre && <span className="pre">{pre}</span>}
      {num}
    </span>
  );
}

function Stamp({ kind = '', children }) {
  return <span className={`stamp ${kind ? 'stamp--' + kind : ''}`}>{children}</span>;
}

function Crumb({ trail }) {
  const kids = [];
  trail.forEach((it, i) => {
    if (i > 0) {
      kids.push(<span key={'s' + i} className="sep" aria-hidden="true" />);
    }
    if (it.onClick) {
      kids.push(
        <a key={'a' + i} href="#" onClick={(e) => { e.preventDefault(); it.onClick(); }}>{it.label}</a>
      );
    } else {
      kids.push(<span key={'n' + i} className="now">{it.label}</span>);
    }
  });
  return <nav className="crumb">{kids}</nav>;
}

const SECTION_COLORS = {
  CS: '#1d4ed8',
  CT: '#b45309',
  CB: '#0e7490',
  CA: '#b20213',
};

window.fmt = (n) => new Intl.NumberFormat('en-US').format(n);
window.fmtIQD = (n) => window.fmt(n) + ' د.ع';

Object.assign(window, { Icon, Btn, RefCode, Stamp, Crumb, SECTION_COLORS });
