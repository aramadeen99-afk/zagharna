import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [newsCount, sourcesCount, articlesCount, usersCount, errorSources] = await Promise.all([
    prisma.news.count(),
    prisma.newsSource.count(),
    prisma.article.count(),
    prisma.user.count(),
    prisma.newsSource.count({ where: { status: "ERROR" } }),
  ]);

  const stats = [
    { label: "الأخبار", value: newsCount },
    { label: "المصادر", value: sourcesCount },
    { label: "المقالات", value: articlesCount },
    { label: "المستخدمون", value: usersCount },
  ];

  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">Dashboard</h1>
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded border border-gold/20 bg-charcoal-2 p-5">
            <div className="text-2xl font-bold text-gold-light">{s.value}</div>
            <div className="text-xs text-ivory-dim">{s.label}</div>
          </div>
        ))}
      </div>

      {errorSources > 0 && (
        <div className="rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          ⚠ يوجد {errorSources} مصدر أخبار في حالة خطأ — راجع قسم Sources.
        </div>
      )}
    </div>
  );
}
