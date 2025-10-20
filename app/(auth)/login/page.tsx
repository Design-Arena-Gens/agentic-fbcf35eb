"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (!res.ok) {
      const j = await res.json();
      setError(j.error || 'Login failed');
      return;
    }
    const j = await res.json();
    if (j.role === 'admin') router.push('/admin');
    else router.push('/issuer');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white shadow rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input className="w-full border rounded-md p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-md p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-black text-white rounded-md py-2">Sign in</button>
        <a href="/register" className="text-sm text-gray-600 hover:text-gray-900">Request issuer access</a>
      </form>
    </div>
  );
}
