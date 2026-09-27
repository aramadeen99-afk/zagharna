import { prisma } from "@/lib/db";

export default async function AdminEducationPage() {
  const items = await prisma.education.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">إدارة التعليم</h1>
      <p className="mb-4 text-xs text-ivory-dim">أضف محتوى تعليميًا موثقًا مع تحديد المصدر الرسمي لكل عنصر عبر API الداخلي.</p>
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.id} className="rounded border border-gold/10 p-2">{i.title} — <span className="text-ivory-dim">{i.sourceName}</span></li>
        ))}
      </ul>
    </div>
  );
}
