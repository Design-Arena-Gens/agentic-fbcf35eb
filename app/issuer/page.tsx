import { getAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import Template from '@/lib/models/Template';
import Certificate from '@/lib/models/Certificate';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export default async function IssuerPage() {
  const auth = getAuth();
  if (!auth || auth.role !== 'issuer') redirect('/login');
  await connectToDatabase();
  const template = await Template.findOne({ active: true });

  async function createCertificate(formData: FormData) {
    "use server";
    await connectToDatabase();
    const name = String(formData.get('name')||'');
    const dob = String(formData.get('dob')||'');
    const email = String(formData.get('email')||'');
    const roll = String(formData.get('roll')||'');
    const candidateImage = formData.get('image') as File | null;

    if (!template) return;

    const fields: Record<string,string> = { '{NAME}': name, '{DATE_OF_BIRTH}': dob, '{EMAIL}': email, '{ROLL_NUMBER}': roll, '{CANDIDATE_IMAGE}': candidateImage ? 'file://image' : '' };

    const dataHash = crypto.createHash('sha256').update(JSON.stringify({ name, dob, email, roll })).digest('hex');

    const cert = await Certificate.create({
      templateId: template._id,
      issuerId: auth!.sub,
      student: { name, dateOfBirth: dob, email, rollNumber: roll },
      fields,
      blockchain: { dataHash },
      verificationCode: crypto.randomBytes(6).toString('hex'),
    });

    return cert._id.toString();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Issue Certificate</h1>
      {!template && <p className="text-sm text-gray-600">No active template set by admin.</p>}
      {template && (
        <form action={createCertificate} className="grid gap-3 max-w-xl">
          <input name="name" placeholder="Full name" className="border rounded p-2" />
          <input name="dob" placeholder="Date of Birth" className="border rounded p-2" />
          <input name="email" placeholder="Email" className="border rounded p-2" />
          <input name="roll" placeholder="Roll Number" className="border rounded p-2" />
          <input type="file" name="image" accept="image/*" className="border rounded p-2" />
          <button className="bg-black text-white rounded p-2">Generate Certificate</button>
        </form>
      )}
    </div>
  );
}
