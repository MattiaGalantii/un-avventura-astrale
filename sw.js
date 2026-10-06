/* ============================================================
   Service worker: rende il sito utilizzabile offline.
   - All'installazione scarica TUTTI i file elencati in
     precache.json (pagine, dati, font, PDF).
   - Le tessere della mappa (Esri) vengono salvate mentre le
     guardi, oppure in blocco col tasto "Mappe offline" in home.
   VERSION viene sostituita automaticamente a ogni pubblicazione
   (GitHub Action): cosi' il telefono scarica la versione nuova.
   ============================================================ */
const VERSION = '__VERSION__';
const PRE = 'aus-pre-' + VERSION;
const TILES = 'aus-tiles-v1';
const TILE_HOST = 'server.arcgisonline.com';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const res = await fetch('precache.json', {cache: 'no-store'});
    const manifest = await res.json();
    const cache = await caches.open(PRE);
    await cache.put('precache.json', new Response(JSON.stringify(manifest), {headers: {'Content-Type': 'application/json'}}));
    const urls = manifest.files.map(f => f.url);
    /* a blocchi, per non saturare la connessione del telefono */
    for (let i = 0; i < urls.length; i += 6) {
      await Promise.all(urls.slice(i, i + 6).map(async u => {
        const r = await fetch(new Request(u, {cache: 'reload'}));
        if (!r.ok) throw new Error('download fallito: ' + u + ' (' + r.status + ')');
        await cache.put(u, r);
      }));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('aus-pre-') && k !== PRE).map(k => caches.delete(k)));
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
                (await cache.match(req, {ignoreSearch: true, ignoreVary: true}));
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r.ok && url.pathname.startsWith(new URL(self.registration.scope).pathname)) cache.put(req, r.clone());
      return r;
    } catch (e) {
      if (req.mode === 'navigate') {
        const home = await cache.match('index.html');
        if (home) return home;
      }
      return Response.error();
    }
  })());
});

/* la home chiede di riscaricare tutto (tasto "Controlla di nuovo") */
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
