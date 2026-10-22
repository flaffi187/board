import { SESSION_COOKIE, createSession, endSession, login, register } from '../../../lib/auth';

// Ein Formular für alles: action = login | register | logout.
// Das Login-Cookie lebt nur kurz und wird beim ersten Aufbau der Seite verbraucht (siehe consumeLogin).
export async function POST(request) {
  const form = await request.formData();
  const action = form.get('action');
  const url = new URL(request.url);
  const secure = url.protocol === 'https:' ? '; Secure' : '';
  const go = (path, cookie) => {
    const headers = new Headers({ Location: new URL(path, url).toString() });
    if (cookie) headers.append('Set-Cookie', cookie);
    return new Response(null, { status: 303, headers });
  };

  if (action === 'logout') {
    await endSession(form.get('token'));
    return go('/login', `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`);
  }

  const name = form.get('name'), password = form.get('password');
  const result = action === 'register' ? await register(name, password) : await login(name, password);
  if (result.error) {
    await new Promise(r => setTimeout(r, 600));   // Raten bremsen
    // Nur ein Fehler-Code in die Adresse – Benutzername und Passwort tauchen nie in der URL oder im Verlauf auf
    return go('/login?' + new URLSearchParams({ fehler: result.error, ...(action === 'register' ? { modus: 'neu' } : {}) }));
  }
  const token = await createSession(result.user.id);
  return go('/', `${SESSION_COOKIE}=${token}; Path=/; Max-Age=120; HttpOnly; SameSite=Lax${secure}`);
}
