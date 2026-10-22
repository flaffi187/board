import { SESSION_COOKIE, createSession, endSession, login, register } from '../../../lib/auth';

// Ein Formular für alles: action = login | register | logout
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
    await endSession(request.cookies.get(SESSION_COOKIE)?.value);
    return go('/login', `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`);
  }

  const name = form.get('name'), password = form.get('password');
  const result = action === 'register' ? await register(name, password) : await login(name, password);
  if (result.error) {
    await new Promise(r => setTimeout(r, 600));   // Raten bremsen
    const q = new URLSearchParams({ fehler: result.error, name: String(name || ''), modus: action === 'register' ? 'neu' : '' });
    return go('/login?' + q);
  }
  const token = await createSession(result.user.id);
  return go('/', `${SESSION_COOKIE}=${token}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`);
}
