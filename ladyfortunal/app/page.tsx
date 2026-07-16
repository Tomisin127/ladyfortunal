'use client';

import { useState } from 'react';

export default function Page() {
  const [response, setResponse] = useState<{
    status?: number;
    data?: Record<string, unknown>;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const testFortune = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      setResponse({
        status: res.status,
        data: data,
      });
    } catch (err) {
      setResponse({
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const statusColor = response?.status
    ? response.status === 402
      ? 'bg-amber-50 border-amber-200'
      : response.status === 200
        ? 'bg-emerald-50 border-emerald-200'
        : 'bg-red-50 border-red-200'
    : 'bg-slate-50 border-slate-200';

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-12 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-medium tracking-widest text-slate-400">API ENDPOINT</p>
          </div>
          <h1 className="text-4xl font-bold text-white">Fortune API</h1>
          <p className="text-sm text-slate-400">x402 Payment Protocol • Base Mainnet • 1 USDC</p>
        </div>

        {/* Endpoint Card */}
        <div className="mb-6 space-y-4 rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
          <div>
            <p className="text-xs font-medium tracking-widest text-slate-400">METHOD</p>
            <p className="font-mono text-lg font-bold text-white">POST</p>
          </div>
          <div>
            <p className="text-xs font-medium tracking-widest text-slate-400">PATH</p>
            <p className="font-mono text-sm text-slate-300">/api/fortune</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={testFortune}
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition-all hover:bg-emerald-700 disabled:bg-slate-700"
        >
          {loading ? 'Testing...' : 'Test Endpoint'}
        </button>

        {/* Response Card */}
        {response && (
          <div className="mt-6 space-y-4 rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
            <div>
              <p className="text-xs font-medium tracking-widest text-slate-400">STATUS</p>
              <div className={`mt-2 inline-block rounded-lg border px-3 py-1 font-mono text-sm font-bold ${statusColor}`}>
                {response.status || 'Error'}
              </div>
            </div>

            {response.data && (
              <div>
                <p className="mb-2 text-xs font-medium tracking-widest text-slate-400">RESPONSE</p>
                <pre className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 overflow-auto font-mono text-xs text-slate-300">
                  {typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : String(response.data)}
                </pre>
              </div>
            )}

            {response.error && (
              <div>
                <p className="mb-2 text-xs font-medium tracking-widest text-slate-400">ERROR</p>
                <p className="font-mono text-sm text-red-400">{response.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
