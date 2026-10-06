/* ============================================================
   VALIGIA - RENDER E PERSISTENZA
   Legge VALIGIA_UI e VALIGIA da valigia-data.js.
   Qui dentro non ci sono contenuti: se vuoi cambiare la lista,
   apri valigia-data.js (a mano) o lancia valigia.py.
   ============================================================ */

const ICONS = {
  home:'<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/></svg>',
  split:'<svg viewBox="0 0 24 24"><path d="M12 3v6"/><path d="M12 9 6 15v6"/><path d="M12 9l6 6v6"/><circle cx="12" cy="3" r="1.4"/></svg>',
  cart:'<svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a1.5 1.5 0 0 0 1.5 1.1h8.4a1.5 1.5 0 0 0 1.5-1.2L21 8H6"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M9 11.5 11.5 14 16 8.5"/><rect x="3.5" y="3.5" width="17" height="17" rx="4"/></svg>',
  bulb:'<svg viewBox="0 0 24 24"><path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2.9 1.9v.2h5.2v-.2c0-.7.3-1.4.9-1.9A6 6 0 0 0 12 3Z"/></svg>'
};

const STORE = (typeof VALIGIA_UI !== 'undefined' && VALIGIA_UI.storeKey) || 'valigia_australia_v1';

function esc(s){
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function loadState(){
  try{ return JSON.parse(localStorage.getItem(STORE)) || {}; }
  catch(e){ return {}; }
}
function saveState(st){
  try{ localStorage.setItem(STORE, JSON.stringify(st)); flash(); }
  catch(e){ /* niente */ }
}

let state = loadState();
let flashT;

function flash(){
  const el = document.getElementById('saveHint');
  if(!el) return;
  el.textContent = 'Salvato.';
  el.classList.add('flash');
  clearTimeout(flashT);
  flashT = setTimeout(()=>{
    el.classList.remove('flash');
    el.textContent = VALIGIA_UI.saveHint || '';
  }, 1400);
}

function tagHtml(tags){
  if(!tags || !tags.length) return '';
  const label = VALIGIA_UI.tagLabels || {};
  return '<div class="tags">' + tags.map(t=>{
    const short = {leg1:'leg 1', leg2:'leg 2', foto:'foto', key:'critico', sera:'sera'};
    return `<span class="tag ${esc(t)}">${esc(short[t] || label[t] || t)}</span>`;
  }).join('') + '</div>';
}

/* ---------- testata ---------- */
function renderHero(){
  const U = VALIGIA_UI;
  document.title = U.title + ' · Australia';
  document.getElementById('heroKicker').textContent = U.kicker || '';
  document.getElementById('heroTitle').textContent = U.title || '';
  document.getElementById('heroSub').textContent = U.subtitle || '';
  document.getElementById('heroStats').innerHTML =
    (U.stats||[]).map(s=>`<div class="stat"><b>${esc(s.v)}</b><span>${esc(s.l)}</span></div>`).join('');
  document.getElementById('saveHint').textContent = U.saveHint || '';
  document.getElementById('footText').innerHTML = esc(U.footer || '');
}

/* ---------- piano lavaggi ---------- */
function renderWash(){
  const U = VALIGIA_UI;
  const host = document.getElementById('washBox');
  if(!U.wash || !U.wash.length){ host.style.display='none'; return; }
  host.innerHTML = `
    <h3>${esc(U.washTitle||'Piano lavaggi')} ${U.washBadge?`<span class="tag key">${esc(U.washBadge)}</span>`:''}</h3>
    ${U.washIntro?`<p>${esc(U.washIntro)}</p>`:''}
    <div class="wash-grid">
      ${U.wash.map(w=>`<div class="wash-card ${esc(w.kind||'')}"><b>${esc(w.h)}</b><span>${esc(w.p)}</span></div>`).join('')}
    </div>`;
}

/* ---------- legenda ---------- */
function renderLegend(){
  const U = VALIGIA_UI;
  const order = U.legendOrder || Object.keys(U.tagLabels||{});
  document.getElementById('legendBox').innerHTML =
    '<b>Legenda</b>' + order.map(k=>`<span class="tag ${esc(k)}">${esc((U.tagLabels||{})[k]||k)}</span>`).join('');
}

/* ---------- sezioni ---------- */
function render(){
  renderHero();
  renderWash();
  renderLegend();

  const host = document.getElementById('sections');
  host.innerHTML = '';

  VALIGIA.forEach((sec, idx)=>{
    const el = document.createElement('section');
    el.className = 'block' + (idx===0 ? ' open' : '');
    el.dataset.tone = sec.tone || '';
    el.dataset.sid = sec.id;

    let body = '';
    (sec.groups||[]).forEach(g=>{
      body += '<div class="group"><h4>'+esc(g.h)+'</h4>';
      if(g.hint) body += '<p class="ghint">'+esc(g.hint)+'</p>';

      if(sec.kind === 'notes'){
        body += '<div class="notecards">';
        (g.notes||[]).forEach(nt=>{
          body += `<div class="notecard"><b>${esc(nt.h)}</b><p>${esc(nt.p)}</p></div>`;
        });
        body += '</div></div>';
        return;
      }

      body += '<ul class="items">';
      (g.items||[]).forEach(it=>{
        if(!it || !it.id || !it.name) return;
        const on = !!state[it.id];
        body += `<li class="${on?'done':''}" data-id="${esc(it.id)}">
          <input type="checkbox" class="cbx" ${on?'checked':''} id="cb-${esc(it.id)}">
          <div class="it-main">
            <label class="it-name" for="cb-${esc(it.id)}">${esc(it.name)}${it.qty?`<span class="it-qty">${esc(it.qty)}</span>`:''}</label>
            ${it.note?`<span class="it-note">${esc(it.note)}</span>`:''}
            ${tagHtml(it.tags)}
          </div>
        </li>`;
      });
      body += '</ul></div>';
    });

    el.innerHTML = `
      <div class="block-head">
        <div class="block-icon">${ICONS[sec.icon] || ICONS.check}</div>
        <div class="block-title">
          <span class="n">${esc(sec.n)}</span>
          <h2>${esc(sec.title)}</h2>
          <p>${esc(sec.sub)}</p>
        </div>
        ${sec.kind==='notes'
          ? '<div class="block-count">da leggere</div>'
          : `<div class="block-count" data-count="${esc(sec.id)}">0/0</div>`}
        <svg class="chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <div class="block-body">${body}</div>`;

    el.querySelector('.block-head').addEventListener('click', e=>{
      if(e.target.closest('.cbx')) return;
      el.classList.toggle('open');
    });
    host.appendChild(el);
  });

  host.querySelectorAll('.cbx').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const li = cb.closest('li');
      const id = li.dataset.id;
      if(cb.checked) state[id] = true; else delete state[id];
      li.classList.toggle('done', cb.checked);
      saveState(state);
      updateCounts();
    });
  });

  updateCounts();
}

