"use client";

import { useEffect, useState } from "react";

type NewsRow = {
  id: string;
  title: string;
  isPublished: boolean;
  isPinned: boolean;
  publishedAt: string;
  source: { name: string };
};

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/news?pageSize=50")
      .then((r) => r.json())
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const update = async (id: string, data: Partial<NewsRow>) => {
    await fetch(`/api/news/${id}`, { method: "PATCH", body: JSON.stringify(data) });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("تأكيد الحذف؟")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">إدارة الأخبار</h1>
      {loading ? (
        <p className="text-sm text-ivory-dim">جارٍ التحميل...</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gold/20 text-right text-ivory-dim">
              <th className="p-2">العنوان</th>
              <th className="p-2">المصدر</th>
              <th className="p-2">منشور</th>
              <th className="p-2">مثبّت</th>
              <th className="p-2">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr key={n.id} className="border-b border-gold/10">
                <td className="p-2">{n.title}</td>
                <td className="p-2 text-ivory-dim">{n.source?.name}</td>
                <td className="p-2">
                  <button onClick={() => update(n.id, { isPublished: !n.isPublished })} className="text-xs">
                    {n.isPublished ? "✅" : "🚫"}
                  </button>
                </td>
                <td className="p-2">
                  <button onClick={() => update(n.id, { isPinned: !n.isPinned })} className="text-xs">
                    {n.isPinned ? "📌" : "—"}
                  </button>
                </td>
                <td className="p-2">
                  <button onClick={() => remove(n.id)} className="text-xs text-red-400">
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
