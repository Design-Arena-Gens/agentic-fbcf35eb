import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';

export async function GET() {
  const auth = getAuth();
  if (!auth) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, user: auth });
}
