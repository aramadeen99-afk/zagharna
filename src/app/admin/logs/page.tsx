import { prisma } from "@/lib/db";

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { user: true } });
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">سجل العمليات (Audit Logs)</h1>
      <ul className="space-y-1 text-sm">
        {logs.map((l) => (
          <li key={l.id} className="text-ivory-dim">
            [{new Intl.DateTimeFormat("ar", { dateStyle: "short", timeStyle: "short" }).format(l.createdAt)}]
            {" "}{l.user?.name ?? "نظام"} — {l.action} {l.entity}
          </li>
        ))}
      </ul>
    </div>
  );
}
