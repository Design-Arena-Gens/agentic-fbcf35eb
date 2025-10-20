"use client";
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', organizationName: '', organizationType: '', contactName: '', contactPhone: ''
  });
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await res.json();
    if (!res.ok) setMsg(j.error || 'Failed'); else setMsg('Submitted for approval.');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white shadow rounded-xl p-6 space-y-3">
        <h1 className="text-2xl font-semibold">Issuer Registration</h1>
        {msg && <p className="text-sm text-gray-700">{msg}</p>}
        {Object.entries({Email:'email', Password:'password', Organization:'organizationName', Type:'organizationType', Contact:'contactName', Phone:'contactPhone'}).map(([label,key])=> (
          <div key={key} className="space-y-1">
            <label className="text-sm text-gray-600">{label}</label>
            <input className="w-full border rounded-md p-2" type={key==='password'?'password':'text'} value={(form as any)[key]} onChange={e=>setForm({...form,[key]:e.target.value})} />
          </div>
        ))}
        <button className="w-full bg-black text-white rounded-md py-2">Submit</button>
      </form>
    </div>
  );
}
