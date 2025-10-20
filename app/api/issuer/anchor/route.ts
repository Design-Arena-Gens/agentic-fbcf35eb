import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Certificate from '@/lib/models/Certificate';
import { anchorCertificatePayload } from '@/lib/blockchain';

export async function POST(req: NextRequest) {
  const auth = getAuth();
  if (!auth || auth.role !== 'issuer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();
  const { id } = await req.json();
  const cert = await Certificate.findById(id);
  if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const payload = { student: cert.student, templateId: String(cert.templateId), verificationCode: cert.verificationCode };
  const res = await anchorCertificatePayload(payload);

  cert.blockchain = { ...cert.blockchain, txHash: res.txHash, dataHash: res.dataHash, network: res.network, anchoredAt: new Date() } as any;
  await cert.save();

  return NextResponse.json({ ok: true, ...res });
}
