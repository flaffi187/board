// Essen im Backofen (selbst gezeichnet). Jede Heizart hat ihr eigenes Gericht; wie weit es gebacken ist, steuert
// die CSS-Variable --bake (0 = roh, 1 = fertig) über die Klassen raw / baked / late / done-only (siehe globals.css).

const dots = (pts, r, fill, cls = '') =>
  pts.map(([x, y], i) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${Array.isArray(r) ? r[i % r.length] : r}" fill="${fill}"/>`).join('');

// Kuchen in der Springform: flüssiger Teig → geht über den Rand auf → goldbraun mit Rissen → Puderzucker & Himbeeren
const cake = `
<g class="food food-cake">
  <ellipse cx="85" cy="70" rx="66" ry="4.5" fill="rgba(0,0,0,.45)"/>
  <path d="M22 49 A63 10 0 0 1 148 49" fill="none" stroke="#a9a9a9" stroke-width="2"/>
  <g clip-path="url(#of-tin-clip)">
  <g class="cake-body">
    <path d="M28 38 L28 62 A57 9 0 0 0 142 62 L142 38 Z" fill="url(#of-cake-side-raw)"/>
    <path class="baked" d="M28 38 L28 62 A57 9 0 0 0 142 62 L142 38 Z" fill="url(#of-cake-side)"/>
    <g class="cake-dome">
      <path d="M28 38 C30 18 140 18 142 38 A57 9 0 0 1 28 38 Z" fill="url(#of-batter)"/>
      <path class="baked" d="M28 38 C30 18 140 18 142 38 A57 9 0 0 1 28 38 Z" fill="url(#of-cake-top)"/>
      <path class="late" d="M58 30 q8 4 15 -1 q7 -4 14 1 q6 4 13 -1" fill="none" stroke="#6e3510" stroke-width="1.6" stroke-linecap="round"/>
      <path class="late" d="M70 36 q6 -2 10 1" fill="none" stroke="#6e3510" stroke-width="1.2" stroke-linecap="round"/>
      <ellipse cx="66" cy="27" rx="22" ry="3.4" fill="#fff" opacity=".28"/>
      <g class="done-only">
        ${dots([[48,32],[56,28],[64,33],[72,26],[80,30],[88,25],[96,31],[104,27],[112,32],[120,29],[60,24],[76,23],[92,22],[108,24],[124,34],[44,36],[84,34],[100,35],[68,36],[116,36]], [1, 1.3, .8], '#fffaf0')}
        <g><circle cx="74" cy="25" r="4.2" fill="#c2182f"/><circle cx="72.8" cy="23.8" r="1.2" fill="#ff8a96"/></g>
        <g><circle cx="88" cy="22.5" r="4.2" fill="#b01428"/><circle cx="86.8" cy="21.3" r="1.2" fill="#ff8a96"/></g>
        <g><circle cx="101" cy="25.5" r="4.2" fill="#c2182f"/><circle cx="99.8" cy="24.3" r="1.2" fill="#ff8a96"/></g>
        <path d="M86 18 q3 -4 7 -3 q-2 3 -7 3z" fill="#3f8a3a"/>
      </g>
    </g>
  </g>
  </g>
  <path d="M22 49 L22 64 A63 9 0 0 0 148 64 L148 49 A63 10 0 0 1 22 49 Z" fill="url(#of-tin)"/>
  <path d="M22 49 A63 10 0 0 0 148 49" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.2"/>
  <path d="M24 60 A61 8 0 0 0 146 60" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>
  <rect x="141" y="53" width="9" height="6" rx="1.5" fill="#8b8b8b" stroke="#5f5f5f" stroke-width=".6"/>
</g>`;

// Brot: bemehlter Teigling → geht auf → Schnitte öffnen sich (helle Krume) → dunkle, glänzende Kruste
const bread = `
<g class="food food-bread">
  <ellipse cx="85" cy="70" rx="66" ry="4.5" fill="rgba(0,0,0,.45)"/>
  <path d="M14 64 L156 64 L152 69 L18 69 Z" fill="url(#of-tray)"/>
  <path d="M14 64 L156 64" stroke="rgba(255,255,255,.55)" stroke-width="1"/>
  <path d="M26 63 L144 63 L140 66 L30 66 Z" fill="#efe1c3" opacity=".9"/>
  <g class="loaf">
    <path d="M32 63 C24 44 50 22 85 22 C120 22 146 44 138 63 Z" fill="url(#of-dough)"/>
    <path class="baked" d="M32 63 C24 44 50 22 85 22 C120 22 146 44 138 63 Z" fill="url(#of-crust)"/>
    <path class="baked" d="M34 60 C40 63 130 63 136 60 L138 63 L32 63 Z" fill="#4a1d06" opacity=".55"/>
    ${[[52, 44], [76, 37], [100, 37]].map(([x, y]) => `
      <g class="score" transform="translate(${x} ${y}) rotate(-28)">
        <ellipse class="score-crumb" cx="12" cy="0" rx="13" ry="3.4" fill="#f6e4bd"/>
        <path class="late" d="M-1 0 q13 -4.8 26 0" fill="none" stroke="#5a2508" stroke-width="1.4" stroke-linecap="round"/>
        <path class="raw" d="M0 0 q12 -1.5 24 0" fill="none" stroke="#c9a868" stroke-width="1.2" stroke-linecap="round"/>
      </g>`).join('')}
    <path d="M46 32 C60 25 84 23 104 26" fill="none" stroke="rgba(255,240,210,.5)" stroke-width="2.4" stroke-linecap="round"/>
    ${dots([[60,30],[68,27],[82,26],[94,27],[106,30],[114,34],[56,36],[88,31],[72,33],[118,40],[48,40],[100,33]], [1.1, .8, 1.4], 'rgba(255,255,255,.8)', 'flour')}
  </g>
</g>`;

// Würstchen auf dem Grillrost: rosa mit Fettpünktchen → braun, glänzend, mit Grillstreifen (genau über den Stäben)
const GRATE = { backY: 38, frontY: 72, back: [38, 132], front: [12, 158], bars: 9 };
const barX = (t, y) => {   // x-Position von Stab t (0..1) auf Höhe y
  const k = (y - GRATE.backY) / (GRATE.frontY - GRATE.backY);
  const bx = GRATE.back[0] + (GRATE.back[1] - GRATE.back[0]) * t, fx = GRATE.front[0] + (GRATE.front[1] - GRATE.front[0]) * t;
  return bx + (fx - bx) * k;
};
const sausage = (n, y, scale) => {
  const len = 44;   // halbe Länge ohne Enden (bei scale 1)
  const body = `M${-len} -4.5 Q0 -6.5 ${len} -4.5 A5 5 0 0 1 ${len} 5.5 Q0 3.5 ${-len} 5.5 A5 5 0 0 1 ${-len} -4.5 Z`;
  // Grillstreifen dort, wo die Stäbe unter der Wurst liegen (in lokale Koordinaten umgerechnet)
  const marks = Array.from({ length: GRATE.bars }, (_, b) => (barX(b / (GRATE.bars - 1), y) - 85) / scale)
    .filter(x => x > -len - 2 && x < len + 2)
    .map(x => `<path d="M${(x + 1.6).toFixed(1)} -9 L${(x - 1.6).toFixed(1)} 9"/>`).join('');
  return `
  <g class="saus" transform="translate(85 ${y}) scale(${scale})">
    <clipPath id="of-saus-${n}"><path d="${body}"/></clipPath>
    <ellipse cx="2" cy="7" rx="${len + 3}" ry="2" fill="rgba(0,0,0,.5)"/>
    <path d="${body}" fill="url(#of-sausage-raw)"/>
    <path class="baked" d="${body}" fill="url(#of-sausage)"/>
    <g clip-path="url(#of-saus-${n})">
      ${dots([[-36,-1],[-22,1.5],[-8,-2],[8,1],[22,-1.5],[36,1.5],[-29,2.5],[15,2.5],[0,3]], [.8, .6], 'rgba(255,240,235,.9)', 'raw')}
      <g class="late" stroke="#1e0c03" stroke-width="2.6" stroke-linecap="butt" opacity=".9">${marks}</g>
      <path d="M${-len} 4.5 Q0 2.5 ${len} 4.5" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="2.4"/>
    </g>
    <path d="M${-len + 4} -2.6 Q0 -4.8 ${len - 4} -2.6" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>
  </g>`;
};
const grill = `
<g class="food food-grill">
  <ellipse cx="85" cy="72" rx="74" ry="4" fill="rgba(0,0,0,.45)"/>
  <g stroke-linecap="round">
    ${Array.from({ length: GRATE.bars }, (_, b) => { const t = b / (GRATE.bars - 1); return `<path d="M${barX(t, GRATE.backY).toFixed(1)} ${GRATE.backY} L${barX(t, GRATE.frontY).toFixed(1)} ${GRATE.frontY}" stroke="#7d7d7d" stroke-width="1.6"/>`; }).join('')}
    <path d="M${GRATE.back[0]} ${GRATE.backY} L${GRATE.back[1]} ${GRATE.backY} L${GRATE.front[1]} ${GRATE.frontY} L${GRATE.front[0]} ${GRATE.frontY} Z" fill="none" stroke="#a4a4a4" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M${barX(0, 55).toFixed(1)} 55 L${barX(1, 55).toFixed(1)} 55" stroke="#8e8e8e" stroke-width="1.4"/>
    <path d="M${GRATE.front[0]} ${GRATE.frontY} L${GRATE.front[1]} ${GRATE.frontY}" stroke="#d6d6d6" stroke-width="1" opacity=".7"/>
  </g>
  ${sausage(0, 44.5, .78)}
  ${sausage(1, 55.5, .89)}
  ${sausage(2, 66.5, 1)}
</g>`;

// Pizza auf dem Stein: geriebener Käse → schmilzt (Blasen) → goldene Flecken, knusprige Salami → frisches Basilikum
const pepperoni = [[52, 54], [72, 51], [94, 52], [116, 54], [62, 60], [86, 59], [108, 60], [130, 58], [42, 59]];
const pizza = `
<g class="food food-pizza">
  <ellipse cx="85" cy="68" rx="76" ry="6" fill="rgba(0,0,0,.4)"/>
  <ellipse cx="85" cy="64" rx="76" ry="10" fill="url(#of-stone)"/>
  <ellipse cx="85" cy="59" rx="68" ry="11" fill="#d9b77d"/>
  <ellipse class="baked" cx="85" cy="59" rx="68" ry="11" fill="#8f4a1b"/>
  <ellipse cx="85" cy="57" rx="68" ry="11" fill="url(#of-pizza-dough)"/>
  <ellipse class="baked" cx="85" cy="57" rx="68" ry="11" fill="url(#of-pizza-crust)"/>
  ${dots([[30,58],[44,50],[66,47],[104,47],[126,50],[140,58],[120,65],[50,65],[85,67]], [1.4, 1], 'rgba(90,40,10,.6)', 'late')}
  <ellipse cx="85" cy="56.5" rx="60" ry="8.6" fill="#b8281c"/>
  <ellipse cx="85" cy="56" rx="57" ry="8" fill="url(#of-cheese-raw)"/>
  <ellipse class="baked" cx="85" cy="56" rx="57" ry="8" fill="url(#of-cheese)"/>
  <g class="raw" stroke="#fffaf0" stroke-width="1.1" stroke-linecap="round">
    ${[[40,55,20],[52,51,-30],[64,58,45],[78,50,10],[90,57,-20],[104,52,35],[118,57,-40],[130,54,15],[58,61,-10],[96,61,25],[72,54,60],[112,60,0]].map(([x, y, r]) => `<path d="M${x - 3} ${y} l6 0" transform="rotate(${r} ${x} ${y})"/>`).join('')}
  </g>
  ${dots([[46,53],[60,57],[82,55],[98,50],[120,55],[70,61],[110,58],[90,61],[132,57],[54,50]], [2.2, 1.6, 2.8], '#b8651c', 'late spot')}
  ${pepperoni.map(([x, y]) => `
    <ellipse cx="${x}" cy="${y}" rx="6.8" ry="3" fill="#a3211a"/>
    <ellipse class="baked" cx="${x}" cy="${y}" rx="6.8" ry="3" fill="none" stroke="#5c0f0a" stroke-width="1.2"/>
    <ellipse cx="${x - 1.5}" cy="${y - .8}" rx="2.4" ry=".9" fill="#ff8a7a" opacity=".55"/>
    ${dots([[x + 2, y + .5], [x - 3, y + .8], [x + .5, y - 1]], .5, '#f7d3c7', 'raw')}`).join('')}
  ${[[78, 55], [100, 57], [56, 57]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.3" fill="#1b1b1b"/><ellipse cx="${x}" cy="${y}" rx="1.1" ry=".5" fill="#6b3a2a"/>`).join('')}
  ${dots([[50,55],[68,58],[88,52],[104,56],[124,58],[74,52],[114,51]], [1.3, 1, 1.6], '#fff3c8', 'bubble')}
  <g class="done-only">
    ${[[66, 51, -20], [92, 55, 15], [118, 51, -35], [80, 60, 40]].map(([x, y, r]) => `
      <g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 q5 -4.5 10 0 q-5 4.5 -10 0z" fill="#3f8f3a"/><path d="M0.5 0 l9 0" stroke="#2a6a28" stroke-width=".6"/></g>`).join('')}
  </g>
