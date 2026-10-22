import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, userFromToken } from '../../lib/auth';

const FEHLER = {
  falsch: 'Zugriff verweigert: Benutzername oder Passwort falsch.',
  vergeben: 'Fehler: Diesen Benutzernamen gibt es schon.',
  kurz: 'Fehler: Das Passwort braucht mindestens 6 Zeichen.',
  name: 'Fehler: Benutzername 3–20 Zeichen, nur Buchstaben, Zahlen, . _ -',
};

export const metadata = { title: 'ufl home – Anmelden' };

// Zufälliger "Code" über dem Login – bei jedem Öffnen anders
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const hex = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
const dots = (label, width = 16) => label + ' ' + '.'.repeat(Math.max(3, width - label.length)) + ' ';
function randomCode() {
  const cmd = pick(['init', 'boot', 'mount', 'scan', 'decrypt', 'sync']);
  const lines = [
    () => dots(pick(['Kernel', 'Modul', 'Treiber', 'Puffer', 'Sektor'])) + '0x' + hex(4) + ' 0x' + hex(4),
    () => dots(pick(['Prüfsumme', 'Hash', 'Signatur', 'Schlüssel'])) + hex(16).toLowerCase(),
    () => dots(pick(['Speicher', 'Cache', 'Heap', 'Stack'])) + (Math.floor(Math.random() * 900) + 100) + ' KB OK',
    () => dots(pick(['Port', 'Socket', 'Kanal'])) + (Math.floor(Math.random() * 60000) + 1024) + ' offen',
    () => dots(pick(['Thread', 'Prozess', 'Task'])) + 'PID ' + (Math.floor(Math.random() * 9000) + 1000),
    () => dots(pick(['Register', 'Adresse', 'Offset'])) + '[' + hex(2) + ':' + hex(2) + ':' + hex(2) + ':' + hex(2) + ']',
  ].sort(() => Math.random() - 0.5).slice(0, 3).map(f => f());
  return { cmd: `${cmd} --seed 0x${hex(6)}`, lines };
}

export default async function Login({ searchParams }) {
  if (await userFromToken((await cookies()).get(SESSION_COOKIE)?.value)) redirect('/');
  const { fehler: code, modus } = await searchParams;
  const fehler = FEHLER[code];
  const neu = modus === 'neu';
  const exe = neu ? 'register' : 'login';
  const { cmd, lines } = randomCode();
  return (
    <main className="login-page">
      <form className="term" method="post" action="/api/auth">
        <div className="term-bar">
          <span className="term-icon" aria-hidden="true">&gt;_</span>
          <span className="term-title">C:\ufl\home\{exe}.exe</span>
          <span className="term-ctrls" aria-hidden="true"><i className="min" /><i className="max" /><i className="close" /></span>
        </div>
        <div className="term-body">
          <div className="term-line term-head">ufl home</div>
          <div className="term-gap" />
          <div className="term-line"><span className="term-prompt">C:\ufl\home&gt;</span>{cmd}</div>
          {lines.map((l, i) => <div className="term-line term-code" key={i}>{l}</div>)}
          <div className="term-gap" />
          <div className="term-line"><span className="term-prompt">C:\ufl\home&gt;</span>{exe}</div>
          <label className="term-field">
            <span>Benutzername:</span>
            <input name="name" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} required autoFocus placeholder=" " aria-label="Benutzername" />
            <i className="term-cursor" aria-hidden="true" />
          </label>
          <label className="term-field">
            <span>Passwort:</span>
            {/* Absichtlich kein type="password": so bietet der Browser nie an, das Passwort zu speichern.
                Die Zeichen werden per CSS verdeckt; Autokorrektur & Co. sind aus, damit die Tastatur nichts lernt. */}
            <input type="text" className="pw-mask" name="password" autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} data-lpignore="true" data-1p-ignore="true" data-form-type="other" required minLength={neu ? 6 : undefined} placeholder=" " aria-label="Passwort" />
            <i className="term-cursor" aria-hidden="true" />
          </label>
          {neu && <div className="term-line term-hint">Neues Konto – startet bei 0.</div>}
          {fehler && <div className="term-line term-error">{fehler}</div>}
        </div>
        <div className="term-foot">
          <button type="submit" name="action" value={neu ? 'register' : 'login'}>{neu ? 'Erstellen' : 'Anmelden'}</button>
          <span className="term-switch">
            {neu ? 'Schon ein Konto: ' : 'Neues Konto: '}
            <a href={neu ? '/login' : '/login?modus=neu'}>C:\ufl\home&gt;{neu ? 'login' : 'register'}</a>
          </span>
        </div>
      </form>
      {/* Browser ohne Verdecken per CSS: dann doch ein normales Passwortfeld, damit nie Klartext sichtbar ist */}
      <script dangerouslySetInnerHTML={{ __html: "if(!(window.CSS && (CSS.supports('-webkit-text-security','disc') || CSS.supports('text-security','disc')))) document.querySelectorAll('.pw-mask').forEach(function(i){ i.type = 'password'; });" }} />
    </main>
  );
}
