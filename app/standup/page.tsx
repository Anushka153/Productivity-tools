'use client';
import { useState, useEffect } from 'react';

interface Standup {
  id: string;
  yesterday: string;
  today: string;
  blockers: string;
  formatted: string;
  created_at: string;
}

export default function StandupPage() {
  const [form, setForm] = useState({ yesterday: '', today: '', blockers: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [standups, setStandups] = useState<Standup[]>([]);
  const [copied, setCopied] = useState(false);

  const fetchStandups = async () => {
    const res = await fetch('/api/standup');
    const data = await res.json();
    setStandups(data.standups);
  };

  useEffect(() => {
    fetchStandups();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/standup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data.formatted);
    setForm({ yesterday: '', today: '', blockers: '' });
    await fetchStandups();
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        📋 Daily Standup
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Fill in your standup — Claude formats and saves it.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col gap-4">
          {[
            { key: 'yesterday', label: 'What did you do yesterday?' },
            { key: 'today', label: 'What will you do today?' },
            { key: 'blockers', label: 'Any blockers?' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={label}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Formatting...' : 'Format & Save'}
        </button>
      </div>

      {result && (
        <div className="bg-white border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            ✅ Formatted Standup
          </h3>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {result}
          </pre>
          <button
            onClick={copy}
            className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
          >
            {copied ? '✅ Copied!' : 'Copy to clipboard'}
          </button>
        </div>
      )}

      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Past Standups {standups.length > 0 && `(${standups.length})`}
      </h3>
      {standups.length === 0 ? (
        <p className="text-sm text-gray-400">No standups logged yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {standups.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <p className="text-xs text-gray-400 mb-2">
                {new Date(s.created_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {s.formatted}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
