import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  organizationName: z.string().min(2),
  organizationType: z.string().min(2),
  contactName: z.string().min(2),
  contactPhone: z.string().min(5),
});

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { email, password, organizationName, organizationType, contactName, contactPhone } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    passwordHash,
    role: 'issuer',
    status: 'pending',
    organizationName,
    organizationType,
    contactName,
    contactPhone,
  });

  return NextResponse.json({ message: 'Registration submitted, pending admin approval', id: user._id.toString() }, { status: 201 });
}
