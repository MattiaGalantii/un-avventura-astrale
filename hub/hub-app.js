/* ============================================================
   HUB DEL VIAGGIO - legge i due trip-data.js, li arricchisce con
   hub-geo.js e disegna: poster, mappa Leaflet, timeline, da fare,
   voli, documenti, spese.
   ============================================================ */
(function(){
'use strict';

/* ---------- utils ---------- */
const $ = (s, el=document)=>el.querySelector(s);
const esc = s => s==null ? '' : String(s).replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const CFG = HUB_CONFIG;
const LEG_BY = Object.fromEntries(CFG.legs.map(l=>[l.key,l]));
const MESI = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
const GIORNI = ['dom','lun','mar','mer','gio','ven','sab'];
const TODAY = new Date(); TODAY.setHours(0,0,0,0);

/* Icone (stesso set dei planner) */
const ICONS = {
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
  doc:'<path d="M6 2h8l5 5v15H6z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6"/>',
  ext:'<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 13v7H4V6h7"/>',
  map:'<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>'
};
const ico = (n, s=14) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||ICONS.pin}</svg>`;

const TYPE_META = {
  planned:{icon:'flag', label:'prevista', color:'#c65a37'},
  optional:{icon:'ring', label:'facoltativa', color:'#1f7d77'},
  quick:{icon:'coffee', label:'sosta veloce', color:'#5e5147'},
  fuel:{icon:'fuel', label:'carburante', color:'#9a7836'},
  lunch:{icon:'food', label:'pranzo', color:'#b8842a'},
  viewpoint:{icon:'camera', label:'panorama', color:'#d76b94'},
  night:{icon:'bed', label:'notte', color:'#2c2420'},
  start:{icon:'flag', label:'partenza', color:'#2c2420'}
};
const MODE_META = {
  drive:{icon:'car', label:'in auto'}, auto:{icon:'car', label:'in auto'},
  ferry:{icon:'ferry', label:'traghetto'}, walk:{icon:'walk', label:'a piedi'},
  bike:{icon:'bike', label:'in bici'}, fly:{icon:'plane', label:'in volo'},
  bus:{icon:'bus', label:'in bus'}, tram:{icon:'tram', label:'in tram'},
  'public transport':{icon:'transit', label:'mezzi pubblici'}
};
const DRIVE_MODES = new Set(['drive','auto',undefined,null,'']);

/* ---------- parsing ---------- */
function parseDay(dayText){
  const m = /Giorno\s+(\d+)\s*-\s*([a-z]{3})?\s*(\d{1,2})\s*\/\s*(\d{1,2})/i.exec(dayText||'');
  if(!m) return null;
  const d = new Date(CFG.tripYear, Number(m[4])-1, Number(m[3]));
  return {n:Number(m[1]), date:d, dow:GIORNI[d.getDay()], dd:Number(m[3]), mm:Number(m[4])};
}
function fmtDate(d){ return `${GIORNI[d.getDay()]} ${d.getDate()} ${MESI[d.getMonth()]}`; }
/* "~2:30 h" | "~4 h 40" | "~30 min" | "~1-2 h" | "9 min" -> ore (numero) */
function parseHours(s){
  if(!s) return 0;
  s = String(s).toLowerCase().replace(',', '.');
  let m;
  if((m=/(\d+)\s*:\s*(\d+)\s*h/.exec(s))) return +m[1] + (+m[2])/60;
  if((m=/(\d+)\s*h\s*(\d+)\b/.exec(s))) return +m[1] + (+m[2])/60;
  if((m=/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*h/.exec(s))) return (+m[1] + +m[2])/2;
  if((m=/(\d+(?:\.\d+)?)\s*h/.exec(s))) return +m[1];
  if((m=/(\d+)\s*min/.exec(s))) return (+m[1])/60;
  return 0;
}
function fmtHours(h){
  if(!h) return '—';
  const H = Math.floor(h), M = Math.round((h-H)*60);
  return M ? `${H} h ${String(M).padStart(2,'0')}` : `${H} h`;
}
function kmFromChips(chips){
  for(const c of chips||[]){ const m=/(\d+(?:[.,]\d+)?)\s*km/i.exec(c); if(m) return Number(m[1].replace('.','').replace(',','.')); }
  return null;
}

/* ---------- geo lookup ---------- */
const norm = s => String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const GEO_INDEX = Object.entries(HUB_GEO).map(([k,v])=>({k:norm(k), v:(Array.isArray(v)?{ll:v}:v)}));
function geoFor(place){
  const n = norm(place); if(!n) return null;
  let hit = GEO_INDEX.find(g=>g.k===n) || GEO_INDEX.find(g=>n.startsWith(g.k) || g.k.startsWith(n));
  return hit ? hit.v : null;
}

/* ---------- caricamento dati dai due iframe ---------- */
function readTrip(id){
  try{
    const w = document.getElementById(id).contentWindow;
    const t = w.eval('typeof TRIP!=="undefined" ? TRIP : null');
    return Array.isArray(t) ? t : null;
  }catch(e){ return null; }
}
function whenLoaded(cb){
  const ids = ['src-west','src-east']; let left = ids.length;
  ids.forEach(id=>{
    const f = document.getElementById(id);
    const done = ()=>{ if(--left===0) cb(); };
    if(f.contentDocument && f.contentDocument.readyState==='complete' && readTrip(id)) done();
    else f.addEventListener('load', done, {once:true});
  });
  setTimeout(()=>{ if(left>0){ left=0; cb(); } }, 4000);
}

/* ---------- modello unificato ---------- */
function buildModel(){
  const model = {legs:[], days:[], todos:[]};
  let globalIdx = 0;
  CFG.legs.forEach(lg=>{
    const trip = readTrip('src-'+lg.key);
    const leg = Object.assign({}, lg, {days:[], intro:null, ok:!!trip});
    if(!trip){ model.legs.push(leg); return; }
    let n = 0;
    trip.forEach(b=>{
      if(b.intro){ leg.intro = b; return; }
      n++;
      const pd = parseDay(b.day) || {n, date:null};
      const route = b.route || {stops:[]};
      const seq = [];
      if(route.start) seq.push(Object.assign({kind:'start', type:'start'}, route.start));
      (route.stops||[]).forEach(s=>seq.push(Object.assign({kind:'stop'}, s)));
      if(route.end) seq.push(Object.assign({kind:'end', type:'night'}, route.end));
      let driveH = 0, otherH = 0;
      seq.forEach(s=>{
        const seg = s.segmentFromPrevious || {};
        const h = parseHours(seg.duration);
        if(DRIVE_MODES.has(seg.mode)) driveH += h; else otherH += h;
      });
      const km = kmFromChips(b.chips);
      const day = {
        id:b.id, leg:lg.key, n, gi:globalIdx++, day:b.day, title:b.title, chips:b.chips||[],
        date:pd.date, dateLabel: pd.date ? fmtDate(pd.date) : '', dow:pd.dow,
        route, seq, daily:b.daily||{}, driveH, otherH, km,
        night: (b.daily && b.daily.night) || null,
        nightPlace: route.end ? route.end.place : ''
      };
      /* coordinate per ogni punto della sequenza + via */
      day.points = seq.map((s,i)=>{
        const g = geoFor(s.place);
        return {i, s, g, ll: g ? g.ll : null, via: (HUB_VIA[b.id]||{})[i] || []};
      });
      leg.days.push(day); model.days.push(day);
    });
    leg.driveH = leg.days.reduce((a,d)=>a+d.driveH,0);
    leg.nights = leg.days.filter(d=>d.route && d.route.end && !(d.daily && d.daily.night && /volo/i.test((d.daily.night.meta||[]).join(' ')))).length;
    leg.stops = leg.days.reduce((a,d)=>a+(d.route.stops||[]).length,0);
    model.legs.push(leg);
  });
  return model;
}

/* ---------- stato locale (spunte "da fare") ---------- */
const KEY = 'aus_hub_v1';
let state = {checks:{}};
try{ const r = localStorage.getItem(KEY); if(r) state = Object.assign(state, JSON.parse(r)); }catch(e){}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }

/* ---------- HERO ---------- */
function renderHero(model){
  $('#hero-kicker').textContent = CFG.kicker;
  const legsOk = model.legs.filter(l=>l.ok);
  const days = model.days.length;
  const km = CFG.legs.reduce((a,l)=>a+(l.km||0),0);
  const driveH = legsOk.reduce((a,l)=>a+l.driveH,0);
  const stops = legsOk.reduce((a,l)=>a+l.stops,0);
  const dep = new Date(CFG.departure.date+'T00:00:00');
  const diff = Math.round((dep - TODAY)/86400000);
  const first = model.days.find(d=>d.date), last = [...model.days].reverse().find(d=>d.date);
  const calDays = (first&&last) ? Math.round((last.date-first.date)/86400000)+1 : days;
  let hot;
  if(diff>0) hot = `<div class="stat hot"><b>${diff}</b><span>giorni alla partenza</span></div>`;
  else if(first && last && TODAY>=first.date && TODAY<=last.date){
    const cur = model.days.find(d=>d.date && d.date.getTime()===TODAY.getTime());
    hot = `<div class="stat hot"><b>${cur ? 'Giorno '+(Math.round((TODAY-first.date)/86400000)+1) : 'in viaggio'}</b><span>${cur ? esc(cur.title) : 'oggi'}</span></div>`;
  } else if(first && TODAY<first.date) hot = `<div class="stat hot"><b>${Math.round((first.date-TODAY)/86400000)}</b><span>giorni al giorno 1</span></div>`;
  else hot = `<div class="stat hot"><b>fatto</b><span>bentornati</span></div>`;
  $('#hero-stats').innerHTML = `
    ${hot}
    <div class="stat"><b>${calDays}</b><span>giorni in Australia</span></div>
    <div class="stat"><b>~${km.toLocaleString('it-IT')} km</b><span>su strada</span></div>
    <div class="stat"><b>~${Math.round(driveH)} h</b><span>di guida</span></div>
    <div class="stat"><b>${stops}</b><span>tappe</span></div>
    <div class="stat"><b>2</b><span>coste · van + auto</span></div>`;
  $('#hero-actions').innerHTML = CFG.legs.map(l=>`<a class="hero-btn" href="${l.planner}"><span class="dot" style="color:${l.key==='west'?'#ffb597':'#8be3da'}"></span>Planner ${esc(l.name)}</a>`).join('')
    + `<a class="hero-btn" href="../valigia/valigia.html">Valigia</a>`;
  $('#hero-route').innerHTML = model.legs.map(l=>{
    const ns = l.days.map(d=>shortName(d.nightPlace)).filter((v,i,a)=>v && a.indexOf(v)===i);
    return esc(ns.slice(0,6).join(' → ')) + (ns.length>6 ? ' → …' : '');
  }).join('  <span style="opacity:.6">·</span>  ');
}
function shortName(p){
  const g = geoFor(p);
  let s = (g && g.label) ? g.label : String(p||'');
  s = s.replace(/^(RAC|Tasman|Peoples Park|Check-in|Check in)\s*[-:]?\s*/i,'').replace(/\s*[-·]\s*(Holiday Park|Parks Victoria.*|Dolphin Resort|hotel|casa.*)$/i,'');
  s = s.split(/\s*[·:]\s*/)[0];
  const map = {'Malibu Apartments':'Perth','Sunlit Minimal':'Perth','BreakFree Adelaide':'Adelaide','Grampians View Cottages And Units':'Grampians','Grampians View Cottages and Units':'Grampians','Anglesea - casa Lamb':'Anglesea','Peninsula Beach Motel':'Mornington','The Point Villa':'Phillip Island','Causeway 353 hotel':'Melbourne','Melbourne Airport':'volo','Adelaide Airport (ADL)':'Adelaide','Tasman holiday park - Denham':'Denham','Tasman Holiday Park':'Kalbarri','Jurien Bay Tourist Park':'Jurien Bay','RAC Monkey Mia Dolphin Resort':'Monkey Mia','Peoples Park - Coral Bay':'Coral Bay','RAC Cervantes - Holiday Park':'Cervantes','Tidal River - Parks Victoria':'Tidal River'};
  return map[p] || s;
}

/* ============================================================
   POSTER SVG
   ============================================================ */
const P = (lon,lat)=>[(lon-112)*86.6, (-lat-10)*100];
function pathFrom(lls){ return lls.map((ll,i)=>{ const [x,y]=P(ll[1],ll[0]); return (i?'L':'M')+x.toFixed(1)+','+y.toFixed(1); }).join(''); }
/* polilinea di un giorno: punti con coordinate + via, in ordine */
function dayLine(day){
  const out = []; let flySeg = [];
  day.points.forEach(pt=>{
    const seg = pt.s.segmentFromPrevious || {};
    pt.via.forEach(v=>out.push({ll:v, fly:seg.mode==='fly'}));
    if(pt.ll) out.push({ll:pt.ll, fly:seg.mode==='fly', g:pt.g});
  });
  return out;
}
function legLines(leg){
  /* segmenti drive/ferry (linea piena) e fly (tratteggio) */
  const solid=[], fly=[];
  leg.days.forEach(day=>{
    const pts = dayLine(day); let cur=[];
    for(let i=0;i<pts.length;i++){
      const p = pts[i];
      if(p.fly){ if(cur.length>1) solid.push(cur); cur=[]; if(i>0 && !pts[i-1].fly) fly.push([pts[i-1].ll, p.ll]); else if(i>0) fly[fly.length-1].push(p.ll); continue; }
      if(i>0 && pts[i-1].fly){ fly[fly.length-1].push(p.ll); }
      cur.push(p.ll);
    }
    if(cur.length>1) solid.push(cur);
  });
  return {solid, fly};
}
function isFlightNight(d){ const n=d.daily&&d.daily.night; return !!(n && (/(volo|niente hotel)/i.test((n.meta||[]).join(' ')) || /si dorme in volo/i.test(n.title||''))); }
function nightNodes(leg){
  return leg.days.map(d=>{ const e=d.points[d.points.length-1]; return (e && e.ll && d.route.end && !isFlightNight(d)) ? {day:d, ll:e.ll, fly:(e.g&&e.g.fly)} : null; }).filter(Boolean).filter(n=>!n.fly);
}
function renderPoster(model){
  const grid = $('#poster-grid');
  const tip = document.createElement('div'); tip.className='poster-tip';
  /* --- Australia intera --- */
  const S = AUS_SHAPES.states;
  const stNames = {'Western Australia':[-25.5,122.5],'Northern Territory':[-19.5,133.5],'South Australia':[-29.5,135.5],'Queensland':[-23,145],'New South Wales':[-32.2,146.5],'Victoria':[-36.9,144.6],'Tasmania':[-42.1,146.8]};
  let aus = `<svg viewBox="-160 -40 3900 3560" role="img" aria-label="Mappa dell'Australia con le due rotte">`;
  aus += Object.entries(S).map(([n,d])=>d?`<path class="st" d="${d}"><title>${esc(n)}</title></path>`:'').join('');
  aus += Object.entries(stNames).map(([n,ll])=>{ const [x,y]=P(ll[1],ll[0]); return `<text class="stname" x="${x}" y="${y}" style="font-size:60px">${esc(n.replace('Western Australia','WA').replace('Northern Territory','NT').replace('South Australia','SA').replace('Queensland','QLD').replace('New South Wales','NSW').replace('Victoria','VIC').replace('Tasmania','TAS'))}</text>`; }).join('');
  /* bbox degli inset */
  ['west','east'].forEach(k=>{
    const b = AUS_SHAPES[k].bbox; const [x1,y1]=P(b[0],b[3]); const [x2,y2]=P(b[2],b[1]);
    const lg = LEG_BY[k];
    aus += `<rect class="bbox" x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" rx="18" style="stroke:${lg.color};stroke-width:5"/>`;
    aus += `<text class="bboxlbl" x="${k==='west'?x1:x2}" y="${y1-30}" text-anchor="${k==='west'?'start':'end'}" style="font-size:62px;fill:${lg.colorDeep}">${k==='west'?'1 · ':''}${esc(lg.name)}${k==='east'?' · 2':''}</text>`;
  });
  model.legs.forEach(leg=>{
    const {solid, fly} = legLines(leg);
    solid.forEach(l=>{ aus += `<path class="rt halo" d="${pathFrom(l)}" stroke-width="24"/>`; });
    solid.forEach(l=>{ aus += `<path class="rt" d="${pathFrom(l)}" stroke="${leg.color}" stroke-width="14"/>`; });
    fly.forEach(l=>{ aus += `<path class="fly" d="${pathFrom(l)}" stroke-width="9" stroke-dasharray="30 26"/>`; });
  });
  /* aerei internazionali */
  const per=P(115.9669,-31.9403), mel=P(144.8410,-37.6690);
  aus += `<g class="lbl" style="font-size:58px;stroke-width:10px"><text x="${per[0]-60}" y="${per[1]+150}" text-anchor="end">✈ da Amsterdam</text><text x="${mel[0]+70}" y="${mel[1]+170}" text-anchor="start">✈ per Singapore</text></g>`;
  aus += `<g class="lbl" style="font-size:56px;stroke-width:10px"><text x="${per[0]+70}" y="${per[1]-40}">Perth</text><text x="${P(138.6,-34.93)[0]-60}" y="${P(138.6,-34.93)[1]-40}" text-anchor="end">Adelaide</text><text x="${mel[0]+70}" y="${mel[1]-70}">Melbourne</text></g>`;
  aus += `</svg>`;
  /* --- insets --- */
  function inset(k){
    const sh = AUS_SHAPES[k], leg = model.legs.find(l=>l.key===k);
    const b = sh.bbox; const [x1,y1]=P(b[0],b[3]); const [x2,y2]=P(b[2],b[1]);
    const W=x2-x1, H=y2-y1; const pad = 8;
    let s = `<svg viewBox="${(x1-pad).toFixed(0)} ${(y1-pad).toFixed(0)} ${(W+2*pad).toFixed(0)} ${(H+2*pad).toFixed(0)}" role="img" aria-label="Rotta ${esc(leg.name)}">`;
    s += `<path class="coast" d="${sh.path}"/>`;
    const {solid, fly} = legLines(leg);
    const sw = k==='west' ? 7 : 6;
    solid.forEach(l=>{ s += `<path class="rt halo" d="${pathFrom(l)}" stroke-width="${sw+6}"/>`; });
    solid.forEach(l=>{ s += `<path class="rt" d="${pathFrom(l)}" stroke="${leg.color}" stroke-width="${sw}"/>`; });
    fly.forEach(l=>{ s += `<path class="fly" d="${pathFrom(l)}" stroke-width="4"/>`; });
    (HUB_POSTER_LABELS[k]||[]).forEach(L=>{ const [x,y]=P(L.ll[1],L.ll[0]); s += `<text class="lbl${/Perth|Adelaide|Melbourne/.test(L.text)?' city':''}" x="${x+(L.dx||0)}" y="${y+(L.dy||0)}" text-anchor="${L.anchor||'start'}">${esc(L.text)}</text>`; });
    /* notti: nodi vicini (stessa citta') si fondono in un nodo solo */
    const nodes = [];
    nightNodes(leg).forEach(nn=>{
      const [x,y]=P(nn.ll[1],nn.ll[0]);
      const near = nodes.find(o=>Math.hypot(o.x-x,o.y-y) < 16);
      if(near){ near.days.push(nn.day); return; }
      nodes.push({x,y,days:[nn.day]});
    });
    /* nodi vicini ma distinti: allontanali quel tanto che basta per non sovrapporsi */
    for(let pass=0;pass<4;pass++) nodes.forEach(a=>nodes.forEach(b=>{
      if(a===b) return; const dx=b.x-a.x, dy=b.y-a.y, d=Math.hypot(dx,dy)||1, min=30;
      if(d<min){ const k=(min-d)/2/d; a.x-=dx*k; a.y-=dy*k; b.x+=dx*k; b.y+=dy*k; }
    }));
    const runs = nums => { const r=[]; nums.forEach(n=>{ const last=r[r.length-1]; if(last && last[1]===n-1) last[1]=n; else r.push([n,n]); }); return r.map(([a,b])=>a===b?String(a):`${a}–${b}`).join('·'); };
    nodes.forEach(o=>{
      const nums = o.days.map(d=>d.n).sort((a,b)=>a-b); const label = runs(nums);
      const r = label.length>3 ? 19 : (label.length>1 ? 16 : 13);
      const first = o.days[0], lastD = o.days[o.days.length-1];
      const tipDate = first.dateLabel + (o.days.length>1 ? ' → ' + lastD.dateLabel : '');
      s += `<g class="night" data-day="${esc(first.id)}" data-tip="${esc(tipDate)}" data-tipb="${esc(shortName(first.nightPlace))}"><circle cx="${o.x}" cy="${o.y}" r="${r}" fill="${leg.colorDeep}"/><text x="${o.x}" y="${o.y+0.5}" style="font-size:${label.length>3?9.5:(label.length>1?11:12)}px">${label}</text></g>`;
    });
    s += `</svg>`;
    return s;
  }
  grid.innerHTML = `
    <div class="card ocean west" id="inset-west"><div class="cap"><b style="color:${LEG_BY.west.colorDeep}">1 · Coral Coast</b><span>Western Australia · van</span></div>${inset('west')}</div>
    <div class="card ocean aus"><div class="cap"><b>Australia</b><span>due leg · un volo in mezzo</span></div>${aus}</div>
    <div class="card ocean east" id="inset-east"><div class="cap r"><b style="color:${LEG_BY.east.colorDeep}">2 · Great Ocean Road</b><span>SA → Victoria · auto</span></div>${inset('east')}</div>
    <div class="legend" style="grid-column:1 / -1"><span><i class="w"></i>Coral Coast · van</span><span><i class="e"></i>Great Ocean Road · auto</span><span><i class="f"></i>volo interno</span><span><em>3</em>notte del giorno 3</span></div>`;
  grid.style.position='relative'; grid.appendChild(tip);
  grid.querySelectorAll('.night').forEach(g=>{
    g.addEventListener('mousemove', e=>{ const r=grid.getBoundingClientRect(); tip.style.left=(e.clientX-r.left)+'px'; tip.style.top=(e.clientY-r.top)+'px'; tip.innerHTML=`<b>${g.dataset.tipb}</b>${g.dataset.tip}`; tip.classList.add('show'); });
    g.addEventListener('mouseleave', ()=>tip.classList.remove('show'));
    g.addEventListener('click', ()=>jumpToDay(g.dataset.day));
  });
}

