import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ include: { role: true } });
  return (
    <div>
      <h1 className="mb-6 font-kufi text-2xl">المستخدمون</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gold/20 text-right text-ivory-dim">
            <th className="p-2">الاسم</th><th className="p-2">البريد</th><th className="p-2">الدور</th><th className="p-2">نشط</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-gold/10">
              <td className="p-2">{u.name}</td>
              <td className="p-2 text-ivory-dim">{u.email}</td>
              <td className="p-2 text-ivory-dim">{u.role.name}</td>
              <td className="p-2">{u.isActive ? "✅" : "🚫"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
