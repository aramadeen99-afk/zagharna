import { prisma } from "@/lib/db";

export default async function AdminSportsPage() {
  const items = await prisma.sportsNews.findMany({ orderBy: { publishedAt: "desc" }, take: 50, include: { source: true } });
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">إدارة الرياضة</h1>
      <p className="mb-4 text-xs text-ivory-dim">تُضاف الأخبار الرياضية تلقائيًا من مصادر مرخصة (قسم Sources) أو يدويًا لاحقًا.</p>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.id} className="rounded border border-gold/10 p-2">{i.title} — <span className="text-ivory-dim">{i.source.name}</span></li>
        ))}
      </ul>
    </div>
  );
}
