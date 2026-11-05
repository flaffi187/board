// Befehlszeile auf der Anmeldeseite: man kann echte (kleine) Befehle tippen, z.B. help, login, register, matrix fast …
(function(){
  var input = document.getElementById('cmd-in');
  if(!input) return;
  var row = input.parentNode;
  var nameField = document.querySelector('.term input[name=name]');
  var hist = [], hi = 0;
  var PROMPT = 'C:\\ufl\\home>';

  function line(text, cls){
    var d = document.createElement('div');
    d.className = 'term-line ' + (cls || 'term-out');
    d.textContent = text;
    row.parentNode.insertBefore(d, row);
    return d;
  }
  function clear(){
    var n = row.parentNode.querySelectorAll('.term-out, .term-echo');
    for(var i = 0; i < n.length; i++) n[i].remove();
    var codes = row.parentNode.querySelectorAll('.term-code, .term-boot');
    for(var j = 0; j < codes.length; j++) codes[j].remove();
  }
  function pad(n){ return n < 10 ? '0' + n : '' + n; }
  var WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  var cmds = {
    help: function(){
      ['Verfügbare Befehle:',
       '  help                diese Hilfe',
       '  login [name]        zur Anmeldung (Name wird eingetragen)',
       '  register            neues Konto erstellen',
       '  color [xy]          Farben ändern, z.B. color 0a (grün auf schwarz), color ohne Wert = zurück',
       '  matrix [fast|slow|off|on]   Zahlenregen steuern',
       '  ipconfig [/all]     Netzwerk-Konfiguration (simuliert)',
       '  ping <host>         Ping an einen Host (simuliert)',
       '  hostname, whoami    Rechner- und Benutzername',
       '  systeminfo, tasklist, tree, dir',
       '  title <text>        Fenstertitel ändern',
       '  date, time, echo <text>, ver',
       '  cls                 Bildschirm leeren'].forEach(function(t){ line(t); });
    },
    '?': function(){ cmds.help(); },
    cls: function(){ clear(); },
    clear: function(){ clear(); },
    ver: function(){ line(''); line('Microsoft Windows [Version 10.0.26200.9106]'); },
    date: function(){ var d = new Date(); line('Aktuelles Datum: ' + WD[d.getDay()] + ' ' + pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear()); },
    time: function(){ var d = new Date(); line('Aktuelle Zeit: ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())); },
    echo: function(a){ line(a.join(' ')); },
    whoami: function(){ line('gast (nicht angemeldet)'); },
    dir: function(){
      line(' Verzeichnis von C:\\ufl\\home');
      line('');
      ['01 Übersicht', '02 Uhrzeit', '03 Wetter', '04 To-Do', '05 Kalender', '06 Rechner', '07 Timer', '08 Apps', '09 Spiele'].forEach(function(n){ line('<DIR>          ' + n); });
      line('');
      line('               9 Verzeichnis(se) – zuerst anmelden zum Öffnen');
    },
    color: function(a){
      var term = document.querySelector('.term');
      var C = ['#000000', '#0037da', '#13a10e', '#3a96dd', '#c50f1f', '#881798', '#c19c00', '#cccccc', '#767676', '#3b78ff', '#16c60c', '#61d6d6', '#e74856', '#b4009e', '#f9f1a5', '#ffffff'];
      var v = (a[0] || '').toLowerCase();
      if(!v){ term.classList.remove('recolor'); term.style.removeProperty('--t-fg'); term.style.removeProperty('--t-bg'); return; }
      if(!/^[0-9a-f]{1,2}$/.test(v)){ line('Verwendung: color [hintergrund][vordergrund], z.B. color 0a'); line('  0 schwarz  1 blau  2 grün  3 türkis  4 rot  5 lila  6 gelb  7 weiss'); line('  8 grau  9 hellblau  a hellgrün  b hellturkis  c hellrot  d helllila  e hellgelb  f hellweiss'); return; }
      var bg = v.length === 2 ? parseInt(v.charAt(0), 16) : 0, fg = parseInt(v.charAt(v.length - 1), 16);
      if(bg === fg){ line('Hintergrund und Vordergrund dürfen nicht gleich sein.'); return; }
      var h = C[bg].replace('#', ''), r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
      term.style.setProperty('--t-fg', C[fg]);
      term.style.setProperty('--t-bg', 'rgba(' + r + ',' + g + ',' + b + ',.55)');
      term.classList.add('recolor');
    },
    hostname: function(){ line('ufl-home'); },
    title: function(a){ var t = document.querySelector('.term-title'); if(t) t.textContent = a.length ? a.join(' ') : 'C:\\ufl\\home\\login.exe'; },
    ipconfig: function(a){
      var all = a.join(' ').toLowerCase().indexOf('/all') >= 0;
      line('Windows-IP-Konfiguration (simuliert)');
      line('');
      line('Ethernet-Adapter ufl0:');
      line('');
      if(all){ line('   Verbindungsspezifisches DNS-Suffix: ufl.home'); line('   Physische Adresse . . . . . . . . : 00-1A-2B-3C-4D-5E'); }
      line('   IPv4-Adresse  . . . . . . . . . . : 192.168.1.42');
      line('   Subnetzmaske  . . . . . . . . . . : 255.255.255.0');
      line('   Standardgateway . . . . . . . . . : 192.168.1.1');
    },
    ping: function(a){
      var h = a[0];
      if(!h){ line('Verwendung: ping <host>'); return; }
      line('Ping wird ausgeführt für ' + h + ' mit 32 Bytes Daten (simuliert):');
      var t = [];
      for(var i = 0; i < 4; i++){ var ms = 8 + Math.floor(Math.random() * 20); t.push(ms); line('Antwort von ' + h + ': Bytes=32 Zeit=' + ms + 'ms TTL=57'); }
      var sum = t.reduce(function(x, y){ return x + y; }, 0);
      line('Ping-Statistik: Gesendet = 4, Empfangen = 4, Verloren = 0 (0% Verlust), Mittelwert = ' + Math.round(sum / 4) + 'ms');
    },
    systeminfo: function(){
      line('Hostname:            UFL-HOME');
      line('Betriebssystem:      ufl home 1.0');
      line('Systemtyp:           Browser-basiert');
      line('Zeitzone:            ' + (Intl.DateTimeFormat().resolvedOptions().timeZone || 'unbekannt'));
      line('Bildschirm:          ' + innerWidth + ' x ' + innerHeight);
    },
    tasklist: function(){
      line('Abbildname                 PID   Speicher');
      line('========================= ===== ==========');
      [['uhrzeit.exe', 1204, '12.340 K'], ['wetter.exe', 1388, '18.904 K'], ['todo.exe', 2012, '9.212 K'], ['kalender.exe', 2210, '11.468 K'], ['spiele.exe', 3320, '48.020 K']].forEach(function(r){
        line((r[0] + '                         ').slice(0, 25) + ' ' + (r[1] + '     ').slice(0, 5) + ' ' + r[2]);
      });
    },
    tree: function(){
      line('C:\\ufl\\home');
      ['Übersicht', 'Uhrzeit', 'Wetter', 'To-Do', 'Kalender', 'Rechner', 'Timer', 'Apps', 'Spiele'].forEach(function(n, i, all){ line((i === all.length - 1 ? '└───' : '├───') + n); });
    },
    cd: function(){ line('C:\\ufl\\home'); },
    exit: function(){ line('Dieses Fenster lässt sich nicht schliessen – melde dich an.'); },
    login: function(a){
      if(/modus=neu/.test(location.search)){ location.href = '/login'; return; }
      if(a[0]){ nameField.value = a.join(' '); line('Benutzername eingetragen: ' + nameField.value); }
      else line('Gib Benutzername und Passwort unten ein.');
      var pw = document.querySelector('.term input[name=password]');
      (a[0] ? pw : nameField).focus();
    },
    register: function(){ if(/modus=neu/.test(location.search)) line('Du bist schon im Registrierungsmodus.'); else { line('Wechsle zu register …'); location.href = '/login?modus=neu'; } },
    matrix: function(a){
      var m = window.matrixRain, w = (a[0] || '').toLowerCase();
      if(!m){ line('Der Zahlenregen ist hier nicht aktiv.'); return; }
      if(w === 'off'){ m.show(false); line('Zahlenregen aus. (matrix on zum Einschalten)'); }
      else if(w === 'on'){ m.show(true); m.speed(1); line('Zahlenregen an.'); }
      else if(w === 'fast'){ m.show(true); m.speed(3); line('Zahlenregen schnell.'); }
      else if(w === 'slow'){ m.show(true); m.speed(0.4); line('Zahlenregen langsam.'); }
      else line('Verwendung: matrix [fast|slow|off|on]');
    }
  };

  function run(text){
    line(PROMPT + text, 'term-echo');
    var parts = text.trim().split(/\s+/), name = (parts.shift() || '').toLowerCase();
    if(!name) return;
    if(cmds.hasOwnProperty(name)) cmds[name](parts);
    else line('Der Befehl "' + name + '" ist entweder falsch geschrieben oder konnte nicht gefunden werden. (help zeigt alle Befehle)');
    row.scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      e.preventDefault();
      var v = input.value; input.value = '';
      if(v.trim()){ hist.push(v); }
      hi = hist.length;
      run(v);
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      if(hi > 0){ hi--; input.value = hist[hi]; }
    } else if(e.key === 'ArrowDown'){
      e.preventDefault();
      if(hi < hist.length - 1){ hi++; input.value = hist[hi]; }
      else if(input.value === '' || hi >= hist.length - 1){ hi = hist.length; input.value = ''; if(nameField) nameField.focus(); }
    }
  });
  // Klick auf eine Zeile oder die freie Fläche der Befehlszeile: Eingabe fokussieren
  row.addEventListener('click', function(){ input.focus(); });
})();
