import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/db';
import Certificate from '@/lib/models/Certificate';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI not configured' }, { status: 500 });

  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Extract student name, date of birth, email, roll number, and any verification code from this academic certificate. Return STRICT JSON only with keys: name, dob, email, roll, verificationCode.`;
  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: file.type || 'application/octet-stream',
        data: bytes.toString('base64'),
      },
    } as any,
  ]);
  const text = await result.response.text();

  let parsed: any = {};
  try { parsed = JSON.parse(text); } catch { parsed = {}; }

  const byCode = parsed.verificationCode ? await Certificate.findOne({ verificationCode: parsed.verificationCode }).lean() : null;
  let matched: any = byCode;
  if (!matched && parsed.roll) matched = await Certificate.findOne({ 'student.rollNumber': parsed.roll }).lean();
  if (!matched && parsed.email) matched = await Certificate.findOne({ 'student.email': parsed.email }).lean();
  if (!matched && parsed.name) matched = await Certificate.findOne({ 'student.name': parsed.name }).lean();

  const ok = !!matched && (!parsed.name || matched.student.name === parsed.name);

  return NextResponse.json({ extracted: parsed, matched: ok, certificateId: matched?._id?.toString() || null });
}
