import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Template from '@/lib/models/Template';
import Certificate from '@/lib/models/Certificate';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const auth = getAuth();
  if (!auth || auth.role !== 'issuer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();

  const { name, dob, email, roll, imageUrl } = await req.json();
  const template = await Template.findOne({ active: true });
  if (!template) return NextResponse.json({ error: 'No active template' }, { status: 400 });

  const fields: Record<string,string> = {
    '{NAME}': name,
    '{DATE_OF_BIRTH}': dob,
    '{EMAIL}': email,
    '{ROLL_NUMBER}': roll,
    '{CANDIDATE_IMAGE}': imageUrl || ''
  };

  const dataHash = crypto.createHash('sha256').update(JSON.stringify({ name, dob, email, roll })).digest('hex');

  const cert = await Certificate.create({
    templateId: template._id,
    issuerId: auth.sub,
    student: { name, dateOfBirth: dob, email, rollNumber: roll },
    fields,
    blockchain: { dataHash },
    verificationCode: crypto.randomBytes(6).toString('hex'),
  });

  return NextResponse.json({ id: cert._id.toString(), verificationCode: cert.verificationCode });
}
