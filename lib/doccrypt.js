/* ============================================================
   Documenti cifrati (AES-GCM 256, chiave da PBKDF2-SHA256).
   I parametri pubblici (sale, iterazioni, verifica) sono in
   Documenti_cifrati/chiave.js. La password non e' mai salvata:
   sul telefono resta solo la chiave derivata, in localStorage.
   Formato di ogni file .enc: [12 byte IV][dati cifrati + tag].
   ============================================================ */
(function(){
  var STORE = 'aus_doc_key_v1';
  var b64 = function(s){ return Uint8Array.from(atob(s), function(c){ return c.charCodeAt(0); }); };
  var tob64 = function(buf){ var s = '', a = new Uint8Array(buf); for(var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); };
  var cfg = function(){ if(!window.AUS_DOC_KEY) throw new Error('chiave.js mancante'); return window.AUS_DOC_KEY; };
  var subtle = function(){ if(!(window.crypto && crypto.subtle)) throw new Error('cifratura non disponibile in questo browser'); return crypto.subtle; };

  async function derive(password){
    var c = cfg();
    var base = await subtle().importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    return subtle().deriveKey({name:'PBKDF2', salt:b64(c.salt), iterations:c.iter, hash:'SHA-256'},
      base, {name:'AES-GCM', length:256}, true, ['encrypt', 'decrypt']);
  }
  async function check(key){
    var c = cfg();
    try{
      var out = await subtle().decrypt({name:'AES-GCM', iv:b64(c.check.iv)}, key, b64(c.check.ct));
      return new TextDecoder().decode(out) === 'australia-ok';
    }catch(e){ return false; }
  }
  async function stored(){
    var raw = null; try{ raw = localStorage.getItem(STORE); }catch(e){}
    if(!raw) return null;
    try{ return await subtle().importKey('raw', b64(raw), {name:'AES-GCM'}, false, ['decrypt']); }catch(e){ return null; }
  }

  window.AusDocs = {
    /* true se su questo dispositivo i documenti sono gia' sbloccati */
    isUnlocked: function(){ try{ return !!localStorage.getItem(STORE); }catch(e){ return false; } },
    /* prova la password; se giusta salva la chiave e ritorna true */
    unlock: async function(password){
      var key = await derive(String(password || '').trim());
      if(!(await check(key))) return false;
      try{ localStorage.setItem(STORE, tob64(await subtle().exportKey('raw', key))); }catch(e){}
      return true;
    },
    lock: function(){ try{ localStorage.removeItem(STORE); }catch(e){} },
    /* ArrayBuffer cifrato -> ArrayBuffer del PDF */
    decrypt: async function(buf){
      var key = await stored(); if(!key) throw new Error('bloccato');
      var a = new Uint8Array(buf);
      return subtle().decrypt({name:'AES-GCM', iv:a.slice(0, 12)}, key, a.slice(12));
    },
    /* per tools/cripta.html: cifra con la password data */
    encryptWith: async function(password, buf){
      var key = await derive(String(password || '').trim());
      if(!(await check(key))) throw new Error('password sbagliata');
      var iv = crypto.getRandomValues(new Uint8Array(12));
      var ct = new Uint8Array(await subtle().encrypt({name:'AES-GCM', iv:iv}, key, buf));
      var out = new Uint8Array(12 + ct.length); out.set(iv, 0); out.set(ct, 12);
      return out;
    },
    /* 'Documenti/nome.pdf' -> 'Documenti_cifrati/nome.pdf.enc' (percorsi gia' codificati) */
    encPath: function(rel){ return 'Documenti_cifrati/' + rel.split('/').pop() + '.enc'; }
  };
})();
