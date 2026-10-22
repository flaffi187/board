// Datenbank-Anschluss: auf Cloudflare über D1 (Binding "DB"), im Codespace über die lokale Datei data/board.db.
// Beide verstehen dasselbe SQL; nach aussen gibt es nur all() und batch().
import { getCloudflareContext } from '@opennextjs/cloudflare';

// users: Konten · sessions: angemeldete Geräte · data: alle gespeicherten Werte, getrennt pro Konto.
// Einträge mit user_id 0 sind Daten von vor den Konten – die übernimmt das erste Konto, das erstellt wird.
export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE,
    pw_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS data (
    user_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_ms INTEGER NOT NULL DEFAULT 0,
    deleted INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, key)
  )`,
  'CREATE INDEX IF NOT EXISTS data_updated ON data (user_id, updated_ms)',
];

async function d1() {
  try { return (await getCloudflareContext({ async: true })).env.DB || null; }
  catch { return null; }   // next dev ohne Cloudflare
}

async function open() {
  const db = await d1();
  if (db) {
    await db.batch(SCHEMA.map(sql => db.prepare(sql)));
    return {
      all: async (sql, args = []) => (await db.prepare(sql).bind(...args).all()).results,
      batch: async (stmts) => { await db.batch(stmts.map(([sql, args = []]) => db.prepare(sql).bind(...args))); },
    };
  }
  const { DatabaseSync } = await import('node:sqlite');
  const { mkdirSync } = await import('node:fs');
  const path = await import('node:path');
  const dir = path.join(process.cwd(), 'data');
  mkdirSync(dir, { recursive: true });
  const local = new DatabaseSync(path.join(dir, 'board.db'));
  for (const sql of SCHEMA) local.exec(sql);
  // ältere lokale Datei: Einträge aus der früheren Tabelle "store" einmalig übernehmen
  try {
    local.exec(`INSERT OR IGNORE INTO data (user_id, key, value, updated_ms, deleted)
      SELECT 0, key, value, COALESCE(updated_ms, 0), COALESCE(deleted, 0) FROM store WHERE COALESCE(deleted, 0) = 0`);
    local.exec('DROP TABLE store');
  } catch { /* keine alte Tabelle */ }
  return {
    all: async (sql, args = []) => local.prepare(sql).all(...args),
    batch: async (stmts) => {
      local.exec('BEGIN');
      try { for (const [sql, args = []] of stmts) local.prepare(sql).run(...args); local.exec('COMMIT'); }
      catch (err) { local.exec('ROLLBACK'); throw err; }
    },
  };
}

let ready = null;
export const getDb = () => (ready ??= open().catch((err) => { ready = null; throw err; }));
