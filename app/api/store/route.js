import { getDb } from '../../../lib/db';
import { userFromRequest } from '../../../lib/auth';

// Alles, was das Board speichert (To-Dos, Highscores, Inventar, Einstellungen …) – getrennt pro Konto.
// Jede Zeile kennt ihren Änderungszeitpunkt (ms), gelöschte Einträge bleiben als "deleted" markiert –
// so können andere Geräte nur die Änderungen seit ihrem letzten Abruf holen (GET ?since=…).
const MAX_VALUE = 2_000_000;   // Schutz gegen versehentlich riesige Einträge
let lastMs = 0;
const stamp = () => (lastMs = Math.max(Date.now(), lastMs + 1));   // streng steigend, auch bei mehreren Änderungen pro ms
const denied = () => new Response('Nicht angemeldet', { status: 401 });

export async function GET(request) {
  const user = await userFromRequest(request);
  if (!user) return denied();
  const since = Number(new URL(request.url).searchParams.get('since')) || 0;
  const rows = await (await getDb()).all('SELECT key, value, deleted, updated_ms FROM data WHERE user_id = ? AND updated_ms > ?', [user.id, since]);
  const data = {}, deleted = [];
  let now = since;
  for (const r of rows) {
    if (Number(r.deleted)) deleted.push(r.key); else data[r.key] = r.value;
    now = Math.max(now, Number(r.updated_ms));
  }
  return Response.json({ user: user.id, data, deleted, now }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  const user = await userFromRequest(request);
  if (!user) return denied();
  let body;
  try { body = await request.json(); } catch { return new Response('Ungültige Daten', { status: 400 }); }
  // Gehören die Daten zu einem anderen Konto (Gerät hat inzwischen gewechselt), nicht speichern
  if (body?.user != null && Number(body.user) !== user.id) return new Response('Falsches Konto', { status: 409 });
  const set = body && typeof body.set === 'object' && body.set ? body.set : {};
  const del = Array.isArray(body?.del) ? body.del : [];
  const stmts = [];
  for (const [k, v] of Object.entries(set)) {
    if (typeof v === 'string' && v.length <= MAX_VALUE) stmts.push([`INSERT INTO data (user_id, key, value, updated_ms, deleted) VALUES (?, ?, ?, ?, 0)
      ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value, updated_ms = excluded.updated_ms, deleted = 0`, [user.id, k, v, stamp()]]);
  }
  for (const k of del) if (typeof k === 'string') stmts.push([`UPDATE data SET value = '', deleted = 1, updated_ms = ? WHERE user_id = ? AND key = ?`, [stamp(), user.id, k]]);
  try { if (stmts.length) await (await getDb()).batch(stmts); }
  catch { return new Response('Speichern fehlgeschlagen', { status: 500 }); }
  return Response.json({ ok: true, now: lastMs });
}
