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
  if (!NAME_RULE.test(name)) return { error: 'Benutzername: 3–20 Zeichen, nur Buchstaben, Zahlen, . _ -' };
  if (password.length < 6) return { error: 'Das Passwort braucht mindestens 6 Zeichen.' };
  const db = await getDb();
  if ((await db.all('SELECT id FROM users WHERE name = ?', [name])).length) return { error: 'Diesen Benutzernamen gibt es schon.' };
  const salt = randomHex(16);
  const first = (await db.all('SELECT COUNT(*) AS n FROM users'))[0];
  await db.batch([['INSERT INTO users (name, pw_hash, salt) VALUES (?, ?, ?)', [name, await hashPassword(password, salt), salt]]]);
  const user = (await db.all('SELECT id, name FROM users WHERE name = ?', [name]))[0];
  // Das allererste Konto übernimmt die Daten von vor den Konten; jedes weitere startet leer
  if (Number(first.n) === 0) await db.batch([['UPDATE data SET user_id = ? WHERE user_id = 0', [user.id]]]);
  return { user };
}

export async function login(name, password) {
  const db = await getDb();
  const row = (await db.all('SELECT id, name, pw_hash, salt FROM users WHERE name = ?', [String(name || '').trim()]))[0];
  if (!row || !sameHex(await hashPassword(String(password || ''), row.salt), row.pw_hash)) return { error: 'Benutzername oder Passwort falsch.' };
  return { user: { id: row.id, name: row.name } };
}

export async function createSession(userId) {
  const token = randomHex(32);
  await (await getDb()).batch([['INSERT INTO sessions (token_hash, user_id) VALUES (?, ?)', [await sha256(token), userId]]]);
  return token;
}

export async function endSession(token) {
  if (token) await (await getDb()).batch([['DELETE FROM sessions WHERE token_hash = ?', [await sha256(token)]]]);
}

export async function userFromToken(token) {
  if (!token) return null;
  const rows = await (await getDb()).all(
    'SELECT u.id, u.name FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?', [await sha256(token)]);
  return rows[0] ? { id: Number(rows[0].id), name: rows[0].name } : null;
}

export const userFromRequest = (request) => userFromToken(request.cookies.get(SESSION_COOKIE)?.value);
