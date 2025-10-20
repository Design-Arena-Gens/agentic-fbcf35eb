"use client";
import { useState } from 'react';

export default function VerifyByCode() {
  const [code, setCode] = useState('');
  const [res, setRes] = useState<any>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch('/api/verify/code', { method: 'POST', body: JSON.stringify({ code }) });
    setRes(await r.json());
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-xl font-semibold">Verify by Code</h1>
      <form onSubmit={submit} className="flex items-center gap-3">
        <input className="border rounded p-2" placeholder="Verification code" value={code} onChange={e=>setCode(e.target.value)} />
        <button className="bg-black text-white rounded px-3 py-2">Verify</button>
      </form>
      {res && <pre className="bg-gray-100 p-3 rounded text-sm">{JSON.stringify(res,null,2)}</pre>}
    </div>
  );
}
