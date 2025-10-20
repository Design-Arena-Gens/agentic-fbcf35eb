import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-semibold">Unified Certificate Suite</h1>
        <p className="text-gray-600">Issue, anchor, and verify academic certificates with AI and blockchain security.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/verify" className="px-4 py-2 rounded bg-black text-white">Verify</Link>
          <Link href="/login" className="px-4 py-2 rounded border">Issuer / Admin</Link>
        </div>
      </div>
    </main>
  );
}
