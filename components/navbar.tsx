"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Banknote, Landmark, LogOut, Users, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Landmark },
  { href: "/devedores", label: "Devedores", icon: Users },
  { href: "/emprestimos/novo", label: "Novo empréstimo", icon: Wallet },
  { href: "/pagamentos", label: "Pagamentos", icon: Banknote },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white shadow-sm">
            <Landmark size={22} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-green-700">
              Família Palmerense
            </p>
            <h1 className="text-lg font-bold text-slate-900">Banco da Família</h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-slate-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </header>
  );
}
