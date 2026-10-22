import { setEmail, userFromRequest } from '../../../lib/auth';

// Konto-Einstellungen vom offenen Board aus (Anmeldung über das Seiten-Token im Header)
export async function POST(request) {
  const user = await userFromRequest(request);
  if (!user) return new Response('Nicht angemeldet', { status: 401 });
  let body;
  try { body = await request.json(); } catch { return new Response('Ungültige Daten', { status: 400 }); }
  const result = await setEmail(user, body?.email, body?.password);
  if (result.error) await new Promise(r => setTimeout(r, 500));   // Raten bremsen
  return Response.json(result, { status: result.error ? 400 : 200 });
}
