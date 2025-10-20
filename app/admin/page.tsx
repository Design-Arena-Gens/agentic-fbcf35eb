import { getAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';
import Template from '@/lib/models/Template';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const auth = getAuth();
  if (!auth || auth.role !== 'admin') redirect('/login');
  await connectToDatabase();
  const pending = await User.find({ role: 'issuer', status: 'pending' }).lean();
  const templates = await Template.find({}).lean();

  async function approve(id: string, status: 'approved'|'rejected') {
    "use server";
    await connectToDatabase();
    await User.updateOne({ _id: id }, { $set: { status } });
  }

  async function setActiveTemplate(id: string) {
    "use server";
    await connectToDatabase();
    await Template.updateMany({}, { $set: { active: false } });
    await Template.updateOne({ _id: id }, { $set: { active: true } });
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Pending Issuers</h2>
        <div className="grid gap-3">
          {pending.map((p: any)=> (
            <div key={p._id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.organizationName}</div>
                <div className="text-sm text-gray-600">{p.email}</div>
              </div>
              <form action={async()=> approve(p._id.toString(),'approved')}><button className="px-3 py-1 bg-green-600 text-white rounded-md">Approve</button></form>
              <form action={async()=> approve(p._id.toString(),'rejected')}><button className="px-3 py-1 bg-red-600 text-white rounded-md">Reject</button></form>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Templates</h2>
        <div className="grid gap-3">
          {templates.map((t: any)=> (
            <div key={t._id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-gray-600">Active: {String(t.active)}</div>
              </div>
              <form action={async()=> setActiveTemplate(t._id.toString())}><button className="px-3 py-1 bg-black text-white rounded-md">Set Active</button></form>
            </div>
          ))}
        </div>
        <a href="/admin/templates" className="text-sm underline">Manage templates</a>
      </section>
    </div>
  );
}
