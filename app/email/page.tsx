'use client';
import { useState } from 'react';

export default function EmailPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResult(data.email);
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
        ✉️ Email Drafter
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Describe what you want to say — Claude writes the email.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What do you want to say?
        </label>
        <textarea
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Follow up with Notion recruiter, remind them I applied for PM role, ask for an update"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Drafting...' : 'Draft Email'}
        </button>
      </div>

      {result && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Drafted Email
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
    </div>
  );
}
