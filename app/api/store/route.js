import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

// Datenbank für alles, was das Board speichert (To-Dos, Highscores, Inventar, Einstellungen …).
// Schlüssel-Wert-Speicher in data/board.db. Jede Zeile kennt ihren Änderungszeitpunkt (ms), gelöschte
// Einträge bleiben als "deleted" markiert – so können andere Geräte nur die Änderungen seit ihrem
// letzten Abruf holen (GET ?since=…).
const dir = path.join(process.cwd(), 'data');
mkdirSync(dir, { recursive: true });
const db = globalThis.__boardDb ??= new DatabaseSync(path.join(dir, 'board.db'));
db.exec(`CREATE TABLE IF NOT EXISTS store (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);
for (const sql of ['ALTER TABLE store ADD COLUMN updated_ms INTEGER NOT NULL DEFAULT 0', 'ALTER TABLE store ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0']) {
  try { db.exec(sql); } catch { /* Spalte gibt es schon */ }
}

const MAX_VALUE = 2_000_000;   // Schutz gegen versehentlich riesige Einträge
let lastMs = 0;
const stamp = () => (lastMs = Math.max(Date.now(), lastMs + 1));   // streng steigend, auch bei mehreren Änderungen pro ms

export async function GET(request) {
  const since = Number(new URL(request.url).searchParams.get('since')) || 0;
  const rows = db.prepare('SELECT key, value, deleted, updated_ms FROM store WHERE updated_ms > ?').all(since);
  const data = {}, deleted = [];
  let now = since;
  for (const r of rows) {
    if (r.deleted) deleted.push(r.key); else data[r.key] = r.value;
    now = Math.max(now, r.updated_ms);
  }
  return Response.json({ data, deleted, now }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return new Response('Ungültige Daten', { status: 400 }); }
  const set = body && typeof body.set === 'object' && body.set ? body.set : {};
  const del = Array.isArray(body?.del) ? body.del : [];
  const upsert = db.prepare(`INSERT INTO store (key, value, updated_at, updated_ms, deleted) VALUES (?, ?, datetime('now'), ?, 0)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_ms = excluded.updated_ms, deleted = 0`);
  const remove = db.prepare(`UPDATE store SET value = '', deleted = 1, updated_at = datetime('now'), updated_ms = ? WHERE key = ?`);
  db.exec('BEGIN');
  try {
    for (const [k, v] of Object.entries(set)) {
      if (typeof k === 'string' && typeof v === 'string' && v.length <= MAX_VALUE) upsert.run(k, v, stamp());
    }
    for (const k of del) if (typeof k === 'string') remove.run(stamp(), k);
    db.exec('COMMIT');
  } catch {
    db.exec('ROLLBACK');
    return new Response('Speichern fehlgeschlagen', { status: 500 });
  }
  return Response.json({ ok: true, now: lastMs });
}
