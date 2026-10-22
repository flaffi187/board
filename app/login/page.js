import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, userFromToken } from '../../lib/auth';

const FEHLER = {
  falsch: 'Benutzername/E-Mail oder Passwort falsch.',
  vergeben: 'Diesen Benutzernamen gibt es schon.',
  kurz: 'Das Passwort braucht mindestens 6 Zeichen.',
  name: 'Benutzername: 3–20 Zeichen, nur Buchstaben, Zahlen, . _ -',
};

export const metadata = { title: 'ufl home – Anmelden' };

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.2" r="4.6" /><path d="M3.6 22c0-5.2 3.8-8.6 8.4-8.6s8.4 3.4 8.4 8.6z" /></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 10V7.4a4.8 4.8 0 0 1 9.6 0V10h-2.4V7.4a2.4 2.4 0 0 0-4.8 0V10z" /><rect x="4.6" y="10" width="14.8" height="12" rx="2.2" /><circle cx="12" cy="15.4" r="1.7" fill="#d9dce8" /><rect x="11.2" y="15.6" width="1.6" height="3.4" rx=".8" fill="#d9dce8" /></svg>
);

export default async function Login({ searchParams }) {
  if (await userFromToken((await cookies()).get(SESSION_COOKIE)?.value)) redirect('/');
  const { fehler: code, modus } = await searchParams;
  const fehler = FEHLER[code];
  const neu = modus === 'neu';
  return (
    <main className="login-page">
      <form className="login-form" method="post" action="/api/auth">
        {neu && <h1 className="login-title">Neues Konto</h1>}
        <label className="login-field">
          <UserIcon />
          <input name="name" placeholder={neu ? 'Benutzername wählen' : 'Benutzername oder E-Mail'} autoComplete={neu ? "username" : "username email"} autoCapitalize="none" autoCorrect="off" required autoFocus />
        </label>
        <label className="login-field">
          <LockIcon />
          <input type="password" name="password" placeholder="Passwort" autoComplete={neu ? 'new-password' : 'current-password'} required minLength={neu ? 6 : undefined} />
        </label>
        <div className="login-row">
          {fehler ? <span className="login-error">{fehler}</span> : <span className="login-hint">{neu ? 'Ein neues Konto startet bei 0.' : ''}</span>}
          <a href={neu ? '/login' : '/login?modus=neu'}>{neu ? 'Schon ein Konto? Anmelden' : 'Neues Konto?'}</a>
        </div>
        <button type="submit" name="action" value={neu ? 'register' : 'login'}>{neu ? 'Erstellen' : 'Login'}</button>
      </form>
    </main>
  );
}
