import Script from 'next/script';

export default function Page() {
  return (
    <>

<div className="page">
<header>
  <div className="title-block">
    <span className="kicker">Persönliches Board</span>
    <h1 id="greeting-title">Meins</h1>
  </div>
  <div className="header-controls">
    <button id="theme-toggle-btn" className="theme-toggle-btn" title="Hell/Dunkel umschalten" aria-label="Hell/Dunkel umschalten">🌙</button>
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
    <div className="drip-layer" id="drip-layer"></div>
    <div className="bee-layer" id="bee-layer"></div>
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
  <div className="cal-weekdays">
    <span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span>
  </div>
  <div className="cal-grid" id="cal-grid"></div>

  <div className="cal-day-panel">
    <div className="panel-label" id="cal-selected-label">Eintrag hinzufügen</div>
    <div className="todo-input-row">
      <input type="text" id="cal-entry-input" placeholder="Was ist an diesem Tag? …" />
      <button id="cal-entry-add-btn">Hinzufügen</button>
    </div>
    <ul className="todo-list" id="cal-entry-list"></ul>
  </div>
</div>

<div className="view" id="calc-view">
  <div className="panel-label">Rechner</div>
  <div className="calc-box">
    <div className="calc-brand">Dash-100 · Solar</div>
    <div className="calc-display">
      <div className="calc-expr" id="calc-expr"></div>
      <div className="calc-current" id="calc-display">0</div>
    </div>
    <div className="calc-grid">
      <button className="calc-btn calc-clear" data-key="C">C</button>
      <button className="calc-btn calc-op" data-key="back">⌫</button>
      <button className="calc-btn calc-op" data-key="%">%</button>
      <button className="calc-btn calc-op" data-key="/">÷</button>

      <button className="calc-btn" data-key="7">7</button>
      <button className="calc-btn" data-key="8">8</button>
      <button className="calc-btn" data-key="9">9</button>
      <button className="calc-btn calc-op" data-key="*">×</button>

      <button className="calc-btn" data-key="4">4</button>
      <button className="calc-btn" data-key="5">5</button>
      <button className="calc-btn" data-key="6">6</button>
      <button className="calc-btn calc-op" data-key="-">−</button>

      <button className="calc-btn" data-key="1">1</button>
      <button className="calc-btn" data-key="2">2</button>
      <button className="calc-btn" data-key="3">3</button>
      <button className="calc-btn calc-op" data-key="+">+</button>

      <button className="calc-btn calc-zero" data-key="0">0</button>
      <button className="calc-btn" data-key=".">,</button>
      <button className="calc-btn calc-equals" data-key="=">=</button>
    </div>
  </div>

  <div className="panel-label" style={{ marginTop: "44px" }}>Umrechner</div>
  <div className="conv-wrap">
    <div className="mode-select" id="conv-mode-select">
      <button className="mode-btn active" data-mode="unit">Einheiten</button>
      <button className="mode-btn" data-mode="currency">Währung</button>
    </div>

    <div id="conv-unit-panel">
      <div className="diff-select" id="conv-cat-select" style={{ marginBottom: "16px" }}>
        <button className="diff-btn active" data-cat="length">Länge</button>
        <button className="diff-btn" data-cat="weight">Gewicht</button>
        <button className="diff-btn" data-cat="temp">Temperatur</button>
      </div>
      <div className="conv-row">
        <input type="number" id="conv-unit-from-value" defaultValue="1" />
        <select id="conv-unit-from-unit"></select>
      </div>
      <button className="conv-swap-btn" id="conv-unit-swap" title="Tauschen">⇅</button>
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
      <button className="conv-swap-btn" id="conv-cur-swap" title="Tauschen">⇅</button>
      <div className="conv-row">
        <input type="number" id="conv-cur-to-value" readOnly />
        <select id="conv-cur-to-unit"></select>
      </div>
      <div className="todo-empty" id="conv-cur-status"></div>
    </div>
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
    <a className="app-tile" href="https://www.youtube.com" target="_blank" rel="noopener" style={{ '--tile-color': "#FF0000" }}>
      <span className="app-icon">▶️</span>
      <span className="app-name">YouTube</span>
    </a>
    <a className="app-tile" href="whatsapp://" rel="noopener" style={{ '--tile-color': "#25D366" }}>
      <span className="app-icon">💬</span>
      <span className="app-name">WhatsApp</span>
    </a>
    <a className="app-tile" href="https://web.snapchat.com" target="_blank" rel="noopener" style={{ '--tile-color': "#FFFC00" }}>
      <span className="app-icon">👻</span>
      <span className="app-name">Snapchat</span>
    </a>
    <a className="app-tile" href="https://www.instagram.com" target="_blank" rel="noopener" style={{ '--tile-color': "#C13584" }}>
      <span className="app-icon">📷</span>
      <span className="app-name">Instagram</span>
    </a>
    <a className="app-tile" href="https://www.tiktok.com" target="_blank" rel="noopener" style={{ '--tile-color': "#25F4EE" }}>
      <span className="app-icon">🎵</span>
      <span className="app-name">TikTok</span>
    </a>
    <a className="app-tile" href="discord://" rel="noopener" style={{ '--tile-color': "#5865F2" }}>
      <span className="app-icon">🎮</span>
      <span className="app-name">Discord</span>
    </a>
    <a className="app-tile" href="steam://open/main" rel="noopener" style={{ '--tile-color': "#66C0F4" }}>
      <span className="app-icon">🕹️</span>
      <span className="app-name">Steam</span>
    </a>
    <a className="app-tile" href="spotify:" rel="noopener" style={{ '--tile-color': "#1DB954" }}>
      <span className="app-icon">🎧</span>
      <span className="app-name">Spotify</span>
    </a>
    <a className="app-tile" href="https://www.amazon.com" target="_blank" rel="noopener" style={{ '--tile-color': "#FF9900" }}>
      <span className="app-icon">📦</span>
      <span className="app-name">Amazon</span>
    </a>
    <a className="app-tile" href="https://claude.ai" target="_blank" rel="noopener" style={{ '--tile-color': "#D97757" }}>
      <span className="app-icon">✨</span>
      <span className="app-name">Claude AI</span>
    </a>
    <a className="app-tile" href="https://chatgpt.com" target="_blank" rel="noopener" style={{ '--tile-color': "#10A37F" }}>
      <span className="app-icon">🤖</span>
      <span className="app-name">ChatGPT</span>
    </a>
    <a className="app-tile" href="https://www.google.com" target="_blank" rel="noopener" style={{ '--tile-color': "#4285F4" }}>
      <span className="app-icon">🔍</span>
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
