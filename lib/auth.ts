import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export type JwtPayload = {
  sub: string;
  role: 'admin' | 'issuer';
  status?: 'pending' | 'approved' | 'rejected';
};

export const COOKIE_NAME = 'auth';

export function signJwt(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const secret = process.env.JWT_SECRET!;
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}

export function getAuth(): JwtPayload | null {
  // cookies() in Next 15 returns a async wrapper; cast for server runtime
  const cookieStore: any = cookies() as any;
  const token = cookieStore.get?.(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwt(token);
}
