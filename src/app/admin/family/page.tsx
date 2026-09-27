import { prisma } from "@/lib/db";

export default async function AdminFamilyPage() {
  const [members, events] = await Promise.all([
    prisma.familyMember.findMany(),
    prisma.familyEvent.findMany(),
  ]);
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">إدارة العائلة</h1>
      <p className="text-sm text-ivory-dim">الأفراد: {members.length} — المناسبات: {events.length}</p>
      <p className="mt-2 text-xs text-ivory-dim">إدخال البيانات الفعلية للعائلة يتم من هنا لاحقًا حسب ما يقرره المشرف.</p>
    </div>
  );
}