/* ============================================================
   MAPPA LEAFLET
   ============================================================ */
let map, dayLayers = {}, allBounds, activeDay = null, activeLeg = null;
function renderMap(model){
  map = L.map('leafmap', {zoomControl:true, scrollWheelZoom:true, worldCopyJump:true, attributionControl:true});
  /* Provider senza chiave: OpenStreetMap e Carto rifiutano le pagine aperte da
     file locale ("Access blocked" / "API key required"), Esri no. */
  const ESRI = n => `https://server.arcgisonline.com/ArcGIS/rest/services/${n}/MapServer/tile/{z}/{y}/{x}`;
  const bases = {
    strade: L.tileLayer(ESRI('World_Street_Map'), {maxZoom:19, attribution:'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors'}),
    chiaro: L.tileLayer(ESRI('Canvas/World_Light_Gray_Base'), {maxZoom:16, attribution:'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors'}),
    terreno: L.tileLayer(ESRI('World_Topo_Map'), {maxZoom:19, attribution:'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS'}),
    satellite: L.tileLayer(ESRI('World_Imagery'), {maxZoom:18, attribution:'Esri, Maxar, Earthstar Geographics'})
  };
  let base = bases.strade.addTo(map);
  let baseKey = 'strade';
  const errCount = {};
  const setBase = key => { if(map.hasLayer(base)) map.removeLayer(base); baseKey = key; base = bases[key].addTo(map); base.bringToBack(); $('#tilewarn').classList.remove('show'); };
  Object.entries(bases).forEach(([key,b])=>{
    b.on('tileerror', ()=>{ errCount[key] = (errCount[key]||0)+1; if(key===baseKey && errCount[key]>=6) $('#tilewarn').classList.add('show'); });
    b.on('load', ()=>{ if(key===baseKey) $('#tilewarn').classList.remove('show'); });
  });
  const nightsLayer = L.layerGroup().addTo(map);
  allBounds = L.latLngBounds([]);
  model.legs.forEach(leg=>{
    leg.days.forEach(day=>{
      const grp = L.featureGroup();
      const pts = dayLine(day);
      /* linee */
      let cur=[];
      const flush = ()=>{ if(cur.length>1){ L.polyline(cur,{color:'#fdf8f0',weight:7,opacity:.85}).addTo(grp); L.polyline(cur,{color:leg.color,weight:3.5,opacity:.95}).addTo(grp);} cur=[]; };
      for(let i=0;i<pts.length;i++){
        const p=pts[i];
        if(p.fly){ flush(); if(i>0) L.polyline([pts[i-1].ll,p.ll],{color:'#5e5147',weight:2,dashArray:'6 8'}).addTo(grp); if(i<pts.length-1 && !pts[i+1].fly) L.polyline([p.ll,pts[i+1].ll],{color:'#5e5147',weight:2,dashArray:'6 8'}).addTo(grp); continue; }
        if(i>0 && pts[i-1].fly){ cur=[p.ll]; continue; }
        cur.push(p.ll);
      }
      flush();
      /* marker */
      day.points.forEach(pt=>{
        if(!pt.ll || (pt.g && pt.g.fly)) return;
        const s = pt.s; const isEnd = pt.s.kind==='end'; const isStart = pt.s.kind==='start';
        const type = isEnd ? 'night' : (isStart ? 'start' : (s.type||'planned'));
        const tm = TYPE_META[type] || TYPE_META.planned;
        let html, size;
        if(isEnd){ html = `<div class="mk night ${leg.key==='west'?'w':'e'}" title="${esc(s.place)}">${day.n}</div>`; size=30; }
        else if(isStart){ return; /* la partenza coincide quasi sempre con la notte precedente */ }
        else { const small = ['quick','fuel','optional'].includes(type); html = `<div class="mk${small?' sm':''}" style="background:${tm.color}">${ico(s.icon||tm.icon, small?10:14)}</div>`; size = small?18:26; }
        const m = L.marker(pt.ll, {icon:L.divIcon({html, className:'', iconSize:[size,size], iconAnchor:[size/2,size/2], popupAnchor:[0,-size/2]}), zIndexOffset: isEnd?500:0, riseOnHover:true});
        m.bindPopup(popupHtml(day, leg, pt, type), {maxWidth:300});
        m._minZoom = isEnd ? 0 : (size<=18 ? 9 : 7);
        m.addTo(grp);
        allBounds.extend(pt.ll);
      });
      dayLayers[day.id] = {grp, leg:leg.key, day};
      grp.addTo(map);
    });
  });
  if(allBounds.isValid()) map.fitBounds(allBounds, {padding:[30,30]});
  /* a zoom basso restano solo notti e tappe principali */
  const applyZoom = ()=>{ const z=map.getZoom(); Object.values(dayLayers).forEach(o=>o.grp.eachLayer(l=>{ if(l._minZoom===undefined) return; const el=l.getElement(); if(el) el.style.display = (z>=l._minZoom || activeDay===o.day.id) ? '' : 'none'; })); };
  map.on('zoomend', applyZoom); map.whenReady(()=>setTimeout(applyZoom,0));
  map.on('layeradd', ()=>setTimeout(applyZoom,0));

  /* toolbar */
  const tools = $('#maptools');
  tools.innerHTML = `
    <button class="chip on" data-leg="all"><span class="sw" style="background:linear-gradient(90deg,var(--west),var(--east))"></span>Tutto il viaggio</button>
    ${CFG.legs.map(l=>`<button class="chip leg-${l.key}" data-leg="${l.key}"><span class="sw"></span>${esc(l.name)}</button>`).join('')}
    <span class="sep"></span>
    <button class="chip on" data-base="strade">Strade</button><button class="chip" data-base="chiaro">Chiaro</button><button class="chip" data-base="terreno">Terreno</button><button class="chip" data-base="satellite">Satellite</button>
    <span class="grow"></span>
    <button class="chip" id="map-fit">${ico('map',12)} Adatta</button>`;
  tools.querySelectorAll('[data-base]').forEach(b=>b.addEventListener('click', ()=>{
    tools.querySelectorAll('[data-base]').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    setBase(b.dataset.base);
  }));
  tools.querySelectorAll('[data-leg]').forEach(b=>b.addEventListener('click', ()=>selectLeg(b.dataset.leg)));
  $('#map-fit').addEventListener('click', ()=>{ activeDay=null; selectLeg(activeLeg||'all'); });
  /* chips giorni */
  const dc = $('#daychips');
  dc.innerHTML = model.days.map(d=>`<button class="chip" data-day="${esc(d.id)}" title="${esc(d.title)}"><span class="sw" style="background:${LEG_BY[d.leg].color}"></span>${d.leg==='west'?'W':'E'}${d.n} <span class="n">${esc(d.dateLabel.replace(/^\w+\s/,''))}</span></button>`).join('');
  dc.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click', ()=>selectDay(b.dataset.day)));
  /* legenda */
  $('#maplegend').innerHTML = `<span><i style="background:#2c2420"></i>notte (numero = giorno)</span>` + ['planned','optional','viewpoint','quick','fuel','lunch'].map(t=>`<span><i style="background:${TYPE_META[t].color}"></i>${TYPE_META[t].label}</span>`).join('') + `<span style="margin-left:auto">Le tappe segnate «~» hanno una posizione stimata.</span>`;
}
function popupHtml(day, leg, pt, type){
  const s = pt.s, g = pt.g||{}; const tm = TYPE_META[type]||TYPE_META.planned;
  const seg = s.segmentFromPrevious||{}; const mm = MODE_META[seg.mode||'drive']||MODE_META.drive;
  const segTxt = [mm.label, seg.duration, seg.distance].filter(Boolean).join(' · ');
  const q = (g.approx||g.label) ? `${pt.ll[0]},${pt.ll[1]}` : `${s.place}, Australia`;
  const gm = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${pt.ll[0]},${pt.ll[1]}`;
  return `<div class="pp">
    <div class="k"><i style="background:${leg.color}"></i>${esc(leg.short)} · giorno ${day.n} · ${esc(day.dateLabel)}</div>
    <h4>${esc(g.label||s.place)}${g.approx?' <span title="posizione stimata">~</span>':''}</h4>
    <div class="type"><b style="color:${tm.color}">${esc(tm.label)}</b>${s.time?` · ${esc(s.time)}`:''}${s.label?` · ${esc(s.label)}`:''}</div>
    ${s.note?`<p>${esc(s.note)}</p>`:''}
    ${segTxt?`<div class="seg">${ico(mm.icon,11)} ${esc(segTxt)}${(seg.notes||[]).length?` · ${esc(seg.notes.join(' · '))}`:''}</div>`:''}
    <div class="links"><a href="${gm}" target="_blank" rel="noopener">${ico('ext',11)} Google Maps</a><a href="${dir}" target="_blank" rel="noopener">${ico('car',11)} Indicazioni</a><a href="#day-${esc(day.id)}" data-jump="${esc(day.id)}">${ico('doc',11)} Giorno ${day.n}</a></div>
  </div>`;
}
function selectLeg(k){
  activeLeg = k==='all' ? null : k; activeDay = null;
  document.querySelectorAll('#maptools [data-leg]').forEach(b=>b.classList.toggle('on', b.dataset.leg===k));
  document.querySelectorAll('#daychips [data-day]').forEach(b=>b.classList.remove('on'));
  const bounds = L.latLngBounds([]);
  Object.values(dayLayers).forEach(o=>{
    const on = !activeLeg || o.leg===activeLeg;
    if(on){ if(!map.hasLayer(o.grp)) o.grp.addTo(map); const b=o.grp.getBounds(); if(b.isValid()) bounds.extend(b); o.grp.eachLayer(l=>l.setStyle && l.setStyle({opacity: l.options.color==='#fdf8f0'?.85:.95})); }
    else map.removeLayer(o.grp);
  });
  if(bounds.isValid()) map.fitBounds(bounds, {padding:[30,30]});
}
function selectDay(id){
  if(activeDay===id){ selectLeg(activeLeg||'all'); return; }
  activeDay = id;
  document.querySelectorAll('#daychips [data-day]').forEach(b=>b.classList.toggle('on', b.dataset.day===id));
  Object.values(dayLayers).forEach(o=>{
    const on = o.day.id===id;
    if(!map.hasLayer(o.grp)) o.grp.addTo(map);
    o.grp.eachLayer(l=>{
      if(l.setStyle) l.setStyle({opacity: on ? (l.options.color==='#fdf8f0'?.85:.95) : .12});
      else if(l.getElement){ const el=l.getElement(); if(el) el.style.opacity = on ? 1 : .22; }
    });
    if(on){ const b=o.grp.getBounds(); if(b.isValid()) map.fitBounds(b, {padding:[40,40], maxZoom:13}); }
  });
}
function jumpToDay(id){
  const el = document.getElementById('day-'+id); if(!el) return;
  el.open = true; el.scrollIntoView({behavior:'smooth', block:'start'});
  el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'), 1200);
}
document.addEventListener('click', e=>{
  const a = e.target.closest('[data-jump]'); if(!a) return; e.preventDefault(); jumpToDay(a.dataset.jump);
  const m = e.target.closest('[data-mapday]'); if(m){ e.preventDefault(); }
});
document.addEventListener('click', e=>{
  const m = e.target.closest('[data-mapday]'); if(!m) return; e.preventDefault();
  selectDay(m.dataset.mapday); document.getElementById('mappa').scrollIntoView({behavior:'smooth', block:'start'});
});

/* ============================================================
   TIMELINE
   ============================================================ */
function renderTimeline(model){
  const wrap = $('#legs');
  wrap.innerHTML = model.legs.map(leg=>{
    if(!leg.ok) return `<div class="card pad err">Non riesco a leggere <span class="mono">${esc(leg.dir)}/trip-data.js</span>.</div>`;
    const days = leg.days.map(d=>{
      const isToday = d.date && d.date.getTime()===TODAY.getTime();
      const past = d.date && d.date < TODAY;
      const docs = HUB_DOCS.filter(x=>x.day===d.id);
      const stops = d.seq.map(s=>{
        const isEnd=s.kind==='end', isStart=s.kind==='start';
        const type = isEnd?'night':(isStart?'start':(s.type||'planned')); const tm=TYPE_META[type];
        const seg=s.segmentFromPrevious||{}; const mm=MODE_META[seg.mode||'drive']||MODE_META.drive;
        const segTxt=[seg.duration, seg.mode&&seg.mode!=='drive'&&seg.mode!=='auto'?mm.label:null].filter(Boolean).join(' · ');
        const g = geoFor(s.place);
        const name = s.map===false || !g ? esc(s.place) : `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((g.approx||g.label)?g.ll.join(','):s.place+', Australia')}" target="_blank" rel="noopener">${esc(s.place)}</a>`;
        return `<li><span class="ic" style="background:${tm.color}">${ico(s.icon||tm.icon,10)}</span><div><span class="t">${name}</span>${s.time?` <span class="s">· ${esc(s.time)}</span>`:''}${s.note?`<div class="s">${esc(s.note)}</div>`:''}</div>${segTxt?`<span class="seg">${ico(mm.icon,10)} ${esc(segTxt)}</span>`:''}</li>`;
      }).join('');
      const exc = (d.daily.excursions||[]).filter(x=>x&&x.t).map(x=>`<li><b>${esc(x.t)}</b>${x.s?` — ${esc(x.s)}`:''}</li>`).join('');
      const notes = (d.daily.notes||[]).filter(x=>x&&x.t).map(x=>`<li><b>${esc(x.t)}</b>${x.s?` — ${esc(x.s)}`:''}</li>`).join('');
      const night = d.night ? (d.night.title||'') : d.nightPlace;
      return `<details class="dayc${isToday?' today':''}${past?' past':''}" id="day-${esc(d.id)}"${isToday?' open':''}>
        <summary>
          <div class="dnum" style="background:${leg.color}">${d.n}</div>
          <div class="dtitle">
            <div class="date">${esc(d.dateLabel)}</div>
            <h4>${esc(d.title)}</h4>
            <div class="chips">${d.chips.map(c=>`<span>${esc(c)}</span>`).join('')}</div>
            ${night?`<div class="night">${ico('bed',13)}<span>${esc(night)}</span></div>`:''}
          </div>
          <div class="dmeta">${d.driveH?`<b>${fmtHours(d.driveH)}</b> guida<br>`:''}${d.km?`<b>~${d.km} km</b><br>`:''}${(d.route.stops||[]).length} tappe</div>
        </summary>
        <div class="dbody">
          <h5>Percorso</h5><ul class="stops">${stops}</ul>
          ${exc?`<h5>${esc((d.daily.titles&&d.daily.titles.excursions)||'Escursioni previste')}</h5><ul class="exc">${exc}</ul>`:''}
          ${notes?`<h5>Note</h5><ul class="exc">${notes}</ul>`:''}
          ${docs.length?`<h5>Documenti</h5><div class="docsline">${docs.map(x=>`<a href="../Documenti/${encodeURIComponent(x.file)}" target="_blank" rel="noopener">${ico('doc',11)}${esc(x.label)}</a>`).join('')}</div>`:''}
          <div class="dactions"><button data-mapday="${esc(d.id)}">${ico('map',11)} Vedi sulla mappa</button><a href="${leg.planner}" target="_blank" rel="noopener">${ico('ext',11)} Apri nel planner</a></div>
        </div>
      </details>`;
    }).join('');
    const first = leg.days[0], last = leg.days[leg.days.length-1];
    return `<div class="card leg">
      <div class="leg-head">
        <span class="swatch" style="background:${leg.color}"></span>
        <div><h3>${esc(leg.name)}</h3><p>${esc(leg.region)} · ${esc(leg.vehicle)} · ${first?esc(first.dateLabel):''} → ${last?esc(last.dateLabel):''}</p></div>
        <div class="meta"><b>${leg.days.length} giorni</b>~${leg.km.toLocaleString('it-IT')} km · ${fmtHours(leg.driveH)}</div>
        <a class="plan" href="${leg.planner}">planner ↗</a>
      </div>
      <div class="days">${days}</div>
      <div class="leg-days-sum"><span><b>${leg.stops}</b> tappe</span><span><b>${leg.days.filter(d=>d.driveH>=4).length}</b> giorni con 4h+ di guida</span><span>giorno più lungo: <b>${(()=>{const m=leg.days.reduce((a,b)=>b.driveH>a.driveH?b:a,leg.days[0]); return m?fmtHours(m.driveH)+' · '+m.dateLabel:'—';})()}</b></span></div>
    </div>`;
  }).join('');
}

