'use strict';

// ─── SAFE HTML TEMPLATE TAG ───────────────────────────────────────────────────
// Usage:  html`<span>${playerName}</span>`
// All interpolated values are HTML-escaped automatically; literal parts pass through.
// Use html.safe(trustedFragment) to embed already-escaped sub-templates without
// double-escaping: html`<div>${html.safe(innerHtml)}</div>`
function html(strings, ...vals) {
  let out = '';
  strings.forEach((s, i) => {
    out += s;
    if (i < vals.length) {
      const v = vals[i];
      out += (v != null && typeof v === 'object' && '__safe' in v)
        ? v.__safe
        : esc(String(v ?? ''));
    }
  });
  return out;
}
html.safe = v => ({ __safe: String(v) });

// ─── HOW-TAKEN / HOW-SCORED GRID ─────────────────────────────────────────────
// Shared template for both the player sheet and the team adjustments drawer.
// backOnclick is a trusted internal JS expression (not user input).
function buildHowGrid(title, opts, backOnclick) {
  // eslint-disable-next-line no-restricted-syntax -- backOnclick is a trusted internal JS expression
  return '<div class="ps-sub-nav">'
    + '<button class="ps-sub-back" onclick="' + backOnclick + '"><i class="fas fa-chevron-left"></i></button>'
    + '<span class="ps-sub-title">' + esc(title) + '</span>'
    + '</div>'
    + '<div class="ps-sub-grid">'
    + opts.map(o => {
        const val   = typeof o === 'string' ? o : o.val;
        const label = typeof o === 'string' ? o : o.label;
        return '<button class="ps-sub-card" data-v="' + esc(val) + '">' + esc(label) + '</button>';
      }).join('')
    + '</div>';
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function toast(m) {
  el.toast.textContent = m; el.toast.classList.add('show');
  setTimeout(() => el.toast.classList.remove('show'), 2200);
}

// ─── SYNC META ────────────────────────────────────────────────────────────────
function syncMeta() {
  const n = state.evts.length;
  el.lcnt.textContent = n+' event'+(n!==1?'s':'');
  if (n>0) { el.lbdg.textContent=n; el.lbdg.style.display='inline'; } else el.lbdg.style.display='none';
  const ub = document.getElementById('undobtn');
  if (ub) ub.disabled = undos.length === 0;
}

// ─── TOTALS ───────────────────────────────────────────────────────────────────
function upTot() {
  const u = usTotal(), o = oppTotal();
  el.utotal.textContent = '('+u+')';
  el.ototal.textContent = '('+o+')';
  const uc = u>o?'var(--ts)':u<o?'var(--td)':'var(--t2)';
  const oc = o>u?'var(--ts)':o<u?'var(--td)':'var(--t2)';
  el.utotal.style.color = uc;
  el.ototal.style.color = oc;
}

// ─── GRID OPACITY ─────────────────────────────────────────────────────────────
function setGrid(on) {
  el.pgrid.style.opacity       = on ? '1' : '.3';
  el.pgrid.style.pointerEvents = on ? 'auto' : 'none';
}

// ─── INITIALS CACHE ───────────────────────────────────────────────────────────
function buildInitialsCache() {
  initialsCache = {};
  const all = Object.keys(state.pnames).map(Number);
  all.forEach(i => { initialsCache[i] = computeInitials(i, all); });
}

function computeInitials(i, all) {
  const nm = gn(i); if (!nm) return String(i);
  const p = nm.split(/\s+/), fi = p[0][0].toUpperCase();
  if (p.length === 1) return fi;
  const surname = p[p.length-1];
  let surnameKey = '', hasO = false;
  if (/^[OÓ]'/i.test(surname)) {
    surnameKey = surname[0].toUpperCase() + surname.substring(2).toUpperCase(); hasO = true;
  } else if (p.length >= 3 && /^[OÓ]$/i.test(p[p.length-2])) {
    surnameKey = p[p.length-2].toUpperCase() + surname.toUpperCase(); hasO = true;
  } else {
    surnameKey = surname.toUpperCase();
  }
  const minEx = hasO && surnameKey.length >= 2 ? 2 : 1;
  for (let ex = 1; ex <= surnameKey.length; ex++) {
    const c = fi + surnameKey.substring(0, ex);
    let clash = false;
    for (const oi of all) {
      if (oi === i) continue;
      const on = gn(oi); if (!on) continue;
      const op2 = on.split(/\s+/); if (op2.length < 2) continue;
      const oSn = op2[op2.length-1];
      let oKey = '';
      if (/^[OÓ]'/i.test(oSn)) oKey = oSn[0].toUpperCase()+oSn.substring(2).toUpperCase();
      else if (op2.length>=3 && /^[OÓ]$/i.test(op2[op2.length-2])) oKey = op2[op2.length-2].toUpperCase()+oSn.toUpperCase();
      else oKey = oSn.toUpperCase();
      if (op2[0][0].toUpperCase()+oKey.substring(0,ex) === c) { clash=true; break; }
    }
    if (!clash && ex >= minEx) return c;
  }
  return fi + surnameKey.substring(0, Math.min(2, surnameKey.length));
}

const gi = i => initialsCache[i] !== undefined ? initialsCache[i] : String(i);

// ─── PLAYER SCORE (derived from evts) ────────────────────────────────────────
function playerScore(pi) {
  let g = 0, p = 0;
  for (const ev of state.evts) {
    if (!ev.action || ev.slot == null) continue;
    const evPi = ev.pi != null ? ev.pi : state.slotp[ev.slot];
    if (evPi !== pi) continue;
    if (ev.action === 'Goal') g++;
    else if (ev.action === 'Point') p++;
    else if (ev.action === '2 Point') p += 2;
  }
  return {g, p};
}

// ─── PLAYER BUTTON (targeted rebuild) ────────────────────────────────────────
function refBtn(s) {
  const b = document.querySelector('[data-s="'+s+'"]'); if (!b) return;
  const pi = state.slotp[s], ini = gi(pi);
  while (b.firstChild) b.removeChild(b.firstChild);
  if (state.ycarded[pi]) { const e=document.createElement('span'); e.className='card-y'; b.appendChild(e); }
  if (state.bcarded[pi]) { const e=document.createElement('span'); e.className='card-b'; b.appendChild(e); }
  if (state.rcarded[pi]) { const e=document.createElement('span'); e.className='card-r'; b.appendChild(e); }
  if (state.ubench[pi]) { const e=document.createElement('span'); e.className='subdot'; b.appendChild(e); }
  if (state.captain === s) { const e=document.createElement('i'); e.className='fa-regular fa-copyright cap-badge'; b.appendChild(e); }
  const wrap = document.createElement('span');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:0;line-height:1;';
  const hasName = !!gn(pi);
  if (hasName && state.showPlayerNumbers !== false) {
    const numSpan = document.createElement('span');
    numSpan.textContent = pi;
    numSpan.style.cssText = 'font-size:8px;font-weight:500;opacity:0.55;margin-bottom:1px;';
    wrap.appendChild(numSpan);
  }
  const iniSpan = document.createElement('span');
  iniSpan.textContent = ini;
  iniSpan.style.fontSize = ini.length>=4?'10px':ini.length===3?'11px':ini.length===2?'12px':'14px';
  iniSpan.style.color = '#2E7D32';
  wrap.appendChild(iniSpan);
  const {g, p: p_} = playerScore(pi);
  if (g > 0 || p_ > 0) {
    const sc = document.createElement('span');
    sc.textContent = g+'-'+p_;
    sc.style.cssText = 'font-size:9px;font-weight:400;opacity:0.75;margin-top:1px;';
    wrap.appendChild(sc);
  }
  b.appendChild(wrap);
}
const refAllBtns = () => { const sz=state.teamSize||15; (TEAM_SLOTS[sz]||TEAM_SLOTS[15]).forEach(s=>refBtn(s)); };
