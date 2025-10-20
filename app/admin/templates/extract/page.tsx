import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import Template from '@/lib/models/Template';

export default async function ExtractPlaceholders() {
  const auth = getAuth();
  if (!auth || auth.role !== 'admin') redirect('/login');

  async function extract(formData: FormData) {
    "use server";
    await connectToDatabase();
    const id = String(formData.get('id')||'');
    const t = await Template.findById(id);
    if (!t) return;
    // naive extraction: find {PLACEHOLDER} strings in XML
    const xml = t.fileData.toString('utf8');
    const matchIter = xml.matchAll(/\{[A-Z0-9_]+\}/g);
    const matches: string[] = [];
    for (const m of matchIter as Iterable<RegExpMatchArray>) {
      matches.push(m[0]);
    }
    await Template.updateOne({ _id: id }, { $set: { placeholders: Array.from(new Set(matches)) } });
  }

  const templates = await Template.find({}).lean();
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Extract Placeholders</h1>
      <form action={extract} className="flex gap-3 items-center">
        <select name="id" className="border p-2 rounded">
          {templates.map((t:any)=> <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
        <button className="px-3 py-2 bg-black text-white rounded">Extract</button>
      </form>
    </div>
  );
}
