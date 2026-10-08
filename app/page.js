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
  <div className="overview-fit" id="overview-fit">
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
  {/* Sudoku im Fortnite-Stil */}
  <div className="fn-sudoku">
  <div className="fn-banner"><span>Sudoku</span><small>Battle Royale</small></div>
  <div className="fn-bus" id="fn-bus" aria-hidden="true">
    {/* Battle Bus: blauer Bus unter einem gestreiften Heissluftballon */}
    <svg viewBox="0 0 160 120">
      <defs>
        <linearGradient id="busBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5fb4ff" /><stop offset="60%" stopColor="#2a78d6" /><stop offset="100%" stopColor="#1a4f9c" />
        </linearGradient>
        <linearGradient id="busBalloon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a4f9c" /><stop offset="50%" stopColor="#3f9bff" /><stop offset="100%" stopColor="#1a4f9c" />
        </linearGradient>
      </defs>
      <path d="M80 4 C56 4 46 22 50 38 C53 50 66 58 72 62 L88 62 C94 58 107 50 110 38 C114 22 104 4 80 4 Z" fill="url(#busBalloon)" stroke="#0e2f66" strokeWidth="1.5" />
      <path d="M66 7 C60 20 61 44 72 62 M80 4 L80 62 M94 7 C100 20 99 44 88 62" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.85" />
      <path d="M64 12 C60 18 59 26 60 32" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <rect x="72" y="61" width="16" height="6" rx="1.5" fill="#8a5a2b" stroke="#4a2f16" strokeWidth="1" />
      <path d="M73 67 L40 82 M87 67 L122 82 M76 67 L64 82 M84 67 L98 82" stroke="#3a3a3a" strokeWidth="1.1" />
      <path d="M120 70 L120 82 M120 70 L132 73 L120 76" fill="#e0262b" stroke="#3a3a3a" strokeWidth="1" />
      <rect x="22" y="81" width="118" height="28" rx="7" fill="url(#busBody)" stroke="#0e2f66" strokeWidth="1.8" />
      <rect x="22" y="78" width="118" height="6" rx="3" fill="#7cc4ff" stroke="#0e2f66" strokeWidth="1.2" />
      <rect x="30" y="86" width="16" height="11" rx="2" fill="#d6efff" stroke="#0e2f66" strokeWidth="1" />
      <rect x="50" y="86" width="16" height="11" rx="2" fill="#d6efff" stroke="#0e2f66" strokeWidth="1" />
      <rect x="70" y="86" width="16" height="11" rx="2" fill="#d6efff" stroke="#0e2f66" strokeWidth="1" />
      <rect x="90" y="86" width="16" height="11" rx="2" fill="#d6efff" stroke="#0e2f66" strokeWidth="1" />
      <path d="M112 86 H128 Q134 86 135 92 V97 H112 Z" fill="#d6efff" stroke="#0e2f66" strokeWidth="1" />
      <path d="M32 88 L38 88 M52 88 L58 88 M72 88 L78 88 M92 88 L98 88" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="22" y="100" width="118" height="4" fill="#ffd21a" />
      <circle cx="137" cy="103" r="2.6" fill="#fff6b0" stroke="#b58a0f" strokeWidth="0.8" />
      <rect x="20" y="99" width="4" height="6" rx="1" fill="#e0262b" />
      <circle cx="44" cy="110" r="7" fill="#1b1b1b" /><circle cx="44" cy="110" r="3" fill="#b9c0cb" />
      <circle cx="118" cy="110" r="7" fill="#1b1b1b" /><circle cx="118" cy="110" r="3" fill="#b9c0cb" />
    </svg>
  </div>
  <div className="fn-jumper" id="fn-jumper" aria-hidden="true">
    {/* Spieler, der aus dem Bus springt: erst Freifall, dann Gleiter */}
    <svg viewBox="0 0 60 70">
      <g className="fn-glider">
        <path d="M4 22 Q30 -2 56 22 Q50 18 43 20 Q37 14 30 18 Q23 14 17 20 Q10 18 4 22 Z" fill="#ff5ab0" stroke="#8a1f5a" strokeWidth="1.2" />
        <path d="M17 20 Q23 12 30 18 Q37 12 43 20" fill="#ffe94a" opacity="0.85" />
        <path d="M6 21 L26 44 M54 21 L34 44 M30 18 L30 42" stroke="#3a3a3a" strokeWidth="0.8" />
      </g>
      <circle cx="30" cy="40" r="5" fill="#f2c9a0" stroke="#7a4a24" strokeWidth="0.8" />
      <path d="M25 37 Q30 31 35 37 Z" fill="#7a4a24" />
      <rect x="26" y="44" width="8" height="12" rx="3" fill="#3fa64a" stroke="#1d5a24" strokeWidth="0.8" />
      <path d="M26 46 L19 41 M34 46 L41 41" stroke="#3fa64a" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 56 L25 65 M32 56 L35 65" stroke="#2a3a6a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
  <div className="sudoku-controls">
    <div className="diff-select" id="diff-select">
      <button className="diff-btn active fn-wood" data-diff="easy"><span>Holz</span></button>
      <button className="diff-btn fn-stone" data-diff="medium"><span>Stein</span></button>
      <button className="diff-btn fn-metal" data-diff="hard"><span>Metall</span></button>
    </div>
    <button className="action-btn" id="sudoku-new-btn"><span>Neue Runde</span></button>
    <span className="fn-break" aria-hidden="true"></span>
    <button className="action-btn" id="sudoku-check-btn"><span>Inventar checken</span></button>
    <button className="action-btn fn-secondary" id="sudoku-solve-btn"><span>Spectator-Modus</span></button>
  </div>
  <div className="fn-hud">
    <div className="fn-hud-item fn-hud-storm"><i>🌀</i><b id="fn-storm">30:00</b><small>Sturm</small></div>
    <div className="fn-hud-item"><i>👥</i><b id="fn-left">0</b><small>Übrig</small></div>
    <div className="fn-hud-item"><i>🎯</i><b id="fn-elims">0</b><small>Elims</small></div>
  </div>
  <div className="game-resize-wrap"><div className="sudoku-grid" id="sudoku-grid"></div><div className="game-resize-handle"></div></div>
  <div className="todo-empty" id="sudoku-status" style={{ marginTop: "16px" }}></div>
  </div>

  <div className="panel-label" id="game-label-crossword" style={{ marginTop: "44px" }}>Kreuzworträtsel</div>
  {/* Kreuzworträtsel im Mario-Kart-Stil */}
  <div className="mk-crossword">
  <div className="mk-banner">
    <span className="mk-title">Kreuzwort Grand Prix</span>
    <span className="mk-track" id="mk-track-name"></span>
  </div>
  <div className="mk-kart-template" aria-hidden="true">
    <div className="mk-kart" id="mk-kart">
      <svg viewBox="0 0 64 40">
        <ellipse cx="32" cy="37" rx="24" ry="3" fill="rgba(0,0,0,0.35)" />
        <rect x="8" y="22" width="44" height="10" rx="4" fill="#e0262b" stroke="#7a0a0e" strokeWidth="1.5" />
        <path d="M44 22 L58 26 L58 30 L50 32 Z" fill="#e0262b" stroke="#7a0a0e" strokeWidth="1.5" />
        <rect x="4" y="16" width="6" height="12" rx="1.5" fill="#3a3a44" />
        <circle cx="30" cy="12" r="7" fill="#f2c9a0" stroke="#7a4a24" strokeWidth="1" />
        <path d="M22 11 Q30 0 38 11 L40 12 Q30 9 22 11 Z" fill="#e0262b" stroke="#7a0a0e" strokeWidth="1" />
        <path d="M27 15 Q30 17 34 15" stroke="#3a2410" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <rect x="24" y="18" width="12" height="6" rx="2" fill="#2f5fae" />
        <circle cx="16" cy="33" r="6" fill="#1b1b1b" /><circle cx="16" cy="33" r="2.5" fill="#f6c21a" />
        <circle cx="48" cy="33" r="6" fill="#1b1b1b" /><circle cx="48" cy="33" r="2.5" fill="#f6c21a" />
        <path d="M2 24 h-4 M2 28 h-6 M2 32 h-4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </svg>
    </div>
  </div>
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
    <button className="action-btn" id="crossword-new-btn">Neues Rennen</button>
    <button className="action-btn" id="crossword-check-btn">Münzen zählen</button>
    <button className="action-btn" id="crossword-solve-btn">Lösung zeigen</button>
  </div>
  <div className="todo-empty" id="crossword-status" style={{ marginTop: "10px" }}></div>
  </div>

  <div className="panel-label" id="game-label-wotd" style={{ marginTop: "44px" }}>Wort des Tages</div>
  {/* Wort des Tages im Clash-Royale-Stil, Wortlänge als Elixier */}
  <div className="wotd-wrap cr-wotd">
    <div className="cr-banner">
      <span className="cr-crown" aria-hidden="true"></span>
      <span className="cr-title">Wort des Tages</span>
      <span className="cr-crown" aria-hidden="true"></span>
    </div>
    {/* Elixierleiste wie im Spiel: Wortlänge 2 bis 9 */}
    <div className="cr-elixir-bar">
      <div className="cr-elixir-label">Elixier</div>
      <div className="diff-select" id="wotd-length-select">
      <button className="diff-btn" data-len="2">2</button>
      <button className="diff-btn" data-len="3">3</button>
      <button className="diff-btn" data-len="4">4</button>
      <button className="diff-btn active" data-len="5">5</button>
      <button className="diff-btn" data-len="6">6</button>
      <button className="diff-btn" data-len="7">7</button>
      <button className="diff-btn" data-len="8">8</button>
      <button className="diff-btn" data-len="9">9</button>
      </div>
    </div>
    {/* Arena: blaue Türme oben, Spielfeld in der Mitte, rote Türme unten */}
    <div className="cr-arena">
    <div className="cr-towers cr-top" id="cr-towers-top" aria-hidden="true"></div>
    <div className="game-resize-wrap" style={{ display: "block", width: "100%" }}><div className="wotd-grid" id="wotd-grid"></div><div className="game-resize-handle"></div></div>
    <div className="cr-towers cr-bottom" id="cr-towers-bottom" aria-hidden="true"></div>
    </div>
    <div className="todo-empty cr-status" id="wotd-status"></div>
    <button className="action-btn" id="wotd-next-btn" style={{ display: "none", margin: "0 auto 14px" }}>Nächstes Wort</button>
    {/* Steuerung im Spiel-Panel */}
    <div className="cr-panel">
      <div className="wotd-keyboard" id="wotd-keyboard"></div>
      <div className="wotd-input-row">
        <input type="text" id="wotd-input" maxLength="5" placeholder="5 Buchstaben" autoComplete="off" />
        <button className="action-btn" id="wotd-guess-btn">Kämpfen</button>
      </div>
    </div>
  </div>

  <div className="panel-label" id="game-label-ttt" style={{ marginTop: "44px" }}>Tic Tac Toe</div>
  {/* Tic Tac Toe im Candy-Crush-Stil: Rot = Jelly Bean, Blau = Bonbon */}
  <div className="cc-ttt">
  <div className="cc-banner"><span>Candy</span> Tic Tac Toe</div>
  <div className="mode-select" id="ttt-mode-select">
    <button className="mode-btn" data-mode="friend">Gegen Freund</button>
    <button className="mode-btn active" data-mode="bot">Gegen Bot</button>
  </div>
  <div className="cc-board">
    <div className="game-resize-wrap"><div className="ttt-grid" id="ttt-grid"></div><div className="game-resize-handle"></div></div>
    <div className="cc-cheer" id="cc-cheer" aria-hidden="true"></div>
  </div>
  <div className="sudoku-controls" style={{ marginTop: "14px" }}>
    <button className="action-btn" id="ttt-reset-btn">Neues Spiel</button>
  </div>
  <div className="todo-empty" id="ttt-status" style={{ marginTop: "10px" }}></div>
  </div>

  <div className="panel-label" id="game-label-c4" style={{ marginTop: "44px" }}>Vier gewinnt</div>
  {/* Vier gewinnt im Tetris-Stil */}
  <div className="tt-c4" id="tt-c4">
  <div className="tt-bg" aria-hidden="true"><i className="t1"></i><i className="t2"></i><i className="t3"></i><i className="t4"></i></div>
  <div className="tt-title" aria-label="Vier gewinnt">
    <span>V</span><span>I</span><span>E</span><span>R</span> <span>G</span><span>E</span><span>W</span><span>I</span><span>N</span><span>N</span><span>T</span>
  </div>
  <div className="mode-select" id="c4-mode-select">
    <button className="mode-btn" data-mode="friend">Gegen Freund</button>
    <button className="mode-btn active" data-mode="bot">Gegen Bot</button>
  </div>
  <div className="tt-play">
    <div className="game-resize-wrap"><div className="c4-board" id="c4-board"></div><div className="game-resize-handle"></div></div>
    <div className="tt-side">
      <div className="tt-box"><div className="tt-label">Level</div><div className="tt-num tt-big" id="tt-level">1</div><div className="tt-bot" id="tt-bot">Leicht</div></div>
      <div className="tt-box"><div className="tt-label">Next</div><div className="tt-next" id="tt-next"></div></div>
      <div className="tt-box"><div className="tt-label">Score</div><div className="tt-num" id="tt-score">0</div></div>
      <div className="tt-box"><div className="tt-label">Hi-Score</div><div className="tt-num" id="tt-hiscore">0</div></div>
    </div>
    <div className="tt-flash" id="tt-flash" aria-hidden="true"></div>
  </div>
  <div className="sudoku-controls" style={{ marginTop: "14px" }}>
    <button className="action-btn" id="c4-reset-btn">BLÖCKE FALLEN LASSEN</button>
  </div>
  <div className="todo-empty" id="c4-status" style={{ marginTop: "10px" }}></div>
  </div>

  <div className="panel-label" id="game-label-hangman" style={{ marginTop: "44px" }}>Galgenmännchen</div>
  {/* Galgenmännchen im Mario-Party-Stil: jeder Fehler = ein Feld weiter auf dem Spielbrett Richtung Bowser-Feld */}
  <div className="hm-wrap mp-hm">
    <div className="mp-top">
      <div className="mp-banner"><span>Minispiel!</span></div>
      <div className="mp-stats">
        <div className="mp-stat coin"><i></i><b id="mp-coins">10</b></div>
        <div className="mp-stat star"><i></i><b id="mp-stars">0</b></div>
      </div>
    </div>
    <div className="hm-category" id="hm-category">Kategorie: —</div>
    <div className="mp-scene">
      <div className="mp-clouds" aria-hidden="true"><i></i><i></i><i></i></div>
      <div className="mp-bill" aria-hidden="true"></div>
      <div className="mp-board" id="hm-figure" aria-label="Spielbrett"></div>
      <div className="mp-dice" id="mp-dice" aria-hidden="true"><span>?</span></div>
    </div>
    <div className="hm-word" id="hm-word"></div>
    <div className="wotd-keyboard" id="hm-keyboard"></div>
    <div className="todo-empty mp-status" id="hm-status"></div>
    <div className="sudoku-controls" style={{ marginTop: "14px" }}>
      <button className="action-btn" id="hm-new-btn">Würfeln!</button>
    </div>
  </div>

  <div className="panel-label" id="game-label-chess" style={{ marginTop: "44px" }}>Schach</div>
  <div className="ea-chess">
    <div className="ea-top">
      <div className="ea-logo"><span className="ea-logo-ea">EA</span><span className="ea-logo-sports">SPORTS</span></div>
      <div className="mode-select" id="chess-mode-select">
        <button className="mode-btn" data-mode="friend">Gegen Freund</button>
        <button className="mode-btn active" data-mode="bot">Gegen Bot</button>
      </div>
    </div>
    <div className="ea-pick">
      <label className="ea-pick-side"><span>Heim</span><select id="ea-home-sel" aria-label="Heimteam"></select></label>
      <b className="ea-vs">VS</b>
      <label className="ea-pick-side"><span>Auswärts</span><select id="ea-away-sel" aria-label="Auswärtsteam"></select></label>
    </div>
    <div className="ea-scorebug">
      <span className="ea-team home" id="ea-home"><i className="ea-kit"></i><em id="ea-home-code">BAR</em></span>
      <span className="ea-score" id="ea-score">0 - 0</span>
      <span className="ea-team away" id="ea-away"><em id="ea-away-code">RMA</em><i className="ea-kit"></i></span>
      <span className="ea-clock" id="ea-clock">00:00</span>
    </div>
    <div className="game-resize-wrap"><div className="ea-pitch"><div className="chess-board" id="chess-board"></div><div className="ea-ref-layer"><div className="ea-ref" id="ea-ref"></div></div><div className="ea-overlay" id="ea-overlay"></div></div><div className="game-resize-handle"></div></div>
    <div className="ea-ticker"><span className="ea-ticker-tag">LIVE</span><span className="todo-empty" id="chess-status"></span></div>
    <div className="sudoku-controls" style={{ marginTop: "14px" }}>
      <button className="action-btn" id="chess-reset-btn">Anstoss!</button>
    </div>
  </div>

  <div className="panel-label" id="game-label-mill" style={{ marginTop: "44px" }}>Mühle</div>
  <div className="vl-mill">
    <div className="vl-top">
      <div className="vl-logo"><svg viewBox="0 0 40 32" aria-hidden="true"><path d="M2 3l18 22h-9L2 14z" fill="currentColor"/><path d="M38 3L24 20h-9L38 3z" fill="currentColor"/></svg><span>VALORANT</span></div>
      <div className="mode-select" id="mill-mode-select">
        <button className="mode-btn" data-mode="friend">Gegen Freund</button>
        <button className="mode-btn active" data-mode="bot">Gegen Bot</button>
      </div>
    </div>
    <div className="vl-hud">
      <div className="vl-side def"><b id="vl-def-count">0</b><div className="vl-side-info"><span>Verteidiger</span><div className="vl-pips" id="vl-def-pips"></div></div></div>
      <div className="vl-mid"><span id="vl-phase">Kaufphase</span><em id="vl-round">Haven · Runde 1</em></div>
      <div className="vl-side atk"><div className="vl-side-info"><span>Angreifer</span><div className="vl-pips" id="vl-atk-pips"></div></div><b id="vl-atk-count">0</b></div>
    </div>
    <div className="game-resize-wrap"><div className="vl-map"><div className="mill-board" id="mill-board"></div><div className="vl-petals"></div><div className="vl-fx" id="vl-fx"></div><div className="vl-feed" id="vl-feed"></div><div className="vl-overlay" id="vl-overlay"></div></div><div className="game-resize-handle"></div></div>
    <div className="mill-pieces-left" id="mill-pieces-left"></div>
    <div className="vl-status"><i></i><span className="todo-empty" id="mill-status"></span></div>
    <div className="sudoku-controls" style={{ marginTop: "14px" }}>
      <button className="action-btn" id="mill-reset-btn">Neues Match</button>
    </div>
  </div>

  <div className="panel-label" id="game-label-bs" style={{ marginTop: "44px" }}>Schiffe versenken</div>
  <div className="bsg">
    <div className="bsg-logo"><span>Schiffe</span><b>Versenken</b></div>
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
      <div className="bsg-console own">
        <div className="bs-board-label" id="bs-label-a">Deine Flotte</div>
        <div className="bs-board" id="bs-board-a"></div>
        <div className="bs-fleet-status" id="bs-fleet-a"></div>
      </div>
      <div className="bsg-console target">
        <div className="bs-board-label" id="bs-label-b">Gegnerflotte</div>
        <div className="bs-board" id="bs-board-b"></div>
        <div className="bs-fleet-status" id="bs-fleet-b"></div>
      </div>
    </div>
    <div className="bsg-banner" id="bsg-banner"></div>
    <div className="game-resize-handle"></div>
    </div>
    <div className="bsg-status"><i></i><span className="todo-empty" id="bs-status"></span></div>
    <div className="sudoku-controls" style={{ marginTop: "14px" }}>
      <button className="action-btn" id="bs-reset-btn">Neues Spiel</button>
    </div>
  </div>

  <div className="panel-label" id="game-label-ms" style={{ marginTop: "44px" }}>Minesweeper</div>
  <div className="csgo-ms">
  <div className="sudoku-controls">
    <div className="diff-select" id="ms-diff-select">
      <button className="diff-btn active" data-diff="easy">Casual</button>
      <button className="diff-btn" data-diff="medium">Wettkampf</button>
      <button className="diff-btn" data-diff="hard">Premier</button>
    </div>
  </div>
  <div className="cs-row">
  <div className="game-resize-wrap">
  <div className="ms-wrap">
    <div className="ms-hud">
      <div className="cs-team ct"><span className="cs-team-tag">CT</span><div className="ms-counter" id="ms-mine-counter">010</div><span className="cs-team-lbl">Bomben</span></div>
      <div className="cs-mid">
        <div className="cs-score"><b className="ct" id="cs-score-ct">0</b><span className="cs-clockrow"><i className="cs-planted" id="cs-planted"></i><span className="ms-counter cs-clock" id="ms-timer">0:00</span></span><b className="t" id="cs-score-t">0</b></div>
        <button className="ms-face" id="ms-face-btn" title="Neue Runde">Neue Runde</button>
      </div>
      <div className="cs-team t"><span className="cs-team-lbl">Map</span><div className="cs-map">de_dust2</div><span className="cs-team-tag">T</span></div>
    </div>
    <div className="cs-site"><div className="ms-grid" id="ms-grid"></div></div>
    <div className="cs-bottom">
      <canvas className="cs-radar" id="cs-radar" width="120" height="120"></canvas>
      <div className="cs-vitals">
        <span className="cs-hp"><i></i><b id="cs-hp">100</b></span>
        <span className="cs-armor"><i></i><b id="cs-armor">100</b></span>
      </div>
      <div className="cs-money"><b id="cs-money">$800</b><span className="cs-moneypop" id="cs-moneypop"></span></div>
    </div>
    <div className="cs-feed" id="cs-feed"></div>
    <div className="cs-defuse" id="cs-defuse"><span>Entschärfe mit Kit</span><i></i></div>
    <div className="cs-fx" id="cs-fx"></div>
    <div className="cs-banner" id="cs-banner"></div>
  </div>
  <div className="game-resize-handle"></div>
  </div>
  <div className="cs-cases" id="cs-cases">
    <div className="cs-tabs">
      <button className="cs-tab active" data-tab="shop">Shop</button>
      <button className="cs-tab" data-tab="inv">Inventar <i className="cs-badge" id="cs-inv-badge"></i></button>
    </div>
    <div className="cs-shopwrap" id="cs-shopwrap">
      <div className="cs-shop-top"><input className="cs-search" id="cs-search" type="search" placeholder="Kiste suchen …" /><span id="cs-shop-count"></span></div>
      <div className="cs-shop" id="cs-shop"></div>
    </div>
    <div className="cs-invpane" id="cs-invpane">
      <div className="cs-inv-head"><b>Inventar</b><span id="cs-inv-count">0 Gegenstände</span></div>
      <div className="cs-inv" id="cs-inv"></div>
    </div>
    <div className="cs-case-msg" id="cs-case-msg"></div>
    <div className="cs-stage" id="cs-stage">
      <div className="cs-stage-title"></div>
      <div className="cs-reel-wrap"><div className="cs-reel" id="cs-reel"></div><i className="cs-reel-line"></i></div>
    </div>
    <div className="cs-drop" id="cs-drop"></div>
  </div>
  </div>
  <button className="ms-kit-btn" id="ms-kit-btn" type="button">Modus: Prüfen</button>
  <div className="cs-status"><b>[ALLE]</b><span className="todo-empty" id="ms-status"></span></div>
  </div>

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
  <div className="snake-pad" id="snake-pad">
    <button type="button" data-dir="0,-1" aria-label="Hoch">▲</button>
    <button type="button" data-dir="-1,0" aria-label="Links">◀</button>
    <button type="button" data-dir="1,0" aria-label="Rechts">▶</button>
    <button type="button" data-dir="0,1" aria-label="Runter">▼</button>
  </div>
  <div className="todo-empty" id="snake-status" style={{ marginTop: "10px" }}></div>

  <div className="panel-label" id="game-label-2048" style={{ marginTop: "44px" }}>2048</div>
  <div className="g2048-wrap">
    <div className="mc-logo"><span className="mc-logo-txt">MINE2048</span><span className="mc-splash" id="mc-splash">Jetzt mit Diamanten!</span></div>
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
    <div className="mc-inv-title">Werkbank</div>
    <div className="game-resize-wrap">
      <div className="g2048-grid" id="g2048-grid"></div>
      <div className="mc-fx" id="mc-fx"></div>
      <div className="game-resize-handle"></div>
    </div>
    <div className="mc-result"><span>Bester Block</span><i className="mc-arrow"></i><div className="mc-out" id="mc-out" title=""><i></i></div></div>
    <div className="mc-xp"><span className="mc-xp-lvl" id="mc-xp-lvl">0</span><div className="mc-xp-bar"><i id="mc-xp-fill"></i></div></div>
    <div className="mc-toast" id="mc-toast"></div>
    <div className="sudoku-controls" style={{ marginTop: "14px" }}>
      <button className="action-btn" id="g2048-new-btn">Neues Spiel</button>
    </div>
    <div className="todo-empty" id="g2048-status" style={{ marginTop: "10px" }}></div>
    <div className="mc-book"><div className="mc-book-title">Erz-Liste</div><div className="mc-book-list" id="mc-book"></div></div>
  </div>
</div>

<button className="to-top-btn" id="to-top-btn" type="button" aria-label="Ganz nach oben"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l-7 7M12 5l7 7M12 5v14" /></svg><span>Nach oben</span></button>
<footer>Zeiten aktualisieren sich live · Wetterdaten via Open-Meteo</footer>
</div>

      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
