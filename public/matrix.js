// Matrix-Zahlenregen als Hintergrund der Anmeldeseite: kleine schnelle Zeichen hinten, grosse unscharfe Ziffern vorne.
// Beim Absenden des Formulars wird der Regen kurz schneller und heller.
(function(){
  var small = document.getElementById('matrix'), big = document.getElementById('matrix-big');
  if(!small || !big) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, boost = 1, visible = true;
  var KATA = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
  var SMALL_CH = '0123456789' + KATA, BIG_CH = '0123456789';
  function layer(canvas, fs, chars, speed, fade, head){
    var x = canvas.getContext('2d'), cols = 0, y = [], v = [];
    function resize(){
      canvas.width = W * dpr; canvas.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      x.fillStyle = '#000'; if(canvas === small) x.fillRect(0, 0, W, H);
      cols = Math.ceil(W / fs);
      for(var i = 0; i < cols; i++){ if(y[i] === undefined){ y[i] = -Math.random() * H / fs; v[i] = 0.5 + Math.random() * 0.9; } }
      y.length = v.length = cols;
    }
    function step(){
      x.globalCompositeOperation = 'source-over';
      if(canvas === small){ x.fillStyle = 'rgba(0,0,0,' + fade + ')'; x.fillRect(0, 0, W, H); }
      else { x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,' + fade + ')'; x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'source-over'; }
      x.font = 'bold ' + fs + 'px "JetBrains Mono", Consolas, monospace';
      x.textBaseline = 'top';
      for(var i = 0; i < cols; i++){
        if(canvas === big && (i * 7919) % 11 > 3) continue;   // vorne nur wenige Spalten
        var ch = chars.charAt(Math.floor(Math.random() * chars.length));
        var px = i * fs, py = y[i] * fs;
        if(head && Math.random() < 0.3){ x.fillStyle = '#d8ffe0'; } else { x.fillStyle = canvas === big ? 'rgba(40,255,90,.95)' : 'rgba(0,255,65,' + (0.75 + Math.random() * 0.25) + ')'; }
        x.fillText(ch, px, py);
        y[i] += v[i] * speed * boost;
        if(py > H && Math.random() > 0.975){ y[i] = -Math.random() * 20; v[i] = 0.5 + Math.random() * 0.9; }
      }
    }
    return { resize: resize, step: step };
  }
  var a = layer(small, 15, SMALL_CH, 0.6, 0.05, true);
  var b = layer(big, 64, BIG_CH, 0.25, 0.03, false);
  function size(){ W = innerWidth; H = innerHeight; a.resize(); b.resize(); }
  size(); window.addEventListener('resize', size);
  if(reduce){ for(var k = 0; k < 120; k++) a.step(); return; }
  var last = 0;
  (function loop(t){
    requestAnimationFrame(loop);
    if(!visible || t - last < 33) return;   // ca. 30 Bilder pro Sekunde
    last = t; a.step(); b.step();
  })(0);
  // Steuerung für die Befehlszeile (public/cmd.js): matrix fast | slow | off | on
  window.matrixRain = {
    speed: function(n){ boost = n; },
    show: function(on){ visible = !!on; small.style.display = big.style.display = on ? '' : 'none'; }
  };
  var form = document.querySelector('.term');
  if(form) form.addEventListener('submit', function(){ boost = 4; document.body.classList.add('matrix-go'); });
})();