function updateCounts(){
  let total = 0, done = 0;
  const legend = [];
  VALIGIA.forEach(sec=>{
    if(sec.kind === 'notes') return;
    let t=0, d=0;
    (sec.groups||[]).forEach(g=>(g.items||[]).forEach(it=>{
      if(!it || !it.id || !it.name) return;
      t++; if(state[it.id]) d++;
    }));
    total += t; done += d;
    const badge = document.querySelector(`[data-count="${sec.id}"]`);
    if(badge) badge.textContent = d+'/'+t;
    legend.push(`<span>${esc(sec.title)} <b>${d}/${t}</b></span>`);
  });
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById('pctLabel').textContent = pct+'%';
  document.getElementById('barFill').style.width = pct+'%';
  document.getElementById('progLegend').innerHTML = legend.join('');
}

/* ---------- pulsanti ---------- */
document.getElementById('btnExpand').addEventListener('click', ()=>{
  document.querySelectorAll('section.block').forEach(s=>s.classList.add('open'));
});
document.getElementById('btnCollapse').addEventListener('click', ()=>{
  document.querySelectorAll('section.block').forEach(s=>s.classList.remove('open'));
});
document.getElementById('btnPrint').addEventListener('click', ()=>window.print());
document.getElementById('btnReset').addEventListener('click', ()=>{
  if(!confirm('Azzerare tutte le spunte?')) return;
  state = {};
  saveState(state);
  render();
});

/* ---------- avvio, con messaggio chiaro se i dati sono rotti ---------- */
if(typeof VALIGIA === 'undefined' || typeof VALIGIA_UI === 'undefined'){
  document.getElementById('sections').innerHTML =
    '<section class="block open"><div class="block-body" style="padding:20px">' +
    '<h2 style="font-family:Fraunces,serif;margin:0 0 8px">Dati non caricati</h2>' +
    '<p>valigia-data.js non e\' stato letto o contiene un errore di sintassi. ' +
    'Apri la console del browser con F12: la riga in rosso ti dice la riga sbagliata. ' +
    'Se hai appena modificato il file a mano, controlla virgole e parentesi; ' +
    'valigia.py salva sempre una copia di sicurezza in valigia-data.js.bak.</p>' +
    '</div></section>';
} else {
  render();
}
