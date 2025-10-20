import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectToDatabase();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return NextResponse.json({ error: 'Missing ADMIN creds' }, { status: 400 });

  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ ok: true, message: 'Admin exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, role: 'admin', status: 'approved' });
  return NextResponse.json({ ok: true });
}
