'use client';
import { useState, useEffect } from 'react';

interface Decision {
  id: string;
  decision: string;
  reasoning: string;
  outcome: string;
  created_at: string;
}

const emptyForm = { decision: '', reasoning: '', outcome: '' };

export default function DecisionsPage() {
  const [form, setForm] = useState(emptyForm);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDecisions = async () => {
    setLoading(true);
    const res = await fetch('/api/decisions');
    const data = await res.json();
    setDecisions(data.decisions);
    setLoading(false);
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleSave = async () => {
    if (!form.decision.trim()) return;
    setSaving(true);
    await fetch('/api/decisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm(emptyForm);
    await fetchDecisions();
    setSaving(false);
  };

  const handleUpdate = async (id: string) => {
    await fetch('/api/decisions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editForm }),
    });
    setEditingId(null);
    await fetchDecisions();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch('/api/decisions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setDeletingId(null);
    await fetchDecisions();
  };

  const startEdit = (d: Decision) => {
    setEditingId(d.id);
    setEditForm({
      decision: d.decision,
      reasoning: d.reasoning,
      outcome: d.outcome,
    });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        📓 Decision Logger
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Log, edit and track your decisions over time.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Log a new decision
        </h3>
        <div className="flex flex-col gap-4">
          {[
            {
              key: 'decision',
              label: 'What did you decide?',
              placeholder: 'e.g. Chose Supabase over MongoDB',
            },
            {
              key: 'reasoning',
              label: 'Why?',
              placeholder: 'e.g. Better free tier, SQL is more appropriate',
            },
            {
              key: 'outcome',
              label: 'Expected outcome',
              placeholder: 'e.g. Saves cost, revisit if needed',
            },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <textarea
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {saving ? 'Saving...' : 'Log Decision'}
        </button>
      </div>

      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Past Decisions {decisions.length > 0 && `(${decisions.length})`}
      </h3>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : decisions.length === 0 ? (
        <p className="text-sm text-gray-400">No decisions logged yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {decisions.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              {editingId === d.id ? (
                <div className="flex flex-col gap-3">
                  {[
                    { key: 'decision', label: 'Decision' },
                    { key: 'reasoning', label: 'Reasoning' },
                    { key: 'outcome', label: 'Outcome' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        {label}
                      </label>
                      <textarea
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editForm[key as keyof typeof editForm]}
                        onChange={(e) =>
                          setEditForm({ ...editForm, [key]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(d.id)}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {d.decision}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">💭 {d.reasoning}</p>
                  <p className="text-sm text-gray-500 mb-3">🎯 {d.outcome}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {new Date(d.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(d)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        disabled={deletingId === d.id}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition disabled:opacity-50"
                      >
                        {deletingId === d.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
