// Speichert alles aus dem Browser-Speicher (localStorage) zusätzlich in der Datenbank – im Konto, mit dem man
// angemeldet ist – und hält alle Geräte live auf demselben Stand: Änderungen gehen sofort an den Server, und alle
// paar Sekunden werden die Änderungen der anderen Geräte geholt. Danach wird die eigentliche App (app.js) geladen.
(function(){
  const ls = window.localStorage;
  const origSet = ls.setItem.bind(ls), origRemove = ls.removeItem.bind(ls), origClear = ls.clear.bind(ls);
  const USER_KEY = '__board_user';   // zu welchem Konto die Daten in diesem Browser gehören (wird nicht hochgeladen)
  const pending = { set: {}, del: new Set() };
  let timer = null, since = 0, polling = false, user = null;

  function flush(useBeacon){
    clearTimeout(timer); timer = null;
    if(user == null || (!Object.keys(pending.set).length && !pending.del.size)) return;
    const body = JSON.stringify({ user, set: pending.set, del: [...pending.del] });
    pending.set = {}; pending.del = new Set();
    if(useBeacon && navigator.sendBeacon){ navigator.sendBeacon('/api/store', new Blob([body], { type: 'application/json' })); return; }
    fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).then(r => {
      if(r.status === 401 || r.status === 409) location.reload();   // abgemeldet oder anderes Konto → neu laden
    }).catch(() => {
      const b = JSON.parse(body); for(const k in b.set) if(!(k in pending.set)) pending.set[k] = b.set[k]; b.del.forEach(k => pending.del.add(k)); schedule();   // offline: später nochmal
    });
  }
  function schedule(){ if(!timer) timer = setTimeout(() => flush(false), 400); }

  ls.setItem = function(k, v){ origSet(k, v); k = String(k); if(k === USER_KEY) return; pending.set[k] = String(v); pending.del.delete(k); schedule(); };
  ls.removeItem = function(k){ origRemove(k); k = String(k); if(k === USER_KEY) return; delete pending.set[k]; pending.del.add(k); schedule(); };
  ls.clear = function(){ for(let i = 0; i < ls.length; i++) if(ls.key(i) !== USER_KEY) pending.del.add(ls.key(i)); const u = ls.getItem(USER_KEY); origClear(); if(u) origSet(USER_KEY, u); pending.set = {}; schedule(); };
  window.addEventListener('pagehide', () => flush(true));

  // Abmelden: noch Offenes senden, dann die Sachen dieses Kontos vom Gerät entfernen
  document.addEventListener('submit', (e) => {
    if(e.submitter && e.submitter.value === 'logout'){ flush(true); origClear(); user = null; }
  });

  // Änderungen anderer Geräte übernehmen (eigene, noch nicht gesendete Änderungen haben Vorrang)
  function apply(res){
    const keys = [];
    for(const [k, v] of Object.entries(res.data || {})){
      if(k === USER_KEY || k in pending.set || pending.del.has(k) || ls.getItem(k) === v) continue;
      origSet(k, v); keys.push(k);
    }
    for(const k of res.deleted || []){
      if(k in pending.set || ls.getItem(k) === null) continue;
      origRemove(k); keys.push(k);
    }
    if(res.now) since = Math.max(since, res.now);
    return keys;
  }
  async function poll(){
    if(polling || user == null) return;
    polling = true;
    try{
      const r = await fetch('/api/store?since=' + since, { cache: 'no-store' });
      if(r.status === 401){ location.reload(); return; }   // abgemeldet → zur Anmeldung
      if(r.ok){
        const res = await r.json();
        if(res.user !== user){ location.reload(); return; }   // in einem anderen Tab das Konto gewechselt
        const keys = apply(res);
        if(keys.length) window.dispatchEvent(new CustomEvent('board-sync', { detail: { keys } }));
      }
    } catch(err){}
    polling = false;
  }
  setInterval(() => { if(!document.hidden) poll(); }, 3000);
  document.addEventListener('visibilitychange', () => { if(document.hidden) flush(true); else poll(); });
  window.addEventListener('focus', poll);

  function startApp(){
    const s = document.createElement('script');
    s.src = '/app.js';
    document.body.appendChild(s);
  }

  // Beim Start: Stand des Kontos übernehmen. Gehören die Daten im Browser zu einem anderen (oder keinem) Konto,
  // werden sie verworfen – ein neues Konto startet so wirklich bei 0. Sonst wird hochgeladen, was nur hier liegt.
  fetch('/api/store?since=0', { cache: 'no-store' }).then(r => {
    if(r.status === 401){ location.href = '/login'; throw new Error('abgemeldet'); }
    return r.ok ? r.json() : null;
  }).then(res => {
    if(!res) return;
    const server = res.data || {}, deleted = res.deleted || [];
    const sameUser = ls.getItem(USER_KEY) === String(res.user);
    if(!sameUser){ origClear(); origSet(USER_KEY, String(res.user)); }
    user = res.user;
    for(const [k, v] of Object.entries(server)) if(k !== USER_KEY) origSet(k, v);
    for(const k of deleted) origRemove(k);
    since = res.now || 0;
    if(sameUser){
      for(let i = 0; i < ls.length; i++){
        const k = ls.key(i);
        if(k !== USER_KEY && !(k in server) && !deleted.includes(k)) pending.set[k] = ls.getItem(k);
      }
      schedule();
    }
    startApp();
  }).catch(() => { if(user == null && location.pathname !== '/login') startApp(); });
})();
