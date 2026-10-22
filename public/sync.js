// Speichert alles aus dem Browser-Speicher (localStorage) zusätzlich in der Datenbank des Boards und hält
// alle Geräte live auf demselben Stand: Änderungen gehen sofort an den Server, und alle paar Sekunden
// werden die Änderungen der anderen Geräte geholt. Danach wird die eigentliche App (app.js) geladen.
(function(){
  const ls = window.localStorage;
  const origSet = ls.setItem.bind(ls), origRemove = ls.removeItem.bind(ls), origClear = ls.clear.bind(ls);
  const pending = { set: {}, del: new Set() };
  let timer = null, since = 0, polling = false;

  function flush(useBeacon){
    clearTimeout(timer); timer = null;
    if(!Object.keys(pending.set).length && !pending.del.size) return;
    const body = JSON.stringify({ set: pending.set, del: [...pending.del] });
    pending.set = {}; pending.del = new Set();
    if(useBeacon && navigator.sendBeacon){ navigator.sendBeacon('/api/store', new Blob([body], { type: 'application/json' })); return; }
    fetch('/api/store', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {
      const b = JSON.parse(body); for(const k in b.set) if(!(k in pending.set)) pending.set[k] = b.set[k]; b.del.forEach(k => pending.del.add(k)); schedule();   // offline: später nochmal
    });
  }
  function schedule(){ if(!timer) timer = setTimeout(() => flush(false), 400); }

  ls.setItem = function(k, v){ origSet(k, v); k = String(k); pending.set[k] = String(v); pending.del.delete(k); schedule(); };
  ls.removeItem = function(k){ origRemove(k); k = String(k); delete pending.set[k]; pending.del.add(k); schedule(); };
  ls.clear = function(){ for(let i = 0; i < ls.length; i++) pending.del.add(ls.key(i)); origClear(); pending.set = {}; schedule(); };
  window.addEventListener('pagehide', () => flush(true));

  // Änderungen anderer Geräte übernehmen (eigene, noch nicht gesendete Änderungen haben Vorrang)
  function apply(res){
    const keys = [];
    for(const [k, v] of Object.entries(res.data || {})){
      if(k in pending.set || pending.del.has(k) || ls.getItem(k) === v) continue;
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
    if(polling) return;
    polling = true;
    try{
      const r = await fetch('/api/store?since=' + since, { cache: 'no-store' });
      if(r.ok){
        const keys = apply(await r.json());
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

  // Beim Start: kompletten Datenbank-Stand übernehmen; was nur im Browser liegt, wird hochgeladen
  fetch('/api/store?since=0', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(res => {
    if(!res) return;
    const server = res.data || {};
    for(const [k, v] of Object.entries(server)) origSet(k, v);
    for(const k of res.deleted || []) origRemove(k);
    since = res.now || 0;
    for(let i = 0; i < ls.length; i++){
      const k = ls.key(i);
      if(!(k in server) && !(res.deleted || []).includes(k)) pending.set[k] = ls.getItem(k);
    }
    schedule();
  }).catch(() => {}).finally(startApp);
})();
