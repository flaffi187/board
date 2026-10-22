import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, userFromToken } from '../../lib/auth';

export const metadata = { title: 'ufl home – Anmelden' };

export default async function Login({ searchParams }) {
  if (await userFromToken((await cookies()).get(SESSION_COOKIE)?.value)) redirect('/');
  const { fehler, name, modus } = await searchParams;
  const neu = modus === 'neu';
  return (
    <main className="login-page">
      <form className="login-card" method="post" action="/api/auth">
        <h1>ufl home</h1>
        <div className="login-tabs">
          <a href="/login" className={neu ? '' : 'active'}>Anmelden</a>
          <a href="/login?modus=neu" className={neu ? 'active' : ''}>Neues Konto</a>
        </div>
        <p>{neu ? 'Ein neues Konto startet leer – To-Dos, Highscores, CS-Geld usw. gehören nur zu diesem Konto.' : 'Melde dich an – auf jedem Gerät siehst du dann deine Sachen.'}</p>
        <input name="name" placeholder="Benutzername" defaultValue={name || ''} autoComplete="username" autoCapitalize="none" autoCorrect="off" required autoFocus={!name} />
        <input type="password" name="password" placeholder="Passwort" autoComplete={neu ? 'new-password' : 'current-password'} required autoFocus={!!name} minLength={neu ? 6 : undefined} />
        {fehler && <div className="login-error">{fehler}</div>}
        <button type="submit" name="action" value={neu ? 'register' : 'login'}>{neu ? 'Konto erstellen' : 'Anmelden'}</button>
      </form>
    </main>
  );
}
