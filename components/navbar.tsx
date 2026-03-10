"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Banknote,
  CalendarDays,
  Landmark,
  LogOut,
  Menu,
  ScrollText,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Landmark },
  { href: "/devedores", label: "Devedores", icon: Users },
  { href: "/emprestimos", label: "Empréstimos", icon: ScrollText },
  { href: "/emprestimos/novo", label: "Novo empréstimo", icon: Wallet },
  { href: "/pagamentos", label: "Pagamentos", icon: Banknote },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <div className="glass-card mx-auto max-w-7xl rounded-[28px] px-5 py-4 lift-hover">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-[0_10px_25px_rgba(22,163,74,0.24)]">
              <Landmark size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-[0.26em] text-green-700">
                Família Palmeirense
              </p>
              <h1 className="truncate text-[1.15rem] font-bold text-slate-900">
                Banco da Família
              </h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-green-600 text-white shadow-[0_10px_24px_rgba(22,163,74,0.22)]"
                      : "text-slate-700 hover:bg-white/70 hover:text-green-700"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-green-200/70 bg-white/60 px-4 py-2.5 text-sm font-semibold text-green-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-green-200/70 bg-white/70 text-slate-700 transition hover:bg-white md:hidden"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen ? (
          <div className="mt-4 border-t border-green-100/80 pt-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-green-600 text-white"
                        : "bg-white/60 text-slate-700 hover:bg-white hover:text-green-700"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-3 rounded-2xl border border-green-200/70 bg-white/60 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-white"
              >
                <LogOut size={18} />
                Sair
              </button>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
