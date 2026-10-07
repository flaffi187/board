import Script from 'next/script';

export default function Page() {
  return (
    <>

<div className="page">
<header>
  <div className="title-block">
    <span className="kicker">Persönliches Board</span>
    <h1 id="greeting-title">ufl home</h1>
  </div>
  <div className="header-controls">
    <button id="theme-toggle-btn" className="theme-toggle-btn" title="Hell/Dunkel umschalten" aria-label="Hell/Dunkel umschalten">
      <svg className="moon-icon theme-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
    </button>
    <label className="accent-swatch" title="Hintergrundfarbe ändern" aria-label="Hintergrundfarbe ändern">
      <input type="color" id="accent-color-input" defaultValue="#1A1918" />
    </label>
  </div>
</header>

<div className="tabs">
  <button className="tab-btn active" data-view="overview-view">01 Übersicht</button>
  <button className="tab-btn" data-view="time-view">02 Uhrzeit</button>
  <button className="tab-btn" data-view="wx-view">03 Wetter</button>
  <button className="tab-btn" data-view="todo-view">04 To-Do</button>
  <button className="tab-btn" data-view="cal-view">05 Kalender</button>
  <button className="tab-btn" data-view="calc-view">06 Rechner</button>
  <button className="tab-btn" data-view="timer-view">07 Timer</button>
  <button className="tab-btn" data-view="apps-view">08 Apps</button>
  <button className="tab-btn" data-view="games-view">09 Spiele</button>
</div>

<div className="view active" id="overview-view">
  <div className="panel-label">Register</div>
  <div className="overview-wrap">
    <div className="honeycomb-bg" id="honeycomb-bg"></div>
    <div className="overview-grid">
      <button className="overview-card ov-clock" data-jump="time-view">
        <span className="ov-name">Uhrzeit</span>
      </button>
      <button className="overview-card ov-weather" data-jump="wx-view">
        <span className="ov-name">Wetter</span>
      </button>
      <button className="overview-card ov-todo" data-jump="todo-view">
        <span className="ov-name">To-Do</span>
      </button>
      <button className="overview-card ov-kalender" data-jump="cal-view">
        <span className="ov-name">Kalender</span>
      </button>
      <button className="overview-card ov-rechner" data-jump="calc-view">
        <span className="ov-name">Rechner</span>
      </button>
      <button className="overview-card ov-timer" data-jump="timer-view">
        <span className="ov-name">Timer</span>
      </button>
      <button className="overview-card ov-apps" data-jump="apps-view">
        <span className="ov-name">Apps</span>
      </button>
      <button className="overview-card ov-games" data-jump="games-view">
        <span className="ov-name">Spiele</span>
      </button>
    </div>
  </div>
  <div className="meadow" id="meadow"></div>
  <div className="bee-layer" id="bee-layer"></div>
</div>

<div className="view" id="time-view">
  <div className="time-view-layout">
    <div className="board-grid" id="board-time"></div>
    <div className="owl-nest">
      <div className="nest-shadow"></div>
      <div className="nest-bowl">
        <div className="nest-inner">
          <div className="owl-scale owl-scale-back owl-scale-back-left">
            <div className="owl-egg"></div>
          </div>
          <div className="owl-scale owl-scale-back">
            <div className="owl-egg"></div>
          </div>
          <div className="owl-scale">
            <div className="baby-owl owl-1">
              <div className="owl-ear owl-ear-l"></div>
              <div className="owl-ear owl-ear-r"></div>
              <div className="owl-body">
                <div className="owl-wing owl-wing-l"></div>
                <div className="owl-wing owl-wing-r"></div>
                <div className="owl-face"></div>
                <div className="owl-belly"></div>
                <div className="owl-eye owl-eye-l"><span></span></div>
                <div className="owl-eye owl-eye-r"><span></span></div>
                <div className="owl-beak"></div>
                <div className="owl-foot owl-foot-l"></div>
                <div className="owl-foot owl-foot-r"></div>
              </div>
            </div>
          </div>
          <div className="owl-scale">
            <div className="baby-owl owl-2">
              <div className="owl-ear owl-ear-l"></div>
              <div className="owl-ear owl-ear-r"></div>
              <div className="owl-body">
                <div className="owl-wing owl-wing-l"></div>
                <div className="owl-wing owl-wing-r"></div>
                <div className="owl-face"></div>
                <div className="owl-belly"></div>
                <div className="owl-eye owl-eye-l"><span></span></div>
                <div className="owl-eye owl-eye-r"><span></span></div>
                <div className="owl-beak"></div>
                <div className="owl-foot owl-foot-l"></div>
                <div className="owl-foot owl-foot-r"></div>
              </div>
            </div>
          </div>
          <div className="owl-scale">
            <div className="baby-owl owl-3">
              <div className="owl-ear owl-ear-l"></div>
              <div className="owl-ear owl-ear-r"></div>
              <div className="owl-body">
                <div className="owl-wing owl-wing-l"></div>
                <div className="owl-wing owl-wing-r"></div>
                <div className="owl-face"></div>
                <div className="owl-belly"></div>
                <div className="owl-eye owl-eye-l"><span></span></div>
                <div className="owl-eye owl-eye-r"><span></span></div>
                <div className="owl-beak"></div>
                <div className="owl-foot owl-foot-l"></div>
                <div className="owl-foot owl-foot-r"></div>
              </div>
            </div>
          </div>
          <div className="owl-scale">
            <div className="owl-egg"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div className="view" id="wx-view">
  <div className="city-select" id="city-select"></div>
  <div className="wx-detail-panel" id="wx-detail"></div>
</div>

<div className="view" id="todo-view">
  <div className="panel-label">Neue Aufgabe</div>
  <div className="todo-input-row">
    <input type="text" id="todo-input" placeholder="Was steht an? …" />
    <button id="todo-add-btn">+ Hinzufügen</button>
  </div>
  <ul className="todo-list" id="todo-list"></ul>

  <div className="notes-section">
    <div className="panel-label">Notizen</div>
    <textarea id="notes-box" placeholder="Hier kannst du dir Notizen aufschreiben …"></textarea>
  </div>
</div>

<div className="view" id="cal-view">
  <div className="cal-header">
    <button className="cal-nav" id="cal-prev">‹</button>
    <div className="cal-month-label" id="cal-month-label"></div>
    <button className="cal-nav" id="cal-next">›</button>
    <button className="cal-today-btn" id="cal-today-btn">Heute</button>
  </div>
  <div className="ladder-board" id="ladder-board">
    <div className="cal-grid" id="cal-grid"></div>
    <svg className="ladder-svg" id="ladder-svg" aria-hidden="true"></svg>
    <div className="pawn-layer" id="pawn-layer"></div>
  </div>
  <div className="ladder-controls">
    <div className="popcorn-machine" id="popcorn-machine">
      <div className="pm-roof"><span>POPCORN</span></div>
      <div className="pm-glass">
        <div className="pm-pile" id="pm-pile" aria-hidden="true"></div>
        <button className="ladder-die" id="ladder-die" title="Würfeln" aria-label="Würfeln"></button>
      </div>
      <div className="pm-base"><i></i><i></i></div>
    </div>
    <div className="ladder-status" id="ladder-status"></div>
    <button className="ladder-reset" id="ladder-reset">Neues Spiel</button>
  </div>

  <div className="cal-day-panel">
    <div className="panel-label" id="cal-selected-label">Eintrag hinzufügen</div>
    <div className="film-input-row">
      <svg className="film-reel" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <radialGradient id="reelMetal" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#c9d1d9" />
            <stop offset="100%" stopColor="#6b737b" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#reelMetal)" stroke="#4d545c" strokeWidth="1.2" />
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" />
        <g fill="#1d1f24">
          <ellipse cx="32" cy="14.5" rx="6.5" ry="7.5" />
          <ellipse cx="48.6" cy="26.6" rx="6.5" ry="7.5" transform="rotate(72 48.6 26.6)" />
          <ellipse cx="42.3" cy="46.2" rx="6.5" ry="7.5" transform="rotate(144 42.3 46.2)" />
          <ellipse cx="21.7" cy="46.2" rx="6.5" ry="7.5" transform="rotate(216 21.7 46.2)" />
          <ellipse cx="15.4" cy="26.6" rx="6.5" ry="7.5" transform="rotate(288 15.4 26.6)" />
        </g>
        <circle cx="32" cy="32" r="6" fill="#9aa3ad" stroke="#4d545c" strokeWidth="1" />
        <circle cx="32" cy="32" r="2.2" fill="#1d1f24" />
      </svg>
      <div className="film-strip">
        <input type="text" id="cal-entry-input" placeholder="Dieser Tag. Diese Mission." />
        <button id="cal-entry-add-btn">Action</button>
      </div>
    </div>
    <ul className="todo-list" id="cal-entry-list"></ul>
  </div>
</div>

<div className="view" id="calc-view">
  <div className="panel-label">Rechner</div>
  {/* Rechner im Stil eines alten Nokia-Handys */}
  <div className="calc-box nokia">
    <div className="nokia-ear"></div>
    <div className="nokia-logo">NOKIA</div>
    <div className="nokia-bezel">
      <div className="calc-display nokia-lcd">
        <div className="nokia-status">
          <span className="nokia-bars signal"><i></i><i></i><i></i><i></i></span>
          <span className="nokia-title">Rechner</span>
          <span className="nokia-bars battery"><i></i><i></i><i></i><i></i></span>
        </div>
        <div className="calc-expr" id="calc-expr"></div>
        <div className="calc-current" id="calc-display">0</div>
        <div className="nokia-soft"><span>Löschen</span><span>Ergebnis</span></div>
      </div>
      {/* Kaputter Bildschirm: ausgelaufenes LCD, tote Pixel-Spalten und Risse im Glas */}
      <svg className="nokia-crack" viewBox="0 0 220 160" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <radialGradient id="lcdInk" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d140a" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#1e2b14" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#3a5a2a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M30 18 C44 10 62 16 66 30 C72 44 58 56 44 54 C30 60 16 50 18 36 C10 28 18 20 30 18 Z" fill="url(#lcdInk)" />
        <path d="M58 40 C70 44 80 60 74 70 C66 64 62 54 58 40 Z" fill="#1e2b14" opacity="0.45" />
        <rect x="88" y="12" width="2" height="136" fill="#1e2b14" opacity="0.35" />
        <rect x="93" y="12" width="1" height="136" fill="#f2ffe0" opacity="0.25" />
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g stroke="rgba(0,0,0,0.45)" strokeWidth="2.6">
            <path d="M40 34 L58 30 L80 36 L110 30 L150 40 L200 34 L220 38" />
            <path d="M40 34 L52 56 L48 80 L64 110 L60 160" />
            <path d="M40 34 L18 50 L0 46" />
            <path d="M40 34 L30 10 L36 0" />
            <path d="M40 34 L70 64 L100 74 L130 106 L170 116 L220 140" />
            <path d="M80 36 L92 14 L118 6" />
            <path d="M52 56 L28 76 L0 82" />
          </g>
          <g stroke="rgba(255,255,255,0.85)" strokeWidth="1.1">
            <path d="M40 34 L58 30 L80 36 L110 30 L150 40 L200 34 L220 38" />
            <path d="M40 34 L52 56 L48 80 L64 110 L60 160" />
            <path d="M40 34 L18 50 L0 46" />
            <path d="M40 34 L30 10 L36 0" />
            <path d="M40 34 L70 64 L100 74 L130 106 L170 116 L220 140" />
            <path d="M80 36 L92 14 L118 6" />
            <path d="M52 56 L28 76 L0 82" />
            <path d="M58 30 L66 18 M110 30 L118 46 M150 40 L156 24 M48 80 L36 92 M100 74 L104 92 M130 106 L126 126 M70 64 L82 52" strokeWidth="0.7" />
          </g>
          <circle cx="40" cy="34" r="7" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
          <circle cx="40" cy="34" r="12" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" strokeDasharray="6 4" />
        </g>
        <path d="M58 30 L80 36 L70 64 L52 56 Z" fill="rgba(255,255,255,0.10)" />
        <path d="M110 30 L150 40 L130 106 L100 74 Z" fill="rgba(255,255,255,0.05)" />
        <circle cx="40" cy="34" r="2.4" fill="rgba(255,255,255,0.9)" />
      </svg>
    </div>
    <div className="nokia-nav">
      <button className="calc-btn nokia-c" data-key="C">C</button>
      <button className="calc-btn nokia-navi" data-key="=">=</button>
      <button className="calc-btn nokia-back" data-key="back">⌫</button>
    </div>
    <div className="nokia-ops">
      <button className="calc-btn nokia-op" data-key="/">÷</button>
      <button className="calc-btn nokia-op" data-key="*">×</button>
      <button className="calc-btn nokia-op" data-key="-">−</button>
      <button className="calc-btn nokia-op" data-key="+">+</button>
    </div>
    <div className="calc-grid nokia-keys">
        <button className="calc-btn nokia-key" data-key="1">1<small></small></button>
        <button className="calc-btn nokia-key" data-key="2">2<small>abc</small></button>
        <button className="calc-btn nokia-key" data-key="3">3<small>def</small></button>
        <button className="calc-btn nokia-key" data-key="4">4<small>ghi</small></button>
        <button className="calc-btn nokia-key" data-key="5">5<small>jkl</small></button>
        <button className="calc-btn nokia-key" data-key="6">6<small>mno</small></button>
        <button className="calc-btn nokia-key" data-key="7">7<small>pqrs</small></button>
        <button className="calc-btn nokia-key" data-key="8">8<small>tuv</small></button>
        <button className="calc-btn nokia-key" data-key="9">9<small>wxyz</small></button>
        <button className="calc-btn nokia-key" data-key=".">,<small>*</small></button>
        <button className="calc-btn nokia-key" data-key="0">0<small>␣</small></button>
        <button className="calc-btn nokia-key" data-key="%">%<small>#</small></button>
    </div>
    <div className="nokia-mic"></div>
  </div>

  <div className="panel-label" style={{ marginTop: "44px" }}>Umrechner</div>
  {/* Umrechner als Game Boy */}
  <div className="conv-wrap gameboy">
    <div className="gb-power"><span>◁ OFF</span><i></i><span>ON ▷</span></div>
    <div className="gb-contrast" aria-hidden="true"></div>
    <div className="gb-bezel">
      <div className="gb-bezel-top"><span>DOT MATRIX WITH STEREO SOUND</span></div>
      <div className="gb-led"><i></i><span>BATTERY</span></div>
      <div className="gb-screen" id="gb-screen">
        <div className="gb-boot" aria-hidden="true">GAME BOY</div>
        <div className="gb-cursor" id="gb-cursor" aria-hidden="true">▶</div>
    <div className="mode-select" id="conv-mode-select">
      <button className="mode-btn active" data-mode="unit">
        {/* Einheiten: Lineal mit m/ft und zwei Umrechnungs-Pfeilen */}
        <svg className="mode-icon" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M11 27 A22 22 0 0 1 50 17" fill="none" stroke="#c0392b" strokeWidth="5" strokeLinecap="round" />
          <path d="M45 8 L56 19 L42 23 Z" fill="#c0392b" />
          <path d="M53 37 A22 22 0 0 1 14 47" fill="none" stroke="#f2ecdd" strokeWidth="5" strokeLinecap="round" />
          <path d="M19 56 L8 45 L22 41 Z" fill="#f2ecdd" />
          <text x="32" y="24" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="9" fill="#f2ecdd">m</text>
          <rect x="19" y="27" width="26" height="9" rx="2" fill="#f2ecdd" />
          <path d="M22.5 27 v4 M26 27 v3 M29.5 27 v4 M33 27 v3 M36.5 27 v4 M40 27 v3 M43 27 v2.5" stroke="#1b1a17" strokeWidth="1.1" />
          <text x="32" y="46" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="9" fill="#f2ecdd">ft</text>
        </svg>
        <span>Einheiten</span>
      </button>
      <button className="mode-btn" data-mode="currency">
        {/* Währung: Dollarschein */}
        <svg className="mode-icon" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="4" y="16" width="56" height="32" rx="3" fill="#6fae5a" stroke="#2f6b2a" strokeWidth="2" />
          <rect x="8.5" y="20.5" width="47" height="23" rx="2" fill="none" stroke="#d9f0c8" strokeWidth="1.2" strokeDasharray="2 1.5" />
          <ellipse cx="32" cy="32" rx="9" ry="10" fill="#d9f0c8" stroke="#2f6b2a" strokeWidth="1.4" />
          <text x="32" y="37.5" textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="15" fill="#2f6b2a">$</text>
          <circle cx="14" cy="32" r="4" fill="none" stroke="#2f6b2a" strokeWidth="1.4" />
          <circle cx="50" cy="32" r="4" fill="none" stroke="#2f6b2a" strokeWidth="1.4" />
          <text x="11" y="26" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="6" fill="#2f6b2a">1</text>
          <text x="50" y="44" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="6" fill="#2f6b2a">1</text>
        </svg>
        <span>Währung</span>
      </button>
    </div>

    <div id="conv-unit-panel">
      <div className="diff-select" id="conv-cat-select" style={{ marginBottom: "16px" }}>
        <button className="diff-btn active" data-cat="length">
          {/* Länge: gelber Meterstab */}
          <svg className="cat-icon" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M6 44 L26 24 L32 30 L52 10 L58 16 L38 36 L32 30" fill="none" stroke="#7a5a10" strokeWidth="11" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M6 44 L26 24 L32 30 L52 10 L58 16 L38 36 L32 30" fill="none" stroke="#f2c230" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M10 42 l-2 -2 M14 38 l-3 -3 M18 34 l-2 -2 M22 30 l-3 -3 M44 18 l-2 -2 M48 14 l-3 -3 M52 10 l-2 -2 M42 34 l-2 -2 M46 30 l-3 -3 M50 26 l-2 -2 M54 22 l-3 -3" stroke="#3a2a06" strokeWidth="1.2" />
            <circle cx="26" cy="24" r="1.8" fill="#9aa3ad" stroke="#4d545c" strokeWidth="0.6" />
            <circle cx="32" cy="30" r="1.8" fill="#9aa3ad" stroke="#4d545c" strokeWidth="0.6" />
            <circle cx="52" cy="10" r="1.8" fill="#9aa3ad" stroke="#4d545c" strokeWidth="0.6" />
            <circle cx="58" cy="16" r="1.8" fill="#9aa3ad" stroke="#4d545c" strokeWidth="0.6" />
          </svg>
          <span>Länge</span>
        </button>
        <button className="diff-btn" data-cat="weight">
          {/* Gewicht: Hantel */}
          <svg className="cat-icon" viewBox="0 0 64 64" aria-hidden="true">
            <rect x="14" y="29" width="36" height="6" rx="2" fill="#b9c0cb" stroke="#4d545c" strokeWidth="1.2" />
            <rect x="4" y="25" width="5" height="14" rx="1.5" fill="#6b737d" stroke="#2a2e35" strokeWidth="1" />
            <rect x="8" y="18" width="7" height="28" rx="2" fill="#8a929e" stroke="#2a2e35" strokeWidth="1.2" />
            <rect x="55" y="25" width="5" height="14" rx="1.5" fill="#6b737d" stroke="#2a2e35" strokeWidth="1" />
            <rect x="49" y="18" width="7" height="28" rx="2" fill="#8a929e" stroke="#2a2e35" strokeWidth="1.2" />
            <path d="M10 21 v8 M51 21 v8" stroke="#c9d1d9" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M24 29 v6 M28 29 v6 M32 29 v6 M36 29 v6 M40 29 v6" stroke="#8a929e" strokeWidth="0.8" />
          </svg>
          <span>Gewicht</span>
        </button>
        <button className="diff-btn" data-cat="temp">
          {/* Temperatur: Thermometer */}
          <svg className="cat-icon" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M26 10 a6 6 0 0 1 12 0 V38 a11 11 0 1 1 -12 0 Z" fill="#f2ecdd" stroke="#4d545c" strokeWidth="2" />
            <rect x="29.5" y="20" width="5" height="22" rx="2.5" fill="#e0262b" />
            <circle cx="32" cy="47" r="7.5" fill="#e0262b" />
            <circle cx="29.5" cy="44.5" r="2" fill="#ff8a8a" />
            <path d="M40 14 h5 M40 20 h3 M40 26 h5 M40 32 h3" stroke="#f2ecdd" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>Temperatur</span>
        </button>
      </div>
      <div className="conv-row">
        <input type="number" id="conv-unit-from-value" defaultValue="1" />
        <select id="conv-unit-from-unit"></select>
      </div>
      <button className="conv-swap-btn" id="conv-unit-swap" title="Tauschen" aria-label="Tauschen"><svg className="chevron-up-down" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path className="chev-down" d="m7 15 5 5 5-5" /><path className="chev-up" d="m7 9 5-5 5 5" /></svg></button>
      <div className="conv-row">
        <input type="number" id="conv-unit-to-value" readOnly />
        <select id="conv-unit-to-unit"></select>
      </div>
    </div>

    <div id="conv-currency-panel" style={{ display: "none" }}>
      <div className="conv-row">
        <input type="number" id="conv-cur-from-value" defaultValue="1" />
        <select id="conv-cur-from-unit"></select>
      </div>
      <button className="conv-swap-btn" id="conv-cur-swap" title="Tauschen" aria-label="Tauschen"><svg className="chevron-up-down" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path className="chev-down" d="m7 15 5 5 5-5" /><path className="chev-up" d="m7 9 5-5 5 5" /></svg></button>
      <div className="conv-row">
        <input type="number" id="conv-cur-to-value" readOnly />
        <select id="conv-cur-to-unit"></select>
      </div>
      <div className="todo-empty" id="conv-cur-status"></div>
    </div>
        <div className="gb-hint">▲▼ WÄHLEN  ◀▶ ÄNDERN  A TAUSCHEN</div>
      </div>
    </div>
    <div className="gb-logo">GAME BOY</div>
    <div className="gb-controls">
      <div className="gb-dpad" aria-label="Steuerkreuz">
        <button className="gb-d up" data-gb="up" aria-label="Cursor hoch"></button>
        <button className="gb-d left" data-gb="left" aria-label="Wert links ändern"></button>
        <span className="gb-d center"></span>
        <button className="gb-d right" data-gb="right" aria-label="Wert rechts ändern"></button>
        <button className="gb-d down" data-gb="down" aria-label="Cursor runter"></button>
      </div>
      <div className="gb-ab">
        <div className="gb-round"><button className="gb-btn" data-gb="b" aria-label="Einheiten oder Währung"></button><span>B</span></div>
        <div className="gb-round"><button className="gb-btn" data-gb="a" aria-label="Tauschen"></button><span>A</span></div>
      </div>
    </div>
    <div className="gb-start">
      <div className="gb-pill"><button data-gb="select" aria-label="Nächste Zeile"></button><span>SELECT</span></div>
      <div className="gb-pill"><button data-gb="start" aria-label="Wert auf 1"></button><span>START</span></div>
    </div>
    <div className="gb-speaker"><i></i><i></i><i></i><i></i><i></i><i></i></div>
  </div>
</div>

<div className="view" id="timer-view">
  <div className="panel-label">Timer</div>
  <div className="timer-display" id="timer-display">00:00</div>

  <div className="timer-input-row">
    <input type="number" id="timer-hour-input" placeholder="Stunden" min="0" />
    <input type="number" id="timer-min-input" placeholder="Minuten" min="0" max="59" />
    <input type="number" id="timer-sec-input" placeholder="Sekunden" min="0" max="59" />
    <button id="timer-set-btn">Übernehmen</button>
  </div>

  <div className="timer-controls">
    <button className="timer-ctrl-btn" id="timer-start-btn">▶ Start</button>
    <button className="timer-ctrl-btn" id="timer-pause-btn">⏸ Pause</button>
    <button className="timer-ctrl-btn" id="timer-reset-btn">↺ Reset</button>
  </div>
  <div className="todo-empty" id="timer-status"></div>

  <div className="panel-label" style={{ marginTop: "44px" }}>Stoppuhr (zählt nach oben)</div>
  <div className="timer-display timer-display-ms" id="stopwatch-display">00:00.00</div>
  <div className="timer-controls">
    <button className="timer-ctrl-btn" id="stopwatch-toggle-btn">▶ Start</button>
    <button className="timer-ctrl-btn" id="stopwatch-reset-btn">↺ Reset</button>
  </div>
</div>

<div className="view" id="apps-view">
  <div className="panel-label">Schnellzugriff</div>
  <div className="apps-grid">
    <a className="app-tile app-tile-image" href="https://www.youtube.com" target="_blank" rel="noopener" style={{ '--tile-color': "#FF0000", '--tile-image': "url(/youtube-neon.jpg)" }}>
      <span className="app-name">YouTube</span>
    </a>
    <a className="app-tile app-tile-image" href="whatsapp://" rel="noopener" style={{ '--tile-color': "#25D366", '--tile-image': "url(/whatsapp-glitzer.jpg)", '--tile-pos': "55% 60%" }}>
      <span className="app-name">WhatsApp</span>
    </a>
    <a className="app-tile app-tile-image" href="https://web.snapchat.com" target="_blank" rel="noopener" style={{ '--tile-color': "#b04ae0", '--tile-image': "url(/snapchat-geist.jpg)", '--tile-pos': "50% 80%" }}>
      <span className="app-name">Snapchat</span>
    </a>
    <a className="app-tile app-tile-image" href="https://www.instagram.com" target="_blank" rel="noopener" style={{ '--tile-color': "#e0509a", '--tile-image': "url(/instagram-neon.jpg)" }}>
      <span className="app-name">Instagram</span>
    </a>
    <a className="app-tile app-tile-image" href="https://www.tiktok.com" target="_blank" rel="noopener" style={{ '--tile-color': "#d8dce6", '--tile-image': "url(/tiktok-licht.jpg)", '--tile-pos': "50% 57%" }}>
      <span className="app-name">TikTok</span>
    </a>
    <a className="app-tile app-tile-image" href="discord://" rel="noopener" style={{ '--tile-color': "#3aa0ff", '--tile-image': "url(/discord-blitz.jpg)", '--tile-size': "auto 68%", '--tile-pos': "50% 22%", '--tile-bg': "#04020f" }}>
      <span className="app-name">Discord</span>
    </a>
    <a className="app-tile app-tile-image" href="steam://open/main" rel="noopener" style={{ '--tile-color': "#5a8ae0", '--tile-image': "url(/steam-neon.jpg)", '--tile-pos': "50% 45%" }}>
      <span className="app-name">Steam</span>
    </a>
    <a className="app-tile app-tile-image" href="https://www.riotgames.com/de" target="_blank" rel="noopener" style={{ '--tile-color': "#d9a63a", '--tile-image': "url(/riot-gold.jpg)", '--tile-size': "auto 90%", '--tile-pos': "50% 0%", '--tile-bg': "#090a0f" }}>
      <span className="app-name">Riot</span>
    </a>
    <a className="app-tile app-tile-image" href="spotify:" rel="noopener" style={{ '--tile-color': "#c9cdd4", '--tile-image': "url(/spotify-chrom.jpg)", '--tile-size': "auto 88%", '--tile-pos': "50% 15%", '--tile-bg': "#000000" }}>
      <span className="app-name">Spotify</span>
    </a>
    <a className="app-tile app-tile-image" href="https://www.amazon.com" target="_blank" rel="noopener" style={{ '--tile-color': "#5fc0b0", '--tile-image': "url(/amazon-glas.jpg)" }}>
      <span className="app-name">Amazon</span>
    </a>
    <a className="app-tile app-tile-image" href="https://claude.ai" target="_blank" rel="noopener" style={{ '--tile-color': "#D97757", '--tile-image': "url(/claude-3d.jpg)", '--tile-pos': "50% 35%" }}>
      <span className="app-name">Claude AI</span>
    </a>
    <a className="app-tile app-tile-image" href="https://chatgpt.com" target="_blank" rel="noopener" style={{ '--tile-color': "#8a9cff", '--tile-image': "url(/chatgpt-cyber.jpg)", '--tile-pos': "45% 50%" }}>
      <span className="app-name">ChatGPT</span>
    </a>
    <a className="app-tile app-tile-image" href="https://www.google.com" target="_blank" rel="noopener" style={{ '--tile-color': "#4285F4", '--tile-image': "url(/google-farbe.jpg)", '--tile-pos': "50% 40%" }}>
      <span className="app-name">Google</span>
    </a>
  </div>
</div>

<div className="view" id="games-view">
  <div className="panel-label">Spiel wählen</div>
  <div className="city-select" id="game-jump-row">
    <button className="city-chip" data-target="game-label-sudoku">Sudoku</button>
    <button className="city-chip" data-target="game-label-crossword">Kreuzworträtsel</button>
    <button className="city-chip" data-target="game-label-wotd">Wort des Tages</button>
    <button className="city-chip" data-target="game-label-ttt">Tic Tac Toe</button>
    <button className="city-chip" data-target="game-label-c4">Vier gewinnt</button>
    <button className="city-chip" data-target="game-label-hangman">Galgenmännchen</button>
    <button className="city-chip" data-target="game-label-chess">Schach</button>
    <button className="city-chip" data-target="game-label-mill">Mühle</button>
    <button className="city-chip" data-target="game-label-bs">Schiffe versenken</button>
    <button className="city-chip" data-target="game-label-ms">Minesweeper</button>
    <button className="city-chip" data-target="game-label-snake">Snake</button>
    <button className="city-chip" data-target="game-label-2048">2048</button>
  </div>

  <div className="games-zoom-row" id="games-zoom-row">
    <button className="games-zoom-btn games-zoom-reset-all" id="games-reset-all-btn">Alle Spielgrössen zurücksetzen</button>
  </div>

  <div className="panel-label" id="game-label-sudoku">Sudoku</div>
  <div className="sudoku-controls">
    <div className="diff-select" id="diff-select">
      <button className="diff-btn active" data-diff="easy">Einfach</button>
      <button className="diff-btn" data-diff="medium">Mittel</button>
      <button className="diff-btn" data-diff="hard">Schwer</button>
    </div>
    <button className="action-btn" id="sudoku-new-btn">Neues Spiel</button>
    <button className="action-btn" id="sudoku-check-btn">Prüfen</button>
    <button className="action-btn" id="sudoku-solve-btn">Lösung zeigen</button>
  </div>
  <div className="game-resize-wrap"><div className="sudoku-grid" id="sudoku-grid"></div><div className="game-resize-handle"></div></div>
  <div className="todo-empty" id="sudoku-status" style={{ marginTop: "16px" }}></div>

  <div className="panel-label" id="game-label-crossword" style={{ marginTop: "44px" }}>Kreuzworträtsel</div>
  <div className="crossword-wrap">
    <div className="game-resize-wrap"><div className="crossword-grid" id="crossword-grid"></div><div className="game-resize-handle"></div></div>
    <div className="crossword-clues">
      <div>
        <div className="clue-heading">Waagrecht</div>
        <ul className="clue-list" id="clues-across"></ul>
      </div>
      <div>
        <div className="clue-heading">Senkrecht</div>
        <ul className="clue-list" id="clues-down"></ul>
      </div>
    </div>
  </div>
  <div className="sudoku-controls" style={{ marginTop: "16px" }}>
    <button className="action-btn" id="crossword-new-btn">Neues Spiel</button>
    <button className="action-btn" id="crossword-check-btn">Prüfen</button>
    <button className="action-btn" id="crossword-solve-btn">Lösung zeigen</button>
  </div>
  <div className="todo-empty" id="crossword-status" style={{ marginTop: "10px" }}></div>

  <div className="panel-label" id="game-label-wotd" style={{ marginTop: "44px" }}>Wort des Tages</div>
  <div className="wotd-wrap">
    <div className="panel-label" style={{ marginBottom: "8px" }}>Wortlänge</div>
    <div className="diff-select" id="wotd-length-select" style={{ marginBottom: "16px", flexWrap: "wrap" }}>
      <button className="diff-btn" data-len="2">2</button>
      <button className="diff-btn" data-len="3">3</button>
      <button className="diff-btn" data-len="4">4</button>
      <button className="diff-btn active" data-len="5">5</button>
      <button className="diff-btn" data-len="6">6</button>
      <button className="diff-btn" data-len="7">7</button>
      <button className="diff-btn" data-len="8">8</button>
      <button className="diff-btn" data-len="9">9</button>
      <button className="diff-btn" data-len="10">10</button>
      <button className="diff-btn" data-len="11">11</button>
      <button className="diff-btn" data-len="12">12</button>
      <button className="diff-btn" data-len="13">13</button>
      <button className="diff-btn" data-len="14">14</button>
      <button className="diff-btn" data-len="15">15</button>
    </div>
    <div className="game-resize-wrap" style={{ display: "block", width: "100%" }}><div className="wotd-grid" id="wotd-grid"></div><div className="game-resize-handle"></div></div>
    <div className="wotd-keyboard" id="wotd-keyboard"></div>
    <div className="wotd-input-row">
      <input type="text" id="wotd-input" maxLength="5" placeholder="5 Buchstaben" autoComplete="off" />
      <button className="action-btn" id="wotd-guess-btn">Raten</button>
    </div>
    <div className="todo-empty" id="wotd-status"></div>
    <button className="action-btn" id="wotd-next-btn" style={{ display: "none", marginTop: "14px" }}>Nächstes Wort</button>
  </div>

  <div className="panel-label" id="game-label-ttt" style={{ marginTop: "44px" }}>Tic Tac Toe</div>
  <div className="mode-select" id="ttt-mode-select">
    <button className="mode-btn" data-mode="friend">Gegen Freund</button>
    <button className="mode-btn active" data-mode="bot">Gegen Bot</button>
  </div>
  <div className="game-resize-wrap"><div className="ttt-grid" id="ttt-grid"></div><div className="game-resize-handle"></div></div>
  <div className="sudoku-controls" style={{ marginTop: "14px" }}>
    <button className="action-btn" id="ttt-reset-btn">Neues Spiel</button>
  </div>
  <div className="todo-empty" id="ttt-status" style={{ marginTop: "10px" }}></div>

  <div className="panel-label" id="game-label-c4" style={{ marginTop: "44px" }}>Vier gewinnt</div>
  <div className="mode-select" id="c4-mode-select">
    <button className="mode-btn" data-mode="friend">Gegen Freund</button>
    <button className="mode-btn active" data-mode="bot">Gegen Bot</button>
  </div>
  <div className="game-resize-wrap"><div className="c4-board" id="c4-board"></div><div className="game-resize-handle"></div></div>
  <div className="sudoku-controls" style={{ marginTop: "14px" }}>
    <button className="action-btn" id="c4-reset-btn">Neues Spiel</button>
  </div>
  <div className="todo-empty" id="c4-status" style={{ marginTop: "10px" }}></div>

  <div className="panel-label" id="game-label-hangman" style={{ marginTop: "44px" }}>Galgenmännchen</div>
  <div className="hm-wrap">
    <div className="hm-category" id="hm-category">Kategorie: —</div>
    <div className="game-resize-wrap">
      <svg className="hm-figure" id="hm-figure" viewBox="0 0 160 170" xmlns="http://www.w3.org/2000/svg">
        <line x1="14" y1="160" x2="90" y2="160" stroke="rgba(var(--fg),0.8)" strokeWidth="5" strokeLinecap="round" />
        <line x1="40" y1="160" x2="40" y2="16" stroke="rgba(var(--fg),0.8)" strokeWidth="5" strokeLinecap="round" />
        <line x1="40" y1="16" x2="112" y2="16" stroke="rgba(var(--fg),0.8)" strokeWidth="5" strokeLinecap="round" />
        <line x1="40" y1="36" x2="62" y2="16" stroke="rgba(var(--fg),0.8)" strokeWidth="5" strokeLinecap="round" />
        <line x1="112" y1="16" x2="112" y2="38" stroke="rgba(var(--fg),0.8)" strokeWidth="4" strokeLinecap="round" />
        <circle className="hm-part" cx="112" cy="54" r="15" fill="none" stroke="var(--brick)" strokeWidth="5" />
        <line className="hm-part" x1="112" y1="69" x2="112" y2="112" stroke="var(--brick)" strokeWidth="5" strokeLinecap="round" />
        <line className="hm-part" x1="112" y1="80" x2="92" y2="98" stroke="var(--brick)" strokeWidth="5" strokeLinecap="round" />
        <line className="hm-part" x1="112" y1="80" x2="132" y2="98" stroke="var(--brick)" strokeWidth="5" strokeLinecap="round" />
        <line className="hm-part" x1="112" y1="112" x2="96" y2="142" stroke="var(--brick)" strokeWidth="5" strokeLinecap="round" />
        <line className="hm-part" x1="112" y1="112" x2="128" y2="142" stroke="var(--brick)" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <div className="game-resize-handle"></div>
    </div>
    <div className="hm-word" id="hm-word"></div>
    <div className="wotd-keyboard" id="hm-keyboard"></div>
    <div className="todo-empty" id="hm-status" style={{ marginTop: "10px" }}></div>
    <div className="sudoku-controls" style={{ marginTop: "14px" }}>
      <button className="action-btn" id="hm-new-btn">Neues Spiel</button>
    </div>
  </div>

  <div className="panel-label" id="game-label-chess" style={{ marginTop: "44px" }}>Schach</div>
  <div className="mode-select" id="chess-mode-select">
    <button className="mode-btn" data-mode="friend">Gegen Freund</button>
    <button className="mode-btn active" data-mode="bot">Gegen Bot</button>
  </div>
  <div className="game-resize-wrap"><div className="chess-board" id="chess-board"></div><div className="game-resize-handle"></div></div>
  <div className="sudoku-controls" style={{ marginTop: "14px" }}>
    <button className="action-btn" id="chess-reset-btn">Neues Spiel</button>
  </div>
  <div className="todo-empty" id="chess-status" style={{ marginTop: "10px" }}></div>

  <div className="panel-label" id="game-label-mill" style={{ marginTop: "44px" }}>Mühle</div>
  <div className="mode-select" id="mill-mode-select">
    <button className="mode-btn" data-mode="friend">Gegen Freund</button>
    <button className="mode-btn active" data-mode="bot">Gegen Bot</button>
  </div>
  <div className="game-resize-wrap"><div className="mill-board" id="mill-board"></div><div className="game-resize-handle"></div></div>
  <div className="sudoku-controls" style={{ marginTop: "14px" }}>
    <button className="action-btn" id="mill-reset-btn">Neues Spiel</button>
  </div>
  <div className="mill-pieces-left" id="mill-pieces-left"></div>
  <div className="todo-empty" id="mill-status" style={{ marginTop: "10px" }}></div>

  <div className="panel-label" id="game-label-bs" style={{ marginTop: "44px" }}>Schiffe versenken</div>
  <div className="mode-select" id="bs-mode-select">
    <button className="mode-btn active" data-mode="bot">Gegen Bot</button>
    <button className="mode-btn" data-mode="friend">Gegen Freund</button>
  </div>
  <div className="sudoku-controls" id="bs-place-controls" style={{ marginBottom: "10px" }}>
    <button className="action-btn" id="bs-confirm-btn">Platzieren</button>
    <button className="action-btn" id="bs-clear-btn">Auswahl zurücksetzen</button>
    <button className="action-btn" id="bs-random-btn">Zufällig platzieren</button>
  </div>
  <div className="ship-select" id="bs-ship-select"></div>
  <div className="game-resize-wrap">
  <div className="bs-boards">
    <div>
      <div className="bs-board-label" id="bs-label-a">Deine Flotte</div>
      <div className="bs-board" id="bs-board-a"></div>
      <div className="bs-fleet-status" id="bs-fleet-a"></div>
    </div>
    <div>
      <div className="bs-board-label" id="bs-label-b">Gegnerflotte</div>
      <div className="bs-board" id="bs-board-b"></div>
      <div className="bs-fleet-status" id="bs-fleet-b"></div>
    </div>
  </div>
  <div className="game-resize-handle"></div>
  </div>
  <div className="sudoku-controls" style={{ marginTop: "14px" }}>
    <button className="action-btn" id="bs-reset-btn">Neues Spiel</button>
  </div>
  <div className="todo-empty" id="bs-status" style={{ marginTop: "10px" }}></div>

  <div className="panel-label" id="game-label-ms" style={{ marginTop: "44px" }}>Minesweeper</div>
  <div className="sudoku-controls">
    <div className="diff-select" id="ms-diff-select">
      <button className="diff-btn active" data-diff="easy">Einfach</button>
      <button className="diff-btn" data-diff="medium">Mittel</button>
      <button className="diff-btn" data-diff="hard">Schwer</button>
    </div>
  </div>
  <div className="game-resize-wrap">
  <div className="ms-wrap">
    <div className="ms-hud">
      <div className="ms-counter" id="ms-mine-counter">010</div>
      <button className="ms-face" id="ms-face-btn" title="Neues Spiel">🙂</button>
      <div className="ms-counter" id="ms-timer">000</div>
    </div>
    <div className="ms-grid" id="ms-grid"></div>
  </div>
  <div className="game-resize-handle"></div>
  </div>
  <div className="todo-empty" id="ms-status" style={{ marginTop: "14px" }}></div>

  <div className="panel-label" id="game-label-snake" style={{ marginTop: "44px" }}>Snake</div>
  <div className="game-resize-wrap">
  <div className="snake-wrap">
    <div className="snake-hud">
      <div className="snake-hud-item">
        <div className="snake-hud-label">Punkte</div>
        <div className="ms-counter" id="snake-score">000</div>
      </div>
      <div className="snake-hud-item">
        <div className="snake-hud-label">Bestwert</div>
        <div className="ms-counter" id="snake-best">000</div>
      </div>
    </div>
    <div className="snake-grid" id="snake-grid"></div>
  </div>
  <div className="game-resize-handle"></div>
  </div>
  <div className="sudoku-controls" style={{ marginTop: "14px" }}>
    <button className="action-btn" id="snake-new-btn">Neues Spiel</button>
  </div>
  <div className="todo-empty" id="snake-status" style={{ marginTop: "10px" }}></div>

  <div className="panel-label" id="game-label-2048" style={{ marginTop: "44px" }}>2048</div>
  <div className="g2048-wrap">
    <div className="g2048-hud">
      <div className="g2048-hud-item">
        <div className="snake-hud-label">Punkte</div>
        <div className="ms-counter" id="g2048-score">000</div>
      </div>
      <div className="g2048-hud-item">
        <div className="snake-hud-label">Bestwert</div>
        <div className="ms-counter" id="g2048-best">000</div>
      </div>
    </div>
    <div className="game-resize-wrap">
      <div className="g2048-grid" id="g2048-grid"></div>
      <div className="game-resize-handle"></div>
    </div>
    <div className="sudoku-controls" style={{ marginTop: "14px" }}>
      <button className="action-btn" id="g2048-new-btn">Neues Spiel</button>
    </div>
    <div className="todo-empty" id="g2048-status" style={{ marginTop: "10px" }}></div>
  </div>
</div>

<footer>Zeiten aktualisieren sich live · Wetterdaten via Open-Meteo</footer>
</div>

      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
