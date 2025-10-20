"use client";
import { useState } from 'react';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/verify/upload', { method: 'POST', body: fd });
    const j = await res.json();
    if (!res.ok) setError(j.error || 'Failed'); else setResult(j);
  }

  return (
    <div className="min-h-screen p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Verify Certificate</h1>
      <form onSubmit={submit} className="flex items-center gap-3">
        <input type="file" onChange={e=> setFile(e.target.files?.[0]||null)} accept=".pptx,.pdf,.png,.jpg,.jpeg" />
        <button className="bg-black text-white rounded px-3 py-2">Upload</button>
      </form>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {result && (
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-w-3xl">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