/* ============================================================
   DA FARE
   ============================================================ */
function collectTodos(model){
  const out = [];
  model.legs.forEach(leg=>{
    const intro = leg.intro; if(!intro) return;
    (intro.boxes||[]).forEach((box,bi)=>{
      const isMust = /da fare|da prenotare|leggi prima/i.test(box.h||'');
      (box.items||[]).forEach((it,ii)=>{
        const t = it.t||''; const urgent = /^\s*(DA (PRENOTARE|SCEGLIERE|VERIFICARE|COMPRARE)|ANCORA DA)/i.test(t);
        if(isMust || urgent) out.push({leg:leg.key, id:`${leg.key}:${bi}:${ii}:${norm(t).slice(0,40)}`, t, s:it.s||'', src:box.h||'', urgent, done:/:\s*FATT[AO]\b/i.test(t)});
      });
    });
    /* note dei giorni con "prenotare!" */
    leg.days.forEach(d=>{
      (d.daily.notes||[]).forEach((n,ni)=>{
        const t=n&&n.t||''; const meta=(n&&n.meta||[]).join(' ');
        if(/prenotare!/i.test(meta) || /ANCORA DA PRENOTARE|DA PRENOTARE|PROBLEMA:/i.test(t)) out.push({leg:leg.key, id:`${leg.key}:${d.id}:${ni}:${norm(t).slice(0,40)}`, t, s:n.s||'', src:`giorno ${d.n} · ${d.dateLabel}`, urgent:true, done:false, day:d.id});
      });
    });
  });
  /* dedup: stesso argomento scritto in due modi (checklist + nota del giorno) */
  const STOP = new Set(['prenotare','ancora','problema','verificare','scegliere','slot','della','delle','nella','sono','come','anche','prima']);
  const words = t => new Set(norm(t).split(' ').filter(w=>w.length>3 && !STOP.has(w)));
  const kept = [];
  out.forEach(x=>{
    const w = words(x.t);
    const dup = kept.find(k=>{ const kw=words(k.t); let inter=0; w.forEach(v=>{ if(kw.has(v)) inter++; }); return inter>0 && inter/Math.min(w.size,kw.size) >= 0.5; });
    if(dup){ if(x.day && !dup.day) dup.day = x.day; return; }
    kept.push(x);
  });
  return kept;
}
function renderTodos(model){
  const todos = collectTodos(model);
  const grid = $('#todo-grid');
  grid.innerHTML = CFG.legs.map(leg=>{
    const items = todos.filter(t=>t.leg===leg.key).sort((a,b)=>(b.urgent-a.urgent));
    const li = items.map(t=>{
      const checked = state.checks[t.id] !== undefined ? state.checks[t.id] : t.done;
      return `<li class="${checked?'done':''}${t.urgent?' urgent':''}"><input type="checkbox" id="c-${esc(t.id)}" data-id="${esc(t.id)}"${checked?' checked':''}><label for="c-${esc(t.id)}"><span class="t">${esc(t.t)}</span>${t.s?`<span class="s">${esc(t.s)}</span>`:''}<span class="src">${esc(t.src)}${t.day?` · <a href="#day-${esc(t.day)}" data-jump="${esc(t.day)}">vai al giorno</a>`:''}</span></label></li>`;
    }).join('');
    const open = items.filter(t=>!(state.checks[t.id]!==undefined?state.checks[t.id]:t.done)).length;
    return `<div class="card"><div class="pad todo" data-leg="${leg.key}"><h3><span class="swatch" style="background:${leg.color}"></span>${esc(leg.name)}<span class="cnt">${open} aperti / ${items.length}</span></h3><ul>${li||'<li class="muted">Niente da segnalare.</li>'}</ul></div></div>`;
  }).join('');
  grid.querySelectorAll('input[type=checkbox]').forEach(c=>c.addEventListener('change', ()=>{
    state.checks[c.dataset.id]=c.checked; save(); c.closest('li').classList.toggle('done', c.checked);
    const box=c.closest('.todo'); const all=box.querySelectorAll('input'); const open=[...all].filter(x=>!x.checked).length; box.querySelector('.cnt').textContent=`${open} aperti / ${all.length}`;
  }));
}

