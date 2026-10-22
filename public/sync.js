// Speichert alles aus dem Browser-Speicher (localStorage) zusätzlich in der Datenbank des Boards
// und lädt es beim Öffnen wieder – so bleiben To-Dos, Highscores usw. auch auf anderen Geräten
// und nach dem Löschen der Browserdaten erhalten. Danach wird die eigentliche App (app.js) geladen.
(function(){
  const ls = window.localStorage;
  const origSet = ls.setItem.bind(ls), origRemove = ls.removeItem.bind(ls), origClear = ls.clear.bind(ls);
  const pending = { set: {}, del: new Set() };
  let timer = null;

  function flush(useBeacon){
    clearTimeout(timer); timer = null;
    const keys = Object.keys(pending.set);
    if(!keys.length && !pending.del.size) return;
    const body = JSON.stringify({ set: pending.set, del: [...pending.del] });
    pending.set = {}; pending.del = new Set();
    if(useBeacon && navigator.sendBeacon){ navigator.sendBeacon('/api/store', new Blob([body], { type: 'application/json' })); return; }
    fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {
      // offline: beim nächsten Mal erneut versuchen
      const b = JSON.parse(body); Object.assign(pending.set, b.set); b.del.forEach(k => pending.del.add(k)); schedule();
    });
  }
  function schedule(){ if(!timer) timer = setTimeout(() => flush(false), 500); }

  // Jede Änderung am localStorage geht automatisch auch an die Datenbank
  ls.setItem = function(k, v){ origSet(k, v); k = String(k); pending.set[k] = String(v); pending.del.delete(k); schedule(); };
  ls.removeItem = function(k){ origRemove(k); k = String(k); delete pending.set[k]; pending.del.add(k); schedule(); };
  ls.clear = function(){ for(let i = 0; i < ls.length; i++) pending.del.add(ls.key(i)); origClear(); pending.set = {}; schedule(); };
  window.addEventListener('pagehide', () => flush(true));
  document.addEventListener('visibilitychange', () => { if(document.hidden) flush(true); });

  function startApp(){
    const s = document.createElement('script');
    s.src = '/app.js';
    document.body.appendChild(s);
  }

  // Beim Start: Datenbank-Stand übernehmen; was nur im Browser liegt, wird hochgeladen
  fetch('/api/store', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(server => {
    if(server){
      for(const [k, v] of Object.entries(server)) origSet(k, v);
      for(let i = 0; i < ls.length; i++){
        const k = ls.key(i);
        if(!(k in server)) pending.set[k] = ls.getItem(k);
      }
      schedule();
    }
  }).catch(() => {}).finally(startApp);
})();
