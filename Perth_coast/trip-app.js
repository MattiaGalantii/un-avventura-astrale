/* ============================================================
   RENDER
   ============================================================ */
const root = document.getElementById('blocks');
function esc(s){
  return s==null ? '' : String(s).replace(/[&<>"']/g, ch=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[ch]));
}

/* ---------- Icone (SVG stroke, colore = currentColor) ---------- */
const ICONS = {
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a7 7 0 0 0 10 10z"/>',
  flag:'<path d="M5 21V4"/><path d="M5 4.5c3-1.7 6 1.7 9 0V12c-3 1.7-6-1.7-9 0"/>',
  ring:'<circle cx="12" cy="12" r="7.5" stroke-dasharray="4.5 4.5"/>',
  coffee:'<path d="M17 10h1.2a3 3 0 0 1 0 6H17"/><path d="M4 10h13v5a4.5 4.5 0 0 1-4.5 4.5h-4A4.5 4.5 0 0 1 4 15v-5z"/><path d="M8 6.5V5M12 6.5V5"/>',
  fuel:'<rect x="4" y="4" width="9" height="17" rx="1.5"/><path d="M3 21h11M6.5 8.5h4"/><path d="M13 12h1.5a2 2 0 0 1 2 2v2.5a1.5 1.5 0 0 0 3 0V10l-2.5-3"/>',
  food:'<path d="M6 3v18"/><path d="M4 3v5a2 2 0 0 0 4 0V3"/><path d="M18 3c-1.6 2.7-2.2 5-2.2 7.5 0 1.9 1 3 2.2 3.2V21"/>',
  camera:'<path d="M4 8.5h3.2L9 6h6l1.8 2.5H20V19H4z"/><circle cx="12" cy="13.3" r="3.4"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  car:'<path d="M4 16v-4l1.8-4.2A1.6 1.6 0 0 1 7.3 7h9.4a1.6 1.6 0 0 1 1.5.8L20 12v4"/><path d="M4 12h16"/><circle cx="7.5" cy="16.5" r="1.7"/><circle cx="16.5" cy="16.5" r="1.7"/>',
  ferry:'<path d="M4 15l8-2.5L20 15l-1.6 4a1.6 1.6 0 0 1-1.5 1H7.1a1.6 1.6 0 0 1-1.5-1L4 15z"/><path d="M8 12.5V8h8v4.5"/><path d="M12 8V5"/>',
  bike:'<circle cx="6.2" cy="16" r="3.4"/><circle cx="17.8" cy="16" r="3.4"/><path d="M6.2 16 10 8h4.4M12 16l3-8"/><path d="M8.4 8H12"/>',
  walk:'<path fill="currentColor" stroke="none" d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>',
  bus:'<rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 10h16"/><path d="M9 3v7M15 3v7"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/>',
  tram:'<rect x="5" y="4" width="14" height="12" rx="2"/><path d="M5 10h14M12 4v6"/><path d="M12 4V2M8 2h8"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/>',
  transit:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M12 3v8"/><circle cx="9" cy="14.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="15" cy="14.5" r="0.9" fill="currentColor" stroke="none"/><path d="M8.5 18L7 21M15.5 18L17 21"/>',
  plane:'<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  bed:'<path d="M3 19v-9h12.5A4.5 4.5 0 0 1 20 14.5V19"/><path d="M3 10V6M3 15h17"/><circle cx="7.3" cy="13" r="1.7"/>',
  pencil:'<path d="M14.5 4.5 19 9"/><path d="M4 20h4L20 8a2.1 2.1 0 0 0-3-3L5 17z"/>'
};
function iconSvg(name, size){
  const body = ICONS[name] || ICONS.pin;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/* Tipi di tappa: icona, etichetta e colore in legenda */
const TYPE_META = {
  planned:{icon:'flag', label:'prevista', color:'var(--terra)'},
  optional:{icon:'ring', label:'facoltativa', color:'var(--teal)'},
  quick:{icon:'coffee', label:'sosta veloce', color:'var(--ink-soft)'},
  fuel:{icon:'fuel', label:'carburante', color:'#9a7836'},
  lunch:{icon:'food', label:'pranzo', color:'var(--ochre)'},
  viewpoint:{icon:'camera', label:'panorama', color:'var(--pink)'}
};
/* Modalita di spostamento sui connettori */
const MODE_META = {
  drive:{icon:'car', label:'in auto'},
  ferry:{icon:'ferry', label:'traghetto'},
  walk:{icon:'walk', label:'a piedi'},
  bike:{icon:'bike', label:'in bici'},
  fly:{icon:'plane', label:'in volo'},
  bus:{icon:'bus', label:'in bus'},
  tram:{icon:'tram', label:'in tram'},
  'public transport':{icon:'transit', label:'mezzi pubblici'}
};
/* Chiave modalita -> token classe CSS (gli spazi diventano trattini) */
function modeSlug(key){ return String(key).trim().replace(/\s+/g, '-'); }
const NUM_PALETTE = ['var(--teal-deep)','var(--terra)','var(--ochre)','var(--teal)','var(--pink)','var(--terra-deep)'];

const UI = typeof TRIP_UI !== 'undefined' ? TRIP_UI : {};
const DAILY_TITLES = Object.assign({
  night:'Notte',
  excursions:'Escursioni previste',
  foodFuel:'Cibo e rifornimenti',
  notes:'Note libere / deviazioni'
}, UI.dailyTitles || {});

/* Icona per ciascun box giornaliero */
const DAILY_ICONS = {night:'bed', excursions:'pin', food:'food', notes:'pencil'};

/* ---------- Link a Google Maps ---------- */
const MAPS_SUFFIX = UI.mapsSuffix !== undefined ? UI.mapsSuffix : 'Australia';
/* Metti map:false su una tappa per non renderla cliccabile (es. segnaposto "To-Do"). */
function mapsLink(place, node){
  const name = String(place || '').trim();
  if(!name || (node && node.map === false)) return esc(place || '');
  const query = encodeURIComponent(MAPS_SUFFIX ? `${name}, ${MAPS_SUFFIX}` : name);
  return `<a class="maps" href="https://www.google.com/maps/search/?api=1&amp;query=${query}"
    target="_blank" rel="noopener" title="Apri su Google Maps">${esc(name)}<span class="mp">${iconSvg('pin',11)}</span></a>`;
}

/* ---------- "Oggi": evidenzia il giorno in corso ---------- */
const TODAY = new Date(); TODAY.setHours(0,0,0,0);
const TRIP_YEAR = UI.tripYear || TODAY.getFullYear();
function isToday(dayText){
  const m = /(\d{1,2})\s*\/\s*(\d{1,2})/.exec(dayText || '');
  if(!m) return false;
  const d = new Date(TRIP_YEAR, Number(m[2]) - 1, Number(m[1]));
  return d.getTime() === TODAY.getTime();
}

let dayCount = 0;
TRIP.forEach((b, bi)=>{
  const key = b.id || `b${bi}`;
  const det = document.createElement('details');
  det.className = 'block' + (b.intro?' intro':'');
  det.dataset.blockId = key;
  det.style.animationDelay = (bi*0.05)+'s';
  if(bi===0 || bi===1) det.open = true;
  if(!b.intro) dayCount++;

  const today = !b.intro && isToday(b.day);
  if(today){ det.classList.add('today'); det.open = true; }

  const sum = document.createElement('summary');
  sum.className = 'bhead';
  const numColor = b.intro ? 'var(--teal-deep)' : NUM_PALETTE[(dayCount-1)%NUM_PALETTE.length];
  sum.innerHTML = `
    <div class="bnum" style="background:${numColor}">${b.intro?'i':dayCount}</div>
    <div class="titles">
      <div class="bday">${esc(b.day)}${today?'<span class="today-badge">oggi</span>':''}</div>
      <div class="btitle">${esc(b.title)}</div>
      <div class="bchips">${(b.chips||[]).map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div>
    </div>
    <div class="caret">v</div>`;
  det.appendChild(sum);

  const body = document.createElement('div');
  body.className = b.intro ? 'intro-grid' : 'bbody';

  if(b.intro){
    b.boxes.forEach((box,xi)=>{
      const d = document.createElement('div');
      d.className = 'ibox sec '+box.cls;
      d.innerHTML = `<h4>${esc(box.h)}</h4>`;
      d.appendChild(renderChecks(box.items, `${key}-x${xi}`, 'todo'));
      body.appendChild(d);
    });
    body.appendChild(renderLegend());
  } else {
    const route = b.route || routeFromLegacyDay(b);
    const daily = b.daily || dailyFromLegacyDay(b);
    if(route) body.appendChild(renderRouteTimeline(route));
    body.appendChild(renderDailyGrid(daily, `${key}-note`));
  }
  det.appendChild(body);
  root.appendChild(det);
});

function renderChecks(items, prefix, kind){
  const ul = document.createElement('ul'); ul.className='items';
  items.forEach((it,i)=>{
    const id = `${prefix}-${i}`;
    const li = document.createElement('li');
    li.innerHTML = `<label class="tappa">
        <input type="checkbox" data-id="${id}" data-kind="${kind}">
        <span class="t-txt"><b>${esc(it.t)}</b>${it.s?`<small>${esc(it.s)}</small>`:''}</span>
      </label>`;
    ul.appendChild(li);
  });
  return ul;
}

/* ---------- Legenda (auto-generata) ---------- */
function renderLegend(){
  const el = document.createElement('div');
  el.className = 'legend';
  const types = Object.keys(TYPE_META).map(k=>{
    const m = TYPE_META[k];
    return `<span class="lg" style="--c:${m.color}">${iconSvg(m.icon,12)}${esc(m.label)}</span>`;
  }).join('');
  const modes = Object.keys(MODE_META).map(k=>{
    const m = MODE_META[k];
    return `<span class="lg lg-mode m-${modeSlug(k)}">${iconSvg(m.icon,12)}${esc(m.label)}<i class="lg-line" aria-hidden="true"></i></span>`;
  }).join('');
  el.innerHTML = `
    <h4>Legenda percorso</h4>
    <div class="legend-row"><span class="legend-cap">Tappe</span>${types}</div>
    <div class="legend-row"><span class="legend-cap">Spostamenti</span>${modes}</div>`;
  return el;
}

/* ---------- Fallback per giorni in formato vecchio ---------- */
function legacyTimelineText(value){
  return String(value == null ? '' : value).replace(/<[^>]*>/g, '').trim();
}
function routeFromLegacyDay(day){
  const routeText = [day.title, ...(day.chips || [])].find(text=>/->|→/.test(text || ''));
  if(!routeText) return null;
  const places = String(routeText).split(/->|→/).map(part=>part.trim()).filter(Boolean);
  if(places.length < 2) return null;
  const distance = (day.chips || []).find(chip=>/km/i.test(chip));
  const duration = (day.chips || []).find(chip=>/\bh\b|min/i.test(chip));
  return {
    start:{place:places[0], label:'Partenza'}, stops:[],
    end:{place:places[places.length-1], label:'Arrivo / notte', segmentFromPrevious:{distance, duration}}
  };
}
function dailyFromLegacyDay(day){
  const timeline = Array.isArray(day.timeline) ? day.timeline : [];
  const legacyObjects = items=> (Array.isArray(items) ? items : []).map(item=>
    item && typeof item === 'object'
      ? {t:item.t || '', s:item.s || '', meta:item.meta || []}
      : {t:legacyTimelineText(item), s:'', meta:[]}
  );
  const sleepItems = timeline.filter(item=>item.kind === 'sleep');
  const nightSource = sleepItems[0] || (Array.isArray(day.sleep) ? day.sleep[0] : null);
  const night = nightSource && typeof nightSource === 'object'
    ? {title:nightSource.t || '', text:nightSource.s || '', meta:nightSource.meta || []}
    : {title:legacyTimelineText(nightSource), text:'', meta:[]};
  const excursions = timeline.length
    ? timeline.filter(item=>item.kind === 'must' || item.kind === 'extra').map(item=>({t:item.t || '', s:item.s || '', meta:item.meta || []}))
    : [...legacyObjects(day.must), ...legacyObjects(day.extra)];
  const foodFuel = timeline.length
    ? timeline.filter(item=>item.kind === 'prac').map(item=>({t:item.t || '', s:item.s || '', meta:item.meta || []}))
    : legacyObjects(day.prac);
  return {night, excursions, foodFuel, notes:[]};
}

/* ---------- Road ribbon: percorso fisico ---------- */
function renderRouteTimeline(route){
  const rt = document.createElement('div');
  rt.className = 'rt';
  rt.setAttribute('aria-label', 'Percorso della giornata');
  const stops = Array.isArray(route.stops) ? route.stops : [];

  rt.appendChild(renderMainNode(route.start || {}, 'start', 'sun'));

  const journey = document.createElement('details');
  journey.className = 'rt-journey';
  journey.open = true;
  const toggle = document.createElement('summary');
  toggle.className = 'rt-toggle';
  const openLabel = route.toggleOpen || UI.routeToggleOpen || 'Nascondi percorso:';
  const closedLabel = route.toggleClosed || UI.routeToggleClosed || 'Mostra percorso:';
  const stopLabel = stops.length === 1
    ? (UI.routeStopSingular || 'tappa')
    : (UI.routeStopPlural || 'tappe');
  toggle.innerHTML = `<span class="rt-toggle-pill">
      <span class="rt-toggle-open">${esc(openLabel)}</span>
      <span class="rt-toggle-closed">${esc(closedLabel)}</span>
      <b>${stops.length} ${esc(stopLabel)}</b><i aria-hidden="true"></i>
    </span>`;
  journey.appendChild(toggle);

  const path = document.createElement('div');
  path.className = 'rt-path';
  stops.forEach(stop=>{
    path.appendChild(renderSegment(stop.segmentFromPrevious));
    path.appendChild(renderStopNode(stop));
  });
  path.appendChild(renderSegment((route.end || {}).segmentFromPrevious));
  journey.appendChild(path);
  rt.appendChild(journey);

  rt.appendChild(renderMainNode(route.end || {}, 'endnode', 'moon'));
  return rt;
}

function renderMainNode(node, extraCls, defaultIcon){
  const el = document.createElement('div');
  el.className = `rt-node main ${extraCls}`;
  const meta = [node.label, node.time].filter(Boolean);
  el.innerHTML = `
    <span class="rt-marker">${iconSvg(node.icon || defaultIcon, 16)}</span>
    <div class="rt-card">
      ${meta.length ? `<div class="rt-card-meta">${meta.map(v=>`<span>${esc(v)}</span>`).join('')}</div>` : ''}
      <div class="rt-place">${mapsLink(node.place || 'Tappa', node)}</div>
      ${node.note ? `<div class="rt-note">${esc(node.note)}</div>` : ''}
    </div>`;
  return el;
}

function renderStopNode(stop){
  const type = TYPE_META[stop.type] ? stop.type : 'planned';
  const meta = TYPE_META[type];
  const el = document.createElement('div');
  el.className = `rt-node sub t-${type}`;
  el.innerHTML = `
    <span class="rt-marker">${iconSvg(stop.icon || meta.icon, 12)}</span>
    <div class="rt-stop">
      <div class="rt-stop-top">
        <b>${mapsLink(stop.place || 'Tappa', stop)}</b>
        <span class="rt-tag">${esc(meta.label)}</span>
        ${stop.time ? `<span class="rt-time">${esc(stop.time)}</span>` : ''}
      </div>
      ${stop.note ? `<div class="rt-note">${esc(stop.note)}</div>` : ''}
    </div>`;
  return el;
}

function renderSegment(segment){
  const seg = segment || {};
  const modeKey = MODE_META[seg.mode] ? seg.mode : 'drive';
  const el = document.createElement('div');
  el.className = `rt-seg m-${modeSlug(modeKey)}`;
  const meta = [seg.distance, seg.duration].filter(Boolean);
  const notes = [...(Array.isArray(seg.notes) ? seg.notes : []), ...(Array.isArray(seg.markers) ? seg.markers : [])];
  const pillText = meta.length ? meta.join(' · ') : (modeKey !== 'drive' ? MODE_META[modeKey].label : '');
  if(!pillText && !notes.length){
    el.classList.add('empty');
    return el;
  }
  el.innerHTML = `<div class="rt-seg-body">
      ${pillText ? `<span class="rt-pill">${iconSvg(MODE_META[modeKey].icon, 12)}<span>${esc(pillText)}</span></span>` : ''}
      ${notes.length ? `<div class="rt-chips">${notes.map(v=>`<span>${esc(v)}</span>`).join('')}</div>` : ''}
    </div>`;
  return el;
}

/* ---------- Box informativi giornalieri ---------- */
function renderDailyGrid(daily, noteId){
  const T = Object.assign({}, DAILY_TITLES, daily.titles || {});
  const grid = document.createElement('div');
  grid.className = 'daily-grid';
  grid.appendChild(renderDailyBox(T.night, 'night', renderNight(daily.night || {})));
  grid.appendChild(renderDailyBox(T.excursions, 'excursions', renderDailyItems(daily.excursions)));
  grid.appendChild(renderDailyBox(T.foodFuel, 'food', renderDailyItems(daily.foodFuel)));
  const notesContent = document.createElement('div');
  notesContent.className = 'daily-notes-content';
  notesContent.appendChild(renderDailyItems(daily.notes));
  notesContent.appendChild(noteBlock(noteId));
  grid.appendChild(renderDailyBox(T.notes, 'notes', notesContent));
  return grid;
}

function renderDailyBox(title, cls, content){
  const box = document.createElement('section');
  box.className = `daily-box ${cls}`;
  box.innerHTML = `<h4>${iconSvg(DAILY_ICONS[cls] || 'pin', 13)}${esc(title)}</h4>`;
  box.appendChild(content);
  return box;
}

function renderNight(night){
  const el = document.createElement('div');
  el.className = 'night-content';
  const meta = Array.isArray(night.meta) ? night.meta : [];
  el.innerHTML = `
    <div class="daily-item-title">${esc(night.title || 'Da definire')}</div>
    ${night.text ? `<div class="daily-item-text">${esc(night.text)}</div>` : ''}
    ${meta.length ? `<div class="daily-meta">${meta.map(value=>`<span>${esc(value)}</span>`).join('')}</div>` : ''}`;
  return el;
}

function renderDailyItems(items){
  const list = document.createElement('div');
  list.className = 'daily-items';
  (Array.isArray(items) ? items : []).forEach(item=>{
    const row = document.createElement('div');
    row.className = 'daily-item';
    const copy = document.createElement('div');
    copy.className = 'daily-item-copy';
    const meta = Array.isArray(item.meta) ? item.meta : [];
    copy.innerHTML = `<div class="daily-item-title">${esc(item.t)}</div>
      ${item.s ? `<div class="daily-item-text">${esc(item.s)}</div>` : ''}
      ${meta.length ? `<div class="daily-meta">${meta.map(value=>`<span>${esc(value)}</span>`).join('')}</div>` : ''}`;
    row.appendChild(copy);
    list.appendChild(row);
  });
  if(!list.children.length) list.innerHTML = '<div class="daily-empty">Niente di pianificato.</div>';
  return list;
}

function noteBlock(id){
  const note = document.createElement('div');
  note.className = 'note';
  note.contentEditable = 'true';
  note.dataset.note = id;
  note.dataset.ph = 'Scrivi qui idee, prenotazioni, link, orari...';
  return note;
}

/* ============================================================
   PERSISTENZA  (window.storage in artifact; localStorage in locale)
   ============================================================ */
const KEY='coralcoast_v1';
let state={checks:{},notes:{},expenses:[],open:{}};
let loaded=false;
const hasStore = (typeof window!=='undefined' && window.storage && typeof window.storage.get==='function');
let hasLocalStore = false;
try{ hasLocalStore = (typeof window!=='undefined' && !!window.localStorage); }catch(e){ hasLocalStore = false; }

async function load(){
  if(hasStore){
    try{ const r=await window.storage.get(KEY); if(r&&r.value) state=JSON.parse(r.value);}catch(e){/* prima volta */}
  } else if(hasLocalStore) {
    try{ const r=window.localStorage.getItem(KEY); if(r) state=JSON.parse(r); }catch(e){/* prima volta */}
  }
  state.checks = state.checks || {};
  state.notes = state.notes || {};
  state.open = state.open || {};
  state.expenses = normalizeExpenses(state.expenses);
  document.querySelectorAll('input[type=checkbox][data-id]').forEach(c=>{
    if(state.checks[c.dataset.id]) c.checked=true;
  });
  document.querySelectorAll('.note[data-note]').forEach(n=>{
    if(state.notes[n.dataset.note]!=null) n.innerHTML=state.notes[n.dataset.note];
  });
  document.querySelectorAll('details.block[data-block-id]').forEach(d=>{
    const v = state.open[d.dataset.blockId];
    if(v!==undefined) d.open = v;
  });
  updateCosts();
  loaded=true;
}
/* Ricorda quali giorni sono aperti/chiusi (sopravvive al reload del live server) */
document.addEventListener('toggle', e=>{
  const d = e.target;
  if(!loaded || !(d instanceof HTMLDetailsElement) || !d.classList.contains('block') || !d.dataset.blockId) return;
  state.open = state.open || {};
  state.open[d.dataset.blockId] = d.open;
  save(false);
}, true);
let saveT;
function save(flash){
  clearTimeout(saveT);
  saveT=setTimeout(async()=>{
    try{
      if(hasStore) await window.storage.set(KEY, JSON.stringify(state));
      else if(hasLocalStore) window.localStorage.setItem(KEY, JSON.stringify(state));
      else { hint('Anteprima locale: salvataggio non disponibile.'); return; }
      if(flash!==false) hint('Salvato');
    }
    catch(e){ hint('Salvataggio non riuscito'); }
  },350);
}
function hint(msg){
  const h=document.getElementById('savehint'); h.textContent=msg; h.classList.add('flash');
  clearTimeout(h._t); h._t=setTimeout(()=>{h.classList.remove('flash');
    h.textContent='Le modifiche (checkbox, note e costi) si salvano da sole.';},1600);
}

document.addEventListener('change', e=>{
  const c=e.target.closest('input[type=checkbox][data-id]');
  if(!c) return;
  state.checks[c.dataset.id]=c.checked;
  save();
});
document.addEventListener('input', e=>{
  const n=e.target.closest('.note[data-note]');
  if(!n) return;
  state.notes[n.dataset.note]=n.innerHTML; save();
});

function money(n){
  return '$' + (Math.round((Number(n) || 0) * 100) / 100).toLocaleString('en-AU', {minimumFractionDigits:0, maximumFractionDigits:2});
}
function normalizeExpenses(expenses){
  if(Array.isArray(expenses)) return expenses.map((entry, index)=>({
    id: entry.id || `legacy-${Date.now()}-${index}`,
    type: ['fuel','food','other'].includes(entry.type) ? entry.type : 'other',
    amount: Number(entry.amount) || 0,
    note: entry.note || '',
    createdAt: entry.createdAt || new Date().toISOString()
  })).filter(entry=>entry.amount > 0);
  if(expenses && typeof expenses === 'object'){
    return ['fuel','food','other'].map(type=>({
      id: `legacy-${type}-${Date.now()}`,
      type,
      amount: Number(expenses[type]) || 0,
      note: 'Totale precedente',
      createdAt: new Date().toISOString()
    })).filter(entry=>entry.amount > 0);
  }
  return [];
}
function expenseLabel(type){
  return {fuel:'Benzina', food:'Cibo', other:'Altro'}[type] || 'Altro';
}
function expenseTotals(){
  return state.expenses.reduce((totals, entry)=>{
    const type = ['fuel','food','other'].includes(entry.type) ? entry.type : 'other';
    totals[type] += Number(entry.amount) || 0;
    totals.total += Number(entry.amount) || 0;
    return totals;
  }, {fuel:0, food:0, other:0, total:0});
}
function updateCosts(){
  const totals = expenseTotals();
  document.getElementById('fuel-total').textContent = money(totals.fuel);
  document.getElementById('food-total').textContent = money(totals.food);
  document.getElementById('other-total').textContent = money(totals.other);
  document.getElementById('cost-total').textContent = money(totals.total);
  document.getElementById('modal-cost-total').textContent = money(totals.total);
  document.getElementById('expense-total').textContent = money(totals.total);
  document.getElementById('expense-count').textContent = `${state.expenses.length} ${state.expenses.length===1?'entrata':'entrate'} nel registro`;
  renderExpenseLog();
}
function addCosts(){
  const fields = [
    ['fuel', document.getElementById('cost-fuel')],
    ['food', document.getElementById('cost-food')],
    ['other', document.getElementById('cost-other')]
  ];
  let changed = false;
  fields.forEach(([key, input])=>{
    const value = Number(input.value);
    if(value > 0){
      state.expenses.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: key,
        amount: value,
        note: '',
        createdAt: new Date().toISOString()
      });
      input.value = '';
      changed = true;
    }
  });
  if(!changed) return;
  updateCosts();
  save();
}
function renderExpenseLog(){
  const host = document.getElementById('expense-log');
  if(!state.expenses.length){
    host.innerHTML = '<div class="expense-empty">Nessuna entrata registrata.</div>';
    return;
  }
  host.innerHTML = `
    <table class="expense-table">
      <thead>
        <tr><th>Categoria</th><th>Importo</th><th>Nota</th><th>Data</th><th></th></tr>
      </thead>
      <tbody>
        ${state.expenses.map(entry=>`
          <tr data-expense-id="${entry.id}">
            <td data-label="Categoria">
              <select data-expense-field="type">
                <option value="fuel"${entry.type==='fuel'?' selected':''}>Benzina</option>
                <option value="food"${entry.type==='food'?' selected':''}>Cibo</option>
                <option value="other"${entry.type==='other'?' selected':''}>Altro</option>
              </select>
            </td>
            <td data-label="Importo"><input data-expense-field="amount" type="number" inputmode="decimal" min="0" step="0.01" value="${esc(entry.amount)}"></td>
            <td data-label="Nota"><input data-expense-field="note" type="text" value="${esc(entry.note)}" placeholder="es. Coles, pieno, cena..."></td>
            <td data-label="Data">${new Date(entry.createdAt).toLocaleDateString('it-IT')}</td>
            <td data-label="Azioni"><div class="expense-actions"><button class="tool" data-save-expense>Salva</button><button class="tool danger" data-delete-expense>Elimina</button></div></td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}
function openExpenseLog(){
  const modal = document.getElementById('expense-modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  renderExpenseLog();
}
function closeExpenseLog(){
  const modal = document.getElementById('expense-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
function findExpenseRow(target){
  const row = target.closest('[data-expense-id]');
  if(!row) return null;
  return {row, entry: state.expenses.find(e=>e.id===row.dataset.expenseId)};
}
function saveExpenseRow(target){
  const found = findExpenseRow(target);
  if(!found || !found.entry) return;
  const {row, entry} = found;
  const type = row.querySelector('[data-expense-field="type"]').value;
  const amount = Number(row.querySelector('[data-expense-field="amount"]').value);
  const note = row.querySelector('[data-expense-field="note"]').value.trim();
  if(!(amount > 0)){ hint('Inserisci un importo valido.'); return; }
  entry.type = ['fuel','food','other'].includes(type) ? type : 'other';
  entry.amount = amount;
  entry.note = note;
  updateCosts();
  save();
}
function deleteExpenseRow(target){
  const found = findExpenseRow(target);
  if(!found || !found.entry) return;
  if(!confirm(`Eliminare questa entrata ${expenseLabel(found.entry.type)} da ${money(found.entry.amount)}?`)) return;
  state.expenses = state.expenses.filter(entry=>entry.id!==found.entry.id);
  updateCosts();
  save();
}

document.getElementById('expand').onclick=()=>document.querySelectorAll('details.block, details.rt-journey').forEach(d=>d.open=true);
document.getElementById('collapse').onclick=()=>document.querySelectorAll('details.block').forEach(d=>d.open=false);
document.getElementById('print').onclick=()=>{
  document.querySelectorAll('details.block, details.rt-journey').forEach(d=>d.open=true);
  setTimeout(()=>window.print(),200);
};
document.getElementById('add-cost').onclick=addCosts;
document.getElementById('open-expense-log').onclick=openExpenseLog;
document.getElementById('open-expense-log-inline').onclick=openExpenseLog;
document.getElementById('close-expense-log').onclick=closeExpenseLog;
document.querySelectorAll('[data-close-expense-log]').forEach(el=>{ el.onclick=closeExpenseLog; });
document.getElementById('expense-log').addEventListener('click', e=>{
  if(e.target.closest('[data-save-expense]')) saveExpenseRow(e.target);
  if(e.target.closest('[data-delete-expense]')) deleteExpenseRow(e.target);
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeExpenseLog(); });
document.querySelectorAll('#cost-fuel,#cost-food,#cost-other').forEach(input=>{
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') addCosts(); });
});
document.getElementById('reset').onclick=async()=>{
  if(!confirm('Azzerare tutte le spunte, le note e i costi?')) return;
  state={checks:{},notes:{},expenses:[],open:state.open||{}};
  document.querySelectorAll('input[type=checkbox][data-id]').forEach(c=>c.checked=false);
  document.querySelectorAll('.note[data-note]').forEach(n=>n.innerHTML='');
  updateCosts();
  if(hasStore){ try{ await window.storage.delete(KEY);}catch(e){} }
  else if(hasLocalStore){ try{ window.localStorage.removeItem(KEY); }catch(e){} }
  hint('Azzerato');
};

load();