/* ============================================================
   VOLI · DOCUMENTI · SPESE
   ============================================================ */
function renderFlights(){
  $('#flights').innerHTML = HUB_FLIGHTS.map(f=>`<li><div class="when">${esc(f.when)}</div><div><div class="leg">${esc(f.from)} ${ico('plane',14)} ${esc(f.to)} <span class="note">${esc(f.code)}</span></div><div class="note">${esc(f.note)}</div></div><div class="times">parte <b>${esc(f.dep)}</b><br>arriva <b>${esc(f.arr)}</b></div></li>`).join('');
}
function renderDocs(model){
  const kinds = {volo:'#155f5a', noleggio:'#a23f22', tour:'#d76b94', alloggio:'#9a7836'};
  const dayOf = id => model.days.find(d=>d.id===id);
  $('#docs').innerHTML = HUB_DOCS.map(x=>{ const d = x.day?dayOf(x.day):null; return `<li><a href="../Documenti/${encodeURIComponent(x.file)}" target="_blank" rel="noopener"><span class="ki" style="background:${kinds[x.kind]||'#5e5147'}">${esc(x.kind.slice(0,3))}</span><span><span class="lb">${esc(x.label)}</span><span class="fn">${esc(x.file)}</span></span><span class="dy">${d?esc(d.dateLabel):(x.kind==='volo'?'22 ott':'')}</span></a></li>`; }).join('')
    + (location.protocol.startsWith('http') ? '' : `<li><a href="../payments_check.xlsx"><span class="ki" style="background:#5e5147">xls</span><span><span class="lb">Controllo pagamenti</span><span class="fn">payments_check.xlsx</span></span></a></li>`);
}
function renderSpese(){
  const card = $('#spese-card'); const rows = [];
  let total = 0, found = false;
  CFG.legs.forEach(leg=>{
    let st=null; try{ const r=localStorage.getItem(CFG.plannerStorage[leg.key]); if(r) st=JSON.parse(r); }catch(e){}
    const ex = st && Array.isArray(st.expenses) ? st.expenses : [];
    const sum = ex.reduce((a,e)=>a+(Number(e.amount)||0),0);
    const by = {fuel:0,food:0,other:0}; ex.forEach(e=>{ by[e.type in by?e.type:'other'] += Number(e.amount)||0; });
    if(st) found = true; total += sum;
    rows.push(`<div class="tile"><span>${esc(leg.name)}</span><b>$${sum.toLocaleString('it-IT',{maximumFractionDigits:0})}</b><small>benzina $${by.fuel.toFixed(0)} · cibo $${by.food.toFixed(0)} · altro $${by.other.toFixed(0)} · ${ex.length} voci</small></div>`);
  });
  if(!found){ card.innerHTML = `<p class="muted" style="margin:0">Nessun registro trovato in questo browser. Le spese si inseriscono nei due planner («Registro spese»): quando li apri da qui, dallo stesso PC, i totali compaiono anche in questa pagina.</p>`; return; }
  card.innerHTML = `<div class="spese">${rows.join('')}<div class="tile" style="background:var(--paper)"><span>Totale</span><b style="color:var(--terra-deep)">$${total.toLocaleString('it-IT',{maximumFractionDigits:0})}</b><small>AUD · entrambe le leg</small></div></div>`;
}

