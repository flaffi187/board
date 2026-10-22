// Exportiert alle gespeicherten Daten aus data/board.db als JSON nach backup/board-backup.json (npm run backup).
// Pro Konto ein Abschnitt; "(ohne Konto)" sind Daten von vor den Konten.
import { DatabaseSync } from 'node:sqlite';
import { writeFileSync, mkdirSync } from 'node:fs';

const db = new DatabaseSync('data/board.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map(t => t.name);
const accounts = {};
if (tables.includes('data')) {
  const names = Object.fromEntries((tables.includes('users') ? db.prepare('SELECT id, name FROM users').all() : []).map(u => [u.id, u.name]));
  for (const r of db.prepare('SELECT user_id, key, value FROM data WHERE deleted = 0 ORDER BY user_id, key').all()) {
    ((accounts[names[r.user_id] || '(ohne Konto)']) ??= {})[r.key] = r.value;
  }
} else if (tables.includes('store')) {
  accounts['(ohne Konto)'] = Object.fromEntries(db.prepare('SELECT key, value FROM store WHERE COALESCE(deleted, 0) = 0').all().map(r => [r.key, r.value]));
}
mkdirSync('backup', { recursive: true });
writeFileSync('backup/board-backup.json', JSON.stringify({ exported: new Date().toISOString(), accounts }, null, 2) + '\n');
for (const [name, data] of Object.entries(accounts)) console.log(`${name}: ${Object.keys(data).length} Einträge`);
console.log('→ backup/board-backup.json');
