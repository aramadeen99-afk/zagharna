import { prisma } from "@/lib/db";

export default async function AdminArticlesPage() {
  const items = await prisma.article.findMany({ orderBy: { createdAt: "desc" }, include: { author: true } });
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">إدارة المقالات</h1>
      <ul className="space-y-2 text-sm">
        {items.map((a) => (
          <li key={a.id} className="rounded border border-gold/10 p-2">
            {a.title} — <span className="text-ivory-dim">{a.author.name} — {a.isPublished ? "منشور" : "مسودة"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
