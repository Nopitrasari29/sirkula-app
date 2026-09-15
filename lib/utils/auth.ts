import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

// Guard: di production, JWT_SECRET WAJIB diisi via environment variable
// Jika tidak, token bisa dipalsukan karena fallback terekspos di source code
const JWT_SECRET_STRING =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production'
    ? (() => { throw new Error('JWT_SECRET environment variable wajib diisi di production!'); })()
    : 'sirkula-dev-only-fallback-jwt-secret-do-not-use-in-production');
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  campus?: string;
}

/**
 * Hash a plain-text password using bcrypt with salt rounds 10
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain-text password with stored hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

/**
 * Sign JWT token valid for 7 days
 */
export async function signJwtToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token and extract payload
 */
export async function verifyJwtToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract Bearer token from Authorization header or Cookie string
 */
export function extractBearerToken(authHeaderOrCookie: string | null | undefined): string | null {
  if (!authHeaderOrCookie) return null;

  // Authorization: Bearer <token>
  if (authHeaderOrCookie.startsWith('Bearer ')) {
    return authHeaderOrCookie.substring(7).trim();
  }

  // Cookie string e.g. sirkula_token=<token>
  const cookieMatch = authHeaderOrCookie.match(/sirkula_token=([^;]+)/);
  if (cookieMatch) {
    return cookieMatch[1];
  }

  return authHeaderOrCookie;
}
