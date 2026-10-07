const cities = [
  { name:"Zürich",    region:"Schweiz",     tz:"Europe/Zurich",      lat:47.3769,  lon:8.5417,   accent:"#C1443D" },
  { name:"Aarau",     region:"Schweiz",     tz:"Europe/Zurich",      lat:47.3919,  lon:8.0448,   accent:"#7A9E3C" },
  { name:"New York",   region:"USA",         tz:"America/New_York",              lat:40.7128,  lon:-74.0060, accent:"#5B8DEF" },
  { name:"Buenos Aires", region:"Argentinien", tz:"America/Argentina/Buenos_Aires", lat:-34.6037, lon:-58.3816, accent:"#A45EE5" },
  { name:"Kairo",      region:"Afrika",      tz:"Africa/Cairo",       lat:30.0444,  lon:31.2357,  accent:"#E08A3C" },
  { name:"Tokio",      region:"Japan",       tz:"Asia/Tokyo",         lat:35.6762,  lon:139.6503, accent:"#1FB6A6" },
  { name:"Sydney",     region:"Australien",  tz:"Australia/Sydney",   lat:-33.8688, lon:151.2093, accent:"#FFB100" },
];

const wxMap = {
  0:["☀️","Klarer Himmel"], 1:["🌤️","Überwiegend klar"], 2:["⛅","Teilweise bewölkt"], 3:["☁️","Bedeckt"],
  45:["🌫️","Nebel"], 48:["🌫️","Reifnebel"],
  51:["🌦️","Leichter Nieselregen"], 53:["🌦️","Nieselregen"], 55:["🌧️","Starker Nieselregen"],
  61:["🌧️","Leichter Regen"], 63:["🌧️","Regen"], 65:["🌧️","Starker Regen"],
  71:["🌨️","Leichter Schneefall"], 73:["🌨️","Schneefall"], 75:["❄️","Starker Schneefall"],
  80:["🌦️","Regenschauer"], 81:["🌧️","Kräftiger Schauer"], 82:["⛈️","Heftiger Schauer"],
  95:["⛈️","Gewitter"], 96:["⛈️","Gewitter mit Hagel"], 99:["⛈️","Schweres Gewitter"]
};

// Bienenwaben-Hintergrund hinter der Übersicht
// Geteilte Waben-Geometrie: gleiche Masse wie die echten Kacheln (.overview-card)
const honeyGeo = { W: 146, H: 168, rowStep: 126, halfW: 73, cols: 6, rows: 4 };
// Zellen, die aktuell von echten Kacheln belegt sind (row,col) -> werden im Hintergrund übersprungen
const honeyOccupied = new Set(['0,0', '0,3', '1,1', '1,4', '2,0', '2,3', '3,1', '3,4']);
function honeyCellBox(r, c){
  const offsetX = (r % 2 === 0) ? 0 : honeyGeo.halfW;
  const left = offsetX + c * honeyGeo.W;
  const top = r * honeyGeo.rowStep;
  return { left, top, cx: left + honeyGeo.W / 2, cy: top + honeyGeo.H / 2 };
}
// Pseudo-Zufall (deterministisch) für natürliche Variation je Zelle
const honeySeeded = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
// Sechseck mit leicht abgerundeten Ecken (Wachs ist nie ganz spitz)
function honeyHexPath(cx, cy, s, round){
  const v = [];
  for(let i = 0; i < 6; i++){
    const a = Math.PI / 180 * (60 * i - 90);
    v.push([cx + s * Math.cos(a), cy + s * Math.sin(a)]);
  }
  const f = (n) => n.toFixed(1);
  let d = '';
  for(let i = 0; i < 6; i++){
    const p = v[(i + 5) % 6], q = v[i], n = v[(i + 1) % 6];
    const t = round / s;
    const a1 = [q[0] + (p[0] - q[0]) * t, q[1] + (p[1] - q[1]) * t];
    const a2 = [q[0] + (n[0] - q[0]) * t, q[1] + (n[1] - q[1]) * t];
    d += (i === 0 ? 'M' : 'L') + f(a1[0]) + ',' + f(a1[1]) + ' Q' + f(q[0]) + ',' + f(q[1]) + ' ' + f(a2[0]) + ',' + f(a2[1]) + ' ';
  }
  return d + 'Z';
}
// Eine Honigzelle. Typen: 'full' (voll), 'partial' (halb voll), 'capped' (verdeckelt), 'empty' (leer), 'crystal' (kristallisiert).
// Jede Zelle bekommt zusätzlich eigene Honigsorte, Glanzposition, Bläschen und eine leicht andere Wachsfarbe.
function honeyCellMarkup(cx, cy, idx, type, fill){
  type = type || 'full';
  const sOuter = honeyGeo.H / 2;
  const sHoney = sOuter * (0.84 + honeySeeded(idx * 31 + 40) * 0.04);
  const sd = (k) => honeySeeded(idx * 31 + k);
  const variant = Math.floor(sd(0) * 6);
  const wall = Math.floor(sd(5) * 3);
  const f = (n) => n.toFixed(1);
  const inner = honeyHexPath(cx, cy, sHoney, 9);
  let m = '';
  m += `<path d="${honeyHexPath(cx, cy, sOuter, 6)}" fill="url(#honeyWall${wall})" stroke="#a5761f" stroke-width="1.2"/>`;
  m += `<path d="${honeyHexPath(cx, cy, sOuter - 2.5, 6)}" fill="none" stroke="rgba(255,246,210,0.55)" stroke-width="1.4"/>`;
  m += `<path d="${honeyHexPath(cx, cy, sHoney + 2.5, 9)}" fill="url(#honeyWallInner)"/>`;

  if(type === 'capped'){
    // Wachsdeckel: matt, cremefarben, leicht gewölbt, mit feiner Struktur
    m += `<path d="${inner}" fill="url(#honeyCap${Math.floor(sd(6) * 2)})" filter="url(#honeyCapTex)"/>`;
    m += `<path d="${honeyHexPath(cx - 3, cy - 4, sHoney * 0.7, 12)}" fill="#fff8e2" opacity="0.14" filter="url(#honeySoft)"/>`;
    m += `<path d="${honeyHexPath(cx, cy, sHoney - 3, 8)}" fill="none" stroke="rgba(255,250,232,0.45)" stroke-width="1.2" stroke-dasharray="${f(sHoney * 1.6)} ${f(sHoney * 4.4)}" stroke-dashoffset="${f(sHoney * 4.3)}"/>`;
    m += `<path d="${honeyHexPath(cx, cy, sHoney - 1, 8)}" fill="none" stroke="rgba(120,80,20,0.35)" stroke-width="1.5"/>`;
    return m;
  }
  if(type === 'eggs'){
    // Brutzelle: leer, am Boden liegen kleine, perlweisse Bienen-Eier
    m += `<path d="${inner}" fill="url(#honeyEmpty)" filter="url(#honeyDepth)"/>`;
    m += `<path d="${honeyHexPath(cx + 2, cy + 4, sHoney * 0.42, 5)}" fill="#7a4e16" opacity="0.55" filter="url(#honeySoft)"/>`;
    m += `<path d="${honeyHexPath(cx, cy, sHoney - 1.5, 8)}" fill="none" stroke="url(#honeyMeniscus)" stroke-width="1.6" opacity="0.6"/>`;
    const eggs = [[0, 2, -8], [-11, 9, 34], [10, -7, -52], [8, 13, 72], [-9, -10, 18],
      [-22, -2, -30], [21, 4, 40], [-3, -22, 84], [14, -24, -12], [-17, 21, -64],
      [5, 25, 22], [26, -14, 58], [-27, -17, 6], [-30, 12, 48], [29, 19, -38],
      [-12, -33, -24], [11, 36, 64], [-1, 14, -80]];
    eggs.forEach(([dx, dy, rot]) => {
      const ex = cx + dx, ey = cy + dy;
      const t = `rotate(${rot} ${f(ex)} ${f(ey)})`;
      m += `<ellipse cx="${f(ex + 1.2)}" cy="${f(ey + 1.6)}" rx="2.6" ry="6.4" fill="#2e1802" opacity="0.45" filter="url(#honeySoft)" transform="${t}"/>`;
      m += `<path d="M${f(ex)},${f(ey - 6.4)} C${f(ex + 3.4)},${f(ey - 6)} ${f(ex + 3)},${f(ey + 6.2)} ${f(ex)},${f(ey + 6.4)} C${f(ex - 2.6)},${f(ey + 6.2)} ${f(ex - 2.9)},${f(ey - 6)} ${f(ex)},${f(ey - 6.4)} Z" fill="url(#beeEgg)" stroke="rgba(150,120,70,0.5)" stroke-width="0.4" transform="${t}"/>`;
      m += `<ellipse cx="${f(ex - 0.8)}" cy="${f(ey - 2.6)}" rx="0.8" ry="2.2" fill="#ffffff" opacity="0.9" transform="${t}"/>`;
    });
    return m;
  }
  if(type === 'empty'){
    // Leere Zelle: man sieht in die Tiefe auf den Wachsboden
    m += `<path d="${inner}" fill="url(#honeyEmpty)" filter="url(#honeyDepth)"/>`;
    m += `<path d="${honeyHexPath(cx + 2, cy + 4, sHoney * 0.42, 5)}" fill="#7a4e16" opacity="0.55" filter="url(#honeySoft)"/>`;
    m += `<path d="${honeyHexPath(cx, cy, sHoney - 1.5, 8)}" fill="none" stroke="url(#honeyMeniscus)" stroke-width="1.6" opacity="0.6"/>`;
    return m;
  }
  if(type === 'crystal'){
    // Kristallisierter Honig: undurchsichtig, hell, körnig
    m += `<path d="${inner}" fill="url(#honeyCrystal)" filter="url(#honeyGrain)"/>`;
    m += `<path d="${inner}" fill="none" stroke="rgba(110,60,5,0.35)" stroke-width="3" filter="url(#honeySoft)"/>`;
    const gx = cx - sHoney * 0.35, gy = cy - sHoney * 0.45;
    m += `<ellipse cx="${f(gx)}" cy="${f(gy)}" rx="10" ry="4" fill="#fffbe6" opacity="0.3" filter="url(#honeySoft)" transform="rotate(-24 ${f(gx)} ${f(gy)})"/>`;
    return m;
  }

  let clip = '';
  let level = cy - sHoney;
  if(type === 'partial'){
    // Nur zum Teil gefüllt: oben leere Zelle, unten Honig mit waagrechter Oberfläche
    level = fill != null ? cy + sHoney - fill * 2 * sHoney : cy - sHoney * 0.2 + sd(7) * sHoney * 0.75;
    const id = 'honeyClip' + idx;
    m += `<path d="${inner}" fill="url(#honeyEmpty)" filter="url(#honeyDepth)"/>`;
    // Honig zieht sich an den Wänden hoch -> leicht nach oben gebogene Oberfläche
    const surf = `M${f(cx - sOuter)},${f(level - 5)} Q${f(cx)},${f(level + 4)} ${f(cx + sOuter)},${f(level - 5)}`;
    m += `<clipPath id="${id}"><path d="${surf} L${f(cx + sOuter)},${f(cy + sOuter)} L${f(cx - sOuter)},${f(cy + sOuter)} Z"/></clipPath>`;
    clip = ` clip-path="url(#${id})"`;
  }
  m += `<g${clip}>`;
  m += `<path d="${inner}" fill="url(#honeyBody${variant})" filter="url(#honeyDepth)"/>`;
  m += `<ellipse cx="${f(cx + (sd(1) - 0.5) * 16)}" cy="${f(cy + sHoney * (0.32 + sd(8) * 0.18))}" rx="${f(sHoney * (0.5 + sd(9) * 0.2))}" ry="${f(sHoney * 0.32)}" fill="url(#honeyGlow)" opacity="${f(0.6 + sd(11) * 0.4)}"/>`;
  m += `<path d="${honeyHexPath(cx, cy, sHoney - 1.5, 8)}" fill="none" stroke="url(#honeyMeniscus)" stroke-width="2.4"/>`;
  const bubbles = Math.floor(sd(2) * 5);
  for(let b = 0; b < bubbles; b++){
    const bx = cx + (sd(10 + b) - 0.5) * sHoney * 1.0;
    const by = Math.max(level + 4, cy + (sd(20 + b) - 0.2) * sHoney * 0.8);
    const br = 0.8 + sd(30 + b) * 2.4;
    m += `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(br)}" fill="rgba(255,236,170,0.18)" stroke="rgba(255,244,205,0.6)" stroke-width="0.5"/>`;
    m += `<circle cx="${f(bx - br * 0.35)}" cy="${f(by - br * 0.35)}" r="${f(br * 0.32)}" fill="#fffbea" opacity="0.9"/>`;
  }
  m += `</g>`;
  if(type === 'partial'){
    // Honigoberfläche mit hellem Rand
    const surf = `M${f(cx - sOuter)},${f(level - 4.4)} Q${f(cx)},${f(level + 4.6)} ${f(cx + sOuter)},${f(level - 4.4)}`;
    m += `<path d="${surf}" fill="none" stroke="rgba(255,232,150,0.8)" stroke-width="1.6" clip-path="url(#honeyClipLine${idx})"/>`;
    m += `<path d="${surf}" fill="none" stroke="rgba(255,250,225,0.5)" stroke-width="4" filter="url(#honeySoft)" clip-path="url(#honeyClipLine${idx})"/>`;
    m += `<clipPath id="honeyClipLine${idx}"><path d="${honeyHexPath(cx, cy, sHoney - 1, 9)}"/></clipPath>`;
    return m;
  }
  // Spiegelung: Position, Grösse und Winkel je Zelle verschieden
  const rot = -14 - sd(12) * 26;
  const gx = cx - sHoney * (0.2 + sd(3) * 0.25), gy = cy - sHoney * (0.3 + sd(4) * 0.25);
  if(sd(13) > 0.3){
    m += `<path d="M${f(cx - sHoney * 0.72)},${f(cy - sHoney * 0.18)} Q${f(cx - sHoney * 0.55)},${f(cy - sHoney * 0.68)} ${f(cx - sHoney * (0.02 + sd(14) * 0.2))},${f(cy - sHoney * 0.8)}" fill="none" stroke="rgba(255,250,228,${f(0.3 + sd(15) * 0.35)})" stroke-width="3" stroke-linecap="round" filter="url(#honeySoft)"/>`;
  }
  const gr = 6 + sd(16) * 6;
  m += `<ellipse cx="${f(gx)}" cy="${f(gy)}" rx="${f(gr)}" ry="${f(gr * 0.45)}" fill="#fffbe6" opacity="${f(0.45 + sd(17) * 0.25)}" filter="url(#honeySoft)" transform="rotate(${f(rot)} ${f(gx)} ${f(gy)})"/>`;
  m += `<ellipse cx="${f(gx - 2)}" cy="${f(gy - 0.6)}" rx="${f(gr * 0.38)}" ry="${f(gr * 0.15)}" fill="#fffef6" opacity="0.95" transform="rotate(${f(rot)} ${f(gx)} ${f(gy)})"/>`;
  return m;
}
const honeyDefs = `
      ${[['#fbe7a6','#efcb6c','#cf9d3a'],['#f8e2a0','#e8bf5c','#c38f2e'],['#fdedb8','#f2d27a','#d6a848']].map((c, i) => `
      <linearGradient id="honeyWall${i}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c[0]}"/>
        <stop offset="50%" stop-color="${c[1]}"/>
        <stop offset="100%" stop-color="${c[2]}"/>
      </linearGradient>`).join('')}
      <linearGradient id="honeyWallInner" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#b07a20"/>
        <stop offset="100%" stop-color="#f3d27e"/>
      </linearGradient>
      ${[
        ['#6e2c02','#b85804','#e98a0c','#ffb02a'], // Blütenhonig
        ['#7a3503','#c86c06','#f5a11a','#ffc444'], // goldgelb
        ['#9a5a06','#d89a1c','#f5c445','#ffe48a'], // heller Akazienhonig
        ['#3c1401','#7a3002','#b85206','#e58614'], // dunkler Waldhonig
        ['#5a2001','#9c4403','#d26c08','#f79a22'], // Kastanie, rötlich
        ['#8a4a04','#cf8410','#f2b030','#ffd25e']  // Raps, hell
      ].map((c, i) => `
      <linearGradient id="honeyBody${i}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${c[0]}"/>
        <stop offset="30%" stop-color="${c[1]}"/>
        <stop offset="68%" stop-color="${c[2]}"/>
        <stop offset="100%" stop-color="${c[3]}"/>
      </linearGradient>`).join('')}
      <radialGradient id="honeyCap0" cx="42%" cy="38%" r="70%">
        <stop offset="0%" stop-color="#fbf0cf"/>
        <stop offset="60%" stop-color="#ecd49a"/>
        <stop offset="100%" stop-color="#c9a256"/>
      </radialGradient>
      <radialGradient id="honeyCap1" cx="45%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#f7e3ad"/>
        <stop offset="60%" stop-color="#e2c27a"/>
        <stop offset="100%" stop-color="#b98e40"/>
      </radialGradient>
      <linearGradient id="beeEgg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fffdf6"/>
        <stop offset="55%" stop-color="#f6efdc"/>
        <stop offset="100%" stop-color="#d8cba8"/>
      </linearGradient>
      <radialGradient id="honeyEmpty" cx="52%" cy="58%" r="65%">
        <stop offset="0%" stop-color="#a87428"/>
        <stop offset="55%" stop-color="#7c4f15"/>
        <stop offset="100%" stop-color="#4a2a08"/>
      </radialGradient>
      <linearGradient id="honeyCrystal" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e2aa3e"/>
        <stop offset="100%" stop-color="#f7d272"/>
      </linearGradient>
      <filter id="honeyCapTex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="2" seed="4" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.08  0 0 0 0.5 -0.12" result="spots"/>
        <feComposite in="spots" in2="SourceAlpha" operator="in" result="spotsIn"/>
        <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="spotsIn"/></feMerge>
      </filter>
      <filter id="honeyGrain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="9" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.75  0 0 0 0.7 -0.2" result="grain"/>
        <feComposite in="grain" in2="SourceAlpha" operator="in" result="grainIn"/>
        <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="grainIn"/></feMerge>
      </filter>
      <radialGradient id="honeyGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffd970" stop-opacity="0.75"/>
        <stop offset="60%" stop-color="#ffc03a" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ffb020" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="honeyMeniscus" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#3a1400" stop-opacity="0.55"/>
        <stop offset="45%" stop-color="#8a4004" stop-opacity="0.2"/>
        <stop offset="75%" stop-color="#ffd46a" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#fff0b8" stop-opacity="0.9"/>
      </linearGradient>
      <filter id="honeySoft" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.4"/>
      </filter>
      <filter id="honeyDepth" x="-10%" y="-10%" width="120%" height="120%">
        <!-- Die Wachswand wirft oben einen Schatten in den Honig -->
        <feOffset in="SourceAlpha" dx="0" dy="9" result="off"/>
        <feGaussianBlur in="off" stdDeviation="5" result="offB"/>
        <feComposite in="SourceAlpha" in2="offB" operator="out" result="rim"/>
        <feFlood flood-color="#250c00" flood-opacity="0.75"/>
        <feComposite in2="rim" operator="in" result="shadow"/>
        <feMerge>
          <feMergeNode in="SourceGraphic"/>
          <feMergeNode in="shadow"/>
        </feMerge>
      </filter>`;
// Feste Mischung für die 16 Hintergrund-Zellen (Reihe für Reihe): meist Honig, ein Deckel-Fleck, Rest gemischt
const honeyBgTypes = ['full', 'capped', 'empty', 'partial',
  'full', 'eggs', 'capped', 'partial',
  'crystal', 'full', 'empty', 'partial',
  'partial', 'empty', 'capped', 'full'];
// Zustand der Hintergrund-Zellen, damit die Bienen sie füllen können
const honeyCells = [];
function renderHoneyCell(cell){
  if(!cell.el) return;
  // Leer und halb voll sind dasselbe, nur mit anderem Füllstand
  const shown = (cell.type === 'empty' || cell.type === 'partial') ? (cell.fill <= 0.01 ? 'empty' : 'partial') : cell.type;
  cell.el.innerHTML = honeyCellMarkup(cell.cx, cell.cy, cell.idx, shown, cell.fill);
}
function buildHoneycombBg(){
  const el = document.getElementById('honeycomb-bg');
  if(!el) return;
  const { cols, rows } = honeyGeo;
  let hexes = '';
  let idx = 0, bgIdx = 0;
  honeyCells.length = 0;
  for(let r = 0; r < rows; r++){
    for(let c = 0; c < cols; c++){
      idx++;
      if(honeyOccupied.has(r + ',' + c)) continue;
      const { cx, cy } = honeyCellBox(r, c);
      // Verteilung wie in einer echten Wabe: meist Honig, einige verdeckelt, wenige halb voll, leer oder kristallisiert
      const type = honeyBgTypes[bgIdx++ % honeyBgTypes.length];
      const fill = type === 'empty' ? 0 : type === 'partial' ? 0.3 + honeySeeded(idx * 31 + 7) * 0.35 : 1;
      honeyCells.push({ r, c, idx, cx, cy, type, fill, el: null });
      hexes += `<g class="honey-cell" data-cx="${cx}" data-cy="${cy}" data-r="${r}" data-c="${c}" style="transition:transform .35s ease"></g>`;
    }
  }
  el.innerHTML = `<svg viewBox="0 0 950 546" preserveAspectRatio="none">
    <defs>${honeyDefs}</defs>
    ${hexes}
  </svg>`;
  honeyCells.forEach(cell => {
    cell.el = el.querySelector(`.honey-cell[data-r="${cell.r}"][data-c="${cell.c}"]`);
    renderHoneyCell(cell);
  });
  // Die echten Kacheln bekommen dieselbe Zelle als eigenes SVG, damit alles gleich aussieht
  document.querySelectorAll('.overview-card').forEach((card, i) => {
    if(card.querySelector('.ov-cell-svg')) return;
    const svg = `<svg class="ov-cell-svg" viewBox="0 0 ${honeyGeo.W} ${honeyGeo.H}" aria-hidden="true">${honeyCellMarkup(honeyGeo.W / 2, honeyGeo.H / 2, 100 + i * 7)}</svg>`;
    card.insertAdjacentHTML('afterbegin', svg);
  });
}
buildHoneycombBg();

const honeyIsOpen = (cell) => cell.type === 'empty' || cell.type === 'partial';
// Welche Wabe gerade von welcher Biene angeflogen/besetzt ist ("r,c" -> Biene), damit nie zwei auf derselben landen
const honeyReserved = new Map();
function releaseHoneyCell(bee){
  for(const [key, b] of honeyReserved) if(b === bee) honeyReserved.delete(key);
}
function reserveHoneyCell(bee, r, c){
  releaseHoneyCell(bee);
  honeyReserved.set(r + ',' + c, bee);
}
// Freie Wabe zum Landen: meistens eine, die man füllen kann, sonst irgendeine, die keine andere Biene besetzt
function pickHoneyLandingCell(){
  const fillable = honeyCells.filter(h => honeyIsOpen(h) && !h.draining && !honeyReserved.has(h.r + ',' + h.c));
  if(fillable.length && Math.random() < 0.75) return fillable[Math.floor(Math.random() * fillable.length)];
  const free = [];
  for(let r = 0; r < honeyGeo.rows; r++)
    for(let c = 0; c < honeyGeo.cols; c++)
      if(!honeyReserved.has(r + ',' + c)) free.push({ r, c });
  return free.length ? free[Math.floor(Math.random() * free.length)] : null;
}
// Füllstand einer Zelle sanft von from nach to bewegen
function animateHoneyFill(cell, to, dur, done){
  const from = cell.fill, start = performance.now();
  cell.animating = true;
  (function frame(now){
    const t = Math.min(1, (now - start) / dur);
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    cell.fill = from + (to - from) * e;
    renderHoneyCell(cell);
    if(t < 1){ requestAnimationFrame(frame); return; }
    cell.animating = false;
    if(done) done();
  })(start);
}
// Eine Biene hat Nektar gebracht: Füllstand steigt. Ist die Zelle voll, bleibt sie kurz so und läuft dann wieder leer.
function beeFillsHoneyCell(r, c){
  const cell = honeyCells.find(h => h.r === r && h.c === c);
  if(!cell || !honeyIsOpen(cell) || cell.animating || cell.draining) return;
  cell.type = 'partial';
  animateHoneyFill(cell, Math.min(1, cell.fill + 0.18 + Math.random() * 0.12), 1400, () => {
    if(cell.fill < 0.999) return;
    cell.fill = 1;
    cell.draining = true;
    setTimeout(() => {
      animateHoneyFill(cell, 0, 2600, () => {
        cell.fill = 0;
        cell.type = 'empty';
        cell.draining = false;
        renderHoneyCell(cell);
      });
    }, 3000);
  });
}

function setupHoneycombInteraction(){
  const wrap = document.querySelector('.overview-wrap');
  if(!wrap) return;
  const cards = Array.from(document.querySelectorAll('.overview-card'));
  // Start-Zelle jeder Karte aus ihrer aktuellen Position ableiten (row,col)
  cards.forEach(card => {
    const left = parseFloat(getComputedStyle(card).left);
    const top = parseFloat(getComputedStyle(card).top);
    const r = Math.round(top / honeyGeo.rowStep);
    const offsetX = (r % 2 === 0) ? 0 : honeyGeo.halfW;
    const c = Math.round((left - offsetX) / honeyGeo.W);
    card.dataset.row = r;
    card.dataset.col = c;
  });
  const falloff = 230, maxPush = 14;
  function pushOne(elCx, elCy, originCx, originCy){
    const dx = elCx - originCx, dy = elCy - originCy;
    const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
    // Je näher am Ursprung, desto stärker, aber nie ganz Null
    const strength = maxPush * (falloff / (falloff + dist));
    return { x: (dx / dist * strength).toFixed(1), y: (dy / dist * strength).toFixed(1) };
  }
  function pushCells(originCx, originCy, excludeCard){
    document.querySelectorAll('.honey-cell').forEach(cell => {
      const p = pushOne(parseFloat(cell.dataset.cx), parseFloat(cell.dataset.cy), originCx, originCy);
      cell.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });
    cards.forEach(c => {
      if(c === excludeCard) return;
      const box = honeyCellBox(+c.dataset.row, +c.dataset.col);
      const p = pushOne(box.cx, box.cy, originCx, originCy);
      c.style.setProperty('--push-x', p.x + 'px');
      c.style.setProperty('--push-y', p.y + 'px');
    });
  }
  function resetCells(){
    document.querySelectorAll('.honey-cell').forEach(cell => { cell.style.transform = ''; });
    cards.forEach(c => { c.style.removeProperty('--push-x'); c.style.removeProperty('--push-y'); });
  }
  // Auch die rein dekorativen Wabenzellen reagieren auf Hover, nicht nur die 8 echten Kacheln – sie tauschen aber nicht den Platz
  const bgEl = document.getElementById('honeycomb-bg');
  if(bgEl){
    bgEl.addEventListener('mouseover', (e) => {
      const g = e.target.closest('.honey-cell');
      if(!g) return;
      const cx = parseFloat(g.dataset.cx), cy = parseFloat(g.dataset.cy);
      pushCells(cx, cy, null);
    });
  }
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const box = honeyCellBox(+card.dataset.row, +card.dataset.col);
      pushCells(box.cx, box.cy, card);
    });
  });
  wrap.addEventListener('mouseleave', resetCells);
}
setupHoneycombInteraction();

function setupMeadow(){
  const meadow = document.getElementById('meadow');
  if(!meadow) return;
  // Unregelmässige Grasnarbe statt einer glatten Kante oben
  const steps = 36;
  const points = [];
  for(let i = 0; i <= steps; i++){
    const xPct = (i / steps) * 100;
    const yJitter = Math.random() * 10;
    points.push(`${xPct.toFixed(1)}% ${yJitter.toFixed(1)}px`);
  }
  points.push('100% 100%', '0% 100%');
  meadow.style.clipPath = `polygon(${points.join(',')})`;
  const bladeTones = [
    ['#b7ea7a', '#5a9a3c'], ['#9fd968', '#3f7d2a'], ['#c8f08f', '#6fac47']
  ];
  const bladeCount = 55;
  for(let i = 0; i < bladeCount; i++){
    const blade = document.createElement('div');
    blade.className = 'grass-blade';
    const tone = bladeTones[Math.floor(Math.random() * bladeTones.length)];
    blade.style.left = (Math.random() * 100) + '%';
    blade.style.height = (6 + Math.random() * 11) + 'px';
    blade.style.transform = `rotate(${(Math.random() * 18 - 9).toFixed(1)}deg)`;
    blade.style.opacity = (0.65 + Math.random() * 0.35).toFixed(2);
    blade.style.setProperty('--blade-light', tone[0]);
    blade.style.setProperty('--blade-dark', tone[1]);
    meadow.appendChild(blade);
  }
  const cloverCount = 6;
  for(let i = 0; i < cloverCount; i++){
    const clover = document.createElement('div');
    clover.className = 'clover';
    clover.style.left = (Math.random() * 96) + '%';
    clover.style.transform = `scale(${(0.8 + Math.random() * 0.4).toFixed(2)})`;
    clover.innerHTML = `
      <div class="clover-leaf" style="transform:rotate(0deg)"></div>
      <div class="clover-leaf" style="transform:rotate(120deg)"></div>
      <div class="clover-leaf" style="transform:rotate(240deg)"></div>`;
    meadow.appendChild(clover);
  }
  // Blütenfarben als heller/dunkler-Paar für echte Farbverläufe statt Flächenfarbe
  const palette = [
    ['#ffd9ec', '#e8639f'], ['#ffffff', '#cfd6e0'], ['#ecd9ff', '#9c6fd1'],
    ['#ffe6b3', '#e8933f'], ['#ffc2ba', '#e2695a'], ['#cdeaff', '#5d9fd1']
  ];
  const flowerCount = 12;
  for(let i = 0; i < flowerCount; i++){
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.style.left = (4 + Math.random() * 92) + '%';
    const scale = (0.8 + Math.random() * 0.5).toFixed(2);
    const duration = (2.4 + Math.random() * 1.6).toFixed(2);
    const delay = (Math.random() * 2).toFixed(2);
    const [light, dark] = palette[Math.floor(Math.random() * palette.length)];
    const petalCount = Math.random() < 0.5 ? 5 : 6;
    const step = 360 / petalCount;
    let petalsHtml = '';
    for(let p = 0; p < petalCount; p++){
      petalsHtml += `<div class="petal" style="transform:rotate(${(p * step + Math.random() * 10 - 5).toFixed(1)}deg)"></div>`;
    }
    flower.innerHTML = `<div class="flower-inner" style="transform:scale(${scale}); animation: flower-sway ${duration}s ease-in-out ${delay}s infinite; --petal-light:${light}; --petal-dark:${dark};">
      <div class="flower-leaf"></div>
      <div class="flower-stem"></div>
      ${petalsHtml}
      <div class="flower-center"></div>
    </div>`;
    meadow.appendChild(flower);
  }
  // 1-2 Blumen haben etwas Honig von Bienenbesuchen abbekommen
  const allFlowers = Array.from(meadow.querySelectorAll('.flower'));
  const honeyCount = 1 + Math.floor(Math.random() * 2);
  const shuffled = allFlowers.sort(() => Math.random() - 0.5).slice(0, honeyCount);
  shuffled.forEach(flower => {
    const inner = flower.querySelector('.flower-inner');
    if(!inner) return;
    const drop = document.createElement('div');
    drop.className = 'flower-honey';
    inner.appendChild(drop);
  });
}
setupMeadow();

function setupNest(){
  const bowl = document.querySelector('.nest-bowl');
  if(!bowl) return;
  const tones = [
    ['#c08a4a', '#7a4f26'], ['#a9763f', '#6b4423'], ['#8a5a30', '#5c3a1d'], ['#7a5128', '#4a2f16'],
    ['#d9c070', '#a68838'], ['#e2d28c', '#b5a052']
  ];
  const cx = 90, cy = 58, rx = 86, ry = 52;
  const ringCount = 50;
  for(let i = 0; i < ringCount; i++){
    const angle = Math.random() * Math.PI * 2;
    const spread = 0.72 + Math.random() * 0.3;
    const x = cx + Math.cos(angle) * rx * spread;
    const y = cy + Math.sin(angle) * ry * spread;
    const tangentDeg = angle * 180 / Math.PI + 90 + (Math.random() * 36 - 18);
    const [light, dark] = tones[Math.floor(Math.random() * tones.length)];
    const twig = document.createElement('div');
    twig.className = 'nest-twig';
    twig.style.left = x.toFixed(1) + 'px';
    twig.style.top = y.toFixed(1) + 'px';
    twig.style.width = (16 + Math.random() * 24) + 'px';
    twig.style.setProperty('--twig-light', light);
    twig.style.setProperty('--twig-dark', dark);
    twig.style.transform = `translate(-50%, -50%) rotate(${tangentDeg.toFixed(1)}deg)`;
    bowl.appendChild(twig);
  }
  // Ein paar Zweige kreuz und quer über den Rand, für den "zusammengetragenen" Look
  for(let i = 0; i < 14; i++){
    const twig = document.createElement('div');
    twig.className = 'nest-twig';
    const [light, dark] = tones[Math.floor(Math.random() * tones.length)];
    twig.style.left = (cx + (Math.random() * 2 - 1) * rx * 0.6).toFixed(1) + 'px';
    twig.style.top = (cy + (Math.random() * 2 - 1) * ry * 0.5).toFixed(1) + 'px';
    twig.style.width = (14 + Math.random() * 20) + 'px';
    twig.style.setProperty('--twig-light', light);
    twig.style.setProperty('--twig-dark', dark);
    twig.style.transform = `translate(-50%, -50%) rotate(${(Math.random() * 360).toFixed(1)}deg)`;
    bowl.appendChild(twig);
  }
  // Ein paar lose Zweige, die über den Rand hinausragen – für den unordentlichen, echten Look
  for(let i = 0; i < 8; i++){
    const angle = Math.random() * Math.PI * 2;
    const x = cx + Math.cos(angle) * rx * 1.02;
    const y = cy + Math.sin(angle) * ry * 1.02;
    const tangentDeg = angle * 180 / Math.PI + (Math.random() * 40 - 20);
    const [light, dark] = tones[Math.floor(Math.random() * tones.length)];
    const twig = document.createElement('div');
    twig.className = 'nest-twig';
    twig.style.left = x.toFixed(1) + 'px';
    twig.style.top = y.toFixed(1) + 'px';
    twig.style.width = (22 + Math.random() * 20) + 'px';
    twig.style.setProperty('--twig-light', light);
    twig.style.setProperty('--twig-dark', dark);
    twig.style.transform = `translate(-85%, -50%) rotate(${tangentDeg.toFixed(1)}deg)`;
    bowl.appendChild(twig);
  }
  // Ein paar flauschige Daunenfedern, die im Geflecht hängen geblieben sind
  for(let i = 0; i < 5; i++){
    const angle = Math.random() * Math.PI * 2;
    const spread = 0.65 + Math.random() * 0.35;
    const wisp = document.createElement('div');
    wisp.className = 'nest-wisp';
    wisp.style.left = (cx + Math.cos(angle) * rx * spread).toFixed(1) + 'px';
    wisp.style.top = (cy + Math.sin(angle) * ry * spread).toFixed(1) + 'px';
    wisp.style.transform = `translate(-50%, -50%) rotate(${(Math.random() * 360).toFixed(1)}deg)`;
    bowl.appendChild(wisp);
  }
}
setupNest();

let beeEls = [];
const baseBeeCount = 5, lightModeBeeCount = 11;

// Landepunkt einer Wabe in Bildschirm-Koordinaten (ohne r/c: eine zufällige freie Wabe)
function honeyCellViewportPoint(r, c){
  const wrap = document.querySelector('.overview-wrap');
  if(!wrap) return null;
  if(r == null){
    const free = pickHoneyLandingCell();
    r = free ? free.r : Math.floor(Math.random() * honeyGeo.rows);
    c = free ? free.c : Math.floor(Math.random() * honeyGeo.cols);
  }
  const rect = wrap.getBoundingClientRect();
  const box = honeyCellBox(r, c);
  return {
    x: rect.left + box.cx * (rect.width / 950),
    y: rect.top + (box.cy - honeyGeo.H * 0.3) * (rect.height / 546),
    r, c
  };
}
// Welche Wabe liegt unter dem Punkt (nächste, oder null ausserhalb der Wabe)?
function honeyCellAt(px, py){
  const wrap = document.querySelector('.overview-wrap');
  if(!wrap) return null;
  const rect = wrap.getBoundingClientRect();
  const sx = rect.width / 950, sy = rect.height / 546;
  let best = null, bestD = honeyGeo.H * 0.55;
  for(let r = 0; r < honeyGeo.rows; r++)
    for(let c = 0; c < honeyGeo.cols; c++){
      const box = honeyCellBox(r, c);
      const d = Math.hypot((px - (rect.left + box.cx * sx)) / sx, (py - (rect.top + box.cy * sy)) / sy);
      if(d < bestD){ bestD = d; best = { r, c }; }
    }
  return best;
}
// Liegt der Punkt auf einer Wabe, die schon eine andere Biene besetzt?
function nearOccupiedHoneyCell(px, py, bee){
  const wrap = document.querySelector('.overview-wrap');
  if(!wrap) return false;
  const rect = wrap.getBoundingClientRect();
  const sx = rect.width / 950, sy = rect.height / 546;
  for(const [key, b] of honeyReserved){
    if(b === bee) continue;
    const [r, c] = key.split(',').map(Number);
    const box = honeyCellBox(r, c);
    const dx = (px - (rect.left + box.cx * sx)) / sx, dy = (py - (rect.top + box.cy * sy)) / sy;
    if(Math.hypot(dx, dy) < honeyGeo.H * 0.55) return true;
  }
  return false;
}

function createBee(isQueen, fromCell){
  const layer = document.getElementById('bee-layer');
  const wrap = document.querySelector('.overview-wrap');
  if(!layer || !wrap) return null;
  const bee = document.createElement('div');
  bee.className = 'bee' + (isQueen ? ' queen' : '') + (fromCell ? ' emerge' : '');
  bee.innerHTML = `
    <div class="bee-body">
      <div class="bee-wing bee-wing-l"></div>
      <div class="bee-wing bee-wing-r"></div>
      <div class="bee-stripes"></div>
      <div class="bee-head"></div>
    </div>`;
  layer.appendChild(bee);
  beeEls.push(bee);
  const start = fromCell ? honeyCellViewportPoint() : null;
  if(start) reserveHoneyCell(bee, start.r, start.c);
  let x = start ? start.x : 40 + Math.random() * (window.innerWidth - 80);
  let y = start ? start.y : 40 + Math.random() * (window.innerHeight - 80);
  bee.style.left = x + 'px';
  bee.style.top = y + 'px';

  function moveTo(nx, ny, duration, easing){
    // Blickrichtung: spiegeln statt auf dem Kopf zu fliegen, leichte Neigung je nach Flugwinkel
    const dx = nx - x, dy = ny - y;
    let angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
    let facing = 1;
    if(angleDeg > 90 || angleDeg < -90){
      facing = -1;
      angleDeg = angleDeg > 0 ? angleDeg - 180 : angleDeg + 180;
    }
    const tilt = Math.max(-26, Math.min(26, angleDeg));
    bee.style.setProperty('--bee-facing', facing);
    bee.style.setProperty('--bee-tilt', tilt.toFixed(1) + 'deg');
    bee.style.transitionDuration = duration + 'ms';
    // In der Luft gleichmässig weiterfliegen, nur beim Landen abbremsen
    bee.style.transitionTimingFunction = easing || 'linear';
    bee.style.left = nx + 'px';
    bee.style.top = ny + 'px';
    x = nx; y = ny;
  }

  let pendingTimer = null;

  // Bienen fliegen über die ganze Seite, halten aber nur auf einer Wabe wirklich an –
  // und landen etwas oberhalb der Zellenmitte, damit sie nicht auf der Beschriftung sitzen
  function step(){
    if(!bee.isConnected || bee.dataset.retiring) return;
    bee.classList.remove('landed');
    releaseHoneyCell(bee);
    const target = Math.random() < 0.8 ? pickHoneyLandingCell() : null;
    const landOnCell = !!target;
    let nx, ny;
    if(landOnCell){
      const rect = wrap.getBoundingClientRect();
      reserveHoneyCell(bee, target.r, target.c);
      const box = honeyCellBox(target.r, target.c);
      const landY = box.cy - honeyGeo.H * 0.3;
      nx = rect.left + box.cx * (rect.width / 950);
      ny = rect.top + landY * (rect.height / 546);
    } else {
      // Freier Flug: kein Ziel auf einer Wabe, an der schon eine andere Biene sitzt
      for(let tries = 0; tries < 20; tries++){
        nx = 30 + Math.random() * (window.innerWidth - 60);
        ny = 25 + Math.random() * (window.innerHeight - 50);
        if(!nearOccupiedHoneyCell(nx, ny, bee)) break;
      }
      // Endet der Flug über einer Wabe, ist diese Wabe für andere Bienen tabu, bis die Biene weiterfliegt
      const over = honeyCellAt(nx, ny);
      if(over && !honeyReserved.has(over.r + ',' + over.c)) reserveHoneyCell(bee, over.r, over.c);
    }
    const duration = 900 + Math.hypot(nx - x, ny - y) * 3.8;
    moveTo(nx, ny, duration, landOnCell ? 'ease-out' : 'linear');
    if(landOnCell){
      pendingTimer = setTimeout(() => {
        bee.classList.add('landed');
        // Landet sie auf einer Wabe, die man füllen kann, füllt sie sie gleich weiter auf
        const here = honeyCells.find(h => h.r === target.r && h.c === target.c);
        if(here && honeyIsOpen(here)) setTimeout(() => { if(bee.isConnected) beeFillsHoneyCell(here.r, here.c); }, 500);
        pendingTimer = setTimeout(step, 900 + Math.random() * 1300);
      }, duration);
    } else {
      // kein Zwischenstopp in der Luft, gleich weiterfliegen
      pendingTimer = setTimeout(step, duration);
    }
  }
  // Wird alle ~1 Minute aufgerufen, damit die Biene gezielt auf einer Blume landet
  bee.landOnFlower = function(tx, ty){
    if(!bee.isConnected || bee.dataset.mission) return;
    clearTimeout(pendingTimer);
    releaseHoneyCell(bee);
    bee.classList.remove('landed');
    const duration = 900 + Math.hypot(tx - x, ty - y) * 3.8;
    moveTo(tx, ty, duration, 'ease-out');
    pendingTimer = setTimeout(() => {
      bee.classList.add('landed');
      pendingTimer = setTimeout(step, 2200 + Math.random() * 1800);
    }, duration);
  };
  // Auftrag: gezielt zu einer Wabe fliegen und sie mit Nektar auffüllen
  // Auftrag: erst Nektar an einer Blume holen, dann zur Wabe fliegen und sie auffüllen
  bee.goFillCell = function(cell){
    if(!bee.isConnected) return;
    clearTimeout(pendingTimer);
    bee.classList.remove('landed');
    bee.dataset.mission = '1';
    // Die Wabe ist ab jetzt für diese Biene reserviert, auch während sie bei der Blume ist
    reserveHoneyCell(bee, cell.r, cell.c);
    const flyToCell = () => {
      if(!bee.isConnected){ return; }
      bee.classList.remove('landed');
      const rect = wrap.getBoundingClientRect();
      const box = honeyCellBox(cell.r, cell.c);
      const tx = rect.left + box.cx * (rect.width / 950);
      const ty = rect.top + (box.cy - honeyGeo.H * 0.3) * (rect.height / 546);
      const duration = 900 + Math.hypot(tx - x, ty - y) * 3.8;
      moveTo(tx, ty, duration, 'ease-out');
      pendingTimer = setTimeout(() => {
        bee.classList.add('landed');
        pendingTimer = setTimeout(() => {
          beeFillsHoneyCell(cell.r, cell.c);
          pendingTimer = setTimeout(() => { delete bee.dataset.mission; step(); }, 800);
        }, 600);
      }, duration);
    };
    const flowers = Array.from(document.querySelectorAll('#meadow .flower'));
    if(!flowers.length){ flyToCell(); return; }
    const fr = flowers[Math.floor(Math.random() * flowers.length)].getBoundingClientRect();
    const fx = fr.left + fr.width / 2, fy = fr.top + fr.height * 0.35;
    const duration = 900 + Math.hypot(fx - x, fy - y) * 3.8;
    moveTo(fx, fy, duration, 'ease-out');
    pendingTimer = setTimeout(() => {
      bee.classList.add('landed');
      pendingTimer = setTimeout(flyToCell, 1500 + Math.random() * 800);
    }, duration);
  };
  pendingTimer = setTimeout(step, 300 + Math.random() * 900);
  return bee;
}

// Alle 30 Sekunden fliegt genau eine Biene los und füllt eine offene Wabe, die keine andere Biene besetzt
setInterval(() => {
  const open = honeyCells.filter(c => honeyIsOpen(c) && !c.draining && !c.animating && !honeyReserved.has(c.r + ',' + c.c));
  const workers = beeEls.filter(b => b.isConnected && !b.dataset.retiring && !b.dataset.mission && b.goFillCell);
  if(!open.length || !workers.length) return;
  const cell = open[Math.floor(Math.random() * open.length)];
  workers[Math.floor(Math.random() * workers.length)].goFillCell(cell);
}, 30000);

function setupBees(){
  for(let i = 0; i < baseBeeCount; i++) createBee(i === 0);
}
setupBees();

// Falls die Bienen-Ebene neu gerendert wurde (z.B. Hot Reload), verlorene Bienen wieder ersetzen
setInterval(() => {
  if(!document.getElementById('bee-layer')) return;
  const alive = beeEls.filter(b => b.isConnected);
  if(alive.length === beeEls.length) return;
  for(const [key, b] of honeyReserved) if(!b.isConnected) honeyReserved.delete(key);
  const hadQueen = alive.some(b => b.classList.contains('queen'));
  beeEls = alive;
  if(!hadQueen && beeEls.length < beeTarget) createBee(true);
  setBeeCount(beeTarget);
}, 2000);

// Hellmodus: Bienen kommen aus den Waben. Dunkelmodus: sie fliegen zurück in eine Wabe und verschwinden
function retireBee(bee){
  bee.dataset.retiring = '1';
  releaseHoneyCell(bee);
  const p = honeyCellViewportPoint();
  if(p) reserveHoneyCell(bee, p.r, p.c);
  if(p){
    bee.classList.add('retire');
    bee.style.transitionDuration = '1300ms';
    bee.style.left = p.x + 'px';
    bee.style.top = p.y + 'px';
  }
  setTimeout(() => { releaseHoneyCell(bee); bee.remove(); }, 1400);
}

let beeTarget = baseBeeCount;
function setBeeCount(target){
  beeTarget = target;
  while(beeEls.length < target) createBee(false, true);
  while(beeEls.length > target){
    retireBee(beeEls.pop());
  }
}

// Alle 60 Sekunden landen 1-2 Bienen gezielt auf einer der Blumen in der Wiese
setInterval(() => {
  const flowers = Array.from(document.querySelectorAll('#meadow .flower'));
  if(!flowers.length || !beeEls.length) return;
  const visitCount = Math.min(1 + Math.floor(Math.random() * 2), beeEls.length);
  const chosenBees = beeEls.slice().sort(() => Math.random() - 0.5).slice(0, visitCount);
  chosenBees.forEach(bee => {
    const flower = flowers[Math.floor(Math.random() * flowers.length)];
    const rect = flower.getBoundingClientRect();
    if(bee.landOnFlower) bee.landOnFlower(rect.left + rect.width / 2, rect.top + rect.height * 0.35);
  });
}, 60000);

const boardTime = document.getElementById('board-time');
const citySelect = document.getElementById('city-select');
const wxDetail = document.getElementById('wx-detail');
let activeCity = cities.find(c => c.name === "Aarau") || cities[0];

function buildAnalogClockFace(){
  let ticks = '';
  for(let i = 0; i < 60; i++){
    const angle = i * 6;
    const isHour = i % 5 === 0;
    const rOuter = 88, rInner = isHour ? 64 : 78;
    const rad = (angle - 90) * Math.PI / 180;
    const x1 = (100 + rInner * Math.cos(rad)).toFixed(2);
    const y1 = (100 + rInner * Math.sin(rad)).toFixed(2);
    const x2 = (100 + rOuter * Math.cos(rad)).toFixed(2);
    const y2 = (100 + rOuter * Math.sin(rad)).toFixed(2);
    ticks += `<line class="clock-tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${isHour ? 8 : 3}" stroke-linecap="square"/>`;
  }
  return `
    <svg viewBox="0 0 200 200">
      <circle class="clock-face" cx="100" cy="100" r="97"/>
      ${ticks}
      <line class="hand-hour" x1="100" y1="100" x2="100" y2="48" stroke-width="13" stroke-linecap="square"/>
      <line class="hand-min" x1="100" y1="100" x2="100" y2="26" stroke-width="10" stroke-linecap="square"/>
      <line class="hand-sec" x1="100" y1="120" x2="100" y2="22" stroke-width="4" stroke-linecap="round"/>
      <circle class="clock-hub" cx="100" cy="100" r="12" stroke-width="6"/>
    </svg>`;
}

function buildTimeCard(city){
  const card = document.createElement('div');
  card.className = 'city-card';
  card.innerHTML = `
    <div class="accent-bar" style="background:${city.accent}"></div>
    <div class="analog-clock" data-clock="${city.tz}">${buildAnalogClockFace()}</div>
    <div class="time-info">
      <div class="row-top">
        <div class="city">${city.name}</div>
        <div class="region">${city.region}</div>
      </div>
      <div class="flap-row" data-time="${city.tz}"></div>
      <div class="date-line" data-date="${city.tz}"></div>
    </div>
  `;
  boardTime.appendChild(card);
}

function buildCitySelect(){
  cities.filter(c => c.name !== "Zürich").forEach(city => {
    const chip = document.createElement('button');
    chip.className = 'city-chip' + (city === activeCity ? ' active' : '');
    chip.textContent = city.name;
    chip.addEventListener('click', () => {
      activeCity = city;
      document.querySelectorAll('.city-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      loadFullWeather(city);
    });
    citySelect.appendChild(chip);
  });
}

const dayNames = ['So','Mo','Di','Mi','Do','Fr','Sa'];

function wxTheme(code, tz){
  const hour = Number(new Date().toLocaleTimeString('en-GB', { hour:'2-digit', hour12:false, timeZone: tz }).slice(0,2));
  const night = hour < 6 || hour >= 20;
  if(code >= 95) return 'storm';
  if(code >= 71 && code <= 86) return 'snow';
  if(code >= 51) return 'rain';
  if(code === 45 || code === 48) return 'fog';
  if(night) return code >= 2 ? 'nightcloud' : 'night';
  if(code >= 2) return 'cloudy';
  return 'sunny';
}

async function loadFullWeather(city){
  wxDetail.innerHTML = `<div class="wx-loading">Wetter wird geladen …</div>`;
  try{
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
      `&current_weather=true` +
      `&hourly=temperature_2m,weathercode` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    renderWeatherDetail(city, data);
  } catch(err){
    wxDetail.innerHTML = `<div class="wx-loading">Wetter nicht verfügbar</div>`;
  }
}

function renderWeatherDetail(city, data){
  const cw = data.current_weather;
  const [nowIcon, nowDesc] = wxMap[cw.weathercode] || ["🌡️","Unbekannt"];

  // stündliche Werte nach Datum gruppieren (YYYY-MM-DD -> Einträge)
  const hoursByDate = {};
  data.hourly.time.forEach((t, i) => {
    const date = t.substring(0,10);
    if(!hoursByDate[date]) hoursByDate[date] = [];
    hoursByDate[date].push({
      time: t.substring(11,16),
      temp: data.hourly.temperature_2m[i],
      code: data.hourly.weathercode[i]
    });
  });

  const dayBlocks = data.daily.time.map((dateStr, i) => {
    const d = new Date(dateStr + 'T12:00:00');
    const label = i === 0 ? 'Heute' : dayNames[d.getDay()] + ', ' + dateStr.substring(8,10) + '.' + dateStr.substring(5,7) + '.';
    const [icon, desc] = wxMap[data.daily.weathercode[i]] || ["🌡️","Unbekannt"];

    const hours = hoursByDate[dateStr] || [];
    const hourCards = hours.map((h, hi) => {
      const [hIcon] = wxMap[h.code] || ["🌡️"];
      return `
        <div class="hour-card${h.code <= 1 ? ' hour-sun' : h.code === 45 || h.code === 48 ? ' hour-fog' : (h.code >= 51 && h.code <= 67) || (h.code >= 80 && h.code <= 82) || h.code >= 95 ? ' hour-rain' : h.code === 2 || h.code === 3 ? ' hour-cloud' : ''}" style="--i:${hi}">
          <div class="h-time">${h.time}</div>
          <div class="h-icon">${hIcon}</div>
          <div class="h-temp">${Math.round(h.temp)}°</div>
        </div>`;
    }).join('');

    return `
      <div class="day-block${i === 0 ? ' open' : ''}" style="--d:${i}">
        <div class="day-item" data-day-toggle>
          <div class="d-name">${label}</div>
          <div class="d-icon">${icon}</div>
          <div class="d-desc">${desc}</div>
          <div class="d-range"><span class="max">${Math.round(data.daily.temperature_2m_max[i])}°</span> / <span class="min">${Math.round(data.daily.temperature_2m_min[i])}°</span></div>
          <div class="d-chevron">▾</div>
        </div>
        <div class="day-hours">${hourCards}</div>
      </div>`;
  }).join('');

  const localNow = new Date();
  const localTime = localNow.toLocaleTimeString('de-CH', { hour:'2-digit', minute:'2-digit', timeZone: city.tz });
  const localDate = localNow.toLocaleDateString('de-CH', { day:'2-digit', month:'2-digit', year:'numeric', timeZone: city.tz });
  wxDetail.innerHTML = `
    <div class="wx-now wx-theme-${wxTheme(cw.weathercode, city.tz)}">
      <span class="wx-fx" aria-hidden="true"></span>
      <div class="wx-now-top">
        <span class="wx-now-desc">${nowIcon} ${nowDesc}</span>
        <span class="wx-now-time">${localTime}</span>
      </div>
      <div class="wx-now-temp">${Math.round(cw.temperature)}°</div>
      <div class="wx-now-bottom">
        <span class="wx-now-city">${city.name}</span>
        <span class="wx-now-date">${localDate}</span>
      </div>
    </div>

    <div class="day-list">${dayBlocks}</div>
  `;

  wxDetail.querySelectorAll('[data-day-toggle]').forEach(item => {
    item.addEventListener('click', () => {
      item.closest('.day-block').classList.toggle('open');
    });
  });
}

// Spiele: direkt zum gewählten Spiel springen
document.querySelectorAll('#game-jump-row .city-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if(target) target.scrollIntoView({ behavior:'smooth', block:'start' });
  });
});

// Spiele: jedes Brett einzeln per Ziehen am Eckgriff vergrössern/verkleinern
const gameResizeInstances = [];

function makeGameResizable(targetEl, storageKey){
  const wrap = targetEl.closest('.game-resize-wrap');
  if(!wrap) return;
  const handle = wrap.querySelector('.game-resize-handle');
  if(!handle) return;

  let zoomVal = 1;
  try{
    const saved = Number(localStorage.getItem(storageKey));
    if(saved && saved >= 0.5 && saved <= 2.5) zoomVal = saved;
  } catch(err){}
  targetEl.style.zoom = zoomVal;

  let startX, startY, startZoom;

  function onMove(e){
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const delta = (dx + dy) / 2;
    let z = startZoom + delta / 220;
    z = Math.max(0.5, Math.min(2.5, Math.round(z * 100) / 100));
    targetEl.style.zoom = z;
    zoomVal = z;
  }
  function onUp(){
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    wrap.classList.remove('resizing');
    try{ localStorage.setItem(storageKey, String(zoomVal)); } catch(err){}
  }
  handle.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    startX = e.clientX; startY = e.clientY; startZoom = zoomVal;
    wrap.classList.add('resizing');
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  });

  gameResizeInstances.push({
    reset(){
      zoomVal = 1;
      targetEl.style.zoom = 1;
      try{ localStorage.removeItem(storageKey); } catch(err){}
    }
  });
}

[
  ['sudoku-grid', 'wz_sudoku'],
  ['crossword-grid', 'wz_crossword'],
  ['wotd-grid', 'wz_wotd'],
  ['ttt-grid', 'wz_ttt'],
  ['c4-board', 'wz_c4'],
  ['hm-figure', 'wz_hangman'],
  ['chess-board', 'wz_chess'],
  ['mill-board', 'wz_mill'],
].forEach(([id, key]) => {
  const el = document.getElementById(id);
  if(el) makeGameResizable(el, key);
});
document.querySelectorAll('.bs-boards, .ms-wrap, .snake-wrap').forEach(el => {
  const keyMap = { 'bs-boards': 'wz_battleship', 'ms-wrap': 'wz_minesweeper', 'snake-wrap': 'wz_snake' };
  const key = keyMap[el.className] || ('wz_' + el.className);
  makeGameResizable(el, key);
});

document.getElementById('games-reset-all-btn').addEventListener('click', () => {
  gameResizeInstances.forEach(inst => inst.reset());
});

// Tab-Umschaltung
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.view).classList.add('active');
  });
});

// Tastenkürzel 1–9 zum schnellen Tab-Wechsel
document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if(tag === 'INPUT' || tag === 'TEXTAREA') return; // nicht stören, wenn gerade getippt wird

  if(/^[1-9]$/.test(e.key)){
    const allTabs = document.querySelectorAll('.tab-btn');
    const idx = parseInt(e.key, 10) - 1;
    if(allTabs[idx]){
      allTabs[idx].click();
    }
  }
});

// Übersicht/Register: Karten springen zum jeweiligen Tab
document.querySelectorAll('.overview-card').forEach(card => {
  card.addEventListener('click', () => {
    const target = card.dataset.jump;
    const targetBtn = document.querySelector(`.tab-btn[data-view="${target}"]`);
    if(targetBtn) targetBtn.click();
  });
});

function renderFlaps(container, timeStr){
  container.innerHTML = '';
  for(const ch of timeStr){
    const el = document.createElement('div');
    if(ch === ':'){
      el.className = 'flap sep';
      el.textContent = ':';
    } else {
      el.className = 'flap';
      el.textContent = ch;
    }
    container.appendChild(el);
  }
}

// Hell/Dunkel-Umschalter
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Mond-Icon von animate-ui (Moon, Animation "default"), ohne React nachgebaut
const moonIconSvg = `<svg class="moon-icon theme-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;
// Sonnen-Icon von animate-ui (SunMedium, Animation "default"): Strahlen zeichnen sich nacheinander
const sunRays = [[12, 4, 12, 3], [17.7, 6.3, 18.4, 5.6], [20, 12, 21, 12], [17.7, 17.7, 18.4, 18.4], [12, 20, 12, 21], [6.3, 17.7, 5.6, 18.4], [4, 12, 3, 12], [6.3, 6.3, 5.6, 5.6]];
const sunIconSvg = `<svg class="sun-icon theme-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/>${sunRays.map(([x1, y1, x2, y2], i) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="1" style="animation-delay:${(i * 0.15).toFixed(2)}s"/>`).join('')}</svg>`;
function playThemeIconAnimation(){
  const icon = themeToggleBtn.querySelector('.theme-icon');
  if(!icon) return;
  icon.classList.remove('animate');
  void icon.getBoundingClientRect(); // Neustart der Animation erzwingen
  icon.classList.add('animate');
}

function applyTheme(theme){
  const wasLight = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', theme);
  if(theme === 'light'){
    if(!themeToggleBtn.querySelector('.sun-icon')) themeToggleBtn.innerHTML = sunIconSvg;
    // Beim Umschalten in den Hellmodus zeichnen sich die Sonnenstrahlen
    if(!wasLight) playThemeIconAnimation();
  } else {
    if(!themeToggleBtn.querySelector('.moon-icon')) themeToggleBtn.innerHTML = moonIconSvg;
    // Beim Umschalten in den Dunkelmodus dreht sich der Mond einmal
    if(wasLight) playThemeIconAnimation();
  }
  try{ localStorage.setItem('weltuhr_theme', theme); } catch(err){}
  // Im Hellmodus schwärmen mehr Bienen aus
  if(typeof setBeeCount === 'function'){
    setBeeCount(theme === 'light' ? lightModeBeeCount : baseBeeCount);
  }
}

let savedTheme = 'dark';
try{
  savedTheme = localStorage.getItem('weltuhr_theme') || 'dark';
} catch(err){}
applyTheme(savedTheme);

themeToggleBtn.addEventListener('mouseenter', playThemeIconAnimation);
themeToggleBtn.addEventListener('animationend', (e) => {
  // Erst entfernen, wenn alle Teile fertig sind (bei der Sonne der letzte Strahl)
  const icon = e.target.closest('.theme-icon');
  if(icon && (!icon.classList.contains('sun-icon') || e.target === icon.querySelector('line:last-of-type'))) icon.classList.remove('animate');
});
themeToggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
  // Eigene Hintergrundfarbe verwerfen, damit das normale Theme wieder greift
  document.documentElement.style.removeProperty('--board');
  document.documentElement.style.removeProperty('--fg');
  try{ localStorage.removeItem('weltuhr_bg_color'); } catch(err){}
});

// Hintergrundfarbe (frei wählbar)
const accentColorInput = document.getElementById('accent-color-input');

function colorLuminance(hex){
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function applyBackgroundColor(color){
  document.documentElement.style.setProperty('--board', color);
  const isLight = colorLuminance(color) > 0.5;
  document.documentElement.style.setProperty('--fg', isLight ? '23,20,15' : '242,236,221');
  accentColorInput.value = color;
  try{ localStorage.setItem('weltuhr_bg_color', color); } catch(err){}
}

let savedBgColor = null;
try{
  savedBgColor = localStorage.getItem('weltuhr_bg_color');
} catch(err){}
if(savedBgColor) applyBackgroundColor(savedBgColor);

accentColorInput.addEventListener('input', () => {
  applyBackgroundColor(accentColorInput.value);
});

const greetingTitleEl = document.getElementById('greeting-title');

function updateGreeting(){
  const h = new Date().getHours();
  let greeting;
  if(h >= 5 && h < 12) greeting = 'Guten Morgen';
  else if(h >= 12 && h < 18) greeting = 'Guten Mittag';
  else greeting = 'Guten Abend';
  if(greetingTitleEl.textContent !== greeting) greetingTitleEl.textContent = greeting;
}

function updateClocks(){
  const now = new Date();
  updateGreeting();

  document.querySelectorAll('[data-time]').forEach(el => {
    const tz = el.getAttribute('data-time');
    const timeStr = new Intl.DateTimeFormat('de-CH', {
      timeZone: tz, hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
    }).format(now);
    renderFlaps(el, timeStr);
  });

  document.querySelectorAll('[data-date]').forEach(el => {
    const tz = el.getAttribute('data-date');
    el.textContent = new Intl.DateTimeFormat('de-CH', {
      timeZone: tz, weekday:'short', day:'2-digit', month:'short', year:'numeric'
    }).format(now);
  });

  document.querySelectorAll('[data-clock]').forEach(el => {
    const tz = el.getAttribute('data-clock');
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false
    }).formatToParts(now);
    const h = Number(parts.find(p => p.type === 'hour').value) % 12;
    const m = Number(parts.find(p => p.type === 'minute').value);
    const s = Number(parts.find(p => p.type === 'second').value);
    const hourHand = el.querySelector('.hand-hour');
    const minHand = el.querySelector('.hand-min');
    const secHand = el.querySelector('.hand-sec');
    if(hourHand) hourHand.setAttribute('transform', `rotate(${(h + m / 60) * 30} 100 100)`);
    if(minHand) minHand.setAttribute('transform', `rotate(${(m + s / 60) * 6} 100 100)`);
    if(secHand) secHand.setAttribute('transform', `rotate(${s * 6} 100 100)`);
  });
}

// (Wetter-Laden erfolgt jetzt über loadFullWeather pro ausgewählter Stadt)

// To-Do-Liste
const TODO_STORAGE_KEY = 'weltuhr_todos';

function loadTodos(){
  try{
    const raw = localStorage.getItem(TODO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(err){
    return [];
  }
}

function saveTodos(){
  try{
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  } catch(err){
    // Speicher evtl. eingeschränkt — bleibt dann nur für diese Sitzung erhalten
  }
}

let todos = loadTodos();
const todoInput = document.getElementById('todo-input');
const todoAddBtn = document.getElementById('todo-add-btn');
const todoListEl = document.getElementById('todo-list');

function renderTodos(){
  if(todos.length === 0){
    todoListEl.innerHTML = `<div class="todo-empty">Noch keine Aufgaben — trag oben etwas ein.</div>`;
    return;
  }
  todoListEl.innerHTML = todos.map((todo, i) => `
    <li class="todo-item${todo.done ? ' done' : ''}">
      <div class="todo-top">
        <input type="checkbox" data-idx="${i}" ${todo.done ? 'checked' : ''}>
        <button class="todo-del" data-idx="${i}">✕</button>
      </div>
      <span class="todo-text">${todo.text}</span>
    </li>
  `).join('');

  todoListEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      todos[cb.dataset.idx].done = cb.checked;
      saveTodos();
      renderTodos();
    });
  });
  todoListEl.querySelectorAll('.todo-del').forEach(btn => {
    btn.addEventListener('click', () => {
      todos.splice(btn.dataset.idx, 1);
      saveTodos();
      renderTodos();
    });
  });
}

function addTodo(){
  const val = todoInput.value.trim();
  if(!val) return;
  todos.push({ text: val, done: false });
  saveTodos();
  todoInput.value = '';
  renderTodos();
}

todoAddBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') addTodo();
});
renderTodos();

// Notizen (mit automatischen Aufzählungspunkten)
const NOTES_STORAGE_KEY = 'weltuhr_notizen';
const notesBox = document.getElementById('notes-box');
try{
  notesBox.value = localStorage.getItem(NOTES_STORAGE_KEY) || '';
} catch(err){
  // Speicher evtl. eingeschränkt
}
// Altlast aus einer früheren Version entfernen: einsamer Punkt ohne echten Inhalt
if(notesBox.value.trim() === '•'){
  notesBox.value = '';
}
function saveNotes(){
  try{
    localStorage.setItem(NOTES_STORAGE_KEY, notesBox.value);
  } catch(err){
    // Speicher evtl. eingeschränkt — bleibt dann nur für diese Sitzung erhalten
  }
}
saveNotes();

let notesHasBullet = notesBox.value.trim() !== '';

notesBox.addEventListener('input', () => {
  const value = notesBox.value;

  // Nur noch Punkte/Leerzeichen übrig (alles weggelöscht) -> ganz leeren
  if(value.replace(/[•\s]/g, '') === ''){
    notesBox.value = '';
    notesHasBullet = false;
    saveNotes();
    return;
  }

  if(!notesHasBullet){
    notesHasBullet = true;
    const cursorPos = notesBox.selectionStart;
    notesBox.value = '• ' + value;
    notesBox.selectionStart = notesBox.selectionEnd = cursorPos + 2;
    saveNotes();
    return;
  }

  // Leere Aufzählungszeile entfernen, wenn ihr Text weggelöscht wurde (bei mehrzeiligen Notizen)
  const cursorPos = notesBox.selectionStart;
  const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1;
  let lineEnd = value.indexOf('\n', cursorPos);
  if(lineEnd === -1) lineEnd = value.length;
  const line = value.slice(lineStart, lineEnd);
  if(/^•\s?$/.test(line)){
    const removeStart = lineStart > 0 ? lineStart - 1 : lineStart;
    notesBox.value = value.slice(0, removeStart) + value.slice(lineEnd);
    notesBox.selectionStart = notesBox.selectionEnd = removeStart;
  }

  saveNotes();
});

notesBox.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    e.preventDefault();
    const start = notesBox.selectionStart;
    const end = notesBox.selectionEnd;
    const insertion = '\n• ';
    notesBox.value = notesBox.value.slice(0, start) + insertion + notesBox.value.slice(end);
    const newPos = start + insertion.length;
    notesBox.selectionStart = notesBox.selectionEnd = newPos;
    saveNotes();
  }
});

// Kalender
const calMonthLabel = document.getElementById('cal-month-label');
const calGrid = document.getElementById('cal-grid');
const calSelectedLabel = document.getElementById('cal-selected-label');
const calEntryInput = document.getElementById('cal-entry-input');
const calEntryAddBtn = document.getElementById('cal-entry-add-btn');
const calEntryList = document.getElementById('cal-entry-list');

const monthNames = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const weekdayFull = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];

const today = new Date();
let calViewYear = today.getFullYear();
let calViewMonth = today.getMonth();
let calSelectedDate = fmtDate(today);
const calEvents = {}; // "YYYY-MM-DD" -> [strings]

function fmtDate(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// Leitern (hoch) und Seile (runter) für den angezeigten Monat – fest pro Monat, damit das Brett gleich bleibt
let calLinks = {}; // Tag -> Zieltag
let calGameKey = null;
let calDecoNames = [];
function buildCalLinks(n, seed){
  let x = seed;
  const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  const rows = Math.ceil(n / 7);
  // Tag an einer Brett-Position (Reihe von unten, Spalte von links)
  const dayAt = (row, col) => { const d = row * 7 + (row % 2 === 0 ? col : 6 - col) + 1; return d >= 1 && d <= n ? d : null; };
  const used = new Set([1, n]);
  const usedGap = new Set(); // "Lücke zwischen Reihe r und r+1 / Spalte" – so kreuzen sich Leitern und Seile nie
  const links = {};
  const tryAdd = (up) => {
    for(let tries = 0; tries < 300; tries++){
      const row = up ? Math.floor(rnd() * (rows - 1)) : 1 + Math.floor(rnd() * (rows - 1));
      const col = Math.floor(rnd() * 7);
      const from = dayAt(row, col);
      const span = up && rnd() < 0.3 && row + 2 < rows ? 2 : 1;
      const toCol = up ? col : Math.max(0, Math.min(6, col + (rnd() < 0.5 ? -1 : 1)));
      const to = dayAt(up ? row + span : row - 1, toCol);
      if(!from || !to || used.has(from) || used.has(to)) continue;
      const gaps = [];
      for(let g = Math.min(row, up ? row + span : row - 1); g < Math.max(row, up ? row + span : row - 1); g++){
        for(let c = Math.min(col, toCol); c <= Math.max(col, toCol); c++) gaps.push(g + '/' + c);
      }
      if(gaps.some(k => usedGap.has(k))) continue;
      gaps.forEach(k => usedGap.add(k));
      used.add(from); used.add(to);
      links[from] = to;
      return;
    }
  };
  for(let k = 0; k < 3; k++){ tryAdd(true); tryAdd(false); }
  return links;
}
// Passende Objekte auf dem Spielbrett zu den Figuren des Monats (kleine Bildchen, selbst gezeichnet)
const boardDecoIcons = {
  cheese: '<path d="M2 15 L16 6 L22 12 L22 19 L2 19 Z" fill="#f7c948" stroke="#b58a0f" stroke-width="0.8"/><path d="M2 15 L22 12" stroke="#b58a0f" stroke-width="0.8"/><circle cx="8" cy="16.5" r="1.4" fill="#d9a520"/><circle cx="15" cy="16" r="1.8" fill="#d9a520"/><circle cx="18" cy="10.8" r="1" fill="#d9a520"/>',
  yarn: '<circle cx="11" cy="12" r="8" fill="#e0609a" stroke="#a0306a" stroke-width="0.8"/><path d="M5 8 Q11 12 17 6 M4 13 Q11 17 18 9 M6 18 Q12 19 19 13 M9 4.5 Q7 12 11 20" fill="none" stroke="#a0306a" stroke-width="0.8"/><path d="M18 16 Q22 18 21 22" fill="none" stroke="#e0609a" stroke-width="1.2"/>',
  mousetrap: '<rect x="2" y="13" width="20" height="7" rx="1" fill="#c48a4a" stroke="#7a4a1c" stroke-width="0.8"/><path d="M5 13 Q5 6 12 6 Q19 6 19 13" fill="none" stroke="#9aa3ad" stroke-width="1.4"/><path d="M13 15 L18 15 L16 12 Z" fill="#f7c948"/>',
  hammer: '<rect x="10.5" y="10" width="3" height="12" rx="1" fill="#7a4a24"/><rect x="4" y="3" width="16" height="8" rx="1.5" fill="#9aa3ad" stroke="#4d545c" stroke-width="0.8"/><path d="M4 7 h16" stroke="#4d545c" stroke-width="0.5"/>',
  lightning: '<path d="M14 1 L4 13 L11 13 L9 23 L20 9 L13 9 Z" fill="#f6d43a" stroke="#b58a0f" stroke-width="0.8" stroke-linejoin="round"/>',
  hornhelmet: '<path d="M5 18 C5 10 19 10 19 18 Z" fill="#d4a933" stroke="#8a6a12" stroke-width="0.8"/><path d="M7 12 C4 8 3 4 4 1 C6 4 8 7 10 10 Z M17 12 C20 8 21 4 20 1 C18 4 16 7 14 10 Z" fill="#d4a933" stroke="#8a6a12" stroke-width="0.8"/><rect x="4" y="17" width="16" height="3" fill="#2e8a4c"/>',
  jellyfish: '<path d="M3 12 C3 4 21 4 21 12 Z" fill="#f2a5d6" stroke="#b0508a" stroke-width="0.8"/><circle cx="9" cy="8" r="1.2" fill="#d36ab0"/><circle cx="15" cy="9" r="1" fill="#d36ab0"/><path d="M6 12 q-1 4 1 9 M10 12 q1 4 -1 9 M14 12 q-1 4 1 9 M18 12 q1 4 -1 9" fill="none" stroke="#b0508a" stroke-width="1"/>',
  burger: '<path d="M3 11 C3 4 21 4 21 11 Z" fill="#e0a050" stroke="#9a6020" stroke-width="0.8"/><rect x="2.5" y="11" width="19" height="2.2" rx="1" fill="#5fb04a"/><rect x="3" y="13" width="18" height="3" rx="1" fill="#7a3a1a"/><rect x="2.5" y="15.6" width="19" height="1.6" fill="#f7c948"/><path d="M3 17.2 h18 v1.8 q0 2 -2 2 h-14 q-2 0 -2 -2 Z" fill="#e0a050" stroke="#9a6020" stroke-width="0.8"/><circle cx="9" cy="7" r="0.5" fill="#fff"/><circle cx="14" cy="6" r="0.5" fill="#fff"/>',
  pineapple: '<path d="M12 8 L9 1 L12 4 L15 1 Z M12 8 L6 3 M12 8 L18 3" stroke="#3fa64a" stroke-width="1.6" fill="#3fa64a" stroke-linecap="round"/><ellipse cx="12" cy="15" rx="6.5" ry="8" fill="#f2a91a" stroke="#a86a0a" stroke-width="0.8"/><path d="M7 11 L17 21 M6 16 L13 23 M9 8 L18 17 M17 11 L7 21 M18 16 L11 23 M15 8 L6 17" stroke="#a86a0a" stroke-width="0.5"/><rect x="10" y="13" width="2" height="3" fill="#7a3a1a"/>',
  fedora: '<ellipse cx="12" cy="17" rx="11" ry="3.5" fill="#8a5a2b" stroke="#5a3a18" stroke-width="0.8"/><path d="M5 17 C5 8 8 6 12 8 C16 6 19 8 19 17 Z" fill="#a8723a" stroke="#5a3a18" stroke-width="0.8"/><rect x="5" y="13.5" width="14" height="2.5" fill="#3a2410"/>',
  wrench: '<path d="M5 19 L14 10 A4.5 4.5 0 0 1 19.5 3.5 L17 6 L18 8 L20 9 L22.5 6.5 A4.5 4.5 0 0 1 16 12 L7 21 Z" fill="#9aa3ad" stroke="#4d545c" stroke-width="0.8" stroke-linejoin="round"/>',
  rocket: '<path d="M12 1 C17 5 17 13 15 18 L9 18 C7 13 7 5 12 1 Z" fill="#f4f4f4" stroke="#6b737b" stroke-width="0.8"/><circle cx="12" cy="9" r="2" fill="#5fb0ff" stroke="#2f5fae" stroke-width="0.6"/><path d="M9 13 L5 18 L9 18 Z M15 13 L19 18 L15 18 Z" fill="#e0262b"/><path d="M10 18 L12 23 L14 18 Z" fill="#f6a01a"/>',
  portal: '<ellipse cx="12" cy="12" rx="9" ry="11" fill="#7cf06a" stroke="#2f9a2a" stroke-width="1"/><ellipse cx="12" cy="12" rx="6" ry="8" fill="#b6ff9a"/><path d="M12 5 C17 7 17 15 12 16 C9 16 8 12 11 11 C13 10.5 14 12.5 12.5 13.5" fill="none" stroke="#2f9a2a" stroke-width="1"/>',
  portalgun: '<rect x="2" y="9" width="15" height="7" rx="2" fill="#e8e8e8" stroke="#6b737b" stroke-width="0.8"/><rect x="16" y="10.5" width="6" height="4" rx="1" fill="#7cf06a" stroke="#2f9a2a" stroke-width="0.6"/><rect x="5" y="15" width="4" height="7" rx="1" fill="#9aa3ad" stroke="#4d545c" stroke-width="0.6"/><circle cx="8" cy="12.5" r="2" fill="#7cf06a"/>',
  pickle: '<path d="M6 20 C2 16 8 6 14 3 C19 1 22 4 19 9 C16 14 10 22 6 20 Z" fill="#6aa83a" stroke="#3d6e1a" stroke-width="0.8"/><circle cx="10" cy="13" r="0.7" fill="#3d6e1a"/><circle cx="14" cy="8" r="0.7" fill="#3d6e1a"/><circle cx="12" cy="16" r="0.7" fill="#3d6e1a"/><path d="M14 8.5 a1 1 0 0 0 2 0 M10.5 10.5 a1 1 0 0 0 2 0" stroke="#1b1b1b" stroke-width="0.6" fill="none"/><path d="M11 13 q2 1.5 4 0" stroke="#1b1b1b" stroke-width="0.6" fill="none"/>',
  snowflake: '<g stroke="#5fc0f0" stroke-width="1.6" stroke-linecap="round"><path d="M12 2 V22 M3.3 7 L20.7 17 M3.3 17 L20.7 7"/><path d="M12 5 L9.5 3 M12 5 L14.5 3 M12 19 L9.5 21 M12 19 L14.5 21 M5.5 8.3 L5 5.2 M5.5 8.3 L2.6 9.3 M18.5 15.7 L19 18.8 M18.5 15.7 L21.4 14.7 M5.5 15.7 L2.6 14.7 M5.5 15.7 L5 18.8 M18.5 8.3 L21.4 9.3 M18.5 8.3 L19 5.2"/></g>',
  snowman: '<circle cx="12" cy="17" r="6" fill="#fff" stroke="#9ab" stroke-width="0.8"/><circle cx="12" cy="8" r="4.5" fill="#fff" stroke="#9ab" stroke-width="0.8"/><path d="M12 8.5 L17 9.5 L12 9.6 Z" fill="#f08a24"/><circle cx="10.5" cy="7" r="0.6" fill="#1b1b1b"/><circle cx="13.5" cy="7" r="0.6" fill="#1b1b1b"/><path d="M12 3.5 L11 0.5 M12 3.5 L13.5 1" stroke="#5a3a18" stroke-width="0.8"/><circle cx="12" cy="15" r="0.7" fill="#1b1b1b"/><circle cx="12" cy="18" r="0.7" fill="#1b1b1b"/>',
  crown: '<path d="M3 18 L2 7 L7.5 12 L12 4 L16.5 12 L22 7 L21 18 Z" fill="#f6c21a" stroke="#a87b0a" stroke-width="0.8" stroke-linejoin="round"/><rect x="3" y="18" width="18" height="3" fill="#e0a810" stroke="#a87b0a" stroke-width="0.6"/><circle cx="12" cy="14" r="1.5" fill="#5fb0ff"/><circle cx="7" cy="15.5" r="1" fill="#e0262b"/><circle cx="17" cy="15.5" r="1" fill="#e0262b"/>',
  trophy: '<path d="M6 3 H18 V9 C18 14 15 15 12 15 C9 15 6 14 6 9 Z" fill="#f6c21a" stroke="#a87b0a" stroke-width="0.8"/><path d="M6 5 H2.5 C2.5 10 5 10.5 6.5 10.5 M18 5 H21.5 C21.5 10 19 10.5 17.5 10.5" fill="none" stroke="#a87b0a" stroke-width="1.2"/><rect x="10.5" y="15" width="3" height="4" fill="#e0a810"/><rect x="7" y="19" width="10" height="3" rx="0.5" fill="#7a4a24"/>',
  cone: '<path d="M9 3 H15 L19 20 H5 Z" fill="#f08a24" stroke="#a8520a" stroke-width="0.8" stroke-linejoin="round"/><path d="M8 9 H16 M6.6 15 H17.4" stroke="#fff" stroke-width="2.2"/><rect x="3" y="20" width="18" height="2.5" rx="0.5" fill="#a8520a"/>',
  flag: '<rect x="3" y="2" width="1.8" height="21" fill="#4d545c"/><rect x="4.8" y="3" width="16" height="11" fill="#fff" stroke="#1b1b1b" stroke-width="0.6"/><path d="M4.8 3 h4 v3.7 h-4 Z M12.8 3 h4 v3.7 h-4 Z M8.8 6.7 h4 v3.6 h-4 Z M16.8 6.7 h4 v3.6 h-4 Z M4.8 10.3 h4 v3.7 h-4 Z M12.8 10.3 h4 v3.7 h-4 Z" fill="#1b1b1b"/>',
  banana: '<path d="M4 6 C3 15 9 21 19 19 C21 18.5 21 17 19.5 16.8 C12 17 7 13 6.5 6 Z" fill="#f7d84a" stroke="#b58a0f" stroke-width="0.8"/><path d="M4 6 L4.5 3.5 L6.8 4.5 L6.5 6 Z" fill="#7a5a24"/><path d="M8 9 C9 14 13 16.5 18 17" fill="none" stroke="#d9b42a" stroke-width="0.8"/>',
  goggles: '<rect x="1" y="10" width="22" height="3" fill="#2a2a2a"/><circle cx="8" cy="11.5" r="5.5" fill="#9aa3ad" stroke="#4d545c" stroke-width="1"/><circle cx="16" cy="11.5" r="5.5" fill="#9aa3ad" stroke="#4d545c" stroke-width="1"/><circle cx="8" cy="11.5" r="3.6" fill="#fff"/><circle cx="16" cy="11.5" r="3.6" fill="#fff"/><circle cx="8.6" cy="11.8" r="1.6" fill="#7a4a24"/><circle cx="15.4" cy="11.8" r="1.6" fill="#7a4a24"/>',
  dumpling: '<path d="M2 17 C2 9 22 9 22 17 C22 20 2 20 2 17 Z" fill="#f7efe0" stroke="#b5a68a" stroke-width="0.8"/><path d="M6 11.5 q1 3 0 5 M9.5 10.3 q1 3.5 0 6.5 M13 10 q1 3.5 0 7 M16.5 10.6 q1 3.5 0 6.2 M19.5 12 q0.6 2.5 0 4.5" fill="none" stroke="#b5a68a" stroke-width="0.7"/><path d="M3 7 q1 -2 0 -4 M8 6 q1 -2 0 -4" stroke="#c9d1d9" stroke-width="0.8" fill="none"/>',
  peach: '<path d="M12 6 C4 4 1 13 6 19 C9 22.5 15 22.5 18 19 C23 13 20 4 12 6 Z" fill="#ffab8a" stroke="#d9603a" stroke-width="0.8"/><path d="M12 6 C10 11 11 17 12 21" fill="none" stroke="#d9603a" stroke-width="0.7"/><path d="M12 6 C14 2 18 1.5 20 3 C18 5.5 15 6 12 6 Z" fill="#3fa64a"/>',
  scroll: '<rect x="5" y="4" width="14" height="16" fill="#f4e4b8" stroke="#a88a4a" stroke-width="0.8"/><rect x="3" y="2" width="18" height="3" rx="1.5" fill="#a8723a"/><rect x="3" y="19" width="18" height="3" rx="1.5" fill="#a8723a"/><path d="M8 8 h8 M8 11 h6 M8 14 h8" stroke="#5a3a18" stroke-width="0.9"/>',
  ramen: '<path d="M2 11 H22 C22 17 18 21 12 21 C6 21 2 17 2 11 Z" fill="#e0452a" stroke="#8a1f12" stroke-width="0.8"/><path d="M5 14 h14" stroke="#fff" stroke-width="1"/><ellipse cx="12" cy="11" rx="10" ry="2" fill="#f2d39a"/><circle cx="9" cy="10.6" r="1.6" fill="#fff"/><circle cx="9" cy="10.6" r="0.8" fill="#f6c21a"/><circle cx="14.5" cy="10.8" r="1.4" fill="#f2a1b1" stroke="#fff" stroke-width="0.4"/><path d="M16 2 L19 11 M19 2 L20.5 11" stroke="#a8723a" stroke-width="1" stroke-linecap="round"/>',
  kunai: '<path d="M12 1 L15 10 L12 13 L9 10 Z" fill="#9aa3ad" stroke="#4d545c" stroke-width="0.8" stroke-linejoin="round"/><rect x="11" y="13" width="2" height="6" fill="#3a3a44"/><circle cx="12" cy="21" r="2.2" fill="none" stroke="#4d545c" stroke-width="1.2"/>',
  shuriken: '<path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill="#9aa3ad" stroke="#4d545c" stroke-width="0.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="1.8" fill="#2a2a2a"/>',
  fishingrod: '<path d="M3 22 L19 3" stroke="#7a4a24" stroke-width="1.8" stroke-linecap="round"/><path d="M19 3 Q22 10 20 17" fill="none" stroke="#6b737b" stroke-width="0.6"/><circle cx="20" cy="18" r="1.4" fill="#e0262b"/><circle cx="7" cy="17.5" r="2" fill="#4d545c"/>',
  skateboard: '<rect x="1" y="11" width="22" height="3.2" rx="1.6" fill="#3a8fe0" stroke="#1f5fa8" stroke-width="0.8"/><circle cx="6" cy="17" r="2" fill="#f6c21a" stroke="#a87b0a" stroke-width="0.6"/><circle cx="18" cy="17" r="2" fill="#f6c21a" stroke="#a87b0a" stroke-width="0.6"/><path d="M5 14 L6 15 M19 14 L18 15" stroke="#4d545c" stroke-width="1"/>',
  bone: '<path d="M6 9 L18 9 A3 3 0 1 1 20 13 A3 3 0 1 1 18 15 L6 15 A3 3 0 1 1 4 11 A3 3 0 1 1 6 9 Z" fill="#c98a4a" stroke="#7a4a1c" stroke-width="0.8"/><path d="M9 11 h6 M9 13 h6" stroke="#7a4a1c" stroke-width="0.5"/>',
  sandwich: '<path d="M2 9 L12 3 L22 9 Z" fill="#e0b070" stroke="#9a6a20" stroke-width="0.8"/><path d="M2 9 h20 l-1 2 h-18 Z" fill="#5fb04a"/><rect x="2" y="11" width="20" height="2.6" fill="#e0607a"/><rect x="2" y="13.6" width="20" height="2" fill="#f7c948"/><rect x="2" y="15.6" width="20" height="2.4" fill="#7a3a1a"/><path d="M2 18 h20 v2 q0 1.5 -1.5 1.5 h-17 q-1.5 0 -1.5 -1.5 Z" fill="#e0b070" stroke="#9a6a20" stroke-width="0.8"/>',
  ghost: '<path d="M4 22 V10 C4 4 20 4 20 10 V22 L17 19.5 L14.5 22 L12 19.5 L9.5 22 L7 19.5 Z" fill="#f4f4fa" stroke="#9aa3c0" stroke-width="0.8"/><ellipse cx="9.5" cy="11" rx="1.4" ry="2" fill="#1b1b1b"/><ellipse cx="14.5" cy="11" rx="1.4" ry="2" fill="#1b1b1b"/><ellipse cx="12" cy="15.5" rx="1.6" ry="1.2" fill="#1b1b1b"/>',
  pokeball: '<circle cx="12" cy="12" r="10" fill="#fff" stroke="#1b1b1b" stroke-width="1.2"/><path d="M2 12 A10 10 0 0 1 22 12 Z" fill="#e0262b" stroke="#1b1b1b" stroke-width="1.2"/><path d="M2 12 H22" stroke="#1b1b1b" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="#fff" stroke="#1b1b1b" stroke-width="1.4"/>',
  badge: '<path d="M12 2 L18 6 L19 13 L12 22 L5 13 L6 6 Z" fill="#9aa3ad" stroke="#4d545c" stroke-width="0.8"/><path d="M12 5 L16 8 L16.5 12.5 L12 18.5 L7.5 12.5 L8 8 Z" fill="#d8dde3"/>',
  broom: '<path d="M19 1 L11 13" stroke="#8a5a2b" stroke-width="1.8" stroke-linecap="round"/><path d="M10 11 L14 14 L9 23 C6 21 3 19 2 17 Z" fill="#e0b84a" stroke="#9a7a1a" stroke-width="0.8" stroke-linejoin="round"/><path d="M8.5 15 L4 19 M10 16.5 L6 21.5" stroke="#9a7a1a" stroke-width="0.6"/><path d="M10 11 L14 14" stroke="#e0262b" stroke-width="1.4"/>',
  horseshoe: '<path d="M5 3 C2 10 3 20 12 21 C21 20 22 10 19 3 L15.5 4 C17.5 9.5 17 16.5 12 17 C7 16.5 6.5 9.5 8.5 4 Z" fill="#9aa3ad" stroke="#4d545c" stroke-width="0.8"/><circle cx="6.2" cy="8" r="0.7" fill="#4d545c"/><circle cx="17.8" cy="8" r="0.7" fill="#4d545c"/><circle cx="6.8" cy="13" r="0.7" fill="#4d545c"/><circle cx="17.2" cy="13" r="0.7" fill="#4d545c"/>',
  star: '<path d="M12 1.5 L15 8.5 L22.5 9.2 L16.8 14.2 L18.5 21.7 L12 17.8 L5.5 21.7 L7.2 14.2 L1.5 9.2 L9 8.5 Z" fill="#f6d43a" stroke="#b58a0f" stroke-width="0.8" stroke-linejoin="round"/>',
  house: '<path d="M2 11 L12 3 L22 11 Z" fill="#e0452a" stroke="#8a1f12" stroke-width="0.8"/><rect x="4" y="11" width="16" height="11" fill="#f6d43a" stroke="#a87b0a" stroke-width="0.8"/><rect x="6" y="13" width="4" height="4" fill="#5fb0ff" stroke="#2f5fae" stroke-width="0.5"/><rect x="13" y="15" width="4.5" height="7" fill="#3fa64a" stroke="#256b2e" stroke-width="0.5"/>',
  coins: '<ellipse cx="9" cy="18" rx="7" ry="3" fill="#e0a810" stroke="#8a6a0a" stroke-width="0.8"/><ellipse cx="9" cy="15.5" rx="7" ry="3" fill="#f6c21a" stroke="#8a6a0a" stroke-width="0.8"/><ellipse cx="15" cy="10" rx="7" ry="3" fill="#e0a810" stroke="#8a6a0a" stroke-width="0.8"/><ellipse cx="15" cy="7.5" rx="7" ry="3" fill="#f6c21a" stroke="#8a6a0a" stroke-width="0.8"/><path d="M13.5 7.5 h3 M7.5 15.5 h3" stroke="#8a6a0a" stroke-width="0.8"/>',
  lollipop: '<path d="M12 13 L12 23" stroke="#f4f4f4" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="8" r="7" fill="#ff7aa8" stroke="#c0407a" stroke-width="0.8"/><path d="M12 8 m-5 0 a5 5 0 0 1 10 0 a3.5 3.5 0 0 1 -7 0 a2 2 0 0 1 4 0" fill="none" stroke="#fff" stroke-width="1.2"/>',
  bow: '<path d="M12 12 L3 5 Q1 12 3 19 Z M12 12 L21 5 Q23 12 21 19 Z" fill="#e0262b" stroke="#8a0f14" stroke-width="0.8" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.6" fill="#e0262b" stroke="#8a0f14" stroke-width="0.8"/><circle cx="5" cy="9" r="0.8" fill="#fff"/><circle cx="5" cy="15" r="0.8" fill="#fff"/><circle cx="19" cy="9" r="0.8" fill="#fff"/><circle cx="19" cy="15" r="0.8" fill="#fff"/>',
  heart: '<path d="M12 21 C3 15 1 10 3.5 6 C6 2.5 10 3.5 12 7 C14 3.5 18 2.5 20.5 6 C23 10 21 15 12 21 Z" fill="#ff5a7a" stroke="#b02a4a" stroke-width="0.8"/><ellipse cx="7.5" cy="8" rx="1.6" ry="1" fill="#fff" opacity="0.7" transform="rotate(-30 7.5 8)"/>',
  balloon: '<path d="M12 15 Q11 19 13 23" stroke="#6b737b" stroke-width="0.6" fill="none"/><circle cx="12" cy="10" r="5.5" fill="#1b1b1b"/><circle cx="6" cy="4.5" r="3" fill="#1b1b1b"/><circle cx="18" cy="4.5" r="3" fill="#1b1b1b"/><path d="M10.5 15 h3 l-1.5 1.5 Z" fill="#1b1b1b"/><ellipse cx="10" cy="8" rx="1.4" ry="0.8" fill="#fff" opacity="0.5"/>',
};
const boardDecoSets = {
  tomJerry: ['cheese', 'yarn', 'mousetrap'],
  thorLoki: ['hammer', 'lightning', 'hornhelmet'],
  spongePatrick: ['jellyfish', 'burger', 'pineapple'],
  phineasFerb: ['fedora', 'wrench', 'rocket'],
  rickMorty: ['portal', 'portalgun', 'pickle'],
  elsaAnna: ['snowflake', 'snowman', 'crown'],
  mcqueenHook: ['trophy', 'cone', 'flag'],
  gruMinion: ['banana', 'goggles', 'rocket'],
  poShifu: ['dumpling', 'peach', 'scroll'],
  narutoSasuke: ['ramen', 'kunai', 'shuriken'],
  gonKillua: ['fishingrod', 'skateboard', 'lightning'],
  scoobyShaggy: ['bone', 'sandwich', 'ghost'],
  ashPikachu: ['pokeball', 'lightning', 'badge'],
  bibiTina: ['broom', 'horseshoe', 'star'],
  pippiNilsson: ['house', 'coins', 'lollipop'],
  mickyMinnie: ['bow', 'heart', 'balloon']
};
const decoSvg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${boardDecoIcons[name] || ''}</svg>`;

// Position eines Tages auf dem Brett: Tag 1 unten links, dann in Schlangenlinien nach oben
function calBoardPos(day, rows){
  const row = Math.floor((day - 1) / 7);
  const i = (day - 1) % 7;
  return { gridRow: rows - row, gridCol: (row % 2 === 0 ? i : 6 - i) + 1, row };
}

function renderCalendar(){
  calMonthLabel.textContent = monthNames[calViewMonth] + ' ' + calViewYear;

  const daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();
  const rows = Math.ceil(daysInMonth / 7);
  calLinks = buildCalLinks(daysInMonth, calViewYear * 12 + calViewMonth + 7);

  calGrid.innerHTML = '';
  calGrid.style.gridTemplateRows = `repeat(${rows}, auto)`;

  // Bahn: pro Reihe ein hellblaues Band, an den Wendestellen eine runde Kurve
  for(let row = 0; row < rows; row++){
    const band = document.createElement('div');
    band.className = 'ladder-band';
    band.style.gridRow = String(rows - row);
    band.style.gridColumn = '1 / -1';
    // Aussenecken der Kurven rund: Kurve nach oben (rechts bei geraden Reihen) und Kurve nach unten
    const R = '30px', r0 = '6px';
    const upSide = row < rows - 1 ? (row % 2 === 0 ? 'right' : 'left') : null;
    const downSide = row > 0 ? ((row - 1) % 2 === 0 ? 'right' : 'left') : null;
    const tl = downSide === 'left' ? R : r0, tr = downSide === 'right' ? R : r0;
    const br = upSide === 'right' ? R : r0, bl = upSide === 'left' ? R : r0;
    band.style.borderRadius = `${tl} ${tr} ${br} ${bl}`;
    calGrid.appendChild(band);
    if(row < rows - 1){
      const turn = document.createElement('div');
      const right = row % 2 === 0;
      turn.className = 'ladder-turn ' + (right ? 'right' : 'left');
      turn.style.gridRow = `${rows - row - 1} / ${rows - row + 1}`;
      turn.style.gridColumn = right ? '7' : '1';
      calGrid.appendChild(turn);
    }
  }

  // Passende Objekte zu den Figuren (werden in drawCalLinks auf die Lücken zwischen den Reihen verteilt)
  const themeSet = ladderGame.setFor(calViewMonth, calViewYear);
  calDecoNames = boardDecoSets[themeSet] || [];
  calLinkTheme = linkThemes[themeSet] || linkThemes.default;

  for(let day = 1; day <= daysInMonth; day++){
    const dateObj = new Date(calViewYear, calViewMonth, day);
    const dateStr = fmtDate(dateObj);
    const pos = calBoardPos(day, rows);
    const cell = document.createElement('div');
    cell.className = 'cal-day' + (day % 2 === 0 ? ' dark' : '');
    cell.dataset.day = day;
    cell.style.gridRow = String(pos.gridRow);
    cell.style.gridColumn = String(pos.gridCol);
    if(calLinks[day]) cell.classList.add(calLinks[day] > day ? 'up' : 'down');
    if(day === 1) cell.classList.add('start');
    if(day === daysInMonth) cell.classList.add('goal');
    if(dateStr === fmtDate(today)) cell.classList.add('today');
    if(dateStr === calSelectedDate) cell.classList.add('selected');
    cell.innerHTML = `<span class="cal-wd">${weekdayFull[dateObj.getDay()].slice(0, 2)}</span><span class="cal-num">${day}</span>`;
    if(calEvents[dateStr] && calEvents[dateStr].length > 0){
      const dot = document.createElement('div');
      dot.className = 'cal-dot';
      cell.appendChild(dot);
    }
    cell.addEventListener('click', () => {
      calSelectedDate = dateStr;
      renderCalendar();
      renderCalEntries();
    });
    calGrid.appendChild(cell);
  }
  // Neues Spiel nur bei einem anderen Monat, nicht beim Anklicken eines Tages
  const gameKey = calViewYear + '-' + calViewMonth;
  if(gameKey !== calGameKey){ calGameKey = gameKey; ladderGame.reset(daysInMonth, calViewMonth, calViewYear); }
  requestAnimationFrame(drawCalLinks);
}

// Leitern und Seile über das Brett zeichnen
const ladderSvg = document.getElementById('ladder-svg');
function calCellCenter(day){
  const cell = calGrid.querySelector(`.cal-day[data-day="${day}"]`);
  if(!cell) return null;
  return { x: calGrid.offsetLeft + cell.offsetLeft + cell.offsetWidth / 2, y: calGrid.offsetTop + cell.offsetTop + cell.offsetHeight / 2, w: cell.offsetWidth, h: cell.offsetHeight };
}
// Leitern und Seile passend zu den Figuren des Monats
const linkThemes = {
  default:       { ladder: { rail: '#c48a4a', edge: '#5a3311', rung: '#7a4a1c' }, rope: { kind: 'rope', color: '#2a2a2a', accent: '#e0262b' } },
  tomJerry:      { ladder: { rail: '#c48a4a', edge: '#5a3311', rung: '#7a4a1c' }, rope: { kind: 'wavy', color: '#d0508a', accent: '#f7a8c8', end: 'yarn' } },
  thorLoki:      { ladder: { rail: '#c9d1d9', edge: '#4d545c', rung: '#d4a933' }, rope: { kind: 'zigzag', color: '#2e8a4c', accent: '#f6d43a', end: 'lightning' } },
  spongePatrick: { ladder: { rail: '#f59aa6', edge: '#b0506a', rung: '#f6e04b' }, rope: { kind: 'wavy', color: '#c05aa0', accent: '#f2a5d6', end: 'jellyfish' } },
  phineasFerb:   { ladder: { rail: '#f08a24', edge: '#8a4a0a', rung: '#2f5fae' }, rope: { kind: 'rope', color: '#2f5fae', accent: '#ffffff', end: 'wrench' } },
  rickMorty:     { ladder: { rail: '#9aa3ad', edge: '#3d444c', rung: '#7cf06a', glow: '#7cf06a' }, rope: { kind: 'wavy', color: '#3fb83a', accent: '#b6ff9a', end: 'portal' } },
  elsaAnna:      { ladder: { rail: '#d8f1fb', edge: '#5fa8d0', rung: '#ffffff', glow: '#bfe6f7' }, rope: { kind: 'rope', color: '#4aa8e0', accent: '#ffffff', end: 'snowflake' } },
  mcqueenHook:   { ladder: { rail: '#e0262b', edge: '#6a0a0e', rung: '#ffffff', stripes: '#e0262b' }, rope: { kind: 'rope', color: '#4d545c', accent: '#c9d1d9', end: 'towhook' } },
  gruMinion:     { ladder: { rail: '#3d63a8', edge: '#1b3266', rung: '#f7d84a' }, rope: { kind: 'rope', color: '#e0b820', accent: '#3d63a8', end: 'banana' } },
  poShifu:       { ladder: { rail: '#9ccc58', edge: '#4a7a1c', rung: '#6aa83a', nodes: '#4a7a1c' }, rope: { kind: 'wavy', color: '#c8202a', accent: '#f6c21a', end: 'peach' } },
  narutoSasuke:  { ladder: { rail: '#6b4428', edge: '#2a1a0e', rung: '#f08a24' }, rope: { kind: 'rope', color: '#3a3f55', accent: '#f08a24', end: 'kunai' } },
  gonKillua:     { ladder: { rail: '#c48a4a', edge: '#5a3311', rung: '#3f9a4a' }, rope: { kind: 'zigzag', color: '#3a8fe0', accent: '#e8f4ff', end: 'lightning' } },
  scoobyShaggy:  { ladder: { rail: '#7a5aa8', edge: '#3a2a5a', rung: '#a8d86a' }, rope: { kind: 'wavy', color: '#62b03a', accent: '#c4f08a', end: 'ghost' } },
  ashPikachu:    { ladder: { rail: '#f7d33a', edge: '#8a6a0a', rung: '#2a2a2a' }, rope: { kind: 'zigzag', color: '#e0a810', accent: '#fff6b0', end: 'pokeball' } },
  bibiTina:      { ladder: { rail: '#c48a4a', edge: '#5a3311', rung: '#7a4a1c' }, rope: { kind: 'rope', color: '#7a4a24', accent: '#f6d43a', end: 'star' } },
  pippiNilsson:  { ladder: { rail: '#e0452a', edge: '#7a1f12', rung: '#f6d43a', rungs: ['#f6d43a', '#3fa64a', '#3a8fe0', '#e0609a'] }, rope: { kind: 'rope', color: '#e0262b', accent: '#ffffff', end: 'lollipop' } },
  mickyMinnie:   { ladder: { rail: '#2a2a2a', edge: '#000000', rung: '#f6c21a' }, rope: { kind: 'dots', color: '#e0262b', accent: '#ffffff', end: 'bow' } }
};
// kleiner Abschlepphaken für Lightning McQueen & Hook
boardDecoIcons.towhook = '<path d="M12 1 V12 C12 17 6 17 6 13" fill="none" stroke="#4d545c" stroke-width="3" stroke-linecap="round"/><path d="M6 13 L4 10.5 M6 13 L8.6 11.4" stroke="#4d545c" stroke-width="2.4" stroke-linecap="round"/><rect x="9" y="0.5" width="6" height="3" rx="1" fill="#9aa3ad" stroke="#4d545c" stroke-width="0.6"/>';
let calLinkTheme = linkThemes.default;

function drawCalLinks(){
  if(!ladderSvg || calGrid.offsetParent === null) return;
  let out = '';
  const f = (n) => n.toFixed(1);
  const th = calLinkTheme;
  Object.entries(calLinks).forEach(([fromStr, to]) => {
    const from = +fromStr;
    const a = calCellCenter(from), b = calCellCenter(to);
    if(!a || !b) return;
    if(to > from){
      // Leiter steht am oberen Rand des Starttags und reicht bis zum unteren Rand des Zieltags (Zahlen bleiben frei)
      const L = th.ladder;
      const sx = a.x - a.w * 0.3, sy = a.y - a.h * 0.28, ex = b.x - b.w * 0.3, ey = b.y + b.h * 0.34;
      const dx = ex - sx, dy = ey - sy, len = Math.hypot(dx, dy);
      const nx = -dy / len * 6, ny = dx / len * 6;
      out += `<g class="ladder">`;
      if(L.glow) out += `<line class="link-geo" x1="${f(sx)}" y1="${f(sy)}" x2="${f(ex)}" y2="${f(ey)}" stroke="${L.glow}" stroke-width="20" stroke-linecap="round" opacity="0.28"/>`;
      const rungs = Math.max(3, Math.round(len / 14));
      for(let k = 1; k < rungs; k++){
        const t = k / rungs, px = sx + (ex - sx) * t, py = sy + (ey - sy) * t;
        const rc = L.rungs ? L.rungs[k % L.rungs.length] : L.rung;
        out += `<line class="link-geo" x1="${f(px - nx)}" y1="${f(py - ny)}" x2="${f(px + nx)}" y2="${f(py + ny)}" stroke="${L.edge}" stroke-width="4" stroke-linecap="round"/>`;
        out += `<line x1="${f(px - nx)}" y1="${f(py - ny)}" x2="${f(px + nx)}" y2="${f(py + ny)}" stroke="${rc}" stroke-width="2.4" stroke-linecap="round"/>`;
      }
      [-1, 1].forEach(side => {
        const x1 = sx + nx * side, y1 = sy + ny * side, x2 = ex + nx * side, y2 = ey + ny * side;
        out += `<line class="link-geo" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${L.edge}" stroke-width="4.8" stroke-linecap="round"/>`;
        out += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${L.rail}" stroke-width="2.8" stroke-linecap="round"/>`;
        // Rennstrecke: rot-weisse Randsteine, Bambus: Knoten
        if(L.stripes) out += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#ffffff" stroke-width="2.8" stroke-dasharray="5 5"/>`;
        if(L.nodes){
          for(let t = 0.15; t < 1; t += 0.22){
            const px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
            out += `<line x1="${f(px - nx * 0.45)}" y1="${f(py - ny * 0.45)}" x2="${f(px + nx * 0.45)}" y2="${f(py + ny * 0.45)}" stroke="${L.nodes}" stroke-width="1.4"/>`;
          }
        }
      });
      out += `</g>`;
    } else {
      // Seil hängt von der rechten unteren Ecke des Starttags zur rechten oberen Ecke des Zieltags
      const R = th.rope;
      const ax = a.x + a.w * 0.3, ay = a.y + a.h * 0.3, bx = b.x + b.w * 0.3, by = b.y - b.h * 0.3;
      const mx = (ax + bx) / 2 + (bx > ax ? -1 : 1) * 14 + (bx === ax ? 14 : 0);
      const my = (ay + by) / 2 + 8;
      let d;
      if(R.kind === 'wavy' || R.kind === 'zigzag'){
        // Kurve abtasten und seitlich auslenken: Welle (Wolle, Tentakel, Schleim) oder Zickzack (Blitz)
        const pts = [], steps = R.kind === 'zigzag' ? 9 : 36;
        for(let i = 0; i <= steps; i++){
          const t = i / steps, u = 1 - t;
          const x = u * u * ax + 2 * u * t * mx + t * t * bx, y = u * u * ay + 2 * u * t * my + t * t * by;
          const tx = 2 * u * (mx - ax) + 2 * t * (bx - mx), ty = 2 * u * (my - ay) + 2 * t * (by - my), tl = Math.hypot(tx, ty) || 1;
          const off = (i === 0 || i === steps) ? 0 : R.kind === 'zigzag' ? (i % 2 ? 4.5 : -4.5) : Math.sin(t * Math.PI * 7) * 2.6;
          pts.push([x - ty / tl * off, y + tx / tl * off]);
        }
        d = 'M' + pts.map(p => f(p[0]) + ',' + f(p[1])).join(' L');
      } else {
        d = `M${f(ax)},${f(ay)} Q${f(mx)},${f(my)} ${f(bx)},${f(by)}`;
      }
      const join = R.kind === 'zigzag' ? 'miter' : 'round';
      out += `<path class="link-geo" d="${d}" fill="none" stroke="${R.kind === 'zigzag' ? '#1b1b1b' : R.color}" stroke-width="${R.kind === 'zigzag' ? 5.2 : 3.8}" stroke-linecap="round" stroke-linejoin="${join}" opacity="0.9"/>`;
      if(R.kind === 'zigzag'){
        out += `<path d="${d}" fill="none" stroke="${R.color}" stroke-width="3.4" stroke-linejoin="${join}"/>`;
        out += `<path d="${d}" fill="none" stroke="${R.accent}" stroke-width="1.2" stroke-linejoin="${join}"/>`;
      } else if(R.kind === 'dots'){
        out += `<path d="${d}" fill="none" stroke="${R.accent}" stroke-width="2" stroke-linecap="round" stroke-dasharray="0.1 6"/>`;
      } else if(R.kind === 'wavy'){
        out += `<path d="${d}" fill="none" stroke="${R.accent}" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>`;
      } else {
        out += `<path d="${d}" fill="none" stroke="${R.accent}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="4 4"/>`;
      }
      if(R.end && boardDecoIcons[R.end]){
        out += `<svg x="${f(ax - 9)}" y="${f(ay - 11)}" width="18" height="18" viewBox="0 0 24 24">${boardDecoIcons[R.end]}</svg>`;
      } else {
        out += `<circle cx="${f(ax)}" cy="${f(ay)}" r="3.4" fill="${R.color}"/>`;
      }
    }
  });
  ladderSvg.innerHTML = out;
  placeCalDecos();
  ladderGame.place(true);
}
// Objekte gross in einige Felder setzen (die Zahl verschwindet dort).
// Nie auf Start, Ziel oder Feldern, über die eine Leiter oder ein Seil geht.
function placeCalDecos(){
  calGrid.querySelectorAll('.cal-deco').forEach(d => d.remove());
  calGrid.querySelectorAll('.cal-day.has-deco').forEach(c => c.classList.remove('has-deco'));
  if(!calDecoNames.length) return;
  const cells = [...calGrid.querySelectorAll('.cal-day')];
  const n = cells.length;
  if(!n) return;
  // Felder sammeln, die von gezeichneten Leitern/Seilen berührt werden
  const blocked = new Set([1, n, ...Object.keys(calLinks).map(Number), ...Object.values(calLinks)]);
  const rects = cells.map(c => ({ day: +c.dataset.day, x: calGrid.offsetLeft + c.offsetLeft, y: calGrid.offsetTop + c.offsetTop, w: c.offsetWidth, h: c.offsetHeight }));
  ladderSvg.querySelectorAll('.link-geo').forEach(el => {
    const len = el.getTotalLength();
    for(let t = 0; t <= len; t += 3){
      const pt = el.getPointAtLength(t);
      rects.forEach(rc => { if(pt.x > rc.x - 3 && pt.x < rc.x + rc.w + 3 && pt.y > rc.y - 3 && pt.y < rc.y + rc.h + 3) blocked.add(rc.day); });
    }
  });
  const free = rects.map(rc => rc.day).filter(d => !blocked.has(d)).sort((a, b) => a - b);
  // Gleichmässig über das Brett verteilt, nicht zwei direkt nebeneinander
  let seed = calViewYear * 12 + calViewMonth;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const want = Math.min(6, free.length);
  const chosen = [];
  for(let k = 0; k < want; k++){
    const from = Math.floor(k * free.length / want), to = Math.floor((k + 1) * free.length / want);
    const options = free.slice(from, to).filter(d => !chosen.some(c => Math.abs(c - d) < 2));
    if(options.length) chosen.push(options[Math.floor(rnd() * options.length)]);
  }
  chosen.forEach((day, i) => {
    const cell = calGrid.querySelector(`.cal-day[data-day="${day}"]`);
    if(!cell) return;
    const d = document.createElement('span');
    d.className = 'cal-deco';
    d.style.setProperty('--tilt', ((rnd() - 0.5) * 24).toFixed(0) + 'deg');
    d.innerHTML = decoSvg(calDecoNames[i % calDecoNames.length]);
    cell.appendChild(d);
    cell.classList.add('has-deco');
  });
}
// Neu zeichnen, wenn sich das Brett in der Grösse ändert (auch beim Wechsel in den Kalender-Tab)
const ladderBoardEl = document.getElementById('ladder-board');
if(ladderBoardEl && 'ResizeObserver' in window) new ResizeObserver(() => drawCalLinks()).observe(ladderBoardEl);

// Leiterspiel: zwei Figuren, ein Würfel. Leiter = hoch, Seil = runter. Wer genau auf dem letzten Tag landet, gewinnt.
const ladderGame = (() => {
  const dieBtn = document.getElementById('ladder-die');
  const statusEl = document.getElementById('ladder-status');
  const layer = document.getElementById('pawn-layer');
  // Spielfiguren (selbst gezeichnet): Tom & Jerry und Thor & Loki – je nach Monat
  const tomSvg = `<svg viewBox="0 0 40 46" aria-hidden="true">
    <ellipse cx="20" cy="44" rx="11" ry="2.2" fill="rgba(0,0,0,0.25)"/>
    <ellipse cx="20" cy="38" rx="11" ry="7" fill="#7b8da4"/>
    <ellipse cx="20" cy="39.5" rx="6" ry="5" fill="#f4f1ea"/>
    <path d="M8 15 L5 1.5 L16 10 Z" fill="#7b8da4" stroke="#4d5c70" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M32 15 L35 1.5 L24 10 Z" fill="#7b8da4" stroke="#4d5c70" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M8.6 12.5 L6.8 4.5 L13.5 10 Z" fill="#f2a5b1"/>
    <path d="M31.4 12.5 L33.2 4.5 L26.5 10 Z" fill="#f2a5b1"/>
    <path d="M7 22 L3 25 L7.5 25.5 L4.5 29 L9.5 27.5 C12 32 28 32 30.5 27.5 L35.5 29 L32.5 25.5 L37 25 L33 22 C34 14 28 8.5 20 8.5 C12 8.5 6 14 7 22 Z" fill="#8798ae" stroke="#4d5c70" stroke-width="0.8" stroke-linejoin="round"/>
    <ellipse cx="20" cy="26" rx="8.5" ry="5.6" fill="#f4f1ea"/>
    <ellipse cx="15.3" cy="18" rx="4.2" ry="5.2" fill="#f4f1ea"/>
    <ellipse cx="24.7" cy="18" rx="4.2" ry="5.2" fill="#f4f1ea"/>
    <ellipse cx="16" cy="18.6" rx="2.4" ry="3.3" fill="#c9d23a"/>
    <ellipse cx="24" cy="18.6" rx="2.4" ry="3.3" fill="#c9d23a"/>
    <ellipse cx="16.4" cy="19" rx="1.2" ry="2.3" fill="#1b1b1b"/>
    <ellipse cx="23.6" cy="19" rx="1.2" ry="2.3" fill="#1b1b1b"/>
    <path d="M11 12.5 L18 14" stroke="#3e4a5a" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M29 12.5 L22 14" stroke="#3e4a5a" stroke-width="1.3" stroke-linecap="round"/>
    <ellipse cx="20" cy="23.4" rx="2.2" ry="1.5" fill="#2a2a2a"/>
    <path d="M16 27 Q20 30.5 24 27" fill="none" stroke="#2a2a2a" stroke-width="1" stroke-linecap="round"/>
    <path d="M12 25 L4 23.5 M12 26.5 L4.5 27.5 M28 25 L36 23.5 M28 26.5 L35.5 27.5" stroke="#2a2a2a" stroke-width="0.6" stroke-linecap="round"/>
  </svg>`;
  const jerrySvg = `<svg viewBox="0 0 32 38" aria-hidden="true">
    <ellipse cx="16" cy="36" rx="8" ry="1.8" fill="rgba(0,0,0,0.25)"/>
    <ellipse cx="16" cy="31" rx="7" ry="5" fill="#b4682c"/>
    <ellipse cx="16" cy="32" rx="4" ry="3.6" fill="#f2c993"/>
    <circle cx="7" cy="9" r="7" fill="#b4682c" stroke="#7a4216" stroke-width="0.7"/>
    <circle cx="25" cy="9" r="7" fill="#b4682c" stroke="#7a4216" stroke-width="0.7"/>
    <circle cx="7.3" cy="9.4" r="4.4" fill="#f2a48c"/>
    <circle cx="24.7" cy="9.4" r="4.4" fill="#f2a48c"/>
    <ellipse cx="16" cy="17.5" rx="10" ry="9" fill="#b8702f" stroke="#7a4216" stroke-width="0.7"/>
    <ellipse cx="16" cy="21.5" rx="7.2" ry="5.2" fill="#f2c993"/>
    <ellipse cx="12.7" cy="15.5" rx="2.7" ry="3.5" fill="#fff"/>
    <ellipse cx="19.3" cy="15.5" rx="2.7" ry="3.5" fill="#fff"/>
    <ellipse cx="13.2" cy="16.2" rx="1.4" ry="2.2" fill="#1b1b1b"/>
    <ellipse cx="18.8" cy="16.2" rx="1.4" ry="2.2" fill="#1b1b1b"/>
    <circle cx="13.6" cy="15.3" r="0.5" fill="#fff"/>
    <circle cx="19.2" cy="15.3" r="0.5" fill="#fff"/>
    <circle cx="16" cy="20.2" r="1.6" fill="#1b1b1b"/>
    <path d="M13 22.6 Q16 25.4 19 22.6" fill="none" stroke="#1b1b1b" stroke-width="0.9" stroke-linecap="round"/>
    <path d="M11 21 L4.5 19.8 M11 22.4 L5 23.4 M21 21 L27.5 19.8 M21 22.4 L27 23.4" stroke="#1b1b1b" stroke-width="0.5" stroke-linecap="round"/>
  </svg>`;
  const thorSvg = `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M10 24 C6 34 6 44 8 49 L32 49 C34 44 34 34 30 24 Z" fill="#b3161c" stroke="#6e0a0e" stroke-width="0.7"/>
    <rect x="15" y="40" width="4" height="9" rx="1.5" fill="#2a2d33"/>
    <rect x="21" y="40" width="4" height="9" rx="1.5" fill="#2a2d33"/>
    <path d="M12.5 27 C12.5 24 15 22.5 20 22.5 C25 22.5 27.5 24 27.5 27 L27 41 L13 41 Z" fill="#3a3f48" stroke="#1d2026" stroke-width="0.6"/>
    <circle cx="17" cy="30" r="1.6" fill="#a9b2bd"/><circle cx="23" cy="30" r="1.6" fill="#a9b2bd"/>
    <circle cx="17" cy="35" r="1.6" fill="#a9b2bd"/><circle cx="23" cy="35" r="1.6" fill="#a9b2bd"/>
    <rect x="12.5" y="37.5" width="15" height="2.2" fill="#6b7480"/>
    <path d="M28 27 C31 28 32.5 31 32 34" fill="none" stroke="#e8c8a8" stroke-width="3.2" stroke-linecap="round"/>
    <rect x="31" y="31" width="2.4" height="11" rx="1" fill="#6b4a2a" transform="rotate(18 32 36)"/>
    <rect x="29.5" y="39.5" width="10" height="6.5" rx="1.2" fill="#9aa3ad" stroke="#4d545c" stroke-width="0.7" transform="rotate(18 34.5 42.7)"/>
    <path d="M9.5 15 C8 22 9 27 12 30 L13 18 Z M30.5 15 C32 22 31 27 28 30 L27 18 Z" fill="#e8b84a" stroke="#a87b1c" stroke-width="0.5"/>
    <ellipse cx="20" cy="15" rx="8.5" ry="9" fill="#f0cfae"/>
    <path d="M11.5 17 C12 25 16 27 20 27 C24 27 28 25 28.5 17 C27 21 24.5 22 20 22 C15.5 22 13 21 11.5 17 Z" fill="#d9a63a"/>
    <path d="M10.8 13 C11 6 15 4 20 4 C25 4 29 6 29.2 13 C26 9.5 23 8.8 20 9 C17 8.8 14 9.5 10.8 13 Z" fill="#e8b84a"/>
    <ellipse cx="16.6" cy="15" rx="1.3" ry="1.6" fill="#1d4f8f"/><ellipse cx="23.4" cy="15" rx="1.3" ry="1.6" fill="#1d4f8f"/>
    <path d="M14.8 12.6 L18.2 13 M25.2 12.6 L21.8 13" stroke="#a87b1c" stroke-width="1" stroke-linecap="round"/>
    <path d="M17.5 21.5 Q20 22.8 22.5 21.5" fill="none" stroke="#7a3a2a" stroke-width="0.9" stroke-linecap="round"/>
  </svg>`;
  const lokiSvg = `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M10 25 C6 35 6 44 8 49 L32 49 C34 44 34 35 30 25 Z" fill="#1f6b3a" stroke="#0d3a1e" stroke-width="0.7"/>
    <rect x="15" y="40" width="4" height="9" rx="1.5" fill="#1b1e22"/>
    <rect x="21" y="40" width="4" height="9" rx="1.5" fill="#1b1e22"/>
    <path d="M12.5 27.5 C12.5 24.5 15 23 20 23 C25 23 27.5 24.5 27.5 27.5 L27 41 L13 41 Z" fill="#23272c" stroke="#111" stroke-width="0.6"/>
    <path d="M20 23 L17 41 L23 41 Z" fill="#2e8a4c"/>
    <path d="M13 27 L17.5 24 L18 27 L14 31 Z M27 27 L22.5 24 L22 27 L26 31 Z" fill="#d4a933" stroke="#8a6a12" stroke-width="0.4"/>
    <rect x="12.5" y="37.5" width="15" height="2.2" fill="#d4a933"/>
    <path d="M12 26 C9 28 7.5 31 8 34" fill="none" stroke="#efe0d2" stroke-width="3" stroke-linecap="round"/>
    <path d="M7.2 30 L9.2 30.6 L8.6 42 L7.6 42 Z" fill="#c9d1d9" stroke="#6b737b" stroke-width="0.4" transform="rotate(-12 8 36)"/>
    <path d="M11 13 C10 20 10 26 12 30 L13.5 17 Z M29 13 C30 20 30 26 28 30 L26.5 17 Z" fill="#141414"/>
    <ellipse cx="20" cy="16" rx="8" ry="8.6" fill="#efe0d2"/>
    <path d="M12 15 C13 11 15.5 10 20 10 C24.5 10 27 11 28 15 C26 12.5 23.5 12 20 12.5 C16.5 12 14 12.5 12 15 Z" fill="#141414"/>
    <path d="M11.5 14 C11 8 14 5.5 20 5.5 C26 5.5 29 8 28.5 14 L26.5 12.5 C25.5 10 23 9.3 20 9.3 C17 9.3 14.5 10 13.5 12.5 Z" fill="#d4a933" stroke="#8a6a12" stroke-width="0.6"/>
    <path d="M14 9 C11 6 8 1 9.5 -3 C11.5 1 14.5 3.5 16.5 7 Z" fill="#d4a933" stroke="#8a6a12" stroke-width="0.6"/>
    <path d="M26 9 C29 6 32 1 30.5 -3 C28.5 1 25.5 3.5 23.5 7 Z" fill="#d4a933" stroke="#8a6a12" stroke-width="0.6"/>
    <path d="M18.5 6 L20 3.5 L21.5 6 Z" fill="#2e8a4c"/>
    <ellipse cx="16.8" cy="16.5" rx="1.2" ry="1.5" fill="#2e8a4c"/><ellipse cx="23.2" cy="16.5" rx="1.2" ry="1.5" fill="#2e8a4c"/>
    <path d="M14.8 14.4 L18.4 15.2 M25.2 14.4 L21.6 15.2" stroke="#141414" stroke-width="0.9" stroke-linecap="round"/>
    <path d="M17.6 21 Q20.5 22.4 23 20.6" fill="none" stroke="#7a3a3a" stroke-width="0.9" stroke-linecap="round"/>
  </svg>`;
  const spongebobSvg = `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="14.5" y="40" width="2" height="8" fill="#f6e04b"/><rect x="23.5" y="40" width="2" height="8" fill="#f6e04b"/>
    <rect x="14" y="44" width="3" height="3.4" fill="#fff"/><rect x="23" y="44" width="3" height="3.4" fill="#fff"/>
    <path d="M14 47.5 h4.5 a1.6 1.6 0 0 1 0 2.4 h-4.5 Z M22.5 47.5 h4.5 a1.6 1.6 0 0 1 0 2.4 h-4.5 Z" fill="#1b1b1b"/>
    <path d="M7 4 Q9.5 2.5 12 4 Q14.5 2.5 17 4 Q19.5 2.5 22 4 Q24.5 2.5 27 4 Q29.5 2.5 32 4 L33 30 L7 30 Z" fill="#f6e04b" stroke="#b9a51e" stroke-width="0.8"/>
    <ellipse cx="11" cy="9" rx="1.6" ry="2" fill="#c8c234" opacity="0.8"/><ellipse cx="29.5" cy="11" rx="1.3" ry="1.8" fill="#c8c234" opacity="0.8"/>
    <ellipse cx="10" cy="25" rx="1.3" ry="1.6" fill="#c8c234" opacity="0.8"/><ellipse cx="30" cy="24" rx="1.8" ry="1.3" fill="#c8c234" opacity="0.8"/>
    <rect x="7" y="30" width="26" height="4" fill="#fff" stroke="#b9b9b9" stroke-width="0.4"/>
    <path d="M17 30 L20 33 L23 30 Z" fill="#fff" stroke="#999" stroke-width="0.3"/>
    <path d="M19 31.5 L21 31.5 L21.6 36 L20 37.5 L18.4 36 Z" fill="#d62828"/>
    <path d="M7 34 H33 V39 Q33 41 31 41 H9 Q7 41 7 39 Z" fill="#8a5a2b"/>
    <rect x="9" y="35.2" width="3" height="1" fill="#1b1b1b"/><rect x="14" y="35.2" width="3" height="1" fill="#1b1b1b"/><rect x="23" y="35.2" width="3" height="1" fill="#1b1b1b"/><rect x="28" y="35.2" width="3" height="1" fill="#1b1b1b"/>
    <circle cx="15" cy="14" r="5" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/><circle cx="25" cy="14" r="5" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/>
    <circle cx="15.6" cy="14.4" r="2.3" fill="#3aa0e0"/><circle cx="24.4" cy="14.4" r="2.3" fill="#3aa0e0"/>
    <circle cx="15.6" cy="14.4" r="1.1" fill="#1b1b1b"/><circle cx="24.4" cy="14.4" r="1.1" fill="#1b1b1b"/>
    <path d="M12 8.6 L11.4 7 M14.5 8.2 L14.4 6.5 M17 8.6 L17.6 7 M23 8.6 L22.4 7 M25.5 8.2 L25.6 6.5 M28 8.6 L28.6 7" stroke="#1b1b1b" stroke-width="0.6" stroke-linecap="round"/>
    <path d="M18.5 18 Q20 15.5 21.5 18 Q20.5 19.5 20 19.5 Q19.5 19.5 18.5 18 Z" fill="#f6e04b" stroke="#b9a51e" stroke-width="0.6"/>
    <path d="M11.5 20.5 Q20 28 28.5 20.5" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.7"/>
    <rect x="17" y="21.6" width="2.6" height="2.6" fill="#fff" stroke="#999" stroke-width="0.3"/><rect x="20.4" y="21.6" width="2.6" height="2.6" fill="#fff" stroke="#999" stroke-width="0.3"/>
    <circle cx="10.5" cy="20" r="1.8" fill="#f2a16f" opacity="0.7"/><circle cx="29.5" cy="20" r="1.8" fill="#f2a16f" opacity="0.7"/>
  </svg>`;
  const patrickSvg = `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M20 1 C23 1 24.5 10 25.5 18 C30 20 36 23 36.5 27 C37 30 31 30.5 28 30.5 C28.5 37 30 44 28 48 C26 50 23 48 20 44 C17 48 14 50 12 48 C10 44 11.5 37 12 30.5 C9 30.5 3 30 3.5 27 C4 23 10 20 14.5 18 C15.5 10 17 1 20 1 Z" fill="#f59aa6" stroke="#c4606f" stroke-width="0.8"/>
    <path d="M11.5 32 C14 30.5 26 30.5 28.5 32 L29 39 C26 41 14 41 11 39 Z" fill="#7cc242" stroke="#4d8a24" stroke-width="0.6"/>
    <circle cx="15" cy="34.5" r="1.4" fill="#9a5ad1"/><circle cx="21" cy="36.5" r="1.4" fill="#9a5ad1"/><circle cx="25.5" cy="33.8" r="1.4" fill="#9a5ad1"/><circle cx="18" cy="38.2" r="1.1" fill="#9a5ad1"/>
    <ellipse cx="17.6" cy="13.5" rx="2.2" ry="3.2" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/><ellipse cx="22.4" cy="13.5" rx="2.2" ry="3.2" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/>
    <circle cx="18" cy="14.2" r="1" fill="#1b1b1b"/><circle cx="22" cy="14.2" r="1" fill="#1b1b1b"/>
    <path d="M15.6 9.6 L18.8 9 M24.4 9.6 L21.2 9" stroke="#1b1b1b" stroke-width="1.1" stroke-linecap="round"/>
    <path d="M14.5 20 Q20 25.5 25.5 20 Q20 22.5 14.5 20 Z" fill="#8a1f2f" stroke="#1b1b1b" stroke-width="0.7"/>
    <ellipse cx="13.8" cy="18.5" rx="1.6" ry="1" fill="#e7707f" opacity="0.7"/><ellipse cx="26.2" cy="18.5" rx="1.6" ry="1" fill="#e7707f" opacity="0.7"/>
  </svg>`;
  // Weitere Figuren (selbst gezeichnet)
  const moreFigures = {
    scooby: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M30 34 Q37 30 36 22 Q38 30 33 37 Z" fill="#a8722e" stroke="#6b4416" stroke-width="0.5"/>
    <path d="M12 32 Q12 26 20 26 Q28 26 28 32 L28 44 L12 44 Z" fill="#b97f36" stroke="#6b4416" stroke-width="0.6"/>
    <circle cx="15" cy="34" r="1.3" fill="#3a2410"/><circle cx="24" cy="38" r="1.5" fill="#3a2410"/><circle cx="18" cy="41" r="1" fill="#3a2410"/>
    <rect x="12.5" y="42" width="5" height="6" rx="2" fill="#b97f36" stroke="#6b4416" stroke-width="0.5"/><rect x="22.5" y="42" width="5" height="6" rx="2" fill="#b97f36" stroke="#6b4416" stroke-width="0.5"/>
    <path d="M12.5 26 Q20 29.5 27.5 26 L27.5 28 Q20 31.5 12.5 28 Z" fill="#3a8fd0"/>
    <path d="M18.4 28.6 L21.6 28.6 L21.2 32 L20 33 L18.8 32 Z" fill="#f6c21a" stroke="#b58a0f" stroke-width="0.4"/>
    <path d="M10 8 Q6 10 7 17 Q9 16 11 12 Z M27 7 Q32 8 32 15 Q29.5 14 28 11 Z" fill="#7a4e1e"/>
    <path d="M10.5 15 C9 7 14 3 21 4 C26 4.5 29 8 29 13 L34 16 C36 17.5 35 21 32.5 21.5 L27 22.5 C24 25 15 25 12 21 Z" fill="#b97f36" stroke="#6b4416" stroke-width="0.6"/>
    <ellipse cx="33.5" cy="17.5" rx="2.2" ry="1.6" fill="#1b1b1b"/>
    <ellipse cx="17.5" cy="12.5" rx="2.6" ry="3" fill="#fff" stroke="#1b1b1b" stroke-width="0.4"/><ellipse cx="23" cy="12" rx="2.6" ry="3" fill="#fff" stroke="#1b1b1b" stroke-width="0.4"/>
    <circle cx="18.2" cy="13" r="1.1" fill="#1b1b1b"/><circle cx="23.7" cy="12.5" r="1.1" fill="#1b1b1b"/>
    <path d="M15.5 10.4 Q17.5 9 19.5 10.2 M21 9.8 Q23 8.4 25 9.6" fill="none" stroke="#3a2410" stroke-width="0.6"/>
    <path d="M20 21.5 Q25 23 30 20.5" fill="none" stroke="#1b1b1b" stroke-width="0.8" stroke-linecap="round"/>
  </svg>`,
    shaggy: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="39" width="4" height="9" fill="#8a5a2b"/><rect x="21" y="39" width="4" height="9" fill="#8a5a2b"/><path d="M13.5 47.5 h6 v2.5 h-6 Z M20.5 47.5 h6 v2.5 h-6 Z" fill="#1b1b1b"/>
    <path d="M11.5 27 Q11.5 25 20 25 Q28.5 25 28.5 27 L29 40 L11 40 Z" fill="#8fbf3a" stroke="#5f8a1f" stroke-width="0.6"/>
    <path d="M17 25 L20 28 L23 25" fill="none" stroke="#5f8a1f" stroke-width="0.7"/>
    <ellipse cx="20" cy="17" rx="8.5" ry="9" fill="#f6d6b8" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M10.5 18 C8 9 13 4 20 4 C27 4 32 9 29.5 18 L28 13 L26.5 16 L25 11 L22.5 13.5 L20 10 L17.5 13.5 L15 11 L13.5 16 L12 13 Z" fill="#8a5a2b" stroke="#5a3a18" stroke-width="0.5"/>
    <ellipse cx="16.6" cy="17.2" rx="1.5" ry="1.9" fill="#5a3a18"/><ellipse cx="23.4" cy="17.2" rx="1.5" ry="1.9" fill="#5a3a18"/><circle cx="16.6" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="23.4" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="17.1" cy="16.6" r="0.45" fill="#fff"/><circle cx="23.9" cy="16.6" r="0.45" fill="#fff"/>
    <path d="M18 22 Q20 23.5 22 22" fill="none" stroke="#1b1b1b" stroke-width="0.7" stroke-linecap="round"/>
    <path d="M18.5 24.2 L20 27 L21.5 24.2 Z" fill="#8a5a2b"/>
  </svg>`,
    ash: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="39" width="4" height="9" fill="#3a5fae"/><rect x="21" y="39" width="4" height="9" fill="#3a5fae"/><path d="M13.5 47.5 h6 v2.5 h-6 Z M20.5 47.5 h6 v2.5 h-6 Z" fill="#1b1b1b"/>
    <path d="M12 27 Q12 25 20 25 Q28 25 28 27 L28.5 40 L11.5 40 Z" fill="#1d1d2a"/>
    <path d="M12 27 Q12 25 17 25 L17.5 40 L11.5 40 Z M28 27 Q28 25 23 25 L22.5 40 L28.5 40 Z" fill="#2f6fd0" stroke="#1b4a99" stroke-width="0.5"/>
    <path d="M10 18 L6 15 L10 14 L7.5 10 L12 11 Z M30 18 L34 15 L30 14 L32.5 10 L28 11 Z" fill="#1b1d26"/>
    <ellipse cx="20" cy="17" rx="8.5" ry="9" fill="#f6d6b8" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11.5 15 C11.5 12 14 12 16 13 L19 11.5 L21 13.5 L24 12 L28.5 15 C29 13 28.5 11 27 10 L13 10 C11.5 11 11 13 11.5 15 Z" fill="#1b1d26"/>
    <path d="M10.5 11 C10.5 4 15 2 20 2 C25 2 29.5 4 29.5 11 Z" fill="#e0262b" stroke="#8a0f14" stroke-width="0.5"/>
    <path d="M14 11 C14 5 17 3 20 3 C23 3 26 5 26 11 Z" fill="#f4f4f4"/>
    <path d="M18 6.5 C18 5 22 5 22 6.5 C21.5 8 18.5 8 18 6.5 Z" fill="#3fa64a"/>
    <path d="M8 11 L32 11 L31 12.5 L9 12.5 Z" fill="#e0262b" stroke="#8a0f14" stroke-width="0.4"/>
    <ellipse cx="16.6" cy="17.2" rx="1.5" ry="1.9" fill="#5a3a18"/><ellipse cx="23.4" cy="17.2" rx="1.5" ry="1.9" fill="#5a3a18"/><circle cx="16.6" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="23.4" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="17.1" cy="16.6" r="0.45" fill="#fff"/><circle cx="23.9" cy="16.6" r="0.45" fill="#fff"/>
    <path d="M14 20.2 l1.5 -0.6 M14.3 21.3 l1.4 -0.6 M26 20.2 l-1.5 -0.6 M25.7 21.3 l-1.4 -0.6" stroke="#b56a4a" stroke-width="0.4"/>
    <path d="M16.5 22 Q20 25.5 23.5 22" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.6"/>
  </svg>`,
    pikachu: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M27 38 L33 34 L30.5 31 L36 25 L38 27 L35 32 L37 34 L29 42 Z" fill="#f7d33a" stroke="#b58a0f" stroke-width="0.6" stroke-linejoin="round"/>
    <path d="M27 38 L29.5 36.5 L31 39.5 L29 42 Z" fill="#8a5a2b"/>
    <ellipse cx="20" cy="38" rx="10" ry="10" fill="#f7d33a" stroke="#b58a0f" stroke-width="0.6"/>
    <path d="M14 36 Q20 33.5 26 36" fill="none" stroke="#8a5a2b" stroke-width="1.2"/>
    <ellipse cx="14.5" cy="47.5" rx="3" ry="1.8" fill="#f7d33a" stroke="#b58a0f" stroke-width="0.5"/><ellipse cx="25.5" cy="47.5" rx="3" ry="1.8" fill="#f7d33a" stroke="#b58a0f" stroke-width="0.5"/>
    <path d="M12 14 L5 0 L15 10 Z M28 14 L35 0 L25 10 Z" fill="#f7d33a" stroke="#b58a0f" stroke-width="0.6" stroke-linejoin="round"/>
    <path d="M5 0 L7.6 5.3 L9.6 4.5 Z M35 0 L32.4 5.3 L30.4 4.5 Z" fill="#1b1b1b"/>
    <ellipse cx="20" cy="18" rx="11" ry="9.5" fill="#f7d33a" stroke="#b58a0f" stroke-width="0.6"/>
    <circle cx="15.5" cy="16" r="2.2" fill="#1b1b1b"/><circle cx="24.5" cy="16" r="2.2" fill="#1b1b1b"/>
    <circle cx="16.2" cy="15.2" r="0.8" fill="#fff"/><circle cx="25.2" cy="15.2" r="0.8" fill="#fff"/>
    <circle cx="12.5" cy="21" r="2.4" fill="#e0262b"/><circle cx="27.5" cy="21" r="2.4" fill="#e0262b"/>
    <path d="M19.4 18.5 L20.6 18.5 L20 19.2 Z" fill="#1b1b1b"/>
    <path d="M17.5 20.5 Q18.8 22 20 20.5 Q21.2 22 22.5 20.5" fill="none" stroke="#1b1b1b" stroke-width="0.6" stroke-linecap="round"/>
  </svg>`,
    bibi: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="39" width="4" height="9" fill="#2f4f9e"/><rect x="21" y="39" width="4" height="9" fill="#2f4f9e"/><path d="M13.5 47.5 h6 v2.5 h-6 Z M20.5 47.5 h6 v2.5 h-6 Z" fill="#5a3a18"/>
    <path d="M11.5 27 Q11.5 25 20 25 Q28.5 25 28.5 27 L29 40 L11 40 Z" fill="#3a8fe0" stroke="#1f5fa8" stroke-width="0.6"/>
    <path d="M20 29.5 l1 2 2.2 0.3 -1.6 1.5 0.4 2.2 -2 -1 -2 1 0.4 -2.2 -1.6 -1.5 2.2 -0.3 Z" fill="#f6d43a"/>
    <path d="M22 4 C23 -1 30 -2 31 2 C28 1 26 3 25 6 Z" fill="#f4dc6a" stroke="#c9a91f" stroke-width="0.5"/>
    <circle cx="22.5" cy="4.5" r="1.4" fill="#e0262b"/>
    <ellipse cx="20" cy="17" rx="8.5" ry="9" fill="#f6d6b8" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11.5 15 C10.5 8 14.5 5 20 5 C25.5 5 29.5 8 28.5 15 C27 11 24 10 20 11 C16 10 13 11 11.5 15 Z" fill="#f4dc6a" stroke="#c9a91f" stroke-width="0.5"/>
    <ellipse cx="16.6" cy="17.2" rx="1.5" ry="1.9" fill="#3a8fe0"/><ellipse cx="23.4" cy="17.2" rx="1.5" ry="1.9" fill="#3a8fe0"/><circle cx="16.6" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="23.4" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="17.1" cy="16.6" r="0.45" fill="#fff"/><circle cx="23.9" cy="16.6" r="0.45" fill="#fff"/>
    <circle cx="14" cy="20.5" r="1.2" fill="#f2a1a1" opacity="0.7"/><circle cx="26" cy="20.5" r="1.2" fill="#f2a1a1" opacity="0.7"/>
    <path d="M16.5 22 Q20 25.5 23.5 22" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.6"/>
  </svg>`,
    tina: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="39" width="4" height="9" fill="#e8dcc0"/><rect x="21" y="39" width="4" height="9" fill="#e8dcc0"/>
    <path d="M14.5 42 h5 v8 h-5 Z M20.5 42 h5 v8 h-5 Z" fill="#3a2410"/>
    <path d="M11.5 27 Q11.5 25 20 25 Q28.5 25 28.5 27 L29 40 L11 40 Z" fill="#c8302f" stroke="#8a1f1f" stroke-width="0.6"/>
    <path d="M17 25 L20 28.5 L23 25" fill="#f4f4f4"/>
    <path d="M10.5 15 C9 22 9.5 28 11 33 L13.5 32 L13 18 Z M29.5 15 C31 22 30.5 28 29 33 L26.5 32 L27 18 Z" fill="#5a2f14"/>
    <ellipse cx="20" cy="17" rx="8.5" ry="9" fill="#f6d6b8" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11.5 16 C10.5 8 14.5 5 20 5 C25.5 5 29.5 8 28.5 16 C26.5 11 23 9.5 19 10.5 C15.5 10 13 12 11.5 16 Z" fill="#5a2f14"/>
    <ellipse cx="16.6" cy="17.2" rx="1.5" ry="1.9" fill="#5a3a18"/><ellipse cx="23.4" cy="17.2" rx="1.5" ry="1.9" fill="#5a3a18"/><circle cx="16.6" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="23.4" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="17.1" cy="16.6" r="0.45" fill="#fff"/><circle cx="23.9" cy="16.6" r="0.45" fill="#fff"/>
    <path d="M16.5 22 Q20 25.5 23.5 22" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.6"/>
  </svg>`,
    pippi: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="39" width="4" height="9" fill="#5a3a18"/><rect x="21" y="39" width="4" height="9" fill="#f4f4f4"/>
    <path d="M21 41 h4 M21 43.5 h4 M21 46 h4" stroke="#1b1b1b" stroke-width="1"/>
    <path d="M12.5 47.5 h7 v2.5 h-7 Z M20.5 47.5 h8 v2.5 h-8 Z" fill="#1b1b1b"/>
    <path d="M12 26 Q12 24.5 20 24.5 Q28 24.5 28 26 L30 40 L10 40 Z" fill="#3a8fd0" stroke="#1f5fa8" stroke-width="0.6"/>
    <rect x="14" y="31" width="4" height="4" fill="#f6d43a" transform="rotate(-8 16 33)"/><rect x="23" y="34" width="3.5" height="3.5" fill="#e0262b" transform="rotate(10 24.7 35.7)"/>
    <path d="M11 13 L2 7 L3 9.5 L1 10 L11.5 16 Z M29 13 L38 7 L37 9.5 L39 10 L28.5 16 Z" fill="#e8601c" stroke="#a83f0c" stroke-width="0.5"/>
    <path d="M4.5 9.3 l1.2 -1.6 M7 11 l1.2 -1.6 M35.5 9.3 l-1.2 -1.6 M33 11 l-1.2 -1.6" stroke="#a83f0c" stroke-width="0.5"/>
    <ellipse cx="20" cy="17" rx="8.5" ry="9" fill="#f6d6b8" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11.5 15 C11 8 15 5 20 5 C25 5 29 8 28.5 15 C27 11 24 9.5 20 10 C16 9.5 13 11 11.5 15 Z" fill="#e8601c" stroke="#a83f0c" stroke-width="0.5"/>
    <ellipse cx="16.6" cy="17.2" rx="1.5" ry="1.9" fill="#3a8fe0"/><ellipse cx="23.4" cy="17.2" rx="1.5" ry="1.9" fill="#3a8fe0"/><circle cx="16.6" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="23.4" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="17.1" cy="16.6" r="0.45" fill="#fff"/><circle cx="23.9" cy="16.6" r="0.45" fill="#fff"/>
    <circle cx="14.5" cy="20" r="0.4" fill="#c46a3a"/><circle cx="15.7" cy="20.6" r="0.4" fill="#c46a3a"/><circle cx="14.8" cy="21.3" r="0.4" fill="#c46a3a"/><circle cx="25.5" cy="20" r="0.4" fill="#c46a3a"/><circle cx="24.3" cy="20.6" r="0.4" fill="#c46a3a"/><circle cx="25.2" cy="21.3" r="0.4" fill="#c46a3a"/>
    <path d="M15.5 21.8 Q20 26.5 24.5 21.8" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.6"/>
    <path d="M17.5 22.6 h5 v1 h-5 Z" fill="#fff"/>
  </svg>`,
    nilsson: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M27 42 Q35 42 34 33 Q33 28 36 26" fill="none" stroke="#7a4a24" stroke-width="2" stroke-linecap="round"/>
    <path d="M13 40 L27 40 L27.5 46 L12.5 46 Z" fill="#2f5fae" stroke="#1b3f7a" stroke-width="0.5"/>
    <ellipse cx="15" cy="48" rx="2.8" ry="1.8" fill="#7a4a24"/><ellipse cx="25" cy="48" rx="2.8" ry="1.8" fill="#7a4a24"/>
    <ellipse cx="20" cy="34" rx="8" ry="8.5" fill="#8a5a2b" stroke="#5a3a18" stroke-width="0.6"/>
    <ellipse cx="20" cy="35" rx="5" ry="5.5" fill="#d9b48a"/>
    <path d="M12.5 31 Q20 33.5 27.5 31 L27.5 34 Q20 36.5 12.5 34 Z" fill="#e0262b" opacity="0.9"/>
    <circle cx="9.5" cy="17" r="3.5" fill="#8a5a2b" stroke="#5a3a18" stroke-width="0.6"/><circle cx="30.5" cy="17" r="3.5" fill="#8a5a2b" stroke="#5a3a18" stroke-width="0.6"/>
    <circle cx="9.5" cy="17" r="2" fill="#d9b48a"/><circle cx="30.5" cy="17" r="2" fill="#d9b48a"/>
    <ellipse cx="20" cy="17" rx="9" ry="8.5" fill="#8a5a2b" stroke="#5a3a18" stroke-width="0.6"/>
    <path d="M13 17 C13 12 16.5 11.5 20 13 C23.5 11.5 27 12 27 17 C27 22 24 25 20 25 C16 25 13 22 13 17 Z" fill="#d9b48a"/>
    <circle cx="17" cy="16.5" r="1.3" fill="#1b1b1b"/><circle cx="23" cy="16.5" r="1.3" fill="#1b1b1b"/>
    <circle cx="17.4" cy="16.1" r="0.4" fill="#fff"/><circle cx="23.4" cy="16.1" r="0.4" fill="#fff"/>
    <path d="M19 19.5 h2" stroke="#5a3a18" stroke-width="0.8" stroke-linecap="round"/>
    <path d="M17 21.5 Q20 23.5 23 21.5" fill="none" stroke="#5a3a18" stroke-width="0.7" stroke-linecap="round"/>
    <ellipse cx="20" cy="9.5" rx="9" ry="1.8" fill="#e8cf7a" stroke="#a88a2a" stroke-width="0.5"/>
    <path d="M14.5 9.5 C14.5 4.5 25.5 4.5 25.5 9.5 Z" fill="#e8cf7a" stroke="#a88a2a" stroke-width="0.5"/>
    <path d="M14.7 8 h10.6" stroke="#e0262b" stroke-width="1.2"/>
  </svg>`,
    micky: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="16" y="40" width="2.6" height="6" fill="#1b1b1b"/><rect x="21.4" y="40" width="2.6" height="6" fill="#1b1b1b"/>
    <ellipse cx="15.5" cy="47.5" rx="4" ry="2.4" fill="#f6c21a" stroke="#b58a0f" stroke-width="0.5"/><ellipse cx="24.5" cy="47.5" rx="4" ry="2.4" fill="#f6c21a" stroke="#b58a0f" stroke-width="0.5"/>
    <path d="M13 26 Q13 24.5 20 24.5 Q27 24.5 27 26 L27 33 L13 33 Z" fill="#1b1b1b"/>
    <path d="M12.5 32 L27.5 32 L28 40 Q20 42 12 40 Z" fill="#e0262b" stroke="#8a0f14" stroke-width="0.5"/>
    <ellipse cx="17" cy="35" rx="1" ry="1.5" fill="#fff"/><ellipse cx="23" cy="35" rx="1" ry="1.5" fill="#fff"/>
    <circle cx="10.5" cy="31.5" r="2.6" fill="#fff" stroke="#999" stroke-width="0.4"/><circle cx="29.5" cy="31.5" r="2.6" fill="#fff" stroke="#999" stroke-width="0.4"/>
    <path d="M13 27 L11 30 M27 27 L29 30" stroke="#1b1b1b" stroke-width="2"/>
    <circle cx="9.5" cy="7" r="5.5" fill="#1b1b1b"/><circle cx="30.5" cy="7" r="5.5" fill="#1b1b1b"/>
    <ellipse cx="20" cy="16" rx="9" ry="9" fill="#1b1b1b"/>
    <path d="M12.5 18 C12 13 15 10.5 17.5 12 C18.5 12.6 19.5 13 20 13 C20.5 13 21.5 12.6 22.5 12 C25 10.5 28 13 27.5 18 C27 23 24 25 20 25 C16 25 13 23 12.5 18 Z" fill="#f6d6b8"/>
    <ellipse cx="18" cy="15.5" rx="1.2" ry="2.4" fill="#fff" stroke="#1b1b1b" stroke-width="0.3"/><ellipse cx="22" cy="15.5" rx="1.2" ry="2.4" fill="#fff" stroke="#1b1b1b" stroke-width="0.3"/>
    <ellipse cx="18.2" cy="16.4" rx="0.7" ry="1.3" fill="#1b1b1b"/><ellipse cx="21.8" cy="16.4" rx="0.7" ry="1.3" fill="#1b1b1b"/>
    <ellipse cx="20" cy="19" rx="1.6" ry="1.1" fill="#1b1b1b"/>
    <path d="M15.5 20.5 Q20 25.5 24.5 20.5 Q20 22.5 15.5 20.5 Z" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.5"/>
  </svg>`,
    minnie: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="16" y="41" width="2.6" height="5" fill="#1b1b1b"/><rect x="21.4" y="41" width="2.6" height="5" fill="#1b1b1b"/>
    <ellipse cx="15.5" cy="47.5" rx="3.6" ry="2.2" fill="#f6c21a" stroke="#b58a0f" stroke-width="0.5"/><ellipse cx="24.5" cy="47.5" rx="3.6" ry="2.2" fill="#f6c21a" stroke="#b58a0f" stroke-width="0.5"/>
    <path d="M14 25 Q20 24 26 25 L30.5 41 Q20 44 9.5 41 Z" fill="#e0262b" stroke="#8a0f14" stroke-width="0.5"/>
    <circle cx="15" cy="30" r="1" fill="#fff"/><circle cx="21" cy="28" r="1" fill="#fff"/><circle cx="24.5" cy="33" r="1" fill="#fff"/><circle cx="17" cy="36" r="1" fill="#fff"/><circle cx="23" cy="39" r="1" fill="#fff"/><circle cx="13" cy="39" r="1" fill="#fff"/><circle cx="27.5" cy="38.5" r="1" fill="#fff"/>
    <circle cx="10" cy="31" r="2.4" fill="#fff" stroke="#999" stroke-width="0.4"/><circle cx="30" cy="31" r="2.4" fill="#fff" stroke="#999" stroke-width="0.4"/>
    <circle cx="9.5" cy="7.5" r="5.2" fill="#1b1b1b"/><circle cx="30.5" cy="7.5" r="5.2" fill="#1b1b1b"/>
    <ellipse cx="20" cy="16" rx="9" ry="9" fill="#1b1b1b"/>
    <path d="M12.5 18 C12 13 15 10.5 17.5 12 C18.5 12.6 19.5 13 20 13 C20.5 13 21.5 12.6 22.5 12 C25 10.5 28 13 27.5 18 C27 23 24 25 20 25 C16 25 13 23 12.5 18 Z" fill="#f6d6b8"/>
    <ellipse cx="18" cy="15.5" rx="1.2" ry="2.4" fill="#fff" stroke="#1b1b1b" stroke-width="0.3"/><ellipse cx="22" cy="15.5" rx="1.2" ry="2.4" fill="#fff" stroke="#1b1b1b" stroke-width="0.3"/>
    <ellipse cx="18.2" cy="16.4" rx="0.7" ry="1.3" fill="#1b1b1b"/><ellipse cx="21.8" cy="16.4" rx="0.7" ry="1.3" fill="#1b1b1b"/>
    <path d="M16.6 13 l-0.8 -1.2 M17.6 12.7 l-0.4 -1.3 M23.4 13 l0.8 -1.2 M22.4 12.7 l0.4 -1.3" stroke="#1b1b1b" stroke-width="0.5"/>
    <ellipse cx="20" cy="19" rx="1.6" ry="1.1" fill="#1b1b1b"/>
    <path d="M15.5 20.5 Q20 25.5 24.5 20.5 Q20 22.5 15.5 20.5 Z" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.5"/>
    <path d="M20 6 L13 2 Q11.5 6 13 10 Z M20 6 L27 2 Q28.5 6 27 10 Z" fill="#e0262b" stroke="#8a0f14" stroke-width="0.5"/>
    <circle cx="20" cy="6" r="2" fill="#e0262b" stroke="#8a0f14" stroke-width="0.5"/>
    <circle cx="14.5" cy="5" r="0.7" fill="#fff"/><circle cx="13.6" cy="8" r="0.7" fill="#fff"/><circle cx="25.5" cy="5" r="0.7" fill="#fff"/><circle cx="26.4" cy="8" r="0.7" fill="#fff"/>
  </svg>`,
    naruto: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="39" width="4" height="9" fill="#f08a24"/><rect x="21" y="39" width="4" height="9" fill="#f08a24"/><path d="M13.5 47.5 h6 v2.5 h-6 Z M20.5 47.5 h6 v2.5 h-6 Z" fill="#2f5fae"/>
    <path d="M12 27 Q12 25 20 25 Q28 25 28 27 L28.5 40 L11.5 40 Z" fill="#f08a24" stroke="#b5620f" stroke-width="0.6"/>
    <path d="M12 27 Q12 25 20 25 Q28 25 28 27 L28 30 Q20 28.5 12 30 Z" fill="#1d1d2a"/>
    <path d="M20 28 L20 40" stroke="#f4f4f4" stroke-width="1"/>
    <path d="M10 15 L4 13 L9 10 L5 5 L12 7 L12 1 L17 5 L20 -1 L23 5 L28 1 L28 7 L35 5 L31 10 L36 13 L30 15 Z" fill="#f6d43a" stroke="#c9a91f" stroke-width="0.6" stroke-linejoin="round"/>
    <ellipse cx="20" cy="17" rx="8.5" ry="9" fill="#f6d6b8" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11.5 12 L13 15 L15 12.5 L17 15.5 L20 12 L23 15.5 L25 12.5 L27 15 L28.5 12 C27 8 13 8 11.5 12 Z" fill="#f6d43a" stroke="#c9a91f" stroke-width="0.5"/>
    <rect x="11" y="9.5" width="18" height="3.2" rx="1" fill="#2f5fae"/>
    <rect x="16" y="9.8" width="8" height="2.6" rx="0.5" fill="#c9d1d9" stroke="#6b737b" stroke-width="0.3"/>
    <path d="M18.6 11.6 Q20 10 21.4 11.1 Q20.6 12 20 11.4" fill="none" stroke="#4d545c" stroke-width="0.4"/>
    <ellipse cx="16.6" cy="17" rx="1.4" ry="1.8" fill="#3a8fe0"/><ellipse cx="23.4" cy="17" rx="1.4" ry="1.8" fill="#3a8fe0"/>
    <circle cx="16.6" cy="17.2" r="0.6" fill="#1b1b1b"/><circle cx="23.4" cy="17.2" r="0.6" fill="#1b1b1b"/>
    <path d="M12.5 18.8 l2.4 0.4 M12.6 20.2 l2.4 0.2 M12.9 21.6 l2.2 0 M27.5 18.8 l-2.4 0.4 M27.4 20.2 l-2.4 0.2 M27.1 21.6 l-2.2 0" stroke="#8a5a3a" stroke-width="0.5" stroke-linecap="round"/>
    <path d="M16.5 22.5 Q20 25.5 23.5 22.5" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.6"/>
  </svg>`,
    sasuke: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="39" width="4" height="9" fill="#f2f2f2"/><rect x="21" y="39" width="4" height="9" fill="#f2f2f2"/><path d="M13.5 47.5 h6 v2.5 h-6 Z M20.5 47.5 h6 v2.5 h-6 Z" fill="#2f3a5a"/>
    <rect x="13" y="36" width="14" height="5" rx="1" fill="#f2f2f2" stroke="#b5b5b5" stroke-width="0.5"/>
    <path d="M12 27 Q12 25 20 25 Q28 25 28 27 L28 37 L12 37 Z" fill="#26304f" stroke="#141a2c" stroke-width="0.6"/>
    <path d="M13 24 L27 24 L26 28 L14 28 Z" fill="#26304f" stroke="#141a2c" stroke-width="0.5"/>
    <path d="M28 12 L36 6 L32 13 L38 12 L31 17 L35 20 L28.5 19 Z" fill="#1b1d26"/>
    <ellipse cx="20" cy="17" rx="8.5" ry="9" fill="#f6d6b8" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11 17 C9.5 9 14 5 20 5 C26 5 30 8 29 15 L28.5 21 L27 14 L24 11.5 L21 14 L19 11 L16 14.5 L14 11.5 L12.5 21 Z" fill="#1b1d26"/>
    <rect x="11" y="9" width="18" height="3" rx="1" fill="#2f5fae"/>
    <rect x="16" y="9.3" width="8" height="2.4" rx="0.5" fill="#c9d1d9" stroke="#6b737b" stroke-width="0.3"/>
    <path d="M18.6 11 Q20 9.6 21.4 10.6 Q20.6 11.4 20 10.9" fill="none" stroke="#4d545c" stroke-width="0.4"/>
    <ellipse cx="16.8" cy="17.5" rx="1.3" ry="1.5" fill="#1b1b1b"/><ellipse cx="23.2" cy="17.5" rx="1.3" ry="1.5" fill="#1b1b1b"/>
    <circle cx="17.2" cy="17.1" r="0.4" fill="#fff"/><circle cx="23.6" cy="17.1" r="0.4" fill="#fff"/>
    <path d="M15 15.4 L18.4 16.2 M25 15.4 L21.6 16.2" stroke="#1b1b1b" stroke-width="0.7" stroke-linecap="round"/>
    <path d="M18 23 h4" stroke="#1b1b1b" stroke-width="0.7" stroke-linecap="round"/>
  </svg>`,
    gon: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="39" width="4" height="9" fill="#f6d6b8"/><rect x="21" y="39" width="4" height="9" fill="#f6d6b8"/><path d="M13.5 47.5 h6 v2.5 h-6 Z M20.5 47.5 h6 v2.5 h-6 Z" fill="#e0452a"/>
    <rect x="13" y="35" width="14" height="6" rx="1" fill="#3f9a4a" stroke="#256b2e" stroke-width="0.5"/>
    <path d="M12 27 Q12 25 20 25 Q28 25 28 27 L28 36 L12 36 Z" fill="#3f9a4a" stroke="#256b2e" stroke-width="0.6"/>
    <path d="M17 25 L20 29 L23 25" fill="#256b2e"/>
    <path d="M10 14 L6 4 L13 9 L13 -1 L18 6 L20 -4 L23 6 L28 -1 L27 9 L34 4 L30 14 Z" fill="#1b1d26" stroke="#0d0e12" stroke-width="0.5" stroke-linejoin="round"/>
    <path d="M6 4 L8 6.5 M13 -1 L13.5 2.5 M20 -4 L20.3 0 M28 -1 L27.5 2.5 M34 4 L32 6.5" stroke="#3f9a4a" stroke-width="1.6" stroke-linecap="round"/>
    <ellipse cx="20" cy="17" rx="8.5" ry="9" fill="#f6d6b8" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11.5 14 C12 9 15 8.5 20 8.5 C25 8.5 28 9 28.5 14 L26 11.5 L23 13 L20 11 L17 13 L14 11.5 Z" fill="#1b1d26"/>
    <ellipse cx="16.6" cy="17" rx="1.6" ry="2" fill="#7a4a24"/><ellipse cx="23.4" cy="17" rx="1.6" ry="2" fill="#7a4a24"/>
    <circle cx="16.6" cy="17.2" r="0.7" fill="#1b1b1b"/><circle cx="23.4" cy="17.2" r="0.7" fill="#1b1b1b"/>
    <circle cx="17.1" cy="16.4" r="0.45" fill="#fff"/><circle cx="23.9" cy="16.4" r="0.45" fill="#fff"/>
    <path d="M16 22 Q20 26 24 22" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.6"/>
  </svg>`,
    killua: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="39" width="4" height="9" fill="#f6d6b8"/><rect x="21" y="39" width="4" height="9" fill="#f6d6b8"/><path d="M13.5 47.5 h6 v2.5 h-6 Z M20.5 47.5 h6 v2.5 h-6 Z" fill="#5a4ab0"/>
    <rect x="13" y="35" width="14" height="6" rx="1" fill="#2f3a6a" stroke="#1b2244" stroke-width="0.5"/>
    <path d="M12 27 Q12 25 20 25 Q28 25 28 27 L28 36 L12 36 Z" fill="#f4f4f4" stroke="#b5b5b5" stroke-width="0.6"/>
    <path d="M12 28 Q20 30.5 28 28 L28 31 Q20 33.5 12 31 Z" fill="#6a4ab8" opacity="0.9"/>
    <path d="M16 25 Q20 27.5 24 25" fill="none" stroke="#6a4ab8" stroke-width="1.2"/>
    <path d="M9.5 18 C4 15 5 9 8 8 C7 4 12 1 15 3 C16 -1 24 -1 25 3 C28 1 33 4 32 8 C35 9 36 15 30.5 18 Z" fill="#eef1f6" stroke="#b8c1cf" stroke-width="0.6"/>
    <ellipse cx="20" cy="17" rx="8.5" ry="9" fill="#f6d6b8" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11.5 15 C11 9.5 15 8 20 8 C25 8 29 9.5 28.5 15 L27 12 L25 14.5 L23 11.5 L20.5 14 L18 11.5 L15.5 14.5 L13.5 12 Z" fill="#eef1f6" stroke="#b8c1cf" stroke-width="0.4"/>
    <ellipse cx="16.6" cy="17.2" rx="1.6" ry="1.9" fill="#3a8fe0"/><ellipse cx="23.4" cy="17.2" rx="1.6" ry="1.9" fill="#3a8fe0"/>
    <circle cx="16.6" cy="17.4" r="0.7" fill="#1b1b1b"/><circle cx="23.4" cy="17.4" r="0.7" fill="#1b1b1b"/>
    <circle cx="17.1" cy="16.6" r="0.45" fill="#fff"/><circle cx="23.9" cy="16.6" r="0.45" fill="#fff"/>
    <path d="M17 22.5 Q19 24 20 22.6 Q21 24 23 22.5" fill="none" stroke="#1b1b1b" stroke-width="0.7" stroke-linecap="round"/>
  </svg>`,
    phineas: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="41" width="3" height="7" fill="#f6c9a0"/><rect x="22" y="41" width="3" height="7" fill="#f6c9a0"/>
    <path d="M13 47.5 h6 v2.5 h-6 Z M21 47.5 h6 v2.5 h-6 Z" fill="#f4f4f4" stroke="#999" stroke-width="0.4"/>
    <rect x="13.5" y="36" width="13" height="6" rx="1" fill="#2f5fae"/>
    <rect x="13" y="25" width="14" height="12" rx="2" fill="#f4f4f4"/>
    <path d="M13 27 h14 M13 30 h14 M13 33 h14 M13 36 h14" stroke="#f08a24" stroke-width="1.6"/>
    <path d="M10 8 Q10 4.5 13.5 5.5 L34.5 16.5 Q36 18.5 34 19.8 L13.5 25.5 Q10 26 10 22 Z" fill="#f6c9a0" stroke="#c99a70" stroke-width="0.6"/>
    <path d="M12 6 L13.5 2.5 L15.5 6.5 L17.5 3.5 L19 8 L21.5 5.5 L22.5 10 L25.5 8.5 L25.5 12.5 L28.5 12 L27 14.5 L13 6.5 Z" fill="#e0452a"/>
    <circle cx="19" cy="14" r="3" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/><circle cx="19.8" cy="14.2" r="1.2" fill="#1b1b1b"/>
    <circle cx="23.5" cy="14.8" r="2.4" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/><circle cx="24.1" cy="15" r="1" fill="#1b1b1b"/>
    <path d="M22 20.5 Q26 22.5 29.5 19.5" fill="none" stroke="#1b1b1b" stroke-width="0.9" stroke-linecap="round"/>
  </svg>`,
    ferb: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15.5" y="38" width="3" height="10" fill="#3a3a44"/><rect x="21.5" y="38" width="3" height="10" fill="#3a3a44"/>
    <path d="M14 47.5 h5 v2.5 h-5 Z M21 47.5 h5 v2.5 h-5 Z" fill="#1b1b1b"/>
    <rect x="14" y="27" width="12" height="12" rx="2" fill="#7d4cc0"/>
    <path d="M16 27 L20 31 L24 27 Z" fill="#f4f4f4"/>
    <rect x="13.5" y="7" width="13" height="20" rx="3" fill="#f6c9a0" stroke="#c99a70" stroke-width="0.6"/>
    <path d="M13.5 10 C13 4 15 0 19 -2 C18.5 1.5 19.5 3 22 2 C21.5 4 23 5.5 26.5 6 L26.5 10 C22 8.5 17 8.5 13.5 10 Z" fill="#3fa64a"/>
    <path d="M16 15 h3.6 M21.4 15 h3.6" stroke="#1b1b1b" stroke-width="0.6"/>
    <path d="M16.2 15 Q17.8 17.2 19.4 15 Z M21.6 15 Q23.4 17.6 25 15 Z" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/>
    <circle cx="17.8" cy="15.8" r="0.8" fill="#1b1b1b"/><circle cx="23.3" cy="16" r="0.8" fill="#1b1b1b"/>
    <path d="M20.5 17 L21.5 20.5 L20 20.6" fill="none" stroke="#c99a70" stroke-width="0.7"/>
    <path d="M18 23.5 h4.5" stroke="#1b1b1b" stroke-width="0.8" stroke-linecap="round"/>
  </svg>`,
    rick: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15.5" y="38" width="3" height="10" fill="#8a5a2b"/><rect x="21.5" y="38" width="3" height="10" fill="#8a5a2b"/>
    <path d="M14 47.5 h5 v2.5 h-5 Z M21 47.5 h5 v2.5 h-5 Z" fill="#1b1b1b"/>
    <path d="M11 25 L29 25 L31 44 L9 44 Z" fill="#f2f2f2" stroke="#b5b5b5" stroke-width="0.6"/>
    <path d="M17 25 L23 25 L22 38 L18 38 Z" fill="#9fd4ea"/>
    <path d="M17 25 L20 30 L23 25" fill="none" stroke="#b5b5b5" stroke-width="0.6"/>
    <path d="M9 12 L3 8 L9 9 L5 3 L12 6 L12 0 L17 4.5 L20 -1 L23 4.5 L28 0 L28 6 L35 3 L31 9 L37 8 L31 12 L36 15 L30 15 Z" fill="#a9d6e8" stroke="#6fa4bb" stroke-width="0.6" stroke-linejoin="round"/>
    <ellipse cx="20" cy="15" rx="9" ry="10" fill="#f0d6bd" stroke="#c9a888" stroke-width="0.6"/>
    <path d="M13 11.5 Q20 9.5 27 11.5" fill="none" stroke="#6fa4bb" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="16.5" cy="14.5" r="2.6" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/><circle cx="23.5" cy="14.5" r="2.6" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/>
    <circle cx="16.8" cy="14.7" r="0.7" fill="#1b1b1b"/><circle cx="23.2" cy="14.7" r="0.7" fill="#1b1b1b"/>
    <path d="M20 16 L19 19.5 L21 19.5" fill="none" stroke="#c9a888" stroke-width="0.7"/>
    <path d="M15.5 22 Q20 20.5 24.5 22.3" fill="none" stroke="#1b1b1b" stroke-width="0.9" stroke-linecap="round"/>
    <path d="M23.5 22.2 Q24 24.5 23.2 25.5" fill="none" stroke="#bfe6c0" stroke-width="0.9" stroke-linecap="round"/>
  </svg>`,
    morty: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="38" width="4" height="10" fill="#2f5fae"/><rect x="21" y="38" width="4" height="10" fill="#2f5fae"/>
    <path d="M13.5 47.5 h6 v2.5 h-6 Z M20.5 47.5 h6 v2.5 h-6 Z" fill="#f4f4f4" stroke="#999" stroke-width="0.4"/>
    <rect x="12.5" y="26" width="15" height="13" rx="3" fill="#f5d33f" stroke="#c9a91f" stroke-width="0.6"/>
    <ellipse cx="20" cy="15" rx="11" ry="11" fill="#f0d6bd" stroke="#c9a888" stroke-width="0.6"/>
    <path d="M9 14 C8.5 6 14 3 20 3 C26 3 31.5 6 31 14 C29 9 26 7.5 20 7.5 C14 7.5 11 9 9 14 Z" fill="#7a4a24"/>
    <circle cx="16.3" cy="14.5" r="3.2" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/><circle cx="23.7" cy="14.5" r="3.2" fill="#fff" stroke="#1b1b1b" stroke-width="0.5"/>
    <circle cx="16.5" cy="14.8" r="0.8" fill="#1b1b1b"/><circle cx="23.5" cy="14.8" r="0.8" fill="#1b1b1b"/>
    <path d="M16 22 Q18 20.5 20 22 Q22 23.5 24 22" fill="none" stroke="#1b1b1b" stroke-width="0.9" stroke-linecap="round"/>
  </svg>`,
    elsa: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M9 30 C8 40 6 46 4 49 L36 49 C34 46 32 40 31 30 Z" fill="#bfe6f7" opacity="0.75" stroke="#8cc6e0" stroke-width="0.5"/>
    <path d="M14 26 L26 26 L30 49 L10 49 Z" fill="#6fb8e4" stroke="#3d8cbf" stroke-width="0.6"/>
    <circle cx="16" cy="36" r="0.7" fill="#fff"/><circle cx="23" cy="41" r="0.7" fill="#fff"/><circle cx="19" cy="45" r="0.7" fill="#fff"/><circle cx="25" cy="33" r="0.6" fill="#fff"/>
    <ellipse cx="20" cy="15" rx="8.5" ry="9.5" fill="#f6dccb" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11.5 15 C10 6 15 3.5 20.5 3.5 C26 3.5 30 6.5 28.5 13 C26 8 22 7.5 18 9 C15 10 13 12 11.5 15 Z" fill="#f4ecc4" stroke="#d6c88a" stroke-width="0.5"/>
    <path d="M27 11 C30 15 29 20 27 24 C25.5 28 27 32 25.5 36 C24.5 33 24 28 25 24 Z" fill="#f4ecc4" stroke="#d6c88a" stroke-width="0.5"/>
    <path d="M25.8 26 l1.6 0.6 M25.4 29 l1.6 0.6 M25.4 32 l1.4 0.5" stroke="#d6c88a" stroke-width="0.5"/>
    <ellipse cx="16.6" cy="15.5" rx="1.5" ry="2" fill="#3a7fc4"/><ellipse cx="23.4" cy="15.5" rx="1.5" ry="2" fill="#3a7fc4"/>
    <circle cx="17" cy="15" r="0.5" fill="#fff"/><circle cx="23.8" cy="15" r="0.5" fill="#fff"/>
    <path d="M14.8 12.6 Q16.6 11.8 18.2 12.6 M21.8 12.6 Q23.4 11.8 25.2 12.6" fill="none" stroke="#8a6a4a" stroke-width="0.6"/>
    <path d="M18 20.5 Q20 21.8 22 20.5" fill="#d9536f" stroke="#b03a55" stroke-width="0.6"/>
  </svg>`,
    anna: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M9 28 C7 38 6 45 7 49 L33 49 C34 45 33 38 31 28 Z" fill="#b0306a" stroke="#7a1f48" stroke-width="0.6"/>
    <path d="M14 34 L26 34 L29 49 L11 49 Z" fill="#2b3f8a" stroke="#1b2a63" stroke-width="0.6"/>
    <path d="M14 26 L26 26 L26 35 L14 35 Z" fill="#1d1d2a"/>
    <path d="M16 28 L24 33 M24 28 L16 33" stroke="#d9a63a" stroke-width="0.6"/>
    <ellipse cx="20" cy="15" rx="8.5" ry="9.5" fill="#f6dccb" stroke="#d1ad96" stroke-width="0.6"/>
    <path d="M11.5 16 C10 6 15 3.5 20 3.5 C25 3.5 30 6 28.5 16 C27 10 24 8.5 20 9 C16 8.5 13 10 11.5 16 Z" fill="#a8461f" stroke="#7a2f12" stroke-width="0.5"/>
    <path d="M17 4.5 C16 6 15.5 8 15.8 9.5" fill="none" stroke="#f4ecc4" stroke-width="1.2"/>
    <path d="M11.5 15 C10 20 10.5 26 9.5 31 C11.5 28 12.5 22 13 17 Z M28.5 15 C30 20 29.5 26 30.5 31 C28.5 28 27.5 22 27 17 Z" fill="#a8461f" stroke="#7a2f12" stroke-width="0.5"/>
    <ellipse cx="16.6" cy="15.5" rx="1.5" ry="2" fill="#4a9ad8"/><ellipse cx="23.4" cy="15.5" rx="1.5" ry="2" fill="#4a9ad8"/>
    <circle cx="17" cy="15" r="0.5" fill="#fff"/><circle cx="23.8" cy="15" r="0.5" fill="#fff"/>
    <circle cx="15" cy="18.6" r="0.35" fill="#c47a5a"/><circle cx="16.2" cy="19" r="0.35" fill="#c47a5a"/><circle cx="23.8" cy="19" r="0.35" fill="#c47a5a"/><circle cx="25" cy="18.6" r="0.35" fill="#c47a5a"/>
    <path d="M17.5 20.6 Q20 23 22.5 20.6" fill="#d9536f" stroke="#b03a55" stroke-width="0.6"/>
  </svg>`,
    mcqueen: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M3 42 C3 37 6 35 10 34.5 L14 29 C16 27 24 27 27 29 L32 34 C36 34.5 38 36.5 38 40 L38 43 L3 44 Z" fill="#d81e1e" stroke="#8a0f0f" stroke-width="0.7"/>
    <path d="M15 30 C17 28.5 23.5 28.5 26 30 L29.5 34 L13 34.5 Z" fill="#e9f3fb" stroke="#8a0f0f" stroke-width="0.6"/>
    <ellipse cx="18" cy="31.8" rx="2" ry="1.6" fill="#fff" stroke="#1b1b1b" stroke-width="0.3"/><ellipse cx="23.5" cy="31.8" rx="2" ry="1.6" fill="#fff" stroke="#1b1b1b" stroke-width="0.3"/>
    <circle cx="18.6" cy="31.9" r="0.9" fill="#3a7fc4"/><circle cx="24.1" cy="31.9" r="0.9" fill="#3a7fc4"/>
    <path d="M8 38 L18 36.5 L14 39 L23 38" fill="none" stroke="#f6c21a" stroke-width="1.6" stroke-linejoin="round"/>
    <text x="27.5" y="40.8" font-family="Oswald, sans-serif" font-weight="700" font-size="5.2" fill="#fff" stroke="#1b1b1b" stroke-width="0.25">95</text>
    <path d="M33 38.5 Q35.5 41 37.5 39.5" fill="none" stroke="#1b1b1b" stroke-width="0.7"/>
    <circle cx="10" cy="44" r="4.2" fill="#1b1b1b"/><circle cx="31" cy="44" r="4.2" fill="#1b1b1b"/>
    <circle cx="10" cy="44" r="2" fill="#d81e1e"/><circle cx="31" cy="44" r="2" fill="#d81e1e"/>
  </svg>`,
    hook: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M30 26 L30 20 M30 20 L37 26" stroke="#5a3a24" stroke-width="1.6" fill="none"/>
    <path d="M37 26 L37 31 Q37 34 34.5 33.5" fill="none" stroke="#3a3a3a" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M4 43 L4 34 Q4 31 7 31 L10 31 L12 24 Q12.5 22.5 14 22.5 L22 22.5 Q24 22.5 24 24.5 L24 31 L34 31 L35 43 Z" fill="#9a6338" stroke="#5a3a24" stroke-width="0.7"/>
    <circle cx="9" cy="37" r="1.4" fill="#5fa3a8" opacity="0.8"/><circle cx="28" cy="35" r="1.8" fill="#5fa3a8" opacity="0.8"/>
    <path d="M13.2 24.5 L22.6 24.5 L22.6 30.5 L12 30.5 Z" fill="#e9f3fb" stroke="#5a3a24" stroke-width="0.5"/>
    <ellipse cx="15.6" cy="27.5" rx="1.9" ry="1.8" fill="#fff" stroke="#1b1b1b" stroke-width="0.3"/><ellipse cx="20.2" cy="27.5" rx="1.9" ry="1.8" fill="#fff" stroke="#1b1b1b" stroke-width="0.3"/>
    <circle cx="16" cy="27.6" r="0.9" fill="#6b4a2a"/><circle cx="20.6" cy="27.6" r="0.9" fill="#6b4a2a"/>
    <path d="M5 37 Q9 41.5 15 37.5" fill="#5a2a1a" stroke="#1b1b1b" stroke-width="0.6"/>
    <rect x="8.3" y="37.4" width="2" height="2.2" fill="#fff"/><rect x="11" y="37.5" width="2" height="2.2" fill="#fff"/>
    <circle cx="10" cy="44" r="4.2" fill="#1b1b1b"/><circle cx="30" cy="44" r="4.2" fill="#1b1b1b"/>
    <circle cx="10" cy="44" r="1.8" fill="#8a8a8a"/><circle cx="30" cy="44" r="1.8" fill="#8a8a8a"/>
  </svg>`,
    gru: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="14" y="40" width="4" height="8" fill="#2a2a30"/><rect x="22" y="40" width="4" height="8" fill="#2a2a30"/>
    <path d="M12.5 47.5 h6 v2.5 h-6 Z M21.5 47.5 h6 v2.5 h-6 Z" fill="#1b1b1b"/>
    <path d="M9 30 Q9 24 20 24 Q31 24 31 30 L29 42 L11 42 Z" fill="#2f3036" stroke="#16171a" stroke-width="0.6"/>
    <path d="M12 23 Q20 27 28 23 L28 28 Q20 32 12 28 Z" fill="#6b6b6b"/>
    <path d="M14 24.5 L14 29 M18 25.7 L18 30.3 M22 25.7 L22 30.3 M26 24.5 L26 29" stroke="#2a2a2a" stroke-width="1.6"/>
    <ellipse cx="20" cy="13" rx="9" ry="10.5" fill="#f2dccc" stroke="#c9ad98" stroke-width="0.6"/>
    <ellipse cx="25.5" cy="17" rx="6" ry="3.2" fill="#f2dccc" stroke="#c9ad98" stroke-width="0.6"/>
    <circle cx="16.5" cy="12.5" r="2.2" fill="#fff" stroke="#1b1b1b" stroke-width="0.4"/><circle cx="22.5" cy="12.5" r="2.2" fill="#fff" stroke="#1b1b1b" stroke-width="0.4"/>
    <circle cx="17" cy="12.8" r="0.8" fill="#1b1b1b"/><circle cx="23" cy="12.8" r="0.8" fill="#1b1b1b"/>
    <path d="M14 10 Q16.5 8.5 19 10 M21 10 Q23.5 8.5 26 10" fill="none" stroke="#3a3a3a" stroke-width="0.8"/>
    <path d="M15.5 21.5 Q19 20 22 21.2" fill="none" stroke="#1b1b1b" stroke-width="0.8" stroke-linecap="round"/>
  </svg>`,
    minion: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <rect x="15" y="43" width="3.5" height="4" fill="#3d63a8"/><rect x="21.5" y="43" width="3.5" height="4" fill="#3d63a8"/>
    <path d="M13.5 47 h6 v3 h-6 Z M20.5 47 h6 v3 h-6 Z" fill="#1b1b1b"/>
    <path d="M10 18 Q10 6 20 6 Q30 6 30 18 L30 38 Q30 45 20 45 Q10 45 10 38 Z" fill="#f7d84a" stroke="#c9a91f" stroke-width="0.7"/>
    <path d="M10 32 L14 32 L14 28 L26 28 L26 32 L30 32 L30 38 Q30 45 20 45 Q10 45 10 38 Z" fill="#3d63a8" stroke="#294a85" stroke-width="0.6"/>
    <circle cx="20" cy="33" r="2" fill="#294a85"/>
    <path d="M14 28 L11 22 M26 28 L29 22" stroke="#3d63a8" stroke-width="1.4"/>
    <rect x="10" y="15" width="20" height="3" fill="#2a2a2a"/>
    <circle cx="16" cy="16.5" r="4.3" fill="#9aa3ad" stroke="#5a626b" stroke-width="0.8"/><circle cx="24" cy="16.5" r="4.3" fill="#9aa3ad" stroke="#5a626b" stroke-width="0.8"/>
    <circle cx="16" cy="16.5" r="3" fill="#fff"/><circle cx="24" cy="16.5" r="3" fill="#fff"/>
    <circle cx="16.5" cy="16.8" r="1.4" fill="#7a4a24"/><circle cx="23.5" cy="16.8" r="1.4" fill="#7a4a24"/>
    <circle cx="16.5" cy="16.8" r="0.7" fill="#1b1b1b"/><circle cx="23.5" cy="16.8" r="0.7" fill="#1b1b1b"/>
    <path d="M16 24 Q20 27.5 24 24" fill="#7a1f1f" stroke="#1b1b1b" stroke-width="0.6"/>
    <path d="M18 6.3 L17 3 M20 6 L20 2.5 M22 6.3 L23 3" stroke="#1b1b1b" stroke-width="0.5"/>
  </svg>`,
    po: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <ellipse cx="14" cy="46" rx="4" ry="3.5" fill="#1b1b1b"/><ellipse cx="26" cy="46" rx="4" ry="3.5" fill="#1b1b1b"/>
    <ellipse cx="20" cy="35" rx="12" ry="11" fill="#f7f4ee" stroke="#c9c4b8" stroke-width="0.6"/>
    <path d="M8.5 38 Q20 44 31.5 38 L31 43 Q20 49 9 43 Z" fill="#c9a26a" stroke="#8a6a3a" stroke-width="0.5"/>
    <path d="M9 28 Q4 31 6 37 Q8 38 10 34 Z M31 28 Q36 31 34 37 Q32 38 30 34 Z" fill="#1b1b1b"/>
    <path d="M10 26 Q20 31 30 26 L30 29 Q20 34 10 29 Z" fill="#1b1b1b"/>
    <circle cx="11.5" cy="7" r="4" fill="#1b1b1b"/><circle cx="28.5" cy="7" r="4" fill="#1b1b1b"/>
    <ellipse cx="20" cy="15" rx="10.5" ry="9.5" fill="#f7f4ee" stroke="#c9c4b8" stroke-width="0.6"/>
    <ellipse cx="15.5" cy="14.5" rx="3.6" ry="3" fill="#1b1b1b" transform="rotate(-25 15.5 14.5)"/><ellipse cx="24.5" cy="14.5" rx="3.6" ry="3" fill="#1b1b1b" transform="rotate(25 24.5 14.5)"/>
    <circle cx="16" cy="14.5" r="1.6" fill="#3fa64a"/><circle cx="24" cy="14.5" r="1.6" fill="#3fa64a"/>
    <circle cx="16.3" cy="14.2" r="0.7" fill="#1b1b1b"/><circle cx="23.7" cy="14.2" r="0.7" fill="#1b1b1b"/>
    <ellipse cx="20" cy="18.5" rx="1.8" ry="1.2" fill="#1b1b1b"/>
    <path d="M17 21 Q20 23.5 23 21" fill="none" stroke="#1b1b1b" stroke-width="0.8" stroke-linecap="round"/>
  </svg>`,
    shifu: `<svg viewBox="0 0 40 52" aria-hidden="true">
    <ellipse cx="20" cy="50" rx="11" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M27 44 Q35 42 35 34 Q33 38 29 39" fill="#c25a2a" stroke="#7a3412" stroke-width="0.5"/>
    <path d="M30.5 37.5 l2 -1 M32 35 l2 -0.6" stroke="#f2d0a0" stroke-width="1"/>
    <path d="M12 30 L28 30 L30 48 L10 48 Z" fill="#8a8f7a" stroke="#5a5f4a" stroke-width="0.6"/>
    <path d="M16 30 L20 36 L24 30" fill="none" stroke="#c9a26a" stroke-width="1"/>
    <rect x="11" y="39" width="18" height="2" fill="#5a3a24"/>
    <path d="M8 10 L7 1 L15 7 Z M32 10 L33 1 L25 7 Z" fill="#c25a2a" stroke="#7a3412" stroke-width="0.6"/>
    <path d="M9 7 L8.5 3 L12.5 6.5 Z M31 7 L31.5 3 L27.5 6.5 Z" fill="#f2e6d0"/>
    <ellipse cx="20" cy="18" rx="11" ry="10" fill="#c25a2a" stroke="#7a3412" stroke-width="0.6"/>
    <path d="M12 21 Q14 16 18 18 L20 21 L22 18 Q26 16 28 21 Q26 27 20 27.5 Q14 27 12 21 Z" fill="#f2e6d0"/>
    <path d="M13 14 Q16.5 12 19 14.5 M21 14.5 Q23.5 12 27 14" fill="none" stroke="#f7f4ee" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M13.5 13.5 Q8 13 4 16 M26.5 13.5 Q32 13 36 16" fill="none" stroke="#f7f4ee" stroke-width="0.8" stroke-linecap="round"/>
    <circle cx="16.5" cy="17" r="1.3" fill="#1b1b1b"/><circle cx="23.5" cy="17" r="1.3" fill="#1b1b1b"/>
    <ellipse cx="20" cy="21.2" rx="1.6" ry="1.1" fill="#1b1b1b"/>
    <path d="M18 23.5 Q20 22.8 22 23.5 M18 23.5 Q15 26 13 31 M22 23.5 Q25 26 27 31" fill="none" stroke="#f7f4ee" stroke-width="0.8" stroke-linecap="round"/>
  </svg>`,
  };
  const fig = (name, cls, color) => ({ name, cls, svg: moreFigures[cls], color });
  const characterSets = {
    tomJerry: [{ name: 'Tom', cls: 'tom', svg: tomSvg }, { name: 'Jerry', cls: 'jerry', svg: jerrySvg }],
    thorLoki: [{ name: 'Thor', cls: 'thor', svg: thorSvg }, { name: 'Loki', cls: 'loki', svg: lokiSvg }],
    spongePatrick: [{ name: 'SpongeBob', cls: 'spongebob', svg: spongebobSvg }, { name: 'Patrick', cls: 'patrick', svg: patrickSvg }],
    phineasFerb: [fig('Phineas', 'phineas', '#f08a24'), fig('Ferb', 'ferb', '#4fc27a')],
    rickMorty: [fig('Rick', 'rick', '#a9d6e8'), fig('Morty', 'morty', '#f5d33f')],
    elsaAnna: [fig('Elsa', 'elsa', '#8fd0f2'), fig('Anna', 'anna', '#e0609a')],
    mcqueenHook: [fig('Lightning McQueen', 'mcqueen', '#ff5a5f'), fig('Hook', 'hook', '#d99a6a')],
    gruMinion: [fig('Gru', 'gru', '#b9bcc6'), fig('Minion', 'minion', '#f7d84a')],
    poShifu: [fig('Po', 'po', '#f7f4ee'), fig('Meister Shifu', 'shifu', '#e07a4a')],
    narutoSasuke: [fig('Naruto', 'naruto', '#f08a24'), fig('Sasuke', 'sasuke', '#8fa2d8')],
    gonKillua: [fig('Gon', 'gon', '#4fc27a'), fig('Killua', 'killua', '#c9b8f2')],
    scoobyShaggy: [fig('Scooby-Doo', 'scooby', '#d9a35a'), fig('Shaggy', 'shaggy', '#9fd04a')],
    ashPikachu: [fig('Ash', 'ash', '#ff5a5f'), fig('Pikachu', 'pikachu', '#f7d33a')],
    bibiTina: [fig('Bibi', 'bibi', '#5fb0ff'), fig('Tina', 'tina', '#ff6a6a')],
    pippiNilsson: [fig('Pippi Langstrumpf', 'pippi', '#ff8a3a'), fig('Herr Nilsson', 'nilsson', '#d9a35a')],
    mickyMinnie: [fig('Micky', 'micky', '#ff5a5f'), fig('Minnie', 'minnie', '#ff7aa8')]
  };
  // Figuren pro Monat (0 = Januar), gilt jedes Jahr …
  const monthSets = ['phineasFerb', 'rickMorty', 'elsaAnna', 'mcqueenHook', 'gruMinion', 'poShifu', 'narutoSasuke', 'gonKillua', 'scoobyShaggy', 'tomJerry', 'thorLoki', 'spongePatrick'];
  // … ausser für diese bestimmten Monate ("Jahr-Monat", Monat ab 1)
  const yearMonthSets = { '2027-10': 'ashPikachu', '2027-11': 'bibiTina', '2027-12': 'pippiNilsson', '2028-1': 'mickyMinnie' };
  const setForMonth = (month, year) => yearMonthSets[year + '-' + (month + 1)] || monthSets[month];
  let currentSet = null;
  let players = [];
  function useCharacters(setName){
    if(setName === currentSet) return;
    currentSet = setName;
    players.forEach(pl => pl.el && pl.el.remove());
    players = characterSets[setName].map(c => ({ ...c, pos: 1, el: null }));
  }
  let n = 31, turn = 0, busy = false, winner = null;
  // Popcorn-Korn: unregelmässige, aufgepuffte Blasen mit Schattierung, Butterflecken und brauner Schale
  const popcornSvg = `<svg viewBox="0 0 20 20" aria-hidden="true">
    <defs>
      <radialGradient id="pcPuff" cx="38%" cy="32%" r="72%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="55%" stop-color="#fbf1d8"/>
        <stop offset="100%" stop-color="#e3c182"/>
      </radialGradient>
      <radialGradient id="pcButter" cx="40%" cy="35%" r="75%">
        <stop offset="0%" stop-color="#fff6d6"/>
        <stop offset="60%" stop-color="#f7dc8e"/>
        <stop offset="100%" stop-color="#d9a640"/>
      </radialGradient>
      <linearGradient id="pcHull" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e8952c"/>
        <stop offset="100%" stop-color="#8a4508"/>
      </linearGradient>
    </defs>
    <path d="M8.2 14.4 C8.6 17.8 12.2 18.8 14 15.8 C13 16.4 10.6 16.6 8.2 14.4 Z" fill="url(#pcHull)" stroke="#6b3606" stroke-width="0.35"/>
    <path d="M9.4 15.6 C10.4 16.6 11.8 16.7 12.8 16.1" fill="none" stroke="#f6b860" stroke-width="0.45" stroke-linecap="round" opacity="0.8"/>
    <path d="M2.5 10.5 C1.5 7.5 3.5 5 6.2 5.6 C7.5 4.2 9.8 5 9.6 7.2 C10.8 8.6 10 11.6 7.6 12.2 C5.6 13.6 3 12.8 2.5 10.5 Z" fill="url(#pcPuff)" stroke="#c9963a" stroke-width="0.45"/>
    <path d="M9.5 6.5 C9.6 3.6 12.4 2.4 14.4 3.8 C16.8 3.6 18.2 6 17.2 8 C18 10.2 15.8 12 13.6 11.2 C11.6 12 9.4 10 9.5 6.5 Z" fill="url(#pcPuff)" stroke="#c9963a" stroke-width="0.45"/>
    <path d="M6.5 5 C6 2.6 8.4 1 10.4 2 C12.4 1.4 13.8 3.4 12.8 5.2 C12.4 7.2 9.6 7.8 8.2 6.8 C7 7 6.4 6 6.5 5 Z" fill="url(#pcPuff)" stroke="#c9963a" stroke-width="0.45"/>
    <path d="M6.4 12 C5.6 9.6 7.8 8 10 8.6 C12 7.6 14.8 9 14.4 11.6 C15.2 13.8 12.8 15.6 10.6 14.8 C8.6 15.6 6.6 14.2 6.4 12 Z" fill="url(#pcButter)" stroke="#c08a2a" stroke-width="0.45"/>
    <path d="M4.2 8.4 Q5.4 9.6 5 11.4 M12.4 5.2 Q13.6 6.6 15.6 6.4 M8.6 3.6 Q9.6 4.8 11.4 4.2 M8.4 11.4 Q10.2 12.6 12.6 11.2" fill="none" stroke="#d6aa58" stroke-width="0.4" stroke-linecap="round" opacity="0.85"/>
    <ellipse cx="13.4" cy="9.4" rx="1.3" ry="0.8" fill="#f2c650" opacity="0.55"/>
    <ellipse cx="4.6" cy="11.4" rx="1" ry="0.6" fill="#f2c650" opacity="0.5"/>
    <ellipse cx="5" cy="7.6" rx="1.2" ry="0.7" fill="#fff" opacity="0.95" transform="rotate(-30 5 7.6)"/>
    <ellipse cx="9.3" cy="3" rx="1" ry="0.55" fill="#fff" opacity="0.95" transform="rotate(-20 9.3 3)"/>
    <ellipse cx="13.6" cy="5" rx="1.1" ry="0.6" fill="#fff" opacity="0.9" transform="rotate(-25 13.6 5)"/>
    <ellipse cx="9" cy="10.2" rx="0.9" ry="0.5" fill="#fff" opacity="0.8" transform="rotate(-20 9 10.2)"/>
  </svg>`;
  const pips = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
  function showDie(v){
    if(!dieBtn) return;
    // Augen als Popcorn: jedes Korn leicht anders gedreht
    dieBtn.innerHTML = Array.from({ length: 9 }, (_, i) => pips[v].includes(i + 1)
      ? `<span style="transform:rotate(${(i * 47) % 360}deg)">${popcornSvg}</span>` : '<i></i>').join('');
  }
  function status(){
    if(!statusEl) return;
    const p = players[turn];
    statusEl.innerHTML = winner
      ? `<span class="${winner.cls}"${winner.color ? ` style="color:${winner.color}"` : ''}>${winner.name}</span> gewinnt! 🎉`
      : `<span class="${p.cls}"${p.color ? ` style="color:${p.color}"` : ''}>${p.name}</span> ist dran – würfeln!`;
    players.forEach((pl, i) => pl.el && pl.el.classList.toggle('active', !winner && i === turn && !busy));
  }
  function place(instant){
    if(!layer) return;
    players.forEach((pl, i) => {
      if(!pl.el){ pl.el = document.createElement('div'); pl.el.className = 'pawn char ' + pl.cls; pl.el.innerHTML = pl.svg; layer.appendChild(pl.el); }
      const c = calCellCenter(pl.pos);
      if(!c) return;
      const share = players.filter(o => o.pos === pl.pos).length > 1;
      const ox = share ? (i === 0 ? -11 : 11) : 0;
      const w = pl.el.offsetWidth, h = pl.el.offsetHeight;
      if(instant) pl.el.style.transition = 'none';
      pl.el.style.transform = `translate(${(c.x - w / 2 + ox).toFixed(1)}px, ${(c.y - h * 0.62).toFixed(1)}px)`;
      if(instant){ void pl.el.offsetWidth; pl.el.style.transition = ''; }
    });
  }
  const wait = (ms) => new Promise(res => setTimeout(res, ms));
  async function roll(){
    if(busy || winner) return;
    busy = true; status();
    dieBtn.classList.add('rolling');
    // Popcorn in der Maschine springt auf, solange der Würfel rollt
    if(machine){ machine.classList.remove('popping'); void machine.offsetWidth; machine.classList.add('popping'); }
    for(let k = 0; k < 6; k++){ showDie(1 + Math.floor(Math.random() * 6)); await wait(90); }
    const v = 1 + Math.floor(Math.random() * 6);
    showDie(v);
    dieBtn.classList.remove('rolling');
    const p = players[turn];
    // Feld für Feld weiterziehen; wer über das Ziel hinaus würfelt, läuft zurück
    let dir = 1;
    for(let k = 0; k < v; k++){
      if(p.pos === n) dir = -1;
      p.pos += dir;
      place(false);
      await wait(260);
    }
    if(calLinks[p.pos]){
      await wait(250);
      p.el.classList.add('climb');
      p.pos = calLinks[p.pos];
      place(false);
      await wait(950);
      p.el.classList.remove('climb');
    }
    if(p.pos === n) winner = p;
    else if(v !== 6) turn = (turn + 1) % players.length; // bei einer 6 nochmal
    busy = false;
    status();
  }
  function reset(days, month, year){
    n = days || n;
    if(month != null) useCharacters(setForMonth(month, year));
    players.forEach(pl => { pl.pos = 1; });
    turn = 0; winner = null; busy = false;
    showDie(1);
    status();
  }
  useCharacters(setForMonth(new Date().getMonth(), new Date().getFullYear()));
  // Popcorn-Maschine um den Würfel: ein Häufchen Popcorn am Boden des Glaskastens
  const machine = document.getElementById('popcorn-machine');
  const pile = document.getElementById('pm-pile');
  if(pile){
    const kernels = [[4, 0, 10], [14, 2, 200], [24, 0, 80], [34, 1, 300], [44, 0, 140], [54, 2, 30], [64, 0, 250], [9, 7, 120], [29, 8, 330], [49, 7, 60], [59, 6, 190], [19, 9, 280], [39, 10, 100]];
    pile.innerHTML = kernels.map(([x, y, r], i) =>
      `<span style="left:${x}%;bottom:${y}px;--r:${r}deg;--d:${(i % 5) * 0.06}s">${popcornSvg}</span>`).join('');
  }
  if(machine) machine.addEventListener('animationend', (e) => { if(e.target.closest('.pm-pile')) machine.classList.remove('popping'); });
  if(dieBtn) dieBtn.addEventListener('click', roll);
  const resetBtn = document.getElementById('ladder-reset');
  if(resetBtn) resetBtn.addEventListener('click', () => {
    // Filmklappe schlägt zu
    resetBtn.classList.remove('clap'); void resetBtn.offsetWidth; resetBtn.classList.add('clap');
    reset(); place(true);
  });
  return { reset, place, setFor: setForMonth };
})();

function renderCalEntries(){
  const d = new Date(calSelectedDate + 'T12:00:00');
  calSelectedLabel.textContent = weekdayFull[d.getDay()] + ', ' + d.getDate() + '. ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();

  const entries = calEvents[calSelectedDate] || [];
  if(entries.length === 0){
    calEntryList.innerHTML = `<div class="todo-empty">Noch keine Einträge für diesen Tag.</div>`;
    return;
  }
  calEntryList.innerHTML = entries.map((text, i) => `
    <li class="todo-item film-frame">
      <div class="todo-top">
        <span class="todo-pin">🎬 Szene ${i + 1}</span>
        <button class="todo-del" data-idx="${i}">✕</button>
      </div>
      <span class="todo-text">${text}</span>
    </li>
  `).join('');

  calEntryList.querySelectorAll('.todo-del').forEach(btn => {
    btn.addEventListener('click', () => {
      calEvents[calSelectedDate].splice(btn.dataset.idx, 1);
      renderCalEntries();
      renderCalendar();
    });
  });
}

function addCalEntry(){
  const val = calEntryInput.value.trim();
  if(!val) return;
  if(!calEvents[calSelectedDate]) calEvents[calSelectedDate] = [];
  calEvents[calSelectedDate].push(val);
  calEntryInput.value = '';
  filmReelLen = 0; // Feld ist leer, Filmrolle zählt von vorne
  renderCalEntries();
  renderCalendar();
}

document.getElementById('cal-prev').addEventListener('click', () => {
  calViewMonth--;
  if(calViewMonth < 0){ calViewMonth = 11; calViewYear--; }
  renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', () => {
  calViewMonth++;
  if(calViewMonth > 11){ calViewMonth = 0; calViewYear++; }
  renderCalendar();
});
document.getElementById('cal-today-btn').addEventListener('click', () => {
  calViewYear = today.getFullYear();
  calViewMonth = today.getMonth();
  calSelectedDate = fmtDate(today);
  renderCalendar();
  renderCalEntries();
});
// Filmrolle: dreht sich bei jedem getippten Buchstaben ein Stück weiter (beim Löschen zurück)
const filmReel = document.querySelector('.film-reel');
let filmReelAngle = 0, filmReelLen = calEntryInput.value.length;
calEntryInput.addEventListener('input', () => {
  const len = calEntryInput.value.length;
  filmReelAngle += (len - filmReelLen) * 30;
  filmReelLen = len;
  if(filmReel) filmReel.style.transform = `rotate(${filmReelAngle}deg)`;
});
calEntryAddBtn.addEventListener('click', addCalEntry);
calEntryInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') addCalEntry();
});

renderCalendar();
renderCalEntries();

// Rechner (rechnet wie ein echter Taschenrechner: sofortige Verkettung statt Formel-Auswertung)
const calcDisplay = document.getElementById('calc-display');
const calcExprEl = document.getElementById('calc-expr');
const calcOpSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

let calcCurrent = '0';
let calcPrevious = null;
let calcOperator = null;
let calcOverwrite = true;
let calcLastOperator = null;
let calcLastOperand = null;
let calcHistoryText = '';

function calcCompute(a, op, b){
  switch(op){
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function calcFormat(n){
  if(!isFinite(n)) return 'Fehler';
  return String(Math.round(n * 1e10) / 1e10);
}

function calcDisp(n){
  return calcFormat(n).replace('.', ',');
}

function calcUpdateDisplay(){
  calcDisplay.textContent = calcCurrent === 'Fehler' ? 'Fehler' : calcCurrent.replace('.', ',');
  if(calcHistoryText){
    calcExprEl.textContent = calcHistoryText;
  } else if(calcOperator !== null){
    calcExprEl.textContent = calcDisp(calcPrevious) + ' ' + calcOpSymbols[calcOperator];
  } else {
    calcExprEl.textContent = '';
  }
}

function calcInputDigit(d){
  if(calcCurrent === 'Fehler' || calcOverwrite){
    if(calcOperator === null) calcHistoryText = '';
    calcCurrent = d;
    calcOverwrite = false;
  } else if(calcCurrent === '0'){
    calcCurrent = d;
  } else {
    calcCurrent += d;
  }
}

function calcInputDot(){
  if(calcCurrent === 'Fehler' || calcOverwrite){
    if(calcOperator === null) calcHistoryText = '';
    calcCurrent = '0.';
    calcOverwrite = false;
    return;
  }
  if(!calcCurrent.includes('.')) calcCurrent += '.';
}

function calcSetOperator(op){
  if(calcCurrent === 'Fehler') return;
  calcHistoryText = '';
  if(calcOperator !== null && !calcOverwrite){
    const result = calcCompute(calcPrevious, calcOperator, parseFloat(calcCurrent));
    calcCurrent = calcFormat(result);
    if(calcCurrent === 'Fehler'){ calcOperator = null; calcPrevious = null; calcOverwrite = true; return; }
    calcPrevious = parseFloat(calcCurrent);
  } else {
    calcPrevious = parseFloat(calcCurrent);
  }
  calcOperator = op;
  calcOverwrite = true;
  calcLastOperator = null;
  calcLastOperand = null;
}

function calcEquals(){
  if(calcCurrent === 'Fehler') return;
  let a, op, b;
  if(calcOperator !== null){
    a = calcPrevious;
    op = calcOperator;
    b = parseFloat(calcCurrent);
    calcLastOperator = op;
    calcLastOperand = b;
  } else if(calcLastOperator !== null){
    a = parseFloat(calcCurrent);
    op = calcLastOperator;
    b = calcLastOperand;
  } else {
    return;
  }
  calcHistoryText = calcDisp(a) + ' ' + calcOpSymbols[op] + ' ' + calcDisp(b) + ' =';
  calcCurrent = calcFormat(calcCompute(a, op, b));
  calcPrevious = null;
  calcOperator = null;
  calcOverwrite = true;
}

function calcPercent(){
  if(calcCurrent === 'Fehler') return;
  const cur = parseFloat(calcCurrent);
  if(calcOperator !== null && calcPrevious !== null){
    calcCurrent = calcFormat(calcPrevious * (cur / 100));
  } else {
    calcCurrent = calcFormat(cur / 100);
  }
  calcOverwrite = false;
}

function calcBackspace(){
  if(calcCurrent === 'Fehler'){ calcClear(); return; }
  if(calcOverwrite) return;
  calcCurrent = calcCurrent.slice(0, -1);
  if(calcCurrent === '' || calcCurrent === '-') calcCurrent = '0';
}

function calcClear(){
  calcCurrent = '0';
  calcPrevious = null;
  calcOperator = null;
  calcOverwrite = true;
  calcLastOperator = null;
  calcLastOperand = null;
  calcHistoryText = '';
}

function calcPress(key){
  if(key === 'C') calcClear();
  else if(key === 'back') calcBackspace();
  else if(key === '=') calcEquals();
  else if(key === '%') calcPercent();
  else if(key === '+' || key === '-' || key === '*' || key === '/') calcSetOperator(key);
  else if(key === '.') calcInputDot();
  else if(/^[0-9]$/.test(key)) calcInputDigit(key);
  calcUpdateDisplay();
}

document.querySelectorAll('.calc-btn').forEach(btn => {
  btn.addEventListener('click', () => calcPress(btn.dataset.key));
});
calcUpdateDisplay();

document.addEventListener('keydown', (e) => {
  const calcView = document.getElementById('calc-view');
  if(!calcView.classList.contains('active')) return;
  const activeTag = document.activeElement.tagName;
  if(activeTag === 'INPUT' || activeTag === 'SELECT' || activeTag === 'TEXTAREA') return;

  const keyMap = {
    'Enter': '=', '=': '=',
    'Backspace': 'back',
    'Escape': 'C',
    '*': '*', 'x': '*', 'X': '*',
    '/': '/',
    '+': '+',
    '-': '-',
    '.': '.', ',': '.',
    '%': '%'
  };

  if(/^[0-9]$/.test(e.key)){
    e.preventDefault();
    calcPress(e.key);
  } else if(keyMap[e.key] !== undefined){
    e.preventDefault();
    calcPress(keyMap[e.key]);
  }
});

// Umrechner — Einheiten
const convUnitCategories = {
  length: { units: { mm:'mm', cm:'cm', m:'m', km:'km', in:'Zoll', ft:'Fuss', mi:'Meile' }, factors: { mm:0.001, cm:0.01, m:1, km:1000, in:0.0254, ft:0.3048, mi:1609.344 } },
  weight: { units: { mg:'mg', g:'g', kg:'kg', t:'Tonne', oz:'Unze', lb:'Pfund' }, factors: { mg:0.000001, g:0.001, kg:1, t:1000, oz:0.0283495, lb:0.453592 } },
  temp: { units: { C:'°C', F:'°F', K:'Kelvin' } },
};
let convCategory = 'length';

const convCatSelectEl = document.getElementById('conv-cat-select');
const convUnitFromValue = document.getElementById('conv-unit-from-value');
const convUnitFromUnit = document.getElementById('conv-unit-from-unit');
const convUnitToValue = document.getElementById('conv-unit-to-value');
const convUnitToUnit = document.getElementById('conv-unit-to-unit');
const convUnitSwapBtn = document.getElementById('conv-unit-swap');

function convTempToC(unit, v){
  if(unit === 'C') return v;
  if(unit === 'F') return (v - 32) * 5 / 9;
  return v - 273.15;
}
function convTempFromC(unit, c){
  if(unit === 'C') return c;
  if(unit === 'F') return c * 9 / 5 + 32;
  return c + 273.15;
}

function convPopulateUnitSelects(){
  const def = convUnitCategories[convCategory];
  const keys = Object.keys(def.units);
  [convUnitFromUnit, convUnitToUnit].forEach(sel => {
    sel.innerHTML = keys.map(u => `<option value="${u}">${def.units[u]}</option>`).join('');
  });
  convUnitFromUnit.value = keys[0];
  convUnitToUnit.value = keys[1] || keys[0];
}

function convUpdateUnitResult(){
  const def = convUnitCategories[convCategory];
  const fromUnit = convUnitFromUnit.value;
  const toUnit = convUnitToUnit.value;
  const val = parseFloat(convUnitFromValue.value);
  if(isNaN(val)){ convUnitToValue.value = ''; return; }
  let result;
  if(convCategory === 'temp'){
    result = convTempFromC(toUnit, convTempToC(fromUnit, val));
  } else {
    result = (val * def.factors[fromUnit]) / def.factors[toUnit];
  }
  convUnitToValue.value = Math.round(result * 1e6) / 1e6;
}

convCatSelectEl.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    convCatSelectEl.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    convCategory = btn.dataset.cat;
    convPopulateUnitSelects();
    convUpdateUnitResult();
  });
});
convUnitFromValue.addEventListener('input', convUpdateUnitResult);
convUnitFromUnit.addEventListener('change', convUpdateUnitResult);
convUnitToUnit.addEventListener('change', convUpdateUnitResult);
convUnitSwapBtn.addEventListener('click', () => {
  const tmp = convUnitFromUnit.value;
  convUnitFromUnit.value = convUnitToUnit.value;
  convUnitToUnit.value = tmp;
  convUpdateUnitResult();
});

convPopulateUnitSelects();
convUpdateUnitResult();

// Umrechner — Währung
const convCurrencies = ['CHF', 'EUR', 'USD', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'TRY', 'INR', 'BRL', 'MXN', 'ZAR', 'SGD', 'HKD', 'KRW', 'THB', 'ILS', 'RON', 'IDR', 'MYR', 'PHP', 'ISK', 'BGN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU', 'PYG', 'BOB', 'CRC', 'GTQ', 'DOP', 'JMD', 'TTD', 'EGP', 'MAD', 'TND', 'DZD', 'NGN', 'GHS', 'KES', 'TZS', 'UGX', 'ETB', 'SAR', 'AED', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'PKR', 'BDT', 'LKR', 'NPR', 'VND', 'TWD', 'KHR', 'MNT', 'KZT', 'UAH', 'RSD', 'GEL', 'AMD', 'AZN', 'MDL', 'ALL', 'MKD', 'BAM', 'RUB', 'FJD'];
const convCurFromValue = document.getElementById('conv-cur-from-value');
const convCurFromUnit = document.getElementById('conv-cur-from-unit');
const convCurToValue = document.getElementById('conv-cur-to-value');
const convCurToUnit = document.getElementById('conv-cur-to-unit');
const convCurSwapBtn = document.getElementById('conv-cur-swap');
const convCurStatusEl = document.getElementById('conv-cur-status');

[convCurFromUnit, convCurToUnit].forEach(sel => {
  sel.innerHTML = convCurrencies.map(c => `<option value="${c}">${c}</option>`).join('');
});
convCurFromUnit.value = 'CHF';
convCurToUnit.value = 'EUR';

// Statt Währungs-Kürzel eine Flagge: eigene Auswahl mit Flaggen-Bildern (Flaggen-Emojis gehen unter Windows nicht).
// Das versteckte <select> bleibt die Quelle für die Umrechnung.
const convCurFlagCode = { CHF: 'ch', EUR: 'eu', USD: 'us', GBP: 'gb', JPY: 'jp', CNY: 'cn', CAD: 'ca', AUD: 'au', NZD: 'nz', SEK: 'se', NOK: 'no', DKK: 'dk', PLN: 'pl', CZK: 'cz', HUF: 'hu', TRY: 'tr', INR: 'in', BRL: 'br', MXN: 'mx', ZAR: 'za', SGD: 'sg', HKD: 'hk', KRW: 'kr', THB: 'th', ILS: 'il', RON: 'ro', IDR: 'id', MYR: 'my', PHP: 'ph', ISK: 'is', BGN: 'bg', ARS: 'ar', CLP: 'cl', COP: 'co', PEN: 'pe', UYU: 'uy', PYG: 'py', BOB: 'bo', CRC: 'cr', GTQ: 'gt', DOP: 'do', JMD: 'jm', TTD: 'tt', EGP: 'eg', MAD: 'ma', TND: 'tn', DZD: 'dz', NGN: 'ng', GHS: 'gh', KES: 'ke', TZS: 'tz', UGX: 'ug', ETB: 'et', SAR: 'sa', AED: 'ae', QAR: 'qa', KWD: 'kw', BHD: 'bh', OMR: 'om', JOD: 'jo', PKR: 'pk', BDT: 'bd', LKR: 'lk', NPR: 'np', VND: 'vn', TWD: 'tw', KHR: 'kh', MNT: 'mn', KZT: 'kz', UAH: 'ua', RSD: 'rs', GEL: 'ge', AMD: 'am', AZN: 'az', MDL: 'md', ALL: 'al', MKD: 'mk', BAM: 'ba', RUB: 'ru', FJD: 'fj' };
const flagImg = (cur) => `<img src="https://flagcdn.com/w80/${convCurFlagCode[cur]}.png" alt="${cur}" loading="lazy" />`;
const convFlagPickers = [convCurFromUnit, convCurToUnit].map(sel => {
  sel.classList.add('flag-select-hidden');
  const picker = document.createElement('div');
  picker.className = 'flag-picker';
  picker.innerHTML = `<button type="button" class="flag-btn" aria-haspopup="listbox"></button>
    <div class="flag-menu" role="listbox">${convCurrencies.map(c => `<button type="button" class="flag-opt" data-cur="${c}" title="${c}" aria-label="${c}">${flagImg(c)}</button>`).join('')}</div>`;
  sel.insertAdjacentElement('afterend', picker);
  const btn = picker.querySelector('.flag-btn');
  const sync = () => {
    btn.innerHTML = flagImg(sel.value) + '<span class="flag-caret">▾</span>';
    btn.title = sel.value;
    picker.querySelectorAll('.flag-opt').forEach(o => o.classList.toggle('active', o.dataset.cur === sel.value));
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !picker.classList.contains('open');
    document.querySelectorAll('.flag-picker.open').forEach(p => p.classList.remove('open'));
    picker.classList.toggle('open', open);
  });
  picker.querySelectorAll('.flag-opt').forEach(o => o.addEventListener('click', (e) => {
    e.stopPropagation();
    sel.value = o.dataset.cur;
    picker.classList.remove('open');
    sync();
    sel.dispatchEvent(new Event('change'));
  }));
  sync();
  return sync;
});
document.addEventListener('click', () => document.querySelectorAll('.flag-picker.open').forEach(p => p.classList.remove('open')));

let convCurRatesCache = {};

async function convFetchRates(base){
  if(convCurRatesCache[base]) return convCurRatesCache[base];
  convCurStatusEl.textContent = 'Kurse werden geladen …';
  try{
    // open.er-api.com: kostenlos, rund 160 Währungen (Frankfurter hatte nur 31)
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const data = await res.json();
    if(data.result !== 'success') throw new Error('Kurse nicht verfügbar');
    convCurRatesCache[base] = data.rates;
    convCurStatusEl.textContent = '';
    return data.rates;
  } catch(err){
    convCurStatusEl.textContent = 'Kurse gerade nicht verfügbar.';
    return null;
  }
}

async function convUpdateCurrencyResult(){
  const from = convCurFromUnit.value;
  const to = convCurToUnit.value;
  const val = parseFloat(convCurFromValue.value);
  if(isNaN(val)){ convCurToValue.value = ''; return; }
  if(from === to){ convCurToValue.value = val; return; }
  const rates = await convFetchRates(from);
  if(!rates || rates[to] === undefined){ convCurToValue.value = ''; return; }
  convCurToValue.value = Math.round(val * rates[to] * 100) / 100;
}

convCurFromValue.addEventListener('input', convUpdateCurrencyResult);
convCurFromUnit.addEventListener('change', convUpdateCurrencyResult);
convCurToUnit.addEventListener('change', convUpdateCurrencyResult);
convCurSwapBtn.addEventListener('click', () => {
  const tmp = convCurFromUnit.value;
  convCurFromUnit.value = convCurToUnit.value;
  convCurToUnit.value = tmp;
  convFlagPickers.forEach(sync => sync());
  convUpdateCurrencyResult();
});

// Tauschen-Knöpfe: Pfeile spielen beim Klick einmal die Loop-Animation
document.querySelectorAll('.conv-swap-btn').forEach(btn => {
  btn.addEventListener('click', () => { btn.classList.remove('swapping'); void btn.offsetWidth; btn.classList.add('swapping'); });
  btn.addEventListener('animationend', () => btn.classList.remove('swapping'));
});

const convModeSelectEl = document.getElementById('conv-mode-select');
const convUnitPanel = document.getElementById('conv-unit-panel');
const convCurrencyPanel = document.getElementById('conv-currency-panel');
convModeSelectEl.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    convModeSelectEl.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const mode = btn.dataset.mode;
    convUnitPanel.style.display = mode === 'unit' ? 'block' : 'none';
    convCurrencyPanel.style.display = mode === 'currency' ? 'block' : 'none';
  });
});

// Game Boy: Menü-Cursor. ▲▼ wählt die Zeile, ◀▶ ändert sie, A tauscht, B wechselt Einheiten↔Währung,
// SELECT springt zur nächsten Zeile, START setzt den Wert auf 1. Pfeiltasten und A/B auf der Tastatur gehen auch.
const gbScreen = document.getElementById('gb-screen');
const gbCursorEl = document.getElementById('gb-cursor');
let gbRow = 'value';
const gbIsCurrency = () => convCurrencyPanel.style.display !== 'none';
const gbRows = () => gbIsCurrency() ? ['mode', 'from', 'value', 'to'] : ['mode', 'cat', 'from', 'value', 'to'];
function gbTarget(row){
  const cur = gbIsCurrency();
  switch(row){
    case 'mode': return document.getElementById('conv-mode-select');
    case 'cat': return document.getElementById('conv-cat-select');
    case 'from': return cur ? document.querySelector('#conv-cur-from-unit + .flag-picker .flag-btn') : document.getElementById('conv-unit-from-unit');
    case 'value': return document.getElementById(cur ? 'conv-cur-from-value' : 'conv-unit-from-value');
    case 'to': return cur ? document.querySelector('#conv-cur-to-unit + .flag-picker .flag-btn') : document.getElementById('conv-unit-to-unit');
  }
  return null;
}
function gbRender(){
  if(!gbScreen || gbScreen.offsetParent === null) return;
  if(!gbRows().includes(gbRow)) gbRow = 'mode';
  document.querySelectorAll('.gameboy .gb-focus').forEach(el => el.classList.remove('gb-focus'));
  const el = gbTarget(gbRow);
  if(!el) return;
  el.classList.add('gb-focus');
  const sr = gbScreen.getBoundingClientRect(), er = el.getBoundingClientRect();
  gbCursorEl.style.top = (er.top - sr.top + er.height / 2 - 6) + 'px';
}
function gbCycleSelect(sel, dir){
  const n = sel.options.length;
  if(!n) return;
  sel.selectedIndex = (sel.selectedIndex + dir + n) % n;
  sel.dispatchEvent(new Event('change'));
}
function gbCycleCurrency(sel, dir){
  const i = convCurrencies.indexOf(sel.value);
  sel.value = convCurrencies[(i + dir + convCurrencies.length) % convCurrencies.length];
  convFlagPickers.forEach(sync => sync());
  convUpdateCurrencyResult();
}
function gbPress(key){
  const cur = gbIsCurrency();
  const fromInput = document.getElementById(cur ? 'conv-cur-from-value' : 'conv-unit-from-value');
  const setValue = (v) => { fromInput.value = Math.round(v * 1000) / 1000; fromInput.dispatchEvent(new Event('input')); };
  const rows = gbRows();
  const toggleMode = () => {
    const other = convModeSelectEl.querySelector(`.mode-btn[data-mode="${cur ? 'unit' : 'currency'}"]`);
    if(other) other.click();
  };
  switch(key){
    case 'up': gbRow = rows[(rows.indexOf(gbRow) - 1 + rows.length) % rows.length]; break;
    case 'down': case 'select': gbRow = rows[(rows.indexOf(gbRow) + 1) % rows.length]; break;
    case 'a': document.getElementById(cur ? 'conv-cur-swap' : 'conv-unit-swap').click(); break;
    case 'b': toggleMode(); break;
    case 'start': setValue(1); break;
    case 'left': case 'right': {
      const dir = key === 'right' ? 1 : -1;
      if(gbRow === 'mode') toggleMode();
      else if(gbRow === 'cat'){
        const cats = [...document.querySelectorAll('#conv-cat-select .diff-btn')];
        const i = cats.findIndex(c => c.classList.contains('active'));
        cats[(i + dir + cats.length) % cats.length].click();
      }
      else if(gbRow === 'value') setValue((parseFloat(fromInput.value) || 0) + dir);
      else if(gbRow === 'from') cur ? gbCycleCurrency(convCurFromUnit, dir) : gbCycleSelect(document.getElementById('conv-unit-from-unit'), dir);
      else if(gbRow === 'to') cur ? gbCycleCurrency(convCurToUnit, dir) : gbCycleSelect(document.getElementById('conv-unit-to-unit'), dir);
      break;
    }
  }
  requestAnimationFrame(gbRender);
}
document.querySelectorAll('.gameboy [data-gb]').forEach(btn => btn.addEventListener('click', () => gbPress(btn.dataset.gb)));
// Klick auf eine Zeile setzt den Cursor dorthin
document.querySelector('.gameboy')?.addEventListener('pointerdown', (e) => {
  const map = [['#conv-mode-select', 'mode'], ['#conv-cat-select', 'cat'], ['#conv-unit-from-unit, #conv-cur-from-unit + .flag-picker', 'from'],
    ['#conv-unit-from-value, #conv-cur-from-value', 'value'], ['#conv-unit-to-unit, #conv-cur-to-unit + .flag-picker', 'to']];
  for(const [sel, row] of map){ if(e.target.closest(sel)){ gbRow = row; requestAnimationFrame(gbRender); break; } }
});
convModeSelectEl.addEventListener('click', () => requestAnimationFrame(gbRender));
if(gbScreen && 'ResizeObserver' in window) new ResizeObserver(() => gbRender()).observe(gbScreen);
document.addEventListener('keydown', (e) => {
  if(!document.getElementById('calc-view').classList.contains('active')) return;
  const tag = document.activeElement.tagName;
  if(tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
  const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', a: 'a', A: 'a', b: 'b', B: 'b' };
  if(map[e.key]){ e.preventDefault(); gbPress(map[e.key]); }
});

convUpdateCurrencyResult();

// Timer
const timerDisplay = document.getElementById('timer-display');
const timerMinInput = document.getElementById('timer-min-input');
const timerSecInput = document.getElementById('timer-sec-input');
const timerSetBtn = document.getElementById('timer-set-btn');
const timerStartBtn = document.getElementById('timer-start-btn');
const timerPauseBtn = document.getElementById('timer-pause-btn');
const timerResetBtn = document.getElementById('timer-reset-btn');
const timerStatus = document.getElementById('timer-status');

const timerHourInput = document.getElementById('timer-hour-input');

let timerTotalSeconds = 0;
let timerRemaining = 0;
let timerInterval = null;

function fmtTimer(totalSec){
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if(h > 0){
    return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  }
  return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function timerRender(){
  timerDisplay.textContent = fmtTimer(timerRemaining);
}

function timerTick(){
  if(timerRemaining <= 0){
    clearInterval(timerInterval);
    timerInterval = null;
    timerStartBtn.classList.remove('running');
    timerStatus.textContent = '⏰ Zeit abgelaufen!';
    return;
  }
  timerRemaining--;
  timerRender();
}

timerSetBtn.addEventListener('click', () => {
  const hrs = parseInt(timerHourInput.value, 10) || 0;
  const min = parseInt(timerMinInput.value, 10) || 0;
  const sec = parseInt(timerSecInput.value, 10) || 0;
  timerTotalSeconds = hrs * 3600 + min * 60 + sec;
  timerRemaining = timerTotalSeconds;
  timerStatus.textContent = '';
  timerRender();
});

timerStartBtn.addEventListener('click', () => {
  if(timerInterval || timerRemaining <= 0) return;
  timerStatus.textContent = '';
  timerStartBtn.classList.add('running');
  timerInterval = setInterval(timerTick, 1000);
});

timerPauseBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerStartBtn.classList.remove('running');
});

timerResetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerStartBtn.classList.remove('running');
  timerRemaining = 0;
  timerTotalSeconds = 0;
  timerStatus.textContent = '';
  timerRender();
});

timerRender();

// Stoppuhr (mit Millisekunden)
const stopwatchDisplay = document.getElementById('stopwatch-display');
const stopwatchToggleBtn = document.getElementById('stopwatch-toggle-btn');
const stopwatchResetBtn = document.getElementById('stopwatch-reset-btn');

let stopwatchElapsed = 0;    // aufsummierte Millisekunden, während pausiert
let stopwatchStartTime = null; // performance.now() beim Start, während sie läuft
let stopwatchInterval = null;

function fmtStopwatch(totalMs){
  const totalSec = Math.floor(totalMs / 1000);
  const ms = totalMs % 1000;
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const msStr = String(Math.floor(ms / 10)).padStart(2, '0');
  if(h > 0){
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + msStr;
  }
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + msStr;
}

function stopwatchCurrentMs(){
  if(stopwatchStartTime !== null){
    return stopwatchElapsed + (performance.now() - stopwatchStartTime);
  }
  return stopwatchElapsed;
}

function stopwatchRender(){
  stopwatchDisplay.textContent = fmtStopwatch(Math.floor(stopwatchCurrentMs()));
}

stopwatchToggleBtn.addEventListener('click', () => {
  if(stopwatchInterval){
    // läuft -> stoppen
    stopwatchElapsed = stopwatchCurrentMs();
    stopwatchStartTime = null;
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchToggleBtn.classList.remove('running');
    stopwatchToggleBtn.textContent = '▶ Start';
    stopwatchRender();
  } else {
    // gestoppt -> starten
    stopwatchToggleBtn.classList.add('running');
    stopwatchToggleBtn.textContent = '⏸ Pause';
    stopwatchStartTime = performance.now();
    stopwatchInterval = setInterval(stopwatchRender, 31);
  }
});

stopwatchResetBtn.addEventListener('click', () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchStartTime = null;
  stopwatchToggleBtn.classList.remove('running');
  stopwatchToggleBtn.textContent = '▶ Start';
  stopwatchElapsed = 0;
  stopwatchRender();
});

stopwatchRender();

// Sudoku
const sudokuGrid = document.getElementById('sudoku-grid');
const sudokuStatus = document.getElementById('sudoku-status');
let sudokuSolution = null;
let sudokuGivenMask = null;
let sudokuDifficulty = 'easy';
const sudokuGivensByDiff = { easy: 42, medium: 32, hard: 25 };

function sudokuIsValid(grid, row, col, num){
  for(let x = 0; x < 9; x++){
    if(grid[row][x] === num || grid[x][col] === num) return false;
  }
  const startRow = row - row % 3, startCol = col - col % 3;
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(grid[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

function sudokuShuffle(arr){
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sudokuGenerateSolved(){
  const grid = Array.from({length: 9}, () => Array(9).fill(0));
  function fill(pos){
    if(pos === 81) return true;
    const row = Math.floor(pos / 9), col = pos % 9;
    const nums = sudokuShuffle([1,2,3,4,5,6,7,8,9]);
    for(const num of nums){
      if(sudokuIsValid(grid, row, col, num)){
        grid[row][col] = num;
        if(fill(pos + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }
  fill(0);
  return grid;
}

function sudokuMakePuzzle(solution, givens){
  const puzzle = solution.map(r => r.slice());
  const mask = Array.from({length: 9}, () => Array(9).fill(true));
  const positions = sudokuShuffle([...Array(81).keys()]);
  const toRemove = 81 - givens;
  for(let i = 0; i < toRemove; i++){
    const pos = positions[i];
    const r = Math.floor(pos / 9), c = pos % 9;
    puzzle[r][c] = 0;
    mask[r][c] = false;
  }
  return { puzzle, mask };
}

function sudokuNewGame(){
  sudokuStatus.textContent = 'Der Bus ist gestartet – viel Glück!';
  sudokuSolution = sudokuGenerateSolved();
  const givens = sudokuGivensByDiff[sudokuDifficulty];
  const { puzzle, mask } = sudokuMakePuzzle(sudokuSolution, givens);
  sudokuGivenMask = mask;
  sudokuRender(puzzle);
}

function sudokuHighlightSame(value){
  const cells = sudokuGrid.querySelectorAll('.sudoku-cell');
  cells.forEach(c => c.classList.remove('same-value'));
  if(!value) return;
  cells.forEach(c => {
    if(c.value === value) c.classList.add('same-value');
  });
}

function sudokuRender(puzzle){
  sudokuGrid.innerHTML = '';
  for(let r = 0; r < 9; r++){
    for(let c = 0; c < 9; c++){
      const cell = document.createElement('input');
      cell.className = 'sudoku-cell';
      cell.maxLength = 1;
      cell.inputMode = 'numeric';
      cell.dataset.row = r;
      cell.dataset.col = c;
      if(c === 2 || c === 5) cell.classList.add('border-right');
      if(r === 2 || r === 5) cell.classList.add('border-bottom');

      if(sudokuGivenMask[r][c]){
        cell.value = puzzle[r][c];
        cell.classList.add('given');
        cell.readOnly = true;
      } else {
        cell.value = puzzle[r][c] === 0 ? '' : puzzle[r][c];
        cell.addEventListener('input', () => {
          cell.value = cell.value.replace(/[^1-9]/g, '').slice(0, 1);
          cell.classList.remove('wrong', 'right');
          if(cell.value !== '' && parseInt(cell.value, 10) !== sudokuSolution[r][c]){
            cell.classList.add('wrong');
          }
          sudokuHighlightSame(cell.value);
        });
      }
      cell.addEventListener('focus', () => sudokuHighlightSame(cell.value));
      sudokuGrid.appendChild(cell);
    }
  }
}

function sudokuCheck(){
  const cells = sudokuGrid.querySelectorAll('.sudoku-cell');
  let filled = 0, correct = 0;
  cells.forEach(cell => {
    const r = parseInt(cell.dataset.row, 10), c = parseInt(cell.dataset.col, 10);
    cell.classList.remove('wrong', 'right');
    if(cell.value !== ''){
      filled++;
      const val = parseInt(cell.value, 10);
      if(val === sudokuSolution[r][c]){
        correct++;
        cell.classList.add('right');
      } else {
        cell.classList.add('wrong');
      }
    }
  });
  if(filled < 81){
    sudokuStatus.textContent = `Noch ${81 - filled} Gegner übrig.`;
  } else if(correct === 81){
    // Fortnite-Stil: Victory Royale statt einfachem Text
    sudokuStatus.innerHTML = '<span class="fn-victory"><b>#1</b><strong>Victory Royale</strong></span>';
  } else {
    sudokuStatus.textContent = `Sturmschaden! ${81 - correct} Fehler markiert.`;
  }
}

function sudokuShowSolution(){
  sudokuRender(sudokuSolution);
  const cells = sudokuGrid.querySelectorAll('.sudoku-cell');
  cells.forEach(cell => { cell.readOnly = true; cell.classList.add('given'); });
  sudokuStatus.textContent = 'Du schaust jetzt zu.';
}

document.querySelectorAll('#diff-select .diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#diff-select .diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sudokuDifficulty = btn.dataset.diff;
    sudokuNewGame();
  });
});
document.getElementById('sudoku-new-btn').addEventListener('click', sudokuNewGame);
document.getElementById('sudoku-check-btn').addEventListener('click', sudokuCheck);
document.getElementById('sudoku-solve-btn').addEventListener('click', sudokuShowSolution);

sudokuNewGame();

// Fortnite-Modus: HUD (Sturm, Übrig, Elims), Sturm am Spielfeldrand, Battle Bus und Schadenszahlen
const fnRoot = document.querySelector('.fn-sudoku');
const fnStormEl = document.getElementById('fn-storm');
const fnLeftEl = document.getElementById('fn-left');
const fnElimsEl = document.getElementById('fn-elims');
// Sturmzeit je Material: Holz 30, Stein 45, Metall 60 Minuten
const fnStormMinutes = { easy: 30, medium: 45, hard: 60 };
let fnStormMs = fnStormMinutes[sudokuDifficulty] * 60 * 1000;
let fnStormEnd = Date.now() + fnStormMs;
function fnUpdateHud(){
  if(!fnRoot) return;
  const cells = [...sudokuGrid.querySelectorAll('.sudoku-cell')];
  fnLeftEl.textContent = cells.filter(c => c.value === '').length;
  fnElimsEl.textContent = cells.filter(c => !c.classList.contains('given') && c.value !== '').length;
}
// Der Sturm läuft erst, wenn man ins Sudoku geklickt hat
let fnStormRunning = false;
function fnTickStorm(){
  if(!fnRoot) return;
  const left = fnStormRunning ? Math.max(0, fnStormEnd - Date.now()) : fnStormMs;
  const sec = Math.ceil(left / 1000);
  fnStormEl.textContent = left > 0 ? `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}` : 'IM STURM!';
  fnRoot.classList.toggle('in-storm', left === 0);
  fnRoot.style.setProperty('--storm', (1 - left / fnStormMs).toFixed(3));
}
function fnStartRound(){
  if(!fnRoot) return;
  fnStormMs = (fnStormMinutes[sudokuDifficulty] || 30) * 60 * 1000;
  fnStormRunning = false;
  fnTickStorm();
  fnUpdateHud();
  const bus = document.getElementById('fn-bus');
  if(bus){
    bus.classList.remove('flying'); void bus.offsetWidth; bus.classList.add('flying');
    // Nach dem Überflug ist der Bus wieder weg
    bus.onanimationend = (e) => { if(e.target === bus) bus.classList.remove('flying'); };
  }
  // Nach gut einer Sekunde springt jemand aus dem Bus und gleitet auf ein Feld
  // Drei Spieler springen kurz nacheinander ab
  fnJumpTimers.forEach(clearTimeout);
  fnJumpTimers = fnJumpers().map((jumper, i) => setTimeout(() => fnJump(jumper), 1300 + i * 550));
}
let fnJumpTimers = [];
// Den Springer zweimal kopieren, jeder bekommt ein anderes Outfit (Farbton)
function fnJumpers(){
  const base = document.getElementById('fn-jumper');
  if(!base) return [];
  if(!base.dataset.cloned){
    base.dataset.cloned = '1';
    ['150deg', '260deg'].forEach(hue => {
      const c = base.cloneNode(true);
      c.removeAttribute('id');
      c.style.filter = `hue-rotate(${hue})`;
      base.parentNode.insertBefore(c, base.nextSibling);
    });
  }
  return [...document.querySelectorAll('.fn-jumper')];
}
function fnJump(jumper){
  const bus = document.getElementById('fn-bus');
  if(!jumper || !bus || !jumper.animate) return;
  const rr = fnRoot.getBoundingClientRect(), br = bus.getBoundingClientRect();
  const cells = [...sudokuGrid.querySelectorAll('.sudoku-cell')];
  const target = cells[Math.floor(Math.random() * cells.length)].getBoundingClientRect();
  const sx = br.left - rr.left + br.width * 0.45, sy = br.top - rr.top + br.height * 0.75;
  const tx = target.left - rr.left + target.width / 2 - 29, ty = target.top - rr.top - 58;
  const fx = sx + (tx - sx) * 0.25, fy = sy + 70;
  // Alte Sprünge stoppen (ihr eingefrorenes Ende würde den neuen Springer unsichtbar machen)
  jumper.getAnimations().forEach(a => a.cancel());
  jumper.classList.remove('gliding');
  jumper.style.opacity = '1';
  // Freifall mit Drehung …
  const fall = jumper.animate([
    { transform: `translate(${sx}px, ${sy}px) rotate(0deg) scale(0.7)`, opacity: 1 },
    { transform: `translate(${fx}px, ${fy}px) rotate(320deg) scale(1)`, opacity: 1 }
  ], { duration: 900, easing: 'cubic-bezier(.4,0,.9,.6)', fill: 'forwards' });
  fall.onfinish = () => {
    // … dann Gleiter auf und sanft aufs Feld schweben
    jumper.classList.add('gliding');
    const glide = jumper.animate([
      { transform: `translate(${fx}px, ${fy}px) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${(fx + tx) / 2 + 30}px, ${(fy + ty) / 2}px) rotate(-8deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${tx}px, ${ty}px) rotate(4deg)`, opacity: 1, offset: 0.9 },
      { transform: `translate(${tx}px, ${ty + 10}px) rotate(0deg)`, opacity: 0 }
    ], { duration: 3200, easing: 'ease-in-out', fill: 'forwards' });
    glide.onfinish = () => { jumper.getAnimations().forEach(a => a.cancel()); jumper.style.opacity = '0'; jumper.classList.remove('gliding'); };
  };
}
if(fnRoot){
  // Neue Runde: Schwierigkeit oder „Neue Runde“ (läuft nach dem eigentlichen Neustart)
  ['#sudoku-new-btn', '#diff-select .diff-btn'].forEach(sel => document.querySelectorAll(sel).forEach(btn =>
    btn.addEventListener('click', () => setTimeout(fnStartRound, 0))));
  document.getElementById('sudoku-solve-btn').addEventListener('click', () => setTimeout(fnUpdateHud, 0));
  // Erster Klick ins Spielfeld startet den Sturm-Timer
  sudokuGrid.addEventListener('pointerdown', () => {
    if(fnStormRunning) return;
    fnStormRunning = true;
    fnStormEnd = Date.now() + fnStormMs;
    fnTickStorm();
  });
  sudokuGrid.addEventListener('focusin', () => sudokuGrid.dispatchEvent(new Event('pointerdown')));
  sudokuGrid.addEventListener('input', (e) => {
    const cell = e.target;
    fnUpdateHud();
    if(!cell.value) return;
    // Schadenszahl über dem Feld (verrät nicht, ob es richtig ist)
    const rr = fnRoot.getBoundingClientRect(), cr = cell.getBoundingClientRect();
    const dmg = document.createElement('span');
    dmg.className = 'fn-dmg';
    dmg.textContent = cell.value;
    dmg.style.left = (cr.left - rr.left + cr.width * 0.35) + 'px';
    dmg.style.top = (cr.top - rr.top - 6) + 'px';
    fnRoot.appendChild(dmg);
    setTimeout(() => dmg.remove(), 950);
  });
  setInterval(fnTickStorm, 1000);
  fnStartRound();
}

// Loot: auf jedem leeren Feld liegt ein Fortnite-Gegenstand; wird eine Zahl eingetragen, ist er weg
const fnLootSvgs = [
  // Truhe
  '<rect x="6" y="20" width="36" height="20" rx="2" fill="#c98a2a" stroke="#6b4210" stroke-width="2"/><path d="M6 20 Q6 8 24 8 Q42 8 42 20 Z" fill="#e0a640" stroke="#6b4210" stroke-width="2"/><rect x="6" y="18" width="36" height="5" fill="#f6d43a" stroke="#6b4210" stroke-width="1.5"/><rect x="20" y="18" width="8" height="10" rx="1" fill="#f6d43a" stroke="#6b4210" stroke-width="1.5"/><path d="M14 10 L16 6 M34 10 L32 6 M24 7 L24 3" stroke="#fff6b0" stroke-width="2" stroke-linecap="round"/>',
  // Schildtrank
  '<rect x="19" y="4" width="10" height="6" rx="1" fill="#9aa3ad" stroke="#3a3f48" stroke-width="1.5"/><path d="M18 10 H30 V16 Q40 20 40 32 Q40 44 24 44 Q8 44 8 32 Q8 20 18 16 Z" fill="#cfeaff" stroke="#1a4f9c" stroke-width="2"/><path d="M10 30 Q24 25 38 30 Q38 42 24 42 Q10 42 10 30 Z" fill="#3aa0ff"/><circle cx="17" cy="34" r="2" fill="#fff" opacity="0.8"/>',
  // Medikit
  '<rect x="6" y="12" width="36" height="28" rx="4" fill="#f4f4f4" stroke="#8a8f99" stroke-width="2"/><rect x="18" y="6" width="12" height="7" rx="2" fill="none" stroke="#8a8f99" stroke-width="2.5"/><path d="M21 18 H27 V23 H32 V29 H27 V34 H21 V29 H16 V23 H21 Z" fill="#e0262b"/>',
  // Slurp-Saft
  '<rect x="16" y="3" width="16" height="6" rx="2" fill="#3fa64a" stroke="#1d5a24" stroke-width="1.5"/><path d="M14 9 H34 V40 Q34 45 24 45 Q14 45 14 40 Z" fill="#c359ff" stroke="#5a1488" stroke-width="2"/><path d="M14 22 H34" stroke="#ffffff" stroke-width="3" opacity="0.7"/><circle cx="20" cy="31" r="2.2" fill="#f2c4ff"/><circle cx="27" cy="36" r="1.6" fill="#f2c4ff"/>',
  // Lama
  '<path d="M14 44 V30 Q14 24 20 24 H30 V10 Q30 5 34 5 Q38 5 38 10 V34 Q38 38 34 40 V44 M20 44 V38" fill="#c359ff" stroke="#5a1488" stroke-width="2.5" stroke-linejoin="round"/><path d="M33 5 L31 1 M37 6 L39 2" stroke="#5a1488" stroke-width="2" stroke-linecap="round"/><circle cx="35" cy="11" r="1.6" fill="#1b1b1b"/><path d="M14 30 H30" stroke="#f6d43a" stroke-width="3"/><path d="M20 24 Q22 20 26 24" fill="#3aa0ff"/>',
  // Spitzhacke
  '<path d="M10 42 L32 16" stroke="#8a5a2b" stroke-width="5" stroke-linecap="round"/><path d="M18 10 Q32 4 44 14 Q36 12 30 18 Q26 12 18 10 Z" fill="#c9d1d9" stroke="#3a3f48" stroke-width="2" stroke-linejoin="round"/>',
  // Verband
  '<rect x="8" y="18" width="32" height="12" rx="6" fill="#f2dcc0" stroke="#a8825a" stroke-width="2" transform="rotate(-30 24 24)"/><rect x="20" y="18" width="8" height="12" fill="#e8c9a0" transform="rotate(-30 24 24)"/><circle cx="23" cy="23" r="1" fill="#a8825a"/><circle cx="26" cy="25" r="1" fill="#a8825a"/>',
  // Mini-Schild
  '<path d="M16 8 H32 V14 Q38 18 38 28 Q38 40 24 42 Q10 40 10 28 Q10 18 16 14 Z" fill="#cfeaff" stroke="#1a4f9c" stroke-width="2"/><path d="M12 28 Q24 24 36 28 Q36 38 24 40 Q12 38 12 28 Z" fill="#5fc0ff"/><rect x="18" y="4" width="12" height="5" rx="1" fill="#2a78d6" stroke="#1a4f9c" stroke-width="1.5"/>'
].map(svg => `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' + svg + '</svg>')}")`);
function fnUpdateLoot(cell){
  const empty = cell.value === '' && !cell.classList.contains('given');
  cell.classList.toggle('loot', empty && cell.dataset.loot === '1');
}
// Jeder Gegenstand liegt nur einmal auf dem Feld, auf zufälligen leeren Feldern
function fnAssignLoot(){
  if(!fnRoot) return;
  const cells = [...sudokuGrid.querySelectorAll('.sudoku-cell')];
  cells.forEach(cell => { delete cell.dataset.loot; cell.style.removeProperty('--loot'); });
  const empty = cells.filter(c => c.value === '' && !c.classList.contains('given'));
  for(let i = empty.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [empty[i], empty[j]] = [empty[j], empty[i]]; }
  empty.slice(0, fnLootSvgs.length).forEach((cell, i) => {
    cell.dataset.loot = '1';
    cell.style.setProperty('--loot', fnLootSvgs[i]);
  });
  cells.forEach(fnUpdateLoot);
}
if(fnRoot){
  // Nach jedem Aufbau des Spielfelds (neue Runde, Spectator-Modus) Loot neu verteilen
  const sudokuRenderBase = sudokuRender;
  sudokuRender = function(puzzle){ sudokuRenderBase(puzzle); fnAssignLoot(); };
  sudokuGrid.addEventListener('input', (e) => { if(e.target.classList.contains('sudoku-cell')) fnUpdateLoot(e.target); });
  fnAssignLoot();
}

// Kreuzworträtsel: 50 Rätsel (eigene Wörter & Hinweise). Das Gitter jedes Rätsels wurde automatisch
// aus einer Wortliste gebaut und geprüft (keine zufälligen Buchstabenfolgen, alles zusammenhängend).
const crosswordPuzzles = [
  { theme: "Wetter", rows: 9, cols: 7, words: [
    { id: 1, dir: 'down', row: 0, col: 4, answer: 'REGEN', clue: "Nässe, die vom Himmel fällt" },
    { id: 2, dir: 'down', row: 0, col: 6, answer: 'WOLKE', clue: "Schwebt grau oder weiss am Himmel" },
    { id: 3, dir: 'across', row: 1, col: 0, answer: 'SONNE', clue: "Stern in der Mitte unseres Sonnensystems" },
    { id: 4, dir: 'across', row: 4, col: 1, answer: 'SCHNEE', clue: "Weisse Flocken im Winter" },
    { id: 5, dir: 'down', row: 4, col: 3, answer: 'HAGEL', clue: "Eiskörner, die vom Himmel fallen" },
    { id: 6, dir: 'down', row: 5, col: 0, answer: 'WIND', clue: "Bewegte Luft" },
    { id: 7, dir: 'across', row: 7, col: 0, answer: 'NEBEL', clue: "Dichte Wolke direkt am Boden" }
  ] },
  { theme: "Tiere", rows: 9, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 2, answer: 'HUND', clue: "Bester Freund des Menschen" },
    { id: 2, dir: 'across', row: 1, col: 0, answer: 'MAUS', clue: "Kleines Nagetier mit langem Schwanz" },
    { id: 3, dir: 'down', row: 2, col: 4, answer: 'ZEBRA', clue: "Schwarz-weiss gestreiftes Pferd Afrikas" },
    { id: 4, dir: 'across', row: 3, col: 1, answer: 'ADLER', clue: "Grosser Greifvogel" },
    { id: 5, dir: 'down', row: 4, col: 0, answer: 'PFERD', clue: "Tier zum Reiten" },
    { id: 6, dir: 'down', row: 4, col: 6, answer: 'KATZE', clue: "Schnurrt und fängt Mäuse" },
    { id: 7, dir: 'across', row: 6, col: 0, answer: 'ELEFANT', clue: "Grösstes Landtier mit Rüssel" },
    { id: 8, dir: 'across', row: 8, col: 3, answer: 'TIGER', clue: "Gestreifte Raubkatze" }
  ] },
  { theme: "Obst", rows: 9, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 1, answer: 'APFEL', clue: "Rundes Obst, oft rot oder grün" },
    { id: 2, dir: 'down', row: 0, col: 6, answer: 'KIRSCHE', clue: "Kleine rote Frucht mit Stein" },
    { id: 3, dir: 'across', row: 1, col: 1, answer: 'PFIRSICH', clue: "Pelzige Frucht mit grossem Kern" },
    { id: 4, dir: 'down', row: 3, col: 4, answer: 'MELONE', clue: "Grosse saftige Sommerfrucht" },
    { id: 5, dir: 'across', row: 6, col: 0, answer: 'ZITRONE', clue: "Saure gelbe Frucht" },
    { id: 6, dir: 'across', row: 8, col: 0, answer: 'BIRNE', clue: "Obst mit schmaler Spitze" }
  ] },
  { theme: "Gemüse", rows: 9, cols: 8, words: [
    { id: 1, dir: 'across', row: 0, col: 2, answer: 'ERBSE', clue: "Kleine grüne Kugel in einer Schote" },
    { id: 2, dir: 'down', row: 0, col: 5, answer: 'SPINAT', clue: "Grünes Blattgemüse" },
    { id: 3, dir: 'down', row: 2, col: 1, answer: 'GURKE', clue: "Grünes Gemüse, wird oft eingelegt" },
    { id: 4, dir: 'down', row: 2, col: 3, answer: 'PAPRIKA', clue: "Gibt es rot, gelb und grün" },
    { id: 5, dir: 'down', row: 2, col: 7, answer: 'ZWIEBEL', clue: "Lässt einen beim Schneiden weinen" },
    { id: 6, dir: 'across', row: 5, col: 1, answer: 'KAROTTE', clue: "Orange Wurzel, Hasen mögen sie" },
    { id: 7, dir: 'across', row: 8, col: 0, answer: 'TOMATE', clue: "Rotes Gemüse für Ketchup" }
  ] },
  { theme: "Farben", rows: 9, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 0, answer: 'WEISS', clue: "Farbe von frischem Schnee" },
    { id: 2, dir: 'across', row: 1, col: 3, answer: 'ROT', clue: "Farbe der Erdbeere" },
    { id: 3, dir: 'down', row: 1, col: 4, answer: 'ORANGE', clue: "Mischung aus Rot und Gelb" },
    { id: 4, dir: 'across', row: 3, col: 0, answer: 'SCHWARZ', clue: "Farbe der Nacht" },
    { id: 5, dir: 'across', row: 5, col: 4, answer: 'GELB', clue: "Farbe der Zitrone" },
    { id: 6, dir: 'down', row: 5, col: 6, answer: 'LILA', clue: "Mischung aus Rot und Blau" },
    { id: 7, dir: 'across', row: 8, col: 4, answer: 'BLAU', clue: "Farbe des Himmels" }
  ] },
  { theme: "Zahlen", rows: 7, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 1, answer: 'VIER', clue: "Anzahl Jahreszeiten" },
    { id: 2, dir: 'down', row: 0, col: 3, answer: 'EINS', clue: "Kleinste ganze Zahl über null" },
    { id: 3, dir: 'down', row: 1, col: 7, answer: 'DREI', clue: "Anzahl Seiten eines Dreiecks" },
    { id: 4, dir: 'across', row: 2, col: 0, answer: 'ZEHN', clue: "Anzahl Finger an zwei Händen" },
    { id: 4, dir: 'down', row: 2, col: 0, answer: 'ZWEI', clue: "Zahl nach eins" },
    { id: 5, dir: 'down', row: 2, col: 5, answer: 'SECHS', clue: "Augen auf der höchsten Würfelseite" },
    { id: 6, dir: 'across', row: 3, col: 3, answer: 'SIEBEN', clue: "Anzahl Tage einer Woche" },
    { id: 7, dir: 'across', row: 5, col: 3, answer: 'ACHT', clue: "Anzahl Beine einer Spinne" }
  ] },
  { theme: "Körper", rows: 9, cols: 7, words: [
    { id: 1, dir: 'across', row: 0, col: 0, answer: 'OHR', clue: "Damit hört man" },
    { id: 2, dir: 'down', row: 0, col: 1, answer: 'HERZ', clue: "Pumpt das Blut durch den Körper" },
    { id: 3, dir: 'down', row: 0, col: 5, answer: 'KNIE', clue: "Gelenk in der Mitte des Beins" },
    { id: 4, dir: 'across', row: 1, col: 3, answer: 'HAND', clue: "Hat fünf Finger" },
    { id: 5, dir: 'across', row: 3, col: 1, answer: 'ZUNGE', clue: "Damit schmeckt man" },
    { id: 6, dir: 'down', row: 3, col: 3, answer: 'NASE', clue: "Damit riecht man" },
    { id: 7, dir: 'down', row: 5, col: 1, answer: 'FUSS', clue: "Steht am Ende des Beins" },
    { id: 8, dir: 'across', row: 6, col: 0, answer: 'AUGE', clue: "Damit sieht man" }
  ] },
  { theme: "Getränke", rows: 9, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 3, answer: 'KAKAO', clue: "Schokoladengetränk" },
    { id: 2, dir: 'down', row: 0, col: 7, answer: 'WASSER', clue: "Wichtigstes Getränk zum Überleben" },
    { id: 3, dir: 'across', row: 1, col: 2, answer: 'SAFT', clue: "Gepresst aus Früchten" },
    { id: 4, dir: 'down', row: 3, col: 5, answer: 'KAFFEE', clue: "Heisses Getränk am Morgen" },
    { id: 5, dir: 'across', row: 4, col: 0, answer: 'LIMONADE', clue: "Süsses Getränk mit Kohlensäure" },
    { id: 6, dir: 'down', row: 4, col: 2, answer: 'MILCH', clue: "Weisses Getränk von der Kuh" },
    { id: 7, dir: 'across', row: 7, col: 4, answer: 'TEE', clue: "Aufgegossene Blätter" }
  ] },
  { theme: "Schule", rows: 9, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 5, answer: 'PAUSE', clue: "Freie Zeit zwischen den Lektionen" },
    { id: 2, dir: 'across', row: 1, col: 4, answer: 'TAFEL', clue: "Daran schreibt die Lehrerin" },
    { id: 3, dir: 'down', row: 2, col: 3, answer: 'STIFT', clue: "Damit schreibt man" },
    { id: 4, dir: 'down', row: 3, col: 0, answer: 'BUCH', clue: "Hat viele Seiten zum Lesen" },
    { id: 5, dir: 'down', row: 3, col: 7, answer: 'KLASSE', clue: "Gruppe von Schülern" },
    { id: 6, dir: 'across', row: 4, col: 2, answer: 'LINEAL', clue: "Zum Messen und gerade Linien ziehen" },
    { id: 7, dir: 'across', row: 6, col: 0, answer: 'HEFT', clue: "Darin schreibt man Aufgaben" },
    { id: 8, dir: 'across', row: 8, col: 4, answer: 'NOTE', clue: "Bewertung einer Prüfung" }
  ] },
  { theme: "Küche", rows: 8, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 1, answer: 'TOPF', clue: "Darin kocht man Suppe" },
    { id: 2, dir: 'down', row: 0, col: 2, answer: 'OFEN', clue: "Darin backt man Kuchen" },
    { id: 3, dir: 'down', row: 0, col: 6, answer: 'HERD', clue: "Darauf wird gekocht" },
    { id: 4, dir: 'down', row: 1, col: 8, answer: 'MESSER', clue: "Zum Schneiden" },
    { id: 5, dir: 'across', row: 2, col: 1, answer: 'TELLER', clue: "Darauf liegt das Essen" },
    { id: 6, dir: 'down', row: 2, col: 4, answer: 'LÖFFEL', clue: "Besteck für Suppe" },
    { id: 7, dir: 'across', row: 5, col: 3, answer: 'PFANNE', clue: "Zum Braten von Eiern" },
    { id: 8, dir: 'across', row: 7, col: 0, answer: 'GABEL', clue: "Besteck mit Zinken" }
  ] },
  { theme: "Weltraum", rows: 9, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 1, answer: 'MOND', clue: "Umkreist die Erde" },
    { id: 1, dir: 'down', row: 0, col: 1, answer: 'MARS', clue: "Der rote Planet" },
    { id: 2, dir: 'down', row: 1, col: 6, answer: 'PLANET', clue: "Kreist um eine Sonne" },
    { id: 3, dir: 'across', row: 3, col: 0, answer: 'ASTRONAUT', clue: "Raumfahrer" },
    { id: 4, dir: 'down', row: 3, col: 3, answer: 'RAKETE', clue: "Fliegt ins All" },
    { id: 5, dir: 'across', row: 5, col: 3, answer: 'KOMET', clue: "Himmelskörper mit Schweif" },
    { id: 6, dir: 'across', row: 6, col: 0, answer: 'ERDE', clue: "Unser Heimatplanet" },
    { id: 7, dir: 'across', row: 8, col: 1, answer: 'STERN', clue: "Leuchtet nachts am Himmel" }
  ] },
  { theme: "Meer", rows: 7, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 1, answer: 'HAI', clue: "Gefährlicher Raubfisch" },
    { id: 2, dir: 'down', row: 0, col: 3, answer: 'INSEL', clue: "Land, ganz von Wasser umgeben" },
    { id: 3, dir: 'down', row: 1, col: 5, answer: 'KRABBE', clue: "Läuft seitwärts" },
    { id: 4, dir: 'down', row: 1, col: 7, answer: 'ANKER', clue: "Hält das Schiff fest" },
    { id: 5, dir: 'across', row: 2, col: 3, answer: 'STRAND', clue: "Sandiger Rand am Meer" },
    { id: 6, dir: 'across', row: 4, col: 1, answer: 'WAL', clue: "Grösstes Tier im Meer" },
    { id: 7, dir: 'across', row: 6, col: 0, answer: 'MUSCHEL', clue: "Liegt am Strand, hat eine Schale" }
  ] },
  { theme: "Fahrzeuge", rows: 6, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 0, answer: 'SCHIFF', clue: "Fährt auf dem Wasser" },
    { id: 2, dir: 'down', row: 0, col: 3, answer: 'ZUG', clue: "Fährt auf Schienen" },
    { id: 3, dir: 'down', row: 0, col: 5, answer: 'ROLLER', clue: "Hat zwei kleine Räder und einen Lenker" },
    { id: 4, dir: 'across', row: 1, col: 2, answer: 'AUTO', clue: "Hat vier Räder und einen Motor" },
    { id: 5, dir: 'down', row: 3, col: 2, answer: 'BUS', clue: "Bringt viele Leute zur Arbeit" },
    { id: 6, dir: 'across', row: 4, col: 0, answer: 'FLUGZEUG', clue: "Fliegt mit Passagieren" }
  ] },
  { theme: "Berufe", rows: 8, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 6, answer: 'FÖRSTER', clue: "Kümmert sich um den Wald" },
    { id: 2, dir: 'down', row: 1, col: 2, answer: 'MALER', clue: "Streicht Wände" },
    { id: 3, dir: 'down', row: 1, col: 4, answer: 'ARZT', clue: "Hilft kranken Menschen" },
    { id: 4, dir: 'across', row: 3, col: 0, answer: 'POLIZIST', clue: "Sorgt für Ordnung" },
    { id: 4, dir: 'down', row: 3, col: 0, answer: 'PILOT', clue: "Fliegt ein Flugzeug" },
    { id: 5, dir: 'across', row: 6, col: 3, answer: 'LEHRER', clue: "Unterrichtet in der Schule" }
  ] },
  { theme: "Sport", rows: 8, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 0, answer: 'FUSSBALL', clue: "Elf gegen elf mit einem Ball" },
    { id: 2, dir: 'across', row: 0, col: 2, answer: 'TOR', clue: "Dort soll der Ball hinein" },
    { id: 3, dir: 'down', row: 0, col: 4, answer: 'REITEN', clue: "Sport auf dem Pferd" },
    { id: 4, dir: 'down', row: 0, col: 8, answer: 'TENNIS', clue: "Mit Schläger und gelbem Ball" },
    { id: 5, dir: 'across', row: 2, col: 0, answer: 'SCHWIMMEN', clue: "Sport im Wasser" },
    { id: 6, dir: 'across', row: 4, col: 6, answer: 'SKI', clue: "Damit fährt man den Berg hinunter" },
    { id: 7, dir: 'across', row: 7, col: 0, answer: 'LAUFEN', clue: "Schnell zu Fuss unterwegs" }
  ] },
  { theme: "Musik", rows: 9, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 4, answer: 'NOTE', clue: "Zeichen für einen Ton" },
    { id: 2, dir: 'across', row: 1, col: 2, answer: 'CHOR', clue: "Singende Gruppe" },
    { id: 3, dir: 'down', row: 2, col: 1, answer: 'KLAVIER', clue: "Hat schwarze und weisse Tasten" },
    { id: 4, dir: 'down', row: 2, col: 6, answer: 'GEIGE', clue: "Wird mit einem Bogen gespielt" },
    { id: 5, dir: 'across', row: 3, col: 0, answer: 'FLÖTE', clue: "Blasinstrument aus Holz" },
    { id: 6, dir: 'across', row: 4, col: 5, answer: 'LIED', clue: "Wird gesungen" },
    { id: 7, dir: 'across', row: 6, col: 0, answer: 'GITARRE', clue: "Saiteninstrument" },
    { id: 8, dir: 'across', row: 8, col: 0, answer: 'TROMMEL', clue: "Wird geschlagen" }
  ] },
  { theme: "Kleidung", rows: 9, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 4, answer: 'SOCKE', clue: "Wird im Schuh getragen" },
    { id: 2, dir: 'down', row: 0, col: 6, answer: 'JACKE', clue: "Wärmt im Herbst" },
    { id: 3, dir: 'down', row: 1, col: 2, answer: 'GURT', clue: "Hält die Hose oben" },
    { id: 4, dir: 'across', row: 4, col: 1, answer: 'STIEFEL', clue: "Hoher Schuh" },
    { id: 4, dir: 'down', row: 4, col: 1, answer: 'SCHAL', clue: "Wird um den Hals gewickelt" },
    { id: 5, dir: 'across', row: 6, col: 1, answer: 'HOSE', clue: "Hat zwei Beine" },
    { id: 6, dir: 'across', row: 8, col: 0, answer: 'KLEID', clue: "Einteiliges Kleidungsstück" }
  ] },
  { theme: "Haus", rows: 9, cols: 7, words: [
    { id: 1, dir: 'down', row: 0, col: 6, answer: 'BODEN', clue: "Darauf läuft man" },
    { id: 2, dir: 'down', row: 1, col: 4, answer: 'GARTEN', clue: "Grünfläche beim Haus" },
    { id: 3, dir: 'across', row: 2, col: 3, answer: 'WAND', clue: "Trennt zwei Zimmer" },
    { id: 4, dir: 'down', row: 3, col: 1, answer: 'TREPPE', clue: "Führt nach oben" },
    { id: 5, dir: 'across', row: 5, col: 0, answer: 'KELLER', clue: "Raum unter der Erde" },
    { id: 6, dir: 'down', row: 6, col: 6, answer: 'TÜR', clue: "Dadurch geht man hinein" },
    { id: 7, dir: 'across', row: 8, col: 0, answer: 'FENSTER', clue: "Lässt Licht herein" }
  ] },
  { theme: "Wald", rows: 6, cols: 8, words: [
    { id: 1, dir: 'across', row: 0, col: 0, answer: 'PILZ', clue: "Wächst auf dem Waldboden" },
    { id: 2, dir: 'down', row: 0, col: 3, answer: 'ZAPFEN', clue: "Fällt von der Tanne" },
    { id: 3, dir: 'down', row: 0, col: 5, answer: 'FUCHS', clue: "Schlauer roter Waldbewohner" },
    { id: 4, dir: 'across', row: 2, col: 2, answer: 'SPECHT', clue: "Klopft an Baumstämme" },
    { id: 5, dir: 'down', row: 3, col: 0, answer: 'REH', clue: "Scheues Waldtier" },
    { id: 6, dir: 'across', row: 4, col: 0, answer: 'EULE', clue: "Ruft nachts im Wald" }
  ] },
  { theme: "Wochentage", rows: 8, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 3, answer: 'DIENSTAG', clue: "Zweiter Tag der Woche" },
    { id: 2, dir: 'across', row: 1, col: 0, answer: 'FREITAG', clue: "Letzter Arbeitstag" },
    { id: 3, dir: 'down', row: 2, col: 8, answer: 'WOCHE', clue: "Sieben Tage" },
    { id: 4, dir: 'across', row: 3, col: 0, answer: 'SONNTAG', clue: "Ruhetag" },
    { id: 5, dir: 'across', row: 5, col: 1, answer: 'MITTWOCH', clue: "Mitte der Woche" },
    { id: 6, dir: 'across', row: 7, col: 1, answer: 'TAG', clue: "Gegenteil von Nacht" }
  ] },
  { theme: "Monate", rows: 7, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 0, answer: 'JANUAR', clue: "Erster Monat" },
    { id: 2, dir: 'down', row: 0, col: 1, answer: 'APRIL', clue: "Macht, was er will" },
    { id: 3, dir: 'down', row: 0, col: 4, answer: 'AUGUST', clue: "Achter Monat, Nationalfeiertag in der Schweiz" },
    { id: 4, dir: 'down', row: 1, col: 6, answer: 'MAI', clue: "Wonnemonat" },
    { id: 5, dir: 'across', row: 3, col: 3, answer: 'JULI', clue: "Siebter Monat" },
    { id: 6, dir: 'down', row: 3, col: 8, answer: 'MÄRZ', clue: "Dritter Monat" },
    { id: 7, dir: 'across', row: 5, col: 2, answer: 'OKTOBER', clue: "Zehnter Monat" }
  ] },
  { theme: "Jahreszeiten", rows: 7, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 5, answer: 'HITZE', clue: "Grosse Wärme" },
    { id: 2, dir: 'across', row: 1, col: 0, answer: 'FRÜHLING', clue: "Jahreszeit, in der alles blüht" },
    { id: 3, dir: 'down', row: 1, col: 3, answer: 'HERBST', clue: "Blätter fallen von den Bäumen" },
    { id: 4, dir: 'across', row: 4, col: 0, answer: 'LAUB', clue: "Gefallene Blätter" },
    { id: 5, dir: 'across', row: 4, col: 5, answer: 'EIS', clue: "Gefrorenes Wasser" },
    { id: 6, dir: 'across', row: 6, col: 0, answer: 'WINTER', clue: "Kälteste Jahreszeit" }
  ] },
  { theme: "Schweiz", rows: 8, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 5, answer: 'UHR', clue: "Berühmtes Schweizer Produkt" },
    { id: 2, dir: 'across', row: 1, col: 0, answer: 'ZÜRICH', clue: "Grösste Stadt der Schweiz" },
    { id: 3, dir: 'down', row: 1, col: 2, answer: 'RHEIN', clue: "Grosser Fluss bei Basel" },
    { id: 4, dir: 'across', row: 3, col: 1, answer: 'BERN', clue: "Bundesstadt der Schweiz" },
    { id: 5, dir: 'down', row: 4, col: 5, answer: 'TELL', clue: "Schweizer Held mit der Armbrust" },
    { id: 6, dir: 'down', row: 4, col: 7, answer: 'KÄSE', clue: "Emmentaler oder Gruyère" },
    { id: 7, dir: 'across', row: 5, col: 0, answer: 'FONDUE', clue: "Geschmolzener Käse im Caquelon" },
    { id: 8, dir: 'across', row: 7, col: 4, answer: 'ALPEN', clue: "Grosses Gebirge" }
  ] },
  { theme: "Länder", rows: 8, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 2, answer: 'KANADA', clue: "Land mit dem Ahornblatt" },
    { id: 2, dir: 'down', row: 0, col: 6, answer: 'INDIEN', clue: "Land des Taj Mahal" },
    { id: 3, dir: 'down', row: 1, col: 0, answer: 'SPANIEN', clue: "Land des Flamenco" },
    { id: 4, dir: 'down', row: 2, col: 8, answer: 'JAPAN', clue: "Land der aufgehenden Sonne" },
    { id: 5, dir: 'across', row: 3, col: 4, answer: 'CHINA', clue: "Land mit der grossen Mauer" },
    { id: 5, dir: 'down', row: 3, col: 4, answer: 'CHILE', clue: "Langes, schmales Land in Südamerika" },
    { id: 6, dir: 'across', row: 5, col: 0, answer: 'ITALIEN', clue: "Land der Pizza" },
    { id: 7, dir: 'across', row: 7, col: 3, answer: 'PERU', clue: "Land der Inka" }
  ] },
  { theme: "Städte", rows: 8, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 1, answer: 'PARIS', clue: "Stadt des Eiffelturms" },
    { id: 1, dir: 'down', row: 0, col: 1, answer: 'PRAG', clue: "Goldene Stadt an der Moldau" },
    { id: 2, dir: 'down', row: 1, col: 6, answer: 'BERLIN', clue: "Hauptstadt Deutschlands" },
    { id: 3, dir: 'across', row: 2, col: 0, answer: 'BASEL', clue: "Schweizer Stadt am Rhein" },
    { id: 4, dir: 'down', row: 2, col: 4, answer: 'LONDON', clue: "Stadt des Big Ben" },
    { id: 5, dir: 'across', row: 3, col: 6, answer: 'ROM', clue: "Hauptstadt Italiens" },
    { id: 6, dir: 'across', row: 5, col: 2, answer: 'MADRID', clue: "Hauptstadt Spaniens" },
    { id: 7, dir: 'across', row: 7, col: 1, answer: 'WIEN', clue: "Hauptstadt Österreichs" }
  ] },
  { theme: "Spielzeug", rows: 9, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 0, answer: 'DRACHEN', clue: "Fliegt im Herbstwind" },
    { id: 2, dir: 'down', row: 0, col: 6, answer: 'KREISEL', clue: "Dreht sich auf einer Spitze" },
    { id: 3, dir: 'across', row: 1, col: 0, answer: 'ROBOTER', clue: "Spielzeugmaschine" },
    { id: 4, dir: 'down', row: 4, col: 2, answer: 'PUPPE', clue: "Spielzeug in Menschengestalt" },
    { id: 5, dir: 'across', row: 6, col: 2, answer: 'PUZZLE', clue: "Bild aus vielen Teilen" },
    { id: 6, dir: 'across', row: 8, col: 1, answer: 'TEDDY', clue: "Kuscheliger Bär" }
  ] },
  { theme: "Bauernhof", rows: 9, cols: 7, words: [
    { id: 1, dir: 'down', row: 0, col: 2, answer: 'SCHAF', clue: "Gibt Wolle" },
    { id: 2, dir: 'down', row: 1, col: 5, answer: 'ZIEGE', clue: "Meckert und klettert" },
    { id: 3, dir: 'across', row: 2, col: 0, answer: 'SCHWEIN', clue: "Rosa Tier, quiekt" },
    { id: 3, dir: 'down', row: 2, col: 0, answer: 'STALL', clue: "Haus der Tiere" },
    { id: 4, dir: 'across', row: 5, col: 4, answer: 'HEU', clue: "Getrocknetes Gras" },
    { id: 4, dir: 'down', row: 5, col: 4, answer: 'HUHN', clue: "Legt Eier" },
    { id: 5, dir: 'across', row: 7, col: 2, answer: 'KUH', clue: "Gibt Milch" }
  ] },
  { theme: "Insekten", rows: 9, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 2, answer: 'WESPE', clue: "Gelb-schwarz und sticht" },
    { id: 2, dir: 'down', row: 0, col: 4, answer: 'MÜCKE', clue: "Sticht und juckt" },
    { id: 3, dir: 'across', row: 3, col: 4, answer: 'KÄFER', clue: "Hat einen harten Panzer" },
    { id: 4, dir: 'down', row: 3, col: 6, answer: 'FLIEGE', clue: "Summt um das Essen" },
    { id: 5, dir: 'down', row: 3, col: 8, answer: 'RAUPE', clue: "Wird zum Schmetterling" },
    { id: 6, dir: 'across', row: 4, col: 0, answer: 'BIENE', clue: "Macht Honig" },
    { id: 7, dir: 'across', row: 6, col: 0, answer: 'LIBELLE', clue: "Fliegt über dem Teich" },
    { id: 8, dir: 'across', row: 8, col: 1, answer: 'AMEISE', clue: "Sehr fleissiges kleines Insekt" }
  ] },
  { theme: "Vögel", rows: 9, cols: 7, words: [
    { id: 1, dir: 'across', row: 0, col: 2, answer: 'SPATZ', clue: "Kleiner brauner Vogel" },
    { id: 2, dir: 'down', row: 0, col: 4, answer: 'AMSEL', clue: "Schwarzer Singvogel" },
    { id: 3, dir: 'down', row: 2, col: 1, answer: 'PAPAGEI', clue: "Bunter Vogel, der sprechen lernt" },
    { id: 4, dir: 'across', row: 3, col: 0, answer: 'TAUBE', clue: "Gurrt auf dem Platz" },
    { id: 5, dir: 'down', row: 3, col: 6, answer: 'SCHWAN', clue: "Weisser Vogel mit langem Hals" },
    { id: 6, dir: 'across', row: 5, col: 0, answer: 'RABE', clue: "Grosser schwarzer Vogel" },
    { id: 7, dir: 'across', row: 8, col: 0, answer: 'PINGUIN', clue: "Vogel, der nicht fliegen kann" }
  ] },
  { theme: "Werkzeug", rows: 8, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 0, answer: 'ZANGE', clue: "Zum Greifen und Kneifen" },
    { id: 2, dir: 'down', row: 0, col: 2, answer: 'SÄGE', clue: "Damit schneidet man Holz" },
    { id: 3, dir: 'down', row: 0, col: 7, answer: 'HAMMER', clue: "Damit schlägt man Nägel ein" },
    { id: 4, dir: 'across', row: 2, col: 0, answer: 'NAGEL', clue: "Wird in die Wand geschlagen" },
    { id: 5, dir: 'down', row: 2, col: 4, answer: 'LEITER', clue: "Damit klettert man hoch" },
    { id: 6, dir: 'across', row: 4, col: 3, answer: 'PINSEL', clue: "Zum Malen" },
    { id: 7, dir: 'across', row: 7, col: 1, answer: 'SCHRAUBE', clue: "Wird eingedreht" }
  ] },
  { theme: "Geburtstag", rows: 9, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 2, answer: 'KERZE', clue: "Wird ausgeblasen" },
    { id: 2, dir: 'down', row: 0, col: 6, answer: 'FEST', clue: "Grosse Feier" },
    { id: 3, dir: 'across', row: 1, col: 1, answer: 'GESCHENK', clue: "Verpacktes Überraschungspaket" },
    { id: 4, dir: 'down', row: 1, col: 8, answer: 'KUCHEN', clue: "Süsses mit Kerzen" },
    { id: 5, dir: 'across', row: 4, col: 0, answer: 'LIED', clue: "Happy Birthday ist eins" },
    { id: 6, dir: 'down', row: 5, col: 4, answer: 'GAST', clue: "Besucher der Party" },
    { id: 7, dir: 'across', row: 6, col: 3, answer: 'BALLON', clue: "Mit Luft gefüllt" },
    { id: 8, dir: 'across', row: 8, col: 4, answer: 'TORTE', clue: "Kuchen mit Creme" }
  ] },
  { theme: "Weihnachten", rows: 9, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 3, answer: 'KRIPPE', clue: "Futterkrippe mit dem Kind" },
    { id: 1, dir: 'down', row: 0, col: 3, answer: 'KUGEL', clue: "Glänzender Baumschmuck" },
    { id: 2, dir: 'across', row: 2, col: 1, answer: 'ENGEL', clue: "Hat Flügel und einen Heiligenschein" },
    { id: 3, dir: 'down', row: 2, col: 8, answer: 'RENTIER', clue: "Tier mit Geweih aus dem Norden" },
    { id: 4, dir: 'across', row: 4, col: 0, answer: 'SCHLITTEN', clue: "Wird von Rentieren gezogen" },
    { id: 4, dir: 'down', row: 4, col: 0, answer: 'STERN', clue: "Leuchtet oben auf dem Baum" },
    { id: 5, dir: 'across', row: 7, col: 3, answer: 'GLOCKE', clue: "Läutet zur Feier" }
  ] },
  { theme: "Märchen", rows: 9, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 0, answer: 'PRINZ', clue: "Sohn eines Königs" },
    { id: 2, dir: 'down', row: 3, col: 3, answer: 'DRACHE', clue: "Speit Feuer" },
    { id: 3, dir: 'down', row: 3, col: 8, answer: 'RIESE', clue: "Sehr grosse Gestalt" },
    { id: 4, dir: 'across', row: 4, col: 0, answer: 'ZWERG', clue: "Einer von sieben" },
    { id: 5, dir: 'down', row: 4, col: 6, answer: 'KRONE', clue: "Trägt der König auf dem Kopf" },
    { id: 6, dir: 'across', row: 6, col: 2, answer: 'SCHLOSS', clue: "Dort wohnt der König" },
    { id: 7, dir: 'across', row: 8, col: 0, answer: 'HEXE', clue: "Wohnt im Lebkuchenhaus" },
    { id: 8, dir: 'across', row: 8, col: 5, answer: 'FEE', clue: "Erfüllt Wünsche" }
  ] },
  { theme: "Computer", rows: 9, cols: 8, words: [
    { id: 1, dir: 'across', row: 0, col: 2, answer: 'MAUS', clue: "Damit bewegt man den Zeiger" },
    { id: 2, dir: 'down', row: 0, col: 5, answer: 'SPIEL', clue: "Macht am Computer Spass" },
    { id: 3, dir: 'down', row: 0, col: 7, answer: 'DRUCKER', clue: "Bringt Text auf Papier" },
    { id: 4, dir: 'down', row: 2, col: 3, answer: 'MONITOR', clue: "Zeigt das Bild am Computer an" },
    { id: 5, dir: 'across', row: 3, col: 2, answer: 'CODE', clue: "Programmtext" },
    { id: 6, dir: 'across', row: 6, col: 0, answer: 'TASTATUR', clue: "Damit tippt man" },
    { id: 7, dir: 'across', row: 8, col: 2, answer: 'ORDNER', clue: "Darin liegen Dateien" }
  ] },
  { theme: "Zirkus", rows: 8, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 2, answer: 'ZELT', clue: "Grosses Dach für die Vorstellung" },
    { id: 2, dir: 'down', row: 0, col: 5, answer: 'JONGLEUR', clue: "Wirft Bälle in die Luft" },
    { id: 3, dir: 'across', row: 2, col: 1, answer: 'CLOWN', clue: "Hat eine rote Nase" },
    { id: 4, dir: 'down', row: 3, col: 8, answer: 'SEIL', clue: "Darauf balanciert man" },
    { id: 5, dir: 'across', row: 4, col: 5, answer: 'LÖWE', clue: "Brüllt in der Manege" },
    { id: 6, dir: 'across', row: 5, col: 0, answer: 'MANEGE', clue: "Runde Bühne im Zirkus" },
    { id: 7, dir: 'across', row: 7, col: 0, answer: 'ZAUBERER', clue: "Zieht Hasen aus dem Hut" }
  ] },
  { theme: "Garten", rows: 9, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 1, answer: 'TEICH', clue: "Kleines Gewässer" },
    { id: 2, dir: 'across', row: 0, col: 4, answer: 'WURM', clue: "Lebt in der Erde" },
    { id: 3, dir: 'down', row: 0, col: 6, answer: 'ROSE', clue: "Blume mit Dornen" },
    { id: 4, dir: 'across', row: 1, col: 0, answer: 'BEET', clue: "Hier wachsen Blumen" },
    { id: 5, dir: 'down', row: 2, col: 4, answer: 'TULPE', clue: "Frühlingsblume aus Holland" },
    { id: 6, dir: 'across', row: 3, col: 0, answer: 'SCHAUFEL', clue: "Zum Graben" },
    { id: 7, dir: 'down', row: 5, col: 2, answer: 'ZAUN', clue: "Grenzt den Garten ab" },
    { id: 8, dir: 'across', row: 6, col: 1, answer: 'RASEN', clue: "Grünes Gras zum Mähen" }
  ] },
  { theme: "Gefühle", rows: 9, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 0, answer: 'STOLZ', clue: "Gefühl nach einem Erfolg" },
    { id: 2, dir: 'down', row: 0, col: 3, answer: 'MUT', clue: "Gegenteil von Angst" },
    { id: 3, dir: 'down', row: 0, col: 5, answer: 'FREUDE', clue: "Man lacht dabei" },
    { id: 4, dir: 'across', row: 1, col: 0, answer: 'TRAUER', clue: "Gefühl bei Verlust" },
    { id: 5, dir: 'across', row: 3, col: 4, answer: 'WUT', clue: "Starker Ärger" },
    { id: 6, dir: 'down', row: 4, col: 3, answer: 'GLÜCK', clue: "Hat man beim Kleeblatt" },
    { id: 7, dir: 'across', row: 5, col: 3, answer: 'LIEBE', clue: "Tiefes Gefühl für jemanden" }
  ] },
  { theme: "Wüste", rows: 9, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 7, answer: 'SONNE', clue: "Brennt heiss vom Himmel" },
    { id: 2, dir: 'across', row: 1, col: 1, answer: 'KAMEL', clue: "Hat Höcker" },
    { id: 2, dir: 'down', row: 1, col: 1, answer: 'KAKTUS', clue: "Stachelige Pflanze" },
    { id: 3, dir: 'across', row: 3, col: 0, answer: 'SKORPION', clue: "Hat einen Giftstachel" },
    { id: 4, dir: 'across', row: 5, col: 0, answer: 'DURST', clue: "Will man trinken" },
    { id: 5, dir: 'down', row: 5, col: 3, answer: 'SAND', clue: "Davon gibt es in der Wüste viel" },
    { id: 6, dir: 'down', row: 5, col: 6, answer: 'OASE', clue: "Wasserstelle in der Wüste" },
    { id: 7, dir: 'across', row: 8, col: 3, answer: 'DÜNE', clue: "Sandhügel" }
  ] },
  { theme: "Berge", rows: 9, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 2, answer: 'STEINBOCK', clue: "Hat grosse Hörner" },
    { id: 2, dir: 'down', row: 1, col: 7, answer: 'SEILBAHN', clue: "Fährt den Berg hinauf" },
    { id: 3, dir: 'across', row: 2, col: 0, answer: 'GLETSCHER', clue: "Eisstrom in den Bergen" },
    { id: 3, dir: 'down', row: 2, col: 0, answer: 'GIPFEL', clue: "Höchster Punkt eines Berges" },
    { id: 4, dir: 'across', row: 4, col: 5, answer: 'FELS', clue: "Grosser Stein" },
    { id: 5, dir: 'across', row: 6, col: 6, answer: 'TAL', clue: "Liegt zwischen zwei Bergen" }
  ] },
  { theme: "Ritter", rows: 7, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 0, answer: 'SCHWERT', clue: "Waffe des Ritters" },
    { id: 1, dir: 'down', row: 0, col: 0, answer: 'SCHILD', clue: "Schützt im Kampf" },
    { id: 2, dir: 'down', row: 0, col: 5, answer: 'RÜSTUNG', clue: "Metallschutz am Körper" },
    { id: 3, dir: 'down', row: 1, col: 7, answer: 'BURG', clue: "Festung des Ritters" },
    { id: 4, dir: 'across', row: 2, col: 0, answer: 'HELM', clue: "Schützt den Kopf" },
    { id: 5, dir: 'across', row: 3, col: 5, answer: 'TURM', clue: "Hoher Teil der Burg" },
    { id: 6, dir: 'across', row: 6, col: 1, answer: 'KÖNIG', clue: "Herrscher des Landes" }
  ] },
  { theme: "Piraten", rows: 9, cols: 7, words: [
    { id: 1, dir: 'down', row: 0, col: 5, answer: 'KARTE', clue: "Zeigt den Weg zum X" },
    { id: 2, dir: 'down', row: 1, col: 3, answer: 'SCHATZ', clue: "Gold in der Truhe" },
    { id: 3, dir: 'down', row: 2, col: 0, answer: 'KAPITÄN', clue: "Chef des Schiffes" },
    { id: 4, dir: 'across', row: 4, col: 0, answer: 'PAPAGEI', clue: "Sitzt auf der Schulter" },
    { id: 5, dir: 'down', row: 4, col: 6, answer: 'INSEL', clue: "Hier ist der Schatz vergraben" },
    { id: 6, dir: 'across', row: 8, col: 2, answer: 'SÄBEL', clue: "Krummes Schwert" }
  ] },
  { theme: "Dinosaurier", rows: 8, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 0, answer: 'VULKAN', clue: "Spuckt Lava" },
    { id: 2, dir: 'down', row: 0, col: 6, answer: 'EI', clue: "Daraus schlüpften Dinos" },
    { id: 3, dir: 'across', row: 1, col: 2, answer: 'FOSSIL', clue: "Versteinerter Rest" },
    { id: 4, dir: 'down', row: 1, col: 4, answer: 'SCHWANZ', clue: "Langes Hinterteil" },
    { id: 5, dir: 'across', row: 3, col: 0, answer: 'KNOCHEN', clue: "Findet man bei Ausgrabungen" },
    { id: 6, dir: 'across', row: 5, col: 3, answer: 'ZAHN', clue: "Scharf beim T-Rex" },
    { id: 7, dir: 'across', row: 7, col: 2, answer: 'URZEIT', clue: "Sehr lange her" }
  ] },
  { theme: "Polar", rows: 9, cols: 9, words: [
    { id: 1, dir: 'down', row: 0, col: 4, answer: 'KÄLTE', clue: "Gegenteil von Hitze" },
    { id: 2, dir: 'down', row: 1, col: 2, answer: 'EISBÄR', clue: "Weisser Bär" },
    { id: 3, dir: 'across', row: 2, col: 2, answer: 'IGLU', clue: "Haus aus Schnee" },
    { id: 4, dir: 'down', row: 2, col: 8, answer: 'PINGUIN', clue: "Watschelt im Schnee" },
    { id: 5, dir: 'down', row: 3, col: 0, answer: 'ARKTIS', clue: "Gebiet um den Nordpol" },
    { id: 6, dir: 'across', row: 4, col: 0, answer: 'ROBBE', clue: "Liegt auf dem Eis" },
    { id: 7, dir: 'down', row: 4, col: 6, answer: 'FROST', clue: "Eisige Temperatur" },
    { id: 8, dir: 'across', row: 8, col: 0, answer: 'SCHLITTEN', clue: "Wird von Hunden gezogen" }
  ] },
  { theme: "Frühstück", rows: 8, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 4, answer: 'ZOPF', clue: "Geflochtenes Sonntagsbrot" },
    { id: 2, dir: 'down', row: 0, col: 6, answer: 'MÜSLI', clue: "Getreide mit Milch" },
    { id: 3, dir: 'down', row: 1, col: 1, answer: 'JOGHURT', clue: "Gesäuerte Milch im Becher" },
    { id: 4, dir: 'across', row: 3, col: 1, answer: 'GIPFELI', clue: "Schweizer Wort für Croissant" },
    { id: 5, dir: 'across', row: 5, col: 0, answer: 'BUTTER', clue: "Streicht man aufs Brot" },
    { id: 6, dir: 'down', row: 5, col: 4, answer: 'EI', clue: "Gekocht oder als Spiegelei" }
  ] },
  { theme: "Pizza", rows: 9, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 3, answer: 'KÄSE', clue: "Schmilzt oben drauf" },
    { id: 2, dir: 'down', row: 0, col: 5, answer: 'SALAMI', clue: "Scharfe Wurstscheiben" },
    { id: 3, dir: 'down', row: 0, col: 8, answer: 'OFEN', clue: "Darin backt die Pizza" },
    { id: 4, dir: 'down', row: 2, col: 1, answer: 'TOMATE', clue: "Rote Sosse" },
    { id: 5, dir: 'across', row: 2, col: 4, answer: 'OLIVE', clue: "Kleine schwarze oder grüne Frucht" },
    { id: 6, dir: 'down', row: 4, col: 3, answer: 'PILZE', clue: "Champignons" },
    { id: 7, dir: 'across', row: 5, col: 0, answer: 'BASILIKUM', clue: "Grünes Kraut" },
    { id: 8, dir: 'across', row: 8, col: 2, answer: 'TEIG', clue: "Boden der Pizza" }
  ] },
  { theme: "Strasse", rows: 8, cols: 9, words: [
    { id: 1, dir: 'across', row: 0, col: 0, answer: 'PARKPLATZ', clue: "Hier stellt man das Auto ab" },
    { id: 2, dir: 'down', row: 0, col: 1, answer: 'AMPEL', clue: "Rot, gelb und grün" },
    { id: 3, dir: 'down', row: 0, col: 3, answer: 'KREUZUNG', clue: "Hier treffen Strassen aufeinander" },
    { id: 4, dir: 'across', row: 2, col: 5, answer: 'STAU', clue: "Viele Autos stehen still" },
    { id: 4, dir: 'down', row: 2, col: 5, answer: 'SCHILD', clue: "Zeigt Regeln an der Strasse" },
    { id: 5, dir: 'across', row: 6, col: 0, answer: 'TUNNEL', clue: "Führt durch den Berg" }
  ] },
  { theme: "Kino", rows: 8, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 3, answer: 'POPCORN', clue: "Knabbert man im Kino" },
    { id: 2, dir: 'down', row: 1, col: 5, answer: 'KAMERA', clue: "Damit wird gefilmt" },
    { id: 3, dir: 'down', row: 2, col: 1, answer: 'TICKET', clue: "Eintrittskarte" },
    { id: 4, dir: 'down', row: 3, col: 7, answer: 'HELD', clue: "Hauptfigur, die rettet" },
    { id: 5, dir: 'across', row: 6, col: 0, answer: 'LEINWAND', clue: "Darauf wird projiziert" }
  ] },
  { theme: "Rennen", rows: 9, cols: 8, words: [
    { id: 1, dir: 'across', row: 0, col: 4, answer: 'PILZ', clue: "Gibt in Rennspielen einen Turbo" },
    { id: 2, dir: 'down', row: 0, col: 7, answer: 'ZIEL', clue: "Hier endet das Rennen" },
    { id: 3, dir: 'across', row: 2, col: 3, answer: 'KURVE', clue: "Hier muss man driften" },
    { id: 4, dir: 'down', row: 2, col: 5, answer: 'RUNDE', clue: "Einmal um die Strecke" },
    { id: 5, dir: 'down', row: 3, col: 1, answer: 'POKAL', clue: "Preis für den Sieger" },
    { id: 6, dir: 'down', row: 5, col: 3, answer: 'KART', clue: "Kleines Rennauto" },
    { id: 7, dir: 'across', row: 6, col: 0, answer: 'BANANE', clue: "Rutschige Falle auf der Strecke" },
    { id: 8, dir: 'across', row: 8, col: 3, answer: 'TURBO', clue: "Macht schneller" }
  ] },
  { theme: "Ferien", rows: 9, cols: 8, words: [
    { id: 1, dir: 'down', row: 0, col: 7, answer: 'ZELT', clue: "Zum Campen" },
    { id: 2, dir: 'across', row: 1, col: 3, answer: 'KARTE', clue: "Zeigt den Weg" },
    { id: 2, dir: 'down', row: 1, col: 3, answer: 'KOFFER', clue: "Darin packt man Kleider" },
    { id: 3, dir: 'across', row: 2, col: 0, answer: 'FOTO', clue: "Erinnerung an die Reise" },
    { id: 4, dir: 'down', row: 4, col: 1, answer: 'PASS', clue: "Ausweis für Reisen ins Ausland" },
    { id: 5, dir: 'down', row: 4, col: 5, answer: 'SONNE', clue: "Scheint am Strand" },
    { id: 6, dir: 'across', row: 6, col: 1, answer: 'STRAND', clue: "Liegt am Meer" },
    { id: 7, dir: 'across', row: 8, col: 2, answer: 'HOTEL', clue: "Übernachtung auf Reisen" }
  ] },
  { theme: "Halloween", rows: 9, cols: 8, words: [
    { id: 1, dir: 'across', row: 0, col: 0, answer: 'VAMPIR', clue: "Trinkt Blut und schläft im Sarg" },
    { id: 2, dir: 'down', row: 0, col: 2, answer: 'MASKE', clue: "Versteckt das Gesicht" },
    { id: 3, dir: 'down', row: 0, col: 7, answer: 'SPINNE', clue: "Hat acht Beine und ein Netz" },
    { id: 4, dir: 'across', row: 2, col: 0, answer: 'KOSTÜM', clue: "Verkleidung" },
    { id: 4, dir: 'down', row: 2, col: 0, answer: 'KÜRBIS', clue: "Wird ausgehöhlt und leuchtet" },
    { id: 5, dir: 'down', row: 4, col: 5, answer: 'GEIST', clue: "Spukt und ist durchsichtig" },
    { id: 6, dir: 'across', row: 5, col: 4, answer: 'HEXE', clue: "Fliegt auf dem Besen" },
    { id: 7, dir: 'across', row: 7, col: 0, answer: 'SÜSSES', clue: "Sonst gibt es Saures" }
  ] },
];

let cwPuzzleIndex = Math.floor(Math.random() * crosswordPuzzles.length);
let crosswordWords = crosswordPuzzles[cwPuzzleIndex].words;
// Grösse des Gitters hängt vom Rätsel ab
let CW_ROWS = crosswordPuzzles[cwPuzzleIndex].rows, CW_COLS = crosswordPuzzles[cwPuzzleIndex].cols;
// Mario-Kart-Stil: jedes Rätsel ist eine Strecke in einem Cup
const mkCups = ['Pilz-Cup', 'Blumen-Cup', 'Stern-Cup', 'Spezial-Cup', 'Panzer-Cup', 'Bananen-Cup', 'Blatt-Cup', 'Blitz-Cup'];
function mkUpdateHeader(){
  const el = document.getElementById('mk-track-name');
  if(!el) return;
  const cup = mkCups[Math.floor(cwPuzzleIndex / 7) % mkCups.length];
  el.innerHTML = `<b>${cup}</b> · Strecke ${cwPuzzleIndex + 1}/${crosswordPuzzles.length}: <span>${crosswordPuzzles[cwPuzzleIndex].theme}</span>`;
}
// Kart fährt mit, je mehr Felder ausgefüllt sind
function mkUpdateKart(){
  const kart = document.getElementById('mk-kart');
  if(!kart) return;
  const inputs = [...cwGridEl.querySelectorAll('input')];
  const filled = inputs.filter(i => i.value !== '').length;
  kart.style.setProperty('--progress', inputs.length ? filled / inputs.length : 0);
}
const cwGridEl = document.getElementById('crossword-grid');
const cwStatus = document.getElementById('crossword-status');

function cwWordCells(word){
  const cells = [];
  for(let i = 0; i < word.answer.length; i++){
    const r = word.dir === 'down' ? word.row + i : word.row;
    const c = word.dir === 'across' ? word.col + i : word.col;
    cells.push({ r, c, letter: word.answer[i] });
  }
  return cells;
}

function cwBuildLayout(){
  const layout = {};
  crosswordWords.forEach(word => {
    cwWordCells(word).forEach(({ r, c, letter }) => {
      const key = r + ',' + c;
      if(!layout[key]) layout[key] = { letter, number: null };
    });
  });
  crosswordWords.forEach(word => {
    const key = word.row + ',' + word.col;
    if(layout[key].number === null) layout[key].number = word.id;
  });
  return layout;
}

function cwCellWords(r, c){
  return crosswordWords.filter(w => cwWordCells(w).some(cell => cell.r === r && cell.c === c));
}

function cwGetInput(r, c){
  return cwGridEl.querySelector(`input[data-row="${r}"][data-col="${c}"]`);
}

function cwMoveNext(r, c){
  const words = cwCellWords(r, c);
  const across = words.find(w => w.dir === 'across');
  const down = words.find(w => w.dir === 'down');
  if(across){
    const next = cwGetInput(r, c + 1);
    if(next && cwCellWords(r, c + 1).some(w => w.id === across.id)){ next.focus(); next.select(); return; }
  }
  if(down){
    const next = cwGetInput(r + 1, c);
    if(next && cwCellWords(r + 1, c).some(w => w.id === down.id)){ next.focus(); next.select(); return; }
  }
}

function cwMovePrev(r, c){
  const words = cwCellWords(r, c);
  const across = words.find(w => w.dir === 'across');
  const down = words.find(w => w.dir === 'down');
  if(across){
    const prev = cwGetInput(r, c - 1);
    if(prev && cwCellWords(r, c - 1).some(w => w.id === across.id)){ prev.focus(); prev.select(); return; }
  }
  if(down){
    const prev = cwGetInput(r - 1, c);
    if(prev && cwCellWords(r - 1, c).some(w => w.id === down.id)){ prev.focus(); prev.select(); return; }
  }
}

function cwRenderClues(){
  const acrossEl = document.getElementById('clues-across');
  const downEl = document.getElementById('clues-down');
  acrossEl.innerHTML = crosswordWords.filter(w => w.dir === 'across')
    .map(w => `<li><b>${w.id}.</b>${w.clue}</li>`).join('');
  downEl.innerHTML = crosswordWords.filter(w => w.dir === 'down')
    .map(w => `<li><b>${w.id}.</b>${w.clue}</li>`).join('');
}

// Wort fertig und richtig: Mario fährt einmal über das Wort
let mkDoneWords = new Set();
function mkCheckWords(r, c){
  cwCellWords(r, c).forEach(w => {
    const key = w.dir + w.id;
    if(mkDoneWords.has(key)) return;
    const cells = cwWordCells(w);
    if(cells.every(cell => { const i = cwGetInput(cell.r, cell.c); return i && i.value === cell.letter; })){
      mkDoneWords.add(key);
      mkDrive(w, cells);
    }
  });
}
function mkDrive(word, cells){
  const wrap = cwGridEl.parentElement;
  const template = document.querySelector('#mk-kart svg');
  if(!wrap || !template) return;
  const wr = wrap.getBoundingClientRect();
  const divs = cells.map(cell => cwGetInput(cell.r, cell.c).parentElement);
  const rects = divs.map(d => d.getBoundingClientRect());
  const size = rects[0].width * 1.25;
  const kart = document.createElement('div');
  kart.className = 'mk-word-kart';
  kart.style.width = size + 'px';
  kart.style.height = (size * 0.62) + 'px';
  kart.innerHTML = template.outerHTML;
  wrap.appendChild(kart);
  const across = word.dir === 'across';
  const rot = across ? 0 : 90;
  const px = (rc) => rc.left - wr.left + rc.width / 2 - size / 2;
  const py = (rc) => rc.top - wr.top + rc.height / 2 - size * 0.31;
  const step = across ? rects[0].width : rects[0].height;
  const dx = across ? 1 : 0, dy = across ? 0 : 1;
  const tf = (x, y, deg) => `translate(${x}px, ${y}px) rotate(${deg}deg)`;
  // Zeitplan in Millisekunden: einblenden, Feld für Feld fahren, bei Bananen ausrutschen und drehen, ausblenden
  const STEP = 260, SPIN = 900, FADE = 160;
  const frames = [];
  let t = 0;
  const sx = px(rects[0]) - dx * step, sy = py(rects[0]) - dy * step;
  frames.push({ t: 0, transform: tf(sx, sy, rot), opacity: 0 });
  t += FADE; frames.push({ t, transform: tf(sx, sy, rot), opacity: 1 });
  const arrive = [];
  let turned = 0; // nach jedem Ausrutscher 720° weiter (sieht wieder geradeaus aus)
  rects.forEach((rc, i) => {
    t += STEP;
    const x = px(rc), y = py(rc);
    frames.push({ t, transform: tf(x, y, rot + turned), opacity: 1 });
    arrive.push(t);
    if(divs[i].classList.contains('banana')){
      // Ausrutschen: Kart schlittert quer weg und dreht sich zweimal, dann geht es weiter
      const ox = dy * step * 0.35, oy = dx * step * 0.35;
      frames.push({ t: t + SPIN * 0.3, transform: tf(x + ox + dx * 6, y + oy + dy * 6, rot + turned + 260), opacity: 1 });
      frames.push({ t: t + SPIN * 0.65, transform: tf(x - ox * 0.5 + dx * 10, y - oy * 0.5 + dy * 10, rot + turned + 560), opacity: 1 });
      t += SPIN;
      turned += 720;
      frames.push({ t, transform: tf(x + dx * 8, y + dy * 8, rot + turned), opacity: 1 });
      const pop = document.createElement('span');
      pop.className = 'mk-slip-text';
      pop.textContent = 'Uiii!';
      pop.style.left = (rc.left - wr.left + rc.width / 2) + 'px';
      pop.style.top = (rc.top - wr.top + rc.height * 0.35) + 'px'; // im Feld, damit es in der obersten Reihe nicht abgeschnitten wird
      setTimeout(() => { wrap.appendChild(pop); setTimeout(() => pop.remove(), 1100); }, arrive[i]);
    }
  });
  const last = rects[rects.length - 1];
  t += STEP * 0.6; frames.push({ t, transform: tf(px(last) + dx * step * 0.6, py(last) + dy * step * 0.6, rot + turned), opacity: 1 });
  t += FADE; frames.push({ t, transform: tf(px(last) + dx * step * 0.8, py(last) + dy * step * 0.8, rot + turned), opacity: 0 });
  const anim = kart.animate(frames.map(f => ({ transform: f.transform, opacity: f.opacity, offset: f.t / t })), { duration: t, easing: 'linear' });
  anim.onfinish = () => kart.remove();
  // Jedes Feld leuchtet auf, sobald Mario dort ist, und bleibt danach golden (Bananen verschwinden dabei)
  divs.forEach((div, i) => setTimeout(() => {
    div.classList.remove('mk-boost'); void div.offsetWidth;
    div.classList.add('mk-boost', 'mk-done');
  }, arrive[i]));
}

function cwRenderGrid(){
  const layout = cwBuildLayout();
  mkDoneWords = new Set();
  cwGridEl.innerHTML = '';
  cwGridEl.style.gridTemplateColumns = `repeat(${CW_COLS}, var(--cw-cell, 38px))`;
  // 1–2 Bananen auf der Strecke (nicht auf Startlinien oder Kreuzungen), pro Rätsel immer gleich
  const bananaCells = new Set();
  {
    const starts = new Set(crosswordWords.map(w => w.row + ',' + w.col));
    const road = Object.keys(layout).filter(k => !starts.has(k) && cwCellWords(...k.split(',').map(Number)).length === 1).sort();
    const pick = (k) => Math.floor(Math.abs(Math.sin((cwPuzzleIndex + 1) * 53.7 + k * 17.3) * 10000) % 1 * road.length);
    const count = 1 + (cwPuzzleIndex % 2);
    for(let k = 0; k < 10 && bananaCells.size < Math.min(count, road.length); k++) bananaCells.add(road[pick(k)]);
  }
  for(let r = 0; r < CW_ROWS; r++){
    for(let c = 0; c < CW_COLS; c++){
      const key = r + ',' + c;
      const cellDiv = document.createElement('div');
      if(layout[key]){
        cellDiv.className = 'cw-cell';
        // Strecken-Richtung für den Mario-Kart-Look
        const dirs = cwCellWords(r, c).map(w => w.dir);
        if(dirs.includes('across')) cellDiv.classList.add('road-h');
        if(dirs.includes('down')) cellDiv.classList.add('road-v');
        if(bananaCells.has(key)) cellDiv.classList.add('banana');
        // Startlinie am ersten Buchstaben eines Wortes
        crosswordWords.forEach(w => { if(w.row === r && w.col === c) cellDiv.classList.add(w.dir === 'across' ? 'start-h' : 'start-v'); });
        if(layout[key].number){
          const numSpan = document.createElement('span');
          numSpan.className = 'cw-number';
          numSpan.textContent = layout[key].number;
          cellDiv.appendChild(numSpan);
        }
        const input = document.createElement('input');
        input.maxLength = 1;
        input.dataset.row = r;
        input.dataset.col = c;
        input.addEventListener('input', () => {
          input.value = input.value.toUpperCase().replace(/[^A-ZÄÖÜ]/g, '').slice(0, 1);
          input.classList.remove('right', 'wrong');
          mkUpdateKart();
          mkCheckWords(Number(input.dataset.row), Number(input.dataset.col));
          if(input.value !== ''){
            cwMoveNext(Number(input.dataset.row), Number(input.dataset.col));
          }
        });
        input.addEventListener('keydown', (e) => {
          const r = Number(input.dataset.row), c = Number(input.dataset.col);
          if(e.key === 'Backspace' && input.value === ''){
            e.preventDefault();
            cwMovePrev(r, c);
          } else if(e.key === 'ArrowRight'){
            e.preventDefault();
            const next = cwGetInput(r, c + 1);
            if(next){ next.focus(); next.select(); }
          } else if(e.key === 'ArrowLeft'){
            e.preventDefault();
            const prev = cwGetInput(r, c - 1);
            if(prev){ prev.focus(); prev.select(); }
          } else if(e.key === 'ArrowDown'){
            e.preventDefault();
            const next = cwGetInput(r + 1, c);
            if(next){ next.focus(); next.select(); }
          } else if(e.key === 'ArrowUp'){
            e.preventDefault();
            const prev = cwGetInput(r - 1, c);
            if(prev){ prev.focus(); prev.select(); }
          }
        });
        cellDiv.appendChild(input);
      } else {
        cellDiv.className = 'cw-cell blocked';
        // Etwas Deko auf der Wiese, pro Rätsel immer gleich verteilt
        const hash = (k) => Math.abs(Math.sin((cwPuzzleIndex + 1) * 97.3 + r * 13.7 + c * 7.1 + k * 31.9) * 10000) % 1;
        const decos = ['tree', 'flowers', 'itembox', 'mushroom', 'coin', 'bush'];
        if(hash(1) < 0.3) cellDiv.classList.add('deco-' + decos[Math.floor(hash(2) * decos.length)]);
      }
      cwGridEl.appendChild(cellDiv);
    }
  }
}

function cwCheck(){
  const layout = cwBuildLayout();
  let filled = 0, correct = 0, total = Object.keys(layout).length;
  cwGridEl.querySelectorAll('input').forEach(input => {
    const key = input.dataset.row + ',' + input.dataset.col;
    input.classList.remove('right', 'wrong');
    if(input.value !== ''){
      filled++;
      if(input.value === layout[key].letter){
        correct++;
        input.classList.add('right');
      } else {
        input.classList.add('wrong');
      }
    }
  });
  if(filled < total){
    cwStatus.textContent = `Noch ${total - filled} Felder bis zur Ziellinie.`;
  } else if(correct === total){
    cwStatus.innerHTML = '<span class="mk-win">🏆 1. PLATZ!</span>';
    document.querySelector('.mk-crossword')?.classList.add('mk-finished');
  } else {
    cwStatus.textContent = `Auf ${total - correct} Bananen ausgerutscht – ${total - correct} Fehler markiert.`;
  }
}

function cwShowSolution(){
  const layout = cwBuildLayout();
  cwGridEl.querySelectorAll('input').forEach(input => {
    const key = input.dataset.row + ',' + input.dataset.col;
    input.value = layout[key].letter;
    input.classList.remove('wrong');
    input.classList.add('right');
  });
  crosswordWords.forEach(w => mkDoneWords.add(w.dir + w.id));
  cwStatus.textContent = 'Lösung angezeigt – die Ehrenrunde fährt der Computer.';
  mkUpdateKart();
}

function cwNewGame(){
  if(crosswordPuzzles.length > 1){
    let nextIndex;
    do { nextIndex = Math.floor(Math.random() * crosswordPuzzles.length); }
    while(nextIndex === cwPuzzleIndex);
    cwPuzzleIndex = nextIndex;
    crosswordWords = crosswordPuzzles[cwPuzzleIndex].words;
    CW_ROWS = crosswordPuzzles[cwPuzzleIndex].rows;
    CW_COLS = crosswordPuzzles[cwPuzzleIndex].cols;
  }
  cwRenderGrid();
  cwRenderClues();
  mkUpdateHeader();
  mkUpdateKart();
  document.querySelector('.mk-crossword')?.classList.remove('mk-finished');
  cwStatus.textContent = '🚦 3… 2… 1… Los!';
  const first = cwGridEl.querySelector('input');
  if(first) first.focus();
}

cwRenderGrid();
cwRenderClues();
mkUpdateHeader();
mkUpdateKart();
document.getElementById('crossword-new-btn').addEventListener('click', cwNewGame);
document.getElementById('crossword-check-btn').addEventListener('click', cwCheck);
document.getElementById('crossword-solve-btn').addEventListener('click', cwShowSolution);

// Wort des Tages (eigene Wortlisten je Länge, tägliche deterministische Auswahl)
const wotdWordLists = {
  2: ['AB', 'AM', 'AN', 'AU', 'DU', 'EI', 'ES', 'IM', 'IN', 'JA', 'OB', 'OH', 'SO', 'UM', 'WO', 'ZU'],
  3: ['ARM', 'AST', 'BAD', 'BAU', 'BOX', 'BUS', 'BÄR', 'EIS', 'FEE', 'GAS', 'HAI', 'HOF', 'HUT', 'KUH', 'OHR', 'RAD', 'REH', 'SEE', 'TAG', 'TEE', 'TOR', 'UHR', 'UHU', 'UND', 'WAL', 'WEG', 'ZOO', 'ZUG'],
  4: ['AFFE', 'ARZT', 'BALL', 'BEIN', 'BERG', 'BETT', 'BILD', 'BLUT', 'BOOT', 'BROT', 'BUCH', 'BURG', 'BÜRO', 'DACH', 'DIEB', 'DORF', 'DOSE', 'ESEL', 'EULE', 'FELD', 'FILM', 'FLUG', 'GANS', 'GLAS', 'GOLD', 'GRAS', 'HAND', 'HASE', 'HAUT', 'HEFT', 'HEMD', 'HERD', 'HEXE', 'HOSE', 'HUHN', 'HUND', 'IGEL', 'JAHR', 'KAMM', 'KILO', 'KIND', 'KINO', 'KNIE', 'KOCH', 'KOPF', 'KORB', 'KUSS', 'LAND', 'LAUB', 'LEHM', 'LIED', 'LUFT', 'LÖWE', 'MAUS', 'MEER', 'MOND', 'MOOS', 'MUND', 'MÖWE', 'NASE', 'NEST', 'NETZ', 'OBST', 'OFEN', 'PILZ', 'POST', 'RABE', 'RAUM', 'REIS', 'RING', 'ROCK', 'ROSE', 'RUHE', 'SACK', 'SAFT', 'SALZ', 'SAND', 'SEIL', 'SOFA', 'SOHN', 'STAU', 'TEIG', 'TIER', 'TOPF', 'TURM', 'TÜTE', 'VASE', 'WAND', 'WELT', 'WIND', 'WOLF', 'WURM', 'ZAHN', 'ZAUN', 'ZELT', 'ZIEL', 'ZIMT', 'ZOPF'],
  5: ['ABEND', 'ADLER', 'ANGEL', 'ANKER', 'APFEL', 'ARENA', 'BAUCH', 'BESEN', 'BIENE', 'BIRNE', 'BLATT', 'BLITZ', 'BLUME', 'BOGEN', 'BOHNE', 'BRETT', 'BRIEF', 'DAMPF', 'DECKE', 'EIMER', 'ERBSE', 'FAHNE', 'FALKE', 'FARBE', 'FEDER', 'FEIER', 'FEUER', 'FISCH', 'FLUSS', 'FLÖTE', 'FUCHS', 'GABEL', 'GEIST', 'GLÜCK', 'GURKE', 'HAFEN', 'HAGEL', 'HANDY', 'HONIG', 'HÜGEL', 'HÜTTE', 'INSEL', 'JACKE', 'JUNGE', 'KABEL', 'KAKAO', 'KAMEL', 'KANAL', 'KANNE', 'KARTE', 'KATZE', 'KERZE', 'KETTE', 'KISTE', 'KLEID', 'KNOPF', 'KOMET', 'KRAFT', 'KRAKE', 'KRONE', 'KRÖTE', 'KÄFER', 'KÖNIG', 'LACHS', 'LADEN', 'LAMPE', 'MAGEN', 'MARKT', 'MAUER', 'MILCH', 'MUSIK', 'MÖBEL', 'MÜTZE', 'NACHT', 'NADEL', 'NEBEL', 'NUDEL', 'OLIVE', 'ONKEL', 'PAKET', 'PALME', 'PANDA', 'PARTY', 'PFEIL', 'PFERD', 'PIRAT', 'PIZZA', 'PLATZ', 'POKAL', 'PRINZ', 'PUNKT', 'PUPPE', 'RASEN', 'RAUPE', 'REGAL', 'REGEN', 'RIESE', 'SCHAF', 'SCHAL', 'SCHUH', 'SEIFE', 'SOCKE', 'SONNE', 'SPATZ', 'SPIEL', 'STADT', 'STAUB', 'STEIN', 'STERN', 'STIEL', 'STIFT', 'STOCK', 'STROM', 'STUHL', 'SUPPE', 'TAFEL', 'TANNE', 'TANTE', 'TASSE', 'TAUBE', 'TIGER', 'TISCH', 'TORTE', 'TRAUM', 'TULPE', 'VOGEL', 'WAGEN', 'WELLE', 'WOCHE', 'WOLKE', 'WOLLE', 'WÜSTE', 'ZANGE', 'ZEBRA', 'ZIEGE', 'ZWERG'],
  6: ['AMEISE', 'BALKON', 'BANANE', 'BLUMEN', 'BRILLE', 'BRUDER', 'BRÜCKE', 'BUTTER', 'BÄCKER', 'DAUMEN', 'DELFIN', 'DONNER', 'DRACHE', 'EICHEL', 'EISBÄR', 'FINGER', 'FLIEGE', 'FREUND', 'FROSCH', 'GABELN', 'GARTEN', 'GEMÜSE', 'GLOCKE', 'HAMMER', 'HEIMAT', 'HERBST', 'HIMMEL', 'KAKTUS', 'KAMERA', 'KERZEN', 'KIRCHE', 'KISSEN', 'KOFFER', 'KUCHEN', 'LEHRER', 'LEITER', 'LÖFFEL', 'MANTEL', 'MELONE', 'MESSER', 'MINUTE', 'MONTAG', 'MORGEN', 'NICHTE', 'NORDEN', 'OSTERN', 'PINSEL', 'PLANET', 'QUELLE', 'RAKETE', 'RITTER', 'SCHATZ', 'SCHERE', 'SCHIFF', 'SCHNEE', 'SCHULE', 'SESSEL', 'SOMMER', 'SPECHT', 'SPINNE', 'STRAND', 'TASCHE', 'TELLER', 'TOMATE', 'TRAUBE', 'TUNNEL', 'VULKAN', 'WAFFEL', 'WASSER', 'WECKER', 'WINTER', 'WOLKEN', 'WÜRFEL', 'ZIMMER', 'ZUCKER'],
  7: ['BAHNHOF', 'BERGSEE', 'DRACHEN', 'ELEFANT', 'FAHRRAD', 'FENSTER', 'FREITAG', 'GEBIRGE', 'GIRAFFE', 'GITARRE', 'HAUSTÜR', 'KAPITÄN', 'KLAVIER', 'KNOCHEN', 'KÄNGURU', 'LIBELLE', 'MUSCHEL', 'MÄDCHEN', 'NASHORN', 'PAPAGEI', 'PFLANZE', 'PINGUIN', 'POLIZEI', 'PUDDING', 'RAKETEN', 'ROBOTER', 'SAMSTAG', 'SCHLOSS', 'SCHRANK', 'SONNTAG', 'SPIEGEL', 'STEMPEL', 'STIEFEL', 'STRASSE', 'TELEFON', 'TEPPICH', 'TRAKTOR', 'TROMMEL', 'ZEITUNG', 'ZITRONE', 'ZUHAUSE'],
  8: ['AQUARIUM', 'BADEHOSE', 'BAUMHAUS', 'COMPUTER', 'DIENSTAG', 'ERDBEERE', 'FAHRZEUG', 'FEIERTAG', 'FERNGLAS', 'FLUGZEUG', 'FREIHEIT', 'FUSSBALL', 'GESCHENK', 'GESPENST', 'GEWITTER', 'HANDTUCH', 'HAUSTIER', 'HIMBEERE', 'HUFEISEN', 'KASTANIE', 'KOCHTOPF', 'KRAWATTE', 'MAULWURF', 'MITTWOCH', 'RUCKSACK', 'SANDBURG', 'SCHAUKEL', 'SCHNECKE', 'SCHULHOF', 'SEESTERN', 'TEDDYBÄR', 'ZAUBERER'],
  9: ['ABENTEUER', 'APFELBAUM', 'BADEWANNE', 'BAUERNHOF', 'BAUSTELLE', 'BLAUBEERE', 'BLEISTIFT', 'EISENBAHN', 'FAHRKARTE', 'FAHRSTUHL', 'FERNSEHER', 'FEUERWEHR', 'FEUERWERK', 'FLUGHAFEN', 'FRÜHSTÜCK', 'GESCHENKE', 'GLÜHBIRNE', 'HALLOWEEN', 'KARTOFFEL', 'KRANKHEIT', 'LANDKARTE', 'LASTWAGEN', 'NACHTISCH', 'OSTERHASE', 'POSTKARTE', 'REGENWALD', 'SCHLITTEN', 'SPAGHETTI', 'SPIELZEUG', 'TRAMPOLIN', 'TURNSCHUH', 'VOGELNEST', 'ZAHNPASTA'],
};
const wotdDayIndex = Math.floor(Date.now() / 86400000);
let wotdLength = 5;
let wotdAnswer = wotdWordLists[wotdLength][wotdDayIndex % wotdWordLists[wotdLength].length];
const wotdMaxAttempts = 6;
let wotdAttempt = 0;
let wotdOver = false;

const wotdGridEl = document.getElementById('wotd-grid');
const wotdInput = document.getElementById('wotd-input');
const wotdGuessBtn = document.getElementById('wotd-guess-btn');
const wotdStatusEl = document.getElementById('wotd-status');
const wotdNextBtn = document.getElementById('wotd-next-btn');
const wotdKeyboardEl = document.getElementById('wotd-keyboard');
const wotdLengthSelectEl = document.getElementById('wotd-length-select');

const wotdKeyRows = ['QWERTZUIOP', 'ASDFGHJKL', 'YXCVBNMÄÖÜ'];
let wotdKeyStatus = {};

function wotdRenderKeyboard(){
  wotdKeyboardEl.innerHTML = wotdKeyRows.map(row => {
    const keys = row.split('').map(ch => {
      const status = wotdKeyStatus[ch] || '';
      return `<button type="button" class="wotd-key ${status}" data-letter="${ch}" ${status === 'absent' ? 'disabled title="Nicht im Wort"' : ''}>${ch}</button>`;
    }).join('');
    return `<div class="wotd-kb-row">${keys}</div>`;
  }).join('');
  wotdKeyboardEl.querySelectorAll('.wotd-key').forEach(btn => {
    btn.addEventListener('click', () => {
      if(wotdOver || btn.disabled) return;
      if(wotdInput.value.length < wotdLength){
        wotdInput.value += btn.dataset.letter;
        wotdInput.focus();
      }
    });
  });
}

function wotdBuildEmptyGrid(){
  wotdGridEl.innerHTML = '';
  for(let i = 0; i < wotdMaxAttempts; i++){
    const row = document.createElement('div');
    row.className = 'wotd-row';
    row.id = 'wotd-row-' + i;
    for(let j = 0; j < wotdLength; j++){
      const tile = document.createElement('div');
      tile.className = 'wotd-tile';
      row.appendChild(tile);
    }
    wotdGridEl.appendChild(row);
  }
}

function wotdEvaluateGuess(guess, answer){
  const result = Array(wotdLength).fill('absent');
  const answerLetters = answer.split('');
  const guessLetters = guess.split('');

  for(let i = 0; i < wotdLength; i++){
    if(guessLetters[i] === answerLetters[i]){
      result[i] = 'correct';
      answerLetters[i] = null;
    }
  }
  for(let i = 0; i < wotdLength; i++){
    if(result[i] === 'correct') continue;
    const idx = answerLetters.indexOf(guessLetters[i]);
    if(idx !== -1){
      result[i] = 'present';
      answerLetters[idx] = null;
    }
  }
  return result;
}

// Schon geratene Wörter dürfen nicht nochmal verwendet werden
let wotdGuesses = [];
// Fortschritt für den Schaden an den roten Türmen: gefundene grüne Plätze und gelbe Buchstaben
let wotdGreenPos = new Set(), wotdYellow = new Set();
// Blau bekommt nur Schaden, wenn ein Versuch keinen neuen Buchstaben bringt
let wotdBlueHits = 0, wotdFoundNew = false;
function wotdBlocked(msg){
  wotdStatusEl.textContent = msg;
  wotdInput.classList.remove('cr-nope'); void wotdInput.offsetWidth; wotdInput.classList.add('cr-nope');
}
function wotdSubmitGuess(){
  if(wotdOver) return;
  const guess = wotdInput.value.toUpperCase().trim();
  if(guess.length !== wotdLength || !/^[A-ZÄÖÜ]+$/.test(guess)){
    wotdStatusEl.textContent = `Bitte genau ${wotdLength} Buchstaben eingeben.`;
    return;
  }
  if(wotdGuesses.includes(guess)){ wotdBlocked(`${guess} hast du schon versucht.`); return; }
  const used = [...new Set(guess.split(''))].filter(ch => wotdKeyStatus[ch] === 'absent');
  if(used.length){ wotdBlocked(`${used.join(', ')} ${used.length === 1 ? 'kommt' : 'kommen'} nicht im Wort vor.`); return; }
  wotdGuesses.push(guess);

  const result = wotdEvaluateGuess(guess, wotdAnswer);
  const row = document.getElementById('wotd-row-' + wotdAttempt);
  const tiles = row.querySelectorAll('.wotd-tile');
  tiles.forEach((tile, i) => {
    tile.textContent = guess[i];
    tile.classList.add(result[i]);
  });

  const rank = { absent: 0, present: 1, correct: 2 };
  guess.split('').forEach((ch, i) => {
    if(!wotdKeyStatus[ch] || rank[result[i]] > rank[wotdKeyStatus[ch]]){
      wotdKeyStatus[ch] = result[i];
    }
  });
  wotdRenderKeyboard();

  wotdInput.value = '';
  wotdAttempt++;

  // Jeder richtige Buchstabe schadet den roten Türmen (grün voll, gelb weniger); die Rakete gibt am Ende den Rest
  const beforeFound = wotdGreenPos.size + wotdYellow.size;
  result.forEach((res, i) => { if(res === 'correct') wotdGreenPos.add(i); if(res === 'present') wotdYellow.add(guess[i]); });
  wotdFoundNew = wotdGreenPos.size + wotdYellow.size > beforeFound;
  if(!wotdFoundNew && guess !== wotdAnswer) wotdBlueHits++;
  if(guess !== wotdAnswer){
    const greenLetters = new Set([...wotdGreenPos].map(i => wotdAnswer[i]));
    const yellowOnly = [...wotdYellow].filter(ch => !greenLetters.has(ch)).length;
    crDamageRed(Math.min(1, (wotdGreenPos.size + yellowOnly * 0.4) / wotdLength));
  }

  if(guess === wotdAnswer){
    // Clash-Royale-Stil: Kronen je nach Anzahl Versuche (1–2: drei, 3–4: zwei, 5–6: eine)
    const crowns = wotdAttempt <= 2 ? 3 : wotdAttempt <= 4 ? 2 : 1;
    crUpdateTowers('won');
    wotdStatusEl.innerHTML = `<span class="cr-crowns">${[0, 1, 2].map(i => `<i class="${i < crowns ? '' : 'off'}"></i>`).join('')}</span>Sieg! ${crowns} ${crowns === 1 ? 'Krone' : 'Kronen'}`;
    wotdOver = true;
    wotdNextBtn.style.display = 'inline-block';
  } else if(wotdAttempt >= wotdMaxAttempts){
    crUpdateTowers('lost');
    wotdStatusEl.textContent = `Dein Turm ist gefallen! Das Wort war: ${wotdAnswer}`;
    wotdOver = true;
    wotdNextBtn.style.display = 'inline-block';
  } else {
    if(!wotdFoundNew) crUpdateTowers('miss');
    wotdStatusEl.textContent = wotdFoundNew
      ? `Versuch ${wotdAttempt} von ${wotdMaxAttempts} – neue Buchstaben gefunden!`
      : `Versuch ${wotdAttempt} von ${wotdMaxAttempts} – nichts Neues, dein Turm wird getroffen.`;
  }
}

// Jedes Wort kommt erst wieder, wenn alle anderen dieser Länge dran waren (gemischter Stapel pro Länge)
const wotdBags = {};
function wotdDraw(len){
  if(!wotdBags[len] || !wotdBags[len].length){
    const bag = [...wotdWordLists[len]];
    for(let i = bag.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
    if(bag.length > 1 && bag[bag.length - 1] === wotdAnswer) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    wotdBags[len] = bag;
  }
  return wotdBags[len].pop();
}
function wotdNextWord(){
  wotdAnswer = wotdDraw(wotdLength);
  wotdAttempt = 0;
  wotdOver = false;
  wotdStatusEl.textContent = '';
  wotdInput.value = '';
  wotdNextBtn.style.display = 'none';
  wotdKeyStatus = {};
  wotdGuesses = [];
  wotdGreenPos = new Set(); wotdYellow = new Set();
  wotdBlueHits = 0;
  wotdBuildEmptyGrid();
  wotdRenderKeyboard();
  if(typeof crUpdateTowers === 'function') crUpdateTowers('reset');
}

function wotdSetLength(len){
  wotdLength = len;
  wotdInput.maxLength = len;
  wotdInput.placeholder = `${len} Buchstaben`;
  wotdAnswer = wotdDraw(wotdLength);
  wotdAttempt = 0;
  wotdOver = false;
  wotdStatusEl.textContent = '';
  wotdInput.value = '';
  wotdNextBtn.style.display = 'none';
  wotdKeyStatus = {};
  wotdGuesses = [];
  wotdGreenPos = new Set(); wotdYellow = new Set();
  wotdBlueHits = 0;
  wotdBuildEmptyGrid();
  wotdRenderKeyboard();
  if(typeof crUpdateTowers === 'function') crUpdateTowers('reset');
}

// Clash-Royale-Türme: oben der blaue König, unten die roten Türme (zwei Prinzessinnen und ein König)
// Jeder Turm braucht eigene Verlaufs-IDs: ist ein gleich benannter Turm versteckt (zerstört), würden die Farben sonst fehlen
let crTowerCount = 0;
function crTowerSvg(kind, color){
  const c = color === 'blue'
    ? { main:'#3a8cf0', hi:'#9fd2ff', dark:'#0f3a85', deep:'#0a2456', cloth:'#2f74e0' }
    : { main:'#f0453a', hi:'#ffa89e', dark:'#8a1010', deep:'#4a0606', cloth:'#e0302a' };
  const id = color + kind + (++crTowerCount);
  const defs = `<defs>
    <linearGradient id="wall${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a8977a"/><stop offset=".35" stop-color="#efe6d2"/><stop offset=".7" stop-color="#d6c8aa"/><stop offset="1" stop-color="#8f7d60"/></linearGradient>
    <linearGradient id="roof${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.hi}"/><stop offset=".45" stop-color="${c.main}"/><stop offset="1" stop-color="${c.dark}"/></linearGradient>
    <linearGradient id="gold${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2a0"/><stop offset=".5" stop-color="#ffcf1a"/><stop offset="1" stop-color="#c88a00"/></linearGradient>
    <linearGradient id="wood${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a2c14"/><stop offset=".5" stop-color="#7a4a24"/><stop offset="1" stop-color="#4a2c14"/></linearGradient>
    <radialGradient id="skin${id}" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe2c4"/><stop offset="1" stop-color="#e8b088"/></radialGradient>
    <linearGradient id="metal${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa3b2"/><stop offset=".5" stop-color="#5c6474"/><stop offset="1" stop-color="#2e3440"/></linearGradient>
  </defs>`;
  // Einzelne Steine mit leicht unterschiedlichen Farben (wirkt echter als nur Fugenlinien)
  const stones = (x0, x1, y0, y1, h) => {
    let out = '', row = 0;
    const tones = ['#e8dec8', '#d9ccb0', '#cfc09f', '#e2d6bc', '#c8b896'];
    for(let y = y0; y < y1 - 2; y += h, row++){
      const off = row % 2 ? -7 : 0;
      for(let x = x0 + off, k = 0; x < x1; x += 14, k++){
        const xa = Math.max(x0, x) + 0.8, xb = Math.min(x1, x + 14) - 0.8;
        if(xb - xa < 3) continue;
        out += `<rect x="${xa}" y="${y + 0.8}" width="${xb - xa}" height="${Math.min(h, y1 - y) - 1.6}" rx="1.6" fill="${tones[(row * 3 + k) % tones.length]}" opacity=".55"/>`;
      }
    }
    return out;
  };
  const base = (cx, w) => `
    <ellipse cx="${cx}" cy="117" rx="${w / 2 + 10}" ry="5" fill="rgba(0,0,0,.45)"/>
    <rect x="${cx - w / 2 - 8}" y="110" width="${w + 16}" height="9" rx="4" fill="${c.dark}" stroke="${c.deep}" stroke-width="2"/>
    <rect x="${cx - w / 2 - 6}" y="110.5" width="${w + 12}" height="3" rx="1.5" fill="${c.hi}" opacity=".5"/>
    <path d="M${cx - w / 2 - 4} 117 L${cx - w / 2} 108 H${cx + w / 2} L${cx + w / 2 + 4} 117 Z" fill="#8a7a5e" stroke="#3a3022" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M${cx - w / 2 + 2} 111 H${cx + w / 2 - 2}" stroke="#b8a888" stroke-width="2" opacity=".7"/>`;
  const flag = (x, y, h, flip) => `
    <path d="M${x} ${y} V${y + h}" stroke="#3a2a14" stroke-width="2" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y}" r="2" fill="url(#gold${id})" stroke="#6b4400" stroke-width=".8"/>
    <path fill="${c.main}" stroke="${c.deep}" stroke-width="1.5" stroke-linejoin="round" d="M${x} ${y + 2} Q${x + (flip ? -8 : 8)} ${y} ${x + (flip ? -16 : 16)} ${y + 4} Q${x + (flip ? -8 : 8)} ${y + 8} ${x} ${y + 9} Z">
      <animate attributeName="d" dur="1.4s" repeatCount="indefinite" values="
        M${x} ${y + 2} Q${x + (flip ? -8 : 8)} ${y} ${x + (flip ? -16 : 16)} ${y + 4} Q${x + (flip ? -8 : 8)} ${y + 8} ${x} ${y + 9} Z;
        M${x} ${y + 2} Q${x + (flip ? -8 : 8)} ${y + 5} ${x + (flip ? -16 : 16)} ${y + 3} Q${x + (flip ? -8 : 8)} ${y + 11} ${x} ${y + 9} Z;
        M${x} ${y + 2} Q${x + (flip ? -8 : 8)} ${y} ${x + (flip ? -16 : 16)} ${y + 4} Q${x + (flip ? -8 : 8)} ${y + 8} ${x} ${y + 9} Z"/>
    </path>`;
  if(kind === 'king'){
    return `<svg viewBox="0 0 120 122">${defs}
      ${base(60, 92)}
      <path d="M18 109 L21 60 H99 L102 109 Z" fill="url(#wall${id})" stroke="#3a3022" stroke-width="3" stroke-linejoin="round"/>
      ${stones(21, 99, 60, 108, 12)}
      <path d="M21 60 H99" stroke="url(#gold${id})" stroke-width="3"/>
      <path d="M45 109 V92 A15 15 0 0 1 75 92 V109 Z" fill="url(#wood${id})" stroke="#1b1208" stroke-width="2.5"/>
      <path d="M52 109 V90 M60 109 V86 M68 109 V90 M45 99 H75" stroke="#2a1608" stroke-width="1.6"/>
      <path d="M43 93 A17 17 0 0 1 77 93" fill="none" stroke="url(#gold${id})" stroke-width="2.5"/>
      <path d="M24 63 V88 L33 82 L42 88 V63 Z" fill="${c.cloth}" stroke="${c.deep}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M78 63 V88 L87 82 L96 88 V63 Z" fill="${c.cloth}" stroke="${c.deep}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M28 71 L30 66 L33 69 L36 66 L38 71 Z M82 71 L84 66 L87 69 L90 66 L92 71 Z" fill="url(#gold${id})" stroke="#6b4400" stroke-width=".8"/>
      <path d="M24 63 V67 M42 63 V67 M78 63 V67 M96 63 V67" stroke="${c.hi}" stroke-width="1.2" opacity=".6"/>
      ${flag(13, 24, 22, true)}${flag(107, 24, 22, false)}
      <path d="M8 61 V46 H19 V52 H30 V46 H41 V52 H79 V46 H90 V52 H101 V46 H112 V61 Z" fill="url(#roof${id})" stroke="${c.deep}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M11 49 H17 M33 49 H39 M81 49 H87 M104 49 H110" stroke="${c.hi}" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      <circle cx="60" cy="56" r="6" fill="url(#gold${id})" stroke="#6b4400" stroke-width="1.5"/>
      <path d="M57 56 L59 53 L60 55 L61 53 L63 56 Z" fill="#6b4400"/>
      <rect x="35" y="33" width="50" height="15" rx="5" fill="url(#metal${id})" stroke="#15181e" stroke-width="2.5"/>
      <rect x="80" y="35" width="30" height="11" rx="5" fill="url(#metal${id})" stroke="#15181e" stroke-width="2.5"/>
      <path d="M90 35 V46 M100 35 V46" stroke="#c9a23a" stroke-width="2"/>
      <ellipse cx="110" cy="40.5" rx="2.5" ry="4.5" fill="#0d0f13"/>
      <path d="M44 36 Q60 31 76 36" fill="none" stroke="#c4cbd6" stroke-width="1.5" opacity=".7"/>
      <g class="cr-char">
      <circle cx="60" cy="22" r="12.5" fill="url(#skin${id})" stroke="#4a2a14" stroke-width="2.5"/>
      <path d="M47 24 Q47 42 60 42 Q73 42 73 24 Q68 31 60 31 Q52 31 47 24 Z" fill="#e8e8e8" stroke="#7a7a7a" stroke-width="1.6"/>
      <path d="M52 27 Q56 25 60 27 Q64 25 68 27" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-linecap="round"/>
      <path d="M54 33 Q60 36 66 33" fill="none" stroke="#6b3a1a" stroke-width="2" stroke-linecap="round"/>
      <path d="M51 16 L57 17 M69 16 L63 17" stroke="#6b6b6b" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="55" cy="20" r="2" fill="#1b1b1b"/><circle cx="65" cy="20" r="2" fill="#1b1b1b"/>
      <circle cx="55.6" cy="19.4" r=".7" fill="#fff"/><circle cx="65.6" cy="19.4" r=".7" fill="#fff"/>
      <ellipse cx="60" cy="24" rx="2.4" ry="1.8" fill="#d48a6a"/>
      <path d="M45 13 L47 1 L53.5 8 L60 -1 L66.5 8 L73 1 L75 13 Z" fill="url(#gold${id})" stroke="#6b4400" stroke-width="2.4" stroke-linejoin="round"/>
      <rect x="45" y="11" width="30" height="4" rx="1.5" fill="url(#gold${id})" stroke="#6b4400" stroke-width="1.6"/>
      <circle cx="60" cy="7" r="2.2" fill="#e0262b" stroke="#6b0000" stroke-width=".8"/><circle cx="50" cy="9" r="1.4" fill="#3aa0ff"/><circle cx="70" cy="9" r="1.4" fill="#3aa0ff"/>
      <path d="M50 5 L52 3 M70 5 L68 3" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>
      </g>
    </svg>`;
  }
  // Prinzessinnenturm: schmaler Steinturm, Holzplattform mit gestreiftem Baldachin, Prinzessin mit Bogen
  return `<svg viewBox="0 -8 90 130">${defs}
    ${base(45, 54)}
    <path d="M20 109 L24 66 H66 L70 109 Z" fill="url(#wall${id})" stroke="#3a3022" stroke-width="3" stroke-linejoin="round"/>
    ${stones(24, 66, 66, 108, 11)}
    <path d="M37 109 V98 A8 8 0 0 1 53 98 V109 Z" fill="url(#wood${id})" stroke="#1b1208" stroke-width="2.2"/>
    <path d="M45 109 V91" stroke="#2a1608" stroke-width="1.5"/>
    <path d="M40 78 A5 5 0 0 1 50 78 V87 H40 Z" fill="#ffcf5a" stroke="#1b1208" stroke-width="1.8"/>
    <path d="M40 78 A5 5 0 0 1 50 78 V87 H40 Z" fill="#ffae2a" opacity=".6"><animate attributeName="opacity" values=".6;.2;.6" dur="2.2s" repeatCount="indefinite"/></path>
    <path d="M40 82 H50 M45 74 V87" stroke="#6b5a3a" stroke-width="1.2"/>
    <path d="M28 70 V84 L33 80 L38 84 V70 Z" fill="${c.cloth}" stroke="${c.deep}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M52 70 V84 L57 80 L62 84 V70 Z" fill="${c.cloth}" stroke="${c.deep}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M14 66 V55 H22 V59 H31 V55 H59 V59 H68 V55 H76 V66 Z" fill="url(#roof${id})" stroke="${c.deep}" stroke-width="2.8" stroke-linejoin="round"/>
    <path d="M17 58 H20 M71 58 H74" stroke="${c.hi}" stroke-width="2" stroke-linecap="round"/>
    <rect x="26" y="52" width="38" height="4" rx="1.5" fill="url(#wood${id})" stroke="#2a1608" stroke-width="1.4"/>
    <path d="M26 52 V27 M64 52 V27" stroke="url(#wood${id})" stroke-width="3.4"/>
    <path d="M26 52 V27 M64 52 V27" stroke="#2a1608" stroke-width="0.8" opacity=".6"/>
    <path d="M16 29 Q45 2 74 29 Z" fill="url(#roof${id})" stroke="${c.deep}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M24 25 Q30 20 38 18" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity=".5"/>
    <path d="M16 29 Q20 34 24 29 Q28 34 32 29 Q36 34 40 29 Q44 34 48 29 Q52 34 56 29 Q60 34 64 29 Q68 34 72 29 L74 29" fill="${c.main}" stroke="${c.deep}" stroke-width="2" stroke-linejoin="round"/>
    ${flag(45, -6, 18, false)}
    <g class="cr-char">
    <path d="M35 52 Q35 42 45 42 Q55 42 55 52 Z" fill="#ff7eb6" stroke="#8a1f5a" stroke-width="2"/>
    <path d="M40 45 Q45 48 50 45" fill="none" stroke="#ffd0e6" stroke-width="1.5"/>
    <path d="M37 36 Q33 48 37 51 L40 39 Z M53 36 Q57 48 53 51 L50 39 Z" fill="#ffd84a" stroke="#a87b0a" stroke-width="1.3"/>
    <circle cx="45" cy="38" r="7.5" fill="url(#skin${id})" stroke="#4a2a14" stroke-width="2"/>
    <path d="M37.5 38 Q37 29 45 29 Q53 29 52.5 38 Q50 33 45 34 Q40 33 37.5 38 Z" fill="#ffd84a" stroke="#a87b0a" stroke-width="1.3"/>
    <path d="M40.5 30 L41.5 25.5 L43.5 28.5 L45 24.5 L46.5 28.5 L48.5 25.5 L49.5 30 Z" fill="url(#gold${id})" stroke="#6b4400" stroke-width="1" stroke-linejoin="round"/>
    <circle cx="42.4" cy="38.5" r="1.3" fill="#1b1b1b"/><circle cx="47.6" cy="38.5" r="1.3" fill="#1b1b1b"/>
    <circle cx="40.5" cy="41" r="1.4" fill="#ff9ab0" opacity=".7"/><circle cx="49.5" cy="41" r="1.4" fill="#ff9ab0" opacity=".7"/>
    <path d="M43 42 Q45 43.5 47 42" fill="none" stroke="#a8402a" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M57 35 Q66 43.5 57 52" fill="none" stroke="#8a5a2b" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M57 35 L57 52" stroke="#eeeeee" stroke-width="0.9"/>
    <path d="M52 43.5 H65" stroke="#5a3a1c" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M63 41.5 L66.5 43.5 L63 45.5 Z" fill="#c9d1d9" stroke="#5a5f6a" stroke-width=".6"/>
    <path d="M52 41.5 L50 43.5 L52 45.5" fill="none" stroke="#e0262b" stroke-width="1.3"/>
    </g>
  </svg>`;
}
// Trümmerhaufen für zerstörte Türme
function crRubbleSvg(kind){
  const w = kind === 'king' ? 120 : 90;
  return `<svg class="cr-rubble" viewBox="0 0 ${w} 122">
    <ellipse cx="${w / 2}" cy="117" rx="${w * 0.42}" ry="4" fill="rgba(0,0,0,.4)"/>
    <path d="M${w * 0.12} 116 L${w * 0.2} 100 L${w * 0.32} 104 L${w * 0.42} 90 L${w * 0.55} 96 L${w * 0.66} 88 L${w * 0.78} 100 L${w * 0.88} 116 Z" fill="#8a7a5e" stroke="#3a3022" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="${w * 0.24}" y="104" width="12" height="7" rx="2" fill="#cfc09f" stroke="#3a3022" stroke-width="1.5" transform="rotate(-12 ${w * 0.24} 104)"/>
    <rect x="${w * 0.55}" y="100" width="13" height="7" rx="2" fill="#d9ccb0" stroke="#3a3022" stroke-width="1.5" transform="rotate(14 ${w * 0.55} 100)"/>
    <rect x="${w * 0.4}" y="92" width="10" height="6" rx="2" fill="#e2d6bc" stroke="#3a3022" stroke-width="1.5" transform="rotate(-6 ${w * 0.4} 92)"/>
    <path d="M${w * 0.35} 86 Q${w * 0.3} 72 ${w * 0.4} 66 Q${w * 0.38} 76 ${w * 0.45} 80 Q${w * 0.5} 68 ${w * 0.6} 64 Q${w * 0.55} 76 ${w * 0.62} 86" fill="rgba(90,90,90,.35)"/>
  </svg>`;
}
function crTower(kind, color){
  const maxHp = kind === 'king' ? 4008 : 2534;
  return `<div class="cr-tower ${kind} ${color}" data-max="${maxHp}">
    <div class="cr-hp"><span class="cr-level">11</span><div class="cr-bar"><i></i><b>${maxHp}</b></div></div>
    ${crTowerSvg(kind, color)}${crRubbleSvg(kind)}
  </div>`;
}
const crTop = document.getElementById('cr-towers-top');
const crBottom = document.getElementById('cr-towers-bottom');
if(crTop) crTop.innerHTML = crTower('princess', 'blue') + crTower('king', 'blue') + crTower('princess', 'blue');
if(crBottom) crBottom.innerHTML = crTower('princess', 'red') + crTower('king', 'red') + crTower('princess', 'red');
// Jeder falsche Versuch beschädigt den blauen Turm, beim Sieg fallen die roten Türme
function crSetHp(t, pct){
  t.style.setProperty('--hp', pct + '%');
  const b = t.querySelector('.cr-bar b');
  if(b) b.textContent = Math.round(Number(t.dataset.max) * pct / 100);
}
// Rakete fliegt im Bogen vom König-Turm der einen Seite auf die Türme der anderen Seite und explodiert dort
function crFireRocket(fromEl, toRow, onImpact, team){
  const wrap = document.querySelector('.cr-wotd');
  if(!wrap || !fromEl || !toRow || !document.body.animate){ onImpact(); return; }
  const wr = wrap.getBoundingClientRect(), fr = fromEl.getBoundingClientRect(), tr = toRow.getBoundingClientRect();
  const sx = fr.left - wr.left + fr.width / 2, sy = fr.top - wr.top + fr.height * 0.35;
  const ex = tr.left - wr.left + tr.width / 2, ey = tr.top - wr.top + tr.height * 0.6;
  // Bogen: Kontrollpunkt leicht seitlich versetzt
  const cx = (sx + ex) / 2 + wr.width * 0.25, cy = (sy + ey) / 2;
  // Wie im Spiel: Karte wird gespielt (6 Elixier), Zielkreis erscheint am Boden, König feuert mit Rückstoss
  const card = document.createElement('div');
  card.className = 'cr-card ' + (team || 'blue');
  card.innerHTML = `<span class="cr-card-cost">6</span><span class="cr-card-art"></span><span class="cr-card-name">Rakete</span>`;
  card.style.left = Math.min(wr.width - 70, Math.max(0, sx - 34)) + 'px';
  card.style.top = (sy + (sy < ey ? 40 : -110)) + 'px';
  wrap.appendChild(card);
  setTimeout(() => card.remove(), 1400);
  const zone = document.createElement('div');
  zone.className = 'cr-zone ' + (team || 'blue');
  zone.style.left = ex + 'px';
  zone.style.top = ey + 'px';
  wrap.appendChild(zone);
  const launcher = fromEl.querySelector('svg:not(.cr-rubble)');
  if(launcher){ launcher.classList.remove('cr-recoil'); void launcher.getBoundingClientRect(); launcher.classList.add('cr-recoil'); }
  // Schatten am Boden: wandert gerade zum Ziel und wird beim Herunterkommen dunkler und grösser
  const shadow = document.createElement('div');
  shadow.className = 'cr-rocket-shadow';
  wrap.appendChild(shadow);
  const rocket = document.createElement('div');
  rocket.className = 'cr-rocket';
  // Rakete wie in Clash Royale: dicker Metallzylinder mit Eisenbändern, Totenkopf, Kuppel-Spitze und grosser Flamme
  rocket.innerHTML = `<svg viewBox="0 0 44 90">
    <defs>
      <linearGradient id="crRkBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3e4a44"/><stop offset=".35" stop-color="#7d8c84"/><stop offset=".6" stop-color="#5c6a62"/><stop offset="1" stop-color="#2c3530"/></linearGradient>
      <linearGradient id="crRkMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6b6f78"/><stop offset=".4" stop-color="#d8dce4"/><stop offset="1" stop-color="#5a5e66"/></linearGradient>
      <radialGradient id="crRkFire" cx="50%" cy="20%" r="80%"><stop offset="0" stop-color="#fff8c0"/><stop offset=".35" stop-color="#ffd21a"/><stop offset=".7" stop-color="#ff7a1a"/><stop offset="1" stop-color="#e0262b" stop-opacity="0"/></radialGradient>
    </defs>
    <path fill="url(#crRkFire)" d="M22 92 Q6 78 10 64 L34 64 Q38 78 22 92 Z">
      <animate attributeName="d" dur="0.14s" repeatCount="indefinite" values="M22 92 Q6 78 10 64 L34 64 Q38 78 22 92 Z;M22 99 Q3 80 10 64 L34 64 Q41 80 22 99 Z;M22 92 Q6 78 10 64 L34 64 Q38 78 22 92 Z"/>
    </path>
    <path d="M22 80 Q14 72 15 64 L29 64 Q30 72 22 80 Z" fill="#fff6c0"/>
    <rect x="11" y="60" width="22" height="6" rx="2" fill="url(#crRkMetal)" stroke="#1b1d22" stroke-width="2"/>
    <rect x="7" y="22" width="30" height="40" rx="5" fill="url(#crRkBody)" stroke="#1b1d22" stroke-width="2.5"/>
    <path d="M13 23 V61 M31 23 V61" stroke="#2a302c" stroke-width="2.2"/>
    <path d="M13 23 V61 M31 23 V61" stroke="#8a968e" stroke-width=".8" transform="translate(-1 0)"/>
    <rect x="5" y="24" width="34" height="6" rx="2.5" fill="url(#crRkMetal)" stroke="#1b1d22" stroke-width="2"/>
    <rect x="5" y="54" width="34" height="6" rx="2.5" fill="url(#crRkMetal)" stroke="#1b1d22" stroke-width="2"/>
    <circle cx="9" cy="27" r="1" fill="#2a2d33"/><circle cx="35" cy="27" r="1" fill="#2a2d33"/><circle cx="9" cy="57" r="1" fill="#2a2d33"/><circle cx="35" cy="57" r="1" fill="#2a2d33"/>
    <g transform="translate(22 42)">
      <path d="M-7 -1 Q-7 -9 0 -9 Q7 -9 7 -1 Q7 3 4 4 V7 H-4 V4 Q-7 3 -7 -1 Z" fill="#e8e6dc" stroke="#1b1d22" stroke-width="1.4"/>
      <circle cx="-2.8" cy="-2" r="2" fill="#1b1d22"/><circle cx="2.8" cy="-2" r="2" fill="#1b1d22"/>
      <path d="M0 1 L-1 3 H1 Z" fill="#1b1d22"/>
      <path d="M-2 5 V7 M0 5 V7 M2 5 V7" stroke="#1b1d22" stroke-width=".8"/>
    </g>
    <path d="M7 24 Q7 4 22 2 Q37 4 37 24 Z" fill="url(#crRkMetal)" stroke="#1b1d22" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M14 22 Q14 9 22 5 M30 22 Q30 9 22 5" fill="none" stroke="#5a5e66" stroke-width="1.6"/>
    <path d="M12 18 Q13 10 18 7" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity=".7"/>
    <circle cx="22" cy="3" r="2.2" fill="#9aa0aa" stroke="#1b1d22" stroke-width="1.2"/>
  </svg>`;
  wrap.appendChild(rocket);
  // Bahnpunkte mit Drehwinkel entlang der Flugrichtung
  const pts = [];
  const N = 24;
  for(let i = 0; i <= N; i++){
    const t = i / N, u = 1 - t;
    const x = u * u * sx + 2 * u * t * cx + t * t * ex, y = u * u * sy + 2 * u * t * cy + t * t * ey;
    const dx = 2 * u * (cx - sx) + 2 * t * (ex - cx), dy = 2 * u * (cy - sy) + 2 * t * (ey - cy);
    const ang = Math.atan2(dy, dx) * 180 / Math.PI + 90; // Spitze zeigt in Flugrichtung
    // Höhe: Rakete steigt (wird grösser) und stürzt dann auf das Ziel
    const height = Math.sin(Math.PI * t);
    const scale = 0.85 + height * 0.75;
    pts.push({ transform: `translate(${x - 22}px, ${y - 45 - height * 40}px) rotate(${ang}deg) scale(${scale})`, offset: t });
  }
  const dur = 1500, delay = 380;
  const anim = rocket.animate(pts, { duration: dur, delay, easing: 'cubic-bezier(.35,0,.8,1)', fill: 'backwards' });
  shadow.animate([
    { transform: `translate(${sx - 20}px, ${sy - 6}px) scale(0.6)`, opacity: 0.15 },
    { transform: `translate(${(sx + ex) / 2 - 20}px, ${(sy + ey) / 2 - 6}px) scale(0.4)`, opacity: 0.1 },
    { transform: `translate(${ex - 20}px, ${ey - 6}px) scale(1.4)`, opacity: 0.55 }
  ], { duration: dur, delay, easing: 'cubic-bezier(.35,0,.8,1)', fill: 'both' });
  // Rauchspur
  let smokeOn = false;
  setTimeout(() => { smokeOn = true; }, delay);
  const smoke = setInterval(() => {
    if(!smokeOn) return;
    const r = rocket.getBoundingClientRect();
    const puff = document.createElement('span');
    puff.className = 'cr-smoke';
    puff.style.left = (r.left - wr.left + r.width / 2) + 'px';
    puff.style.top = (r.top - wr.top + r.height / 2) + 'px';
    wrap.appendChild(puff);
    setTimeout(() => puff.remove(), 900);
  }, 45);
  anim.onfinish = () => {
    clearInterval(smoke);
    rocket.remove();
    shadow.remove();
    zone.remove();
    // Steinbrocken fliegen weg
    for(let i = 0; i < 10; i++){
      const chunk = document.createElement('span');
      chunk.className = 'cr-chunk';
      chunk.style.left = ex + 'px';
      chunk.style.top = ey + 'px';
      wrap.appendChild(chunk);
      const a = Math.PI * 2 * i / 10 + Math.random() * 0.5, d = 60 + Math.random() * 70;
      chunk.animate([
        { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d * 0.6}px), calc(-50% + ${Math.sin(a) * d * 0.6 - 40}px)) rotate(${200 + i * 40}deg)`, opacity: 1, offset: 0.5 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d + 10}px)) rotate(${400 + i * 60}deg)`, opacity: 0 }
      ], { duration: 900, easing: 'ease-out' }).onfinish = () => chunk.remove();
    }
    // Schadenszahlen über den getroffenen Türmen
    toRow.querySelectorAll('.cr-tower:not(.destroyed)').forEach(t => {
      const tr2 = t.getBoundingClientRect();
      const dmg = document.createElement('span');
      dmg.className = 'cr-damage';
      dmg.textContent = '-' + Math.round(Number(t.dataset.max) * parseFloat(t.style.getPropertyValue('--hp') || '100') / 100);
      dmg.style.left = (tr2.left - wr.left + tr2.width / 2) + 'px';
      dmg.style.top = (tr2.top - wr.top + tr2.height * 0.3) + 'px';
      wrap.appendChild(dmg);
      setTimeout(() => dmg.remove(), 1300);
    });
    const boom = document.createElement('div');
    boom.className = 'cr-boom';
    boom.style.left = ex + 'px';
    boom.style.top = ey + 'px';
    boom.innerHTML = '<i></i><i></i><i></i><b>BOOM!</b>';
    wrap.appendChild(boom);
    wrap.classList.remove('cr-shake'); void wrap.offsetWidth; wrap.classList.add('cr-shake');
    setTimeout(() => boom.remove(), 1200);
    onImpact();
  };
}
// Schaden an den roten Türmen: bis zu 80 % der Lebenspunkte, der Reihe nach linke Prinzessin, rechte Prinzessin, König.
// Blaue Türme, die noch stehen, schiessen dafür einen Pfeil.
function crDamageRed(progress){
  const reds = crBottom ? [...crBottom.querySelectorAll('.cr-tower')] : [];
  const blues = crTop ? [...crTop.querySelectorAll('.cr-tower:not(.destroyed)')] : [];
  const wrap = document.querySelector('.cr-wotd');
  if(reds.length < 3 || !wrap) return;
  const order = [reds[0], reds[2], reds[1]];
  const total = order.reduce((a, t) => a + Number(t.dataset.max), 0);
  let pool = Math.round(total * 0.8 * progress);
  order.forEach((t, i) => {
    const max = Number(t.dataset.max);
    const take = Math.min(max, pool); pool -= take;
    const newPct = Math.max(0, 100 - take / max * 100);
    const oldPct = parseFloat(t.style.getPropertyValue('--hp') || '100');
    if(newPct >= oldPct - 0.01) return;
    const dmg = Math.round(max * (oldPct - newPct) / 100);
    const shooter = blues.length ? blues[i % blues.length] : null;
    const hit = () => {
      crSetHp(t, newPct);
      t.classList.remove('hit'); void t.offsetWidth; t.classList.add('hit');
      if(newPct <= 0) setTimeout(() => t.classList.add('destroyed'), 300);
      const wr = wrap.getBoundingClientRect(), tr = t.getBoundingClientRect();
      const n = document.createElement('span');
      n.className = 'cr-damage';
      n.textContent = '-' + dmg;
      n.style.left = (tr.left - wr.left + tr.width / 2) + 'px';
      n.style.top = (tr.top - wr.top + tr.height * 0.3) + 'px';
      wrap.appendChild(n);
      setTimeout(() => n.remove(), 1300);
    };
    if(!shooter || !document.body.animate){ setTimeout(hit, i * 200); return; }
    // Pfeil von der blauen Prinzessin (bzw. dem König) zum roten Turm
    setTimeout(() => {
      const wr = wrap.getBoundingClientRect(), a = shooter.getBoundingClientRect(), b = t.getBoundingClientRect();
      const ax = a.left - wr.left + a.width / 2, ay = a.top - wr.top + a.height * 0.45;
      const bx = b.left - wr.left + b.width / 2, by = b.top - wr.top + b.height * 0.45;
      const ang = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
      const arrow = document.createElement('span');
      arrow.className = 'cr-arrow';
      wrap.appendChild(arrow);
      arrow.animate([
        { transform: `translate(${ax}px, ${ay}px) rotate(${ang}deg)`, opacity: 1 },
        { transform: `translate(${bx}px, ${by}px) rotate(${ang}deg)`, opacity: 1 }
      ], { duration: 520, easing: 'linear' }).onfinish = () => { arrow.remove(); hit(); };
    }, i * 180);
  });
}
function crUpdateTowers(state){
  const blues = crTop ? [...crTop.querySelectorAll('.cr-tower')] : [];
  const reds = crBottom ? [...crBottom.querySelectorAll('.cr-tower')] : [];
  if(!blues.length) return;
  if(state === 'reset'){
    document.querySelectorAll('.cr-rocket, .cr-boom, .cr-smoke, .cr-zone, .cr-card, .cr-rocket-shadow, .cr-chunk, .cr-damage, .cr-arrow').forEach(e => e.remove());
    [...blues, ...reds].forEach(t => { t.classList.remove('destroyed', 'hit'); crSetHp(t, 100); });
    return;
  }
  // Fehlversuche treffen die blauen Türme der Reihe nach: linke Prinzessin, rechte Prinzessin, dann der König
  // (je 2 Fehlversuche pro Turm)
  if(state === 'miss'){
    const order = [blues[0], blues[2], blues[1]];
    order.forEach((t, i) => {
      const taken = Math.max(0, Math.min(2, wotdBlueHits - i * 2));
      crSetHp(t, 100 - taken * 50);
      if(taken === 2) t.classList.add('destroyed');
    });
    const target = order[Math.min(2, Math.floor((wotdBlueHits - 1) / 2))];
    if(target){ target.classList.remove('hit'); void target.offsetWidth; target.classList.add('hit'); }
  }
  // Verloren: Rakete vom roten König auf die blauen Türme
  if(state === 'lost'){
    crFireRocket(reds[1], crTop, () => blues.forEach((t, i) => setTimeout(() => {
      t.classList.remove('hit'); void t.offsetWidth; t.classList.add('hit'); crSetHp(t, 0);
      setTimeout(() => t.classList.add('destroyed'), 300);
    }, i * 120)), 'red');
  }
  // Gewonnen: Rakete vom blauen König auf die roten Türme
  if(state === 'won'){
    crFireRocket(blues[1].classList.contains('destroyed') ? blues.find(t => !t.classList.contains('destroyed')) || blues[1] : blues[1], crBottom, () => reds.forEach((t, i) => setTimeout(() => {
      t.classList.remove('hit'); void t.offsetWidth; t.classList.add('hit'); crSetHp(t, 0);
      setTimeout(() => t.classList.add('destroyed'), 300);
    }, i * 120)), 'blue');
  }
}

wotdInput.maxLength = wotdLength;
wotdInput.placeholder = `${wotdLength} Buchstaben`;
wotdBuildEmptyGrid();
wotdRenderKeyboard();
wotdGuessBtn.addEventListener('click', wotdSubmitGuess);
wotdNextBtn.addEventListener('click', wotdNextWord);
wotdInput.addEventListener('input', () => {
  const clean = wotdInput.value.toUpperCase().split('').filter(ch => wotdKeyStatus[ch] !== 'absent').join('');
  if(clean !== wotdInput.value.toUpperCase()){
    const removed = [...new Set(wotdInput.value.toUpperCase().split('').filter(ch => wotdKeyStatus[ch] === 'absent'))];
    wotdInput.value = clean;
    wotdBlocked(`${removed.join(', ')} ${removed.length === 1 ? 'kommt' : 'kommen'} nicht im Wort vor.`);
  }
});
wotdInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') wotdSubmitGuess();
});
wotdLengthSelectEl.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    wotdLengthSelectEl.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    wotdSetLength(Number(btn.dataset.len));
  });
});

// Tic Tac Toe
let tttBoard = Array(9).fill(null);
let tttTurn = 'X';
let tttMode = 'bot';
let tttOver = false;
const tttGridEl = document.getElementById('ttt-grid');
const tttStatusEl = document.getElementById('ttt-status');
const tttLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function tttCheckWinner(board){
  for(const line of tttLines){
    const [a,b,c] = line;
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      return { winner: board[a], line };
    }
  }
  if(board.every(v => v)) return { winner: 'draw', line: null };
  return null;
}

function tttMinimax(board, player){
  const result = tttCheckWinner(board);
  if(result){
    if(result.winner === 'O') return { score: 1 };
    if(result.winner === 'X') return { score: -1 };
    return { score: 0 };
  }
  const moves = [];
  for(let i = 0; i < 9; i++){
    if(!board[i]){
      board[i] = player;
      const outcome = tttMinimax(board, player === 'O' ? 'X' : 'O');
      moves.push({ idx: i, score: outcome.score });
      board[i] = null;
    }
  }
  if(player === 'O'){
    const best = moves.reduce((a,b) => b.score > a.score ? b : a);
    return { score: best.score, idx: best.idx };
  } else {
    const best = moves.reduce((a,b) => b.score < a.score ? b : a);
    return { score: best.score, idx: best.idx };
  }
}

function tttRender(winLine){
  tttGridEl.innerHTML = '';
  tttBoard.forEach((val, i) => {
    const btn = document.createElement('button');
    btn.className = 'ttt-cell' + (val ? ' ' + val.toLowerCase() : '') + (winLine && winLine.includes(i) ? ' win' : '');
    btn.textContent = val || '';
    btn.disabled = !!val || tttOver;
    btn.addEventListener('click', () => tttPlay(i));
    tttGridEl.appendChild(btn);
  });
}

function tttPlay(i){
  if(tttBoard[i] || tttOver) return;
  tttBoard[i] = tttTurn;
  const result = tttCheckWinner(tttBoard);
  if(result){
    tttOver = true;
    tttRender(result.line);
    tttStatusEl.textContent = result.winner === 'draw' ? 'Unentschieden!' : `${result.winner} gewinnt!`;
    return;
  }
  tttTurn = tttTurn === 'X' ? 'O' : 'X';
  tttRender();
  tttStatusEl.textContent = `${tttTurn} ist dran.`;

  if(tttMode === 'bot' && tttTurn === 'O' && !tttOver){
    setTimeout(() => {
      const move = tttMinimax(tttBoard.slice(), 'O');
      if(move.idx !== undefined) tttPlay(move.idx);
    }, 350);
  }
}

function tttReset(){
  tttBoard = Array(9).fill(null);
  tttTurn = 'X';
  tttOver = false;
  tttStatusEl.textContent = 'X ist dran.';
  tttRender();
}

document.querySelectorAll('#ttt-mode-select .mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#ttt-mode-select .mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tttMode = btn.dataset.mode;
    tttReset();
  });
});
document.getElementById('ttt-reset-btn').addEventListener('click', tttReset);
tttReset();

// Vier gewinnt
const C4_ROWS = 6, C4_COLS = 7;
let c4Board, c4Turn, c4Mode, c4Over;
const c4BoardEl = document.getElementById('c4-board');
const c4StatusEl = document.getElementById('c4-status');

function c4Init(){
  c4Board = Array.from({length: C4_ROWS}, () => Array(C4_COLS).fill(null));
  c4Turn = 'red';
  c4Over = false;
  c4StatusEl.textContent = 'Rot ist dran.';
  c4Render();
}

function c4Render(winCells){
  c4BoardEl.innerHTML = '';
  for(let r = 0; r < C4_ROWS; r++){
    for(let c = 0; c < C4_COLS; c++){
      const cell = document.createElement('button');
      const val = c4Board[r][c];
      const isWin = winCells && winCells.some(([wr,wc]) => wr === r && wc === c);
      cell.className = 'c4-cell' + (val ? ' ' + val : '') + (isWin ? ' win' : '');
      cell.dataset.col = c;
      cell.dataset.row = r;
      cell.addEventListener('click', () => c4Play(c));
      cell.addEventListener('mouseenter', () => c4ShowPreview(c));
      cell.addEventListener('mouseleave', c4ClearPreview);
      c4BoardEl.appendChild(cell);
    }
  }
}

function c4ClearPreview(){
  c4BoardEl.querySelectorAll('.c4-cell.preview').forEach(cell => {
    cell.classList.remove('preview', 'preview-red', 'preview-yellow');
  });
}

function c4ShowPreview(col){
  if(c4Over) return;
  if(c4Mode === 'bot' && c4Turn === 'yellow') return;
  c4ClearPreview();
  const row = c4DropRow(c4Board, col);
  if(row === -1) return;
  const cell = c4BoardEl.querySelector(`.c4-cell[data-row="${row}"][data-col="${col}"]`);
  if(cell && !cell.classList.contains('red') && !cell.classList.contains('yellow')){
    cell.classList.add('preview', c4Turn === 'red' ? 'preview-red' : 'preview-yellow');
  }
}

function c4DropRow(board, col){
  for(let r = C4_ROWS - 1; r >= 0; r--){
    if(!board[r][col]) return r;
  }
  return -1;
}

function c4CheckWinner(board){
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for(let r = 0; r < C4_ROWS; r++){
    for(let c = 0; c < C4_COLS; c++){
      const val = board[r][c];
      if(!val) continue;
      for(const [dr,dc] of dirs){
        const cells = [[r,c]];
        for(let k = 1; k < 4; k++){
          const nr = r + dr*k, nc = c + dc*k;
          if(nr < 0 || nr >= C4_ROWS || nc < 0 || nc >= C4_COLS || board[nr][nc] !== val) break;
          cells.push([nr,nc]);
        }
        if(cells.length === 4) return { winner: val, cells };
      }
    }
  }
  if(board.every(row => row.every(v => v))) return { winner: 'draw', cells: null };
  return null;
}

function c4BotMove(board){
  const validCols = [];
  for(let c = 0; c < C4_COLS; c++){
    if(c4DropRow(board, c) !== -1) validCols.push(c);
  }
  // 1. Gewinnzug finden
  for(const c of validCols){
    const testBoard = board.map(row => row.slice());
    const r = c4DropRow(testBoard, c);
    testBoard[r][c] = 'yellow';
    if(c4CheckWinner(testBoard)?.winner === 'yellow') return c;
  }
  // 2. Gegner blockieren
  for(const c of validCols){
    const testBoard = board.map(row => row.slice());
    const r = c4DropRow(testBoard, c);
    testBoard[r][c] = 'red';
    if(c4CheckWinner(testBoard)?.winner === 'red') return c;
  }
  // 3. Mitte bevorzugen
  const center = 3;
  validCols.sort((a,b) => Math.abs(a-center) - Math.abs(b-center));
  return validCols[0];
}

function c4Play(col){
  if(c4Over) return;
  const row = c4DropRow(c4Board, col);
  if(row === -1) return;
  c4Board[row][col] = c4Turn;
  const result = c4CheckWinner(c4Board);
  if(result){
    c4Over = true;
    c4Render(result.cells);
    c4StatusEl.textContent = result.winner === 'draw' ? 'Unentschieden!' : `${result.winner === 'red' ? 'Rot' : 'Gelb'} gewinnt!`;
    return;
  }
  c4Turn = c4Turn === 'red' ? 'yellow' : 'red';
  c4Render();
  c4StatusEl.textContent = `${c4Turn === 'red' ? 'Rot' : 'Gelb'} ist dran.`;

  if(c4Mode === 'bot' && c4Turn === 'yellow' && !c4Over){
    setTimeout(() => {
      const col2 = c4BotMove(c4Board);
      if(col2 !== undefined) c4Play(col2);
    }, 400);
  }
}

document.querySelectorAll('#c4-mode-select .mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#c4-mode-select .mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    c4Mode = btn.dataset.mode;
    c4Init();
  });
});
document.getElementById('c4-reset-btn').addEventListener('click', c4Init);
c4Mode = 'bot';
c4Init();

// Galgenmännchen
const hmCategories = {
  'Tiere': ['ELEFANT', 'GIRAFFE', 'SCHILDKRÖTE', 'PINGUIN', 'KÄNGURU', 'DELFIN', 'SPINNE', 'SCHMETTERLING', 'BIENE', 'KROKODIL', 'FLAMINGO', 'WASCHBÄR', 'IGEL', 'FUCHS', 'HIRSCH'],
  'Essen & Trinken': ['PIZZA', 'SCHOKOLADE', 'KAFFEE', 'APFEL', 'BROT', 'KÄSE', 'NUDELN', 'SUPPE', 'KUCHEN', 'HONIG', 'SALAT', 'JOGHURT'],
  'Berufe': ['LEHRER', 'ARZT', 'BÄCKER', 'FEUERWEHRMANN', 'POLIZIST', 'KOCH', 'PILOT', 'MALER', 'SCHREINER', 'FRISEUR', 'ANWALT', 'GÄRTNER'],
  'Länder': ['SCHWEIZ', 'DEUTSCHLAND', 'FRANKREICH', 'ITALIEN', 'SPANIEN', 'JAPAN', 'KANADA', 'BRASILIEN', 'ÄGYPTEN', 'NORWEGEN', 'PORTUGAL', 'SCHWEDEN'],
  'Sport': ['FUSSBALL', 'TENNIS', 'SCHWIMMEN', 'BASKETBALL', 'HANDBALL', 'BOXEN', 'SKIFAHREN', 'RADFAHREN', 'GOLF', 'VOLLEYBALL', 'TURNEN', 'KLETTERN'],
  'Gegenstände': ['SCHERE', 'REGENSCHIRM', 'RUCKSACK', 'BRILLE', 'SCHLÜSSEL', 'SPIEGEL', 'KERZE', 'TEPPICH', 'KISSEN', 'LAMPE', 'HAMMER', 'LEITER'],
  'Natur': ['VULKAN', 'WASSERFALL', 'WÜSTE', 'GLETSCHER', 'REGENBOGEN', 'GEWITTER', 'OZEAN', 'HÖHLE', 'DSCHUNGEL', 'TORNADO', 'LAWINE'],
  'Musik': ['GITARRE', 'TROMMEL', 'KLAVIER', 'GEIGE', 'TROMPETE', 'FLÖTE', 'SAXOFON', 'HARFE', 'CELLO', 'KLARINETTE'],
};
const hmMaxWrong = 6;
let hmAnswer = '';
let hmCategory = '';
let hmGuessed = new Set();
let hmWrong = 0;
let hmOver = false;

const hmWordEl = document.getElementById('hm-word');
const hmKeyboardEl = document.getElementById('hm-keyboard');
const hmStatusEl = document.getElementById('hm-status');
const hmFigureEl = document.getElementById('hm-figure');
const hmCategoryEl = document.getElementById('hm-category');

function hmRenderWord(){
  hmWordEl.innerHTML = hmAnswer.split('').map(ch => {
    const shown = hmGuessed.has(ch) || hmOver;
    return `<span class="hm-letter">${shown ? ch : ' '}</span>`;
  }).join('');
}

function hmRenderFigure(){
  const parts = hmFigureEl.querySelectorAll('.hm-part');
  parts.forEach((part, i) => {
    part.classList.toggle('visible', i < hmWrong);
  });
}

function hmRenderKeyboard(){
  hmKeyboardEl.innerHTML = wotdKeyRows.map(row => {
    const keys = row.split('').map(ch => {
      let status = '';
      if(hmGuessed.has(ch)) status = hmAnswer.includes(ch) ? 'correct' : 'absent';
      const disabled = (hmGuessed.has(ch) || hmOver) ? 'disabled' : '';
      return `<button type="button" class="wotd-key ${status}" data-letter="${ch}" ${disabled}>${ch}</button>`;
    }).join('');
    return `<div class="wotd-kb-row">${keys}</div>`;
  }).join('');
  hmKeyboardEl.querySelectorAll('.wotd-key').forEach(btn => {
    btn.addEventListener('click', () => hmGuessLetter(btn.dataset.letter));
  });
}

function hmCheckState(){
  const solved = hmAnswer.split('').every(ch => hmGuessed.has(ch));
  if(solved){
    hmOver = true;
    hmStatusEl.textContent = `🎉 Gewonnen! Das Wort war ${hmAnswer}.`;
  } else if(hmWrong >= hmMaxWrong){
    hmOver = true;
    hmStatusEl.textContent = `💀 Verloren! Das Wort war ${hmAnswer}.`;
  } else {
    hmStatusEl.textContent = `Noch ${hmMaxWrong - hmWrong} Fehlversuche übrig.`;
  }
}

function hmGuessLetter(ch){
  if(hmOver || hmGuessed.has(ch)) return;
  hmGuessed.add(ch);
  if(!hmAnswer.includes(ch)) hmWrong++;
  hmCheckState();
  hmRenderWord();
  hmRenderFigure();
  hmRenderKeyboard();
}

function hmNewGame(){
  const cats = Object.keys(hmCategories);
  hmCategory = cats[Math.floor(Math.random() * cats.length)];
  const list = hmCategories[hmCategory];
  hmAnswer = list[Math.floor(Math.random() * list.length)];
  hmCategoryEl.textContent = 'Kategorie: ' + hmCategory;
  hmGuessed = new Set();
  hmWrong = 0;
  hmOver = false;
  hmStatusEl.textContent = `Noch ${hmMaxWrong} Fehlversuche übrig.`;
  hmRenderWord();
  hmRenderFigure();
  hmRenderKeyboard();
}

document.getElementById('hm-new-btn').addEventListener('click', hmNewGame);
hmNewGame();

// Schach
const chessPieceChars = {
  w: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' },
  b: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' }
};
let chessBoard, chessTurn, chessMode, chessOver, chessSelected, chessLegalTargets, chessCastleRights;
const chessBoardEl = document.getElementById('chess-board');
const chessStatusEl = document.getElementById('chess-status');

function chessInitialBoard(){
  const b = Array.from({length: 8}, () => Array(8).fill(null));
  const backRank = ['r','n','b','q','k','b','n','r'];
  for(let c = 0; c < 8; c++){
    b[0][c] = 'b' + backRank[c];
    b[1][c] = 'bp';
    b[6][c] = 'wp';
    b[7][c] = 'w' + backRank[c];
  }
  return b;
}

function chessInBounds(r, c){ return r >= 0 && r < 8 && c >= 0 && c < 8; }

function chessPseudoMoves(board, r, c){
  const piece = board[r][c];
  if(!piece) return [];
  const color = piece[0], type = piece[1];
  const opp = color === 'w' ? 'b' : 'w';
  const moves = [];

  function slide(dirs){
    for(const [dr, dc] of dirs){
      let nr = r + dr, nc = c + dc;
      while(chessInBounds(nr, nc)){
        const target = board[nr][nc];
        if(!target){ moves.push([nr, nc]); }
        else { if(target[0] === opp) moves.push([nr, nc]); break; }
        nr += dr; nc += dc;
      }
    }
  }

  if(type === 'p'){
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    if(chessInBounds(r + dir, c) && !board[r + dir][c]){
      moves.push([r + dir, c]);
      if(r === startRow && !board[r + 2*dir][c]) moves.push([r + 2*dir, c]);
    }
    for(const dc of [-1, 1]){
      const nr = r + dir, nc = c + dc;
      if(chessInBounds(nr, nc) && board[nr][nc] && board[nr][nc][0] === opp){
        moves.push([nr, nc]);
      }
    }
  } else if(type === 'n'){
    const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for(const [dr, dc] of deltas){
      const nr = r + dr, nc = c + dc;
      if(chessInBounds(nr, nc)){
        const target = board[nr][nc];
        if(!target || target[0] === opp) moves.push([nr, nc]);
      }
    }
  } else if(type === 'b'){
    slide([[-1,-1],[-1,1],[1,-1],[1,1]]);
  } else if(type === 'r'){
    slide([[-1,0],[1,0],[0,-1],[0,1]]);
  } else if(type === 'q'){
    slide([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
  } else if(type === 'k'){
    for(let dr = -1; dr <= 1; dr++){
      for(let dc = -1; dc <= 1; dc++){
        if(dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = c + dc;
        if(chessInBounds(nr, nc)){
          const target = board[nr][nc];
          if(!target || target[0] === opp) moves.push([nr, nc]);
        }
      }
    }
  }
  return moves;
}

function chessIsSquareAttacked(board, r, c, byColor){
  for(let rr = 0; rr < 8; rr++){
    for(let cc = 0; cc < 8; cc++){
      const p = board[rr][cc];
      if(p && p[0] === byColor){
        const moves = chessPseudoMoves(board, rr, cc);
        if(moves.some(([mr, mc]) => mr === r && mc === c)) return true;
      }
    }
  }
  return false;
}

function chessFindKing(board, color){
  for(let r = 0; r < 8; r++){
    for(let c = 0; c < 8; c++){
      if(board[r][c] === color + 'k') return [r, c];
    }
  }
  return null;
}

function chessIsInCheck(board, color){
  const king = chessFindKing(board, color);
  if(!king) return false;
  return chessIsSquareAttacked(board, king[0], king[1], color === 'w' ? 'b' : 'w');
}

function chessGetCastlingMoves(board, r, c, color){
  const moves = [];
  if(chessIsInCheck(board, color)) return moves;
  const opp = color === 'w' ? 'b' : 'w';
  const rights = chessCastleRights[color];
  const row = color === 'w' ? 7 : 0;
  if(r !== row || c !== 4) return moves;

  if(rights.k && !board[row][5] && !board[row][6] && board[row][7] === color + 'r'){
    if(!chessIsSquareAttacked(board, row, 4, opp) &&
       !chessIsSquareAttacked(board, row, 5, opp) &&
       !chessIsSquareAttacked(board, row, 6, opp)){
      moves.push([row, 6]);
    }
  }
  if(rights.q && !board[row][1] && !board[row][2] && !board[row][3] && board[row][0] === color + 'r'){
    if(!chessIsSquareAttacked(board, row, 4, opp) &&
       !chessIsSquareAttacked(board, row, 3, opp) &&
       !chessIsSquareAttacked(board, row, 2, opp)){
      moves.push([row, 2]);
    }
  }
  return moves;
}

function chessGetLegalMoves(board, r, c, color){
  const piece = board[r][c];
  if(!piece || piece[0] !== color) return [];
  let pseudo = chessPseudoMoves(board, r, c);
  if(piece[1] === 'k'){
    pseudo = pseudo.concat(chessGetCastlingMoves(board, r, c, color));
  }
  return pseudo.filter(([nr, nc]) => {
    const cloned = board.map(row => row.slice());
    cloned[nr][nc] = cloned[r][c];
    cloned[r][c] = null;
    return !chessIsInCheck(cloned, color);
  });
}

function chessGetAllLegalMoves(board, color){
  const all = [];
  for(let r = 0; r < 8; r++){
    for(let c = 0; c < 8; c++){
      const p = board[r][c];
      if(p && p[0] === color){
        chessGetLegalMoves(board, r, c, color).forEach(([nr, nc]) => {
          all.push({ from: [r, c], to: [nr, nc] });
        });
      }
    }
  }
  return all;
}

function chessApplyMove(board, move, castleRights){
  const [fr, fc] = move.from, [tr, tc] = move.to;
  const piece = board[fr][fc];
  const color = piece[0], type = piece[1];

  board[tr][tc] = piece;
  board[fr][fc] = null;

  // Rochade: Turm mitziehen
  if(type === 'k' && Math.abs(tc - fc) === 2){
    const row = fr;
    if(tc === 6){ board[row][5] = board[row][7]; board[row][7] = null; }
    if(tc === 2){ board[row][3] = board[row][0]; board[row][0] = null; }
  }
  // Bauernumwandlung (immer zur Dame)
  if(type === 'p' && (tr === 0 || tr === 7)){
    board[tr][tc] = color + 'q';
  }
  // Rochaderechte aktualisieren
  if(castleRights){
    if(type === 'k'){ castleRights[color].k = false; castleRights[color].q = false; }
    if(type === 'r'){
      if(fc === 0) castleRights[color].q = false;
      if(fc === 7) castleRights[color].k = false;
    }
    if(tr === 0 && tc === 0) castleRights.b.q = false;
    if(tr === 0 && tc === 7) castleRights.b.k = false;
    if(tr === 7 && tc === 0) castleRights.w.q = false;
    if(tr === 7 && tc === 7) castleRights.w.k = false;
  }
}

function chessEvaluate(board){
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  let score = 0;
  for(let r = 0; r < 8; r++){
    for(let c = 0; c < 8; c++){
      const p = board[r][c];
      if(!p) continue;
      score += p[0] === 'w' ? values[p[1]] : -values[p[1]];
    }
  }
  return score;
}

function chessMinimax(board, depth, color){
  const moves = chessGetAllLegalMoves(board, color);
  if(depth === 0 || moves.length === 0){
    return { score: chessEvaluate(board) };
  }
  let bestScore = color === 'w' ? -Infinity : Infinity;
  let bestMoves = [];
  for(const move of moves){
    const cloned = board.map(row => row.slice());
    chessApplyMove(cloned, move, null);
    const result = chessMinimax(cloned, depth - 1, color === 'w' ? 'b' : 'w');
    if(color === 'w' ? result.score > bestScore : result.score < bestScore){
      bestScore = result.score;
      bestMoves = [move];
    } else if(result.score === bestScore){
      bestMoves.push(move);
    }
  }
  const chosen = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  return { score: bestScore, move: chosen };
}

function chessRender(){
  chessBoardEl.innerHTML = '';
  const inCheckColor = chessIsInCheck(chessBoard, chessTurn) ? chessTurn : null;
  const kingPos = inCheckColor ? chessFindKing(chessBoard, inCheckColor) : null;

  for(let r = 0; r < 8; r++){
    for(let c = 0; c < 8; c++){
      const cell = document.createElement('button');
      const isDark = (r + c) % 2 === 1;
      cell.className = 'chess-cell' + (isDark ? ' dark' : '');
      const piece = chessBoard[r][c];
      if(piece){
        cell.textContent = chessPieceChars[piece[0]][piece[1]];
        cell.classList.add(piece[0] === 'w' ? 'white-piece' : 'black-piece');
      }
      if(chessSelected && chessSelected[0] === r && chessSelected[1] === c){
        cell.classList.add('selected');
      }
      if(chessLegalTargets && chessLegalTargets.some(([lr, lc]) => lr === r && lc === c)){
        cell.classList.add('legal');
        if(piece) cell.classList.add('has-piece');
      }
      if(kingPos && kingPos[0] === r && kingPos[1] === c){
        cell.classList.add('check');
      }
      cell.addEventListener('click', () => chessHandleClick(r, c));
      chessBoardEl.appendChild(cell);
    }
  }
}

function chessHandleClick(r, c){
  if(chessOver) return;
  if(chessMode === 'bot' && chessTurn === 'b') return;

  const piece = chessBoard[r][c];

  if(chessSelected){
    const isTarget = chessLegalTargets.some(([lr, lc]) => lr === r && lc === c);
    if(isTarget){
      chessApplyMove(chessBoard, { from: chessSelected, to: [r, c] }, chessCastleRights);
      chessSelected = null;
      chessLegalTargets = [];
      chessAfterMove();
      return;
    }
    if(piece && piece[0] === chessTurn){
      chessSelected = [r, c];
      chessLegalTargets = chessGetLegalMoves(chessBoard, r, c, chessTurn);
      chessRender();
      return;
    }
    chessSelected = null;
    chessLegalTargets = [];
    chessRender();
    return;
  }

  if(piece && piece[0] === chessTurn){
    chessSelected = [r, c];
    chessLegalTargets = chessGetLegalMoves(chessBoard, r, c, chessTurn);
    chessRender();
  }
}

function chessAfterMove(){
  chessTurn = chessTurn === 'w' ? 'b' : 'w';
  const legalMoves = chessGetAllLegalMoves(chessBoard, chessTurn);
  const inCheck = chessIsInCheck(chessBoard, chessTurn);

  if(legalMoves.length === 0){
    chessOver = true;
    chessStatusEl.textContent = inCheck
      ? `Schachmatt! ${chessTurn === 'w' ? 'Schwarz' : 'Weiss'} gewinnt.`
      : 'Patt! Unentschieden.';
    chessRender();
    return;
  }

  chessStatusEl.textContent = `${chessTurn === 'w' ? 'Weiss' : 'Schwarz'} ist dran.` + (inCheck ? ' Schach!' : '');
  chessRender();

  if(chessMode === 'bot' && chessTurn === 'b' && !chessOver){
    setTimeout(() => {
      const result = chessMinimax(chessBoard, 2, 'b');
      if(result.move){
        chessApplyMove(chessBoard, result.move, chessCastleRights);
        chessAfterMove();
      }
    }, 300);
  }
}

function chessReset(){
  chessBoard = chessInitialBoard();
  chessTurn = 'w';
  chessOver = false;
  chessSelected = null;
  chessLegalTargets = [];
  chessCastleRights = { w: { k: true, q: true }, b: { k: true, q: true } };
  chessStatusEl.textContent = 'Weiss ist dran.';
  chessRender();
}

document.querySelectorAll('#chess-mode-select .mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#chess-mode-select .mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    chessMode = btn.dataset.mode;
    chessReset();
  });
});
document.getElementById('chess-reset-btn').addEventListener('click', chessReset);
chessMode = 'bot';
chessReset();

// Schiffe versenken
const BS_SIZE = 8;
const BS_SHIP_SIZES = [4, 3, 3, 2, 2];
let bsBoardA, bsBoardB, bsMode, bsOver, bsAttacker, bsBotQueue;
let bsPhase, bsPlacingSide, bsQueue, bsSelectedIdx, bsPending;
const bsBoardAEl = document.getElementById('bs-board-a');
const bsBoardBEl = document.getElementById('bs-board-b');
const bsLabelA = document.getElementById('bs-label-a');
const bsLabelB = document.getElementById('bs-label-b');
const bsStatusEl = document.getElementById('bs-status');
const bsPlaceControls = document.getElementById('bs-place-controls');
const bsConfirmBtn = document.getElementById('bs-confirm-btn');
const bsClearBtn = document.getElementById('bs-clear-btn');
const bsRandomBtn = document.getElementById('bs-random-btn');

function bsCreateBoard(){
  return {
    grid: Array.from({ length: BS_SIZE }, () => Array(BS_SIZE).fill(null)),
    ships: []
  };
}

function bsShipCells(r, c, size, horizontal){
  const cells = [];
  for(let i = 0; i < size; i++){
    const rr = horizontal ? r : r + i;
    const cc = horizontal ? c + i : c;
    if(rr >= BS_SIZE || cc >= BS_SIZE) return null;
    cells.push([rr, cc]);
  }
  return cells;
}

function bsCanPlace(board, cells){
  return cells && !board.ships.some(ship =>
    ship.cells.some(([sr, sc]) => cells.some(([cr, cc]) => sr === cr && sc === cc))
  );
}

function bsPlaceShipsRandom(board, sizes){
  for(const size of sizes){
    let placed = false;
    while(!placed){
      const horizontal = Math.random() < 0.5;
      const r = Math.floor(Math.random() * BS_SIZE);
      const c = Math.floor(Math.random() * BS_SIZE);
      const cells = bsShipCells(r, c, size, horizontal);
      if(bsCanPlace(board, cells)){
        board.ships.push({ cells, hits: 0, sunk: false });
        placed = true;
      }
    }
  }
}

function bsFire(board, r, c){
  if(board.grid[r][c]) return null;
  const ship = board.ships.find(s => s.cells.some(([sr, sc]) => sr === r && sc === c));
  if(ship){
    board.grid[r][c] = 'hit';
    ship.hits++;
    if(ship.hits === ship.cells.length) ship.sunk = true;
    return { result: ship.sunk ? 'sunk' : 'hit', ship };
  }
  board.grid[r][c] = 'miss';
  return { result: 'miss' };
}

function bsAllSunk(board){
  return board.ships.every(s => s.sunk);
}

function bsRenderBoard(board, el, clickable, onClick, revealShips, pendingCells){
  el.innerHTML = '';
  for(let r = 0; r < BS_SIZE; r++){
    for(let c = 0; c < BS_SIZE; c++){
      const btn = document.createElement('button');
      const state = board.grid[r][c];
      let cls = 'bs-cell';
      if(state === 'hit'){
        const ship = board.ships.find(s => s.cells.some(([sr, sc]) => sr === r && sc === c));
        cls += ship && ship.sunk ? ' sunk' : ' hit';
        btn.textContent = '✕';
      } else if(state === 'miss'){
        cls += ' miss';
        btn.textContent = '·';
      } else if(revealShips && board.ships.some(s => s.cells.some(([sr,sc]) => sr === r && sc === c))){
        cls += ' ship-placed';
      } else if(pendingCells && pendingCells.some(([pr,pc]) => pr === r && pc === c)){
        cls += ' selecting';
      }
      btn.className = cls;
      btn.disabled = !clickable || !!state;
      if(clickable) btn.addEventListener('click', () => onClick(r, c));
      el.appendChild(btn);
    }
  }
}

function bsRenderShipSelect(){
  const el = document.getElementById('bs-ship-select');
  if(bsPhase !== 'placing'){ el.innerHTML = ''; return; }
  el.innerHTML = bsQueue.map((size, i) => `
    <button class="ship-chip${i === bsSelectedIdx ? ' selected' : ''}" data-idx="${i}">${size} Felder</button>
  `).join('');
  el.querySelectorAll('.ship-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      bsSelectedIdx = parseInt(chip.dataset.idx, 10);
      bsRenderShipSelect();
    });
  });
}

function bsRenderFleetStatus(board, el){
  el.innerHTML = board.ships.slice()
    .sort((a, b) => b.cells.length - a.cells.length)
    .map(ship => `<span class="bs-fleet-ship${ship.sunk ? ' sunk' : ''}">${ship.cells.length}</span>`)
    .join('');
}

function bsRender(){
  bsRenderShipSelect();
  bsRenderFleetStatus(bsBoardA, document.getElementById('bs-fleet-a'));
  bsRenderFleetStatus(bsBoardB, document.getElementById('bs-fleet-b'));
  if(bsPhase === 'placing'){
    bsPlaceControls.style.display = 'flex';
    if(bsMode === 'bot'){
      bsLabelA.textContent = 'Deine Flotte — platzieren';
      bsLabelB.textContent = 'Gegnerflotte (verdeckt)';
    } else {
      bsLabelA.textContent = bsPlacingSide === 'a' ? 'Spieler 1 — platzieren' : 'Spieler 1 ✓';
      bsLabelB.textContent = bsPlacingSide === 'b' ? 'Spieler 2 — platzieren' : 'Spieler 2 (später)';
    }
    bsRenderBoard(bsBoardA, bsBoardAEl, bsPlacingSide === 'a', (r,c) => bsToggleCell('a', r, c), bsPlacingSide === 'a', bsPlacingSide === 'a' ? bsPending : null);
    bsRenderBoard(bsBoardB, bsBoardBEl, bsPlacingSide === 'b', (r,c) => bsToggleCell('b', r, c), bsPlacingSide === 'b', bsPlacingSide === 'b' ? bsPending : null);
    return;
  }
  bsPlaceControls.style.display = 'none';
  const clickA = bsMode === 'friend' && bsAttacker === 'b' && !bsOver;
  const clickB = (bsMode === 'bot' && bsAttacker === 'a' && !bsOver) ||
                 (bsMode === 'friend' && bsAttacker === 'a' && !bsOver);
  bsRenderBoard(bsBoardA, bsBoardAEl, clickA, (r, c) => bsHandleFire('a', r, c), bsOver);
  bsRenderBoard(bsBoardB, bsBoardBEl, clickB, (r, c) => bsHandleFire('b', r, c), bsOver);
}

function bsToggleCell(side, r, c){
  if(bsPhase !== 'placing' || bsPlacingSide !== side || bsQueue.length === 0) return;
  const board = side === 'a' ? bsBoardA : bsBoardB;
  if(board.grid[r][c]) return;

  // Klick auf ein bereits platziertes Schiff entfernt es wieder
  const shipIdx = board.ships.findIndex(ship => ship.cells.some(([sr, sc]) => sr === r && sc === c));
  if(shipIdx !== -1){
    const removed = board.ships.splice(shipIdx, 1)[0];
    bsQueue.push(removed.cells.length);
    bsStatusEl.textContent = `Schiff (${removed.cells.length} Felder) entfernt — wieder verfügbar.`;
    bsRender();
    return;
  }

  const idx = bsPending.findIndex(([pr,pc]) => pr === r && pc === c);
  if(idx !== -1){
    bsPending.splice(idx, 1);
    bsStatusEl.textContent = `${bsPending.length} / ${bsQueue[bsSelectedIdx]} Felder ausgewählt.`;
    bsRender();
    return;
  }

  const size = bsQueue[bsSelectedIdx];
  if(bsPending.length >= size){
    bsStatusEl.textContent = `Du hast schon ${size} Felder ausgewählt — erst platzieren oder abwählen.`;
    return;
  }
  bsPending.push([r, c]);

  if(bsPending.length === size){
    // Genug Felder ausgewählt -> automatisch platzieren, wenn es eine gültige Linie ist
    if(bsValidateLine(bsPending)){
      bsConfirmPlacement();
      return;
    }
    bsStatusEl.textContent = 'Diese Felder liegen nicht in einer geraden Linie — wähle eins ab und versuch es erneut.';
    bsRender();
    return;
  }

  bsStatusEl.textContent = `${bsPending.length} / ${size} Felder ausgewählt.`;
  bsRender();
}

function bsValidateLine(cells){
  const rowsSet = new Set(cells.map(([r]) => r));
  const colsSet = new Set(cells.map(([,c]) => c));
  if(rowsSet.size === 1){
    const cols = cells.map(([,c]) => c).sort((a,b) => a - b);
    for(let i = 1; i < cols.length; i++) if(cols[i] !== cols[i-1] + 1) return false;
    return true;
  }
  if(colsSet.size === 1){
    const rows = cells.map(([r]) => r).sort((a,b) => a - b);
    for(let i = 1; i < rows.length; i++) if(rows[i] !== rows[i-1] + 1) return false;
    return true;
  }
  return false;
}

function bsConfirmPlacement(){
  if(bsPhase !== 'placing' || bsQueue.length === 0) return;
  const size = bsQueue[bsSelectedIdx];
  if(bsPending.length !== size){
    bsStatusEl.textContent = `Bitte genau ${size} Felder auswählen (aktuell ${bsPending.length}).`;
    return;
  }
  if(!bsValidateLine(bsPending)){
    bsStatusEl.textContent = 'Die Felder müssen in einer geraden, lückenlosen Linie liegen.';
    return;
  }
  const board = bsPlacingSide === 'a' ? bsBoardA : bsBoardB;
  board.ships.push({ cells: bsPending.slice(), hits: 0, sunk: false });
  bsQueue.splice(bsSelectedIdx, 1);
  bsSelectedIdx = 0;
  bsPending = [];

  if(bsQueue.length === 0){
    bsAdvancePlacement();
  } else {
    bsStatusEl.textContent = `Schiff platziert! Noch ${bsQueue.length} übrig — wähle eins aus.`;
    bsRender();
  }
}

function bsAdvancePlacement(){
  if(bsMode === 'bot'){
    bsPlaceShipsRandom(bsBoardB, BS_SHIP_SIZES);
    bsStartGame();
    return;
  }
  if(bsPlacingSide === 'a'){
    bsPlacingSide = 'b';
    bsQueue = BS_SHIP_SIZES.slice();
    bsSelectedIdx = 0;
    bsPending = [];
    bsStatusEl.textContent = 'Spieler 2: wähle ein Schiff und Felder.';
    bsRender();
  } else {
    bsStartGame();
  }
}

function bsStartGame(){
  bsPhase = 'playing';
  bsAttacker = 'a';
  if(bsMode === 'bot'){
    bsLabelA.textContent = 'Deine Flotte';
    bsLabelB.textContent = 'Gegnerflotte';
    bsStatusEl.textContent = 'Aufstellung fertig! Du bist dran — klicke auf die Gegnerflotte.';
  } else {
    bsLabelA.textContent = 'Spieler 1';
    bsLabelB.textContent = 'Spieler 2';
    bsStatusEl.textContent = 'Aufstellung fertig! Spieler 1 ist dran.';
  }
  bsRender();
}

function bsHandleFire(targetKey, r, c){
  if(bsOver) return;
  const targetBoard = targetKey === 'a' ? bsBoardA : bsBoardB;
  const outcome = bsFire(targetBoard, r, c);
  if(!outcome) return;

  const actorLabel = bsMode === 'bot' ? 'Du' : (bsAttacker === 'a' ? 'Spieler 1' : 'Spieler 2');

  if(bsAllSunk(targetBoard)){
    bsOver = true;
    bsStatusEl.textContent = `🎉 ${actorLabel} hat alle Schiffe versenkt und gewinnt!`;
    bsRender();
    return;
  }

  if(outcome.result === 'miss'){
    bsAttacker = bsAttacker === 'a' ? 'b' : 'a';
    bsStatusEl.textContent = `Daneben. ${bsMode === 'bot' && bsAttacker === 'a' ? 'Bot ist dran.' : 'Nächster Zug.'}`;
  } else {
    bsStatusEl.textContent = outcome.result === 'sunk' ? `${actorLabel}: Schiff versenkt! Nochmal.` : `${actorLabel}: Treffer! Nochmal.`;
  }
  bsRender();

  if(bsMode === 'bot' && bsAttacker === 'b' && !bsOver){
    setTimeout(bsBotTurn, 500);
  }
}

function bsBotTurn(){
  if(bsOver) return;
  let r, c;
  if(bsBotQueue.length > 0){
    [r, c] = bsBotQueue.shift();
    if(bsBoardA.grid[r][c]) { setTimeout(bsBotTurn, 10); return; }
  } else {
    do {
      r = Math.floor(Math.random() * BS_SIZE);
      c = Math.floor(Math.random() * BS_SIZE);
    } while(bsBoardA.grid[r][c]);
  }
  const outcome = bsFire(bsBoardA, r, c);
  if(bsAllSunk(bsBoardA)){
    bsOver = true;
    bsStatusEl.textContent = '💥 Der Bot hat deine Flotte versenkt. Verloren!';
    bsRender();
    return;
  }
  if(outcome.result === 'miss'){
    bsAttacker = 'a';
    bsStatusEl.textContent = 'Bot daneben. Du bist dran.';
    bsRender();
  } else {
    if(outcome.result === 'hit'){
      [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc]) => {
        if(nr >= 0 && nr < BS_SIZE && nc >= 0 && nc < BS_SIZE && !bsBoardA.grid[nr][nc]){
          bsBotQueue.push([nr, nc]);
        }
      });
    }
    bsStatusEl.textContent = outcome.result === 'sunk' ? 'Bot hat ein Schiff von dir versenkt! Bot nochmal.' : 'Bot trifft! Bot nochmal.';
    bsRender();
    setTimeout(bsBotTurn, 500);
  }
}

function bsReset(){
  bsBoardA = bsCreateBoard();
  bsBoardB = bsCreateBoard();
  bsOver = false;
  bsBotQueue = [];
  bsPhase = 'placing';
  bsPlacingSide = 'a';
  bsQueue = BS_SHIP_SIZES.slice();
  bsSelectedIdx = 0;
  bsPending = [];
  const who = bsMode === 'bot' ? 'Platziere deine Flotte' : 'Spieler 1: platziere deine Flotte';
  bsStatusEl.textContent = `${who} — wähle ein Schiff und Felder.`;
  bsRender();
}

bsClearBtn.addEventListener('click', () => {
  bsPending = [];
  bsStatusEl.textContent = 'Auswahl zurückgesetzt.';
  bsRender();
});
bsConfirmBtn.addEventListener('click', bsConfirmPlacement);
bsRandomBtn.addEventListener('click', () => {
  if(bsPhase !== 'placing') return;
  const board = bsPlacingSide === 'a' ? bsBoardA : bsBoardB;
  bsPlaceShipsRandom(board, bsQueue);
  bsQueue = [];
  bsPending = [];
  bsAdvancePlacement();
});

document.querySelectorAll('#bs-mode-select .mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#bs-mode-select .mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    bsMode = btn.dataset.mode;
    bsReset();
  });
});
document.getElementById('bs-reset-btn').addEventListener('click', bsReset);
bsMode = 'bot';
bsReset();

// Mühle
const MILL_COORDS = [
  [0,0],[3,0],[6,0],[6,3],[6,6],[3,6],[0,6],[0,3],
  [1,1],[3,1],[5,1],[5,3],[5,5],[3,5],[1,5],[1,3],
  [2,2],[3,2],[4,2],[4,3],[4,4],[3,4],[2,4],[2,3]
];
const MILL_ADJ = [
  [1,7],[0,2,9],[1,3],[2,4,11],[3,5],[4,6,13],[5,7],[6,0,15],
  [9,15],[8,10,1,17],[9,11],[10,12,3,19],[11,13],[12,14,5,21],[13,15],[14,8,7,23],
  [17,23],[16,18,9],[17,19],[18,20,11],[19,21],[20,22,13],[21,23],[22,16,15]
];
const MILL_LINES = [
  [0,1,2],[2,3,4],[4,5,6],[6,7,0],
  [8,9,10],[10,11,12],[12,13,14],[14,15,8],
  [16,17,18],[18,19,20],[20,21,22],[22,23,16],
  [1,9,17],[3,11,19],[5,13,21],[7,15,23]
];

let millBoard, millPhase, millTurn, millMode, millOver;
let millToPlace, millSelected, millRemoving;
const millBoardEl = document.getElementById('mill-board');
const millStatusEl = document.getElementById('mill-status');

function millGetLinesWith(idx){
  return MILL_LINES.filter(line => line.includes(idx));
}

function millFormsMill(board, idx, player){
  return millGetLinesWith(idx).some(line => line.every(i => board[i] === player));
}

function millIsInMill(board, idx){
  const player = board[idx];
  if(!player) return false;
  return millFormsMill(board, idx, player);
}

function millGetRemovable(board, opponent){
  const opponentIdx = [];
  for(let i = 0; i < 24; i++) if(board[i] === opponent) opponentIdx.push(i);
  const notInMill = opponentIdx.filter(i => !millIsInMill(board, i));
  return notInMill.length > 0 ? notInMill : opponentIdx;
}

function millCountPieces(board, player){
  return board.filter(v => v === player).length;
}

function millGetValidMoves(board, idx, player, canFly){
  if(canFly){
    const moves = [];
    for(let i = 0; i < 24; i++) if(!board[i]) moves.push(i);
    return moves;
  }
  return MILL_ADJ[idx].filter(n => !board[n]);
}

function millHasAnyMove(board, player, canFly){
  for(let i = 0; i < 24; i++){
    if(board[i] === player && millGetValidMoves(board, i, player, canFly).length > 0) return true;
  }
  return false;
}

function millRenderPiecesLeft(){
  const el = document.getElementById('mill-pieces-left');
  if(millPhase !== 'placing'){ el.innerHTML = ''; return; }
  el.innerHTML = `
    <div class="mill-count"><span class="dot white"></span> Braun: ${millToPlace.w} übrig</div>
    <div class="mill-count"><span class="dot black"></span> Schwarz: ${millToPlace.b} übrig</div>
  `;
}

function millRender(){
  millRenderPiecesLeft();
  millBoardEl.innerHTML = '';

  // Linien als SVG zeichnen
  const scale = 340 / 6.6; const offset = 20;
  function px(v){ return offset + v * (300/6); }
  let svg = `<svg viewBox="0 0 340 340">`;
  const edges = [];
  MILL_ADJ.forEach((neighbors, i) => {
    neighbors.forEach(n => {
      if(n > i) edges.push([i, n]);
    });
  });
  edges.forEach(([a, b]) => {
    const [ax, ay] = MILL_COORDS[a], [bx, by] = MILL_COORDS[b];
    svg += `<line x1="${px(ax)}" y1="${px(ay)}" x2="${px(bx)}" y2="${px(by)}" stroke="#8a8f9c" stroke-width="2.5"/>`;
  });
  svg += `</svg>`;
  millBoardEl.innerHTML = svg;

  const canFlyW = millPhase === 'moving' && millCountPieces(millBoard, 'w') === 3;
  const canFlyB = millPhase === 'moving' && millCountPieces(millBoard, 'b') === 3;

  for(let i = 0; i < 24; i++){
    const [cx, cy] = MILL_COORDS[i];
    const btn = document.createElement('button');
    btn.className = 'mill-point';
    if(millBoard[i] === 'w') btn.classList.add('white');
    if(millBoard[i] === 'b') btn.classList.add('black');
    if(millSelected === i) btn.classList.add('selected');
    if(millRemoving && millBoard[i] && millGetRemovable(millBoard, millTurn === 'w' ? 'b' : 'w').includes(i)){
      btn.classList.add('removable');
    }
    btn.style.left = px(cx) + 'px';
    btn.style.top = px(cy) + 'px';
    btn.addEventListener('click', () => millHandleClick(i));
    millBoardEl.appendChild(btn);
  }
}

function millHandleClick(i){
  if(millOver) return;
  if(millMode === 'bot' && millTurn === 'b') return;

  if(millRemoving){
    const removable = millGetRemovable(millBoard, millTurn === 'w' ? 'b' : 'w');
    if(!removable.includes(i)) return;
    millBoard[i] = null;
    millRemoving = false;
    millAfterAction();
    return;
  }

  if(millPhase === 'placing'){
    if(millBoard[i]) return;
    millBoard[i] = millTurn;
    millToPlace[millTurn]--;
    if(millFormsMill(millBoard, i, millTurn)){
      millRemoving = true;
      millStatusEl.textContent = `Mühle! ${millTurn === 'w' ? 'Braun' : 'Schwarz'} entfernt einen gegnerischen Stein.`;
      millRender();
      if(millMode === 'bot' && millTurn === 'w'){ /* Spieler entfernt selbst */ }
      return;
    }
    millAfterAction();
    return;
  }

  // Ziehphase
  const canFly = millCountPieces(millBoard, millTurn) === 3;
  if(millSelected === null){
    if(millBoard[i] === millTurn) {
      millSelected = i;
      millRender();
    }
    return;
  }
  if(millSelected === i){
    millSelected = null;
    millRender();
    return;
  }
  if(millBoard[i] === millTurn){
    millSelected = i;
    millRender();
    return;
  }
  const validMoves = millGetValidMoves(millBoard, millSelected, millTurn, canFly);
  if(!validMoves.includes(i)) return;

  millBoard[i] = millTurn;
  millBoard[millSelected] = null;
  const movedFrom = millSelected;
  millSelected = null;

  if(millFormsMill(millBoard, i, millTurn)){
    millRemoving = true;
    millStatusEl.textContent = `Mühle! ${millTurn === 'w' ? 'Braun' : 'Schwarz'} entfernt einen gegnerischen Stein.`;
    millRender();
    return;
  }
  millAfterAction();
}

function millAfterAction(){
  if(millPhase === 'placing' && millToPlace.w === 0 && millToPlace.b === 0){
    millPhase = 'moving';
  }

  millTurn = millTurn === 'w' ? 'b' : 'w';

  if(millPhase === 'moving'){
    const opponentCount = millCountPieces(millBoard, millTurn);
    if(opponentCount < 3){
      millOver = true;
      millStatusEl.textContent = `${millTurn === 'w' ? 'Schwarz' : 'Braun'} gewinnt — Gegner hat zu wenig Steine!`;
      millRender();
      return;
    }
    const canFly = opponentCount === 3;
    if(!millHasAnyMove(millBoard, millTurn, canFly)){
      millOver = true;
      millStatusEl.textContent = `${millTurn === 'w' ? 'Schwarz' : 'Braun'} gewinnt — Gegner kann nicht mehr ziehen!`;
      millRender();
      return;
    }
  }

  const phaseLabel = millPhase === 'placing' ? `Noch ${millToPlace[millTurn]} zu setzen.` : 'Ziehphase.';
  millStatusEl.textContent = `${millTurn === 'w' ? 'Braun' : 'Schwarz'} ist dran. ${phaseLabel}`;
  millRender();

  if(millMode === 'bot' && millTurn === 'b' && !millOver){
    setTimeout(millBotMove, 500);
  }
}

function millBotMove(){
  if(millOver) return;

  if(millPhase === 'placing'){
    let bestIdx = null;
    const empties = [];
    for(let i = 0; i < 24; i++) if(!millBoard[i]) empties.push(i);

    bestIdx = empties.find(i => { millBoard[i]='b'; const r=millFormsMill(millBoard,i,'b'); millBoard[i]=null; return r; });
    if(bestIdx === undefined){
      bestIdx = empties.find(i => { millBoard[i]='w'; const r=millFormsMill(millBoard,i,'w'); millBoard[i]=null; return r; });
    }
    if(bestIdx === undefined){
      const preferred = empties.filter(i => MILL_ADJ[i].length >= 3);
      bestIdx = preferred.length ? preferred[Math.floor(Math.random()*preferred.length)] : empties[Math.floor(Math.random()*empties.length)];
    }

    millBoard[bestIdx] = 'b';
    millToPlace.b--;
    if(millFormsMill(millBoard, bestIdx, 'b')){
      const removable = millGetRemovable(millBoard, 'w');
      const rem = removable[Math.floor(Math.random()*removable.length)];
      millBoard[rem] = null;
      millAfterAction();
      return;
    }
    millAfterAction();
    return;
  }

  // Ziehphase
  const canFly = millCountPieces(millBoard, 'b') === 3;
  const myPieces = [];
  for(let i = 0; i < 24; i++) if(millBoard[i] === 'b') myPieces.push(i);

  let chosen = null;
  for(const from of myPieces){
    for(const to of millGetValidMoves(millBoard, from, 'b', canFly)){
      millBoard[to] = 'b'; millBoard[from] = null;
      const formsMill = millFormsMill(millBoard, to, 'b');
      millBoard[from] = 'b'; millBoard[to] = null;
      if(formsMill){ chosen = { from, to }; break; }
    }
    if(chosen) break;
  }

  if(!chosen){
    const candidates = [];
    for(const from of myPieces){
      for(const to of millGetValidMoves(millBoard, from, 'b', canFly)){
        candidates.push({ from, to });
      }
    }
    chosen = candidates[Math.floor(Math.random()*candidates.length)];
  }

  if(!chosen) return;

  millBoard[chosen.to] = 'b';
  millBoard[chosen.from] = null;

  if(millFormsMill(millBoard, chosen.to, 'b')){
    const removable = millGetRemovable(millBoard, 'w');
    const rem = removable[Math.floor(Math.random()*removable.length)];
    millBoard[rem] = null;
  }
  millAfterAction();
}

function millReset(){
  millBoard = Array(24).fill(null);
  millPhase = 'placing';
  millTurn = 'w';
  millOver = false;
  millSelected = null;
  millRemoving = false;
  millToPlace = { w: 9, b: 9 };
  millStatusEl.textContent = 'Braun ist dran. Noch 9 zu setzen.';
  millRender();
}

document.querySelectorAll('#mill-mode-select .mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#mill-mode-select .mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    millMode = btn.dataset.mode;
    millReset();
  });
});
document.getElementById('mill-reset-btn').addEventListener('click', millReset);
millMode = 'bot';
millReset();

// Minesweeper
const msDiffs = {
  easy:   { size: 9,  mines: 10 },
  medium: { size: 12, mines: 24 },
  hard:   { size: 16, mines: 50 }
};
let msDiff = 'easy';
let msSize = 9, msMines = 10;
let msBoard = [];        // { mine, revealed, flagged, count }
let msOver = false;
let msFirstClick = true;
let msRevealedCount = 0;
let msSeconds = 0;
let msTimerInterval = null;

const msGrid = document.getElementById('ms-grid');
const msStatusEl = document.getElementById('ms-status');
const msMineCounterEl = document.getElementById('ms-mine-counter');
const msTimerEl = document.getElementById('ms-timer');
const msFaceBtn = document.getElementById('ms-face-btn');

function msPad(n){ return String(Math.max(0, Math.min(999, n))).padStart(3, '0'); }

function msUpdateMineCounter(){
  const flagged = msBoard.filter(s => s.flagged).length;
  msMineCounterEl.textContent = msPad(msMines - flagged);
}

function msStartTimer(){
  clearInterval(msTimerInterval);
  msSeconds = 0;
  msTimerEl.textContent = '000';
  msTimerInterval = setInterval(() => {
    msSeconds++;
    msTimerEl.textContent = msPad(msSeconds);
  }, 1000);
}

function msStopTimer(){
  clearInterval(msTimerInterval);
  msTimerInterval = null;
}

function msIndex(r, c){ return r * msSize + c; }

function msNeighbors(r, c){
  const out = [];
  for(let dr = -1; dr <= 1; dr++){
    for(let dc = -1; dc <= 1; dc++){
      if(dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if(nr >= 0 && nr < msSize && nc >= 0 && nc < msSize) out.push([nr, nc]);
    }
  }
  return out;
}

function msPlaceMines(excludeR, excludeC){
  const excluded = new Set(msNeighbors(excludeR, excludeC).map(([r,c]) => msIndex(r,c)));
  excluded.add(msIndex(excludeR, excludeC));
  let placed = 0;
  while(placed < msMines){
    const idx = Math.floor(Math.random() * msSize * msSize);
    if(excluded.has(idx) || msBoard[idx].mine) continue;
    msBoard[idx].mine = true;
    placed++;
  }
  for(let r = 0; r < msSize; r++){
    for(let c = 0; c < msSize; c++){
      let count = 0;
      msNeighbors(r, c).forEach(([nr,nc]) => { if(msBoard[msIndex(nr,nc)].mine) count++; });
      msBoard[msIndex(r,c)].count = count;
    }
  }
}

function msNewGame(){
  const cfg = msDiffs[msDiff];
  msSize = cfg.size; msMines = cfg.mines;
  msBoard = Array.from({ length: msSize * msSize }, () => ({ mine:false, revealed:false, flagged:false, count:0 }));
  msOver = false;
  msFirstClick = true;
  msRevealedCount = 0;
  msStopTimer();
  msTimerEl.textContent = '000';
  msMineCounterEl.textContent = msPad(msMines);
  msFaceBtn.textContent = '🙂';
  msGrid.style.gridTemplateColumns = `repeat(${msSize}, 1fr)`;
  msStatusEl.textContent = 'Linksklick zum Aufdecken, Rechtsklick zum Markieren';
  msRenderGrid();
}

function msRenderGrid(){
  msGrid.innerHTML = '';
  for(let r = 0; r < msSize; r++){
    for(let c = 0; c < msSize; c++){
      const cell = document.createElement('button');
      cell.className = 'ms-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      msGrid.appendChild(cell);
    }
  }
  msUpdateCells();
}

function msUpdateCells(){
  msGrid.querySelectorAll('.ms-cell').forEach(cell => {
    const r = Number(cell.dataset.r), c = Number(cell.dataset.c);
    const state = msBoard[msIndex(r,c)];
    cell.className = 'ms-cell' + ((r + c) % 2 ? ' alt' : '');
    cell.textContent = '';
    if(state.revealed){
      cell.classList.add('revealed');
      if(state.mine){
        cell.classList.add(cell.dataset.hit ? 'mine-hit' : 'mine');
        cell.textContent = '💣';
      } else if(state.count > 0){
        cell.classList.add('n' + state.count);
        cell.textContent = state.count;
      }
    } else if(state.flagged){
      cell.classList.add('flag');
      cell.textContent = '🚩';
    }
  });
}

function msFloodReveal(r, c){
  const stack = [[r,c]];
  while(stack.length){
    const [cr, cc] = stack.pop();
    const state = msBoard[msIndex(cr,cc)];
    if(state.revealed || state.flagged) continue;
    state.revealed = true;
    msRevealedCount++;
    if(state.count === 0 && !state.mine){
      msNeighbors(cr, cc).forEach(([nr,nc]) => {
        const ns = msBoard[msIndex(nr,nc)];
        if(!ns.revealed && !ns.flagged) stack.push([nr,nc]);
      });
    }
  }
}

function msReveal(r, c){
  if(msOver) return;
  const state = msBoard[msIndex(r,c)];
  if(state.revealed || state.flagged) return;

  if(msFirstClick){
    msPlaceMines(r, c);
    msFirstClick = false;
    msStartTimer();
  }

  if(state.mine){
    state.revealed = true;
    const hitCell = msGrid.querySelector(`.ms-cell[data-r="${r}"][data-c="${c}"]`);
    if(hitCell) hitCell.dataset.hit = '1';
    msOver = true;
    msStopTimer();
    msFaceBtn.textContent = '😵';
    msBoard.forEach(s => { if(s.mine) s.revealed = true; });
    msUpdateCells();
    msStatusEl.textContent = 'Mine getroffen! Spiel vorbei.';
    return;
  }

  msFloodReveal(r, c);
  msUpdateCells();

  if(msRevealedCount === msSize * msSize - msMines){
    msOver = true;
    msStopTimer();
    msFaceBtn.textContent = '😎';
    msMineCounterEl.textContent = '000';
    msStatusEl.textContent = 'Gewonnen! Alle Minen gefunden.';
  } else {
    msStatusEl.textContent = `Aufgedeckt: ${msRevealedCount} von ${msSize * msSize - msMines}`;
  }
}

function msToggleFlag(r, c){
  if(msOver) return;
  const state = msBoard[msIndex(r,c)];
  if(state.revealed) return;
  state.flagged = !state.flagged;
  msUpdateCells();
  msUpdateMineCounter();
}

msGrid.addEventListener('click', (e) => {
  const cell = e.target.closest('.ms-cell');
  if(!cell) return;
  msReveal(Number(cell.dataset.r), Number(cell.dataset.c));
});
msGrid.addEventListener('contextmenu', (e) => {
  const cell = e.target.closest('.ms-cell');
  if(!cell) return;
  e.preventDefault();
  msToggleFlag(Number(cell.dataset.r), Number(cell.dataset.c));
});
document.querySelectorAll('#ms-diff-select .diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#ms-diff-select .diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    msDiff = btn.dataset.diff;
    msNewGame();
  });
});
msFaceBtn.addEventListener('click', msNewGame);
msNewGame();

// Snake
const SNAKE_SIZE = 16;
const snakeGridEl = document.getElementById('snake-grid');
const snakeScoreEl = document.getElementById('snake-score');
const snakeBestEl = document.getElementById('snake-best');
const snakeStatusEl = document.getElementById('snake-status');

let snakeBody = [];
let snakeDir = { x: 1, y: 0 };
let snakeNextDir = { x: 1, y: 0 };
let snakeFood = { x: 0, y: 0 };
let snakeScore = 0;
let snakeBest = Number(localStorage.getItem('snake_best') || 0);
let snakeSpeed = 160;
let snakeInterval = null;
let snakeRunning = false;
let snakeOver = false;

function snakeCellIndex(x, y){ return y * SNAKE_SIZE + x; }

function snakeRandomFood(){
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * SNAKE_SIZE), y: Math.floor(Math.random() * SNAKE_SIZE) };
  } while(snakeBody.some(s => s.x === pos.x && s.y === pos.y));
  snakeFood = pos;
}

function snakeBuildGrid(){
  snakeGridEl.innerHTML = '';
  snakeGridEl.style.gridTemplateColumns = `repeat(${SNAKE_SIZE}, 1fr)`;
  for(let i = 0; i < SNAKE_SIZE * SNAKE_SIZE; i++){
    const cell = document.createElement('div');
    cell.className = 'snake-cell';
    snakeGridEl.appendChild(cell);
  }
}

function snakeDirDeg(v){
  if(v.x === 1) return 0;
  if(v.y === 1) return 90;
  if(v.x === -1) return 180;
  return 270;
}

function snakeHeadSVG(dir){
  const deg = snakeDirDeg(dir);
  return `<svg viewBox="0 0 24 24" style="overflow:visible;display:block;width:100%;height:100%;transform:rotate(${deg}deg);">
    <circle cx="15.5" cy="8" r="1.9" fill="#0c2b28"/>
    <circle cx="15.5" cy="16" r="1.9" fill="#0c2b28"/>
    <circle cx="16" cy="7.5" r="0.6" fill="#fff" opacity="0.8"/>
    <circle cx="16" cy="15.5" r="0.6" fill="#fff" opacity="0.8"/>
    <path d="M21 12 L26 10 M21 12 L26 14" stroke="#C94A3A" stroke-width="1.4" stroke-linecap="round" fill="none"/>
  </svg>`;
}

function snakeAppleSVG(){
  return `<svg viewBox="0 0 24 24" style="display:block;width:100%;height:100%;">
    <ellipse cx="12" cy="14" rx="7.3" ry="6.8" fill="#C6392B"/>
    <ellipse cx="9.2" cy="10.8" rx="2.7" ry="2.2" fill="#FF9482" opacity="0.85"/>
    <path d="M12 8 C11.2 5.6 12.6 4.2 14.4 3.7" stroke="#6B4423" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M14 4.6 C16.3 3.6 17.8 5 16.9 6.9 C15.5 7.4 14.1 6.5 14 4.6 Z" fill="#4C9A4C"/>
  </svg>`;
}

function snakeCornerRadius(i){
  const cur = snakeBody[i];
  const vectors = [];
  if(i > 0){
    const p = snakeBody[i - 1];
    vectors.push({ x: p.x - cur.x, y: p.y - cur.y });
  }
  if(i < snakeBody.length - 1){
    const n = snakeBody[i + 1];
    vectors.push({ x: n.x - cur.x, y: n.y - cur.y });
  }
  let connLeft = false, connRight = false, connTop = false, connBottom = false;
  vectors.forEach(v => {
    if(v.x === -1) connLeft = true;
    if(v.x === 1) connRight = true;
    if(v.y === -1) connTop = true;
    if(v.y === 1) connBottom = true;
  });
  const R = '45%', F = '10%';
  const tl = (!connTop && !connLeft) ? R : F;
  const tr = (!connTop && !connRight) ? R : F;
  const br = (!connBottom && !connRight) ? R : F;
  const bl = (!connBottom && !connLeft) ? R : F;
  return `${tl} ${tr} ${br} ${bl}`;
}

function snakeRender(){
  const cells = snakeGridEl.children;
  for(let i = 0; i < cells.length; i++){
    cells[i].className = 'snake-cell';
    cells[i].style.borderRadius = '';
    cells[i].innerHTML = '';
  }
  snakeBody.forEach((seg, i) => {
    const cell = cells[snakeCellIndex(seg.x, seg.y)];
    if(!cell) return;
    cell.style.borderRadius = snakeCornerRadius(i);
    if(i === 0){
      cell.className = 'snake-cell head';
      cell.innerHTML = snakeHeadSVG(snakeDir);
    } else {
      cell.className = 'snake-cell body';
    }
  });
  const foodCell = cells[snakeCellIndex(snakeFood.x, snakeFood.y)];
  if(foodCell){
    foodCell.classList.add('food');
    foodCell.innerHTML = snakeAppleSVG();
  }
}

function snakeStopLoop(){
  clearInterval(snakeInterval);
  snakeInterval = null;
}

function snakeStartLoop(){
  if(snakeInterval) return;
  snakeRunning = true;
  snakeInterval = setInterval(snakeTick, snakeSpeed);
}

function snakeReset(){
  snakeStopLoop();
  const mid = Math.floor(SNAKE_SIZE / 2);
  snakeBody = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
  snakeDir = { x: 1, y: 0 };
  snakeNextDir = { x: 1, y: 0 };
  snakeScore = 0;
  snakeSpeed = 160;
  snakeOver = false;
  snakeRunning = false;
  snakeScoreEl.textContent = msPad(snakeScore);
  snakeBestEl.textContent = msPad(snakeBest);
  snakeRandomFood();
  snakeBuildGrid();
  snakeRender();
  snakeStatusEl.textContent = 'Pfeiltasten zum Starten.';
}

function snakeGameOver(){
  snakeStopLoop();
  snakeOver = true;
  snakeRunning = false;
  snakeStatusEl.textContent = `Game Over! ${snakeScore} Punkte. Neues Spiel starten?`;
}

function snakeTick(){
  snakeDir = snakeNextDir;
  const head = snakeBody[0];
  const newHead = { x: head.x + snakeDir.x, y: head.y + snakeDir.y };

  if(newHead.x < 0 || newHead.x >= SNAKE_SIZE || newHead.y < 0 || newHead.y >= SNAKE_SIZE){
    snakeGameOver();
    return;
  }

  const willGrow = newHead.x === snakeFood.x && newHead.y === snakeFood.y;
  const bodyToCheck = willGrow ? snakeBody : snakeBody.slice(0, -1);
  if(bodyToCheck.some(s => s.x === newHead.x && s.y === newHead.y)){
    snakeGameOver();
    return;
  }

  snakeBody.unshift(newHead);
  if(willGrow){
    snakeScore++;
    snakeScoreEl.textContent = msPad(snakeScore);
    if(snakeScore > snakeBest){
      snakeBest = snakeScore;
      snakeBestEl.textContent = msPad(snakeBest);
      localStorage.setItem('snake_best', String(snakeBest));
    }
    snakeRandomFood();
    if(snakeSpeed > 70){
      snakeSpeed -= 4;
      snakeStopLoop();
      snakeInterval = setInterval(snakeTick, snakeSpeed);
    }
  } else {
    snakeBody.pop();
  }
  snakeRender();
}

function snakeSetDirection(dx, dy){
  if(snakeOver) return;
  if(snakeBody.length > 1 && dx === -snakeDir.x && dy === -snakeDir.y) return;
  snakeNextDir = { x: dx, y: dy };
  if(!snakeRunning) snakeStartLoop();
}

// Mehrere Spiele hören auf Pfeiltasten — nur das zuletzt angeklickte reagiert darauf
let gameArrowFocus = null;
snakeGridEl.addEventListener('pointerdown', () => { gameArrowFocus = 'snake'; });

document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if(tag === 'INPUT' || tag === 'TEXTAREA') return;
  const gamesView = document.getElementById('games-view');
  if(!gamesView || !gamesView.classList.contains('active')) return;
  if(gameArrowFocus !== 'snake') return;
  const map = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };
  const dir = map[e.key];
  if(dir){
    e.preventDefault();
    snakeSetDirection(dir[0], dir[1]);
  }
});

document.getElementById('snake-new-btn').addEventListener('click', snakeReset);
snakeReset();

// 2048
const G2048_SIZE = 4;
let g2048Board = [];
let g2048Score = 0;
let g2048Best = Number(localStorage.getItem('g2048_best') || 0);
let g2048Over = false;
let g2048Won = false;

const g2048GridEl = document.getElementById('g2048-grid');
const g2048ScoreEl = document.getElementById('g2048-score');
const g2048BestEl = document.getElementById('g2048-best');
const g2048StatusEl = document.getElementById('g2048-status');

function g2048Pad(n){ return String(Math.max(0, n)).padStart(3, '0'); }

function g2048Idx(r, c){ return r * G2048_SIZE + c; }

function g2048AddRandomTile(){
  const empties = [];
  for(let i = 0; i < g2048Board.length; i++){
    if(g2048Board[i] === 0) empties.push(i);
  }
  if(empties.length === 0) return;
  const idx = empties[Math.floor(Math.random() * empties.length)];
  g2048Board[idx] = Math.random() < 0.9 ? 2 : 4;
  return idx;
}

function g2048BuildGrid(){
  g2048GridEl.innerHTML = '';
  for(let i = 0; i < G2048_SIZE * G2048_SIZE; i++){
    const cell = document.createElement('div');
    cell.className = 'g2048-cell';
    g2048GridEl.appendChild(cell);
  }
}

function g2048Render(newIdx){
  const cells = g2048GridEl.children;
  g2048Board.forEach((v, i) => {
    const cell = cells[i];
    cell.textContent = v === 0 ? '' : v;
    cell.className = 'g2048-cell';
    if(v === 0){
      cell.removeAttribute('data-v');
    } else {
      cell.setAttribute('data-v', v);
      if(i === newIdx) cell.classList.add('g2048-new');
    }
  });
}

function g2048GetRow(r){ const row = []; for(let c = 0; c < G2048_SIZE; c++) row.push(g2048Board[g2048Idx(r, c)]); return row; }
function g2048SetRow(r, row){ for(let c = 0; c < G2048_SIZE; c++) g2048Board[g2048Idx(r, c)] = row[c]; }
function g2048GetCol(c){ const col = []; for(let r = 0; r < G2048_SIZE; r++) col.push(g2048Board[g2048Idx(r, c)]); return col; }
function g2048SetCol(c, col){ for(let r = 0; r < G2048_SIZE; r++) g2048Board[g2048Idx(r, c)] = col[r]; }

function g2048SlideLine(line){
  const filtered = line.filter(v => v !== 0);
  const merged = [];
  let gained = 0;
  for(let i = 0; i < filtered.length; i++){
    if(i < filtered.length - 1 && filtered[i] === filtered[i + 1]){
      const val = filtered[i] * 2;
      merged.push(val);
      gained += val;
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }
  while(merged.length < G2048_SIZE) merged.push(0);
  const moved = merged.some((v, i) => v !== line[i]);
  return { line: merged, gained, moved };
}

function g2048CanMove(){
  if(g2048Board.includes(0)) return true;
  for(let r = 0; r < G2048_SIZE; r++){
    for(let c = 0; c < G2048_SIZE; c++){
      const v = g2048Board[g2048Idx(r, c)];
      if(c < G2048_SIZE - 1 && g2048Board[g2048Idx(r, c + 1)] === v) return true;
      if(r < G2048_SIZE - 1 && g2048Board[g2048Idx(r + 1, c)] === v) return true;
    }
  }
  return false;
}

function g2048Move(dir){
  if(g2048Over) return;
  let anyMoved = false;
  let totalGained = 0;

  if(dir === 'left' || dir === 'right'){
    for(let r = 0; r < G2048_SIZE; r++){
      let row = g2048GetRow(r);
      if(dir === 'right') row = row.slice().reverse();
      const result = g2048SlideLine(row);
      let newRow = result.line;
      if(dir === 'right') newRow = newRow.slice().reverse();
      if(result.moved) anyMoved = true;
      totalGained += result.gained;
      g2048SetRow(r, newRow);
    }
  } else {
    for(let c = 0; c < G2048_SIZE; c++){
      let col = g2048GetCol(c);
      if(dir === 'down') col = col.slice().reverse();
      const result = g2048SlideLine(col);
      let newCol = result.line;
      if(dir === 'down') newCol = newCol.slice().reverse();
      if(result.moved) anyMoved = true;
      totalGained += result.gained;
      g2048SetCol(c, newCol);
    }
  }

  if(!anyMoved) return;

  g2048Score += totalGained;
  g2048ScoreEl.textContent = g2048Pad(g2048Score);
  if(g2048Score > g2048Best){
    g2048Best = g2048Score;
    g2048BestEl.textContent = g2048Pad(g2048Best);
    try{ localStorage.setItem('g2048_best', String(g2048Best)); } catch(err){}
  }

  const newIdx = g2048AddRandomTile();
  g2048Render(newIdx);

  if(!g2048Won && g2048Board.includes(2048)){
    g2048Won = true;
    g2048StatusEl.textContent = '🎉 2048 erreicht! Du kannst weiterspielen.';
  } else if(!g2048CanMove()){
    g2048Over = true;
    g2048StatusEl.textContent = `Game Over! ${g2048Score} Punkte.`;
  } else {
    g2048StatusEl.textContent = '';
  }
}

function g2048Reset(){
  g2048Board = Array(G2048_SIZE * G2048_SIZE).fill(0);
  g2048Score = 0;
  g2048Over = false;
  g2048Won = false;
  g2048AddRandomTile();
  g2048AddRandomTile();
  g2048ScoreEl.textContent = g2048Pad(g2048Score);
  g2048BestEl.textContent = g2048Pad(g2048Best);
  g2048StatusEl.textContent = 'Pfeiltasten zum Spielen.';
  g2048BuildGrid();
  g2048Render();
}

g2048GridEl.addEventListener('pointerdown', () => { gameArrowFocus = '2048'; });

document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if(tag === 'INPUT' || tag === 'TEXTAREA') return;
  const gamesView = document.getElementById('games-view');
  if(!gamesView || !gamesView.classList.contains('active')) return;
  if(gameArrowFocus !== '2048') return;
  const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  const dir = map[e.key];
  if(dir){
    e.preventDefault();
    g2048Move(dir);
  }
});

// Wischen auf Touchgeräten
let g2048TouchStartX = 0, g2048TouchStartY = 0;
g2048GridEl.addEventListener('touchstart', (e) => {
  gameArrowFocus = '2048';
  g2048TouchStartX = e.changedTouches[0].clientX;
  g2048TouchStartY = e.changedTouches[0].clientY;
}, { passive: true });
g2048GridEl.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - g2048TouchStartX;
  const dy = e.changedTouches[0].clientY - g2048TouchStartY;
  if(Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
  if(Math.abs(dx) > Math.abs(dy)){
    g2048Move(dx > 0 ? 'right' : 'left');
  } else {
    g2048Move(dy > 0 ? 'down' : 'up');
  }
});

document.getElementById('g2048-new-btn').addEventListener('click', g2048Reset);
g2048Reset();

cities.filter(c => c.name !== "Aarau").forEach(buildTimeCard);
buildCitySelect();
loadFullWeather(activeCity);
updateClocks();
setInterval(updateClocks, 1000);