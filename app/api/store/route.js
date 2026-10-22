import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

// Datenbank für alles, was das Board speichert (To-Dos, Highscores, Inventar, Einstellungen …).
// Einfacher Schlüssel-Wert-Speicher in einer SQLite-Datei unter data/board.db.
const dir = path.join(process.cwd(), 'data');
mkdirSync(dir, { recursive: true });
const db = globalThis.__boardDb ??= new DatabaseSync(path.join(dir, 'board.db'));
db.exec(`CREATE TABLE IF NOT EXISTS store (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const MAX_VALUE = 2_000_000;   // Schutz gegen versehentlich riesige Einträge

export async function GET() {
  const rows = db.prepare('SELECT key, value FROM store').all();
  const data = {};
  for (const r of rows) data[r.key] = r.value;
  return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return new Response('Ungültige Daten', { status: 400 }); }
  const set = body && typeof body.set === 'object' && body.set ? body.set : {};
  const del = Array.isArray(body?.del) ? body.del : [];
  const upsert = db.prepare(`INSERT INTO store (key, value, updated_at) VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`);
  const remove = db.prepare('DELETE FROM store WHERE key = ?');
  db.exec('BEGIN');
  try {
    for (const [k, v] of Object.entries(set)) {
      if (typeof k === 'string' && typeof v === 'string' && v.length <= MAX_VALUE) upsert.run(k, v);
    }
    for (const k of del) if (typeof k === 'string') remove.run(k);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    return new Response('Speichern fehlgeschlagen', { status: 500 });
  }
  return Response.json({ ok: true });
}
