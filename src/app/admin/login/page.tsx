"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      return;
    }
    router.push("/admin");
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-md border border-gold/20 bg-charcoal-2 p-8">
        <h1 className="mb-6 text-center font-kufi text-2xl text-gold-light">لوحة تحكم عائلة الزغارنة</h1>

        <label className="mb-1.5 block text-xs text-ivory-dim">البريد الإلكتروني</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-sm border border-gold/20 bg-charcoal px-4 py-2.5 text-sm"
        />

        <label className="mb-1.5 block text-xs text-ivory-dim">كلمة المرور</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full rounded-sm border border-gold/20 bg-charcoal px-4 py-2.5 text-sm"
        />

        {error && <p className="mb-4 text-xs text-red-400">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-sm bg-gradient-to-br from-gold to-gold-light py-3 text-sm font-bold text-charcoal disabled:opacity-50"
        >
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
