/* ============================================================
   pwa.js - incluso in tutte le pagine.
   Sul sito (https): registra il service worker (offline),
   apre i PDF nel lettore interno, tiene i link dentro l'app
   e mostra il pulsante "Home" (nell'app installata su iPhone
   non c'e' il tasto indietro del browser).
   Aprendo i file dalla cartella (file://) non fa quasi nulla.
   ============================================================ */
(function(){
  var me = document.currentScript && document.currentScript.src;
  var ROOT = me ? me.replace(/pwa\.js(\?.*)?$/, '') : new URL('./', location.href).href;
  var ONLINE_SITE = /^https?:$/.test(location.protocol);
  var STANDALONE = (window.navigator.standalone === true) ||
    (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
  var REL = location.href.indexOf(ROOT) === 0 ? location.href.slice(ROOT.length).replace(/[?#].*$/, '') : null;
  var IS_HOME = REL === '' || REL === 'index.html';
  var IS_VIEWER = REL === 'documento.html';

  /* ---------- stile condiviso ---------- */
  var css = document.createElement('style');
  css.textContent =
    '.pwa-home{position:fixed;z-index:9000;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));' +
    'width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
    'background:#155f5a;color:#fdf8f0;box-shadow:0 6px 18px -6px rgba(44,36,32,.55);text-decoration:none;' +
    '-webkit-tap-highlight-color:transparent}' +
    '.pwa-home:active{transform:scale(.94)}' +
    '.pwa-toast{position:fixed;z-index:9001;left:50%;transform:translateX(-50%);' +
    'bottom:calc(72px + env(safe-area-inset-bottom));max-width:calc(100% - 32px);' +
    'background:#2c2420;color:#fdf8f0;border-radius:14px;padding:10px 14px;font:500 14px/1.35 "Hanken Grotesk",system-ui,sans-serif;' +
    'box-shadow:0 10px 30px -10px rgba(0,0,0,.5);display:flex;gap:10px;align-items:center}' +
    '.pwa-toast button{font:inherit;font-weight:700;background:#fdf8f0;color:#2c2420;border:0;border-radius:9px;padding:6px 10px}' +
    '@media print{.pwa-home,.pwa-toast{display:none}}';
  document.head.appendChild(css);

  function toast(msg, btnLabel, onBtn, ms){
    var old = document.querySelector('.pwa-toast'); if(old) old.remove();
    var t = document.createElement('div'); t.className = 'pwa-toast';
    var s = document.createElement('span'); s.textContent = msg; t.appendChild(s);
    if(btnLabel){ var b = document.createElement('button'); b.textContent = btnLabel; b.onclick = onBtn; t.appendChild(b); }
    document.body.appendChild(t);
    if(ms) setTimeout(function(){ t.remove(); }, ms);
  }
  window.pwaToast = toast;

  /* ---------- pulsante Home ---------- */
  if(!IS_HOME && !IS_VIEWER){
    var a = document.createElement('a');
    a.className = 'pwa-home'; a.href = ROOT + 'index.html'; a.setAttribute('aria-label', 'Home del viaggio'); a.title = 'Home del viaggio';
    a.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg>';
    document.body.appendChild(a);
  }

  if(!ONLINE_SITE) return;   /* dalla cartella del PC: niente service worker, PDF originali in Documenti/ */

  /* ---------- PDF nel lettore interno, link interni nella stessa finestra ---------- */
  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('a[href]') : null;
    if(!el || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    var href = el.href;
    if(href.indexOf(ROOT) !== 0) return;                /* link esterni (Google Maps...) restano come sono */
    var path = href.slice(ROOT.length).replace(/[?#].*$/, '');
    if(/\.pdf$/i.test(path)){
      e.preventDefault();
      location.href = ROOT + 'documento.html?f=' + encodeURIComponent(path);
      return;
    }
    if(STANDALONE && el.target === '_blank'){ el.removeAttribute('target'); }
  }, true);

  /* ---------- service worker ---------- */
  if('serviceWorker' in navigator){
    var hadController = !!navigator.serviceWorker.controller;
    window.pwaSW = navigator.serviceWorker.register(ROOT + 'sw.js', {scope: ROOT}).then(function(reg){
      /* con internet: completa eventuali file che non erano arrivati */
      if(navigator.onLine) navigator.serviceWorker.ready.then(function(r){ if(r.active) r.active.postMessage('topup'); });
      return reg;
    }).catch(function(err){
      console.warn('SW non registrato', err);
      window.pwaError = (err && (err.name + ': ' + err.message)) || String(err);
      throw err;
    });
    window.pwaSW.catch(function(){});
    navigator.serviceWorker.addEventListener('controllerchange', function(){
      if(!hadController){ hadController = true; return; }  /* prima installazione: niente avviso */
      toast('Nuova versione del viaggio scaricata.', 'Aggiorna', function(){ location.reload(); });
    });
  }

  /* ---------- avviso offline ---------- */
  window.addEventListener('offline', function(){ toast('Sei offline: uso i dati salvati sul telefono.', null, null, 3500); });
})();
