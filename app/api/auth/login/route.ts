import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import { signJwt, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password } = await req.json();
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  if (user.role === 'issuer' && user.status !== 'approved') {
    return NextResponse.json({ error: `Issuer status: ${user.status}` }, { status: 403 });
  }

  const token = signJwt({ sub: user._id.toString(), role: user.role as any, status: user.status });
  const res = NextResponse.json({ message: 'Logged in', role: user.role });
  res.cookies.set({ name: COOKIE_NAME, value: token, httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  return res;
}
