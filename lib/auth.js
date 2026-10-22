import { getDb } from './db';

// Konten: Benutzername + Passwort. Passwörter werden nur als PBKDF2-Hash gespeichert,
// angemeldete Geräte bekommen ein zufälliges Sitzungs-Token als Cookie (in der DB liegt nur dessen Hash).
export const SESSION_COOKIE = 'board_session';
const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
const randomHex = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));
const sha256 = async (s) => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: 100000 }, key, 256);
  return hex(bits);
}
const sameHex = (a, b) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

export const NAME_RULE = /^[A-Za-z0-9ÄÖÜäöüß_.-]{3,20}$/;

export async function register(name, password) {
  name = String(name || '').trim(); password = String(password || '');
  if (!NAME_RULE.test(name)) return { error: 'name' };
  if (password.length < 6) return { error: 'kurz' };
  const db = await getDb();
  if ((await db.all('SELECT id FROM users WHERE name = ?', [name])).length) return { error: 'vergeben' };
  const salt = randomHex(16);
  const first = (await db.all('SELECT COUNT(*) AS n FROM users'))[0];
  await db.batch([['INSERT INTO users (name, pw_hash, salt) VALUES (?, ?, ?)', [name, await hashPassword(password, salt), salt]]]);
  const user = (await db.all('SELECT id, name FROM users WHERE name = ?', [name]))[0];
  // Das allererste Konto übernimmt die Daten von vor den Konten; jedes weitere startet leer
  if (Number(first.n) === 0) await db.batch([['UPDATE data SET user_id = ? WHERE user_id = 0', [user.id]]]);
  return { user };
}

// Anmelden mit Benutzername oder E-Mail (alles mit @ gilt als E-Mail)
export async function login(name, password) {
  const db = await getDb();
  const id = String(name || '').trim();
  const row = (await db.all(`SELECT id, name, pw_hash, salt FROM users WHERE ${id.includes('@') ? 'email = ? COLLATE NOCASE' : 'name = ?'}`, [id]))[0];
  if (!row || !sameHex(await hashPassword(String(password || ''), row.salt), row.pw_hash)) return { error: 'falsch' };
  return { user: { id: row.id, name: row.name } };
}

export async function createSession(userId) {
  const token = randomHex(32);
  await (await getDb()).batch([['INSERT INTO sessions (token_hash, user_id) VALUES (?, ?)', [await sha256(token), userId]]]);
  return token;
}

// Anmeldung gilt nur für einmal Laden: beim Aufbau der Seite wird das Login-Cookie verbraucht und die Seite
// bekommt ein eigenes Token, das nur im Speicher des offenen Tabs liegt. Neu laden/öffnen → wieder anmelden.
export async function consumeLogin(token) {
  const user = await userFromToken(token);
  if (!user) return null;
  const db = await getDb();
  const pageToken = randomHex(32);
  await db.batch([
    ['DELETE FROM sessions WHERE token_hash = ?', [await sha256(token)]],
    ['INSERT INTO sessions (token_hash, user_id) VALUES (?, ?)', [await sha256(pageToken), user.id]],
    ["DELETE FROM sessions WHERE created_at < datetime('now', '-30 days')", []],
  ]);
  return { user, pageToken };
}

export async function endSession(token) {
  if (token) await (await getDb()).batch([['DELETE FROM sessions WHERE token_hash = ?', [await sha256(token)]]]);
}

export async function userFromToken(token) {
  if (!token) return null;
  const rows = await (await getDb()).all(
    'SELECT u.id, u.name, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?', [await sha256(token)]);
  return rows[0] ? { id: Number(rows[0].id), name: rows[0].name, email: rows[0].email || '' } : null;
}

// Seiten-Token kommt als Header (fetch) oder im JSON-Body (sendBeacon kann keine Header)
export const userFromRequest = (request, bodyToken) => userFromToken(request.headers.get('x-board-token') || bodyToken);

export const EMAIL_RULE = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

// E-Mail mit dem Konto verbinden (oder mit leerem Feld entfernen). Zur Sicherheit mit Passwort bestätigen.
export async function setEmail(user, email, password) {
  if ((await login(user.name, password)).error) return { error: 'Passwort falsch.' };
  email = String(email || '').trim().toLowerCase();
  if (email && (email.length > 254 || !EMAIL_RULE.test(email))) return { error: 'Das ist keine gültige E-Mail-Adresse.' };
  const db = await getDb();
  if (email && (await db.all('SELECT id FROM users WHERE email = ? COLLATE NOCASE AND id != ?', [email, user.id])).length) {
    return { error: 'Diese E-Mail gehört schon zu einem anderen Konto.' };
  }
  await db.batch([['UPDATE users SET email = ? WHERE id = ?', [email || null, user.id]]]);
  return { email };
}
