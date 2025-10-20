import { getAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import Certificate from '@/lib/models/Certificate';

export default async function IssuerCertificates() {
  const auth = getAuth();
  if (!auth || auth.role !== 'issuer') redirect('/login');
  await connectToDatabase();
  const certs = await Certificate.find({ issuerId: auth.sub }).lean();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">My Certificates</h1>
      <div className="grid gap-3">
        {certs.map((c:any)=> (
          <div key={c._id} className="border rounded p-3">
            <div className="font-medium">{c.student?.name}</div>
            <div className="text-sm text-gray-600">Verification code: {c.verificationCode}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
