import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/sports", label: "Sports" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/quran", label: "Quran" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/family", label: "Family" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/logs", label: "Logs" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 flex-shrink-0 border-l border-gold/20 bg-charcoal-2 p-5 md:block">
        <div className="mb-6 font-kufi text-lg text-gold-light">لوحة التحكم</div>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded px-3 py-2 text-sm text-ivory-dim hover:bg-charcoal hover:text-gold-light">
              {l.label}
            </Link>
          ))}
        </nav>
        {session?.user && (
          <div className="mt-8 border-t border-gold/20 pt-4 text-xs text-ivory-dim">
            مسجّل الدخول: {session.user.name}
          </div>
        )}
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
