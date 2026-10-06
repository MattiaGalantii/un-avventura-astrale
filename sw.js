/* ============================================================
   Service worker: rende il sito utilizzabile offline.
   - All'installazione scarica i file elencati in precache.json
     (pagine, dati, font, documenti cifrati). Se qualche file non
     arriva (rete del telefono instabile) NON butta via tutto:
     lo riprova dopo ("topup") alla prossima apertura con internet.
   - Le tessere della mappa (Esri) vengono salvate mentre le
     guardi, oppure in blocco col tasto "Mappe offline" in home.
   VERSION viene sostituita automaticamente a ogni pubblicazione
   (GitHub Action): cosi' il telefono scarica la versione nuova.
   ============================================================ */
const VERSION = '__VERSION__';
const PRE = 'aus-pre-' + VERSION;
const TILES = 'aus-tiles-v1';
const TILE_HOST = 'server.arcgisonline.com';
const CORE = ['index.html', 'pwa.js', 'documento.html'];   /* senza questi non si installa */

const sleep = ms => new Promise(r => setTimeout(r, ms));
const scopeUrl = () => self.registration.scope;            /* .../un-avventura-astrale/ */

async function manifestFromCache(cache){
  const r = await cache.match('precache.json');
  return r ? r.json() : null;
}

/* scarica un file (3 tentativi) e lo mette in cache */
async function fetchInto(cache, u){
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(new Request(u, {cache: 'reload'}));
      if (r.ok) {
        await cache.put(u, r.clone());
        if (u === 'index.html') await cache.put(scopeUrl(), r);   /* l'icona puo' aprire ".../" */
        return true;
      }
    } catch (e) {}
    await sleep(600 * (i + 1));
  }
  return false;
}

/* scarica tutti i file che mancano, 4 alla volta */
async function fillMissing(cache, manifest){
  const have = new Set((await cache.keys()).map(r => r.url));
  const todo = manifest.files.map(f => f.url).filter(u => !have.has(new URL(u, scopeUrl()).href));
  const failed = [];
  let i = 0;
  const worker = async () => { while (i < todo.length) { const u = todo[i++]; if (!(await fetchInto(cache, u))) failed.push(u); } };
  await Promise.all([worker(), worker(), worker(), worker()]);
  return failed;
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const res = await fetch('precache.json', {cache: 'no-store'});
    const manifest = await res.json();
    const cache = await caches.open(PRE);
    await cache.put('precache.json', new Response(JSON.stringify(manifest), {headers: {'Content-Type': 'application/json'}}));
    /* recupera dalle versioni precedenti i file identici gia' scaricati? no: i file
       possono essere cambiati. Li riscarichiamo, ma un errore non blocca tutto. */
    const failed = await fillMissing(cache, manifest);
    if (CORE.some(u => failed.includes(u))) throw new Error('file essenziali non scaricati: riprovo alla prossima apertura');
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRE);
    const manifest = await manifestFromCache(cache);
    const keys = (await caches.keys()).filter(k => k.startsWith('aus-pre-') && k !== PRE);
    /* se nella versione nuova manca qualche file, intanto tengo quello della versione vecchia */
    if (manifest) {
      const have = new Set((await cache.keys()).map(r => r.url));
      for (const f of manifest.files) {
        const abs = new URL(f.url, scopeUrl()).href;
        if (have.has(abs)) continue;
        for (const k of keys) { const old = await (await caches.open(k)).match(abs); if (old) { await cache.put(abs, old); break; } }
      }
    }
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* tessere della mappa: prima la copia salvata, poi la rete (e la salvo) */
  if (url.hostname === TILE_HOST) {
    event.respondWith((async () => {
      const cache = await caches.open(TILES);
      const hit = await cache.match(req.url);
      if (hit) return hit;
      try {
        const r = await fetch(req);
        if (r.ok || r.type === 'opaque') cache.put(req.url, r.clone());
        return r;
      } catch (e) { return Response.error(); }
    })());
    return;
  }

  if (url.origin !== location.origin) return;   /* altri siti: normale */

  event.respondWith((async () => {
    const cache = await caches.open(PRE);
    const hit = (await cache.match(req, {ignoreVary: true})) ||
                (await cache.match(req, {ignoreSearch: true, ignoreVary: true})) ||
                (await caches.match(req, {ignoreSearch: true, ignoreVary: true}));   /* qualsiasi cache */
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r.ok && url.pathname.startsWith(new URL(scopeUrl()).pathname)) cache.put(req, r.clone());
      return r;
    } catch (e) {
      if (req.mode === 'navigate') {
        const home = (await cache.match('index.html')) || (await caches.match('index.html', {ignoreSearch: true}));
        if (home) return home;
      }
      return Response.error();
    }
  })());
});

/* la home (o pwa.js) chiede di completare i file mancanti */
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
  if (event.data === 'topup') {
    event.waitUntil((async () => {
      const cache = await caches.open(PRE);
      const manifest = await manifestFromCache(cache);
      if (manifest) await fillMissing(cache, manifest);
    })());
  }
});
