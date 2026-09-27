"use client";

import { useEffect, useState } from "react";

type Source = {
  id: string;
  name: string;
  type: string;
  rssUrl: string | null;
  status: string;
  fetchIntervalMinutes: number;
  lastFetchedAt: string | null;
  lastError: string | null;
};

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [form, setForm] = useState({ name: "", type: "RSS", rssUrl: "", fetchIntervalMinutes: 30 });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/sources")
      .then((r) => r.json())
      .then(setSources)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/sources", { method: "POST", body: JSON.stringify(form) });
    setForm({ name: "", type: "RSS", rssUrl: "", fetchIntervalMinutes: 30 });
    load();
  };

  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">إدارة المصادر</h1>

      <form onSubmit={submit} className="mb-8 grid max-w-xl gap-3 rounded border border-gold/20 bg-charcoal-2 p-5">
        <h2 className="mb-1 text-sm text-gold-light">إضافة مصدر جديد</h2>
        <input
          placeholder="اسم المصدر"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-sm border border-gold/20 bg-charcoal px-3 py-2 text-sm"
        />
        <input
          placeholder="رابط RSS الرسمي"
          required
          value={form.rssUrl}
          onChange={(e) => setForm({ ...form, rssUrl: e.target.value })}
          className="rounded-sm border border-gold/20 bg-charcoal px-3 py-2 text-sm"
        />
        <input
          type="number"
          min={5}
          placeholder="فترة التحديث بالدقائق"
          value={form.fetchIntervalMinutes}
          onChange={(e) => setForm({ ...form, fetchIntervalMinutes: Number(e.target.value) })}
          className="rounded-sm border border-gold/20 bg-charcoal px-3 py-2 text-sm"
        />
        <button className="rounded-sm bg-gradient-to-br from-gold to-gold-light px-4 py-2 text-sm font-bold text-charcoal">
          إضافة
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-ivory-dim">جارٍ التحميل...</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-right text-ivory-dim">
              <th className="p-2">الاسم</th>
              <th className="p-2">النوع</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">آخر تحديث</th>
              <th className="p-2">فترة التحديث</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.id} className="border-b border-gold/10">
                <td className="p-2">{s.name}</td>
                <td className="p-2 text-ivory-dim">{s.type}</td>
                <td className="p-2">
                  <span
                    className={
                      s.status === "ACTIVE" ? "text-green-400" : s.status === "ERROR" ? "text-red-400" : "text-ivory-dim"
                    }
                  >
                    {s.status}
                  </span>
                  {s.lastError && <div className="text-[11px] text-red-400">{s.lastError}</div>}
                </td>
                <td className="p-2 text-ivory-dim">
                  {s.lastFetchedAt ? new Intl.DateTimeFormat("ar").format(new Date(s.lastFetchedAt)) : "—"}
                </td>
                <td className="p-2 text-ivory-dim">{s.fetchIntervalMinutes} دقيقة</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
