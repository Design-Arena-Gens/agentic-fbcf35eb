import { connectToDatabase } from '@/lib/db';
import Template from '@/lib/models/Template';
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const auth = getAuth();
  if (!auth || auth.role !== 'admin') redirect('/login');
  await connectToDatabase();
  const templates = await Template.find({}).lean();

  async function uploadTemplate(formData: FormData) {
    "use server";
    await connectToDatabase();
    const file = formData.get('file') as File | null;
    const name = String(formData.get('name') || 'Template');
    if (!file) return;
    const buff = Buffer.from(await file.arrayBuffer());
    await Template.create({ name, fileData: buff, placeholders: ['{NAME}','{DATE_OF_BIRTH}','{CANDIDATE_IMAGE}'] });
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Templates</h1>
      <form action={uploadTemplate} className="border rounded-lg p-4 flex items-center gap-3">
        <input type="text" name="name" placeholder="Template name" className="border p-2 rounded" />
        <input type="file" name="file" accept=".pptx" className="border p-2 rounded" />
        <button className="px-3 py-2 bg-black text-white rounded">Upload .pptx</button>
      </form>
      <div className="grid gap-3">
        {templates.map((t:any)=> (
          <div key={t._id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-gray-600">Placeholders: {t.placeholders?.join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