</g>`;

const defs = `
<defs>
  <clipPath id="of-tin-clip"><path d="M22 0 H148 V63 A63 9 0 0 1 22 63 Z"/></clipPath>
  <linearGradient id="of-batter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf0c4"/><stop offset="1" stop-color="#efd68f"/></linearGradient>
  <radialGradient id="of-cake-top" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#e2a457"/><stop offset=".55" stop-color="#c47a34"/><stop offset="1" stop-color="#8e4a18"/></radialGradient>
  <linearGradient id="of-cake-side-raw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2d98e"/><stop offset="1" stop-color="#e6c473"/></linearGradient>
  <linearGradient id="of-cake-side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a65e24"/><stop offset=".25" stop-color="#d8a25a"/><stop offset="1" stop-color="#ecc888"/></linearGradient>
  <linearGradient id="of-tin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2f2f2"/><stop offset=".35" stop-color="#b9b9b9"/><stop offset=".7" stop-color="#8a8a8a"/><stop offset="1" stop-color="#bdbdbd"/></linearGradient>
  <linearGradient id="of-tray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a9a9a"/><stop offset="1" stop-color="#4c4c4c"/></linearGradient>
  <radialGradient id="of-dough" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#fbf0d4"/><stop offset=".7" stop-color="#ead5a3"/><stop offset="1" stop-color="#d9bd82"/></radialGradient>
  <radialGradient id="of-crust" cx=".45" cy=".25" r=".85"><stop offset="0" stop-color="#d48b44"/><stop offset=".45" stop-color="#a85a22"/><stop offset=".85" stop-color="#7a3a10"/><stop offset="1" stop-color="#5c2a0a"/></radialGradient>
  <linearGradient id="of-sausage-raw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7c4bb"/><stop offset=".5" stop-color="#e79a90"/><stop offset="1" stop-color="#c8746b"/></linearGradient>
  <linearGradient id="of-sausage" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8743a"/><stop offset=".45" stop-color="#93451b"/><stop offset="1" stop-color="#4f1d08"/></linearGradient>
  <radialGradient id="of-stone" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#5a5550"/><stop offset="1" stop-color="#2e2b28"/></radialGradient>
  <radialGradient id="of-pizza-dough" cx=".5" cy=".4" r=".6"><stop offset=".75" stop-color="#f3dfb0"/><stop offset="1" stop-color="#e2c38a"/></radialGradient>
  <radialGradient id="of-pizza-crust" cx=".5" cy=".4" r=".6"><stop offset=".72" stop-color="#e6ad5e"/><stop offset=".9" stop-color="#c27a35"/><stop offset="1" stop-color="#8f4a1b"/></radialGradient>
  <radialGradient id="of-cheese-raw" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff6d6"/><stop offset="1" stop-color="#f7e3a6"/></radialGradient>
  <radialGradient id="of-cheese" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#ffd977"/><stop offset=".7" stop-color="#f4b847"/><stop offset="1" stop-color="#d98f2c"/></radialGradient>
</defs>`;

export const OVEN_FOOD_SVG = defs + cake + bread + grill + pizza;
