import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Certificate from '@/lib/models/Certificate';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { code } = await req.json();
  const cert = await Certificate.findOne({ verificationCode: code });
  return NextResponse.json({ exists: !!cert, certificateId: cert?._id?.toString() || null });
}
