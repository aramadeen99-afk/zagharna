import { prisma } from "@/lib/db";

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany();
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">الإعدادات</h1>
      <p className="mb-4 text-xs text-ivory-dim">
        إعدادات عامة (نصوص الصفحات القانونية، فترات التحديث الافتراضية...) تُخزَّن هنا كمفتاح/قيمة.
      </p>
      <ul className="space-y-1 text-sm">
        {settings.map((s) => (
          <li key={s.id} className="text-ivory-dim">{s.key}: {s.value}</li>
        ))}
      </ul>
    </div>
  );
}
