import {createHmac, timingSafeEqual} from 'crypto';

const COOKIE_NAME = 'fiapos_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 12;

type SessionPayload = { email: string; exp: number };

function getSecret() {
  const configured = process.env.ADMIN_SESSION_SECRET;
  if (configured) return configured;
  if (process.env.NODE_ENV !== 'production') return 'fiapos-local-dev-secret-change-me';
  throw new Error('ADMIN_SESSION_SECRET não configurado.');
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function getAdminCredentials() {
  const email = process.env.ADMIN_EMAIL || (process.env.NODE_ENV !== 'production' ? 'admin@fiapos.local' : '');
  const password = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== 'production' ? 'Fiapos@2026' : '');
  return {email, password};
}

export function createAdminSession(email: string) {
  const payload: SessionPayload = {email, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS};
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function verifyAdminSession(token?: string | null) {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.email || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    const configuredAdmin = getAdminCredentials().email;
    if (configuredAdmin && payload.email.toLowerCase() !== configuredAdmin.toLowerCase()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};