/* ---------- nav attiva ---------- */
function navSpy(){
  const links=[...document.querySelectorAll('nav.jump a')]; const secs=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(e.isIntersecting){ links.forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id)); } }); },{rootMargin:'-40% 0px -55% 0px'});
  secs.forEach(s=>io.observe(s));
}

/* ---------- avvio ---------- */
whenLoaded(()=>{
  const model = buildModel();
  const missing = model.legs.filter(l=>!l.ok);
  if(missing.length){
    $('#loaderr').innerHTML = `<div class="err"><b>Non riesco a leggere ${missing.map(l=>`<span class="mono">${esc(l.dir)}/trip-data.js</span>`).join(' e ')}.</b> Questa pagina va aperta dalla cartella <span class="mono">hub/</span> dentro la cartella Australia, accanto a <span class="mono">Perth_coast/</span> e <span class="mono">Adelaide_Melbourne/</span>. Se il browser blocca gli iframe locali, prova con Chrome/Edge.</div>`;
  }
  renderHero(model);
  try{ renderPoster(model); }catch(e){ console.error('poster', e); }
  try{ renderMap(model); }catch(e){ console.error('map', e); }
  renderTimeline(model);
  renderTodos(model);
  renderFlights();
  renderDocs(model);
  renderSpese();
  navSpy();
  /* tappe senza coordinate: utile per aggiornare hub-geo.js */
  const missingGeo = model.days.flatMap(d=>d.points.filter(p=>!p.ll && p.s.map!==false).map(p=>`${d.leg}/${d.id}: ${p.s.place}`));
  if(missingGeo.length) console.info('Tappe senza coordinate in hub-geo.js:\n'+missingGeo.join('\n'));
});
})();
