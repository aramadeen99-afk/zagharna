import { prisma } from "@/lib/db";

export default async function AdminQuranPage() {
  const [surahs, streams] = await Promise.all([
    prisma.quranSurah.findMany({ orderBy: { number: "asc" } }),
    prisma.radioStream.findMany(),
  ]);
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">إدارة القرآن والبث</h1>
      <div className="mb-8 rounded border border-gold/20 bg-charcoal-2 p-4">
        <h2 className="mb-2 text-sm text-gold-light">روابط البث المباشر</h2>
        {streams.map((s) => (
          <div key={s.id} className="text-sm text-ivory-dim">
            {s.title} — {s.streamUrl || "لم يُضبط رابط بعد"} — {s.isActive ? "نشط" : "متوقف"}
          </div>
        ))}
        <p className="mt-2 text-xs text-ivory-dim">
          يُعدَّل الرابط عبر تحديث جدول radio_streams (Prisma Studio أو API إدارة مخصص).
        </p>
      </div>
      <h2 className="mb-2 text-sm text-gold-light">السور ({surahs.length})</h2>
      <ul className="space-y-1 text-sm">
        {surahs.map((s) => (
          <li key={s.id} className="text-ivory-dim">{s.number}. {s.nameArabic}</li>
        ))}
      </ul>
    </div>
  );
}
